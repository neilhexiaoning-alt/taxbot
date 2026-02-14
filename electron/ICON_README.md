# 应用图标说明

## 所需图标文件

为了打包 Windows 安装程序，需要准备以下图标文件：

### Windows (.ico)
将 SVG logo 转换为 ICO 格式：
- 路径：`ui/assets/icon.ico`
- 建议尺寸：256x256, 128x128, 64x64, 48x48, 32x32, 16x16

### 转换工具

1. **在线工具**
   - https://convertio.co/zh/svg-ico/
   - https://www.aconvert.com/cn/icon/svg-to-ico/

2. **本地工具**
   - ImageMagick: `convert taxchat-logo.svg -define icon:auto-resize=256,128,64,48,32,16 icon.ico`
   - GIMP: 导出为 ICO 格式，选择多个尺寸

### macOS (.icns)
- 路径：`ui/assets/icon.icns`

### Linux (.png)
- 路径：`ui/assets/icon.png`
- 尺寸：512x512

## 临时方案

在图标文件准备好之前，可以：
1. 使用现有的 SVG logo（部分功能可能不显示图标）
2. 先打包测试版本（使用默认 Electron 图标）

## 当前状态

- ✅ SVG Logo: `ui/assets/taxchat-logo.svg`
- ⏳ ICO Icon: 待创建
- ⏳ ICNS Icon: 待创建
- ⏳ PNG Icon: 待创建
