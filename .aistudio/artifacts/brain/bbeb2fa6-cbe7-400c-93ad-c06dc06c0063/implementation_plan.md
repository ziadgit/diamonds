# OpenCompact — Open-Source Cosmetic Compliance Engine & 3D Brand Twin Simulator

An open-source regulatory intelligence platform and developer studio (**OpenCompact** — a play on a *cosmetic makeup compact*, an *international regulatory compact/treaty*, and a *compact open-source developer engine*) powered by Gemini 4 Argon. OpenCompact ingests existing cosmetic product URLs, natural-language brand prompts, packaging videos, and raw chemical formulations to generate an interactive **3D Spatial Brand Twin** paired with a synchronized **Deep Regulatory & Toxicological Simulation** evaluated across US FDA (MoCRA), California Toxic-Free Cosmetics Act, and EU Regulation (EC) No 1223/2009.

## User Review & Critical Decisions

> [!IMPORTANT]
> This revised plan rebrands the platform and GitHub repository to **OpenCompact**—highlighting the triple pun across the UI, 3D compact/vessel visualizer, and `README.md`—alongside the Product URL Auditor & Distinct Brand Generator and 3D Brand Twin Simulator.

- **Confirmed Decision 1 — Brand Identity (`OpenCompact`)**:
  - Rebrands the project to **OpenCompact**, celebrating the triple meaning:
    1. **Cosmetic Compact**: Physical pressed-pigment compacts, serums, and vessels rendered in the interactive 3D viewport.
    2. **Regulatory Compact**: A unified cross-border legal pact bridging US FDA (MoCRA), California Toxic-Free Cosmetics Act, and EU EC 1223/2009.
    3. **Open-Source & Compact**: A fast, developer-first open-source repository (`github.com/opencompact/opencompact`).
- **Confirmed Decision 2 — Existing Product URL Ingestion & Distinct Brand Generator**:
  - Users can paste any existing cosmetic product URL (or pick from quick-test URLs like a prestige neon compact, a smoothing primer, or a *Silvering* hair/scalp care product) and choose between two Gemini 4 Argon workflows:
    1. **Review & Audit URL**: Parses the product's formulation, claims, and vessel structure to evaluate compliance across US FDA MoCRA, California Toxic-Free Cosmetics Act, and EU EC 1223/2009.
    2. **Generate Similar-But-Distinct Compliant Brand Twin**: Uses the reference URL as a baseline to synthesize a *distinct, legally differentiated brand identity, 3D packaging vessel, positive mission-aligned claims, and auto-remediated clean formulation* that eliminates any flagged regulatory violations (e.g., replacing banned `D&C Red No. 28` in eye products or `PTFE` in primers with compliant alternatives).
- **Confirmed Decision 3 — Comprehensive GitHub `README.md` & In-App Repository Preview**:
  - Delivers a publication-grade `README.md` for **OpenCompact** at the repository root covering the name's origin, system architecture, Gemini 4 Argon integration (`1M Context`, `Multimodal Vision & 3D Synthesis`, `Long Decode MoCRA Dossiers`), environment setup (`NEXT_PUBLIC_SHOW_LANDING_PAGE`), API schema documentation, and open-source contribution guidelines—plus an interactive `README.md` viewer on the OSS Landing Page.
- **Confirmed Decision 4 — Prompt & Multimodal Video-to-3D Brand Twin + Deep Data Coupling**:
  - Every generated or audited product renders as a composite procedural **Three.js 3D Packaging Twin** (`Pressed Pigment Compact Palette`, `Dropper Serum Bottle`, or `Airless Primer Tube`) with an interactive **3D Peel-Off Label Layer** that is bi-directionally synchronized with the Global Matrix Grid, Packaging Prominence Linter, and 15-Day MoCRA Dossier.
- **Confirmed Decision 5 — Default View & Hybrid Execution**:
  - Defaults to the Developer-Centric OSS Landing Page (`NEXT_PUBLIC_SHOW_LANDING_PAGE = "true"`) with instant switching to the Compliance Studio, deterministic 1-click hackathon presets, and live `/api/compliance` (`gemini-4-argon`) execution.

---

## 1. Overview & Core Concept

- **What It Does**: Transforms a raw formulation string, an existing cosmetic product URL, a natural-language brand prompt, or an uploaded packaging video into a synchronized **3D Product & Packaging Digital Twin** and a **Deep Regulatory Compliance Audit**—with the ability to automatically spin up a legally distinct, reformulated compliant competitor brand from any reference URL.
- **Target Audience / Persona**: Independent beauty founders (inspired by Alexis Eizinas of *Silvering* and her 5 pillars for succeeding in the modern beauty industry), cosmetic R&D chemists, packaging industrial designers, and open-source compliance developers.
- **Key Value**: Democratizes enterprise-grade toxicology, 3D packaging prominence linting, and clean-beauty reformulation so founders can audit existing market products or generate compliant, mission-aligned new product lines in seconds.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Developer OSS Landing Page Experience (`/app/page.tsx`)**:
   - **Top Bar**: Follows the strict 3-zone contract — Brand Wordmark (`OpenCompact`), 4 single-line navigation links (`Sandbox`, `Architecture`, `Founder Ethos`, `README`), and 1 primary action button (`Launch App Studio`).
   - **Hero & Live Interactive Sandbox Widget**:
     - Headline: *"The Open Source Shield Against Regulatory Patchworks"* with an emerald drop-shadow glow, paired with *"Launch App Studio"* and *"Star on GitHub"* actions.
     - **Live Interactive Sandbox Widget**: Supports raw INCI chemical strings, brand prompts, or a **Product URL Quick-Clone & Audit input**, where clicking **"Run Instant Mock Audit"** triggers an Argon processing animation and renders an inline multi-jurisdictional compliance table widget.
   - **Architectural Spec Bento Grid**: Three distinct technical layout cards highlighting Gemini 4 Argon capabilities:
     - `01. 1M Unified Context Window` — Cross-border legislative multi-file indexing across US FDA MoCRA, California Toxic-Free Cosmetics Act, and EU EC 1223/2009 Annexes.
     - `02. Native Multimodal Vision & 3D Spatial Synthesis` — Automated URL, video frame, and artwork layer ingestion that constructs an interactive 3D packaging twin and flags peel-off sticker traps.
     - `03. Long Decode Horizon` — Autonomous multi-page MoCRA Serious Adverse Event Dossier generation across patient profiles, batch stability, and clinical follow-ups.
   - **Modern Beauty Industry Ethos Strip (Inspired by Alexis Eizinas of Silvering)** & **Interactive GitHub `README.md` Repository Explorer**: Showcases the 5 pillars of modern beauty brand creation alongside a clean, copyable preview of the `OpenCompact` repository documentation and quickstart commands.

2. **Compliance Studio Workspace (`/app/studio/page.tsx` & Unified Switcher)**:
   - **Source Controls Sidebar (300px–340px width)**:
     - **Demo Presets (1-Click Hackathon Triggers)**:
       - **Preset 1: "The Huda Matrix"** — Neon-pigment pressed compact palette (`D&C Red No. 28 at 18,500 ppm`). `[PASS]` in the EU, categorical crimson `[VIOLATION]` under US FDA criteria for eye-area use, plus a peel-off back-panel warning trap.
       - **Preset 2: "The California PFAS Trap"** — Clean-beauty smoothing primer (`0.1% PTFE`). Passes baseline US federal guidelines while triggering a strict California Toxic-Free Cosmetics Act `[VIOLATION]`.
       - **Preset 3: "MoCRA Adverse Event Influx"** — Unstructured customer logs including an emergency room allergic reaction case (`Batch #OC-2026-884B`) for autonomous 15-day FDA dossier synthesis.
       - **Bonus Founder Preset: "Silvering Luxe Toning Serum"** — Frosted optical-glass dropper bottle for translucent silver/gray hair and scalp care, auditing `CI 60730 (Acid Violet 43)` ppm thresholds and positive vs. drug-claim labeling.
     - **Product URL Ingestion & Distinct Brand Cloner**:
       - Paste an existing cosmetic product URL and select either **"Audit Existing Product"** or **"Generate Distinct & Compliant Brand Twin"** (which reformulates flagged ingredients, creates a distinct brand name & palette, rewrites fear/drug claims into positive cosmetic claims, and updates the 3D vessel).
     - **3D Brand Prompt & Multimodal Video/Artwork Uploader**:
       - Prompt input + `.mp4`/`.webm`/image dropzone that extracts video keyframes client-side and sends them to Gemini 4 Argon to synthesize the 3D twin and deep compliance data.
     - **Formulation & Adverse Event Ingestion**: Drag-and-drop JSON uploader and live INCI/ppm concentration text area.

   - **Main Performance Canvas (Shadcn Tabs Architecture)**:
     - **Tab 1 — The Global Matrix Grid (Deep Data Evaluation)**:
       - Responsive high-density data table displaying three destination columns: **"US FDA (MoCRA)"**, **"California (Toxic-Free)"**, and **"European Union (EC 1223/2009)"**.
       - Rows display specific ingredients, evaluated concentrations (`tabular-nums`), active badge states (`[PASS]` in vivid emerald, `[VIOLATION]` in crimson), and concise legal-toxicological justifications—plus a **Reformulation Diff Banner** when a distinct compliant brand variant is generated from a URL.
     - **Tab 2 — Multimodal 3D Brand Twin & Packaging Linting (The Graphic & Spatial Visualizer)**:
       - **Left/Center Viewport — Interactive Three.js 3D Packaging Twin + 2D Dieline Switcher**:
         - Composite procedural 3D cosmetic vessels (`Pressed Pigment Compact Palette`, `Dropper Serum Bottle`, or `Airless Primer Tube`) with `RoomEnvironment` studio reflections, anisotropic metal collars/hinges, transmissive glass/mirrors, and live `CanvasTexture` front/back labels.
         - **Collapsible Bottom Control Dock**: Includes the **Interactive 3D Peel-Off Label Slider** (smoothly peeling back the outer adhesive graphic layer in 3D space to expose buried FDA warnings), Camera Presets (`Front Claim`, `Back Warning Layer`, `360° Orbit`), and Material Finish selectors.
       - **Right Panel — Synchronized Compliance Alert Cards & Claim Linter**:
         - Side-by-side regulatory alerts pinpointing buried peel-off warnings, typography point size (`pt`), WCAG contrast ratio, and **Silvering Positive Claim / Drug-Claim Crossover Linting**.
     - **Tab 3 — Autonomous MoCRA Dossier Generator (Long Decode Display)**:
       - Code-themed editor canvas window with skeleton decode loader simulating Argon's multi-turn long decode pipeline.
       - Generates a multi-page, self-consistent 15-day formal FDA filing packet including: **Patient Anonymized Data Profiles**, **Chronological Formulation Stability Mapping**, **Toxicological Hazard Assessment**, and **Structured Follow-Up Clinical Interview Templates**, with `.md` and `.json` exports.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: URL-to-Brand Remixer with Automatic Regulatory Remediation**
  - *Chosen Approach*: When a user inputs an existing product URL and selects *"Generate Similar-But-Distinct Compliant Brand"*, the backend instructs `gemini-4-argon` to identify any cross-border chemical or labeling hazards in the reference product and output a differentiated brand concept with safe, compliant substitute ingredients along with a fresh 3D vessel configuration.
  - *Why*: Turns compliance auditing from a purely defensive blocker into a generative product-development workflow for indie beauty founders.
- **Decision 2: First-Class Open-Source Repository Design (`README.md`)**
  - *Chosen Approach*: Provide both a rich root `README.md` file for **OpenCompact** in the codebase and an interactive `README.md` viewer in the OSS Landing Page so developers can inspect architecture diagrams, `.env` flags, and API curl examples without leaving the browser.
  - *Why*: Directly fulfills the open-source hackathon delivery model and makes the repository immediately fork-ready.

---

## 4. Technical Architecture & Data Strategy

### Architecture & Component Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                         Top Navigation Bar (3-Zone)                          │
│  [OpenCompact]     [Sandbox · Architecture · Founder Ethos · README]  [CTA]  │
└───────────────────┬──────────────────────────────────────┬───────────────────┘
                    │                                      │
       (Landing View Active)                  (Compliance Studio Active)
                    ▼                                      ▼
┌───────────────────────────────────────┐  ┌───────────────────────────────────┐
│      OSS Developer Landing View       │  │     Compliance Studio Workspace   │
│ ┌───────────────────────────────────┐ │  │ ┌───────────────────────────────┐ │
│ │ Hero + Live Mock Audit Sandbox    │ │  │ │ Source Controls Sidebar       │ │
│ └───────────────────────────────────┘ │  │ │ • 1-Click Hackathon Presets   │ │
│ ┌───────────────────────────────────┐ │  │ │ • Product URL Audit & Remix   │ │
│ │ Gemini 4 Argon Spec Bento Grid    │ │  │ │ • Prompt & Video-to-3D Input  │ │
│ │ • 01. 1M Unified Context Window   │ │  │ │ • INCI / PPM JSON Dropzone    │ │
│ │ • 02. Multimodal Vision & 3D Twin │ │  │ └──────────────┬────────────────┘ │
│ │ • 03. Long Decode Horizon         │ │  │                ▼                  │
│ └───────────────────────────────────┘ │  │ ┌───────────────────────────────┐ │
│ ┌───────────────────────────────────┐ │  │ │ Shadcn Tabbed Performance UI  │ │
│ │ Silvering Ethos + GitHub README   │ │  │ │ [Tab 1] Global Matrix Grid    │ │
│ └───────────────────────────────────┘ │  │ │ [Tab 2] 3D Brand Twin & Linter│ │
└───────────────────────────────────────┘  │ │ [Tab 3] MoCRA 15-Day Dossier  │ │
                                           │ └──────────────┬────────────────┘ │
                                           └────────────────┼──────────────────┘
                                                            │ POST /api/compliance
                                                            ▼
                                           ┌───────────────────────────────────┐
                                           │   Next.js Server API Route        │
                                           │   • @google/genai (gemini-4-argon)│
                                           │   • URL Context + Video/Image     │
                                           │   • Mode: Audit OR Distinct Remix │
                                           │   • Returns: 3D Twin + Matrix +   │
                                           │     Linter + 15-Day MoCRA Dossier │
                                           └───────────────────────────────────┘
```

### Data Model & State

- **`ComplianceAuditPayload` (Request to `/api/compliance`)**:
  - `presetId`: `"huda-matrix" | "ca-pfas-trap" | "mocra-adverse-event" | "silvering-toner" | "custom"`
  - `urlMode`: `"none" | "audit-url" | "generate-distinct-brand"`
  - `sourceProductUrl`: string (optional reference cosmetic product URL)
  - `brandPrompt`: string (natural language prompt describing the brand, vessel, target niche, and claims)
  - `videoFramesBase64`: `Array<{ data: string; mimeType: string; timestampSec: number }>` (optional keyframes extracted from ingested video or artwork image)
  - `formulationRaw`: string (INCI names, CAS numbers, and ppm/percentage concentrations)
  - `artworkMetadata`: `{ frontClaim: string; backWarningText: string; fontSizePt: number; isBehindPeelOffLayer: boolean; contrastRatio: number }`
  - `adverseEventLogs`: string (raw consumer/clinical tickets)
- **`ComplianceAuditResult` (Strict JSON Schema Response)**:
  - `urlRemixMetadata`: `{ sourceUrl?: string; mode: string; originalBrandSummary?: string; differentiationStrategy?: string; substitutedIngredients: Array<{ replaced: string; replacement: string; reason: string }> }`
  - `brandTwin3D`: `{ vesselArchetype: "pressed-palette" | "dropper-serum" | "airless-pump"; brandName: string; productTitle: string; subtitle: string; primaryColorHex: string; accentColorHex: string; pigmentOrLiquidHex: string; metallicFinish: "platinum" | "gold" | "obsidian"; glassTransmission: number; peelOffLayerWarning: string; frontPanelClaims: string[]; videoIngestionSummary?: string }`
  - `matrixRows`: Array of evaluated ingredients with `ingredientName`, `casNumber`, `concentrationPpm`, and structured verdicts (`status: "PASS" | "VIOLATION"`, `citation: string`, `justification: string`) for `usFda`, `california`, and `eu`.
  - `artworkLinting`: Dieline & 3D spatial inspection results, peel-off layer trap status, typography prominence score, Silvering positive/mission claim audit, and side-by-side `ComplianceAlertCard` items.
  - `mocraDossier`: Multi-page 15-day formal FDA submission document containing `filingHeader`, `patientProfiles`, `chronologicalStabilityMapping`, `toxicologicalHazardAssessment`, `clinicalInterviewTemplates`, and compiled Markdown text.
