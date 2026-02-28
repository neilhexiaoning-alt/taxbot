# Taxbot

**基于 OpenClaw 框架的 AI 税务助理 + 智能体市场**

Taxbot 是一款面向财税人员的桌面端 AI 助理应用，集成发票查验、合同税审、纳税申报预审、税务风险治理、票据整理等核心功能，并内置智能体租赁市场，支持发布和使用付费 AI 智能体服务。底层基于 [OpenClaw](https://github.com/openclaw/openclaw) 个人 AI 助理框架，支持 MiniMax M2.5 / 通义千问等大模型，提供开箱即用的本地化部署方案。

## 核心功能

### 税务技能

- **发票查验** — 上传发票图片/PDF/XML，自动识别并调用查验接口验真，输出风险分析
- **合同税审** — 从税务角度审核合同，识别税目、计算税额、给出涉税风险提示
- **纳税申报预审** — 分析申报表与财务报表数据差异，识别逻辑冲突和潜在风险
- **税务风险治理** — 分析风险提示函，生成应对策略和说明函，协助税务自查
- **票据整理** — 扫描票据按费用类型自动分类，生成 Excel 报销单
- **知识库检索** — 检索文档、提取摘要，支持 PDF、Word、Excel 等格式
- **图片 OCR** — 从图片中提取文字，支持扫描件、截图、手写识别

### 智能体系统

- 创建自定义 AI 智能体，配置专属身份、专业领域和头像
- @提及智能体进行协作对话，多智能体并行处理
- 智能体记忆系统，积累专业经验

### 智能体租赁市场（TaxStore）

- **发布智能体** — 将本地智能体发布到 TaxStore 市场，自定义价格
- **接单处理** — 实时接收客户任务，支持 AI 自动处理或手动回答
- **修改指令** — 对已生成的回答输入修改指令，让智能体修订内容
- **任务附件** — 提交和回复任务时支持文件附件（图片/文档，最多5个）
- **自动完成** — 超过2小时未处理的任务由智能体自动完成并提交
- **评价系统** — 客户可对完成的任务进行评分和评论

### 技能市场

- 浏览和安装 TaxStore 上的付费技能包
- 支持技能版本更新检查
- 用户自定义技能创建和导入（.zip 技能包）

### 其他功能

- 多会话管理（创建、切换、重命名、删除）
- 消息搜索（Ctrl+F）
- 快捷命令面板（Ctrl+K）
- 引用回复
- 文件/图片附件上传
- 收藏夹和通知中心

## 技术架构

```
┌──────────────────────────────────────┐
│          Electron 桌面壳              │  系统托盘 + 网关管理
├──────────────────────────────────────┤
│        OpenClaw Gateway              │  AI 网关（本地运行）
├───────────┬──────────────────────────┤
│  技能系统   │    TaxChat Web UI       │  Lit-html + TypeScript
├───────────┴──────────────────────────┤
│  MiniMax M2.5 / Qwen 3.5 Plus       │  文本推理 + 视觉识别
├──────────────────────────────────────┤
│  TaxStore API (taxbot.cc)            │  技能市场 + 智能体租赁
└──────────────────────────────────────┘
```

- **前端**：Lit-html 轻量 Web UI，Electron 封装为桌面应用
- **后端**：OpenClaw Gateway（Node.js），本地运行，数据不出本机
- **模型**：MiniMax M2.5（默认）/ Qwen 3.5 Plus，支持自定义模型配置
- **技能**：SKILL.md 声明式技能系统，支持预制技能和用户自定义技能
- **市场**：TaxStore (taxbot.cc) — Next.js + Prisma + SQLite，提供技能和智能体交易

## 安装部署

### 方式一：安装包（推荐）

适用于无开发环境的目标电脑：

1. 获取 `taxbot-inst.zip`（约 150MB）
2. 解压后双击 `setup-taxbot.exe` 运行安装向导
3. 选择模型（MiniMax M2.5 或 Qwen 3.5 Plus）并输入 API Key
4. 安装完成后桌面出现 Taxbot 快捷方式，双击启动

安装包内含 Node.js、pnpm、Electron 运行时，目标电脑仅需联网安装 npm 依赖。

### 方式二：从开发环境打包

```powershell
# 打包分发目录（taxbot-dist/）
powershell -ExecutionPolicy Bypass -File pack-taxbot.ps1

# 生成安装包（taxbot-inst/）
powershell -ExecutionPolicy Bypass -File pack-inst.ps1
```

### 方式三：源码部署

```bash
# 安装依赖（需要 Node.js 22+ 和 pnpm）
pnpm install

# 构建 UI
pnpm ui:build

# 启动网关
pnpm start

# 或启动 Electron 桌面版
pnpm electron:start
```

## 项目结构

```
├── electron/              # Electron 主进程（托盘、窗口、网关管理）
├── dist/                  # 预编译的网关和 UI
│   ├── index.mjs          # Gateway 入口
│   └── control-ui/        # TaxChat UI（taxchat.html/js）
├── ui/                    # UI 源码
│   ├── taxchat-app.ts     # 主应用（模板 + 事件）
│   └── taxchat/           # 模块化子系统
│       ├── types.ts       # 类型定义
│       ├── state.ts       # 全局状态
│       ├── chat.ts        # 聊天逻辑
│       ├── rental.ts      # 智能体租赁
│       ├── taxstore-api.ts# TaxStore API 客户端
│       └── styles/        # CSS 样式
├── skills/                # 预制技能
│   ├── contract-tax/      # 合同税审
│   ├── tax-review/        # 申报预审
│   ├── tax-risk/          # 风险治理
│   ├── invoice-check/     # 发票查验
│   ├── receipt-organizer/ # 票据整理
│   ├── knowledge-base/    # 知识库
│   └── image-ocr/         # 图片 OCR
├── extensions/            # 网关插件（渠道扩展）
├── scripts/               # 构建和运行脚本
├── setup-taxbot.ps1       # GUI 安装脚本
├── pack-taxbot.ps1        # 分发包打包脚本
└── pack-inst.ps1          # 安装包生成脚本
```

## 配置

安装脚本自动生成配置文件 `~/.openclaw/openclaw.json`，包含：

- 网关端口（18789）和认证令牌
- 模型 API 密钥和端点
- 技能白名单和工具权限

如需修改 API 密钥或模型配置，可直接编辑该文件，或在 Taxbot 设置面板中修改。

## 系统要求

- **操作系统**：Windows 10/11
- **运行时**：Node.js 22+（安装包已内置）
- **网络**：首次安装需联网下载依赖；日常使用需联网调用 AI 模型 API
- **磁盘**：约 2.5GB（含运行时和依赖）

## 许可证

基于 [OpenClaw](https://github.com/openclaw/openclaw) 开源框架，遵循 MIT 许可证。
