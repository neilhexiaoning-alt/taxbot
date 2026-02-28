/**
 * OpenClaw Desktop - Electron Launcher
 * 确保 Electron 以 GUI 模式启动（清除 ELECTRON_RUN_AS_NODE）
 */

const { spawn } = require('child_process');
const path = require('path');

// 获取 Electron 二进制路径
// Try bundled electron-dist first, then npm package, then PATH
const fs = require('fs');
const projectRoot = path.resolve(__dirname, '..');
const bundledElectron = path.join(projectRoot, 'electron-dist', 'electron.exe');
let electronPath;
if (fs.existsSync(bundledElectron)) {
  electronPath = bundledElectron;
} else {
  try { electronPath = require('electron'); } catch (_) { electronPath = 'electron'; }
}
const appPath = path.join(__dirname);

console.log('[Launcher] Electron binary:', electronPath);
console.log('[Launcher] App path:', appPath);

// 构建干净的环境变量（移除 ELECTRON_RUN_AS_NODE）
const cleanEnv = { ...process.env };
delete cleanEnv.ELECTRON_RUN_AS_NODE;

// 启动 Electron GUI 进程
const child = spawn(electronPath, [appPath], {
  env: cleanEnv,
  stdio: 'inherit',
  detached: false,
});

child.on('error', (err) => {
  console.error('[Launcher] Failed to start Electron:', err);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
