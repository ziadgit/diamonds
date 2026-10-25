# OpenShield — Open-Source Cosmetic Compliance Engine

An open-source regulatory intelligence platform and developer studio powered by Gemini 4 Argon that audits cosmetic formulations, packaging artwork layers, and consumer adverse event logs across US FDA (MoCRA), California Toxic-Free Cosmetics Act, and EU Regulation (EC) No 1223/2009.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and UX choices incorporate your confirmed preferences and govern the build execution.

- **Confirmed Decision 1 — Default View & Navigation Flow**: The application defaults to the Developer-Centric Open-Source Landing Page (`NEXT_PUBLIC_SHOW_LANDING_PAGE` defaulting to `"true"`), with an instant interactive toggle and dedicated route to launch the Compliance Studio Workspace without page-reload friction.
- **Confirmed Decision 2 — Hybrid Preset + Live Gemini 4 Argon Execution**: One-click hackathon presets (*The Huda Matrix*, *The California PFAS Trap*, and *MoCRA Adverse Event Influx*) load deterministic, scientifically grounded regulatory data for instant zero-latency demonstration, while also allowing a live "Deep Re-Audit with Gemini 4 Argon" or custom formulation/artwork/adverse-event evaluation through the server-side Gemini 4 Argon endpoint.
- **Confirmed Decision 3 — Interactive Power-Tools**:
  - **Interactive Peel-Off Layer Inspector**: A 2D multi-layer packaging artwork visualizer allowing users to peel back outer sticker layers, inspect font prominence (pt size & contrast ratio), and pinpoint hidden FDA safety warnings.
  - **15-Day MoCRA FDA Dossier Exporter**: One-click export of the generated Adverse Event Dossier as structured Markdown (`.md`) or regulatory submission JSON (`.json`), alongside copy-to-clipboard actions.

---

## 1. Overview & Core Concept

- **What It Does**: Ingests raw cosmetic INCI ingredient strings (with ppm/percentage concentrations), packaging artwork specifications/OCR transcripts, and unstructured consumer adverse event reports, then evaluates them against cross-border toxicology laws and generates formal regulatory filings.
- **Target Audience / Persona**: Cosmetic R&D chemists, regulatory affairs specialists, formulation engineers, and open-source compliance developers navigating conflicting global chemical patchworks.
- **Key Value**: Eliminates manual cross-referencing across thousands of pages of US federal, state, and European annexes while automating time-critical 15-business-day FDA MoCRA Serious Adverse Event submissions.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Developer OSS Landing Page Experience**:
   - **Top Bar**: Follows the strict 3-zone contract — Brand Wordmark (`OpenShield`), 4 single-line navigation links (`Sandbox`, `Architecture`, `Presets`, `Documentation`), and 1 primary action button (`Launch App Studio`).
   - **Hero & Live Interactive Sandbox Widget**: Displays the headline *"The Open Source Shield Against Regulatory Patchworks"* with an emerald drop-shadow glow, paired with *"Launch App Studio"* and *"Star on GitHub"* actions. Directly inside the hero block, developers can edit a raw chemical formulation string or click **"Run Instant Mock Audit"** to trigger an Argon analysis sequence that renders an inline multi-jurisdictional compliance table.
   - **Architectural Spec Bento Grid**: An asymmetric 3-card technical grid (`col-span-2` + `col-span-1` layout) detailing:
     - `01. 1M Unified Context Window` — Cross-border legislative multi-file indexing across FDA 21 CFR, CA Health & Safety Code, and EU Annexes II–VI.
     - `02. Native Multimodal Vision` — Automated packaging artwork layer vetting, peel-off sticker trap detection, and 21 CFR 701.2 prominence verification.
     - `03. Long Decode Horizon` — Autonomous multi-page MoCRA Serious Adverse Event dossier synthesis with self-consistent clinical and stability records.

2. **Compliance Studio Workspace (`Sidebar + Main Canvas`)**:
   - **Source Controls Sidebar (280px–320px width)**:
     - **1-Click Hackathon Demo Presets**:
       - *Preset 1: "The Huda Matrix"* — Neon-pigment pressed eye/face palette containing D&C Red No. 28 (CI 45410) at `18,500 ppm (1.85%)` and Ferric Ferrocyanide. Passes EU EC 1223/2009 Annex IV, but triggers a categorical US FDA `[VIOLATION]` for eye-area use plus a packaging peel-off warning trap.
       - *Preset 2: "The California PFAS Trap"* — Clean-beauty smoothing primer containing `0.1% (1,000 ppm) PTFE` (Polytetrafluoroethylene) and Cyclopentasiloxane. Passes baseline federal inspection while triggering a strict `[VIOLATION]` under the California Toxic-Free Cosmetics Act (AB 2762 / AB 496).
       - *Preset 3: "MoCRA Adverse Event Influx"* — Unstructured multi-channel consumer support tickets including an acute periorbital angioedema and chemical conjunctivitis case requiring emergency department intervention (`Batch #OS-2026-884B`).
     - **Formulation Ingestion**: Drag-and-drop `.json`/`.txt` uploader and live INCI/ppm editor.
     - **Multimodal Visual Canvas Simulator**: Upload custom packaging artwork image or edit structured artwork layer/OCR metadata, plus a primary **"Run Gemini 4 Argon Audit"** button.
   - **Main Performance Canvas (Shadcn Tabs Architecture)**:
     - **Tab 1 — The Global Matrix Grid**: High-density data table (`36px–44px` compact rows, `tabular-nums` concentration columns, live ingredient filter) comparing **US FDA (MoCRA / 21 CFR)**, **California (Toxic-Free Act)**, and **European Union (EC 1223/2009)**. Features explicit semantic `[PASS]` (emerald) and `[VIOLATION]` (crimson) badges paired with legal-toxicological justifications.
     - **Tab 2 — Multimodal Packaging Linting (Graphic Visualizer)**: Interactive 2D dieline & box panel preview with the **Interactive Peel-Off Layer Inspector**. Users can toggle between *As-Printed Outer Surface*, *Peel-Off Layer Lifted*, and *X-Ray Typography Contrast View* alongside side-by-side regulatory alert cards pinpointing prominence violations.
     - **Tab 3 — Autonomous MoCRA Dossier Generator (Long Decode Display)**: Code-themed regulatory document editor with line numbers, section jump navigation, skeleton decode progress indicator, and one-click **Export Markdown (`.md`)** and **Export JSON (`.json`)** utilities. Renders a self-consistent 15-Day FDA MedWatch / MoCRA filing packet containing Patient Anonymized Data Profiles, Chronological Formulation Stability Mapping, Toxicological Hazard Assessment, and Structured Clinical Follow-Up Templates.

### Visual Identity & Theme

- **Aesthetic Direction**: High-precision dark-mode regulatory workbench and developer console. Flat single-elevation surfaces with crisp `1px solid` hairline borders (`border-slate-800`), generous container breathing room, and zero nested card clutter.
- **Color Palette & Mood (60-30-10 Discipline)**:
  - **60% Dominant Canvas**: Deep obsidian slate (`#090D16` / `bg-slate-950`) and primary workspace surface (`#0F172A` / `bg-slate-900`).
  - **30% Structural Surfaces & Typography**: Muted slate panels (`#1E293B` / `bg-slate-800/60`), hairline borders (`#1E293B`), primary crisp alabaster text (`#F8FAFC`), and secondary slate prose (`#94A3B8`).
  - **10% Semantic & Action Accents**:
    - Nominal / `[PASS]` & Primary Brand Glow: Vivid Emerald (`#10B981` / `emerald-500`, `border-emerald-500/40`, `bg-emerald-950/40`, `text-emerald-400`).
    - Critical / `[VIOLATION]`: Pulsating Crimson/Rose (`#F43F5E` / `rose-500`, `border-rose-500/50`, `bg-rose-950/40`, `text-rose-400`).
    - Warning / Advisory: Amber (`#F59E0B` / `amber-400`).
- **Typography & Hierarchy (2+1 Font Rule)**:
  - **Display / Headings**: `Plus Jakarta Sans` (`600`/`700` weight, tight tracking `tracking-tight`, `text-wrap: balance` on headlines).
  - **Body & Regulatory Prose**: `Public Sans` (`400`/`500` weight, high scannability at `13px–15px`).
  - **Chemical Concentrations, CAS Numbers, Batch IDs & Dossier Editor**: `JetBrains Mono` with strict `font-variant-numeric: tabular-nums`.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Unified Dual-Mode Experience (Landing Page + Studio)**
  - *Chosen Approach*: Honor `process.env.NEXT_PUBLIC_SHOW_LANDING_PAGE` (defaulting to `"true"`) on the root view while also providing an instant view switcher and a dedicated `/studio` route that shares the same Compliance Studio component state.
  - *Why*: Satisfies both the open-source repository showcase requirement and direct deep-linking into `/studio` without duplicating workspace logic.
- **Decision 2: Deterministic Hackathon Presets + Real Gemini 4 Argon Server Route**
  - *Chosen Approach*: Clicking any of the 3 presets immediately hydrates the studio with rich, domain-accurate toxicological and legal data so live demos never stall, while clicking **"Run Live Argon Audit"** (or editing any ingredient, ppm value, artwork layer, or customer ticket) invokes `/api/compliance` using `@google/genai` (`gemini-4-argon`) with strict `responseSchema` enforcement.
  - *Why*: Combines 100% hackathon reliability with real multimodal and long-context Gemini 4 Argon reasoning.

---

## 4. Technical Architecture & Data Strategy

### Architecture & Component Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                         Top Navigation Bar (3-Zone)                          │
│  [OpenShield]        [Sandbox · Architecture · Presets · Docs]   [Launch]    │
└───────────────────┬──────────────────────────────────────┬───────────────────┘
                    │                                      │
       (Landing View Active)                  (Compliance Studio Active)
                    ▼                                      ▼
┌───────────────────────────────────────┐  ┌───────────────────────────────────┐
│      OSS Developer Landing View       │  │     Compliance Studio Workspace   │
│ ┌───────────────────────────────────┐ │  │ ┌───────────────────────────────┐ │
│ │ Hero + Interactive Mock Audit Box │ │  │ │ Source Controls Sidebar       │ │
│ └───────────────────────────────────┘ │  │ │ • 3 Hackathon Presets (1-Clk) │ │
│ ┌───────────────────────────────────┐ │  │ │ • INCI / PPM JSON Dropzone    │ │
│ │ Gemini 4 Argon Spec Bento Grid    │ │  │ │ • Artwork & Ticket Input      │ │
│ │ • 01. 1M Unified Context Window   │ │  │ └──────────────┬────────────────┘ │
│ │ • 02. Native Multimodal Vision    │ │  │                ▼                  │
│ │ • 03. Long Decode Horizon         │ │  │ ┌───────────────────────────────┐ │
│ └───────────────────────────────────┘ │  │ │ Shadcn Tabbed Performance UI  │ │
└───────────────────────────────────────┘  │ │ [Tab 1] Global Matrix Grid    │ │
                                           │ │ [Tab 2] Packaging Peel Linter │ │
                                           │ │ [Tab 3] MoCRA 15-Day Dossier  │ │
                                           │ └──────────────┬────────────────┘ │
                                           └────────────────┼──────────────────┘
                                                            │ POST /api/compliance
                                                            ▼
                                           ┌───────────────────────────────────┐
                                           │   Next.js Server API Route        │
                                           │   • @google/genai SDK             │
                                           │   • Model: gemini-4-argon         │
                                           │   • Strict JSON responseSchema    │
                                           │   • Regulatory System Ruleset     │
                                           └───────────────────────────────────┘
```

### Data Model & State

- **`ComplianceAuditPayload` (Request to `/api/compliance`)**:
  - `presetId?: "huda-matrix" | "ca-pfas-trap" | "mocra-adverse-event" | "custom"`
  - `productName: string`
  - `productCategory: "eye-area" | "leave-on-dermal" | "rinse-off"`
  - `formulationRaw: string` (INCI names, CAS numbers, and ppm/percentage concentrations)
  - `artworkMetadata: { frontClaim: string; backWarningText: string; fontSizePt: number; isBehindPeelOffLayer: boolean; contrastRatio: number; imageBase64?: string; mimeType?: string }`
  - `adverseEventLogs: string` (raw consumer/clinical tickets)
- **`ComplianceAuditResult` (Strict JSON Schema Response)**:
  - `summary`: Overall audit status, risk level, and jurisdiction tallies.
  - `matrixRows`: Array of evaluated ingredients with `ingredientName`, `casNumber`, `concentrationPpm`, `concentrationPercent`, and structured verdicts (`status: "PASS" | "VIOLATION"`, `citation: string`, `justification: string`) for each of the 3 jurisdictions (`usFda`, `california`, `eu`).
  - `artworkLinting`: Dieline box zones, peel-off layer trap status, typography prominence score, and an array of side-by-side `ComplianceAlertCard` items.
  - `mocraDossier`: Multi-section 15-day formal FDA submission document containing `filingHeader`, `patientProfiles`, `chronologicalStabilityMapping`, `toxicologicalHazardAssessment`, `clinicalInterviewTemplates`, and full compiled Markdown text.

### Interactive Component & State Mapping

- **Hero Sandbox Widget**: Typing a custom chemical string or clicking *"Run Instant Mock Audit"* transitions through a 600ms Argon token-scanning animation and renders the multi-jurisdictional verdict table directly inside the hero container, with a *"Open Full Audit in Studio"* button that transfers state into the Studio workspace.
- **Preset Selector & Custom Formulation Editor**: Selecting Preset 1, 2, or 3 updates the formulation input, artwork dieline configuration, and adverse event logs in unison, automatically highlighting the most relevant workspace tab or allowing free switching across all three tabs.
- **Interactive Peel-Off Layer Inspector (Tab 2)**: Clicking *"Peel Back Outer Label"* animates the top graphic sticker layer (`transform` & `opacity`), revealing the obscured `"WARNING: NOT INTENDED FOR USE IN THE IMMEDIATE EYE AREA"` text underneath and highlighting the corresponding 21 CFR 701.2 / 740.10 violation card.
- **Autonomous MoCRA Dossier Generator (Tab 3)**: Features a multi-stage decode progress bar when generating or switching to Preset 3 / custom adverse event logs, section filter tabs, copy-to-clipboard feedback, and real file downloads for `.md` and `.json` formats.
