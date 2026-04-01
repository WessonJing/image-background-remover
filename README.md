# BgRemover.ai — Free AI Image Background Remover

> Remove image backgrounds instantly with AI. Free, no login required, HD quality PNG output.

🌐 **Live Demo**: (Deploy to Cloudflare Pages)

---

## ✨ Features

- **Drag & Drop Upload** — Support JPG, PNG, WEBP up to 10MB
- **AI-Powered Processing** — Remove.bg API for pixel-perfect results
- **Before/After Comparison** — Interactive slider to compare original vs result
- **Multiple Background Previews** — Toggle between transparent, white, and black
- **One-Click PNG Download** — Full transparency preserved
- **SEO Optimized** — SSR with Next.js 14, structured data, fast Core Web Vitals
- **Privacy First** — Images processed in memory, never stored

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/WessonJing/image-background-remover.git
cd image-background-remover
npm install
```

### 2. Configure API Key

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your [Remove.bg API Key](https://www.remove.bg/api):

```env
REMOVE_BG_API_KEY=your_api_key_here
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Language | TypeScript |
| AI API | Remove.bg |
| Deployment | Cloudflare Pages |

---

## 📁 Project Structure

```
├── app/
│   ├── api/remove-bg/route.ts   # API route → Remove.bg proxy
│   ├── layout.tsx               # Root layout + SEO metadata
│   ├── page.tsx                 # Main page
│   └── globals.css              # Global styles + checkerboard pattern
├── components/
│   ├── UploadZone.tsx           # Drag & drop upload component
│   └── ImageComparison.tsx      # Before/after slider + download
├── docs/
│   └── MVP-PRD.md               # Product requirements document
└── .env.example                 # Environment variable template
```

---

## 🌍 Deploy to Cloudflare Pages

1. Push to GitHub
2. Connect repo in [Cloudflare Pages](https://pages.cloudflare.com/)
3. Build command: `npm run build`
4. Output directory: `.next`
5. Add environment variable `REMOVE_BG_API_KEY` in Cloudflare dashboard

---

## 📄 License

MIT © 2026 BgRemover.ai
