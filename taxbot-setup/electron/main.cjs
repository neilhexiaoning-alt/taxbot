/**
 * OpenClaw Desktop - Electron Main Process
 */

const electron = require('electron');
const { app, BrowserWindow, Tray, Menu, nativeImage, ipcMain, shell, dialog } = electron;
const path = require('path');
const fs = require('fs');
const { spawn, exec, execSync } = require('child_process');
const net = require('net');

// Debug log file (appended, for diagnosing IPC calls)
const TAXYES_LOG = path.join(process.env.USERPROFILE || process.env.HOME || '.', '.openclaw', 'taxyes-debug.log');
function taxLog(msg) {
  const ts = new Date().toISOString();
  try { fs.appendFileSync(TAXYES_LOG, `[${ts}] ${msg}\n`); } catch (_) {}
}

// App configuration
const APP_CONFIG = {
  name: 'Taxbot',
  width: 1200,
  height: 800,
  gatewayPort: 18789,
};

// Global state
let mainWindow = null;
let tray = null;
let gatewayProcess = null;
let isQuitting = false;
let gatewayStatus = "stopped"; // stopped | starting | connected | error
let lastGatewayExitCode = null;
let gatewayProbeTimer = null;
let gatewayRestartCount = 0;
let gatewayLastStartTime = 0;
let gatewaySuppressAutoRestart = false; // set true during intentional stop/restart
const MAX_RESTARTS = 3;
const RESTART_WINDOW_MS = 60000; // Reset counter after 60s of stable running

/**
 * Read gateway token from openclaw.json
 */
function getGatewayToken() {
  try {
    const configPath = path.join(process.env.USERPROFILE || process.env.HOME || '', '.openclaw', 'openclaw.json');
    const raw = fs.readFileSync(configPath, 'utf-8');
    const config = JSON.parse(raw);
    return config?.gateway?.auth?.token || null;
  } catch (err) {
    console.warn('[Config] Failed to read gateway token:', err.message);
    return null;
  }
}

/**
 * Get app root path (handles both packaged and dev mode, asar and unpacked)
 */
function getAppRoot() {
  if (app.isPackaged) {
    const appPath = app.getAppPath();
    // If inside asar, return as-is (Electron resolves paths within asar)
    if (appPath.includes('app.asar')) return appPath;
  }
  // electron/main.cjs -> go up one level to project root
  return path.join(__dirname, '..');
}

/**
 * Get managed skills directory (~/.openclaw/skills/).
 * Custom/imported skills are saved here so the gateway loads them as "openclaw-managed"
 * source, bypassing the allowBundled filter that restricts bundled skills.
 */
function getManagedSkillsDir() {
  const dir = path.join(process.env.USERPROFILE || process.env.HOME || '', '.openclaw', 'skills');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

/**
 * Get unpacked root path (resolves app.asar to app.asar.unpacked when packaged)
 */
function getUnpackedRoot() {
  if (app.isPackaged) {
    const appPath = app.getAppPath();
    // If inside asar, use unpacked path instead
    if (appPath.includes('app.asar')) {
      return appPath.replace('app.asar', 'app.asar.unpacked');
    }
  }
  // electron/main.cjs -> go up one level to project root
  return path.join(__dirname, '..');
}

/**
 * Get app icon (NativeImage)
 */
function getAppIcon() {
  // Try extraResources/assets first, then ui/assets
  const candidates = app.isPackaged
    ? [
        path.join(process.resourcesPath, 'assets', 'icon.ico'),
        path.join(process.resourcesPath, 'assets', 'icon.png'),
      ]
    : [
        path.join(__dirname, '..', 'ui', 'assets', 'icon.ico'),
        path.join(__dirname, '..', 'ui', 'assets', 'icon.png'),
      ];
  for (const iconPath of candidates) {
    try {
      if (fs.existsSync(iconPath)) {
        const img = nativeImage.createFromPath(iconPath);
        if (!img.isEmpty()) return img;
      }
    } catch (_) { /* ignore */ }
  }
  return nativeImage.createEmpty();
}

/**
 * Create the main application window
 */
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: APP_CONFIG.width,
    height: APP_CONFIG.height,
    minWidth: 800,
    minHeight: 600,
    title: APP_CONFIG.name,
    icon: getAppIcon(),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
    },
    show: false,
    backgroundColor: '#E3F2FD',
    autoHideMenuBar: true,
  });

  // Remove the default menu bar (File, Edit, View, etc.)
  mainWindow.setMenuBarVisibility(false);

  // Load TaxChat UI (works inside asar since it's in appRoot)
  const appRoot = getAppRoot();
  const indexPath = path.join(appRoot, 'dist', 'control-ui', 'taxchat.html');
  mainWindow.loadFile(indexPath);

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Minimize to tray on close instead of quitting
  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Open external links in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

/**
 * Get gateway status display label
 */
function getGatewayStatusLabel() {
  switch (gatewayStatus) {
    case "connected":
      return "助理已就位";
    case "starting":
      return "助理准备中";
    case "error":
      return "助理异常";
    default:
      return "助理已下班";
  }
}

function setGatewayStatus(nextStatus) {
  if (gatewayStatus === nextStatus) {
    return;
  }
  gatewayStatus = nextStatus;
  updateTrayMenu();
}

function buildTrayMenu() {
  return Menu.buildFromTemplate([
    {
      label: "显示助理窗口",
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      },
    },
    { type: "separator" },
    {
      label: getGatewayStatusLabel(),
      enabled: false,
    },
    {
      label: "📞 呼叫个人助理",
      click: () => { restartGateway(); },
    },
    {
      label: "😴 让助理下班",
      click: () => { stopGateway(); },
    },
    { type: "separator" },
    {
      label: "开机自启动",
      type: "checkbox",
      checked: app.getLoginItemSettings().openAtLogin,
      click: (menuItem) => {
        app.setLoginItemSettings({ openAtLogin: menuItem.checked });
      },
    },
    { type: "separator" },
    {
      label: "退出",
      click: () => {
        isQuitting = true;
        app.quit();
      },
    },
  ]);
}

function updateTrayMenu() {
  if (!tray) {
    return;
  }
  tray.setContextMenu(buildTrayMenu());
}

function probeGatewayPort() {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    const timeout = setTimeout(() => {
      socket.destroy();
      resolve(false);
    }, 500);
    socket.once("error", () => {
      clearTimeout(timeout);
      socket.destroy();
      resolve(false);
    });
    socket.connect(APP_CONFIG.gatewayPort, "127.0.0.1", () => {
      clearTimeout(timeout);
      socket.destroy();
      resolve(true);
    });
  });
}

function startGatewayProbe() {
  if (gatewayProbeTimer) {
    clearInterval(gatewayProbeTimer);
  }
  gatewayProbeTimer = setInterval(async () => {
    const ok = await probeGatewayPort();
    if (ok) {
      setGatewayStatus("connected");
      return;
    }
    if (gatewayProcess) {
      setGatewayStatus("starting");
      return;
    }
    if (lastGatewayExitCode && lastGatewayExitCode !== 0) {
      setGatewayStatus("error");
      return;
    }
    setGatewayStatus("stopped");
  }, 2000);
}

function createTray() {
  const icon = getAppIcon();
  tray = new Tray(icon.isEmpty() ? nativeImage.createFromDataURL(
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAL0lEQVQ4T2P8z8DwHwMNACMDFQCjBoz6YDQMRsOA+mFAjTT4H4oLqJEIRw0AAAA//8DAB+pCBG5jH4uAAAAAElFTkSuQmCC'
  ) : icon);
  tray.setToolTip(APP_CONFIG.name);
  updateTrayMenu();

  tray.on('click', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
        mainWindow.focus();
      }
    }
  });
}

/**
 * Check if a port is already in use (by another application).
 * Returns true if port is occupied.
 */
function isPortOccupied(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', (err) => {
      resolve(err.code === 'EADDRINUSE');
    });
    server.once('listening', () => {
      server.close(() => resolve(false));
    });
    server.listen(port, '127.0.0.1');
  });
}

/**
 * Find a free port starting from the preferred port.
 */
async function findFreePort(preferred, maxAttempts = 10) {
  for (let i = 0; i < maxAttempts; i++) {
    const port = preferred + i;
    const occupied = await isPortOccupied(port);
    if (!occupied) return port;
    console.log(`[Gateway] Port ${port} is occupied, trying ${port + 1}...`);
  }
  return preferred; // fallback, let gateway handle the error
}

/**
 * Update the gateway port in openclaw.json config file.
 */
function updateConfigPort(newPort) {
  try {
    const configPath = path.join(process.env.USERPROFILE || process.env.HOME || '', '.openclaw', 'openclaw.json');
    const raw = fs.readFileSync(configPath, 'utf-8');
    const config = JSON.parse(raw);
    if (config.gateway && config.gateway.port !== newPort) {
      config.gateway.port = newPort;
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
      console.log(`[Gateway] Updated config port to ${newPort}`);
    }
  } catch (err) {
    console.warn('[Gateway] Failed to update config port:', err.message);
  }
}

/**
 * Start the Gateway service
 */
async function startGateway() {
  console.log('[Gateway] Starting...');
  gatewaySuppressAutoRestart = false; // re-enable auto-restart for this new process
  setGatewayStatus("starting");
  gatewayLastStartTime = Date.now();

  // Check for port conflicts before spawning
  const freePort = await findFreePort(APP_CONFIG.gatewayPort);
  if (freePort !== APP_CONFIG.gatewayPort) {
    console.log(`[Gateway] Port ${APP_CONFIG.gatewayPort} occupied, switching to ${freePort}`);
    APP_CONFIG.gatewayPort = freePort;
    updateConfigPort(freePort);
    // Notify UI about port change
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('gateway-port-changed', freePort);
    }
  }

  // Use unpacked root so Node.js can access files outside asar
  const projectRoot = getUnpackedRoot();

  // Ensure log directory exists for Gateway output
  const logDir = path.join(process.env.USERPROFILE || process.env.HOME || '', '.openclaw');
  try { if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true }); } catch (_) {}
  const logFile = path.join(logDir, 'gateway-electron.log');

  let scriptArgs;
  const hasSrcDir = fs.existsSync(path.join(projectRoot, 'src'));
  if (app.isPackaged || !hasSrcDir) {
    // Packaged or distribution mode: skip run-node.mjs (no TypeScript build needed)
    const entryPath = path.join(projectRoot, 'openclaw.mjs');
    scriptArgs = [entryPath, 'gateway', '--allow-unconfigured'];
    const mode = app.isPackaged ? 'Packaged' : 'Distribution';
    const info = `[${new Date().toISOString()}] ${mode} mode\n  execPath: ${process.execPath}\n  projectRoot: ${projectRoot}\n  entryPath: ${entryPath}\n  entryExists: ${fs.existsSync(entryPath)}\n`;
    try { fs.writeFileSync(logFile, info); } catch (_) {}
    console.log(`[Gateway] ${mode} mode, unpacked root:`, projectRoot);
  } else {
    // Dev mode with source: use run-node.mjs for auto-build
    const scriptPath = path.join(projectRoot, 'scripts', 'run-node.mjs');
    scriptArgs = [scriptPath, 'gateway', '--allow-unconfigured'];
    console.log('[Gateway] Dev mode, running via run-node.mjs');
  }

  gatewayProcess = spawn(process.execPath, scriptArgs, {
    cwd: projectRoot,
    env: {
      ...process.env,
      ELECTRON_RUN_AS_NODE: '1',
      OPENCLAW_SKIP_CHANNELS: '1',
      CLAWDBOT_SKIP_CHANNELS: '1',
      OPENCLAW_NO_RESPAWN: '1',
      TAXBOT_ROOT: projectRoot,
      PYTHONIOENCODING: 'utf-8',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
  });

  gatewayProcess.stdout.on('data', (data) => {
    const msg = data.toString().trim();
    console.log(`[Gateway] ${msg}`);
    try { fs.appendFileSync(logFile, `[stdout] ${msg}\n`); } catch (_) {}
  });

  gatewayProcess.stderr.on('data', (data) => {
    const msg = data.toString().trim();
    console.error(`[Gateway Error] ${msg}`);
    try { fs.appendFileSync(logFile, `[stderr] ${msg}\n`); } catch (_) {}
    // Forward errors to renderer for UI display
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('gateway-error', msg);
    }
  });

  gatewayProcess.on('error', (error) => {
    console.error('[Gateway] Failed to start:', error);
    lastGatewayExitCode = 1;
    setGatewayStatus("error");
    try { fs.appendFileSync(logFile, `[spawn-error] ${error.message}\n`); } catch (_) {}
  });

  gatewayProcess.on('exit', (code, signal) => {
    console.log(`[Gateway] Exited (code=${code}, signal=${signal})`);
    try { fs.appendFileSync(logFile, `[exit] code=${code} signal=${signal}\n`); } catch (_) {}
    gatewayProcess = null;
    lastGatewayExitCode = code;
    if (code && code !== 0) {
      setGatewayStatus("error");
    } else {
      setGatewayStatus("stopped");
    }
    // Auto-restart on non-zero exit (with limit to prevent infinite loops)
    // Skip auto-restart if we intentionally stopped the gateway (e.g. for restart)
    if (code !== 0 && !isQuitting && !gatewaySuppressAutoRestart) {
      const now = Date.now();
      // Reset counter if gateway ran stably for a while
      if (now - gatewayLastStartTime > RESTART_WINDOW_MS) {
        gatewayRestartCount = 0;
      }
      gatewayRestartCount++;
      if (gatewayRestartCount <= MAX_RESTARTS) {
        console.log(`[Gateway] Auto-restart ${gatewayRestartCount}/${MAX_RESTARTS} in 3s...`);
        setTimeout(() => startGateway(), 3000);
      } else {
        console.log(`[Gateway] Too many restarts (${gatewayRestartCount}), giving up. Use menu to restart manually.`);
        try { fs.appendFileSync(logFile, `[restart-limit] Stopped after ${gatewayRestartCount} restarts\n`); } catch (_) {}
      }
    }
  });
}

/**
 * Stop the Gateway service and wait for the process to fully exit.
 * Returns a Promise that resolves once the port is confirmed free.
 */
async function stopGateway() {
  gatewaySuppressAutoRestart = true;
  const pid = gatewayProcess ? gatewayProcess.pid : null;
  if (gatewayProcess) {
    console.log('[Gateway] Stopping...');
    gatewayProcess = null;
    setGatewayStatus("stopped");
  }

  // Kill by tracked PID (synchronous — waits for completion)
  if (process.platform === 'win32' && pid) {
    try {
      execSync(`taskkill /PID ${pid} /T /F`, { stdio: 'ignore', windowsHide: true, timeout: 5000 });
    } catch (_) { /* process may already be dead */ }
  } else if (pid) {
    try { process.kill(pid, 'SIGTERM'); } catch (_) { /* ignore */ }
  }

  // Also kill any process still holding the gateway port (covers orphan/stale PIDs)
  if (process.platform === 'win32') {
    try {
      const netstat = execSync(
        `netstat -ano | findstr :${APP_CONFIG.gatewayPort} | findstr LISTENING`,
        { encoding: 'utf-8', windowsHide: true, timeout: 5000 }
      );
      const pids = [...new Set(
        netstat.trim().split('\n')
          .map(line => line.trim().split(/\s+/).pop())
          .filter(p => p && p !== '0')
      )];
      for (const p of pids) {
        try { execSync(`taskkill /PID ${p} /T /F`, { stdio: 'ignore', windowsHide: true, timeout: 5000 }); } catch (_) {}
        console.log(`[Gateway] Killed orphan process on port ${APP_CONFIG.gatewayPort}, pid=${p}`);
      }
    } catch (_) { /* no process on port — OK */ }
  }

  // Wait for port to actually become free (up to 5s)
  const portFreeTimeout = 5000;
  const start = Date.now();
  while (Date.now() - start < portFreeTimeout) {
    const inUse = await new Promise(resolve => {
      const sock = new net.Socket();
      sock.once('connect', () => { sock.destroy(); resolve(true); });
      sock.once('error', () => resolve(false));
      sock.connect(APP_CONFIG.gatewayPort, '127.0.0.1');
    });
    if (!inUse) break;
    await new Promise(r => setTimeout(r, 300));
  }

  // Clean up stale lock file
  try {
    const crypto = require('crypto');
    const os = require('os');
    const stateDir = path.join(process.env.USERPROFILE || process.env.HOME || '', '.openclaw');
    const configPath = path.join(stateDir, 'openclaw.json');
    const hash = crypto.createHash('sha1').update(configPath).digest('hex').slice(0, 8);
    const lockPath = path.join(os.tmpdir(), 'openclaw', `gateway.${hash}.lock`);
    if (fs.existsSync(lockPath)) {
      fs.unlinkSync(lockPath);
      console.log('[Gateway] Cleaned up lock file');
    }
  } catch (_) { /* ignore */ }
}

/**
 * Stop then start the Gateway service. Awaits full process death before restarting.
 */
async function restartGateway() {
  gatewayRestartCount = 0;
  await stopGateway();
  startGateway();
}

// ============ App lifecycle ============

// Single instance lock: if already running, focus existing window and quit
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
    }
  });

  app.whenReady().then(() => {
    app.setName(APP_CONFIG.name);
    createMainWindow();
    createTray();
    startGateway();
    startGatewayProbe();
    startManagedSkillsWatcher();
    startGuiSignalWatcher();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
      } else if (mainWindow) {
        mainWindow.show();
      }
    });
  });
}

app.on('window-all-closed', () => {
  // Windows/Linux: keep app running in tray
});

app.on('before-quit', () => {
  isQuitting = true;
});

app.on('quit', () => {
  stopGateway();
});

// ============ IPC handlers ============

ipcMain.on('get-gateway-status', (event) => {
  event.reply('gateway-status', {
    running: gatewayProcess !== null,
    port: APP_CONFIG.gatewayPort,
  });
});

ipcMain.on('restart-gateway', () => { restartGateway(); });
ipcMain.on('stop-gateway', () => { stopGateway(); });
ipcMain.on('start-gateway', () => { startGateway(); });
ipcMain.on('quit-app', () => { isQuitting = true; app.quit(); });

ipcMain.handle('get-gateway-port', () => {
  return APP_CONFIG.gatewayPort;
});

ipcMain.handle('get-gateway-token', () => {
  return getGatewayToken();
});

ipcMain.handle('open-folder-dialog', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: '选择授权访问的文件夹',
  });
  if (result.canceled || result.filePaths.length === 0) return null;
  return result.filePaths[0];
});

const TEXT_EXTENSIONS = new Set([
  '.txt', '.md', '.csv', '.json', '.xml', '.html', '.htm', '.log',
  '.yml', '.yaml', '.ini', '.cfg', '.conf', '.tsv', '.sql',
]);
const IMAGE_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp', '.svg', '.tiff', '.tif',
]);
const DOC_EXTENSIONS = new Set([
  '.pptx', '.ppt', '.docx', '.doc', '.xlsx', '.xls', '.pdf',
]);
const ALL_EXTENSIONS = new Set([...TEXT_EXTENSIONS, ...IMAGE_EXTENSIONS, ...DOC_EXTENSIONS]);
const MAX_TEXT_FILE_SIZE = 512 * 1024; // 512 KB per text file

function classifyExt(ext) {
  if (TEXT_EXTENSIONS.has(ext)) return 'text';
  if (IMAGE_EXTENSIONS.has(ext)) return 'image';
  if (DOC_EXTENSIONS.has(ext)) return 'doc';
  return null;
}

function importFolderToMemorySync(folderPath) {
  if (!folderPath || !fs.existsSync(folderPath)) {
    return { ok: false, error: '文件夹不存在' };
  }
  const stat = fs.statSync(folderPath);
  if (!stat.isDirectory()) {
    return { ok: false, error: '路径不是文件夹' };
  }

  // Resolve workspace memory dir
  const homeDir = process.env.USERPROFILE || process.env.HOME || '';
  const workspaceDir = path.join(homeDir, '.openclaw', 'workspace');
  const memoryDir = path.join(workspaceDir, 'memory');
  if (!fs.existsSync(memoryDir)) {
    fs.mkdirSync(memoryDir, { recursive: true });
  }

  // Remove old authorized-folder memory files
  const existing = fs.readdirSync(memoryDir);
  for (const f of existing) {
    if (f.startsWith('authorized-')) {
      try { fs.unlinkSync(path.join(memoryDir, f)); } catch (_) {}
    }
  }

  // Collect files recursively (all subdirectories)
  const files = [];
  function scanDir(dir) {
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (_) { return; }
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (ALL_EXTENSIONS.has(ext)) {
          files.push({ path: fullPath, ext });
        }
      } else if (entry.isDirectory()) {
        scanDir(fullPath);
      }
    }
  }
  scanDir(folderPath);

  if (files.length === 0) {
    return { ok: true, textCount: 0, imageCount: 0, docCount: 0, folderPath, message: '未找到可读取的文件' };
  }

  // Write each file as a memory entry
  let textCount = 0, imageCount = 0, docCount = 0;
  const now = new Date().toISOString();
  for (const file of files) {
    try {
      const relPath = path.relative(folderPath, file.path);
      const safeName = relPath.replace(/[\\/]/g, '_').replace(/[^a-zA-Z0-9_.\u4e00-\u9fff-]/g, '_');
      const memoryFileName = `authorized-${safeName}.md`;
      const category = classifyExt(file.ext);

      let memoryContent;
      if (category === 'text') {
        const fileStat = fs.statSync(file.path);
        if (fileStat.size > MAX_TEXT_FILE_SIZE) continue;
        const content = fs.readFileSync(file.path, 'utf-8');
        memoryContent = [
          '---',
          'source: authorized-folder',
          `folder: ${folderPath}`,
          `file: ${relPath}`,
          `type: text`,
          `imported: ${now}`,
          '---',
          '',
          `# ${relPath}`,
          '',
          content,
        ].join('\n');
        textCount++;
      } else {
        // image / doc: record path so agent knows it exists
        const typeLabel = category === 'image' ? '图片' : '文档';
        memoryContent = [
          '---',
          'source: authorized-folder',
          `folder: ${folderPath}`,
          `file: ${relPath}`,
          `type: ${category}`,
          `imported: ${now}`,
          '---',
          '',
          `# ${relPath}`,
          '',
          `[${typeLabel}文件] 路径: ${file.path}`,
        ].join('\n');
        if (category === 'image') imageCount++;
        else docCount++;
      }

      fs.writeFileSync(path.join(memoryDir, memoryFileName), memoryContent, 'utf-8');
    } catch (_) { /* skip unreadable files */ }
  }

  // Build file listing grouped by category for MEMORY.md
  const textFiles = [], imageFiles = [], docFiles = [];
  for (const file of files) {
    const relPath = path.relative(folderPath, file.path);
    const category = classifyExt(file.ext);
    if (category === 'text') textFiles.push(relPath);
    else if (category === 'image') imageFiles.push(relPath);
    else if (category === 'doc') docFiles.push(relPath);
  }

  // Write/update TOOLS.md in workspace root so agent auto-loads the info
  // (TOOLS.md is auto-embedded in agent system prompt; MEMORY.md requires explicit tool calls)
  const memoryMdPath = path.join(workspaceDir, 'TOOLS.md');
  let existingMemory = '';
  try { existingMemory = fs.readFileSync(memoryMdPath, 'utf-8'); } catch (_) {}

  // Remove old authorized folder section if present
  const sectionMarkerStart = '<!-- authorized-folder-start -->';
  const sectionMarkerEnd = '<!-- authorized-folder-end -->';
  const startIdx = existingMemory.indexOf(sectionMarkerStart);
  const endIdx = existingMemory.indexOf(sectionMarkerEnd);
  if (startIdx !== -1 && endIdx !== -1) {
    existingMemory = existingMemory.slice(0, startIdx).trimEnd() + '\n\n' + existingMemory.slice(endIdx + sectionMarkerEnd.length).trimStart();
  }
  existingMemory = existingMemory.trim();

  const sectionLines = [
    sectionMarkerStart,
    '## 用户授权文件夹',
    '',
    '用户已授权访问以下文件夹，其中的文件内容已导入到 memory/ 目录中。',
    '当用户询问授权文件夹相关内容时，使用 memory_search 工具搜索 "authorized-folder" 或文件名关键词。',
    '',
    `- **文件夹路径**: \`${folderPath}\``,
    `- **导入时间**: ${now}`,
    `- **文件统计**: 文本 ${textCount}、图片 ${imageCount}、文档 ${docCount}`,
    '',
    '### 文件列表',
    '',
  ];
  if (textFiles.length > 0) {
    sectionLines.push('**文本文件** (内容已完整导入到 memory/):');
    for (const f of textFiles) sectionLines.push(`- ${f}`);
    sectionLines.push('');
  }
  if (imageFiles.length > 0) {
    sectionLines.push('**图片文件** (路径已记录到 memory/):');
    for (const f of imageFiles) sectionLines.push(`- ${f}`);
    sectionLines.push('');
  }
  if (docFiles.length > 0) {
    sectionLines.push('**文档文件** (路径已记录到 memory/):');
    for (const f of docFiles) sectionLines.push(`- ${f}`);
    sectionLines.push('');
  }
  sectionLines.push(sectionMarkerEnd);

  const newMemory = existingMemory
    ? existingMemory + '\n\n' + sectionLines.join('\n')
    : '# TOOLS.md - Local Notes\n\n' + sectionLines.join('\n');
  fs.writeFileSync(memoryMdPath, newMemory, 'utf-8');

  return { ok: true, textCount, imageCount, docCount, folderPath };
}

ipcMain.handle('import-folder-to-memory', async (_event, folderPath) => {
  try {
    return importFolderToMemorySync(folderPath);
  } catch (err) {
    return { ok: false, error: err.message };
  }
});

// ============ 读取已导入的文件夹知识 ============
const MAX_KNOWLEDGE_CHARS = 8000; // 限制注入内容总长度

ipcMain.handle('get-folder-knowledge', async () => {
  try {
    const homeDir = process.env.USERPROFILE || process.env.HOME || '';
    const memoryDir = path.join(homeDir, '.openclaw', 'workspace', 'memory');
    if (!fs.existsSync(memoryDir)) return { ok: true, content: '', files: [] };

    const entries = fs.readdirSync(memoryDir).filter(f => f.startsWith('authorized-') && f.endsWith('.md'));
    if (entries.length === 0) return { ok: true, content: '', files: [] };

    const files = [];
    const contentParts = [];
    let totalChars = 0;

    for (const entry of entries) {
      const filePath = path.join(memoryDir, entry);
      try {
        const raw = fs.readFileSync(filePath, 'utf-8');
        // Parse frontmatter to get file info
        const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
        if (!fmMatch) continue;
        const body = fmMatch[2].trim();
        const fileMatch = raw.match(/^file:\s*(.+)$/m);
        const typeMatch = raw.match(/^type:\s*(.+)$/m);
        const relFile = fileMatch ? fileMatch[1].trim() : entry;
        const fileType = typeMatch ? typeMatch[1].trim() : 'text';

        files.push({ name: relFile, type: fileType });

        if (fileType === 'text') {
          // Extract actual content (skip the "# filename" header line)
          const lines = body.split('\n');
          const contentStart = lines.findIndex(l => l.startsWith('# '));
          const fileContent = contentStart >= 0 ? lines.slice(contentStart + 1).join('\n').trim() : body;

          if (totalChars + fileContent.length <= MAX_KNOWLEDGE_CHARS) {
            contentParts.push(`【${relFile}】\n${fileContent}`);
            totalChars += fileContent.length;
          } else {
            const remaining = MAX_KNOWLEDGE_CHARS - totalChars;
            if (remaining > 200) {
              contentParts.push(`【${relFile}】（截取前${remaining}字）\n${fileContent.substring(0, remaining)}...`);
              totalChars = MAX_KNOWLEDGE_CHARS;
            }
            break;
          }
        } else {
          contentParts.push(`【${relFile}】[${fileType === 'image' ? '图片' : '文档'}文件]`);
        }
      } catch (_) { /* skip unreadable */ }
    }

    return { ok: true, content: contentParts.join('\n\n'), files };
  } catch (err) {
    return { ok: false, content: '', files: [], error: err.message };
  }
});

// ============ 知识库文件管理 ============

ipcMain.handle('list-knowledge-files', async (_event, folderPath) => {
  try {
    if (!folderPath || !fs.existsSync(folderPath)) {
      return { ok: false, files: [], error: '文件夹不存在' };
    }
    const files = [];
    function scan(dir) {
      let entries;
      try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (_) { return; }
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          if (ALL_EXTENSIONS.has(ext)) {
            try {
              const st = fs.statSync(fullPath);
              files.push({
                name: path.relative(folderPath, fullPath),
                size: st.size,
                ext,
                type: classifyExt(ext) || 'text',
                mtime: st.mtimeMs,
              });
            } catch (_) {}
          }
        } else if (entry.isDirectory()) {
          scan(fullPath);
        }
      }
    }
    scan(folderPath);
    return { ok: true, files };
  } catch (err) {
    return { ok: false, files: [], error: err.message };
  }
});

ipcMain.handle('copy-to-knowledge-folder', async (_event, { folderPath, fileName, base64Data }) => {
  try {
    if (!folderPath || !fs.existsSync(folderPath)) {
      return { ok: false, error: '授权文件夹不存在' };
    }
    const destPath = path.join(folderPath, fileName);
    // Prevent path traversal
    if (!destPath.startsWith(folderPath)) {
      return { ok: false, error: '非法文件路径' };
    }
    const buf = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(destPath, buf);
    // Re-import folder to memory
    importFolderToMemorySync(folderPath);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
});

ipcMain.handle('delete-knowledge-file', async (_event, { folderPath, fileName }) => {
  try {
    if (!folderPath || !fileName) return { ok: false, error: '参数缺失' };
    const filePath = path.join(folderPath, fileName);
    // Prevent path traversal
    if (!filePath.startsWith(folderPath)) {
      return { ok: false, error: '非法文件路径' };
    }
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    // Remove corresponding memory file
    const homeDir = process.env.USERPROFILE || process.env.HOME || '';
    const memoryDir = path.join(homeDir, '.openclaw', 'workspace', 'memory');
    const safeName = fileName.replace(/[\\/]/g, '_').replace(/[^a-zA-Z0-9_.\u4e00-\u9fff-]/g, '_');
    const memFile = path.join(memoryDir, `authorized-${safeName}.md`);
    if (fs.existsSync(memFile)) {
      fs.unlinkSync(memFile);
    }
    // Re-import to update TOOLS.md
    importFolderToMemorySync(folderPath);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
});

ipcMain.handle('read-knowledge-file', async (_event, fileName) => {
  try {
    const homeDir = process.env.USERPROFILE || process.env.HOME || '';
    const memoryDir = path.join(homeDir, '.openclaw', 'workspace', 'memory');
    const safeName = fileName.replace(/[\\/]/g, '_').replace(/[^a-zA-Z0-9_.\u4e00-\u9fff-]/g, '_');
    const memFile = path.join(memoryDir, `authorized-${safeName}.md`);
    if (!fs.existsSync(memFile)) {
      return { ok: false, content: '', error: '文件未找到' };
    }
    const raw = fs.readFileSync(memFile, 'utf-8');
    const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    const body = fmMatch ? fmMatch[2].trim() : raw;
    // Skip the "# filename" header
    const lines = body.split('\n');
    const contentStart = lines.findIndex(l => l.startsWith('# '));
    const content = contentStart >= 0 ? lines.slice(contentStart + 1).join('\n').trim() : body;
    return { ok: true, content };
  } catch (err) {
    return { ok: false, content: '', error: err.message };
  }
});

// ============ 授权文件夹守护进程 (File Watcher) ============

let folderWatcher = null;
let watchDebounceTimer = null;
const WATCH_DEBOUNCE_MS = 3000; // 3秒去抖，等待批量文件写入完成

function startFolderWatcher(folderPath) {
  stopFolderWatcher();
  if (!folderPath || !fs.existsSync(folderPath)) return;

  taxLog(`Starting folder watcher: ${folderPath}`);

  // 记录当前已知文件集合
  const knownFiles = new Set();
  function scanKnown(dir) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          if (ALL_EXTENSIONS.has(ext)) knownFiles.add(fullPath);
        } else if (entry.isDirectory()) {
          scanKnown(fullPath);
        }
      }
    } catch (_) {}
  }
  scanKnown(folderPath);

  try {
    folderWatcher = fs.watch(folderPath, { recursive: true }, (eventType, filename) => {
      if (!filename) return;
      // 去抖：等待文件写入完成
      if (watchDebounceTimer) clearTimeout(watchDebounceTimer);
      watchDebounceTimer = setTimeout(() => {
        processNewFiles(folderPath, knownFiles);
      }, WATCH_DEBOUNCE_MS);
    });

    folderWatcher.on('error', (err) => {
      taxLog(`Folder watcher error: ${err.message}`);
    });
  } catch (err) {
    taxLog(`Failed to start folder watcher: ${err.message}`);
  }
}

function stopFolderWatcher() {
  if (folderWatcher) {
    folderWatcher.close();
    folderWatcher = null;
  }
  if (watchDebounceTimer) {
    clearTimeout(watchDebounceTimer);
    watchDebounceTimer = null;
  }
}

function processNewFiles(folderPath, knownFiles) {
  const homeDir = process.env.USERPROFILE || process.env.HOME || '';
  const memoryDir = path.join(homeDir, '.openclaw', 'workspace', 'memory');
  if (!fs.existsSync(memoryDir)) {
    fs.mkdirSync(memoryDir, { recursive: true });
  }

  // 扫描当前所有文件
  const currentFiles = [];
  function scanDir(dir) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          if (ALL_EXTENSIONS.has(ext)) currentFiles.push({ path: fullPath, ext });
        } else if (entry.isDirectory()) {
          scanDir(fullPath);
        }
      }
    } catch (_) {}
  }
  scanDir(folderPath);

  // 找出新增文件
  const newFiles = currentFiles.filter(f => !knownFiles.has(f.path));
  if (newFiles.length === 0) return;

  taxLog(`Folder watcher detected ${newFiles.length} new file(s)`);

  const now = new Date().toISOString();
  const importedNames = [];

  for (const file of newFiles) {
    try {
      const relPath = path.relative(folderPath, file.path);
      const safeName = relPath.replace(/[\\/]/g, '_').replace(/[^a-zA-Z0-9_.\u4e00-\u9fff-]/g, '_');
      const memoryFileName = `authorized-${safeName}.md`;
      const category = classifyExt(file.ext);

      let memoryContent;
      if (category === 'text') {
        const fileStat = fs.statSync(file.path);
        if (fileStat.size > MAX_TEXT_FILE_SIZE) continue;
        const content = fs.readFileSync(file.path, 'utf-8');
        memoryContent = [
          '---',
          'source: authorized-folder',
          `folder: ${folderPath}`,
          `file: ${relPath}`,
          `type: text`,
          `imported: ${now}`,
          '---',
          '',
          `# ${relPath}`,
          '',
          content,
        ].join('\n');
      } else {
        const typeLabel = category === 'image' ? '图片' : '文档';
        memoryContent = [
          '---',
          'source: authorized-folder',
          `folder: ${folderPath}`,
          `file: ${relPath}`,
          `type: ${category}`,
          `imported: ${now}`,
          '---',
          '',
          `# ${relPath}`,
          '',
          `[${typeLabel}文件] 路径: ${file.path}`,
        ].join('\n');
      }

      fs.writeFileSync(path.join(memoryDir, memoryFileName), memoryContent, 'utf-8');
      knownFiles.add(file.path);
      importedNames.push(relPath);
      taxLog(`Watcher imported: ${relPath}`);
    } catch (err) {
      taxLog(`Watcher import error for ${file.path}: ${err.message}`);
    }
  }

  if (importedNames.length > 0 && mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('folder-knowledge-updated', {
      newFiles: importedNames,
      count: importedNames.length,
    });
  }
}

// 启动/停止 watcher 的 IPC
ipcMain.handle('start-folder-watcher', async (_event, folderPath) => {
  startFolderWatcher(folderPath);
  return { ok: true };
});

ipcMain.handle('stop-folder-watcher', async () => {
  stopFolderWatcher();
  return { ok: true };
});

// ============ 自定义 Skill 文件管理 ============

// Clear cached skillsSnapshot from sessions.json to force rebuild on next gateway run
function clearSkillsSnapshot() {
  try {
    const sessionsFile = path.join(process.env.USERPROFILE || process.env.HOME || '', '.openclaw', 'agents', 'main', 'sessions', 'sessions.json');
    if (!fs.existsSync(sessionsFile)) return;
    let raw = fs.readFileSync(sessionsFile, 'utf-8');
    if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
    const sessions = JSON.parse(raw);
    let changed = false;
    for (const key of Object.keys(sessions)) {
      if (sessions[key]?.skillsSnapshot) {
        delete sessions[key].skillsSnapshot;
        changed = true;
      }
    }
    if (changed) {
      fs.writeFileSync(sessionsFile, JSON.stringify(sessions, null, 2), 'utf-8');
      taxLog('Cleared skillsSnapshot from sessions.json');
    }
  } catch (err) {
    taxLog(`Warning: failed to clear skillsSnapshot: ${err.message}`);
  }
}

// ========================================
// Sync favorites to memory file
// ========================================
ipcMain.handle('sync-favorites-to-memory', async (_event, favorites) => {
  try {
    const workspaceDir = path.join(process.env.USERPROFILE || process.env.HOME || '', '.openclaw', 'workspace');
    const memoryDir = path.join(workspaceDir, 'memory');
    fs.mkdirSync(memoryDir, { recursive: true });
    const favFile = path.join(memoryDir, 'favorites.md');

    if (!Array.isArray(favorites) || favorites.length === 0) {
      // No favorites — remove the file if it exists
      try { fs.unlinkSync(favFile); } catch (_) {}
      return { ok: true, count: 0 };
    }

    // Build markdown content
    const lines = ['# 用户收藏的对话记录\n'];
    lines.push('以下是用户标记为收藏的重要对话内容。当用户要求回忆、查看收藏时，引用这些内容。\n');

    for (const fav of favorites) {
      const date = new Date(fav.timestamp).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
      lines.push(`## ${date}\n`);
      if (fav.question) {
        lines.push(`**用户提问**: ${fav.question}\n`);
      }
      lines.push(`**回复**:\n${fav.text}\n`);
      lines.push('---\n');
    }

    fs.writeFileSync(favFile, lines.join('\n'), 'utf-8');
    taxLog(`Synced ${favorites.length} favorites to memory`);
    return { ok: true, count: favorites.length };
  } catch (err) {
    taxLog(`sync-favorites-to-memory error: ${err.message}`);
    return { ok: false, error: err.message };
  }
});

// Save agent avatar to workspace directory so it survives config resets
ipcMain.handle('save-agent-avatar', async (_event, { agentId, avatarDataUrl }) => {
  try {
    const openclawDir = path.join(process.env.USERPROFILE || process.env.HOME || '', '.openclaw');
    const wsDir = path.join(openclawDir, `workspace-${agentId}`);
    fs.mkdirSync(wsDir, { recursive: true });
    const avatarPath = path.join(wsDir, 'avatar.txt');
    if (avatarDataUrl) {
      fs.writeFileSync(avatarPath, avatarDataUrl, 'utf-8');
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
});

// Sync agent directory to main workspace AGENTS.md
ipcMain.handle('sync-agents-to-main-workspace', async (_event, { agents }) => {
  try {
    const workspaceDir = path.join(process.env.USERPROFILE || process.env.HOME || '', '.openclaw', 'workspace');
    fs.mkdirSync(workspaceDir, { recursive: true });
    const agentsMdPath = path.join(workspaceDir, 'AGENTS.md');

    // Read existing content (preserve user-written sections)
    let existing = '';
    try { existing = fs.readFileSync(agentsMdPath, 'utf-8'); } catch (_) {}

    // Remove old auto-generated agent directory section
    const marker = '## 可用的智能体';
    const markerIdx = existing.indexOf(marker);
    if (markerIdx >= 0) {
      existing = existing.substring(0, markerIdx).trimEnd();
    }

    // Build new section
    const nonDefault = (agents || []).filter(a => !a.isDefault);
    if (nonDefault.length === 0) {
      // No agents to list — just keep existing content
      if (existing.trim()) {
        fs.writeFileSync(agentsMdPath, existing.trim() + '\n', 'utf-8');
      }
      return { ok: true };
    }

    const lines = [`\n\n${marker}\n`];
    lines.push('以下是当前系统中可用的智能体，你可以在回复中提及它们的名称来建议用户向它们提问。\n');
    for (const a of nonDefault) {
      const emoji = a.emoji || '🤖';
      const desc = a.description ? `：${a.description}` : '';
      lines.push(`- **${emoji} ${a.name}**${desc}`);
    }

    const finalContent = (existing.trim() ? existing.trim() : '# AGENTS.md') + '\n' + lines.join('\n') + '\n';
    fs.writeFileSync(agentsMdPath, finalContent, 'utf-8');
    taxLog(`Synced ${nonDefault.length} agents to main workspace AGENTS.md`);
    return { ok: true };
  } catch (err) {
    taxLog(`sync-agents-to-main-workspace error: ${err.message}`);
    return { ok: false, error: err.message };
  }
});

// Recover agent identities from workspace IDENTITY.md files
// Used when openclaw.json was overwritten and agents.list is missing
ipcMain.handle('recover-agent-identities', async () => {
  try {
    const openclawDir = path.join(process.env.USERPROFILE || process.env.HOME || '', '.openclaw');
    const entries = fs.readdirSync(openclawDir, { withFileTypes: true });
    const agents = [];
    for (const entry of entries) {
      if (!entry.isDirectory() || !entry.name.startsWith('workspace-agent-')) continue;
      const agentId = entry.name.replace('workspace-', '');
      const identityPath = path.join(openclawDir, entry.name, 'IDENTITY.md');
      if (!fs.existsSync(identityPath)) continue;
      const content = fs.readFileSync(identityPath, 'utf-8');
      // Parse name and emoji from IDENTITY.md
      let name = agentId;
      let emoji = '🤖';
      let description = '';
      const nameMatch = content.match(/^-\s*name:\s*(.+)/m);
      if (nameMatch) name = nameMatch[1].trim();
      const emojiMatch = content.match(/^-\s*emoji:\s*(.+)/m);
      if (emojiMatch) emoji = emojiMatch[1].trim();
      // Try to get description from SOUL.md
      const soulPath = path.join(openclawDir, entry.name, 'SOUL.md');
      if (fs.existsSync(soulPath)) {
        const soulContent = fs.readFileSync(soulPath, 'utf-8');
        // First non-empty line that isn't a heading or yaml-like
        const descLines = soulContent.split('\n').filter(l => l.trim() && !l.startsWith('#') && !l.startsWith('-'));
        if (descLines.length > 0) description = descLines[0].trim();
      }
      // Try to recover avatar from avatar.txt
      let avatarUrl = '';
      const avatarPath = path.join(openclawDir, entry.name, 'avatar.txt');
      if (fs.existsSync(avatarPath)) {
        try { avatarUrl = fs.readFileSync(avatarPath, 'utf-8').trim(); } catch (_) {}
      }
      agents.push({ id: agentId, name, emoji, description, avatarUrl });
    }
    taxLog(`Recovered ${agents.length} agent identities from workspace dirs`);
    return { ok: true, agents };
  } catch (err) {
    taxLog(`recover-agent-identities error: ${err.message}`);
    return { ok: false, agents: [], error: err.message };
  }
});

// Helper: write TOOLS.md with selected skills
function writeAgentToolsMd(wsDir, skills) {
  let content = '# TOOLS.md - 可用技能\n\n';
  if (!skills || skills.length === 0) {
    content += '当前未配置专用技能。\n';
  } else {
    content += '以下是该智能体可使用的技能，处理用户任务时请参考对应技能的指引。\n\n';
    for (const sk of skills) {
      content += `## ${sk.emoji} ${sk.name}\n\n`;
      if (sk.description) content += `${sk.description}\n\n`;
      content += `### 使用指引\n\n${sk.prompt}\n\n---\n\n`;
    }
  }
  fs.writeFileSync(path.join(wsDir, 'TOOLS.md'), content.trimEnd() + '\n', 'utf-8');
}

// Create agent workspace directory with IDENTITY.md and SOUL.md
ipcMain.handle('create-agent-workspace', async (_event, { agentId, name, emoji, description, identityDesc, expertise, selectedSkills }) => {
  try {
    const openclawDir = path.join(process.env.USERPROFILE || process.env.HOME || '', '.openclaw');
    const wsDir = path.join(openclawDir, `workspace-${agentId}`);
    if (!fs.existsSync(wsDir)) fs.mkdirSync(wsDir, { recursive: true });

    // Write IDENTITY.md
    const identityContent = `- name: ${name}\n- emoji: ${emoji || '🤖'}\n\n${description || ''}\n`.trimEnd() + '\n';
    fs.writeFileSync(path.join(wsDir, 'IDENTITY.md'), identityContent, 'utf-8');

    // Write SOUL.md with identity description and expertise
    let soulContent = `# ${name}\n\n`;
    if (identityDesc) soulContent += `${identityDesc}\n\n`;
    if (expertise) soulContent += `## 专业领域\n\n${expertise}\n`;
    fs.writeFileSync(path.join(wsDir, 'SOUL.md'), soulContent, 'utf-8');

    // Write TOOLS.md with selected skills
    writeAgentToolsMd(wsDir, selectedSkills || []);

    taxLog(`Created workspace for agent ${agentId} (${name})`);
    return { ok: true };
  } catch (err) {
    taxLog(`create-agent-workspace error: ${err.message}`);
    return { ok: false, error: err.message };
  }
});

// Update agent workspace files
ipcMain.handle('update-agent-workspace', async (_event, { agentId, name, emoji, description, identityDesc, expertise, selectedSkills }) => {
  try {
    const openclawDir = path.join(process.env.USERPROFILE || process.env.HOME || '', '.openclaw');
    const wsDir = path.join(openclawDir, `workspace-${agentId}`);
    if (!fs.existsSync(wsDir)) fs.mkdirSync(wsDir, { recursive: true });

    // Update IDENTITY.md
    const identityContent = `- name: ${name}\n- emoji: ${emoji || '🤖'}\n\n${description || ''}\n`.trimEnd() + '\n';
    fs.writeFileSync(path.join(wsDir, 'IDENTITY.md'), identityContent, 'utf-8');

    // Update SOUL.md
    let soulContent = `# ${name}\n\n`;
    if (identityDesc) soulContent += `${identityDesc}\n\n`;
    if (expertise) soulContent += `## 专业领域\n\n${expertise}\n`;
    fs.writeFileSync(path.join(wsDir, 'SOUL.md'), soulContent, 'utf-8');

    // Update TOOLS.md with selected skills
    writeAgentToolsMd(wsDir, selectedSkills || []);

    taxLog(`Updated workspace for agent ${agentId} (${name})`);
    return { ok: true };
  } catch (err) {
    taxLog(`update-agent-workspace error: ${err.message}`);
    return { ok: false, error: err.message };
  }
});

// Read agent workspace files for editing
ipcMain.handle('read-agent-workspace', async (_event, { agentId }) => {
  try {
    const openclawDir = path.join(process.env.USERPROFILE || process.env.HOME || '', '.openclaw');
    const wsDir = path.join(openclawDir, `workspace-${agentId}`);
    if (!fs.existsSync(wsDir)) return { ok: false, error: 'workspace not found' };

    let description = '';
    let identityDesc = '';
    let expertise = '';

    // Read IDENTITY.md for description (lines after the yaml-like header)
    const identityPath = path.join(wsDir, 'IDENTITY.md');
    if (fs.existsSync(identityPath)) {
      const content = fs.readFileSync(identityPath, 'utf-8');
      const lines = content.split('\n');
      const descLines = lines.filter(l => l.trim() && !l.match(/^-\s*(name|emoji):/));
      if (descLines.length > 0) description = descLines.join('\n').trim();
    }

    // Read SOUL.md for identityDesc and expertise
    const soulPath = path.join(wsDir, 'SOUL.md');
    if (fs.existsSync(soulPath)) {
      const content = fs.readFileSync(soulPath, 'utf-8');
      // Split by "## 专业领域" section
      const expertiseMatch = content.match(/##\s*专业领域\s*\n([\s\S]*)/);
      if (expertiseMatch) {
        expertise = expertiseMatch[1].trim();
      }
      // Everything between the first heading and the expertise section is identityDesc
      const beforeExpertise = expertiseMatch
        ? content.substring(0, content.indexOf(expertiseMatch[0]))
        : content;
      const descLines = beforeExpertise.split('\n').filter(l => l.trim() && !l.startsWith('#'));
      if (descLines.length > 0) identityDesc = descLines.join('\n').trim();
    }

    // Read TOOLS.md to extract skill names
    let toolsSkillNames = [];
    const toolsPath = path.join(wsDir, 'TOOLS.md');
    if (fs.existsSync(toolsPath)) {
      const toolsContent = fs.readFileSync(toolsPath, 'utf-8');
      // Extract skill names from "## emoji name" headings
      const headings = toolsContent.match(/^## .+ (.+)$/gm);
      if (headings) {
        toolsSkillNames = headings.map(h => h.replace(/^## .+ /, '').trim());
      }
    }

    return { ok: true, description, identityDesc, expertise, toolsSkillNames };
  } catch (err) {
    taxLog(`read-agent-workspace error: ${err.message}`);
    return { ok: false, error: err.message };
  }
});

// Delete agent workspace folder (called when agent is deleted)
ipcMain.handle('delete-agent-workspace', async (_event, { agentId }) => {
  try {
    const openclawDir = path.join(process.env.USERPROFILE || process.env.HOME || '', '.openclaw');
    const wsDir = path.join(openclawDir, `workspace-${agentId}`);
    if (fs.existsSync(wsDir)) {
      fs.rmSync(wsDir, { recursive: true, force: true });
      taxLog(`Deleted workspace for agent ${agentId}`);
    }
    return { ok: true };
  } catch (err) {
    taxLog(`delete-agent-workspace error: ${err.message}`);
    return { ok: false, error: err.message };
  }
});

// ─── Agent Memory Persistence ───

ipcMain.handle('read-agent-memory', async (_event, { agentId }) => {
  try {
    const openclawDir = path.join(process.env.USERPROFILE || process.env.HOME || '', '.openclaw');
    const memPath = path.join(openclawDir, `workspace-${agentId}`, 'MEMORY.md');
    if (fs.existsSync(memPath)) {
      const content = fs.readFileSync(memPath, 'utf-8');
      return { ok: true, content };
    }
    return { ok: true, content: '' };
  } catch (err) {
    taxLog(`read-agent-memory error: ${err.message}`);
    return { ok: false, content: '', error: err.message };
  }
});

ipcMain.handle('write-agent-memory', async (_event, { agentId, content }) => {
  try {
    const openclawDir = path.join(process.env.USERPROFILE || process.env.HOME || '', '.openclaw');
    const wsDir = path.join(openclawDir, `workspace-${agentId}`);
    if (!fs.existsSync(wsDir)) {
      fs.mkdirSync(wsDir, { recursive: true });
    }
    fs.writeFileSync(path.join(wsDir, 'MEMORY.md'), content, 'utf-8');
    taxLog(`Wrote MEMORY.md for agent ${agentId} (${content.length} chars)`);
    return { ok: true };
  } catch (err) {
    taxLog(`write-agent-memory error: ${err.message}`);
    return { ok: false, error: err.message };
  }
});

// Generate ASCII-only folder name from skill id (first 8 chars of UUID)
function skillFolderName(id) {
  return `custom-${id.substring(0, 8)}`;
}

ipcMain.handle('save-custom-skill', async (_event, { id, name, emoji, description, prompt }) => {
  try {
    const skillsDir = getManagedSkillsDir();
    const folderName = skillFolderName(id);
    const skillFolder = path.join(skillsDir, folderName);

    // Clean up any old name-based folders (migration from previous naming)
    try {
      const entries = fs.readdirSync(skillsDir);
      for (const entry of entries) {
        // Remove folders with Chinese chars or old naming that don't match current id-based pattern
        if (entry !== folderName && (entry.includes('\u4e00') || entry.match(/^custom-[a-f0-9]{8}-/))) {
          const fullPath = path.join(skillsDir, entry);
          if (fs.statSync(fullPath).isDirectory() && fs.existsSync(path.join(fullPath, 'SKILL.md'))) {
            // Only remove if it looks like a custom skill (not built-in)
            const content = fs.readFileSync(path.join(fullPath, 'SKILL.md'), 'utf-8');
            if (content.includes('禁止调用任何工具或技能')) {
              fs.rmSync(fullPath, { recursive: true, force: true });
              taxLog(`Cleaned up old skill folder: ${entry}`);
            }
          }
        }
      }
    } catch (_) {}

    // Create folder if not exists
    if (!fs.existsSync(skillFolder)) {
      fs.mkdirSync(skillFolder, { recursive: true });
    }

    // Generate SKILL.md content (name field must be ASCII-safe for gateway matching)
    // Sanitize description for YAML: collapse newlines, escape quotes, wrap in double quotes
    const rawDesc = (description || name).replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim();
    const yamlDesc = '"' + rawDesc.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
    const skillMd = `---
name: ${folderName}
description: ${yamlDesc}
metadata:
  {
    "openclaw":
      {
        "emoji": "${emoji || '🤖'}",
        "os": ["win32", "darwin", "linux"]
      }
  }
---

# ${name}

你是一个专业的AI助手。请按照以下操作流程执行任务。

## 重要约束

- **禁止调用任何工具或技能**：不要调用 healthcheck、sessions_spawn、bash、agents_list 或任何其他工具/命令。本技能是纯文本分析，所有输出直接以文字形式回复用户。
- **不要生成代码块中的命令**：不要输出任何 bash 命令、API 调用或系统指令。
- **不要虚构操作**：不要假装执行了某个系统操作或启动了某个流程。你只需分析用户提供的内容并给出文字建议。
- **专注于内容分析**：阅读用户上传的图片/文件内容，基于你的专业知识直接给出分析和建议。

## 专业知识参考

如果用户消息中包含【Taxbot专业分析参考】部分，这是来自专业税务知识库的参考意见。你应该：
- 充分参考和引用该专业意见，将其作为分析的重要依据
- 结合你自己的分析和文件内容，形成更完整的建议
- 如果专业参考与你的分析存在差异，说明两种观点并给出你的判断

## 操作流程

${prompt}

## 输出要求

1. 输出结构清晰，使用标题和分段
2. 重要数据使用表格形式呈现
3. 全程使用中文
`;

    fs.writeFileSync(path.join(skillFolder, 'SKILL.md'), skillMd, 'utf-8');
    taxLog(`Custom skill saved: ${folderName} at ${skillFolder}`);

    // Clear cached snapshot and restart gateway to pick up new skill
    clearSkillsSnapshot();
    taxLog(`Restarting gateway to load new skill...`);
    restartGateway();

    return { ok: true, path: skillFolder, folderName };
  } catch (err) {
    taxLog(`Failed to save custom skill: ${err.message}`);
    return { ok: false, error: err.message };
  }
});

ipcMain.handle('delete-custom-skill', async (_event, { id, name, folderName }) => {
  try {
    const skillsDir = getManagedSkillsDir();

    // Try multiple possible folder names: explicit folderName, id-based, full UUID
    const folders = [];
    if (folderName) folders.push(path.join(skillsDir, folderName));
    folders.push(path.join(skillsDir, skillFolderName(id)));
    // Also try full UUID format (legacy)
    folders.push(path.join(skillsDir, `custom-${id}`));

    // Check which folders exist before stopping gateway
    const foldersToDelete = folders.filter(f => fs.existsSync(f));
    if (foldersToDelete.length === 0) {
      taxLog(`No skill folder found for id=${id}, nothing to delete on disk`);
      return { ok: true };
    }

    // Stop gateway and wait for port to be released before deleting folders
    taxLog(`Stopping gateway before deleting skill folder...`);
    await stopGateway();

    // Delete using Windows native 'rd /s /q' — Electron's fs.rmSync fails on Unicode paths
    for (const skillFolder of foldersToDelete) {
      try {
        execSync(`rd /s /q "${skillFolder}"`, { stdio: 'ignore', windowsHide: true, timeout: 5000 });
      } catch (e) {
        taxLog(`rd /s /q failed: ${e.message}`);
      }

      if (!fs.existsSync(skillFolder)) {
        taxLog(`Custom skill deleted: ${skillFolder}`);
      } else {
        // Fallback: try fs.rmSync
        taxLog(`WARNING: rd failed, trying fs.rmSync for: ${skillFolder}`);
        try {
          fs.rmSync(skillFolder, { recursive: true, force: true, maxRetries: 3, retryDelay: 500 });
        } catch (e2) {
          taxLog(`fs.rmSync also failed: ${e2.message}`);
        }
        if (!fs.existsSync(skillFolder)) {
          taxLog(`Custom skill deleted via fs.rmSync: ${skillFolder}`);
        } else {
          taxLog(`ERROR: Could not delete ${skillFolder}`);
        }
      }
    }

    // Clear cached snapshot and restart gateway
    clearSkillsSnapshot();
    taxLog(`Restarting gateway after skill deletion...`);
    restartGateway();

    return { ok: true };
  } catch (err) {
    taxLog(`Failed to delete custom skill: ${err.message}`);
    // Still try to restart gateway even if delete failed
    restartGateway();
    return { ok: false, error: err.message };
  }
});

// ============ 打开本地文件/URL ============

ipcMain.handle('open-path', async (_event, filePath) => {
  try {
    if (!filePath) return { ok: false };
    // URL — open in default browser
    if (/^https?:\/\//i.test(filePath)) {
      await shell.openExternal(filePath);
      return { ok: true };
    }
    // Local file path — open with default app
    const resolved = path.resolve(filePath);
    if (fs.existsSync(resolved)) {
      await shell.openPath(resolved);
      return { ok: true };
    }
    // Try as folder
    const dir = path.dirname(resolved);
    if (fs.existsSync(dir)) {
      await shell.openPath(dir);
      return { ok: true };
    }
    return { ok: false, error: 'Path not found' };
  } catch (err) {
    taxLog(`open-path error: ${err.message}`);
    return { ok: false, error: err.message };
  }
});

// ============ 列出已安装的managed技能 ============

ipcMain.handle('list-managed-skills', async () => {
  try {
    const skillsDir = getManagedSkillsDir();
    if (!fs.existsSync(skillsDir)) return { ok: true, skills: [] };
    const entries = fs.readdirSync(skillsDir);
    const skills = [];
    for (const entry of entries) {
      const fullPath = path.join(skillsDir, entry);
      const skillMdPath = path.join(fullPath, 'SKILL.md');
      if (!fs.statSync(fullPath).isDirectory() || !fs.existsSync(skillMdPath)) continue;
      try {
        const content = fs.readFileSync(skillMdPath, 'utf-8');
        let skillName = entry;
        let description = '';
        let emoji = '🤖';
        let body = content;

        // Try parsing frontmatter
        const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
        if (fmMatch) {
          const fm = fmMatch[1];
          const nameMatch = fm.match(/^name:\s*(.+)$/m);
          const descMatch = fm.match(/^description:\s*"?(.+?)"?\s*$/m);
          const emojiMatch = fm.match(/"emoji":\s*"(.+?)"/);
          if (nameMatch) skillName = nameMatch[1].trim();
          if (descMatch) description = descMatch[1].trim();
          if (emojiMatch) emoji = emojiMatch[1].trim();
          const bodyStart = content.indexOf('---', 4);
          body = bodyStart > 0 ? content.slice(content.indexOf('\n', bodyStart) + 1).trim() : '';
        } else {
          // No frontmatter — extract name from first heading, description from content
          const headingMatch = content.match(/^#\s+(.+?)(?:\s*-\s*(.+))?$/m);
          if (headingMatch) {
            skillName = headingMatch[2] ? headingMatch[2].trim() : headingMatch[1].trim();
          }
          const lines = content.split('\n');
          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('---')) {
              description = trimmed;
              break;
            }
          }
        }

        // Extract prompt: skip heading lines at the top
        const promptLines = body.split('\n');
        const firstNonHeading = promptLines.findIndex(l => !l.startsWith('#') && l.trim().length > 0);
        const prompt = firstNonHeading >= 0 ? promptLines.slice(firstNonHeading).join('\n').trim() : body;
        skills.push({
          folderName: entry,
          name: skillName,
          description,
          emoji,
          prompt,
        });
      } catch (_) {}
    }
    return { ok: true, skills };
  } catch (err) {
    taxLog(`Failed to list managed skills: ${err.message}`);
    return { ok: false, error: err.message, skills: [] };
  }
});

// ============ Managed Skills 目录监听 ============
// Watch ~/.openclaw/skills/ for changes and notify renderer

let managedSkillsWatcher = null;
let managedSkillsDebounce = null;

function startManagedSkillsWatcher() {
  stopManagedSkillsWatcher();
  const skillsDir = getManagedSkillsDir();
  if (!fs.existsSync(skillsDir)) return;
  taxLog(`Starting managed skills watcher: ${skillsDir}`);
  try {
    managedSkillsWatcher = fs.watch(skillsDir, { recursive: true }, (eventType, filename) => {
      if (!filename) return;
      // Debounce: gateway may write multiple files during skill install
      if (managedSkillsDebounce) clearTimeout(managedSkillsDebounce);
      managedSkillsDebounce = setTimeout(() => {
        managedSkillsDebounce = null;
        taxLog(`Managed skills changed: ${eventType} ${filename}`);
        // Notify all renderer windows
        const { BrowserWindow } = require('electron');
        for (const win of BrowserWindow.getAllWindows()) {
          try {
            win.webContents.send('managed-skills-updated');
          } catch (_) {}
        }
      }, 2000); // 2s debounce
    });
    managedSkillsWatcher.on('error', (err) => {
      taxLog(`Managed skills watcher error: ${err.message}`);
    });
  } catch (err) {
    taxLog(`Failed to start managed skills watcher: ${err.message}`);
  }
}

function stopManagedSkillsWatcher() {
  if (managedSkillsWatcher) {
    managedSkillsWatcher.close();
    managedSkillsWatcher = null;
  }
  if (managedSkillsDebounce) {
    clearTimeout(managedSkillsDebounce);
    managedSkillsDebounce = null;
  }
}

// ============ GUI Signal Watcher ============
// The gateway's exec tool runs in a background process that cannot show GUI windows.
// This watcher picks up signal files written by scripts/open-gui.cjs and opens
// the requested GUI from the Electron main process (which has desktop access).

let guiSignalWatcher = null;

function startGuiSignalWatcher() {
  const stateDir = path.join(process.env.USERPROFILE || process.env.HOME || '.', '.openclaw');
  const signalFile = path.join(stateDir, 'gui-signal.json');

  // Clean up stale signal
  try { fs.unlinkSync(signalFile); } catch (_) {}

  try {
    guiSignalWatcher = fs.watch(stateDir, (eventType, filename) => {
      if (filename !== 'gui-signal.json') return;
      // Small delay to ensure file write is complete
      setTimeout(() => {
        try {
          if (!fs.existsSync(signalFile)) return;
          const raw = fs.readFileSync(signalFile, 'utf8');
          fs.unlinkSync(signalFile); // consume the signal

          const data = JSON.parse(raw);
          taxLog(`GUI signal received: ${JSON.stringify(data)}`);

          if (data.action === 'folder') {
            shell.openPath(data.target).then(err => {
              if (err) taxLog(`shell.openPath error: ${err}`);
            });
          } else if (data.action === 'app') {
            const { exec } = require('child_process');
            exec(`start "" "${data.target}"`, { shell: true }, (err) => {
              if (err) taxLog(`GUI app exec error: ${err.message}`);
            });
          }
        } catch (e) {
          taxLog(`GUI signal processing error: ${e.message}`);
        }
      }, 50);
    });
    guiSignalWatcher.on('error', (err) => {
      taxLog(`GUI signal watcher error: ${err.message}`);
    });
    taxLog('GUI signal watcher started');
  } catch (err) {
    taxLog(`Failed to start GUI signal watcher: ${err.message}`);
  }
}

// ============ 技能导出 (zip) ============

ipcMain.handle('export-skill', async (_event, { id, name }) => {
  try {
    const skillsDir = getManagedSkillsDir();
    const folderName = skillFolderName(id);
    let skillFolder = path.join(skillsDir, folderName);

    // Also check for non-custom folders (e.g. clawhub, imported skills)
    if (!fs.existsSync(skillFolder)) {
      // Try using name directly as folder name
      skillFolder = path.join(skillsDir, name);
      if (!fs.existsSync(skillFolder)) {
        return { ok: false, error: `Skill folder not found: ${folderName}` };
      }
    }

    // Open save dialog
    const { dialog } = require('electron');
    const safeName = (name || folderName).replace(/[<>:"/\\|?*]/g, '_');
    const result = await dialog.showSaveDialog(mainWindow, {
      title: '导出技能包',
      defaultPath: `${safeName}.zip`,
      filters: [{ name: 'ZIP 文件', extensions: ['zip'] }],
    });

    if (result.canceled || !result.filePath) {
      return { ok: false, error: 'cancelled' };
    }

    const destZip = result.filePath;

    // Remove existing file if present
    if (fs.existsSync(destZip)) {
      fs.unlinkSync(destZip);
    }

    // Use PowerShell Compress-Archive to create zip
    const { execSync } = require('child_process');
    execSync(`powershell -Command "Compress-Archive -Path '${skillFolder}\\*' -DestinationPath '${destZip}' -Force"`, { timeout: 30000 });

    taxLog(`Skill exported: ${folderName} → ${destZip}`);
    return { ok: true, path: destZip };
  } catch (err) {
    taxLog(`Failed to export skill: ${err.message}`);
    return { ok: false, error: err.message };
  }
});

// ============ 技能包上传安装 (zip) ============

ipcMain.handle('install-skill-package', async (_event, { base64Data, fileName }) => {
  const os = require('os');
  const { execSync } = require('child_process');
  const tmpDir = path.join(os.tmpdir(), `taxbot-skill-${Date.now()}`);
  const zipPath = tmpDir + '.zip';

  try {
    // Write zip to temp file
    const buf = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(zipPath, buf);

    // Extract with PowerShell
    fs.mkdirSync(tmpDir, { recursive: true });
    execSync(`powershell -NoProfile -Command "Expand-Archive -Path '${zipPath}' -DestinationPath '${tmpDir}' -Force"`, { timeout: 30000 });

    // Find SKILL.md (may be at root or inside a subfolder)
    let skillMdPath = null;
    let skillRoot = null;

    const topEntries = fs.readdirSync(tmpDir);
    // Check if SKILL.md is directly in extracted root
    if (topEntries.includes('SKILL.md')) {
      skillMdPath = path.join(tmpDir, 'SKILL.md');
      skillRoot = tmpDir;
    } else {
      // Check one level of subdirectories (zip may contain a wrapping folder)
      for (const entry of topEntries) {
        const sub = path.join(tmpDir, entry);
        if (fs.statSync(sub).isDirectory()) {
          const subPath = path.join(sub, 'SKILL.md');
          if (fs.existsSync(subPath)) {
            skillMdPath = subPath;
            skillRoot = sub;
            break;
          }
        }
      }
    }

    if (!skillMdPath || !skillRoot) {
      return { ok: false, error: '技能包中未找到 SKILL.md 文件' };
    }

    // Parse SKILL.md frontmatter
    const skillContent = fs.readFileSync(skillMdPath, 'utf-8');
    const fmMatch = skillContent.match(/^---\s*\n([\s\S]*?)\n---/);
    let skillName = '';
    let skillDescription = '';
    let skillEmoji = '🤖';

    if (fmMatch) {
      const fm = fmMatch[1];
      const nameMatch = fm.match(/^name:\s*(.+)/m);
      const descMatch = fm.match(/^description:\s*(.+)/m);
      const emojiMatch = fm.match(/"emoji":\s*"([^"]+)"/);
      if (nameMatch) skillName = nameMatch[1].trim();
      if (descMatch) skillDescription = descMatch[1].trim();
      if (emojiMatch) skillEmoji = emojiMatch[1].trim();
    }

    if (!skillName) {
      // Fallback: use filename without .zip
      skillName = fileName.replace(/\.zip$/i, '');
    }

    // Determine folder name for installation
    // Use the skill name from frontmatter if ASCII-safe, otherwise generate one
    let folderName = skillName;
    if (/[^\x20-\x7e]/.test(folderName) || !folderName) {
      folderName = `imported-${Date.now().toString(36)}`;
    }
    // Sanitize: lowercase, replace non-alnum with hyphens
    folderName = folderName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'imported-skill';

    // Copy to managed skills directory (~/.openclaw/skills/)
    // This ensures imported skills are loaded as "openclaw-managed" source,
    // bypassing the allowBundled filter that restricts bundled skills.
    const skillsDir = getManagedSkillsDir();
    const destFolder = path.join(skillsDir, folderName);

    // Remove old folder if exists
    if (fs.existsSync(destFolder)) {
      fs.rmSync(destFolder, { recursive: true, force: true });
    }

    // Copy all files from skillRoot to destFolder
    const copyRecursive = (src, dst) => {
      fs.mkdirSync(dst, { recursive: true });
      for (const entry of fs.readdirSync(src)) {
        const srcPath = path.join(src, entry);
        const dstPath = path.join(dst, entry);
        if (fs.statSync(srcPath).isDirectory()) {
          copyRecursive(srcPath, dstPath);
        } else {
          fs.copyFileSync(srcPath, dstPath);
        }
      }
    };
    copyRecursive(skillRoot, destFolder);

    // Strip "requires" from SKILL.md metadata so the skill always loads.
    // User explicitly chose to install this skill, so it should not be filtered
    // out by the gateway's shouldIncludeSkill binary/env checks.
    try {
      const destSkillMd = path.join(destFolder, 'SKILL.md');
      let mdContent = fs.readFileSync(destSkillMd, 'utf-8');
      // Remove "requires": { ... } from the metadata JSON block
      mdContent = mdContent.replace(/"requires"\s*:\s*\{[^}]*\}\s*,?\s*/g, '');
      // Clean up trailing commas in JSON
      mdContent = mdContent.replace(/,(\s*[}\]])/g, '$1');
      fs.writeFileSync(destSkillMd, mdContent, 'utf-8');
    } catch (e) {
      taxLog(`Warning: failed to strip requires from SKILL.md: ${e.message}`);
    }

    taxLog(`Skill package installed: ${folderName} from ${fileName}`);

    // Clear cached snapshot and restart gateway to load imported skill
    clearSkillsSnapshot();
    taxLog(`Restarting gateway to load imported skill...`);
    restartGateway();

    // Extract prompt from SKILL.md body (after frontmatter)
    let prompt = '';
    if (fmMatch) {
      prompt = skillContent.substring(fmMatch[0].length).trim();
    }

    return {
      ok: true,
      folderName,
      skill: { name: skillName, description: skillDescription, emoji: skillEmoji, prompt }
    };
  } catch (err) {
    taxLog(`Failed to install skill package: ${err.message}`);
    return { ok: false, error: err.message };
  } finally {
    // Clean up temp files
    try { if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath); } catch (_) {}
    try { if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (_) {}
  }
});

// ============ 技能包安装 (ArrayBuffer, 异步解压) ============

ipcMain.handle('install-skill-buffer', async (_event, { buffer, fileName }) => {
  const os = require('os');
  const { exec } = require('child_process');
  const { promisify } = require('util');
  const execAsync = promisify(exec);
  const { readFile: readFileAsync, writeFile: writeFileAsync, readdir: readdirAsync, stat: statAsync, mkdir: mkdirAsync } = require('fs/promises');

  const tmpDir = path.join(os.tmpdir(), `taxbot-skill-${Date.now()}`);
  const zipPath = tmpDir + '.zip';

  try {
    // Write buffer directly to temp file (no base64 decoding needed)
    const buf = Buffer.from(buffer);
    await writeFileAsync(zipPath, buf);

    // Extract with PowerShell (async)
    await mkdirAsync(tmpDir, { recursive: true });
    await execAsync(
      `powershell -NoProfile -Command "Expand-Archive -Path '${zipPath}' -DestinationPath '${tmpDir}' -Force"`,
      { timeout: 60000 }
    );

    // Find SKILL.md (may be at root or inside a subfolder)
    let skillMdPath = null;
    let skillRoot = null;

    const topEntries = await readdirAsync(tmpDir);
    if (topEntries.includes('SKILL.md')) {
      skillMdPath = path.join(tmpDir, 'SKILL.md');
      skillRoot = tmpDir;
    } else {
      for (const entry of topEntries) {
        const sub = path.join(tmpDir, entry);
        if ((await statAsync(sub)).isDirectory()) {
          const subPath = path.join(sub, 'SKILL.md');
          if (fs.existsSync(subPath)) {
            skillMdPath = subPath;
            skillRoot = sub;
            break;
          }
        }
      }
    }

    if (!skillMdPath || !skillRoot) {
      return { ok: false, error: '技能包中未找到 SKILL.md 文件' };
    }

    // Parse SKILL.md frontmatter
    const skillContent = await readFileAsync(skillMdPath, 'utf-8');
    const fmMatch = skillContent.match(/^---\s*\n([\s\S]*?)\n---/);
    let skillName = '';
    let skillDescription = '';
    let skillEmoji = '🤖';

    if (fmMatch) {
      const fm = fmMatch[1];
      const nameMatch = fm.match(/^name:\s*(.+)/m);
      const descMatch = fm.match(/^description:\s*(.+)/m);
      const emojiMatch = fm.match(/"emoji":\s*"([^"]+)"/);
      if (nameMatch) skillName = nameMatch[1].trim();
      if (descMatch) skillDescription = descMatch[1].trim();
      if (emojiMatch) skillEmoji = emojiMatch[1].trim();
    }

    if (!skillName) {
      skillName = fileName.replace(/\.zip$/i, '');
    }

    let folderName = skillName;
    if (/[^\x20-\x7e]/.test(folderName) || !folderName) {
      folderName = `imported-${Date.now().toString(36)}`;
    }
    folderName = folderName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'imported-skill';

    const skillsDir = getManagedSkillsDir();
    const destFolder = path.join(skillsDir, folderName);

    if (fs.existsSync(destFolder)) {
      fs.rmSync(destFolder, { recursive: true, force: true });
    }

    const copyRecursive = (src, dst) => {
      fs.mkdirSync(dst, { recursive: true });
      for (const entry of fs.readdirSync(src)) {
        const srcPath = path.join(src, entry);
        const dstPath = path.join(dst, entry);
        if (fs.statSync(srcPath).isDirectory()) {
          copyRecursive(srcPath, dstPath);
        } else {
          fs.copyFileSync(srcPath, dstPath);
        }
      }
    };
    copyRecursive(skillRoot, destFolder);

    // Strip "requires" from SKILL.md metadata
    try {
      const destSkillMd = path.join(destFolder, 'SKILL.md');
      let mdContent = fs.readFileSync(destSkillMd, 'utf-8');
      mdContent = mdContent.replace(/"requires"\s*:\s*\{[^}]*\}\s*,?\s*/g, '');
      mdContent = mdContent.replace(/,(\s*[}\]])/g, '$1');
      fs.writeFileSync(destSkillMd, mdContent, 'utf-8');
    } catch (e) {
      taxLog(`Warning: failed to strip requires from SKILL.md: ${e.message}`);
    }

    taxLog(`Skill package installed (buffer): ${folderName} from ${fileName}`);

    clearSkillsSnapshot();
    taxLog(`Restarting gateway to load imported skill...`);
    restartGateway();

    let prompt = '';
    if (fmMatch) {
      prompt = skillContent.substring(fmMatch[0].length).trim();
    }

    return {
      ok: true,
      folderName,
      skill: { name: skillName, description: skillDescription, emoji: skillEmoji, prompt }
    };
  } catch (err) {
    taxLog(`Failed to install skill package (buffer): ${err.message}`);
    return { ok: false, error: err.message };
  } finally {
    try { if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath); } catch (_) {}
    try { if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (_) {}
  }
});

// ============ 文档文本提取 (pdfjs-dist) ============

let pdfjsModule = null;
async function loadPdfJs() {
  if (!pdfjsModule) {
    try {
      pdfjsModule = await import('pdfjs-dist/legacy/build/pdf.mjs');
    } catch (err) {
      taxLog(`Failed to load pdfjs-dist: ${err.message}`);
      throw err;
    }
  }
  return pdfjsModule;
}

ipcMain.handle('extract-document-text', async (_event, { base64Data, mimeType, fileName }) => {
  taxLog(`extract-document-text called: mime=${mimeType}, fileName=${fileName}, dataLen=${base64Data?.length || 0}`);
  try {
    // PDF extraction via pdfjs-dist
    if (mimeType === 'application/pdf') {
      const pdfjs = await loadPdfJs();
      const buffer = Buffer.from(base64Data, 'base64');
      const pdf = await pdfjs.getDocument({
        data: new Uint8Array(buffer),
        disableWorker: true,
      }).promise;

      const maxPages = Math.min(pdf.numPages, 20);
      const textParts = [];

      for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map(item => ('str' in item ? String(item.str) : ''))
          .filter(Boolean)
          .join(' ');
        if (pageText) {
          textParts.push(`--- 第${pageNum}页 ---\n${pageText}`);
        }
      }

      const result = textParts.join('\n\n');
      taxLog(`PDF extracted: ${pdf.numPages} pages, ${result.length} chars`);
      return { ok: true, text: result };
    }

    // Plain text / CSV
    if (mimeType === 'text/plain' || mimeType === 'text/csv') {
      const text = Buffer.from(base64Data, 'base64').toString('utf-8');
      taxLog(`Text file extracted: ${text.length} chars`);
      return { ok: true, text };
    }

    // Image files — can't extract text locally, return empty
    if (mimeType.startsWith('image/')) {
      taxLog(`Image file — no local text extraction available`);
      return { ok: true, text: '' };
    }

    taxLog(`Unsupported mime type for extraction: ${mimeType}`);
    return { ok: true, text: '' };
  } catch (err) {
    taxLog(`extract-document-text error: ${err.message}`);
    return { ok: false, error: err.message, text: '' };
  }
});

// ============ Taxbot API ============

const TAXYES_API_URL = 'https://ai.taxyes.com/api/open/v1/chat';
const TAXYES_TIMEOUT = 180000; // 180 seconds — API needs time for regulation search + generation

ipcMain.handle('taxyes-chat', async (_event, { content, messageList }) => {
  taxLog(`IPC called. content length=${content?.length}, messageList=${messageList?.length || 0}`);
  taxLog(`content preview: ${String(content).substring(0, 200)}`);
  console.log('[TaxYes] IPC called, content length:', content?.length, 'messageList:', messageList?.length || 0);
  if (!content || typeof content !== 'string') {
    return { ok: false, error: '缺少 content 参数' };
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TAXYES_TIMEOUT);
  try {
    console.log('[TaxYes] Fetching API...');
    const resp = await fetch(TAXYES_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
        messageList: Array.isArray(messageList) ? messageList : [],
      }),
      signal: controller.signal,
      keepalive: true,
    });
    // Don't clearTimeout here — keep abort active for the entire stream duration

    console.log('[TaxYes] Response status:', resp.status, resp.headers.get('content-type'));
    if (!resp.ok) {
      clearTimeout(timer);
      console.log('[TaxYes] HTTP error:', resp.status, resp.statusText);
      return { ok: false, error: `HTTP ${resp.status}: ${resp.statusText}` };
    }

    // Handle SSE (Server-Sent Events) streaming response
    // Format: "id:N\ndata:{JSON}\n\n" — answer field is incremental (token-by-token)
    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let finalAnswer = '';
    let finalSteps = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // keep incomplete last line

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('id:')) continue;
        // Strip SSE "data:" prefix
        const jsonStr = trimmed.startsWith('data:') ? trimmed.slice(5) : trimmed;
        if (!jsonStr) continue;
        try {
          const chunk = JSON.parse(jsonStr);
          // answer is incremental (each chunk = new token), accumulate
          if (chunk.answer) finalAnswer += chunk.answer;
          if (chunk.steps) finalSteps = chunk.steps;
          if (chunk.finishReason === 'stop') {
            clearTimeout(timer);
            reader.cancel();
            taxLog(`Done. Answer length=${finalAnswer.length}`);
            taxLog(`Answer preview: ${finalAnswer.substring(0, 300)}`);
            console.log('[TaxYes] Done. Answer length:', finalAnswer.length);
            return { ok: true, answer: finalAnswer, steps: finalSteps };
          }
          if (chunk.finishReason === 'error') {
            clearTimeout(timer);
            reader.cancel();
            const errMsg = finalSteps.find(s => s.errorTip)?.step || 'Taxbot返回错误';
            return { ok: false, error: errMsg };
          }
        } catch (_) { /* not valid JSON, skip */ }
      }
    }

    // Stream ended without explicit "stop" — try remaining buffer
    if (buffer.trim()) {
      try {
        const jsonStr = buffer.trim().startsWith('data:') ? buffer.trim().slice(5) : buffer.trim();
        const chunk = JSON.parse(jsonStr);
        if (chunk.answer) finalAnswer += chunk.answer;
        if (chunk.steps) finalSteps = chunk.steps;
      } catch (_) {}
    }

    clearTimeout(timer);
    if (finalAnswer) {
      taxLog(`Done (no stop). Answer length=${finalAnswer.length}`);
      return { ok: true, answer: finalAnswer, steps: finalSteps };
    }
    taxLog(`Stream ended without stop. Answer length=${finalAnswer.length}`);
    console.log('[TaxYes] Stream ended without stop. Answer length:', finalAnswer.length);
    return { ok: false, error: '未收到有效回复' };
  } catch (err) {
    clearTimeout(timer);
    taxLog(`Error: ${err.name} ${err.message}`);
    console.error('[TaxYes] Error:', err.name, err.message);
    if (err.name === 'AbortError') {
      return { ok: false, error: '请求超时 (30s)' };
    }
    return { ok: false, error: err.message || String(err) };
  }
});

// ============ Error handling ============

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});
