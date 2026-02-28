import{e as _s,i as Rs,h as X,r as js,E as kt,A as qs,p as Ls,w as $e,G as Es,b as r,D as Os,q as Bs}from"./chunks/markdown-DiS2RbVY.js";const Us="20260228.2";const O=_s(class extends Rs{constructor(e){if(super(e),e.type!==X.PROPERTY&&e.type!==X.ATTRIBUTE&&e.type!==X.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!js(e))throw Error("`live` bindings can only contain a single expression")}render(e){return e}update(e,[n]){if(n===kt||n===qs)return n;const a=e.element,i=e.name;if(e.type===X.PROPERTY){if(n===a[i])return kt}else if(e.type===X.BOOLEAN_ATTRIBUTE){if(!!n===a.hasAttribute(i))return kt}else if(e.type===X.ATTRIBUTE&&a.getAttribute(i)===n+"")return kt;return Ls(e),n}}),Fs="taxbot_favorites",ls="taxbot_messages",rs="taxbot_notifications",cs="taxbot_custom_skills",ds="taxbot_conversations",le="taxbot_current_conversation",zs=12e3,De=[{name:"税务顾问",emoji:"🧾",description:"专业税务咨询与风险分析",identityDesc:"你是一位资深税务顾问，精通中国税法体系，包括增值税、企业所得税、个人所得税等各税种。你能够根据企业实际情况提供合规的税务筹划建议，识别潜在的税务风险，并给出切实可行的解决方案。回答时引用具体法规条文，确保建议的准确性和权威性。",expertise:"增值税、企业所得税、个人所得税、税收优惠政策、税务风险防控、税务筹划、纳税申报、税务稽查应对"},{name:"合同审查",emoji:"📋",description:"合同条款的税务风险审查",identityDesc:"你是一位专注于合同税务条款审查的专家，擅长从税务角度审查各类商业合同。你能发现合同中的涉税风险点，如发票条款缺失、价税约定不明确、代扣代缴义务不清等问题，并提出修改建议。",expertise:"合同涉税条款审查、发票约定、价税分离、印花税、代扣代缴义务、违约金税务处理、关联交易定价"},{name:"政策解读",emoji:"📜",description:"最新税收政策解读与影响分析",identityDesc:"你是一位税收政策研究专家，密切关注国家及地方税收政策的最新动态。你能够对新出台的税收政策进行深入解读，分析其对不同行业和企业的影响，并提供应对建议和过渡期安排方案。",expertise:"财税政策解读、政策变化追踪、行业影响分析、过渡期安排、税收优惠申请、地方税收政策差异"},{name:"财务分析",emoji:"📊",description:"财务报表分析与税务健康评估",identityDesc:"你是一位资深财务分析师，擅长通过财务数据分析企业的经营状况和税务健康度。你能够解读财务报表、分析税负率、评估税务风险指标，并提供优化建议。",expertise:"财务报表分析、税负率分析、现金流管理、预算编制、成本控制、财税一体化、税务健康指标评估"}],R=[{id:"__builtin_tax-risk",name:"税务风险治理",emoji:"🧾",description:"分析税务风险文件/图片，生成说明函和应对策略",prompt:"请按照税务风险治理流程，分析我上传的文件内容，识别税务风险点，给出风险分析、说明函、应对话术和操作建议。请直接分析文件内容，不要调用任何工具或命令。",pinned:!1,createdAt:0,folderName:"tax-risk",builtin:!0},{id:"__builtin_tax-review",name:"纳税申报表预审",emoji:"📊",description:"分析纳税申报表与财务报表的数据差异，识别税务风险",prompt:"请按照纳税申报表预审流程，分析我上传的纳税申报表和财务报表，比对两个表格的数据差异，以表格形式输出比对结果，并分析税务风险给出处理建议。请直接分析文件内容，不要调用任何工具或命令。",pinned:!1,createdAt:0,folderName:"tax-review",builtin:!0},{id:"__builtin_contract-tax",name:"合同及票据税审",emoji:"📝",description:"从税务角度审核合同和票据，计算税额，给出风险提示",prompt:"请按照票据合同税务审核流程，从税务角度分析我上传的合同或票据，列支涉及的税目并计算相关税额，给出风险提示和修改建议。请直接分析文件内容，不要调用任何工具或命令。",pinned:!1,createdAt:0,folderName:"contract-tax",builtin:!0},{id:"__builtin_invoice-check",name:"发票查验",emoji:"🔍",description:"上传发票图片/PDF/XML，查验发票真伪并分析风险",prompt:`# 发票查验

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
- 全电发票（021/022/085/086/061/083）：invoiceCode和checkCode必须传空值，invoiceNo必须是完整20位`,pinned:!1,createdAt:0,folderName:"invoice-check",builtin:!0},{id:"__builtin_receipt-organizer",name:"票据整理",emoji:"🧾",description:"扫描文件夹中的票据，按类型分类整理，生成报销单",prompt:`# 票据整理与报销单生成

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
- 金额超 10000 元：提醒用户确认`,pinned:!1,createdAt:0,folderName:"receipt-organizer",builtin:!0,noFilePicker:!0},{id:"__builtin_knowledge-base",name:"知识库",emoji:"📚",description:"在指定文件夹中检索文件、提取摘要、搜索内容",prompt:`# 知识库文件操作

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
- 如果提取文本失败，告知用户可能需要安装对应的 Python 库（pdfplumber、python-docx、openpyxl）`,pinned:!1,createdAt:0,folderName:"knowledge-base",builtin:!0,noFilePicker:!0}],Ns={memory_search:"正在搜索记忆...",memory_get:"正在读取记忆...",exec:"正在执行命令...",read:"正在读取文件...",write:"正在写入文件...",search:"正在搜索...",web_search:"正在搜索网络...",web_fetch:"正在获取网页..."};function T(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,e=>{const n=Math.random()*16|0;return(e==="x"?n:n&3|8).toString(16)})}let us=null,Gt=!1;function Vs(e){us=e}function d(){Gt||(Gt=!0,requestAnimationFrame(()=>{Gt=!1,us?.()}))}let gs=!0;function Dt(e){gs=e}const t={connected:!1,hello:null,lastError:null,gatewayUrl:"ws://127.0.0.1:18789",client:null,sessionKey:"taxchat",messages:[],draft:"",activeRuns:new Map,inputRef:null,attachments:[],dragOver:!1,toolMessages:void 0,stream:void 0,streamStartedAt:void 0,previewAttachment:null,pendingSkill:null,favorites:new Set,favSearchQuery:"",sidebarCollapsed:localStorage.getItem("taxbot_sidebar_collapsed")==="true",sidePanel:null,sidePanelWidth:parseInt(localStorage.getItem("taxbot_side_panel_width")||"340",10),skillsTab:"installed",confirmingClear:!1,authorizedFolder:localStorage.getItem("taxbot_authorized_folder"),folderKnowledge:null,folderKnowledgeSent:!1,importingFolder:!1,importResult:null,lastSkillName:null,toastMessage:null,toastTimer:null,notifications:[],panelTab:"favorites",customSkills:[],editingSkill:null,activeCustomSkill:null,showStatusMenu:!1,showNotifications:!1,notifDetail:null,knowledgeFiles:[],knowledgeRefs:[],knowledgeDragOver:!1,knowledgeLoading:!1,builtinSkillsCollapsed:!0,filesSortBy:"time",skillsSortBy:"time",showQuickStart:!localStorage.getItem("quickstart_seen"),fontSize:localStorage.getItem("taxbot_font_size")||"medium",settingsView:"main",modelList:[],modelLoading:!1,modelSaving:!1,modelError:null,modelConfigDraft:{provider:"",baseUrl:"",apiKey:"",api:"openai-completions",modelId:""},configBaseHash:null,currentModelConfig:null,apiKeyVisible:!1,activeModel:null,confirmingModelSave:!1,confirmingSessionClear:!1,confirmingExit:!1,pendingDispatch:null,agentsList:[],agentsLoading:!1,creatingAgent:!1,agentCreateDraft:{name:"",emoji:"🤖",description:"",identityDesc:"",expertise:"",avatarDataUrl:"",selectedSkills:[]},editingAgentId:null,agentSaving:!1,confirmingAgentDelete:null,mentionDropdownVisible:!1,mentionFilter:"",mentionIndex:0,replyingTo:null,conversations:[],currentConversationId:"",renamingConversation:null,confirmingConvDelete:null,backgroundMessages:new Map,unreadConversations:new Set,viewingAgentMemory:null,confirmingMemoryClear:!1,collaborationTasks:null,commandPaletteVisible:!1,commandFilter:"",commandIndex:0,searchOpen:!1,searchQuery:"",searchResults:[],searchIndex:0,taxstoreConnected:!1,taxstoreToken:null,taxstoreUser:null,taxstoreSkills:[],taxstorePage:1,taxstoreTotalPages:1,taxstoreQuery:"",taxstoreCategory:"",taxstoreSort:"latest",taxstoreLoading:!1,taxstoreError:null,taxstoreInstalledIds:new Set,taxstoreUpdates:[],taxstoreLoginEmail:"",taxstoreLoginPassword:"",taxstoreInstallingId:null,taxstoreInstallStep:null,rentalActiveTab:"agents",rentalPublishDialog:!1,rentalPublishAgent:null,rentalPublishDraft:{price:10,description:"",tags:[]},rentalMyListings:[],rentalPendingTasks:[],rentalActiveTask:null,rentalTaskResult:"",rentalTaskPanel:!1,rentalPollingTimer:null,rentalAgentProcessing:!1,rentalCompletedTasks:[],rentalTaskListType:null,rentalTaskDetailView:null,rentalTaskAttachments:[],rentalTaskInstruction:"",rentalMessages:[],rentalMessageInput:"",rentalMessagesOpen:!1,consultMyTasks:[],consultUnreadCount:0,consultPollingTimer:null,consultView:"list",consultAgents:[],consultLoading:!1,consultSearch:"",consultAvgTime:"",consultSelectedAgent:null,consultTaskTitle:"",consultTaskContent:"",consultSubmitting:!1,consultSelectedTask:null,consultAttachments:[],consultUploading:!1,consultMessages:[],consultMessageInput:"",consultMessagesOpen:!1,consultMessagesSending:!1,consultRevisionOpen:!1,consultRevisionText:"",consultRevisionSubmitting:!1,consultRatingOpen:!1,consultRatingValue:0,consultRatingHover:0,consultRatingComment:"",consultRatingSubmitting:!1,refreshing:!1,lastRefreshTime:null};function ps(){return t.activeRuns.size>0}function ut(e){return t.activeRuns.has(e)}function Pe(e){for(const n of t.activeRuns.values())if(e.endsWith(n.sessionKey)||e===n.sessionKey)return n;return e.endsWith(t.sessionKey)&&t.activeRuns.get(t.sessionKey)||null}function gt(e){if(e===t.sessionKey)return t.messages;const n=e.startsWith("taxchat-")?e.slice(8):e;return t.backgroundMessages.has(n)?t.backgroundMessages.get(n):t.messages}function Ks(e){return e===t.sessionKey}const Hs="taxbot_db",Ws=1,E="messages",_e="meta";let Z=null,xt=!1;function Vt(){return Z?Promise.resolve(Z):xt?Promise.reject(new Error("IndexedDB unavailable")):new Promise((e,n)=>{try{const a=indexedDB.open(Hs,Ws);a.onupgradeneeded=()=>{const i=a.result;i.objectStoreNames.contains(E)||i.createObjectStore(E),i.objectStoreNames.contains(_e)||i.createObjectStore(_e)},a.onsuccess=()=>{Z=a.result,Z.onclose=()=>{Z=null},e(Z)},a.onerror=()=>{xt=!0,n(a.error)}}catch(a){xt=!0,n(a)}})}async function Gs(e,n){const a=await Vt(),i=n.slice(-200);return new Promise((o,s)=>{const l=a.transaction(E,"readwrite");l.objectStore(E).put(i,e),l.oncomplete=()=>o(),l.onerror=()=>s(l.error)})}async function Js(e){try{const n=await Vt();return new Promise((a,i)=>{const s=n.transaction(E,"readonly").objectStore(E).get(e);s.onsuccess=()=>{const l=s.result;a(Array.isArray(l)?l:null)},s.onerror=()=>i(s.error)})}catch{return null}}async function Ys(e){try{const n=await Vt();return new Promise((a,i)=>{const o=n.transaction(E,"readwrite");o.objectStore(E).delete(e),o.oncomplete=()=>a(),o.onerror=()=>i(o.error)})}catch{}}async function Re(e){if(localStorage.getItem("taxbot_idb_migrated")==="1")return!0;try{const n=await Vt();for(const a of e){const i=`taxbot_messages_${a}`,o=localStorage.getItem(i);if(o)try{const s=JSON.parse(o);Array.isArray(s)&&await new Promise((l,c)=>{const u=n.transaction(E,"readwrite");u.objectStore(E).put(s.slice(-200),a),u.oncomplete=()=>l(),u.onerror=()=>c(u.error)})}catch{}}return localStorage.setItem("taxbot_idb_migrated","1"),console.log(`[IDB] Migrated ${e.length} conversations to IndexedDB`),!0}catch(n){return console.warn("[IDB] Migration failed, using localStorage fallback:",n),!1}}function we(){return!xt}let H=!1;function vs(){try{const e=localStorage.getItem(ds);if(e){const n=JSON.parse(e);if(Array.isArray(n))return n}}catch{}return[]}function Y(){try{localStorage.setItem(ds,JSON.stringify(t.conversations))}catch{}}function Kt(e){try{const n=localStorage.getItem(`taxbot_messages_${e}`);if(n){const a=JSON.parse(n);if(Array.isArray(a))return a}}catch{}return[]}async function ms(e){if(we())try{const n=await Js(e);if(n&&n.length>0)return n}catch{}return Kt(e)}function pt(e,n){const a=n.slice(-200);try{localStorage.setItem(`taxbot_messages_${e}`,JSON.stringify(a))}catch{}H&&we()&&Gs(e,a).catch(()=>{})}function Pt(e){try{const n=localStorage.getItem(`taxbot_favorites_${e}`);if(n)return new Set(JSON.parse(n))}catch{}return new Set}function ye(e,n){try{localStorage.setItem(`taxbot_favorites_${e}`,JSON.stringify([...n]))}catch{}}function Qs(){try{const e=localStorage.getItem(ls);if(e){const n=JSON.parse(e);if(Array.isArray(n))return n}}catch{}return[]}function Xs(){try{const e=localStorage.getItem(Fs);if(e)return new Set(JSON.parse(e))}catch{}return new Set}function Q(){try{pt(t.currentConversationId,t.messages);const e=t.conversations.find(n=>n.id===t.currentConversationId);e&&(e.updatedAt=Date.now(),e.messageCount=t.messages.length,Y())}catch{}}let W=null;function Jt(){W&&clearTimeout(W),W=setTimeout(()=>{W=null,Q()},2e3)}function fs(){W&&(clearTimeout(W),W=null,Q())}function xe(){try{ye(t.currentConversationId,t.favorites)}catch{}Zs()}function Zs(){const e=window.electronAPI;if(!e?.syncFavoritesToMemory)return;const n=[];for(const a of t.favorites){const i=t.messages.findIndex(l=>l.id===a);if(i<0)continue;const o=t.messages[i];if(o.type!=="assistant")continue;let s;for(let l=i-1;l>=0;l--)if(t.messages[l].type==="user"){s=t.messages[l].text;break}n.push({text:o.text,timestamp:o.timestamp,question:s})}e.syncFavoritesToMemory(n).catch(()=>{})}function tn(e){localStorage.removeItem(`taxbot_messages_${e}`),localStorage.removeItem(`taxbot_favorites_${e}`),H&&we()&&Ys(e).catch(()=>{})}function en(){try{const e=localStorage.getItem(rs);if(e)return JSON.parse(e)}catch{}return[]}function dt(){const e=t.notifications.slice(-50);localStorage.setItem(rs,JSON.stringify(e))}function sn(){try{const e=localStorage.getItem(cs);if(e)return JSON.parse(e)}catch{}return[]}function J(){localStorage.setItem(cs,JSON.stringify(t.customSkills))}function nn(){const e=Qs(),n=Xs(),a=T(),i=Date.now(),o=e.find(c=>c.type==="user"),s=o?o.text.replace(/\n/g," ").slice(0,20)+(o.text.length>20?"...":""):"默认对话",l={id:a,title:s,createdAt:e.length>0?e[0].timestamp:i,updatedAt:e.length>0?e[e.length-1].timestamp:i,messageCount:e.length};return e.length>0&&pt(a,e),n.size>0&&ye(a,n),{conversations:[l],currentId:a}}function an(){t.notifications=en(),t.customSkills=sn();const e=t.conversations.map(n=>n.id);if(e.length===0){const n=vs();n.length>0?Re(n.map(a=>a.id)).then(a=>{H=a}).catch(()=>{H=!1}):H=!0}else Re(e).then(n=>{H=n}).catch(()=>{H=!1})}const on=70,ln=140,je=5,_t=new Map;function bt(e){return e.id&&_t.has(e.id)?_t.get(e.id):e.type==="user"?on:ln}function rn(e,n,a){if(e.length===0)return{startIndex:0,endIndex:0,topPadding:0,bottomPadding:0,totalHeight:0};if(e.length<40)return{startIndex:0,endIndex:e.length,topPadding:0,bottomPadding:0,totalHeight:e.reduce((g,p)=>g+bt(p),0)};let i=0;const o=[];for(const g of e)o.push(i),i+=bt(g);let s=0;for(let g=0;g<o.length;g++)if(o[g]+bt(e[g])>=n){s=g;break}let l=s;for(let g=s;g<e.length&&(l=g+1,!(o[g]>n+a));g++);s=Math.max(0,s-je),l=Math.min(e.length,l+je);const c=o[s]||0;let u=0;for(let g=l;g<e.length;g++)u+=bt(e[g]);return{startIndex:s,endIndex:l,topPadding:c,bottomPadding:u,totalHeight:i}}function cn(){const e=document.getElementById("messages-container");if(!e)return;const n=e.querySelectorAll("[data-msg-id]");for(const a of n){const i=a.getAttribute("data-msg-id");if(!i)continue;const o=a.offsetHeight;o>0&&_t.set(i,o)}}let re=!0;function dn(e){return re=e.scrollHeight-e.scrollTop-e.clientHeight<80,re}function un(e){re&&(e.scrollTop=e.scrollHeight)}function ce(){_t.clear()}function Rt(){const e=new Set(t.messages.map(a=>a.id));let n=!1;for(const a of t.favorites)e.has(a)||(t.favorites.delete(a),n=!0);n&&xe()}function Te(){fs(),Q();const e=T(),n=Date.now(),a={id:e,title:"新对话",createdAt:n,updatedAt:n,messageCount:0,lastAccessedAt:n};t.conversations.unshift(a),Y(),jt(e)}function jt(e){if(e===t.currentConversationId)return;fs(),Q();const n=t.currentConversationId,a=t.sessionKey,i=[...t.activeRuns.values()].some(s=>s.sessionKey===a);if(i&&t.backgroundMessages.set(n,[...t.messages]),!i)for(const[s]of t.activeRuns)s===a&&t.activeRuns.delete(s);t.replyingTo=null,t.pendingDispatch=null,t.currentConversationId=e,t.sessionKey=`taxchat-${e}`,t.backgroundMessages.has(e)?(t.messages=t.backgroundMessages.get(e),t.backgroundMessages.delete(e)):t.messages=Kt(e),t.favorites=Pt(e),Rt(),t.unreadConversations.delete(e);const o=t.conversations.find(s=>s.id===e);o&&(o.lastAccessedAt=Date.now()),Y(),localStorage.setItem(le,e),ce(),Dt(!0),d(),t.messages.length===0&&ms(e).then(s=>{s.length>0&&t.currentConversationId===e&&(t.messages=s,Rt(),ce(),Dt(!0),d())})}function gn(e){t.conversations=t.conversations.filter(n=>n.id!==e),tn(e),e===t.currentConversationId&&(t.conversations.length===0?Te():jt(t.conversations[0].id)),Y(),t.confirmingConvDelete=null,d()}function qe(e,n){const a=t.conversations.find(i=>i.id===e);a&&(a.title=n.trim()||"新对话",Y()),t.renamingConversation=null,d()}function pn(){const e=t.conversations.find(a=>a.id===t.currentConversationId);if(!e||e.title!=="新对话")return;const n=t.messages.find(a=>a.type==="user");if(n){const a=n.text.replace(/\n/g," ").trim();e.title=a.slice(0,20)+(a.length>20?"...":""),Y()}}function vn(){let e=vs(),n=localStorage.getItem(le)||"";if(e.length===0){if(localStorage.getItem(ls)){const i=nn();e=i.conversations,n=i.currentId}else{const i=T();e=[{id:i,title:"新对话",createdAt:Date.now(),updatedAt:Date.now(),messageCount:0}],n=i}t.conversations=e,t.currentConversationId=n,Y(),localStorage.setItem(le,n)}else t.conversations=e,e.find(a=>a.id===n)||(n=e[0].id),t.currentConversationId=n;t.messages=Kt(n),t.favorites=Pt(n),Rt(),t.sessionKey=`taxchat-${n}`,t.messages.length===0&&ms(n).then(a=>{a.length>0&&t.currentConversationId===n&&(t.messages=a,Rt(),ce(),Dt(!0),d())})}function et(e){return new Date(e).toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit"})}function Yt(e){if(e===0)return"0 B";const n=1024,a=["B","KB","MB"],i=Math.floor(Math.log(e)/Math.log(n));return Math.round(e/Math.pow(n,i)*100)/100+" "+a[i]}function hs(){const e=new Date;return`${e.getFullYear()}${String(e.getMonth()+1).padStart(2,"0")}${String(e.getDate()).padStart(2,"0")}_${String(e.getHours()).padStart(2,"0")}${String(e.getMinutes()).padStart(2,"0")}`}function mn(){const e=[...t.knowledgeFiles];return t.filesSortBy==="name"?e.sort((n,a)=>n.name.localeCompare(a.name,"zh")):e.sort((n,a)=>(a.mtime||0)-(n.mtime||0)),e}function fn(){const e=[...t.customSkills];return t.skillsSortBy==="name"?e.sort((n,a)=>n.name.localeCompare(a.name,"zh")):e.sort((n,a)=>(a.createdAt||0)-(n.createdAt||0)),e}function hn(e){return new Promise((n,a)=>{const i=new FileReader;i.onload=()=>{typeof i.result=="string"?n(i.result):a(new Error("Failed to read file"))},i.onerror=()=>{a(i.error)},i.readAsDataURL(e)})}function kn(e){t.attachments.splice(e,1),d()}function ks(e){t.favorites.has(e)?t.favorites.delete(e):t.favorites.add(e),xe(),d()}function bn(e){const n=document.querySelector(`[data-msg-id="${e}"]`);n&&(n.scrollIntoView({behavior:"smooth",block:"start"}),n.style.transition="outline 0.2s",n.style.outline="2px solid #00A8FF",setTimeout(()=>{n.style.outline="none"},1500))}function $n(e,n){const a=document.createElement("div");a.innerHTML=$e(n);const i=a.innerText||a.textContent||n;navigator.clipboard.writeText(i).then(()=>{const o=document.querySelector(`[data-copy-id="${e}"]`);if(o){o.classList.add("copied");const s=o.querySelector(".action-label");s&&(s.textContent="已复制"),setTimeout(()=>{o.classList.remove("copied"),s&&(s.textContent="复制")},1500)}})}function bs(e){return`<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>Taxbot</title>
<style>
  body { font-family: "Microsoft YaHei", "SimSun", sans-serif; font-size: 12pt; line-height: 1.8; color: #333; }
  table { border-collapse: collapse; width: 100%; margin: 8px 0; }
  th, td { border: 1px solid #999; padding: 6px 10px; text-align: left; }
  th { background: #f0f0f0; font-weight: bold; }
  h1 { font-size: 18pt; } h2 { font-size: 15pt; } h3 { font-size: 13pt; }
  ul, ol { padding-left: 2em; }
</style>
</head><body>${$e(e)}</body></html>`}function wn(e){const n=bs(e),a=new Blob([n],{type:"application/msword"}),i=URL.createObjectURL(a),o=document.createElement("a");o.href=i,o.download=`Taxbot_${hs()}.doc`,document.body.appendChild(o),o.click(),document.body.removeChild(o),URL.revokeObjectURL(i)}function k(e,n=5e3){t.toastTimer&&clearTimeout(t.toastTimer),t.toastMessage=e,d(),t.toastTimer=setTimeout(()=>{t.toastMessage=null,t.toastTimer=null,d()},n)}function D(e,n="📚",a,i){t.notifications.push({id:T(),text:e,icon:n,timestamp:Date.now(),...a?{taskId:a}:{},...i?{source:i}:{}}),dt()}function Qt(){t.showQuickStart=!1,localStorage.setItem("quickstart_seen","1"),d()}function yn(e){return Ns[e]||"正在思考..."}function Xt(e){let n=e.replace(/<thinking>[\s\S]*?<\/thinking>\n?/g,"").trim();return n=n.replace(/<think>[\s\S]*?<\/think>\n?/g,"").trim(),n=n.replace(/<\/?final>/g,"").trim(),n=n.replace(/^NO\n\n/i,""),n}function qt(e){const n=e,a=typeof n.role=="string"?n.role:"",i=n.content;if(typeof i=="string")return a==="assistant"?Xt(i):i;if(Array.isArray(i)){const o=i.map(s=>{const l=s;return l?.type==="text"&&typeof l.text=="string"?l.text:null}).filter(s=>typeof s=="string");if(o.length>0){const s=o.join(`
`);return a==="assistant"?Xt(s):s}}return typeof n.text=="string"?a==="assistant"?Xt(n.text):n.text:""}function Lt(e){const n=e.trim();return[/^NO_REPLY$/i,/^Pre-compaction memory flush/i,/^Store durable memories/i].some(i=>i.test(n))}function xn(e){return/^NO$/i.test(e.trim())&&!ps()?"模型未能正确回复，请重新发送您的问题。":e}function Tn(e){const n=`[^\\s<>)"'，。、；：！？》）\\]]+`,a='[^\\s<>:"*?|，。、；：！？》）\\]]+',i=new RegExp(`(\`\`\`[\\s\\S]*?\`\`\`)|(\\[[^\\]]*\\]\\([^)]+\\))|\`([^\`]+)\`|(https?:\\/\\/${n})|([A-Za-z]:\\\\(?:${a}\\\\)*${a})`,"g");return e.replace(i,(o,s,l,c,u,g)=>{if(s||l)return o;if(c!==void 0){const p=c.trim();if(/^[A-Za-z]:\\/.test(p)){const m=p.replace(/[.,;:!?)]+$/,"");return`[${m}](#localpath=${encodeURIComponent(m)})`}if(/^https?:\/\//.test(p)){const m=p.replace(/[.,;:!?)]+$/,"");return`[${m}](${m})`}return o}if(u){const p=u.replace(/[.,;:!?)]+$/,"");return`[${p}](${p})`}if(g){const p=g.replace(/[.,;:!?)]+$/,"");return`[${p}](#localpath=${encodeURIComponent(p)})`}return o})}async function Sn(e){const n=window.electronAPI;if(!n?.extractDocumentText)return"";const a=[];for(const i of e){const o=/^data:([^;]+);base64,(.+)$/.exec(i.dataUrl);if(!o)continue;const s=o[1],l=o[2];try{const c=await n.extractDocumentText(l,s,i.name);c?.ok&&c.text?.trim()&&a.push(`【${i.name}】
${c.text.trim()}`)}catch(c){console.warn(`Failed to extract text from ${i.name}:`,c)}}return a.join(`

`)}function vt(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function An(e){const n=[];return e.textCount>0&&n.push(`文本 ${e.textCount}`),e.imageCount>0&&n.push(`图片 ${e.imageCount}`),e.docCount>0&&n.push(`文档 ${e.docCount}`),n.length===0?e.message||"未找到可读取的文件":`已导入: ${n.join("、")}`}function $s(e){if(!e.length)return[];const n=[...R,...t.customSkills.filter(a=>!a.id.startsWith("__builtin_"))];return e.map(a=>n.find(i=>i.id===a)).filter(a=>!!a).map(a=>({name:a.name,emoji:a.emoji,description:a.description,prompt:a.prompt}))}const Tt=new Map;async function at(e){if(Tt.has(e))return Tt.get(e);const n=window.electronAPI;if(!n?.readAgentMemory)return"";try{const a=await n.readAgentMemory(e),i=a?.ok&&a.content||"";return Tt.set(e,i),i}catch{return""}}async function de(e,n){Tt.set(e,n);const a=window.electronAPI;if(a?.writeAgentMemory)try{await a.writeAgentMemory(e,n)}catch{}}async function Et(e,n){const a=await at(e),i=new Date().toLocaleString("zh-CN"),o=a?`${a}

---

[${i}]
${n}`:`[${i}]
${n}`;await de(e,o)}async function it(){if(!(!t.client||!t.connected)&&!t.agentsLoading){t.agentsLoading=!0,d();try{const e=await t.client.request("agents.list",{});if(console.log("[Agents] agents.list response:",JSON.stringify(e,null,2)?.substring(0,500)),e?.agents&&Array.isArray(e.agents)){const n=e.defaultId||"main";t.agentsList=e.agents.map(i=>({id:i.id,name:i.name?.trim()||i.identity?.name?.trim()||i.id,emoji:i.identity?.emoji?.trim()&&i.identity.emoji.trim().length<=8?i.identity.emoji.trim():"🤖",avatarUrl:i.identity?.avatarUrl||i.identity?.avatar||void 0,description:i.identity?.theme?.trim()||"",isDefault:i.id===n})),t.agentsList.find(i=>i.isDefault)||t.agentsList.unshift({id:n,name:n,emoji:"🤖",description:"",isDefault:!0}),t.agentsList.sort((i,o)=>i.isDefault&&!o.isDefault?-1:!i.isDefault&&o.isDefault?1:i.name.localeCompare(o.name)),console.log("[Agents] Loaded",t.agentsList.length,"agents:",t.agentsList.map(i=>`${i.id}(${i.name})`).join(", "));const a=t.agentsList.filter(i=>!i.isDefault&&i.name===i.id);a.length>0&&(console.log("[Agents] Found agents without names, attempting recovery:",a.map(i=>i.id)),await Cn())}else console.warn("[Agents] agents.list returned unexpected shape:",e)}catch(e){console.error("loadAgents error:",e)}t.agentsLoading=!1,d(),In()}}async function Cn(){const e=window.electronAPI;if(!(!e?.recoverAgentIdentities||!t.client))try{const n=await e.recoverAgentIdentities();if(!n?.ok||!n.agents?.length)return;const a=n.agents;console.log("[Agents] Recovered identities:",a.map(p=>`${p.id}→${p.name}${p.avatarUrl?" (has avatar)":""}`));let i=!1;for(const p of a){const m=t.agentsList.find(f=>f.id===p.id);m&&m.name===m.id&&p.name!==p.id?(m.name=p.name,m.emoji=p.emoji||m.emoji,m.description=p.description||m.description,p.avatarUrl&&(m.avatarUrl=p.avatarUrl),i=!0):m&&p.avatarUrl&&!m.avatarUrl&&(m.avatarUrl=p.avatarUrl,i=!0)}if(!i)return;d();const o=await t.client.request("config.get",{}),s=o?.hash||null,l=o?.config||{},c=l.agents?.list||[],g=c.some(p=>p.id==="main"||p.default===!0)?[...c]:[{id:"main",default:!0}];for(const p of a){if(g.some(h=>h.id===p.id&&h.name&&h.name!==h.id))continue;const m=g.findIndex(h=>h.id===p.id);m>=0&&g.splice(m,1);const f={name:p.name,emoji:p.emoji,theme:p.description};p.avatarUrl&&(f.avatar=p.avatarUrl),g.push({id:p.id,name:p.name,identity:f})}console.log("[Agents] Patching config to restore agent names:",g.map(p=>`${p.id}(${p.name})`)),await t.client.request("config.patch",{baseHash:s,raw:JSON.stringify({agents:{...l.agents,list:g}}),note:"恢复智能体名称",restartDelayMs:0})}catch(n){console.warn("[Agents] Recovery failed:",n)}}async function In(){const e=window.electronAPI;if(e?.syncAgentsToMainWorkspace)try{const n=t.agentsList.map(a=>({name:a.name,emoji:a.emoji,description:a.description,isDefault:a.isDefault}));await e.syncAgentsToMainWorkspace({agents:n}),console.log("[Agent] Synced agent list to main workspace")}catch(n){console.warn("[Agent] Failed to sync agents to main workspace:",n)}}async function Mn(e){t.agentCreateDraft={name:e.name,emoji:e.emoji,description:e.description,identityDesc:e.identityDesc,expertise:e.expertise,avatarDataUrl:""},t.editingAgentId=null,await ws()}async function ws(){if(!t.client||!t.connected)return;const e=t.agentCreateDraft,n=e.name.trim();if(!n){k("请填写名称");return}const i=n.replace(/[^a-zA-Z0-9]+/g,"-").replace(/^-+|-+$/g,"").toLowerCase().slice(0,32)||"agent-"+Date.now().toString(36);if(t.agentsList.find(o=>o.id===i)){k("已存在同名智能体");return}t.agentSaving=!0,d();try{const o=await t.client.request("config.get",{}),s=o?.hash||null,l=o?.config||{},c=l.agents?.list||[];console.log("[Agent] createAgent: existingList =",JSON.stringify(c));const g=c.some(h=>h.id==="main"||h.default===!0)?[...c]:[{id:"main",default:!0},...c],p={name:n,emoji:e.emoji.trim()||"🤖",theme:e.description.trim()||void 0};e.avatarDataUrl&&(p.avatar=e.avatarDataUrl);const m=[...g,{id:i,name:n,identity:p}];console.log("[Agent] createAgent: newList =",JSON.stringify(m));const f={agents:{...l.agents,list:m}};if(await t.client.request("config.patch",{baseHash:s,raw:JSON.stringify(f),note:`新建智能体: ${n}`,restartDelayMs:1e3}),window.electronAPI?.createAgentWorkspace){const h=await window.electronAPI.createAgentWorkspace({agentId:i,name:n,emoji:e.emoji.trim()||"🤖",description:e.description.trim(),identityDesc:e.identityDesc.trim(),expertise:e.expertise.trim(),selectedSkills:$s(e.selectedSkills||[])});console.log("[Agent] createAgentWorkspace result:",h)}e.avatarDataUrl&&window.electronAPI?.saveAgentAvatar&&await window.electronAPI.saveAgentAvatar({agentId:i,avatarDataUrl:e.avatarDataUrl}),k(`智能体 "${n}" 已创建`),t.creatingAgent=!1,t.agentCreateDraft={name:"",emoji:"🤖",description:"",identityDesc:"",expertise:"",avatarDataUrl:"",selectedSkills:[]},setTimeout(()=>it(),1500)}catch(o){k("创建失败: "+(o?.message||String(o)))}t.agentSaving=!1,d()}async function Dn(e){if(!t.client||!t.connected)return;const n=t.agentsList.find(a=>a.id===e);if(!(!n||n.isDefault)){t.agentSaving=!0,t.confirmingAgentDelete=null,d();try{const a=await t.client.request("config.get",{}),i=a?.hash||null,o=a?.config||{},l=(o.agents?.list||[]).filter(p=>p.id!==e),u=l.some(p=>p.id==="main"||p.default===!0)?l:[{id:"main",default:!0},...l],g={agents:{...o.agents,list:u}};await t.client.request("config.patch",{baseHash:i,raw:JSON.stringify(g),note:`删除智能体: ${n.name}`,restartDelayMs:1e3}),window.electronAPI?.deleteAgentWorkspace&&await window.electronAPI.deleteAgentWorkspace({agentId:e}),k(`智能体 "${n.name}" 已删除`),setTimeout(()=>it(),1500)}catch(a){k("删除失败: "+(a?.message||String(a)))}t.agentSaving=!1,d()}}async function Pn(e){if(t.editingAgentId=e.id,t.agentCreateDraft={name:e.name,emoji:e.emoji,description:e.description,identityDesc:"",expertise:"",avatarDataUrl:e.avatarUrl||"",selectedSkills:[]},t.creatingAgent=!0,d(),window.electronAPI?.readAgentWorkspace)try{const n=await window.electronAPI.readAgentWorkspace({agentId:e.id});if(n?.ok){if(n.description&&(t.agentCreateDraft.description=n.description),n.identityDesc&&(t.agentCreateDraft.identityDesc=n.identityDesc),n.expertise&&(t.agentCreateDraft.expertise=n.expertise),n.toolsSkillNames?.length){const a=[...R,...t.customSkills.filter(i=>!i.id.startsWith("__builtin_"))];t.agentCreateDraft.selectedSkills=n.toolsSkillNames.map(i=>a.find(o=>o.name===i)?.id).filter(i=>!!i)}d()}}catch(n){console.warn("[Agent] Failed to read workspace:",n)}}async function _n(){if(!t.client||!t.connected||!t.editingAgentId)return;const e=t.agentCreateDraft,n=e.name.trim();if(!n){k("请填写名称");return}t.agentSaving=!0,d();try{const a=await t.client.request("config.get",{}),i=a?.hash||null,o=a?.config||{},s=o.agents?.list||[],c=s.some(m=>m.id==="main"||m.default===!0)?s:[{id:"main",default:!0},...s],u={name:n,emoji:e.emoji.trim()||"🤖",theme:e.description.trim()||void 0};e.avatarDataUrl&&(u.avatar=e.avatarDataUrl);const g=c.map(m=>m.id===t.editingAgentId?{...m,name:n,identity:u}:m),p={agents:{...o.agents,list:g}};if(await t.client.request("config.patch",{baseHash:i,raw:JSON.stringify(p),note:`修改智能体: ${n}`,restartDelayMs:1e3}),window.electronAPI?.updateAgentWorkspace&&t.editingAgentId){const m=await window.electronAPI.updateAgentWorkspace({agentId:t.editingAgentId,name:n,emoji:e.emoji.trim()||"🤖",description:e.description.trim(),identityDesc:e.identityDesc.trim(),expertise:e.expertise.trim(),selectedSkills:$s(e.selectedSkills||[])});console.log("[Agent] updateAgentWorkspace result:",m)}e.avatarDataUrl&&window.electronAPI?.saveAgentAvatar&&t.editingAgentId&&await window.electronAPI.saveAgentAvatar({agentId:t.editingAgentId,avatarDataUrl:e.avatarDataUrl}),k(`智能体 "${n}" 已更新`),t.creatingAgent=!1,t.editingAgentId=null,t.agentCreateDraft={name:"",emoji:"🤖",description:"",identityDesc:"",expertise:"",avatarDataUrl:"",selectedSkills:[]},setTimeout(()=>it(),1500)}catch(a){k("更新失败: "+(a?.message||String(a)))}t.agentSaving=!1,d()}function Rn(e){const n=[],a=new Set;let i=e;const o=/@(\S+)/g;let s;for(;(s=o.exec(e))!==null;){const l=s[1],c=t.agentsList.find(u=>u.name===l||u.id===l);c&&!a.has(c.id)&&(a.add(c.id),n.push({agentId:c.id,agentName:c.name,agentEmoji:c.emoji,isDefault:!!c.isDefault}),i=i.replace(s[0],"").trim())}return{mentions:n,cleanText:i}}function Zt(){const e=t.mentionFilter;return t.agentsList.filter(n=>!e||n.name.toLowerCase().includes(e)||n.id.toLowerCase().includes(e))}function te(e){console.log("[Agent] insertAgentMention called:",e.name,e.id);const n=t.draft.replace(/@(\S*)$/,`@${e.name} `);t.draft=n===t.draft?t.draft+`@${e.name} `:n,t.sidePanel=null,t.mentionDropdownVisible=!1,t.mentionIndex=0,d(),setTimeout(()=>{t.inputRef?.focus()},50)}async function Se(){const e=window.electronAPI;if(e?.listManagedSkills)try{const n=await e.listManagedSkills();if(!n?.ok||!n.skills)return;const a=new Set(R.map(o=>o.folderName));let i=!1;for(const o of n.skills){if(a.has(o.folderName))continue;const s=t.customSkills.find(l=>l.folderName===o.folderName)||t.customSkills.find(l=>`custom-${l.id.slice(0,8)}`===o.folderName);if(s){const l=o.prompt||"",c=o.description||"";(s.prompt!==l||s.description!==c)&&(s.prompt=l,s.description=c,o.emoji&&(s.emoji=o.emoji),i=!0);continue}t.customSkills.push({id:T(),name:o.name===o.folderName?o.description.slice(0,20)||o.folderName:o.name,emoji:o.emoji||"🤖",description:o.description||"",prompt:o.prompt||"",pinned:!1,createdAt:Date.now(),folderName:o.folderName}),i=!0}i&&(J(),d())}catch(n){console.warn("Failed to sync managed skills:",n)}}function Le(e){t.editingSkill=e?{...e}:{id:T(),name:"",emoji:"🤖",description:"",prompt:"",pinned:!1,createdAt:Date.now()},d()}async function jn(){const e=t.editingSkill;if(!e||!e.name.trim()||!e.prompt.trim())return;const n=t.customSkills.findIndex(i=>i.id===e.id);n>=0?t.customSkills[n]=e:t.customSkills.push(e),J(),t.editingSkill=null;const a=window.electronAPI;if(a?.saveCustomSkill)try{const i=await a.saveCustomSkill({id:e.id,name:e.name,emoji:e.emoji,description:e.description,prompt:e.prompt});i?.folderName&&(e.folderName=i.folderName,J())}catch(i){console.warn("Failed to save skill to gateway:",i)}d()}async function qn(e){const n=t.customSkills.find(i=>i.id===e);if(!n||!confirm(`确定要删除技能"${n.name}"吗？`))return;n.taxstoreSkillId&&t.taxstoreInstalledIds.delete(n.taxstoreSkillId),t.customSkills=t.customSkills.filter(i=>i.id!==e),J(),d();const a=window.electronAPI;if(a?.deleteCustomSkill)try{await a.deleteCustomSkill(e,n.name,n.folderName)}catch(i){console.warn("Failed to delete skill file:",i)}}async function Ln(e){const n=window.electronAPI;if(!n?.exportSkill){alert("导出功能不可用");return}try{const a=await n.exportSkill(e.id,e.name);a.ok?alert(`技能已导出到：${a.path}`):a.error!=="cancelled"&&alert(`导出失败：${a.error}`)}catch(a){alert(`导出失败：${a.message||a}`)}}async function En(){const e=document.createElement("input");e.type="file",e.accept=".zip",e.onchange=async()=>{const n=e.files?.[0];if(!n)return;const a=new FileReader;a.onload=async()=>{const o=a.result.split(",")[1],s=window.electronAPI;if(!s?.installSkillPackage){alert("当前环境不支持技能包安装");return}k("正在安装技能包...");try{const l=await s.installSkillPackage(o,n.name);if(!l?.ok){alert(`安装失败: ${l?.error||"未知错误"}`);return}const c={id:T(),name:l.skill?.name||n.name.replace(/\.zip$/i,""),emoji:l.skill?.emoji||"📦",description:l.skill?.description||"",prompt:l.skill?.prompt||"",pinned:!1,createdAt:Date.now(),folderName:l.folderName};t.customSkills.push(c),J(),d(),k(`技能"${c.name}"已安装，正在重启服务...`),D(`技能包已安装: ${c.name}`,"📦")}catch(l){alert(`安装失败: ${l.message}`)}},a.readAsDataURL(n)},e.click()}function On(e){const n=t.customSkills.find(a=>a.id===e);n&&(n.pinned=!n.pinned,J(),d())}function tt(e){if(ps())return;t.activeCustomSkill=e,t.lastSkillName=e.folderName||`custom-${e.id.substring(0,8)}`;const n=`使用技能「${e.name}」`;t.draft.startsWith(n)||(t.draft=n+(t.draft?" "+t.draft:"")),t.sidePanel=null,d(),setTimeout(()=>{t.inputRef?.focus()},50)}function Bn(){t.activeCustomSkill=null,t.lastSkillName=null,d()}function Un(e,n,a,i,o,s){if(!t.client)return;if(t.lastSkillName=e,i){const c=R.find(u=>u.folderName===e);c&&(t.activeCustomSkill=c),t.draft="请执行票据整理流程",o?.();return}if(t.attachments.length>0){t.draft=n,o?.();return}t.pendingSkill={name:e,prompt:n,displayLabel:a};const l=document.createElement("input");l.type="file",l.accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.xml",l.multiple=!0,l.onchange=()=>{l.files&&l.files.length>0?s?.(l.files):t.pendingSkill=null},l.click()}let St=0;function $t(e){St=e}let G=[];function Fn(e){if(G=[],!e)return;const n=e.split(/(?=【[^\n】]+】)/);for(const a of n){const i=a.trim();if(!i)continue;const o=i.match(/^【([^\n】]+)】/),s=o?o[1]:"unknown",l=o?i.slice(o[0].length).trim():i,c=[],u=l.match(/[\u4e00-\u9fa5]{2,}/g);if(u){const p=new Map;for(const f of u)p.set(f,(p.get(f)||0)+1);const m=[...p.entries()].sort((f,h)=>h[1]-f[1]);for(const[f]of m.slice(0,30))c.push(f)}const g=l.match(/[a-zA-Z]{3,}/g);if(g){const p=new Map;for(const m of g)p.set(m.toLowerCase(),(p.get(m.toLowerCase())||0)+1);for(const[m]of[...p.entries()].sort((f,h)=>h[1]-f[1]).slice(0,10))c.push(m)}G.push({fileName:s,content:l,keywords:c})}console.log(`[Knowledge] Indexed ${G.length} chunks`)}function zn(e,n=4e3){if(G.length===0)return t.folderKnowledge||"";if(G.reduce((c,u)=>c+u.content.length,0)<=n)return G.map(c=>`【${c.fileName}】
${c.content}`).join(`

`);const i=e.toLowerCase(),o=G.map(c=>{let u=0;for(const g of c.keywords)i.includes(g.toLowerCase())&&(u+=2);return i.includes(c.fileName.toLowerCase())&&(u+=5),{chunk:c,score:u}});o.sort((c,u)=>u.score-c.score);const s=[];let l=0;for(const{chunk:c,score:u}of o){if(u===0&&s.length>0)break;const g=`【${c.fileName}】
${c.content}`;if(l+g.length>n&&s.length>0)break;s.push(g),l+=g.length}return s.join(`

`)}async function ot(){const e=window.electronAPI;if(!(!e?.getFolderKnowledge||!t.authorizedFolder))try{const n=await e.getFolderKnowledge();n?.ok&&n.content&&(t.folderKnowledge=n.content,Fn(n.content),console.log(`Folder knowledge loaded: ${n.files?.length||0} files, ${n.content.length} chars`))}catch(n){console.warn("Failed to load folder knowledge:",n)}}async function V(){const e=window.electronAPI;if(!(!e?.listKnowledgeFiles||!t.authorizedFolder)){t.knowledgeLoading=!0,d();try{const n=await e.listKnowledgeFiles(t.authorizedFolder);n?.ok&&(t.knowledgeFiles=n.files||[])}catch(n){console.warn("Failed to list knowledge files:",n)}t.knowledgeLoading=!1,d()}}async function Nn(e){const n=window.electronAPI;if(!n?.copyToKnowledgeFolder||!t.authorizedFolder)return;const a=e.dataTransfer?.files;if(!(!a||a.length===0))for(let i=0;i<a.length;i++){const o=a[i],s=new FileReader;s.onload=async()=>{const c=s.result.split(",")[1];if(c){try{await n.copyToKnowledgeFolder({folderPath:t.authorizedFolder,fileName:o.name,base64Data:c})}catch(u){console.warn("Failed to copy file to knowledge folder:",u)}i===a.length-1&&(await V(),await ot(),t.folderKnowledgeSent=!1)}},s.readAsDataURL(o)}}function Vn(e){t.knowledgeRefs.some(n=>n.name===e)||(t.knowledgeRefs.push({name:e}),d())}function Kn(e){t.knowledgeRefs.splice(e,1),d()}async function Hn(e){const n=window.electronAPI;if(!(!n?.deleteKnowledgeFile||!t.authorizedFolder))try{await n.deleteKnowledgeFile(t.authorizedFolder,e),t.knowledgeRefs=t.knowledgeRefs.filter(a=>a.name!==e),await V(),await ot(),t.folderKnowledgeSent=!1}catch(a){console.warn("Failed to delete knowledge file:",a)}}async function ys(e){const n=window.electronAPI;t.importingFolder=!0,t.importResult=null,d();try{const a=await n.importFolderToMemory(e);t.importingFolder=!1,a.ok?(t.authorizedFolder=a.folderPath,localStorage.setItem("taxbot_authorized_folder",a.folderPath),t.importResult=An(a),D(`文件夹已导入: ${t.importResult}`,"📂"),await ot(),t.folderKnowledgeSent=!1,xs()):t.importResult=a.error||"导入失败"}catch(a){t.importingFolder=!1,t.importResult=a?.message||"导入失败"}d()}async function ee(){const e=window.electronAPI;if(!e?.openFolderDialog)return;const n=await e.openFolderDialog();n&&await ys(n)}async function Wn(){t.authorizedFolder&&await ys(t.authorizedFolder)}async function Gn(e){const n=window.electronAPI;if(!n?.copyToKnowledgeFolder)return;if(!t.authorizedFolder){k("请先在知识库中选择文件夹");return}const a=`Taxbot_${hs()}.doc`,i=bs(e),o=btoa(unescape(encodeURIComponent(i)));try{await n.copyToKnowledgeFolder({folderPath:t.authorizedFolder,fileName:a,base64Data:o}),k(`已保存到知识库: ${a}`),await V(),await ot(),t.folderKnowledgeSent=!1}catch(s){console.warn("Failed to save to knowledge:",s),k("保存失败")}}function xs(){const e=window.electronAPI;!e?.startFolderWatcher||!t.authorizedFolder||e.startFolderWatcher(t.authorizedFolder)}let Ee=!1;function Jn(){if(Ee)return;const e=window.electronAPI;e?.onFolderKnowledgeUpdated&&(Ee=!0,e.onFolderKnowledgeUpdated(async n=>{console.log(`Folder watcher: ${n.count} new file(s) detected`),await ot();const i=`新知识已学习: ${n.newFiles.length<=3?n.newFiles.join("、"):n.newFiles.slice(0,3).join("、")+` 等${n.newFiles.length}个文件`}`;k(i),D(i,"📚"),d()}))}let Oe=!1;function Yn(){if(Oe)return;const e=window.electronAPI;e?.onManagedSkillsUpdated&&(Oe=!0,e.onManagedSkillsUpdated(()=>{console.log("Managed skills directory changed, syncing..."),Se()}))}function Ot(e,n){const a=t.messages;if(a.length===0)return"";const i=a.slice(-30),o=[];let s=0;for(const c of i){let u,g=!0;if(c.type==="user"){const p=c;p.targetAgentNames&&p.targetAgentNames.length>0?(u=`【用户→${p.targetAgentNames.join("、")}】${p.text}`,n&&(g=p.targetAgentNames.includes(n))):(u=`【用户→Taxbot】${p.text}`,g=!0)}else{const p=c,m=p.agentName||"Taxbot",f=p.agentEmoji||"";let h=c.text;n&&m!==n&&m!=="Taxbot"?(g=!1,h=h.length>80?h.slice(0,80)+"...":h):h.length>2e3&&(h=h.slice(0,2e3)+"...（已截断）"),u=g?`★【${f}${m}】${h}`:`【${f}${m}】${h}`}if(c.type==="user"&&g&&n&&(u="★"+u),s+u.length>zs)break;o.push(u),s+=u.length}return o.length===0?"":`${n?`【以下是对话记录。标有 ★ 的是与你（${n}）直接相关的消息，其余为其他智能体的简要记录。你只需回复发给你的消息。】`:'【以下是当前群组对话记录。每条用户消息标注了发送目标（如"用户→Taxbot"表示发给Taxbot的）。你只需回复发给你的消息，不要回复发给其他智能体的消息。你可以参考对话上下文来理解背景，但不要主动回答别人的问题。】'}

${o.join(`

`)}`}function Bt(e){const n=e.trim();return!n||/^NO$/i.test(n)||n==="回复获取失败，请重试。"||n==="模型未能正确回复，请重新发送您的问题。"}function se(e,n){if(!t.collaborationTasks||!e)return;const a=t.collaborationTasks.find(o=>o.agentId===e);a&&(a.status=n),t.collaborationTasks.every(o=>o.status==="done"||o.status==="error")&&setTimeout(()=>{t.collaborationTasks=null,d()},3e3)}function mt(e){const n=t.activeRuns.get(e);if(!n)return;const a=!Ks(e),i=gt(e);if(i.filter(p=>p.type==="assistant").some(p=>!Bt(p.text||""))){const p=i.filter(m=>m.type==="assistant"&&Bt(m.text||"")?(console.log("[finishSending] Removing bad message:",(m.text||"").substring(0,40)),!1):!0);if(a){const m=e.startsWith("taxchat-")?e.slice(8):e;t.backgroundMessages.set(m,p),pt(m,p),t.unreadConversations.add(m);const f=t.conversations.find(h=>h.id===m);f&&(f.updatedAt=Date.now(),f.messageCount=p.length)}else t.messages=p,Jt();t.activeRuns.delete(e),se(n.agentId,"done"),e===t.sessionKey&&t.pendingDispatch&&Ne(),!n.reactive&&n.agentId&&Ve(n),d();return}const l=i[i.length-1],c=(l?.text||"").trim(),u=l?.type==="assistant"&&/^NO$/i.test(c),g=l?.type==="assistant"&&c==="回复获取失败，请重试。";if((u||g)&&n._retryCount<1){n._retryCount++,console.log(`[AutoRetry] Model responded with "${c}", retrying (attempt ${n._retryCount}) for ${e}`),i.pop(),n.thinkingLabel="正在重试...",n.toolsActive=0,n.runId=null,d();const p=T();t.client?.request("chat.send",{sessionKey:e,message:"请直接回答上面的问题。",deliver:!1,idempotencyKey:p}).catch(m=>{if(console.error("Auto-retry send failed:",m),t.activeRuns.delete(e),se(n.agentId,"error"),a){const f=e.startsWith("taxchat-")?e.slice(8):e;pt(f,i),t.unreadConversations.add(f)}else Jt();d()});return}if(t.activeRuns.delete(e),se(n.agentId,"done"),a){const p=e.startsWith("taxchat-")?e.slice(8):e;pt(p,i),t.unreadConversations.add(p);const m=t.conversations.find(f=>f.id===p);m&&(m.updatedAt=Date.now(),m.messageCount=i.length)}else Jt();e===t.sessionKey&&t.pendingDispatch&&Ne(),!n.reactive&&n.agentId&&Ve(n),d()}const Be=1500,Qn=1e4,Ue=12e4,B=new Map;function Xn(e){if(!e?.messages||e.messages.length===0)return"";const n=e.messages;let a=-1;for(let s=n.length-1;s>=0;s--)if(n[s].role==="user"){a=s;break}const i=a>=0?a+1:0,o=[];for(let s=i;s<n.length;s++)if(n[s].role==="assistant"){const l=qt(n[s]);l&&!Lt(l)&&o.push(l)}if(o.length===0)for(let s=i;s<n.length;s++){const l=n[s].content;if(Array.isArray(l)){for(const c of l)if(c?.type==="tool_result"){const u=c.content;if(typeof u=="string"&&u.trim())o.push(u.trim());else if(Array.isArray(u))for(const g of u)g?.type==="text"&&typeof g.text=="string"&&g.text.trim()&&o.push(g.text.trim())}}}return o.join(`

`)}function ne(e,n,a){const i=gt(n),o=i.findIndex(s=>s.type==="assistant"&&s.id===e);if(o>=0)a.length>(i[o].text||"").length&&(i[o].text=a);else{const s=t.activeRuns.get(n);i.push({type:"assistant",text:a,timestamp:Date.now(),id:e,agentId:s?.agentId||void 0,agentEmoji:s?.agentEmoji||void 0,agentName:s?.agentName||void 0,agentAvatarUrl:s?.agentAvatarUrl||void 0})}}function Fe(e,n){B.get(n)?.abort();const a=new AbortController;B.set(n,a);const i=a.signal,o=Date.now();let s=Date.now(),l="";const c=()=>{if(i.aborted||!t.activeRuns.has(n)){B.delete(n);return}if(Date.now()-o>Ue){l&&ne(e,n,l),mt(n),B.delete(n);return}t.client?.request("chat.history",{sessionKey:n,limit:20}).then(u=>{if(i.aborted||!t.activeRuns.has(n)){B.delete(n);return}const g=Xn(u);if(g&&g!==l&&(s=Date.now(),l=g,ne(e,n,g),d()),l.length>0&&Date.now()-s>Qn){ne(e,n,l),mt(n),B.delete(n);return}setTimeout(c,Be)}).catch(()=>{i.aborted||(Date.now()-o<Ue?setTimeout(c,Be):(l||!t.messages.some(g=>g.type==="assistant"&&!Bt(g.text||""))&&!t.messages.some(g=>g.id===e)&&t.messages.push({type:"assistant",text:"回复获取失败，请重试。",timestamp:Date.now(),id:e}),mt(n),B.delete(n)))})};setTimeout(c,800)}function Zn(e){const n=B.get(e);n&&(n.abort(),B.delete(e))}function ta(){for(let e=t.messages.length-1;e>=0;e--)if(t.messages[e].type==="assistant")return t.messages[e].text||"";return""}function ze(e,n){const a=[new RegExp(`【分配给\\s*${vt(n)}】([\\s\\S]*?)(?=【分配给|$)`,"i"),new RegExp(`【${vt(n)}】([\\s\\S]*?)(?=【|$)`,"i"),new RegExp(`(?:^|\\n)\\*?\\*?${vt(n)}\\*?\\*?[：:]([\\s\\S]*?)(?=\\n\\*?\\*?\\S+[：:]|$)`,"im")];for(const i of a){const o=e.match(i);if(o&&o[1]?.trim())return o[1].trim()}return null}async function Ne(){const e=t.pendingDispatch;if(!e||!t.client){t.pendingDispatch=null;return}t.pendingDispatch=null;const n=ta();if(!n){console.warn("[Orchestration] No main response found, skipping dispatch");return}console.log("[Orchestration] Main responded, dispatching to agents:",e.targets.map(i=>i.agent?.name));const a=[];for(const i of e.targets){const o=i.agent?.name||i.agentId,s=ze(n,o);a.push({agentId:i.agentId,agentName:o,agentEmoji:i.agent?.emoji||"🤖",task:s?s.length>60?s.slice(0,60)+"...":s:"处理用户请求",status:"working"})}t.collaborationTasks=a;for(const i of e.targets){if(ut(i.sessionKey))continue;const o=i.agent?.name||i.agentId,s=ze(n,o);let l;if(s?l=`${s}

（以上是协调者为你分配的任务。用户的原始请求：${e.finalMessage}）

提示：如需其他智能体协助，请使用 @智能体名称 格式标注。`:l=`协调者的分析如下：
${n}

请根据你的专长，回应用户的请求：${e.finalMessage}

提示：如需其他智能体协助，请使用 @智能体名称 格式标注。`,i.agentId){const p=await at(i.agentId);p&&(l=`【智能体记忆】
${p}
---

${l}`)}const c=Ot([],o);c&&(l=`${c}

---

${l}`),t.activeRuns.set(i.sessionKey,{runId:null,sessionKey:i.sessionKey,agentId:i.agentId,agentName:i.agent?.name||null,agentEmoji:i.agent?.emoji||null,agentAvatarUrl:i.agent?.avatarUrl||null,thinkingLabel:"正在思考...",toolsActive:0,_retryCount:0,reactive:!1});const u=T(),g={sessionKey:i.sessionKey,message:l,deliver:!1,idempotencyKey:u};e.apiAttachments.length>0&&(g.attachments=e.apiAttachments),console.log(`[Orchestration] Dispatching to ${o} (${i.sessionKey})`),t.client.request("chat.send",g).then(p=>{console.log(`[Orchestration] ${o} accepted:`,p)}).catch(p=>{t.messages.push({type:"assistant",text:`${o} 任务发送失败：${String(p)}`,timestamp:Date.now(),id:T()}),t.activeRuns.delete(i.sessionKey),d()})}d()}function ea(e,n){if(e.includes(`@${n}`)||new RegExp(`【[^】]*${vt(n)}[^【]*】`).test(e))return!0;if(n.length>=3){const a=`(?:^|[\\s，。、！？：；""''（）《》])${vt(n)}(?:$|[\\s，。、！？：；""''（）《》])`;if(new RegExp(a,"m").test(e))return!0}return!1}function Ve(e){if(!t.client)return;let n="";for(let o=t.messages.length-1;o>=0;o--){const s=t.messages[o];if(s.type==="assistant"&&s.agentId===e.agentId){n=s.text;break}}if(!n||n.length<5)return;const a=[];for(const o of t.agentsList)o.id!==e.agentId&&(o.isDefault||ea(n,o.name)&&a.push(o));if(a.length===0)return;const i=e.agentName||"智能体";for(const o of a){const s=`agent:${o.id}:main`;if(ut(s))continue;const l=`${i}在回复中提到了你（${o.name}）。以下是${i}的回复：

${n.length>800?n.slice(0,800)+"...（已截断）":n}

请根据对话上下文判断，如果${i}的回复涉及你的专长或需要你补充，请给出你的回复。如果与你无关，请简短回复"无需补充"即可。`,c=Ot([],o.name);let u=l;c&&(u=`${c}

---

${l}`),console.log(`[Reactive] ${i} mentioned ${o.name}, dispatching`),t.activeRuns.set(s,{runId:null,sessionKey:s,agentId:o.id,agentName:o.name,agentEmoji:o.emoji,agentAvatarUrl:o.avatarUrl||null,thinkingLabel:"正在思考...",toolsActive:0,_retryCount:0,reactive:!0});const g=T();t.client.request("chat.send",{sessionKey:s,message:u,deliver:!1,idempotencyKey:g}).then(p=>{console.log(`[Reactive] ${o.name} accepted:`,p)}).catch(p=>{t.messages.push({type:"assistant",text:`${o.name} 响应失败：${String(p)}`,timestamp:Date.now(),id:T()}),t.activeRuns.delete(s),d()})}d()}async function At(e){const n=Array.from(e);console.log("handleFiles called with",n.length,"files");for(const a of n){if(console.log("Processing file:",a.name,"size:",a.size,"type:",a.type),a.size>10*1024*1024){t.lastError=`文件"${a.name}"过大（>10MB），请选择更小的文件`,d();continue}try{const i=await hn(a);console.log("File read as data URL, length:",i.length),t.attachments.push({name:a.name,type:a.type,size:a.size,dataUrl:i}),console.log("File added to attachments, total:",t.attachments.length)}catch(i){t.lastError=`无法读取文件"${a.name}"：${String(i)}`,console.error("File read error:",i)}}if(console.log("Final attachments count:",t.attachments.length),t.pendingSkill&&t.attachments.length>0){const a=t.pendingSkill;t.pendingSkill=null,t.draft=a.prompt,d(),Ut();return}d()}async function Ut(){if(!t.client||!t.draft.trim()&&t.attachments.length===0)return;const e=t.draft.trim(),n=T(),{mentions:a,cleanText:i}=Rn(e),o=[];let s=!1;for(const b of a)if(b.isDefault)s=!0;else{const $=`agent:${b.agentId}:main`,P=t.agentsList.find(M=>M.id===b.agentId)||null;o.push({sessionKey:$,agentId:b.agentId,agent:P})}const l=o.length>=2,c=[];if(l)c.push({sessionKey:t.sessionKey,agentId:null,agent:null});else if(a.length===0)c.push({sessionKey:t.sessionKey,agentId:null,agent:null});else{s&&c.push({sessionKey:t.sessionKey,agentId:null,agent:null});for(const b of o)c.push(b)}const u=[],g=[];for(const b of c)if(ut(b.sessionKey)){const $=b.agent?`${b.agent.emoji||"🤖"} ${b.agent.name}`:"智能体";u.push($)}else g.push(b);if(l){for(const b of o)if(ut(b.sessionKey)){const $=b.agent?`${b.agent.emoji||"🤖"} ${b.agent.name}`:"智能体";u.includes($)||u.push($)}}if(u.length>0&&k(`${u.join("、")} 正在工作中，请稍等，或安排其它智能体处理`),g.length===0)return;for(const b of g)t.activeRuns.set(b.sessionKey,{runId:null,sessionKey:b.sessionKey,agentId:b.agentId,agentName:b.agent?.name||null,agentEmoji:b.agent?.emoji||null,agentAvatarUrl:b.agent?.avatarUrl||null,thinkingLabel:l?"正在分析任务...":"正在思考...",toolsActive:0,_retryCount:0,reactive:!1});t.lastSkillName=null;const p=t.activeCustomSkill;t.activeCustomSkill=null;const m=a.length>0?i:e;let f=p;if(!f&&m){const b=m.toLowerCase();for(const $ of t.customSkills)if($.prompt&&$.name&&b.includes($.name.toLowerCase())){f=$;break}if(!f){for(const $ of R)if($.prompt&&$.name&&b.includes($.name.toLowerCase())){f=$;break}}}let h;if(f&&f.prompt){let b="";f.id==="__builtin_knowledge-base"&&t.authorizedFolder&&(b=`

【知识库路径】
${t.authorizedFolder}`),h=`请严格按照以下操作流程处理用户的输入。

【${f.name} - 操作流程】
${f.prompt}

【用户输入】
${m}${b}`,console.log(`[Skill] Embedded prompt for skill "${f.name}", prompt length: ${f.prompt.length}`)}else f?(h=`请按照${f.name}的操作流程处理以下内容。

${m}`,console.log(`[Skill] Skill "${f.name}" active but no prompt text`)):h=m;const w=t.attachments.length>0,x=t.attachments.some(b=>b.type.startsWith("image/")),C=t.attachments.some(b=>b.type==="application/pdf"||b.type.includes("word")||b.type.includes("excel")||b.type.includes("document")),y=e||`(${t.attachments.length} 个文件)`;w&&!f?m?x&&(h=`${m}

（注：请先识别并提取图片中的文字内容，然后结合我的问题进行分析）`):x&&C?h="请分析这些图片和文档，提取其中的文字内容并总结要点。":x?h="请提取图片中的所有文字内容，保持原有的结构和格式。如果图片中没有文字，请描述图片的内容。":C&&(h="请分析这个文档，提取并总结其中的主要内容。"):w&&f&&x&&(h+=`

（注：请先识别并提取图片中的文字内容，然后结合操作流程进行分析）`);const A=t.replyingTo;if(A){const b=A.type==="user"?"用户":A.agentName||"Taxbot",$=A.text.length>300?A.text.slice(0,300)+"...":A.text;h=`【引用 ${b} 的消息】：${$}

${h}`}const lt=t.attachments.length>0?[...t.attachments]:void 0;t.messages.push({type:"user",text:y,timestamp:Date.now(),id:n,attachments:lt,targetAgentNames:a.length>0?a.map(b=>b.agentName):void 0,replyToId:A?.id}),pn(),Q(),t.replyingTo=null,t.draft="",d();let I=t.attachments.map(b=>{const $=/^data:([^;]+);base64,(.+)$/.exec(b.dataUrl);if(!$)return console.warn("Failed to parse data URL for file:",b.name),null;const P=$[1];let M="document";P.startsWith("image/")&&(M="image");const U={type:M,mimeType:P,fileName:b.name,content:$[2]};return console.log(`Prepared attachment: ${b.name}, type: ${M}, mime: ${P}, base64 length: ${$[2].length}`),U}).filter(b=>b!==null);console.log(`Total attachments prepared: ${I.length}`);let Ht="";if(C&&(Ht=await Sn(t.attachments),Ht&&(h+=`

【文件内容】
${Ht}`)),I=I.filter(b=>b.type==="image"),t.attachments=[],t.knowledgeRefs.length>0){const b=window.electronAPI;if(b?.readKnowledgeFile){const $=[];for(const P of t.knowledgeRefs)try{const M=await b.readKnowledgeFile(P.name);M?.ok&&M.content&&$.push(`【知识库引用: ${P.name}】
${M.content}`)}catch{}$.length>0&&(h=`${h}

---
${$.join(`

`)}
---`)}t.knowledgeRefs=[],d()}if(t.folderKnowledge&&!t.folderKnowledgeSent){const b=zn(m||h);b&&(h=`${h}

---
【已导入知识库文件内容】
以下是与你的问题相关的知识库内容：
${b}
---`),t.folderKnowledgeSent=!0}const Wt=h||(I.length>0?"(查看附件)":"");if(l){const $=`用户同时@了以下智能体协同工作：${o.map(q=>`${q.agent?.emoji||"🤖"} ${q.agent?.name||q.agentId}`).join("、")}。

请分析用户的意图，根据每个智能体的专长为它们分配具体的子任务。回复格式要求：
1. 先简要说明你的任务分解思路
2. 然后用以下格式为每个智能体分配任务：

【分配给 智能体名称】
具体的任务描述...

用户的原始请求：${Wt}`,P=o.filter(q=>!ut(q.sessionKey));t.pendingDispatch={targets:P,finalMessage:Wt,apiAttachments:[...I]};const M=Ot(g.map(q=>q.sessionKey));let U=$;M&&(U=`${M}

---

${$}`);const j=T(),Me={sessionKey:t.sessionKey,message:U,deliver:!1,idempotencyKey:j};I.length>0&&(Me.attachments=I),console.log("[Orchestration] Sending to main for task dispatch:",t.sessionKey),t.client.request("chat.send",Me).then(q=>{console.log("[Orchestration] Main accepted:",q)}).catch(q=>{t.messages.push({type:"assistant",text:`任务分配失败：${String(q)}`,timestamp:Date.now(),id:T()}),t.activeRuns.delete(t.sessionKey),t.pendingDispatch=null,d()});return}for(const b of g){let $=Wt;if(b.agentId){const j=await at(b.agentId);j&&($=`【智能体记忆 — 以下是你在之前对话中积累的重要结论和知识，请参考】
${j}
---

${$}`)}const P=Ot([],b.agent?.name);P&&($=`${P}

---

${$}`);const M=T(),U={sessionKey:b.sessionKey,message:$,deliver:!1,idempotencyKey:M};I.length>0&&(U.attachments=I),console.log(`Sending chat.send to ${b.sessionKey}:`,{...U,attachments:I.map(j=>({...j,content:j.content.substring(0,50)+"..."}))}),t.client.request("chat.send",U).then(j=>{console.log(`Chat.send response (${b.sessionKey}):`,j)}).catch(j=>{t.messages.push({type:"assistant",text:`抱歉，发送消息时出错（${b.agent?.name||"默认"}）：${String(j)}`,timestamp:Date.now(),id:T()}),t.activeRuns.delete(b.sessionKey),d()})}}function sa(e){!t.client||!t.activeRuns.get(e)||(Zn(e),t.client.request("chat.abort",{sessionKey:e}).catch(()=>{}),t.activeRuns.delete(e),e===t.sessionKey&&t.pendingDispatch&&(t.pendingDispatch=null),d())}function na(){t.messages=[],t.draft="",t.activeRuns.clear(),t.pendingDispatch=null,t.favorites.clear(),t.sidePanel=null,t.confirmingClear=!1,t.folderKnowledgeSent=!1,xe(),Q(),d()}async function aa(){if(t.confirmingSessionClear=!1,!t.client||!t.connected){k("未连接到服务"),d();return}try{await t.client.request("sessions.delete",{key:t.sessionKey,deleteTranscript:!0}),t.messages=[],t.draft="",t.activeRuns.clear(),t.folderKnowledgeSent=!1,Q(),k("会话已清空")}catch(e){k("清空失败: "+(e?.message||String(e)))}d()}function Ke(){const e=window.electronAPI;e?.quitApp?e.quitApp():window.close()}let ue=[],ge=!1;function F(e){ue.push(e),ge||(ge=!0,queueMicrotask(ia))}function ia(){for(;ue.length>0;){const e=ue.shift();try{e()}catch(n){console.error("[UpdateQueue] Error in queued update:",n)}}ge=!1,d()}let st=null,Ct=0,It=!1;function pe(){st&&(clearTimeout(st),st=null)}function oa(){if(st||It)return;Ct++;const e=Math.min(2e3*Ct,1e4);console.log(`[Reconnect] attempt ${Ct} in ${e}ms`),st=setTimeout(()=>{st=null,nt()},e)}async function nt(){It=!0,pe(),t.lastError=null,t.client&&(t.client.stop(),t.client=null);let e;try{const n=window.electronAPI;if(n?.getGatewayPort){const a=await n.getGatewayPort();a&&a!==18789&&(t.gatewayUrl=`ws://127.0.0.1:${a}`,console.log(`[Gateway] Using port ${a}`))}n?.getGatewayToken&&(e=await n.getGatewayToken()||void 0)}catch{}e||(e=new URLSearchParams(window.location.search).get("token")||void 0),It=!1,t.client=new Es({url:t.gatewayUrl,clientName:"webchat-ui",mode:"webchat",token:e,onHello:n=>{t.connected=!0,t.hello=n,t.lastError=null,Ct=0,pe(),d(),it()},onClose:({code:n})=>{t.connected=!1,!It&&(n!==1012&&(t.lastError="正在等待服务启动..."),d(),oa())},onEvent:n=>{if(console.log("Gateway event:",n.event,n.payload),n.event==="agent"){const a=n.payload,i=a?.sessionKey?String(a.sessionKey):"",o=i?Pe(i):null;if(!o&&i)return;if(a?.stream==="tool"&&a?.data){const s=a.data.phase,l=a.data.name||"";s==="start"&&o?F(()=>{o.toolsActive=(o.toolsActive||0)+1,o.thinkingLabel=yn(l)}):s==="result"&&o&&F(()=>{o.toolsActive=Math.max(0,(o.toolsActive||0)-1),o.thinkingLabel="正在思考..."})}else if(a?.stream==="lifecycle"&&a?.data?.phase==="end"){if(o){F(()=>{o.toolsActive=0});const s=o.runId||a.runId||T(),l=o.sessionKey;setTimeout(()=>{t.activeRuns.has(l)&&(console.log("Lifecycle end triggered fetchCompleteResponse (safety net) for",l),F(()=>{const c=t.activeRuns.get(l);c&&(c.thinkingLabel="正在整理回复...")}),Fe(s,l))},300)}setTimeout(()=>Se(),2e3)}else a?.stream==="assistant"&&o&&o.thinkingLabel&&o.thinkingLabel!=="正在思考..."&&F(()=>{o.thinkingLabel="正在思考..."})}if(n.event==="chat"){const a=n.payload,i=a?.sessionKey?String(a.sessionKey):"",o=i?Pe(i):null;if(!o&&i)return;if(console.log("Chat message received:",a.message,"state:",a.state,"session:",i),a.state==="delta"&&a?.message){const s=typeof a.message=="string"?a.message:qt(a.message);s&&!Lt(s)&&o&&F(()=>{!o.runId&&a.runId&&(o.runId=a.runId);const l=gt(o.sessionKey),c=l.findIndex(u=>u.type==="assistant"&&u.id===a.runId);c>=0?l[c].text=s:l.push({type:"assistant",text:s,timestamp:Date.now(),id:a.runId,agentId:o.agentId||void 0,agentEmoji:o.agentEmoji||void 0,agentName:o.agentName||void 0,agentAvatarUrl:o.agentAvatarUrl||void 0})})}a.state==="final"&&o&&F(()=>{if(!o.runId&&a.runId&&(o.runId=a.runId),o.runId&&a.runId!==o.runId){console.log("Ignoring final from different run:",a.runId,"expected:",o.runId);return}let s="";if(a?.message){const c=typeof a.message=="string"?a.message:qt(a.message);c&&!Lt(c)&&(s=c)}if(s){const c=gt(o.sessionKey),u=c.findIndex(g=>g.type==="assistant"&&g.id===a.runId);u>=0?c[u].text=s:c.push({type:"assistant",text:s,timestamp:Date.now(),id:a.runId,agentId:o.agentId||void 0,agentEmoji:o.agentEmoji||void 0,agentName:o.agentName||void 0,agentAvatarUrl:o.agentAvatarUrl||void 0})}if(o.toolsActive>0){console.log("Tools still active ("+o.toolsActive+"), deferring fetchCompleteResponse for",o.sessionKey);return}const l=o.runId||a.runId;s&&!Bt(s)?(console.log("[final] Inline text is good, finishing immediately for",o.sessionKey),mt(o.sessionKey)):(console.log("[final] No good inline text, falling back to polling for",o.sessionKey),o.thinkingLabel="正在整理回复...",Fe(l,o.sessionKey))}),a.state==="error"&&o&&F(()=>{const s=gt(o.sessionKey),l=a.errorMessage||"处理请求时出错";s.push({type:"assistant",text:`错误：${l}`,timestamp:Date.now(),id:T()}),mt(o.sessionKey)})}}}),t.client.start()}function la(){const e=new Set,n=[];for(const a of t.modelList){const i=a.provider||"unknown";e.has(i)||(e.add(i),n.push(i))}return n}function ve(e){return t.modelList.filter(n=>n.provider===e)}function ra(e){t.modelConfigDraft.provider=e,t.modelConfigDraft.baseUrl="",t.modelConfigDraft.apiKey="",t.modelConfigDraft.api="openai-completions",t.apiKeyVisible=!1;const n=t.currentModelConfig?.providers;if(n&&typeof n=="object"){const i=n[e];i&&(t.modelConfigDraft.baseUrl=i.baseUrl||"",t.modelConfigDraft.apiKey=i.apiKey||"",t.modelConfigDraft.api=i.api||"openai-completions")}const a=ve(e);t.modelConfigDraft.modelId=a.length>0?a[0].id:"",d()}function ca(e){t.modelConfigDraft.modelId=e,d()}function da(e){const n=e?.models?.providers;if(!n||typeof n!="object")return;const a=Object.keys(n);if(a.length===0)return;const i=a[0],o=n[i],s=o?.models?.[0]?.id||"",l=o?.baseUrl||"",c=o?.apiKey||"";t.modelConfigDraft={provider:i,baseUrl:l,apiKey:c,api:o?.api||"openai-completions",modelId:s},t.activeModel={provider:i,modelId:s,baseUrl:l,apiKey:c}}async function He(){if(!t.client||!t.connected){t.modelError="未连接到服务",d();return}t.modelLoading=!0,t.modelError=null,d();try{const[e,n]=await Promise.all([t.client.request("models.list",{}),t.client.request("config.get",{})]);t.modelList=Array.isArray(e?.models)?e.models:[],t.configBaseHash=n?.hash||null,t.currentModelConfig=n?.config?.models||null,da(n?.config)}catch(e){t.modelError=e?.message||String(e)}t.modelLoading=!1,d()}async function ua(){if(!t.client||!t.connected){t.modelError="未连接到服务",d();return}const e=t.modelConfigDraft;if(!e.provider.trim()){t.modelError="请填写提供商名称",d();return}if(!e.baseUrl.trim()){t.modelError="请填写 API 地址",d();return}if(!e.modelId.trim()){t.modelError="请填写模型 ID",d();return}t.modelSaving=!0,t.modelError=null,d();try{const n={models:{providers:{[e.provider.trim()]:{baseUrl:e.baseUrl.trim(),apiKey:e.apiKey.trim()||void 0,api:e.api,models:[{id:e.modelId.trim(),name:e.modelId.trim(),reasoning:!1,input:["text","image"],cost:{input:0,output:0,cacheRead:0,cacheWrite:0},contextWindow:128e3,maxTokens:8192}]}}}};await t.client.request("config.patch",{baseHash:t.configBaseHash,raw:JSON.stringify(n),note:"模型配置更新",restartDelayMs:1e3}),k("模型配置已保存，服务正在重启..."),t.settingsView="main"}catch(n){t.modelError=n?.message||String(n)}t.modelSaving=!1,d()}let me=[];function ga(e){me=e}function Ft(){const e=t.commandFilter.toLowerCase().replace(/^\//,"");return e?me.filter(n=>n.name.toLowerCase().includes(e)||n.id.toLowerCase().includes(e)||n.description.toLowerCase().includes(e)):me}function pa(){t.commandPaletteVisible=!0,t.commandFilter=t.draft,t.commandIndex=0,d()}function zt(){t.commandPaletteVisible=!1,t.commandFilter="",t.commandIndex=0,d()}function va(e){zt(),t.draft="",e.action(),d()}function ma(){const e=t.draft.trim();return e.startsWith("/")&&!e.includes(" ")?(t.commandPaletteVisible?(t.commandFilter=e,t.commandIndex=0,d()):pa(),!0):(t.commandPaletteVisible&&zt(),!1)}function We(e){const n=Ft();n.length!==0&&(e==="up"?t.commandIndex=(t.commandIndex-1+n.length)%n.length:t.commandIndex=(t.commandIndex+1)%n.length,d())}function fa(){const e=Ft();e.length>0&&t.commandIndex<e.length&&va(e[t.commandIndex])}function Ts(e,n){const a=URL.createObjectURL(e),i=document.createElement("a");i.href=a,i.download=n,document.body.appendChild(i),i.click(),document.body.removeChild(i),URL.revokeObjectURL(a)}function ha(){if(t.messages.length===0)return;const n=t.conversations.find(s=>s.id===t.currentConversationId)?.title||"对话",a=[`# ${n}`,""];for(const s of t.messages)if(s.type==="user"){const l=s;a.push("## 用户"),a.push(l.text),a.push("")}else if(s.type==="assistant"){const l=s,c=l.agentName?`${l.agentEmoji||"🤖"} ${l.agentName}`:"Taxbot";a.push(`## ${c}`),a.push(l.text),a.push("")}const i=a.join(`
`),o=new Blob([i],{type:"text/markdown;charset=utf-8"});Ts(o,`${n}_${new Date().toISOString().slice(0,10)}.md`)}function ka(){if(t.messages.length===0)return;const n=t.conversations.find(s=>s.id===t.currentConversationId)?.title||"对话";let a="";for(const s of t.messages)if(s.type==="user"){const c=rt(s.text);a+=`<div class="msg user"><div class="role">用户</div><div class="content">${c}</div></div>
`}else if(s.type==="assistant"){const l=s,c=l.agentName?`${l.agentEmoji||"🤖"} ${l.agentName}`:"Taxbot",u=rt(l.text);a+=`<div class="msg assistant"><div class="role">${rt(c)}</div><div class="content">${u}</div></div>
`}const i=`<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<title>${rt(n)}</title>
<style>
body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
h1 { color: #1B3A5C; margin-bottom: 20px; }
.msg { margin-bottom: 16px; padding: 12px 16px; border-radius: 12px; }
.msg.user { background: #e3f2fd; }
.msg.assistant { background: white; border: 1px solid #e5e7eb; }
.role { font-weight: 600; font-size: 13px; color: #6b7280; margin-bottom: 6px; }
.content { white-space: pre-wrap; line-height: 1.6; }
.footer { text-align: center; color: #9ca3af; font-size: 12px; margin-top: 30px; }
</style>
</head>
<body>
<h1>${rt(n)}</h1>
${a}
<div class="footer">导出于 ${new Date().toLocaleString("zh-CN")}</div>
</body>
</html>`,o=new Blob([i],{type:"text/html;charset=utf-8"});Ts(o,`${n}_${new Date().toISOString().slice(0,10)}.html`)}function rt(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/\n/g,"<br>")}function Ss(){t.searchOpen=!0,t.searchQuery="",t.searchResults=[],t.searchIndex=0,d(),setTimeout(()=>{document.getElementById("taxchat-search-input")?.focus()},50)}function Ge(){t.searchOpen=!1,t.searchQuery="",t.searchResults=[],t.searchIndex=0,d()}function ba(e){if(t.searchQuery=e,!e.trim()){t.searchResults=[],t.searchIndex=0,d();return}const n=e.toLowerCase(),a=[];for(const i of t.messages)i.text&&i.text.toLowerCase().includes(n)&&i.id&&a.push(i.id);t.searchResults=a,t.searchIndex=a.length>0?0:-1,d(),a.length>0&&Ae()}function Je(){t.searchResults.length!==0&&(t.searchIndex=(t.searchIndex+1)%t.searchResults.length,d(),Ae())}function Ye(){t.searchResults.length!==0&&(t.searchIndex=(t.searchIndex-1+t.searchResults.length)%t.searchResults.length,d(),Ae())}function Ae(){const e=t.searchResults[t.searchIndex];if(!e)return;const n=document.querySelector(`[data-msg-id="${e}"]`);n&&(n.scrollIntoView({behavior:"smooth",block:"center"}),n.classList.add("search-highlight"),setTimeout(()=>n.classList.remove("search-highlight"),2e3))}const S="https://taxbot.cc:8443/api/open";async function $a(e,n){const a=await fetch(`${S}/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e,password:n})});if(!a.ok){const i=await a.json().catch(()=>({}));throw new Error(i.error||`登录失败 (${a.status})`)}return a.json()}async function Ce(e){const n=await fetch(`${S}/me`,{headers:{Authorization:`Bearer ${e}`}});if(!n.ok)throw new Error("token 无效或已过期");const a=await n.json();return a.user??a}async function wa(e){const n=new URLSearchParams;e.page&&n.set("page",String(e.page)),n.set("limit",String(e.limit)),e.q&&n.set("q",e.q),e.category&&n.set("category",e.category),e.sort&&n.set("sort",e.sort);const a={};e.token&&(a.Authorization=`Bearer ${e.token}`);const i=await fetch(`${S}/skills?${n}`,{headers:a});if(!i.ok)throw new Error(`获取技能列表失败 (${i.status})`);return i.json()}async function ya(e,n){const a={};n&&(a.Authorization=`Bearer ${n}`);const i=await fetch(`${S}/skills/${e}`,{headers:a});if(!i.ok)throw new Error(`获取技能详情失败 (${i.status})`);return i.json()}async function xa(e,n){const a=await fetch(`${S}/skills/${e}/download`,{headers:{Authorization:`Bearer ${n}`}});if(a.status===402){const s=await a.json().catch(()=>({}));throw new Error(s.error||`积分不足 (需要: ${s.required??"?"}, 当前: ${s.current??"?"})`)}if(a.status===401)throw new Error("请先登录 TaxStore 账户");if(!a.ok){const s=await a.json().catch(()=>({}));throw console.warn("[TaxStore] Download failed:",a.status,s),new Error(s.error||`下载失败 (${a.status})`)}const i=await a.blob(),o=a.headers.get("X-Already-Purchased")==="1";return{blob:i,alreadyPurchased:o}}async function Ta(e,n){const a=await fetch(`${S}/agents/publish`,{method:"POST",headers:{Authorization:`Bearer ${e}`,"Content-Type":"application/json"},body:JSON.stringify(n)});if(!a.ok){const i=await a.json().catch(()=>({}));throw new Error(i.error||`发布失败 (${a.status})`)}return a.json()}async function Sa(e,n){const a=await fetch(`${S}/agents/${n}`,{method:"DELETE",headers:{Authorization:`Bearer ${e}`}});if(!a.ok){const i=await a.json().catch(()=>({}));throw new Error(i.error||`下架失败 (${a.status})`)}}async function Aa(e){const n=await fetch(`${S}/agents/my`,{headers:{Authorization:`Bearer ${e}`}});if(!n.ok)throw new Error(`获取我的智能体失败 (${n.status})`);return n.json()}async function Ca(e,n){if(n.length!==0)try{await fetch(`${S}/agents/heartbeat`,{method:"POST",headers:{Authorization:`Bearer ${e}`,"Content-Type":"application/json"},body:JSON.stringify({listingIds:n})})}catch{}}async function As(e,n){const a=n?`?status=${n}`:"",i=await fetch(`${S}/agents/tasks${a}`,{headers:{Authorization:`Bearer ${e}`}});if(!i.ok)throw new Error(`获取任务失败 (${i.status})`);return i.json()}async function fe(e,n,a,i){const o=await fetch(`${S}/agents/tasks/${n}`,{method:"PUT",headers:{Authorization:`Bearer ${e}`,"Content-Type":"application/json"},body:JSON.stringify({result:a,...i&&{resultAttachments:i}})});if(!o.ok){const s=await o.json().catch(()=>({}));throw new Error(s.error||`提交失败 (${o.status})`)}return o.json()}async function Cs(e,n){const a=new FormData;a.append("file",n);const i=await fetch(`${S}/agents/upload`,{method:"POST",headers:{Authorization:`Bearer ${e}`},body:a});if(!i.ok){const o=await i.json().catch(()=>({}));throw new Error(o.error||`上传失败 (${i.status})`)}return i.json()}async function Ia(){const e=await fetch(`${S}/agents/stats`);return e.ok?e.json():{avgMinutes:0,recentCount:0}}async function Ma(e){const n=new URLSearchParams;e?.q&&n.set("q",e.q),e?.sort&&n.set("sort",e.sort),e?.page&&n.set("page",String(e.page)),n.set("limit",String(e.limit));const a=n.toString(),i=await fetch(`${S}/agents${a?`?${a}`:""}`);if(!i.ok)throw new Error(`获取智能体列表失败 (${i.status})`);return i.json()}async function Da(e,n,a){const i=await fetch(`${S}/agents/${n}/task`,{method:"POST",headers:{Authorization:`Bearer ${e}`,"Content-Type":"application/json"},body:JSON.stringify(a)});if(!i.ok){const o=await i.json().catch(()=>({}));throw new Error(o.error||`下单失败 (${i.status})`)}return i.json()}async function Pa(e){const n=await fetch(`${S}/agents/my-tasks`,{headers:{Authorization:`Bearer ${e}`}});if(!n.ok)throw new Error(`获取我的任务失败 (${n.status})`);return n.json()}async function _a(e,n){await fetch(`${S}/agents/my-tasks/${n}/read`,{method:"POST",headers:{Authorization:`Bearer ${e}`}}).catch(()=>{})}async function Ra(e,n,a){const i=await fetch(`${S}/agents/my-tasks/${n}/rate`,{method:"PUT",headers:{Authorization:`Bearer ${e}`,"Content-Type":"application/json"},body:JSON.stringify(a)});if(!i.ok){const o=await i.json().catch(()=>({}));throw new Error(o.error||`评价失败 (${i.status})`)}}async function ja(e,n,a){const i=await fetch(`${S}/agents/my-tasks/${n}/revise`,{method:"POST",headers:{Authorization:`Bearer ${e}`,"Content-Type":"application/json"},body:JSON.stringify({request:a})});if(!i.ok){const o=await i.json().catch(()=>({}));throw new Error(o.error||`请求修订失败 (${i.status})`)}return i.json()}async function Is(e,n){const a=await fetch(`${S}/agents/tasks/${n}/messages`,{headers:{Authorization:`Bearer ${e}`}});if(!a.ok)throw new Error(`获取消息失败 (${a.status})`);return(await a.json()).messages}async function Ms(e,n,a){const i=await fetch(`${S}/agents/tasks/${n}/messages`,{method:"POST",headers:{Authorization:`Bearer ${e}`,"Content-Type":"application/json"},body:JSON.stringify({content:a})});if(!i.ok){const o=await i.json().catch(()=>({}));throw new Error(o.error||`发送失败 (${i.status})`)}return i.json()}async function qa(e){const n=await fetch(`${S}/me/installed`,{headers:{Authorization:`Bearer ${e}`}});if(!n.ok)throw new Error(`获取已安装列表失败 (${n.status})`);return n.json()}async function La(e,n,a){const i=await fetch(`${S}/me/installed`,{method:"POST",headers:{Authorization:`Bearer ${e}`,"Content-Type":"application/json"},body:JSON.stringify({skillId:n,version:a})});i.ok||console.warn("[TaxStore] Failed to record installation:",i.status)}const Nt="taxbot_taxstore_token";async function Ea(){const e=localStorage.getItem(Nt);if(e){t.taxstoreToken=e;try{const n=await Ce(e);t.taxstoreUser=n,t.taxstoreConnected=!0,d()}catch{localStorage.removeItem(Nt),t.taxstoreToken=null,t.taxstoreConnected=!1}}}async function Qe(e,n){t.taxstoreLoading=!0,t.taxstoreError=null,d();try{const{token:a,user:i}=await $a(e,n);t.taxstoreToken=a,t.taxstoreUser=i,t.taxstoreConnected=!0,localStorage.setItem(Nt,a),await K(1),k(`已连接 TaxStore: ${i.name}`)}catch(a){t.taxstoreError=a.message||"登录失败"}finally{t.taxstoreLoading=!1,d()}}function Oa(){t.taxstoreToken=null,t.taxstoreUser=null,t.taxstoreConnected=!1,t.taxstoreSkills=[],t.taxstorePage=1,t.taxstoreTotalPages=1,t.taxstoreError=null,t.taxstoreInstalledIds=new Set,localStorage.removeItem(Nt),d()}async function K(e=1){t.taxstoreLoading=!0,t.taxstoreError=null,d();try{const n=await wa({page:e,limit:15,q:t.taxstoreQuery||void 0,category:t.taxstoreCategory||void 0,sort:t.taxstoreSort,token:t.taxstoreToken});t.taxstoreSkills=n.skills,t.taxstorePage=n.pagination.page,t.taxstoreTotalPages=n.pagination.totalPages}catch(n){t.taxstoreError=n.message||"获取技能列表失败"}finally{t.taxstoreLoading=!1,d()}}function Ba(e){t.taxstoreQuery=e,K(1)}function ct(e){t.taxstoreCategory=e,K(1)}function Xe(e){t.taxstoreSort=e,K(1)}async function Ua(e){if(!t.taxstoreToken){k("请先登录 TaxStore 账户");return}if(t.customSkills.some(n=>n.taxstoreSkillId===e.id)){k(`技能「${e.name}」已安装`);return}if(!t.taxstoreInstallingId){t.taxstoreInstallingId=e.id,t.taxstoreInstallStep="downloading",d();try{const{blob:n}=await xa(e.id,t.taxstoreToken),a=new Uint8Array(await n.slice(0,4).arrayBuffer());if(a[0]!==80||a[1]!==75)throw new Error("服务器返回的文件不是有效的技能包（非 ZIP 格式）");t.taxstoreInstallStep="installing",d();const i=await n.arrayBuffer(),o=window.electronAPI;if(!o?.installSkillPackage&&!o?.installSkillBuffer){k("当前环境不支持技能包安装");return}const s=o.installSkillBuffer?await o.installSkillBuffer(i,`${e.name}.zip`):await o.installSkillPackage(await Na(n),`${e.name}.zip`);if(!s?.ok){k(`安装失败: ${s?.error||"未知错误"}`);return}const l={id:T(),name:s.skill?.name||e.name,emoji:s.skill?.emoji||"📦",description:s.skill?.description||e.description,prompt:s.skill?.prompt||"",pinned:!1,createdAt:Date.now(),folderName:s.folderName,taxstoreSkillId:e.id,taxstoreVersion:e.version};t.customSkills.push(l),J(),t.taxstoreInstalledIds.add(e.id),La(t.taxstoreToken,e.id,e.version).catch(()=>{}),Fa(),k(`技能「${e.name}」已安装`),D(`已从 TaxStore 安装技能: ${e.name}`,"📦")}catch(n){k(n.message||"安装失败")}finally{t.taxstoreInstallingId=null,t.taxstoreInstallStep=null,d()}}}async function Fa(){if(t.taxstoreToken)try{t.taxstoreUser=await Ce(t.taxstoreToken),d()}catch{}}async function za(){if(!(!t.taxstoreToken||!t.taxstoreConnected)){for(const e of t.customSkills)e.taxstoreSkillId&&t.taxstoreInstalledIds.add(e.taxstoreSkillId);try{const e=await qa(t.taxstoreToken),n=[];for(const a of e){const i=t.customSkills.find(o=>o.taxstoreSkillId===a.skillId);if(i&&i.taxstoreVersion&&i.taxstoreVersion!==a.skill.version)try{const o=await ya(a.skillId,t.taxstoreToken);o.version!==i.taxstoreVersion&&n.push({skillId:a.skillId,name:a.skill.name,localVersion:i.taxstoreVersion,remoteVersion:o.version})}catch{}}n.length>0&&(t.taxstoreUpdates=n,D(`${n.length} 个 TaxStore 技能有更新可用`,"🔄"),d())}catch{}}}function Na(e){return new Promise((n,a)=>{const i=new FileReader;i.onload=()=>{const o=i.result;n(o.split(",")[1])},i.onerror=a,i.readAsDataURL(e)})}function Va(e){return t.taxstoreInstalledIds.has(e)}function Ka(e){return!e||e.length===0?"-":(e.reduce((a,i)=>a+i.rating,0)/e.length).toFixed(1)}function Ha(e){const n=new Uint8Array(e),a=32768,i=[];for(let o=0;o<n.length;o+=a)i.push(String.fromCharCode(...n.subarray(o,o+a)));return btoa(i.join(""))}async function Ds(e){const n=[];let a="";try{const i=JSON.parse(e),o=[];for(const s of i)if(s.type?.startsWith("image/"))try{const l=await fetch(`https://taxbot.cc:8443${s.url}`);if(l.ok){const c=await l.arrayBuffer();n.push({type:"image",mimeType:s.type,fileName:s.name,content:Ha(c)})}else o.push(s)}catch{o.push(s)}else o.push(s);o.length>0&&(a=`

【附件】
${o.map(s=>`- ${s.name} (${s.type}, ${(s.size/1024).toFixed(0)}KB): https://taxbot.cc:8443${s.url}`).join(`
`)}`)}catch{}return{imageAtts:n,textSuffix:a}}function Ze(e){if(!t.taxstoreConnected||!t.taxstoreToken){k("请先在技能面板中登录 TaxStore 账户");return}t.rentalPublishAgent=e;const n=t.rentalMyListings.find(i=>i.agentId===e.id),a=n?.tags?(()=>{try{return JSON.parse(n.tags)}catch{return[]}})():[];t.rentalPublishDraft={price:n?.price||10,description:e.description||"",tags:a},t.rentalPublishDialog=!0,d()}function he(){t.rentalPublishDialog=!1,t.rentalPublishAgent=null,d()}async function Wa(){if(!t.taxstoreToken||!t.rentalPublishAgent)return;const e=t.rentalPublishAgent,n=t.rentalPublishDraft;if(n.price<1){k("价格至少为 1 积分");return}if(!n.description.trim()){k("请填写市场描述");return}try{const a=e.isDefault?`Taxbot Agent by ${t.taxstoreUser?.name||"Unknown"}`:e.name,i=await Ta(t.taxstoreToken,{name:a,emoji:e.emoji,description:n.description.trim(),price:n.price,agentId:e.id,avatarUrl:e.avatarUrl,tags:n.tags.length>0?JSON.stringify(n.tags):void 0});t.rentalMyListings.push(i),he(),k(`智能体「${e.name}」已发布到市场`),D(`智能体「${e.name}」已上架`,"🏪")}catch(a){k(a.message||"发布失败")}}async function Ps(){if(t.taxstoreToken)try{t.rentalMyListings=await Aa(t.taxstoreToken),d()}catch{}}function Ga(e){return t.rentalMyListings.find(n=>n.agentId===e&&n.status==="active")}async function ts(e){if(t.taxstoreToken)try{await Sa(t.taxstoreToken,e),t.rentalMyListings=t.rentalMyListings.filter(n=>n.id!==e),k("已下架"),d()}catch(n){k(n.message||"下架失败")}}async function ke(){if(!(!t.taxstoreToken||!t.taxstoreConnected)){try{const e=await As(t.taxstoreToken),n=new Map(t.rentalPendingTasks.map(i=>[i.id,i])),a=e.filter(i=>!n.has(i.id));for(const i of e){const o=n.get(i.id);o&&(i.unreadMessageCount||0)>0&&(o.unreadMessageCount||0)===0&&D(`${i.client.name} 给任务「${i.title}」发了新留言`,"💬",i.id,"rental")}if(t.rentalPendingTasks=e,t.rentalActiveTask){const i=e.find(o=>o.id===t.rentalActiveTask.id);i&&(t.rentalActiveTask.unreadMessageCount=i.unreadMessageCount)}for(const i of a)i.status==="revision_requested"?D(`收到修订请求: ${i.title} (${i.listing.name})`,"✏️",i.id,"rental"):D(`收到新任务: ${i.title} (${i.listing.name})`,"📋",i.id,"rental");d()}catch{}try{const e=t.rentalMyListings.filter(n=>n.status==="active").map(n=>n.id);e.length>0&&t.taxstoreToken&&Ca(t.taxstoreToken,e)}catch{}gi()}}function Ja(){t.rentalPollingTimer||(ke(),t.rentalPollingTimer=setInterval(ke,6e4))}async function ft(){if(!(!t.taxstoreToken||!t.taxstoreConnected))try{const e=await Pa(t.taxstoreToken),n=new Map(t.consultMyTasks.map(o=>[o.id,o])),a=t.consultMyTasks.length;for(const o of e){const s=n.get(o.id);s&&s.status!=="completed"&&o.status==="completed"&&D(`你的咨询已完成: ${o.title} (${o.listing?.name||"智能体"})`,"✅",o.id,"consult"),s&&(o.unreadMessageCount||0)>0&&(s.unreadMessageCount||0)===0&&D(`${o.listing?.name||"智能体"} 给你发了新留言`,"💬",o.id,"consult")}const i=e.filter(o=>o.status==="completed"&&!o.clientRead||(o.unreadMessageCount||0)>0).length;t.consultMyTasks=e,t.consultUnreadCount=i,d()}catch{}}function Ya(){t.consultPollingTimer||(ft(),t.consultPollingTimer=setInterval(ft,6e4))}async function Mt(){t.consultLoading=!0,d();try{const e=await Ma({q:t.consultSearch||void 0,sort:"popular",limit:50});t.consultAgents=e.agents}catch(e){k(e.message||"加载智能体失败")}finally{t.consultLoading=!1,d()}Qa()}async function Qa(){try{const e=await Ia();if(e.recentCount===0)t.consultAvgTime="暂无数据";else{const n=e.avgMinutes;let a;if(n<1)a="不到 1 分钟";else if(n<60)a=`约 ${n} 分钟`;else{const i=Math.floor(n/60),o=n%60;a=o===0?`约 ${i} 小时`:`约 ${i} 小时 ${o} 分钟`}t.consultAvgTime=`${a}（近 ${e.recentCount} 单）`}d()}catch{t.consultAvgTime="暂无数据",d()}}function Xa(e){t.consultSelectedAgent=e,t.consultView="detail",t.consultTaskTitle="",t.consultTaskContent="",t.consultAttachments=[],d()}function Za(){t.consultView="list",t.consultSelectedAgent=null,d()}function es(){t.consultView="my-tasks",ft(),d()}function ae(e){t.consultSelectedTask=e,t.consultView="task-detail",t.consultMessages=[],t.consultMessageInput="",t.consultMessagesOpen=!1,t.consultMessagesSending=!1,t.consultRevisionOpen=!1,t.consultRevisionText="",t.consultRatingOpen=!1,t.consultRatingValue=0,t.consultRatingHover=0,t.consultRatingComment="",t.taxstoreToken&&e.status==="completed"&&!e.clientRead&&(e.clientRead=!0,t.consultUnreadCount=Math.max(0,t.consultUnreadCount-1),_a(t.taxstoreToken,e.id)),d()}function ti(){t.consultSelectedTask=null,t.consultView="my-tasks",d()}async function ei(){t.consultMessagesOpen=!t.consultMessagesOpen,t.consultMessagesOpen&&t.consultMessages.length===0&&await si(),d()}async function si(){if(!(!t.taxstoreToken||!t.consultSelectedTask)){try{if(t.consultMessages=await Is(t.taxstoreToken,t.consultSelectedTask.id),t.consultSelectedTask.unreadMessageCount){t.consultSelectedTask.unreadMessageCount=0;const e=t.consultMyTasks.findIndex(n=>n.id===t.consultSelectedTask?.id);e>=0&&(t.consultMyTasks[e].unreadMessageCount=0),t.consultUnreadCount=t.consultMyTasks.filter(n=>n.status==="completed"&&!n.clientRead||(n.unreadMessageCount||0)>0).length}}catch{}d()}}async function ss(){if(!t.taxstoreToken||!t.consultSelectedTask)return;const e=t.consultMessageInput.trim();if(e){t.consultMessagesSending=!0,d();try{const n=await Ms(t.taxstoreToken,t.consultSelectedTask.id,e);t.consultMessages.push(n),t.consultMessageInput=""}catch(n){k(n.message||"发送失败")}finally{t.consultMessagesSending=!1,d()}}}function ns(){t.consultRevisionOpen=!t.consultRevisionOpen,d()}async function ni(){if(!t.taxstoreToken||!t.consultSelectedTask)return;const e=t.consultRevisionText.trim();if(!e){k("请填写修订说明");return}t.consultRevisionSubmitting=!0,d();try{const n=await ja(t.taxstoreToken,t.consultSelectedTask.id,e);t.consultSelectedTask.status=n.status,t.consultSelectedTask.revisionCount=n.revisionCount,t.consultSelectedTask.revisionRequest=n.revisionRequest,t.consultRevisionOpen=!1,t.consultRevisionText="",k("修订请求已发送");const a=t.consultMyTasks.findIndex(i=>i.id===t.consultSelectedTask?.id);a>=0&&(t.consultMyTasks[a].status=n.status)}catch(n){k(n.message||"请求修订失败")}finally{t.consultRevisionSubmitting=!1,d()}}function as(){t.consultRatingOpen=!t.consultRatingOpen,d()}async function ai(){if(!(!t.taxstoreToken||!t.consultSelectedTask)){if(t.consultRatingValue<1){k("请选择评分");return}t.consultRatingSubmitting=!0,d();try{await Ra(t.taxstoreToken,t.consultSelectedTask.id,{rating:t.consultRatingValue,comment:t.consultRatingComment.trim()||void 0}),t.consultSelectedTask.rating=t.consultRatingValue,t.consultSelectedTask.ratingComment=t.consultRatingComment.trim()||void 0,t.consultRatingOpen=!1,k("感谢您的评价！");const e=t.consultMyTasks.findIndex(n=>n.id===t.consultSelectedTask?.id);e>=0&&(t.consultMyTasks[e].rating=t.consultRatingValue)}catch(e){k(e.message||"评价失败")}finally{t.consultRatingSubmitting=!1,d()}}}async function ii(e){if(t.taxstoreToken){if(e.size>10*1024*1024){k("文件大小不能超过 10MB");return}t.consultUploading=!0,d();try{const n=await Cs(t.taxstoreToken,e);t.consultAttachments.push(n)}catch(n){k(n.message||"上传失败")}finally{t.consultUploading=!1,d()}}}function oi(e){t.consultAttachments.splice(e,1),d()}async function li(){if(!(!t.taxstoreToken||!t.consultSelectedAgent)){if(!t.consultTaskTitle.trim()||!t.consultTaskContent.trim()){k("请填写标题和内容");return}t.consultSubmitting=!0,d();try{await Da(t.taxstoreToken,t.consultSelectedAgent.id,{title:t.consultTaskTitle.trim(),content:t.consultTaskContent.trim(),attachments:t.consultAttachments.length>0?t.consultAttachments:void 0}),k("任务已提交！智能体主人会尽快处理"),t.consultTaskTitle="",t.consultTaskContent="",t.consultAttachments=[],t.consultView="my-tasks",t.consultSelectedAgent=null,ft()}catch(e){k(e.message||"提交失败")}finally{t.consultSubmitting=!1,d()}}}let _=null;function ie(e){t.rentalActiveTask=e,t.rentalTaskResult=e.result||"",t.rentalAgentProcessing=!1,t.rentalTaskPanel=!0,t.rentalTaskAttachments=[],t.rentalTaskInstruction="",d()}function be(){_&&(_.abort(),_=null),t.rentalTaskPanel=!1,t.rentalActiveTask=null,t.rentalTaskResult="",t.rentalAgentProcessing=!1,t.rentalTaskAttachments=[],t.rentalTaskInstruction="",d()}function Ie(e){if(!e?.messages||e.messages.length===0)return"";const n=e.messages;let a=-1;for(let s=n.length-1;s>=0;s--)if(n[s].role==="user"){a=s;break}const i=a>=0?a+1:0,o=[];for(let s=i;s<n.length;s++)if(n[s].role==="assistant"){const l=qt(n[s]);l&&!Lt(l)&&o.push(l)}return o.join(`

`)}async function ri(){if(!t.client||!t.rentalActiveTask)return;const e=t.rentalActiveTask.listing.agentId,n=e?t.agentsList.find(y=>y.id===e):null;if(!n){k("未找到对应的本地智能体");return}t.rentalAgentProcessing=!0,t.rentalTaskResult="",d();const a=`agent:${n.id}:rental`;let o=t.rentalActiveTask.status==="revision_requested"?`请根据客户的修订要求修改之前的回答：

【任务标题】${t.rentalActiveTask.title}

【任务内容】
${t.rentalActiveTask.content}

【之前的回答】
${t.rentalActiveTask.result||""}

【客户修订要求】
${t.rentalActiveTask.revisionRequest||""}`:`请处理以下用户任务，直接给出完整的回答结果：

【任务标题】${t.rentalActiveTask.title}

【任务内容】
${t.rentalActiveTask.content}`,s=[];if(t.rentalActiveTask.attachments){const{imageAtts:y,textSuffix:A}=await Ds(t.rentalActiveTask.attachments);s=y,o+=A}const l=await at(n.id);l&&(o=`【智能体记忆】
${l}
---

${o}`);const c=T();try{const y={sessionKey:a,message:o,deliver:!1,idempotencyKey:c};s.length>0&&(y.attachments=s),await t.client.request("chat.send",y)}catch(y){t.rentalAgentProcessing=!1,k("发送任务给智能体失败："+String(y)),d();return}_?.abort();const u=new AbortController;_=u;const g=u.signal,p=1500,m=1e4,f=12e4,h=Date.now();let w=Date.now(),x="";const C=()=>{if(!(g.aborted||!t.rentalAgentProcessing)){if(Date.now()-h>f){t.rentalAgentProcessing=!1,x?t.rentalTaskResult=x:k("智能体处理超时，请手动填写结果"),_=null,d();return}t.client?.request("chat.history",{sessionKey:a,limit:20}).then(y=>{if(g.aborted||!t.rentalAgentProcessing)return;const A=Ie(y);if(A&&A!==x&&(w=Date.now(),x=A,t.rentalTaskResult=A,d()),x.length>0&&Date.now()-w>m){t.rentalAgentProcessing=!1,t.rentalTaskResult=x,_=null,d();return}setTimeout(C,p)}).catch(()=>{g.aborted||(Date.now()-h<f?setTimeout(C,p):(t.rentalAgentProcessing=!1,x||k("获取智能体回复失败"),_=null,d()))})}};setTimeout(C,800)}async function is(){if(!t.client||!t.rentalActiveTask)return;const e=t.rentalTaskInstruction.trim();if(!e){k("请输入修改指令");return}const n=t.rentalTaskResult.trim();if(!n){k("请先让智能体生成回答，再进行修改");return}const a=t.rentalActiveTask.listing.agentId,i=a?t.agentsList.find(C=>C.id===a):null;if(!i){k("未找到对应的本地智能体");return}t.rentalAgentProcessing=!0,t.rentalTaskInstruction="",d();const o=`agent:${i.id}:rental`,s=`以下是你之前对用户任务的回答，请根据用户的修改指令进行修改，直接给出修改后的完整回答：

【原始任务】${t.rentalActiveTask.title}

【你之前的回答】
${n}

【用户修改指令】
${e}`,l=T();try{await t.client.request("chat.send",{sessionKey:o,message:s,deliver:!1,idempotencyKey:l})}catch(C){t.rentalAgentProcessing=!1,k("发送修改指令失败："+String(C)),d();return}_?.abort();const c=new AbortController;_=c;const u=c.signal,g=1500,p=1e4,m=12e4,f=Date.now();let h=Date.now(),w="";const x=()=>{if(!(u.aborted||!t.rentalAgentProcessing)){if(Date.now()-f>m){t.rentalAgentProcessing=!1,w?t.rentalTaskResult=w:k("智能体修改超时"),_=null,d();return}t.client?.request("chat.history",{sessionKey:o,limit:20}).then(C=>{if(u.aborted||!t.rentalAgentProcessing)return;const y=Ie(C);if(y&&y!==w&&(h=Date.now(),w=y,t.rentalTaskResult=y,d()),w.length>0&&Date.now()-h>p){t.rentalAgentProcessing=!1,t.rentalTaskResult=w,_=null,d();return}setTimeout(x,g)}).catch(()=>{u.aborted||(Date.now()-f<m?setTimeout(x,g):(t.rentalAgentProcessing=!1,w||k("获取修改结果失败"),_=null,d()))})}};setTimeout(x,800)}async function ci(){if(!t.taxstoreToken||!t.rentalActiveTask)return;const e=t.rentalTaskResult.trim();if(!e){k("请填写任务结果");return}try{const n=t.rentalActiveTask;let a;if(t.rentalTaskAttachments.length>0){a=[];for(const o of t.rentalTaskAttachments){const s=await Cs(t.taxstoreToken,o);a.push(s)}}await fe(t.taxstoreToken,n.id,e,a),t.rentalPendingTasks=t.rentalPendingTasks.filter(o=>o.id!==n.id),k("任务结果已提交，积分已到账"),D(`任务「${n.title}」已完成`,"✅");const i=n.listing.agentId;if(i){const o=`【出租任务完成】客户: ${n.client.name}
任务: ${n.title}
内容: ${n.content}
回答: ${e}`;Et(i,o)}be(),ht()}catch(n){k(n.message||"提交失败")}}const di=7200*1e3,N=new Set;async function ui(e){if(!t.client||!t.taxstoreToken||N.has(e.id))return;const n=e.listing.agentId,a=n?t.agentsList.find(w=>w.id===n):null;if(!a)return;N.add(e.id),D(`任务「${e.title}」超时未处理，智能体自动处理中...`,"⏰",e.id,"rental");const i=`agent:${a.id}:auto:${e.id}`;let o=`请处理以下用户任务，直接给出完整的回答结果：

【任务标题】${e.title}

【任务内容】
${e.content}`,s=[];if(e.attachments){const{imageAtts:w,textSuffix:x}=await Ds(e.attachments);s=w,o+=x}const l=await at(a.id);l&&(o=`【智能体记忆】
${l}
---

${o}`);try{const w={sessionKey:i,message:o,deliver:!1,idempotencyKey:T()};s.length>0&&(w.attachments=s),await t.client.request("chat.send",w)}catch{N.delete(e.id);return}const c=2e3,u=12e3,g=18e4,p=Date.now();let m=Date.now(),f="";const h=async()=>{if(!t.taxstoreToken){N.delete(e.id);return}if(Date.now()-p>g){const w=f||"非常抱歉，智能体处理超时。请您重新提交任务或联系智能体主人。";try{await fe(t.taxstoreToken,e.id,w),t.rentalPendingTasks=t.rentalPendingTasks.filter(x=>x.id!==e.id),D(`任务「${e.title}」已自动完成`,"✅"),n&&Et(n,`【自动完成任务】客户: ${e.client.name}
任务: ${e.title}
回答: ${w}`),ht(),d()}catch{}N.delete(e.id);return}try{const w=await t.client?.request("chat.history",{sessionKey:i,limit:20}),x=Ie(w);if(x&&x!==f&&(m=Date.now(),f=x),f.length>0&&Date.now()-m>u){await fe(t.taxstoreToken,e.id,f),t.rentalPendingTasks=t.rentalPendingTasks.filter(C=>C.id!==e.id),D(`任务「${e.title}」已自动完成`,"✅"),n&&Et(n,`【自动完成任务】客户: ${e.client.name}
任务: ${e.title}
回答: ${f}`),ht(),d(),N.delete(e.id);return}setTimeout(h,c)}catch{Date.now()-p<g?setTimeout(h,c):N.delete(e.id)}};setTimeout(h,1e3)}async function gi(){if(!t.taxstoreToken||!t.client)return;const e=Date.now();for(const n of t.rentalPendingTasks){if(N.has(n.id)||t.rentalActiveTask?.id===n.id)continue;e-new Date(n.createdAt).getTime()>di&&ui(n)}}async function ht(){if(t.taxstoreToken)try{t.rentalCompletedTasks=await As(t.taxstoreToken,"completed"),d()}catch{}}function pi(e){return t.rentalCompletedTasks.filter(n=>n.listing.id===e)}async function vi(e){if(t.taxstoreToken)try{t.rentalMessages=await Is(t.taxstoreToken,e);const n=t.rentalPendingTasks.find(a=>a.id===e);n&&n.unreadMessageCount&&(n.unreadMessageCount=0),t.rentalActiveTask?.id===e&&t.rentalActiveTask.unreadMessageCount&&(t.rentalActiveTask.unreadMessageCount=0),d()}catch{}}async function os(){if(!(!t.taxstoreToken||!t.rentalActiveTask||!t.rentalMessageInput.trim())){try{const e=await Ms(t.taxstoreToken,t.rentalActiveTask.id,t.rentalMessageInput.trim());t.rentalMessages=[...t.rentalMessages,e],t.rentalMessageInput=""}catch(e){k(e.message||"发送失败")}d()}}function mi(){t.rentalMessagesOpen=!t.rentalMessagesOpen,t.rentalMessagesOpen&&t.rentalActiveTask&&vi(t.rentalActiveTask.id),d()}async function fi(){!t.taxstoreToken||!t.taxstoreConnected||(await Ps(),ht(),Ja(),Ya())}function z(e){return!e||e.length<2?null:e.startsWith("data:")||e.startsWith("http")?e:`https://taxbot.cc:8443${e}`}function wt(e){return e.startsWith("http")?e:`https://taxbot.cc:8443${e}`}function yt(e){if(!e)return[];try{return JSON.parse(e)}catch{return[]}}function oe(e){return e<1024?`${e}B`:e<1024*1024?`${(e/1024).toFixed(0)}KB`:`${(e/(1024*1024)).toFixed(1)}MB`}async function hi(){if(t.refreshing)return;t.refreshing=!0,d();const e=[];t.connected||e.push(nt().catch(()=>{})),e.push(it().catch(()=>{})),t.taxstoreToken&&t.taxstoreConnected&&(e.push(Ce(t.taxstoreToken).then(n=>{n&&(t.taxstoreUser=n)}).catch(()=>{})),e.push(Ps().catch(()=>{})),e.push(ke().catch(()=>{})),e.push(ht().catch(()=>{})),e.push(ft().catch(()=>{})),e.push(Mt().catch(()=>{}))),t.authorizedFolder&&e.push(V().catch(()=>{})),await Promise.allSettled(e),t.refreshing=!1,t.lastRefreshTime=Date.now(),k("数据已刷新"),d()}function L(e,n,a,i){Un(e,n,a,i,Ut,At)}function ki(){return r`
    <div class="quickstart-overlay" @click=${Qt}>
      <div class="quickstart-container" @click=${e=>e.stopPropagation()}>

        <div class="qs-topbar">
          <button class="qs-back-btn" @click=${Qt}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            返回
          </button>
          <span class="qs-topbar-title">使用指南</span>
          <span style="width:60px;"></span>
        </div>

        <!-- Hero -->
        <div class="qs-hero">
          <img src="./assets/taxchat-logo.png" alt="Taxbot" style="width:72px;height:72px;" />
          <h1>欢迎使用Taxbot</h1>
          <p>您的 AI 税务助手，帮助您分析税务风险、审核票据合同、整理报销单、管理知识库。</p>
        </div>

        <!-- Section 1: Layout Overview -->
        <div class="qs-section">
          <div class="qs-section-title"><span class="qs-section-num">1</span> 界面布局</div>
          <div class="qs-section-desc">应用采用左侧功能菜单 + 右侧聊天的布局。点击左侧图标可展开知识库、技能、收藏等面板，聊天始终可见。</div>
          <div class="qs-sidebar-mock">
            <div class="qs-sidebar-nav">
              <div class="qs-sidebar-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg></div>
              <div class="qs-sidebar-icon active"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></div>
              <div class="qs-sidebar-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
            </div>
            <div class="qs-sidebar-panel">
              <div class="qs-sidebar-panel-title">技能管理</div>
              <div class="qs-skill-row">
                <span class="qs-skill-emoji">🧾</span>
                <div class="qs-skill-info"><div class="qs-skill-name">税务风险治理</div><div class="qs-skill-desc">风险识别与说明函生成</div></div>
              </div>
              <div class="qs-skill-row">
                <span class="qs-skill-emoji">📊</span>
                <div class="qs-skill-info"><div class="qs-skill-name">申报表预审</div><div class="qs-skill-desc">申报表与财务报表比对</div></div>
              </div>
              <div class="qs-skill-row">
                <span class="qs-skill-emoji">📝</span>
                <div class="qs-skill-info"><div class="qs-skill-name">合同及票据税审</div><div class="qs-skill-desc">从税务角度审核合同</div></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 2: Chat -->
        <div class="qs-section">
          <div class="qs-section-title"><span class="qs-section-num">2</span> 智能对话</div>
          <div class="qs-section-desc">在底部输入框输入税务问题，AI 实时解答。支持多轮对话，上下文自动关联。</div>
          <div class="qs-mockup">
            <div class="qs-mockup-bar">
              <span class="qs-dot qs-dot-r"></span>
              <span class="qs-dot qs-dot-y"></span>
              <span class="qs-dot qs-dot-g"></span>
              <span style="margin-left:8px;">对话界面</span>
            </div>
            <div class="qs-mockup-body">
              <div class="qs-chat-row user"><div class="qs-chat-bubble qs-chat-user">收到一张6%咨询费发票，可以抵扣吗？</div></div>
              <div class="qs-chat-row"><div class="qs-chat-bubble qs-chat-ai">咨询费属于<b>现代服务业</b>，一般纳税人取得6%税率专用发票可进行<b>进项税额抵扣</b>。需注意：<br/>1. 确保为增值税专用发票<br/>2. 业务真实性需有合同支撑<br/>3. 需在规定期限内认证</div></div>
              <div class="qs-chat-row user"><div class="qs-chat-bubble qs-chat-user">小规模纳税人呢？</div></div>
              <div class="qs-chat-row"><div class="qs-chat-bubble qs-chat-ai">小规模纳税人采用<b>简易计税</b>，不存在进项抵扣，发票直接计入成本费用。</div></div>
            </div>
          </div>
        </div>

        <!-- Section 3: Quick Skills -->
        <div class="qs-section">
          <div class="qs-section-title"><span class="qs-section-num">3</span> 快捷技能栏</div>
          <div class="qs-section-desc">聊天输入框上方为快捷技能栏，点击即可启用专业税务技能，上传文件后自动分析。</div>
          <div class="qs-mockup">
            <div class="qs-mockup-bar">
              <span class="qs-dot qs-dot-r"></span>
              <span class="qs-dot qs-dot-y"></span>
              <span class="qs-dot qs-dot-g"></span>
              <span style="margin-left:8px;">快捷技能</span>
            </div>
            <div class="qs-btn-row">
              <div class="qs-btn-pill">🧾 税务风险治理</div>
              <div class="qs-btn-pill">📊 申报表预审</div>
              <div class="qs-btn-pill">📝 合同及票据税审</div>
              <div class="qs-btn-pill">🔍 发票查验</div>
              <div class="qs-btn-pill">🧾 票据整理</div>
              <div class="qs-btn-pill">📚 知识库</div>
              <div class="qs-btn-pill">📎 上传文件</div>
            </div>
          </div>
        </div>

        <!-- Section 4: Knowledge -->
        <div class="qs-section">
          <div class="qs-section-title"><span class="qs-section-num">4</span> 知识库管理</div>
          <div class="qs-section-desc">点击左侧 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px;"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg> 图标打开知识库面板。授权文件夹后，AI 自动学习其中文件，点击"引用"可将指定文件作为上下文发送。</div>
          <div class="qs-mockup">
            <div class="qs-mockup-bar">
              <span class="qs-dot qs-dot-r"></span>
              <span class="qs-dot qs-dot-y"></span>
              <span class="qs-dot qs-dot-g"></span>
              <span style="margin-left:8px;">知识库面板</span>
            </div>
            <div class="qs-mockup-body">
              <div style="font-size:11px;color:#6b7280;margin-bottom:8px;">📂 D:\\我的文档\\税务资料 &nbsp;<span style="color:#2E5484;">更换</span> &nbsp;<span style="color:#2E5484;">刷新</span></div>
              <div class="qs-file-row"><span>📄</span><span class="qs-file-name">2024年度纳税申报表.pdf</span><span class="qs-file-size">2.3MB</span><span class="qs-file-btn">引用</span></div>
              <div class="qs-file-row"><span>📊</span><span class="qs-file-name">财务报表汇总.xlsx</span><span class="qs-file-size">856KB</span><span class="qs-file-btn">引用</span></div>
              <div class="qs-file-row"><span>📝</span><span class="qs-file-name">服务合同-2024.docx</span><span class="qs-file-size">145KB</span><span class="qs-file-btn">引用</span></div>
            </div>
          </div>
        </div>

        <!-- Section 5: Message Actions -->
        <div class="qs-section">
          <div class="qs-section-title"><span class="qs-section-num">5</span> 消息操作</div>
          <div class="qs-section-desc">鼠标悬停在 AI 回复上，会浮现操作按钮：复制、导出 Word、收藏、存入知识库。</div>
          <div class="qs-mockup">
            <div class="qs-mockup-bar">
              <span class="qs-dot qs-dot-r"></span>
              <span class="qs-dot qs-dot-y"></span>
              <span class="qs-dot qs-dot-g"></span>
              <span style="margin-left:8px;">消息操作</span>
            </div>
            <div class="qs-mockup-body">
              <div class="qs-chat-bubble qs-chat-ai" style="max-width:100%;">
                增值税（6%）：咨询服务费 50,000 元，税额 2,830.19 元<br/>
                <b>风险提示：</b>合同未注明价税分离条款，建议补充。
              </div>
              <div class="qs-msg-actions" style="margin-top:6px;">
                <span class="qs-msg-action">📋 复制</span>
                <span class="qs-msg-action">📝 导出Word</span>
                <span class="qs-msg-action">⭐ 收藏</span>
                <span class="qs-msg-action">💾 存入知识库</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 6: Tips -->
        <div class="qs-section">
          <div class="qs-section-title"><span class="qs-section-num">6</span> 实用技巧</div>
        </div>
        <div class="qs-tips-grid">
          <div class="qs-tip-card" style="background:#f0f9ff;"><b style="color:#1B3A5C;">📂 知识库自动学习</b>授权文件夹后，新增文件自动学习，无需手动导入。</div>
          <div class="qs-tip-card" style="background:#fefce8;"><b style="color:#a16207;">⭐ 收藏重要回复</b>收藏后可从左侧面板快速查找历史回复。</div>
          <div class="qs-tip-card" style="background:#f0fdf4;"><b style="color:#15803d;">📎 拖拽上传文件</b>将文件直接拖入输入区域即可上传分析。</div>
          <div class="qs-tip-card" style="background:#fdf2f8;"><b style="color:#be185d;">🛠 固定常用技能</b>自定义技能点击固定后出现在快捷栏。</div>
        </div>

        <!-- Footer -->
        <div class="qs-footer">
          <button class="qs-btn-start" @click=${Qt}>开始使用Taxbot</button>
          <div class="qs-footer-hint">可随时在左侧"关于"页面重新查看此指南</div>
        </div>

      </div>
    </div>
  `}function bi(){if(t.messages.length===0)return r`
      <div class="empty-state">
        <div class="empty-state__icon">
          <img src="./assets/taxchat-logo.png" alt="Taxbot" style="width: 120px; height: 120px;" />
        </div>
        <div class="empty-state__text">
          <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">欢迎来到Taxbot</div>
          <div>有任何税务问题？请在下方输入并提问</div>
        </div>
      </div>
    `;const e=[],n=document.getElementById("messages-container"),a=n?.scrollTop||0,i=n?.clientHeight||600,o=rn(t.messages,a,i),s=t.messages.slice(o.startIndex,o.endIndex);o.topPadding>0&&e.push(r`<div style="height:${o.topPadding}px;"></div>`);for(const l of s){const c=u=>{if(!u)return"";const g=t.messages.find(f=>f.id===u);if(!g)return"";const p=g.type==="user"?"我":g.agentName||"Taxbot",m=g.text.length>80?g.text.slice(0,80)+"...":g.text;return r`<div class="message-quote-card" @click=${()=>{const f=document.querySelector(`[data-msg-id="${u}"]`);f&&(f.scrollIntoView({behavior:"smooth",block:"center"}),f.classList.add("highlight-flash"),setTimeout(()=>f.classList.remove("highlight-flash"),1500))}}><span class="quote-sender">${p}</span><span class="quote-text">${m}</span></div>`};if(l.type==="user")e.push(r`
        <div class="message-group" data-msg-id="${l.id}">
          <div class="message-item user">
            <div class="message-content user">
              ${c(l.replyToId)}
              ${l.text?r`<div class="message-bubble user">${l.text}</div>`:""}
              ${l.attachments&&l.attachments.length>0?r`
                <div class="message-attachments">
                  ${l.attachments.map(u=>r`
                    <div class="attachment-thumbnail" @click=${()=>{t.previewAttachment=u,v()}}>
                      ${u.type.startsWith("image/")?r`
                        <img src=${u.dataUrl} alt=${u.name} class="thumbnail-image" />
                      `:r`
                        <div class="thumbnail-file">
                          <span class="file-icon">📄</span>
                          <span class="file-name">${u.name}</span>
                        </div>
                      `}
                    </div>
                  `)}
                </div>
              `:""}
            </div>
            <div class="message-avatar user">👤</div>
          </div>
          <div class="message-actions user-actions">
            <button class="message-action-btn" @click=${()=>{t.replyingTo=l,v(),setTimeout(()=>t.inputRef?.focus(),50)}} title="引用回复">
              <span class="action-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg></span><span class="action-label">引用</span>
            </button>
          </div>
          <div class="message-time">${et(l.timestamp)}</div>
        </div>
      `);else{const u=t.favorites.has(l.id),g=l;e.push(r`
        <div class="message-group" data-msg-id="${l.id}">
          ${g.agentName?r`<div class="message-agent-name">${g.agentEmoji||"🤖"} ${g.agentName}</div>`:""}
          ${c(g.replyToId)}
          <div class="message-item">
            <div class="message-avatar assistant">${g.agentAvatarUrl?r`<img src="${g.agentAvatarUrl}" class="agent-avatar-img" alt="${g.agentName||""}" />`:g.agentEmoji?r`<span class="agent-emoji-avatar">${g.agentEmoji}</span>`:r`<img src="./assets/taxchat-logo.png" alt="Taxbot" />`}</div>
            <div class="message-bubble assistant markdown-body ${u?"favorited":""}">${Bs($e(Tn(xn(l.text))))}</div>
          </div>
          <div class="message-actions">
            <button class="message-action-btn" @click=${()=>{t.replyingTo=l,v(),setTimeout(()=>t.inputRef?.focus(),50)}} title="引用回复">
              <span class="action-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg></span><span class="action-label">引用</span>
            </button>
            <button class="message-action-btn" data-copy-id="${l.id}" @click=${()=>$n(l.id,l.text)} title="复制文本">
              <span class="action-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></span><span class="action-label">复制</span>
            </button>
            <button class="message-action-btn" @click=${()=>wn(l.text)} title="保存为Word文档">
              <span class="action-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg></span><span class="action-label">保存Word</span>
            </button>
            <button class="message-action-btn" @click=${()=>Gn(l.text)} title="保存到知识库">
              <span class="action-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></span><span class="action-label">存知识库</span>
            </button>
            <button class="message-action-btn ${u?"fav-active":""}" @click=${()=>ks(l.id)} title="${u?"取消收藏":"收藏"}">
              <span class="action-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="${u?"currentColor":"none"}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></span><span class="action-label">${u?"已收藏":"收藏"}</span>
            </button>
            ${g.agentId?r`
              <button class="message-action-btn" @click=${()=>{Et(g.agentId,l.text.length>500?l.text.slice(0,500)+"...":l.text),k("已保存到智能体记忆")}} title="保存到该智能体的记忆">
                <span class="action-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/><path d="M12 6v6l4 2"/></svg></span><span class="action-label">记住</span>
              </button>
            `:""}
          </div>
          <div class="message-time">${et(l.timestamp)}</div>
        </div>
      `)}}if(o.bottomPadding>0&&e.push(r`<div style="height:${o.bottomPadding}px;"></div>`),t.collaborationTasks&&t.collaborationTasks.length>0){const l=c=>c==="done"?"✅":c==="error"?"❌":"💭";e.push(r`
      <div class="message-group">
        <div class="collab-card">
          <div class="collab-card__header">🤝 智能体协作中</div>
          ${t.collaborationTasks.map(c=>r`
            <div class="collab-card__row">
              <span class="collab-card__emoji">${c.agentEmoji}</span>
              <span class="collab-card__name">${c.agentName}</span>
              <span class="collab-card__task">${c.task}</span>
              <span class="collab-card__status">${l(c.status)}</span>
            </div>
          `)}
        </div>
      </div>
    `)}for(const l of t.activeRuns.values()){const c=l.agentId?t.agentsList.find(u=>u.id===l.agentId):null;e.push(r`
      <div class="message-group">
        ${c?r`<div class="message-agent-name">${c.emoji||"🤖"} ${c.name}</div>`:""}
        <div class="message-item">
          <div class="message-avatar assistant">${c?.avatarUrl?r`<img src="${c.avatarUrl}" class="agent-avatar-img" alt="${c.name}" />`:c?.emoji?r`<span class="agent-emoji-avatar">${c.emoji}</span>`:r`<img src="./assets/taxchat-logo.png" alt="Taxbot" />`}</div>
          <div class="message-bubble assistant">
            <div class="thinking-indicator">
              ${l.thinkingLabel?r`<span class="thinking-label">${l.thinkingLabel}</span>`:""}
              <div class="loading-dots">
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
              </div>
              <button class="thinking-cancel-btn" @click=${()=>sa(l.sessionKey)} title="取消">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                <span>取消</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `)}return r`${e}`}function $i(e){e.preventDefault();const n=e.target.parentElement,a=e.target;a.classList.add("dragging");const i=e.clientX,o=n.offsetWidth,s=c=>{const u=Math.min(Math.max(o+c.clientX-i,240),700);n.style.width=u+"px"},l=c=>{document.removeEventListener("mousemove",s),document.removeEventListener("mouseup",l),a.classList.remove("dragging");const u=Math.min(Math.max(o+c.clientX-i,240),700);t.sidePanelWidth=u,localStorage.setItem("taxbot_side_panel_width",String(u)),v()};document.addEventListener("mousemove",s),document.addEventListener("mouseup",l)}function v(){const e=document.getElementById("app");if(!e)return;const n=t.connected?"助理已就位":"助理准备中...",a=t.connected?"ok":"",i=r`
    <div class="taxchat-app">
      <header class="taxchat-header">
        <div class="taxchat-header__title">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div class="taxchat-header__logo" @click=${()=>{t.sidePanel=t.sidePanel==="about"?null:"about",v()}} style="cursor: pointer;" title="关于Taxbot">
              <img src="./assets/taxchat-logo.png" alt="Taxbot" />
            </div>
            <h1>Taxbot</h1>
            <div class="taxchat-header__status" @click=${s=>{s.stopPropagation(),t.showStatusMenu=!t.showStatusMenu,v()}}>
              <span class="status-dot ${a}"></span> ${n} <span class="status-arrow">▾</span>
              ${t.showStatusMenu?r`
                <div class="status-menu" @click=${s=>s.stopPropagation()}>
                  ${t.connected?r`
                    <div class="status-menu__item" @click=${()=>{t.showStatusMenu=!1;const s=window.electronAPI;s?.restartGateway&&s.restartGateway(),setTimeout(()=>nt(),2e3),v()}}>📞 呼叫个人助理</div>
                    <div class="status-menu__item" @click=${()=>{t.showStatusMenu=!1;const s=window.electronAPI;s?.stopGateway&&s.stopGateway(),t.connected=!1,pe(),v()}}>😴 让助理下班</div>
                  `:r`
                    <div class="status-menu__item" @click=${()=>{t.showStatusMenu=!1;const s=window.electronAPI;s?.startGateway&&s.startGateway(),setTimeout(()=>nt(),2e3),v()}}>📞 呼叫个人助理</div>
                  `}
                </div>
              `:""}
            </div>
          </div>
        </div>
        <div class="taxchat-header__right">
          ${(()=>{const s=t.notifications.filter(l=>!l.read).length;return r`
          <button class="header-notif-btn" @click=${l=>{l.stopPropagation(),t.showNotifications=!t.showNotifications,v()}} title="消息">
            🔔${s>0?r`<span class="header-notif-badge">${s}</span>`:""}
          </button>
          ${t.showNotifications?r`
            <div class="notif-dropdown" @click=${l=>l.stopPropagation()}>
              <div class="notif-dropdown__header">
                <span>消息${s>0?` (${s})`:""}</span>
                <div class="notif-dropdown__actions">
                  ${s>0?r`<button class="notif-dropdown__clear" @click=${()=>{t.notifications.forEach(l=>l.read=!0),dt(),v()}}>全部已读</button>`:""}
                  ${t.notifications.length>0?r`<button class="notif-dropdown__clear" @click=${()=>{t.notifications=[],dt(),v()}}>清空</button>`:""}
                </div>
              </div>
              <div class="notif-dropdown__list">
                ${t.notifications.length===0?r`<div class="notif-dropdown__empty">暂无消息</div>`:[...t.notifications].reverse().map(l=>r`
                    <div class="notif-item ${l.source||l.taskId?"notif-item--task":"notif-item--clickable"} ${l.read?"notif-item--read":""}" @click=${()=>{if(l.read=!0,dt(),t.showNotifications=!1,l.taskId&&l.source==="rental"){const c=t.rentalPendingTasks.find(u=>u.id===l.taskId);c?ie(c):(t.notifDetail=l,v())}else if(l.taskId&&l.source==="consult"){const c=t.consultMyTasks.find(u=>u.id===l.taskId);c?(t.sidePanel="consult",ae(c)):(t.sidePanel="consult",es(),v())}else if(l.taskId){const c=t.rentalPendingTasks.find(u=>u.id===l.taskId);if(c)ie(c);else{const u=t.consultMyTasks.find(g=>g.id===l.taskId);u?(t.sidePanel="consult",ae(u)):(t.notifDetail=l,v())}}else t.notifDetail=l,v()}}>
                      ${l.read?"":r`<div class="notif-item__dot"></div>`}
                      <div class="notif-item__icon">${l.icon}</div>
                      <div class="notif-item__body">
                        <div class="notif-item__text">${l.text}</div>
                        <div class="notif-item__time">${et(l.timestamp)}</div>
                        ${l.source==="rental"?r`<div class="notif-item__hint">点击处理任务</div>`:l.source==="consult"?r`<div class="notif-item__hint">点击查看详情</div>`:""}
                      </div>
                      <button class="notif-item__remove" @click=${c=>{c.stopPropagation(),t.notifications=t.notifications.filter(u=>u.id!==l.id),dt(),v()}} title="删除">✕</button>
                    </div>
                  `)}
              </div>
            </div>
          `:""}`})()}
          <button class="header-refresh-btn ${t.refreshing?"spinning":""}" @click=${()=>hi()} title="${t.lastRefreshTime?`上次刷新: ${et(t.lastRefreshTime)}`:"刷新所有数据"}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="23 4 23 10 17 10"/>
              <polyline points="1 20 1 14 7 14"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
          </button>
          <button class="header-exit-btn" @click=${()=>{t.confirmingExit=!0,v()}} title="退出应用">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </header>

      ${t.confirmingExit?r`
        <div class="model-confirm-overlay" @click=${()=>{t.confirmingExit=!1,v()}}>
          <div class="model-confirm-dialog" @click=${s=>s.stopPropagation()}>
            <div class="model-confirm-title">确认退出应用</div>
            <div class="model-confirm-hint" style="margin-bottom:20px;font-size:13px;">退出将关闭窗口并关闭 Gateway 服务。</div>
            <div class="model-confirm-actions">
              <button class="model-confirm-btn cancel" @click=${()=>{t.confirmingExit=!1,v()}}>取消</button>
              <button class="model-confirm-btn confirm" style="background:linear-gradient(135deg,#ef4444,#dc2626);" @click=${()=>{Ke()}}>确认退出</button>
            </div>
          </div>
        </div>
      `:""}

      ${t.notifDetail?r`
        <div class="notif-detail-overlay" @click=${()=>{t.notifDetail=null,v()}}>
          <div class="notif-detail-dialog" @click=${s=>s.stopPropagation()}>
            <div class="notif-detail-icon">${t.notifDetail.icon}</div>
            <div class="notif-detail-text">${t.notifDetail.text}</div>
            <div class="notif-detail-time">${et(t.notifDetail.timestamp)}</div>
            <button class="notif-detail-close" @click=${()=>{t.notifDetail=null,v()}}>关闭</button>
          </div>
        </div>
      `:""}

      <div class="taxchat-body">
        <nav class="taxchat-sidebar ${t.sidebarCollapsed?"collapsed":""}">
          <div class="sidebar-menu">
            <button class="sidebar-item ${t.sidePanel==="conversations"?"active":""}" @click=${()=>{t.sidePanel=t.sidePanel==="conversations"?null:"conversations",v()}} title="对话">
              <span class="sidebar-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></span><span class="sidebar-label">对话</span>
            </button>
            <button class="sidebar-item ${t.sidePanel==="knowledge"?"active":""}" @click=${()=>{t.sidePanel=t.sidePanel==="knowledge"?null:"knowledge",t.sidePanel==="knowledge"&&V(),v()}} title="知识库">
              <span class="sidebar-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg></span><span class="sidebar-label">知识库</span>
            </button>
            <button class="sidebar-item ${t.sidePanel==="skills"?"active":""}" @click=${()=>{t.sidePanel=t.sidePanel==="skills"?null:"skills",t.sidePanel==="skills"&&t.skillsTab==="market"&&t.taxstoreConnected&&t.taxstoreSkills.length===0&&K(1),v()}} title="我的技能">
              <span class="sidebar-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg></span><span class="sidebar-label">我的技能</span>
            </button>
            <button class="sidebar-item ${t.sidePanel==="agents"?"active":""}" @click=${()=>{t.sidePanel=t.sidePanel==="agents"?null:"agents",t.sidePanel==="agents"&&it(),v()}} title="我的智能体">
              <span class="sidebar-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span><span class="sidebar-label">我的智能体</span>
            </button>
            <button class="sidebar-item ${t.sidePanel==="favorites"?"active":""}" @click=${()=>{t.sidePanel=t.sidePanel==="favorites"?null:"favorites",v()}} title="收藏">
              <span class="sidebar-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></span><span class="sidebar-label">收藏</span>
            </button>
            <button class="sidebar-item ${t.sidePanel==="consult"?"active":""}" @click=${()=>{t.sidePanel==="consult"?t.sidePanel=null:(t.sidePanel="consult",t.consultView="list",t.consultAgents.length===0&&Mt()),v()}} title="AI专家咨询">
              <span class="sidebar-icon" style="position:relative;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>${t.consultUnreadCount>0?r`<span class="sidebar-red-dot"></span>`:""}</span><span class="sidebar-label">AI专家咨询${t.consultUnreadCount>0?r`<span class="consult-unread-badge">${t.consultUnreadCount}</span>`:""}</span>
            </button>
          </div>
          <div class="sidebar-bottom">
            <button class="sidebar-item ${t.sidePanel==="settings"?"active":""}" @click=${()=>{t.sidePanel=t.sidePanel==="settings"?null:"settings",t.sidePanel==="settings"&&t.modelList.length===0&&He(),v()}} title="设置">
              <span class="sidebar-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg></span><span class="sidebar-label">设置</span>
            </button>
            <button class="sidebar-item ${t.sidePanel==="about"?"active":""}" @click=${()=>{t.sidePanel=t.sidePanel==="about"?null:"about",v()}} title="关于">
              <span class="sidebar-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg></span><span class="sidebar-label">关于</span>
            </button>
            <button class="sidebar-item" @click=${()=>{window.open("https://taxbot.cc","_blank")}} title="Taxbot">
              <span class="sidebar-icon"><img src="./assets/taxchat-logo.png" alt="Taxbot" style="width:18px;height:18px;border-radius:4px;object-fit:contain;" /></span><span class="sidebar-label">Taxbot</span>
            </button>
            <button class="sidebar-collapse-btn" @click=${()=>{t.sidebarCollapsed=!t.sidebarCollapsed,localStorage.setItem("taxbot_sidebar_collapsed",String(t.sidebarCollapsed)),v()}} title=${t.sidebarCollapsed?"展开侧栏":"收起侧栏"}>
              ${t.sidebarCollapsed?r`<span class="sidebar-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></span>`:r`<span class="sidebar-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg></span>`}
            </button>
          </div>
        </nav>

        <div class="side-panel ${t.sidePanel?"open":""} ${t.sidePanel==="about"||t.sidePanel==="settings"||t.sidePanel==="consult"?"fullscreen":""}"
             style="${t.sidePanel&&t.sidePanel!=="about"&&t.sidePanel!=="settings"&&t.sidePanel!=="consult"?`width:${t.sidePanelWidth}px`:""}">
          ${t.sidePanel&&t.sidePanel!=="about"&&t.sidePanel!=="settings"&&t.sidePanel!=="consult"?r`
            <div class="side-panel-resize" @mousedown=${$i}></div>
          `:""}
        ${t.sidePanel==="conversations"?r`
          <div class="side-panel-view conversations-view">
            <div class="side-panel-header">
              <span class="panel-title"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px;"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> 对话列表</span>
              <button class="side-panel-close" @click=${()=>{t.sidePanel=null,v()}} title="关闭">✕</button>
            </div>
            <div class="side-panel-body">
              <button class="conv-new-btn" @click=${()=>{Te()}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                新建对话
              </button>
              <div class="conv-list">
                ${[...t.conversations].sort((s,l)=>(l.lastAccessedAt||l.updatedAt)-(s.lastAccessedAt||s.updatedAt)).map(s=>{const l=s.id===t.currentConversationId,c=t.renamingConversation===s.id,u=t.confirmingConvDelete===s.id,g=new Date(s.updatedAt).toLocaleString("zh-CN",{month:"numeric",day:"numeric",hour:"2-digit",minute:"2-digit"}),p=t.unreadConversations.has(s.id),m=`taxchat-${s.id}`,f=[...t.activeRuns.values()].some(h=>h.sessionKey===m);return r`
                    <div class="conv-item ${l?"conv-item--active":""} ${p?"conv-item--unread":""}" @click=${()=>{!c&&!u&&jt(s.id)}}>
                      <div class="conv-item__main">
                        ${c?r`
                          <input class="conv-rename-input" type="text" .value=${s.title}
                            @click=${h=>h.stopPropagation()}
                            @keydown=${h=>{h.key==="Enter"&&qe(s.id,h.target.value),h.key==="Escape"&&(t.renamingConversation=null,v())}}
                            @blur=${h=>{qe(s.id,h.target.value)}}
                          />
                        `:r`
                          <div class="conv-item__title">${p?r`<span class="conv-unread-dot"></span>`:""}${s.title}</div>
                          <div class="conv-item__meta">${f?r`<span class="conv-replying">回复中...</span>`:""}${g} · ${s.messageCount} 条消息</div>
                        `}
                      </div>
                      ${u?r`
                        <div class="conv-delete-confirm" @click=${h=>h.stopPropagation()}>
                          <span>删除?</span>
                          <button class="conv-confirm-yes" @click=${()=>gn(s.id)}>是</button>
                          <button class="conv-confirm-no" @click=${()=>{t.confirmingConvDelete=null,v()}}>否</button>
                        </div>
                      `:r`
                        <div class="conv-item__actions">
                          <button class="conv-action-btn" @click=${h=>{h.stopPropagation(),t.renamingConversation=s.id,v(),requestAnimationFrame(()=>{const w=document.querySelector(".conv-rename-input");w&&(w.focus(),w.select())})}} title="重命名">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          </button>
                          <button class="conv-action-btn conv-action-btn--danger" @click=${h=>{h.stopPropagation(),t.confirmingConvDelete=s.id,v()}} title="删除">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                          </button>
                        </div>
                      `}
                    </div>
                  `})}
              </div>
            </div>
          </div>
        `:""}
        ${t.sidePanel==="favorites"?(()=>{const s=[];for(const u of t.conversations){const g=u.id===t.currentConversationId,p=g?t.favorites:Pt(u.id);if(p.size===0)continue;const m=g?t.messages:Kt(u.id);for(const f of m)f.type==="assistant"&&p.has(f.id)&&s.push({msg:f,convId:u.id,convTitle:u.title})}const l=t.favSearchQuery.trim().toLowerCase(),c=l?s.filter(u=>u.msg.text.toLowerCase().includes(l)):s;return r`
          <div class="side-panel-view favorites-view">
            <div class="side-panel-header">
              <span class="panel-title"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> 收藏夹 (${c.length})</span>
              <button class="side-panel-close" @click=${()=>{t.sidePanel=null,v()}} title="关闭">✕</button>
            </div>
            <div class="fav-search-bar">
              <svg class="fav-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input class="fav-search-input" type="text" placeholder="搜索收藏..." .value=${t.favSearchQuery} @input=${u=>{t.favSearchQuery=u.target.value,v()}} />
              ${t.favSearchQuery?r`<button class="fav-search-clear" @click=${()=>{t.favSearchQuery="",v()}}>✕</button>`:""}
            </div>
            <div class="side-panel-body">
              ${c.length===0?r`<div class="favorites-empty">${t.favSearchQuery?"无匹配结果":"暂无收藏"}</div>`:(()=>{const u=new Map;for(const p of c){const m=new Date(p.msg.timestamp),f=`${m.getFullYear()}-${String(m.getMonth()+1).padStart(2,"0")}-${String(m.getDate()).padStart(2,"0")}`;u.has(f)||u.set(f,[]),u.get(f).push(p)}return[...u.entries()].sort((p,m)=>m[0].localeCompare(p[0])).map(([p,m])=>{const f=new Date,h=`${f.getFullYear()}-${String(f.getMonth()+1).padStart(2,"0")}-${String(f.getDate()).padStart(2,"0")}`,w=new Date(f);w.setDate(w.getDate()-1);const x=`${w.getFullYear()}-${String(w.getMonth()+1).padStart(2,"0")}-${String(w.getDate()).padStart(2,"0")}`;return r`
                      <div class="fav-date-group">
                        <div class="fav-date-header">${p===h?"今天":p===x?"昨天":p}<span class="fav-date-count">${m.length}</span></div>
                        ${m.map(y=>{const A=y.convId===t.currentConversationId;return r`
                          <div class="favorites-item" @click=${()=>{const lt=y.msg.id,I=y.convId;t.sidePanel=null,I!==t.currentConversationId&&jt(I),v(),setTimeout(()=>bn(lt),350)}}>
                            <div class="favorites-item__text">${y.msg.text.length>80?y.msg.text.slice(0,80)+"...":y.msg.text}</div>
                            <div class="favorites-item__meta">
                              <span>${et(y.msg.timestamp)}</span>
                              ${A?"":r`<span class="fav-conv-tag">${y.convTitle}</span>`}
                              <button class="favorites-item__remove" @click=${lt=>{if(lt.stopPropagation(),A)ks(y.msg.id);else{const I=Pt(y.convId);I.delete(y.msg.id),ye(y.convId,I),v()}}} title="取消收藏">✕</button>
                            </div>
                          </div>
                        `})}
                      </div>
                    `})})()}
            </div>
          </div>
        `})():""}
        ${t.sidePanel==="knowledge"?r`
          <div class="side-panel-view knowledge-view"
            @dragover=${s=>{s.preventDefault(),s.stopPropagation()}}
            @dragenter=${s=>{s.preventDefault(),s.stopPropagation(),$t(St+1),t.knowledgeDragOver||(t.knowledgeDragOver=!0,v())}}
            @dragleave=${s=>{s.preventDefault(),s.stopPropagation(),$t(St-1),St<=0&&($t(0),t.knowledgeDragOver=!1,v())}}
            @drop=${s=>{s.preventDefault(),s.stopPropagation(),$t(0),t.knowledgeDragOver=!1,v(),Nn(s)}}
          >
            <div class="side-panel-header">
              <span class="panel-title"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px;"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg> 知识库</span>
              <button class="side-panel-close" @click=${()=>{t.sidePanel=null,v()}} title="关闭">✕</button>
            </div>
            <div class="side-panel-body">
              ${t.authorizedFolder?r`
                <div class="knowledge-folder-bar">
                  <span class="knowledge-folder-path" title=${t.authorizedFolder}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;flex-shrink:0;"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg> ${t.authorizedFolder}</span>
                  <button class="knowledge-folder-change" @click=${()=>ee().then(()=>V())} title="更换文件夹">更换</button>
                  <button class="knowledge-folder-change" @click=${()=>V()} title="刷新文件列表">刷新</button>
                </div>
                ${t.knowledgeFiles.length>0?r`
                  <div class="sort-bar">
                    <span class="sort-bar__label">排序:</span>
                    <button class="sort-bar__btn ${t.filesSortBy==="time"?"active":""}" @click=${()=>{t.filesSortBy="time",v()}}>按时间</button>
                    <button class="sort-bar__btn ${t.filesSortBy==="name"?"active":""}" @click=${()=>{t.filesSortBy="name",v()}}>按名称</button>
                  </div>
                `:""}
                ${t.knowledgeDragOver?r`
                  <div class="knowledge-drop-zone">
                    <div class="knowledge-drop-text"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-4px;"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg> 松开以添加文件到知识库</div>
                  </div>
                `:""}
                ${t.knowledgeLoading?r`
                  <div class="knowledge-empty">加载中...</div>
                `:t.knowledgeFiles.length===0?r`
                  <div class="knowledge-empty">文件夹中没有可识别的文件<br><small>支持: txt, pdf, docx, xlsx, csv, json, md 等</small></div>
                `:mn().map(s=>r`
                  <div class="knowledge-file-item">
                    <span class="knowledge-file-icon">${s.type==="image"?r`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`:s.type==="doc"?r`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`:r`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`}</span>
                    <span class="knowledge-file-name" title=${s.name}>${s.name}</span>
                    <span class="knowledge-file-size">${Yt(s.size)}</span>
                    <button class="knowledge-file-btn ref" @click=${()=>Vn(s.name)} title="引用到对话">引用</button>
                    <button class="knowledge-file-btn del" @click=${()=>Hn(s.name)} title="删除文件"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
                  </div>
                `)}
              `:r`
                <div class="knowledge-empty">
                  <div style="margin-bottom: 12px; color: #9ca3af;"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg></div>
                  <div style="margin-bottom: 16px; color: #6b7280;">尚未选择知识库文件夹</div>
                  <button class="skill-add-btn" @click=${()=>ee().then(()=>V())}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg> 选择文件夹</button>
                </div>
              `}
            </div>
          </div>
        `:""}
        ${t.sidePanel==="skills"?r`
          <div class="side-panel-view skills-view" style="display:flex;flex-direction:column;overflow:hidden;">
            <div class="side-panel-header">
              <span class="panel-title"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px;"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> 技能</span>
              <button class="side-panel-close" @click=${()=>{t.sidePanel=null,v()}} title="关闭">✕</button>
            </div>
            <!-- Tab Bar -->
            <div class="skills-tab-bar">
              <button class="skills-tab ${t.skillsTab==="installed"?"active":""}"
                @click=${()=>{t.skillsTab="installed",v()}}>已安装</button>
              <button class="skills-tab ${t.skillsTab==="market"?"active":""}"
                @click=${()=>{t.skillsTab="market",t.taxstoreConnected&&t.taxstoreSkills.length===0&&K(1),v()}}>市场</button>
            </div>
            <!-- Installed Tab -->
            ${t.skillsTab==="installed"?r`
            <div class="side-panel-body">
              <div class="skill-section-header" @click=${()=>{t.builtinSkillsCollapsed=!t.builtinSkillsCollapsed,v()}}>
                <span class="skill-section-arrow ${t.builtinSkillsCollapsed?"collapsed":""}">▾</span>
                <span class="skill-section-label">预制技能</span>
                <span class="skill-section-count">${R.length}</span>
              </div>
              ${t.builtinSkillsCollapsed?"":R.map(s=>r`
                <div class="skill-item skill-item--builtin">
                  <div class="skill-item__emoji" @click=${()=>tt(s)} style="cursor:pointer">${s.emoji}</div>
                  <div class="skill-item__body" @click=${()=>tt(s)} style="cursor:pointer">
                    <div class="skill-item__name">${s.name} <span class="skill-builtin-badge">预制</span></div>
                    ${s.description?r`<div class="skill-item__desc">${s.description}</div>`:""}
                  </div>
                </div>
              `)}
              <div class="skill-section-label" style="margin-top: 12px; padding-left: 12px;">自定义技能</div>
              <div class="skill-add-row">
                <button class="skill-add-btn" @click=${()=>Le()}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> 新建 Skill</button>
                <button class="skill-add-btn" @click=${()=>En()}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> 上传技能包</button>
              </div>
              ${t.customSkills.length>1?r`
                <div class="sort-bar">
                  <span class="sort-bar__label">排序:</span>
                  <button class="sort-bar__btn ${t.skillsSortBy==="time"?"active":""}" @click=${()=>{t.skillsSortBy="time",v()}}>按时间</button>
                  <button class="sort-bar__btn ${t.skillsSortBy==="name"?"active":""}" @click=${()=>{t.skillsSortBy="name",v()}}>按名称</button>
                </div>
              `:""}
              ${t.customSkills.length===0?r`<div class="knowledge-empty" style="padding: 12px;">暂无自定义技能</div>`:fn().map(s=>r`
                  <div class="skill-item skill-item--custom">
                    <div class="skill-item__emoji" @click=${()=>tt(s)} style="cursor:pointer">${s.emoji}</div>
                    <div class="skill-item__body" @click=${()=>tt(s)} style="cursor:pointer">
                      <div class="skill-item__name">${s.name}</div>
                      ${s.description?r`<div class="skill-item__desc">${s.description}</div>`:""}
                    </div>
                    <div class="skill-item__actions">
                      <button class="skill-item__btn ${s.pinned?"pinned":""}" @click=${()=>On(s.id)} title="${s.pinned?"取消快捷":"添加到快捷"}"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/></svg></button>
                      <button class="skill-item__btn" @click=${()=>Ln(s)} title="导出"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button>
                      <button class="skill-item__btn" @click=${()=>Le(s)} title="编辑"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                      <button class="skill-item__btn" @click=${()=>qn(s.id)} title="删除"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
                    </div>
                  </div>
                `)}
            </div>
            `:""}
            <!-- Market Tab -->
            ${t.skillsTab==="market"?r`
            ${t.taxstoreConnected?r`
              <div class="ts-user-bar">
                <span class="ts-user-name">${t.taxstoreUser?.name||t.taxstoreUser?.email}</span>
                <span class="ts-points-badge">${t.taxstoreUser?.points??0} 积分</span>
                <button class="ts-logout-btn" @click=${Oa} title="断开连接">退出</button>
              </div>
              ${t.taxstoreUpdates.length>0?r`
                <div class="ts-update-banner">
                  <span class="ts-update-banner-icon">🔄</span>
                  <span class="ts-update-banner-text">${t.taxstoreUpdates.length} 个技能有更新可用</span>
                </div>
              `:""}
              <div class="ts-filter-bar">
                <input class="ts-search-input" type="text" placeholder="搜索技能..."
                  .value=${t.taxstoreQuery}
                  @input=${s=>{t.taxstoreQuery=s.target.value}}
                  @keydown=${s=>{s.key==="Enter"&&Ba(t.taxstoreQuery)}} />
                <button class="ts-sort-btn ${t.taxstoreSort==="latest"?"active":""}"
                  @click=${()=>Xe("latest")}>最新</button>
                <button class="ts-sort-btn ${t.taxstoreSort==="popular"?"active":""}"
                  @click=${()=>Xe("popular")}>热门</button>
              </div>
              <div class="ts-category-bar">
                <button class="ts-cat-tag ${t.taxstoreCategory===""?"active":""}"
                  @click=${()=>ct("")}>全部</button>
                <button class="ts-cat-tag ${t.taxstoreCategory==="tax-tools"?"active":""}"
                  @click=${()=>ct("tax-tools")}>税务工具</button>
                <button class="ts-cat-tag ${t.taxstoreCategory==="forms"?"active":""}"
                  @click=${()=>ct("forms")}>报表</button>
                <button class="ts-cat-tag ${t.taxstoreCategory==="reporting"?"active":""}"
                  @click=${()=>ct("reporting")}>报告</button>
                <button class="ts-cat-tag ${t.taxstoreCategory==="automation"?"active":""}"
                  @click=${()=>ct("automation")}>自动化</button>
              </div>
              ${t.taxstoreError?r`<div class="ts-error">${t.taxstoreError}</div>`:""}
              ${t.taxstoreLoading?r`<div class="ts-loading">加载中...</div>`:r`
                <div class="ts-skills-list">
                  ${t.taxstoreSkills.length===0?r`<div class="ts-empty">${t.taxstoreQuery?"未找到匹配技能":"暂无技能"}</div>`:t.taxstoreSkills.map(s=>{const l=Va(s.id);return r`
                        <div class="ts-skill-card">
                          <div class="ts-skill-header">
                            <span class="ts-skill-name">${s.name}</span>
                            <span class="ts-skill-version">v${s.version}</span>
                          </div>
                          ${s.description?r`<div class="ts-skill-desc">${s.description}</div>`:""}
                          <div class="ts-skill-meta">
                            <span class="ts-skill-rating">${s.reviews?.length?r`★ ${Ka(s.reviews)}`:""}</span>
                            <span>${s.downloads} 下载</span>
                            <span class="ts-skill-cost ${s.pointsCost===0?"free":"paid"}">${s.pointsCost===0?"免费":`${s.pointsCost} 积分`}</span>
                            <span>${s.author?.name||""}</span>
                            ${t.taxstoreInstallingId===s.id?r`<span class="ts-install-progress">${t.taxstoreInstallStep==="downloading"?"下载中...":"安装中..."}</span>`:r`<button class="ts-install-btn ${l?"installed":""}"
                                  @click=${()=>{l||Ua(s)}}
                                  ?disabled=${l||!!t.taxstoreInstallingId}>
                                  ${l?"已安装":"安装"}
                                </button>`}
                          </div>
                        </div>
                      `})}
                </div>
                ${t.taxstoreTotalPages>1?r`
                  <div class="ts-pagination">
                    <button class="ts-page-btn" ?disabled=${t.taxstorePage<=1}
                      @click=${()=>K(t.taxstorePage-1)}>上一页</button>
                    <span>${t.taxstorePage} / ${t.taxstoreTotalPages}</span>
                    <button class="ts-page-btn" ?disabled=${t.taxstorePage>=t.taxstoreTotalPages}
                      @click=${()=>K(t.taxstorePage+1)}>下一页</button>
                  </div>
                `:""}
              `}
            `:r`
              <div class="ts-login">
                <div class="ts-login-title">连接 TaxStore</div>
                <div class="ts-login-desc">登录 taxbot.cc 账户，浏览和安装技能</div>
                <input type="email" placeholder="邮箱" .value=${t.taxstoreLoginEmail}
                  @input=${s=>{t.taxstoreLoginEmail=s.target.value}} />
                <input type="password" placeholder="密码" .value=${t.taxstoreLoginPassword}
                  @input=${s=>{t.taxstoreLoginPassword=s.target.value}}
                  @keydown=${s=>{s.key==="Enter"&&Qe(t.taxstoreLoginEmail,t.taxstoreLoginPassword)}} />
                ${t.taxstoreError?r`<div class="ts-login-error">${t.taxstoreError}</div>`:""}
                <button class="ts-login-btn" ?disabled=${t.taxstoreLoading}
                  @click=${()=>Qe(t.taxstoreLoginEmail,t.taxstoreLoginPassword)}>
                  ${t.taxstoreLoading?"连接中...":"登录"}
                </button>
                <div class="ts-login-desc" style="margin-top:4px;">
                  没有账户？访问 <a href="https://taxbot.cc:8443/taxbot" target="_blank" style="color:#2E5484;">taxbot.cc</a> 注册
                </div>
              </div>
            `}
            `:""}
          </div>
        `:""}
        ${t.sidePanel==="agents"?r`
          <div class="side-panel-view agents-view">
            <div class="side-panel-header">
              <span class="panel-title"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px;"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> 我的智能体</span>
              <button class="side-panel-close" @click=${()=>{t.sidePanel=null,v()}} title="关闭">✕</button>
            </div>
            <div class="side-panel-body">
              <!-- Tab bar -->
              <div class="rental-tab-bar">
                <button class="rental-tab ${t.rentalActiveTab==="agents"?"rental-tab--active":""}"
                  @click=${()=>{t.rentalActiveTab="agents",v()}}>
                  🤖 智能体列表
                </button>
                <button class="rental-tab ${t.rentalActiveTab==="tasks"?"rental-tab--active":""}"
                  @click=${()=>{t.rentalActiveTab="tasks",v()}}>
                  📋 任务
                  ${t.rentalPendingTasks.length>0?r`<span class="rental-tab-badge">${t.rentalPendingTasks.length}</span>`:""}
                </button>
              </div>

              ${t.rentalActiveTab==="agents"?r`
              <!-- 智能体列表 tab -->
              <div class="skill-add-row">
                <button class="skill-add-btn" @click=${()=>{t.editingAgentId=null,t.agentCreateDraft={name:"",emoji:"🤖",description:"",identityDesc:"",expertise:"",avatarDataUrl:"",selectedSkills:[]},t.creatingAgent=!t.creatingAgent,v()}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> 新建智能体
                </button>
              </div>
              ${t.agentsLoading?r`<div class="knowledge-empty">加载中...</div>`:""}
              ${!t.agentsLoading&&t.agentsList.length===0?r`<div class="knowledge-empty">暂无智能体</div>`:""}
              ${t.agentsList.map(s=>{const l=Ga(s.id),c=l?pi(l.id):[],u=c.reduce((g,p)=>g+p.price,0);return r`
                <div class="skill-item agent-card-uniform" @click=${()=>{te(s)}} style="cursor:pointer" title="点击@${s.name}">
                  <div class="skill-item__emoji">${s.avatarUrl?r`<img src="${s.avatarUrl}" class="agent-avatar-img" />`:s.emoji}</div>
                  <div class="skill-item__body">
                    <div class="skill-item__name">${s.name} ${s.isDefault?r`<span class="skill-builtin-badge">默认</span>`:""}</div>
                    <div class="skill-item__desc">${s.description||" "}</div>
                    <div class="agent-card-rental-line">${l?r`<span class="agent-rental-badge agent-rental-badge--active">🏪 ${l.price}积分/次</span>${c.length>0?r`<span class="agent-card-stats">✅${c.length}${l.avgRating>0?r` ⭐${l.avgRating.toFixed(1)}`:""} 💰${u}</span>`:""}`:" "}</div>
                  </div>
                  <div class="skill-item__actions">
                    ${s.isDefault?r`
                      ${l?r`<button class="agent-action-btn" @click=${g=>{g.stopPropagation(),ts(l.id)}}>下架</button>`:t.taxstoreConnected?r`<button class="agent-rental-badge agent-rental-badge--btn" @click=${g=>{g.stopPropagation(),Ze(s)}}>🏪 出租赚积分</button>`:""}
                    `:r`
                      ${t.confirmingAgentDelete===s.id?r`
                        <span class="agent-delete-confirm">
                          确定删除？
                          <button class="agent-action-btn agent-action-btn--danger" @click=${g=>{g.stopPropagation(),Dn(s.id)}}>是</button>
                          <button class="agent-action-btn" @click=${g=>{g.stopPropagation(),t.confirmingAgentDelete=null,v()}}>否</button>
                        </span>
                      `:r`
                        ${l?r`<button class="agent-action-btn" @click=${g=>{g.stopPropagation(),ts(l.id)}}>下架</button>`:t.taxstoreConnected?r`<button class="agent-rental-badge agent-rental-badge--btn" @click=${g=>{g.stopPropagation(),Ze(s)}}>🏪 出租赚积分</button>`:""}
                        <button class="agent-action-btn" @click=${g=>{g.stopPropagation(),Pn(s)}}>编辑</button>
                        <button class="agent-action-btn agent-action-btn--danger" @click=${g=>{g.stopPropagation(),t.confirmingAgentDelete=s.id,v()}}>删除</button>
                      `}
                    `}
                  </div>
                </div>
              `})}
              `:r`
              <!-- 任务 tab -->
              <!-- 待处理任务 -->
              ${t.rentalPendingTasks.length>0?r`
                <div class="rental-tasks-section">
                  <div class="rental-tasks-header">
                    📋 待处理任务 <span class="rental-tasks-count">${t.rentalPendingTasks.length}</span>
                  </div>
                  ${t.rentalPendingTasks.map(s=>r`
                    <div class="rental-task-card" @click=${()=>ie(s)}>
                      <div class="rental-task-card-emoji">${s.listing.emoji}</div>
                      <div class="rental-task-card-body">
                        <div class="rental-task-card-name">${s.title}${(s.unreadMessageCount||0)>0?r`<span class="rental-task-msg-dot">💬</span>`:""}</div>
                        <div class="rental-task-card-desc">${s.listing.name} · ${s.client.name}</div>
                      </div>
                      <div class="rental-task-card-price">${s.price} 积分</div>
                    </div>
                  `)}
                </div>
              `:r`
                <div class="rental-tasks-empty">暂无待处理任务</div>
              `}

              <!-- 已完成任务记录 -->
              ${t.rentalCompletedTasks.length>0?r`
                <div class="rental-tasks-section">
                  <div class="rental-tasks-header">
                    ✅ 已完成任务 <span class="rental-completed-count">${t.rentalCompletedTasks.length}</span>
                  </div>
                  ${t.rentalCompletedTasks.map(s=>r`
                    <div class="rental-task-card rental-task-card--completed" @click=${()=>{t.rentalTaskDetailView=s,d()}}>
                      <div class="rental-task-card-emoji">${s.listing.emoji}</div>
                      <div class="rental-task-card-body">
                        <div class="rental-task-card-name">${s.title}</div>
                        <div class="rental-task-card-desc">
                          ${s.listing.name} · ${s.client.name}
                          · ${s.completedAt?new Date(s.completedAt).toLocaleDateString():""}
                        </div>
                        ${s.rating?r`
                          <div class="rental-task-card-rating">
                            ${"⭐".repeat(s.rating)}
                            ${s.ratingComment?r`<span class="rental-task-card-comment">${s.ratingComment}</span>`:""}
                          </div>
                        `:""}
                      </div>
                      <div class="rental-task-card-price rental-task-card-price--earned">+${s.price} 积分</div>
                    </div>
                  `)}
                </div>
              `:""}

              ${t.rentalPendingTasks.length===0&&t.rentalCompletedTasks.length===0?r`
                <div class="rental-tasks-empty">暂无任务记录</div>
              `:""}
              `}

              <!-- 推荐模板 (仅在智能体列表 tab 显示) -->
              ${t.rentalActiveTab==="agents"&&De.some(s=>!t.agentsList.some(l=>l.name===s.name))?r`
                <div class="agent-templates-section">
                  <div class="agent-templates-header">推荐模板</div>
                  ${De.map(s=>{const l=t.agentsList.some(c=>c.name===s.name);return r`
                      <div class="agent-template-item">
                        <span class="agent-template-emoji">${s.emoji}</span>
                        <div class="agent-template-body">
                          <div class="agent-template-name">${s.name}</div>
                          <div class="agent-template-desc">${s.description}</div>
                        </div>
                        ${l?r`<span class="agent-template-badge">已创建</span>`:r`<button class="agent-template-btn" @click=${c=>{c.stopPropagation(),Mn(s)}}>一键创建</button>`}
                      </div>
                    `})}
                </div>
              `:""}
            </div>
          </div>
        `:""}
        ${t.sidePanel==="settings"?r`
          <div class="side-panel-view settings-view">
            <div class="side-panel-header">
              <span class="panel-title">${t.settingsView==="model"?r`
                <button class="settings-back-btn" @click=${()=>{t.settingsView="main",t.modelError=null,v()}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                </button> 模型配置
              `:r`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px;"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg> 设置`}</span>
              <button class="side-panel-close" @click=${()=>{t.sidePanel=null,t.settingsView="main",t.confirmingClear=!1,t.modelError=null,v()}} title="关闭">✕</button>
            </div>
            <div class="side-panel-body settings-fullscreen">
              ${t.settingsView==="model"?r`
              <!-- Model Config Sub-View -->
              <div class="about-settings">
                ${t.modelLoading?r`<div class="knowledge-empty">加载中...</div>`:r`
                  ${t.activeModel?r`
                  <div class="model-current-card">
                    <div class="model-current-title">当前模型</div>
                    <div class="model-current-rows">
                      <div class="model-current-row"><span class="model-current-label">提供商</span><span class="model-current-value">${t.activeModel.provider||"-"}</span></div>
                      <div class="model-current-row"><span class="model-current-label">模型</span><span class="model-current-value">${t.activeModel.modelId||"-"}</span></div>
                      <div class="model-current-row"><span class="model-current-label">API 地址</span><span class="model-current-value">${t.activeModel.baseUrl||"-"}</span></div>
                      <div class="model-current-row">
                        <span class="model-current-label">API Key</span>
                        <span class="model-current-value model-current-key">
                          ${t.activeModel.apiKey?t.apiKeyVisible?t.activeModel.apiKey:t.activeModel.apiKey.replace(/./g,"•"):"-"}
                          ${t.activeModel.apiKey?r`<button class="settings-key-toggle-sm" type="button" @click=${()=>{t.apiKeyVisible=!t.apiKeyVisible,v()}} title=${t.apiKeyVisible?"隐藏":"显示"}>
                            ${t.apiKeyVisible?r`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`:r`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`}
                          </button>`:""}
                        </span>
                      </div>
                    </div>
                  </div>
                  `:""}
                  <div class="about-setting-group">
                    <div class="about-setting-title">选择模型</div>
                    <div class="settings-form">
                      <div class="settings-field">
                        <label class="settings-label">模型提供商</label>
                        <select class="settings-input" .value=${t.modelConfigDraft.provider} @change=${s=>{ra(s.target.value)}}>
                          ${t.modelList.length===0&&!t.modelConfigDraft.provider?r`<option value="">-- 无可用提供商 --</option>`:""}
                          ${la().map(s=>r`
                            <option value=${s} ?selected=${s===t.modelConfigDraft.provider}>${s}${(()=>{const l=ve(s).length;return l>0?` (${l} 个模型)`:""})()}</option>
                          `)}
                        </select>
                      </div>
                      <div class="settings-field">
                        <label class="settings-label">模型</label>
                        ${(()=>{const s=ve(t.modelConfigDraft.provider);return r`
                            <select class="settings-input" .value=${t.modelConfigDraft.modelId} @change=${l=>{ca(l.target.value)}}>
                              ${s.length===0?r`<option value="">-- 无可用模型 --</option>`:""}
                              ${s.map(l=>r`
                                <option value=${l.id} ?selected=${l.id===t.modelConfigDraft.modelId}>${l.name||l.id}${l.contextWindow?` (${Math.round(l.contextWindow/1024)}K)`:""}${l.reasoning?" · 推理":""}</option>
                              `)}
                            </select>
                          `})()}
                      </div>
                    </div>
                  </div>
                  <div class="about-setting-group">
                    <div class="about-setting-title">提供商配置</div>
                    <div class="settings-form">
                      <div class="settings-field">
                        <label class="settings-label">API 地址</label>
                        <input class="settings-input" type="text" .value=${t.modelConfigDraft.baseUrl} @input=${s=>{t.modelConfigDraft.baseUrl=s.target.value}} placeholder="如: https://api.openai.com/v1" />
                      </div>
                      <div class="settings-field">
                        <label class="settings-label">API Key</label>
                        <div class="settings-input-wrap">
                          <input class="settings-input settings-input-key" type=${t.apiKeyVisible?"text":"password"} .value=${t.modelConfigDraft.apiKey} @input=${s=>{t.modelConfigDraft.apiKey=s.target.value}} placeholder="sk-..." />
                          <button class="settings-key-toggle" type="button" @click=${()=>{t.apiKeyVisible=!t.apiKeyVisible,v()}} title=${t.apiKeyVisible?"隐藏":"显示"}>
                            ${t.apiKeyVisible?r`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`:r`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`}
                          </button>
                        </div>
                      </div>
                      <div class="settings-field">
                        <label class="settings-label">API 协议</label>
                        <select class="settings-input" .value=${t.modelConfigDraft.api} @change=${s=>{t.modelConfigDraft.api=s.target.value,v()}}>
                          <option value="openai-completions">OpenAI 兼容 (通义千问/DeepSeek等)</option>
                          <option value="openai-responses">OpenAI Responses</option>
                          <option value="anthropic-messages">Anthropic Claude</option>
                          <option value="google-generative-ai">Google Gemini</option>
                          <option value="github-copilot">GitHub Copilot</option>
                          <option value="bedrock-converse-stream">AWS Bedrock</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  ${t.modelError?r`<div class="settings-error">${t.modelError}</div>`:""}
                  ${t.confirmingModelSave?r`
                    <div class="model-confirm-overlay">
                      <div class="model-confirm-dialog">
                        <div class="model-confirm-title">确认更换模型</div>
                        <div class="model-confirm-info">
                          <div class="model-confirm-row"><span class="model-confirm-label">提供商</span><span class="model-confirm-value">${t.modelConfigDraft.provider}</span></div>
                          <div class="model-confirm-row"><span class="model-confirm-label">模型</span><span class="model-confirm-value">${t.modelConfigDraft.modelId}</span></div>
                          <div class="model-confirm-row"><span class="model-confirm-label">API 地址</span><span class="model-confirm-value">${t.modelConfigDraft.baseUrl}</span></div>
                          <div class="model-confirm-row"><span class="model-confirm-label">API 协议</span><span class="model-confirm-value">${t.modelConfigDraft.api}</span></div>
                        </div>
                        <div class="model-confirm-hint">更换模型后服务将自动重启</div>
                        <div class="model-confirm-actions">
                          <button class="model-confirm-btn cancel" @click=${()=>{t.confirmingModelSave=!1,v()}}>取消</button>
                          <button class="model-confirm-btn confirm" @click=${()=>{t.confirmingModelSave=!1,ua()}} ?disabled=${t.modelSaving}>
                            ${t.modelSaving?"保存中...":"确认更换"}
                          </button>
                        </div>
                      </div>
                    </div>
                  `:r`
                    <button class="settings-save-btn" @click=${()=>{t.confirmingModelSave=!0,t.modelError=null,v()}} ?disabled=${t.modelSaving}>
                      保存配置
                    </button>
                  `}
                `}
              </div>
              `:r`
              <!-- Settings Main View -->
              <div class="about-settings">
                <div class="about-setting-group">
                  <div class="about-setting-title">模型</div>
                  <div class="about-setting-row">
                    <button class="about-action-btn" @click=${()=>{t.settingsView="model",He(),v()}}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                        <line x1="12" y1="22.08" x2="12" y2="12"/>
                      </svg>
                      <span>模型配置</span>
                      ${t.modelList.length>0?r`<span class="settings-model-tag">${t.modelConfigDraft.modelId||t.modelList[0]?.name||t.modelList[0]?.id}</span>`:""}
                    </button>
                  </div>
                </div>
                <div class="about-setting-group">
                  <div class="about-setting-title">字体大小</div>
                  <div class="font-size-picker">
                    ${["small","medium","large","xlarge"].map(s=>{const l=s==="small"?"小":s==="medium"?"中":s==="large"?"大":"超大",c=s==="small"?"12px":s==="medium"?"14px":s==="large"?"16px":"19px";return r`
                      <button class="font-size-btn ${t.fontSize===s?"font-size-btn--active":""}"
                        @click=${()=>{t.fontSize=s,localStorage.setItem("taxbot_font_size",s),document.documentElement.setAttribute("data-font-size",s),v()}}>
                        <span class="font-size-btn__label" style="font-size:${c}">${l}</span>
                        <span class="font-size-btn__sample" style="font-size:${c}">Aa</span>
                      </button>`})}
                  </div>
                </div>
                <div class="about-setting-group">
                  <div class="about-setting-title">知识库</div>
                  <div class="about-setting-row">
                    <button class="about-action-btn" @click=${()=>{ee()}} ?disabled=${t.importingFolder}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                      </svg>
                      <span>${t.importingFolder?"导入中...":"授权访问文件夹"}</span>
                      ${t.authorizedFolder?r`
                        <span class="settings-folder-info">
                          <span class="settings-folder-path" title=${t.authorizedFolder}>${t.authorizedFolder}</span>
                          <button class="settings-folder-refresh" @click=${s=>{s.stopPropagation(),Wn()}} ?disabled=${t.importingFolder} title="重新读取文件夹">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                              <path d="M21 3v5h-5"/>
                              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                              <path d="M3 21v-5h5"/>
                            </svg>
                          </button>
                        </span>
                      `:""}
                    </button>
                    ${t.importResult?r`<div class="about-folder-status">${t.importResult}</div>`:""}
                  </div>
                </div>
                <div class="about-setting-group">
                  <div class="about-setting-title">数据管理</div>
                  <div class="about-setting-row">
                    ${t.confirmingClear?r`
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <span class="about-confirm-hint" style="margin: 0;">确认清空所有对话记录？</span>
                        <button class="about-confirm-btn confirm" @click=${()=>{na()}}>确认</button>
                        <button class="about-confirm-btn cancel" @click=${()=>{t.confirmingClear=!1,v()}}>取消</button>
                      </div>
                    `:r`
                      <button class="about-action-btn danger" @click=${()=>{t.confirmingClear=!0,v()}}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                        <span>清空对话记录</span>
                      </button>
                    `}
                  </div>
                  <div class="about-setting-row" style="margin-top: 8px;">
                    ${t.confirmingSessionClear?r`
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <span class="about-confirm-hint" style="margin: 0;">确认清空服务端会话？此操作不可恢复。</span>
                        <button class="about-confirm-btn confirm" @click=${()=>{aa()}}>确认</button>
                        <button class="about-confirm-btn cancel" @click=${()=>{t.confirmingSessionClear=!1,v()}}>取消</button>
                      </div>
                    `:r`
                      <button class="about-action-btn danger" @click=${()=>{t.confirmingSessionClear=!0,v()}}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/>
                        </svg>
                        <span>清空 Session</span>
                      </button>
                    `}
                  </div>
                </div>
                <div class="about-setting-group">
                  <div class="about-setting-title">应用</div>
                  <div class="about-setting-row">
                    ${t.confirmingExit?r`
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <span class="about-confirm-hint" style="margin: 0;">确认退出？将关闭窗口并关闭 Gateway。</span>
                        <button class="about-confirm-btn confirm" @click=${()=>{Ke()}}>确认退出</button>
                        <button class="about-confirm-btn cancel" @click=${()=>{t.confirmingExit=!1,v()}}>取消</button>
                      </div>
                    `:r`
                      <button class="about-action-btn danger" @click=${()=>{t.confirmingExit=!0,v()}}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                          <polyline points="16 17 21 12 16 7"/>
                          <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        <span>退出应用</span>
                      </button>
                    `}
                  </div>
                </div>
              </div>
              `}
            </div>
          </div>
        `:""}
        ${t.sidePanel==="about"?r`
          <div class="side-panel-view about-view">
            <div class="side-panel-header">
              <span class="panel-title">关于</span>
              <button class="side-panel-close" @click=${()=>{t.sidePanel=null,v()}} title="关闭">✕</button>
            </div>
            <div class="side-panel-body about-fullscreen">
              <div class="about-hero">
                <div class="about-logo">
                  <img src="./assets/taxchat-logo.png" alt="Taxbot" />
                </div>
                <div class="about-hero-text">
                  <div class="about-title">Taxbot Evo</div>
                  <div class="about-subtitle">AI 税务助理 · v${Us}</div>
                </div>
              </div>
              <div class="about-desc">通过 Skill 和 Agent 实现财税能力的自进化</div>
              <div class="about-cards">
                <div class="about-card">
                  <div class="about-card-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></div>
                  <div class="about-card-label">Skill 技能</div>
                  <div class="about-card-desc">安装、创建、分享技能包，持续扩展能力边界</div>
                </div>
                <div class="about-card">
                  <div class="about-card-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
                  <div class="about-card-label">Agent 智能体</div>
                  <div class="about-card-desc">创建专属智能体，出租到广场自动服务赚积分</div>
                </div>
                <div class="about-card">
                  <div class="about-card-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
                  <div class="about-card-label">智能对话</div>
                  <div class="about-card-desc">多轮对话、知识库学习、文件分析</div>
                </div>
                <div class="about-card">
                  <div class="about-card-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg></div>
                  <div class="about-card-label">自进化</div>
                  <div class="about-card-desc">技能越装越多、智能体越用越强、记忆持续积累</div>
                </div>
              </div>
              <div class="about-divider"></div>
              <div class="about-guide">
                <div class="about-setting-title">功能使用向导</div>

                <!-- 1. 智能对话 -->
                <div class="qs-section" style="padding:0 0 20px;">
                  <div class="qs-section-title"><span class="qs-section-num">1</span> 智能对话</div>
                  <div class="qs-section-desc">在主聊天区直接输入问题，支持多轮对话、文件上传分析。AI 回复支持复制、导出 Word、收藏、存入知识库等操作。可用 @智能体名 指定特定智能体回答。</div>
                  <div class="guide-illust">
                    <div class="guide-illust-bar"><span style="width:8px;height:8px;border-radius:50%;background:#34d399;"></span> 对话窗口</div>
                    <div class="guide-illust-body">
                      <div class="guide-chat-row right"><div class="guide-bubble guide-bubble--user">帮我分析这张增值税发票有什么风险？</div></div>
                      <div class="guide-chat-row"><div class="guide-bubble guide-bubble--ai">根据发票信息分析，发现以下 2 个风险点：<br>1. 税率与商品编码不匹配...<br>2. 开票日期晚于合同约定...</div></div>
                      <div class="guide-actions">
                        <span class="guide-action-tag">📋 复制</span>
                        <span class="guide-action-tag">📄 导出Word</span>
                        <span class="guide-action-tag">⭐ 收藏</span>
                        <span class="guide-action-tag">📚 存入知识库</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 2. 多对话管理 -->
                <div class="qs-section" style="padding:0 0 20px;">
                  <div class="qs-section-title"><span class="qs-section-num">2</span> 多对话管理</div>
                  <div class="qs-section-desc">左侧栏"对话"面板可创建多个独立对话，每个对话有独立的消息和上下文。切换对话时 AI 回复不中断，回复完成后自动显示未读标记。对话列表按最后点击顺序排列。</div>
                  <div class="guide-illust">
                    <div class="guide-illust-bar"><span style="width:8px;height:8px;border-radius:50%;background:#3b82f6;"></span> 对话列表</div>
                    <div class="guide-illust-body">
                      <div class="guide-conv-item guide-conv-item--active">
                        <span>💬</span>
                        <span class="guide-conv-title">增值税发票风险分析</span>
                        <span class="guide-conv-meta">刚刚</span>
                      </div>
                      <div class="guide-conv-item guide-conv-item--unread">
                        <span class="guide-conv-dot"></span>
                        <span class="guide-conv-title" style="font-weight:600;">企业所得税筹划方案</span>
                        <span class="guide-conv-meta" style="color:#0284c7;">回复中...</span>
                      </div>
                      <div class="guide-conv-item">
                        <span>💬</span>
                        <span class="guide-conv-title">个税年度汇算清缴</span>
                        <span class="guide-conv-meta">昨天</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 3. Skill 技能 -->
                <div class="qs-section" style="padding:0 0 20px;">
                  <div class="qs-section-title"><span class="qs-section-num">3</span> Skill 技能</div>
                  <div class="qs-section-desc">每个 Skill 是一个独立的财税能力单元。内置核心技能可直接使用，还可从 TaxStore 市场安装社区技能，或自己创建并分享。点击左侧栏"我的技能"管理技能。</div>
                  <div class="guide-illust">
                    <div class="guide-illust-bar"><span style="width:8px;height:8px;border-radius:50%;background:#8b5cf6;"></span> 我的技能</div>
                    <div class="guide-illust-body">
                      <div class="guide-skill-item">
                        <span class="guide-skill-emoji">🛡️</span>
                        <div class="guide-skill-text"><div class="guide-skill-name">税务风险治理</div><div class="guide-skill-desc">识别纳税风险并生成治理方案</div></div>
                        <span class="guide-skill-badge">内置</span>
                      </div>
                      <div class="guide-skill-item">
                        <span class="guide-skill-emoji">📋</span>
                        <div class="guide-skill-text"><div class="guide-skill-name">申报表预审</div><div class="guide-skill-desc">审核申报表数据逻辑</div></div>
                        <span class="guide-skill-badge">内置</span>
                      </div>
                      <div class="guide-skill-item">
                        <span class="guide-skill-emoji">🏪</span>
                        <div class="guide-skill-text"><div class="guide-skill-name">更多技能...</div><div class="guide-skill-desc">从 TaxStore 市场安装</div></div>
                        <span class="guide-skill-badge" style="background:#dcfce7;color:#16a34a;">市场</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 4. Agent 智能体 -->
                <div class="qs-section" style="padding:0 0 20px;">
                  <div class="qs-section-title"><span class="qs-section-num">4</span> Agent 智能体</div>
                  <div class="qs-section-desc">创建拥有专属身份、记忆和专长的智能体。在对话中用 @智能体名 调用，或发布到广场出租赚取积分。每次完成任务后智能体自动积累经验记忆，越用越强。</div>
                  <div class="guide-illust">
                    <div class="guide-illust-bar"><span style="width:8px;height:8px;border-radius:50%;background:#f59e0b;"></span> 智能体生命周期</div>
                    <div class="guide-illust-body">
                      <div class="guide-flow">
                        <div class="guide-flow-step"><div class="guide-flow-icon" style="background:#dbeafe;">✏️</div><div class="guide-flow-label">创建智能体</div></div>
                        <span class="guide-flow-arrow">→</span>
                        <div class="guide-flow-step"><div class="guide-flow-icon" style="background:#fef3c7;">💬</div><div class="guide-flow-label">对话中使用</div></div>
                        <span class="guide-flow-arrow">→</span>
                        <div class="guide-flow-step"><div class="guide-flow-icon" style="background:#dcfce7;">🏪</div><div class="guide-flow-label">发布到广场</div></div>
                        <span class="guide-flow-arrow">→</span>
                        <div class="guide-flow-step"><div class="guide-flow-icon" style="background:#fce7f3;">💰</div><div class="guide-flow-label">自动赚积分</div></div>
                        <span class="guide-flow-arrow">→</span>
                        <div class="guide-flow-step"><div class="guide-flow-icon" style="background:#ede9fe;">🧠</div><div class="guide-flow-label">积累记忆</div></div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 5. 知识库 -->
                <div class="qs-section" style="padding:0 0 20px;">
                  <div class="qs-section-title"><span class="qs-section-num">5</span> 知识库</div>
                  <div class="qs-section-desc">授权本地文件夹后，财税文件（PDF、Word、Excel 等）自动学习入库。知识库为对话和技能提供专业上下文，让 AI 回答更精准。还可将重要回复直接存入知识库。</div>
                  <div class="guide-illust">
                    <div class="guide-illust-bar"><span style="width:8px;height:8px;border-radius:50%;background:#10b981;"></span> 知识库文件</div>
                    <div class="guide-illust-body">
                      <div class="guide-file-row">
                        <span class="guide-file-icon">📄</span>
                        <span class="guide-file-name">2024年企业所得税汇算清缴.pdf</span>
                        <span class="guide-file-size">2.4 MB</span>
                        <span class="guide-file-status">✓ 已学习</span>
                      </div>
                      <div class="guide-file-row">
                        <span class="guide-file-icon">📊</span>
                        <span class="guide-file-name">增值税申报表模板.xlsx</span>
                        <span class="guide-file-size">856 KB</span>
                        <span class="guide-file-status">✓ 已学习</span>
                      </div>
                      <div class="guide-file-row">
                        <span class="guide-file-icon">📝</span>
                        <span class="guide-file-name">税务风险检查清单.docx</span>
                        <span class="guide-file-size">128 KB</span>
                        <span class="guide-file-status" style="color:#f59e0b;">⟳ 学习中</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 6. AI专家咨询 -->
                <div class="qs-section" style="padding:0 0 20px;">
                  <div class="qs-section-title"><span class="qs-section-num">6</span> AI专家咨询</div>
                  <div class="qs-section-desc">在左侧栏"AI专家咨询"中，浏览广场上其他用户发布的专业智能体，付积分提交咨询任务。智能体主人审核后自动处理，完成后可查看结果、留言沟通、申请修订和评分。</div>
                  <div class="guide-illust">
                    <div class="guide-illust-bar"><span style="width:8px;height:8px;border-radius:50%;background:#ec4899;"></span> 咨询流程</div>
                    <div class="guide-illust-body">
                      <div class="guide-consult-flow">
                        <div class="guide-consult-step"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> 浏览广场</div>
                        <span class="guide-consult-arrow">→</span>
                        <div class="guide-consult-step"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> 提交任务</div>
                        <span class="guide-consult-arrow">→</span>
                        <div class="guide-consult-step"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg> 主人审核</div>
                        <span class="guide-consult-arrow">→</span>
                        <div class="guide-consult-step"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> AI处理</div>
                        <span class="guide-consult-arrow">→</span>
                        <div class="guide-consult-step"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ec4899" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> 查看结果</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 7. 消息中心 -->
                <div class="qs-section" style="padding:0 0 20px;">
                  <div class="qs-section-title"><span class="qs-section-num">7</span> 消息中心</div>
                  <div class="qs-section-desc">右上角 🔔 消息中心实时推送任务通知、留言提醒、技能更新等。点击通知可直接跳转到对应功能页面：出租任务通知 → 任务处理面板，咨询通知 → 咨询详情页。</div>
                  <div class="guide-illust">
                    <div class="guide-illust-bar"><span style="width:8px;height:8px;border-radius:50%;background:#ef4444;"></span> 消息通知</div>
                    <div class="guide-illust-body">
                      <div class="guide-notif-item">
                        <span class="guide-notif-icon">📋</span>
                        <div><div class="guide-notif-text">您收到新的咨询任务：增值税进项税额转出问题</div><div class="guide-notif-hint">点击处理任务</div></div>
                        <span class="guide-notif-time">2分钟前</span>
                      </div>
                      <div class="guide-notif-item">
                        <span class="guide-notif-icon">✅</span>
                        <div><div class="guide-notif-text">您的咨询"个税专项扣除"已完成，快去查看结果吧</div><div class="guide-notif-hint">点击查看详情</div></div>
                        <span class="guide-notif-time">10分钟前</span>
                      </div>
                      <div class="guide-notif-item">
                        <span class="guide-notif-icon">💬</span>
                        <div><div class="guide-notif-text">智能体给你发了新留言</div><div class="guide-notif-hint">点击查看详情</div></div>
                        <span class="guide-notif-time">1小时前</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 8. 收藏 -->
                <div class="qs-section" style="padding:0 0 20px;">
                  <div class="qs-section-title"><span class="qs-section-num">8</span> 收藏与搜索</div>
                  <div class="qs-section-desc">对话中点击 ⭐ 收藏重要回复。收藏面板汇聚所有对话中的收藏内容，点击可跳转到对应对话。还可使用搜索功能（Ctrl+F）在当前对话中查找消息。</div>
                  <div class="guide-illust">
                    <div class="guide-illust-bar"><span style="width:8px;height:8px;border-radius:50%;background:#f59e0b;"></span> 收藏夹</div>
                    <div class="guide-illust-body">
                      <div class="guide-fav-item">
                        <span class="guide-fav-star">⭐</span>
                        <div class="guide-fav-text">增值税进项税额转出的 5 种常见情形及处理方法...</div>
                      </div>
                      <div class="guide-fav-item">
                        <span class="guide-fav-star">⭐</span>
                        <div style="flex:1;">
                          <div class="guide-fav-text">企业所得税汇算清缴 A105000 表填报要点...</div>
                          <span class="guide-fav-tag">企业所得税筹划方案</span>
                        </div>
                      </div>
                      <div class="guide-fav-item">
                        <span class="guide-fav-star">⭐</span>
                        <div class="guide-fav-text">个税年终奖单独计税 vs 并入综合所得对比分析...</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="qs-tips-grid" style="padding:0 0 20px;">
                  <div class="qs-tip-card" style="background:#f0f9ff;"><b style="color:#1B3A5C;">Skill 自进化</b>从市场安装技能，或自己创建并分享给社区。</div>
                  <div class="qs-tip-card" style="background:#fefce8;"><b style="color:#a16207;">Agent 自进化</b>智能体在完成任务中积累记忆，能力持续成长。</div>
                  <div class="qs-tip-card" style="background:#f0fdf4;"><b style="color:#15803d;">出租赚积分</b>发布智能体到广场，被使用时自动赚取积分收益。</div>
                  <div class="qs-tip-card" style="background:#fdf2f8;"><b style="color:#be185d;">知识库自学习</b>授权文件夹后新文件自动学习，越用越懂你。</div>
                </div>
              </div>
            </div>
          </div>
        `:""}
        ${t.sidePanel==="consult"?r`
          <div class="side-panel-view consult-view" style="display:flex;flex-direction:column;overflow:hidden;">
            <div class="side-panel-header">
              <span class="panel-title"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px;"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> ${t.consultView==="list"?"AI专家咨询（专业智能体）":t.consultView==="detail"?"智能体详情":t.consultView==="my-tasks"?"我的咨询":"咨询详情"}</span>
              <div style="display:flex;gap:6px;align-items:center;">
                ${t.consultView==="list"?r`
                  <button class="consult-mytasks-btn" @click=${()=>{es()}} title="我的咨询">
                    📋 我的咨询${t.consultUnreadCount>0?r`<span class="consult-unread-badge" style="margin-left:4px;">${t.consultUnreadCount}</span>`:""}
                  </button>
                `:""}
                <button class="side-panel-close" @click=${()=>{t.sidePanel=null,v()}} title="关闭">✕</button>
              </div>
            </div>
            <div style="flex:1;overflow-y:auto;padding:16px;">
              ${t.consultView==="list"?r`
                <!-- Flow introduction -->
                <div class="consult-flow">
                  <div class="consult-flow-step">
                    <div class="consult-flow-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>
                    <div class="consult-flow-label">选择智能体</div>
                  </div>
                  <div class="consult-flow-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></div>
                  <div class="consult-flow-step">
                    <div class="consult-flow-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></div>
                    <div class="consult-flow-label">发布任务</div>
                  </div>
                  <div class="consult-flow-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></div>
                  <div class="consult-flow-step">
                    <div class="consult-flow-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/></svg></div>
                    <div class="consult-flow-label">智能体处理</div>
                  </div>
                  <div class="consult-flow-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></div>
                  <div class="consult-flow-step">
                    <div class="consult-flow-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg></div>
                    <div class="consult-flow-label">主人审核确认</div>
                  </div>
                  <div class="consult-flow-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></div>
                  <div class="consult-flow-step">
                    <div class="consult-flow-icon consult-flow-icon--done"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
                    <div class="consult-flow-label">获得结果</div>
                  </div>
                </div>
                <div class="consult-info-row">
                  <div class="consult-info-box">
                    <div class="consult-info-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg></div>
                    <div>
                      <div class="consult-info-title">为什么需要智能体主人审核？</div>
                      <div class="consult-info-desc">财税领域专业性强，AI 生成的结果仍需专业人员把关确认，确保每一份交付都准确可靠。</div>
                    </div>
                  </div>
                  <div class="consult-info-box consult-info-box--stats">
                    <div class="consult-info-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
                    <div>
                      <div class="consult-info-title">平均完成时间</div>
                      <div class="consult-info-desc">${t.consultAvgTime||"加载中..."}</div>
                    </div>
                  </div>
                </div>
                <!-- Search bar -->
                <div class="consult-search-bar">
                  <input type="text" placeholder="搜索智能体..." .value=${t.consultSearch}
                    @input=${s=>{t.consultSearch=s.target.value}}
                    @keydown=${s=>{s.key==="Enter"&&Mt()}}
                  />
                  <button @click=${()=>Mt()}>搜索</button>
                </div>
                ${t.consultLoading?r`<div class="consult-loading">加载中...</div>`:""}
                ${!t.consultLoading&&t.consultAgents.length===0?r`<div class="consult-empty">暂无在线智能体</div>`:""}
                <div class="consult-agent-grid">
                  ${t.consultAgents.map(s=>r`
                    <div class="consult-agent-card" @click=${()=>Xa(s)}>
                      <div class="consult-agent-card-top">
                        <div class="consult-agent-avatar">
                          ${z(s.avatarUrl)?r`<img src="${z(s.avatarUrl)}" alt="" @error=${l=>{l.target.style.display="none",l.target.parentElement.insertAdjacentHTML("beforeend",`<span>${s.emoji||"🤖"}</span>`)}} />`:r`<span>${s.emoji||"🤖"}</span>`}
                        </div>
                        <div class="consult-agent-header">
                          <div class="consult-agent-name">${s.name}</div>
                          <div class="consult-agent-owner">by ${s.owner?.name||"匿名"}</div>
                        </div>
                      </div>
                      <div class="consult-agent-desc">${s.description}</div>
                      <div class="consult-agent-footer">
                        <div class="consult-agent-stats">
                          ${s.avgRating>0?r`<span class="consult-agent-rating">★ ${s.avgRating.toFixed(1)}</span>`:""}
                          ${s.completedTasks>0?r`<span class="consult-agent-tasks">${s.completedTasks} 完成</span>`:""}
                        </div>
                        <div class="consult-agent-price">💰 ${s.price} 积分</div>
                      </div>
                    </div>
                  `)}
                </div>
              `:t.consultView==="detail"&&t.consultSelectedAgent?r`
                <!-- Agent detail + task form -->
                <button class="consult-back-btn" @click=${()=>Za()}>← 返回列表</button>
                <div class="consult-detail-header">
                  <div class="consult-detail-avatar">
                    ${z(t.consultSelectedAgent.avatarUrl)?r`<img src="${z(t.consultSelectedAgent.avatarUrl)}" alt="" @error=${s=>{s.target.style.display="none",s.target.parentElement.insertAdjacentHTML("beforeend",`<span>${t.consultSelectedAgent.emoji||"🤖"}</span>`)}} />`:r`<span>${t.consultSelectedAgent.emoji||"🤖"}</span>`}
                  </div>
                  <div>
                    <div class="consult-detail-name">${t.consultSelectedAgent.name}</div>
                    <div class="consult-detail-owner">by ${t.consultSelectedAgent.owner.name}</div>
                  </div>
                </div>
                <div class="consult-detail-desc">${t.consultSelectedAgent.description}</div>
                <div class="consult-detail-stats">
                  <span>💰 ${t.consultSelectedAgent.price} 积分/次</span>
                  ${t.consultSelectedAgent.avgRating>0?r`<span>⭐ ${t.consultSelectedAgent.avgRating.toFixed(1)}</span>`:""}
                  <span>✅ 已完成 ${t.consultSelectedAgent.completedTasks} 单</span>
                </div>
                ${t.taxstoreToken?r`
                  <div class="consult-form">
                    <h4>提交咨询任务</h4>
                    <div class="consult-field">
                      <label>任务标题</label>
                      <input type="text" placeholder="请简要描述您的需求" .value=${t.consultTaskTitle}
                        @input=${s=>{t.consultTaskTitle=s.target.value,d()}} />
                    </div>
                    <div class="consult-field">
                      <label>详细描述</label>
                      <textarea placeholder="请详细描述您的需求，越详细越好..." .value=${t.consultTaskContent}
                        @input=${s=>{t.consultTaskContent=s.target.value,d()}}></textarea>
                    </div>
                    <div class="consult-field">
                      <label>附件（可选）</label>
                      <div class="consult-attachments">
                        ${t.consultAttachments.map((s,l)=>r`
                          <div class="consult-att-item">
                            <span class="consult-att-icon">${s.type?.startsWith("image/")?"🖼️":"📎"}</span>
                            <span class="consult-att-name" title=${s.name}>${s.name}</span>
                            <span class="consult-att-size">${oe(s.size)}</span>
                            <button class="consult-att-remove" @click=${()=>oi(l)} title="移除">✕</button>
                          </div>
                        `)}
                        ${t.consultUploading?r`<div class="consult-att-uploading">⏳ 上传中...</div>`:""}
                        <label class="consult-att-add-btn">
                          📎 添加附件
                          <input type="file" style="display:none" @change=${s=>{const l=s.target.files?.[0];l&&ii(l),s.target.value=""}} />
                        </label>
                      </div>
                    </div>
                    <div class="consult-form-footer">
                      <span class="consult-form-price">需支付 ${t.consultSelectedAgent.price} 积分</span>
                      <button class="consult-submit-btn" @click=${()=>li()} ?disabled=${t.consultSubmitting||!t.consultTaskTitle.trim()||!t.consultTaskContent.trim()}>
                        ${t.consultSubmitting?"提交中...":"提交任务"}
                      </button>
                    </div>
                  </div>
                `:r`
                  <div class="consult-login-hint">请先在设置中登录 TaxStore 账户后再提交任务</div>
                `}
              `:t.consultView==="my-tasks"?r`
                <!-- My tasks list -->
                <button class="consult-back-btn" @click=${()=>{t.consultView="list",d()}}>← 返回广场</button>
                ${t.consultMyTasks.length===0?r`<div class="consult-empty">暂无咨询记录</div>`:""}
                <div class="consult-tasks-list">
                  ${t.consultMyTasks.map(s=>r`
                    <div class="consult-task-item consult-task-item--${s.status}" @click=${()=>ae(s)}>
                      <div class="consult-task-item-icon">
                        ${z(s.listing?.avatarUrl)?r`<img src="${z(s.listing?.avatarUrl)}" alt="" @error=${l=>{l.target.style.display="none",l.target.parentElement.insertAdjacentHTML("beforeend",`<span>${s.listing?.emoji||"🤖"}</span>`)}} />`:r`<span>${s.listing?.emoji||"🤖"}</span>`}
                      </div>
                      <div class="consult-task-item-body">
                        <div class="consult-task-item-title">${s.title}</div>
                        <div class="consult-task-item-meta">
                          ${s.listing?.name||"智能体"} · ${s.status==="pending"?"等待处理":s.status==="processing"?"处理中":s.status==="completed"?"已完成":s.status==="revision_requested"?"修订中":s.status}
                          · ${new Date(s.createdAt).toLocaleDateString("zh-CN")}
                        </div>
                      </div>
                      <div class="consult-task-item-right">
                        ${(s.unreadMessageCount||0)>0?r`<span class="consult-task-msg-badge">💬 ${s.unreadMessageCount}</span>`:""}
                        <div class="consult-task-item-price">💰 ${s.price}</div>
                        ${s.status==="completed"?r`<div class="consult-task-item-status consult-task-item-status--done">已完成</div>`:s.status==="pending"?r`<div class="consult-task-item-status consult-task-item-status--pending">等待中</div>`:r`<div class="consult-task-item-status consult-task-item-status--processing">处理中</div>`}
                      </div>
                    </div>
                  `)}
                </div>
              `:t.consultView==="task-detail"&&t.consultSelectedTask?r`
                <!-- Task detail -->
                <button class="consult-back-btn" @click=${()=>ti()}>← 返回列表</button>
                <div class="consult-task-detail">
                  <div class="consult-task-detail-header">
                    <span class="consult-task-detail-emoji">${z(t.consultSelectedTask.listing?.avatarUrl)?r`<img src="${z(t.consultSelectedTask.listing?.avatarUrl)}" alt="" style="width:32px;height:32px;border-radius:8px;object-fit:cover;" @error=${s=>{s.target.replaceWith(document.createTextNode(t.consultSelectedTask.listing?.emoji||"🤖"))}} />`:t.consultSelectedTask.listing?.emoji||"🤖"}</span>
                    <div>
                      <div class="consult-task-detail-title">${t.consultSelectedTask.title}</div>
                      <div class="consult-task-detail-meta">
                        ${t.consultSelectedTask.listing?.name||"智能体"} · 提交于 ${new Date(t.consultSelectedTask.createdAt).toLocaleString("zh-CN")}
                        ${t.consultSelectedTask.completedAt?r` · 完成于 ${new Date(t.consultSelectedTask.completedAt).toLocaleString("zh-CN")}`:""}
                      </div>
                    </div>
                  </div>
                  <div class="consult-task-detail-section">
                    <div class="consult-task-detail-label">我的描述</div>
                    <div class="consult-task-detail-content">${t.consultSelectedTask.content}</div>
                  </div>
                  ${yt(t.consultSelectedTask.attachments).length>0?r`
                    <div class="consult-task-detail-section">
                      <div class="consult-task-detail-label">我的附件</div>
                      <div class="consult-att-list">
                        ${yt(t.consultSelectedTask.attachments).map(s=>r`
                          <a class="consult-att-link" href=${wt(s.url)} target="_blank">
                            ${s.type?.startsWith("image/")?r`<img class="consult-att-thumb" src=${wt(s.url)} alt=${s.name} />`:r`<span class="consult-att-file-icon">📎</span>`}
                            <span class="consult-att-link-name">${s.name}</span>
                            <span class="consult-att-link-size">${oe(s.size)}</span>
                          </a>
                        `)}
                      </div>
                    </div>
                  `:""}
                  ${t.consultSelectedTask.result?r`
                    <div class="consult-task-detail-section">
                      <div class="consult-task-detail-label">处理结果</div>
                      <div class="consult-task-detail-result">${t.consultSelectedTask.result}</div>
                    </div>
                    ${yt(t.consultSelectedTask.resultAttachments).length>0?r`
                      <div class="consult-task-detail-section">
                        <div class="consult-task-detail-label">结果附件</div>
                        <div class="consult-att-list">
                          ${yt(t.consultSelectedTask.resultAttachments).map(s=>r`
                            <a class="consult-att-link" href=${wt(s.url)} target="_blank">
                              ${s.type?.startsWith("image/")?r`<img class="consult-att-thumb" src=${wt(s.url)} alt=${s.name} />`:r`<span class="consult-att-file-icon">📎</span>`}
                              <span class="consult-att-link-name">${s.name}</span>
                              <span class="consult-att-link-size">${oe(s.size)}</span>
                            </a>
                          `)}
                        </div>
                      </div>
                    `:""}
                  `:r`
                    <div class="consult-task-detail-section">
                      <div class="consult-task-detail-waiting">
                        ${t.consultSelectedTask.status==="pending"?"⏳ 等待智能体主人接单处理...":t.consultSelectedTask.status==="processing"?"🔄 智能体正在处理中...":t.consultSelectedTask.status==="revision_requested"?"📝 已请求修订，等待处理...":"等待处理..."}
                      </div>
                    </div>
                  `}

                  <!-- Action buttons row -->
                  <div class="consult-td-actions">
                    <button class="consult-td-action-btn" @click=${()=>ei()}>
                      💬 留言沟通${(t.consultSelectedTask.unreadMessageCount||0)>0?r`<span class="consult-unread-badge" style="margin-left:4px;">${t.consultSelectedTask.unreadMessageCount}</span>`:""}
                    </button>
                    ${t.consultSelectedTask.status==="completed"&&!t.consultSelectedTask.rating&&(t.consultSelectedTask.revisionCount||0)<3?r`
                      <button class="consult-td-action-btn consult-td-action-btn--revision" @click=${()=>ns()}>
                        🔄 请求修订${t.consultSelectedTask.revisionCount?r` (${t.consultSelectedTask.revisionCount}/3)`:""}
                      </button>
                    `:""}
                    ${t.consultSelectedTask.status==="completed"&&!t.consultSelectedTask.rating?r`
                      <button class="consult-td-action-btn consult-td-action-btn--rating" @click=${()=>as()}>
                        ⭐ 给个评价
                      </button>
                    `:""}
                  </div>

                  <!-- Rating display (if already rated) -->
                  ${t.consultSelectedTask.rating?r`
                    <div class="consult-td-rated">
                      <div class="consult-td-rated-stars">${"★".repeat(t.consultSelectedTask.rating)}${"☆".repeat(5-t.consultSelectedTask.rating)}</div>
                      ${t.consultSelectedTask.ratingComment?r`<div class="consult-td-rated-comment">${t.consultSelectedTask.ratingComment}</div>`:""}
                    </div>
                  `:""}

                  <!-- Rating panel -->
                  ${t.consultRatingOpen?r`
                    <div class="consult-td-panel">
                      <div class="consult-td-panel-title">评价服务</div>
                      <div class="consult-td-stars">
                        ${[1,2,3,4,5].map(s=>r`
                          <span class="consult-td-star ${s<=(t.consultRatingHover||t.consultRatingValue)?"consult-td-star--active":""}"
                            @click=${()=>{t.consultRatingValue=s,d()}}
                            @mouseenter=${()=>{t.consultRatingHover=s,d()}}
                            @mouseleave=${()=>{t.consultRatingHover=0,d()}}>★</span>
                        `)}
                        <span class="consult-td-star-label">${t.consultRatingValue===1?"很差":t.consultRatingValue===2?"较差":t.consultRatingValue===3?"一般":t.consultRatingValue===4?"满意":t.consultRatingValue===5?"非常满意":""}</span>
                      </div>
                      <textarea class="consult-td-input" placeholder="写点评价吧（可选）" rows="2"
                        .value=${t.consultRatingComment}
                        @input=${s=>{t.consultRatingComment=s.target.value,d()}}></textarea>
                      <div class="consult-td-panel-actions">
                        <button class="consult-td-btn-cancel" @click=${()=>as()}>取消</button>
                        <button class="consult-td-btn-submit" @click=${()=>ai()} ?disabled=${t.consultRatingSubmitting||t.consultRatingValue<1}>
                          ${t.consultRatingSubmitting?"提交中...":"提交评价"}
                        </button>
                      </div>
                    </div>
                  `:""}

                  <!-- Revision panel -->
                  ${t.consultRevisionOpen?r`
                    <div class="consult-td-panel">
                      <div class="consult-td-panel-title">请求修订</div>
                      <div class="consult-td-panel-hint">请描述需要修改的内容，智能体主人会重新处理（最多 3 次修订）</div>
                      <textarea class="consult-td-input" placeholder="请说明需要修改的地方..." rows="3"
                        .value=${t.consultRevisionText}
                        @input=${s=>{t.consultRevisionText=s.target.value,d()}}></textarea>
                      <div class="consult-td-panel-actions">
                        <button class="consult-td-btn-cancel" @click=${()=>ns()}>取消</button>
                        <button class="consult-td-btn-submit" @click=${()=>ni()} ?disabled=${t.consultRevisionSubmitting||!t.consultRevisionText.trim()}>
                          ${t.consultRevisionSubmitting?"提交中...":"发送修订请求"}
                        </button>
                      </div>
                    </div>
                  `:""}

                  <!-- Messages panel -->
                  ${t.consultMessagesOpen?r`
                    <div class="consult-td-messages">
                      <div class="consult-td-panel-title">留言沟通</div>
                      <div class="consult-td-msg-list">
                        ${t.consultMessages.length===0?r`<div class="consult-td-msg-empty">${t.consultSelectedTask.status==="completed"?"暂无留言记录":"暂无留言，发一条吧"}</div>`:""}
                        ${t.consultMessages.map(s=>r`
                          <div class="consult-td-msg ${s.sender.id===t.taxstoreUser?.id?"consult-td-msg--mine":"consult-td-msg--theirs"}">
                            <div class="consult-td-msg-sender">${s.sender.name}</div>
                            <div class="consult-td-msg-bubble">${s.content}</div>
                            <div class="consult-td-msg-time">${new Date(s.createdAt).toLocaleString("zh-CN")}</div>
                          </div>
                        `)}
                      </div>
                      ${t.consultSelectedTask.status!=="completed"?r`
                        <div class="consult-td-msg-input-row">
                          <input type="text" class="consult-td-msg-input" placeholder="输入留言..."
                            .value=${t.consultMessageInput}
                            @input=${s=>{t.consultMessageInput=s.target.value,d()}}
                            @keydown=${s=>{s.key==="Enter"&&!s.shiftKey&&(s.preventDefault(),ss())}} />
                          <button class="consult-td-msg-send" @click=${()=>ss()} ?disabled=${t.consultMessagesSending||!t.consultMessageInput.trim()}>
                            ${t.consultMessagesSending?"...":"发送"}
                          </button>
                        </div>
                      `:r`<div class="consult-td-msg-closed">任务已完成，留言已关闭</div>`}
                    </div>
                  `:""}

                  <div class="consult-task-detail-footer">
                    <span>💰 ${t.consultSelectedTask.price} 积分</span>
                    <span class="consult-task-detail-status consult-task-detail-status--${t.consultSelectedTask.status}">
                      ${t.consultSelectedTask.status==="completed"?"✅ 已完成":t.consultSelectedTask.status==="pending"?"⏳ 等待中":t.consultSelectedTask.status==="revision_requested"?"📝 修订中":"🔄 处理中"}
                    </span>
                  </div>
                </div>
              `:""}
            </div>
          </div>
        `:""}
        </div><!-- /side-panel -->

        <div class="taxchat-main">
          ${t.searchOpen?r`
            <div class="search-bar">
              <input
                id="taxchat-search-input"
                type="text"
                placeholder="搜索消息..."
                .value=${t.searchQuery}
                @input=${s=>ba(s.target.value)}
                @keydown=${s=>{s.key==="Escape"?Ge():s.key==="Enter"&&(s.shiftKey?Ye():Je())}}
              />
              <span class="search-count">
                ${t.searchResults.length>0?`${t.searchIndex+1}/${t.searchResults.length}`:t.searchQuery?"无结果":""}
              </span>
              <button class="search-nav-btn" @click=${Ye} title="上一个">▲</button>
              <button class="search-nav-btn" @click=${Je} title="下一个">▼</button>
              <button class="search-close-btn" @click=${Ge} title="关闭">✕</button>
            </div>
          `:""}
          <div class="taxchat-messages" id="messages-container">
            ${bi()}
          </div>

      <div class="taxchat-input-area">
        <div class="taxchat-quick-actions">
          <button
            class="quick-action-btn"
            ?disabled=${!1}
            @click=${()=>L("tax-risk","请按照税务风险治理流程，分析我上传的文件内容，识别税务风险点，给出风险分析、说明函、应对话术和操作建议。请直接分析文件内容，不要调用任何工具或命令。","税务风险治理")}
            title="上传税务风险文件，自动分析并生成说明函"
          >
            <span class="qa-icon">🧾</span>
            <span>税务风险治理</span>
          </button>
          <button
            class="quick-action-btn"
            ?disabled=${!1}
            @click=${()=>L("tax-review","请按照纳税申报表预审流程，分析我上传的纳税申报表和财务报表，比对两个表格的数据差异，以表格形式输出比对结果，并分析税务风险给出处理建议。请直接分析文件内容，不要调用任何工具或命令。","纳税申报表预审")}
            title="上传纳税申报表和财务报表，自动比对分析"
          >
            <span class="qa-icon">📊</span>
            <span>申报表预审</span>
          </button>
          <button
            class="quick-action-btn"
            ?disabled=${!1}
            @click=${()=>L("contract-tax","请按照票据合同税务审核流程，从税务角度分析我上传的合同或票据，列支涉及的税目并计算相关税额，给出风险提示和修改建议。请直接分析文件内容，不要调用任何工具或命令。","合同税务审核")}
            title="上传合同或票据，从税务角度审核分析"
          >
            <span class="qa-icon">📝</span>
            <span>合同及票据税审</span>
          </button>
          <button
            class="quick-action-btn"
            ?disabled=${!1}
            @click=${()=>L("invoice-check",R[3].prompt,"发票查验")}
            title="上传发票图片/PDF/XML，查验发票真伪并分析风险"
          >
            <span class="qa-icon">🔍</span>
            <span>发票查验</span>
          </button>
          <button
            class="quick-action-btn"
            ?disabled=${!1}
            @click=${()=>L("receipt-organizer",R[4].prompt,"票据整理",!0)}
            title="扫描文件夹中的票据，按类型分类整理，生成报销单"
          >
            <span class="qa-icon">🧾</span>
            <span>票据整理</span>
          </button>
          <button
            class="quick-action-btn"
            ?disabled=${!1}
            @click=${()=>{if(!t.authorizedFolder){k("请先在知识库面板中选择文件夹"),t.sidePanel="knowledge",v();return}tt(R[5])}}
            title="在指定文件夹中检索文件、提取摘要、搜索内容"
          >
            <span class="qa-icon">📚</span>
            <span>知识库</span>
          </button>
          <button
            class="quick-action-btn"
            ?disabled=${!1}
            @click=${()=>{const s=document.createElement("input");s.type="file",s.accept="image/*,.pdf,.doc,.docx,.xls,.xlsx",s.multiple=!0,s.onchange=()=>{s.files&&s.files.length>0&&At(s.files)},s.click()}}
            title="上传图片或文件"
          >
            <span class="qa-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg></span>
            <span>上传文件</span>
          </button>
          ${t.customSkills.filter(s=>s.pinned).sort((s,l)=>s.createdAt-l.createdAt).map(s=>r`
            <button
              class="quick-action-btn custom"
              ?disabled=${!1}
              @click=${()=>tt(s)}
              title=${s.description||s.name}
            >
              <span class="qa-icon">${s.emoji}</span>
              <span>${s.name}</span>
            </button>
          `)}
        </div>

        <div class="taxchat-input-container"
          @dragover=${s=>{s.preventDefault(),s.stopPropagation(),t.dragOver=!0,v()}}
          @dragleave=${s=>{s.preventDefault(),s.stopPropagation(),t.dragOver=!1,v()}}
          @drop=${s=>{s.preventDefault(),s.stopPropagation(),t.dragOver=!1,console.log("Drop event, files:",s.dataTransfer?.files?.length),s.dataTransfer?.files&&At(s.dataTransfer.files)}}
          class=${t.dragOver?"taxchat-input-container drag-over":"taxchat-input-container"}
        >
          ${t.activeCustomSkill?r`
            <div class="skill-prompt-bubble">
              <span class="skill-prompt-bubble__emoji">${t.activeCustomSkill.emoji}</span>
              <span class="skill-prompt-bubble__text">${t.activeCustomSkill.name}${t.activeCustomSkill.description?` · ${t.activeCustomSkill.description}`:""}</span>
              <button class="skill-prompt-bubble__close" @click=${()=>Bn()} title="取消技能">✕</button>
            </div>
          `:""}
          ${t.mentionDropdownVisible?r`
            <div class="agent-mention-dropdown">
              ${Zt().map((s,l)=>r`
                  <div class="agent-mention-item ${l===t.mentionIndex?"agent-mention-item--active":""}" @mousedown=${c=>{c.preventDefault(),te(s)}} @mouseenter=${()=>{t.mentionIndex=l,v()}}>
                    <span class="agent-mention-emoji">${s.avatarUrl?r`<img src="${s.avatarUrl}" class="agent-avatar-img-sm" />`:s.emoji}</span>
                    <span class="agent-mention-name">${s.name}</span>
                    ${s.description?r`<span class="agent-mention-desc">${s.description}</span>`:""}
                  </div>
                `)}
              ${Zt().length===0?r`<div class="agent-mention-empty">未找到匹配的智能体</div>`:""}
            </div>
          `:""}
          ${t.commandPaletteVisible?r`
            <div class="command-palette">
              ${Ft().map((s,l)=>r`
                <div class="command-item ${l===t.commandIndex?"active":""}"
                  @mousedown=${c=>{c.preventDefault(),zt(),t.draft="",s.action(),d()}}
                  @mouseenter=${()=>{t.commandIndex=l,d()}}>
                  <span class="command-emoji">${s.emoji}</span>
                  <div class="command-info">
                    <div class="command-name">${s.name}</div>
                    <div class="command-desc">${s.description}</div>
                  </div>
                </div>
              `)}
              ${Ft().length===0?r`<div class="command-item"><span class="command-desc">无匹配指令</span></div>`:""}
            </div>
          `:""}
          ${t.replyingTo?r`
            <div class="reply-bar">
              <div class="reply-bar__content">
                <div class="reply-bar__label">回复 ${t.replyingTo.type==="user"?"我":t.replyingTo.agentName||"Taxbot"}</div>
                <div class="reply-bar__text">${t.replyingTo.text.length>60?t.replyingTo.text.slice(0,60)+"...":t.replyingTo.text}</div>
              </div>
              <button class="reply-bar__close" @click=${()=>{t.replyingTo=null,v()}}>✕</button>
            </div>
          `:""}
          <textarea
            id="message-input"
            class="taxchat-input"
            rows="1"
            placeholder=${t.activeCustomSkill?`请输入内容，将按「${t.activeCustomSkill.name}」流程处理...`:"输入您的税务问题...或拖入/粘贴文件"}
            .value=${t.draft}
            @input=${s=>{const l=s.target;if(t.draft=l.value,l.style.height="auto",l.style.height=l.scrollHeight+"px",ma())return;const c=t.draft.match(/@(\S*)$/);if(c&&t.agentsList.length>0){const u=t.mentionFilter;t.mentionDropdownVisible=!0,t.mentionFilter=c[1].toLowerCase(),t.mentionFilter!==u&&(t.mentionIndex=0)}else t.mentionDropdownVisible=!1,t.mentionFilter="",t.mentionIndex=0;v()}}
            @keydown=${s=>{if(t.commandPaletteVisible){if(s.key==="ArrowDown"){s.preventDefault(),We("down");return}if(s.key==="ArrowUp"){s.preventDefault(),We("up");return}if(s.key==="Enter"&&!s.isComposing){s.preventDefault(),fa();return}if(s.key==="Escape"){s.preventDefault(),zt();return}}if(t.mentionDropdownVisible){const l=Zt();if(s.key==="ArrowDown"){s.preventDefault(),t.mentionIndex=l.length?(t.mentionIndex+1)%l.length:0,v(),requestAnimationFrame(()=>{document.querySelector(".agent-mention-item--active")?.scrollIntoView({block:"nearest"})});return}if(s.key==="ArrowUp"){s.preventDefault(),t.mentionIndex=l.length?(t.mentionIndex-1+l.length)%l.length:0,v(),requestAnimationFrame(()=>{document.querySelector(".agent-mention-item--active")?.scrollIntoView({block:"nearest"})});return}if(s.key==="Enter"&&!s.isComposing){s.preventDefault(),l.length>0&&t.mentionIndex<l.length&&te(l[t.mentionIndex]);return}if(s.key==="Escape"){s.preventDefault(),t.mentionDropdownVisible=!1,t.mentionIndex=0,v();return}}s.key==="Enter"&&!s.ctrlKey&&!s.shiftKey&&!s.isComposing&&(s.preventDefault(),Ut())}}
            @paste=${s=>{console.log("Paste event, files:",s.clipboardData?.files?.length),s.clipboardData?.files&&s.clipboardData.files.length>0&&(s.preventDefault(),At(s.clipboardData.files))}}
            ?disabled=${!1}
            rows="1"
          ></textarea>
          <button
            class="taxchat-button primary send-inline"
            ?disabled=${t.draft.trim().length===0&&t.attachments.length===0&&t.knowledgeRefs.length===0}
            @click=${Ut}
            title="发送消息 (Enter)"
          >
            <span class="button-icon">➤</span>
          </button>

          ${t.dragOver?r`
            <div class="drag-overlay">
              <div class="drag-text">📁 拖入文件即可上传</div>
            </div>
          `:""}
        </div>

        ${t.attachments.length>0?r`
          <div class="attachments-list">
            ${t.attachments.map((s,l)=>r`
              <div class="attachment-item">
                <span class="attachment-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg></span>
                <span class="attachment-name" title=${s.name}>${s.name}</span>
                <span class="attachment-size">${Yt(s.size)}</span>
                <button
                  class="attachment-remove"
                  @click=${()=>kn(l)}
                  title="移除"
                >
                  ✕
                </button>
              </div>
            `)}
          </div>
        `:""}

        ${t.knowledgeRefs.length>0?r`
          <div class="knowledge-refs-list">
            ${t.knowledgeRefs.map((s,l)=>r`
              <div class="knowledge-ref-item">
                <span class="kr-icon">📚</span>
                <span class="kr-name" title=${s.name}>${s.name}</span>
                <button class="kr-remove" @click=${()=>Kn(l)} title="移除引用">✕</button>
              </div>
            `)}
          </div>
        `:""}
      </div>

        </div><!-- /taxchat-main -->
      </div><!-- /taxchat-body -->


      ${t.showQuickStart?ki():""}

      ${t.editingSkill?r`
        <div class="skill-editor-overlay" @click=${()=>{t.editingSkill=null,v()}}>
          <div class="skill-editor" @click=${s=>s.stopPropagation()}>
            <h3>${t.customSkills.some(s=>s.id===t.editingSkill.id)?"编辑 Skill":"新建 Skill"}</h3>
            <label>名称 *</label>
            <input type="text" .value=${O(t.editingSkill.name)} @input=${s=>{t.editingSkill.name=s.target.value}} placeholder="例：增值税计算助手" />
            <label>图标</label>
            <input type="text" .value=${O(t.editingSkill.emoji)} @input=${s=>{t.editingSkill.emoji=s.target.value}} placeholder="🤖" style="width: 60px;" />
            <label>描述</label>
            <textarea .value=${O(t.editingSkill.description)} @input=${s=>{t.editingSkill.description=s.target.value}} placeholder="描述这个技能的用途和使用场景，例如：当用户提到增值税计算、税率查询时使用此技能" style="min-height: 60px;"></textarea>
            <label>操作流程 *</label>
            <textarea .value=${O(t.editingSkill.prompt)} @input=${s=>{t.editingSkill.prompt=s.target.value}} placeholder="请详细描述技能的操作流程（自然语言）。例如：分析用户上传的文件，从增值税角度列出所有涉税项目，计算应纳税额..."></textarea>
            <div class="skill-editor__actions">
              <button class="skill-editor__cancel" @click=${()=>{t.editingSkill=null,v()}}>取消</button>
              <button class="skill-editor__save" @click=${()=>{if(!t.editingSkill?.name.trim()){alert("请填写名称");return}if(!t.editingSkill?.prompt.trim()){alert("请填写操作流程");return}jn()}}>保存技能</button>
            </div>
          </div>
        </div>
      `:""}

      ${t.creatingAgent?r`
        <div class="agent-editor-overlay" @click=${()=>{t.creatingAgent=!1,t.editingAgentId=null,v()}}>
          <div class="agent-editor" @click=${s=>s.stopPropagation()}>
            <h3>${t.editingAgentId?"编辑智能体":"新建智能体"}</h3>
            <div class="agent-editor-avatar-row">
              <div class="agent-editor-avatar-preview" @click=${()=>{const s=document.createElement("input");s.type="file",s.accept="image/*",s.onchange=()=>{if(!s.files?.[0])return;const l=s.files[0];if(l.size>512*1024){k("图片不能超过 512KB");return}const c=new FileReader;c.onload=()=>{t.agentCreateDraft.avatarDataUrl=c.result,v()},c.readAsDataURL(l)},s.click()}} title="点击上传头像图片">
                ${t.agentCreateDraft.avatarDataUrl?r`<img src="${t.agentCreateDraft.avatarDataUrl}" class="agent-avatar-preview-img" />`:r`<span>${t.agentCreateDraft.emoji||"🤖"}</span>`}
                <div class="agent-avatar-upload-hint">上传</div>
              </div>
              <div class="agent-editor-avatar-input">
                <label>Emoji（无图片时显示）</label>
                <input type="text" maxlength="4" .value=${O(t.agentCreateDraft.emoji)} @input=${s=>{t.agentCreateDraft.emoji=s.target.value,v()}} placeholder="🤖" style="width: 60px; font-size: 20px; text-align: center;" />
                ${t.agentCreateDraft.avatarDataUrl?r`<button class="agent-avatar-remove" @click=${()=>{t.agentCreateDraft.avatarDataUrl="",v()}}>移除图片</button>`:""}
              </div>
            </div>
            <label>名称 *</label>
            <input type="text" maxlength="30" .value=${O(t.agentCreateDraft.name)} @input=${s=>{t.agentCreateDraft.name=s.target.value,v()}} placeholder="如：财务助手、合同审查员" />
            <label>描述 <span class="agent-field-hint">对应 SOUL.md — 智能体的性格与行为方式</span></label>
            <textarea .value=${O(t.agentCreateDraft.description)} @input=${s=>{t.agentCreateDraft.description=s.target.value}} placeholder="描述智能体的定位和行为风格。例如：&#10;你是一位资深税务顾问，说话严谨专业，回答问题时会引用具体法规条文。"></textarea>
            <label>身份 <span class="agent-field-hint">对应 IDENTITY.md — 智能体的角色定义</span></label>
            <textarea .value=${O(t.agentCreateDraft.identityDesc)} @input=${s=>{t.agentCreateDraft.identityDesc=s.target.value}} placeholder="定义智能体的身份角色。例如：&#10;税务部门高级顾问，专注增值税和企业所得税领域，拥有10年从业经验。" style="min-height:80px;"></textarea>
            <label>擅长 <span class="agent-field-hint">对应 AGENTS.md — 智能体的技能与工作指南</span></label>
            <textarea .value=${O(t.agentCreateDraft.expertise)} @input=${s=>{t.agentCreateDraft.expertise=s.target.value}} placeholder="列出智能体擅长的任务。例如：&#10;- 合同涉税条款审核&#10;- 增值税税率适用分析&#10;- 跨境税务合规咨询" style="min-height:80px;"></textarea>
            <label>可用技能 <span class="agent-field-hint">对应 TOOLS.md — 勾选智能体可使用的技能</span></label>
            <div class="agent-skills-selector">
              ${[...R,...t.customSkills.filter(s=>!s.id.startsWith("__builtin_"))].map(s=>{const l=(t.agentCreateDraft.selectedSkills||[]).includes(s.id);return r`
                  <label class="agent-skill-option ${l?"selected":""}" @click=${c=>{c.preventDefault();const u=t.agentCreateDraft.selectedSkills||[];t.agentCreateDraft.selectedSkills=l?u.filter(g=>g!==s.id):[...u,s.id],v()}}>
                    <span class="agent-skill-check">${l?"☑":"☐"}</span>
                    <span class="agent-skill-emoji">${s.emoji}</span>
                    <span class="agent-skill-name">${s.name}</span>
                    ${s.description?r`<span class="agent-skill-desc">${s.description}</span>`:""}
                  </label>`})}
              ${R.length===0&&t.customSkills.length===0?r`<div style="color:#9ca3af;font-size:12px;padding:8px;">暂无可用技能</div>`:""}
            </div>
            <div class="agent-editor__actions">
              ${t.editingAgentId?r`
                <button class="agent-editor__memory-btn" @click=${async()=>{const s=await at(t.editingAgentId);t.viewingAgentMemory={agentId:t.editingAgentId,agentName:t.agentCreateDraft.name,content:s},v()}} title="查看/编辑该智能体的记忆">查看记忆</button>
              `:""}
              <button class="agent-editor__cancel" @click=${()=>{t.creatingAgent=!1,t.editingAgentId=null,t.agentCreateDraft={name:"",emoji:"🤖",description:"",identityDesc:"",expertise:"",avatarDataUrl:"",selectedSkills:[]},v()}}>取消</button>
              <button class="agent-editor__save" ?disabled=${t.agentSaving||!t.agentCreateDraft.name.trim()} @click=${()=>{t.editingAgentId?_n():ws()}}>${t.agentSaving?"保存中...":t.editingAgentId?"保存修改":"创建智能体"}</button>
            </div>
          </div>
        </div>
      `:""}

      ${t.viewingAgentMemory?r`
        <div class="agent-editor-overlay" @click=${()=>{t.viewingAgentMemory=null,t.confirmingMemoryClear=!1,v()}}>
          <div class="agent-editor agent-memory-editor" @click=${s=>s.stopPropagation()}>
            <h3>${t.viewingAgentMemory.agentName} — 记忆</h3>
            <p style="font-size:12px;color:#999;margin:0 0 8px;">智能体对话时会参考这些记忆。可手动编辑或清空。</p>
            <textarea class="agent-memory-textarea" .value=${t.viewingAgentMemory.content}
              @input=${s=>{t.viewingAgentMemory&&(t.viewingAgentMemory.content=s.target.value)}}
              placeholder="暂无记忆。智能体对话中点击「记住」按钮可保存回复到此处。"
            ></textarea>
            ${t.confirmingMemoryClear?r`
              <div class="memory-clear-confirm">
                <div class="memory-clear-warn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  <span>清空后，智能体将丢失所有积累的经验和对话记忆，无法恢复。确定清空吗？</span>
                </div>
                <div class="memory-clear-btns">
                  <button class="memory-clear-yes" @click=${()=>{t.viewingAgentMemory&&(de(t.viewingAgentMemory.agentId,""),t.viewingAgentMemory.content="",t.confirmingMemoryClear=!1,k("记忆已清空"),v())}}>确定清空</button>
                  <button class="memory-clear-no" @click=${()=>{t.confirmingMemoryClear=!1,v()}}>取消</button>
                </div>
              </div>
            `:""}
            <div class="agent-editor__actions">
              <button class="agent-editor__cancel" @click=${()=>{t.confirmingMemoryClear=!0,v()}} ?disabled=${!t.viewingAgentMemory.content}>清空记忆</button>
              <button class="agent-editor__save" @click=${()=>{t.viewingAgentMemory&&(de(t.viewingAgentMemory.agentId,t.viewingAgentMemory.content),k("记忆已保存"),t.viewingAgentMemory=null,t.confirmingMemoryClear=!1,v())}}>保存</button>
            </div>
          </div>
        </div>
      `:""}

      ${t.rentalPublishDialog&&t.rentalPublishAgent?r`
        <div class="rental-publish-overlay" @click=${he}>
          <div class="rental-publish-dialog" @click=${s=>s.stopPropagation()}>
            <h3>🏪 发布到智能体市场</h3>
            <div class="rental-publish-agent-preview">
              <div class="rental-publish-agent-emoji">
                ${t.rentalPublishAgent.avatarUrl?r`<img src="${t.rentalPublishAgent.avatarUrl}" />`:t.rentalPublishAgent.emoji}
              </div>
              <div class="rental-publish-agent-info">
                <div class="rental-publish-agent-name">${t.rentalPublishAgent.isDefault?`Taxbot Agent by ${t.taxstoreUser?.name||""}`:t.rentalPublishAgent.name}</div>
                <div class="rental-publish-agent-desc">${t.rentalPublishAgent.description}</div>
              </div>
            </div>
            <div class="rental-field">
              <label>单次任务价格（积分）</label>
              <input type="number" min="1" max="9999" .value=${String(t.rentalPublishDraft.price)}
                @input=${s=>{t.rentalPublishDraft.price=parseInt(s.target.value)||0}} />
              <div class="rental-field-hint">用户下单时将支付此积分，任务完成后积分转给你</div>
            </div>
            <div class="rental-field">
              <label>市场描述</label>
              <textarea .value=${t.rentalPublishDraft.description}
                @input=${s=>{t.rentalPublishDraft.description=s.target.value}}
                placeholder="描述这个智能体能做什么、擅长什么..."></textarea>
              <div class="rental-field-hint">将展示给市场上的其他用户</div>
            </div>
            <div class="rental-field">
              <label>专业标签 <span style="color:#9ca3af;font-weight:normal;">(最多5个)</span></label>
              <div class="rental-tags-grid">
                ${["个税","增值税","企业所得税","印花税","土地增值税","纳税申报","税务筹划","发票管理","税务登记","财务报表","审计","会计核算","成本管理","社保公积金","工商注册","政策咨询"].map(s=>{const l=t.rentalPublishDraft.tags.includes(s);return r`<button type="button" class="rental-tag-chip ${l?"rental-tag-chip--active":""}"
                    @click=${()=>{l?t.rentalPublishDraft.tags=t.rentalPublishDraft.tags.filter(c=>c!==s):t.rentalPublishDraft.tags.length<5&&(t.rentalPublishDraft.tags=[...t.rentalPublishDraft.tags,s]),d()}}>${s}</button>`})}
              </div>
            </div>
            <div class="rental-publish-actions">
              <button class="rental-btn-cancel" @click=${he}>取消</button>
              <button class="rental-btn-publish"
                ?disabled=${!t.rentalPublishDraft.description.trim()||t.rentalPublishDraft.price<1}
                @click=${Wa}>发布 (${t.rentalPublishDraft.price} 积分/次)</button>
            </div>
          </div>
        </div>
      `:""}

      ${t.rentalTaskPanel&&t.rentalActiveTask?r`
        <div class="rental-task-overlay" @click=${be}>
          <div class="rental-task-panel" @click=${s=>s.stopPropagation()}>
            <h3>${t.rentalActiveTask.status==="revision_requested"?"✏️ 处理修订请求":"📋 处理任务"}</h3>
            <div class="rental-task-info">
              <div class="rental-task-title">${t.rentalActiveTask.title}</div>
              <div class="rental-task-meta">
                来自: ${t.rentalActiveTask.client.name} · 智能体: ${t.rentalActiveTask.listing.emoji} ${t.rentalActiveTask.listing.name}
                ${t.rentalActiveTask.revisionCount?r` · <span style="color:#9333ea;">第 ${t.rentalActiveTask.revisionCount+1} 次修订</span>`:""}
              </div>
              ${t.rentalActiveTask.status==="revision_requested"&&t.rentalActiveTask.revisionRequest?r`
                <div style="margin-top:8px;padding:8px 12px;border-radius:8px;background:rgba(147,51,234,0.1);border:1px solid rgba(147,51,234,0.2);">
                  <div style="font-size:12px;color:#9333ea;font-weight:600;margin-bottom:4px;">📝 客户修订要求</div>
                  <div style="font-size:13px;color:#e2e8f0;white-space:pre-wrap;">${t.rentalActiveTask.revisionRequest}</div>
                </div>
              `:""}
              <div class="rental-task-content">${t.rentalActiveTask.content}</div>
              ${(()=>{if(!t.rentalActiveTask?.attachments)return"";try{const s=JSON.parse(t.rentalActiveTask.attachments);if(s.length===0)return"";const l=s.filter(u=>u.type?.startsWith("image/")),c=s.filter(u=>!u.type?.startsWith("image/"));return r`
                    <div class="rental-task-client-attachments">
                      <div class="rental-task-attachments-label">📎 客户附件 (${s.length})</div>
                      ${l.length>0?r`
                        <div class="rental-att-images">
                          ${l.map(u=>r`
                            <a class="rental-att-img-wrap" href="https://taxbot.cc:8443${u.url}" target="_blank" rel="noopener noreferrer" title="${u.name}">
                              <img class="rental-att-img" src="https://taxbot.cc:8443${u.url}" alt="${u.name}" />
                              <span class="rental-att-img-name">${u.name}</span>
                            </a>
                          `)}
                        </div>
                      `:""}
                      ${c.length>0?r`
                        <div class="rental-task-attachments-list">
                          ${c.map(u=>r`
                            <a class="rental-task-attachment-item" href="https://taxbot.cc:8443${u.url}" target="_blank" rel="noopener noreferrer" style="text-decoration:none;cursor:pointer;">
                              <span class="rental-att-file-icon">📄</span>
                              <span class="rental-task-attachment-name">${u.name}</span>
                              <span class="rental-task-attachment-size">(${(u.size/1024).toFixed(0)}KB)</span>
                            </a>
                          `)}
                        </div>
                      `:""}
                    </div>`}catch{return""}})()}
            </div>
            <div class="rental-task-agent-action">
              ${t.rentalAgentProcessing?(()=>{const s=t.rentalActiveTask?.listing.agentId,l=s?t.agentsList.find(c=>c.id===s):null;return r`
                <div class="rental-agent-processing">
                  <div class="rental-agent-spinner"></div>
                  ${l?r`
                    <span class="rental-processing-agent">
                      ${l.avatarUrl?r`<img src="${l.avatarUrl}" class="rental-processing-avatar" />`:r`<span class="rental-processing-emoji">${l.emoji}</span>`}
                      <strong>${l.name}</strong> 正在处理任务...
                    </span>
                  `:r`<span>智能体正在处理任务，请稍候...</span>`}
                </div>`})():r`
                <button class="rental-btn-agent"
                  @click=${ri}>
                  🤖 让智能体处理
                </button>
              `}
            </div>
            <div class="rental-task-result-label">
              ${t.rentalAgentProcessing?"智能体回答中...":"智能体回答 / 任务结果"}
            </div>
            <textarea class="rental-task-result-area"
              .value=${t.rentalTaskResult}
              @input=${s=>{t.rentalTaskResult=s.target.value}}
              ?readonly=${t.rentalAgentProcessing}
              placeholder="智能体处理后结果会显示在这里，也可以直接手动填写..."></textarea>
            ${t.rentalTaskResult.trim()?r`
            <div class="rental-task-instruction">
              <div class="rental-task-instruction-label">✏️ 修改指令 <span style="color:#9ca3af;font-weight:normal;">（输入指令让智能体修改上方结果）</span></div>
              <div class="rental-task-instruction-row">
                <input class="rental-task-instruction-input"
                  type="text"
                  .value=${t.rentalTaskInstruction}
                  @input=${s=>{t.rentalTaskInstruction=s.target.value,d()}}
                  @keydown=${s=>{s.key==="Enter"&&!s.shiftKey&&t.rentalTaskInstruction.trim()&&!t.rentalAgentProcessing&&(s.preventDefault(),is())}}
                  ?disabled=${t.rentalAgentProcessing}
                  placeholder="例如：把结论部分写得更详细一些..." />
                <button class="rental-btn-revise"
                  ?disabled=${!t.rentalTaskInstruction.trim()||t.rentalAgentProcessing}
                  @click=${is}>
                  ${t.rentalAgentProcessing?"修改中...":"发送"}
                </button>
              </div>
            </div>
            `:""}
            <div class="rental-task-attachments">
              <div class="rental-task-attachments-label">📎 附件 <span style="color:#9ca3af;font-weight:normal;">(可选，最多5个)</span></div>
              <div class="rental-task-attachments-list">
                ${t.rentalTaskAttachments.map((s,l)=>r`
                  <div class="rental-task-attachment-item">
                    <span class="rental-task-attachment-name">${s.name}</span>
                    <span class="rental-task-attachment-size">(${(s.size/1024).toFixed(0)}KB)</span>
                    <button class="rental-task-attachment-remove" @click=${()=>{t.rentalTaskAttachments=t.rentalTaskAttachments.filter((c,u)=>u!==l),d()}}>✕</button>
                  </div>
                `)}
                ${t.rentalTaskAttachments.length<5?r`
                  <label class="rental-task-attachment-add">
                    📎 添加附件
                    <input type="file" multiple style="display:none;" @change=${s=>{const l=s.target,c=Array.from(l.files||[]),u=c.filter(g=>g.size<=10*1024*1024);u.length<c.length&&k("部分文件超过10MB限制，已跳过"),t.rentalTaskAttachments=[...t.rentalTaskAttachments,...u].slice(0,5),l.value="",d()}} />
                  </label>
                `:""}
              </div>
            </div>
            <!-- Messages -->
            <div class="rental-messages-section">
              <button class="rental-messages-toggle" @click=${mi}>
                💬 留言沟通 ${(t.rentalActiveTask?.unreadMessageCount||0)>0?r`<span class="rental-messages-badge rental-messages-badge--unread">${t.rentalActiveTask.unreadMessageCount}</span>`:t.rentalMessages.length>0?r`<span class="rental-messages-badge">${t.rentalMessages.length}</span>`:""}
              </button>
              ${t.rentalMessagesOpen?r`
                <div class="rental-messages-container">
                  <div class="rental-messages-list">
                    ${t.rentalMessages.length===0?r`<div class="rental-messages-empty">暂无留言</div>`:t.rentalMessages.map(s=>r`
                        <div class="rental-message-row ${s.sender.id===t.taxstoreUser?.id?"rental-message-row--mine":""}">
                          <div class="rental-message-bubble ${s.sender.id===t.taxstoreUser?.id?"rental-message-bubble--mine":"rental-message-bubble--other"}">
                            <div class="rental-message-sender">${s.sender.name}</div>
                            <div class="rental-message-content">${s.content}</div>
                            <div class="rental-message-time">${new Date(s.createdAt).toLocaleTimeString()}</div>
                          </div>
                        </div>
                      `)}
                  </div>
                  <div class="rental-messages-input-row">
                    <input type="text" class="rental-messages-input" .value=${t.rentalMessageInput}
                      @input=${s=>{t.rentalMessageInput=s.target.value,d()}}
                      @keydown=${s=>{s.key==="Enter"&&(s.preventDefault(),os())}}
                      placeholder="输入留言..." />
                    <button class="rental-messages-send" @click=${os}
                      ?disabled=${!t.rentalMessageInput.trim()}>发送</button>
                  </div>
                </div>
              `:""}
            </div>
            <div class="rental-task-actions">
              <span class="rental-task-price">💰 完成可获得 ${t.rentalActiveTask.price} 积分</span>
              <div style="display:flex;gap:8px;">
                <button class="rental-btn-cancel" @click=${be}>取消</button>
                <button class="rental-btn-submit"
                  ?disabled=${!t.rentalTaskResult.trim()||t.rentalAgentProcessing}
                  @click=${ci}>提交结果</button>
              </div>
            </div>
          </div>
        </div>
      `:""}

      <!-- 任务列表弹窗 -->
      ${""}

      <!-- 已完成任务详情弹窗 -->
      ${t.rentalTaskDetailView?r`
        <div class="rental-task-overlay" @click=${()=>{t.rentalTaskDetailView=null,d()}}>
          <div class="rental-task-panel" @click=${s=>s.stopPropagation()}>
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
              <h3 style="margin:0;">✅ 任务详情</h3>
              <button class="rental-tasklist-close" @click=${()=>{t.rentalTaskDetailView=null,d()}}>✕</button>
            </div>
            <div class="rental-task-info">
              <div class="rental-task-title">${t.rentalTaskDetailView.title}</div>
              <div class="rental-task-meta">
                来自: ${t.rentalTaskDetailView.client.name} · 智能体: ${t.rentalTaskDetailView.listing.emoji} ${t.rentalTaskDetailView.listing.name}
              </div>
              <div class="rental-task-content">${t.rentalTaskDetailView.content}</div>
            </div>
            ${t.rentalTaskDetailView.result?r`
              <div class="rental-task-result-label">智能体回复</div>
              <div class="rental-task-detail-result">${t.rentalTaskDetailView.result}</div>
            `:""}
            <div class="rental-task-detail-footer">
              <div class="rental-task-detail-stats">
                <span class="rental-task-card-price--earned">+${t.rentalTaskDetailView.price} 积分</span>
                ${t.rentalTaskDetailView.completedAt?r`<span style="color:#9ca3af;font-size:12px;">完成于 ${new Date(t.rentalTaskDetailView.completedAt).toLocaleString()}</span>`:""}
              </div>
              ${t.rentalTaskDetailView.rating?r`
                <div class="rental-task-detail-rating">
                  ${"⭐".repeat(t.rentalTaskDetailView.rating)}
                  ${t.rentalTaskDetailView.ratingComment?r`<span style="color:#9ca3af;font-size:12px;margin-left:8px;">${t.rentalTaskDetailView.ratingComment}</span>`:""}
                </div>
              `:""}
            </div>
          </div>
        </div>
      `:""}

      ${t.previewAttachment?r`
        <div class="preview-modal" @click=${()=>{t.previewAttachment=null,v()}}>
          <div class="preview-content" @click=${s=>s.stopPropagation()}>
            <button class="preview-close" @click=${()=>{t.previewAttachment=null,v()}}>✕</button>
            ${t.previewAttachment.type.startsWith("image/")?r`
              <img src=${t.previewAttachment.dataUrl} alt=${t.previewAttachment.name} class="preview-image" />
            `:r`
              <div class="preview-file-info">
                <div class="preview-file-icon">📄</div>
                <div class="preview-file-name">${t.previewAttachment.name}</div>
                <div class="preview-file-size">${Yt(t.previewAttachment.size)}</div>
                <div class="preview-file-type">${t.previewAttachment.type}</div>
              </div>
            `}
          </div>
        </div>
      `:""}

      ${t.toastMessage?r`
        <div class="taxchat-toast">
          <div class="taxchat-toast__icon">📚</div>
          <div class="taxchat-toast__text">${t.toastMessage}</div>
          <button class="taxchat-toast__close" @click=${()=>{t.toastTimer&&clearTimeout(t.toastTimer),t.toastMessage=null,t.toastTimer=null,v()}}>✕</button>
        </div>
      `:""}
    </div>
  `;Os(i,e),requestAnimationFrame(()=>{const s=document.getElementById("messages-container");if(s&&(cn(),gs?(s.scrollTop=s.scrollHeight,Dt(!1)):un(s),!s.__vsListenerAttached)){s.__vsListenerAttached=!0;let l=!1;s.addEventListener("scroll",()=>{dn(s),t.messages.length>=40&&!l&&(l=!0,requestAnimationFrame(()=>{l=!1,d()}))},{passive:!0})}});const o=document.getElementById("message-input");o&&!t.sidePanel&&!t.searchOpen&&(o.focus(),t.inputRef=o)}document.addEventListener("click",()=>{let e=!1;t.showStatusMenu&&(t.showStatusMenu=!1,e=!0),t.showNotifications&&(t.showNotifications=!1,e=!0),e&&v()});document.addEventListener("click",e=>{const a=e.target.closest("a");if(!a)return;const i=a.getAttribute("href");if(!i||!a.closest(".message-bubble"))return;e.preventDefault(),e.stopPropagation();const o=window.electronAPI;if(i.startsWith("#localpath=")){const s=decodeURIComponent(i.replace("#localpath=",""));o?.openPath&&o.openPath(s)}else/^https?:\/\//i.test(i)&&(o?.openPath?o.openPath(i):window.open(i,"_blank"))});document.addEventListener("keydown",e=>{(e.ctrlKey||e.metaKey)&&e.key==="f"&&(e.preventDefault(),Ss())});document.addEventListener("DOMContentLoaded",()=>{document.documentElement.setAttribute("data-font-size",t.fontSize),nt(),ot(),Jn(),Yn(),xs(),Se();const e=window.electronAPI;e?.onGatewayPortChanged&&e.onGatewayPortChanged(n=>{console.log(`[Gateway] Port changed to ${n}, reconnecting...`),t.gatewayUrl=`ws://127.0.0.1:${n}`,nt()})});ga([{id:"risk",name:"/risk",emoji:"🧾",description:"税务风险治理",action:()=>L("risk-governance","请对上传的文件进行税务风险分析","税务风险治理")},{id:"invoice",name:"/invoice",emoji:"🔍",description:"发票查验",action:()=>L("invoice-check","请查验这些发票","发票查验")},{id:"compare",name:"/compare",emoji:"📊",description:"纳税申报表预审",action:()=>L("declaration-review","请审核纳税申报表","纳税申报表预审")},{id:"contract",name:"/contract",emoji:"📝",description:"合同及票据税审",action:()=>L("contract-review","请进行合同税审","合同及票据税审")},{id:"receipt",name:"/receipt",emoji:"📂",description:"票据整理",action:()=>L("receipt-organize","请执行票据整理流程","票据整理",!0)},{id:"clear",name:"/clear",emoji:"🗑️",description:"清空当前对话",action:()=>{t.confirmingClear=!0,d()}},{id:"new",name:"/new",emoji:"💬",description:"新建对话",action:()=>Te()},{id:"export",name:"/export",emoji:"📤",description:"导出对话 (Markdown)",action:()=>ha()},{id:"exporthtml",name:"/exporthtml",emoji:"🌐",description:"导出对话 (HTML)",action:()=>ka()},{id:"search",name:"/search",emoji:"🔎",description:"搜索消息",action:()=>Ss()}]);an();vn();Vs(v);d();Ea().then(()=>{t.taxstoreConnected&&(za(),fi())});
//# sourceMappingURL=taxchat.js.map
