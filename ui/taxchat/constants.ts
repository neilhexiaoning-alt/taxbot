/**
 * TaxChat Constants
 */

import type { CustomSkill } from "./types";

// ─── Storage Keys ──────────────────────────────────────────────
export const FAVORITES_STORAGE_KEY = "taxbot_favorites";
export const MESSAGES_STORAGE_KEY = "taxbot_messages";
export const NOTIFICATIONS_STORAGE_KEY = "taxbot_notifications";
export const CUSTOM_SKILLS_STORAGE_KEY = "taxbot_custom_skills";
export const CONVERSATIONS_STORAGE_KEY = "taxbot_conversations";
export const CURRENT_CONV_KEY = "taxbot_current_conversation";

// ─── Context Limits ────────────────────────────────────────────
export const CONTEXT_MAX_MESSAGES = 30;
export const CONTEXT_MAX_CHARS = 12000;

// ─── Tax Detection ─────────────────────────────────────────────
export const TAX_KEYWORDS = /税务|纳税|增值税|所得税|印花税|发票|申报|退税|税率|税负|税局|税法|合同审核|税目|减免税|抵扣|税收|涉税|完税|税金|税款|税额|免税|征税|缴税|报税|税种|税前|税后|含税|不含税|进项|销项/;
export const TAX_SKILL_NAMES = new Set(["contract-tax", "tax-review", "tax-risk"]);

// ─── Agent Templates ───────────────────────────────────────────
export const AGENT_TEMPLATES: Array<{
  name: string; emoji: string; description: string; identityDesc: string; expertise: string;
}> = [
  {
    name: "税务顾问",
    emoji: "🧾",
    description: "专业税务咨询与风险分析",
    identityDesc: "你是一位资深税务顾问，精通中国税法体系，包括增值税、企业所得税、个人所得税等各税种。你能够根据企业实际情况提供合规的税务筹划建议，识别潜在的税务风险，并给出切实可行的解决方案。回答时引用具体法规条文，确保建议的准确性和权威性。",
    expertise: "增值税、企业所得税、个人所得税、税收优惠政策、税务风险防控、税务筹划、纳税申报、税务稽查应对",
  },
  {
    name: "合同审查",
    emoji: "📋",
    description: "合同条款的税务风险审查",
    identityDesc: "你是一位专注于合同税务条款审查的专家，擅长从税务角度审查各类商业合同。你能发现合同中的涉税风险点，如发票条款缺失、价税约定不明确、代扣代缴义务不清等问题，并提出修改建议。",
    expertise: "合同涉税条款审查、发票约定、价税分离、印花税、代扣代缴义务、违约金税务处理、关联交易定价",
  },
  {
    name: "政策解读",
    emoji: "📜",
    description: "最新税收政策解读与影响分析",
    identityDesc: "你是一位税收政策研究专家，密切关注国家及地方税收政策的最新动态。你能够对新出台的税收政策进行深入解读，分析其对不同行业和企业的影响，并提供应对建议和过渡期安排方案。",
    expertise: "财税政策解读、政策变化追踪、行业影响分析、过渡期安排、税收优惠申请、地方税收政策差异",
  },
  {
    name: "财务分析",
    emoji: "📊",
    description: "财务报表分析与税务健康评估",
    identityDesc: "你是一位资深财务分析师，擅长通过财务数据分析企业的经营状况和税务健康度。你能够解读财务报表、分析税负率、评估税务风险指标，并提供优化建议。",
    expertise: "财务报表分析、税负率分析、现金流管理、预算编制、成本控制、财税一体化、税务健康指标评估",
  },
];

// ─── Built-in Skills ───────────────────────────────────────────
export const BUILTIN_SKILLS: (CustomSkill & { builtin: true })[] = [
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

## 第三步：调用查验接口

确认提取的字段无误后，立即用 exec 工具执行以下命令（替换实际值）：

node "$env:TAXBOT_ROOT/skills/invoice-check/scripts/check-invoice.mjs" --invoiceCode=发票代码 --invoiceNo=发票号码 --invoiceDate=开票日期 --invoiceAmount=不含税金额 --checkCode=校验码后六位 --invoiceType=种类代码

**参数说明**：
- 所有参数值不要加引号
- 日期格式必须为 YYYYMMDD（如 20241215）
- 金额为数字（如 343.93）
- 校验码只取后六位
- 可为空的字段传空值（如 --checkCode= ）
- $env:TAXBOT_ROOT 是系统环境变量，指向应用根目录，由系统自动设置

如果 exec 工具执行失败或返回错误，根据已有信息进行风险分析。

## 第四步：展示查验结果

解析脚本返回的 JSON 结果，以表格展示：查验状态、发票代码、发票号码、开票日期、发票状态(正常/作废/红冲)、销方名称、购方名称、金额、税额、价税合计。如有货物明细也列出。如果查验失败，跳过此步直接进入风险分析。

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

// ─── Tool Label Map ────────────────────────────────────────────
export const TOOL_LABEL_MAP: Record<string, string> = {
  memory_search: "正在搜索记忆...",
  memory_get: "正在读取记忆...",
  exec: "正在执行命令...",
  read: "正在读取文件...",
  write: "正在写入文件...",
  search: "正在搜索...",
  web_search: "正在搜索网络...",
  web_fetch: "正在获取网页...",
};
