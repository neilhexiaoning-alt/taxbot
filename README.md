# 智税宝 TaxBot

**基于 OpenClaw 框架的税务专用 AI 助理**

智税宝是一款面向财税人员的桌面端 AI 助理应用，集成发票查验、合同税审、纳税申报预审、税务风险治理、票据整理等核心功能。底层基于 [OpenClaw](https://github.com/openclaw/openclaw) 个人 AI 助理框架，搭配通义千问大模型，提供开箱即用的本地化部署方案。

## 核心功能

### 发票查验

上传发票图片、PDF 或 XML 文件，自动识别发票信息，调用中税网查验接口验证真伪，输出查验结果和风险分析。支持增值税专票/普票、全电发票、铁路电子客票、航空运输电子客票等全部票种。

### 合同税审

从税务角度审核合同和票据，识别适用税目，计算税额，给出涉税风险提示和条款修改建议。

### 纳税申报预审

分析纳税申报表与财务报表的数据差异，识别逻辑冲突和潜在税务风险，在申报前发现问题。

### 税务风险治理

分析税务风险提示函、纳税评估通知等文件，生成应对策略和说明函，协助完成税务自查。

### 票据整理

扫描文件夹中的票据，按费用类型（交通、餐饮、住宿、办公等）自动分类，生成 Excel 报销单。

### 知识库检索

在指定文件夹中检索文档、提取摘要、搜索内容，支持 PDF、Word、Excel 等常见格式。

### 图片 OCR

从图片中提取文字，支持扫描件、截图、手写文字识别。

## 技术架构

```
┌─────────────────────────────────┐
│         Electron 桌面壳          │  系统托盘 + 网关管理
├─────────────────────────────────┤
│       OpenClaw Gateway          │  AI 网关（本地运行）
├──────────┬──────────────────────┤
│  技能系统  │    Web Chat UI      │  预制技能 + 自定义技能
├──────────┴──────────────────────┤
│     通义千问 qwen-max / vl-max   │  文本推理 + 视觉识别
└─────────────────────────────────┘
```

- **前端**：Lit-html 轻量 Web UI，Electron 封装为桌面应用
- **后端**：OpenClaw Gateway（Node.js），本地运行，数据不出本机
- **模型**：通义千问 qwen-max（工具调用）+ qwen-vl-max（视觉识别）
- **技能**：SKILL.md 声明式技能系统，支持预制技能和用户自定义技能
- **工具**：Node.js / Python 脚本，通过 exec 工具调用

## 安装部署

### 方式一：分发包安装（推荐）

适用于无开发环境的目标电脑：

1. 在开发机上运行打包脚本生成分发包：
   ```powershell
   powershell -ExecutionPolicy Bypass -File pack-taxbot.ps1
   ```
2. 将生成的 `taxbot-dist.zip`（约 177MB）拷贝到目标电脑
3. 解压后双击 `setup-taxbot.exe` 运行安装向导
4. 安装完成后桌面出现 TaxBot 快捷方式，双击启动

分发包内含 Node.js、pnpm、Electron 运行时，目标电脑仅需联网安装 npm 依赖。

### 方式二：源码部署

适用于开发环境：

```bash
# 克隆仓库
git clone https://github.com/neilhexiaoning-alt/taxbot.git
cd taxbot

# 安装依赖（需要 Node.js 18+ 和 pnpm）
pnpm install

# 启动
pnpm start
```

## 项目结构

```
├── electron/           # Electron 主进程（托盘、网关管理）
├── dist/               # 预编译的网关和 UI
│   ├── index.js        # Gateway 入口
│   └── control-ui/     # Chat UI（taxchat.html/js）
├── ui/                 # UI 源码（TypeScript + Lit-html）
├── src/                # Gateway 源码（TypeScript）
├── skills/             # 预制技能
│   ├── invoice-check/  # 发票查验（含 API 脚本）
│   ├── contract-tax/   # 合同税审
│   ├── tax-review/     # 申报预审
│   ├── tax-risk/       # 风险治理
│   ├── receipt-organizer/ # 票据整理
│   ├── knowledge-base/ # 知识库
│   └── image-ocr/      # 图片 OCR
├── scripts/            # 构建和运行脚本
├── extensions/         # 网关插件
├── setup-taxbot.ps1    # GUI 安装脚本
└── pack-taxbot.ps1     # 分发包打包脚本
```

## 配置

安装脚本会自动生成配置文件 `~/.openclaw/openclaw.json`，包含：

- 网关端口和认证令牌
- 通义千问 API 密钥
- 模型配置（qwen-max + qwen-vl-max）
- 技能白名单和工具权限

如需修改 API 密钥或模型配置，直接编辑该文件即可。

## 自定义技能

除预制技能外，支持用户创建自定义技能：

1. 在 Chat UI 的技能管理面板中点击「新建技能」
2. 填写技能名称、描述和提示词
3. 保存后即可在快捷操作栏使用

也支持从 `.zip` 技能包导入。

## 系统要求

- **操作系统**：Windows 10/11
- **运行时**：Node.js 18+（分发包已内置）
- **网络**：首次安装需联网下载依赖；日常使用需联网调用通义千问 API
- **磁盘**：约 500MB（含运行时和依赖）

## 许可证

基于 [OpenClaw](https://github.com/openclaw/openclaw) 开源框架，遵循 MIT 许可证。
