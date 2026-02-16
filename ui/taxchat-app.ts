/**
 * Independent TaxChat Web App
 * Standalone application for tax-focused chat interactions
 * No token required - connects anonymously to Gateway
 */

import { html, render } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { live } from "lit/directives/live.js";
import { GatewayBrowserClient } from "./src/ui/gateway";
import type { GatewayHelloOk } from "./src/ui/gateway";
import { toSanitizedMarkdownHtml } from "./src/ui/markdown";

// Simple UUID generator
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Message types
interface UserMessage {
  type: "user";
  text: string;
  timestamp: number;
  id: string;
  attachments?: FileAttachment[];
}

interface AssistantMessage {
  type: "assistant";
  text: string;
  timestamp: number;
  id: string;
}

type ChatMessage = UserMessage | AssistantMessage;

interface FileAttachment {
  name: string;
  type: string;
  size: number;
  dataUrl: string;
}

// Notification log entry
interface NotificationEntry {
  id: string;
  text: string;
  icon: string;
  timestamp: number;
}

// Custom skill definition
interface CustomSkill {
  id: string;
  name: string;
  emoji: string;
  description: string;
  prompt: string;
  pinned: boolean;
  createdAt: number;
  folderName?: string; // actual skill folder name used by gateway
  noFilePicker?: boolean; // skip file picker, send prompt directly
}

// Minimal app state
interface AppState {
  connected: boolean;
  hello: GatewayHelloOk | null;
  lastError: string | null;
  gatewayUrl: string;
  client: GatewayBrowserClient | null;
  sessionKey: string;
  messages: ChatMessage[];
  draft: string;
  sending: boolean;
  inputRef: HTMLTextAreaElement | null;
  attachments: FileAttachment[];
  dragOver: boolean;
  toolMessages?: unknown;
  stream?: unknown;
  streamStartedAt?: number;
  previewAttachment: FileAttachment | null;
  pendingSkill: { name: string; prompt: string; displayLabel: string } | null;
  favorites: Set<string>; // set of message IDs
  showFavorites: boolean;
  showAbout: boolean;
  confirmingClear: boolean;
  authorizedFolder: string | null;
  folderKnowledge: string | null;
  folderKnowledgeSent: boolean; // track if folder knowledge was already sent in this session
  importingFolder: boolean;
  importResult: string | null;
  thinkingLabel: string | null;
  toolsActive: number;
  currentRunId: string | null;
  lastSkillName: string | null;
  _retryCount: number;
  toastMessage: string | null;
  toastTimer: ReturnType<typeof setTimeout> | null;
  notifications: NotificationEntry[];
  panelTab: "favorites" | "notifications";
  customSkills: CustomSkill[];
  editingSkill: CustomSkill | null;
  activeCustomSkill: CustomSkill | null; // skill prompt bubble shown above input
  showKnowledge: boolean;
  showSkills: boolean;
  showStatusMenu: boolean;
  knowledgeFiles: Array<{ name: string; size: number; ext: string; type: string; mtime?: number }>;
  knowledgeRefs: Array<{ name: string }>; // files referenced for next message
  knowledgeDragOver: boolean;
  knowledgeLoading: boolean;
  builtinSkillsCollapsed: boolean;
  filesSortBy: "time" | "name";
  skillsSortBy: "time" | "name";
  showQuickStart: boolean;
}

const FAVORITES_STORAGE_KEY = "taxbot_favorites";
const MESSAGES_STORAGE_KEY = "taxbot_messages";
const NOTIFICATIONS_STORAGE_KEY = "taxbot_notifications";
const CUSTOM_SKILLS_STORAGE_KEY = "taxbot_custom_skills";

// Built-in (pre-installed) skills - read-only, cannot be edited or deleted
const BUILTIN_SKILLS: (CustomSkill & { builtin: true })[] = [
  {
    id: "__builtin_tax-risk",
    name: "税务风险治理",
    emoji: "🧾",
    description: "分析税务风险文件/图片，生成说明函和应对策略",
    prompt: "请按照税务风险治理流程，分析我上传的文件内容，识别税务风险点，给出风险分析、说明函、应对话术和操作建议。请直接分析文件内容，不要调用任何工具或命令。",
    pinned: false,
    createdAt: 0,
    folderName: "tax-risk",
    builtin: true,
  },
  {
    id: "__builtin_tax-review",
    name: "纳税申报表预审",
    emoji: "📊",
    description: "分析纳税申报表与财务报表的数据差异，识别税务风险",
    prompt: "请按照纳税申报表预审流程，分析我上传的纳税申报表和财务报表，比对两个表格的数据差异，以表格形式输出比对结果，并分析税务风险给出处理建议。请直接分析文件内容，不要调用任何工具或命令。",
    pinned: false,
    createdAt: 0,
    folderName: "tax-review",
    builtin: true,
  },
  {
    id: "__builtin_contract-tax",
    name: "合同及票据税审",
    emoji: "📝",
    description: "从税务角度审核合同和票据，计算税额，给出风险提示",
    prompt: "请按照票据合同税务审核流程，从税务角度分析我上传的合同或票据，列支涉及的税目并计算相关税额，给出风险提示和修改建议。请直接分析文件内容，不要调用任何工具或命令。",
    pinned: false,
    createdAt: 0,
    folderName: "contract-tax",
    builtin: true,
  },
  {
    id: "__builtin_invoice-check",
    name: "发票查验",
    emoji: "🔍",
    description: "上传发票图片/PDF/XML，查验发票真伪并分析风险",
    prompt: `# 发票查验

> **全自动执行，各步骤之间不要等待用户确认。**

## 第一步：判断发票类型

**⚠️ 必须先判断发票类型，再按对应规则提取字段！不同类型的字段规则完全不同！**

发票分两大类：
- **传统发票**（004/007/025/026/028/005/006/002/014）：有发票代码（10-12位）+ 发票号码（8位）+ 校验码
- **全电发票**（021/022/085/086/061/083）：**没有发票代码**，发票号码是20位，**没有校验码**

判断方法：票面上只有一个20位数字"发票号码"、没有单独"发票代码"的就是全电发票。标题含"数字化电子发票""铁路电子客票""航空运输电子客票"也是全电发票。

## 第二步：识别并提取发票信息

### 图片文件
图片内容已在对话中可见，直接识别。不清晰时用 image 工具重新加载。

### PDF/XML 文件
文件内容已嵌入消息中（【文件内容】标记内）。XML常见标签：InvoiceCode/Fpdm, InvoiceNumber/Fphm, BillingDate/Kprq, TotalAmount/Hjje, CheckCode/Jym。

### 传统发票字段提取规则（004/007/025/026/028/005/006/002/014）

| 接口字段 | 说明 |
|------|------|
| invoiceCode | **必填**，发票代码，10或12位数字 |
| invoiceNo | **必填**，发票号码，8位数字 |
| invoiceDate | **必填**，开票日期，YYYYMMDD |
| invoiceAmount | **必填**，不含税金额（005不含税价，006车价合计） |
| checkCode | **必填**，校验码后六位 |

### 全电发票字段提取规则（021/022/085/086/061/083）

| 接口字段 | 说明 |
|------|------|
| invoiceCode | **必须传空值**（--invoiceCode= ） |
| invoiceNo | **必填**，完整20位发票号码，如25119110010002612998 |
| invoiceDate | **必填**，开票日期，YYYYMMDD |
| invoiceAmount | **必填**，083铁路票价金额，061航空票价金额，其他不含税金额 |
| checkCode | **必须传空值**（--checkCode= ） |

**⚠️ 全电发票常见错误**：
- ❌ 把20位号码拆成invoiceCode+invoiceNo（如25119110010002612998拆成2511911001和0002612998）
- ✅ invoiceCode留空，invoiceNo填完整20位

### 发票种类代码映射

| 类型 | 代码 | 类别 |
|---|---|---|
| 增值税专用发票（纸质） | 004 | 传统 |
| 增值税普通发票（折叠票） | 007 | 传统 |
| 增值税普通发票（卷票） | 025 | 传统 |
| 增值税电子普通发票 | 026 | 传统 |
| 增值税电子专用发票 | 028 | 传统 |
| 机动车销售统一发票 | 005 | 传统 |
| 二手车销售统一发票 | 006 | 传统 |
| 货运增值税专用发票 | 002 | 传统 |
| 通行费发票 | 014 | 传统 |
| 全电发票（专用） | 021 | 全电 |
| 全电发票（普通） | 022 | 全电 |
| 全电纸质专票 | 085 | 全电 |
| 全电纸质普票 | 086 | 全电 |
| 航空运输电子客票 | 061 | 全电 |
| 铁路电子客票 | 083 | 全电 |

## 第三步：查验接口（系统自动调用）

系统已自动调用查验接口，查验结果会附在消息末尾的【查验结果】中。如果没有查验结果，说明字段提取失败或接口调用失败，请根据已有信息进行分析。

## 第四步：展示查验结果

将【查验结果】中的JSON以表格展示：查验状态、发票代码、发票号码、开票日期、发票状态(正常/作废/红冲)、销方名称、购方名称、金额、税额、价税合计。如有货物明细也列出。如果没有查验结果，跳过此步直接进入风险分析。

## 第五步：风险分析

🔴高风险：查验失败(可能假发票)、发票作废/失控/红冲、销方异常、金额被篡改(与查验结果不一致)。
🟡中风险：开票超360天(影响抵扣)、类型与业务不匹配、大额整数金额、销方经营范围与开票内容不符。
🟢正常：查验通过、状态正常、信息一致。

输出风险评估表(序号/风险项/等级/说明/建议)和总体结论(✅真实有效/⚠️存在风险/❌发票存疑)。

## 特殊情况
- 图片模糊：请用户重新上传
- 缺字段：列出已识别和缺失字段，请用户补充
- 脚本失败：显示错误，建议检查网络
- 多张发票：逐一处理
- 全电发票（021/022/085/086/061/083）：invoiceCode和checkCode必须传空值，invoiceNo必须是完整20位`,
    pinned: false,
    createdAt: 0,
    folderName: "invoice-check",
    builtin: true,
  },
  {
    id: "__builtin_receipt-organizer",
    name: "票据整理",
    emoji: "🧾",
    description: "扫描文件夹中的票据，按类型分类整理，生成报销单",
    prompt: `# 票据整理与报销单生成

> **全自动执行，各步骤之间不要等待用户确认，不要输出工具调用的文字描述。**

## 第一步：扫描票据文件夹

立即用 exec 工具执行以下命令，弹出文件夹选择器让用户选择票据目录：

python "$env:TAXBOT_ROOT/skills/receipt-organizer/scripts/scan_folder.py" --pick

$env:TAXBOT_ROOT 是系统环境变量，指向应用根目录，由系统自动设置。始终使用 --pick 参数弹出目录选择器。

退出码 1 表示取消或无文件，停止流程。正常输出格式：
FOLDER:<原始文件夹路径>
WORKDIR:<临时工作目录>
<临时路径>|<原始文件名>

每行 | 左侧是临时文件路径，右侧是原始文件名。记住 FOLDER 和 WORKDIR 的值。

## 第二步：提取票据文本

立即用 exec 工具执行以下命令（用第一步输出的 WORKDIR 替换）：

python "$env:TAXBOT_ROOT/skills/receipt-organizer/scripts/extract_text.py" <WORKDIR路径>

此脚本自动从每个PDF文件中提取文本内容。输出格式：
======== receipt_001.pdf ========
<提取的文本内容>

根据提取的文本，从每个文件中识别：日期(YYYY-MM-DD)、金额(含税总额)、商家名称、票据类型、票据号码、消费摘要、税额、税率。无法识别的字段填 null。

对照第一步的文件列表，将 receipt_001.pdf 等临时文件名与原始文件名对应。

## 第三步：分类并生成报销单

根据费用分类规则（交通费、餐饮费、住宿费、办公用品费、通讯费、会议费、差旅费、业务招待费、培训费、快递物流费、设备购置费、软件服务费、其他费用）将每张票据分配费用类别。

严禁使用虚构数据，每条记录必须来自第二步的真实提取结果。

用 exec 工具执行以下命令，先将JSON写入临时文件，再生成报销单（替换实际数据和路径）：

'{"title":"报销单","applicant":"","department":"","items":[{"date":"2025-05-13","category":"交通费","summary":"火车票","vendor":"铁路客运","receipt_type":"电子发票","receipt_no":"12345","amount":150.00,"tax_amount":null,"tax_rate":null,"filename":"原始文件名.pdf"}]}' | Set-Content -Path "$env:TEMP\\receipts_data.json" -Encoding UTF8; python "$env:TAXBOT_ROOT/skills/receipt-organizer/scripts/generate_report.py" "$env:TEMP\\receipts_data.json" --output "<FOLDER路径>"

注意：JSON 数据用单引号包裹，通过 Set-Content 写入临时文件（UTF-8编码），然后传文件路径给 generate_report.py。<FOLDER路径> 替换为第一步输出的 FOLDER 值。JSON 必须是单行，不要换行。

items 数组中每个对象的字段：date, category, summary, vendor, receipt_type, receipt_no, amount(数字), tax_amount, tax_rate, filename(原始文件名)。

## 第四步：输出结果

报告：票据总数、识别成功数、按类别汇总（类别/笔数/金额）、报销总金额、报销单文件路径。

## 特殊情况
- 文本标记 [no-pdf-library]：提示用户安装 pdfplumber（pip install pdfplumber）
- 文本标记 [image-file]：标记"图片文件，待人工核实"
- 识别失败：标记"待人工核实"，记录文件名
- 重复票据：发票号相同时提醒用户
- 金额超 10000 元：提醒用户确认`,
    pinned: false,
    createdAt: 0,
    folderName: "receipt-organizer",
    builtin: true,
    noFilePicker: true,
  },
  {
    id: "__builtin_knowledge-base",
    name: "知识库",
    emoji: "📚",
    description: "在指定文件夹中检索文件、提取摘要、搜索内容",
    prompt: `# 知识库文件操作

> **使用 exec 工具执行所有脚本命令，各步骤之间不要等待用户确认。**

用户的知识库文件夹路径会在消息末尾以【知识库路径】标记提供。所有脚本命令中的 <FOLDER路径> 替换为该路径。

## 根据用户意图执行操作

根据用户的输入判断意图，执行对应操作：

### 搜索/检索文件
用 exec 工具执行：
python "$env:TAXBOT_ROOT/skills/knowledge-base/scripts/search_files.py" "<FOLDER路径>" "<关键词>"

展示搜索结果，包括匹配的文件名和内容片段。

### 阅读/提取文件内容
用 exec 工具执行：
python "$env:TAXBOT_ROOT/skills/knowledge-base/scripts/read_file.py" "<完整文件路径>"

文件路径 = FOLDER路径 + 相对路径。展示提取的文本内容，或根据用户要求进行摘要。

### 列出所有文件
用 exec 工具执行：
python "$env:TAXBOT_ROOT/skills/knowledge-base/scripts/search_files.py" "<FOLDER路径>" ""

展示文件夹中所有文件列表。

## 注意事项
- 始终使用 exec 工具执行 Python 脚本，不要尝试用 read 工具直接读取文件
- $env:TAXBOT_ROOT 是系统环境变量，指向应用根目录，由系统自动设置
- 文件路径中可能包含中文，确保正确传递
- 如果提取文本失败，告知用户可能需要安装对应的 Python 库（pdfplumber、python-docx、openpyxl）`,
    pinned: false,
    createdAt: 0,
    folderName: "knowledge-base",
    builtin: true,
    noFilePicker: true,
  },
];

function loadNotifications(): NotificationEntry[] {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return [];
}

function saveNotifications() {
  // Keep last 50 notifications
  const toSave = state.notifications.slice(-50);
  localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(toSave));
}

function loadCustomSkills(): CustomSkill[] {
  try {
    const raw = localStorage.getItem(CUSTOM_SKILLS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return [];
}

function saveCustomSkills() {
  localStorage.setItem(CUSTOM_SKILLS_STORAGE_KEY, JSON.stringify(state.customSkills));
}

// Sync managed skills from disk (~/.openclaw/skills/) into customSkills list
async function syncManagedSkills() {
  const api = (window as any).electronAPI;
  if (!api?.listManagedSkills) return;
  try {
    const result = await api.listManagedSkills();
    if (!result?.ok || !result.skills) return;
    const builtinFolders = new Set(BUILTIN_SKILLS.map(s => s.folderName));
    const trackedFolders = new Set(state.customSkills.map(s => s.folderName).filter(Boolean));
    let added = false;
    for (const ms of result.skills) {
      // Skip built-in skills and already tracked skills
      if (builtinFolders.has(ms.folderName)) continue;
      if (trackedFolders.has(ms.folderName)) continue;
      // Also skip if matched by custom-{id} pattern already in list
      if (state.customSkills.some(s => `custom-${s.id.slice(0, 8)}` === ms.folderName)) continue;
      state.customSkills.push({
        id: generateUUID(),
        name: ms.name === ms.folderName ? ms.description.slice(0, 20) || ms.folderName : ms.name,
        emoji: ms.emoji || "🤖",
        description: ms.description || "",
        prompt: ms.prompt || "",
        pinned: false,
        createdAt: Date.now(),
        folderName: ms.folderName,
      });
      added = true;
    }
    if (added) {
      saveCustomSkills();
      renderApp();
    }
  } catch (err) {
    console.warn("Failed to sync managed skills:", err);
  }
}

function openSkillEditor(skill?: CustomSkill) {
  state.editingSkill = skill
    ? { ...skill }
    : { id: generateUUID(), name: "", emoji: "🤖", description: "", prompt: "", pinned: false, createdAt: Date.now() };
  renderApp();
}

async function saveSkillFromEditor() {
  const s = state.editingSkill;
  if (!s || !s.name.trim() || !s.prompt.trim()) return;

  // Save to localStorage first (for persistence)
  const idx = state.customSkills.findIndex(c => c.id === s.id);
  if (idx >= 0) {
    state.customSkills[idx] = s;
  } else {
    state.customSkills.push(s);
  }
  saveCustomSkills();
  state.editingSkill = null;

  // Directly create SKILL.md and install to gateway via IPC
  const api = (window as any).electronAPI;
  if (api?.saveCustomSkill) {
    try {
      const result = await api.saveCustomSkill({
        id: s.id,
        name: s.name,
        emoji: s.emoji,
        description: s.description,
        prompt: s.prompt,
      });
      // Store the actual folder name for reliable deletion later
      if (result?.folderName) {
        s.folderName = result.folderName;
        saveCustomSkills();
      }
    } catch (err) {
      console.warn("Failed to save skill to gateway:", err);
    }
  }

  renderApp();
}

async function deleteCustomSkill(id: string) {
  const skill = state.customSkills.find(s => s.id === id);
  if (!skill) return;
  if (!confirm(`确定要删除技能"${skill.name}"吗？`)) return;
  state.customSkills = state.customSkills.filter(s => s.id !== id);
  saveCustomSkills();
  renderApp();

  // Remove skill folder via Electron IPC
  const api = (window as any).electronAPI;
  if (api?.deleteCustomSkill) {
    try {
      await api.deleteCustomSkill(id, skill.name, skill.folderName);
    } catch (err) {
      console.warn("Failed to delete skill file:", err);
    }
  }
}

async function exportSkillAsZip(skill: CustomSkill) {
  const api = (window as any).electronAPI;
  if (!api?.exportSkill) {
    alert("导出功能不可用");
    return;
  }
  try {
    const result = await api.exportSkill(skill.id, skill.name);
    if (result.ok) {
      alert(`技能已导出到：${result.path}`);
    } else if (result.error !== "cancelled") {
      alert(`导出失败：${result.error}`);
    }
  } catch (err: any) {
    alert(`导出失败：${err.message || err}`);
  }
}

async function handleInstallSkillPackage() {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".zip";
  fileInput.onchange = async () => {
    const file = fileInput.files?.[0];
    if (!file) return;

    // Read zip as base64
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const base64Data = dataUrl.split(",")[1];

      const api = (window as any).electronAPI;
      if (!api?.installSkillPackage) {
        alert("当前环境不支持技能包安装");
        return;
      }

      showToast("正在安装技能包...");
      try {
        const result = await api.installSkillPackage(base64Data, file.name);
        if (!result?.ok) {
          alert(`安装失败: ${result?.error || "未知错误"}`);
          return;
        }

        // Add to custom skills list
        const skill: CustomSkill = {
          id: generateUUID(),
          name: result.skill?.name || file.name.replace(/\.zip$/i, ""),
          emoji: result.skill?.emoji || "📦",
          description: result.skill?.description || "",
          prompt: result.skill?.prompt || "",
          pinned: false,
          createdAt: Date.now(),
          folderName: result.folderName,
        };
        state.customSkills.push(skill);
        saveCustomSkills();
        renderApp();

        showToast(`技能"${skill.name}"已安装，正在重启服务...`);
        addNotification(`技能包已安装: ${skill.name}`, "📦");
      } catch (err) {
        alert(`安装失败: ${(err as Error).message}`);
      }
    };
    reader.readAsDataURL(file);
  };
  fileInput.click();
}

function toggleSkillPin(id: string) {
  const skill = state.customSkills.find(s => s.id === id);
  if (!skill) return;
  skill.pinned = !skill.pinned;
  saveCustomSkills();
  renderApp();
}

function handleCustomSkillClick(skill: CustomSkill) {
  if (state.sending) return;
  // Set active skill — shows prompt bubble above input, user types content then sends
  state.activeCustomSkill = skill;
  // Use stored folderName (matches actual gateway skill folder), fallback to id-based name
  state.lastSkillName = skill.folderName || `custom-${skill.id.substring(0, 8)}`;
  // Prepend skill tag in draft so user sees what skill is being used
  const tag = `使用技能「${skill.name}」`;
  if (!state.draft.startsWith(tag)) {
    state.draft = tag + (state.draft ? " " + state.draft : "");
  }
  // Close panels so user sees the prompt bubble
  state.showFavorites = false;
  state.showSkills = false;
  renderApp();
  setTimeout(() => { state.inputRef?.focus(); }, 50);
}

function clearActiveCustomSkill() {
  state.activeCustomSkill = null;
  state.lastSkillName = null;
  renderApp();
}

function addNotification(text: string, icon = "📚") {
  state.notifications.push({
    id: generateUUID(),
    text,
    icon,
    timestamp: Date.now(),
  });
  saveNotifications();
}

function loadFavorites(): Set<string> {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch {}
  return new Set();
}

function saveFavorites() {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([...state.favorites]));
  } catch {}
  syncFavoritesToMemory();
}

/** Sync favorited messages to agent memory file so the bot can recall them */
function syncFavoritesToMemory() {
  const api = (window as any).electronAPI;
  if (!api?.syncFavoritesToMemory) return;

  const favMsgs: Array<{ text: string; timestamp: number; question?: string }> = [];
  for (const msgId of state.favorites) {
    const idx = state.messages.findIndex(m => m.id === msgId);
    if (idx < 0) continue;
    const msg = state.messages[idx];
    if (msg.type !== "assistant") continue;
    // Find preceding user message as context
    let question: string | undefined;
    for (let j = idx - 1; j >= 0; j--) {
      if (state.messages[j].type === "user") {
        question = state.messages[j].text;
        break;
      }
    }
    favMsgs.push({ text: msg.text, timestamp: msg.timestamp, question });
  }
  api.syncFavoritesToMemory(favMsgs).catch(() => {});
}

function loadMessages(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(MESSAGES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

function saveMessages() {
  try {
    // Only save the last 200 messages to avoid localStorage size limits
    const toSave = state.messages.slice(-200);
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(toSave));
  } catch {}
}

const state: AppState = {
  connected: false,
  hello: null,
  lastError: null,
  gatewayUrl: "ws://127.0.0.1:18789",
  client: null,
  sessionKey: "taxchat",
  messages: loadMessages(),
  draft: "",
  sending: false,
  inputRef: null,
  attachments: [],
  dragOver: false,
  toolMessages: undefined,
  stream: undefined,
  streamStartedAt: undefined,
  previewAttachment: null,
  pendingSkill: null,
  favorites: loadFavorites(),
  showFavorites: false,
  showAbout: false,
  confirmingClear: false,
  authorizedFolder: localStorage.getItem("taxbot_authorized_folder"),
  folderKnowledge: null,
  folderKnowledgeSent: false,
  importingFolder: false,
  importResult: null,
  thinkingLabel: null,
  toolsActive: 0,
  currentRunId: null,
  lastSkillName: null,
  _retryCount: 0,
  toastMessage: null,
  toastTimer: null,
  notifications: loadNotifications(),
  panelTab: "favorites" as const,
  customSkills: loadCustomSkills(),
  editingSkill: null,
  activeCustomSkill: null,
  showKnowledge: false,
  showSkills: false,
  showStatusMenu: false,
  knowledgeFiles: [],
  knowledgeRefs: [],
  knowledgeDragOver: false,
  knowledgeLoading: false,
  builtinSkillsCollapsed: true,
  filesSortBy: "time" as const,
  skillsSortBy: "time" as const,
  showQuickStart: !localStorage.getItem("quickstart_seen"),
};

let knowledgeDragCounter = 0;

let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let reconnectAttempt = 0;
let isReconnecting = false;
let _forceScrollBottom = true; // scroll to bottom on initial load

function cancelReconnect() {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
}

function scheduleReconnect() {
  if (reconnectTimer || isReconnecting) return;
  reconnectAttempt++;
  const delay = Math.min(2000 * reconnectAttempt, 10000);
  console.log(`[Reconnect] attempt ${reconnectAttempt} in ${delay}ms`);
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    connectGateway();
  }, delay);
}

async function connectGateway() {
  // Prevent onClose from old client triggering another reconnect
  isReconnecting = true;
  cancelReconnect();

  state.lastError = null;
  if (state.client) {
    state.client.stop();
    state.client = null;
  }

  // Try to get gateway token from Electron API or URL params
  let gatewayToken: string | undefined;
  try {
    const electronAPI = (window as any).electronAPI;
    if (electronAPI?.getGatewayToken) {
      gatewayToken = await electronAPI.getGatewayToken() || undefined;
    }
  } catch (_) { /* not in Electron */ }
  if (!gatewayToken) {
    const params = new URLSearchParams(window.location.search);
    gatewayToken = params.get("token") || undefined;
  }

  isReconnecting = false;

  state.client = new GatewayBrowserClient({
    url: state.gatewayUrl,
    clientName: "webchat-ui",
    mode: "webchat",
    token: gatewayToken,
    onHello: (hello) => {
      state.connected = true;
      state.hello = hello;
      state.lastError = null;
      reconnectAttempt = 0;
      cancelReconnect();
      renderApp();
    },
    onClose: ({ code }) => {
      state.connected = false;
      if (isReconnecting) return; // ignore close from old client during reconnect
      if (code !== 1012) {
        state.lastError = `正在等待服务启动...`;
      }
      renderApp();
      scheduleReconnect();
    },
    onEvent: (evt) => {
      // Handle events from gateway
      console.log("Gateway event:", evt.event, evt.payload);
      
      // Handle agent events (tool execution progress)
      if (evt.event === "agent") {
        const agentPayload = evt.payload as any;
        // Only process events for our session (gateway prefixes with "agent:main:")
        if (agentPayload?.sessionKey && !String(agentPayload.sessionKey).endsWith(state.sessionKey)) return;

        if (agentPayload?.stream === "tool" && agentPayload?.data) {
          const phase = agentPayload.data.phase;
          const toolName = agentPayload.data.name || "";
          if (phase === "start") {
            state.toolsActive = (state.toolsActive || 0) + 1;
            state.thinkingLabel = toolLabelMap(toolName);
            renderApp();
          } else if (phase === "result") {
            state.toolsActive = Math.max(0, (state.toolsActive || 0) - 1);
            state.thinkingLabel = "正在思考...";
            renderApp();
          }
        } else if (agentPayload?.stream === "lifecycle" && agentPayload?.data?.phase === "end") {
          // Agent run fully complete (all tool calls done, model finished).
          // This is the authoritative signal. If we're still sending and haven't
          // started fetchCompleteResponse yet, trigger it now as a safety net.
          if (state.sending) {
            state.toolsActive = 0;
            const runId = state.currentRunId || agentPayload.runId || generateUUID();
            // Delay slightly to let the "chat final" event arrive first with inline text
            setTimeout(() => {
              if (state.sending) {
                console.log("Lifecycle end triggered fetchCompleteResponse (safety net)");
                state.thinkingLabel = "正在整理回复...";
                fetchCompleteResponse(runId);
                renderApp();
              }
            }, 300);
          }
          // Agent may have installed skills during this run — sync after a short delay
          setTimeout(() => syncManagedSkills(), 2000);
        } else if (agentPayload?.stream === "assistant") {
          // Model is generating text — clear tool label
          if (state.thinkingLabel && state.thinkingLabel !== "正在思考...") {
            state.thinkingLabel = "正在思考...";
          }
        }
      }

      // Handle chat events
      if (evt.event === "chat") {
        const payload = evt.payload as any;

        // Only process events for our session (gateway prefixes with "agent:main:")
        if (payload?.sessionKey && !String(payload.sessionKey).endsWith(state.sessionKey)) {
          return;
        }

        console.log("Chat message received:", payload.message, "state:", payload.state);

        // Handle delta state (streaming message parts)
        if (payload.state === "delta" && payload?.message) {
          // Extract text from message
          const text = typeof payload.message === "string"
            ? payload.message
            : extractMessageText(payload.message);

          console.log("Extracted text:", text);

          if (text && !isSystemMessage(text)) {
            // Capture the run ID from the first delta event
            if (!state.currentRunId && state.sending && payload.runId) {
              state.currentRunId = payload.runId;
            }
            // Check if we already have a message being built for this runId
            const lastMsg = state.messages[state.messages.length - 1];
            if (lastMsg?.type === "assistant" && (lastMsg as any).id === payload.runId) {
              // Replace text (delta events contain accumulated text, not incremental)
              (lastMsg as any).text = text;
            } else {
              // Create new assistant message
              state.messages.push({
                type: "assistant",
                text: text,
                timestamp: Date.now(),
                id: payload.runId,
              });
            }
          }
          renderApp();
        }

        // Handle final state
        if (payload.state === "final") {
          // Capture currentRunId from this event if not yet set
          if (!state.currentRunId && payload.runId) {
            state.currentRunId = payload.runId;
          }

          // If this final event is from a different run than our current one,
          // it's likely a spurious final from a sub-run — ignore it
          if (state.currentRunId && payload.runId !== state.currentRunId) {
            console.log("Ignoring final from different run:", payload.runId, "expected:", state.currentRunId);
            return;
          }

          // Use inline text from final event as initial value
          let inlineText = "";
          if (payload?.message) {
            const t = typeof payload.message === "string"
              ? payload.message
              : extractMessageText(payload.message);
            if (t && !isSystemMessage(t)) {
              inlineText = t;
            }
          }

          // Apply inline text immediately so user sees something
          if (inlineText) {
            const lastMsg = state.messages[state.messages.length - 1];
            if (lastMsg?.type === "assistant" && (lastMsg as any).id === payload.runId) {
              (lastMsg as any).text = inlineText;
            } else {
              state.messages.push({
                type: "assistant",
                text: inlineText,
                timestamp: Date.now(),
                id: payload.runId,
              });
            }
            renderApp();
          }

          // If tools are still active, DON'T fetch complete response yet.
          // The lifecycle "end" handler or the next real "final" will handle it.
          if (state.toolsActive > 0) {
            console.log("Tools still active (" + state.toolsActive + "), deferring fetchCompleteResponse");
            return;
          }

          // If the final event already carries good text, finish immediately
          // instead of polling chat.history (saves 800ms-26s of delay).
          const runId = state.currentRunId || payload.runId;
          if (inlineText && !isBadResponse(inlineText)) {
            console.log("[final] Inline text is good, finishing immediately (skip polling)");
            finishSending();
          } else {
            console.log("[final] No good inline text, falling back to polling");
            state.thinkingLabel = "正在整理回复...";
            fetchCompleteResponse(runId);
            renderApp();
          }
        }

        // Handle error state
        if (payload.state === "error") {
          const errorText = payload.errorMessage || "处理请求时出错";
          state.messages.push({
            type: "assistant",
            text: `错误：${errorText}`,
            timestamp: Date.now(),
            id: generateUUID(),
          });
          finishSending();
        }
      }
    },
  });
  state.client.start();
}

// Helper function to extract text from message (similar to UI's extractText)
function extractMessageText(message: unknown): string {
  const m = message as Record<string, unknown>;
  const role = typeof m.role === "string" ? m.role : "";
  const content = m.content;
  
  if (typeof content === "string") {
    // For assistant messages, strip thinking tags
    if (role === "assistant") {
      return stripThinkingTags(content);
    }
    return content;
  }
  
  if (Array.isArray(content)) {
    const parts = content
      .map((p) => {
        const item = p as Record<string, unknown>;
        if (item?.type === "text" && typeof item.text === "string") {
          return item.text;
        }
        return null;
      })
      .filter((v): v is string => typeof v === "string");
    
    if (parts.length > 0) {
      const joined = parts.join("\n");
      // For assistant messages, strip thinking tags
      if (role === "assistant") {
        return stripThinkingTags(joined);
      }
      return joined;
    }
  }
  
  if (typeof m.text === "string") {
    if (role === "assistant") {
      return stripThinkingTags(m.text);
    }
    return m.text;
  }
  
  return "";
}

// Strip thinking tags from assistant responses
function toolLabelMap(toolName: string): string {
  const map: Record<string, string> = {
    memory_search: "正在搜索记忆...",
    memory_get: "正在读取记忆...",
    exec: "正在执行命令...",
    read: "正在读取文件...",
    write: "正在写入文件...",
    search: "正在搜索...",
    web_search: "正在搜索网络...",
    web_fetch: "正在获取网页...",
  };
  return map[toolName] || "正在思考...";
}

function stripThinkingTags(text: string): string {
  // Remove <thinking>...</thinking> and <think>...</think> tags and their content
  let cleaned = text.replace(/<thinking>[\s\S]*?<\/thinking>\n?/g, "").trim();
  cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>\n?/g, "").trim();
  // Strip <final> tag markers (keep inner content)
  cleaned = cleaned.replace(/<\/?final>/g, "").trim();
  // Strip leading "NO" only when followed by actual content (qwen-max quirk)
  cleaned = cleaned.replace(/^NO\n\n/i, "");
  return cleaned;
}

// Check if message is a system message that should not be displayed
function isSystemMessage(text: string): boolean {
  const stripped = text.trim();
  // Filter out system messages
  const systemPatterns = [
    /^NO_REPLY$/i,
    /^Pre-compaction memory flush/i,
    /^Store durable memories/i,
  ];

  return systemPatterns.some(pattern => pattern.test(stripped));
}

// Replace standalone "NO" with user-friendly message for display
// During streaming (state.sending), skip conversion — "NO" may be temporary
function sanitizeDisplayText(text: string): string {
  if (/^NO$/i.test(text.trim()) && !state.sending) {
    return "模型未能正确回复，请重新发送您的问题。";
  }
  return text;
}

// Auto-link plain URLs and Windows file paths in text before markdown rendering
function autoLinkText(text: string): string {
  const urlChars = `[^\\s<>)"'，。、；：！？》）\\]]+`;
  const pathChars = `[^\\s<>:"*?|，。、；：！？》）\\]]+`;
  const re = new RegExp(
    `(\`\`\`[\\s\\S]*?\`\`\`)` +       // group 1: code block (skip)
    `|(\\[[^\\]]*\\]\\([^)]+\\))` +     // group 2: markdown link (skip)
    "|\`([^\`]+)\`" +                    // group 3: inline code content
    `|(https?:\\/\\/${urlChars})` +      // group 4: URL
    `|([A-Za-z]:\\\\(?:${pathChars}\\\\)*${pathChars})`, // group 5: file path
    "g"
  );
  return text.replace(re, (match, codeBlock, mdLink, inlineCode, url, filePath) => {
    if (codeBlock || mdLink) return match;
    // Inline backtick code: convert if it's a path or URL, otherwise keep
    if (inlineCode !== undefined) {
      const t = inlineCode.trim();
      if (/^[A-Za-z]:\\/.test(t)) {
        const cleaned = t.replace(/[.,;:!?)]+$/, "");
        return `[${cleaned}](#localpath=${encodeURIComponent(cleaned)})`;
      }
      if (/^https?:\/\//.test(t)) {
        const cleaned = t.replace(/[.,;:!?)]+$/, "");
        return `[${cleaned}](${cleaned})`;
      }
      return match;
    }
    if (url) {
      const cleaned = url.replace(/[.,;:!?)]+$/, "");
      return `[${cleaned}](${cleaned})`;
    }
    if (filePath) {
      const cleaned = filePath.replace(/[.,;:!?)]+$/, "");
      return `[${cleaned}](#localpath=${encodeURIComponent(cleaned)})`;
    }
    return match;
  });
}

// Tax-related keyword detection for automatic 智税宝 API consultation
const TAX_KEYWORDS = /税务|纳税|增值税|所得税|印花税|发票|申报|退税|税率|税负|税局|税法|合同审核|税目|减免税|抵扣|税收|涉税|完税|税金|税款|税额|免税|征税|缴税|报税|税种|税前|税后|含税|不含税|进项|销项/;
const TAX_SKILL_NAMES = new Set(["contract-tax", "tax-review", "tax-risk"]);

function isTaxRelated(text: string): boolean {
  return TAX_KEYWORDS.test(text);
}

// Build messageList for 智税宝 API from recent conversation history
function buildTaxYesMessageList(): Array<{ input: string; answer: string }> {
  const result: Array<{ input: string; answer: string }> = [];
  const msgs = state.messages;
  // Walk backwards to find pairs, max 5 rounds
  for (let i = msgs.length - 1; i >= 0 && result.length < 5; i--) {
    const msg = msgs[i];
    if (msg.type === "assistant" && i > 0) {
      const prev = msgs[i - 1];
      if (prev?.type === "user") {
        result.unshift({ input: prev.text, answer: (msg as any).text || "" });
        i--; // skip the user message we just consumed
      }
    }
  }
  return result;
}

// Call 智税宝 API via Electron IPC (returns null on failure, doesn't block)
async function consultTaxYes(content: string): Promise<string | null> {
  try {
    const electronAPI = (window as any).electronAPI;
    if (!electronAPI?.taxYesChat) return null;
    const messageList = buildTaxYesMessageList();
    const result = await electronAPI.taxYesChat(content, messageList);
    if (result?.ok && result.answer && result.answer.trim()) {
      return result.answer.trim();
    }
    if (!result?.ok) {
      console.warn("智税宝 API error:", result?.error);
    }
    return null;
  } catch (err) {
    console.warn("智税宝 API call failed:", err);
    return null;
  }
}

// Extract text from attachments locally (PDF via pdfjs-dist in Electron main)
async function extractAttachmentTexts(attachments: typeof state.attachments): Promise<string> {
  const electronAPI = (window as any).electronAPI;
  if (!electronAPI?.extractDocumentText) return "";

  const parts: string[] = [];
  for (const att of attachments) {
    const match = /^data:([^;]+);base64,(.+)$/.exec(att.dataUrl);
    if (!match) continue;
    const mimeType = match[1];
    const base64Data = match[2];
    try {
      const result = await electronAPI.extractDocumentText(base64Data, mimeType, att.name);
      if (result?.ok && result.text?.trim()) {
        parts.push(`【${att.name}】\n${result.text.trim()}`);
      }
    } catch (err) {
      console.warn(`Failed to extract text from ${att.name}:`, err);
    }
  }
  return parts.join("\n\n");
}

// Check if text is a "bad" response (NO, error fallback, or empty)
function isBadResponse(text: string): boolean {
  const t = text.trim();
  return !t || /^NO$/i.test(t) || t === "回复获取失败，请重试。" || t === "模型未能正确回复，请重新发送您的问题。";
}

// Centralized function to finish the sending state
function finishSending() {
  // Before auto-retrying, check if there's already a real response among recent messages.
  // Delta streaming may have delivered real content while fetchCompleteResponse added error msgs.
  const recentAssistant = state.messages.filter(m => m.type === "assistant");
  const hasRealResponse = recentAssistant.some(m => !isBadResponse((m as any).text || ""));

  if (hasRealResponse) {
    // Real content exists — just clean up any bad messages and finish
    state.messages = state.messages.filter(m => {
      if (m.type === "assistant" && isBadResponse((m as any).text || "")) {
        console.log("[finishSending] Removing bad message:", ((m as any).text || "").substring(0, 40));
        return false;
      }
      return true;
    });
    state._retryCount = 0;
    state.sending = false;
    state.thinkingLabel = null;
    state.toolsActive = 0;
    state.currentRunId = null;
    saveMessages();
    renderApp();
    return;
  }

  // No real response found — auto-retry on bad response (max 1 retry)
  const lastMsg = state.messages[state.messages.length - 1];
  const lastText = ((lastMsg as any)?.text || "").trim();
  const isNoResponse = lastMsg?.type === "assistant" && /^NO$/i.test(lastText);
  const isFailResponse = lastMsg?.type === "assistant" && lastText === "回复获取失败，请重试。";

  if ((isNoResponse || isFailResponse) && state._retryCount < 1) {
    state._retryCount++;
    console.log(`[AutoRetry] Model responded with "${lastText}", retrying (attempt ${state._retryCount})`);
    // Remove the bad response
    state.messages.pop();
    state.thinkingLabel = "正在重试...";
    state.sending = true;
    state.toolsActive = 0;
    state.currentRunId = null;
    renderApp();
    // Send a follow-up to prompt the model
    const idempotencyKey = generateUUID();
    state.client?.request("chat.send", {
      sessionKey: state.sessionKey,
      message: "请直接回答上面的问题。",
      deliver: false,
      idempotencyKey,
    }).catch((err: any) => {
      console.error("Auto-retry send failed:", err);
      state.sending = false;
      state.thinkingLabel = null;
      state._retryCount = 0;
      saveMessages();
      renderApp();
    });
    return;
  }

  state._retryCount = 0;
  state.sending = false;
  state.thinkingLabel = null;
  state.toolsActive = 0;
  state.currentRunId = null;
  saveMessages();
  renderApp();
}

// Fetch complete response from session history with stabilization.
// Requires text to be unchanged across 2 consecutive fetches before finishing,
// to avoid premature completion when tool calls are still producing results.
function fetchCompleteResponse(runId: string, attempt = 1, maxAttempts = 15, prevText = ""): void {
  const delay = attempt <= 3 ? 800 : 2000;
  setTimeout(() => {
    // Already finished (e.g. by another final event or error)
    if (!state.sending) return;

    state.client?.request("chat.history", {
      sessionKey: state.sessionKey,
      limit: 20,
    }).then((result: any) => {
      if (!state.sending) return;

      if (result?.messages && result.messages.length > 0) {
        const msgs = result.messages as any[];
        let lastUserIdx = -1;
        for (let i = msgs.length - 1; i >= 0; i--) {
          if (msgs[i].role === "user") {
            lastUserIdx = i;
            break;
          }
        }
        const startIdx = lastUserIdx >= 0 ? lastUserIdx + 1 : 0;
        const assistantTexts: string[] = [];
        for (let i = startIdx; i < msgs.length; i++) {
          if (msgs[i].role === "assistant") {
            const t = extractMessageText(msgs[i]);
            if (t && !isSystemMessage(t)) {
              assistantTexts.push(t);
            }
          }
        }
        // Fallback: try tool results
        if (assistantTexts.length === 0) {
          for (let i = startIdx; i < msgs.length; i++) {
            const m = msgs[i] as any;
            const content = m.content;
            if (!Array.isArray(content)) continue;
            for (const block of content) {
              if (block?.type === "tool_result") {
                const rc = block.content;
                if (typeof rc === "string" && rc.trim()) {
                  assistantTexts.push(rc.trim());
                } else if (Array.isArray(rc)) {
                  for (const sub of rc) {
                    if (sub?.type === "text" && typeof sub.text === "string" && sub.text.trim()) {
                      assistantTexts.push(sub.text.trim());
                    }
                  }
                }
              }
            }
          }
        }

        if (assistantTexts.length > 0) {
          const historyText = assistantTexts.join("\n\n");

          // Stabilization: require text to be unchanged from previous fetch
          if (historyText === prevText && historyText.length > 0) {
            // Text stabilized — update message and finish
            const lastMsg = state.messages[state.messages.length - 1];
            if (lastMsg?.type === "assistant" && (lastMsg as any).id === runId) {
              if (historyText.length > ((lastMsg as any).text || "").length) {
                (lastMsg as any).text = historyText;
              }
            } else {
              state.messages.push({
                type: "assistant",
                text: historyText,
                timestamp: Date.now(),
                id: runId,
              });
            }
            finishSending();
            return;
          }

          // Text changed or first successful fetch — update UI and retry for stability
          if (attempt < maxAttempts) {
            const lastMsg = state.messages[state.messages.length - 1];
            if (lastMsg?.type === "assistant" && (lastMsg as any).id === runId) {
              if (historyText.length > ((lastMsg as any).text || "").length) {
                (lastMsg as any).text = historyText;
              }
            }
            renderApp();
            fetchCompleteResponse(runId, attempt + 1, maxAttempts, historyText);
            return;
          }

          // Max attempts — finish with what we have
          const lastMsg = state.messages[state.messages.length - 1];
          if (lastMsg?.type === "assistant" && (lastMsg as any).id === runId) {
            if (historyText.length > ((lastMsg as any).text || "").length) {
              (lastMsg as any).text = historyText;
            }
          } else {
            state.messages.push({
              type: "assistant",
              text: historyText,
              timestamp: Date.now(),
              id: runId,
            });
          }
          finishSending();
          return;
        }
      }
      // No text found from history polling — retry
      if (attempt < maxAttempts) {
        fetchCompleteResponse(runId, attempt + 1, maxAttempts, prevText);
      } else {
        // Before adding error fallback, check if delta events already delivered real content
        const existingReal = state.messages.some(m => m.type === "assistant" && !isBadResponse((m as any).text || ""));
        if (!existingReal) {
          // No real content anywhere — add fallback message
          const lastMsg = state.messages[state.messages.length - 1];
          if (!lastMsg || lastMsg.type !== "assistant" || (lastMsg as any).id !== runId) {
            state.messages.push({
              type: "assistant",
              text: "回复获取失败，请重试。",
              timestamp: Date.now(),
              id: runId,
            });
          }
        }
        finishSending();
      }
    }).catch(() => {
      if (attempt < maxAttempts) {
        fetchCompleteResponse(runId, attempt + 1, maxAttempts, prevText);
      } else {
        finishSending();
      }
    });
  }, delay);
}

// Handle file input
async function handleFiles(files: FileList | File[]) {
  const fileArray = Array.from(files);
  console.log("handleFiles called with", fileArray.length, "files");
  
  for (const file of fileArray) {
    console.log("Processing file:", file.name, "size:", file.size, "type:", file.type);
    
    // Limit file size to 10MB
    if (file.size > 10 * 1024 * 1024) {
      state.lastError = `文件"${file.name}"过大（>10MB），请选择更小的文件`;
      renderApp();
      continue;
    }
    
    try {
      const dataUrl = await readFileAsDataUrl(file);
      console.log("File read as data URL, length:", dataUrl.length);
      
      state.attachments.push({
        name: file.name,
        type: file.type,
        size: file.size,
        dataUrl: dataUrl,
      });
      console.log("File added to attachments, total:", state.attachments.length);
    } catch (err) {
      state.lastError = `无法读取文件"${file.name}"：${String(err)}`;
      console.error("File read error:", err);
    }
  }
  
  console.log("Final attachments count:", state.attachments.length);

  // If a skill is pending and files were added, auto-send with the skill prompt
  if (state.pendingSkill && state.attachments.length > 0) {
    const skill = state.pendingSkill;
    state.pendingSkill = null;
    state.draft = skill.prompt;
    renderApp();
    handleSend();
    return;
  }

  renderApp();
}

// Convert file to data URL
function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = () => {
      reject(reader.error);
    };
    reader.readAsDataURL(file);
  });
}

// Remove attachment
function removeAttachment(index: number) {
  state.attachments.splice(index, 1);
  renderApp();
}

// Format file size for display
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

// Sort helpers for knowledge files and skills
function sortedFiles() {
  const files = [...state.knowledgeFiles];
  if (state.filesSortBy === "name") {
    files.sort((a, b) => a.name.localeCompare(b.name, "zh"));
  } else {
    files.sort((a, b) => (b.mtime || 0) - (a.mtime || 0));
  }
  return files;
}

function sortedSkills() {
  const skills = [...state.customSkills];
  if (state.skillsSortBy === "name") {
    skills.sort((a, b) => a.name.localeCompare(b.name, "zh"));
  } else {
    skills.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  }
  return skills;
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
}

function toggleFavorite(msgId: string) {
  if (state.favorites.has(msgId)) {
    state.favorites.delete(msgId);
  } else {
    state.favorites.add(msgId);
  }
  saveFavorites();
  renderApp();
}

function scrollToMessage(msgId: string) {
  const el = document.querySelector(`[data-msg-id="${msgId}"]`) as HTMLElement | null;
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    // Brief highlight flash
    el.style.transition = "outline 0.2s";
    el.style.outline = "2px solid #00A8FF";
    setTimeout(() => { el.style.outline = "none"; }, 1500);
  }
}

function copyMessageText(msgId: string, text: string) {
  // Get plain text from the rendered markdown
  const el = document.createElement("div");
  el.innerHTML = toSanitizedMarkdownHtml(text);
  const plain = el.innerText || el.textContent || text;
  navigator.clipboard.writeText(plain).then(() => {
    // Brief visual feedback
    const btn = document.querySelector(`[data-copy-id="${msgId}"]`) as HTMLElement | null;
    if (btn) {
      btn.classList.add("copied");
      const label = btn.querySelector(".action-label") as HTMLElement | null;
      if (label) label.textContent = "已复制";
      setTimeout(() => {
        btn.classList.remove("copied");
        if (label) label.textContent = "复制";
      }, 1500);
    }
  });
}

function generateTimestamp() {
  const now = new Date();
  return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}_${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
}

function generateWordDoc(text: string): string {
  const bodyHtml = toSanitizedMarkdownHtml(text);
  return `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>智税宝</title>
<style>
  body { font-family: "Microsoft YaHei", "SimSun", sans-serif; font-size: 12pt; line-height: 1.8; color: #333; }
  table { border-collapse: collapse; width: 100%; margin: 8px 0; }
  th, td { border: 1px solid #999; padding: 6px 10px; text-align: left; }
  th { background: #f0f0f0; font-weight: bold; }
  h1 { font-size: 18pt; } h2 { font-size: 15pt; } h3 { font-size: 13pt; }
  ul, ol { padding-left: 2em; }
</style>
</head><body>${bodyHtml}</body></html>`;
}

function saveMessageAsWord(text: string) {
  const wordDoc = generateWordDoc(text);
  const blob = new Blob([wordDoc], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `智税宝_${generateTimestamp()}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function saveMessageToKnowledge(text: string) {
  const api = (window as any).electronAPI;
  if (!api?.copyToKnowledgeFolder) return;
  if (!state.authorizedFolder) {
    showToast("请先在知识库中选择文件夹");
    return;
  }
  const fileName = `智税宝_${generateTimestamp()}.doc`;
  const wordDoc = generateWordDoc(text);
  const base64 = btoa(unescape(encodeURIComponent(wordDoc)));
  try {
    await api.copyToKnowledgeFolder({
      folderPath: state.authorizedFolder,
      fileName,
      base64Data: base64,
    });
    showToast(`已保存到知识库: ${fileName}`);
    await loadKnowledgeFiles();
    await loadFolderKnowledge();
    state.folderKnowledgeSent = false;
  } catch (err) {
    console.warn("Failed to save to knowledge:", err);
    showToast("保存失败");
  }
}

function dismissQuickStart() {
  state.showQuickStart = false;
  localStorage.setItem("quickstart_seen", "1");
  renderApp();
}

function renderQuickStart() {
  return html`
    <div class="quickstart-overlay" @click=${dismissQuickStart}>
      <div class="quickstart-container" @click=${(e: Event) => e.stopPropagation()}>

        <!-- Hero -->
        <div class="qs-hero">
          <div class="qs-hero-logo"><img src="./assets/taxchat-logo.png" alt="智税宝" style="width:80px;height:80px;" /></div>
          <h1>欢迎使用智税宝</h1>
          <p>您的 AI 税务助手，帮助您分析税务风险、审核票据合同、整理报销单、管理知识库。<br/>以下是快速上手指南，帮您了解各项功能。</p>
          <div class="qs-scroll-hint">↓ 向下滚动查看功能介绍</div>
        </div>

        <!-- Section 1: Chat -->
        <div class="qs-section">
          <div class="qs-section-title"><span class="qs-section-num">1</span> 智能对话</div>
          <div class="qs-section-desc">在输入框中输入您的税务问题，智税宝会实时解答。支持多轮对话，上下文自动关联。</div>
          <div class="qs-mockup">
            <div class="qs-mockup-titlebar">
              <span class="qs-dot qs-dot-r"></span>
              <span class="qs-dot qs-dot-y"></span>
              <span class="qs-dot qs-dot-g"></span>
              <span class="qs-mockup-title">智税宝 - 对话界面</span>
            </div>
            <div style="display:flex;flex-direction:column;gap:4px;">
              <div class="qs-chat-label" style="text-align:right">用户</div>
              <div class="qs-chat-bubble qs-chat-user">我们公司收到一张咨询费发票，税率是6%，请问可以抵扣吗？</div>
              <div class="qs-chat-label">智税宝</div>
              <div class="qs-chat-bubble qs-chat-ai">根据增值税相关规定，咨询费属于<b>现代服务业</b>范畴，一般纳税人取得的6%税率增值税专用发票，可以按照票面注明的税额进行<b>进项税额抵扣</b>。需要注意以下几点：<br/>1. 确保发票为增值税专用发票<br/>2. 业务真实性、合理性需有合同支撑<br/>3. 需在规定期限内认证</div>
              <div class="qs-chat-label" style="text-align:right">用户</div>
              <div class="qs-chat-bubble qs-chat-user">如果是小规模纳税人呢？</div>
              <div class="qs-chat-bubble qs-chat-ai" style="max-width:75%">小规模纳税人采用<b>简易计税</b>方法，不存在进项抵扣的概念。取得的发票直接计入成本费用即可。</div>
            </div>
          </div>
        </div>

        <!-- Section 2: Quick Skills -->
        <div class="qs-section">
          <div class="qs-section-title"><span class="qs-section-num">2</span> 快捷技能</div>
          <div class="qs-section-desc">点击快捷按钮即可启用专业税务技能。上传文件后自动分析，无需输入复杂指令。</div>
          <div class="qs-mockup">
            <div class="qs-mockup-titlebar">
              <span class="qs-dot qs-dot-r"></span>
              <span class="qs-dot qs-dot-y"></span>
              <span class="qs-dot qs-dot-g"></span>
              <span class="qs-mockup-title">快捷操作栏</span>
            </div>
            <div class="qs-btn-row">
              <div class="qs-btn-mock"><span class="qs-btn-mock-icon">🧾</span> 税务风险治理</div>
              <div class="qs-btn-mock"><span class="qs-btn-mock-icon">📊</span> 申报表预审</div>
              <div class="qs-btn-mock"><span class="qs-btn-mock-icon">📝</span> 合同及票据税审</div>
              <div class="qs-btn-mock"><span class="qs-btn-mock-icon">🧾</span> 票据整理</div>
              <div class="qs-btn-mock"><span class="qs-btn-mock-icon">📚</span> 知识库</div>
              <div class="qs-btn-mock"><span class="qs-btn-mock-icon">🏥</span> 全面税务体检</div>
            </div>
            <div style="margin-top:14px;font-size:12px;color:#64748b;line-height:1.8;">
              <b>🧾 税务风险治理</b> — 上传风险文件，自动生成说明函和应对策略<br/>
              <b>📊 申报表预审</b> — 上传纳税申报表和财务报表，自动比对差异<br/>
              <b>📝 合同及票据税审</b> — 上传合同或票据，计算税额并给出风险提示<br/>
              <b>🧾 票据整理</b> — 扫描整个文件夹的票据，分类整理生成报销单（Excel）<br/>
              <b>📚 知识库</b> — 在授权文件夹中搜索、阅读、提取文件摘要<br/>
              <b>🏥 全面税务体检</b> — 跳转在线税务体检平台
            </div>
          </div>
        </div>

        <!-- Section 3: File Upload -->
        <div class="qs-section">
          <div class="qs-section-title"><span class="qs-section-num">3</span> 文件上传与分析</div>
          <div class="qs-section-desc">支持上传图片、PDF、Word、Excel 文件。可以拖拽到对话区域或点击上传按钮。AI 自动识别文件内容进行分析。</div>
          <div class="qs-mockup">
            <div class="qs-mockup-titlebar">
              <span class="qs-dot qs-dot-r"></span>
              <span class="qs-dot qs-dot-y"></span>
              <span class="qs-dot qs-dot-g"></span>
              <span class="qs-mockup-title">文件上传</span>
            </div>
            <div class="qs-upload-zone">
              📎 拖拽文件到这里上传<br/>
              <span style="font-size:11px;color:#cbd5e1;">支持 JPG / PNG / PDF / DOCX / XLSX</span>
            </div>
            <div class="qs-attachment-row">
              <div class="qs-attachment-thumb">
                📄
                <span class="qs-attachment-x">✕</span>
              </div>
              <div class="qs-attachment-thumb" style="background:#e0f2fe;">
                🖼️
                <span class="qs-attachment-x">✕</span>
              </div>
              <div class="qs-attachment-thumb">
                📊
                <span class="qs-attachment-x">✕</span>
              </div>
              <div style="flex:1;display:flex;align-items:center;padding-left:12px;">
                <span style="font-size:12px;color:#94a3b8;">← 已上传的文件会显示缩略图，点击 ✕ 可移除</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 4: Knowledge Panel -->
        <div class="qs-section">
          <div class="qs-section-title"><span class="qs-section-num">4</span> 知识库管理</div>
          <div class="qs-section-desc">授权一个文件夹作为知识库，智税宝会学习其中的文件内容。点击"引用"可将特定文件作为上下文发送。新文件会自动被学习。</div>
          <div class="qs-mockup">
            <div class="qs-mockup-titlebar">
              <span class="qs-dot qs-dot-r"></span>
              <span class="qs-dot qs-dot-y"></span>
              <span class="qs-dot qs-dot-g"></span>
              <span class="qs-mockup-title">知识库面板（右侧边栏）</span>
            </div>
            <div class="qs-panel-mock">
              <div class="qs-panel-header">
                <span class="qs-panel-tab qs-panel-tab-active">📚 知识库文件</span>
                <span class="qs-panel-tab qs-panel-tab-inactive">🛠 自定义技能</span>
              </div>
              <div style="display:flex;align-items:center;gap:6px;padding:4px 0 8px;font-size:11px;color:#64748b;">
                <span>📂 D:\\我的文档\\税务资料</span>
                <span style="color:#00A8FF;cursor:default;">更换</span>
                <span style="color:#00A8FF;cursor:default;">刷新</span>
              </div>
              <div class="qs-file-row">
                <span class="qs-file-icon">📄</span>
                <span class="qs-file-name">2024年度纳税申报表.pdf</span>
                <span class="qs-file-size">2.3MB</span>
                <span class="qs-file-btn">引用</span>
              </div>
              <div class="qs-file-row">
                <span class="qs-file-icon">📊</span>
                <span class="qs-file-name">财务报表汇总.xlsx</span>
                <span class="qs-file-size">856KB</span>
                <span class="qs-file-btn">引用</span>
              </div>
              <div class="qs-file-row">
                <span class="qs-file-icon">📝</span>
                <span class="qs-file-name">服务合同-2024.docx</span>
                <span class="qs-file-size">145KB</span>
                <span class="qs-file-btn">引用</span>
              </div>
              <div style="text-align:center;padding:8px;font-size:11px;color:#94a3b8;">
                拖拽文件到此处可添加到知识库
              </div>
            </div>
          </div>
        </div>

        <!-- Section 5: Custom Skills -->
        <div class="qs-section">
          <div class="qs-section-title"><span class="qs-section-num">5</span> 自定义技能</div>
          <div class="qs-section-desc">在知识库面板的"自定义技能"选项卡中创建专属技能。设置技能名称、图标和操作指令，还可以导入他人分享的技能包（.zip）。固定的技能会出现在快捷按钮栏。</div>
          <div class="qs-mockup">
            <div class="qs-mockup-titlebar">
              <span class="qs-dot qs-dot-r"></span>
              <span class="qs-dot qs-dot-y"></span>
              <span class="qs-dot qs-dot-g"></span>
              <span class="qs-mockup-title">自定义技能管理</span>
            </div>
            <div class="qs-skill-card">
              <span class="qs-skill-emoji">💰</span>
              <div class="qs-skill-info">
                <div class="qs-skill-name">税收优惠查询</div>
                <div class="qs-skill-desc">查询适用的税收优惠政策</div>
              </div>
              <div class="qs-skill-actions">
                <span class="qs-skill-action-btn">⭐ 固定</span>
                <span class="qs-skill-action-btn">✏️ 编辑</span>
                <span class="qs-skill-action-btn">📤 导出</span>
              </div>
            </div>
            <div class="qs-skill-card">
              <span class="qs-skill-emoji">📋</span>
              <div class="qs-skill-info">
                <div class="qs-skill-name">发票真伪查验</div>
                <div class="qs-skill-desc">核验发票信息是否合规</div>
              </div>
              <div class="qs-skill-actions">
                <span class="qs-skill-action-btn">⭐ 固定</span>
                <span class="qs-skill-action-btn">✏️ 编辑</span>
                <span class="qs-skill-action-btn">📤 导出</span>
              </div>
            </div>
            <div style="display:flex;gap:8px;margin-top:8px;">
              <div class="qs-btn-mock" style="background:#eff6ff;color:#00A8FF;border:1px dashed #00A8FF;">➕ 新建技能</div>
              <div class="qs-btn-mock" style="background:#f0fdf4;color:#22c55e;border:1px dashed #22c55e;">📦 导入技能包</div>
            </div>
          </div>
        </div>

        <!-- Section 6: Message Actions -->
        <div class="qs-section">
          <div class="qs-section-title"><span class="qs-section-num">6</span> 消息操作</div>
          <div class="qs-section-desc">鼠标悬停在 AI 回复上方，会浮现操作按钮。可以复制文本、导出为 Word 文档、收藏到侧栏、或存入知识库文件夹。</div>
          <div class="qs-mockup">
            <div class="qs-mockup-titlebar">
              <span class="qs-dot qs-dot-r"></span>
              <span class="qs-dot qs-dot-y"></span>
              <span class="qs-dot qs-dot-g"></span>
              <span class="qs-mockup-title">消息悬浮操作</span>
            </div>
            <div style="position:relative;padding:8px 0;">
              <div class="qs-chat-bubble qs-chat-ai" style="max-width:100%;">
                根据您上传的合同，涉及以下税目：<br/>
                1. 增值税（6%）：咨询服务费 50,000 元，税额 2,830.19 元<br/>
                2. 印花税：技术合同按 0.03% 贴花，税额 15 元<br/>
                <b>风险提示：</b>合同未注明价税分离条款，建议补充。
              </div>
              <div style="display:flex;justify-content:flex-start;margin-top:6px;">
                <div class="qs-msg-actions">
                  <span class="qs-msg-action">📋 复制</span>
                  <span class="qs-msg-action">📝 导出Word</span>
                  <span class="qs-msg-action">⭐ 收藏</span>
                  <span class="qs-msg-action">💾 存入知识库</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 7: Tips -->
        <div class="qs-section">
          <div class="qs-section-title"><span class="qs-section-num">7</span> 实用技巧</div>
          <div class="qs-section-desc" style="margin-bottom:0;">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
              <div style="background:#f0f9ff;padding:12px;border-radius:8px;">
                <b style="color:#0070CC;">📂 知识库自动学习</b><br/>
                <span style="font-size:13px;">授权文件夹后，新增文件会被自动学习。无需手动导入。</span>
              </div>
              <div style="background:#fefce8;padding:12px;border-radius:8px;">
                <b style="color:#a16207;">⭐ 收藏重要回复</b><br/>
                <span style="font-size:13px;">点击收藏后，可随时从左侧面板快速查找历史回复。</span>
              </div>
              <div style="background:#f0fdf4;padding:12px;border-radius:8px;">
                <b style="color:#15803d;">📎 引用知识库文件</b><br/>
                <span style="font-size:13px;">在知识库面板点击"引用"，该文件内容会作为上下文发送给 AI。</span>
              </div>
              <div style="background:#fdf2f8;padding:12px;border-radius:8px;">
                <b style="color:#be185d;">🛠 固定常用技能</b><br/>
                <span style="font-size:13px;">自定义技能点击"固定"后会出现在快捷按钮栏，一键使用。</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="qs-footer">
          <button class="qs-btn-start" @click=${dismissQuickStart}>开始使用智税宝 →</button>
          <div class="qs-tip">您可以随时在"关于"弹窗中重新查看此指南</div>
        </div>

      </div>
    </div>
  `;
}

function renderMessages() {
  if (state.messages.length === 0) {
    return html`
      <div class="empty-state">
        <div class="empty-state__icon">
          <img src="./assets/taxchat-logo.png" alt="智税宝" style="width: 120px; height: 120px;" />
        </div>
        <div class="empty-state__text">
          <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">欢迎来到智税宝</div>
          <div>有任何税务问题？请在下方输入并提问</div>
        </div>
      </div>
    `;
  }

  const groups: typeof html[] = [];
  
  for (const msg of state.messages) {
    if (msg.type === "user") {
      groups.push(html`
        <div class="message-group">
          <div class="message-item user">
            <div class="message-content user">
              ${msg.text ? html`<div class="message-bubble user">${msg.text}</div>` : ""}
              ${msg.attachments && msg.attachments.length > 0 ? html`
                <div class="message-attachments">
                  ${msg.attachments.map(att => html`
                    <div class="attachment-thumbnail" @click=${() => {
                      state.previewAttachment = att;
                      renderApp();
                    }}>
                      ${att.type.startsWith("image/") ? html`
                        <img src=${att.dataUrl} alt=${att.name} class="thumbnail-image" />
                      ` : html`
                        <div class="thumbnail-file">
                          <span class="file-icon">📄</span>
                          <span class="file-name">${att.name}</span>
                        </div>
                      `}
                    </div>
                  `)}
                </div>
              ` : ""}
            </div>
            <div class="message-avatar user">👤</div>
          </div>
          <div class="message-time">${formatTime(msg.timestamp)}</div>
        </div>
      `);
    } else {
      const isFav = state.favorites.has(msg.id);
      groups.push(html`
        <div class="message-group" data-msg-id="${msg.id}">
          <div class="message-item">
            <div class="message-avatar assistant"><img src="./assets/taxchat-logo.png" alt="智税宝" /></div>
            <div class="message-bubble assistant markdown-body ${isFav ? "favorited" : ""}">${unsafeHTML(toSanitizedMarkdownHtml(autoLinkText(sanitizeDisplayText(msg.text))))}</div>
          </div>
          <div class="message-actions">
            <button class="message-action-btn" data-copy-id="${msg.id}" @click=${() => copyMessageText(msg.id, msg.text)} title="复制文本">
              <span class="action-icon">📋</span><span class="action-label">复制</span>
            </button>
            <button class="message-action-btn" @click=${() => saveMessageAsWord(msg.text)} title="保存为Word文档">
              <span class="action-icon">💾</span><span class="action-label">保存Word</span>
            </button>
            <button class="message-action-btn" @click=${() => saveMessageToKnowledge(msg.text)} title="保存到知识库">
              <span class="action-icon">📚</span><span class="action-label">存知识库</span>
            </button>
            <button class="message-action-btn ${isFav ? "fav-active" : ""}" @click=${() => toggleFavorite(msg.id)} title="${isFav ? "取消收藏" : "收藏"}">
              <span class="action-icon">${isFav ? "⭐" : "☆"}</span><span class="action-label">${isFav ? "已收藏" : "收藏"}</span>
            </button>
          </div>
          <div class="message-time">${formatTime(msg.timestamp)}</div>
        </div>
      `);
    }
  }

  if (state.sending) {
    groups.push(html`
      <div class="message-group">
        <div class="message-item">
          <div class="message-avatar assistant"><img src="./assets/taxchat-logo.png" alt="智税宝" /></div>
          <div class="message-bubble assistant">
            <div class="thinking-indicator">
              ${state.thinkingLabel ? html`<span class="thinking-label">${state.thinkingLabel}</span>` : ""}
              <div class="loading-dots">
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `);
  }

  return html`${groups}`;
}


function renderApp() {
  const app = document.getElementById("app");
  if (!app) return;

  // Persist messages to localStorage on every render
  saveMessages();

  // Always show chat interface, connection status only in header
  const statusText = state.connected ? "已连接" : "连接中...";
  const statusClass = state.connected ? "ok" : "";

  const content = html`
    <div class="taxchat-app">
      <header class="taxchat-header">
        <div class="taxchat-header__title" @click=${() => { state.showAbout = true; renderApp(); }} style="cursor: pointer;" title="关于智税宝">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div class="taxchat-header__logo">
              <img src="./assets/taxchat-logo.png" alt="智税宝" />
            </div>
            <h1>智税宝</h1>
            <div class="taxchat-header__status" @click=${(e: Event) => { e.stopPropagation(); state.showStatusMenu = !state.showStatusMenu; renderApp(); }}>
              <span class="status-dot ${statusClass}"></span> ${statusText} <span class="status-arrow">▾</span>
              ${state.showStatusMenu ? html`
                <div class="status-menu" @click=${(e: Event) => e.stopPropagation()}>
                  ${state.connected ? html`
                    <div class="status-menu__item" @click=${() => { state.showStatusMenu = false; const api = (window as any).electronAPI; if (api?.restartGateway) api.restartGateway(); setTimeout(() => connectGateway(), 2000); renderApp(); }}>重连 Gateway</div>
                    <div class="status-menu__item" @click=${() => { state.showStatusMenu = false; const api = (window as any).electronAPI; if (api?.stopGateway) api.stopGateway(); state.connected = false; cancelReconnect(); renderApp(); }}>关闭 Gateway</div>
                  ` : html`
                    <div class="status-menu__item" @click=${() => { state.showStatusMenu = false; const api = (window as any).electronAPI; if (api?.startGateway) api.startGateway(); setTimeout(() => connectGateway(), 2000); renderApp(); }}>连接 Gateway</div>
                  `}
                </div>
              ` : ""}
            </div>
          </div>
        </div>
        <div class="taxchat-header__right">
          <button class="favorites-toggle-btn ${state.showFavorites ? "active" : ""}" @click=${() => { state.showFavorites = !state.showFavorites; state.showKnowledge = false; state.showSkills = false; renderApp(); }} title="收藏夹">
            <span>⭐</span>
            ${state.favorites.size > 0 ? html`<span class="fav-badge">${state.favorites.size}</span>` : ""}
          </button>
          <button class="knowledge-toggle-btn ${state.showKnowledge ? "active" : ""}" @click=${() => { state.showKnowledge = !state.showKnowledge; state.showFavorites = false; state.showSkills = false; if (state.showKnowledge) loadKnowledgeFiles(); renderApp(); }} title="知识库">
            知识库
          </button>
          <button class="knowledge-toggle-btn ${state.showSkills ? "active" : ""}" @click=${() => { state.showSkills = !state.showSkills; state.showFavorites = false; state.showKnowledge = false; renderApp(); }} title="技能管理">
            技能
          </button>
        </div>
      </header>

      <div class="taxchat-body">
        <div class="taxchat-main">
          <div class="taxchat-messages" id="messages-container">
            ${renderMessages()}
          </div>

      <div class="taxchat-input-area">
        <div class="taxchat-quick-actions">
          <button
            class="quick-action-btn"
            ?disabled=${state.sending}
            @click=${() => handleQuickSkill("tax-risk", "请按照税务风险治理流程，分析我上传的文件内容，识别税务风险点，给出风险分析、说明函、应对话术和操作建议。请直接分析文件内容，不要调用任何工具或命令。", "税务风险治理")}
            title="上传税务风险文件，自动分析并生成说明函"
          >
            <span class="qa-icon">🧾</span>
            <span>税务风险治理</span>
          </button>
          <button
            class="quick-action-btn"
            ?disabled=${state.sending}
            @click=${() => handleQuickSkill("tax-review", "请按照纳税申报表预审流程，分析我上传的纳税申报表和财务报表，比对两个表格的数据差异，以表格形式输出比对结果，并分析税务风险给出处理建议。请直接分析文件内容，不要调用任何工具或命令。", "纳税申报表预审")}
            title="上传纳税申报表和财务报表，自动比对分析"
          >
            <span class="qa-icon">📊</span>
            <span>申报表预审</span>
          </button>
          <button
            class="quick-action-btn"
            ?disabled=${state.sending}
            @click=${() => handleQuickSkill("contract-tax", "请按照票据合同税务审核流程，从税务角度分析我上传的合同或票据，列支涉及的税目并计算相关税额，给出风险提示和修改建议。请直接分析文件内容，不要调用任何工具或命令。", "合同税务审核")}
            title="上传合同或票据，从税务角度审核分析"
          >
            <span class="qa-icon">📝</span>
            <span>合同及票据税审</span>
          </button>
          <button
            class="quick-action-btn"
            ?disabled=${state.sending}
            @click=${() => handleQuickSkill("invoice-check", BUILTIN_SKILLS[3].prompt, "发票查验")}
            title="上传发票图片/PDF/XML，查验发票真伪并分析风险"
          >
            <span class="qa-icon">🔍</span>
            <span>发票查验</span>
          </button>
          <button
            class="quick-action-btn"
            ?disabled=${state.sending}
            @click=${() => handleQuickSkill("receipt-organizer", BUILTIN_SKILLS[4].prompt, "票据整理", true)}
            title="扫描文件夹中的票据，按类型分类整理，生成报销单"
          >
            <span class="qa-icon">🧾</span>
            <span>票据整理</span>
          </button>
          <button
            class="quick-action-btn"
            ?disabled=${state.sending}
            @click=${() => {
              if (!state.authorizedFolder) {
                showToast("请先在知识库面板中选择文件夹");
                state.showKnowledge = true;
                state.showSkills = false;
                renderApp();
                return;
              }
              handleCustomSkillClick(BUILTIN_SKILLS[5]);
            }}
            title="在指定文件夹中检索文件、提取摘要、搜索内容"
          >
            <span class="qa-icon">📚</span>
            <span>知识库</span>
          </button>
          <button
            class="quick-action-btn"
            @click=${() => { window.open("https://ai.taxyes.com/taxCheck", "_blank"); }}
            title="打开全面税务体检页面"
          >
            <span class="qa-icon">🏥</span>
            <span>全面税务体检</span>
          </button>
          <button
            class="quick-action-btn"
            ?disabled=${state.sending}
            @click=${() => {
              const fileInput = document.createElement("input");
              fileInput.type = "file";
              fileInput.accept = "image/*,.pdf,.doc,.docx,.xls,.xlsx";
              fileInput.multiple = true;
              fileInput.onchange = () => {
                if (fileInput.files && fileInput.files.length > 0) {
                  handleFiles(fileInput.files);
                }
              };
              fileInput.click();
            }}
            title="上传图片或文件"
          >
            <span class="qa-icon">📎</span>
            <span>上传文件</span>
          </button>
          ${state.customSkills.filter(s => s.pinned).sort((a, b) => a.createdAt - b.createdAt).map(sk => html`
            <button
              class="quick-action-btn custom"
              ?disabled=${state.sending}
              @click=${() => handleCustomSkillClick(sk)}
              title=${sk.description || sk.name}
            >
              <span class="qa-icon">${sk.emoji}</span>
              <span>${sk.name}</span>
            </button>
          `)}
        </div>

        <div class="taxchat-input-container"
          @dragover=${(e: DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            state.dragOver = true;
            renderApp();
          }}
          @dragleave=${(e: DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            state.dragOver = false;
            renderApp();
          }}
          @drop=${(e: DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            state.dragOver = false;
            console.log("Drop event, files:", e.dataTransfer?.files?.length);
            if (e.dataTransfer?.files) {
              handleFiles(e.dataTransfer.files);
            }
          }}
          class=${state.dragOver ? "taxchat-input-container drag-over" : "taxchat-input-container"}
        >
          ${state.activeCustomSkill ? html`
            <div class="skill-prompt-bubble">
              <span class="skill-prompt-bubble__emoji">${state.activeCustomSkill.emoji}</span>
              <span class="skill-prompt-bubble__text">${state.activeCustomSkill.name}${state.activeCustomSkill.description ? ` · ${state.activeCustomSkill.description}` : ""}</span>
              <button class="skill-prompt-bubble__close" @click=${() => clearActiveCustomSkill()} title="取消技能">✕</button>
            </div>
          ` : ""}
          <textarea
            id="message-input"
            class="taxchat-input"
            rows="1"
            placeholder=${state.activeCustomSkill ? `请输入内容，将按「${state.activeCustomSkill.name}」流程处理...` : "输入您的税务问题...或拖入/粘贴文件"}
            .value=${state.draft}
            @input=${(e: Event) => {
              const ta = e.target as HTMLTextAreaElement;
              state.draft = ta.value;
              // Auto-resize: reset height then set to scrollHeight (capped by CSS max-height)
              ta.style.height = "auto";
              ta.style.height = ta.scrollHeight + "px";
              renderApp();
            }}
            @keydown=${(e: KeyboardEvent) => {
              if (e.key === "Enter" && !e.ctrlKey && !e.shiftKey && !e.isComposing) {
                e.preventDefault();
                handleSend();
              }
            }}
            @paste=${(e: ClipboardEvent) => {
              console.log("Paste event, files:", e.clipboardData?.files?.length);
              if (e.clipboardData?.files && e.clipboardData.files.length > 0) {
                e.preventDefault();
                handleFiles(e.clipboardData.files);
              }
            }}
            ?disabled=${state.sending}
            rows="1"
          ></textarea>
          
          ${state.dragOver ? html`
            <div class="drag-overlay">
              <div class="drag-text">📁 拖入文件即可上传</div>
            </div>
          ` : ""}
        </div>

        ${state.attachments.length > 0 ? html`
          <div class="attachments-list">
            ${state.attachments.map((att, idx) => html`
              <div class="attachment-item">
                <span class="attachment-icon">📎</span>
                <span class="attachment-name" title=${att.name}>${att.name}</span>
                <span class="attachment-size">${formatFileSize(att.size)}</span>
                <button
                  class="attachment-remove"
                  @click=${() => removeAttachment(idx)}
                  title="移除"
                >
                  ✕
                </button>
              </div>
            `)}
          </div>
        ` : ""}

        ${state.knowledgeRefs.length > 0 ? html`
          <div class="knowledge-refs-list">
            ${state.knowledgeRefs.map((ref, idx) => html`
              <div class="knowledge-ref-item">
                <span class="kr-icon">📚</span>
                <span class="kr-name" title=${ref.name}>${ref.name}</span>
                <button class="kr-remove" @click=${() => removeKnowledgeRef(idx)} title="移除引用">✕</button>
              </div>
            `)}
          </div>
        ` : ""}

        <div class="taxchat-input-actions">
          <button
            class="taxchat-button primary"
            ?disabled=${state.sending || (state.draft.trim().length === 0 && state.attachments.length === 0 && state.knowledgeRefs.length === 0)}
            @click=${handleSend}
            title="发送消息 (Enter)"
          >
            <span class="button-icon">➤</span>
            <span>发送</span>
          </button>
        </div>
      </div>
        </div><!-- /taxchat-main -->

        <div class="favorites-panel ${state.showFavorites ? "open" : ""}">
          <div class="favorites-panel__header">
            <div class="panel-tabs">
              <button class="panel-tab ${state.panelTab === "favorites" ? "active" : ""}" @click=${() => { state.panelTab = "favorites"; renderApp(); }}>
                <span>⭐</span> 收藏夹
              </button>
              <button class="panel-tab ${state.panelTab === "notifications" ? "active" : ""}" @click=${() => { state.panelTab = "notifications"; renderApp(); }}>
                <span>🔔</span> 消息${state.notifications.length > 0 ? html` <span class="panel-tab__badge">${state.notifications.length}</span>` : ""}
              </button>
            </div>
            <button class="favorites-panel__close" @click=${() => { state.showFavorites = false; renderApp(); }}>✕</button>
          </div>

          ${state.panelTab === "favorites" ? html`
          <div class="favorites-panel__list">
            ${(() => {
              const favMsgs = state.messages.filter(m => m.type === "assistant" && state.favorites.has(m.id));
              if (favMsgs.length === 0) {
                return html`<div class="favorites-empty">暂无收藏</div>`;
              }
              return favMsgs.map(m => html`
                <div class="favorites-item" @click=${() => scrollToMessage(m.id)}>
                  <div class="favorites-item__text">${m.text.length > 80 ? m.text.slice(0, 80) + "..." : m.text}</div>
                  <div class="favorites-item__meta">
                    <span>${formatTime(m.timestamp)}</span>
                    <button class="favorites-item__remove" @click=${(e: Event) => { e.stopPropagation(); toggleFavorite(m.id); }} title="取消收藏">✕</button>
                  </div>
                </div>
              `);
            })()}
          </div>
          ` : html`
          <div class="favorites-panel__list">
            ${state.notifications.length === 0
              ? html`<div class="favorites-empty">暂无消息</div>`
              : [...state.notifications].reverse().map(n => html`
                <div class="notif-item">
                  <div class="notif-item__icon">${n.icon}</div>
                  <div class="notif-item__body">
                    <div class="notif-item__text">${n.text}</div>
                    <div class="notif-item__time">${formatTime(n.timestamp)}</div>
                  </div>
                  <button class="notif-item__remove" @click=${() => {
                    state.notifications = state.notifications.filter(x => x.id !== n.id);
                    saveNotifications();
                    renderApp();
                  }} title="删除">✕</button>
                </div>
              `)
            }
            ${state.notifications.length > 0 ? html`
              <div style="padding: 8px; text-align: center;">
                <button class="notif-clear-btn" @click=${() => {
                  state.notifications = [];
                  saveNotifications();
                  renderApp();
                }}>清空所有消息</button>
              </div>
            ` : ""}
          </div>
          `}
        </div>

        <div class="knowledge-panel ${state.showKnowledge ? "open" : ""}">
          <div class="knowledge-panel__header">
            <span class="panel-title">📂 知识库</span>
            <button class="favorites-panel__close" @click=${() => { state.showKnowledge = false; renderApp(); }}>✕</button>
          </div>
          <div class="knowledge-panel__body"
            @dragover=${(e: DragEvent) => { e.preventDefault(); e.stopPropagation(); }}
            @dragenter=${(e: DragEvent) => { e.preventDefault(); e.stopPropagation(); knowledgeDragCounter++; if (!state.knowledgeDragOver) { state.knowledgeDragOver = true; renderApp(); } }}
            @dragleave=${(e: DragEvent) => { e.preventDefault(); e.stopPropagation(); knowledgeDragCounter--; if (knowledgeDragCounter <= 0) { knowledgeDragCounter = 0; state.knowledgeDragOver = false; renderApp(); } }}
            @drop=${(e: DragEvent) => { e.preventDefault(); e.stopPropagation(); knowledgeDragCounter = 0; state.knowledgeDragOver = false; renderApp(); handleKnowledgeDrop(e); }}
          >
            ${!state.authorizedFolder ? html`
              <div class="knowledge-empty">
                <div style="font-size: 36px; margin-bottom: 12px;">📂</div>
                <div style="margin-bottom: 16px; color: #6b7280;">尚未选择知识库文件夹</div>
                <button class="skill-add-btn" @click=${() => handleAuthorizeFolder().then(() => loadKnowledgeFiles())}>📂 选择文件夹</button>
              </div>
            ` : html`
              <div class="knowledge-folder-bar">
                <span class="knowledge-folder-path" title=${state.authorizedFolder}>📂 ${state.authorizedFolder}</span>
                <button class="knowledge-folder-change" @click=${() => handleAuthorizeFolder().then(() => loadKnowledgeFiles())} title="更换文件夹">更换</button>
                <button class="knowledge-folder-change" @click=${() => loadKnowledgeFiles()} title="刷新文件列表">刷新</button>
              </div>
              ${state.knowledgeFiles.length > 0 ? html`
                <div class="sort-bar">
                  <span class="sort-bar__label">排序:</span>
                  <button class="sort-bar__btn ${state.filesSortBy === "time" ? "active" : ""}" @click=${() => { state.filesSortBy = "time"; renderApp(); }}>按时间</button>
                  <button class="sort-bar__btn ${state.filesSortBy === "name" ? "active" : ""}" @click=${() => { state.filesSortBy = "name"; renderApp(); }}>按名称</button>
                </div>
              ` : ""}
              ${state.knowledgeDragOver ? html`
                <div class="knowledge-drop-zone">
                  <div class="knowledge-drop-text">📁 松开以添加文件到知识库</div>
                </div>
              ` : ""}
              ${state.knowledgeLoading ? html`
                <div class="knowledge-empty">加载中...</div>
              ` : state.knowledgeFiles.length === 0 ? html`
                <div class="knowledge-empty">文件夹中没有可识别的文件<br><small>支持: txt, pdf, docx, xlsx, csv, json, md 等</small></div>
              ` : sortedFiles().map(f => html`
                <div class="knowledge-file-item">
                  <span class="knowledge-file-icon">${f.type === "image" ? "🖼" : f.type === "doc" ? "📊" : "📄"}</span>
                  <span class="knowledge-file-name" title=${f.name}>${f.name}</span>
                  <span class="knowledge-file-size">${formatFileSize(f.size)}</span>
                  <button class="knowledge-file-btn ref" @click=${() => addKnowledgeRef(f.name)} title="引用到对话">引用</button>
                  <button class="knowledge-file-btn del" @click=${() => deleteKnowledgeFileAction(f.name)} title="删除文件">🗑</button>
                </div>
              `)}
            `}
          </div>
        </div>

        <div class="skills-panel ${state.showSkills ? "open" : ""}">
          <div class="skills-panel__header">
            <span class="panel-title">🛠 技能管理</span>
            <button class="favorites-panel__close" @click=${() => { state.showSkills = false; renderApp(); }}>✕</button>
          </div>
          <div class="skills-panel__body">
            <div class="skill-section-header" @click=${() => { state.builtinSkillsCollapsed = !state.builtinSkillsCollapsed; renderApp(); }}>
              <span class="skill-section-arrow ${state.builtinSkillsCollapsed ? "collapsed" : ""}">▾</span>
              <span class="skill-section-label">预制技能</span>
              <span class="skill-section-count">${BUILTIN_SKILLS.length}</span>
            </div>
            ${state.builtinSkillsCollapsed ? "" : BUILTIN_SKILLS.map(sk => html`
              <div class="skill-item skill-item--builtin">
                <div class="skill-item__emoji" @click=${() => handleCustomSkillClick(sk)} style="cursor:pointer">${sk.emoji}</div>
                <div class="skill-item__body" @click=${() => handleCustomSkillClick(sk)} style="cursor:pointer">
                  <div class="skill-item__name">${sk.name} <span class="skill-builtin-badge">预制</span></div>
                  ${sk.description ? html`<div class="skill-item__desc">${sk.description}</div>` : ""}
                </div>
              </div>
            `)}
            <div class="skill-section-label" style="margin-top: 12px; padding-left: 12px;">自定义技能</div>
            <div class="skill-add-row">
              <button class="skill-add-btn" @click=${() => openSkillEditor()}>➕ 新建 Skill</button>
              <button class="skill-add-btn" @click=${() => handleInstallSkillPackage()}>📦 上传技能包</button>
            </div>
            ${state.customSkills.length > 1 ? html`
              <div class="sort-bar">
                <span class="sort-bar__label">排序:</span>
                <button class="sort-bar__btn ${state.skillsSortBy === "time" ? "active" : ""}" @click=${() => { state.skillsSortBy = "time"; renderApp(); }}>按时间</button>
                <button class="sort-bar__btn ${state.skillsSortBy === "name" ? "active" : ""}" @click=${() => { state.skillsSortBy = "name"; renderApp(); }}>按名称</button>
              </div>
            ` : ""}
            ${state.customSkills.length === 0
              ? html`<div class="knowledge-empty" style="padding: 12px;">暂无自定义技能</div>`
              : sortedSkills().map(sk => html`
                <div class="skill-item skill-item--custom">
                  <div class="skill-item__emoji" @click=${() => handleCustomSkillClick(sk)} style="cursor:pointer">${sk.emoji}</div>
                  <div class="skill-item__body" @click=${() => handleCustomSkillClick(sk)} style="cursor:pointer">
                    <div class="skill-item__name">${sk.name}</div>
                    ${sk.description ? html`<div class="skill-item__desc">${sk.description}</div>` : ""}
                  </div>
                  <div class="skill-item__actions">
                    <button class="skill-item__btn ${sk.pinned ? "pinned" : ""}" @click=${() => toggleSkillPin(sk.id)} title="${sk.pinned ? "取消快捷" : "添加到快捷"}">📌</button>
                    <button class="skill-item__btn" @click=${() => exportSkillAsZip(sk)} title="导出">📤</button>
                    <button class="skill-item__btn" @click=${() => openSkillEditor(sk)} title="编辑">✏️</button>
                    <button class="skill-item__btn" @click=${() => deleteCustomSkill(sk.id)} title="删除">🗑</button>
                  </div>
                </div>
              `)
            }
          </div>
        </div>
      </div><!-- /taxchat-body -->

      ${state.showAbout ? html`
        <div class="about-modal" @click=${() => { state.showAbout = false; state.confirmingClear = false; renderApp(); }}>
          <div class="about-content" @click=${(e: Event) => e.stopPropagation()}>
            <button class="about-close" @click=${() => { state.showAbout = false; state.confirmingClear = false; renderApp(); }}>✕</button>
            <div class="about-logo">
              <img src="./assets/taxchat-logo.png" alt="智税宝" />
            </div>
            <div class="about-title">智税宝</div>
            <div class="about-desc">
              智税宝是您的AI税务助理，基于先进的人工智能技术，为您提供专业的税务服务：
            </div>
            <div class="about-features">
              <div class="about-feature-item">🧾 税务风险治理与应对策略</div>
              <div class="about-feature-item">📊 纳税申报表预审与比对</div>
              <div class="about-feature-item">📝 合同及票据税务审核</div>
              <div class="about-feature-item">💬 日常税务问题咨询</div>
            </div>
            <div class="about-divider"></div>
            <div class="about-actions">
              <button class="about-action-btn" @click=${() => { handleAuthorizeFolder(); }} ?disabled=${state.importingFolder}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                </svg>
                <span>${state.importingFolder ? "导入中..." : "授权访问文件夹"}</span>
              </button>
              ${state.authorizedFolder ? html`
                <div class="about-folder-row">
                  <div class="about-folder-path" title=${state.authorizedFolder}>${state.authorizedFolder}</div>
                  <button class="about-folder-refresh" @click=${() => { handleRefreshFolder(); }} ?disabled=${state.importingFolder} title="重新读取文件夹">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                      <path d="M21 3v5h-5"/>
                      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                      <path d="M3 21v-5h5"/>
                    </svg>
                  </button>
                </div>
              ` : ""}
              ${state.importResult ? html`
                <div class="about-folder-status">${state.importResult}</div>
              ` : ""}
              ${state.confirmingClear ? html`
                <div class="about-confirm-hint">清空后聊天记录和收藏夹将被删除，AI记忆不受影响</div>
                <div class="about-confirm-actions">
                  <button class="about-confirm-btn confirm" @click=${() => { doClearAll(); }}>
                    确认清空
                  </button>
                  <button class="about-confirm-btn cancel" @click=${() => { state.confirmingClear = false; renderApp(); }}>
                    取消
                  </button>
                </div>
              ` : html`
                <button class="about-action-btn" @click=${() => { state.confirmingClear = true; renderApp(); }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    <line x1="10" y1="11" x2="10" y2="17"/>
                    <line x1="14" y1="11" x2="14" y2="17"/>
                  </svg>
                  <span>清空对话记录</span>
                </button>
              `}
              <button class="about-action-btn" @click=${() => { state.showQuickStart = true; state.showAbout = false; renderApp(); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
                <span>查看使用指南</span>
              </button>
            </div>
            <div class="about-version">版本 1.0</div>
          </div>
        </div>
      ` : ""}

      ${state.showQuickStart ? renderQuickStart() : ""}

      ${state.editingSkill ? html`
        <div class="skill-editor-overlay" @click=${() => { state.editingSkill = null; renderApp(); }}>
          <div class="skill-editor" @click=${(e: Event) => e.stopPropagation()}>
            <h3>${state.customSkills.some(s => s.id === state.editingSkill!.id) ? "编辑 Skill" : "新建 Skill"}</h3>
            <label>名称 *</label>
            <input type="text" .value=${live(state.editingSkill.name)} @input=${(e: Event) => { state.editingSkill!.name = (e.target as HTMLInputElement).value; }} placeholder="例：增值税计算助手" />
            <label>图标</label>
            <input type="text" .value=${live(state.editingSkill.emoji)} @input=${(e: Event) => { state.editingSkill!.emoji = (e.target as HTMLInputElement).value; }} placeholder="🤖" style="width: 60px;" />
            <label>描述</label>
            <textarea .value=${live(state.editingSkill.description)} @input=${(e: Event) => { state.editingSkill!.description = (e.target as HTMLTextAreaElement).value; }} placeholder="描述这个技能的用途和使用场景，例如：当用户提到增值税计算、税率查询时使用此技能" style="min-height: 60px;"></textarea>
            <label>操作流程 *</label>
            <textarea .value=${live(state.editingSkill.prompt)} @input=${(e: Event) => { state.editingSkill!.prompt = (e.target as HTMLTextAreaElement).value; }} placeholder="请详细描述技能的操作流程（自然语言）。例如：分析用户上传的文件，从增值税角度列出所有涉税项目，计算应纳税额..."></textarea>
            <div class="skill-editor__actions">
              <button class="skill-editor__cancel" @click=${() => { state.editingSkill = null; renderApp(); }}>取消</button>
              <button class="skill-editor__save" @click=${() => {
                if (!state.editingSkill?.name.trim() || !state.editingSkill?.prompt.trim()) {
                  alert("请填写名称和操作流程");
                  return;
                }
                saveSkillFromEditor();
              }}>保存技能</button>
            </div>
          </div>
        </div>
      ` : ""}

      ${state.previewAttachment ? html`
        <div class="preview-modal" @click=${() => {
          state.previewAttachment = null;
          renderApp();
        }}>
          <div class="preview-content" @click=${(e: Event) => e.stopPropagation()}>
            <button class="preview-close" @click=${() => {
              state.previewAttachment = null;
              renderApp();
            }}>✕</button>
            ${state.previewAttachment.type.startsWith("image/") ? html`
              <img src=${state.previewAttachment.dataUrl} alt=${state.previewAttachment.name} class="preview-image" />
            ` : html`
              <div class="preview-file-info">
                <div class="preview-file-icon">📄</div>
                <div class="preview-file-name">${state.previewAttachment.name}</div>
                <div class="preview-file-size">${formatFileSize(state.previewAttachment.size)}</div>
                <div class="preview-file-type">${state.previewAttachment.type}</div>
              </div>
            `}
          </div>
        </div>
      ` : ""}

      ${state.toastMessage ? html`
        <div class="taxchat-toast">
          <div class="taxchat-toast__icon">📚</div>
          <div class="taxchat-toast__text">${state.toastMessage}</div>
          <button class="taxchat-toast__close" @click=${() => {
            if (state.toastTimer) clearTimeout(state.toastTimer);
            state.toastMessage = null;
            state.toastTimer = null;
            renderApp();
          }}>✕</button>
        </div>
      ` : ""}
    </div>
  `;

  render(content, app);

  // Auto-scroll to bottom - use instant scroll to prevent jumping
  requestAnimationFrame(() => {
    const container = document.getElementById("messages-container");
    if (container) {
      // Check if user has scrolled up manually
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;

      // Auto-scroll if: initial load, near bottom, or sending
      if (_forceScrollBottom || isNearBottom || state.sending) {
        container.scrollTop = container.scrollHeight;
        _forceScrollBottom = false;
      }
    }
  });

  // Focus input
  const input = document.getElementById("message-input") as HTMLTextAreaElement;
  if (input && !state.sending) {
    input.focus();
    state.inputRef = input;
  }
}

function handleQuickSkill(skillName: string, prompt: string, displayLabel: string, noFilePicker?: boolean) {
  if (!state.client || state.sending) return;

  // Track which skill was triggered for API integration
  state.lastSkillName = skillName;

  // For folder-based skills (noFilePicker), set activeCustomSkill
  // so handleSend embeds full instructions in the message
  if (noFilePicker) {
    const builtinSkill = BUILTIN_SKILLS.find(s => s.folderName === skillName);
    if (builtinSkill) {
      state.activeCustomSkill = builtinSkill;
    }
    state.draft = "请执行票据整理流程";
    handleSend();
    return;
  }

  // When attachments already exist, send prompt directly
  if (state.attachments.length > 0) {
    state.draft = prompt;
    handleSend();
    return;
  }

  // No attachments yet — open file picker and remember the pending skill
  state.pendingSkill = { name: skillName, prompt, displayLabel };
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*,.pdf,.doc,.docx,.xls,.xlsx,.xml";
  fileInput.multiple = true;
  fileInput.onchange = () => {
    if (fileInput.files && fileInput.files.length > 0) {
      handleFiles(fileInput.files);
    } else {
      // User cancelled — clear pending skill
      state.pendingSkill = null;
    }
  };
  fileInput.click();
}

async function handleSend() {
  if (!state.client || state.sending) return;

  // Either have text or attachments
  if (!state.draft.trim() && state.attachments.length === 0) return;

  const userText = state.draft.trim();
  const msgId = generateUUID();

  // Capture the skill name before clearing it
  const triggeredSkillName = state.lastSkillName;
  state.lastSkillName = null;

  // If a custom skill is active, prepend its prompt to the user's text
  const activeSkill = state.activeCustomSkill;
  state.activeCustomSkill = null;

  // For custom skills: embed the full workflow instructions in the message
  // (the gateway skill system relies on tool calls to read SKILL.md, but qwen-vl-max
  //  doesn't support function calling, so we must include instructions inline)

  // Auto-detect: if no skill was explicitly activated, check if user's text mentions a skill name
  let detectedSkill = activeSkill;
  if (!detectedSkill && userText) {
    const textLower = userText.toLowerCase();
    // Check custom skills first
    for (const sk of state.customSkills) {
      if (sk.prompt && sk.name && textLower.includes(sk.name.toLowerCase())) {
        detectedSkill = sk;
        break;
      }
    }
    // Then check builtin skills
    if (!detectedSkill) {
      for (const sk of BUILTIN_SKILLS) {
        if (sk.prompt && sk.name && textLower.includes(sk.name.toLowerCase())) {
          detectedSkill = sk;
          break;
        }
      }
    }
  }

  let messageToSend: string;
  if (detectedSkill && detectedSkill.prompt) {
    let skillSuffix = "";
    // For knowledge-base skill, inject the authorized folder path
    if (detectedSkill.id === "__builtin_knowledge-base" && state.authorizedFolder) {
      skillSuffix = `\n\n【知识库路径】\n${state.authorizedFolder}`;
    }
    messageToSend = `请严格按照以下操作流程处理用户的输入。\n\n【${detectedSkill.name} - 操作流程】\n${detectedSkill.prompt}\n\n【用户输入】\n${userText}${skillSuffix}`;
    console.log(`[Skill] Embedded prompt for skill "${detectedSkill.name}", prompt length: ${detectedSkill.prompt.length}`);
  } else if (detectedSkill) {
    messageToSend = `请按照${detectedSkill.name}的操作流程处理以下内容。\n\n${userText}`;
    console.log(`[Skill] Skill "${detectedSkill.name}" active but no prompt text`);
  } else {
    messageToSend = userText;
  }
  const hasAttachments = state.attachments.length > 0;
  const hasImages = state.attachments.some(att => att.type.startsWith("image/"));
  const hasDocuments = state.attachments.some(att =>
    att.type === "application/pdf" ||
    att.type.includes("word") ||
    att.type.includes("excel") ||
    att.type.includes("document")
  );

  // Build display text for user message
  const displayText = userText || `(${state.attachments.length} 个文件)`;

  // Generate appropriate prompt based on content
  // Only apply default attachment prompts when no skill is active;
  // when a skill is active, the skill prompt (already in messageToSend) takes precedence
  if (hasAttachments && !detectedSkill) {
    if (!userText) {
      // No text provided, add default OCR/analysis prompt
      if (hasImages && hasDocuments) {
        messageToSend = "请分析这些图片和文档，提取其中的文字内容并总结要点。";
      } else if (hasImages) {
        messageToSend = "请提取图片中的所有文字内容，保持原有的结构和格式。如果图片中没有文字，请描述图片的内容。";
      } else if (hasDocuments) {
        messageToSend = "请分析这个文档，提取并总结其中的主要内容。";
      }
    } else if (hasImages) {
      // User provided text with images, add OCR context hint
      messageToSend = `${userText}\n\n（注：请先识别并提取图片中的文字内容，然后结合我的问题进行分析）`;
    }
  } else if (hasAttachments && detectedSkill && hasImages) {
    // Skill active + images: append OCR hint to skill-wrapped message
    messageToSend += "\n\n（注：请先识别并提取图片中的文字内容，然后结合操作流程进行分析）";
  }

  // Save a copy of attachments for the user message
  const messageAttachments = state.attachments.length > 0 ? [...state.attachments] : undefined;

  state.messages.push({
    type: "user",
    text: displayText,
    timestamp: Date.now(),
    id: msgId,
    attachments: messageAttachments,
  });

  state.draft = "";
  state.sending = true;
  state.thinkingLabel = "正在思考...";
  state.toolsActive = 0;
  state.currentRunId = null;
  renderApp();

  // Build attachments in API format
  // Support all file types (images, PDFs, documents, etc.)
  let apiAttachments = state.attachments
    .map(att => {
      // Extract base64 content from data URL using proper parsing
      const match = /^data:([^;]+);base64,(.+)$/.exec(att.dataUrl);
      if (!match) {
        console.warn("Failed to parse data URL for file:", att.name);
        return null;
      }

      // Determine attachment type based on MIME type
      const mimeType = match[1];
      let attachmentType = "document"; // default
      if (mimeType.startsWith("image/")) {
        attachmentType = "image";
      } else if (mimeType === "application/pdf") {
        attachmentType = "document";
      } else if (mimeType.includes("word") || mimeType.includes("excel") || mimeType.includes("spreadsheet")) {
        attachmentType = "document";
      }

      const attachment = {
        type: attachmentType,
        mimeType: mimeType,
        fileName: att.name,
        content: match[2],
      };
      console.log(`Prepared attachment: ${att.name}, type: ${attachmentType}, mime: ${mimeType}, base64 length: ${match[2].length}`);
      return attachment;
    })
    .filter((a): a is NonNullable<typeof a> => a !== null);

  console.log(`Total attachments prepared: ${apiAttachments.length}`);

  // Extract text from document attachments (PDF, Word etc.) client-side
  // since the gateway only accepts image attachments and drops everything else
  let documentText = "";
  if (hasDocuments) {
    documentText = await extractAttachmentTexts(state.attachments);
    if (documentText) {
      messageToSend += `\n\n【文件内容】\n${documentText}`;
    }
  }

  // Remove non-image attachments (gateway drops them anyway)
  apiAttachments = apiAttachments.filter(a => a.type === "image");

  state.attachments = [];

  // Send message to gateway via RPC call
  const idempotencyKey = generateUUID();

  // Inject knowledge refs (user-selected files from knowledge panel)
  if (state.knowledgeRefs.length > 0) {
    const api = (window as any).electronAPI;
    if (api?.readKnowledgeFile) {
      const refParts: string[] = [];
      for (const ref of state.knowledgeRefs) {
        try {
          const result = await api.readKnowledgeFile(ref.name);
          if (result?.ok && result.content) {
            refParts.push(`【知识库引用: ${ref.name}】\n${result.content}`);
          }
        } catch (_) {}
      }
      if (refParts.length > 0) {
        messageToSend = `${messageToSend}\n\n---\n${refParts.join("\n\n")}\n---`;
      }
    }
    state.knowledgeRefs = [];
    renderApp();
  }

  // Inject folder knowledge context only on first message of session
  // (avoid repeating 10K+ tokens of file listings in every turn)
  if (state.folderKnowledge && !state.folderKnowledgeSent) {
    messageToSend = `${messageToSend}\n\n---\n【已导入知识库文件内容】\n以下是用户授权文件夹中的文件内容，请根据这些内容回答用户的问题：\n${state.folderKnowledge}\n---`;
    state.folderKnowledgeSent = true;
  }

  // Use the generated message (includes auto-OCR prompts + folder knowledge)
  const finalMessage = messageToSend || (apiAttachments.length > 0 ? "(查看附件)" : "");

  const requestPayload: any = {
    sessionKey: state.sessionKey,
    message: finalMessage,  // must have text content
    deliver: false,
    idempotencyKey: idempotencyKey,
  };

  // Only add attachments if there are any
  if (apiAttachments.length > 0) {
    requestPayload.attachments = apiAttachments;
  }

  console.log("Sending chat.send with payload:", {
    ...requestPayload,
    attachments: apiAttachments.map(a => ({ ...a, content: a.content.substring(0, 50) + "..." }))
  });

  state.client
    .request("chat.send", requestPayload)
    .then((response: unknown) => {
      // The RPC response just confirms receipt
      // Actual responses come via onEvent(chat)
      console.log("Chat.send response:", response);
    })
    .catch((err) => {
      state.messages.push({
        type: "assistant",
        text: `抱歉，发送消息时出错：${String(err)}`,
        timestamp: Date.now(),
        id: generateUUID(),
      });
      state.sending = false;
      renderApp();
    });
}

function doClearAll() {
  state.messages = [];
  state.draft = "";
  state.sending = false;
  state.favorites.clear();
  state.showFavorites = false;
  state.showAbout = false;
  state.confirmingClear = false;
  state.folderKnowledgeSent = false; // re-send folder knowledge after clearing
  saveFavorites();
  saveMessages();
  renderApp();
}

function formatImportResult(result: any): string {
  const parts: string[] = [];
  if (result.textCount > 0) parts.push(`文本 ${result.textCount}`);
  if (result.imageCount > 0) parts.push(`图片 ${result.imageCount}`);
  if (result.docCount > 0) parts.push(`文档 ${result.docCount}`);
  if (parts.length === 0) return result.message || "未找到可读取的文件";
  return `已导入: ${parts.join("、")}`;
}

async function doImportFolder(folderPath: string) {
  const api = (window as any).electronAPI;
  state.importingFolder = true;
  state.importResult = null;
  renderApp();
  try {
    const result = await api.importFolderToMemory(folderPath);
    state.importingFolder = false;
    if (result.ok) {
      state.authorizedFolder = result.folderPath;
      localStorage.setItem("taxbot_authorized_folder", result.folderPath);
      state.importResult = formatImportResult(result);
      addNotification(`文件夹已导入: ${state.importResult}`, "📂");
      // Reload folder knowledge into state and restart watcher
      await loadFolderKnowledge();
      state.folderKnowledgeSent = false; // re-send with next message
      startWatcher();
    } else {
      state.importResult = result.error || "导入失败";
    }
  } catch (err: any) {
    state.importingFolder = false;
    state.importResult = err?.message || "导入失败";
  }
  renderApp();
}

async function handleAuthorizeFolder() {
  const api = (window as any).electronAPI;
  if (!api?.openFolderDialog) return;
  const folderPath = await api.openFolderDialog();
  if (!folderPath) return;
  await doImportFolder(folderPath);
}

async function handleRefreshFolder() {
  if (!state.authorizedFolder) return;
  await doImportFolder(state.authorizedFolder);
}

// Load folder knowledge into state
async function loadFolderKnowledge() {
  const api = (window as any).electronAPI;
  if (!api?.getFolderKnowledge || !state.authorizedFolder) return;
  try {
    const result = await api.getFolderKnowledge();
    if (result?.ok && result.content) {
      state.folderKnowledge = result.content;
      console.log(`Folder knowledge loaded: ${result.files?.length || 0} files, ${result.content.length} chars`);
    }
  } catch (err) {
    console.warn("Failed to load folder knowledge:", err);
  }
}

// ============ 知识库文件管理 ============

async function loadKnowledgeFiles() {
  const api = (window as any).electronAPI;
  if (!api?.listKnowledgeFiles || !state.authorizedFolder) return;
  state.knowledgeLoading = true;
  renderApp();
  try {
    const result = await api.listKnowledgeFiles(state.authorizedFolder);
    if (result?.ok) {
      state.knowledgeFiles = result.files || [];
    }
  } catch (err) {
    console.warn("Failed to list knowledge files:", err);
  }
  state.knowledgeLoading = false;
  renderApp();
}

async function handleKnowledgeDrop(e: DragEvent) {
  const api = (window as any).electronAPI;
  if (!api?.copyToKnowledgeFolder || !state.authorizedFolder) return;
  const files = e.dataTransfer?.files;
  if (!files || files.length === 0) return;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(",")[1];
      if (!base64) return;
      try {
        await api.copyToKnowledgeFolder({
          folderPath: state.authorizedFolder,
          fileName: file.name,
          base64Data: base64,
        });
      } catch (err) {
        console.warn("Failed to copy file to knowledge folder:", err);
      }
      // Refresh after last file
      if (i === files.length - 1) {
        await loadKnowledgeFiles();
        await loadFolderKnowledge();
        state.folderKnowledgeSent = false;
      }
    };
    reader.readAsDataURL(file);
  }
}

function addKnowledgeRef(name: string) {
  if (state.knowledgeRefs.some(r => r.name === name)) return; // already referenced
  state.knowledgeRefs.push({ name });
  renderApp();
}

function removeKnowledgeRef(index: number) {
  state.knowledgeRefs.splice(index, 1);
  renderApp();
}

async function deleteKnowledgeFileAction(fileName: string) {
  const api = (window as any).electronAPI;
  if (!api?.deleteKnowledgeFile || !state.authorizedFolder) return;
  try {
    await api.deleteKnowledgeFile(state.authorizedFolder, fileName);
    // Remove from refs if referenced
    state.knowledgeRefs = state.knowledgeRefs.filter(r => r.name !== fileName);
    await loadKnowledgeFiles();
    await loadFolderKnowledge();
    state.folderKnowledgeSent = false;
  } catch (err) {
    console.warn("Failed to delete knowledge file:", err);
  }
}

// Toast notification
function showToast(message: string, durationMs = 5000) {
  if (state.toastTimer) clearTimeout(state.toastTimer);
  state.toastMessage = message;
  renderApp();
  state.toastTimer = setTimeout(() => {
    state.toastMessage = null;
    state.toastTimer = null;
    renderApp();
  }, durationMs);
}

// 启动文件夹守护进程（只启动 watcher，不重复注册监听）
function startWatcher() {
  const api = (window as any).electronAPI;
  if (!api?.startFolderWatcher || !state.authorizedFolder) return;
  api.startFolderWatcher(state.authorizedFolder);
}

// 注册文件夹变更监听器（只调用一次）
let _watcherListenerRegistered = false;
function registerWatcherListener() {
  if (_watcherListenerRegistered) return;
  const api = (window as any).electronAPI;
  if (!api?.onFolderKnowledgeUpdated) return;
  _watcherListenerRegistered = true;
  api.onFolderKnowledgeUpdated(async (data: { newFiles: string[]; count: number }) => {
    console.log(`Folder watcher: ${data.count} new file(s) detected`);
    await loadFolderKnowledge();
    const names = data.newFiles.length <= 3
      ? data.newFiles.join("、")
      : data.newFiles.slice(0, 3).join("、") + ` 等${data.newFiles.length}个文件`;
    const msg = `新知识已学习: ${names}`;
    showToast(msg);
    addNotification(msg, "📚");
    renderApp();
  });
}

// 注册 managed skills 变更监听器（gateway安装技能时通知）
let _skillsListenerRegistered = false;
function registerManagedSkillsListener() {
  if (_skillsListenerRegistered) return;
  const api = (window as any).electronAPI;
  if (!api?.onManagedSkillsUpdated) return;
  _skillsListenerRegistered = true;
  api.onManagedSkillsUpdated(() => {
    console.log("Managed skills directory changed, syncing...");
    syncManagedSkills();
  });
}

// Intercept link clicks in messages to open file paths and URLs via Electron
// Close status menu on outside click
document.addEventListener("click", () => {
  if (state.showStatusMenu) {
    state.showStatusMenu = false;
    renderApp();
  }
});

document.addEventListener("click", (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  const anchor = target.closest("a") as HTMLAnchorElement | null;
  if (!anchor) return;
  const href = anchor.getAttribute("href");
  if (!href) return;
  // Only handle links inside message bubbles
  if (!anchor.closest(".message-bubble")) return;
  e.preventDefault();
  e.stopPropagation();
  const api = (window as any).electronAPI;
  if (href.startsWith("#localpath=")) {
    const localPath = decodeURIComponent(href.replace("#localpath=", ""));
    if (api?.openPath) {
      api.openPath(localPath);
    }
  } else if (/^https?:\/\//i.test(href)) {
    if (api?.openPath) {
      api.openPath(href);
    } else {
      window.open(href, "_blank");
    }
  }
});

// Auto-connect on load
document.addEventListener("DOMContentLoaded", () => {
  connectGateway();
  loadFolderKnowledge();
  registerWatcherListener();
  registerManagedSkillsListener();
  startWatcher();
  syncManagedSkills();
});


