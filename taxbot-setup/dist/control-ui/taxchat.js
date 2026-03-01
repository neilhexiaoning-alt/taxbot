import{e as Vs,i as Ks,h as Z,r as Hs,E as $e,A as Ws,p as Qs,w as We,G as Xs,b as r,D as Js,q as ut}from"./chunks/markdown-DiS2RbVY.js";const gt="20260301.4";const B=Vs(class extends Ks{constructor(t){if(super(t),t.type!==Z.PROPERTY&&t.type!==Z.ATTRIBUTE&&t.type!==Z.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!Hs(t))throw Error("`live` bindings can only contain a single expression")}render(t){return t}update(t,[n]){if(n===$e||n===Ws)return n;const a=t.element,i=t.name;if(t.type===Z.PROPERTY){if(n===a[i])return $e}else if(t.type===Z.BOOLEAN_ATTRIBUTE){if(!!n===a.hasAttribute(i))return $e}else if(t.type===Z.ATTRIBUTE&&a.getAttribute(i)===n+"")return $e;return Qs(t),n}}),Gs="taxbot_favorites",hs="taxbot_messages",ks="taxbot_notifications",bs="taxbot_custom_skills",ws="taxbot_conversations",pt="taxbot_current_conversation",Ys=12e3,Bt=[{name:"税务顾问",emoji:"🧾",description:"专业税务咨询与风险分析",identityDesc:"你是一位资深税务顾问，精通中国税法体系，包括增值税、企业所得税、个人所得税等各税种。你能够根据企业实际情况提供合规的税务筹划建议，识别潜在的税务风险，并给出切实可行的解决方案。回答时引用具体法规条文，确保建议的准确性和权威性。",expertise:"增值税、企业所得税、个人所得税、税收优惠政策、税务风险防控、税务筹划、纳税申报、税务稽查应对"},{name:"合同审查",emoji:"📋",description:"合同条款的税务风险审查",identityDesc:"你是一位专注于合同税务条款审查的专家，擅长从税务角度审查各类商业合同。你能发现合同中的涉税风险点，如发票条款缺失、价税约定不明确、代扣代缴义务不清等问题，并提出修改建议。",expertise:"合同涉税条款审查、发票约定、价税分离、印花税、代扣代缴义务、违约金税务处理、关联交易定价"},{name:"政策解读",emoji:"📜",description:"最新税收政策解读与影响分析",identityDesc:"你是一位税收政策研究专家，密切关注国家及地方税收政策的最新动态。你能够对新出台的税收政策进行深入解读，分析其对不同行业和企业的影响，并提供应对建议和过渡期安排方案。",expertise:"财税政策解读、政策变化追踪、行业影响分析、过渡期安排、税收优惠申请、地方税收政策差异"},{name:"财务分析",emoji:"📊",description:"财务报表分析与税务健康评估",identityDesc:"你是一位资深财务分析师，擅长通过财务数据分析企业的经营状况和税务健康度。你能够解读财务报表、分析税负率、评估税务风险指标，并提供优化建议。",expertise:"财务报表分析、税负率分析、现金流管理、预算编制、成本控制、财税一体化、税务健康指标评估"}],R=[{id:"__builtin_tax-risk",name:"税务风险治理",emoji:"🧾",description:"分析税务风险文件/图片，生成说明函和应对策略",prompt:"请按照税务风险治理流程，分析我上传的文件内容，识别税务风险点，给出风险分析、说明函、应对话术和操作建议。请直接分析文件内容，不要调用任何工具或命令。",pinned:!1,createdAt:0,folderName:"tax-risk",builtin:!0},{id:"__builtin_tax-review",name:"纳税申报表预审",emoji:"📊",description:"分析纳税申报表与财务报表的数据差异，识别税务风险",prompt:"请按照纳税申报表预审流程，分析我上传的纳税申报表和财务报表，比对两个表格的数据差异，以表格形式输出比对结果，并分析税务风险给出处理建议。请直接分析文件内容，不要调用任何工具或命令。",pinned:!1,createdAt:0,folderName:"tax-review",builtin:!0},{id:"__builtin_contract-tax",name:"合同及票据税审",emoji:"📝",description:"从税务角度审核合同和票据，计算税额，给出风险提示",prompt:"请按照票据合同税务审核流程，从税务角度分析我上传的合同或票据，列支涉及的税目并计算相关税额，给出风险提示和修改建议。请直接分析文件内容，不要调用任何工具或命令。",pinned:!1,createdAt:0,folderName:"contract-tax",builtin:!0},{id:"__builtin_invoice-check",name:"发票查验",emoji:"🔍",description:"上传发票图片/PDF/XML，查验发票真伪并分析风险",prompt:`# 发票查验

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
- 如果提取文本失败，告知用户可能需要安装对应的 Python 库（pdfplumber、python-docx、openpyxl）`,pinned:!1,createdAt:0,folderName:"knowledge-base",builtin:!0,noFilePicker:!0}],Zs={memory_search:"正在搜索记忆...",memory_get:"正在读取记忆...",exec:"正在执行命令...",read:"正在读取文件...",write:"正在写入文件...",search:"正在搜索...",web_search:"正在搜索网络...",web_fetch:"正在获取网页..."};function T(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,t=>{const n=Math.random()*16|0;return(t==="x"?n:n&3|8).toString(16)})}let $s=null,Ye=!1;function en(t){$s=t}function d(){Ye||(Ye=!0,requestAnimationFrame(()=>{Ye=!1,$s?.()}))}let ys=!0;function je(t){ys=t}const e={connected:!1,hello:null,lastError:null,gatewayUrl:"ws://127.0.0.1:18789",client:null,sessionKey:"taxchat",messages:[],draft:"",activeRuns:new Map,inputRef:null,attachments:[],dragOver:!1,toolMessages:void 0,stream:void 0,streamStartedAt:void 0,previewAttachment:null,pendingSkill:null,favorites:new Set,favSearchQuery:"",sidebarCollapsed:localStorage.getItem("taxbot_sidebar_collapsed")==="true",sidePanel:null,sidePanelWidth:parseInt(localStorage.getItem("taxbot_side_panel_width")||"340",10),skillsTab:"installed",confirmingClear:!1,authorizedFolder:localStorage.getItem("taxbot_authorized_folder"),folderKnowledge:null,folderKnowledgeSent:!1,importingFolder:!1,importResult:null,lastSkillName:null,toastMessage:null,toastTimer:null,notifications:[],panelTab:"favorites",customSkills:[],editingSkill:null,activeCustomSkill:null,showStatusMenu:!1,showNotifications:!1,notifDetail:null,knowledgeFiles:[],knowledgeRefs:[],knowledgeDragOver:!1,knowledgeLoading:!1,knowledgePreview:null,knowledgeQuoteBtn:null,builtinSkillsCollapsed:!0,filesSortBy:"time",skillsSortBy:"time",showQuickStart:!localStorage.getItem("quickstart_seen"),fontSize:localStorage.getItem("taxbot_font_size")||"medium",settingsView:"main",modelList:[],modelLoading:!1,modelSaving:!1,modelError:null,modelConfigDraft:{provider:"",baseUrl:"",apiKey:"",api:"openai-completions",modelId:""},configBaseHash:null,currentModelConfig:null,apiKeyVisible:!1,activeModel:null,confirmingModelSave:!1,confirmingSessionClear:!1,confirmingExit:!1,pendingDispatch:null,agentsList:[],agentsLoading:!1,creatingAgent:!1,agentCreateDraft:{name:"",emoji:"🤖",description:"",identityDesc:"",expertise:"",avatarDataUrl:"",selectedSkills:[]},editingAgentId:null,agentSaving:!1,confirmingAgentDelete:null,mentionDropdownVisible:!1,mentionFilter:"",mentionIndex:0,recentMentionIds:JSON.parse(localStorage.getItem("taxbot_recent_mentions")||"[]"),lastSingleMentionAgent:null,replyingTo:null,conversations:[],currentConversationId:"",renamingConversation:null,confirmingConvDelete:null,backgroundMessages:new Map,unreadConversations:new Set,viewingAgentMemory:null,confirmingMemoryClear:!1,collaborationTasks:null,collabQueue:null,collabFinalMessage:null,collabApiAttachments:null,collabMainResponse:null,commandPaletteVisible:!1,commandFilter:"",commandIndex:0,searchOpen:!1,searchQuery:"",searchResults:[],searchIndex:0,taxstoreConnected:!1,taxstoreToken:null,taxstoreUser:null,taxstoreSkills:[],taxstorePage:1,taxstoreTotalPages:1,taxstoreQuery:"",taxstoreCategory:"",taxstoreSort:"latest",taxstoreLoading:!1,taxstoreError:null,taxstoreInstalledIds:new Set,taxstoreUpdates:[],taxstoreLoginEmail:"",taxstoreLoginPassword:"",taxstoreInstallingId:null,taxstoreInstallStep:null,rentalActiveTab:"agents",rentalPublishDialog:!1,rentalPublishAgent:null,rentalPublishDraft:{price:10,description:"",tags:[]},rentalMyListings:[],rentalPendingTasks:[],rentalActiveTask:null,rentalTaskResult:"",rentalTaskPanel:!1,rentalPollingTimer:null,rentalAgentProcessing:!1,rentalCompletedTasks:[],rentalTaskListType:null,rentalTaskDetailView:null,rentalTaskAttachments:[],rentalTaskInstruction:"",rentalMessages:[],rentalMessageInput:"",rentalMessagesOpen:!1,consultMyTasks:[],consultUnreadCount:0,consultPollingTimer:null,consultView:"list",consultAgents:[],consultLoading:!1,consultSearch:"",consultAvgTime:"",consultSelectedAgent:null,consultTaskTitle:"",consultTaskContent:"",consultSubmitting:!1,consultSelectedTask:null,consultAttachments:[],consultUploading:!1,consultMessages:[],consultMessageInput:"",consultMessagesOpen:!1,consultMessagesSending:!1,consultRevisionOpen:!1,consultRevisionText:"",consultRevisionSubmitting:!1,consultRatingOpen:!1,consultRatingValue:0,consultRatingHover:0,consultRatingComment:"",consultRatingSubmitting:!1,refreshing:!1,lastRefreshTime:null,updateAvailable:null,updateChecking:!1,licenseStatus:"checking",licenseExpiresAt:null,trialStartedAt:null,licenseCode:null,licenseView:"status",licenseActivateCode:"",licenseActivating:!1,licenseApplyForm:{email:"",phone:"",reason:"",period:"90天"},licenseApplying:!1,licenseApplyResult:null};function xs(){return e.activeRuns.size>0}function pe(t){return e.activeRuns.has(t)}function Ot(t){for(const n of e.activeRuns.values())if(t.endsWith(n.sessionKey)||t===n.sessionKey)return n;return t.endsWith(e.sessionKey)&&e.activeRuns.get(e.sessionKey)||null}function Ts(t){return t.startsWith("agent:")&&t.endsWith(":main")}function ve(t){if(t===e.sessionKey||Ts(t))return e.messages;const n=t.startsWith("taxchat-")?t.slice(8):t;return e.backgroundMessages.has(n)?e.backgroundMessages.get(n):e.messages}function tn(t){return t===e.sessionKey}const sn="taxbot_db",nn=1,E="messages",Ft="meta";let ee=null,Ce=!1;function Qe(){return ee?Promise.resolve(ee):Ce?Promise.reject(new Error("IndexedDB unavailable")):new Promise((t,n)=>{try{const a=indexedDB.open(sn,nn);a.onupgradeneeded=()=>{const i=a.result;i.objectStoreNames.contains(E)||i.createObjectStore(E),i.objectStoreNames.contains(Ft)||i.createObjectStore(Ft)},a.onsuccess=()=>{ee=a.result,ee.onclose=()=>{ee=null},t(ee)},a.onerror=()=>{Ce=!0,n(a.error)}}catch(a){Ce=!0,n(a)}})}async function an(t,n){const a=await Qe(),i=n.slice(-200);return new Promise((o,s)=>{const l=a.transaction(E,"readwrite");l.objectStore(E).put(i,t),l.oncomplete=()=>o(),l.onerror=()=>s(l.error)})}async function ln(t){try{const n=await Qe();return new Promise((a,i)=>{const s=n.transaction(E,"readonly").objectStore(E).get(t);s.onsuccess=()=>{const l=s.result;a(Array.isArray(l)?l:null)},s.onerror=()=>i(s.error)})}catch{return null}}async function on(t){try{const n=await Qe();return new Promise((a,i)=>{const o=n.transaction(E,"readwrite");o.objectStore(E).delete(t),o.oncomplete=()=>a(),o.onerror=()=>i(o.error)})}catch{}}async function Ut(t){if(localStorage.getItem("taxbot_idb_migrated")==="1")return!0;try{const n=await Qe();for(const a of t){const i=`taxbot_messages_${a}`,o=localStorage.getItem(i);if(o)try{const s=JSON.parse(o);Array.isArray(s)&&await new Promise((l,c)=>{const u=n.transaction(E,"readwrite");u.objectStore(E).put(s.slice(-200),a),u.oncomplete=()=>l(),u.onerror=()=>c(u.error)})}catch{}}return localStorage.setItem("taxbot_idb_migrated","1"),console.log(`[IDB] Migrated ${t.length} conversations to IndexedDB`),!0}catch(n){return console.warn("[IDB] Migration failed, using localStorage fallback:",n),!1}}function Ct(){return!Ce}let H=!1;function As(){try{const t=localStorage.getItem(ws);if(t){const n=JSON.parse(t);if(Array.isArray(n))return n}}catch{}return[]}function J(){try{localStorage.setItem(ws,JSON.stringify(e.conversations))}catch{}}function Xe(t){try{const n=localStorage.getItem(`taxbot_messages_${t}`);if(n){const a=JSON.parse(n);if(Array.isArray(a))return a}}catch{}return[]}async function Ss(t){if(Ct())try{const n=await ln(t);if(n&&n.length>0)return n}catch{}return Xe(t)}function me(t,n){const a=n.slice(-200);try{localStorage.setItem(`taxbot_messages_${t}`,JSON.stringify(a))}catch{}H&&Ct()&&an(t,a).catch(()=>{})}function qe(t){try{const n=localStorage.getItem(`taxbot_favorites_${t}`);if(n)return new Set(JSON.parse(n))}catch{}return new Set}function It(t,n){try{localStorage.setItem(`taxbot_favorites_${t}`,JSON.stringify([...n]))}catch{}}function rn(){try{const t=localStorage.getItem(hs);if(t){const n=JSON.parse(t);if(Array.isArray(n))return n}}catch{}return[]}function cn(){try{const t=localStorage.getItem(Gs);if(t)return new Set(JSON.parse(t))}catch{}return new Set}function G(){try{me(e.currentConversationId,e.messages);const t=e.conversations.find(n=>n.id===e.currentConversationId);t&&(t.updatedAt=Date.now(),t.messageCount=e.messages.length,J())}catch{}}let W=null;function Ze(){W&&clearTimeout(W),W=setTimeout(()=>{W=null,G()},2e3)}function Cs(){W&&(clearTimeout(W),W=null,G())}function Mt(){try{It(e.currentConversationId,e.favorites)}catch{}dn()}function dn(){const t=window.electronAPI;if(!t?.syncFavoritesToMemory)return;const n=[];for(const a of e.favorites){const i=e.messages.findIndex(l=>l.id===a);if(i<0)continue;const o=e.messages[i];if(o.type!=="assistant")continue;let s;for(let l=i-1;l>=0;l--)if(e.messages[l].type==="user"){s=e.messages[l].text;break}n.push({text:o.text,timestamp:o.timestamp,question:s})}t.syncFavoritesToMemory(n).catch(()=>{})}function un(t){localStorage.removeItem(`taxbot_messages_${t}`),localStorage.removeItem(`taxbot_favorites_${t}`),H&&Ct()&&on(t).catch(()=>{})}function gn(){try{const t=localStorage.getItem(ks);if(t)return JSON.parse(t)}catch{}return[]}function ge(){const t=e.notifications.slice(-50);localStorage.setItem(ks,JSON.stringify(t))}function pn(){try{const t=localStorage.getItem(bs);if(t)return JSON.parse(t)}catch{}return[]}function X(){localStorage.setItem(bs,JSON.stringify(e.customSkills))}function vn(){const t=rn(),n=cn(),a=T(),i=Date.now(),o=t.find(c=>c.type==="user"),s=o?o.text.replace(/\n/g," ").slice(0,20)+(o.text.length>20?"...":""):"默认对话",l={id:a,title:s,createdAt:t.length>0?t[0].timestamp:i,updatedAt:t.length>0?t[t.length-1].timestamp:i,messageCount:t.length};return t.length>0&&me(a,t),n.size>0&&It(a,n),{conversations:[l],currentId:a}}function mn(){e.notifications=gn(),e.customSkills=pn();const t=e.conversations.map(n=>n.id);if(t.length===0){const n=As();n.length>0?Ut(n.map(a=>a.id)).then(a=>{H=a}).catch(()=>{H=!1}):H=!0}else Ut(t).then(n=>{H=n}).catch(()=>{H=!1})}const fn=70,hn=140,Nt=5,Le=new Map;function ye(t){return t.id&&Le.has(t.id)?Le.get(t.id):t.type==="user"?fn:hn}function kn(t,n,a){if(t.length===0)return{startIndex:0,endIndex:0,topPadding:0,bottomPadding:0,totalHeight:0};if(t.length<40)return{startIndex:0,endIndex:t.length,topPadding:0,bottomPadding:0,totalHeight:t.reduce((g,p)=>g+ye(p),0)};let i=0;const o=[];for(const g of t)o.push(i),i+=ye(g);let s=0;for(let g=0;g<o.length;g++)if(o[g]+ye(t[g])>=n){s=g;break}let l=s;for(let g=s;g<t.length&&(l=g+1,!(o[g]>n+a));g++);s=Math.max(0,s-Nt),l=Math.min(t.length,l+Nt);const c=o[s]||0;let u=0;for(let g=l;g<t.length;g++)u+=ye(t[g]);return{startIndex:s,endIndex:l,topPadding:c,bottomPadding:u,totalHeight:i}}function bn(){const t=document.getElementById("messages-container");if(!t)return;const n=t.querySelectorAll("[data-msg-id]");for(const a of n){const i=a.getAttribute("data-msg-id");if(!i)continue;const o=a.offsetHeight;o>0&&Le.set(i,o)}}let vt=!0;function wn(t){return vt=t.scrollHeight-t.scrollTop-t.clientHeight<80,vt}function $n(t){vt&&(t.scrollTop=t.scrollHeight)}function mt(){Le.clear()}function Ee(){const t=new Set(e.messages.map(a=>a.id));let n=!1;for(const a of e.favorites)t.has(a)||(e.favorites.delete(a),n=!0);n&&Mt()}function Pt(){Cs(),G();const t=T(),n=Date.now(),a={id:t,title:"新对话",createdAt:n,updatedAt:n,messageCount:0,lastAccessedAt:n};e.conversations.unshift(a),J(),Be(t)}function Be(t){if(t===e.currentConversationId)return;Cs(),G();const n=e.currentConversationId,a=e.sessionKey,i=[...e.activeRuns.values()].some(s=>s.sessionKey===a);if(i&&e.backgroundMessages.set(n,[...e.messages]),!i)for(const[s]of e.activeRuns)s===a&&e.activeRuns.delete(s);e.replyingTo=null,e.pendingDispatch=null,e.lastSingleMentionAgent=null,e.currentConversationId=t,e.sessionKey=`taxchat-${t}`,e.backgroundMessages.has(t)?(e.messages=e.backgroundMessages.get(t),e.backgroundMessages.delete(t)):e.messages=Xe(t),e.favorites=qe(t),Ee(),e.unreadConversations.delete(t);const o=e.conversations.find(s=>s.id===t);o&&(o.lastAccessedAt=Date.now()),J(),localStorage.setItem(pt,t),mt(),je(!0),d(),e.messages.length===0&&Ss(t).then(s=>{s.length>0&&e.currentConversationId===t&&(e.messages=s,Ee(),mt(),je(!0),d())})}function yn(t){e.conversations=e.conversations.filter(n=>n.id!==t),un(t),t===e.currentConversationId&&(e.conversations.length===0?Pt():Be(e.conversations[0].id)),J(),e.confirmingConvDelete=null,d()}function zt(t,n){const a=e.conversations.find(i=>i.id===t);a&&(a.title=n.trim()||"新对话",J()),e.renamingConversation=null,d()}function xn(){const t=e.conversations.find(a=>a.id===e.currentConversationId);if(!t||t.title!=="新对话")return;const n=e.messages.find(a=>a.type==="user");if(n){const a=n.text.replace(/\n/g," ").trim();t.title=a.slice(0,20)+(a.length>20?"...":""),J()}}function Tn(){let t=As(),n=localStorage.getItem(pt)||"";if(t.length===0){if(localStorage.getItem(hs)){const i=vn();t=i.conversations,n=i.currentId}else{const i=T();t=[{id:i,title:"新对话",createdAt:Date.now(),updatedAt:Date.now(),messageCount:0}],n=i}e.conversations=t,e.currentConversationId=n,J(),localStorage.setItem(pt,n)}else e.conversations=t,t.find(a=>a.id===n)||(n=t[0].id),e.currentConversationId=n;e.messages=Xe(n),e.favorites=qe(n),Ee(),e.sessionKey=`taxchat-${n}`,e.messages.length===0&&Ss(n).then(a=>{a.length>0&&e.currentConversationId===n&&(e.messages=a,Ee(),mt(),je(!0),d())})}function se(t){return new Date(t).toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit"})}function et(t){if(t===0)return"0 B";const n=1024,a=["B","KB","MB"],i=Math.floor(Math.log(t)/Math.log(n));return Math.round(t/Math.pow(n,i)*100)/100+" "+a[i]}function Is(){const t=new Date;return`${t.getFullYear()}${String(t.getMonth()+1).padStart(2,"0")}${String(t.getDate()).padStart(2,"0")}_${String(t.getHours()).padStart(2,"0")}${String(t.getMinutes()).padStart(2,"0")}`}function An(){const t=[...e.knowledgeFiles];return e.filesSortBy==="name"?t.sort((n,a)=>n.name.localeCompare(a.name,"zh")):t.sort((n,a)=>(a.mtime||0)-(n.mtime||0)),t}function Sn(){const t=[...e.customSkills];return e.skillsSortBy==="name"?t.sort((n,a)=>n.name.localeCompare(a.name,"zh")):t.sort((n,a)=>(a.createdAt||0)-(n.createdAt||0)),t}function Cn(t){return new Promise((n,a)=>{const i=new FileReader;i.onload=()=>{typeof i.result=="string"?n(i.result):a(new Error("Failed to read file"))},i.onerror=()=>{a(i.error)},i.readAsDataURL(t)})}function In(t){e.attachments.splice(t,1),d()}function Ms(t){e.favorites.has(t)?e.favorites.delete(t):e.favorites.add(t),Mt(),d()}function Mn(t){const n=document.querySelector(`[data-msg-id="${t}"]`);n&&(n.scrollIntoView({behavior:"smooth",block:"start"}),n.style.transition="outline 0.2s",n.style.outline="2px solid #00A8FF",setTimeout(()=>{n.style.outline="none"},1500))}function Pn(t,n){const a=document.createElement("div");a.innerHTML=We(n);const i=a.innerText||a.textContent||n;navigator.clipboard.writeText(i).then(()=>{const o=document.querySelector(`[data-copy-id="${t}"]`);if(o){o.classList.add("copied");const s=o.querySelector(".action-label");s&&(s.textContent="已复制"),setTimeout(()=>{o.classList.remove("copied"),s&&(s.textContent="复制")},1500)}})}function Ps(t){return`<!DOCTYPE html>
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
</head><body>${We(t)}</body></html>`}function Dn(t){const n=Ps(t),a=new Blob([n],{type:"application/msword"}),i=URL.createObjectURL(a),o=document.createElement("a");o.href=i,o.download=`Taxbot_${Is()}.doc`,document.body.appendChild(o),o.click(),document.body.removeChild(o),URL.revokeObjectURL(i)}function k(t,n=5e3){e.toastTimer&&clearTimeout(e.toastTimer),e.toastMessage=t,d(),e.toastTimer=setTimeout(()=>{e.toastMessage=null,e.toastTimer=null,d()},n)}function P(t,n="📚",a,i){e.notifications.push({id:T(),text:t,icon:n,timestamp:Date.now(),...a?{taskId:a}:{},...i?{source:i}:{}}),ge()}function tt(){e.showQuickStart=!1,localStorage.setItem("quickstart_seen","1"),d()}function _n(t){return Zs[t]||"正在思考..."}function st(t){let n=t.replace(/<thinking>[\s\S]*?<\/thinking>\n?/g,"").trim();return n=n.replace(/<think>[\s\S]*?<\/think>\n?/g,"").trim(),n=n.replace(/<\/?final>/g,"").trim(),n=n.replace(/^NO\n\n/i,""),n}function Oe(t){const n=t,a=typeof n.role=="string"?n.role:"",i=n.content;if(typeof i=="string")return a==="assistant"?st(i):i;if(Array.isArray(i)){const o=i.map(s=>{const l=s;return l?.type==="text"&&typeof l.text=="string"?l.text:null}).filter(s=>typeof s=="string");if(o.length>0){const s=o.join(`
`);return a==="assistant"?st(s):s}}return typeof n.text=="string"?a==="assistant"?st(n.text):n.text:""}function Fe(t){const n=t.trim();return[/^NO_REPLY$/i,/^Pre-compaction memory flush/i,/^Store durable memories/i].some(i=>i.test(n))}function Rn(t){return/^NO$/i.test(t.trim())&&!xs()?"模型未能正确回复，请重新发送您的问题。":t}function jn(t){const n=`[^\\s<>)"'，。、；：！？》）\\]]+`,a='[^\\s<>:"*?|，。、；：！？》）\\]]+',i=new RegExp(`(\`\`\`[\\s\\S]*?\`\`\`)|(\\[[^\\]]*\\]\\([^)]+\\))|\`([^\`]+)\`|(https?:\\/\\/${n})|([A-Za-z]:\\\\(?:${a}\\\\)*${a})`,"g");return t.replace(i,(o,s,l,c,u,g)=>{if(s||l)return o;if(c!==void 0){const p=c.trim();if(/^[A-Za-z]:\\/.test(p)){const m=p.replace(/[.,;:!?)]+$/,"");return`[${m}](#localpath=${encodeURIComponent(m)})`}if(/^https?:\/\//.test(p)){const m=p.replace(/[.,;:!?)]+$/,"");return`[${m}](${m})`}return o}if(u){const p=u.replace(/[.,;:!?)]+$/,"");return`[${p}](${p})`}if(g){const p=g.replace(/[.,;:!?)]+$/,"");return`[${p}](#localpath=${encodeURIComponent(p)})`}return o})}async function qn(t){const n=window.electronAPI;if(!n?.extractDocumentText)return"";const a=[];for(const i of t){const o=/^data:([^;]+);base64,(.+)$/.exec(i.dataUrl);if(!o)continue;const s=o[1],l=o[2];try{const c=await n.extractDocumentText(l,s,i.name);c?.ok&&c.text?.trim()&&a.push(`【${i.name}】
${c.text.trim()}`)}catch(c){console.warn(`Failed to extract text from ${i.name}:`,c)}}return a.join(`

`)}function fe(t){return t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function Ln(t){const n=[];return t.textCount>0&&n.push(`文本 ${t.textCount}`),t.imageCount>0&&n.push(`图片 ${t.imageCount}`),t.docCount>0&&n.push(`文档 ${t.docCount}`),n.length===0?t.message||"未找到可读取的文件":`已导入: ${n.join("、")}`}function Ds(t){if(!t.length)return[];const n=[...R,...e.customSkills.filter(a=>!a.id.startsWith("__builtin_"))];return t.map(a=>n.find(i=>i.id===a)).filter(a=>!!a).map(a=>({name:a.name,emoji:a.emoji,description:a.description,prompt:a.prompt}))}const Ie=new Map;async function Y(t){if(Ie.has(t))return Ie.get(t);const n=window.electronAPI;if(!n?.readAgentMemory)return"";try{const a=await n.readAgentMemory(t),i=a?.ok&&a.content||"";return Ie.set(t,i),i}catch{return""}}async function ft(t,n){Ie.set(t,n);const a=window.electronAPI;if(a?.writeAgentMemory)try{await a.writeAgentMemory(t,n)}catch{}}async function Ue(t,n){const a=await Y(t),i=new Date().toLocaleString("zh-CN"),o=a?`${a}

---

[${i}]
${n}`:`[${i}]
${n}`;await ft(t,o)}async function oe(){if(!(!e.client||!e.connected)&&!e.agentsLoading){e.agentsLoading=!0,d();try{const t=await e.client.request("agents.list",{});if(console.log("[Agents] agents.list response:",JSON.stringify(t,null,2)?.substring(0,500)),t?.agents&&Array.isArray(t.agents)){const n=t.defaultId||"main";e.agentsList=t.agents.map(i=>({id:i.id,name:i.name?.trim()||i.identity?.name?.trim()||i.id,emoji:i.identity?.emoji?.trim()&&i.identity.emoji.trim().length<=8?i.identity.emoji.trim():"🤖",avatarUrl:i.identity?.avatarUrl||i.identity?.avatar||void 0,description:i.identity?.theme?.trim()||"",isDefault:i.id===n})),e.agentsList.find(i=>i.isDefault)||e.agentsList.unshift({id:n,name:n,emoji:"🤖",description:"",isDefault:!0}),e.agentsList.sort((i,o)=>i.isDefault&&!o.isDefault?-1:!i.isDefault&&o.isDefault?1:i.name.localeCompare(o.name)),console.log("[Agents] Loaded",e.agentsList.length,"agents:",e.agentsList.map(i=>`${i.id}(${i.name})`).join(", "));const a=e.agentsList.filter(i=>!i.isDefault&&i.name===i.id);a.length>0&&(console.log("[Agents] Found agents without names, attempting recovery:",a.map(i=>i.id)),await En())}else console.warn("[Agents] agents.list returned unexpected shape:",t)}catch(t){console.error("loadAgents error:",t)}e.agentsLoading=!1,d(),Bn()}}async function En(){const t=window.electronAPI;if(!(!t?.recoverAgentIdentities||!e.client))try{const n=await t.recoverAgentIdentities();if(!n?.ok||!n.agents?.length)return;const a=n.agents;console.log("[Agents] Recovered identities:",a.map(p=>`${p.id}→${p.name}${p.avatarUrl?" (has avatar)":""}`));let i=!1;for(const p of a){const m=e.agentsList.find(h=>h.id===p.id);m&&m.name===m.id&&p.name!==p.id?(m.name=p.name,m.emoji=p.emoji||m.emoji,m.description=p.description||m.description,p.avatarUrl&&(m.avatarUrl=p.avatarUrl),i=!0):m&&p.avatarUrl&&!m.avatarUrl&&(m.avatarUrl=p.avatarUrl,i=!0)}if(!i)return;d();const o=await e.client.request("config.get",{}),s=o?.hash||null,l=o?.config||{},c=l.agents?.list||[],g=c.some(p=>p.id==="main"||p.default===!0)?[...c]:[{id:"main",default:!0}];for(const p of a){if(g.some(f=>f.id===p.id&&f.name&&f.name!==f.id))continue;const m=g.findIndex(f=>f.id===p.id);m>=0&&g.splice(m,1);const h={name:p.name,emoji:p.emoji,theme:p.description};p.avatarUrl&&(h.avatar=p.avatarUrl),g.push({id:p.id,name:p.name,identity:h})}console.log("[Agents] Patching config to restore agent names:",g.map(p=>`${p.id}(${p.name})`)),await e.client.request("config.patch",{baseHash:s,raw:JSON.stringify({agents:{...l.agents,list:g}}),note:"恢复智能体名称",restartDelayMs:0})}catch(n){console.warn("[Agents] Recovery failed:",n)}}async function Bn(){const t=window.electronAPI;if(t?.syncAgentsToMainWorkspace)try{const n=e.agentsList.map(a=>({name:a.name,emoji:a.emoji,description:a.description,isDefault:a.isDefault}));await t.syncAgentsToMainWorkspace({agents:n}),console.log("[Agent] Synced agent list to main workspace")}catch(n){console.warn("[Agent] Failed to sync agents to main workspace:",n)}}async function On(t){e.agentCreateDraft={name:t.name,emoji:t.emoji,description:t.description,identityDesc:t.identityDesc,expertise:t.expertise,avatarDataUrl:""},e.editingAgentId=null,await _s()}async function _s(){if(!e.client||!e.connected)return;const t=e.agentCreateDraft,n=t.name.trim();if(!n){k("请填写名称");return}const i=n.replace(/[^a-zA-Z0-9]+/g,"-").replace(/^-+|-+$/g,"").toLowerCase().slice(0,32)||"agent-"+Date.now().toString(36);if(e.agentsList.find(o=>o.id===i)){k("已存在同名智能体");return}e.agentSaving=!0,d();try{const o=await e.client.request("config.get",{}),s=o?.hash||null,l=o?.config||{},c=l.agents?.list||[];console.log("[Agent] createAgent: existingList =",JSON.stringify(c));const g=c.some(f=>f.id==="main"||f.default===!0)?[...c]:[{id:"main",default:!0},...c],p={name:n,emoji:t.emoji.trim()||"🤖",theme:t.description.trim()||void 0};t.avatarDataUrl&&(p.avatar=t.avatarDataUrl);const m=[...g,{id:i,name:n,identity:p}];console.log("[Agent] createAgent: newList =",JSON.stringify(m));const h={agents:{...l.agents,list:m}};if(await e.client.request("config.patch",{baseHash:s,raw:JSON.stringify(h),note:`新建智能体: ${n}`,restartDelayMs:1e3}),window.electronAPI?.createAgentWorkspace){const f=await window.electronAPI.createAgentWorkspace({agentId:i,name:n,emoji:t.emoji.trim()||"🤖",description:t.description.trim(),identityDesc:t.identityDesc.trim(),expertise:t.expertise.trim(),selectedSkills:Ds(t.selectedSkills||[])});console.log("[Agent] createAgentWorkspace result:",f)}t.avatarDataUrl&&window.electronAPI?.saveAgentAvatar&&await window.electronAPI.saveAgentAvatar({agentId:i,avatarDataUrl:t.avatarDataUrl}),k(`智能体 "${n}" 已创建`),e.creatingAgent=!1,e.agentCreateDraft={name:"",emoji:"🤖",description:"",identityDesc:"",expertise:"",avatarDataUrl:"",selectedSkills:[]},setTimeout(()=>oe(),1500)}catch(o){k("创建失败: "+(o?.message||String(o)))}e.agentSaving=!1,d()}async function Fn(t){if(!e.client||!e.connected)return;const n=e.agentsList.find(a=>a.id===t);if(!(!n||n.isDefault)){e.agentSaving=!0,e.confirmingAgentDelete=null,d();try{const a=await e.client.request("config.get",{}),i=a?.hash||null,o=a?.config||{},l=(o.agents?.list||[]).filter(p=>p.id!==t),u=l.some(p=>p.id==="main"||p.default===!0)?l:[{id:"main",default:!0},...l],g={agents:{...o.agents,list:u}};await e.client.request("config.patch",{baseHash:i,raw:JSON.stringify(g),note:`删除智能体: ${n.name}`,restartDelayMs:1e3}),window.electronAPI?.deleteAgentWorkspace&&await window.electronAPI.deleteAgentWorkspace({agentId:t}),k(`智能体 "${n.name}" 已删除`),setTimeout(()=>oe(),1500)}catch(a){k("删除失败: "+(a?.message||String(a)))}e.agentSaving=!1,d()}}async function Un(t){if(e.editingAgentId=t.id,e.agentCreateDraft={name:t.name,emoji:t.emoji,description:t.description,identityDesc:"",expertise:"",avatarDataUrl:t.avatarUrl||"",selectedSkills:[]},e.creatingAgent=!0,d(),window.electronAPI?.readAgentWorkspace)try{const n=await window.electronAPI.readAgentWorkspace({agentId:t.id});if(n?.ok){if(n.description&&(e.agentCreateDraft.description=n.description),n.identityDesc&&(e.agentCreateDraft.identityDesc=n.identityDesc),n.expertise&&(e.agentCreateDraft.expertise=n.expertise),n.toolsSkillNames?.length){const a=[...R,...e.customSkills.filter(i=>!i.id.startsWith("__builtin_"))];e.agentCreateDraft.selectedSkills=n.toolsSkillNames.map(i=>a.find(o=>o.name===i)?.id).filter(i=>!!i)}d()}}catch(n){console.warn("[Agent] Failed to read workspace:",n)}}async function Nn(){if(!e.client||!e.connected||!e.editingAgentId)return;const t=e.agentCreateDraft,n=t.name.trim();if(!n){k("请填写名称");return}e.agentSaving=!0,d();try{const a=await e.client.request("config.get",{}),i=a?.hash||null,o=a?.config||{},s=o.agents?.list||[],c=s.some(m=>m.id==="main"||m.default===!0)?s:[{id:"main",default:!0},...s],u={name:n,emoji:t.emoji.trim()||"🤖",theme:t.description.trim()||void 0};t.avatarDataUrl&&(u.avatar=t.avatarDataUrl);const g=c.map(m=>m.id===e.editingAgentId?{...m,name:n,identity:u}:m),p={agents:{...o.agents,list:g}};if(await e.client.request("config.patch",{baseHash:i,raw:JSON.stringify(p),note:`修改智能体: ${n}`,restartDelayMs:1e3}),window.electronAPI?.updateAgentWorkspace&&e.editingAgentId){const m=await window.electronAPI.updateAgentWorkspace({agentId:e.editingAgentId,name:n,emoji:t.emoji.trim()||"🤖",description:t.description.trim(),identityDesc:t.identityDesc.trim(),expertise:t.expertise.trim(),selectedSkills:Ds(t.selectedSkills||[])});console.log("[Agent] updateAgentWorkspace result:",m)}t.avatarDataUrl&&window.electronAPI?.saveAgentAvatar&&e.editingAgentId&&await window.electronAPI.saveAgentAvatar({agentId:e.editingAgentId,avatarDataUrl:t.avatarDataUrl}),k(`智能体 "${n}" 已更新`),e.creatingAgent=!1,e.editingAgentId=null,e.agentCreateDraft={name:"",emoji:"🤖",description:"",identityDesc:"",expertise:"",avatarDataUrl:"",selectedSkills:[]},setTimeout(()=>oe(),1500)}catch(a){k("更新失败: "+(a?.message||String(a)))}e.agentSaving=!1,d()}function zn(t){const n=[],a=new Set;let i=t;const o=/@(\S+)/g;let s;for(;(s=o.exec(t))!==null;){const l=s[1],c=e.agentsList.find(u=>u.name===l||u.id===l);c&&!a.has(c.id)&&(a.add(c.id),n.push({agentId:c.id,agentName:c.name,agentEmoji:c.emoji,isDefault:!!c.isDefault}),i=i.replace(s[0],"").trim())}return{mentions:n,cleanText:i}}function nt(){const t=e.mentionFilter,n=e.agentsList.filter(i=>!t||i.name.toLowerCase().includes(t)||i.id.toLowerCase().includes(t)),a=e.recentMentionIds;return n.sort((i,o)=>{const s=a.indexOf(i.id),l=a.indexOf(o.id),c=s!==-1,u=l!==-1;return c&&u?s-l:c&&!u?-1:!c&&u?1:i.isDefault&&!o.isDefault?-1:!i.isDefault&&o.isDefault?1:i.name.localeCompare(o.name)})}function Rs(t){const n=e.recentMentionIds.filter(a=>a!==t);n.unshift(t),n.length>10&&(n.length=10),e.recentMentionIds=n;try{localStorage.setItem("taxbot_recent_mentions",JSON.stringify(n))}catch{}}function at(t){console.log("[Agent] insertAgentMention called:",t.name,t.id);const n=e.draft.replace(/@(\S*)$/,`@${t.name} `);e.draft=n===e.draft?e.draft+`@${t.name} `:n,e.sidePanel=null,e.mentionDropdownVisible=!1,e.mentionIndex=0,Rs(t.id),d(),setTimeout(()=>{e.inputRef?.focus()},50)}async function Dt(){const t=window.electronAPI;if(t?.listManagedSkills)try{const n=await t.listManagedSkills();if(!n?.ok||!n.skills)return;const a=new Set(R.map(o=>o.folderName));let i=!1;for(const o of n.skills){if(a.has(o.folderName))continue;const s=e.customSkills.find(l=>l.folderName===o.folderName)||e.customSkills.find(l=>`custom-${l.id.slice(0,8)}`===o.folderName);if(s){const l=o.prompt||"",c=o.description||"";(s.prompt!==l||s.description!==c)&&(s.prompt=l,s.description=c,o.emoji&&(s.emoji=o.emoji),i=!0);continue}e.customSkills.push({id:T(),name:o.name===o.folderName?o.description.slice(0,20)||o.folderName:o.name,emoji:o.emoji||"🤖",description:o.description||"",prompt:o.prompt||"",pinned:!1,createdAt:Date.now(),folderName:o.folderName}),i=!0}i&&(X(),d())}catch(n){console.warn("Failed to sync managed skills:",n)}}function Vt(t){e.editingSkill=t?{...t}:{id:T(),name:"",emoji:"🤖",description:"",prompt:"",pinned:!1,createdAt:Date.now()},d()}async function Vn(){const t=e.editingSkill;if(!t||!t.name.trim()||!t.prompt.trim())return;const n=e.customSkills.findIndex(i=>i.id===t.id);n>=0?e.customSkills[n]=t:e.customSkills.push(t),X(),e.editingSkill=null;const a=window.electronAPI;if(a?.saveCustomSkill)try{const i=await a.saveCustomSkill({id:t.id,name:t.name,emoji:t.emoji,description:t.description,prompt:t.prompt});i?.folderName&&(t.folderName=i.folderName,X())}catch(i){console.warn("Failed to save skill to gateway:",i)}d()}async function Kn(t){const n=e.customSkills.find(i=>i.id===t);if(!n||!confirm(`确定要删除技能"${n.name}"吗？`))return;n.taxstoreSkillId&&e.taxstoreInstalledIds.delete(n.taxstoreSkillId),e.customSkills=e.customSkills.filter(i=>i.id!==t),X(),d();const a=window.electronAPI;if(a?.deleteCustomSkill)try{await a.deleteCustomSkill(t,n.name,n.folderName)}catch(i){console.warn("Failed to delete skill file:",i)}}async function Hn(t){const n=window.electronAPI;if(!n?.exportSkill){alert("导出功能不可用");return}try{const a=await n.exportSkill(t.id,t.name);a.ok?alert(`技能已导出到：${a.path}`):a.error!=="cancelled"&&alert(`导出失败：${a.error}`)}catch(a){alert(`导出失败：${a.message||a}`)}}async function Wn(){const t=document.createElement("input");t.type="file",t.accept=".zip",t.onchange=async()=>{const n=t.files?.[0];if(!n)return;const a=new FileReader;a.onload=async()=>{const o=a.result.split(",")[1],s=window.electronAPI;if(!s?.installSkillPackage){alert("当前环境不支持技能包安装");return}k("正在安装技能包...");try{const l=await s.installSkillPackage(o,n.name);if(!l?.ok){alert(`安装失败: ${l?.error||"未知错误"}`);return}const c={id:T(),name:l.skill?.name||n.name.replace(/\.zip$/i,""),emoji:l.skill?.emoji||"📦",description:l.skill?.description||"",prompt:l.skill?.prompt||"",pinned:!1,createdAt:Date.now(),folderName:l.folderName};e.customSkills.push(c),X(),d(),k(`技能"${c.name}"已安装，正在重启服务...`),P(`技能包已安装: ${c.name}`,"📦")}catch(l){alert(`安装失败: ${l.message}`)}},a.readAsDataURL(n)},t.click()}function Qn(t){const n=e.customSkills.find(a=>a.id===t);n&&(n.pinned=!n.pinned,X(),d())}function te(t){if(xs())return;e.activeCustomSkill=t,e.lastSkillName=t.folderName||`custom-${t.id.substring(0,8)}`;const n=`使用技能「${t.name}」`;e.draft.startsWith(n)||(e.draft=n+(e.draft?" "+e.draft:"")),e.sidePanel=null,d(),setTimeout(()=>{e.inputRef?.focus()},50)}function Xn(){e.activeCustomSkill=null,e.lastSkillName=null,d()}function Jn(t,n,a,i,o,s){if(!e.client)return;if(e.lastSkillName=t,i){const c=R.find(u=>u.folderName===t);c&&(e.activeCustomSkill=c),e.draft="请执行票据整理流程",o?.();return}if(e.attachments.length>0){e.draft=n,o?.();return}e.pendingSkill={name:t,prompt:n,displayLabel:a};const l=document.createElement("input");l.type="file",l.accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.xml",l.multiple=!0,l.onchange=()=>{l.files&&l.files.length>0?s?.(l.files):e.pendingSkill=null},l.click()}let Me=0;function xe(t){Me=t}let Q=[];function Gn(t){if(Q=[],!t)return;const n=t.split(/(?=【[^\n】]+】)/);for(const a of n){const i=a.trim();if(!i)continue;const o=i.match(/^【([^\n】]+)】/),s=o?o[1]:"unknown",l=o?i.slice(o[0].length).trim():i,c=[],u=l.match(/[\u4e00-\u9fa5]{2,}/g);if(u){const p=new Map;for(const h of u)p.set(h,(p.get(h)||0)+1);const m=[...p.entries()].sort((h,f)=>f[1]-h[1]);for(const[h]of m.slice(0,30))c.push(h)}const g=l.match(/[a-zA-Z]{3,}/g);if(g){const p=new Map;for(const m of g)p.set(m.toLowerCase(),(p.get(m.toLowerCase())||0)+1);for(const[m]of[...p.entries()].sort((h,f)=>f[1]-h[1]).slice(0,10))c.push(m)}Q.push({fileName:s,content:l,keywords:c})}console.log(`[Knowledge] Indexed ${Q.length} chunks`)}function Yn(t,n=4e3){if(Q.length===0)return e.folderKnowledge||"";if(Q.reduce((c,u)=>c+u.content.length,0)<=n)return Q.map(c=>`【${c.fileName}】
${c.content}`).join(`

`);const i=t.toLowerCase(),o=Q.map(c=>{let u=0;for(const g of c.keywords)i.includes(g.toLowerCase())&&(u+=2);return i.includes(c.fileName.toLowerCase())&&(u+=5),{chunk:c,score:u}});o.sort((c,u)=>u.score-c.score);const s=[];let l=0;for(const{chunk:c,score:u}of o){if(u===0&&s.length>0)break;const g=`【${c.fileName}】
${c.content}`;if(l+g.length>n&&s.length>0)break;s.push(g),l+=g.length}return s.join(`

`)}async function re(){const t=window.electronAPI;if(!(!t?.getFolderKnowledge||!e.authorizedFolder))try{const n=await t.getFolderKnowledge();n?.ok&&n.content&&(e.folderKnowledge=n.content,Gn(n.content),console.log(`Folder knowledge loaded: ${n.files?.length||0} files, ${n.content.length} chars`))}catch(n){console.warn("Failed to load folder knowledge:",n)}}async function V(){const t=window.electronAPI;if(!(!t?.listKnowledgeFiles||!e.authorizedFolder)){e.knowledgeLoading=!0,d();try{const n=await t.listKnowledgeFiles(e.authorizedFolder);n?.ok&&(e.knowledgeFiles=n.files||[])}catch(n){console.warn("Failed to list knowledge files:",n)}e.knowledgeLoading=!1,d()}}async function Zn(t){const n=window.electronAPI;if(!n?.copyToKnowledgeFolder||!e.authorizedFolder)return;const a=t.dataTransfer?.files;if(!(!a||a.length===0))for(let i=0;i<a.length;i++){const o=a[i],s=new FileReader;s.onload=async()=>{const c=s.result.split(",")[1];if(c){try{await n.copyToKnowledgeFolder({folderPath:e.authorizedFolder,fileName:o.name,base64Data:c})}catch(u){console.warn("Failed to copy file to knowledge folder:",u)}i===a.length-1&&(await V(),await re(),e.folderKnowledgeSent=!1)}},s.readAsDataURL(o)}}function Kt(t){e.knowledgeRefs.some(n=>n.name===t)||(e.knowledgeRefs.push({name:t}),d())}function ea(t){e.knowledgeRefs.splice(t,1),d()}async function ta(t){const n=window.electronAPI;if(!(!n?.deleteKnowledgeFile||!e.authorizedFolder))try{await n.deleteKnowledgeFile(e.authorizedFolder,t),e.knowledgeRefs=e.knowledgeRefs.filter(a=>a.name!==t),await V(),await re(),e.folderKnowledgeSent=!1}catch(a){console.warn("Failed to delete knowledge file:",a)}}async function js(t){const n=window.electronAPI;e.importingFolder=!0,e.importResult=null,d();try{const a=await n.importFolderToMemory(t);e.importingFolder=!1,a.ok?(e.authorizedFolder=a.folderPath,localStorage.setItem("taxbot_authorized_folder",a.folderPath),e.importResult=Ln(a),P(`文件夹已导入: ${e.importResult}`,"📂"),await re(),e.folderKnowledgeSent=!1,qs()):e.importResult=a.error||"导入失败"}catch(a){e.importingFolder=!1,e.importResult=a?.message||"导入失败"}d()}async function it(){const t=window.electronAPI;if(!t?.openFolderDialog)return;const n=await t.openFolderDialog();n&&await js(n)}async function sa(){e.authorizedFolder&&await js(e.authorizedFolder)}async function na(t){const n=window.electronAPI;if(!n?.copyToKnowledgeFolder)return;if(!e.authorizedFolder){k("请先在知识库中选择文件夹");return}const a=`Taxbot_${Is()}.doc`,i=Ps(t),o=btoa(unescape(encodeURIComponent(i)));try{await n.copyToKnowledgeFolder({folderPath:e.authorizedFolder,fileName:a,base64Data:o}),k(`已保存到知识库: ${a}`),await V(),await re(),e.folderKnowledgeSent=!1}catch(s){console.warn("Failed to save to knowledge:",s),k("保存失败")}}function qs(){const t=window.electronAPI;!t?.startFolderWatcher||!e.authorizedFolder||t.startFolderWatcher(e.authorizedFolder)}let Ht=!1;function aa(){if(Ht)return;const t=window.electronAPI;t?.onFolderKnowledgeUpdated&&(Ht=!0,t.onFolderKnowledgeUpdated(async n=>{console.log(`Folder watcher: ${n.count} new file(s) detected`),await re();const i=`新知识已学习: ${n.newFiles.length<=3?n.newFiles.join("、"):n.newFiles.slice(0,3).join("、")+` 等${n.newFiles.length}个文件`}`;k(i),P(i,"📚"),d()}))}async function ia(t){e.knowledgePreview={name:t.name,type:"text",content:"",url:"",loading:!0,error:null},d();const n=window.electronAPI;if(!n?.previewKnowledgeFile){e.knowledgePreview.error="预览功能不可用",e.knowledgePreview.loading=!1,d();return}try{const a=await n.previewKnowledgeFile(e.authorizedFolder,t.name,t.type);if(!e.knowledgePreview)return;a.ok?(e.knowledgePreview.type=a.type,e.knowledgePreview.content=a.content||"",e.knowledgePreview.url=a.url||"",a.extractedText&&(e.knowledgePreview.extractedText=a.extractedText)):(e.knowledgePreview.type="unsupported",e.knowledgePreview.error=a.error||"预览失败")}catch(a){e.knowledgePreview&&(e.knowledgePreview.error="预览失败: "+(a?.message||"未知错误"))}e.knowledgePreview&&(e.knowledgePreview.loading=!1),d()}function la(){e.knowledgePreview=null,e.knowledgeQuoteBtn=null,d()}function oa(t){const n=window.getSelection(),a=n?.toString().trim();if(!a||a.length<2){e.knowledgeQuoteBtn=null,d();return}const o=n.getRangeAt(0).getBoundingClientRect(),s=t.currentTarget,l=s.getBoundingClientRect();e.knowledgeQuoteBtn={visible:!0,x:o.left-l.left+o.width/2+s.scrollLeft,y:o.top-l.top-36+s.scrollTop,text:a},d()}function ra(){if(!e.knowledgeQuoteBtn?.text||!e.knowledgePreview)return;const n=`> 「${e.knowledgePreview.name}」${e.knowledgeQuoteBtn.text}

`;e.draft=n+e.draft,e.knowledgeQuoteBtn=null,window.getSelection()?.removeAllRanges(),d(),setTimeout(()=>{e.inputRef&&(e.inputRef.focus(),e.inputRef.style.height="auto",e.inputRef.style.height=e.inputRef.scrollHeight+"px")},50)}function ca(){e.knowledgePreview&&(e.knowledgePreview.pdfTextMode=!e.knowledgePreview.pdfTextMode,e.knowledgeQuoteBtn=null,d())}function da(){e.knowledgeQuoteBtn&&(e.knowledgeQuoteBtn=null,d())}let Wt=!1;function ua(){if(Wt)return;const t=window.electronAPI;t?.onManagedSkillsUpdated&&(Wt=!0,t.onManagedSkillsUpdated(()=>{console.log("Managed skills directory changed, syncing..."),Dt()}))}function ie(t,n){const a=e.messages;if(a.length===0)return"";const i=a.slice(-30),o=[];let s=0;for(const c of i){let u,g=!0;if(c.type==="user"){const p=c;p.targetAgentNames&&p.targetAgentNames.length>0?(u=`【用户→${p.targetAgentNames.join("、")}】${p.text}`,n&&(g=p.targetAgentNames.includes(n))):(u=`【用户→Taxbot】${p.text}`,g=!0)}else{const p=c,m=p.agentName||"Taxbot",h=p.agentEmoji||"";let f=c.text;n&&m!==n&&m!=="Taxbot"?(g=!1,f=f.length>80?f.slice(0,80)+"...":f):f.length>2e3&&(f=f.slice(0,2e3)+"...（已截断）"),u=g?`★【${h}${m}】${f}`:`【${h}${m}】${f}`}if(c.type==="user"&&g&&n&&(u="★"+u),s+u.length>Ys)break;o.push(u),s+=u.length}return o.length===0?"":`${n?`【以下是对话记录。标有 ★ 的是与你（${n}）直接相关的消息，其余为其他智能体的简要记录。你只需回复发给你的消息。】`:'【以下是当前群组对话记录。每条用户消息标注了发送目标（如"用户→Taxbot"表示发给Taxbot的）。你只需回复发给你的消息，不要回复发给其他智能体的消息。你可以参考对话上下文来理解背景，但不要主动回答别人的问题。】'}

${o.join(`

`)}`}function Ne(t){const n=t.trim();return!n||/^NO$/i.test(n)||n==="回复获取失败，请重试。"||n==="模型未能正确回复，请重新发送您的问题。"}function he(t,n){if(!e.collaborationTasks||!t)return;const a=e.collaborationTasks.find(o=>o.agentId===t);if(!a)return;if(a.status=n,n==="done"){let o="";for(let s=e.messages.length-1;s>=0;s--){const l=e.messages[s];if(l.type==="assistant"&&l.agentId===t){o=l.text;break}}a.result=o}if(e.collabQueue&&e.collabQueue.length>0){ga();return}e.collaborationTasks.every(o=>o.status==="done"||o.status==="error")&&pa()}function ga(){if(!e.collabQueue||e.collabQueue.length===0||!e.client)return;const t=e.collabQueue.shift();e.collabQueue.length===0&&(e.collabQueue=null);const n=t.agent?.name||t.agentId,a=e.collabMainResponse||"",i=e.collaborationTasks?.find(u=>u.agentId===t.agentId);i&&(i.status="working");const o=[];if(e.collaborationTasks)for(const u of e.collaborationTasks)u.status==="done"&&u.result&&o.push(`【${u.agentEmoji} ${u.agentName} 的结果】
${u.result.length>800?u.result.slice(0,800)+"...（已截断）":u.result}`);const s=_t(a,n);let l;s?l=`${s}

（以上是协调者为你分配的任务。用户的原始请求：${e.collabFinalMessage||""}）`:l=`协调者的分析如下：
${a}

请根据你的专长，回应用户的请求：${e.collabFinalMessage||""}`,o.length>0&&(l+=`

---
【其他智能体已完成的工作】
${o.join(`

`)}
---
请参考以上结果，避免重复，在此基础上完成你的任务。如需补充或修正其他智能体的内容也可以。`),l+=`

提示：如需其他智能体协助，请使用 @智能体名称 格式标注。`,(async()=>{if(t.agentId){const m=await Y(t.agentId);m&&(l=`【智能体记忆】
${m}
---

${l}`)}const u=ie([],n);u&&(l=`${u}

---

${l}`),e.activeRuns.set(t.sessionKey,{runId:null,sessionKey:t.sessionKey,agentId:t.agentId,agentName:t.agent?.name||null,agentEmoji:t.agent?.emoji||null,agentAvatarUrl:t.agent?.avatarUrl||null,thinkingLabel:"正在思考...",toolsActive:0,_retryCount:0,reactive:!1});const g=T(),p={sessionKey:t.sessionKey,message:l,deliver:!1,idempotencyKey:g};e.collabApiAttachments&&e.collabApiAttachments.length>0&&(p.attachments=e.collabApiAttachments),console.log(`[Orchestration-Seq] Dispatching to ${n} (${t.sessionKey})`),e.client.request("chat.send",p).then(m=>{console.log(`[Orchestration-Seq] ${n} accepted:`,m)}).catch(m=>{e.messages.push({type:"assistant",text:`${n} 任务发送失败：${String(m)}`,timestamp:Date.now(),id:T()}),e.activeRuns.delete(t.sessionKey),he(t.agentId,"error"),d()}),d()})()}function pa(){if(!e.collaborationTasks||!e.client){e.collaborationTasks=null,ne(),d();return}const t=e.collaborationTasks.filter(l=>l.status==="done"&&l.result);if(t.length===0){e.collaborationTasks=null,ne(),d();return}if(t.length===1){setTimeout(()=>{e.collaborationTasks=null,ne(),d()},2e3);return}const a=`以下是各智能体的协作结果：

${t.map(l=>`【${l.agentEmoji} ${l.agentName}】
${l.result}`).join(`

`)}

请综合以上所有智能体的内容，给用户一个完整、连贯的最终回答。如有冲突之处请指出并给出你的建议。`,i=ie();let o=a;i&&(o=`${i}

---

${a}`),setTimeout(()=>{e.collaborationTasks=null,d()},2e3),e.activeRuns.set(e.sessionKey,{runId:null,sessionKey:e.sessionKey,agentId:null,agentName:null,agentEmoji:null,agentAvatarUrl:null,thinkingLabel:"正在综合结果...",toolsActive:0,_retryCount:0,reactive:!1});const s=T();console.log("[Orchestration-Seq] Synthesizing results via main agent"),e.client.request("chat.send",{sessionKey:e.sessionKey,message:o,deliver:!1,idempotencyKey:s}).then(l=>{console.log("[Orchestration-Seq] Synthesis accepted:",l)}).catch(l=>{e.messages.push({type:"assistant",text:`综合结果失败：${String(l)}`,timestamp:Date.now(),id:T()}),e.activeRuns.delete(e.sessionKey),d()}),ne(),d()}function ne(){e.collabQueue=null,e.collabFinalMessage=null,e.collabApiAttachments=null,e.collabMainResponse=null}function ke(t){const n=e.activeRuns.get(t);if(!n)return;const a=!tn(t)&&!Ts(t),i=ve(t);if(i.filter(m=>m.type==="assistant").some(m=>!Ne(m.text||""))){const m=i.filter(f=>f.type==="assistant"&&Ne(f.text||"")?(console.log("[finishSending] Removing bad message:",(f.text||"").substring(0,40)),!1):!0);if(a){const f=t.startsWith("taxchat-")?t.slice(8):t;e.backgroundMessages.set(f,m),me(f,m),e.unreadConversations.add(f);const w=e.conversations.find(x=>x.id===f);w&&(w.updatedAt=Date.now(),w.messageCount=m.length)}else e.messages=m,Ze();e.activeRuns.delete(t),he(n.agentId,"done"),t===e.sessionKey&&e.pendingDispatch&&Gt();const h=e.collaborationTasks!==null||e.collabQueue!==null;if(!n.reactive&&n.agentId&&!h&&Yt(n),!a&&e.lastSingleMentionAgent&&!e.draft.trim()&&!h){const f=e.lastSingleMentionAgent.name;e.draft=`@${f} `}d();return}const l=i[i.length-1],c=(l?.text||"").trim(),u=l?.type==="assistant"&&/^NO$/i.test(c),g=l?.type==="assistant"&&c==="回复获取失败，请重试。";if((u||g)&&n._retryCount<1){n._retryCount++,console.log(`[AutoRetry] Model responded with "${c}", retrying (attempt ${n._retryCount}) for ${t}`),i.pop(),n.thinkingLabel="正在重试...",n.toolsActive=0,n.runId=null,d();const m=T();e.client?.request("chat.send",{sessionKey:t,message:"请直接回答上面的问题。",deliver:!1,idempotencyKey:m}).catch(h=>{if(console.error("Auto-retry send failed:",h),e.activeRuns.delete(t),he(n.agentId,"error"),a){const f=t.startsWith("taxchat-")?t.slice(8):t;me(f,i),e.unreadConversations.add(f)}else Ze();d()});return}if(e.activeRuns.delete(t),he(n.agentId,"done"),a){const m=t.startsWith("taxchat-")?t.slice(8):t;me(m,i),e.unreadConversations.add(m);const h=e.conversations.find(f=>f.id===m);h&&(h.updatedAt=Date.now(),h.messageCount=i.length)}else Ze();t===e.sessionKey&&e.pendingDispatch&&Gt();const p=e.collaborationTasks!==null||e.collabQueue!==null;!n.reactive&&n.agentId&&!p&&Yt(n),d()}const Qt=1500,va=1e4,Xt=12e4,O=new Map;function ma(t){if(!t?.messages||t.messages.length===0)return"";const n=t.messages;let a=-1;for(let s=n.length-1;s>=0;s--)if(n[s].role==="user"){a=s;break}const i=a>=0?a+1:0,o=[];for(let s=i;s<n.length;s++)if(n[s].role==="assistant"){const l=Oe(n[s]);l&&!Fe(l)&&o.push(l)}if(o.length===0)for(let s=i;s<n.length;s++){const l=n[s].content;if(Array.isArray(l)){for(const c of l)if(c?.type==="tool_result"){const u=c.content;if(typeof u=="string"&&u.trim())o.push(u.trim());else if(Array.isArray(u))for(const g of u)g?.type==="text"&&typeof g.text=="string"&&g.text.trim()&&o.push(g.text.trim())}}}return o.join(`

`)}function lt(t,n,a){const i=ve(n),o=i.findIndex(s=>s.type==="assistant"&&s.id===t);if(o>=0)a.length>(i[o].text||"").length&&(i[o].text=a);else{const s=e.activeRuns.get(n);i.push({type:"assistant",text:a,timestamp:Date.now(),id:t,agentId:s?.agentId||void 0,agentEmoji:s?.agentEmoji||void 0,agentName:s?.agentName||void 0,agentAvatarUrl:s?.agentAvatarUrl||void 0})}}function Jt(t,n){O.get(n)?.abort();const a=new AbortController;O.set(n,a);const i=a.signal,o=Date.now();let s=Date.now(),l="";const c=()=>{if(i.aborted||!e.activeRuns.has(n)){O.delete(n);return}if(Date.now()-o>Xt){l&&lt(t,n,l),ke(n),O.delete(n);return}e.client?.request("chat.history",{sessionKey:n,limit:20}).then(u=>{if(i.aborted||!e.activeRuns.has(n)){O.delete(n);return}const g=ma(u);if(g&&g!==l&&(s=Date.now(),l=g,lt(t,n,g),d()),l.length>0&&Date.now()-s>va){lt(t,n,l),ke(n),O.delete(n);return}setTimeout(c,Qt)}).catch(()=>{i.aborted||(Date.now()-o<Xt?setTimeout(c,Qt):(l||!e.messages.some(g=>g.type==="assistant"&&!Ne(g.text||""))&&!e.messages.some(g=>g.id===t)&&e.messages.push({type:"assistant",text:"回复获取失败，请重试。",timestamp:Date.now(),id:t}),ke(n),O.delete(n)))})};setTimeout(c,800)}function fa(t){const n=O.get(t);n&&(n.abort(),O.delete(t))}function ha(){for(let t=e.messages.length-1;t>=0;t--)if(e.messages[t].type==="assistant")return e.messages[t].text||"";return""}function _t(t,n){const a=[new RegExp(`【分配给\\s*${fe(n)}】([\\s\\S]*?)(?=【分配给|$)`,"i"),new RegExp(`【${fe(n)}】([\\s\\S]*?)(?=【|$)`,"i"),new RegExp(`(?:^|\\n)\\*?\\*?${fe(n)}\\*?\\*?[：:]([\\s\\S]*?)(?=\\n\\*?\\*?\\S+[：:]|$)`,"im")];for(const i of a){const o=t.match(i);if(o&&o[1]?.trim())return o[1].trim()}return null}async function Gt(){const t=e.pendingDispatch;if(!t||!e.client){e.pendingDispatch=null;return}e.pendingDispatch=null;const n=ha();if(!n){console.warn("[Orchestration] No main response found, skipping dispatch");return}console.log("[Orchestration-Seq] Main responded, dispatching agents sequentially:",t.targets.map(l=>l.agent?.name));const a=[],i=[];for(const l of t.targets){if(pe(l.sessionKey))continue;i.push(l);const c=l.agent?.name||l.agentId,u=_t(n,c);a.push({agentId:l.agentId,agentName:c,agentEmoji:l.agent?.emoji||"🤖",task:u?u.length>60?u.slice(0,60)+"...":u:"处理用户请求",status:"pending"})}if(i.length===0)return;e.collaborationTasks=a,e.collabMainResponse=n,e.collabFinalMessage=t.finalMessage,e.collabApiAttachments=[...t.apiAttachments],e.collabQueue=i.slice(1),e.collabQueue.length===0&&(e.collabQueue=null);const o=i[0],s=a.find(l=>l.agentId===o.agentId);s&&(s.status="working"),ka(o,n,t.finalMessage,t.apiAttachments),d()}async function ka(t,n,a,i){if(!e.client)return;const o=t.agent?.name||t.agentId,s=_t(n,o);let l;if(s?l=`${s}

（以上是协调者为你分配的任务。用户的原始请求：${a}）

提示：如需其他智能体协助，请使用 @智能体名称 格式标注。`:l=`协调者的分析如下：
${n}

请根据你的专长，回应用户的请求：${a}

提示：如需其他智能体协助，请使用 @智能体名称 格式标注。`,t.agentId){const p=await Y(t.agentId);p&&(l=`【智能体记忆】
${p}
---

${l}`)}const c=ie([],o);c&&(l=`${c}

---

${l}`),e.activeRuns.set(t.sessionKey,{runId:null,sessionKey:t.sessionKey,agentId:t.agentId,agentName:t.agent?.name||null,agentEmoji:t.agent?.emoji||null,agentAvatarUrl:t.agent?.avatarUrl||null,thinkingLabel:"正在思考...",toolsActive:0,_retryCount:0,reactive:!1});const u=T(),g={sessionKey:t.sessionKey,message:l,deliver:!1,idempotencyKey:u};i.length>0&&(g.attachments=i),console.log(`[Orchestration-Seq] Dispatching first agent: ${o} (${t.sessionKey})`),e.client.request("chat.send",g).then(p=>{console.log(`[Orchestration-Seq] ${o} accepted:`,p)}).catch(p=>{e.messages.push({type:"assistant",text:`${o} 任务发送失败：${String(p)}`,timestamp:Date.now(),id:T()}),e.activeRuns.delete(t.sessionKey),he(t.agentId,"error"),d()})}function ba(t,n){if(t.includes(`@${n}`)||new RegExp(`【[^】]*${fe(n)}[^【]*】`).test(t))return!0;if(n.length>=3){const a=`(?:^|[\\s，。、！？：；""''（）《》])${fe(n)}(?:$|[\\s，。、！？：；""''（）《》])`;if(new RegExp(a,"m").test(t))return!0}return!1}function Yt(t){if(!e.client)return;let n="";for(let o=e.messages.length-1;o>=0;o--){const s=e.messages[o];if(s.type==="assistant"&&s.agentId===t.agentId){n=s.text;break}}if(!n||n.length<5)return;const a=[];for(const o of e.agentsList)o.id!==t.agentId&&(o.isDefault||ba(n,o.name)&&a.push(o));if(a.length===0)return;const i=t.agentName||"智能体";for(const o of a){const s=`agent:${o.id}:main`;if(pe(s))continue;const l=`${i}在回复中提到了你（${o.name}）。以下是${i}的回复：

${n.length>800?n.slice(0,800)+"...（已截断）":n}

请根据对话上下文判断，如果${i}的回复涉及你的专长或需要你补充，请给出你的回复。如果与你无关，请简短回复"无需补充"即可。`,c=ie([],o.name);let u=l;c&&(u=`${c}

---

${l}`),console.log(`[Reactive] ${i} mentioned ${o.name}, dispatching`),e.activeRuns.set(s,{runId:null,sessionKey:s,agentId:o.id,agentName:o.name,agentEmoji:o.emoji,agentAvatarUrl:o.avatarUrl||null,thinkingLabel:"正在思考...",toolsActive:0,_retryCount:0,reactive:!0});const g=T();e.client.request("chat.send",{sessionKey:s,message:u,deliver:!1,idempotencyKey:g}).then(p=>{console.log(`[Reactive] ${o.name} accepted:`,p)}).catch(p=>{e.messages.push({type:"assistant",text:`${o.name} 响应失败：${String(p)}`,timestamp:Date.now(),id:T()}),e.activeRuns.delete(s),d()})}d()}async function Pe(t){const n=Array.from(t);console.log("handleFiles called with",n.length,"files");for(const a of n){if(console.log("Processing file:",a.name,"size:",a.size,"type:",a.type),a.size>10*1024*1024){e.lastError=`文件"${a.name}"过大（>10MB），请选择更小的文件`,d();continue}try{const i=await Cn(a);console.log("File read as data URL, length:",i.length),e.attachments.push({name:a.name,type:a.type,size:a.size,dataUrl:i}),console.log("File added to attachments, total:",e.attachments.length)}catch(i){e.lastError=`无法读取文件"${a.name}"：${String(i)}`,console.error("File read error:",i)}}if(console.log("Final attachments count:",e.attachments.length),e.pendingSkill&&e.attachments.length>0){const a=e.pendingSkill;e.pendingSkill=null,e.draft=a.prompt,d(),ze();return}d()}async function ze(){if(!e.client||!e.draft.trim()&&e.attachments.length===0)return;const t=e.draft.trim(),n=T(),{mentions:a,cleanText:i}=zn(t),o=[];let s=!1;for(const b of a)if(b.isDefault)s=!0;else{const $=`agent:${b.agentId}:main`,D=e.agentsList.find(M=>M.id===b.agentId)||null;o.push({sessionKey:$,agentId:b.agentId,agent:D})}const l=o.length>=2,c=[];if(l)c.push({sessionKey:e.sessionKey,agentId:null,agent:null});else if(a.length===0)c.push({sessionKey:e.sessionKey,agentId:null,agent:null});else{s&&c.push({sessionKey:e.sessionKey,agentId:null,agent:null});for(const b of o)c.push(b)}const u=[],g=[];for(const b of c)if(pe(b.sessionKey)){const $=b.agent?`${b.agent.emoji||"🤖"} ${b.agent.name}`:"智能体";u.push($)}else g.push(b);if(l){for(const b of o)if(pe(b.sessionKey)){const $=b.agent?`${b.agent.emoji||"🤖"} ${b.agent.name}`:"智能体";u.includes($)||u.push($)}}if(u.length>0&&k(`${u.join("、")} 正在工作中，请稍等，或安排其它智能体处理`),g.length===0)return;for(const b of g)e.activeRuns.set(b.sessionKey,{runId:null,sessionKey:b.sessionKey,agentId:b.agentId,agentName:b.agent?.name||null,agentEmoji:b.agent?.emoji||null,agentAvatarUrl:b.agent?.avatarUrl||null,thinkingLabel:l?"正在分析任务...":"正在思考...",toolsActive:0,_retryCount:0,reactive:!1});e.lastSkillName=null;const p=e.activeCustomSkill;e.activeCustomSkill=null;const m=a.length>0?i:t;let h=p;if(!h&&m){const b=m.toLowerCase();for(const $ of e.customSkills)if($.prompt&&$.name&&b.includes($.name.toLowerCase())){h=$;break}if(!h){for(const $ of R)if($.prompt&&$.name&&b.includes($.name.toLowerCase())){h=$;break}}}let f;if(h&&h.prompt){let b="";h.id==="__builtin_knowledge-base"&&e.authorizedFolder&&(b=`

【知识库路径】
${e.authorizedFolder}`),f=`请严格按照以下操作流程处理用户的输入。

【${h.name} - 操作流程】
${h.prompt}

【用户输入】
${m}${b}`,console.log(`[Skill] Embedded prompt for skill "${h.name}", prompt length: ${h.prompt.length}`)}else h?(f=`请按照${h.name}的操作流程处理以下内容。

${m}`,console.log(`[Skill] Skill "${h.name}" active but no prompt text`)):f=m;const w=e.attachments.length>0,x=e.attachments.some(b=>b.type.startsWith("image/")),C=e.attachments.some(b=>b.type==="application/pdf"||b.type.includes("word")||b.type.includes("excel")||b.type.includes("document")),y=t||`(${e.attachments.length} 个文件)`;w&&!h?m?x&&(f=`${m}

（注：请先识别并提取图片中的文字内容，然后结合我的问题进行分析）`):x&&C?f="请分析这些图片和文档，提取其中的文字内容并总结要点。":x?f="请提取图片中的所有文字内容，保持原有的结构和格式。如果图片中没有文字，请描述图片的内容。":C&&(f="请分析这个文档，提取并总结其中的主要内容。"):w&&h&&x&&(f+=`

（注：请先识别并提取图片中的文字内容，然后结合操作流程进行分析）`);const S=e.replyingTo;if(S){const b=S.type==="user"?"用户":S.agentName||"Taxbot",$=S.text.length>300?S.text.slice(0,300)+"...":S.text;f=`【引用 ${b} 的消息】：${$}

${f}`}const ce=e.attachments.length>0?[...e.attachments]:void 0;e.messages.push({type:"user",text:y,timestamp:Date.now(),id:n,attachments:ce,targetAgentNames:a.length>0?a.map(b=>b.agentName):void 0,replyToId:S?.id}),xn(),G(),e.replyingTo=null;for(const b of a)Rs(b.agentId);if(o.length===1){const b=o[0];e.lastSingleMentionAgent={id:b.agentId,name:b.agent?.name||b.agentId}}else e.lastSingleMentionAgent=null;e.draft="",d();let I=e.attachments.map(b=>{const $=/^data:([^;]+);base64,(.+)$/.exec(b.dataUrl);if(!$)return console.warn("Failed to parse data URL for file:",b.name),null;const D=$[1];let M="document";D.startsWith("image/")&&(M="image");const F={type:M,mimeType:D,fileName:b.name,content:$[2]};return console.log(`Prepared attachment: ${b.name}, type: ${M}, mime: ${D}, base64 length: ${$[2].length}`),F}).filter(b=>b!==null);console.log(`Total attachments prepared: ${I.length}`);let Je="";if(C&&(Je=await qn(e.attachments),Je&&(f+=`

【文件内容】
${Je}`)),I=I.filter(b=>b.type==="image"),e.attachments=[],e.knowledgeRefs.length>0){const b=window.electronAPI;if(b?.readKnowledgeFile){const $=[];for(const D of e.knowledgeRefs)try{const M=await b.readKnowledgeFile(D.name);M?.ok&&M.content&&$.push(`【知识库引用: ${D.name}】
${M.content}`)}catch{}$.length>0&&(f=`${f}

---
${$.join(`

`)}
---`)}e.knowledgeRefs=[],d()}if(e.folderKnowledge&&!e.folderKnowledgeSent){const b=Yn(m||f);b&&(f=`${f}

---
【已导入知识库文件内容】
以下是与你的问题相关的知识库内容：
${b}
---`),e.folderKnowledgeSent=!0}const Ge=f||(I.length>0?"(查看附件)":"");if(l){const $=`用户同时@了以下智能体协同工作：${o.map(q=>`${q.agent?.emoji||"🤖"} ${q.agent?.name||q.agentId}`).join("、")}。

请分析用户的意图，根据每个智能体的专长为它们分配具体的子任务。回复格式要求：
1. 先简要说明你的任务分解思路
2. 然后用以下格式为每个智能体分配任务：

【分配给 智能体名称】
具体的任务描述...

用户的原始请求：${Ge}`,D=o.filter(q=>!pe(q.sessionKey));e.pendingDispatch={targets:D,finalMessage:Ge,apiAttachments:[...I]};const M=ie(g.map(q=>q.sessionKey));let F=$;M&&(F=`${M}

---

${$}`);const j=T(),Et={sessionKey:e.sessionKey,message:F,deliver:!1,idempotencyKey:j};I.length>0&&(Et.attachments=I),console.log("[Orchestration] Sending to main for task dispatch:",e.sessionKey),e.client.request("chat.send",Et).then(q=>{console.log("[Orchestration] Main accepted:",q)}).catch(q=>{e.messages.push({type:"assistant",text:`任务分配失败：${String(q)}`,timestamp:Date.now(),id:T()}),e.activeRuns.delete(e.sessionKey),e.pendingDispatch=null,d()});return}for(const b of g){let $=Ge;if(b.agentId){const j=await Y(b.agentId);j&&($=`【智能体记忆 — 以下是你在之前对话中积累的重要结论和知识，请参考】
${j}
---

${$}`)}const D=ie([],b.agent?.name);D&&($=`${D}

---

${$}`);const M=T(),F={sessionKey:b.sessionKey,message:$,deliver:!1,idempotencyKey:M};I.length>0&&(F.attachments=I),console.log(`Sending chat.send to ${b.sessionKey}:`,{...F,attachments:I.map(j=>({...j,content:j.content.substring(0,50)+"..."}))}),e.client.request("chat.send",F).then(j=>{console.log(`Chat.send response (${b.sessionKey}):`,j)}).catch(j=>{e.messages.push({type:"assistant",text:`抱歉，发送消息时出错（${b.agent?.name||"默认"}）：${String(j)}`,timestamp:Date.now(),id:T()}),e.activeRuns.delete(b.sessionKey),d()})}}function wa(t){!e.client||!e.activeRuns.get(t)||(fa(t),e.client.request("chat.abort",{sessionKey:t}).catch(()=>{}),e.activeRuns.delete(t),t===e.sessionKey&&e.pendingDispatch&&(e.pendingDispatch=null),e.collaborationTasks&&(e.collaborationTasks=null,ne()),d())}function $a(){e.messages=[],e.draft="",e.activeRuns.clear(),e.pendingDispatch=null,e.collaborationTasks=null,e.lastSingleMentionAgent=null,ne(),e.favorites.clear(),e.sidePanel=null,e.confirmingClear=!1,e.folderKnowledgeSent=!1,Mt(),G(),d()}async function ya(){if(e.confirmingSessionClear=!1,!e.client||!e.connected){k("未连接到服务"),d();return}try{await e.client.request("sessions.delete",{key:e.sessionKey,deleteTranscript:!0}),e.messages=[],e.draft="",e.activeRuns.clear(),e.folderKnowledgeSent=!1,G(),k("会话已清空")}catch(t){k("清空失败: "+(t?.message||String(t)))}d()}function Zt(){const t=window.electronAPI;t?.quitApp?t.quitApp():window.close()}let ht=[],kt=!1;function U(t){ht.push(t),kt||(kt=!0,queueMicrotask(xa))}function xa(){for(;ht.length>0;){const t=ht.shift();try{t()}catch(n){console.error("[UpdateQueue] Error in queued update:",n)}}kt=!1,d()}let ae=null,De=0,_e=!1;function bt(){ae&&(clearTimeout(ae),ae=null)}function Ta(){if(ae||_e)return;De++;const t=Math.min(2e3*De,1e4);console.log(`[Reconnect] attempt ${De} in ${t}ms`),ae=setTimeout(()=>{ae=null,le()},t)}async function le(){_e=!0,bt(),e.lastError=null,e.client&&(e.client.stop(),e.client=null);let t;try{const n=window.electronAPI;if(n?.getGatewayPort){const a=await n.getGatewayPort();a&&a!==18789&&(e.gatewayUrl=`ws://127.0.0.1:${a}`,console.log(`[Gateway] Using port ${a}`))}n?.getGatewayToken&&(t=await n.getGatewayToken()||void 0)}catch{}t||(t=new URLSearchParams(window.location.search).get("token")||void 0),_e=!1,e.client=new Xs({url:e.gatewayUrl,clientName:"webchat-ui",mode:"webchat",token:t,onHello:n=>{e.connected=!0,e.hello=n,e.lastError=null,De=0,bt(),d(),oe()},onClose:({code:n})=>{e.connected=!1,!_e&&(n!==1012&&(e.lastError="正在等待服务启动..."),d(),Ta())},onEvent:n=>{if(console.log("Gateway event:",n.event,n.payload),n.event==="agent"){const a=n.payload,i=a?.sessionKey?String(a.sessionKey):"",o=i?Ot(i):null;if(!o&&i)return;if(a?.stream==="tool"&&a?.data){const s=a.data.phase,l=a.data.name||"";s==="start"&&o?U(()=>{o.toolsActive=(o.toolsActive||0)+1,o.thinkingLabel=_n(l)}):s==="result"&&o&&U(()=>{o.toolsActive=Math.max(0,(o.toolsActive||0)-1),o.thinkingLabel="正在思考..."})}else if(a?.stream==="lifecycle"&&a?.data?.phase==="end"){if(o){U(()=>{o.toolsActive=0});const s=o.runId||a.runId||T(),l=o.sessionKey;setTimeout(()=>{e.activeRuns.has(l)&&(console.log("Lifecycle end triggered fetchCompleteResponse (safety net) for",l),U(()=>{const c=e.activeRuns.get(l);c&&(c.thinkingLabel="正在整理回复...")}),Jt(s,l))},300)}setTimeout(()=>Dt(),2e3)}else a?.stream==="assistant"&&o&&o.thinkingLabel&&o.thinkingLabel!=="正在思考..."&&U(()=>{o.thinkingLabel="正在思考..."})}if(n.event==="chat"){const a=n.payload,i=a?.sessionKey?String(a.sessionKey):"",o=i?Ot(i):null;if(!o&&i)return;if(console.log("Chat message received:",a.message,"state:",a.state,"session:",i),a.state==="delta"&&a?.message){const s=typeof a.message=="string"?a.message:Oe(a.message);s&&!Fe(s)&&o&&U(()=>{!o.runId&&a.runId&&(o.runId=a.runId);const l=ve(o.sessionKey),c=l.findIndex(u=>u.type==="assistant"&&u.id===a.runId);c>=0?l[c].text=s:l.push({type:"assistant",text:s,timestamp:Date.now(),id:a.runId,agentId:o.agentId||void 0,agentEmoji:o.agentEmoji||void 0,agentName:o.agentName||void 0,agentAvatarUrl:o.agentAvatarUrl||void 0})})}a.state==="final"&&o&&U(()=>{if(!o.runId&&a.runId&&(o.runId=a.runId),o.runId&&a.runId!==o.runId){console.log("Ignoring final from different run:",a.runId,"expected:",o.runId);return}let s="";if(a?.message){const c=typeof a.message=="string"?a.message:Oe(a.message);c&&!Fe(c)&&(s=c)}if(s){const c=ve(o.sessionKey),u=c.findIndex(g=>g.type==="assistant"&&g.id===a.runId);u>=0?c[u].text=s:c.push({type:"assistant",text:s,timestamp:Date.now(),id:a.runId,agentId:o.agentId||void 0,agentEmoji:o.agentEmoji||void 0,agentName:o.agentName||void 0,agentAvatarUrl:o.agentAvatarUrl||void 0})}if(o.toolsActive>0){console.log("Tools still active ("+o.toolsActive+"), deferring fetchCompleteResponse for",o.sessionKey);return}const l=o.runId||a.runId;s&&!Ne(s)?(console.log("[final] Inline text is good, finishing immediately for",o.sessionKey),ke(o.sessionKey)):(console.log("[final] No good inline text, falling back to polling for",o.sessionKey),o.thinkingLabel="正在整理回复...",Jt(l,o.sessionKey))}),a.state==="error"&&o&&U(()=>{const s=ve(o.sessionKey),l=a.errorMessage||"处理请求时出错";s.push({type:"assistant",text:`错误：${l}`,timestamp:Date.now(),id:T()}),ke(o.sessionKey)})}}}),e.client.start()}function Aa(){const t=new Set,n=[];for(const a of e.modelList){const i=a.provider||"unknown";t.has(i)||(t.add(i),n.push(i))}return n}function wt(t){return e.modelList.filter(n=>n.provider===t)}function Sa(t){e.modelConfigDraft.provider=t,e.modelConfigDraft.baseUrl="",e.modelConfigDraft.apiKey="",e.modelConfigDraft.api="openai-completions",e.apiKeyVisible=!1;const n=e.currentModelConfig?.providers;if(n&&typeof n=="object"){const i=n[t];i&&(e.modelConfigDraft.baseUrl=i.baseUrl||"",e.modelConfigDraft.apiKey=i.apiKey||"",e.modelConfigDraft.api=i.api||"openai-completions")}const a=wt(t);e.modelConfigDraft.modelId=a.length>0?a[0].id:"",d()}function Ca(t){e.modelConfigDraft.modelId=t,d()}function Ia(t){const n=t?.models?.providers;if(!n||typeof n!="object")return;const a=Object.keys(n);if(a.length===0)return;const i=a[0],o=n[i],s=o?.models?.[0]?.id||"",l=o?.baseUrl||"",c=o?.apiKey||"";e.modelConfigDraft={provider:i,baseUrl:l,apiKey:c,api:o?.api||"openai-completions",modelId:s},e.activeModel={provider:i,modelId:s,baseUrl:l,apiKey:c}}async function es(){if(!e.client||!e.connected){e.modelError="未连接到服务",d();return}e.modelLoading=!0,e.modelError=null,d();try{const[t,n]=await Promise.all([e.client.request("models.list",{}),e.client.request("config.get",{})]);e.modelList=Array.isArray(t?.models)?t.models:[],e.configBaseHash=n?.hash||null,e.currentModelConfig=n?.config?.models||null,Ia(n?.config)}catch(t){e.modelError=t?.message||String(t)}e.modelLoading=!1,d()}async function Ma(){if(!e.client||!e.connected){e.modelError="未连接到服务",d();return}const t=e.modelConfigDraft;if(!t.provider.trim()){e.modelError="请填写提供商名称",d();return}if(!t.baseUrl.trim()){e.modelError="请填写 API 地址",d();return}if(!t.modelId.trim()){e.modelError="请填写模型 ID",d();return}e.modelSaving=!0,e.modelError=null,d();try{const n={models:{providers:{[t.provider.trim()]:{baseUrl:t.baseUrl.trim(),apiKey:t.apiKey.trim()||void 0,api:t.api,models:[{id:t.modelId.trim(),name:t.modelId.trim(),reasoning:!1,input:["text","image"],cost:{input:0,output:0,cacheRead:0,cacheWrite:0},contextWindow:128e3,maxTokens:8192}]}}}};await e.client.request("config.patch",{baseHash:e.configBaseHash,raw:JSON.stringify(n),note:"模型配置更新",restartDelayMs:1e3}),k("模型配置已保存，服务正在重启..."),e.settingsView="main"}catch(n){e.modelError=n?.message||String(n)}e.modelSaving=!1,d()}let $t=[];function Pa(t){$t=t}function Ve(){const t=e.commandFilter.toLowerCase().replace(/^\//,"");return t?$t.filter(n=>n.name.toLowerCase().includes(t)||n.id.toLowerCase().includes(t)||n.description.toLowerCase().includes(t)):$t}function Da(){e.commandPaletteVisible=!0,e.commandFilter=e.draft,e.commandIndex=0,d()}function Ke(){e.commandPaletteVisible=!1,e.commandFilter="",e.commandIndex=0,d()}function _a(t){Ke(),e.draft="",t.action(),d()}function Ra(){const t=e.draft.trim();return t.startsWith("/")&&!t.includes(" ")?(e.commandPaletteVisible?(e.commandFilter=t,e.commandIndex=0,d()):Da(),!0):(e.commandPaletteVisible&&Ke(),!1)}function ts(t){const n=Ve();n.length!==0&&(t==="up"?e.commandIndex=(e.commandIndex-1+n.length)%n.length:e.commandIndex=(e.commandIndex+1)%n.length,d())}function ja(){const t=Ve();t.length>0&&e.commandIndex<t.length&&_a(t[e.commandIndex])}function Ls(t,n){const a=URL.createObjectURL(t),i=document.createElement("a");i.href=a,i.download=n,document.body.appendChild(i),i.click(),document.body.removeChild(i),URL.revokeObjectURL(a)}function qa(){if(e.messages.length===0)return;const n=e.conversations.find(s=>s.id===e.currentConversationId)?.title||"对话",a=[`# ${n}`,""];for(const s of e.messages)if(s.type==="user"){const l=s;a.push("## 用户"),a.push(l.text),a.push("")}else if(s.type==="assistant"){const l=s,c=l.agentName?`${l.agentEmoji||"🤖"} ${l.agentName}`:"Taxbot";a.push(`## ${c}`),a.push(l.text),a.push("")}const i=a.join(`
`),o=new Blob([i],{type:"text/markdown;charset=utf-8"});Ls(o,`${n}_${new Date().toISOString().slice(0,10)}.md`)}function La(){if(e.messages.length===0)return;const n=e.conversations.find(s=>s.id===e.currentConversationId)?.title||"对话";let a="";for(const s of e.messages)if(s.type==="user"){const c=de(s.text);a+=`<div class="msg user"><div class="role">用户</div><div class="content">${c}</div></div>
`}else if(s.type==="assistant"){const l=s,c=l.agentName?`${l.agentEmoji||"🤖"} ${l.agentName}`:"Taxbot",u=de(l.text);a+=`<div class="msg assistant"><div class="role">${de(c)}</div><div class="content">${u}</div></div>
`}const i=`<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<title>${de(n)}</title>
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
<h1>${de(n)}</h1>
${a}
<div class="footer">导出于 ${new Date().toLocaleString("zh-CN")}</div>
</body>
</html>`,o=new Blob([i],{type:"text/html;charset=utf-8"});Ls(o,`${n}_${new Date().toISOString().slice(0,10)}.html`)}function de(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/\n/g,"<br>")}function Es(){e.searchOpen=!0,e.searchQuery="",e.searchResults=[],e.searchIndex=0,d(),setTimeout(()=>{document.getElementById("taxchat-search-input")?.focus()},50)}function ss(){e.searchOpen=!1,e.searchQuery="",e.searchResults=[],e.searchIndex=0,d()}function Ea(t){if(e.searchQuery=t,!t.trim()){e.searchResults=[],e.searchIndex=0,d();return}const n=t.toLowerCase(),a=[];for(const i of e.messages)i.text&&i.text.toLowerCase().includes(n)&&i.id&&a.push(i.id);e.searchResults=a,e.searchIndex=a.length>0?0:-1,d(),a.length>0&&Rt()}function ns(){e.searchResults.length!==0&&(e.searchIndex=(e.searchIndex+1)%e.searchResults.length,d(),Rt())}function as(){e.searchResults.length!==0&&(e.searchIndex=(e.searchIndex-1+e.searchResults.length)%e.searchResults.length,d(),Rt())}function Rt(){const t=e.searchResults[e.searchIndex];if(!t)return;const n=document.querySelector(`[data-msg-id="${t}"]`);n&&(n.scrollIntoView({behavior:"smooth",block:"center"}),n.classList.add("search-highlight"),setTimeout(()=>n.classList.remove("search-highlight"),2e3))}const A="https://taxbot.cc:8443/api/open";async function Ba(t,n){const a=await fetch(`${A}/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t,password:n})});if(!a.ok){const i=await a.json().catch(()=>({}));throw new Error(i.error||`登录失败 (${a.status})`)}return a.json()}async function jt(t){const n=await fetch(`${A}/me`,{headers:{Authorization:`Bearer ${t}`}});if(!n.ok)throw new Error("token 无效或已过期");const a=await n.json();return a.user??a}async function Oa(t){const n=new URLSearchParams;t.page&&n.set("page",String(t.page)),n.set("limit",String(t.limit)),t.q&&n.set("q",t.q),t.category&&n.set("category",t.category),t.sort&&n.set("sort",t.sort);const a={};t.token&&(a.Authorization=`Bearer ${t.token}`);const i=await fetch(`${A}/skills?${n}`,{headers:a});if(!i.ok)throw new Error(`获取技能列表失败 (${i.status})`);return i.json()}async function Fa(t,n){const a={};n&&(a.Authorization=`Bearer ${n}`);const i=await fetch(`${A}/skills/${t}`,{headers:a});if(!i.ok)throw new Error(`获取技能详情失败 (${i.status})`);return i.json()}async function Ua(t,n){const a=await fetch(`${A}/skills/${t}/download`,{headers:{Authorization:`Bearer ${n}`}});if(a.status===402){const s=await a.json().catch(()=>({}));throw new Error(s.error||`积分不足 (需要: ${s.required??"?"}, 当前: ${s.current??"?"})`)}if(a.status===401)throw new Error("请先登录 TaxStore 账户");if(!a.ok){const s=await a.json().catch(()=>({}));throw console.warn("[TaxStore] Download failed:",a.status,s),new Error(s.error||`下载失败 (${a.status})`)}const i=await a.blob(),o=a.headers.get("X-Already-Purchased")==="1";return{blob:i,alreadyPurchased:o}}async function Na(t,n){const a=await fetch(`${A}/agents/publish`,{method:"POST",headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"},body:JSON.stringify(n)});if(!a.ok){const i=await a.json().catch(()=>({}));throw new Error(i.error||`发布失败 (${a.status})`)}return a.json()}async function za(t,n){const a=await fetch(`${A}/agents/${n}`,{method:"DELETE",headers:{Authorization:`Bearer ${t}`}});if(!a.ok){const i=await a.json().catch(()=>({}));throw new Error(i.error||`下架失败 (${a.status})`)}}async function Va(t){const n=await fetch(`${A}/agents/my`,{headers:{Authorization:`Bearer ${t}`}});if(!n.ok)throw new Error(`获取我的智能体失败 (${n.status})`);return n.json()}async function Ka(t,n){if(n.length!==0)try{await fetch(`${A}/agents/heartbeat`,{method:"POST",headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"},body:JSON.stringify({listingIds:n})})}catch{}}async function Bs(t,n){const a=n?`?status=${n}`:"",i=await fetch(`${A}/agents/tasks${a}`,{headers:{Authorization:`Bearer ${t}`}});if(!i.ok)throw new Error(`获取任务失败 (${i.status})`);return i.json()}async function yt(t,n,a,i){const o=await fetch(`${A}/agents/tasks/${n}`,{method:"PUT",headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"},body:JSON.stringify({result:a,...i&&{resultAttachments:i}})});if(!o.ok){const s=await o.json().catch(()=>({}));throw new Error(s.error||`提交失败 (${o.status})`)}return o.json()}async function Os(t,n){const a=new FormData;a.append("file",n);const i=await fetch(`${A}/agents/upload`,{method:"POST",headers:{Authorization:`Bearer ${t}`},body:a});if(!i.ok){const o=await i.json().catch(()=>({}));throw new Error(o.error||`上传失败 (${i.status})`)}return i.json()}async function Ha(){const t=await fetch(`${A}/agents/stats`);return t.ok?t.json():{avgMinutes:0,recentCount:0}}async function Wa(t){const n=new URLSearchParams;t?.q&&n.set("q",t.q),t?.sort&&n.set("sort",t.sort),t?.page&&n.set("page",String(t.page)),n.set("limit",String(t.limit));const a=n.toString(),i=await fetch(`${A}/agents${a?`?${a}`:""}`);if(!i.ok)throw new Error(`获取智能体列表失败 (${i.status})`);return i.json()}async function Qa(t,n,a){const i=await fetch(`${A}/agents/${n}/task`,{method:"POST",headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"},body:JSON.stringify(a)});if(!i.ok){const o=await i.json().catch(()=>({}));throw new Error(o.error||`下单失败 (${i.status})`)}return i.json()}async function Xa(t){const n=await fetch(`${A}/agents/my-tasks`,{headers:{Authorization:`Bearer ${t}`}});if(!n.ok)throw new Error(`获取我的任务失败 (${n.status})`);return n.json()}async function Ja(t,n){await fetch(`${A}/agents/my-tasks/${n}/read`,{method:"POST",headers:{Authorization:`Bearer ${t}`}}).catch(()=>{})}async function Ga(t,n,a){const i=await fetch(`${A}/agents/my-tasks/${n}/rate`,{method:"PUT",headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"},body:JSON.stringify(a)});if(!i.ok){const o=await i.json().catch(()=>({}));throw new Error(o.error||`评价失败 (${i.status})`)}}async function Ya(t,n,a){const i=await fetch(`${A}/agents/my-tasks/${n}/revise`,{method:"POST",headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"},body:JSON.stringify({request:a})});if(!i.ok){const o=await i.json().catch(()=>({}));throw new Error(o.error||`请求修订失败 (${i.status})`)}return i.json()}async function Fs(t,n){const a=await fetch(`${A}/agents/tasks/${n}/messages`,{headers:{Authorization:`Bearer ${t}`}});if(!a.ok)throw new Error(`获取消息失败 (${a.status})`);return(await a.json()).messages}async function Us(t,n,a){const i=await fetch(`${A}/agents/tasks/${n}/messages`,{method:"POST",headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"},body:JSON.stringify({content:a})});if(!i.ok){const o=await i.json().catch(()=>({}));throw new Error(o.error||`发送失败 (${i.status})`)}return i.json()}async function Za(t){const n=await fetch(`${A}/me/installed`,{headers:{Authorization:`Bearer ${t}`}});if(!n.ok)throw new Error(`获取已安装列表失败 (${n.status})`);return n.json()}async function ei(t,n,a){const i=await fetch(`${A}/me/installed`,{method:"POST",headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"},body:JSON.stringify({skillId:n,version:a})});i.ok||console.warn("[TaxStore] Failed to record installation:",i.status)}async function ti(){try{const t=await fetch(`${A}/taxbot/latest`);return t.ok?await t.json():null}catch{return null}}async function si(t,n){try{return await(await fetch(`${A}/license/activate`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:t,deviceId:n})})).json()}catch{return{ok:!1,error:"网络连接失败"}}}async function ni(t){try{return await(await fetch(`${A}/license/verify`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({deviceId:t})})).json()}catch{return{licensed:!1}}}async function ai(t,n){try{return await(await fetch(`${A}/license/apply`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({deviceId:t,...n})})).json()}catch{return{error:"网络连接失败"}}}const He="taxbot_taxstore_token";async function ii(){const t=localStorage.getItem(He);if(t){e.taxstoreToken=t;try{const n=await jt(t);e.taxstoreUser=n,e.taxstoreConnected=!0,d()}catch{localStorage.removeItem(He),e.taxstoreToken=null,e.taxstoreConnected=!1}}}async function is(t,n){e.taxstoreLoading=!0,e.taxstoreError=null,d();try{const{token:a,user:i}=await Ba(t,n);e.taxstoreToken=a,e.taxstoreUser=i,e.taxstoreConnected=!0,localStorage.setItem(He,a),await K(1),k(`已连接 TaxStore: ${i.name}`)}catch(a){e.taxstoreError=a.message||"登录失败"}finally{e.taxstoreLoading=!1,d()}}function li(){e.taxstoreToken=null,e.taxstoreUser=null,e.taxstoreConnected=!1,e.taxstoreSkills=[],e.taxstorePage=1,e.taxstoreTotalPages=1,e.taxstoreError=null,e.taxstoreInstalledIds=new Set,localStorage.removeItem(He),d()}async function K(t=1){e.taxstoreLoading=!0,e.taxstoreError=null,d();try{const n=await Oa({page:t,limit:15,q:e.taxstoreQuery||void 0,category:e.taxstoreCategory||void 0,sort:e.taxstoreSort,token:e.taxstoreToken});e.taxstoreSkills=n.skills,e.taxstorePage=n.pagination.page,e.taxstoreTotalPages=n.pagination.totalPages}catch(n){e.taxstoreError=n.message||"获取技能列表失败"}finally{e.taxstoreLoading=!1,d()}}function oi(t){e.taxstoreQuery=t,K(1)}function ue(t){e.taxstoreCategory=t,K(1)}function ls(t){e.taxstoreSort=t,K(1)}async function ri(t){if(!e.taxstoreToken){k("请先登录 TaxStore 账户");return}if(e.customSkills.some(n=>n.taxstoreSkillId===t.id)){k(`技能「${t.name}」已安装`);return}if(!e.taxstoreInstallingId){e.taxstoreInstallingId=t.id,e.taxstoreInstallStep="downloading",d();try{const{blob:n}=await Ua(t.id,e.taxstoreToken),a=new Uint8Array(await n.slice(0,4).arrayBuffer());if(a[0]!==80||a[1]!==75)throw new Error("服务器返回的文件不是有效的技能包（非 ZIP 格式）");e.taxstoreInstallStep="installing",d();const i=await n.arrayBuffer(),o=window.electronAPI;if(!o?.installSkillPackage&&!o?.installSkillBuffer){k("当前环境不支持技能包安装");return}const s=o.installSkillBuffer?await o.installSkillBuffer(i,`${t.name}.zip`):await o.installSkillPackage(await ui(n),`${t.name}.zip`);if(!s?.ok){k(`安装失败: ${s?.error||"未知错误"}`);return}const l={id:T(),name:s.skill?.name||t.name,emoji:s.skill?.emoji||"📦",description:s.skill?.description||t.description,prompt:s.skill?.prompt||"",pinned:!1,createdAt:Date.now(),folderName:s.folderName,taxstoreSkillId:t.id,taxstoreVersion:t.version};e.customSkills.push(l),X(),e.taxstoreInstalledIds.add(t.id),ei(e.taxstoreToken,t.id,t.version).catch(()=>{}),ci(),k(`技能「${t.name}」已安装`),P(`已从 TaxStore 安装技能: ${t.name}`,"📦")}catch(n){k(n.message||"安装失败")}finally{e.taxstoreInstallingId=null,e.taxstoreInstallStep=null,d()}}}async function ci(){if(e.taxstoreToken)try{e.taxstoreUser=await jt(e.taxstoreToken),d()}catch{}}async function di(){if(!(!e.taxstoreToken||!e.taxstoreConnected)){for(const t of e.customSkills)t.taxstoreSkillId&&e.taxstoreInstalledIds.add(t.taxstoreSkillId);try{const t=await Za(e.taxstoreToken),n=[];for(const a of t){const i=e.customSkills.find(o=>o.taxstoreSkillId===a.skillId);if(i&&i.taxstoreVersion&&i.taxstoreVersion!==a.skill.version)try{const o=await Fa(a.skillId,e.taxstoreToken);o.version!==i.taxstoreVersion&&n.push({skillId:a.skillId,name:a.skill.name,localVersion:i.taxstoreVersion,remoteVersion:o.version})}catch{}}n.length>0&&(e.taxstoreUpdates=n,P(`${n.length} 个 TaxStore 技能有更新可用`,"🔄"),d())}catch{}}}function ui(t){return new Promise((n,a)=>{const i=new FileReader;i.onload=()=>{const o=i.result;n(o.split(",")[1])},i.onerror=a,i.readAsDataURL(t)})}function gi(t){return e.taxstoreInstalledIds.has(t)}function pi(t){return!t||t.length===0?"-":(t.reduce((a,i)=>a+i.rating,0)/t.length).toFixed(1)}function vi(t){const n=new Uint8Array(t),a=32768,i=[];for(let o=0;o<n.length;o+=a)i.push(String.fromCharCode(...n.subarray(o,o+a)));return btoa(i.join(""))}async function Ns(t){const n=[];let a="";try{const i=JSON.parse(t),o=[];for(const s of i)if(s.type?.startsWith("image/"))try{const l=await fetch(`https://taxbot.cc:8443${s.url}`);if(l.ok){const c=await l.arrayBuffer();n.push({type:"image",mimeType:s.type,fileName:s.name,content:vi(c)})}else o.push(s)}catch{o.push(s)}else o.push(s);o.length>0&&(a=`

【附件】
${o.map(s=>`- ${s.name} (${s.type}, ${(s.size/1024).toFixed(0)}KB): https://taxbot.cc:8443${s.url}`).join(`
`)}`)}catch{}return{imageAtts:n,textSuffix:a}}function os(t){if(!e.taxstoreConnected||!e.taxstoreToken){k("请先在技能面板中登录 TaxStore 账户");return}e.rentalPublishAgent=t;const n=e.rentalMyListings.find(i=>i.agentId===t.id),a=n?.tags?(()=>{try{return JSON.parse(n.tags)}catch{return[]}})():[];e.rentalPublishDraft={price:n?.price||10,description:t.description||"",tags:a},e.rentalPublishDialog=!0,d()}function xt(){e.rentalPublishDialog=!1,e.rentalPublishAgent=null,d()}async function mi(){if(!e.taxstoreToken||!e.rentalPublishAgent)return;const t=e.rentalPublishAgent,n=e.rentalPublishDraft;if(n.price<1){k("价格至少为 1 积分");return}if(!n.description.trim()){k("请填写市场描述");return}try{const a=t.isDefault?`Taxbot Agent by ${e.taxstoreUser?.name||"Unknown"}`:t.name,i=await Na(e.taxstoreToken,{name:a,emoji:t.emoji,description:n.description.trim(),price:n.price,agentId:t.id,avatarUrl:t.avatarUrl,tags:n.tags.length>0?JSON.stringify(n.tags):void 0});e.rentalMyListings.push(i),xt(),k(`智能体「${t.name}」已发布到市场`),P(`智能体「${t.name}」已上架`,"🏪")}catch(a){k(a.message||"发布失败")}}async function zs(){if(e.taxstoreToken)try{e.rentalMyListings=await Va(e.taxstoreToken),d()}catch{}}function fi(t){return e.rentalMyListings.find(n=>n.agentId===t&&n.status==="active")}async function rs(t){if(e.taxstoreToken)try{await za(e.taxstoreToken,t),e.rentalMyListings=e.rentalMyListings.filter(n=>n.id!==t),k("已下架"),d()}catch(n){k(n.message||"下架失败")}}async function Tt(){if(!(!e.taxstoreToken||!e.taxstoreConnected)){try{const t=await Bs(e.taxstoreToken),n=new Map(e.rentalPendingTasks.map(i=>[i.id,i])),a=t.filter(i=>!n.has(i.id));for(const i of t){const o=n.get(i.id);o&&(i.unreadMessageCount||0)>0&&(o.unreadMessageCount||0)===0&&P(`${i.client.name} 给任务「${i.title}」发了新留言`,"💬",i.id,"rental")}if(e.rentalPendingTasks=t,e.rentalActiveTask){const i=t.find(o=>o.id===e.rentalActiveTask.id);i&&(e.rentalActiveTask.unreadMessageCount=i.unreadMessageCount)}for(const i of a)i.status==="revision_requested"?P(`收到修订请求: ${i.title} (${i.listing.name})`,"✏️",i.id,"rental"):P(`收到新任务: ${i.title} (${i.listing.name})`,"📋",i.id,"rental");d()}catch{}try{const t=e.rentalMyListings.filter(n=>n.status==="active").map(n=>n.id);t.length>0&&e.taxstoreToken&&Ka(e.taxstoreToken,t)}catch{}ji()}}function hi(){e.rentalPollingTimer||(Tt(),e.rentalPollingTimer=setInterval(Tt,6e4))}async function be(){if(!(!e.taxstoreToken||!e.taxstoreConnected))try{const t=await Xa(e.taxstoreToken),n=new Map(e.consultMyTasks.map(o=>[o.id,o])),a=e.consultMyTasks.length;for(const o of t){const s=n.get(o.id);s&&s.status!=="completed"&&o.status==="completed"&&P(`你的咨询已完成: ${o.title} (${o.listing?.name||"智能体"})`,"✅",o.id,"consult"),s&&(o.unreadMessageCount||0)>0&&(s.unreadMessageCount||0)===0&&P(`${o.listing?.name||"智能体"} 给你发了新留言`,"💬",o.id,"consult")}const i=t.filter(o=>o.status==="completed"&&!o.clientRead||(o.unreadMessageCount||0)>0).length;e.consultMyTasks=t,e.consultUnreadCount=i,d()}catch{}}function ki(){e.consultPollingTimer||(be(),e.consultPollingTimer=setInterval(be,6e4))}async function Re(){e.consultLoading=!0,d();try{const t=await Wa({q:e.consultSearch||void 0,sort:"popular",limit:50});e.consultAgents=t.agents}catch(t){k(t.message||"加载智能体失败")}finally{e.consultLoading=!1,d()}bi()}async function bi(){try{const t=await Ha();if(t.recentCount===0)e.consultAvgTime="暂无数据";else{const n=t.avgMinutes;let a;if(n<1)a="不到 1 分钟";else if(n<60)a=`约 ${n} 分钟`;else{const i=Math.floor(n/60),o=n%60;a=o===0?`约 ${i} 小时`:`约 ${i} 小时 ${o} 分钟`}e.consultAvgTime=`${a}（近 ${t.recentCount} 单）`}d()}catch{e.consultAvgTime="暂无数据",d()}}function wi(t){e.consultSelectedAgent=t,e.consultView="detail",e.consultTaskTitle="",e.consultTaskContent="",e.consultAttachments=[],d()}function $i(){e.consultView="list",e.consultSelectedAgent=null,d()}function cs(){e.consultView="my-tasks",be(),d()}function ot(t){e.consultSelectedTask=t,e.consultView="task-detail",e.consultMessages=[],e.consultMessageInput="",e.consultMessagesOpen=!1,e.consultMessagesSending=!1,e.consultRevisionOpen=!1,e.consultRevisionText="",e.consultRatingOpen=!1,e.consultRatingValue=0,e.consultRatingHover=0,e.consultRatingComment="",e.taxstoreToken&&t.status==="completed"&&!t.clientRead&&(t.clientRead=!0,e.consultUnreadCount=Math.max(0,e.consultUnreadCount-1),Ja(e.taxstoreToken,t.id)),d()}function yi(){e.consultSelectedTask=null,e.consultView="my-tasks",d()}async function xi(){e.consultMessagesOpen=!e.consultMessagesOpen,e.consultMessagesOpen&&e.consultMessages.length===0&&await Ti(),d()}async function Ti(){if(!(!e.taxstoreToken||!e.consultSelectedTask)){try{if(e.consultMessages=await Fs(e.taxstoreToken,e.consultSelectedTask.id),e.consultSelectedTask.unreadMessageCount){e.consultSelectedTask.unreadMessageCount=0;const t=e.consultMyTasks.findIndex(n=>n.id===e.consultSelectedTask?.id);t>=0&&(e.consultMyTasks[t].unreadMessageCount=0),e.consultUnreadCount=e.consultMyTasks.filter(n=>n.status==="completed"&&!n.clientRead||(n.unreadMessageCount||0)>0).length}}catch{}d()}}async function ds(){if(!e.taxstoreToken||!e.consultSelectedTask)return;const t=e.consultMessageInput.trim();if(t){e.consultMessagesSending=!0,d();try{const n=await Us(e.taxstoreToken,e.consultSelectedTask.id,t);e.consultMessages.push(n),e.consultMessageInput=""}catch(n){k(n.message||"发送失败")}finally{e.consultMessagesSending=!1,d()}}}function us(){e.consultRevisionOpen=!e.consultRevisionOpen,d()}async function Ai(){if(!e.taxstoreToken||!e.consultSelectedTask)return;const t=e.consultRevisionText.trim();if(!t){k("请填写修订说明");return}e.consultRevisionSubmitting=!0,d();try{const n=await Ya(e.taxstoreToken,e.consultSelectedTask.id,t);e.consultSelectedTask.status=n.status,e.consultSelectedTask.revisionCount=n.revisionCount,e.consultSelectedTask.revisionRequest=n.revisionRequest,e.consultRevisionOpen=!1,e.consultRevisionText="",k("修订请求已发送");const a=e.consultMyTasks.findIndex(i=>i.id===e.consultSelectedTask?.id);a>=0&&(e.consultMyTasks[a].status=n.status)}catch(n){k(n.message||"请求修订失败")}finally{e.consultRevisionSubmitting=!1,d()}}function gs(){e.consultRatingOpen=!e.consultRatingOpen,d()}async function Si(){if(!(!e.taxstoreToken||!e.consultSelectedTask)){if(e.consultRatingValue<1){k("请选择评分");return}e.consultRatingSubmitting=!0,d();try{await Ga(e.taxstoreToken,e.consultSelectedTask.id,{rating:e.consultRatingValue,comment:e.consultRatingComment.trim()||void 0}),e.consultSelectedTask.rating=e.consultRatingValue,e.consultSelectedTask.ratingComment=e.consultRatingComment.trim()||void 0,e.consultRatingOpen=!1,k("感谢您的评价！");const t=e.consultMyTasks.findIndex(n=>n.id===e.consultSelectedTask?.id);t>=0&&(e.consultMyTasks[t].rating=e.consultRatingValue)}catch(t){k(t.message||"评价失败")}finally{e.consultRatingSubmitting=!1,d()}}}async function Ci(t){if(e.taxstoreToken){if(t.size>10*1024*1024){k("文件大小不能超过 10MB");return}e.consultUploading=!0,d();try{const n=await Os(e.taxstoreToken,t);e.consultAttachments.push(n)}catch(n){k(n.message||"上传失败")}finally{e.consultUploading=!1,d()}}}function Ii(t){e.consultAttachments.splice(t,1),d()}async function Mi(){if(!(!e.taxstoreToken||!e.consultSelectedAgent)){if(!e.consultTaskTitle.trim()||!e.consultTaskContent.trim()){k("请填写标题和内容");return}e.consultSubmitting=!0,d();try{await Qa(e.taxstoreToken,e.consultSelectedAgent.id,{title:e.consultTaskTitle.trim(),content:e.consultTaskContent.trim(),attachments:e.consultAttachments.length>0?e.consultAttachments:void 0}),k("任务已提交！智能体主人会尽快处理"),e.consultTaskTitle="",e.consultTaskContent="",e.consultAttachments=[],e.consultView="my-tasks",e.consultSelectedAgent=null,be()}catch(t){k(t.message||"提交失败")}finally{e.consultSubmitting=!1,d()}}}let _=null;function rt(t){e.rentalActiveTask=t,e.rentalTaskResult=t.result||"",e.rentalAgentProcessing=!1,e.rentalTaskPanel=!0,e.rentalTaskAttachments=[],e.rentalTaskInstruction="",d()}function At(){_&&(_.abort(),_=null),e.rentalTaskPanel=!1,e.rentalActiveTask=null,e.rentalTaskResult="",e.rentalAgentProcessing=!1,e.rentalTaskAttachments=[],e.rentalTaskInstruction="",d()}function qt(t){if(!t?.messages||t.messages.length===0)return"";const n=t.messages;let a=-1;for(let s=n.length-1;s>=0;s--)if(n[s].role==="user"){a=s;break}const i=a>=0?a+1:0,o=[];for(let s=i;s<n.length;s++)if(n[s].role==="assistant"){const l=Oe(n[s]);l&&!Fe(l)&&o.push(l)}return o.join(`

`)}async function Pi(){if(!e.client||!e.rentalActiveTask)return;const t=e.rentalActiveTask.listing.agentId,n=t?e.agentsList.find(y=>y.id===t):null;if(!n){k("未找到对应的本地智能体");return}e.rentalAgentProcessing=!0,e.rentalTaskResult="",d();const a=`agent:${n.id}:rental`;let o=e.rentalActiveTask.status==="revision_requested"?`请根据客户的修订要求修改之前的回答：

【任务标题】${e.rentalActiveTask.title}

【任务内容】
${e.rentalActiveTask.content}

【之前的回答】
${e.rentalActiveTask.result||""}

【客户修订要求】
${e.rentalActiveTask.revisionRequest||""}`:`请处理以下用户任务，直接给出完整的回答结果：

【任务标题】${e.rentalActiveTask.title}

【任务内容】
${e.rentalActiveTask.content}`,s=[];if(e.rentalActiveTask.attachments){const{imageAtts:y,textSuffix:S}=await Ns(e.rentalActiveTask.attachments);s=y,o+=S}const l=await Y(n.id);l&&(o=`【智能体记忆】
${l}
---

${o}`);const c=T();try{const y={sessionKey:a,message:o,deliver:!1,idempotencyKey:c};s.length>0&&(y.attachments=s),await e.client.request("chat.send",y)}catch(y){e.rentalAgentProcessing=!1,k("发送任务给智能体失败："+String(y)),d();return}_?.abort();const u=new AbortController;_=u;const g=u.signal,p=1500,m=1e4,h=12e4,f=Date.now();let w=Date.now(),x="";const C=()=>{if(!(g.aborted||!e.rentalAgentProcessing)){if(Date.now()-f>h){e.rentalAgentProcessing=!1,x?e.rentalTaskResult=x:k("智能体处理超时，请手动填写结果"),_=null,d();return}e.client?.request("chat.history",{sessionKey:a,limit:20}).then(y=>{if(g.aborted||!e.rentalAgentProcessing)return;const S=qt(y);if(S&&S!==x&&(w=Date.now(),x=S,e.rentalTaskResult=S,d()),x.length>0&&Date.now()-w>m){e.rentalAgentProcessing=!1,e.rentalTaskResult=x,_=null,d();return}setTimeout(C,p)}).catch(()=>{g.aborted||(Date.now()-f<h?setTimeout(C,p):(e.rentalAgentProcessing=!1,x||k("获取智能体回复失败"),_=null,d()))})}};setTimeout(C,800)}async function ps(){if(!e.client||!e.rentalActiveTask)return;const t=e.rentalTaskInstruction.trim();if(!t){k("请输入修改指令");return}const n=e.rentalTaskResult.trim();if(!n){k("请先让智能体生成回答，再进行修改");return}const a=e.rentalActiveTask.listing.agentId,i=a?e.agentsList.find(C=>C.id===a):null;if(!i){k("未找到对应的本地智能体");return}e.rentalAgentProcessing=!0,e.rentalTaskInstruction="",d();const o=`agent:${i.id}:rental`,s=`以下是你之前对用户任务的回答，请根据用户的修改指令进行修改，直接给出修改后的完整回答：

【原始任务】${e.rentalActiveTask.title}

【你之前的回答】
${n}

【用户修改指令】
${t}`,l=T();try{await e.client.request("chat.send",{sessionKey:o,message:s,deliver:!1,idempotencyKey:l})}catch(C){e.rentalAgentProcessing=!1,k("发送修改指令失败："+String(C)),d();return}_?.abort();const c=new AbortController;_=c;const u=c.signal,g=1500,p=1e4,m=12e4,h=Date.now();let f=Date.now(),w="";const x=()=>{if(!(u.aborted||!e.rentalAgentProcessing)){if(Date.now()-h>m){e.rentalAgentProcessing=!1,w?e.rentalTaskResult=w:k("智能体修改超时"),_=null,d();return}e.client?.request("chat.history",{sessionKey:o,limit:20}).then(C=>{if(u.aborted||!e.rentalAgentProcessing)return;const y=qt(C);if(y&&y!==w&&(f=Date.now(),w=y,e.rentalTaskResult=y,d()),w.length>0&&Date.now()-f>p){e.rentalAgentProcessing=!1,e.rentalTaskResult=w,_=null,d();return}setTimeout(x,g)}).catch(()=>{u.aborted||(Date.now()-h<m?setTimeout(x,g):(e.rentalAgentProcessing=!1,w||k("获取修改结果失败"),_=null,d()))})}};setTimeout(x,800)}async function Di(){if(!e.taxstoreToken||!e.rentalActiveTask)return;const t=e.rentalTaskResult.trim();if(!t){k("请填写任务结果");return}try{const n=e.rentalActiveTask;let a;if(e.rentalTaskAttachments.length>0){a=[];for(const o of e.rentalTaskAttachments){const s=await Os(e.taxstoreToken,o);a.push(s)}}await yt(e.taxstoreToken,n.id,t,a),e.rentalPendingTasks=e.rentalPendingTasks.filter(o=>o.id!==n.id),k("任务结果已提交，积分已到账"),P(`任务「${n.title}」已完成`,"✅");const i=n.listing.agentId;if(i){const o=`【出租任务完成】客户: ${n.client.name}
任务: ${n.title}
内容: ${n.content}
回答: ${t}`;Ue(i,o)}At(),we()}catch(n){k(n.message||"提交失败")}}const _i=7200*1e3,z=new Set;async function Ri(t){if(!e.client||!e.taxstoreToken||z.has(t.id))return;const n=t.listing.agentId,a=n?e.agentsList.find(w=>w.id===n):null;if(!a)return;z.add(t.id),P(`任务「${t.title}」超时未处理，智能体自动处理中...`,"⏰",t.id,"rental");const i=`agent:${a.id}:auto:${t.id}`;let o=`请处理以下用户任务，直接给出完整的回答结果：

【任务标题】${t.title}

【任务内容】
${t.content}`,s=[];if(t.attachments){const{imageAtts:w,textSuffix:x}=await Ns(t.attachments);s=w,o+=x}const l=await Y(a.id);l&&(o=`【智能体记忆】
${l}
---

${o}`);try{const w={sessionKey:i,message:o,deliver:!1,idempotencyKey:T()};s.length>0&&(w.attachments=s),await e.client.request("chat.send",w)}catch{z.delete(t.id);return}const c=2e3,u=12e3,g=18e4,p=Date.now();let m=Date.now(),h="";const f=async()=>{if(!e.taxstoreToken){z.delete(t.id);return}if(Date.now()-p>g){const w=h||"非常抱歉，智能体处理超时。请您重新提交任务或联系智能体主人。";try{await yt(e.taxstoreToken,t.id,w),e.rentalPendingTasks=e.rentalPendingTasks.filter(x=>x.id!==t.id),P(`任务「${t.title}」已自动完成`,"✅"),n&&Ue(n,`【自动完成任务】客户: ${t.client.name}
任务: ${t.title}
回答: ${w}`),we(),d()}catch{}z.delete(t.id);return}try{const w=await e.client?.request("chat.history",{sessionKey:i,limit:20}),x=qt(w);if(x&&x!==h&&(m=Date.now(),h=x),h.length>0&&Date.now()-m>u){await yt(e.taxstoreToken,t.id,h),e.rentalPendingTasks=e.rentalPendingTasks.filter(C=>C.id!==t.id),P(`任务「${t.title}」已自动完成`,"✅"),n&&Ue(n,`【自动完成任务】客户: ${t.client.name}
任务: ${t.title}
回答: ${h}`),we(),d(),z.delete(t.id);return}setTimeout(f,c)}catch{Date.now()-p<g?setTimeout(f,c):z.delete(t.id)}};setTimeout(f,1e3)}async function ji(){if(!e.taxstoreToken||!e.client)return;const t=Date.now();for(const n of e.rentalPendingTasks){if(z.has(n.id)||e.rentalActiveTask?.id===n.id)continue;t-new Date(n.createdAt).getTime()>_i&&Ri(n)}}async function we(){if(e.taxstoreToken)try{e.rentalCompletedTasks=await Bs(e.taxstoreToken,"completed"),d()}catch{}}function qi(t){return e.rentalCompletedTasks.filter(n=>n.listing.id===t)}async function Li(t){if(e.taxstoreToken)try{e.rentalMessages=await Fs(e.taxstoreToken,t);const n=e.rentalPendingTasks.find(a=>a.id===t);n&&n.unreadMessageCount&&(n.unreadMessageCount=0),e.rentalActiveTask?.id===t&&e.rentalActiveTask.unreadMessageCount&&(e.rentalActiveTask.unreadMessageCount=0),d()}catch{}}async function vs(){if(!(!e.taxstoreToken||!e.rentalActiveTask||!e.rentalMessageInput.trim())){try{const t=await Us(e.taxstoreToken,e.rentalActiveTask.id,e.rentalMessageInput.trim());e.rentalMessages=[...e.rentalMessages,t],e.rentalMessageInput=""}catch(t){k(t.message||"发送失败")}d()}}function Ei(){e.rentalMessagesOpen=!e.rentalMessagesOpen,e.rentalMessagesOpen&&e.rentalActiveTask&&Li(e.rentalActiveTask.id),d()}async function Bi(){!e.taxstoreToken||!e.taxstoreConnected||(await zs(),we(),hi(),ki())}function N(t){return!t||t.length<2?null:t.startsWith("data:")||t.startsWith("http")?t:`https://taxbot.cc:8443${t}`}function Te(t){return t.startsWith("http")?t:`https://taxbot.cc:8443${t}`}function Ae(t){if(!t)return[];try{return JSON.parse(t)}catch{return[]}}function ct(t){return t<1024?`${t}B`:t<1024*1024?`${(t/1024).toFixed(0)}KB`:`${(t/(1024*1024)).toFixed(1)}MB`}async function Oi(){if(e.refreshing)return;e.refreshing=!0,d();const t=[];e.connected||t.push(le().catch(()=>{})),t.push(oe().catch(()=>{})),e.taxstoreToken&&e.taxstoreConnected&&(t.push(jt(e.taxstoreToken).then(n=>{n&&(e.taxstoreUser=n)}).catch(()=>{})),t.push(zs().catch(()=>{})),t.push(Tt().catch(()=>{})),t.push(we().catch(()=>{})),t.push(be().catch(()=>{})),t.push(Re().catch(()=>{}))),e.authorizedFolder&&t.push(V().catch(()=>{})),await Promise.allSettled(t),e.refreshing=!1,e.lastRefreshTime=Date.now(),k("数据已刷新"),d()}async function Fi(){if(!e.updateChecking){e.updateChecking=!0,d();try{const t=await ti();t&&t.version&&t.version!==gt?e.updateAvailable={version:t.version,changelog:t.changelog||"",downloadUrl:t.downloadUrl||"https://taxbot.cc:8443/taxbot"}:(e.updateAvailable=null,t&&t.version===gt?k("当前已是最新版本"):(!t||!t.version)&&k("暂无可用版本信息"))}catch{k("检查更新失败，请稍后重试")}e.updateChecking=!1,d()}}const St=7;function Lt(){const t="taxbot_device_id";let n=localStorage.getItem(t);return n||(n="tb-"+Array.from(crypto.getRandomValues(new Uint8Array(16))).map(a=>a.toString(16).padStart(2,"0")).join(""),localStorage.setItem(t,n)),n}function Ui(){const t=localStorage.getItem("taxbot_license");if(t)try{const{code:a,expiresAt:i}=JSON.parse(t);if(i&&i>Date.now()){e.licenseStatus="licensed",e.licenseExpiresAt=i,e.licenseCode=a,d(),ms();return}}catch{}const n=localStorage.getItem("taxbot_trial_start");if(n){const a=parseInt(n,10);e.trialStartedAt=a;const i=Date.now()-a,o=St*24*60*60*1e3;i<o?e.licenseStatus="trial":e.licenseStatus="expired"}else{const a=Date.now();localStorage.setItem("taxbot_trial_start",String(a)),e.trialStartedAt=a,e.licenseStatus="trial",k("欢迎使用 Taxbot！您有 7 天免费试用期")}d(),ms()}async function ms(){const t=Lt(),n=await ni(t);if(n.licensed&&n.expiresAt){const a=new Date(n.expiresAt).getTime();e.licenseStatus="licensed",e.licenseExpiresAt=a,localStorage.setItem("taxbot_license",JSON.stringify({code:e.licenseCode||"server",expiresAt:a})),d()}else e.licenseStatus==="licensed"&&e.licenseExpiresAt&&e.licenseExpiresAt<Date.now()&&(e.licenseStatus="expired",localStorage.removeItem("taxbot_license"),d())}async function Se(){const t=e.licenseActivateCode.trim().toUpperCase();if(!t){k("请输入授权码");return}e.licenseActivating=!0,d();const n=Lt(),a=await si(t,n);if(a.ok&&a.expiresAt){const i=new Date(a.expiresAt).getTime();e.licenseStatus="licensed",e.licenseExpiresAt=i,e.licenseCode=t,e.licenseActivateCode="",localStorage.setItem("taxbot_license",JSON.stringify({code:t,expiresAt:i})),k("授权激活成功！")}else k(a.error||"激活失败");e.licenseActivating=!1,d()}async function fs(){const t=e.licenseApplyForm;if(!t.email||!t.phone||!t.reason){k("请填写完整信息");return}e.licenseApplying=!0,d();const n=Lt(),a=await ai(n,t);a.ok?(e.licenseApplyResult="success",k("申请已提交，请等待管理员审核")):(e.licenseApplyResult="error",k(a.error||"申请失败")),e.licenseApplying=!1,d()}function dt(){if(!e.trialStartedAt)return St;const t=Date.now()-e.trialStartedAt;return Math.max(0,Math.ceil((St*24*60*60*1e3-t)/(1440*60*1e3)))}function Ni(){return e.licenseExpiresAt?Math.max(0,Math.ceil((e.licenseExpiresAt-Date.now())/(1440*60*1e3))):0}function L(t,n,a,i){Jn(t,n,a,i,ze,Pe)}function zi(){return r`
    <div class="quickstart-overlay" @click=${tt}>
      <div class="quickstart-container" @click=${t=>t.stopPropagation()}>

        <div class="qs-topbar">
          <button class="qs-back-btn" @click=${tt}>
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
          <button class="qs-btn-start" @click=${tt}>开始使用Taxbot</button>
          <div class="qs-footer-hint">可随时在左侧"关于"页面重新查看此指南</div>
        </div>

      </div>
    </div>
  `}function Vi(){if(e.messages.length===0)return r`
      <div class="empty-state">
        <div class="empty-state__icon">
          <img src="./assets/taxchat-logo.png" alt="Taxbot" style="width: 120px; height: 120px;" />
        </div>
        <div class="empty-state__text">
          <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">欢迎来到Taxbot</div>
          <div>有任何税务问题？请在下方输入并提问</div>
        </div>
      </div>
    `;const t=[],n=document.getElementById("messages-container"),a=n?.scrollTop||0,i=n?.clientHeight||600,o=kn(e.messages,a,i),s=e.messages.slice(o.startIndex,o.endIndex);o.topPadding>0&&t.push(r`<div style="height:${o.topPadding}px;"></div>`);for(const l of s){const c=u=>{if(!u)return"";const g=e.messages.find(h=>h.id===u);if(!g)return"";const p=g.type==="user"?"我":g.agentName||"Taxbot",m=g.text.length>80?g.text.slice(0,80)+"...":g.text;return r`<div class="message-quote-card" @click=${()=>{const h=document.querySelector(`[data-msg-id="${u}"]`);h&&(h.scrollIntoView({behavior:"smooth",block:"center"}),h.classList.add("highlight-flash"),setTimeout(()=>h.classList.remove("highlight-flash"),1500))}}><span class="quote-sender">${p}</span><span class="quote-text">${m}</span></div>`};if(l.type==="user")t.push(r`
        <div class="message-group" data-msg-id="${l.id}">
          <div class="message-item user">
            <div class="message-content user">
              ${c(l.replyToId)}
              ${l.text?r`<div class="message-bubble user">${l.text}</div>`:""}
              ${l.attachments&&l.attachments.length>0?r`
                <div class="message-attachments">
                  ${l.attachments.map(u=>r`
                    <div class="attachment-thumbnail" @click=${()=>{e.previewAttachment=u,v()}}>
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
            <button class="message-action-btn" @click=${()=>{e.replyingTo=l,v(),setTimeout(()=>e.inputRef?.focus(),50)}} title="引用回复">
              <span class="action-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg></span><span class="action-label">引用</span>
            </button>
          </div>
          <div class="message-time">${se(l.timestamp)}</div>
        </div>
      `);else{const u=e.favorites.has(l.id),g=l;t.push(r`
        <div class="message-group" data-msg-id="${l.id}">
          ${g.agentName?r`<div class="message-agent-name">${g.agentEmoji||"🤖"} ${g.agentName}</div>`:""}
          ${c(g.replyToId)}
          <div class="message-item">
            <div class="message-avatar assistant">${g.agentAvatarUrl?r`<img src="${g.agentAvatarUrl}" class="agent-avatar-img" alt="${g.agentName||""}" />`:g.agentEmoji?r`<span class="agent-emoji-avatar">${g.agentEmoji}</span>`:r`<img src="./assets/taxchat-logo.png" alt="Taxbot" />`}</div>
            <div class="message-bubble assistant markdown-body ${u?"favorited":""}">${ut(We(jn(Rn(l.text))))}</div>
          </div>
          <div class="message-actions">
            <button class="message-action-btn" @click=${()=>{e.replyingTo=l,v(),setTimeout(()=>e.inputRef?.focus(),50)}} title="引用回复">
              <span class="action-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg></span><span class="action-label">引用</span>
            </button>
            <button class="message-action-btn" data-copy-id="${l.id}" @click=${()=>Pn(l.id,l.text)} title="复制文本">
              <span class="action-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></span><span class="action-label">复制</span>
            </button>
            <button class="message-action-btn" @click=${()=>Dn(l.text)} title="保存为Word文档">
              <span class="action-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg></span><span class="action-label">保存Word</span>
            </button>
            <button class="message-action-btn" @click=${()=>na(l.text)} title="保存到知识库">
              <span class="action-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></span><span class="action-label">存知识库</span>
            </button>
            <button class="message-action-btn ${u?"fav-active":""}" @click=${()=>Ms(l.id)} title="${u?"取消收藏":"收藏"}">
              <span class="action-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="${u?"currentColor":"none"}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></span><span class="action-label">${u?"已收藏":"收藏"}</span>
            </button>
            ${g.agentId?r`
              <button class="message-action-btn" @click=${()=>{Ue(g.agentId,l.text.length>500?l.text.slice(0,500)+"...":l.text),k("已保存到智能体记忆")}} title="保存到该智能体的记忆">
                <span class="action-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/><path d="M12 6v6l4 2"/></svg></span><span class="action-label">记住</span>
              </button>
            `:""}
          </div>
          <div class="message-time">${se(l.timestamp)}</div>
        </div>
      `)}}if(o.bottomPadding>0&&t.push(r`<div style="height:${o.bottomPadding}px;"></div>`),e.collaborationTasks&&e.collaborationTasks.length>0){const l=c=>c==="done"?"✅":c==="error"?"❌":"💭";t.push(r`
      <div class="message-group">
        <div class="collab-card">
          <div class="collab-card__header">🤝 智能体协作中</div>
          ${e.collaborationTasks.map(c=>r`
            <div class="collab-card__row">
              <span class="collab-card__emoji">${c.agentEmoji}</span>
              <span class="collab-card__name">${c.agentName}</span>
              <span class="collab-card__task">${c.task}</span>
              <span class="collab-card__status">${l(c.status)}</span>
            </div>
          `)}
        </div>
      </div>
    `)}for(const l of e.activeRuns.values()){const c=l.agentId?e.agentsList.find(u=>u.id===l.agentId):null;t.push(r`
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
              <button class="thinking-cancel-btn" @click=${()=>wa(l.sessionKey)} title="取消">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                <span>取消</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `)}return r`${t}`}function Ki(t){t.preventDefault();const n=t.target.parentElement,a=t.target;a.classList.add("dragging");const i=t.clientX,o=n.offsetWidth,s=c=>{const u=Math.min(Math.max(o+c.clientX-i,240),700);n.style.width=u+"px"},l=c=>{document.removeEventListener("mousemove",s),document.removeEventListener("mouseup",l),a.classList.remove("dragging");const u=Math.min(Math.max(o+c.clientX-i,240),700);e.sidePanelWidth=u,localStorage.setItem("taxbot_side_panel_width",String(u)),v()};document.addEventListener("mousemove",s),document.addEventListener("mouseup",l)}function v(){const t=document.getElementById("app");if(!t)return;const n=e.connected?"助理已就位":"助理准备中...",a=e.connected?"ok":"",i=r`
    <div class="taxchat-app">
      <header class="taxchat-header">
        <div class="taxchat-header__title">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div class="taxchat-header__logo" @click=${()=>{e.sidePanel=e.sidePanel==="about"?null:"about",v()}} style="cursor: pointer;" title="关于Taxbot">
              <img src="./assets/taxchat-logo.png" alt="Taxbot" />
            </div>
            <h1>Taxbot</h1>
            <div class="taxchat-header__status" @click=${s=>{s.stopPropagation(),e.showStatusMenu=!e.showStatusMenu,v()}}>
              <span class="status-dot ${a}"></span> ${n} <span class="status-arrow">▾</span>
              ${e.showStatusMenu?r`
                <div class="status-menu" @click=${s=>s.stopPropagation()}>
                  ${e.connected?r`
                    <div class="status-menu__item" @click=${()=>{e.showStatusMenu=!1;const s=window.electronAPI;s?.restartGateway&&s.restartGateway(),setTimeout(()=>le(),2e3),v()}}>📞 呼叫个人助理</div>
                    <div class="status-menu__item" @click=${()=>{e.showStatusMenu=!1;const s=window.electronAPI;s?.stopGateway&&s.stopGateway(),e.connected=!1,bt(),v()}}>😴 让助理下班</div>
                  `:r`
                    <div class="status-menu__item" @click=${()=>{e.showStatusMenu=!1;const s=window.electronAPI;s?.startGateway&&s.startGateway(),setTimeout(()=>le(),2e3),v()}}>📞 呼叫个人助理</div>
                  `}
                </div>
              `:""}
            </div>
          </div>
        </div>
        <div class="taxchat-header__right">
          ${(()=>{const s=e.notifications.filter(l=>!l.read).length;return r`
          <button class="header-notif-btn" @click=${l=>{l.stopPropagation(),e.showNotifications=!e.showNotifications,v()}} title="消息">
            🔔${s>0?r`<span class="header-notif-badge">${s}</span>`:""}
          </button>
          ${e.showNotifications?r`
            <div class="notif-dropdown" @click=${l=>l.stopPropagation()}>
              <div class="notif-dropdown__header">
                <span>消息${s>0?` (${s})`:""}</span>
                <div class="notif-dropdown__actions">
                  ${s>0?r`<button class="notif-dropdown__clear" @click=${()=>{e.notifications.forEach(l=>l.read=!0),ge(),v()}}>全部已读</button>`:""}
                  ${e.notifications.length>0?r`<button class="notif-dropdown__clear" @click=${()=>{e.notifications=[],ge(),v()}}>清空</button>`:""}
                </div>
              </div>
              <div class="notif-dropdown__list">
                ${e.notifications.length===0?r`<div class="notif-dropdown__empty">暂无消息</div>`:[...e.notifications].reverse().map(l=>r`
                    <div class="notif-item ${l.source||l.taskId?"notif-item--task":"notif-item--clickable"} ${l.read?"notif-item--read":""}" @click=${()=>{if(l.read=!0,ge(),e.showNotifications=!1,l.taskId&&l.source==="rental"){const c=e.rentalPendingTasks.find(u=>u.id===l.taskId);c?rt(c):(e.notifDetail=l,v())}else if(l.taskId&&l.source==="consult"){const c=e.consultMyTasks.find(u=>u.id===l.taskId);c?(e.sidePanel="consult",ot(c)):(e.sidePanel="consult",cs(),v())}else if(l.taskId){const c=e.rentalPendingTasks.find(u=>u.id===l.taskId);if(c)rt(c);else{const u=e.consultMyTasks.find(g=>g.id===l.taskId);u?(e.sidePanel="consult",ot(u)):(e.notifDetail=l,v())}}else e.notifDetail=l,v()}}>
                      ${l.read?"":r`<div class="notif-item__dot"></div>`}
                      <div class="notif-item__icon">${l.icon}</div>
                      <div class="notif-item__body">
                        <div class="notif-item__text">${l.text}</div>
                        <div class="notif-item__time">${se(l.timestamp)}</div>
                        ${l.source==="rental"?r`<div class="notif-item__hint">点击处理任务</div>`:l.source==="consult"?r`<div class="notif-item__hint">点击查看详情</div>`:""}
                      </div>
                      <button class="notif-item__remove" @click=${c=>{c.stopPropagation(),e.notifications=e.notifications.filter(u=>u.id!==l.id),ge(),v()}} title="删除">✕</button>
                    </div>
                  `)}
              </div>
            </div>
          `:""}`})()}
          <button class="header-refresh-btn ${e.refreshing?"spinning":""}" @click=${()=>Oi()} title="${e.lastRefreshTime?`上次刷新: ${se(e.lastRefreshTime)}`:"刷新所有数据"}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="23 4 23 10 17 10"/>
              <polyline points="1 20 1 14 7 14"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
          </button>
          <button class="header-exit-btn" @click=${()=>{e.confirmingExit=!0,v()}} title="退出应用">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </header>

      ${e.confirmingExit?r`
        <div class="model-confirm-overlay" @click=${()=>{e.confirmingExit=!1,v()}}>
          <div class="model-confirm-dialog" @click=${s=>s.stopPropagation()}>
            <div class="model-confirm-title">确认退出应用</div>
            <div class="model-confirm-hint" style="margin-bottom:20px;font-size:13px;">退出将关闭窗口并关闭 Gateway 服务。</div>
            <div class="model-confirm-actions">
              <button class="model-confirm-btn cancel" @click=${()=>{e.confirmingExit=!1,v()}}>取消</button>
              <button class="model-confirm-btn confirm" style="background:linear-gradient(135deg,#ef4444,#dc2626);" @click=${()=>{Zt()}}>确认退出</button>
            </div>
          </div>
        </div>
      `:""}

      ${e.notifDetail?r`
        <div class="notif-detail-overlay" @click=${()=>{e.notifDetail=null,v()}}>
          <div class="notif-detail-dialog" @click=${s=>s.stopPropagation()}>
            <div class="notif-detail-icon">${e.notifDetail.icon}</div>
            <div class="notif-detail-text">${e.notifDetail.text}</div>
            <div class="notif-detail-time">${se(e.notifDetail.timestamp)}</div>
            <button class="notif-detail-close" @click=${()=>{e.notifDetail=null,v()}}>关闭</button>
          </div>
        </div>
      `:""}

      ${e.licenseStatus==="trial"?r`
        <div class="license-banner">
          <span class="license-banner__text">试用中 · 剩余 ${dt()} 天</span>
          <button class="license-banner__btn" @click=${()=>{e.sidePanel="settings",e.settingsView="license",v()}}>激活授权码</button>
          <button class="license-banner__btn secondary" @click=${()=>{e.sidePanel="settings",e.settingsView="license",e.licenseView="apply",v()}}>申请授权</button>
        </div>
      `:""}

      ${e.licenseStatus==="expired"?r`
        <div class="license-overlay">
          <div class="license-overlay__card">
            <div class="license-overlay__icon">🔒</div>
            <h2 class="license-overlay__title">试用已过期</h2>
            <p class="license-overlay__desc">您的 7 天免费试用期已结束，请输入授权码激活或申请授权。</p>
            <div class="license-overlay__input-row">
              <input type="text" class="license-overlay__input" placeholder="XXXX-XXXX-XXXX-XXXX"
                .value=${e.licenseActivateCode}
                @input=${s=>{e.licenseActivateCode=s.target.value,v()}}
                @keydown=${s=>{s.key==="Enter"&&Se()}}
              />
              <button class="license-overlay__activate" @click=${Se} .disabled=${e.licenseActivating}>
                ${e.licenseActivating?"激活中...":"激活"}
              </button>
            </div>
            <div class="license-overlay__divider"><span>或</span></div>
            <button class="license-overlay__apply-btn" @click=${()=>{e.licenseView="apply",v()}}>
              申请使用授权
            </button>
            ${e.licenseView==="apply"?r`
              <div class="license-overlay__form">
                <input type="email" placeholder="邮箱" .value=${e.licenseApplyForm.email}
                  @input=${s=>{e.licenseApplyForm.email=s.target.value}} />
                <input type="tel" placeholder="手机号" .value=${e.licenseApplyForm.phone}
                  @input=${s=>{e.licenseApplyForm.phone=s.target.value}} />
                <input type="text" placeholder="申请原因" .value=${e.licenseApplyForm.reason}
                  @input=${s=>{e.licenseApplyForm.reason=s.target.value}} />
                <select .value=${e.licenseApplyForm.period}
                  @change=${s=>{e.licenseApplyForm.period=s.target.value}}>
                  <option value="30天">30天</option>
                  <option value="90天" selected>90天</option>
                  <option value="180天">180天</option>
                  <option value="365天">365天</option>
                </select>
                <button class="license-overlay__submit" @click=${fs} .disabled=${e.licenseApplying}>
                  ${e.licenseApplying?"提交中...":"提交申请"}
                </button>
                ${e.licenseApplyResult==="success"?r`<p class="license-overlay__result success">申请已提交，请等待管理员审核后将授权码发送给您</p>`:""}
                ${e.licenseApplyResult==="error"?r`<p class="license-overlay__result error">提交失败，请稍后重试</p>`:""}
              </div>
            `:""}
          </div>
        </div>
      `:""}

      <div class="taxchat-body">
        <nav class="taxchat-sidebar ${e.sidebarCollapsed?"collapsed":""}">
          <div class="sidebar-menu">
            <button class="sidebar-item ${e.sidePanel==="conversations"?"active":""}" @click=${()=>{e.sidePanel=e.sidePanel==="conversations"?null:"conversations",v()}} title="对话">
              <span class="sidebar-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></span><span class="sidebar-label">对话</span>
            </button>
            <button class="sidebar-item ${e.sidePanel==="knowledge"?"active":""}" @click=${()=>{e.sidePanel=e.sidePanel==="knowledge"?null:"knowledge",e.sidePanel==="knowledge"&&V(),v()}} title="知识库">
              <span class="sidebar-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg></span><span class="sidebar-label">知识库</span>
            </button>
            <button class="sidebar-item ${e.sidePanel==="skills"?"active":""}" @click=${()=>{e.sidePanel=e.sidePanel==="skills"?null:"skills",e.sidePanel==="skills"&&e.skillsTab==="market"&&e.taxstoreConnected&&e.taxstoreSkills.length===0&&K(1),v()}} title="我的技能">
              <span class="sidebar-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg></span><span class="sidebar-label">我的技能</span>
            </button>
            <button class="sidebar-item ${e.sidePanel==="agents"?"active":""}" @click=${()=>{e.sidePanel=e.sidePanel==="agents"?null:"agents",e.sidePanel==="agents"&&oe(),v()}} title="我的智能体">
              <span class="sidebar-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span><span class="sidebar-label">我的智能体</span>
            </button>
            <button class="sidebar-item ${e.sidePanel==="favorites"?"active":""}" @click=${()=>{e.sidePanel=e.sidePanel==="favorites"?null:"favorites",v()}} title="收藏">
              <span class="sidebar-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></span><span class="sidebar-label">收藏</span>
            </button>
            <button class="sidebar-item ${e.sidePanel==="consult"?"active":""}" @click=${()=>{e.sidePanel==="consult"?e.sidePanel=null:(e.sidePanel="consult",e.consultView="list",e.consultAgents.length===0&&Re()),v()}} title="AI专家咨询">
              <span class="sidebar-icon" style="position:relative;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>${e.consultUnreadCount>0?r`<span class="sidebar-red-dot"></span>`:""}</span><span class="sidebar-label">AI专家咨询${e.consultUnreadCount>0?r`<span class="consult-unread-badge">${e.consultUnreadCount}</span>`:""}</span>
            </button>
          </div>
          <div class="sidebar-bottom">
            <button class="sidebar-item ${e.sidePanel==="settings"?"active":""}" @click=${()=>{e.sidePanel=e.sidePanel==="settings"?null:"settings",e.sidePanel==="settings"&&e.modelList.length===0&&es(),v()}} title="设置">
              <span class="sidebar-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg></span><span class="sidebar-label">设置</span>
            </button>
            <button class="sidebar-item ${e.sidePanel==="about"?"active":""}" @click=${()=>{e.sidePanel=e.sidePanel==="about"?null:"about",v()}} title="关于">
              <span class="sidebar-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg></span><span class="sidebar-label">关于</span>
            </button>
            <button class="sidebar-item" @click=${()=>{window.open("https://taxbot.cc","_blank")}} title="Taxbot">
              <span class="sidebar-icon"><img src="./assets/taxchat-logo.png" alt="Taxbot" style="width:18px;height:18px;border-radius:4px;object-fit:contain;" /></span><span class="sidebar-label">Taxbot</span>
            </button>
            <button class="sidebar-collapse-btn" @click=${()=>{e.sidebarCollapsed=!e.sidebarCollapsed,localStorage.setItem("taxbot_sidebar_collapsed",String(e.sidebarCollapsed)),v()}} title=${e.sidebarCollapsed?"展开侧栏":"收起侧栏"}>
              ${e.sidebarCollapsed?r`<span class="sidebar-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></span>`:r`<span class="sidebar-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg></span>`}
            </button>
          </div>
        </nav>

        <div class="side-panel ${e.sidePanel?"open":""} ${e.sidePanel==="about"||e.sidePanel==="settings"||e.sidePanel==="consult"?"fullscreen":""}"
             style="${e.sidePanel&&e.sidePanel!=="about"&&e.sidePanel!=="settings"&&e.sidePanel!=="consult"?`width:${e.sidePanelWidth}px`:""}">
          ${e.sidePanel&&e.sidePanel!=="about"&&e.sidePanel!=="settings"&&e.sidePanel!=="consult"?r`
            <div class="side-panel-resize" @mousedown=${Ki}></div>
          `:""}
        ${e.sidePanel==="conversations"?r`
          <div class="side-panel-view conversations-view">
            <div class="side-panel-header">
              <span class="panel-title"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px;"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> 对话列表</span>
              <button class="side-panel-close" @click=${()=>{e.sidePanel=null,v()}} title="关闭">✕</button>
            </div>
            <div class="side-panel-body">
              <button class="conv-new-btn" @click=${()=>{Pt()}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                新建对话
              </button>
              <div class="conv-list">
                ${[...e.conversations].sort((s,l)=>(l.lastAccessedAt||l.updatedAt)-(s.lastAccessedAt||s.updatedAt)).map(s=>{const l=s.id===e.currentConversationId,c=e.renamingConversation===s.id,u=e.confirmingConvDelete===s.id,g=new Date(s.updatedAt).toLocaleString("zh-CN",{month:"numeric",day:"numeric",hour:"2-digit",minute:"2-digit"}),p=e.unreadConversations.has(s.id),m=`taxchat-${s.id}`,h=[...e.activeRuns.values()].some(f=>f.sessionKey===m);return r`
                    <div class="conv-item ${l?"conv-item--active":""} ${p?"conv-item--unread":""}" @click=${()=>{!c&&!u&&Be(s.id)}}>
                      <div class="conv-item__main">
                        ${c?r`
                          <input class="conv-rename-input" type="text" .value=${s.title}
                            @click=${f=>f.stopPropagation()}
                            @keydown=${f=>{f.key==="Enter"&&zt(s.id,f.target.value),f.key==="Escape"&&(e.renamingConversation=null,v())}}
                            @blur=${f=>{zt(s.id,f.target.value)}}
                          />
                        `:r`
                          <div class="conv-item__title">${p?r`<span class="conv-unread-dot"></span>`:""}${s.title}</div>
                          <div class="conv-item__meta">${h?r`<span class="conv-replying">回复中...</span>`:""}${g} · ${s.messageCount} 条消息</div>
                        `}
                      </div>
                      ${u?r`
                        <div class="conv-delete-confirm" @click=${f=>f.stopPropagation()}>
                          <span>删除?</span>
                          <button class="conv-confirm-yes" @click=${()=>yn(s.id)}>是</button>
                          <button class="conv-confirm-no" @click=${()=>{e.confirmingConvDelete=null,v()}}>否</button>
                        </div>
                      `:r`
                        <div class="conv-item__actions">
                          <button class="conv-action-btn" @click=${f=>{f.stopPropagation(),e.renamingConversation=s.id,v(),requestAnimationFrame(()=>{const w=document.querySelector(".conv-rename-input");w&&(w.focus(),w.select())})}} title="重命名">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          </button>
                          <button class="conv-action-btn conv-action-btn--danger" @click=${f=>{f.stopPropagation(),e.confirmingConvDelete=s.id,v()}} title="删除">
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
        ${e.sidePanel==="favorites"?(()=>{const s=[];for(const u of e.conversations){const g=u.id===e.currentConversationId,p=g?e.favorites:qe(u.id);if(p.size===0)continue;const m=g?e.messages:Xe(u.id);for(const h of m)h.type==="assistant"&&p.has(h.id)&&s.push({msg:h,convId:u.id,convTitle:u.title})}const l=e.favSearchQuery.trim().toLowerCase(),c=l?s.filter(u=>u.msg.text.toLowerCase().includes(l)):s;return r`
          <div class="side-panel-view favorites-view">
            <div class="side-panel-header">
              <span class="panel-title"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> 收藏夹 (${c.length})</span>
              <button class="side-panel-close" @click=${()=>{e.sidePanel=null,v()}} title="关闭">✕</button>
            </div>
            <div class="fav-search-bar">
              <svg class="fav-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input class="fav-search-input" type="text" placeholder="搜索收藏..." .value=${e.favSearchQuery} @input=${u=>{e.favSearchQuery=u.target.value,v()}} />
              ${e.favSearchQuery?r`<button class="fav-search-clear" @click=${()=>{e.favSearchQuery="",v()}}>✕</button>`:""}
            </div>
            <div class="side-panel-body">
              ${c.length===0?r`<div class="favorites-empty">${e.favSearchQuery?"无匹配结果":"暂无收藏"}</div>`:(()=>{const u=new Map;for(const p of c){const m=new Date(p.msg.timestamp),h=`${m.getFullYear()}-${String(m.getMonth()+1).padStart(2,"0")}-${String(m.getDate()).padStart(2,"0")}`;u.has(h)||u.set(h,[]),u.get(h).push(p)}return[...u.entries()].sort((p,m)=>m[0].localeCompare(p[0])).map(([p,m])=>{const h=new Date,f=`${h.getFullYear()}-${String(h.getMonth()+1).padStart(2,"0")}-${String(h.getDate()).padStart(2,"0")}`,w=new Date(h);w.setDate(w.getDate()-1);const x=`${w.getFullYear()}-${String(w.getMonth()+1).padStart(2,"0")}-${String(w.getDate()).padStart(2,"0")}`;return r`
                      <div class="fav-date-group">
                        <div class="fav-date-header">${p===f?"今天":p===x?"昨天":p}<span class="fav-date-count">${m.length}</span></div>
                        ${m.map(y=>{const S=y.convId===e.currentConversationId;return r`
                          <div class="favorites-item" @click=${()=>{const ce=y.msg.id,I=y.convId;e.sidePanel=null,I!==e.currentConversationId&&Be(I),v(),setTimeout(()=>Mn(ce),350)}}>
                            <div class="favorites-item__text">${y.msg.text.length>80?y.msg.text.slice(0,80)+"...":y.msg.text}</div>
                            <div class="favorites-item__meta">
                              <span>${se(y.msg.timestamp)}</span>
                              ${S?"":r`<span class="fav-conv-tag">${y.convTitle}</span>`}
                              <button class="favorites-item__remove" @click=${ce=>{if(ce.stopPropagation(),S)Ms(y.msg.id);else{const I=qe(y.convId);I.delete(y.msg.id),It(y.convId,I),v()}}} title="取消收藏">✕</button>
                            </div>
                          </div>
                        `})}
                      </div>
                    `})})()}
            </div>
          </div>
        `})():""}
        ${e.sidePanel==="knowledge"?r`
          <div class="side-panel-view knowledge-view"
            @dragover=${s=>{s.preventDefault(),s.stopPropagation()}}
            @dragenter=${s=>{s.preventDefault(),s.stopPropagation(),xe(Me+1),e.knowledgeDragOver||(e.knowledgeDragOver=!0,v())}}
            @dragleave=${s=>{s.preventDefault(),s.stopPropagation(),xe(Me-1),Me<=0&&(xe(0),e.knowledgeDragOver=!1,v())}}
            @drop=${s=>{s.preventDefault(),s.stopPropagation(),xe(0),e.knowledgeDragOver=!1,v(),Zn(s)}}
          >
            <div class="side-panel-header">
              <span class="panel-title"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px;"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg> 知识库</span>
              <button class="side-panel-close" @click=${()=>{e.sidePanel=null,v()}} title="关闭">✕</button>
            </div>
            <div class="side-panel-body">
              ${e.knowledgePreview?r`
                <div class="knowledge-preview">
                  <div class="knowledge-preview-header">
                    <button class="knowledge-preview-back" @click=${()=>la()}>← 返回</button>
                    <span class="knowledge-preview-name" title=${e.knowledgePreview.name}>${e.knowledgePreview.name}</span>
                    <button class="knowledge-file-btn ref" @click=${()=>{Kt(e.knowledgePreview.name)}} title="引用到对话">引用</button>
                    ${e.knowledgePreview.type==="pdf"&&e.knowledgePreview.extractedText?r`
                      <button class="knowledge-preview-toggle" @click=${()=>ca()}
                        title=${e.knowledgePreview.pdfTextMode?"切换到PDF视图":"切换到文本视图"}>
                        ${e.knowledgePreview.pdfTextMode?"PDF":"文本"}
                      </button>
                    `:""}
                  </div>
                  <div class="knowledge-preview-body" style="position:relative;"
                    @mouseup=${s=>oa(s)}
                    @mousedown=${()=>da()}>
                    ${e.knowledgePreview.loading?r`
                      <div class="knowledge-preview-loading">加载中...</div>
                    `:e.knowledgePreview.error?r`
                      <div class="knowledge-preview-error">
                        <div>${e.knowledgePreview.error}</div>
                      </div>
                    `:e.knowledgePreview.type==="text"?r`
                      <pre>${e.knowledgePreview.content}</pre>
                    `:e.knowledgePreview.type==="image"?r`
                      <img src=${e.knowledgePreview.url} alt=${e.knowledgePreview.name} />
                    `:e.knowledgePreview.type==="pdf"?r`
                      ${e.knowledgePreview.pdfTextMode?r`
                        <div class="markdown-body">${ut(We(e.knowledgePreview.extractedText||""))}</div>
                      `:r`
                        <iframe src=${e.knowledgePreview.url} style="width:80%;height:80%;margin:auto;display:block;min-height:500px;"></iframe>
                      `}
                    `:e.knowledgePreview.type==="html"?r`
                      <div class="html-preview markdown-body">${ut(e.knowledgePreview.content)}</div>
                    `:r`
                      <div class="knowledge-preview-error">
                        <div>该文件格式暂不支持预览</div>
                      </div>
                    `}
                    ${e.knowledgeQuoteBtn?r`
                      <button class="knowledge-quote-float"
                        style="left:${e.knowledgeQuoteBtn.x}px;top:${e.knowledgeQuoteBtn.y}px;"
                        @mousedown=${s=>{s.preventDefault(),s.stopPropagation(),ra()}}>
                        引用选中
                      </button>
                    `:""}
                  </div>
                </div>
              `:r`
              ${e.authorizedFolder?r`
                <div class="knowledge-folder-bar">
                  <span class="knowledge-folder-path" title=${e.authorizedFolder}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;flex-shrink:0;"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg> ${e.authorizedFolder}</span>
                  <button class="knowledge-folder-change" @click=${()=>it().then(()=>V())} title="更换文件夹">更换</button>
                  <button class="knowledge-folder-change" @click=${()=>V()} title="刷新文件列表">刷新</button>
                </div>
                ${e.knowledgeFiles.length>0?r`
                  <div class="sort-bar">
                    <span class="sort-bar__label">排序:</span>
                    <button class="sort-bar__btn ${e.filesSortBy==="time"?"active":""}" @click=${()=>{e.filesSortBy="time",v()}}>按时间</button>
                    <button class="sort-bar__btn ${e.filesSortBy==="name"?"active":""}" @click=${()=>{e.filesSortBy="name",v()}}>按名称</button>
                  </div>
                `:""}
                ${e.knowledgeDragOver?r`
                  <div class="knowledge-drop-zone">
                    <div class="knowledge-drop-text"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-4px;"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg> 松开以添加文件到知识库</div>
                  </div>
                `:""}
                ${e.knowledgeLoading?r`
                  <div class="knowledge-empty">加载中...</div>
                `:e.knowledgeFiles.length===0?r`
                  <div class="knowledge-empty">文件夹中没有可识别的文件<br><small>支持: txt, pdf, docx, xlsx, csv, json, md 等</small></div>
                `:An().map(s=>r`
                  <div class="knowledge-file-item">
                    <span class="knowledge-file-icon">${s.type==="image"?r`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`:s.type==="doc"?r`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`:r`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`}</span>
                    <span class="knowledge-file-name clickable" title=${s.name} @click=${()=>ia(s)}>${s.name}</span>
                    <span class="knowledge-file-size">${et(s.size)}</span>
                    <button class="knowledge-file-btn ref" @click=${()=>Kt(s.name)} title="引用到对话">引用</button>
                    <button class="knowledge-file-btn del" @click=${()=>ta(s.name)} title="删除文件"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
                  </div>
                `)}
              `:r`
                <div class="knowledge-empty">
                  <div style="margin-bottom: 12px; color: #9ca3af;"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg></div>
                  <div style="margin-bottom: 16px; color: #6b7280;">尚未选择知识库文件夹</div>
                  <button class="skill-add-btn" @click=${()=>it().then(()=>V())}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg> 选择文件夹</button>
                </div>
              `}
              `}
            </div>
          </div>
        `:""}
        ${e.sidePanel==="skills"?r`
          <div class="side-panel-view skills-view" style="display:flex;flex-direction:column;overflow:hidden;">
            <div class="side-panel-header">
              <span class="panel-title"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px;"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> 技能</span>
              <button class="side-panel-close" @click=${()=>{e.sidePanel=null,v()}} title="关闭">✕</button>
            </div>
            <!-- Tab Bar -->
            <div class="skills-tab-bar">
              <button class="skills-tab ${e.skillsTab==="installed"?"active":""}"
                @click=${()=>{e.skillsTab="installed",v()}}>已安装</button>
              <button class="skills-tab ${e.skillsTab==="market"?"active":""}"
                @click=${()=>{e.skillsTab="market",e.taxstoreConnected&&e.taxstoreSkills.length===0&&K(1),v()}}>市场</button>
            </div>
            <!-- Installed Tab -->
            ${e.skillsTab==="installed"?r`
            <div class="side-panel-body">
              <div class="skill-section-header" @click=${()=>{e.builtinSkillsCollapsed=!e.builtinSkillsCollapsed,v()}}>
                <span class="skill-section-arrow ${e.builtinSkillsCollapsed?"collapsed":""}">▾</span>
                <span class="skill-section-label">预制技能</span>
                <span class="skill-section-count">${R.length}</span>
              </div>
              ${e.builtinSkillsCollapsed?"":R.map(s=>r`
                <div class="skill-item skill-item--builtin">
                  <div class="skill-item__emoji" @click=${()=>te(s)} style="cursor:pointer">${s.emoji}</div>
                  <div class="skill-item__body" @click=${()=>te(s)} style="cursor:pointer">
                    <div class="skill-item__name">${s.name} <span class="skill-builtin-badge">预制</span></div>
                    ${s.description?r`<div class="skill-item__desc">${s.description}</div>`:""}
                  </div>
                </div>
              `)}
              <div class="skill-section-label" style="margin-top: 12px; padding-left: 12px;">自定义技能</div>
              <div class="skill-add-row">
                <button class="skill-add-btn" @click=${()=>Vt()}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> 新建 Skill</button>
                <button class="skill-add-btn" @click=${()=>Wn()}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> 上传技能包</button>
              </div>
              ${e.customSkills.length>1?r`
                <div class="sort-bar">
                  <span class="sort-bar__label">排序:</span>
                  <button class="sort-bar__btn ${e.skillsSortBy==="time"?"active":""}" @click=${()=>{e.skillsSortBy="time",v()}}>按时间</button>
                  <button class="sort-bar__btn ${e.skillsSortBy==="name"?"active":""}" @click=${()=>{e.skillsSortBy="name",v()}}>按名称</button>
                </div>
              `:""}
              ${e.customSkills.length===0?r`<div class="knowledge-empty" style="padding: 12px;">暂无自定义技能</div>`:Sn().map(s=>r`
                  <div class="skill-item skill-item--custom">
                    <div class="skill-item__emoji" @click=${()=>te(s)} style="cursor:pointer">${s.emoji}</div>
                    <div class="skill-item__body" @click=${()=>te(s)} style="cursor:pointer">
                      <div class="skill-item__name">${s.name}</div>
                      ${s.description?r`<div class="skill-item__desc">${s.description}</div>`:""}
                    </div>
                    <div class="skill-item__actions">
                      <button class="skill-item__btn ${s.pinned?"pinned":""}" @click=${()=>Qn(s.id)} title="${s.pinned?"取消快捷":"添加到快捷"}"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/></svg></button>
                      <button class="skill-item__btn" @click=${()=>Hn(s)} title="导出"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button>
                      <button class="skill-item__btn" @click=${()=>Vt(s)} title="编辑"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                      <button class="skill-item__btn" @click=${()=>Kn(s.id)} title="删除"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
                    </div>
                  </div>
                `)}
            </div>
            `:""}
            <!-- Market Tab -->
            ${e.skillsTab==="market"?r`
            ${e.taxstoreConnected?r`
              <div class="ts-user-bar">
                <span class="ts-user-name">${e.taxstoreUser?.name||e.taxstoreUser?.email}</span>
                <span class="ts-points-badge">${e.taxstoreUser?.points??0} 积分</span>
                <button class="ts-logout-btn" @click=${li} title="断开连接">退出</button>
              </div>
              ${e.taxstoreUpdates.length>0?r`
                <div class="ts-update-banner">
                  <span class="ts-update-banner-icon">🔄</span>
                  <span class="ts-update-banner-text">${e.taxstoreUpdates.length} 个技能有更新可用</span>
                </div>
              `:""}
              <div class="ts-filter-bar">
                <input class="ts-search-input" type="text" placeholder="搜索技能..."
                  .value=${e.taxstoreQuery}
                  @input=${s=>{e.taxstoreQuery=s.target.value}}
                  @keydown=${s=>{s.key==="Enter"&&oi(e.taxstoreQuery)}} />
                <button class="ts-sort-btn ${e.taxstoreSort==="latest"?"active":""}"
                  @click=${()=>ls("latest")}>最新</button>
                <button class="ts-sort-btn ${e.taxstoreSort==="popular"?"active":""}"
                  @click=${()=>ls("popular")}>热门</button>
              </div>
              <div class="ts-category-bar">
                <button class="ts-cat-tag ${e.taxstoreCategory===""?"active":""}"
                  @click=${()=>ue("")}>全部</button>
                <button class="ts-cat-tag ${e.taxstoreCategory==="tax-tools"?"active":""}"
                  @click=${()=>ue("tax-tools")}>税务工具</button>
                <button class="ts-cat-tag ${e.taxstoreCategory==="forms"?"active":""}"
                  @click=${()=>ue("forms")}>报表</button>
                <button class="ts-cat-tag ${e.taxstoreCategory==="reporting"?"active":""}"
                  @click=${()=>ue("reporting")}>报告</button>
                <button class="ts-cat-tag ${e.taxstoreCategory==="automation"?"active":""}"
                  @click=${()=>ue("automation")}>自动化</button>
              </div>
              ${e.taxstoreError?r`<div class="ts-error">${e.taxstoreError}</div>`:""}
              ${e.taxstoreLoading?r`<div class="ts-loading">加载中...</div>`:r`
                <div class="ts-skills-list">
                  ${e.taxstoreSkills.length===0?r`<div class="ts-empty">${e.taxstoreQuery?"未找到匹配技能":"暂无技能"}</div>`:e.taxstoreSkills.map(s=>{const l=gi(s.id);return r`
                        <div class="ts-skill-card">
                          <div class="ts-skill-header">
                            <span class="ts-skill-name">${s.name}</span>
                            <span class="ts-skill-version">v${s.version}</span>
                          </div>
                          ${s.description?r`<div class="ts-skill-desc">${s.description}</div>`:""}
                          <div class="ts-skill-meta">
                            <span class="ts-skill-rating">${s.reviews?.length?r`★ ${pi(s.reviews)}`:""}</span>
                            <span>${s.downloads} 下载</span>
                            <span class="ts-skill-cost ${s.pointsCost===0?"free":"paid"}">${s.pointsCost===0?"免费":`${s.pointsCost} 积分`}</span>
                            <span>${s.author?.name||""}</span>
                            ${e.taxstoreInstallingId===s.id?r`<span class="ts-install-progress">${e.taxstoreInstallStep==="downloading"?"下载中...":"安装中..."}</span>`:r`<button class="ts-install-btn ${l?"installed":""}"
                                  @click=${()=>{l||ri(s)}}
                                  ?disabled=${l||!!e.taxstoreInstallingId}>
                                  ${l?"已安装":"安装"}
                                </button>`}
                          </div>
                        </div>
                      `})}
                </div>
                ${e.taxstoreTotalPages>1?r`
                  <div class="ts-pagination">
                    <button class="ts-page-btn" ?disabled=${e.taxstorePage<=1}
                      @click=${()=>K(e.taxstorePage-1)}>上一页</button>
                    <span>${e.taxstorePage} / ${e.taxstoreTotalPages}</span>
                    <button class="ts-page-btn" ?disabled=${e.taxstorePage>=e.taxstoreTotalPages}
                      @click=${()=>K(e.taxstorePage+1)}>下一页</button>
                  </div>
                `:""}
              `}
            `:r`
              <div class="ts-login">
                <div class="ts-login-title">连接 TaxStore</div>
                <div class="ts-login-desc">登录 taxbot.cc 账户，浏览和安装技能</div>
                <input type="email" placeholder="邮箱" .value=${e.taxstoreLoginEmail}
                  @input=${s=>{e.taxstoreLoginEmail=s.target.value}} />
                <input type="password" placeholder="密码" .value=${e.taxstoreLoginPassword}
                  @input=${s=>{e.taxstoreLoginPassword=s.target.value}}
                  @keydown=${s=>{s.key==="Enter"&&is(e.taxstoreLoginEmail,e.taxstoreLoginPassword)}} />
                ${e.taxstoreError?r`<div class="ts-login-error">${e.taxstoreError}</div>`:""}
                <button class="ts-login-btn" ?disabled=${e.taxstoreLoading}
                  @click=${()=>is(e.taxstoreLoginEmail,e.taxstoreLoginPassword)}>
                  ${e.taxstoreLoading?"连接中...":"登录"}
                </button>
                <div class="ts-login-desc" style="margin-top:4px;">
                  没有账户？访问 <a href="https://taxbot.cc:8443/taxbot" target="_blank" style="color:#2E5484;">taxbot.cc</a> 注册
                </div>
              </div>
            `}
            `:""}
          </div>
        `:""}
        ${e.sidePanel==="agents"?r`
          <div class="side-panel-view agents-view">
            <div class="side-panel-header">
              <span class="panel-title"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px;"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> 我的智能体</span>
              <button class="side-panel-close" @click=${()=>{e.sidePanel=null,v()}} title="关闭">✕</button>
            </div>
            <div class="side-panel-body">
              <!-- Tab bar -->
              <div class="rental-tab-bar">
                <button class="rental-tab ${e.rentalActiveTab==="agents"?"rental-tab--active":""}"
                  @click=${()=>{e.rentalActiveTab="agents",v()}}>
                  🤖 智能体列表
                </button>
                <button class="rental-tab ${e.rentalActiveTab==="tasks"?"rental-tab--active":""}"
                  @click=${()=>{e.rentalActiveTab="tasks",v()}}>
                  📋 任务
                  ${e.rentalPendingTasks.length>0?r`<span class="rental-tab-badge">${e.rentalPendingTasks.length}</span>`:""}
                </button>
              </div>

              ${e.rentalActiveTab==="agents"?r`
              <!-- 智能体列表 tab -->
              <div class="skill-add-row">
                <button class="skill-add-btn" @click=${()=>{e.editingAgentId=null,e.agentCreateDraft={name:"",emoji:"🤖",description:"",identityDesc:"",expertise:"",avatarDataUrl:"",selectedSkills:[]},e.creatingAgent=!e.creatingAgent,v()}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> 新建智能体
                </button>
              </div>
              ${e.agentsLoading?r`<div class="knowledge-empty">加载中...</div>`:""}
              ${!e.agentsLoading&&e.agentsList.length===0?r`<div class="knowledge-empty">暂无智能体</div>`:""}
              ${e.agentsList.map(s=>{const l=fi(s.id),c=l?qi(l.id):[],u=c.reduce((g,p)=>g+p.price,0);return r`
                <div class="skill-item agent-card-uniform" @click=${()=>{at(s)}} style="cursor:pointer" title="点击@${s.name}">
                  <div class="skill-item__emoji">${s.avatarUrl?r`<img src="${s.avatarUrl}" class="agent-avatar-img" />`:s.emoji}</div>
                  <div class="skill-item__body">
                    <div class="skill-item__name">${s.name} ${s.isDefault?r`<span class="skill-builtin-badge">默认</span>`:""}</div>
                    <div class="skill-item__desc">${s.description||" "}</div>
                    <div class="agent-card-rental-line">${l?r`<span class="agent-rental-badge agent-rental-badge--active">🏪 ${l.price}积分/次</span>${c.length>0?r`<span class="agent-card-stats">✅${c.length}${l.avgRating>0?r` ⭐${l.avgRating.toFixed(1)}`:""} 💰${u}</span>`:""}`:" "}</div>
                  </div>
                  <div class="skill-item__actions">
                    ${s.isDefault?r`
                      ${l?r`<button class="agent-action-btn" @click=${g=>{g.stopPropagation(),rs(l.id)}}>下架</button>`:e.taxstoreConnected?r`<button class="agent-rental-badge agent-rental-badge--btn" @click=${g=>{g.stopPropagation(),os(s)}}>🏪 出租赚积分</button>`:""}
                    `:r`
                      ${e.confirmingAgentDelete===s.id?r`
                        <span class="agent-delete-confirm">
                          确定删除？
                          <button class="agent-action-btn agent-action-btn--danger" @click=${g=>{g.stopPropagation(),Fn(s.id)}}>是</button>
                          <button class="agent-action-btn" @click=${g=>{g.stopPropagation(),e.confirmingAgentDelete=null,v()}}>否</button>
                        </span>
                      `:r`
                        ${l?r`<button class="agent-action-btn" @click=${g=>{g.stopPropagation(),rs(l.id)}}>下架</button>`:e.taxstoreConnected?r`<button class="agent-rental-badge agent-rental-badge--btn" @click=${g=>{g.stopPropagation(),os(s)}}>🏪 出租赚积分</button>`:""}
                        <button class="agent-action-btn" @click=${g=>{g.stopPropagation(),Un(s)}}>编辑</button>
                        <button class="agent-action-btn agent-action-btn--danger" @click=${g=>{g.stopPropagation(),e.confirmingAgentDelete=s.id,v()}}>删除</button>
                      `}
                    `}
                  </div>
                </div>
              `})}
              `:r`
              <!-- 任务 tab -->
              <!-- 待处理任务 -->
              ${e.rentalPendingTasks.length>0?r`
                <div class="rental-tasks-section">
                  <div class="rental-tasks-header">
                    📋 待处理任务 <span class="rental-tasks-count">${e.rentalPendingTasks.length}</span>
                  </div>
                  ${e.rentalPendingTasks.map(s=>r`
                    <div class="rental-task-card" @click=${()=>rt(s)}>
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
              ${e.rentalCompletedTasks.length>0?r`
                <div class="rental-tasks-section">
                  <div class="rental-tasks-header">
                    ✅ 已完成任务 <span class="rental-completed-count">${e.rentalCompletedTasks.length}</span>
                  </div>
                  ${e.rentalCompletedTasks.map(s=>r`
                    <div class="rental-task-card rental-task-card--completed" @click=${()=>{e.rentalTaskDetailView=s,d()}}>
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

              ${e.rentalPendingTasks.length===0&&e.rentalCompletedTasks.length===0?r`
                <div class="rental-tasks-empty">暂无任务记录</div>
              `:""}
              `}

              <!-- 推荐模板 (仅在智能体列表 tab 显示) -->
              ${e.rentalActiveTab==="agents"&&Bt.some(s=>!e.agentsList.some(l=>l.name===s.name))?r`
                <div class="agent-templates-section">
                  <div class="agent-templates-header">推荐模板</div>
                  ${Bt.map(s=>{const l=e.agentsList.some(c=>c.name===s.name);return r`
                      <div class="agent-template-item">
                        <span class="agent-template-emoji">${s.emoji}</span>
                        <div class="agent-template-body">
                          <div class="agent-template-name">${s.name}</div>
                          <div class="agent-template-desc">${s.description}</div>
                        </div>
                        ${l?r`<span class="agent-template-badge">已创建</span>`:r`<button class="agent-template-btn" @click=${c=>{c.stopPropagation(),On(s)}}>一键创建</button>`}
                      </div>
                    `})}
                </div>
              `:""}
            </div>
          </div>
        `:""}
        ${e.sidePanel==="settings"?r`
          <div class="side-panel-view settings-view">
            <div class="side-panel-header">
              <span class="panel-title">${e.settingsView==="license"?r`
                <button class="settings-back-btn" @click=${()=>{e.settingsView="main",v()}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                </button> 授权管理
              `:e.settingsView==="model"?r`
                <button class="settings-back-btn" @click=${()=>{e.settingsView="main",e.modelError=null,v()}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                </button> 模型配置
              `:r`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px;"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg> 设置`}</span>
              <button class="side-panel-close" @click=${()=>{e.sidePanel=null,e.settingsView="main",e.confirmingClear=!1,e.modelError=null,e.licenseApplyResult=null,v()}} title="关闭">✕</button>
            </div>
            <div class="side-panel-body settings-fullscreen">
              ${e.settingsView==="model"?r`
              <!-- Model Config Sub-View -->
              <div class="about-settings">
                ${e.modelLoading?r`<div class="knowledge-empty">加载中...</div>`:r`
                  ${e.activeModel?r`
                  <div class="model-current-card">
                    <div class="model-current-title">当前模型</div>
                    <div class="model-current-rows">
                      <div class="model-current-row"><span class="model-current-label">提供商</span><span class="model-current-value">${e.activeModel.provider||"-"}</span></div>
                      <div class="model-current-row"><span class="model-current-label">模型</span><span class="model-current-value">${e.activeModel.modelId||"-"}</span></div>
                      <div class="model-current-row"><span class="model-current-label">API 地址</span><span class="model-current-value">${e.activeModel.baseUrl||"-"}</span></div>
                      <div class="model-current-row">
                        <span class="model-current-label">API Key</span>
                        <span class="model-current-value model-current-key">
                          ${e.activeModel.apiKey?e.apiKeyVisible?e.activeModel.apiKey:e.activeModel.apiKey.replace(/./g,"•"):"-"}
                          ${e.activeModel.apiKey?r`<button class="settings-key-toggle-sm" type="button" @click=${()=>{e.apiKeyVisible=!e.apiKeyVisible,v()}} title=${e.apiKeyVisible?"隐藏":"显示"}>
                            ${e.apiKeyVisible?r`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`:r`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`}
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
                        <select class="settings-input" .value=${e.modelConfigDraft.provider} @change=${s=>{Sa(s.target.value)}}>
                          ${e.modelList.length===0&&!e.modelConfigDraft.provider?r`<option value="">-- 无可用提供商 --</option>`:""}
                          ${Aa().map(s=>r`
                            <option value=${s} ?selected=${s===e.modelConfigDraft.provider}>${s}${(()=>{const l=wt(s).length;return l>0?` (${l} 个模型)`:""})()}</option>
                          `)}
                        </select>
                      </div>
                      <div class="settings-field">
                        <label class="settings-label">模型</label>
                        ${(()=>{const s=wt(e.modelConfigDraft.provider);return r`
                            <select class="settings-input" .value=${e.modelConfigDraft.modelId} @change=${l=>{Ca(l.target.value)}}>
                              ${s.length===0?r`<option value="">-- 无可用模型 --</option>`:""}
                              ${s.map(l=>r`
                                <option value=${l.id} ?selected=${l.id===e.modelConfigDraft.modelId}>${l.name||l.id}${l.contextWindow?` (${Math.round(l.contextWindow/1024)}K)`:""}${l.reasoning?" · 推理":""}</option>
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
                        <input class="settings-input" type="text" .value=${e.modelConfigDraft.baseUrl} @input=${s=>{e.modelConfigDraft.baseUrl=s.target.value}} placeholder="如: https://api.openai.com/v1" />
                      </div>
                      <div class="settings-field">
                        <label class="settings-label">API Key</label>
                        <div class="settings-input-wrap">
                          <input class="settings-input settings-input-key" type=${e.apiKeyVisible?"text":"password"} .value=${e.modelConfigDraft.apiKey} @input=${s=>{e.modelConfigDraft.apiKey=s.target.value}} placeholder="sk-..." />
                          <button class="settings-key-toggle" type="button" @click=${()=>{e.apiKeyVisible=!e.apiKeyVisible,v()}} title=${e.apiKeyVisible?"隐藏":"显示"}>
                            ${e.apiKeyVisible?r`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`:r`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`}
                          </button>
                        </div>
                      </div>
                      <div class="settings-field">
                        <label class="settings-label">API 协议</label>
                        <select class="settings-input" .value=${e.modelConfigDraft.api} @change=${s=>{e.modelConfigDraft.api=s.target.value,v()}}>
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
                  ${e.modelError?r`<div class="settings-error">${e.modelError}</div>`:""}
                  ${e.confirmingModelSave?r`
                    <div class="model-confirm-overlay">
                      <div class="model-confirm-dialog">
                        <div class="model-confirm-title">确认更换模型</div>
                        <div class="model-confirm-info">
                          <div class="model-confirm-row"><span class="model-confirm-label">提供商</span><span class="model-confirm-value">${e.modelConfigDraft.provider}</span></div>
                          <div class="model-confirm-row"><span class="model-confirm-label">模型</span><span class="model-confirm-value">${e.modelConfigDraft.modelId}</span></div>
                          <div class="model-confirm-row"><span class="model-confirm-label">API 地址</span><span class="model-confirm-value">${e.modelConfigDraft.baseUrl}</span></div>
                          <div class="model-confirm-row"><span class="model-confirm-label">API 协议</span><span class="model-confirm-value">${e.modelConfigDraft.api}</span></div>
                        </div>
                        <div class="model-confirm-hint">更换模型后服务将自动重启</div>
                        <div class="model-confirm-actions">
                          <button class="model-confirm-btn cancel" @click=${()=>{e.confirmingModelSave=!1,v()}}>取消</button>
                          <button class="model-confirm-btn confirm" @click=${()=>{e.confirmingModelSave=!1,Ma()}} ?disabled=${e.modelSaving}>
                            ${e.modelSaving?"保存中...":"确认更换"}
                          </button>
                        </div>
                      </div>
                    </div>
                  `:r`
                    <button class="settings-save-btn" @click=${()=>{e.confirmingModelSave=!0,e.modelError=null,v()}} ?disabled=${e.modelSaving}>
                      保存配置
                    </button>
                  `}
                `}
              </div>
              `:r`
              ${e.settingsView==="license"?r`
              <!-- License Settings Sub-View -->
              <div class="about-settings">
                <div class="about-setting-group">
                  <div class="about-setting-title">当前状态</div>
                  <div class="license-status-card ${e.licenseStatus}">
                    ${e.licenseStatus==="licensed"?r`
                      <div class="license-status-icon">✅</div>
                      <div class="license-status-text">
                        <strong>已授权</strong>
                        <span>剩余 ${Ni()} 天 · 到期 ${e.licenseExpiresAt?new Date(e.licenseExpiresAt).toLocaleDateString("zh-CN"):""}</span>
                      </div>
                    `:e.licenseStatus==="trial"?r`
                      <div class="license-status-icon">⏳</div>
                      <div class="license-status-text">
                        <strong>试用中</strong>
                        <span>剩余 ${dt()} 天</span>
                      </div>
                    `:r`
                      <div class="license-status-icon">🔒</div>
                      <div class="license-status-text">
                        <strong>已过期</strong>
                        <span>试用期已结束</span>
                      </div>
                    `}
                  </div>
                </div>
                <div class="about-setting-group">
                  <div class="about-setting-title">填写授权码</div>
                  <div class="license-activate-row">
                    <input type="text" class="license-code-input" placeholder="XXXX-XXXX-XXXX-XXXX"
                      .value=${e.licenseActivateCode}
                      @input=${s=>{e.licenseActivateCode=s.target.value,v()}}
                      @keydown=${s=>{s.key==="Enter"&&Se()}} />
                    <button class="license-activate-btn" @click=${Se} .disabled=${e.licenseActivating}>
                      ${e.licenseActivating?"激活中...":"激活"}
                    </button>
                  </div>
                </div>
                <div class="about-setting-group">
                  <div class="about-setting-title">申请使用授权</div>
                  <div class="license-apply-form">
                    <input type="email" class="settings-input" placeholder="邮箱" .value=${e.licenseApplyForm.email}
                      @input=${s=>{e.licenseApplyForm.email=s.target.value}} />
                    <input type="tel" class="settings-input" placeholder="手机号" .value=${e.licenseApplyForm.phone}
                      @input=${s=>{e.licenseApplyForm.phone=s.target.value}} />
                    <input type="text" class="settings-input" placeholder="申请原因" .value=${e.licenseApplyForm.reason}
                      @input=${s=>{e.licenseApplyForm.reason=s.target.value}} />
                    <select class="settings-input" .value=${e.licenseApplyForm.period}
                      @change=${s=>{e.licenseApplyForm.period=s.target.value,v()}}>
                      <option value="30天">申请 30 天</option>
                      <option value="90天">申请 90 天</option>
                      <option value="180天">申请 180 天</option>
                      <option value="365天">申请 365 天</option>
                    </select>
                    <button class="about-action-btn" @click=${fs} .disabled=${e.licenseApplying}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                      <span>${e.licenseApplying?"提交中...":"提交申请"}</span>
                    </button>
                    ${e.licenseApplyResult==="success"?r`<p style="color:var(--green-600);font-size:12px;margin-top:8px;">申请已提交，请等待管理员审核</p>`:""}
                    ${e.licenseApplyResult==="error"?r`<p style="color:var(--danger);font-size:12px;margin-top:8px;">提交失败，请稍后重试</p>`:""}
                  </div>
                </div>
              </div>
              `:r`
              <!-- Settings Main View -->
              <div class="about-settings">
                <div class="about-setting-group">
                  <div class="about-setting-title">授权</div>
                  <div class="about-setting-row">
                    <button class="about-action-btn" @click=${()=>{e.settingsView="license",e.licenseView="status",v()}}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
                      </svg>
                      <span>授权管理</span>
                      <span class="settings-model-tag" style="background: ${e.licenseStatus==="licensed"?"var(--green-50, #f0fdf4)":e.licenseStatus==="trial"?"var(--amber-50, #fffbeb)":"var(--red-50, #fef2f2)"}; color: ${e.licenseStatus==="licensed"?"var(--green-600, #16a34a)":e.licenseStatus==="trial"?"var(--amber-600, #d97706)":"var(--danger, #dc2626)"}">
                        ${e.licenseStatus==="licensed"?"已授权":e.licenseStatus==="trial"?`试用 ${dt()}天`:"已过期"}
                      </span>
                    </button>
                  </div>
                </div>
                <div class="about-setting-group">
                  <div class="about-setting-title">模型</div>
                  <div class="about-setting-row">
                    <button class="about-action-btn" @click=${()=>{e.settingsView="model",es(),v()}}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                        <line x1="12" y1="22.08" x2="12" y2="12"/>
                      </svg>
                      <span>模型配置</span>
                      ${e.modelList.length>0?r`<span class="settings-model-tag">${e.modelConfigDraft.modelId||e.modelList[0]?.name||e.modelList[0]?.id}</span>`:""}
                    </button>
                  </div>
                </div>
                <div class="about-setting-group">
                  <div class="about-setting-title">字体大小</div>
                  <div class="font-size-picker">
                    ${["small","medium","large","xlarge"].map(s=>{const l=s==="small"?"小":s==="medium"?"中":s==="large"?"大":"超大",c=s==="small"?"12px":s==="medium"?"14px":s==="large"?"16px":"19px";return r`
                      <button class="font-size-btn ${e.fontSize===s?"font-size-btn--active":""}"
                        @click=${()=>{e.fontSize=s,localStorage.setItem("taxbot_font_size",s),document.documentElement.setAttribute("data-font-size",s),v()}}>
                        <span class="font-size-btn__label" style="font-size:${c}">${l}</span>
                        <span class="font-size-btn__sample" style="font-size:${c}">Aa</span>
                      </button>`})}
                  </div>
                </div>
                <div class="about-setting-group">
                  <div class="about-setting-title">知识库</div>
                  <div class="about-setting-row">
                    <button class="about-action-btn" @click=${()=>{it()}} ?disabled=${e.importingFolder}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                      </svg>
                      <span>${e.importingFolder?"导入中...":"授权访问文件夹"}</span>
                      ${e.authorizedFolder?r`
                        <span class="settings-folder-info">
                          <span class="settings-folder-path" title=${e.authorizedFolder}>${e.authorizedFolder}</span>
                          <button class="settings-folder-refresh" @click=${s=>{s.stopPropagation(),sa()}} ?disabled=${e.importingFolder} title="重新读取文件夹">
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
                    ${e.importResult?r`<div class="about-folder-status">${e.importResult}</div>`:""}
                  </div>
                </div>
                <div class="about-setting-group">
                  <div class="about-setting-title">数据管理</div>
                  <div class="about-setting-row">
                    ${e.confirmingClear?r`
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <span class="about-confirm-hint" style="margin: 0;">确认清空所有对话记录？</span>
                        <button class="about-confirm-btn confirm" @click=${()=>{$a()}}>确认</button>
                        <button class="about-confirm-btn cancel" @click=${()=>{e.confirmingClear=!1,v()}}>取消</button>
                      </div>
                    `:r`
                      <button class="about-action-btn danger" @click=${()=>{e.confirmingClear=!0,v()}}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                        <span>清空对话记录</span>
                      </button>
                    `}
                  </div>
                  <div class="about-setting-row" style="margin-top: 8px;">
                    ${e.confirmingSessionClear?r`
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <span class="about-confirm-hint" style="margin: 0;">确认清空服务端会话？此操作不可恢复。</span>
                        <button class="about-confirm-btn confirm" @click=${()=>{ya()}}>确认</button>
                        <button class="about-confirm-btn cancel" @click=${()=>{e.confirmingSessionClear=!1,v()}}>取消</button>
                      </div>
                    `:r`
                      <button class="about-action-btn danger" @click=${()=>{e.confirmingSessionClear=!0,v()}}>
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
                    ${e.confirmingExit?r`
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <span class="about-confirm-hint" style="margin: 0;">确认退出？将关闭窗口并关闭 Gateway。</span>
                        <button class="about-confirm-btn confirm" @click=${()=>{Zt()}}>确认退出</button>
                        <button class="about-confirm-btn cancel" @click=${()=>{e.confirmingExit=!1,v()}}>取消</button>
                      </div>
                    `:r`
                      <button class="about-action-btn danger" @click=${()=>{e.confirmingExit=!0,v()}}>
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
            `}
            </div>
          </div>
        `:""}
        ${e.sidePanel==="about"?r`
          <div class="side-panel-view about-view">
            <div class="side-panel-header">
              <span class="panel-title">关于</span>
              <button class="side-panel-close" @click=${()=>{e.sidePanel=null,v()}} title="关闭">✕</button>
            </div>
            <div class="side-panel-body about-fullscreen">
              <div class="about-hero">
                <div class="about-logo">
                  <img src="./assets/taxchat-logo.png" alt="Taxbot" />
                </div>
                <div class="about-hero-text">
                  <div class="about-title">Taxbot Evo</div>
                  <div class="about-subtitle">AI 税务助理 · v${gt}</div>
                </div>
              </div>
              <div class="about-update-section">
                ${e.updateAvailable?r`
                  <div class="about-update-available">
                    <div class="about-update-info">
                      <span class="about-update-badge">New</span>
                      <span>发现新版本 <strong>v${e.updateAvailable.version}</strong></span>
                    </div>
                    ${e.updateAvailable.changelog?r`<div class="about-update-changelog">${e.updateAvailable.changelog}</div>`:""}
                    <button class="about-update-download" @click=${()=>window.open(e.updateAvailable.downloadUrl,"_blank")}>前往下载</button>
                  </div>
                `:r`
                  <button class="about-update-check ${e.updateChecking?"checking":""}" @click=${Fi} .disabled=${e.updateChecking}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>
                    ${e.updateChecking?"正在检查...":"检查更新"}
                  </button>
                `}
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
        ${e.sidePanel==="consult"?r`
          <div class="side-panel-view consult-view" style="display:flex;flex-direction:column;overflow:hidden;">
            <div class="side-panel-header">
              <span class="panel-title"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px;"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> ${e.consultView==="list"?"AI专家咨询（专业智能体）":e.consultView==="detail"?"智能体详情":e.consultView==="my-tasks"?"我的咨询":"咨询详情"}</span>
              <div style="display:flex;gap:6px;align-items:center;">
                ${e.consultView==="list"?r`
                  <button class="consult-mytasks-btn" @click=${()=>{cs()}} title="我的咨询">
                    📋 我的咨询${e.consultUnreadCount>0?r`<span class="consult-unread-badge" style="margin-left:4px;">${e.consultUnreadCount}</span>`:""}
                  </button>
                `:""}
                <button class="side-panel-close" @click=${()=>{e.sidePanel=null,v()}} title="关闭">✕</button>
              </div>
            </div>
            <div style="flex:1;overflow-y:auto;padding:16px;">
              ${e.consultView==="list"?r`
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
                      <div class="consult-info-desc">${e.consultAvgTime||"加载中..."}</div>
                    </div>
                  </div>
                </div>
                <!-- Search bar -->
                <div class="consult-search-bar">
                  <input type="text" placeholder="搜索智能体..." .value=${e.consultSearch}
                    @input=${s=>{e.consultSearch=s.target.value}}
                    @keydown=${s=>{s.key==="Enter"&&Re()}}
                  />
                  <button @click=${()=>Re()}>搜索</button>
                </div>
                ${e.consultLoading?r`<div class="consult-loading">加载中...</div>`:""}
                ${!e.consultLoading&&e.consultAgents.length===0?r`<div class="consult-empty">暂无在线智能体</div>`:""}
                <div class="consult-agent-grid">
                  ${e.consultAgents.map(s=>r`
                    <div class="consult-agent-card" @click=${()=>wi(s)}>
                      <div class="consult-agent-card-top">
                        <div class="consult-agent-avatar">
                          ${N(s.avatarUrl)?r`<img src="${N(s.avatarUrl)}" alt="" @error=${l=>{l.target.style.display="none",l.target.parentElement.insertAdjacentHTML("beforeend",`<span>${s.emoji||"🤖"}</span>`)}} />`:r`<span>${s.emoji||"🤖"}</span>`}
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
              `:e.consultView==="detail"&&e.consultSelectedAgent?r`
                <!-- Agent detail + task form -->
                <button class="consult-back-btn" @click=${()=>$i()}>← 返回列表</button>
                <div class="consult-detail-header">
                  <div class="consult-detail-avatar">
                    ${N(e.consultSelectedAgent.avatarUrl)?r`<img src="${N(e.consultSelectedAgent.avatarUrl)}" alt="" @error=${s=>{s.target.style.display="none",s.target.parentElement.insertAdjacentHTML("beforeend",`<span>${e.consultSelectedAgent.emoji||"🤖"}</span>`)}} />`:r`<span>${e.consultSelectedAgent.emoji||"🤖"}</span>`}
                  </div>
                  <div>
                    <div class="consult-detail-name">${e.consultSelectedAgent.name}</div>
                    <div class="consult-detail-owner">by ${e.consultSelectedAgent.owner.name}</div>
                  </div>
                </div>
                <div class="consult-detail-desc">${e.consultSelectedAgent.description}</div>
                <div class="consult-detail-stats">
                  <span>💰 ${e.consultSelectedAgent.price} 积分/次</span>
                  ${e.consultSelectedAgent.avgRating>0?r`<span>⭐ ${e.consultSelectedAgent.avgRating.toFixed(1)}</span>`:""}
                  <span>✅ 已完成 ${e.consultSelectedAgent.completedTasks} 单</span>
                </div>
                ${e.taxstoreToken?r`
                  <div class="consult-form">
                    <h4>提交咨询任务</h4>
                    <div class="consult-field">
                      <label>任务标题</label>
                      <input type="text" placeholder="请简要描述您的需求" .value=${e.consultTaskTitle}
                        @input=${s=>{e.consultTaskTitle=s.target.value,d()}} />
                    </div>
                    <div class="consult-field">
                      <label>详细描述</label>
                      <textarea placeholder="请详细描述您的需求，越详细越好..." .value=${e.consultTaskContent}
                        @input=${s=>{e.consultTaskContent=s.target.value,d()}}></textarea>
                    </div>
                    <div class="consult-field">
                      <label>附件（可选）</label>
                      <div class="consult-attachments">
                        ${e.consultAttachments.map((s,l)=>r`
                          <div class="consult-att-item">
                            <span class="consult-att-icon">${s.type?.startsWith("image/")?"🖼️":"📎"}</span>
                            <span class="consult-att-name" title=${s.name}>${s.name}</span>
                            <span class="consult-att-size">${ct(s.size)}</span>
                            <button class="consult-att-remove" @click=${()=>Ii(l)} title="移除">✕</button>
                          </div>
                        `)}
                        ${e.consultUploading?r`<div class="consult-att-uploading">⏳ 上传中...</div>`:""}
                        <label class="consult-att-add-btn">
                          📎 添加附件
                          <input type="file" style="display:none" @change=${s=>{const l=s.target.files?.[0];l&&Ci(l),s.target.value=""}} />
                        </label>
                      </div>
                    </div>
                    <div class="consult-form-footer">
                      <span class="consult-form-price">需支付 ${e.consultSelectedAgent.price} 积分</span>
                      <button class="consult-submit-btn" @click=${()=>Mi()} ?disabled=${e.consultSubmitting||!e.consultTaskTitle.trim()||!e.consultTaskContent.trim()}>
                        ${e.consultSubmitting?"提交中...":"提交任务"}
                      </button>
                    </div>
                  </div>
                `:r`
                  <div class="consult-login-hint">请先在设置中登录 TaxStore 账户后再提交任务</div>
                `}
              `:e.consultView==="my-tasks"?r`
                <!-- My tasks list -->
                <button class="consult-back-btn" @click=${()=>{e.consultView="list",d()}}>← 返回广场</button>
                ${e.consultMyTasks.length===0?r`<div class="consult-empty">暂无咨询记录</div>`:""}
                <div class="consult-tasks-list">
                  ${e.consultMyTasks.map(s=>r`
                    <div class="consult-task-item consult-task-item--${s.status}" @click=${()=>ot(s)}>
                      <div class="consult-task-item-icon">
                        ${N(s.listing?.avatarUrl)?r`<img src="${N(s.listing?.avatarUrl)}" alt="" @error=${l=>{l.target.style.display="none",l.target.parentElement.insertAdjacentHTML("beforeend",`<span>${s.listing?.emoji||"🤖"}</span>`)}} />`:r`<span>${s.listing?.emoji||"🤖"}</span>`}
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
              `:e.consultView==="task-detail"&&e.consultSelectedTask?r`
                <!-- Task detail -->
                <button class="consult-back-btn" @click=${()=>yi()}>← 返回列表</button>
                <div class="consult-task-detail">
                  <div class="consult-task-detail-header">
                    <span class="consult-task-detail-emoji">${N(e.consultSelectedTask.listing?.avatarUrl)?r`<img src="${N(e.consultSelectedTask.listing?.avatarUrl)}" alt="" style="width:32px;height:32px;border-radius:8px;object-fit:cover;" @error=${s=>{s.target.replaceWith(document.createTextNode(e.consultSelectedTask.listing?.emoji||"🤖"))}} />`:e.consultSelectedTask.listing?.emoji||"🤖"}</span>
                    <div>
                      <div class="consult-task-detail-title">${e.consultSelectedTask.title}</div>
                      <div class="consult-task-detail-meta">
                        ${e.consultSelectedTask.listing?.name||"智能体"} · 提交于 ${new Date(e.consultSelectedTask.createdAt).toLocaleString("zh-CN")}
                        ${e.consultSelectedTask.completedAt?r` · 完成于 ${new Date(e.consultSelectedTask.completedAt).toLocaleString("zh-CN")}`:""}
                      </div>
                    </div>
                  </div>
                  <div class="consult-task-detail-section">
                    <div class="consult-task-detail-label">我的描述</div>
                    <div class="consult-task-detail-content">${e.consultSelectedTask.content}</div>
                  </div>
                  ${Ae(e.consultSelectedTask.attachments).length>0?r`
                    <div class="consult-task-detail-section">
                      <div class="consult-task-detail-label">我的附件</div>
                      <div class="consult-att-list">
                        ${Ae(e.consultSelectedTask.attachments).map(s=>r`
                          <a class="consult-att-link" href=${Te(s.url)} target="_blank">
                            ${s.type?.startsWith("image/")?r`<img class="consult-att-thumb" src=${Te(s.url)} alt=${s.name} />`:r`<span class="consult-att-file-icon">📎</span>`}
                            <span class="consult-att-link-name">${s.name}</span>
                            <span class="consult-att-link-size">${ct(s.size)}</span>
                          </a>
                        `)}
                      </div>
                    </div>
                  `:""}
                  ${e.consultSelectedTask.result?r`
                    <div class="consult-task-detail-section">
                      <div class="consult-task-detail-label">处理结果</div>
                      <div class="consult-task-detail-result">${e.consultSelectedTask.result}</div>
                    </div>
                    ${Ae(e.consultSelectedTask.resultAttachments).length>0?r`
                      <div class="consult-task-detail-section">
                        <div class="consult-task-detail-label">结果附件</div>
                        <div class="consult-att-list">
                          ${Ae(e.consultSelectedTask.resultAttachments).map(s=>r`
                            <a class="consult-att-link" href=${Te(s.url)} target="_blank">
                              ${s.type?.startsWith("image/")?r`<img class="consult-att-thumb" src=${Te(s.url)} alt=${s.name} />`:r`<span class="consult-att-file-icon">📎</span>`}
                              <span class="consult-att-link-name">${s.name}</span>
                              <span class="consult-att-link-size">${ct(s.size)}</span>
                            </a>
                          `)}
                        </div>
                      </div>
                    `:""}
                  `:r`
                    <div class="consult-task-detail-section">
                      <div class="consult-task-detail-waiting">
                        ${e.consultSelectedTask.status==="pending"?"⏳ 等待智能体主人接单处理...":e.consultSelectedTask.status==="processing"?"🔄 智能体正在处理中...":e.consultSelectedTask.status==="revision_requested"?"📝 已请求修订，等待处理...":"等待处理..."}
                      </div>
                    </div>
                  `}

                  <!-- Action buttons row -->
                  <div class="consult-td-actions">
                    <button class="consult-td-action-btn" @click=${()=>xi()}>
                      💬 留言沟通${(e.consultSelectedTask.unreadMessageCount||0)>0?r`<span class="consult-unread-badge" style="margin-left:4px;">${e.consultSelectedTask.unreadMessageCount}</span>`:""}
                    </button>
                    ${e.consultSelectedTask.status==="completed"&&!e.consultSelectedTask.rating&&(e.consultSelectedTask.revisionCount||0)<3?r`
                      <button class="consult-td-action-btn consult-td-action-btn--revision" @click=${()=>us()}>
                        🔄 请求修订${e.consultSelectedTask.revisionCount?r` (${e.consultSelectedTask.revisionCount}/3)`:""}
                      </button>
                    `:""}
                    ${e.consultSelectedTask.status==="completed"&&!e.consultSelectedTask.rating?r`
                      <button class="consult-td-action-btn consult-td-action-btn--rating" @click=${()=>gs()}>
                        ⭐ 给个评价
                      </button>
                    `:""}
                  </div>

                  <!-- Rating display (if already rated) -->
                  ${e.consultSelectedTask.rating?r`
                    <div class="consult-td-rated">
                      <div class="consult-td-rated-stars">${"★".repeat(e.consultSelectedTask.rating)}${"☆".repeat(5-e.consultSelectedTask.rating)}</div>
                      ${e.consultSelectedTask.ratingComment?r`<div class="consult-td-rated-comment">${e.consultSelectedTask.ratingComment}</div>`:""}
                    </div>
                  `:""}

                  <!-- Rating panel -->
                  ${e.consultRatingOpen?r`
                    <div class="consult-td-panel">
                      <div class="consult-td-panel-title">评价服务</div>
                      <div class="consult-td-stars">
                        ${[1,2,3,4,5].map(s=>r`
                          <span class="consult-td-star ${s<=(e.consultRatingHover||e.consultRatingValue)?"consult-td-star--active":""}"
                            @click=${()=>{e.consultRatingValue=s,d()}}
                            @mouseenter=${()=>{e.consultRatingHover=s,d()}}
                            @mouseleave=${()=>{e.consultRatingHover=0,d()}}>★</span>
                        `)}
                        <span class="consult-td-star-label">${e.consultRatingValue===1?"很差":e.consultRatingValue===2?"较差":e.consultRatingValue===3?"一般":e.consultRatingValue===4?"满意":e.consultRatingValue===5?"非常满意":""}</span>
                      </div>
                      <textarea class="consult-td-input" placeholder="写点评价吧（可选）" rows="2"
                        .value=${e.consultRatingComment}
                        @input=${s=>{e.consultRatingComment=s.target.value,d()}}></textarea>
                      <div class="consult-td-panel-actions">
                        <button class="consult-td-btn-cancel" @click=${()=>gs()}>取消</button>
                        <button class="consult-td-btn-submit" @click=${()=>Si()} ?disabled=${e.consultRatingSubmitting||e.consultRatingValue<1}>
                          ${e.consultRatingSubmitting?"提交中...":"提交评价"}
                        </button>
                      </div>
                    </div>
                  `:""}

                  <!-- Revision panel -->
                  ${e.consultRevisionOpen?r`
                    <div class="consult-td-panel">
                      <div class="consult-td-panel-title">请求修订</div>
                      <div class="consult-td-panel-hint">请描述需要修改的内容，智能体主人会重新处理（最多 3 次修订）</div>
                      <textarea class="consult-td-input" placeholder="请说明需要修改的地方..." rows="3"
                        .value=${e.consultRevisionText}
                        @input=${s=>{e.consultRevisionText=s.target.value,d()}}></textarea>
                      <div class="consult-td-panel-actions">
                        <button class="consult-td-btn-cancel" @click=${()=>us()}>取消</button>
                        <button class="consult-td-btn-submit" @click=${()=>Ai()} ?disabled=${e.consultRevisionSubmitting||!e.consultRevisionText.trim()}>
                          ${e.consultRevisionSubmitting?"提交中...":"发送修订请求"}
                        </button>
                      </div>
                    </div>
                  `:""}

                  <!-- Messages panel -->
                  ${e.consultMessagesOpen?r`
                    <div class="consult-td-messages">
                      <div class="consult-td-panel-title">留言沟通</div>
                      <div class="consult-td-msg-list">
                        ${e.consultMessages.length===0?r`<div class="consult-td-msg-empty">${e.consultSelectedTask.status==="completed"?"暂无留言记录":"暂无留言，发一条吧"}</div>`:""}
                        ${e.consultMessages.map(s=>r`
                          <div class="consult-td-msg ${s.sender.id===e.taxstoreUser?.id?"consult-td-msg--mine":"consult-td-msg--theirs"}">
                            <div class="consult-td-msg-sender">${s.sender.name}</div>
                            <div class="consult-td-msg-bubble">${s.content}</div>
                            <div class="consult-td-msg-time">${new Date(s.createdAt).toLocaleString("zh-CN")}</div>
                          </div>
                        `)}
                      </div>
                      ${e.consultSelectedTask.status!=="completed"?r`
                        <div class="consult-td-msg-input-row">
                          <input type="text" class="consult-td-msg-input" placeholder="输入留言..."
                            .value=${e.consultMessageInput}
                            @input=${s=>{e.consultMessageInput=s.target.value,d()}}
                            @keydown=${s=>{s.key==="Enter"&&!s.shiftKey&&(s.preventDefault(),ds())}} />
                          <button class="consult-td-msg-send" @click=${()=>ds()} ?disabled=${e.consultMessagesSending||!e.consultMessageInput.trim()}>
                            ${e.consultMessagesSending?"...":"发送"}
                          </button>
                        </div>
                      `:r`<div class="consult-td-msg-closed">任务已完成，留言已关闭</div>`}
                    </div>
                  `:""}

                  <div class="consult-task-detail-footer">
                    <span>💰 ${e.consultSelectedTask.price} 积分</span>
                    <span class="consult-task-detail-status consult-task-detail-status--${e.consultSelectedTask.status}">
                      ${e.consultSelectedTask.status==="completed"?"✅ 已完成":e.consultSelectedTask.status==="pending"?"⏳ 等待中":e.consultSelectedTask.status==="revision_requested"?"📝 修订中":"🔄 处理中"}
                    </span>
                  </div>
                </div>
              `:""}
            </div>
          </div>
        `:""}
        </div><!-- /side-panel -->

        <div class="taxchat-main">
          ${e.searchOpen?r`
            <div class="search-bar">
              <input
                id="taxchat-search-input"
                type="text"
                placeholder="搜索消息..."
                .value=${e.searchQuery}
                @input=${s=>Ea(s.target.value)}
                @keydown=${s=>{s.key==="Escape"?ss():s.key==="Enter"&&(s.shiftKey?as():ns())}}
              />
              <span class="search-count">
                ${e.searchResults.length>0?`${e.searchIndex+1}/${e.searchResults.length}`:e.searchQuery?"无结果":""}
              </span>
              <button class="search-nav-btn" @click=${as} title="上一个">▲</button>
              <button class="search-nav-btn" @click=${ns} title="下一个">▼</button>
              <button class="search-close-btn" @click=${ss} title="关闭">✕</button>
            </div>
          `:""}
          <div class="taxchat-messages" id="messages-container">
            ${Vi()}
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
            @click=${()=>{if(!e.authorizedFolder){k("请先在知识库面板中选择文件夹"),e.sidePanel="knowledge",v();return}te(R[5])}}
            title="在指定文件夹中检索文件、提取摘要、搜索内容"
          >
            <span class="qa-icon">📚</span>
            <span>知识库</span>
          </button>
          <button
            class="quick-action-btn"
            ?disabled=${!1}
            @click=${()=>{const s=document.createElement("input");s.type="file",s.accept="image/*,.pdf,.doc,.docx,.xls,.xlsx",s.multiple=!0,s.onchange=()=>{s.files&&s.files.length>0&&Pe(s.files)},s.click()}}
            title="上传图片或文件"
          >
            <span class="qa-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg></span>
            <span>上传文件</span>
          </button>
          ${e.customSkills.filter(s=>s.pinned).sort((s,l)=>s.createdAt-l.createdAt).map(s=>r`
            <button
              class="quick-action-btn custom"
              ?disabled=${!1}
              @click=${()=>te(s)}
              title=${s.description||s.name}
            >
              <span class="qa-icon">${s.emoji}</span>
              <span>${s.name}</span>
            </button>
          `)}
        </div>

        <div class="taxchat-input-container"
          @dragover=${s=>{s.preventDefault(),s.stopPropagation(),e.dragOver=!0,v()}}
          @dragleave=${s=>{s.preventDefault(),s.stopPropagation(),e.dragOver=!1,v()}}
          @drop=${s=>{s.preventDefault(),s.stopPropagation(),e.dragOver=!1,console.log("Drop event, files:",s.dataTransfer?.files?.length),s.dataTransfer?.files&&Pe(s.dataTransfer.files)}}
          class=${e.dragOver?"taxchat-input-container drag-over":"taxchat-input-container"}
        >
          ${e.activeCustomSkill?r`
            <div class="skill-prompt-bubble">
              <span class="skill-prompt-bubble__emoji">${e.activeCustomSkill.emoji}</span>
              <span class="skill-prompt-bubble__text">${e.activeCustomSkill.name}${e.activeCustomSkill.description?` · ${e.activeCustomSkill.description}`:""}</span>
              <button class="skill-prompt-bubble__close" @click=${()=>Xn()} title="取消技能">✕</button>
            </div>
          `:""}
          ${e.mentionDropdownVisible?r`
            <div class="agent-mention-dropdown">
              ${nt().map((s,l)=>r`
                  <div class="agent-mention-item ${l===e.mentionIndex?"agent-mention-item--active":""}" @mousedown=${c=>{c.preventDefault(),at(s)}} @mouseenter=${()=>{e.mentionIndex=l,v()}}>
                    <span class="agent-mention-emoji">${s.avatarUrl?r`<img src="${s.avatarUrl}" class="agent-avatar-img-sm" />`:s.emoji}</span>
                    <span class="agent-mention-name">${s.name}</span>
                    ${s.description?r`<span class="agent-mention-desc">${s.description}</span>`:""}
                  </div>
                `)}
              ${nt().length===0?r`<div class="agent-mention-empty">未找到匹配的智能体</div>`:""}
            </div>
          `:""}
          ${e.commandPaletteVisible?r`
            <div class="command-palette">
              ${Ve().map((s,l)=>r`
                <div class="command-item ${l===e.commandIndex?"active":""}"
                  @mousedown=${c=>{c.preventDefault(),Ke(),e.draft="",s.action(),d()}}
                  @mouseenter=${()=>{e.commandIndex=l,d()}}>
                  <span class="command-emoji">${s.emoji}</span>
                  <div class="command-info">
                    <div class="command-name">${s.name}</div>
                    <div class="command-desc">${s.description}</div>
                  </div>
                </div>
              `)}
              ${Ve().length===0?r`<div class="command-item"><span class="command-desc">无匹配指令</span></div>`:""}
            </div>
          `:""}
          ${e.replyingTo?r`
            <div class="reply-bar">
              <div class="reply-bar__content">
                <div class="reply-bar__label">回复 ${e.replyingTo.type==="user"?"我":e.replyingTo.agentName||"Taxbot"}</div>
                <div class="reply-bar__text">${e.replyingTo.text.length>60?e.replyingTo.text.slice(0,60)+"...":e.replyingTo.text}</div>
              </div>
              <button class="reply-bar__close" @click=${()=>{e.replyingTo=null,v()}}>✕</button>
            </div>
          `:""}
          <textarea
            id="message-input"
            class="taxchat-input"
            rows="1"
            placeholder=${e.activeCustomSkill?`请输入内容，将按「${e.activeCustomSkill.name}」流程处理...`:"输入您的税务问题...或拖入/粘贴文件"}
            .value=${e.draft}
            @input=${s=>{const l=s.target;if(e.draft=l.value,l.style.height="auto",l.style.height=l.scrollHeight+"px",Ra())return;const c=e.draft.match(/@(\S*)$/);if(c&&e.agentsList.length>0){const u=e.mentionFilter;e.mentionDropdownVisible=!0,e.mentionFilter=c[1].toLowerCase(),e.mentionFilter!==u&&(e.mentionIndex=0)}else e.mentionDropdownVisible=!1,e.mentionFilter="",e.mentionIndex=0;v()}}
            @keydown=${s=>{if(e.commandPaletteVisible){if(s.key==="ArrowDown"){s.preventDefault(),ts("down");return}if(s.key==="ArrowUp"){s.preventDefault(),ts("up");return}if(s.key==="Enter"&&!s.isComposing){s.preventDefault(),ja();return}if(s.key==="Escape"){s.preventDefault(),Ke();return}}if(e.mentionDropdownVisible){const l=nt();if(s.key==="ArrowDown"){s.preventDefault(),e.mentionIndex=l.length?(e.mentionIndex+1)%l.length:0,v(),requestAnimationFrame(()=>{document.querySelector(".agent-mention-item--active")?.scrollIntoView({block:"nearest"})});return}if(s.key==="ArrowUp"){s.preventDefault(),e.mentionIndex=l.length?(e.mentionIndex-1+l.length)%l.length:0,v(),requestAnimationFrame(()=>{document.querySelector(".agent-mention-item--active")?.scrollIntoView({block:"nearest"})});return}if(s.key==="Enter"&&!s.isComposing){s.preventDefault(),l.length>0&&e.mentionIndex<l.length&&at(l[e.mentionIndex]);return}if(s.key==="Escape"){s.preventDefault(),e.mentionDropdownVisible=!1,e.mentionIndex=0,v();return}}s.key==="Enter"&&!s.ctrlKey&&!s.shiftKey&&!s.isComposing&&(s.preventDefault(),ze())}}
            @paste=${s=>{console.log("Paste event, files:",s.clipboardData?.files?.length),s.clipboardData?.files&&s.clipboardData.files.length>0&&(s.preventDefault(),Pe(s.clipboardData.files))}}
            ?disabled=${!1}
            rows="1"
          ></textarea>
          <button
            class="taxchat-button primary send-inline"
            ?disabled=${e.draft.trim().length===0&&e.attachments.length===0&&e.knowledgeRefs.length===0}
            @click=${ze}
            title="发送消息 (Enter)"
          >
            <span class="button-icon">➤</span>
          </button>

          ${e.dragOver?r`
            <div class="drag-overlay">
              <div class="drag-text">📁 拖入文件即可上传</div>
            </div>
          `:""}
        </div>

        ${e.attachments.length>0?r`
          <div class="attachments-list">
            ${e.attachments.map((s,l)=>r`
              <div class="attachment-item">
                <span class="attachment-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg></span>
                <span class="attachment-name" title=${s.name}>${s.name}</span>
                <span class="attachment-size">${et(s.size)}</span>
                <button
                  class="attachment-remove"
                  @click=${()=>In(l)}
                  title="移除"
                >
                  ✕
                </button>
              </div>
            `)}
          </div>
        `:""}

        ${e.knowledgeRefs.length>0?r`
          <div class="knowledge-refs-list">
            ${e.knowledgeRefs.map((s,l)=>r`
              <div class="knowledge-ref-item">
                <span class="kr-icon">📚</span>
                <span class="kr-name" title=${s.name}>${s.name}</span>
                <button class="kr-remove" @click=${()=>ea(l)} title="移除引用">✕</button>
              </div>
            `)}
          </div>
        `:""}
      </div>

        </div><!-- /taxchat-main -->
      </div><!-- /taxchat-body -->


      ${e.showQuickStart?zi():""}

      ${e.editingSkill?r`
        <div class="skill-editor-overlay" @click=${()=>{e.editingSkill=null,v()}}>
          <div class="skill-editor" @click=${s=>s.stopPropagation()}>
            <h3>${e.customSkills.some(s=>s.id===e.editingSkill.id)?"编辑 Skill":"新建 Skill"}</h3>
            <label>名称 *</label>
            <input type="text" .value=${B(e.editingSkill.name)} @input=${s=>{e.editingSkill.name=s.target.value}} placeholder="例：增值税计算助手" />
            <label>图标</label>
            <input type="text" .value=${B(e.editingSkill.emoji)} @input=${s=>{e.editingSkill.emoji=s.target.value}} placeholder="🤖" style="width: 60px;" />
            <label>描述</label>
            <textarea .value=${B(e.editingSkill.description)} @input=${s=>{e.editingSkill.description=s.target.value}} placeholder="描述这个技能的用途和使用场景，例如：当用户提到增值税计算、税率查询时使用此技能" style="min-height: 60px;"></textarea>
            <label>操作流程 *</label>
            <textarea .value=${B(e.editingSkill.prompt)} @input=${s=>{e.editingSkill.prompt=s.target.value}} placeholder="请详细描述技能的操作流程（自然语言）。例如：分析用户上传的文件，从增值税角度列出所有涉税项目，计算应纳税额..."></textarea>
            <div class="skill-editor__actions">
              <button class="skill-editor__cancel" @click=${()=>{e.editingSkill=null,v()}}>取消</button>
              <button class="skill-editor__save" @click=${()=>{if(!e.editingSkill?.name.trim()){alert("请填写名称");return}if(!e.editingSkill?.prompt.trim()){alert("请填写操作流程");return}Vn()}}>保存技能</button>
            </div>
          </div>
        </div>
      `:""}

      ${e.creatingAgent?r`
        <div class="agent-editor-overlay" @click=${()=>{e.creatingAgent=!1,e.editingAgentId=null,v()}}>
          <div class="agent-editor" @click=${s=>s.stopPropagation()}>
            <h3>${e.editingAgentId?"编辑智能体":"新建智能体"}</h3>
            <div class="agent-editor-avatar-row">
              <div class="agent-editor-avatar-preview" @click=${()=>{const s=document.createElement("input");s.type="file",s.accept="image/*",s.onchange=()=>{if(!s.files?.[0])return;const l=s.files[0];if(l.size>512*1024){k("图片不能超过 512KB");return}const c=new FileReader;c.onload=()=>{e.agentCreateDraft.avatarDataUrl=c.result,v()},c.readAsDataURL(l)},s.click()}} title="点击上传头像图片">
                ${e.agentCreateDraft.avatarDataUrl?r`<img src="${e.agentCreateDraft.avatarDataUrl}" class="agent-avatar-preview-img" />`:r`<span>${e.agentCreateDraft.emoji||"🤖"}</span>`}
                <div class="agent-avatar-upload-hint">上传</div>
              </div>
              <div class="agent-editor-avatar-input">
                <label>Emoji（无图片时显示）</label>
                <input type="text" maxlength="4" .value=${B(e.agentCreateDraft.emoji)} @input=${s=>{e.agentCreateDraft.emoji=s.target.value,v()}} placeholder="🤖" style="width: 60px; font-size: 20px; text-align: center;" />
                ${e.agentCreateDraft.avatarDataUrl?r`<button class="agent-avatar-remove" @click=${()=>{e.agentCreateDraft.avatarDataUrl="",v()}}>移除图片</button>`:""}
              </div>
            </div>
            <label>名称 *</label>
            <input type="text" maxlength="30" .value=${B(e.agentCreateDraft.name)} @input=${s=>{e.agentCreateDraft.name=s.target.value,v()}} placeholder="如：财务助手、合同审查员" />
            <label>描述 <span class="agent-field-hint">对应 SOUL.md — 智能体的性格与行为方式</span></label>
            <textarea .value=${B(e.agentCreateDraft.description)} @input=${s=>{e.agentCreateDraft.description=s.target.value}} placeholder="描述智能体的定位和行为风格。例如：&#10;你是一位资深税务顾问，说话严谨专业，回答问题时会引用具体法规条文。"></textarea>
            <label>身份 <span class="agent-field-hint">对应 IDENTITY.md — 智能体的角色定义</span></label>
            <textarea .value=${B(e.agentCreateDraft.identityDesc)} @input=${s=>{e.agentCreateDraft.identityDesc=s.target.value}} placeholder="定义智能体的身份角色。例如：&#10;税务部门高级顾问，专注增值税和企业所得税领域，拥有10年从业经验。" style="min-height:80px;"></textarea>
            <label>擅长 <span class="agent-field-hint">对应 AGENTS.md — 智能体的技能与工作指南</span></label>
            <textarea .value=${B(e.agentCreateDraft.expertise)} @input=${s=>{e.agentCreateDraft.expertise=s.target.value}} placeholder="列出智能体擅长的任务。例如：&#10;- 合同涉税条款审核&#10;- 增值税税率适用分析&#10;- 跨境税务合规咨询" style="min-height:80px;"></textarea>
            <label>可用技能 <span class="agent-field-hint">对应 TOOLS.md — 勾选智能体可使用的技能</span></label>
            <div class="agent-skills-selector">
              ${[...R,...e.customSkills.filter(s=>!s.id.startsWith("__builtin_"))].map(s=>{const l=(e.agentCreateDraft.selectedSkills||[]).includes(s.id);return r`
                  <label class="agent-skill-option ${l?"selected":""}" @click=${c=>{c.preventDefault();const u=e.agentCreateDraft.selectedSkills||[];e.agentCreateDraft.selectedSkills=l?u.filter(g=>g!==s.id):[...u,s.id],v()}}>
                    <span class="agent-skill-check">${l?"☑":"☐"}</span>
                    <span class="agent-skill-emoji">${s.emoji}</span>
                    <span class="agent-skill-name">${s.name}</span>
                    ${s.description?r`<span class="agent-skill-desc">${s.description}</span>`:""}
                  </label>`})}
              ${R.length===0&&e.customSkills.length===0?r`<div style="color:#9ca3af;font-size:12px;padding:8px;">暂无可用技能</div>`:""}
            </div>
            <div class="agent-editor__actions">
              ${e.editingAgentId?r`
                <button class="agent-editor__memory-btn" @click=${async()=>{const s=await Y(e.editingAgentId);e.viewingAgentMemory={agentId:e.editingAgentId,agentName:e.agentCreateDraft.name,content:s},v()}} title="查看/编辑该智能体的记忆">查看记忆</button>
              `:""}
              <button class="agent-editor__cancel" @click=${()=>{e.creatingAgent=!1,e.editingAgentId=null,e.agentCreateDraft={name:"",emoji:"🤖",description:"",identityDesc:"",expertise:"",avatarDataUrl:"",selectedSkills:[]},v()}}>取消</button>
              <button class="agent-editor__save" ?disabled=${e.agentSaving||!e.agentCreateDraft.name.trim()} @click=${()=>{e.editingAgentId?Nn():_s()}}>${e.agentSaving?"保存中...":e.editingAgentId?"保存修改":"创建智能体"}</button>
            </div>
          </div>
        </div>
      `:""}

      ${e.viewingAgentMemory?r`
        <div class="agent-editor-overlay" @click=${()=>{e.viewingAgentMemory=null,e.confirmingMemoryClear=!1,v()}}>
          <div class="agent-editor agent-memory-editor" @click=${s=>s.stopPropagation()}>
            <h3>${e.viewingAgentMemory.agentName} — 记忆</h3>
            <p style="font-size:12px;color:#999;margin:0 0 8px;">智能体对话时会参考这些记忆。可手动编辑或清空。</p>
            <textarea class="agent-memory-textarea" .value=${e.viewingAgentMemory.content}
              @input=${s=>{e.viewingAgentMemory&&(e.viewingAgentMemory.content=s.target.value)}}
              placeholder="暂无记忆。智能体对话中点击「记住」按钮可保存回复到此处。"
            ></textarea>
            ${e.confirmingMemoryClear?r`
              <div class="memory-clear-confirm">
                <div class="memory-clear-warn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  <span>清空后，智能体将丢失所有积累的经验和对话记忆，无法恢复。确定清空吗？</span>
                </div>
                <div class="memory-clear-btns">
                  <button class="memory-clear-yes" @click=${()=>{e.viewingAgentMemory&&(ft(e.viewingAgentMemory.agentId,""),e.viewingAgentMemory.content="",e.confirmingMemoryClear=!1,k("记忆已清空"),v())}}>确定清空</button>
                  <button class="memory-clear-no" @click=${()=>{e.confirmingMemoryClear=!1,v()}}>取消</button>
                </div>
              </div>
            `:""}
            <div class="agent-editor__actions">
              <button class="agent-editor__cancel" @click=${()=>{e.confirmingMemoryClear=!0,v()}} ?disabled=${!e.viewingAgentMemory.content}>清空记忆</button>
              <button class="agent-editor__save" @click=${()=>{e.viewingAgentMemory&&(ft(e.viewingAgentMemory.agentId,e.viewingAgentMemory.content),k("记忆已保存"),e.viewingAgentMemory=null,e.confirmingMemoryClear=!1,v())}}>保存</button>
            </div>
          </div>
        </div>
      `:""}

      ${e.rentalPublishDialog&&e.rentalPublishAgent?r`
        <div class="rental-publish-overlay" @click=${xt}>
          <div class="rental-publish-dialog" @click=${s=>s.stopPropagation()}>
            <h3>🏪 发布到智能体市场</h3>
            <div class="rental-publish-agent-preview">
              <div class="rental-publish-agent-emoji">
                ${e.rentalPublishAgent.avatarUrl?r`<img src="${e.rentalPublishAgent.avatarUrl}" />`:e.rentalPublishAgent.emoji}
              </div>
              <div class="rental-publish-agent-info">
                <div class="rental-publish-agent-name">${e.rentalPublishAgent.isDefault?`Taxbot Agent by ${e.taxstoreUser?.name||""}`:e.rentalPublishAgent.name}</div>
                <div class="rental-publish-agent-desc">${e.rentalPublishAgent.description}</div>
              </div>
            </div>
            <div class="rental-field">
              <label>单次任务价格（积分）</label>
              <input type="number" min="1" max="9999" .value=${String(e.rentalPublishDraft.price)}
                @input=${s=>{e.rentalPublishDraft.price=parseInt(s.target.value)||0}} />
              <div class="rental-field-hint">用户下单时将支付此积分，任务完成后积分转给你</div>
            </div>
            <div class="rental-field">
              <label>市场描述</label>
              <textarea .value=${e.rentalPublishDraft.description}
                @input=${s=>{e.rentalPublishDraft.description=s.target.value}}
                placeholder="描述这个智能体能做什么、擅长什么..."></textarea>
              <div class="rental-field-hint">将展示给市场上的其他用户</div>
            </div>
            <div class="rental-field">
              <label>专业标签 <span style="color:#9ca3af;font-weight:normal;">(最多5个)</span></label>
              <div class="rental-tags-grid">
                ${["个税","增值税","企业所得税","印花税","土地增值税","纳税申报","税务筹划","发票管理","税务登记","财务报表","审计","会计核算","成本管理","社保公积金","工商注册","政策咨询"].map(s=>{const l=e.rentalPublishDraft.tags.includes(s);return r`<button type="button" class="rental-tag-chip ${l?"rental-tag-chip--active":""}"
                    @click=${()=>{l?e.rentalPublishDraft.tags=e.rentalPublishDraft.tags.filter(c=>c!==s):e.rentalPublishDraft.tags.length<5&&(e.rentalPublishDraft.tags=[...e.rentalPublishDraft.tags,s]),d()}}>${s}</button>`})}
              </div>
            </div>
            <div class="rental-publish-actions">
              <button class="rental-btn-cancel" @click=${xt}>取消</button>
              <button class="rental-btn-publish"
                ?disabled=${!e.rentalPublishDraft.description.trim()||e.rentalPublishDraft.price<1}
                @click=${mi}>发布 (${e.rentalPublishDraft.price} 积分/次)</button>
            </div>
          </div>
        </div>
      `:""}

      ${e.rentalTaskPanel&&e.rentalActiveTask?r`
        <div class="rental-task-overlay" @click=${At}>
          <div class="rental-task-panel" @click=${s=>s.stopPropagation()}>
            <h3>${e.rentalActiveTask.status==="revision_requested"?"✏️ 处理修订请求":"📋 处理任务"}</h3>
            <div class="rental-task-info">
              <div class="rental-task-title">${e.rentalActiveTask.title}</div>
              <div class="rental-task-meta">
                来自: ${e.rentalActiveTask.client.name} · 智能体: ${e.rentalActiveTask.listing.emoji} ${e.rentalActiveTask.listing.name}
                ${e.rentalActiveTask.revisionCount?r` · <span style="color:#9333ea;">第 ${e.rentalActiveTask.revisionCount+1} 次修订</span>`:""}
              </div>
              ${e.rentalActiveTask.status==="revision_requested"&&e.rentalActiveTask.revisionRequest?r`
                <div style="margin-top:8px;padding:8px 12px;border-radius:8px;background:rgba(147,51,234,0.1);border:1px solid rgba(147,51,234,0.2);">
                  <div style="font-size:12px;color:#9333ea;font-weight:600;margin-bottom:4px;">📝 客户修订要求</div>
                  <div style="font-size:13px;color:#e2e8f0;white-space:pre-wrap;">${e.rentalActiveTask.revisionRequest}</div>
                </div>
              `:""}
              <div class="rental-task-content">${e.rentalActiveTask.content}</div>
              ${(()=>{if(!e.rentalActiveTask?.attachments)return"";try{const s=JSON.parse(e.rentalActiveTask.attachments);if(s.length===0)return"";const l=s.filter(u=>u.type?.startsWith("image/")),c=s.filter(u=>!u.type?.startsWith("image/"));return r`
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
              ${e.rentalAgentProcessing?(()=>{const s=e.rentalActiveTask?.listing.agentId,l=s?e.agentsList.find(c=>c.id===s):null;return r`
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
                  @click=${Pi}>
                  🤖 让智能体处理
                </button>
              `}
            </div>
            <div class="rental-task-result-label">
              ${e.rentalAgentProcessing?"智能体回答中...":"智能体回答 / 任务结果"}
            </div>
            <textarea class="rental-task-result-area"
              .value=${e.rentalTaskResult}
              @input=${s=>{e.rentalTaskResult=s.target.value}}
              ?readonly=${e.rentalAgentProcessing}
              placeholder="智能体处理后结果会显示在这里，也可以直接手动填写..."></textarea>
            ${e.rentalTaskResult.trim()?r`
            <div class="rental-task-instruction">
              <div class="rental-task-instruction-label">✏️ 修改指令 <span style="color:#9ca3af;font-weight:normal;">（输入指令让智能体修改上方结果）</span></div>
              <div class="rental-task-instruction-row">
                <input class="rental-task-instruction-input"
                  type="text"
                  .value=${e.rentalTaskInstruction}
                  @input=${s=>{e.rentalTaskInstruction=s.target.value,d()}}
                  @keydown=${s=>{s.key==="Enter"&&!s.shiftKey&&e.rentalTaskInstruction.trim()&&!e.rentalAgentProcessing&&(s.preventDefault(),ps())}}
                  ?disabled=${e.rentalAgentProcessing}
                  placeholder="例如：把结论部分写得更详细一些..." />
                <button class="rental-btn-revise"
                  ?disabled=${!e.rentalTaskInstruction.trim()||e.rentalAgentProcessing}
                  @click=${ps}>
                  ${e.rentalAgentProcessing?"修改中...":"发送"}
                </button>
              </div>
            </div>
            `:""}
            <div class="rental-task-attachments">
              <div class="rental-task-attachments-label">📎 附件 <span style="color:#9ca3af;font-weight:normal;">(可选，最多5个)</span></div>
              <div class="rental-task-attachments-list">
                ${e.rentalTaskAttachments.map((s,l)=>r`
                  <div class="rental-task-attachment-item">
                    <span class="rental-task-attachment-name">${s.name}</span>
                    <span class="rental-task-attachment-size">(${(s.size/1024).toFixed(0)}KB)</span>
                    <button class="rental-task-attachment-remove" @click=${()=>{e.rentalTaskAttachments=e.rentalTaskAttachments.filter((c,u)=>u!==l),d()}}>✕</button>
                  </div>
                `)}
                ${e.rentalTaskAttachments.length<5?r`
                  <label class="rental-task-attachment-add">
                    📎 添加附件
                    <input type="file" multiple style="display:none;" @change=${s=>{const l=s.target,c=Array.from(l.files||[]),u=c.filter(g=>g.size<=10*1024*1024);u.length<c.length&&k("部分文件超过10MB限制，已跳过"),e.rentalTaskAttachments=[...e.rentalTaskAttachments,...u].slice(0,5),l.value="",d()}} />
                  </label>
                `:""}
              </div>
            </div>
            <!-- Messages -->
            <div class="rental-messages-section">
              <button class="rental-messages-toggle" @click=${Ei}>
                💬 留言沟通 ${(e.rentalActiveTask?.unreadMessageCount||0)>0?r`<span class="rental-messages-badge rental-messages-badge--unread">${e.rentalActiveTask.unreadMessageCount}</span>`:e.rentalMessages.length>0?r`<span class="rental-messages-badge">${e.rentalMessages.length}</span>`:""}
              </button>
              ${e.rentalMessagesOpen?r`
                <div class="rental-messages-container">
                  <div class="rental-messages-list">
                    ${e.rentalMessages.length===0?r`<div class="rental-messages-empty">暂无留言</div>`:e.rentalMessages.map(s=>r`
                        <div class="rental-message-row ${s.sender.id===e.taxstoreUser?.id?"rental-message-row--mine":""}">
                          <div class="rental-message-bubble ${s.sender.id===e.taxstoreUser?.id?"rental-message-bubble--mine":"rental-message-bubble--other"}">
                            <div class="rental-message-sender">${s.sender.name}</div>
                            <div class="rental-message-content">${s.content}</div>
                            <div class="rental-message-time">${new Date(s.createdAt).toLocaleTimeString()}</div>
                          </div>
                        </div>
                      `)}
                  </div>
                  <div class="rental-messages-input-row">
                    <input type="text" class="rental-messages-input" .value=${e.rentalMessageInput}
                      @input=${s=>{e.rentalMessageInput=s.target.value,d()}}
                      @keydown=${s=>{s.key==="Enter"&&(s.preventDefault(),vs())}}
                      placeholder="输入留言..." />
                    <button class="rental-messages-send" @click=${vs}
                      ?disabled=${!e.rentalMessageInput.trim()}>发送</button>
                  </div>
                </div>
              `:""}
            </div>
            <div class="rental-task-actions">
              <span class="rental-task-price">💰 完成可获得 ${e.rentalActiveTask.price} 积分</span>
              <div style="display:flex;gap:8px;">
                <button class="rental-btn-cancel" @click=${At}>取消</button>
                <button class="rental-btn-submit"
                  ?disabled=${!e.rentalTaskResult.trim()||e.rentalAgentProcessing}
                  @click=${Di}>提交结果</button>
              </div>
            </div>
          </div>
        </div>
      `:""}

      <!-- 任务列表弹窗 -->
      ${""}

      <!-- 已完成任务详情弹窗 -->
      ${e.rentalTaskDetailView?r`
        <div class="rental-task-overlay" @click=${()=>{e.rentalTaskDetailView=null,d()}}>
          <div class="rental-task-panel" @click=${s=>s.stopPropagation()}>
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
              <h3 style="margin:0;">✅ 任务详情</h3>
              <button class="rental-tasklist-close" @click=${()=>{e.rentalTaskDetailView=null,d()}}>✕</button>
            </div>
            <div class="rental-task-info">
              <div class="rental-task-title">${e.rentalTaskDetailView.title}</div>
              <div class="rental-task-meta">
                来自: ${e.rentalTaskDetailView.client.name} · 智能体: ${e.rentalTaskDetailView.listing.emoji} ${e.rentalTaskDetailView.listing.name}
              </div>
              <div class="rental-task-content">${e.rentalTaskDetailView.content}</div>
            </div>
            ${e.rentalTaskDetailView.result?r`
              <div class="rental-task-result-label">智能体回复</div>
              <div class="rental-task-detail-result">${e.rentalTaskDetailView.result}</div>
            `:""}
            <div class="rental-task-detail-footer">
              <div class="rental-task-detail-stats">
                <span class="rental-task-card-price--earned">+${e.rentalTaskDetailView.price} 积分</span>
                ${e.rentalTaskDetailView.completedAt?r`<span style="color:#9ca3af;font-size:12px;">完成于 ${new Date(e.rentalTaskDetailView.completedAt).toLocaleString()}</span>`:""}
              </div>
              ${e.rentalTaskDetailView.rating?r`
                <div class="rental-task-detail-rating">
                  ${"⭐".repeat(e.rentalTaskDetailView.rating)}
                  ${e.rentalTaskDetailView.ratingComment?r`<span style="color:#9ca3af;font-size:12px;margin-left:8px;">${e.rentalTaskDetailView.ratingComment}</span>`:""}
                </div>
              `:""}
            </div>
          </div>
        </div>
      `:""}

      ${e.previewAttachment?r`
        <div class="preview-modal" @click=${()=>{e.previewAttachment=null,v()}}>
          <div class="preview-content" @click=${s=>s.stopPropagation()}>
            <button class="preview-close" @click=${()=>{e.previewAttachment=null,v()}}>✕</button>
            ${e.previewAttachment.type.startsWith("image/")?r`
              <img src=${e.previewAttachment.dataUrl} alt=${e.previewAttachment.name} class="preview-image" />
            `:r`
              <div class="preview-file-info">
                <div class="preview-file-icon">📄</div>
                <div class="preview-file-name">${e.previewAttachment.name}</div>
                <div class="preview-file-size">${et(e.previewAttachment.size)}</div>
                <div class="preview-file-type">${e.previewAttachment.type}</div>
              </div>
            `}
          </div>
        </div>
      `:""}

      ${e.toastMessage?r`
        <div class="taxchat-toast">
          <div class="taxchat-toast__icon">📚</div>
          <div class="taxchat-toast__text">${e.toastMessage}</div>
          <button class="taxchat-toast__close" @click=${()=>{e.toastTimer&&clearTimeout(e.toastTimer),e.toastMessage=null,e.toastTimer=null,v()}}>✕</button>
        </div>
      `:""}
    </div>
  `;Js(i,t),requestAnimationFrame(()=>{const s=document.getElementById("messages-container");if(s&&(bn(),ys?(s.scrollTop=s.scrollHeight,je(!1)):$n(s),!s.__vsListenerAttached)){s.__vsListenerAttached=!0;let l=!1;s.addEventListener("scroll",()=>{wn(s),e.messages.length>=40&&!l&&(l=!0,requestAnimationFrame(()=>{l=!1,d()}))},{passive:!0})}});const o=document.getElementById("message-input");o&&!e.sidePanel&&!e.searchOpen&&(o.focus(),e.inputRef=o)}document.addEventListener("click",()=>{let t=!1;e.showStatusMenu&&(e.showStatusMenu=!1,t=!0),e.showNotifications&&(e.showNotifications=!1,t=!0),t&&v()});document.addEventListener("click",t=>{const a=t.target.closest("a");if(!a)return;const i=a.getAttribute("href");if(!i||!a.closest(".message-bubble"))return;t.preventDefault(),t.stopPropagation();const o=window.electronAPI;if(i.startsWith("#localpath=")){const s=decodeURIComponent(i.replace("#localpath=",""));o?.openPath&&o.openPath(s)}else/^https?:\/\//i.test(i)&&(o?.openPath?o.openPath(i):window.open(i,"_blank"))});document.addEventListener("keydown",t=>{(t.ctrlKey||t.metaKey)&&t.key==="f"&&(t.preventDefault(),Es())});document.addEventListener("DOMContentLoaded",()=>{document.documentElement.setAttribute("data-font-size",e.fontSize),le(),re(),aa(),ua(),qs(),Dt();const t=window.electronAPI;t?.onGatewayPortChanged&&t.onGatewayPortChanged(n=>{console.log(`[Gateway] Port changed to ${n}, reconnecting...`),e.gatewayUrl=`ws://127.0.0.1:${n}`,le()})});Pa([{id:"risk",name:"/risk",emoji:"🧾",description:"税务风险治理",action:()=>L("risk-governance","请对上传的文件进行税务风险分析","税务风险治理")},{id:"invoice",name:"/invoice",emoji:"🔍",description:"发票查验",action:()=>L("invoice-check","请查验这些发票","发票查验")},{id:"compare",name:"/compare",emoji:"📊",description:"纳税申报表预审",action:()=>L("declaration-review","请审核纳税申报表","纳税申报表预审")},{id:"contract",name:"/contract",emoji:"📝",description:"合同及票据税审",action:()=>L("contract-review","请进行合同税审","合同及票据税审")},{id:"receipt",name:"/receipt",emoji:"📂",description:"票据整理",action:()=>L("receipt-organize","请执行票据整理流程","票据整理",!0)},{id:"clear",name:"/clear",emoji:"🗑️",description:"清空当前对话",action:()=>{e.confirmingClear=!0,d()}},{id:"new",name:"/new",emoji:"💬",description:"新建对话",action:()=>Pt()},{id:"export",name:"/export",emoji:"📤",description:"导出对话 (Markdown)",action:()=>qa()},{id:"exporthtml",name:"/exporthtml",emoji:"🌐",description:"导出对话 (HTML)",action:()=>La()},{id:"search",name:"/search",emoji:"🔎",description:"搜索消息",action:()=>Es()}]);mn();Tn();en(v);d();Ui();ii().then(()=>{e.taxstoreConnected&&(di(),Bi())});
//# sourceMappingURL=taxchat.js.map
