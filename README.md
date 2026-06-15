# DocMind — Frontend

A polished React + Vite + Tailwind frontend for **DocMind**, an AI document
intelligence platform. Upload PDFs, CSVs, Word docs, or images. Ask anything.
Get streaming answers with citations to the exact page, row, or section.

**Backend repo:** https://github.com/jatmxai-lab/docmind

---

## Stack

- **React 18** + **Vite**
- **Tailwind CSS** with a custom indigo / violet dark theme
- **React Router** with public / private route guards
- **Axios** with JWT + refresh-token interceptor
- **Server-Sent Events** for streaming chat
- **Lucide** icons
- **react-markdown** for rich answer rendering

## Run locally

```bash
npm install
cp .env.example .env   # then edit VITE_API_URL to point at your backend
npm run dev
```

Open http://localhost:5173.

## Deploy on Vercel

1. Import this repo at https://vercel.com/new
2. Framework: Vite (auto-detected)
3. Add env var `VITE_API_URL` pointing at the deployed backend
4. Deploy

## Design notes

- Dark theme on a layered radial gradient mesh (`#06060a` base)
- Glassmorphism cards (`backdrop-blur-xl` over a 6% white tint)
- Animated streaming cursor + shimmer skeletons
- Citation cards that expand to show source excerpts
- Custom scrollbar in accent purple
- Inter (body) · Fraunces (display) · JetBrains Mono (code)
