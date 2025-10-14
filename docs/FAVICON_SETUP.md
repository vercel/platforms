# Favicon & Icon Setup Guide

## 📁 Required Icon Files

To complete the favicon setup, you'll need to add these image files to your `/public/images/` directory:

### **Core Favicon Files:**
- `favicon.ico` (32x32) - ✅ Already exists in `/app/`
- `icon-16.png` (16x16) - Browser tab icon
- `icon-32.png` (32x32) - Browser tab icon

### **Apple Touch Icons:**
- `apple-touch-icon.png` (180x180) - iOS home screen icon

### **PWA Icons:**
- `icon-192.png` (192x192) - Android home screen
- `icon-512.png` (512x512) - Android splash screen

### **Additional Icons:**
- `safari-pinned-tab.svg` - Safari pinned tab icon (SVG format)
- `og-image.png` (1200x630) - Social media sharing image

## 🎨 Design Specifications

### **Favicon Requirements:**
- **Format**: ICO, PNG, or SVG
- **Size**: 32x32 pixels (minimum)
- **Colors**: Should work on both light and dark backgrounds
- **Style**: Simple, recognizable at small sizes

### **Apple Touch Icon:**
- **Size**: 180x180 pixels
- **Format**: PNG
- **Background**: Should include background (not transparent)
- **Corners**: Apple will automatically round the corners

### **PWA Icons:**
- **192x192**: Used for Android home screen shortcuts
- **512x512**: Used for Android splash screens
- **Format**: PNG with transparent background
- **Style**: Should be "maskable" (content within safe area)

## 🔧 How to Generate Icons

### **Option 1: Online Favicon Generators**
1. **RealFaviconGenerator**: https://realfavicongenerator.net/
2. **Favicon.io**: https://favicon.io/
3. **Canva**: Has favicon templates

### **Option 2: Design Software**
1. Create your logo in **Adobe Illustrator/Figma**
2. Export multiple sizes as PNG
3. Use online converter for ICO format

### **Option 3: AI Generation**
1. Use **DALL-E/Midjourney** to create a logo
2. Upscale and resize as needed
3. Convert to required formats

## 📱 What's Already Configured

✅ **HTML Meta Tags**: All favicon links added to layout.tsx  
✅ **Web App Manifest**: PWA configuration ready  
✅ **SEO Metadata**: Open Graph and Twitter cards configured  
✅ **Multiple Format Support**: ICO, PNG, SVG support  

## 🚀 Quick Setup Steps

1. **Design your favicon** (OakRidge AI logo/symbol)
2. **Generate all required sizes** using online tools
3. **Add files to `/public/images/`** directory
4. **Replace existing `/app/favicon.ico`** if needed
5. **Test on different devices** and browsers

## 🎯 Brand Consistency

Make sure your favicon:
- **Matches your logo** design language
- **Works at small sizes** (16x16 pixels)
- **Is recognizable** in browser tabs
- **Represents OakRidge AI** brand identity

## 📋 File Checklist

```
/public/images/
├── icon-16.png (16x16)
├── icon-32.png (32x32)
├── icon-192.png (192x192)
├── icon-512.png (512x512)
├── apple-touch-icon.png (180x180)
├── safari-pinned-tab.svg
└── og-image.png (1200x630)

/app/
└── favicon.ico (32x32) ✅ exists
```

---

**Note**: The current setup will work with just the existing favicon.ico, but adding the additional files will provide the best experience across all devices and platforms.