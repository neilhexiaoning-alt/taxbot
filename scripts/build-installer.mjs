#!/usr/bin/env node
/**
 * 构建 Windows 安装包
 * 将 pnpm 项目打包为 electron-builder 可用的扁平结构
 */
import { execSync, spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = path.resolve(import.meta.dirname, "..");
const STAGE = path.join(ROOT, "build", "app");
const DIST_ELECTRON = path.join(ROOT, "dist-electron");

function log(msg) {
  process.stderr.write(`[build-installer] ${msg}\n`);
}

function rimraf(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function mkdirp(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

/** 复制文件/目录，自动解引用 symlink */
function copySync(src, dest) {
  fs.cpSync(src, dest, { recursive: true, dereference: true, force: true });
}

// ─── Step 1: 确保 dist 和 UI 已构建 ───
log("Step 1: Checking build...");
const distEntry = path.join(ROOT, "dist", "entry.js");
const uiEntry = path.join(ROOT, "dist", "control-ui", "taxchat.html");
if (!fs.existsSync(distEntry)) {
  log("dist/entry.js not found, running pnpm build...");
  execSync("pnpm build", { cwd: ROOT, stdio: "inherit" });
}
if (!fs.existsSync(uiEntry)) {
  log("dist/control-ui not found, running pnpm ui:build...");
  execSync("pnpm ui:build", { cwd: ROOT, stdio: "inherit" });
}
log("Build artifacts OK.");

// ─── Step 2: 准备 staging 目录 ───
log("Step 2: Preparing staging directory...");
rimraf(STAGE);
mkdirp(STAGE);

// ─── Step 3: 复制应用文件 ───
log("Step 3: Copying app files...");

// electron/ 目录
copySync(path.join(ROOT, "electron"), path.join(STAGE, "electron"));

// dist/ 目录（排除 .map 和 test 文件）
const distSrc = path.join(ROOT, "dist");
const distDest = path.join(STAGE, "dist");
mkdirp(distDest);

function copyDistFiltered(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.name === "OpenClaw.app") continue;
    if (entry.name.endsWith(".map")) continue;
    if (entry.name.endsWith(".test.js")) continue;
    if (entry.name === "test") continue;

    if (entry.isDirectory()) {
      mkdirp(destPath);
      copyDistFiltered(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
copyDistFiltered(distSrc, distDest);

// openclaw.mjs
fs.copyFileSync(path.join(ROOT, "openclaw.mjs"), path.join(STAGE, "openclaw.mjs"));

// scripts/run-node.mjs
mkdirp(path.join(STAGE, "scripts"));
fs.copyFileSync(
  path.join(ROOT, "scripts", "run-node.mjs"),
  path.join(STAGE, "scripts", "run-node.mjs")
);

// skills/ 目录（如果存在）
const skillsSrc = path.join(ROOT, "skills");
if (fs.existsSync(skillsSrc)) {
  copySync(skillsSrc, path.join(STAGE, "skills"));
}

// packages/ 目录（如果存在）
const packagesSrc = path.join(ROOT, "packages");
if (fs.existsSync(packagesSrc)) {
  copySync(packagesSrc, path.join(STAGE, "packages"));
}

// ui/assets/ → extraResources 会处理，但也复制一份供 getAppIcon 使用
mkdirp(path.join(STAGE, "ui", "assets"));
const uiAssetsDir = path.join(ROOT, "ui", "assets");
if (fs.existsSync(uiAssetsDir)) {
  for (const f of fs.readdirSync(uiAssetsDir)) {
    const src = path.join(uiAssetsDir, f);
    if (fs.statSync(src).isFile()) {
      fs.copyFileSync(src, path.join(STAGE, "ui", "assets", f));
    }
  }
}

log("App files copied.");

// ─── Step 4: 生成 package.json ───
log("Step 4: Generating package.json...");
const rootPkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf-8"));
const stagePkg = {
  name: rootPkg.name,
  version: rootPkg.version,
  description: rootPkg.description,
  main: "electron/main.cjs",
  type: "module",
  dependencies: rootPkg.dependencies,
};
fs.writeFileSync(path.join(STAGE, "package.json"), JSON.stringify(stagePkg, null, 2));
log("package.json generated.");

// ─── Step 5: 安装生产依赖（使用 npm 获取扁平 node_modules）───
log("Step 5: Installing production dependencies (npm)...");
log("This may take a few minutes...");

// 写一个 .npmrc 来跳过一些不需要的 native 模块构建
fs.writeFileSync(
  path.join(STAGE, ".npmrc"),
  [
    "ignore-scripts=true",
    "fund=false",
    "audit=false",
    "",
  ].join("\n")
);

execSync("npm install --production --no-optional", {
  cwd: STAGE,
  stdio: "inherit",
  env: { ...process.env, npm_config_ignore_scripts: "true" },
  timeout: 600000,
});
log("Dependencies installed.");

// ─── Step 6: 运行 electron-builder ───
log("Step 6: Running electron-builder...");
rimraf(DIST_ELECTRON);

const builderConfig = {
  appId: "com.openclaw.taxchat",
  productName: "Taxbot",
  copyright: "Copyright © 2026",
  asar: false,
  directories: {
    app: STAGE,
    output: DIST_ELECTRON,
  },
  files: ["**/*"],
  extraResources: [
    {
      from: path.join(ROOT, "ui", "assets"),
      to: "assets",
    },
  ],
  win: {
    icon: path.join(ROOT, "ui", "assets", "icon.ico"),
    target: [
      { target: "nsis", arch: ["x64"] },
    ],
    artifactName: "${productName}-${version}-setup.${ext}",
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    allowElevation: true,
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    shortcutName: "Taxbot",
    installerIcon: path.join(ROOT, "ui", "assets", "icon.ico"),
    uninstallerIcon: path.join(ROOT, "ui", "assets", "icon.ico"),
    deleteAppDataOnUninstall: false,
    displayLanguageSelector: false,
    language: "2052",
    perMachine: false,
  },
  publish: null,
};

// 写入临时 builder 配置
const builderConfigPath = path.join(STAGE, "electron-builder.json");
fs.writeFileSync(builderConfigPath, JSON.stringify(builderConfig, null, 2));

const builder = spawn(
  process.platform === "win32" ? "cmd.exe" : "npx",
  process.platform === "win32"
    ? ["/d", "/s", "/c", "npx", "electron-builder", "--win", "--x64", "--config", builderConfigPath]
    : ["electron-builder", "--win", "--x64", "--config", builderConfigPath],
  {
    cwd: ROOT,
    stdio: "inherit",
    env: { ...process.env },
  }
);

builder.on("exit", (code) => {
  if (code === 0) {
    log("=== BUILD SUCCESSFUL ===");
    log(`Output: ${DIST_ELECTRON}`);
    // 列出生成的文件
    if (fs.existsSync(DIST_ELECTRON)) {
      for (const f of fs.readdirSync(DIST_ELECTRON)) {
        const stat = fs.statSync(path.join(DIST_ELECTRON, f));
        if (stat.isFile()) {
          const sizeMB = (stat.size / 1024 / 1024).toFixed(1);
          log(`  ${f} (${sizeMB} MB)`);
        }
      }
    }
  } else {
    log(`Build failed with exit code ${code}`);
  }
  process.exit(code || 0);
});
