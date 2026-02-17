/**
 * open-gui.cjs - Signal the Electron main process to open a GUI window.
 *
 * Usage (from exec tool via PowerShell):
 *   node "$env:TAXBOT_ROOT/scripts/open-gui.cjs" folder "C:\path\to\folder"
 *   node "$env:TAXBOT_ROOT/scripts/open-gui.cjs" app taskmgr
 *
 * The script writes a JSON signal file that the Electron main process watches.
 * The main process then uses shell.openPath() / child_process.exec() to open
 * the requested GUI app, which works because the Electron process has full
 * access to the user's interactive desktop.
 */

const fs = require('fs');
const path = require('path');

const stateDir = path.join(
  process.env.USERPROFILE || process.env.HOME || '.',
  '.openclaw'
);
const signalFile = path.join(stateDir, 'gui-signal.json');

const action = process.argv[2]; // 'folder' or 'app'
const target = process.argv.slice(3).join(' ');

if (!action || !target) {
  console.error(JSON.stringify({ ok: false, error: 'Usage: open-gui.cjs <folder|app> <target>' }));
  process.exit(1);
}

const signal = {
  action: action,
  target: target,
  timestamp: Date.now()
};

try {
  fs.writeFileSync(signalFile, JSON.stringify(signal), 'utf8');
  console.log(JSON.stringify({ ok: true, action, target }));
} catch (err) {
  console.error(JSON.stringify({ ok: false, error: err.message }));
  process.exit(1);
}
