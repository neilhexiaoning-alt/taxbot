# Taxbot

**基于 OpenClaw 框架的 AI 税务助理 + 智能体市场**

Taxbot（智税宝）是一款面向财税人员的桌面端 AI 助理应用，集成发票查验、合同税审、纳税申报预审、税务风险治理、票据整理等核心功能，并内置智能体租赁市场，支持发布和使用付费 AI 智能体服务。底层基于 [OpenClaw](https://github.com/openclaw/openclaw) 个人 AI 助理框架，支持 MiniMax M2.5 / 通义千问等大模型，提供开箱即用的本地化部署方案。

> 当前版本：**v20260301.4** | 配套市场平台：[TaxSkillStore](https://github.com/neilhexiaoning-alt/TaxSkillStore)

## 核心功能

### 税务技能

- **发票查验** — 上传发票图片/PDF/XML，自动识别并调用查验接口验真，输出风险分析
- **合同税审** — 从税务角度审核合同，识别税目、计算税额、给出涉税风险提示
- **纳税申报预审** — 分析申报表与财务报表数据差异，识别逻辑冲突和潜在风险
- **税务风险治理** — 分析风险提示函，生成应对策略和说明函，协助税务自查
- **票据整理** — 扫描票据按费用类型自动分类，生成 Excel 报销单
- **知识库检索** — 检索文档、提取摘要，支持 PDF、Word、Excel 等格式
- **图片 OCR** — 从图片中提取文字，支持扫描件、截图、手写识别

### 知识库系统

- **文件夹导入** — 选择本地文件夹，自动扫描并索引所有文档
- **多格式支持** — PDF、Word（.docx）、Excel（.xlsx）、PowerPoint（.pptx）、TXT、CSV、图片
- **文件预览** — 知识面板内直接预览文件内容，支持文本、图片、PDF 渲染、DOCX/XLSX 转 HTML
- **PDF 文本模式** — PDF 文件支持切换"渲染/文本"视图，文本模式使用 pdfjs 提取并以 Markdown 格式展示
- **文字引用** — 预览中选中文字后浮现"引用选中"按钮，一键插入对话输入框
- **智能检索** — 基于关键词频率的相关性索引，按查询内容自动选取最相关的知识片段
- **实时监听** — 文件夹变动自动感知，新增文件即时学习
- **拖拽上传** — 直接拖拽文件到知识面板添加

### 智能体系统

- 创建自定义 AI 智能体，配置专属身份（IDENTITY.md）、灵魂设定（SOUL.md）和头像
- @提及智能体进行协作对话，支持多智能体顺序编排处理
- 智能体记忆系统，积累专业经验，支持手动追加记忆
- 内置模板：税务顾问、合同审查、政策解读、财务分析

### 智能体租赁市场（TaxStore）

- **发布智能体** — 将本地智能体发布到 TaxStore 市场，自定义价格和标签
- **接单处理** — 实时接收客户任务，支持 AI 自动处理或手动回答
- **消息通信** — 任务内置即时消息，客户与智能体实时沟通
- **修订机制** — 客户可请求修订（最多3次），智能体根据指令修改内容
- **任务附件** — 提交和回复任务时支持文件附件（图片/文档，最多5个）
- **自动完成** — 超过2小时未处理的任务由智能体自动完成并提交
- **评价系统** — 客户可对完成的任务进行评分和评论
- **心跳检测** — 实时显示智能体在线/离线状态

### 技能市场

- 浏览和安装 TaxStore 上的付费技能包
- 支持技能版本更新检查
- 自定义技能编辑器（Emoji + 名称 + 描述 + 提示词）
- 技能导出为 .zip 包，支持从文件安装
- 托管技能目录监听（~/.openclaw/skills/）
- 技能固定到快捷栏，对话中自动匹配相关技能

### 许可证系统

- 7 天免费试用（首次启动自动开始）
- 激活码授权（XXXX-XXXX-XXXX-XXXX 格式）
- 设备绑定验证
- 在线申请许可证流程
- 试用倒计时显示

### 其他功能

- 多会话管理（创建、切换、重命名、删除）
- 消息搜索（Ctrl+F）
- 快捷命令面板（Ctrl+K）
- 引用回复（点击消息引用）
- 文件/图片附件上传
- 收藏夹和通知中心
- 消息保存为 Word 文档
- 消息保存到知识库
- TaxYes 专业税务法规库集成

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

- **前端**：Lit 3 + TypeScript，Vite 7 构建，Electron 40 封装为桌面应用
- **后端**：OpenClaw Gateway（Node.js 22+），本地运行，数据不出本机
- **模型**：MiniMax M2.5（默认）/ Qwen 3.5 Plus，支持自定义模型和 API 端点
- **技能**：SKILL.md 声明式技能系统，支持预制技能和用户自定义技能
- **知识库**：pdfjs-dist（PDF 提取）、mammoth（DOCX→HTML）、SheetJS（XLSX→HTML）、jszip（PPTX 文本）
- **市场**：[TaxStore](https://github.com/neilhexiaoning-alt/TaxSkillStore) (taxbot.cc) — Next.js 16 + Prisma + SQLite

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
│       ├── knowledge.ts   # 知识库（预览、引用、索引）
│       ├── agents.ts      # 智能体管理
│       ├── rental.ts      # 智能体租赁
│       ├── skills.ts      # 技能管理
│       ├── taxstore-api.ts# TaxStore API 客户端
│       ├── persistence.ts # 数据持久化（IndexedDB + localStorage）
│       ├── conversations.ts# 多会话管理
│       ├── gateway-connect.ts # WebSocket 连接
│       ├── version.ts     # 版本号
│       └── styles/        # CSS 样式（23 个模块化样式文件）
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

## Electron IPC 接口

Taxbot 的 Electron 主进程提供 40+ 个 IPC 接口：

| 分类 | 接口 |
|------|------|
| 网关控制 | 状态查询、启停、端口管理、Token 获取 |
| 知识库 | 文件夹选择/导入、文件列表/删除/复制、预览（PDF/DOCX/XLSX/PPTX/图片）、文件夹监听 |
| 智能体 | 工作区 CRUD、身份同步、记忆读写、头像管理 |
| 技能 | 自定义技能 CRUD、导出、安装技能包、托管目录列表 |
| 文档提取 | PDF/TXT/CSV 文本提取 |
| 存储 | 收藏同步、TaxYes 调用、打开文件路径 |

## 截图

*（待补充）*

## 许可证

基于 [OpenClaw](https://github.com/openclaw/openclaw) 开源框架，遵循 MIT 许可证。
