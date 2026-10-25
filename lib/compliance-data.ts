export type JurisdictionStatus = 'PASS' | 'VIOLATION';

export interface JurisdictionVerdict {
  status: JurisdictionStatus;
  citation: string;
  maxThreshold: string;
  justification: string;
}

export interface MatrixIngredientRow {
  id: string;
  ingredientName: string;
  inciName: string;
  casNumber: string;
  roleInFormulation: string;
  concentrationPpm: number;
  concentrationPercent: string;
  usFda: JurisdictionVerdict;
  california: JurisdictionVerdict;
  eu: JurisdictionVerdict;
}

export interface ComplianceAlertItem {
  id: string;
  severity: 'CRITICAL' | 'WARNING' | 'NOMINAL';
  jurisdiction: string;
  regulationCitation: string;
  title: string;
  description: string;
  panelZone: 'FRONT_PANEL' | 'BACK_PEEL_OFF_LAYER' | 'INGREDIENT_DECLARATION' | 'BRAND_MISSION_CLAIM';
  remediationAction: string;
}

export interface ArtworkLintingReport {
  overallArtworkStatus: JurisdictionStatus;
  frontPanelHeader: string;
  frontPanelSubclaim: string;
  backPanelSurfaceText: string;
  buriedPeelOffWarningText: string;
  isBehindPeelOffLayer: boolean;
  warningFontSizePt: number;
  requiredMinFontSizePt: number;
  contrastRatio: number;
  requiredMinContrastRatio: number;
  silveringMissionAlignment: {
    status: JurisdictionStatus;
    toneScore: string;
    positiveMessagingAssessment: string;
    drugClaimCrossoverCheck: string;
  };
  alerts: ComplianceAlertItem[];
}

export interface BrandTwin3DSpec {
  vesselArchetype: 'pressed-palette' | 'dropper-serum' | 'airless-pump';
  brandName: string;
  productTitle: string;
  subtitle: string;
  batchCode: string;
  netWeightLabel: string;
  primaryColorHex: string;
  secondaryColorHex: string;
  accentColorHex: string;
  pigmentOrLiquidHex: string;
  palettePanColorsHex: string[];
  metallicFinish: 'platinum' | 'gold' | 'obsidian';
  glassTransmission: number;
  hasPeelOffStickerTrap: boolean;
  peelOffOuterGraphicTitle: string;
  peelOffBuriedWarningText: string;
  frontPanelClaims: string[];
  videoIngestionSummary?: string;
}

export interface UrlRemixMetadata {
  sourceUrl?: string;
  mode: 'none' | 'audit-url' | 'generate-distinct-brand';
  originalBrandSummary?: string;
  differentiationStrategy?: string;
  substitutedIngredients: Array<{
    replaced: string;
    replacement: string;
    reason: string;
  }>;
}

export interface MoCRADossierPacket {
  dossierId: string;
  submissionWindowStatus: string;
  fdaFormReference: string;
  responsiblePersonEntity: string;
  facilityFeiNumber: string;
  batchNumber: string;
  incidentSeverityClassification: string;
  patientAnonymizedProfiles: Array<{
    patientCode: string;
    ageGroupAndDemographics: string;
    exposureTimeline: string;
    clinicalPresentation: string;
    emergencyInterventionRequired: string;
    outcomeStatus: string;
  }>;
  chronologicalStabilityMapping: Array<{
    timestamp: string;
    phase: string;
    phAndViscosityReading: string;
    contaminantOrDegradationFinding: string;
    disposition: string;
  }>;
  toxicologicalHazardAssessment: {
    primaryCausativeAgent: string;
    mechanisticPathway: string;
    noaelComparison: string;
    dermalAndOcularMarginOfSafety: string;
    regulatoryTriggerCitation: string;
  };
  clinicalInterviewTemplates: Array<{
    sectionCode: string;
    clinicianPrompt: string;
    mandatoryDataFields: string[];
  }>;
  compiledMarkdownDocument: string;
}

export interface ComplianceAuditResult {
  presetId: string;
  auditTimestamp: string;
  modelEngine: string;
  productName: string;
  productCategory: string;
  overallStatus: JurisdictionStatus;
  summaryHeadline: string;
  brandTwin3D: BrandTwin3DSpec;
  urlRemixMetadata: UrlRemixMetadata;
  matrixRows: MatrixIngredientRow[];
  artworkLinting: ArtworkLintingReport;
  mocraDossier: MoCRADossierPacket;
}

export interface ComplianceAuditPayload {
  presetId?: string;
  urlMode?: 'none' | 'audit-url' | 'generate-distinct-brand';
  sourceProductUrl?: string;
  brandPrompt?: string;
  productName?: string;
  productCategory?: string;
  formulationRaw: string;
  artworkMetadata?: {
    frontClaim: string;
    backWarningText: string;
    fontSizePt: number;
    isBehindPeelOffLayer: boolean;
    contrastRatio: number;
    uploadedFileName?: string;
  };
  adverseEventLogs?: string;
  videoFramesBase64?: Array<{
    data: string;
    mimeType: string;
    timestampSec: number;
  }>;
}

export interface SampleUrlPreset {
  id: string;
  label: string;
  url: string;
  category: string;
  defaultPrompt: string;
  defaultFormulation: string;
}

export const SAMPLE_PRODUCT_URLS: SampleUrlPreset[] = [
  {
    id: 'url-huda-neon',
    label: 'Prestige Neon Pressed Pigment Palette URL',
    url: 'https://sephora.com/product/neon-obsessions-pressed-pigment-palette-P445729',
    category: 'eye-area',
    defaultPrompt:
      'High-saturation neon pink & magenta 9-pan pressed compact palette with mirror and multi-layer peel-off back sticker.',
    defaultFormulation:
      'Talc (420,000 ppm), Mica (180,000 ppm), D&C Red No. 28 / CI 45410 (18,500 ppm), D&C Red No. 7 Lake / CI 15850 (9,200 ppm), Ferric Ferrocyanide / CI 77510 (12,000 ppm), Dimethicone (35,000 ppm), Phenoxyethanol (8,000 ppm)',
  },
  {
    id: 'url-ca-primer',
    label: 'Velvet-Blur PTFE Smoothing Face Primer URL',
    url: 'https://ulta.com/p/velvet-blur-poreless-ptfe-primer-pimprod2041982',
    category: 'leave-on-dermal',
    defaultPrompt:
      'Clean-beauty soft-touch airless pump primer claiming 16-hour pore blurring with fluoropolymer slip agents.',
    defaultFormulation:
      'Aqua (510,000 ppm), Cyclopentasiloxane (145,000 ppm), Polytetrafluoroethylene / PTFE (1,000 ppm / 0.1%), Perfluorononyl Dimethicone (350 ppm), Glycerin (60,000 ppm), Isohexadecane (40,000 ppm)',
  },
  {
    id: 'url-silvering-serum',
    label: 'Silvering Beauty Translucent Hair & Scalp Toning Serum URL',
    url: 'https://silveringbeauty.com/products/silver-amplifying-scalp-toning-serum',
    category: 'scalp-hair-care',
    defaultPrompt:
      'Bespoke luxury frosted-glass dropper serum with brushed platinum collar designed to amplify natural silver, gray, and white hair without harsh purple dye build-up.',
    defaultFormulation:
      'Aqua (780,000 ppm), Niacinamide (20,000 ppm), Panthenol (15,000 ppm), Biotinoyl Tripeptide-1 (500 ppm), CI 60730 / Acid Violet 43 (1,200 ppm), Hydrolyzed Quinoa (12,000 ppm), Sodium Hyaluronate (5,000 ppm)',
  },
];

export const SILVERING_FIVE_PILLARS = [
  {
    number: '01',
    title: 'Build a Unique Niche Offering',
    subtitle: 'Formulate for underserved physiology, not generic mass defaults',
    description:
      'Inspired by Alexis Eizinas of Silvering: natural silver and white hair is translucent and behaves differently than pigmented hair. OpenCompact audits bespoke pigment ratios (such as calibrated Acid Violet 43 vs. prohibited coal-tar lakes) so niche formulations stay effective and globally legal.',
  },
  {
    number: '02',
    title: 'Speak to Customers Positively',
    subtitle: 'Eliminate fear-based shame copy and illegal drug claims',
    description:
      'Legacy beauty marketing relies on invented insecurities or risky medical promises. OpenCompact’s Packaging Linter flags both fear-driven anti-aging shaming and accidental FDA structure/function drug claims (e.g., "reverses follicle atrophy").',
  },
  {
    number: '03',
    title: 'Have a Mission and Filter Everything Through It',
    subtitle: 'Automated brand-mission alignment across every SKU and label layer',
    description:
      'Silvering filters every communication through making silver hair aspirational and chic. OpenCompact enforces your brand mission alongside 21 CFR 701.2 prominence laws so safety disclosures are never hidden behind peel-off stickers.',
  },
  {
    number: '04',
    title: 'Find Meaning & Purpose in Creation',
    subtitle: 'Replace regulatory anxiety with scientific clarity',
    description:
      'Building an independent beauty brand requires mastering chemistry, industrial design, and international law simultaneously. Instant 3D vessel simulation paired with toxicological matrices keeps founders focused on purposeful product creation.',
  },
  {
    number: '05',
    title: 'Give Back to the Community',
    subtitle: 'Open-source regulatory infrastructure for indie beauty innovators',
    description:
      'Enterprise toxicology audits cost tens of thousands of dollars per SKU. OpenCompact is 100% open-source so indie founders, community chemists, and emerging brands can launch globally compliant products from day one.',
  },
];

export const PRESET_INPUTS: Record<
  string,
  {
    name: string;
    badgeLabel: string;
    shortDescription: string;
    productName: string;
    productCategory: string;
    brandPrompt: string;
    formulationRaw: string;
    artworkMetadata: {
      frontClaim: string;
      backWarningText: string;
      fontSizePt: number;
      isBehindPeelOffLayer: boolean;
      contrastRatio: number;
      uploadedFileName: string;
    };
    adverseEventLogs: string;
  }
> = {
  'huda-matrix': {
    name: 'Preset 1: "The Huda Matrix"',
    badgeLabel: 'EU PASS / US FDA EYE VIOLATION',
    shortDescription:
      'Neon-pigment pressed compact palette. Passes EU Annex IV, but triggers categorical US FDA [VIOLATION] due to D&C Red 28 eye-area prohibition and a peel-off warning trap.',
    productName: 'Electric Obsessions Neon Pressed Pigment Compact',
    productCategory: 'eye-area',
    brandPrompt:
      'High-impact neon magenta and ultraviolet 9-pan pressed compact palette in an obsidian & hot-pink case with interior mirror and multi-layer peel-off back compliance sticker.',
    formulationRaw: JSON.stringify(
      {
        sku: 'OC-NEON-01',
        intendedUse: 'Periorbital Eye Lid & Artistry Pressed Compact Palette',
        ingredients: [
          {
            inci: 'Talc',
            cas: '14807-96-6',
            ppm: 440000,
            function: 'Bulking & Slip Base (Asbestos-Free Certified)',
          },
          {
            inci: 'CI 45410 (D&C Red No. 28 Aluminum Lake)',
            cas: '18472-87-2',
            ppm: 18500,
            function: 'High-Fluorescence Neon Magenta Colorant',
          },
          {
            inci: 'CI 15850 (D&C Red No. 7 Calcium Lake)',
            cas: '5281-04-9',
            ppm: 9400,
            function: 'Crimson Pressed Pigment Colorant',
          },
          {
            inci: 'CI 77510 (Ferric Ferrocyanide)',
            cas: '14038-43-8',
            ppm: 14000,
            function: 'Deep Cobalt & Violet Undertone Pigment',
          },
          {
            inci: 'Synthetic Fluorphlogopite',
            cas: '12003-38-2',
            ppm: 210000,
            function: 'Optical Shimmer Substrate',
          },
        ],
      },
      null,
      2
    ),
    artworkMetadata: {
      frontClaim: 'ELECTRIC OBSESSIONS — ULTRA-NEON EYE & ARTISTRY COMPACT PALETTE',
      backWarningText:
        'WARNING: CONTAINS COLOR ADDITIVES NOT APPROVED BY THE US FDA FOR USE IN THE IMMEDIATE EYE AREA.',
      fontSizePt: 3.5,
      isBehindPeelOffLayer: true,
      contrastRatio: 1.8,
      uploadedFileName: 'electric_neon_compact_dieline_v4.pdf',
    },
    adverseEventLogs:
      '[TICKET #9910 - NORMAL] Consumer noted neon pink staining on upper eyelid lasting 24 hours after removal; mild transient dryness resolved without medical intervention.',
  },
  'ca-pfas-trap': {
    name: 'Preset 2: "The California PFAS Trap"',
    badgeLabel: 'FEDERAL PASS / CA AB 2762 VIOLATION',
    shortDescription:
      'Clean-beauty smoothing primer containing 0.1% PTFE. Passes baseline federal rules while triggering a strict California Toxic-Free Cosmetics Act [VIOLATION].',
    productName: 'PureSilk Poreless Blur Primer (0.1% PTFE)',
    productCategory: 'leave-on-dermal',
    brandPrompt:
      'Minimalist botanical-slate airless pump tube primer with brushed gold collar and satin finish, marketed as a clean pore-blurring complexion base.',
    formulationRaw: JSON.stringify(
      {
        sku: 'OC-PFAS-02',
        intendedUse: 'Leave-On Facial Smoothing Primer',
        ingredients: [
          {
            inci: 'Polytetrafluoroethylene (PTFE)',
            cas: '9002-84-0',
            ppm: 1000,
            concentrationPercent: '0.10%',
            function: 'Fluoropolymer Friction-Reducing Slip & Pore Blur Agent',
          },
          {
            inci: 'Perfluorononyl Dimethicone',
            cas: '259725-95-6',
            ppm: 250,
            concentrationPercent: '0.025%',
            function: 'Hydrophobic Film Former (PFAS Class)',
          },
          {
            inci: 'Cyclopentasiloxane (D5)',
            cas: '541-02-6',
            ppm: 45000,
            concentrationPercent: '4.50%',
            function: 'Volatile Emollient Carrier',
          },
          {
            inci: 'Niacinamide',
            cas: '98-92-0',
            ppm: 30000,
            concentrationPercent: '3.00%',
            function: 'Skin Barrier Conditioning Agent',
          },
        ],
      },
      null,
      2
    ),
    artworkMetadata: {
      frontClaim: 'PURESILK CLEAN BEAUTY — 100% NON-TOXIC PORELESS BLURRING PRIMER',
      backWarningText:
        'Formulated for daily facial application. Contains micro-smoothing polymers for 16-hour wear.',
      fontSizePt: 6.5,
      isBehindPeelOffLayer: false,
      contrastRatio: 4.8,
      uploadedFileName: 'puresilk_primer_tube_artwork.png',
    },
    adverseEventLogs:
      '[RETAIL AUDIT LOG #CA-402] California Attorney General & Clean Beauty Retailers flagged intentional fluoropolymer (PTFE 1,000 ppm) presence conflicting with AB 2762 / AB 496 and "100% Non-Toxic" front-panel claim.',
  },
  'mocra-adverse-event': {
    name: 'Preset 3: "MoCRA Adverse Event Influx"',
    badgeLabel: '15-DAY MANDATORY FDA MEDWATCH FILING',
    shortDescription:
      'Unstructured customer support & clinical logs including a severe allergic reaction requiring emergency room care, triggering autonomous 15-day MoCRA dossier synthesis.',
    productName: 'LumiLift Brow & Lash Lamination Sculpting Serum',
    productCategory: 'eye-area',
    brandPrompt:
      'Precision metallic obsidian & crimson dropper bottle for high-hold brow and lash lamination with batch embossing #OC-2026-884B.',
    formulationRaw: JSON.stringify(
      {
        sku: 'OC-AE-884B',
        batchNumber: 'OC-2026-884B',
        intendedUse: 'Periorbital Brow & Lash Lamination Leave-On Serum',
        ingredients: [
          {
            inci: 'Thioglycolic Acid (Unbuffered Ester Spike)',
            cas: '68-11-1',
            ppm: 48000,
            concentrationPercent: '4.80%',
            function: 'Disulfide Bond Reducing Agent (Elevated Batch Excursion)',
          },
          {
            inci: 'Methylisothiazolinone (MIT)',
            cas: '2682-20-4',
            ppm: 180,
            concentrationPercent: '0.018%',
            function: 'Isothiazolinone Preservative Sensitizer',
          },
          {
            inci: 'p-Phenylenediamine (PPD Trace Cross-Contamination)',
            cas: '106-50-3',
            ppm: 420,
            concentrationPercent: '0.042%',
            function: 'Oxidative Dye Contaminant from Shared Filling Line',
          },
          {
            inci: 'Hydrolyzed Keratin',
            cas: '69430-36-0',
            ppm: 25000,
            concentrationPercent: '2.50%',
            function: 'Hair Conditioning Protein',
          },
        ],
      },
      null,
      2
    ),
    artworkMetadata: {
      frontClaim: 'LUMILIFT CLINICAL — PERMANENT FOLLICLE RECONSTRUCTION & BROW LAMINATION',
      backWarningText:
        'For external brow use. Patch test recommended 24 hours prior to application.',
      fontSizePt: 4.5,
      isBehindPeelOffLayer: true,
      contrastRatio: 2.4,
      uploadedFileName: 'lumilift_batch_884B_label_scan.jpg',
    },
    adverseEventLogs: `[URGENT SUPPORT LOG #AE-2026-1091 | TIMESTAMP: 2026-10-23T21:14:00Z]
Customer ID: ANON-F42-NY (42yo Female, New York, NY)
Channel: Emergency Physician Hotline + Consumer Photo Upload
Transcript: "My wife applied the LumiLift Serum (Batch #OC-2026-884B) at 6:30 PM. Within 3 hours she developed severe bilateral periorbital angioedema, blistering erythema across the supraorbital ridge, and acute chemical conjunctivitis with corneal epithelial sloughing. We rushed her to Mount Sinai Emergency Department at 10:15 PM. ER administered IV Methylprednisolone (125mg), Diphenhydramine, and Morgan Lens ocular irrigation. Ophthalmology consult required for 72-hour monitoring."

[SUPPORT LOG #AE-2026-1094 | TIMESTAMP: 2026-10-24T09:40:00Z]
Customer ID: ANON-F56-CA (56yo Female, San Diego, CA)
Transcript: "Used Batch #OC-2026-884B on graying eyebrows. Experienced intense burning, weeping vesicular contact dermatitis, and localized brow hair shedding within 12 hours. Urgent care prescribed topical triamcinolone and oral prednisone taper."

[QC LAB TELEMETRY #QC-884B | TIMESTAMP: 2026-10-24T14:00:00Z]
Retain sample analysis of Batch #OC-2026-884B shows pH drift to 11.4 (spec: 8.2–8.8), unbuffered Thioglycolic Acid spike at 48,000 ppm, Methylisothiazolinone at 180 ppm, and 420 ppm trace p-Phenylenediamine (PPD) from shared line manifold.`,
  },
  'silvering-toner': {
    name: 'Preset 4: "Silvering Luxe Toning Serum"',
    badgeLabel: 'GLOBAL PASS / FOUNDER ETHOS BENCHMARK',
    shortDescription:
      'Inspired by Alexis Eizinas of Silvering: bespoke translucent silver/gray hair & maturing scalp serum with calibrated Acid Violet 43 and positive, mission-aligned cosmetic claims.',
    productName: 'Silvering Luminescence Scalp & Silver Hair Toning Elixir',
    productCategory: 'scalp-hair-care',
    brandPrompt:
      'Luxury frosted optical-glass dropper bottle with anisotropic brushed platinum collar and silver-violet elixir inside, celebrating naturally silvering, gray, and white hair as aspirational and chic.',
    formulationRaw: JSON.stringify(
      {
        sku: 'SLV-TONE-01',
        intendedUse: 'Leave-On Translucent Silver, Gray & White Hair + Scalp Toning Elixir',
        ingredients: [
          {
            inci: 'CI 60730 (Acid Violet 43 / Ext. D&C Violet No. 2)',
            cas: '4430-18-6',
            ppm: 1200,
            concentrationPercent: '0.12%',
            function: 'Calibrated Non-Staining Optical Neutralizer for Translucent Hair',
          },
          {
            inci: 'Biotinoyl Tripeptide-1',
            cas: '299157-54-3',
            ppm: 500,
            concentrationPercent: '0.05%',
            function: 'Scalp & Hair Strand Conditioning Peptide',
          },
          {
            inci: 'Niacinamide',
            cas: '98-92-0',
            ppm: 20000,
            concentrationPercent: '2.00%',
            function: 'Maturing Scalp Barrier Support',
          },
          {
            inci: 'Panthenol (Pro-Vitamin B5)',
            cas: '81-13-0',
            ppm: 15000,
            concentrationPercent: '1.50%',
            function: 'Weightless Translucent Strand Hydration',
          },
        ],
      },
      null,
      2
    ),
    artworkMetadata: {
      frontClaim:
        'SILVERING — AMPLIFY NATURALLY SILVER, GRAY & WHITE HAIR WITH CHIC LUMINESCENCE',
      backWarningText:
        'FOR EXTERNAL SCALP AND HAIR USE ONLY. AVOID DIRECT CONTACT WITH EYES. KEEP OUT OF REACH OF CHILDREN.',
      fontSizePt: 7.5,
      isBehindPeelOffLayer: false,
      contrastRatio: 7.4,
      uploadedFileName: 'silvering_luxe_dropper_dieline.pdf',
    },
    adverseEventLogs:
      '[POST-MARKET SURVEILLANCE #SLV-2026-Q3] 14,200 units distributed across North America & EU. Zero Serious Adverse Events (0 SAEs). 99.4% scalp tolerance score on maturing and silvering hair cohorts.',
  },
};

export const DETERMINISTIC_PRESET_RESULTS: Record<string, ComplianceAuditResult> = {
  'huda-matrix': {
    presetId: 'huda-matrix',
    auditTimestamp: '2026-10-25T10:54:00Z',
    modelEngine: 'models/gemini-4-argon (1M Context + Multimodal Spatial Engine)',
    productName: 'Electric Obsessions Neon Pressed Pigment Compact',
    productCategory: 'Eye-Area & Facial Artistry Pressed Compact',
    overallStatus: 'VIOLATION',
    summaryHeadline:
      'Jurisdictional Conflict Detected: Passed EU Annex IV (1223/2009), but triggered categorical US FDA 21 CFR 74.2328 Eye-Area Prohibition for D&C Red No. 28 (18,500 ppm) + 21 CFR 701.2 Peel-Off Label Prominence Failure.',
    brandTwin3D: {
      vesselArchetype: 'pressed-palette',
      brandName: 'HUDA MATRIX LABS',
      productTitle: 'ELECTRIC OBSESSIONS',
      subtitle: '9-Pan Neon Pressed Pigment Compact',
      batchCode: 'BATCH #HM-2026-99X',
      netWeightLabel: '9 x 1.3g / 0.39 oz.',
      primaryColorHex: '#0F172A',
      secondaryColorHex: '#1E293B',
      accentColorHex: '#F43F5E',
      pigmentOrLiquidHex: '#FF1493',
      palettePanColorsHex: [
        '#FF1493',
        '#FF007F',
        '#D946EF',
        '#A855F7',
        '#F43F5E',
        '#FB7185',
        '#EC4899',
        '#7C3AED',
        '#E11D48',
      ],
      metallicFinish: 'obsidian',
      glassTransmission: 0.15,
      hasPeelOffStickerTrap: true,
      peelOffOuterGraphicTitle: 'PEEL HERE FOR MULTILINGUAL INGREDIENTS & ARTISTRY GUIDE',
      peelOffBuriedWarningText:
        'WARNING: NOT INTENDED FOR USE IN THE IMMEDIATE EYE AREA (CONTAINS D&C RED NO. 28 & D&C RED NO. 7)',
      frontPanelClaims: [
        'ULTRA-NEON EYE & CHEEK ARTISTRY PALETTE',
        'HIGH-VOLTAGE PRESSED PIGMENT COMPACT',
      ],
    },
    urlRemixMetadata: {
      mode: 'none',
      substitutedIngredients: [],
    },
    matrixRows: [
      {
        id: 'row-red28',
        ingredientName: 'D&C Red No. 28 Aluminum Lake',
        inciName: 'CI 45410',
        casNumber: '18472-87-2',
        roleInFormulation: 'Neon Magenta Xanthene Color Additive',
        concentrationPpm: 18500,
        concentrationPercent: '1.850%',
        usFda: {
          status: 'VIOLATION',
          citation: '21 CFR § 74.2328 & MoCRA § 605',
          maxThreshold: '0 ppm (Eye Area Prohibited)',
          justification:
            'D&C Red No. 28 is strictly prohibited in any cosmetic product intended for use in the area of the eye under 21 CFR 74.2328(b). Calling the compact a "Pressed Pigment" does not exempt it when eye imagery or pan geometry implies ocular use.',
        },
        california: {
          status: 'PASS',
          citation: 'CA Health & Safety Code § 108980',
          maxThreshold: 'Permitted non-PFAS colorant',
          justification:
            'Not listed on the California Toxic-Free Cosmetics Act (AB 2762 / AB 496) prohibited chemical annex, though federal FDA eye-area restrictions remain enforceable.',
        },
        eu: {
          status: 'PASS',
          citation: 'EU Reg (EC) No 1223/2009 Annex IV, Entry 77',
          maxThreshold: 'No specific eye-area exclusion (Purity E127)',
          justification:
            'CI 45410 (Phloxine B) is authorized in EU Annex IV across all cosmetic product categories, including eye products, provided halogen/heavy-metal purity criteria are met.',
        },
      },
      {
        id: 'row-red7',
        ingredientName: 'D&C Red No. 7 Calcium Lake',
        inciName: 'CI 15850',
        casNumber: '5281-04-9',
        roleInFormulation: 'Crimson Monoazo Pigment Lake',
        concentrationPpm: 9400,
        concentrationPercent: '0.940%',
        usFda: {
          status: 'VIOLATION',
          citation: '21 CFR § 74.2307(b)',
          maxThreshold: '0 ppm (Eye Area Prohibited)',
          justification:
            'D&C Red No. 7 is approved for general cosmetics and lipsticks but explicitly excluded from eye-area formulations under US FDA batch certification statutes.',
        },
        california: {
          status: 'PASS',
          citation: 'CA Safe Cosmetics Program (CSCP)',
          maxThreshold: 'Reportable only if impurity > threshold',
          justification:
            'Permitted under California state statute when free of prohibited aromatic amine impurities.',
        },
        eu: {
          status: 'PASS',
          citation: 'EU Reg (EC) No 1223/2009 Annex IV, Entry 25',
          maxThreshold: 'Permitted across all cosmetic zones',
          justification:
            'CI 15850 is an approved Annex IV colorant permitted in eye-area cosmetics across the European Economic Area.',
        },
      },
      {
        id: 'row-ferric',
        ingredientName: 'Ferric Ferrocyanide',
        inciName: 'CI 77510',
        casNumber: '14038-43-8',
        roleInFormulation: 'Prussian Blue / Violet Undertone Colorant',
        concentrationPpm: 14000,
        concentrationPercent: '1.400%',
        usFda: {
          status: 'PASS',
          citation: '21 CFR § 73.2299',
          maxThreshold: 'GMP (External & Eye Area Approved)',
          justification:
            'Exempt from batch certification and explicitly authorized by the US FDA for external cosmetic use including the area of the eye.',
        },
        california: {
          status: 'PASS',
          citation: 'CA Health & Safety Code § 108980',
          maxThreshold: 'GMP Compliant',
          justification:
            'Compliant inorganic pigment with zero intentional PFAS or prohibited heavy metal spikes.',
        },
        eu: {
          status: 'PASS',
          citation: 'EU Reg (EC) No 1223/2009 Annex IV, Entry 138',
          maxThreshold: 'Water-soluble cyanide < 10 ppm',
          justification:
            'Authorized across all cosmetic categories under EU Annex IV when water-soluble cyanide impurity remains below 10 ppm.',
        },
      },
      {
        id: 'row-talc',
        ingredientName: 'Cosmetic Grade Talc (Asbestos-Free)',
        inciName: 'Talc',
        casNumber: '14807-96-6',
        roleInFormulation: 'Pressed Powder Matrix Base',
        concentrationPpm: 440000,
        concentrationPercent: '44.000%',
        usFda: {
          status: 'PASS',
          citation: 'MoCRA § 3505 Standardized Asbestos Testing',
          maxThreshold: '0.0% Detectable Amphibole/Chrysotile Asbestos',
          justification:
            'Passes current FDA requirements only when accompanied by batch-level PLM + TEM asbestos-free analytical certificates required under MoCRA.',
        },
        california: {
          status: 'PASS',
          citation: 'CA Prop 65 & AB 2762',
          maxThreshold: 'Zero detectable asbestos fibers',
          justification:
            'Permitted when certified free of fibrous talc and asbestos contamination.',
        },
        eu: {
          status: 'PASS',
          citation: 'EU Reg (EC) No 1223/2009 Annex III, Entry 59',
          maxThreshold: 'Powdery warning required only for children < 3 yrs',
          justification:
            'Hydrated magnesium silicate is permitted in adult pressed eye compacts under EU Annex III.',
        },
      },
    ],
    artworkLinting: {
      overallArtworkStatus: 'VIOLATION',
      frontPanelHeader: 'ELECTRIC OBSESSIONS — ULTRA-NEON EYE & ARTISTRY COMPACT PALETTE',
      frontPanelSubclaim: '9 High-Voltage Pressed Pigments for Bold Lid & Crease Looks',
      backPanelSurfaceText:
        'DIST. BY HUDA MATRIX LABS · MADE IN ITALY · PEEL CORNER STICKER FOR WARNINGS & INCI',
      buriedPeelOffWarningText:
        'WARNING: CONTAINS COLOR ADDITIVES NOT APPROVED BY THE US FDA FOR USE IN THE IMMEDIATE EYE AREA.',
      isBehindPeelOffLayer: true,
      warningFontSizePt: 3.5,
      requiredMinFontSizePt: 6.0,
      contrastRatio: 1.8,
      requiredMinContrastRatio: 4.5,
      silveringMissionAlignment: {
        status: 'VIOLATION',
        toneScore: '42 / 100 (Deceptive Layering)',
        positiveMessagingAssessment:
          'Violates transparent customer communication (Pillar 2 & Pillar 3): front panel actively markets "Eye & Lid Looks" while burying the ocular hazard warning underneath an adhesive peel-off sticker.',
        drugClaimCrossoverCheck: 'No pharmaceutical structure/function claims detected.',
      },
      alerts: [
        {
          id: 'alert-peel-trap',
          severity: 'CRITICAL',
          jurisdiction: 'US FDA (21 CFR § 701.2 & § 740.10)',
          regulationCitation: '21 CFR § 701.2 (Prominence & Conspicuousness)',
          title: 'Buried Peel-Off Safety Warning Trap Detected',
          description:
            "CRITICAL: The back-panel safety warning 'not intended for eye area' is buried behind a peel-off graphic layer. This violates the US FDA's explicit prominence and conspicuous text layout laws.",
          panelZone: 'BACK_PEEL_OFF_LAYER',
          remediationAction:
            'Promote the eye-area exclusion warning to the primary outer back panel in ≥ 6.0 pt bold type with ≥ 4.5:1 luminance contrast, or reformulate CI 45410 & CI 15850 out of the eye palette.',
        },
        {
          id: 'alert-font-contrast',
          severity: 'CRITICAL',
          jurisdiction: 'US FDA / FTC Fair Packaging & Labeling Act',
          regulationCitation: '21 CFR § 701.3(b) & 16 CFR Part 500',
          title: 'Sub-Threshold Typography (3.5 pt) & Low Contrast (1.8:1)',
          description:
            'The warning text inside the peel-off accordion is set at 3.5 pt magenta-on-charcoal (1.8:1 contrast), failing the statutory 1/16-inch (~6.0 pt) minimum height requirement.',
          panelZone: 'BACK_PEEL_OFF_LAYER',
          remediationAction:
            'Increase warning typography to 6.5 pt minimum and switch to crisp #F8FAFC text on #0F172A background (15.2:1 contrast).',
        },
        {
          id: 'alert-contradictory-claim',
          severity: 'WARNING',
          jurisdiction: 'US FDA / Import Alert 53-06',
          regulationCitation: 'FD&C Act § 601(e) & § 602(a) Misbranding',
          title: 'Contradictory "Eye & Lid" Front Claim vs. Back Exclusion',
          description:
            'FDA enforcement precedent establishes that disclaimers ("not for eye area") cannot cure an adulterated color additive when front packaging and pan layout promote eyelid application.',
          panelZone: 'FRONT_PANEL',
          remediationAction:
            'Substitute D&C Red No. 28 with FDA eye-approved Carmine (CI 75470) or Manganese Violet (CI 77742) + Synthetic Fluorphlogopite.',
        },
      ],
    },
    mocraDossier: {
      dossierId: 'MOCRA-2026-HM01',
      submissionWindowStatus: 'ADVISORY PRE-FILING READY (NON-SAE STAINING LOGGED)',
      fdaFormReference: 'FDA Form 3500A (MedWatch Cosmetic Annex — Section 605)',
      responsiblePersonEntity: 'Huda Matrix Labs Regulatory Affairs, Inc.',
      facilityFeiNumber: 'FEI #3019482710',
      batchNumber: 'HM-2026-99X',
      incidentSeverityClassification:
        'Tier 2 Non-Serious Dermal Staining / Misbranded Ocular Exposure Risk',
      patientAnonymizedProfiles: [
        {
          patientCode: 'PT-HM-001 (29F, Austin, TX)',
          ageGroupAndDemographics: '29-year-old female, Fitzpatrick Skin Type II',
          exposureTimeline: 'Single 8-hour eyelid application of Shade #01 (CI 45410 1.85%)',
          clinicalPresentation:
            'Persistent rhodamine/xanthene dermal staining of upper palpebral sulcus with mild periorbital xerosis.',
          emergencyInterventionRequired: 'None (Self-limited within 36 hours)',
          outcomeStatus: 'Resolved without sequelae; batch flagged for FDA Import Alert 53-06.',
        },
      ],
      chronologicalStabilityMapping: [
        {
          timestamp: 'T+0 Days (Release)',
          phase: 'Bulk Pressed Powder Compaction (45 PSI)',
          phAndViscosityReading: 'Dry Compact / Moisture Activity Aw = 0.28',
          contaminantOrDegradationFinding: 'CI 45410 dye bleeding elevated in sebum-simulant Franz cell.',
          disposition: 'Flagged for US Customs hold if marketed as eye shadow.',
        },
      ],
      toxicologicalHazardAssessment: {
        primaryCausativeAgent: 'CI 45410 (D&C Red No. 28 Aluminum Lake) at 18,500 ppm',
        mechanisticPathway:
          'Tetrabromotetrachlorofluorescein lake dissociation on thin palpebral epidermis (0.5mm thickness) causing protein-bound chromophore retention and mild mast-cell irritation.',
        noaelComparison: 'Systemic NOAEL > 250 mg/kg/day; restriction is statutory ocular exclusion.',
        dermalAndOcularMarginOfSafety:
          'EU MoS = 410 (Acceptable); US FDA Ocular Statutory Margin = 0 (Prohibited).',
        regulatoryTriggerCitation: '21 CFR § 74.2328(b) & FD&C Act § 601(e)',
      },
      clinicalInterviewTemplates: [
        {
          sectionCode: 'SEC-A: Ocular Exposure Verification',
          clinicianPrompt:
            'Confirm exact anatomical application site (upper eyelid, waterline, inner canthus, or cheek) and whether the consumer noticed the peel-off back label prior to use.',
          mandatoryDataFields: [
            'Anatomical Zone Applied',
            'Duration of Wear (Hours)',
            'Makeup Remover Solvent Used',
            'Visual Acuity or Conjunctival Injection Status',
          ],
        },
      ],
      compiledMarkdownDocument: `# FORMAL REGULATORY COMPLIANCE & MOCRA DOSSIER
## DOCUMENT ID: MOCRA-2026-HM01 | ENGINE: GEMINI 4 ARGON
- **Product**: Electric Obsessions Neon Pressed Pigment Compact (\`SKU: OC-NEON-01\`)
- **Batch ID**: \`HM-2026-99X\` | **FDA FEI**: \`3019482710\`
- **Primary Statutory Conflict**: EU Annex IV \`[PASS]\` vs. US FDA 21 CFR § 74.2328 \`[VIOLATION]\`

### 1. EXECUTIVE TOXICOLOGICAL & LEGAL SUMMARY
The evaluated pressed compact formulation contains **D&C Red No. 28 Aluminum Lake (CI 45410)** at **18,500 ppm (1.85%)** and **D&C Red No. 7 Calcium Lake (CI 15850)** at **9,400 ppm (0.94%)**. While both colorants are permitted for eye-area use in the European Union under Regulation (EC) No 1223/2009 Annex IV, they are **categorically prohibited in the area of the eye** in the United States under 21 CFR § 74.2328 and § 74.2307.

Furthermore, multimodal packaging inspection detected that the exclusion warning (*"NOT INTENDED FOR USE IN THE IMMEDIATE EYE AREA"*) is printed in **3.5 pt type** underneath a **peel-off adhesive sticker layer**, violating **21 CFR § 701.2** (Prominence and Conspicuousness).`,
    },
  },

  'ca-pfas-trap': {
    presetId: 'ca-pfas-trap',
    auditTimestamp: '2026-10-25T10:54:00Z',
    modelEngine: 'models/gemini-4-argon (1M Context + Multimodal Spatial Engine)',
    productName: 'PureSilk Poreless Blur Primer (0.1% PTFE)',
    productCategory: 'Leave-On Facial Smoothing Primer',
    overallStatus: 'VIOLATION',
    summaryHeadline:
      'State vs. Federal Divergence: Passes baseline US Federal FDA rules, but triggers a strict California Toxic-Free Cosmetics Act (AB 2762 / AB 496) [VIOLATION] for 0.1% (1,000 ppm) PTFE and Perfluorononyl Dimethicone.',
    brandTwin3D: {
      vesselArchetype: 'airless-pump',
      brandName: 'PURESILK BOTANICALS',
      productTitle: 'PORELESS BLUR PRIMER',
      subtitle: '16-Hour Velvet Complexion Base',
      batchCode: 'BATCH #PS-2026-104CA',
      netWeightLabel: '30 mL / 1.01 fl. oz.',
      primaryColorHex: '#132A24',
      secondaryColorHex: '#1E293B',
      accentColorHex: '#F59E0B',
      pigmentOrLiquidHex: '#E2E8F0',
      palettePanColorsHex: ['#E2E8F0'],
      metallicFinish: 'gold',
      glassTransmission: 0.25,
      hasPeelOffStickerTrap: false,
      peelOffOuterGraphicTitle: 'STANDARD SINGLE-LAYER BACK INCI PANEL',
      peelOffBuriedWarningText:
        'CONTAINS POLYTETRAFLUOROETHYLENE (PTFE 1,000 PPM) & PERFLUORONONYL DIMETHICONE (250 PPM)',
      frontPanelClaims: [
        '100% NON-TOXIC CLEAN BEAUTY PRIMER',
        'WEIGHTLESS FLUOROPOLYMER PORE BLURRING',
      ],
    },
    urlRemixMetadata: {
      mode: 'none',
      substitutedIngredients: [],
    },
    matrixRows: [
      {
        id: 'row-ptfe',
        ingredientName: 'Polytetrafluoroethylene (PTFE)',
        inciName: 'PTFE',
        casNumber: '9002-84-0',
        roleInFormulation: 'Fluoropolymer Slip & Optical Pore-Blurring Micro-Powder',
        concentrationPpm: 1000,
        concentrationPercent: '0.100%',
        usFda: {
          status: 'PASS',
          citation: 'MoCRA § 3506 PFAS Study Mandate (No Federal Ban Yet)',
          maxThreshold: 'Permitted pending FDA PFAS rulemaking',
          justification:
            'Under current federal US FDA regulations, PTFE is not yet banned at the federal level (MoCRA mandated an FDA safety assessment report on PFAS in cosmetics, but no federal prohibition is active).',
        },
        california: {
          status: 'VIOLATION',
          citation: 'CA Health & Safety Code § 108980 (AB 2762 & AB 496)',
          maxThreshold: '0 ppm Intentionally Added PFAS',
          justification:
            'STRICT VIOLATION: California AB 2762 and AB 496 prohibit the manufacture, sale, or delivery of any cosmetic product in California containing intentionally added perfluoroalkyl and polyfluoroalkyl substances (PFAS), explicitly including PTFE at 0.1% (1,000 ppm).',
        },
        eu: {
          status: 'PASS',
          citation: 'EU Reg (EC) No 1223/2009 & ECHA Universal PFAS Restriction Proposal',
          maxThreshold: 'Permitted (PFOA/PFHxS impurities < 25 ppb)',
          justification:
            'Currently permitted in EU Annexes provided PFOA-related trace impurities remain below 0.025 mg/kg (25 ppb) under EU POPs Regulation, though subject to upcoming ECHA fluoropolymer phase-outs.',
        },
      },
      {
        id: 'row-pfas-dimethicone',
        ingredientName: 'Perfluorononyl Dimethicone',
        inciName: 'Perfluorononyl Dimethicone',
        casNumber: '259725-95-6',
        roleInFormulation: 'Fluorinated Silicone Film Former',
        concentrationPpm: 250,
        concentrationPercent: '0.025%',
        usFda: {
          status: 'PASS',
          citation: '21 CFR Part 700 (No Federal Exclusion)',
          maxThreshold: 'No federal numeric cap',
          justification:
            'Not federally prohibited by the US FDA, though tracked under MoCRA facility product listing disclosures.',
        },
        california: {
          status: 'VIOLATION',
          citation: 'CA Toxic-Free Cosmetics Act (AB 2762)',
          maxThreshold: '0 ppm (Explicitly Enumerated Banned Chemical)',
          justification:
            'Perfluorononyl Dimethicone is explicitly enumerated on California’s statutory banned cosmetic chemicals list effective January 1, 2025.',
        },
        eu: {
          status: 'VIOLATION',
          citation: 'EU REACH Annex XVII (C9-C14 PFCA Restriction)',
          maxThreshold: '< 25 ppb C9-C14 PFCA precursors',
          justification:
            'Restricted under EU REACH Annex XVII Entry 68 due to degradation into perfluorononan-1-oic acid (PFNA) and C9-C14 PFCA substances.',
        },
      },
      {
        id: 'row-d5',
        ingredientName: 'Cyclopentasiloxane (D5)',
        inciName: 'Cyclopentasiloxane',
        casNumber: '541-02-6',
        roleInFormulation: 'Silky Volatile Emollient Carrier',
        concentrationPpm: 45000,
        concentrationPercent: '4.500%',
        usFda: {
          status: 'PASS',
          citation: 'CIR Safety Assessment / 21 CFR',
          maxThreshold: 'Safe as used in leave-on cosmetics',
          justification:
            'Permitted in US federal leave-on dermal primers when Cyclotetrasiloxane (D4) impurity is minimized.',
        },
        california: {
          status: 'PASS',
          citation: 'CA AB 2762 (Bans D4; D5 permitted if D4-free)',
          maxThreshold: 'D4 impurity < trace background',
          justification:
            'California AB 2762 bans Cyclotetrasiloxane (D4), whereas Cyclopentasiloxane (D5) passes state screening if analytical COA confirms zero intentional D4.',
        },
        eu: {
          status: 'VIOLATION',
          citation: 'EU Commission Reg (EU) 2024/1328 (REACH Annex XVII Entry 70)',
          maxThreshold: '< 0.1% (1,000 ppm) in leave-on cosmetics',
          justification:
            'Exceeds the 0.1% (1,000 ppm) maximum concentration limit for D5 in leave-on cosmetic products enforced under the updated EU REACH siloxane restriction.',
        },
      },
      {
        id: 'row-niacinamide',
        ingredientName: 'Niacinamide (Vitamin B3)',
        inciName: 'Niacinamide',
        casNumber: '98-92-0',
        roleInFormulation: 'Barrier Conditioning Active',
        concentrationPpm: 30000,
        concentrationPercent: '3.000%',
        usFda: {
          status: 'PASS',
          citation: '21 CFR Cosmetic Ingredient Inventory',
          maxThreshold: 'GMP (Typical 2%–5%)',
          justification:
            'Fully compliant cosmetic skin-conditioning ingredient at 30,000 ppm (3.0%).',
        },
        california: {
          status: 'PASS',
          citation: 'CA Safe Cosmetics Program',
          maxThreshold: 'Unrestricted',
          justification: 'Safe, non-toxic water-soluble vitamin active.',
        },
        eu: {
          status: 'PASS',
          citation: 'EU CosIng Annex',
          maxThreshold: 'Unrestricted (Nicotinic acid impurity < 100 ppm)',
          justification:
            'Compliant across all EU member states with standard pharmacopeia purity.',
        },
      },
    ],
    artworkLinting: {
      overallArtworkStatus: 'VIOLATION',
      frontPanelHeader: 'PURESILK CLEAN BEAUTY — 100% NON-TOXIC PORELESS BLURRING PRIMER',
      frontPanelSubclaim: 'Botanical Complex + Micro-Smoothing Polymer Matrix',
      backPanelSurfaceText:
        'INGREDIENTS: AQUA, CYCLOPENTASILOXANE, NIACINAMIDE, PTFE, PERFLUORONONYL DIMETHICONE',
      buriedPeelOffWarningText:
        'No peel-off sticker trap; however, front-panel "100% Non-Toxic Clean Beauty" claim directly conflicts with 1,250 ppm total intentional PFAS content.',
      isBehindPeelOffLayer: false,
      warningFontSizePt: 6.5,
      requiredMinFontSizePt: 6.0,
      contrastRatio: 4.8,
      requiredMinContrastRatio: 4.5,
      silveringMissionAlignment: {
        status: 'VIOLATION',
        toneScore: '38 / 100 (Greenwashing Deception)',
        positiveMessagingAssessment:
          'Fails Founder Ethos Pillar 1 & Pillar 3: claiming "100% Non-Toxic Clean Beauty" while formulating with persistent bioaccumulative fluoropolymers (PTFE) breaches consumer trust and triggers FTC Green Guides enforcement.',
        drugClaimCrossoverCheck: 'Cosmetic pore-blurring claim only; no drug crossover.',
      },
      alerts: [
        {
          id: 'alert-ca-pfas',
          severity: 'CRITICAL',
          jurisdiction: 'California Dept. of Public Health & AG',
          regulationCitation: 'CA Health & Safety Code § 108980 (AB 2762 / AB 496)',
          title: 'Intentional PFAS Formulation Ban in California (0.1% PTFE)',
          description:
            'This SKU cannot be legally sold or shipped into California due to 1,000 ppm PTFE and 250 ppm Perfluorononyl Dimethicone.',
          panelZone: 'INGREDIENT_DECLARATION',
          remediationAction:
            'Replace PTFE and Perfluorononyl Dimethicone with Boron Nitride, Silica Silylate, or Caprylyl Methicone.',
        },
        {
          id: 'alert-ftc-clean',
          severity: 'CRITICAL',
          jurisdiction: 'FTC Green Guides & NAD Clean Beauty Precedent',
          regulationCitation: '16 CFR Part 260 (Deceptive Environmental Claims)',
          title: 'False "100% Non-Toxic Clean Beauty" Front-Panel Claim',
          description:
            'Marketing a product containing 1,250 ppm polyfluoroalkyl substances as "100% Non-Toxic Clean Beauty" exposes the brand to California UCL class-action litigation.',
          panelZone: 'FRONT_PANEL',
          remediationAction:
            'Remove absolute "100% Non-Toxic" claim and reformulate fluoropolymers out of the primer base.',
        },
      ],
    },
    mocraDossier: {
      dossierId: 'MOCRA-2026-PFAS02',
      submissionWindowStatus: 'STATE RECALL & REFORMULATION DOSSIER ACTIVE',
      fdaFormReference: 'CA AB 2762 / MoCRA § 3506 PFAS Disclosure Dossier',
      responsiblePersonEntity: 'PureSilk Botanicals LLC',
      facilityFeiNumber: 'FEI #3028194022',
      batchNumber: 'PS-2026-104CA',
      incidentSeverityClassification:
        'California Statutory Market Prohibition (Intentional Fluoropolymer Presence)',
      patientAnonymizedProfiles: [
        {
          patientCode: 'REG-AUDIT-CA01 (Retail Quarantine Notice)',
          ageGroupAndDemographics: 'Statewide California Retail Distribution Audit',
          exposureTimeline: 'Chronic daily leave-on dermal exposure (1.2g/day facial primer)',
          clinicalPresentation:
            'No acute ER event; flagged for environmental bioaccumulation and trace PFOA precursor contamination risk.',
          emergencyInterventionRequired: 'Mandatory California SKU stop-sale & reformulation.',
          outcomeStatus: 'Quarantined in CA distribution centers pending PTFE-free reformulation.',
        },
      ],
      chronologicalStabilityMapping: [
        {
          timestamp: 'LC-MS/MS Fluorine Screen',
          phase: 'Total Organic Fluorine (TOF) Assay',
          phAndViscosityReading: 'Viscosity: 14,500 cP | TOF: 760 ppm F',
          contaminantOrDegradationFinding:
            'Confirmed 1,000 ppm PTFE + 250 ppm Perfluorononyl Dimethicone.',
          disposition: 'Fails California AB 2762 / AB 496 & EU REACH Entry 68/70.',
        },
      ],
      toxicologicalHazardAssessment: {
        primaryCausativeAgent: 'Polytetrafluoroethylene (PTFE) & Perfluorononyl Dimethicone',
        mechanisticPathway:
          'Extreme environmental persistence ("forever chemicals") and potential trace perfluorocarboxylic acid (PFCA) impurities.',
        noaelComparison: 'EFSA TWI for sum of 4 PFAS = 4.4 ng/kg bw/week.',
        dermalAndOcularMarginOfSafety:
          'Statutory zero-tolerance ban in California regardless of dermal absorption rate.',
        regulatoryTriggerCitation: 'California Health & Safety Code § 108980',
      },
      clinicalInterviewTemplates: [
        {
          sectionCode: 'SEC-CA: Supply Chain Fluoropolymer Audit',
          clinicianPrompt:
            'Verify raw material supplier Certificate of Analysis (COA) for all slip modifiers and silicone elastomers to confirm 0 ppm organic fluorine.',
          mandatoryDataFields: [
            'Supplier Trade Name',
            'Total Organic Fluorine (ppm)',
            'D4/D5 Cyclic Siloxane Residual (%)',
          ],
        },
      ],
      compiledMarkdownDocument: `# CALIFORNIA TOXIC-FREE ACT & MOCRA PFAS AUDIT DOSSIER
## DOCUMENT ID: MOCRA-2026-PFAS02 | ENGINE: GEMINI 4 ARGON
- **Product**: PureSilk Poreless Blur Primer (\`SKU: OC-PFAS-02\`)
- **Batch ID**: \`PS-2026-104CA\`
- **Primary Statutory Conflict**: US Federal Baseline \`[PASS]\` vs. California AB 2762 / AB 496 \`[VIOLATION]\`

### 1. EXECUTIVE SUMMARY
While Polytetrafluoroethylene (**PTFE at 1,000 ppm / 0.1%**) passes legacy federal FDA baseline screening while FDA completes its MoCRA § 3506 PFAS study, it triggers an immediate **statutory ban in California** under the **California Toxic-Free Cosmetics Act (AB 2762 & AB 496)**, alongside an **EU REACH Annex XVII** violation for **Perfluorononyl Dimethicone (250 ppm)** and **Cyclopentasiloxane (4.5%)**.`,
    },
  },

  'mocra-adverse-event': {
    presetId: 'mocra-adverse-event',
    auditTimestamp: '2026-10-25T10:54:00Z',
    modelEngine: 'models/gemini-4-argon (Long Decode Horizon Pipeline)',
    productName: 'LumiLift Brow & Lash Lamination Sculpting Serum',
    productCategory: 'Periorbital Brow & Lash Leave-On Serum',
    overallStatus: 'VIOLATION',
    summaryHeadline:
      'CRITICAL 15-DAY MOCRA SERIOUS ADVERSE EVENT TRIGGERED: Emergency Room intervention for acute periorbital angioedema & chemical conjunctivitis (Batch #OC-2026-884B) caused by unbuffered Thioglycolic Acid (4.8%), MIT (180 ppm), and PPD cross-contamination (420 ppm).',
    brandTwin3D: {
      vesselArchetype: 'dropper-serum',
      brandName: 'LUMILIFT CLINICAL',
      productTitle: 'BROW & LASH LAMINATION',
      subtitle: 'Batch #OC-2026-884B (Quarantined)',
      batchCode: 'BATCH #OC-2026-884B',
      netWeightLabel: '15 mL / 0.50 fl. oz.',
      primaryColorHex: '#18181B',
      secondaryColorHex: '#27272A',
      accentColorHex: '#F43F5E',
      pigmentOrLiquidHex: '#FB7185',
      palettePanColorsHex: ['#FB7185'],
      metallicFinish: 'obsidian',
      glassTransmission: 0.65,
      hasPeelOffStickerTrap: true,
      peelOffOuterGraphicTitle: 'PEEL FOR CLINICAL PATCH TEST INSTRUCTIONS',
      peelOffBuriedWarningText:
        'CONTAINS THIOGLYCOLATES & SENSITIZING PRESERVATIVES. DO NOT USE ON LASHES OR NEAR EYES.',
      frontPanelClaims: [
        'PERMANENT FOLLICLE RECONSTRUCTION',
        'INSTANT BROW & LASH LAMINATION SERUM',
      ],
    },
    urlRemixMetadata: {
      mode: 'none',
      substitutedIngredients: [],
    },
    matrixRows: [
      {
        id: 'row-tga',
        ingredientName: 'Thioglycolic Acid (Unbuffered pH 11.4 Excursion)',
        inciName: 'Thioglycolic Acid',
        casNumber: '68-11-1',
        roleInFormulation: 'Keratin Disulfide Bond Reducing Agent',
        concentrationPpm: 48000,
        concentrationPercent: '4.800%',
        usFda: {
          status: 'VIOLATION',
          citation: 'FD&C Act § 601(a) Adulteration & MoCRA § 605 SAE',
          maxThreshold: '0 ppm in leave-on ocular/lash products',
          justification:
            'At 4.8% (48,000 ppm) and pH 11.4 in a leave-on periorbital serum, Thioglycolic Acid causes severe alkali/keratolytic chemical burns to the cornea and palpebral skin, rendering the product adulterated under FD&C Act § 601(a).',
        },
        california: {
          status: 'VIOLATION',
          citation: 'CA Sherman Food, Drug, and Cosmetic Law § 111670',
          maxThreshold: 'Prohibited in leave-on periocular applications',
          justification:
            'Adulterated and injurious under California Sherman Law due to acute emergency room chemical conjunctivitis events.',
        },
        eu: {
          status: 'VIOLATION',
          citation: 'EU Reg (EC) No 1223/2009 Annex III, Entry 2a',
          maxThreshold: 'Max 2% (Professional Eyelash Curl Only, Rinse-Off)',
          justification:
            'EU Annex III Entry 2a strictly limits Thioglycolic Acid to 2.0% for professional-use rinse-off eyelash waving only; 4.8% consumer leave-on serum is illegal.',
        },
      },
      {
        id: 'row-mit',
        ingredientName: 'Methylisothiazolinone (MIT)',
        inciName: 'Methylisothiazolinone',
        casNumber: '2682-20-4',
        roleInFormulation: 'Broad-Spectrum Preservative',
        concentrationPpm: 180,
        concentrationPercent: '0.018%',
        usFda: {
          status: 'VIOLATION',
          citation: 'MoCRA § 605 & CIR Leave-On Prohibition',
          maxThreshold: '0 ppm in leave-on products (Max 15 ppm rinse-off)',
          justification:
            'At 180 ppm in a leave-on serum, Methylisothiazolinone is 12x above the rinse-off threshold and is a potent Type IV contact allergen causing acute periorbital angioedema.',
        },
        california: {
          status: 'VIOLATION',
          citation: 'CA Safe Cosmetics Program Sensitizer Alert',
          maxThreshold: 'Prohibited at sensitizing leave-on levels',
          justification:
            'Triggers mandatory reporting and adulteration liability for severe allergic contact dermatitis.',
        },
        eu: {
          status: 'VIOLATION',
          citation: 'EU Reg (EC) 2016/1198 & Annex V, Entry 57',
          maxThreshold: '0 ppm in leave-on cosmetics (Banned since 2017)',
          justification:
            'Methylisothiazolinone is completely banned in all leave-on cosmetic products in the European Union; only permitted up to 15 ppm (0.0015%) in rinse-off products.',
        },
      },
      {
        id: 'row-ppd',
        ingredientName: 'p-Phenylenediamine (Line Cross-Contaminant)',
        inciName: 'p-Phenylenediamine',
        casNumber: '106-50-3',
        roleInFormulation: 'Unintended Oxidative Dye Contaminant',
        concentrationPpm: 420,
        concentrationPercent: '0.042%',
        usFda: {
          status: 'VIOLATION',
          citation: 'FD&C Act § 601(a) & § 602(a) (Eyelash/Brow Dye Ban)',
          maxThreshold: '0 ppm in eyebrow and eyelash products',
          justification:
            'Coal-tar hair dyes containing p-Phenylenediamine are strictly forbidden in eyebrow and eyelash products in the United States due to blindness and severe anaphylaxis/angioedema hazards.',
        },
        california: {
          status: 'VIOLATION',
          citation: 'CA Sherman Law § 111675',
          maxThreshold: '0 ppm in periocular products',
          justification:
            'Unapproved and undeclared PPD contamination in a periocular product violates California adulteration and misbranding statutes.',
        },
        eu: {
          status: 'VIOLATION',
          citation: 'EU Reg (EC) No 1223/2009 Annex III, Entry 8a',
          maxThreshold: '0 ppm for consumer eyebrow/eyelash use',
          justification:
            'Undeclared 420 ppm PPD contamination violates EU GMP (ISO 22716) and Annex III restrictions.',
        },
      },
    ],
    artworkLinting: {
      overallArtworkStatus: 'VIOLATION',
      frontPanelHeader: 'LUMILIFT CLINICAL — PERMANENT FOLLICLE RECONSTRUCTION & BROW LAMINATION',
      frontPanelSubclaim: 'Medical-Grade Keratin & Peptide Restructurer',
      backPanelSurfaceText: 'BATCH #OC-2026-884B · PEEL LABEL FOR SENSITIVITY WARNINGS',
      buriedPeelOffWarningText:
        'CONTAINS THIOGLYCOLATES. DO NOT APPLY TO EYELASHES OR ALLOW CONTACT WITH EYES.',
      isBehindPeelOffLayer: true,
      warningFontSizePt: 4.5,
      requiredMinFontSizePt: 6.0,
      contrastRatio: 2.4,
      requiredMinContrastRatio: 4.5,
      silveringMissionAlignment: {
        status: 'VIOLATION',
        toneScore: '14 / 100 (Illegal Drug Claim + Buried Hazard)',
        positiveMessagingAssessment:
          'Fails both FDA statutory law and Founder Ethos Pillar 2: uses pseudo-medical "Permanent Follicle Reconstruction" claims while concealing caustic thioglycolate warnings under a peel-off label.',
        drugClaimCrossoverCheck:
          'CRITICAL DRUG CROSSOVER: "Permanent Follicle Reconstruction" claims to alter the structure and function of the human body (FD&C Act § 201(g)(1)(C)), classifying the product as an unapproved new drug.',
      },
      alerts: [
        {
          id: 'alert-mocra-sae',
          severity: 'CRITICAL',
          jurisdiction: 'US FDA MoCRA § 605 (21 U.S.C. § 364a)',
          regulationCitation: 'FD&C Act § 605 — Mandatory 15-Business-Day SAE Submission',
          title: 'Mandatory 15-Day Serious Adverse Event (SAE) Filing Triggered',
          description:
            'Emergency Department intervention (IV corticosteroids + ocular irrigation at Mount Sinai ER) constitutes a statutory Serious Adverse Event under MoCRA. Responsible Person must submit Form FDA 3500A + retail label scan within 15 business days.',
          panelZone: 'BACK_PEEL_OFF_LAYER',
          remediationAction:
            'Transmit Autonomous MoCRA Dossier (Tab 3) immediately to FDA CDER/CFSAN MedWatch and initiate voluntary Class I recall of Batch #OC-2026-884B.',
        },
        {
          id: 'alert-drug-claim',
          severity: 'CRITICAL',
          jurisdiction: 'US FDA Warning Letter Precedent',
          regulationCitation: 'FD&C Act § 201(g)(1)(C) & § 505(a)',
          title: 'Unapproved New Drug Structure/Function Claim ("Permanent Follicle Reconstruction")',
          description:
            'Claims to permanently reconstruct hair follicles cross the statutory boundary from cosmetic beautification into unapproved pharmaceutical drug territory.',
          panelZone: 'FRONT_PANEL',
          remediationAction:
            'Replace with compliant, uplifting cosmetic appearance claims (e.g., "Conditions and visibly styles brow strands for a fuller-looking arch").',
        },
      ],
    },
    mocraDossier: {
      dossierId: 'FDA-MOCRA-SAE-2026-884B',
      submissionWindowStatus: 'MANDATORY 15-BUSINESS-DAY CLOCK ACTIVE (13 DAYS REMAINING)',
      fdaFormReference: 'Form FDA 3500A (Mandatory MedWatch / MoCRA Section 605 Electronic Packet)',
      responsiblePersonEntity: 'LumiLift Clinical Cosmetics, Inc. (New York, NY)',
      facilityFeiNumber: 'FEI #3014498211',
      batchNumber: 'OC-2026-884B',
      incidentSeverityClassification:
        'SERIOUS ADVERSE EVENT (SAE) — Life-Altering Ocular Threat & Emergency Room Hospitalization',
      patientAnonymizedProfiles: [
        {
          patientCode: 'SAE-PT-1091 (Index Hospitalized Case)',
          ageGroupAndDemographics: '42-year-old female | New York, NY | No prior atopy',
          exposureTimeline:
            'Applied 0.15 mL of Batch #OC-2026-884B to bilateral eyebrows and upper eyelashes at 18:30 EDT on 2026-10-23. Onset of severe burning and periorbital swelling at 21:15 EDT (T+2.75h).',
          clinicalPresentation:
            'Bilateral severe periorbital angioedema, vesicular allergic contact dermatitis across supraorbital ridge, and acute alkali chemical conjunctivitis with 20% inferior corneal epithelial defect (fluorescein positive).',
          emergencyInterventionRequired:
            'Admitted to Mount Sinai Emergency Department (22:15 EDT). Treated with Morgan Lens 0.9% NaCl ocular irrigation (2L until tear pH normalized to 7.2), IV Methylprednisolone 125 mg, IV Diphenhydramine 50 mg, and Moxifloxacin 0.5% ophthalmic drops.',
          outcomeStatus:
            'Discharged after 18-hour observation with compulsory 72-hour ophthalmology follow-up and 14-day oral prednisone taper.',
        },
        {
          patientCode: 'AE-PT-1094 (Cluster Case #2)',
          ageGroupAndDemographics: '56-year-old female | San Diego, CA | Transitioning silver brows',
          exposureTimeline:
            'Applied Batch #OC-2026-884B to eyebrows only at 20:00 PDT on 2026-10-23. Symptoms peaked at T+12h.',
          clinicalPresentation:
            'Acute weeping erythematous plaque dermatitis along superciliary arch with localized telogen/anagen brow effluvium (madarosis).',
          emergencyInterventionRequired:
            'Urgent Care clinic evaluation; prescribed Topical Hydrocortisone Butyrate 0.1% and oral Cetirizine 10 mg.',
          outcomeStatus: 'Recovering; persistent post-inflammatory erythema at Day 2.',
        },
      ],
      chronologicalStabilityMapping: [
        {
          timestamp: '2026-09-12T08:30:00Z (Batch Compounding)',
          phase: 'Vessel #4 Compounding & Buffer Addition',
          phAndViscosityReading: 'Target pH: 8.5 | Actual Unrecorded Excursion: pH 10.9',
          contaminantOrDegradationFinding:
            'Metering pump fault overdosed Ammonium Thioglycolate to 48,000 ppm (4.8%) while omitting tromethamine citric buffer.',
          disposition: 'Released in error due to bypassed inline pH probe calibration.',
        },
        {
          timestamp: '2026-09-14T11:15:00Z (Filling Line B)',
          phase: 'Glass Dropper Filling (Manifold #2)',
          phAndViscosityReading: 'pH: 11.1 | Viscosity: 4,200 cP',
          contaminantOrDegradationFinding:
            'CIP (Clean-In-Place) rinse failure following oxidative hair dye batch introduced 420 ppm p-Phenylenediamine (PPD) and 180 ppm Methylisothiazolinone (MIT) into Batch #OC-2026-884B.',
          disposition: '3,400 units packaged and distributed to DTC fulfillment warehouse.',
        },
        {
          timestamp: '2026-10-24T14:00:00Z (Retain Sample Forensics)',
          phase: 'Emergency Retain Assay (HPLC-DAD + ICP-MS)',
          phAndViscosityReading: 'Measured Retain pH: 11.42 (Highly Alkaline)',
          contaminantOrDegradationFinding:
            'Confirmed synergistic triad: 48,000 ppm unbuffered Thioglycolic Acid + 420 ppm PPD + 180 ppm MIT.',
          disposition: 'BATCH QUARANTINED — Mandatory FDA MoCRA § 606 Recall Evaluation.',
        },
      ],
      toxicologicalHazardAssessment: {
        primaryCausativeAgent:
          'Synergistic Caustic-Sensitizer Triad: Unbuffered Thioglycolic Acid (4.8%, pH 11.4) + p-Phenylenediamine (420 ppm) + Methylisothiazolinone (180 ppm)',
        mechanisticPathway:
          'Alkaline Thioglycolic Acid (pH 11.4) rapidly cleaves stratum corneum keratin disulfide bonds and disrupts corneal tight junctions, increasing trans-epidermal and trans-corneal flux of potent Type IV haptens (PPD and MIT) by >14-fold, triggering explosive IgE/T-cell mediated periorbital angioedema and alkali keratitis.',
        noaelComparison:
          'Dermal NESIL for MIT is 0.0015% (15 ppm) in rinse-off only; Batch #OC-2026-884B exceeds safe sensitization thresholds by >120x under compromised barrier conditions.',
        dermalAndOcularMarginOfSafety:
          'Calculated Margin of Safety (MoS) = 0.04 (Critical Failure; Required MoS ≥ 100).',
        regulatoryTriggerCitation:
          '21 U.S.C. § 364a (MoCRA Section 605 Serious Adverse Event), 21 U.S.C. § 364b (GMP), & 21 U.S.C. § 364f (Mandatory Recall Authority)',
      },
      clinicalInterviewTemplates: [
        {
          sectionCode: 'PROTOCOL-01: 72-Hour Ophthalmological Follow-Up (Case SAE-PT-1091)',
          clinicianPrompt:
            'Contact attending ophthalmologist at Mount Sinai Dept. of Ophthalmology to document corneal re-epithelialization, intraocular pressure (IOP), and best-corrected visual acuity (BCVA) for mandatory 1-year MoCRA supplemental reporting.',
          mandatoryDataFields: [
            'Slit-Lamp Fluorescein Staining Score (Oxford Scale 0–V)',
            'BCVA OD / OS (Snellen Equivalent)',
            'Limbal Stem Cell Ischemia Assessment',
            'Confirmed Lot Number Photograph from Patient Container',
          ],
        },
        {
          sectionCode: 'PROTOCOL-02: Dermatological Patch Test & Madarosis Tracking (Case AE-PT-1094)',
          clinicianPrompt:
            'Document resolution of superciliary vesicular dermatitis and evaluate follicular viability at Day 14 and Day 30 post-exposure.',
          mandatoryDataFields: [
            'Resolution Date of Periorbital Edema',
            'Brow Follicle Regrowth Density (%)',
            'Concomitant Medications & Topical Corticosteroid Taper Completion',
          ],
        },
      ],
      compiledMarkdownDocument: `# MANDATORY 15-DAY FDA MOCRA SERIOUS ADVERSE EVENT DOSSIER
## SUBMISSION PACKET ID: FDA-MOCRA-SAE-2026-884B | FORM FDA 3500A
- **Statutory Authority**: FD&C Act Section 605 (21 U.S.C. § 364a) — Modernization of Cosmetics Regulation Act (MoCRA)
- **Filing Deadline**: **2026-11-13T23:59:59Z** (Within 15 Business Days of Initial Receipt on 2026-10-23)
- **Responsible Person**: LumiLift Clinical Cosmetics, Inc. | **Facility FEI**: \`3014498211\`
- **Implicated Product**: LumiLift Brow & Lash Lamination Sculpting Serum (\`Batch #OC-2026-884B\`)
- **Retail Packaging Attachment**: Included (Front Claim + Back Peel-Off Layer Scan per 21 U.S.C. § 364a(b)(3))

---

### SECTION 1: PATIENT ANONYMIZED DATA PROFILES & CLINICAL TRIAGE

#### 1.1 Index Serious Adverse Event Case (\`SAE-PT-1091\`)
- **Patient Identifier**: \`ANON-F42-NY\` (42-year-old Female, New York, NY)
- **Exposure Vector**: Applied \`0.15 mL\` of \`Batch #OC-2026-884B\` to bilateral eyebrows and upper eyelashes at \`18:30 EDT\` on \`2026-10-23\`.
- **Acute Clinical Presentation**: Within 165 minutes of application, patient developed acute bilateral periorbital angioedema, blistering supraorbital erythema, blepharospasm, and chemical conjunctivitis with a 20% inferior corneal epithelial defect.
- **Emergency Medical Intervention**: Admitted to Mount Sinai Emergency Department (\`22:15 EDT\`). Administered 2.0L 0.9% NaCl Morgan Lens ocular irrigation (normalizing fornix pH from 9.6 to 7.2), IV Methylprednisolone \`125 mg\`, IV Diphenhydramine \`50 mg\`, and topical Moxifloxacin \`0.5%\`.
- **MoCRA SAE Statutory Qualification**: Inpatient emergency department intervention required to prevent permanent impairment of ocular structure/function.

#### 1.2 Secondary Cluster Case (\`AE-PT-1094\`)
- **Patient Identifier**: \`ANON-F56-CA\` (56-year-old Female, San Diego, CA)
- **Exposure Vector**: Single brow lamination application of \`Batch #OC-2026-884B\`.
- **Clinical Presentation**: Weeping vesicular allergic contact dermatitis and acute brow madarosis (localized hair shedding) within 12 hours; treated at Urgent Care with systemic and topical corticosteroids.

---

### SECTION 2: CHRONOLOGICAL FORMULATION STABILITY & ROOT-CAUSE MAPPING

| Timestamp (UTC) | Manufacturing / QC Phase | Analytical Telemetry | Root-Cause Finding |
| :--- | :--- | :--- | :--- |
| \`2026-09-12 08:30\` | Bulk Compounding (Vessel #4) | \`pH: 10.9\` (Spec: \`8.2–8.8\`) | Metering pump fault spiked **Thioglycolic Acid to 48,000 ppm (4.8%)**; tromethamine buffer omitted. |
| \`2026-09-14 11:15\` | Dropper Filling (Manifold #2) | \`pH: 11.1\` / \`4,200 cP\` | Incomplete CIP flush after oxidative dye run introduced **420 ppm p-Phenylenediamine (PPD)** and **180 ppm Methylisothiazolinone (MIT)**. |
| \`2026-10-24 14:00\` | Forensic Retain HPLC/ICP-MS | \`pH: 11.42\` | Confirmed caustic-sensitizer triad across all retain vials of \`Batch #OC-2026-884B\`. |

---

### SECTION 3: TOXICOLOGICAL HAZARD ASSESSMENT
1. **Primary Mechanistic Pathway**: Unbuffered **Thioglycolic Acid at 48,000 ppm (pH 11.42)** acts as an alkaline keratolytic that cleaves epidermal corneodesmosomes and corneal tight junctions. This barrier destruction amplified percutaneous and trans-conjunctival penetration of **p-Phenylenediamine (420 ppm)** and **Methylisothiazolinone (180 ppm)** by an estimated **14.2x**, provoking fulminant periorbital angioedema and chemical keratitis.
2. **Margin of Safety (MoS)**: Calculated ocular/periocular \`MoS = 0.04\` (Critical Toxicological Failure vs. required \`MoS ≥ 100\`).
3. **Statutory Violations**:
   - **US FDA**: Adulterated under FD&C Act § 601(a) (poisonous/deleterious substance in periocular product) and misbranded under § 602(a) & § 201(g)(1)(C).
   - **EU EC 1223/2009**: Violates Annex III Entry 2a (Thioglycolic acid > 2%), Annex V Entry 57 (MIT banned in leave-on cosmetics), and Annex III Entry 8a (PPD contamination).

---

### SECTION 4: STRUCTURED CLINICAL FOLLOW-UP INTERVIEW TEMPLATES (1-YEAR MOCRA CONTINUATION)
Per **21 U.S.C. § 364a(c)**, the Responsible Person must submit any new and material medical information received within **1 year** of the initial Serious Adverse Event report within 15 business days of receipt:
- **[ ] 72-Hour Slit-Lamp & Visual Acuity Verification (\`SAE-PT-1091\`)**: Confirm complete corneal re-epithelialization, absence of symblepharon or corneal neovascularization, and baseline Snellen BCVA recovery.
- **[ ] Day-14 Patch Test & Follicular Recovery Audit (\`AE-PT-1094\`)**: Record dermatologist evaluation of brow hair regrowth and resolution of periorbital dermatitis.
- **[ ] Lot Retrieval & Class I Recall Reconciliation**: Confirm physical quarantine of all remaining 3,400 units of \`Batch #OC-2026-884B\`.`,
    },
  },

  'silvering-toner': {
    presetId: 'silvering-toner',
    auditTimestamp: '2026-10-25T10:54:00Z',
    modelEngine: 'models/gemini-4-argon (1M Context + Multimodal Spatial Engine)',
    productName: 'Silvering Luminescence Scalp & Silver Hair Toning Elixir',
    productCategory: 'Leave-On Translucent Silver, Gray & White Hair + Scalp Elixir',
    overallStatus: 'PASS',
    summaryHeadline:
      'All Jurisdictions Passed [PASS]: Calibrated Acid Violet 43 (1,200 ppm), Biotinoyl Tripeptide-1 (500 ppm), and Niacinamide (2.0%) satisfy US FDA, California Toxic-Free Act, and EU EC 1223/2009 Annex IV while exemplifying Silvering’s 5-Pillar Positive Brand Ethos.',
    brandTwin3D: {
      vesselArchetype: 'dropper-serum',
      brandName: 'SILVERING BEAUTY',
      productTitle: 'LUMINESCENCE TONING ELIXIR',
      subtitle: 'For Naturally Silver, Gray & White Hair',
      batchCode: 'BATCH #SLV-2026-01A',
      netWeightLabel: '50 mL / 1.69 fl. oz.',
      primaryColorHex: '#0F172A',
      secondaryColorHex: '#334155',
      accentColorHex: '#10B981',
      pigmentOrLiquidHex: '#8B5CF6',
      palettePanColorsHex: ['#8B5CF6', '#C4B5FD', '#E2E8F0'],
      metallicFinish: 'platinum',
      glassTransmission: 0.88,
      hasPeelOffStickerTrap: false,
      peelOffOuterGraphicTitle: 'HIGH-CONTRAST OUTER COMPLIANCE PANEL (7.5 PT)',
      peelOffBuriedWarningText:
        'ALL WARNINGS & INCI PRINTED DIRECTLY ON OUTER FROSTED GLASS PANEL AT 7.5 PT (7.4:1 CONTRAST)',
      frontPanelClaims: [
        'AMPLIFY NATURALLY SILVER, GRAY & WHITE HAIR',
        'WEIGHTLESS OPTICAL TONING & SCALP HYDRATION',
      ],
    },
    urlRemixMetadata: {
      mode: 'none',
      substitutedIngredients: [],
    },
    matrixRows: [
      {
        id: 'row-violet43',
        ingredientName: 'Ext. D&C Violet No. 2 (Acid Violet 43)',
        inciName: 'CI 60730',
        casNumber: '4430-18-6',
        roleInFormulation: 'Precision Optical Yellow-Neutralizing Toner for Translucent Hair',
        concentrationPpm: 1200,
        concentrationPercent: '0.120%',
        usFda: {
          status: 'PASS',
          citation: '21 CFR § 74.2602',
          maxThreshold: 'GMP (External Cosmetics & Hair/Scalp Approved)',
          justification:
            'Ext. D&C Violet No. 2 is batch-certifiable and explicitly authorized under 21 CFR 74.2602 for external cosmetic and hair/scalp toning applications when kept away from the immediate eye area.',
        },
        california: {
          status: 'PASS',
          citation: 'CA Health & Safety Code § 108980',
          maxThreshold: 'Compliant (Zero PFAS / Zero Heavy Metal Spike)',
          justification:
            'Passes California Toxic-Free Cosmetics Act (AB 2762 / AB 496) with zero fluorinated surfactants or restricted impurities.',
        },
        eu: {
          status: 'PASS',
          citation: 'EU Reg (EC) No 1223/2009 Annex IV, Entry 97 & SCCS/1499/12',
          maxThreshold: 'Max 0.5% (5,000 ppm) in non-oxidative hair products',
          justification:
            'At 0.12% (1,200 ppm), CI 60730 is well below the 0.5% (5,000 ppm) maximum safe concentration established by the EU SCCS for non-oxidative hair toning formulations.',
        },
      },
      {
        id: 'row-peptide',
        ingredientName: 'Biotinoyl Tripeptide-1',
        inciName: 'Biotinoyl Tripeptide-1',
        casNumber: '299157-54-3',
        roleInFormulation: 'Maturing Scalp & Strand Conditioning Peptide',
        concentrationPpm: 500,
        concentrationPercent: '0.050%',
        usFda: {
          status: 'PASS',
          citation: 'CIR Peptide Safety Review / 21 CFR',
          maxThreshold: 'Safe as used (0.01%–0.1%)',
          justification:
            'Compliant cosmetic conditioning peptide when paired with appearance-based fullness claims rather than pharmaceutical hair-regrowth drug claims.',
        },
        california: {
          status: 'PASS',
          citation: 'CA Safe Cosmetics Program',
          maxThreshold: 'Unrestricted',
          justification: 'Clean biomimetic tripeptide free of state-restricted substances.',
        },
        eu: {
          status: 'PASS',
          citation: 'EU CosIng Function: Hair Conditioning',
          maxThreshold: 'Unrestricted under Annexes II–VI',
          justification:
            'Authorized cosmetic conditioning peptide across all EU member states.',
        },
      },
      {
        id: 'row-niacinamide-slv',
        ingredientName: 'Niacinamide (Pharmaceutical Grade)',
        inciName: 'Niacinamide',
        casNumber: '98-92-0',
        roleInFormulation: 'Scalp Barrier & Sebum Equilibrium Support',
        concentrationPpm: 20000,
        concentrationPercent: '2.000%',
        usFda: {
          status: 'PASS',
          citation: '21 CFR Cosmetic Ingredient Inventory',
          maxThreshold: 'GMP Compliant',
          justification: 'Safe and well-tolerated scalp conditioning vitamin at 20,000 ppm.',
        },
        california: {
          status: 'PASS',
          citation: 'CA Health & Safety Code § 108980',
          maxThreshold: 'Unrestricted',
          justification: 'Full compliance with California clean formulation statutes.',
        },
        eu: {
          status: 'PASS',
          citation: 'EU Reg (EC) No 1223/2009',
          maxThreshold: 'Unrestricted',
          justification: 'Full compliance with European cosmetic safety standards.',
        },
      },
    ],
    artworkLinting: {
      overallArtworkStatus: 'PASS',
      frontPanelHeader:
        'SILVERING — AMPLIFY NATURALLY SILVER, GRAY & WHITE HAIR WITH CHIC LUMINESCENCE',
      frontPanelSubclaim: 'Weightless Optical Toning & Maturing Scalp Hydration Elixir',
      backPanelSurfaceText:
        'FOR EXTERNAL SCALP AND HAIR USE ONLY. AVOID DIRECT CONTACT WITH EYES. 7.5 PT HIGH-CONTRAST PRINT.',
      buriedPeelOffWarningText:
        'Zero peel-off obfuscation. All statutory disclosures printed directly on the primary outer back panel.',
      isBehindPeelOffLayer: false,
      warningFontSizePt: 7.5,
      requiredMinFontSizePt: 6.0,
      contrastRatio: 7.4,
      requiredMinContrastRatio: 4.5,
      silveringMissionAlignment: {
        status: 'PASS',
        toneScore: '98 / 100 (Exemplary Founder Ethos)',
        positiveMessagingAssessment:
          'Exemplifies Alexis Eizinas’s 5 Pillars: celebrates silvering hair positively as aspirational and chic, addresses the unique translucent structure of gray hair, and avoids fear/shame anti-aging tropes.',
        drugClaimCrossoverCheck:
          'PASS: Uses compliant cosmetic phrasing ("amplify luminescence, hydrate scalp, visibly fuller-looking strands") without crossing into unapproved FDA alopecia drug claims.',
      },
      alerts: [
        {
          id: 'alert-slv-pass1',
          severity: 'NOMINAL',
          jurisdiction: 'US FDA 21 CFR § 701.2 & § 74.2602',
          regulationCitation: '21 CFR § 701.2 Prominence Verified',
          title: 'Outer Panel Typography & Contrast Exceed Statutory Minimums',
          description:
            'Safety instructions ("Avoid direct contact with eyes" for Ext. D&C Violet No. 2) are printed directly on the outer surface at 7.5 pt with a 7.4:1 contrast ratio.',
          panelZone: 'FRONT_PANEL',
          remediationAction: 'No remediation required. Ready for global print production.',
        },
        {
          id: 'alert-slv-pass2',
          severity: 'NOMINAL',
          jurisdiction: 'FDA / FTC Cosmetic Claim Boundary',
          regulationCitation: 'FD&C Act § 201(i) Cosmetic Definition',
          title: 'Positive, Mission-Aligned Cosmetic Claims Verified',
          description:
            'Brand claims uplift the consumer and focus on optical luster and scalp conditioning without triggering unapproved structure/function drug classification.',
          panelZone: 'BRAND_MISSION_CLAIM',
          remediationAction: 'Maintain mission-filtered copy across retail and social channels.',
        },
      ],
    },
    mocraDossier: {
      dossierId: 'MOCRA-2026-SLV04',
      submissionWindowStatus: 'NOMINAL — ZERO SERIOUS ADVERSE EVENTS (SAFETY SUBSTANTIATION ARCHIVED)',
      fdaFormReference: 'MoCRA § 608 Safety Substantiation Dossier & EU PIF (Product Information File)',
      responsiblePersonEntity: 'Silvering Beauty Inc.',
      facilityFeiNumber: 'FEI #3029910482',
      batchNumber: 'SLV-2026-01A',
      incidentSeverityClassification: 'Nominal Post-Market Surveillance (0 SAEs / 99.4% Dermal Tolerance)',
      patientAnonymizedProfiles: [
        {
          patientCode: 'HRIPT-COHORT-100 (Clinical Safety Substantiation)',
          ageGroupAndDemographics: '100-subject Human Repeat Insult Patch Test (Ages 45–78, sensitive scalp cohort)',
          exposureTimeline: '6-week controlled occlusive & open scalp application of Batch #SLV-2026-01A',
          clinicalPresentation: 'Zero primary irritation or allergic contact sensitization observed.',
          emergencyInterventionRequired: 'None (0 SAEs across 14,200 distributed units).',
          outcomeStatus: 'Substantiated safe under MoCRA § 608 and EU CPSR Part A/B.',
        },
      ],
      chronologicalStabilityMapping: [
        {
          timestamp: 'T+90 Days (40°C / 75% RH Accelerated)',
          phase: 'Accelerated ICH Q1A Stability & PET Challenge',
          phAndViscosityReading: 'pH: 5.45 (Scalp-Isohydric) | Viscosity: 1,850 cP',
          contaminantOrDegradationFinding:
            'CI 60730 chromophore stability 99.2%; USP <51> Preservative Efficacy passed Criteria A.',
          disposition: 'Approved for 36-month shelf life & 12M PAO.',
        },
      ],
      toxicologicalHazardAssessment: {
        primaryCausativeAgent: 'None (All ingredients within SCCS and CIR safe thresholds)',
        mechanisticPathway:
          'Isohydric pH 5.45 formulation preserves maturing scalp acid mantle while depositing calibrated 1,200 ppm Acid Violet 43 onto translucent keratin cuticles without follicular irritation.',
        noaelComparison: 'CI 60730 systemic NOAEL = 100 mg/kg bw/day (SCCS/1499/12).',
        dermalAndOcularMarginOfSafety: 'Calculated Systemic Margin of Safety (MoS) = 685 (Required ≥ 100).',
        regulatoryTriggerCitation: 'FD&C Act § 608 (Adequate Substantiation of Safety)',
      },
      clinicalInterviewTemplates: [
        {
          sectionCode: 'SURVEILLANCE-01: Routine MoCRA § 605 Contact Logging',
          clinicianPrompt:
            'Standard post-market consumer care script verifying domestic US address/phone/electronic contact response readiness on bottle label.',
          mandatoryDataFields: [
            'Batch Code on Dropper Collar',
            'Scalp Sensitivity History',
            'Optical Toning Satisfaction Note',
          ],
        },
      ],
      compiledMarkdownDocument: `# MOCRA § 608 SAFETY SUBSTANTIATION & EU CPSR DOSSIER
## DOCUMENT ID: MOCRA-2026-SLV04 | ENGINE: GEMINI 4 ARGON
- **Brand / Product**: Silvering Luminescence Scalp & Silver Hair Toning Elixir (\`SKU: SLV-TONE-01\`)
- **Batch ID**: \`SLV-2026-01A\` | **Status**: \`[PASS — ALL JURISDICTIONS]\`

### 1. EXECUTIVE SUMMARY & FOUNDER ETHOS BENCHMARK
Formulated specifically for naturally silvering, gray, and white translucent hair and maturing scalps, this SKU passes **US FDA (MoCRA & 21 CFR § 74.2602)**, **California Toxic-Free Cosmetics Act (AB 2762 / AB 496)**, and **European Union Regulation (EC) No 1223/2009 Annex IV**.
- **Calibrated Toning Safety**: \`CI 60730 (Acid Violet 43)\` is formulated at \`1,200 ppm (0.12%)\`, providing clean optical yellowing neutralization while staying well below the \`5,000 ppm (0.5%)\` EU SCCS threshold (\`MoS = 685\`).
- **Positive & Compliant Labeling**: Front and back panels use 7.5 pt high-contrast typography directly on the primary vessel surface, celebrating silver hair positively without crossing into unapproved FDA drug claims.`,
    },
  },
};

export const OPENCOMPACT_README_MD = `# OpenCompact

**The Open Source Shield Against Regulatory Patchworks — Powered by Gemini 4 Argon (\`models/gemini-4-argon\`)**

> **Why "OpenCompact"?**
> 1. **Cosmetic Compact**: Simulates physical pressed-pigment compacts, frosted glass serums, and airless primer vessels in an interactive Three.js 3D viewport with peel-off label layer inspection.
> 2. **Regulatory Compact**: Bridges conflicting international cosmetic pacts across **US FDA (MoCRA / 21 CFR)**, **California (Toxic-Free Cosmetics Act AB 2762 / AB 496)**, and the **European Union (EC Regulation No 1223/2009)**.
> 3. **Open-Source & Compact**: A fast, developer-first Next.js compliance engine designed to democratize regulatory toxicology for independent beauty founders.

---

## Core Architecture & Gemini 4 Argon Capabilities

OpenCompact connects to **Gemini 4 Argon** via \`/app/api/compliance/route.ts\` using the official \`@google/genai\` TypeScript SDK:

- **1M Unified Context Window**: Simultaneous cross-border ingredient auditing across US FDA 21 CFR Parts 73/74/700, MoCRA Section 605/608, California AB 2762 & AB 496, and EU EC 1223/2009 Annexes II–VI.
- **Native Multimodal Vision & 3D Brand Twin Simulator**: Ingests natural-language brand prompts, packaging artwork layers, product URLs, or \`.mp4\`/\`.webm\` packaging videos to synthesize a procedural **Three.js 3D Packaging Twin** coupled with deep toxicological compliance telemetry.
- **Product URL Auditor & Distinct Compliant Brand Generator**: Paste any existing cosmetic product URL to either audit its current formulation or automatically synthesize a **similar-but-distinct, 100% compliant brand variant** (replacing banned colorants or PFAS with safe alternatives).
- **Long Decode Horizon (15-Day MoCRA Dossier Generator)**: Autonomously drafts self-consistent, multi-page **FDA Form 3500A / MoCRA Serious Adverse Event** submission packets including Patient Anonymized Profiles, Chronological Stability Mapping, Toxicological Hazard Assessments, and Clinical Follow-Up Templates.
- **Modern Beauty Founder Ethos (Inspired by Alexis Eizinas of Silvering)**: Integrates the 5 pillars from *Authority Magazine's "Five Things You Need To Know To Succeed In The Modern Beauty Industry"*—verifying unique niche formulation safety (such as translucent silver hair & scalp care) and positive, uplifting customer messaging free of fear-based tropes or illegal drug claims.

---

## Quickstart & Environment Variables

\`\`\`bash
# Install dependencies
npm install

# Configure environment (.env.local)
GEMINI_API_KEY="your_gemini_api_key"
NEXT_PUBLIC_SHOW_LANDING_PAGE="true"

# Launch on http://localhost:3000
npm run dev
\`\`\`
`;
