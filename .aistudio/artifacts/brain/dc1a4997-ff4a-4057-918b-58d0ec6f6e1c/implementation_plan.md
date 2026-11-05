# MoveGood: Move-Out Donation Sorter & Routing Engine

MoveGood transforms end-of-semester campus move-out clutter into organized, verified donation bundles for local shelters, thrift hubs, and mutual aid groups using multimodal vision AI paired with a deterministic matching engine.

***

### User Review & Critical Decisions

> [!IMPORTANT]
> **Confirmed Choices from Clarification Turn:**
> - **Brand Identity**: Confirmed as **MoveGood** (matching your Figma Make prototype screens and visual aesthetic).
> - **AI Vision & Testing**: Confirmed **Live Gemini AI Vision with preloaded sample test photos** so recruiters and portfolio reviewers can either upload their own pile photo or test immediately with curated move-out cleanout photos.
> - **Portfolio & Recruiter Showcase**: Integrated as an elegant collapsible floating drawer / modal ("Why This Works: Architecture & AI Principles"), highlighting your core engineering philosophy: *"The AI describes; code decides"*, condition safety gates, and evaluation metrics.

***

## 1. Overview & Core Concept

- **The Problem**: During college move-out and seasonal packing, students discard bags of usable blankets, storage baskets, hangers, and small appliances because researching 4+ different organization drop-off criteria and hours takes too long.
- **The Core Solution**: A student snaps or uploads a photo of their move-out pile. MoveGood uses Gemini 3.8 Flash to detect items, count, and assess visible condition, then executes a deterministic routing algorithm against a verified organization rulebook (`organizations.json`).
- **Target Audience**: Busy college students (starting with RPI campus / Capital Region community) and recruiters evaluating clean product architecture, responsible AI boundaries, and full-stack execution.

***

## 2. User Experience & Visual Design

### Design Language & Typography
- **Figma Make Fidelity**: Faithfully adopts the prototype's warm editorial aesthetic:
  - **Background Canvas**: Warm cream tone (`#FAF8F2` / `#F6F4EB`).
  - **Typography**: Editorial display serif for headlines (`Newsreader` / `Playfair` styling via loaded web font or Tailwind serif) paired with clean geometric body (`Plus Jakarta Sans` / `Outfit`).
  - **Palette**:
    - Primary Forest Green: `#163323` (used for scan screen, primary buttons, logo mark)
    - Terracotta / Coral Accent: `#E26D5C` / `#DE6B48` ("Move *good.*", step counter, thrift card)
    - Lime Accent: `#D5F044` / `#C4E839` (accent camera ring, scanner laser, shelter stop)
    - Pastel Sky Blue: `#A2D2FF` (women's shelter card)
  - **Layout & Framing**: Responsive mobile container with clean device frame on desktop (with quick toggle for full width or iPhone viewport) and native mobile touch on smartphones.

### Key User Flows
1. **Landing View**:
   - Wordmark `MoveGood` with two-tone green/terracotta logo mark and `STUDENT PROTOTYPE` tag.
   - Hero: *"Moving out? Move good."* with descriptive problem statement and CTA: *"Try it now ->"*.
   - Portfolio quick-access banner: *"Built for recruiters & students · The AI describes, code decides."*
2. **Upload & Photo Selection (Step 1 of 2)**:
   - Dotted camera dropzone: drag & drop, file upload, or camera snapshot.
   - **Interactive Preset Piles**: 3 curated test photos (e.g. *Dorm Closet Cleanout*, *Winter Break Stash*, *Kitchen & Desk Declutter*) with thumbnails for immediate 1-tap testing.
3. **Simulated/Live AI Scanner Transition**:
   - Deep forest green backdrop with glowing lime laser scan line sweeping across the thumbnail.
   - Status: *"Sorting the good stuff... Identifying items and matching them with nearby organizations."*
4. **Results & Condition Check (Step 2 of 2)**:
   - Dynamic headline: *"X items. Y good stops."*
   - **Condition Verification Card**: Yellow warning container asking critical safety questions (e.g. *"Does the space heater work with no frayed cords?"*, *"Are running shoes clean?"*) with `[Yes, confirmed]` or `[Remove]` buttons.
   - **Color-Coded Donation Stops**:
     - Stop 01: Shelter (lime header, address, hours, verified date, matched items with count)
     - Stop 02: Thrift Store (coral header, address, hours, verified date, matched items)
     - Stop 03: Community Group (sky blue header, address, hours, matched items)
     - Unmatched section: Items with no accepting partner, with alternative reuse suggestions.
5. **Interactive Item Editing**:
   - Inline quantity adjustments, rename, condition toggle, and deletion per item.
   - "Add item manually" quick input.
   - When items change, donation stops dynamically regroup in real-time.

***

## 3. Key Product Decisions & Trade-Offs

### Principle 1: The AI Describes, Code Decides
- **Approach**: The Gemini multimodal vision model is constrained strictly to returning structured JSON (`DetectedItem[]`: category, count, visible condition, confidence, observation note).
- **Rationale**: LLMs hallucinate local donation rules. Deterministic TypeScript code in `match.ts` matches detected categories to verified organization rules (`accept`, `reject`, `ask`).

### Principle 2: Safe Appliance & Condition Checks
- **Approach**: Any item with high safety risk (e.g., electric space heaters, fans with cords, worn apparel) triggers a mandatory human verification step before routing.
- **Rationale**: Shelters refuse broken electrical goods and soiled linens. Surfacing uncertainty builds user trust.

### Principle 3: Zero Mock Stubs & Dual Ingestion
- **Approach**: Full server-side Express endpoint (`/api/analyze`) calling Gemini 3.8 Flash with base64 image compression on the client, plus fallback curated test datasets with authentic image previews.

***

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                       Client Viewport                       │
│  ┌────────────────────┐   ┌───────────────────────────────┐ │
│  │ Mobile Frame / Web │   │ Recruiter Architecture Drawer │ │
│  └─────────┬──────────┘   └───────────────┬───────────────┘ │
└────────────┼──────────────────────────────┼─────────────────┘
             │                              │
             ▼                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 React State & Match Engine                  │
│  - useMoveGoodStore: items, activeStep, verifiedChecks      │
│  - matchItemsToOrgs(items, organizations): stops & unmatched│
└────────────┬──────────────────────────────▲─────────────────┘
             │ Upload (shrunk)              │ Verified Orgs
             ▼                              │ (data/organizations.json)
┌───────────────────────────────────────────┴─────────────────┐
│                    Express Full-Stack Server                │
│  - POST /api/analyze: Server-side Gemini 3.8 Flash Vision   │
│  - GET /api/organizations: Rules & lastVerified timestamps  │
│  - Static / Dev middleware Vite integration                 │
└─────────────────────────────────────────────────────────────┘
```

### Data Contracts

```ts
export type Category =
  | "blanket"
  | "laundry_basket"
  | "hangers"
  | "fan"
  | "heater"
  | "shoes"
  | "cleaning_supplies"
  | "other";

export interface DetectedItem {
  id: string;
  category: Category;
  label: string;
  quantity: number;
  condition: "good" | "worn" | "unclear";
  confidence: "high" | "medium" | "low";
  note?: string;
  confirmed?: boolean;
}

export interface Organization {
  id: string;
  name: string;
  type: "shelter" | "thrift" | "campus_group" | "other";
  address: string;
  hours: string;
  website?: string;
  lastVerified: string;
  isSample: boolean;
  themeColor: "lime" | "coral" | "blue" | "emerald";
  acceptsDescription: string;
  rules: Record<Category, { rule: "accept" | "reject" | "ask"; note?: string }>;
}
```

### Implementation Sequence
1. Set up full-stack Express server (`server.ts`) with `/api/analyze` route using `@google/genai` (`gemini-3.8-flash`) and structured JSON schema.
2. Seed verified/sample organizations (`src/data/organizations.json`) with Troy/RPI area and sample shelters matching the Figma design.
3. Implement deterministic matching logic (`src/lib/match.ts`) with unit-level test cases.
4. Build the user interface with React, Tailwind CSS, Lucide icons, and Motion:
   - Header & navigation state
   - Hero & Intro view
   - Photo uploader with preset sample piles
   - Laser scanner animation screen
   - Donation plan results with condition check modal/cards
   - Item editor (add, edit count, remove)
   - Recruiter portfolio drawer explaining the product methodology and AI metrics.
5. Verify build and compile without warnings.
