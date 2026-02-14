/**
 * afterPack hook for electron-builder
 *
 * We bypass electron-builder's pnpm collector, then copy node_modules
 * ourselves. We preserve pnpm's symlink/junction graph (including .pnpm)
 * so dependency resolution stays identical to the dev install.
 */
const fs = require('fs');
const path = require('path');

// directories / files to skip
const SKIP_DIRS = new Set([
  '.git', '.github', '.vscode', '.idea', '.nyc_output',
  'test', 'tests', '__tests__', '__mocks__', '__fixtures__',
  '.cache', '.turbo', '.eslintcache',
]);

function shouldSkip(name, isDir) {
  if (isDir) return SKIP_DIRS.has(name);
  if (name.endsWith('.ts') && !name.endsWith('.d.ts')) return true;
  if (name.endsWith('.map')) return true;
  return false;
}

let stats = { files: 0, dirs: 0, links: 0, skipped: 0 };

function resolveLinkTarget(srcRoot, destRoot, srcPath, linkTarget) {
  const absTarget = path.resolve(path.dirname(srcPath), linkTarget);
  const rel = path.relative(srcRoot, absTarget);
  if (!rel.startsWith('..') && !path.isAbsolute(rel)) {
    return path.join(destRoot, rel);
  }
  return absTarget;
}

/**
 * Copy a directory recursively while preserving symlinks/junctions.
 * Symlink targets that point inside srcRoot are rewritten to destRoot.
 */
function copyDirPreserveLinks(srcRoot, destRoot, srcDir, destDir) {
  let entries;
  try { entries = fs.readdirSync(srcDir, { withFileTypes: true }); } catch { return; }

  fs.mkdirSync(destDir, { recursive: true });
  stats.dirs++;

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    let lstat;
    try { lstat = fs.lstatSync(srcPath); } catch { stats.skipped++; continue; }

    if (lstat.isSymbolicLink()) {
      let linkTarget;
      try { linkTarget = fs.readlinkSync(srcPath); } catch { stats.skipped++; continue; }
      const resolvedTarget = resolveLinkTarget(srcRoot, destRoot, srcPath, linkTarget);

      let isDir = false;
      try { isDir = fs.statSync(path.resolve(path.dirname(srcPath), linkTarget)).isDirectory(); } catch {}

      try {
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        fs.symlinkSync(resolvedTarget, destPath, isDir ? 'junction' : 'file');
        stats.links++;
      } catch { stats.skipped++; }
      continue;
    }

    if (lstat.isDirectory()) {
      if (shouldSkip(entry.name, true)) { stats.skipped++; continue; }
      copyDirPreserveLinks(srcRoot, destRoot, srcPath, destPath);
      continue;
    }

    if (lstat.isFile()) {
      if (shouldSkip(entry.name, false)) { stats.skipped++; continue; }
      try {
        fs.copyFileSync(srcPath, destPath);
        stats.files++;
        if (stats.files % 5000 === 0) {
          console.log(`[afterPack]   ${stats.files} files, ${stats.dirs} dirs, ${stats.links} links`);
        }
      } catch { stats.skipped++; }
    }
  }
}

exports.default = async function afterPack(context) {
  const appDir = path.join(context.appOutDir, 'resources', 'app');
  const nodeModulesDir = path.join(appDir, 'node_modules');

  if (fs.existsSync(nodeModulesDir)) {
    console.log('[afterPack] node_modules already present, skipping.');
    return;
  }

  const sourceRoot = context.packager.appDir || context.packager.projectDir;
  const sourceNM = path.join(sourceRoot, 'node_modules');

  if (!fs.existsSync(sourceNM)) {
    console.log('[afterPack] ERROR - source node_modules not found at:', sourceNM);
    return;
  }

  console.log('[afterPack] Copying node_modules with pnpm links preserved...');
  console.log('[afterPack]   source:', sourceNM);
  console.log('[afterPack]   target:', nodeModulesDir);

  const start = Date.now();
  stats = { files: 0, dirs: 0, links: 0, skipped: 0 };

  copyDirPreserveLinks(sourceNM, nodeModulesDir, sourceNM, nodeModulesDir);

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(
    `[afterPack] Done - ${stats.files} files, ${stats.dirs} dirs, ` +
    `${stats.links} links, ${stats.skipped} skipped (${elapsed}s)`
  );
};
