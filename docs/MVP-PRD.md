# 📋 MVP 需求文档
## Image Background Remover

**版本：** v0.1 MVP  
**日期：** 2026-03-31  
**作者：** 知行·星辰

---

## 一、产品目标

打造一个**极简、快速、无需登录**的在线AI抠图工具，面向海外用户，通过SEO获取免费流量，MVP阶段验证产品可行性和用户留存。

---

## 二、技术选型

| 模块 | 方案 | 说明 |
|------|------|------|
| 前端框架 | Next.js 14 (App Router) | SSR利于SEO |
| 部署平台 | Cloudflare Pages + Workers | 全球CDN，免费额度大 |
| AI能力 | Remove.bg API | 质量稳定，按次计费 |
| 图片存储 | 内存处理，不落盘 | 隐私友好，无存储成本 |
| 样式 | Tailwind CSS | 快速开发 |

---

## 三、功能范围（MVP）

### ✅ 核心功能（必须有）

#### F1 - 图片上传
- 支持**拖拽上传**和**点击选择**两种方式
- 支持格式：JPG、PNG、WEBP
- 文件大小限制：≤ 10MB（Remove.bg免费API限制）
- 上传后立即调用AI处理，无需额外点击

#### F2 - 背景去除处理
- 调用 Remove.bg API 处理图片
- 展示**Loading状态**（进度动画）
- 错误处理：API失败、超时、格式不支持等

#### F3 - 结果预览
- **左右对比滑块**：拖动查看原图 vs 处理后效果
- 处理后图片展示在**棋盘格背景**上（标准透明背景展示）
- 支持切换背景色预览（白、黑、透明）

#### F4 - 下载
- 一键下载处理后的 **PNG 文件**（保留透明通道）
- 免费版：下载原始分辨率（Remove.bg 免费返回标准分辨率）
- 文件命名：`原文件名_removed_bg.png`

#### F5 - 继续处理
- 下载后展示"**Process Another Image**"按钮
- 点击后重置页面，回到上传状态

### ⚪ 不做（MVP范围外）

- 用户注册/登录系统
- 图片历史记录
- 批量上传处理
- 付费订阅
- 自定义替换背景
- 移动端APP

---

## 四、页面结构

### 页面1：主页（唯一页面）

```
┌─────────────────────────────────────┐
│  Logo + 产品名                  [EN] │  ← Header（极简）
├─────────────────────────────────────┤
│                                     │
│       H1: 核心SEO标题               │
│       副标题：一句话价值主张         │
│                                     │
│  ┌─────────────────────────────┐    │
│  │                             │    │
│  │   拖拽上传区域               │    │  ← 上传区（主视觉）
│  │   📁 Drop image here        │    │
│  │   or click to browse        │    │
│  │                             │    │
│  └─────────────────────────────┘    │
│                                     │
│  支持格式提示 | 隐私说明             │
│                                     │
├─────────────────────────────────────┤
│  [处理中状态 / 结果预览区]           │  ← 动态区域
├─────────────────────────────────────┤
│  功能特性说明（3个卖点）             │  ← SEO内容区
├─────────────────────────────────────┤
│  FAQ（5条）                         │  ← SEO长尾
├─────────────────────────────────────┤
│  Footer                             │
└─────────────────────────────────────┘
```

---

## 五、核心文案（英文，SEO向）

### H1 标题
```
Free AI Background Remover — Instant, No Login Required
```

### 副标题
```
Remove image backgrounds in seconds with AI. 
Free, fast, and no signup needed.
```

### 三大卖点
```
⚡ Instant Processing    — Results in under 5 seconds
🔒 Privacy First        — Images processed in memory, never stored  
✨ HD Quality           — Powered by remove.bg AI technology
```

### Meta Title
```
Free Background Remover Online - Remove Image Background Instantly | [品牌名]
```

### Meta Description
```
Remove image backgrounds for free with AI. No login required, instant results, 
HD quality PNG download. The fastest background remover online.
```

---

## 六、用户交互流程

```
用户访问首页
    ↓
上传图片（拖拽 or 点击）
    ↓
前端验证（格式/大小）
    ↓ 通过
调用 /api/remove-bg（Cloudflare Worker）
    ↓
Worker 转发至 Remove.bg API
    ↓
返回处理结果（Base64 or Blob）
    ↓
前端展示对比预览
    ↓
用户点击下载 PNG
    ↓
展示"Process Another Image"
```

---

## 七、API 设计

### POST `/api/remove-bg`

**请求：**
```
Content-Type: multipart/form-data
Body: { image: File }
```

**响应（成功）：**
```json
{
  "success": true,
  "image": "<base64 PNG data>"
}
```

**响应（失败）：**
```json
{
  "success": false,
  "error": "File too large / Invalid format / API limit reached"
}
```

**错误码处理：**
| 场景 | 用户提示 |
|------|---------|
| 文件超10MB | "File too large. Please upload an image under 10MB." |
| 格式不支持 | "Unsupported format. Please use JPG, PNG, or WEBP." |
| API配额用完 | "Service busy, please try again later." |
| 网络超时 | "Processing timeout. Please try again." |

---

## 八、SEO 要求

| 项目 | 要求 |
|------|------|
| Core Web Vitals | LCP < 2.5s，CLS < 0.1 |
| 图片 Alt 标签 | 全部填写 |
| 结构化数据 | WebApplication Schema |
| Sitemap | 自动生成 |
| robots.txt | 标准配置 |
| 页面加载 | 首屏无需JS即可看到内容（SSR） |

---

## 九、隐私与合规

- 页面明示：**"We don't store your images"**
- 图片仅在请求生命周期内存在内存中
- 需要 **Privacy Policy** 页面（基础版）
- 需要 **Terms of Service** 页面（基础版）
- Cloudflare Worker 处理，数据不落盘

---

## 十、验收标准

| 功能 | 验收条件 |
|------|---------|
| 上传 | 支持拖拽和点击，格式/大小校验正常 |
| 处理 | 10秒内返回结果，Loading状态正常 |
| 预览 | 对比滑块流畅，棋盘格透明背景正常展示 |
| 下载 | PNG文件完整，透明通道保留 |
| 错误处理 | 各类错误有友好英文提示 |
| SEO | Meta标签完整，H1正确，页面可被爬取 |
| 移动端 | 在主流手机浏览器上可正常使用 |
