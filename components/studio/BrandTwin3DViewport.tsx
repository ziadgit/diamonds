'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { BrandTwin3DSpec, ArtworkLintingReport } from '@/lib/compliance-data';
import { Eye, Layers, RotateCcw, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface BrandTwin3DViewportProps {
  spec: BrandTwin3DSpec;
  linting: ArtworkLintingReport;
  peelAmount: number;
  onPeelAmountChange: (val: number) => void;
  onVesselArchetypeChange?: (archetype: 'pressed-palette' | 'dropper-serum' | 'airless-pump') => void;
}

function createFrontLabelTexture(
  spec: BrandTwin3DSpec,
  maxAnisotropy: number
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Soft Silk Porcelain / Custom Brand Background
  ctx.fillStyle = '#FFFDFB';
  ctx.fillRect(0, 0, 1024, 1024);

  // Subtle pastel tint wash from brand primary color
  ctx.fillStyle = spec.primaryColorHex || '#F9E8EC';
  ctx.globalAlpha = 0.28;
  ctx.fillRect(0, 0, 1024, 1024);
  ctx.globalAlpha = 1.0;

  // Double Couture Rose-Gold Frame Border
  ctx.strokeStyle = spec.accentColorHex || '#C86D7E';
  ctx.lineWidth = 12;
  ctx.strokeRect(48, 48, 928, 928);

  ctx.strokeStyle = '#D8B4A6';
  ctx.lineWidth = 3;
  ctx.strokeRect(72, 72, 880, 880);

  // Maison Header
  ctx.fillStyle = '#8E5B65';
  ctx.font = '600 32px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText((spec.brandName || 'MAISON OPENCOMPACT').toUpperCase(), 512, 175);

  // Delicate Rose-Gold Ornamental Divider
  ctx.fillStyle = spec.accentColorHex || '#C86D7E';
  ctx.fillRect(382, 205, 260, 4);

  // Product Title in Editorial Serif
  ctx.fillStyle = '#281E1C';
  ctx.font = '700 54px Georgia, serif';
  const titleWords = (spec.productTitle || 'SOIE DE PIVOINE').split(' ');
  const line1 = titleWords.slice(0, 2).join(' ');
  const line2 = titleWords.slice(2).join(' ');
  ctx.fillText(line1, 512, 295);
  if (line2) {
    ctx.fillText(line2, 512, 362);
  }

  // Subtitle
  ctx.fillStyle = '#786662';
  ctx.font = 'italic 30px Georgia, serif';
  ctx.fillText(spec.subtitle || 'Haute Formulation · Paris & New York', 512, 430);

  // Claims Cartouche Box
  ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
  ctx.fillRect(110, 490, 804, 235);
  ctx.strokeStyle = '#E4D3CD';
  ctx.lineWidth = 3;
  ctx.strokeRect(110, 490, 804, 235);

  const claims = spec.frontPanelClaims?.length
    ? spec.frontPanelClaims
    : ['CLINICALLY EVALUATED CLEAN FORMULATION', 'VERIFIED BY OPENCOMPACT ATELIER'];

  ctx.fillStyle = '#3D2E2B';
  ctx.font = '600 26px sans-serif';
  claims.slice(0, 2).forEach((claim, idx) => {
    const truncated = claim.length > 44 ? claim.slice(0, 44) + '...' : claim;
    ctx.fillText(truncated, 512, 575 + idx * 68);
  });

  // Batch & Net Weight Footer
  ctx.fillStyle = '#8E5B65';
  ctx.font = '600 26px monospace';
  ctx.fillText(`${spec.batchCode}  ·  ${spec.netWeightLabel}`, 512, 860);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  texture.needsUpdate = true;
  return texture;
}

function createBackUnderneathWarningTexture(
  spec: BrandTwin3DSpec,
  linting: ArtworkLintingReport,
  maxAnisotropy: number
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  const isViolation = linting.overallArtworkStatus === 'VIOLATION' || spec.hasPeelOffStickerTrap;

  ctx.fillStyle = isViolation ? '#FFF1F2' : '#F2FBF7';
  ctx.fillRect(0, 0, 1024, 1024);

  ctx.strokeStyle = isViolation ? '#E11D48' : '#10B981';
  ctx.lineWidth = 14;
  ctx.strokeRect(36, 36, 952, 952);

  // Header badge
  ctx.fillStyle = isViolation ? '#BE123C' : '#059669';
  ctx.fillRect(80, 80, 864, 92);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 32px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    isViolation
      ? 'BURIED LAYER REVEALED — 21 CFR 701.2 VIOLATION'
      : 'PRIMARY COMPLIANCE PANEL — 21 CFR 701.2 PASS',
    512,
    138
  );

  // Warning text block
  ctx.fillStyle = '#281E1C';
  ctx.font = '700 34px Georgia, serif';
  const warningStr =
    spec.peelOffBuriedWarningText ||
    linting.buriedPeelOffWarningText ||
    'FOR EXTERNAL COSMETIC USE ONLY.';

  const words = warningStr.split(' ');
  let line = '';
  let y = 275;
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    if (testLine.length > 34 && i > 0) {
      ctx.fillText(line.trim(), 512, y);
      line = words[i] + ' ';
      y += 52;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), 512, y);

  // Telemetry readout box
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(80, 560, 864, 340);
  ctx.strokeStyle = isViolation ? '#FECDD3' : '#A7F3D0';
  ctx.lineWidth = 4;
  ctx.strokeRect(80, 560, 864, 340);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#3D2E2B';
  ctx.font = '600 28px monospace';
  ctx.fillText(
    `FONT SIZE: ${linting.warningFontSizePt} pt (Statutory Min: ${linting.requiredMinFontSizePt} pt)`,
    120,
    635
  );
  ctx.fillText(
    `CONTRAST:  ${linting.contrastRatio}:1 (Statutory Min: ${linting.requiredMinContrastRatio}:1)`,
    120,
    705
  );
  ctx.fillText(
    `PEEL TRAP: ${spec.hasPeelOffStickerTrap ? 'HIDDEN UNDER ADHESIVE FLAP' : 'NONE (DIRECT OUTER PRINT)'}`,
    120,
    775
  );
  ctx.fillStyle = isViolation ? '#BE123C' : '#047857';
  ctx.fillText(`LOT ID:    ${spec.batchCode}`, 120, 845);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  texture.needsUpdate = true;
  return texture;
}

function createPeelOffOuterStickerTexture(
  spec: BrandTwin3DSpec,
  maxAnisotropy: number
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#FAF3F0';
  ctx.fillRect(0, 0, 1024, 1024);

  ctx.strokeStyle = '#D8B4A6';
  ctx.lineWidth = 10;
  ctx.strokeRect(30, 30, 964, 964);

  // Corner peel indicator
  ctx.fillStyle = '#C86D7E';
  ctx.beginPath();
  ctx.moveTo(760, 30);
  ctx.lineTo(994, 30);
  ctx.lineTo(994, 264);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 26px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('PEEL CORNER ↗', 865, 100);

  ctx.fillStyle = '#281E1C';
  ctx.font = '700 38px Georgia, serif';
  ctx.fillText('OUTER ADHESIVE LABEL LAYER', 512, 240);

  ctx.fillStyle = '#8E5B65';
  ctx.font = 'italic 28px Georgia, serif';
  const title = spec.peelOffOuterGraphicTitle || 'PEEL HERE FOR MULTILINGUAL SAFETY & INCI';
  ctx.fillText(title.slice(0, 42), 512, 320);

  // Decorative barcode & marketing filler covering the warning underneath
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(120, 400, 784, 220);
  ctx.strokeStyle = '#EADCD7';
  ctx.lineWidth = 2;
  ctx.strokeRect(120, 400, 784, 220);
  ctx.fillStyle = '#5C4A47';
  ctx.font = '500 25px monospace';
  ctx.fillText('DIST. BY ' + (spec.brandName || 'MAISON OPENCOMPACT'), 512, 475);
  ctx.fillText('PARIS · NEW YORK · 12M PAO · RECYCLABLE VESSEL', 512, 540);

  // Simulated barcode bars
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(280, 680, 464, 160);
  ctx.fillStyle = '#281E1C';
  for (let x = 305; x < 720; x += 18) {
    const w = x % 36 === 0 ? 10 : 5;
    ctx.fillRect(x, 700, w, 120);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  texture.needsUpdate = true;
  return texture;
}

export function BrandTwin3DViewport({
  spec,
  linting,
  peelAmount,
  onPeelAmountChange,
  onVesselArchetypeChange,
}: BrandTwin3DViewportProps) {
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [cameraPreset, setCameraPreset] = useState<'front' | 'back' | 'orbit'>('front');

  // Mutable refs for the WebGL loop so React state never tears down the canvas
  const stateRef = useRef({
    peelAmount,
    targetPeel: peelAmount / 100,
    currentPeel: peelAmount / 100,
    cameraPreset: 'front' as 'front' | 'back' | 'orbit',
    targetCamPos: new THREE.Vector3(0, 0.8, 4.6),
    targetLookAt: new THREE.Vector3(0, 0.1, 0),
    activeTransition: false,
  });

  useEffect(() => {
    stateRef.current.peelAmount = peelAmount;
    stateRef.current.targetPeel = peelAmount / 100;
  }, [peelAmount]);

  const triggerCameraView = (view: 'front' | 'back' | 'orbit') => {
    setCameraPreset(view);
    stateRef.current.cameraPreset = view;
    stateRef.current.activeTransition = true;
    if (view === 'front') {
      stateRef.current.targetCamPos.set(0, 0.65, 4.5);
    } else if (view === 'back') {
      stateRef.current.targetCamPos.set(0, 0.55, -4.5);
    } else {
      stateRef.current.targetCamPos.set(3.2, 1.8, 3.6);
    }
  };

  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    // Detect software WebGL per threejs skill guidelines
    const isSoftwareGl = (() => {
      const probeCanvas = document.createElement('canvas');
      const gl = probeCanvas.getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 460;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#F7EFEA');
    scene.fog = new THREE.FogExp2('#F7EFEA', 0.035);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.65, 4.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Studio Environment Reflection (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    // Sunlit Parisian Vanity Studio Lighting
    const hemiLight = new THREE.HemisphereLight(0xfffcf9, 0xeadcd7, 1.05);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.0);
    keyLight.position.set(4, 6, 5);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xf4b2c1, 1.25);
    rimLight.position.set(-4, 3, -5);
    scene.add(rimLight);

    // Warm Porcelain Travertine Vanity Pedestal
    const pedestalGroup = new THREE.Group();
    const pedestalGeo = new THREE.CylinderGeometry(2.1, 2.25, 0.14, 48);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0xfffdfb,
      roughness: 0.28,
      metalness: 0.15,
    });
    const pedestalMesh = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestalMesh.position.y = -1.42;
    pedestalMesh.receiveShadow = true;
    pedestalGroup.add(pedestalMesh);

    const ringGeo = new THREE.RingGeometry(1.92, 1.98, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: linting.overallArtworkStatus === 'VIOLATION' ? 0xe11d48 : 0xd49b94,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = -1.34;
    pedestalGroup.add(ringMesh);
    scene.add(pedestalGroup);

    // Procedural Textures
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    const frontTex = createFrontLabelTexture(spec, maxAnisotropy);
    const backUnderTex = createBackUnderneathWarningTexture(spec, linting, maxAnisotropy);
    const peelOuterTex = createPeelOffOuterStickerTexture(spec, maxAnisotropy);

    // Metallic finish helper (Rose-Gold / Champagne Gold / Platinum)
    const metalColor =
      spec.metallicFinish === 'gold'
        ? 0xe6b99c
        : spec.metallicFinish === 'platinum'
        ? 0xede6e3
        : 0xd49b94;

    const metalMat = new THREE.MeshPhysicalMaterial({
      color: metalColor,
      metalness: 0.88,
      roughness: 0.16,
      anisotropy: 0.75,
      clearcoat: 0.65,
    });

    const bodyPrimaryMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(spec.primaryColorHex || '#F9E8EC'),
      roughness: 0.3,
      metalness: 0.12,
    });

    // Root Product Composite Group (5-11 distinct parts)
    const productRoot = new THREE.Group();
    scene.add(productRoot);

    // Subdivided Peel-Off Sticker Geometry for smooth 3D curl deformation
    const peelGeo = new THREE.PlaneGeometry(1.45, 1.45, 24, 1);
    const peelPosAttr = peelGeo.attributes.position;
    const basePeelX = new Float32Array(peelPosAttr.count);
    for (let i = 0; i < peelPosAttr.count; i++) {
      basePeelX[i] = peelPosAttr.getX(i);
    }

    const peelStickerMat = new THREE.MeshStandardMaterial({
      map: peelOuterTex,
      roughness: 0.35,
      metalness: 0.1,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    });

    const backUnderMat = new THREE.MeshStandardMaterial({
      map: backUnderTex,
      roughness: 0.3,
      metalness: 0.1,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });

    const frontLabelMat = new THREE.MeshStandardMaterial({
      map: frontTex,
      roughness: 0.28,
      metalness: 0.15,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });

    let peelBaseZ = -0.22;

    if (spec.vesselArchetype === 'pressed-palette') {
      // COMPOSITE MODEL 1: 9-PAN COSMETIC COMPACT PALETTE (11 distinct parts)
      peelBaseZ = -0.18;

      // Part 1: Lower Compact Case Hull
      const baseBox = new THREE.Mesh(new THREE.BoxGeometry(2.3, 2.3, 0.28), bodyPrimaryMat);
      baseBox.castShadow = true;
      productRoot.add(baseBox);

      // Part 2: Brushed Metallic Pan Deck Insert
      const deckInsert = new THREE.Mesh(new THREE.BoxGeometry(2.12, 2.12, 0.06), metalMat);
      deckInsert.position.set(0, 0, 0.13);
      productRoot.add(deckInsert);

      // Parts 3..11: 9 Individual Pressed Pigment Pans (3x3 Grid)
      const panColors =
        spec.palettePanColorsHex && spec.palettePanColorsHex.length > 0
          ? spec.palettePanColorsHex
          : ['#FF1493', '#EC4899', '#D946EF', '#A855F7', '#F43F5E', '#FB7185', '#7C3AED', '#E11D48', '#F472B6'];

      let panIdx = 0;
      for (let row = -1; row <= 1; row++) {
        for (let col = -1; col <= 1; col++) {
          const panWell = new THREE.Mesh(
            new THREE.BoxGeometry(0.54, 0.54, 0.05),
            new THREE.MeshStandardMaterial({
              color: new THREE.Color(panColors[panIdx % panColors.length]),
              roughness: 0.32 + (panIdx % 3) * 0.15,
              metalness: 0.15,
            })
          );
          panWell.position.set(col * 0.64, row * 0.64, 0.16);
          productRoot.add(panWell);
          panIdx++;
        }
      }

      // Part 12: Hinged Upper Lid + Optical Mirror + Front Brand Plaque
      const lidGroup = new THREE.Group();
      lidGroup.position.set(0, 1.15, 0.14);
      lidGroup.rotation.x = -0.42; // Slightly angled up to showcase both front plaque & pans

      const lidSlab = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.12, 1.15), bodyPrimaryMat);
      lidSlab.position.set(0, 0.06, -0.55);
      lidGroup.add(lidSlab);

      const frontPlaque = new THREE.Mesh(new THREE.PlaneGeometry(1.85, 0.92), frontLabelMat);
      frontPlaque.rotation.x = -Math.PI / 2;
      frontPlaque.position.set(0, 0.125, -0.55);
      lidGroup.add(frontPlaque);

      productRoot.add(lidGroup);

      // Part 13: Front Clasp Accent
      const clasp = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.12, 0.32), metalMat);
      clasp.position.set(0, -1.16, 0.02);
      productRoot.add(clasp);

      // Front lower badge plate so Front Camera also reads the brand clearly
      const frontPlate = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.35), frontLabelMat);
      frontPlate.position.set(0, -0.95, 0.155);
      productRoot.add(frontPlate);

      // Back Underneath Warning Panel
      const backUnderPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.52, 1.52), backUnderMat);
      backUnderPlane.rotation.y = Math.PI;
      backUnderPlane.position.set(0, 0, -0.145);
      productRoot.add(backUnderPlane);
    } else if (spec.vesselArchetype === 'airless-pump') {
      // COMPOSITE MODEL 2: AIRLESS PRIMER PUMP TUBE (7 distinct parts)
      peelBaseZ = -0.58;

      // Part 1: Main Cylindrical Satin Vessel Body
      const tubeBody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.56, 0.56, 1.95, 48),
        bodyPrimaryMat
      );
      tubeBody.position.y = -0.15;
      tubeBody.castShadow = true;
      productRoot.add(tubeBody);

      // Part 2: Lower Base Foot Ring
      const footRing = new THREE.Mesh(new THREE.CylinderGeometry(0.57, 0.57, 0.16, 48), metalMat);
      footRing.position.y = -1.18;
      productRoot.add(footRing);

      // Part 3: Brushed Metallic Shoulder Collar
      const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.57, 0.32, 48), metalMat);
      collar.position.y = 0.98;
      productRoot.add(collar);

      // Part 4: Actuated Pump Head
      const pumpHead = new THREE.Mesh(
        new THREE.CylinderGeometry(0.32, 0.36, 0.34, 36),
        bodyPrimaryMat
      );
      pumpHead.position.y = 1.28;
      productRoot.add(pumpHead);

      // Part 5: Dispensing Nozzle Spout
      const nozzle = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.42), metalMat);
      nozzle.position.set(0, 1.32, 0.28);
      productRoot.add(nozzle);

      // Part 6: Translucent Overcap Dome
      const capMat = new THREE.MeshPhysicalMaterial({
        color: 0xf8fafc,
        transparent: true,
        opacity: isSoftwareGl ? 0.28 : 0.45,
        transmission: isSoftwareGl ? 0 : 0.85,
        roughness: 0.12,
        depthWrite: false,
      });
      const overcap = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.72, 40), capMat);
      overcap.position.y = 1.26;
      overcap.renderOrder = 2;
      productRoot.add(overcap);

      // Part 7: Front & Back Label Plates
      const frontPlane = new THREE.Mesh(new THREE.PlaneGeometry(0.95, 1.45), frontLabelMat);
      frontPlane.position.set(0, -0.15, 0.57);
      productRoot.add(frontPlane);

      const backUnderPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.15, 1.45), backUnderMat);
      backUnderPlane.rotation.y = Math.PI;
      backUnderPlane.position.set(0, -0.15, -0.57);
      productRoot.add(backUnderPlane);
    } else {
      // COMPOSITE MODEL 3: FROSTED OPTICAL GLASS SERUM DROPPER BOTTLE (8 distinct parts)
      peelBaseZ = -0.66;

      // Part 1: Thick Optical Frosted Glass Outer Vessel
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xf8fafc,
        transparent: true,
        opacity: isSoftwareGl ? 0.42 : 0.88,
        transmission: isSoftwareGl ? 0 : Math.max(0.55, spec.glassTransmission || 0.82),
        roughness: 0.18,
        ior: 1.52,
        thickness: 1.2,
        clearcoat: 1.0,
        depthWrite: false,
      });
      const bottleBody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.64, 0.64, 1.65, 48),
        glassMat
      );
      bottleBody.position.y = -0.35;
      bottleBody.renderOrder = 2;
      productRoot.add(bottleBody);

      // Part 2: Heavy Glass Base Punt
      const glassBase = new THREE.Mesh(
        new THREE.CylinderGeometry(0.64, 0.62, 0.18, 48),
        metalMat
      );
      glassBase.position.y = -1.22;
      productRoot.add(glassBase);

      // Part 3: Internal Luminescent Elixir Column
      const elixirMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(spec.pigmentOrLiquidHex || '#8B5CF6'),
        roughness: 0.22,
        metalness: 0.15,
        emissive: new THREE.Color(spec.pigmentOrLiquidHex || '#8B5CF6'),
        emissiveIntensity: 0.18,
      });
      const elixirCore = new THREE.Mesh(
        new THREE.CylinderGeometry(0.54, 0.54, 1.32, 36),
        elixirMat
      );
      elixirCore.position.y = -0.42;
      productRoot.add(elixirCore);

      // Part 4: Rounded Glass Shoulder Dome
      const shoulder = new THREE.Mesh(
        new THREE.SphereGeometry(0.64, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2),
        bodyPrimaryMat
      );
      shoulder.position.y = 0.46;
      shoulder.scale.y = 0.45;
      productRoot.add(shoulder);

      // Part 5: Anisotropic Brushed Platinum/Gold Dropper Collar
      const dropperCollar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.36, 0.38, 0.42, 48),
        metalMat
      );
      dropperCollar.position.y = 0.92;
      productRoot.add(dropperCollar);

      // Part 6: Accent Knurled Ring
      const knurlRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.37, 0.035, 16, 48),
        new THREE.MeshStandardMaterial({
          color: new THREE.Color(spec.accentColorHex || '#10B981'),
          roughness: 0.25,
          metalness: 0.8,
        })
      );
      knurlRing.rotation.x = Math.PI / 2;
      knurlRing.position.y = 0.74;
      productRoot.add(knurlRing);

      // Part 7: Tactile Elastomer Dropper Bulb
      const bulbMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(spec.primaryColorHex || '#0F172A'),
        roughness: 0.72,
        metalness: 0.05,
      });
      const bulbCylinder = new THREE.Mesh(
        new THREE.CylinderGeometry(0.24, 0.26, 0.48, 32),
        bulbMat
      );
      bulbCylinder.position.y = 1.34;
      productRoot.add(bulbCylinder);

      const bulbDome = new THREE.Mesh(new THREE.SphereGeometry(0.24, 32, 16), bulbMat);
      bulbDome.position.y = 1.58;
      productRoot.add(bulbDome);

      // Part 8: Front & Back High-Resolution Label Plaques
      const frontPlaque = new THREE.Mesh(new THREE.PlaneGeometry(1.05, 1.32), frontLabelMat);
      frontPlaque.position.set(0, -0.35, 0.655);
      frontPlaque.renderOrder = 3;
      productRoot.add(frontPlaque);

      const backUnderPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.18, 1.32), backUnderMat);
      backUnderPlane.rotation.y = Math.PI;
      backUnderPlane.position.set(0, -0.35, -0.655);
      backUnderPlane.renderOrder = 3;
      productRoot.add(backUnderPlane);
    }

    // Add Interactive 3D Peel-Off Sticker Mesh to Back of Vessel
    const peelMesh = new THREE.Mesh(peelGeo, peelStickerMat);
    peelMesh.rotation.y = Math.PI;
    peelMesh.position.set(
      0,
      spec.vesselArchetype === 'pressed-palette' ? 0 : -0.25,
      peelBaseZ
    );
    peelMesh.renderOrder = 4;
    productRoot.add(peelMesh);

    const updatePeelGeometry = (peelRatio: number) => {
      for (let i = 0; i < peelPosAttr.count; i++) {
        const origX = basePeelX[i];
        // Normalized 0 (left spine) to 1 (right peel corner)
        const normX = (origX + 0.725) / 1.45;
        const activeZone = Math.max(0, normX - (1 - peelRatio));
        const curlAngle = activeZone * Math.PI * 0.85;
        const liftZ = Math.sin(curlAngle) * 0.55 * peelRatio + activeZone * 0.35;
        const pullX = origX - activeZone * 0.28 * peelRatio;
        peelPosAttr.setX(i, pullX);
        peelPosAttr.setZ(i, liftZ);
      }
      peelPosAttr.needsUpdate = true;
      peelGeo.computeVertexNormals();
    };
    updatePeelGeometry(stateRef.current.currentPeel);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.minDistance = 2.4;
    controls.maxDistance = 8.0;
    controls.target.set(0, 0.05, 0);

    controls.addEventListener('start', () => {
      stateRef.current.activeTransition = false;
    });

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Coalesced render & software WebGL frame pacing
    let frameId = 0;
    let isDisposed = false;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      if (isDisposed) return;
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) : null;
      gl.flush();
      const poll = () => {
        if (isDisposed) return;
        const state = sync ? gl.getSyncParameter(sync, gl.SYNC_STATUS) : gl.SIGNALED;
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (isDisposed) return;
      const dt = Math.min(clock.getDelta(), 0.1);

      // Smoothly damp 3D peel-off label curl
      const diffPeel = Math.abs(stateRef.current.currentPeel - stateRef.current.targetPeel);
      if (diffPeel > 0.002) {
        stateRef.current.currentPeel = THREE.MathUtils.damp(
          stateRef.current.currentPeel,
          stateRef.current.targetPeel,
          8,
          dt
        );
        updatePeelGeometry(stateRef.current.currentPeel);
      }

      // Smoothly damp scripted camera transitions
      if (stateRef.current.activeTransition) {
        camera.position.x = THREE.MathUtils.damp(
          camera.position.x,
          stateRef.current.targetCamPos.x,
          6,
          dt
        );
        camera.position.y = THREE.MathUtils.damp(
          camera.position.y,
          stateRef.current.targetCamPos.y,
          6,
          dt
        );
        camera.position.z = THREE.MathUtils.damp(
          camera.position.z,
          stateRef.current.targetCamPos.z,
          6,
          dt
        );
        if (camera.position.distanceTo(stateRef.current.targetCamPos) < 0.05) {
          stateRef.current.activeTransition = false;
        }
      } else if (stateRef.current.cameraPreset === 'orbit' && !isSoftwareGl) {
        productRoot.rotation.y += dt * 0.35;
      }

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    const handleResize = () => {
      if (!container || isDisposed) return;
      const w = container.clientWidth || 640;
      const h = container.clientHeight || 460;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      isDisposed = true;
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      controls.dispose();
      frontTex.dispose();
      backUnderTex.dispose();
      peelOuterTex.dispose();
      envTexture.dispose();
      renderer.dispose();
    };
  }, [spec, linting]);

  return (
    <div className="relative w-full h-[460px] rounded-3xl border border-[#EADCD7] bg-[#F7EFEA] overflow-hidden select-none shadow-[0_12px_40px_rgba(140,105,100,0.10)]">
      {/* Top-Left Minimal Spec Header Overlay */}
      <div className="absolute top-3.5 left-3.5 z-10 pointer-events-none flex flex-col gap-0.5 bg-white/90 backdrop-blur-md border border-[#EADCD7] rounded-2xl px-4 py-2 shadow-sm">
        <div
          className="text-base font-semibold text-[#281E1C] tracking-wide"
          style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
        >
          {spec.brandName} — {spec.productTitle}
        </div>
        <div className="text-[10px] tracking-[0.18em] uppercase text-[#9E6B74] tabular-nums">
          3D {spec.vesselArchetype.replace('-', ' ')} · {spec.batchCode} · Peel Layer: {peelAmount}%
        </div>
      </div>

      {/* Dedicated Isolated WebGL Canvas Mount */}
      <div ref={canvasMountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Unified Collapsible Bottom Control Dock */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-3 z-10 w-[94%] max-w-[780px] transition-transform duration-200"
        style={{
          transform: dockCollapsed
            ? 'translate(-50%, calc(100% - 32px))'
            : 'translate(-50%, 0)',
        }}
      >
        <div className="flex justify-center mb-1">
          <button
            type="button"
            onClick={() => setDockCollapsed((prev) => !prev)}
            className="inline-flex items-center gap-1.5 rounded-t-2xl border border-b-0 border-[#EADCD7] bg-white/95 px-4 py-1 text-[10px] tracking-widest uppercase font-semibold text-[#8E5B65] hover:text-[#281E1C] cursor-pointer whitespace-nowrap shrink-0"
          >
            {dockCollapsed ? (
              <>
                <ChevronUp className="h-3.5 w-3.5 text-[#B85D6F]" />
                <span>Show 3D Mockup Controls</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-3.5 w-3.5 text-[#8E5B65]" />
                <span>Hide Controls</span>
              </>
            )}
          </button>
        </div>

        <div className="rounded-2xl border border-[#EADCD7] bg-white/95 backdrop-blur-md px-4 py-3 shadow-xl flex flex-col gap-2.5">
          {/* Row 1: Interactive 3D Peel-Off Label Slider */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-[#B85D6F] shrink-0" />
              <label
                htmlFor="peel-slider-3d"
                className="text-xs font-medium text-[#281E1C] whitespace-nowrap shrink-0"
              >
                3D Peel-Off Label Inspector:
              </label>
              <span className="text-xs font-mono text-[#B85D6F] font-semibold tabular-nums">
                {peelAmount}% Lifted
              </span>
            </div>

            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <input
                id="peel-slider-3d"
                type="range"
                min={0}
                max={100}
                value={peelAmount}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  onPeelAmountChange(val);
                  if (val > 20 && cameraPreset === 'front') {
                    triggerCameraView('back');
                  }
                }}
                className="w-full accent-[#B85D6F] cursor-pointer h-1.5 bg-[#F2E4E0] rounded-lg"
              />
              <button
                type="button"
                onClick={() => {
                  const nextVal = peelAmount > 50 ? 0 : 90;
                  onPeelAmountChange(nextVal);
                  triggerCameraView('back');
                }}
                className="px-3 py-1 rounded-full text-[10px] tracking-wider uppercase font-semibold border border-[#E4B8C1] bg-[#FFF1F2] text-[#9F1239] hover:bg-[#FFE4E6] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {peelAmount > 50 ? 'Seal Label' : 'Peel Back Warning Flap'}
              </button>
            </div>
          </div>

          {/* Row 2: Camera View Presets & Vessel Archetype Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#F2E6E2]">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] tracking-wider uppercase text-[#8E5B65] mr-1 whitespace-nowrap">
                Angle:
              </span>
              <button
                type="button"
                onClick={() => triggerCameraView('front')}
                className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                  cameraPreset === 'front'
                    ? 'bg-[#B85D6F] text-white font-semibold'
                    : 'bg-[#FAF3F0] text-[#5C4A47] hover:bg-[#F2E4E0]'
                }`}
              >
                <Eye className="h-3 w-3 inline mr-1" />
                Front Face
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerCameraView('back');
                  if (peelAmount < 65) onPeelAmountChange(80);
                }}
                className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                  cameraPreset === 'back'
                    ? 'bg-[#B85D6F] text-white font-semibold'
                    : 'bg-[#FAF3F0] text-[#5C4A47] hover:bg-[#F2E4E0]'
                }`}
              >
                <Layers className="h-3 w-3 inline mr-1" />
                Back Peel Layer
              </button>
              <button
                type="button"
                onClick={() => triggerCameraView('orbit')}
                className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                  cameraPreset === 'orbit'
                    ? 'bg-[#B85D6F] text-white font-semibold'
                    : 'bg-[#FAF3F0] text-[#5C4A47] hover:bg-[#F2E4E0]'
                }`}
              >
                <RotateCcw className="h-3 w-3 inline mr-1" />
                360° Spin
              </button>
            </div>

            {onVesselArchetypeChange && (
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#B85D6F] shrink-0" />
                <span className="text-[10px] tracking-wider uppercase text-[#8E5B65] whitespace-nowrap">
                  3D Shape:
                </span>
                {(
                  [
                    { id: 'pressed-palette', label: 'Compact Mirror' },
                    { id: 'dropper-serum', label: 'Serum Dropper' },
                    { id: 'airless-pump', label: 'Primer Flacon' },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onVesselArchetypeChange(item.id)}
                    className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                      spec.vesselArchetype === item.id
                        ? 'border border-[#B85D6F] bg-[#FBF0F2] text-[#9E4758] font-semibold'
                        : 'bg-[#FAF3F0] text-[#786662] hover:text-[#281E1C]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
