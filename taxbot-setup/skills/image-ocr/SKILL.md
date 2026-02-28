---
name: image-ocr
description: Extract text from images using OCR (Optical Character Recognition). Use when user wants to: (1) Read text from an image file, (2) Convert screenshots to text, (3) Extract printed or handwritten text from images, (4) Scan documents or receipts. Supports common image formats like PNG, JPG, BMP, and TIFF.
---

# Image OCR Skill

## Quick Start

Use the `image` tool with OCR prompt:

```
Tool: image
Image: path/to/image.png
Prompt: Extract all text from this image
```

## Supported Image Formats

- PNG (.png)
- JPEG (.jpg, .jpeg)
- BMP (.bmp)
- TIFF (.tiff, .tif)
- WebP (.webp)

## Common Use Cases

### Screenshots
```
Tool: image
Image: screenshot.png
Prompt: Extract the text content from this screenshot
```

### Documents
```
Tool: image
Image: document.jpg
Prompt: Read all text from this document, maintaining structure
```

### Receipts & Cards
```
Tool: image
Image: receipt.png
Prompt: Extract all text including prices, dates, and items
```

## Tips

- Higher resolution images = better accuracy
- Clear, non-blurry text produces best results
- For multi-page documents, process each page separately
- Pre-processing (contrast, denoising) can improve results on difficult images

## Limitations

- Handwriting recognition varies by quality
- Complex layouts may lose formatting
- Very small text may not be recognized
- Colored backgrounds can affect accuracy
