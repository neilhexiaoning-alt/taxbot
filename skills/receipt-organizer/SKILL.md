---
name: receipt-organizer
description: "Organize receipts and invoices in a folder, classify them by expense type, and generate an Excel reimbursement report. Trigger when the user mentions: 整理票据, 报销单, 发票分类, 票据整理, 报销, expense report, receipts, invoices, reimbursement."
metadata:
  {
    "openclaw":
      {
        "emoji": "🧾",
        "os": ["win32"],
        "install":
          [
            {
              "id": "openpyxl",
              "kind": "uv",
              "label": "Install openpyxl",
              "package": "openpyxl",
            },
            {
              "id": "pdfplumber",
              "kind": "uv",
              "label": "Install pdfplumber",
              "package": "pdfplumber",
            },
          ],
      },
  }
---

# 票据整理与报销单生成

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

根据提取的文本，从每个文件中识别：日期(YYYY-MM-DD)、金额(含税总额)、商家名称、票据类型(增值税专用发票/普通发票/电子发票/火车票/机票/出租车票/客运票/过路费发票/定额发票/收据/其他)、票据号码、消费摘要、税额、税率。无法识别的字段填 null。

对照第一步的文件列表，将 receipt_001.pdf 等临时文件名与原始文件名对应。

## 第三步：分类并生成报销单

根据费用分类规则（交通费、餐饮费、住宿费、办公用品费、通讯费、会议费、差旅费、业务招待费、培训费、快递物流费、设备购置费、软件服务费、其他费用）将每张票据分配费用类别。

严禁使用虚构数据，每条记录必须来自第二步的真实提取结果。

用 exec 工具执行以下命令，先将JSON写入临时文件，再生成报销单（替换实际数据和路径）：

'{"title":"报销单","applicant":"","department":"","items":[{"date":"2025-05-13","category":"交通费","summary":"火车票","vendor":"铁路客运","receipt_type":"电子发票","receipt_no":"12345","amount":150.00,"tax_amount":null,"tax_rate":null,"filename":"原始文件名.pdf"}]}' | Set-Content -Path "$env:TEMP\receipts_data.json" -Encoding UTF8; python "$env:TAXBOT_ROOT/skills/receipt-organizer/scripts/generate_report.py" "$env:TEMP\receipts_data.json" --output "<FOLDER路径>"

注意：JSON 数据用单引号包裹，通过 Set-Content 写入临时文件（UTF-8编码），然后传文件路径给 generate_report.py。<FOLDER路径> 替换为第一步输出的 FOLDER 值。JSON 必须是单行，不要换行。

items 数组中每个对象的字段：date, category, summary, vendor, receipt_type, receipt_no, amount(数字), tax_amount, tax_rate, filename(原始文件名)。

## 第四步：输出结果

报告：票据总数、识别成功数、按类别汇总（类别/笔数/金额）、报销总金额、报销单文件路径。

## 特殊情况

- 文本标记 [no-pdf-library]：提示用户安装 pdfplumber（pip install pdfplumber）
- 文本标记 [image-file]：标记"图片文件，待人工核实"
- 识别失败：标记"待人工核实"，记录文件名
- 重复票据：发票号相同时提醒用户
- 金额超 10000 元：提醒用户确认
