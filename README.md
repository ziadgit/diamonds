# OpenCompact

**The Open Source Shield Against Regulatory Patchworks — Powered by Gemini 4 Argon (`gemini-4-argon`)**

> **Why "OpenCompact"?**
> 1. **Cosmetic Compact**: Simulates physical pressed-pigment compacts, glass serums, and airless vessels in an interactive Three.js 3D viewport with peel-off label layer inspection.
> 2. **Regulatory Compact**: Bridges conflicting international cosmetic pacts across **US FDA (MoCRA / 21 CFR)**, **California (Toxic-Free Cosmetics Act AB 2762 / AB 496)**, and the **European Union (EC Regulation No 1223/2009)**.
> 3. **Open-Source & Compact**: A fast, developer-first Next.js compliance engine designed to democratize regulatory toxicology for independent beauty founders.

---

## Core Capabilities & Gemini 4 Argon Architecture

OpenCompact leverages three core capabilities of **Gemini 4 Argon** (`models/gemini-4-argon`) via the official `@google/genai` SDK:

### 01. 1M Unified Context Window — Multi-Jurisdictional Matrix Auditing
Simultaneously indexes and cross-references parts-per-million (`ppm`) ingredient declarations against:
- **US FDA Modernization of Cosmetics Regulation Act (MoCRA) & 21 CFR Parts 73/74/700**: Eye-area color additive prohibitions (e.g., `D&C Red No. 28 / CI 45410`), facility registration, and mandatory allergen disclosures.
- **California Toxic-Free Cosmetics Act (AB 2762 & AB 496)**: Strict state-level bans on intentionally added PFAS (e.g., `PTFE / Polytetrafluoroethylene`, `Perfluorononyl Dimethicone`), cyclic silicones (`Cyclotetrasiloxane`), and heavy metal trace thresholds.
- **European Union Regulation (EC) No 1223/2009 (Annexes II–VI)**: Prohibited substances (Annex II), restricted concentrations (Annex III), and permitted cosmetic colorants across mucous-membrane and eye-area applications (Annex IV).

### 02. Native Multimodal Vision & Interactive 3D Brand Twin Simulator
- **3D Spatial Brand Twin (`Three.js` WebGL)**: Generates composite multi-part procedural 3D cosmetic vessels (*Pressed Pigment Compact Palette*, *Frosted Glass Toning Dropper Bottle*, or *Airless Primer Pump Tube*) paired directly with deep toxicological data.
- **Interactive 3D & 2D Peel-Off Layer Inspector**: Physically peel back outer adhesive graphic stickers in 3D space to expose buried safety warnings (`21 CFR 701.2` & `21 CFR 740.10` prominence & conspicuousness linting).
- **Multimodal Video & Product URL Ingestion**: Ingests `.mp4`/`.webm` packaging video keyframes or existing product URLs to either audit the existing product or synthesize a **Similar-But-Distinct Compliant Brand Twin** with auto-remediated clean ingredients.
- **Modern Beauty Founder Ethos Linting**: Inspired by **Alexis Eizinas (Founder of Silvering)** in *Authority Magazine's "Five Things You Need To Know To Succeed In The Modern Beauty Industry"*, OpenCompact audits packaging claims for uplifting, authentic consumer communication while flagging fear-based copy or accidental FDA structure/function drug claims on hair thinning and scalp care.

### 03. Long Decode Horizon — Autonomous 15-Day MoCRA Dossier Generator
Transforms unstructured consumer support tickets and emergency room clinical logs into a self-consistent, multi-page **15-Business-Day FDA MoCRA Serious Adverse Event Submission Packet** (Form FDA 3500A / MedWatch compatible), complete with:
1. **Patient Anonymized Data Profiles & Clinical Triage**
2. **Chronological Formulation & Batch Stability Mapping**
3. **Toxicological Hazard & Root-Cause Assessment**
4. **Structured Follow-Up Clinical Interview Templates**

---

## 1-Click Hackathon Demo Presets

| Preset | Product & Vessel Archetype | US FDA (MoCRA) | California (Toxic-Free) | EU (EC 1223/2009) | Key Regulatory Trigger |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **1. The Huda Matrix** | Neon Pressed Pigment Compact Palette | `[VIOLATION]` | `[PASS]` | `[PASS]` | `D&C Red No. 28 (CI 45410)` at `18,500 ppm` prohibited in eye area under 21 CFR 74.2328 + peel-off warning trap. |
| **2. The California PFAS Trap** | Velvet Blur Smoothing Primer Tube | `[PASS]` | `[VIOLATION]` | `[VIOLATION]` | `0.1% (1,000 ppm) PTFE` triggers strict California AB 496 intentional PFAS ban despite passing baseline federal check. |
| **3. MoCRA Adverse Event Influx** | Batch `#OC-2026-884B` Eye & Brow Gel | `[VIOLATION]` | `[VIOLATION]` | `[VIOLATION]` | Acute periorbital angioedema & ER visit requiring mandatory 15-day MoCRA Serious Adverse Event filing. |
| **4. Silvering Luxe Toning Serum** | Frosted Glass Dropper Bottle | `[PASS]` | `[PASS]` | `[PASS]` | Bespoke silver/gray hair & scalp formulation (`CI 60730` at `1,200 ppm`) with positive, non-drug cosmetic claims. |

---

## Quickstart & Environment Configuration

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables (.env.local)
GEMINI_API_KEY="your_gemini_api_key"
NEXT_PUBLIC_SHOW_LANDING_PAGE="true"

# 3. Start the development server on port 3000
npm run dev
```

### API Endpoint (`POST /api/compliance`)

```bash
curl -X POST http://localhost:3000/api/compliance \
  -H "Content-Type: application/json" \
  -d '{
    "presetId": "custom",
    "urlMode": "generate-distinct-brand",
    "sourceProductUrl": "https://sephora.com/product/neon-obsessions-pressed-pigment-palette",
    "brandPrompt": "Create a clean, eye-safe pressed compact palette with a brushed platinum case",
    "formulationRaw": "Talc (450000 ppm), CI 45410 / D&C Red No. 28 (18500 ppm), PTFE (1000 ppm)"
  }'
```

---

## License

MIT Open Source License — Built to give back to independent beauty founders, cosmetic chemists, and open-source regulatory engineers.
