# MoveGood — Student Move-Out Donation Sorter

> **Clear your room. Help your community.**  
> A mobile-first web app that routes end-of-semester campus move-out clutter to verified local shelters, community thrift stores, and campus reuse programs using multimodal vision AI paired with a deterministic matching engine.

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)](https://vercel.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev)
[![Gemini](https://img.shields.io/badge/Gemini-3.8_Flash_Vision-orange?logo=google)](https://ai.google.dev/)

---

## The Problem
During college move-out, students discard reusable blankets, small appliances, laundry baskets, and hangers simply because figuring out which non-profit accepts what item requires researching multiple organizations and splitting a pile across different rules and drop-off hours.

## Key Product & Engineering Principles
1. **The AI describes; code decides**: Gemini 3.8 Flash Vision only detects items, counts, and visible condition. Drop-off eligibility is determined deterministically in TypeScript (`src/lib/match.ts`) against verified local organization rulebooks (`src/data/organizations.json`), eliminating hallucinated donation rules.
2. **Show uncertainty & safety gates**: Electrical appliances (space heaters, fans) and footwear trigger human condition check cards (*"Does the heater work, with no frayed wires?"*) before routing to shelter bundles.
3. **Data honesty**: Every organization specifies a `lastVerified` timestamp and indicates whether criteria are verified local partners or sample data.
4. **Privacy-first**: Photos are scaled client-side to 800px and processed strictly in-memory without persistent disk storage or database logging. Supports JPG, PNG, WebP, and iPhone HEIC.

---

## Live Community Organizations (Troy, NY / RPI Area)
- **Joseph's House & Shelter** (202 4th St, Troy NY) — Small appliances, coats, clean bedding
- **ReStyle Thrift Store (Unity House)** (547 River St, Troy NY) — Hangers, shoes, clothes, laundry hampers
- **Unity House Front Door Resource Center** (2431 6th Ave, Troy NY) — Unopened cleaning supplies, personal essentials
- **RPI Campus ReUse & Free Store** (RPI Student Union, 110 8th St, Troy NY) — Dorm fans, storage bins, coat hangers

---

## Tech Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, `heic2any` (for iPhone HEIC image conversion).
- **Backend**: Express + TSX (Dev) & Vercel Serverless Function (`api/analyze.ts`).
- **AI Model**: `@google/genai` with `gemini-3.8-flash` (using `ThinkingLevel.LOW` for fast <2s inference).
- **Hosting**: Vercel (Edge static files + Serverless API).

---

## Quickstart & Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/<your-username>/movegood.git
   cd movegood
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY="your-google-ai-studio-api-key"
   ```
   *(Get a free API key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey))*

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## Vercel Deployment

1. Push your repository to GitHub.
2. In [Vercel](https://vercel.com), click **Add New > Project** and import this repository.
3. In **Environment Variables**, add:
   - Name: `GEMINI_API_KEY`
   - Value: `your_gemini_api_key_here`
4. Click **Deploy**. Vercel uses `vercel.json` to deploy the static Vite frontend and the serverless `/api/analyze` endpoint.
