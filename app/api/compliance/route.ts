import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import {
  ComplianceAuditPayload,
  ComplianceAuditResult,
  DETERMINISTIC_PRESET_RESULTS,
} from '@/lib/compliance-data';

const SYSTEM_INSTRUCTION = `You are OpenCompact's Regulatory Toxicology & 3D Brand Twin Engine powered by Gemini 4 Argon.
You evaluate cosmetic formulations, packaging artwork layers, video frames, existing product URLs, and consumer adverse event logs with absolute statutory precision.

HARDCODED REGULATORY CONSTANTS & STATUTES:
1. US FDA (MoCRA & 21 CFR Parts 73, 74, 700, 701, 740):
   - D&C Red No. 28 (CI 45410) and D&C Red No. 7 (CI 15850) are CATEGORICALLY PROHIBITED in any product intended for use in the area of the eye (21 CFR § 74.2328(b) & § 74.2307(b)). Even if labeled "Pressed Pigment", eye-oriented pans or claims trigger a [VIOLATION].
   - Prominence & Conspicuousness (21 CFR § 701.2 & § 740.10): Mandatory safety warnings (such as "not intended for eye area" or sensitizer warnings) buried behind a peel-off graphic sticker layer or printed < 6.0 pt or < 4.5:1 contrast ratio constitute a CRITICAL [VIOLATION].
   - MoCRA Section 605 (21 U.S.C. § 364a): Any adverse event resulting in Emergency Room hospitalization, inpatient care, significant disfigurement, persistent rash/alopecia, or acute ocular injury requires a mandatory 15-business-day Serious Adverse Event (SAE) MedWatch Form FDA 3500A submission with retail packaging scans attached.
   - FD&C Act § 201(g)(1)(C) Drug-Claim Boundary: Claims to permanently reconstruct hair follicles, reverse hair loss/alopecia, or alter physiological tissue structure cross into unapproved new drug territory ([VIOLATION]).

2. CALIFORNIA TOXIC-FREE COSMETICS ACT (AB 2762 & AB 496 — CA Health & Safety Code § 108980):
   - Zero-tolerance ban on intentionally added Perfluoroalkyl and Polyfluoroalkyl Substances (PFAS), explicitly including Polytetrafluoroethylene (PTFE, even at 0.1% / 1,000 ppm) and Perfluorononyl Dimethicone. While PTFE may still pass legacy federal baseline screening pending FDA's MoCRA PFAS rule, it is a strict [VIOLATION] in California.
   - Bans Cyclotetrasiloxane (D4), dibutyl phthalate, diethylhexyl phthalate, formaldehyde-releasing agents, mercury, and lead/PFAS contaminants.

3. EUROPEAN UNION REGULATION (EC) No 1223/2009 (Annexes II–VI & REACH):
   - CI 45410 (Phloxine B / Red 28) and CI 15850 (Red 7) ARE PERMITTED across all cosmetic categories including eye products under EU Annex IV (Entry 77 & Entry 25), creating a classic EU [PASS] vs. US FDA [VIOLATION] structural mismatch.
   - Methylisothiazolinone (MIT) is BANNED (0 ppm) in all leave-on cosmetics (Annex V, Entry 57) and restricted to 15 ppm in rinse-off products.
   - Thioglycolic Acid is restricted to max 2.0% for professional rinse-off eyelash waving only (Annex III, Entry 2a); consumer leave-on periorbital use is a [VIOLATION].
   - Cyclopentasiloxane (D5) is restricted to < 0.1% (1,000 ppm) in leave-on cosmetics under EU Reg 2024/1328.
   - Ext. D&C Violet No. 2 / Acid Violet 43 (CI 60730) is permitted up to 0.5% (5,000 ppm) in non-oxidative hair toning products (Annex IV, Entry 97).

4. MODERN BEAUTY FOUNDER ETHOS (Inspired by Alexis Eizinas of Silvering — Authority Magazine's 5 Pillars):
   - Evaluate whether the brand offers a purposeful, safe niche formulation (e.g., translucent silver/gray hair & maturing scalp care), communicates positively and upliftingly with consumers (no fear/shame anti-aging copy), filters claims through an authentic mission, and avoids greenwashing or illegal drug claims.

5. URL AUDIT vs. DISTINCT COMPLIANT BRAND VARIANT GENERATION:
   - If urlMode is "generate-distinct-brand", take the reference product URL or input formulation and synthesize a SIMILAR-BUT-DISTINCT, 100% COMPLIANT brand concept: create an original, unique, poetic brandName that NEVER starts with "Maison" (e.g., use distinctive modern luxury names like "SÉRÉNITÉ BOTANIQUE", "VELOURS D’AURORE", "NACRE & PÉTALE", "OPALINE STUDIO", "CÉLESTE LABORATORY", "SOLSTICE FLORA", "VESPERA BEAUTÉ", or a creative name tailored to the input keywords), a distinctive productTitle, a bespoke Argon 3D vessel configuration (procedural3DModel), positive mission-aligned claims, and replace any [VIOLATION] ingredients (such as Red 28 in eye palettes or PTFE in primers) with safe, globally compliant substitutes (such as Carmine/Manganese Violet/Synthetic Fluorphlogopite or Boron Nitride/Caprylyl Methicone) so every row in matrixRows achieves [PASS] across US FDA, California, and the EU.`;

const jurisdictionVerdictSchema = {
  type: Type.OBJECT,
  properties: {
    status: { type: Type.STRING, description: 'Must be strictly "PASS" or "VIOLATION"' },
    citation: { type: Type.STRING },
    maxThreshold: { type: Type.STRING },
    justification: { type: Type.STRING },
  },
  required: ['status', 'citation', 'maxThreshold', 'justification'],
};

const complianceResponseSchema = {
  type: Type.OBJECT,
  properties: {
    presetId: { type: Type.STRING },
    auditTimestamp: { type: Type.STRING },
    modelEngine: { type: Type.STRING },
    productName: { type: Type.STRING },
    productCategory: { type: Type.STRING },
    overallStatus: { type: Type.STRING, description: 'Strictly "PASS" or "VIOLATION"' },
    summaryHeadline: { type: Type.STRING },
    brandTwin3D: {
      type: Type.OBJECT,
      properties: {
        vesselArchetype: {
          type: Type.STRING,
          description: 'Strictly one of: "pressed-palette", "dropper-serum", "airless-pump"',
        },
        brandName: { type: Type.STRING },
        productTitle: { type: Type.STRING },
        subtitle: { type: Type.STRING },
        batchCode: { type: Type.STRING },
        netWeightLabel: { type: Type.STRING },
        primaryColorHex: { type: Type.STRING },
        secondaryColorHex: { type: Type.STRING },
        accentColorHex: { type: Type.STRING },
        pigmentOrLiquidHex: { type: Type.STRING },
        palettePanColorsHex: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        metallicFinish: {
          type: Type.STRING,
          description: 'Strictly one of: "platinum", "gold", "obsidian"',
        },
        glassTransmission: { type: Type.NUMBER },
        hasPeelOffStickerTrap: { type: Type.BOOLEAN },
        peelOffOuterGraphicTitle: { type: Type.STRING },
        peelOffBuriedWarningText: { type: Type.STRING },
        frontPanelClaims: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        videoIngestionSummary: { type: Type.STRING },
        procedural3DModel: {
          type: Type.OBJECT,
          properties: {
            generatedByModel: { type: Type.STRING },
            modelTitle: { type: Type.STRING },
            architecturalNotes: { type: Type.STRING },
            silhouetteFamily: { type: Type.STRING },
            latheProfilePoints: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  r: { type: Type.NUMBER },
                  y: { type: Type.NUMBER },
                },
                required: ['r', 'y'],
              },
            },
            latheSegments: { type: Type.NUMBER },
            latheMaterialType: { type: Type.STRING },
            latheColorHex: { type: Type.STRING },
            customPrimitives: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  partName: { type: Type.STRING },
                  geometryType: { type: Type.STRING },
                  dimensions: {
                    type: Type.ARRAY,
                    items: { type: Type.NUMBER },
                  },
                  radialSegments: { type: Type.NUMBER },
                  position: {
                    type: Type.ARRAY,
                    items: { type: Type.NUMBER },
                  },
                  rotation: {
                    type: Type.ARRAY,
                    items: { type: Type.NUMBER },
                  },
                  scale: {
                    type: Type.ARRAY,
                    items: { type: Type.NUMBER },
                  },
                  materialType: { type: Type.STRING },
                  colorHex: { type: Type.STRING },
                  roughness: { type: Type.NUMBER },
                  metalness: { type: Type.NUMBER },
                  transmission: { type: Type.NUMBER },
                },
                required: [
                  'partName',
                  'geometryType',
                  'dimensions',
                  'position',
                  'materialType',
                  'colorHex',
                ],
              },
            },
            frontPlaquePosition: {
              type: Type.ARRAY,
              items: { type: Type.NUMBER },
            },
            backPlaquePosition: {
              type: Type.ARRAY,
              items: { type: Type.NUMBER },
            },
          },
          required: [
            'generatedByModel',
            'modelTitle',
            'architecturalNotes',
            'silhouetteFamily',
            'customPrimitives',
          ],
        },
      },
      required: [
        'vesselArchetype',
        'brandName',
        'productTitle',
        'subtitle',
        'batchCode',
        'netWeightLabel',
        'primaryColorHex',
        'secondaryColorHex',
        'accentColorHex',
        'pigmentOrLiquidHex',
        'palettePanColorsHex',
        'metallicFinish',
        'glassTransmission',
        'hasPeelOffStickerTrap',
        'peelOffOuterGraphicTitle',
        'peelOffBuriedWarningText',
        'frontPanelClaims',
        'procedural3DModel',
      ],
    },
    urlRemixMetadata: {
      type: Type.OBJECT,
      properties: {
        sourceUrl: { type: Type.STRING },
        mode: { type: Type.STRING },
        originalBrandSummary: { type: Type.STRING },
        differentiationStrategy: { type: Type.STRING },
        substitutedIngredients: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              replaced: { type: Type.STRING },
              replacement: { type: Type.STRING },
              reason: { type: Type.STRING },
            },
            required: ['replaced', 'replacement', 'reason'],
          },
        },
      },
      required: ['mode', 'substitutedIngredients'],
    },
    matrixRows: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          ingredientName: { type: Type.STRING },
          inciName: { type: Type.STRING },
          casNumber: { type: Type.STRING },
          roleInFormulation: { type: Type.STRING },
          concentrationPpm: { type: Type.NUMBER },
          concentrationPercent: { type: Type.STRING },
          usFda: jurisdictionVerdictSchema,
          california: jurisdictionVerdictSchema,
          eu: jurisdictionVerdictSchema,
        },
        required: [
          'id',
          'ingredientName',
          'inciName',
          'casNumber',
          'roleInFormulation',
          'concentrationPpm',
          'concentrationPercent',
          'usFda',
          'california',
          'eu',
        ],
      },
    },
    artworkLinting: {
      type: Type.OBJECT,
      properties: {
        overallArtworkStatus: { type: Type.STRING },
        frontPanelHeader: { type: Type.STRING },
        frontPanelSubclaim: { type: Type.STRING },
        backPanelSurfaceText: { type: Type.STRING },
        buriedPeelOffWarningText: { type: Type.STRING },
        isBehindPeelOffLayer: { type: Type.BOOLEAN },
        warningFontSizePt: { type: Type.NUMBER },
        requiredMinFontSizePt: { type: Type.NUMBER },
        contrastRatio: { type: Type.NUMBER },
        requiredMinContrastRatio: { type: Type.NUMBER },
        silveringMissionAlignment: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING },
            toneScore: { type: Type.STRING },
            positiveMessagingAssessment: { type: Type.STRING },
            drugClaimCrossoverCheck: { type: Type.STRING },
          },
          required: [
            'status',
            'toneScore',
            'positiveMessagingAssessment',
            'drugClaimCrossoverCheck',
          ],
        },
        alerts: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              severity: { type: Type.STRING },
              jurisdiction: { type: Type.STRING },
              regulationCitation: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              panelZone: { type: Type.STRING },
              remediationAction: { type: Type.STRING },
            },
            required: [
              'id',
              'severity',
              'jurisdiction',
              'regulationCitation',
              'title',
              'description',
              'panelZone',
              'remediationAction',
            ],
          },
        },
      },
      required: [
        'overallArtworkStatus',
        'frontPanelHeader',
        'frontPanelSubclaim',
        'backPanelSurfaceText',
        'buriedPeelOffWarningText',
        'isBehindPeelOffLayer',
        'warningFontSizePt',
        'requiredMinFontSizePt',
        'contrastRatio',
        'requiredMinContrastRatio',
        'silveringMissionAlignment',
        'alerts',
      ],
    },
    mocraDossier: {
      type: Type.OBJECT,
      properties: {
        dossierId: { type: Type.STRING },
        submissionWindowStatus: { type: Type.STRING },
        fdaFormReference: { type: Type.STRING },
        responsiblePersonEntity: { type: Type.STRING },
        facilityFeiNumber: { type: Type.STRING },
        batchNumber: { type: Type.STRING },
        incidentSeverityClassification: { type: Type.STRING },
        patientAnonymizedProfiles: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              patientCode: { type: Type.STRING },
              ageGroupAndDemographics: { type: Type.STRING },
              exposureTimeline: { type: Type.STRING },
              clinicalPresentation: { type: Type.STRING },
              emergencyInterventionRequired: { type: Type.STRING },
              outcomeStatus: { type: Type.STRING },
            },
            required: [
              'patientCode',
              'ageGroupAndDemographics',
              'exposureTimeline',
              'clinicalPresentation',
              'emergencyInterventionRequired',
              'outcomeStatus',
            ],
          },
        },
        chronologicalStabilityMapping: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              timestamp: { type: Type.STRING },
              phase: { type: Type.STRING },
              phAndViscosityReading: { type: Type.STRING },
              contaminantOrDegradationFinding: { type: Type.STRING },
              disposition: { type: Type.STRING },
            },
            required: [
              'timestamp',
              'phase',
              'phAndViscosityReading',
              'contaminantOrDegradationFinding',
              'disposition',
            ],
          },
        },
        toxicologicalHazardAssessment: {
          type: Type.OBJECT,
          properties: {
            primaryCausativeAgent: { type: Type.STRING },
            mechanisticPathway: { type: Type.STRING },
            noaelComparison: { type: Type.STRING },
            dermalAndOcularMarginOfSafety: { type: Type.STRING },
            regulatoryTriggerCitation: { type: Type.STRING },
          },
          required: [
            'primaryCausativeAgent',
            'mechanisticPathway',
            'noaelComparison',
            'dermalAndOcularMarginOfSafety',
            'regulatoryTriggerCitation',
          ],
        },
        clinicalInterviewTemplates: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              sectionCode: { type: Type.STRING },
              clinicianPrompt: { type: Type.STRING },
              mandatoryDataFields: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['sectionCode', 'clinicianPrompt', 'mandatoryDataFields'],
          },
        },
        compiledMarkdownDocument: { type: Type.STRING },
      },
      required: [
        'dossierId',
        'submissionWindowStatus',
        'fdaFormReference',
        'responsiblePersonEntity',
        'facilityFeiNumber',
        'batchNumber',
        'incidentSeverityClassification',
        'patientAnonymizedProfiles',
        'chronologicalStabilityMapping',
        'toxicologicalHazardAssessment',
        'clinicalInterviewTemplates',
        'compiledMarkdownDocument',
      ],
    },
  },
  required: [
    'presetId',
    'auditTimestamp',
    'modelEngine',
    'productName',
    'productCategory',
    'overallStatus',
    'summaryHeadline',
    'brandTwin3D',
    'urlRemixMetadata',
    'matrixRows',
    'artworkLinting',
    'mocraDossier',
  ],
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ComplianceAuditPayload;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            'GEMINI_API_KEY is not configured on the server. Please verify your API key in Settings > Secrets.',
        },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const parts: Array<
      | { text: string }
      | { inlineData: { mimeType: string; data: string } }
    > = [];

    if (body.videoFramesBase64 && body.videoFramesBase64.length > 0) {
      for (const frame of body.videoFramesBase64.slice(0, 4)) {
        const cleanBase64 = frame.data.replace(/^data:[^;]+;base64,/, '');
        if (cleanBase64) {
          parts.push({
            inlineData: {
              mimeType: frame.mimeType || 'image/jpeg',
              data: cleanBase64,
            },
          });
        }
      }
    }

    const userPrompt = `Perform a comprehensive multi-jurisdictional cosmetic compliance audit, 3D Brand Twin spatial synthesis, packaging prominence linting, and 15-day MoCRA Adverse Event Dossier generation for the following payload:

- Preset / Audit Context: ${body.presetId || 'custom'}
- URL Ingestion Mode: ${body.urlMode || 'none'}
- Reference Product URL: ${body.sourceProductUrl || 'N/A'}
- Product Name: ${body.productName || 'Custom Cosmetic Formulation'}
- Product Category: ${body.productCategory || 'eye-area'}
- 3D Brand & Vessel Prompt: ${body.brandPrompt || 'Synthesize an appropriate 3D vessel (pressed-palette, dropper-serum, or airless-pump) matching the formulation and claims.'}
- Raw Formulation / INCI & PPM Concentrations:
${body.formulationRaw}

- Packaging Artwork & Layer Metadata:
${JSON.stringify(body.artworkMetadata || {}, null, 2)}

- Consumer Support & Adverse Event Logs:
${body.adverseEventLogs || 'No acute emergency room events reported; generate a complete MoCRA Section 608 safety substantiation and readiness packet.'}

${
  body.urlMode === 'generate-distinct-brand'
    ? `CRITICAL INSTRUCTION FOR "generate-distinct-brand" MODE:
The user wants to create a SIMILAR-BUT-DISTINCT, 100% COMPLIANT brand and formulation inspired by "${body.sourceProductUrl || body.productName}".
1. Create a fresh, legally distinct, unique brandName and productTitle inspired by the specific product/URL keywords. Do NOT start brandName with "Maison" — invent a unique, memorable feminine luxury brand name each time.
2. Replace every non-compliant or high-risk ingredient (such as D&C Red No. 28 in eye area, PTFE, Perfluorononyl Dimethicone, MIT, or unbuffered Thioglycolic Acid) with safe, globally compliant substitutes (such as Carmine CI 75470, Manganese Violet CI 77742, Synthetic Fluorphlogopite, Boron Nitride, Caprylyl Methicone, or Acid Violet 43 at 1,200 ppm) and list all substitutions in urlRemixMetadata.substitutedIngredients.
3. Ensure the resulting matrixRows and artworkLinting achieve "PASS" across US FDA, California, and the EU, with zero peel-off warning traps and positive, uplifting Silvering-aligned claims.`
    : ''
}

Ensure compiledMarkdownDocument in mocraDossier is a rich, multi-section formal regulatory packet (minimum 350 words) with Markdown headings, tables, and clinical follow-up checklists.`;

    parts.push({ text: userPrompt });

    const response = await ai.models.generateContent({
      model: 'gemini-4-argon',
      contents: { parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: complianceResponseSchema,
        temperature: 0.2,
      },
    });

    const rawText = response.text;
    if (!rawText) {
      throw new Error('Empty response returned from Gemini 4 Argon.');
    }

    const parsed = JSON.parse(rawText.trim()) as ComplianceAuditResult;
    parsed.auditTimestamp = new Date().toISOString();
    parsed.modelEngine = 'models/gemini-4-argon (Live Server Audit)';

    return NextResponse.json(parsed);
  } catch (error: unknown) {
    const errMsg =
      error instanceof Error ? error.message : 'Unexpected compliance engine error';
    console.error('[/api/compliance] Gemini 4 Argon error:', errMsg);

    return NextResponse.json(
      {
        error: errMsg,
        fallbackPresetAvailable: Object.keys(DETERMINISTIC_PRESET_RESULTS),
      },
      { status: 500 }
    );
  }
}
