import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import { ArgonProcedural3DModel } from '@/lib/compliance-data';

const ARGON_3D_SYSTEM_INSTRUCTION = `You are OpenCompact's 3D Luxury Cosmetic Industrial Designer powered by Gemini 4 Argon (models/gemini-4-argon).
Your job is to generate a bespoke, physically grounded, multi-part Three.js 3D packaging model ("ArgonProcedural3DModel") for a prestige feminine cosmetic product or URL remix.

DESIGN & SPATIAL RULES (CRITICAL FOR THREE.JS RENDERING):
1. Coordinate System:
   - Y is up. The vanity pedestal sits at Y = -1.35.
   - Your 3D vessel assembly must sit between Y = -1.28 (base) and Y = +1.65 (top finial/cap), centered around X = 0, Z = 0.
   - Radius/width in X and Z should stay within [-1.45, +1.45] so the vessel fits gracefully on the travertine pedestal.
2. Multi-Part Couture Hierarchy (Generate 6 to 10 distinct parts in customPrimitives):
   - Never output a single plain box or cylinder. Combine 6 to 10 architectural parts:
     a) Primary Hull / Base (e.g., 6/8/12-sided fluted porcelain compact, sculpted cushion case, tiered crystal jar, or revolved lathe amphora).
     b) Secondary Gallery / Rim / Collar (e.g., brushed rose-gold torus rings, stepped metallic collars, hinged mirror lid at rotation [1.05, 0, 0] and position [0, 0.78, -0.95]).
     c) Inner Formulation / Shade Elements (e.g., petal-arranged silk pigment pans, whipped emulsion dome, suspended botanical pearl capsule, or beveled lipstick bullet cone).
     d) Crown Finial / Gem Clasp (e.g., faceted octahedron or dodecahedron crystal gem stopper, pearl sphere finial).
3. Optional Lathe Profile (latheProfilePoints):
   - If designing a sculpted bottle, elixir flacon, amphora, or curved jar, provide 6 to 9 { r, y } points (with 0.01 <= r <= 1.05 and -1.25 <= y <= 1.05, ordered from bottom y to top y) so Three.js LatheGeometry revolves a bespoke curved couture silhouette.
   - If designing an open compact or multi-pan palette, leave latheProfilePoints empty ([]) so the open pans and hinged mirror are unobstructed.
4. Feminine Parisian Palette:
   - Use soft porcelain, peony blush (#F9E8EC, #F4B2C1), champagne silk (#F7EFE8), camellia lilac (#F3ECF8), rose-gold (#E6B99C, #C86D7E), and translucent crystal.`;

const argonProcedural3DSchema = {
  type: Type.OBJECT,
  properties: {
    generatedByModel: { type: Type.STRING },
    modelTitle: { type: Type.STRING },
    architecturalNotes: { type: Type.STRING },
    silhouetteFamily: {
      type: Type.STRING,
      description:
        'Strictly one of: "octagonal-couture-compact", "round-cushion-compact", "amphora-lathe-flacon", "faceted-camellia-jar", "fluted-lipstick-tower", "custom-argon-assembly"',
    },
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
    latheMaterialType: {
      type: Type.STRING,
      description: 'Strictly one of: "porcelain", "frosted-glass", "metallic"',
    },
    latheColorHex: { type: Type.STRING },
    customPrimitives: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          partName: { type: Type.STRING },
          geometryType: {
            type: Type.STRING,
            description:
              'Strictly one of: "cylinder", "box", "sphere", "torus", "octahedron", "dodecahedron", "cone", "capsule", "ring"',
          },
          dimensions: {
            type: Type.ARRAY,
            items: { type: Type.NUMBER },
            description: 'Exactly 3 numbers [dim1, dim2, dim3]',
          },
          radialSegments: { type: Type.NUMBER },
          position: {
            type: Type.ARRAY,
            items: { type: Type.NUMBER },
            description: 'Exactly 3 numbers [x, y, z]',
          },
          rotation: {
            type: Type.ARRAY,
            items: { type: Type.NUMBER },
            description: 'Exactly 3 numbers [rx, ry, rz] in radians',
          },
          scale: {
            type: Type.ARRAY,
            items: { type: Type.NUMBER },
            description: 'Exactly 3 numbers [sx, sy, sz]',
          },
          materialType: {
            type: Type.STRING,
            description:
              'Strictly one of: "porcelain", "metallic", "frosted-glass", "pigment-silk", "crystal-gem"',
          },
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
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      prompt,
      brandName,
      productTitle,
      primaryColorHex,
      secondaryColorHex,
      accentColorHex,
      palettePanColorsHex,
    } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured on the server.' },
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

    const userPrompt = `Generate a bespoke, original multi-part 3D cosmetic vessel assembly ("ArgonProcedural3DModel") for:
- Design Brief / Source URL: ${prompt || 'Luxury Parisian Refillable Cosmetic Vessel'}
- Brand House: ${brandName || 'SÉRÉNITÉ BOTANIQUE'}
- Product Title: ${productTitle || 'SOIE DE PIVOINE'}
- Primary Porcelain Hex: ${primaryColorHex || '#F9E8EC'}
- Secondary Blush Hex: ${secondaryColorHex || '#F2D2D9'}
- Rose-Gold / Gem Accent Hex: ${accentColorHex || '#C86D7E'}
- Shade Swatches Hex List: ${JSON.stringify(palettePanColorsHex || ['#E3738B', '#F4B2C1', '#D98A9C', '#E6C095'])}

Create a visually striking, unmistakable 3D silhouette with 6 to 10 parts in customPrimitives (and latheProfilePoints if it is a bottle, flacon, amphora, or sculpted jar). Ensure all dimensions are positive and positions sit gracefully between Y = -1.25 and Y = +1.60.`;

    const response = await ai.models.generateContent({
      model: 'gemini-4-argon',
      contents: userPrompt,
      config: {
        systemInstruction: ARGON_3D_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: argonProcedural3DSchema,
        temperature: 0.55,
      },
    });

    const rawText = response.text;
    if (!rawText) {
      throw new Error('Empty 3D model response from Gemini 4 Argon');
    }

    const parsed = JSON.parse(rawText.trim()) as ArgonProcedural3DModel;
    parsed.generatedByModel = 'models/gemini-4-argon (Live 3D CAD Synthesis)';

    return NextResponse.json({ procedural3DModel: parsed });
  } catch (error: unknown) {
    const errMsg =
      error instanceof Error ? error.message : 'Failed to generate Argon 3D model';
    console.error('[/api/argon-3d] Gemini 4 Argon error:', errMsg);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
