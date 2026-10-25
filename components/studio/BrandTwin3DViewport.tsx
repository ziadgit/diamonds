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

  // Background
  ctx.fillStyle = spec.primaryColorHex || '#0F172A';
  ctx.fillRect(0, 0, 1024, 1024);

  // Subtle metallic frame border
  ctx.strokeStyle = spec.accentColorHex || '#10B981';
  ctx.lineWidth = 14;
  ctx.strokeRect(44, 44, 936, 936);

  ctx.strokeStyle = 'rgba(248, 250, 252, 0.22)';
  ctx.lineWidth = 3;
  ctx.strokeRect(68, 68, 888, 888);

  // Brand Header
  ctx.fillStyle = '#94A3B8';
  ctx.font = '600 34px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText((spec.brandName || 'OPENCOMPACT LABS').toUpperCase(), 512, 165);

  // Divider line
  ctx.fillStyle = spec.accentColorHex || '#10B981';
  ctx.fillRect(362, 195, 300, 5);

  // Product Title
  ctx.fillStyle = '#F8FAFC';
  ctx.font = '700 58px sans-serif';
  const titleWords = (spec.productTitle || 'COMPLIANCE TWIN').split(' ');
  const line1 = titleWords.slice(0, 2).join(' ');
  const line2 = titleWords.slice(2).join(' ');
  ctx.fillText(line1, 512, 290);
  if (line2) {
    ctx.fillText(line2, 512, 360);
  }

  // Subtitle
  ctx.fillStyle = '#CBD5E1';
  ctx.font = '500 30px sans-serif';
  ctx.fillText(spec.subtitle || 'Multi-Jurisdictional Evaluated Vessel', 512, 430);

  // Claims box
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.fillRect(110, 490, 804, 240);
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
  ctx.lineWidth = 2;
  ctx.strokeRect(110, 490, 804, 240);

  const claims = spec.frontPanelClaims?.length
    ? spec.frontPanelClaims
    : ['CLINICALLY EVALUATED FORMULATION', 'AUDITED BY OPENCOMPACT ENGINE'];

  ctx.fillStyle = '#F8FAFC';
  ctx.font = '600 28px sans-serif';
  claims.slice(0, 2).forEach((claim, idx) => {
    const truncated = claim.length > 44 ? claim.slice(0, 44) + '...' : claim;
    ctx.fillText(truncated, 512, 575 + idx * 72);
  });

  // Batch & Net Weight Footer
  ctx.fillStyle = '#94A3B8';
  ctx.font = '600 28px monospace';
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

  ctx.fillStyle = isViolation ? '#2A0A14' : '#06241B';
  ctx.fillRect(0, 0, 1024, 1024);

  ctx.strokeStyle = isViolation ? '#F43F5E' : '#10B981';
  ctx.lineWidth = 16;
  ctx.strokeRect(36, 36, 952, 952);

  // Header badge
  ctx.fillStyle = isViolation ? '#F43F5E' : '#10B981';
  ctx.fillRect(80, 80, 864, 96);
  ctx.fillStyle = '#090D16';
  ctx.font = '700 34px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(
    isViolation
      ? 'BURIED LAYER REVEALED — 21 CFR 701.2 VIOLATION'
      : 'PRIMARY COMPLIANCE PANEL — 21 CFR 701.2 PASS',
    512,
    140
  );

  // Warning text block
  ctx.fillStyle = '#F8FAFC';
  ctx.font = '700 36px sans-serif';
  const warningStr =
    spec.peelOffBuriedWarningText ||
    linting.buriedPeelOffWarningText ||
    'FOR EXTERNAL COSMETIC USE ONLY.';

  const words = warningStr.split(' ');
  let line = '';
  let y = 280;
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    if (testLine.length > 34 && i > 0) {
      ctx.fillText(line.trim(), 512, y);
      line = words[i] + ' ';
      y += 54;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), 512, y);

  // Telemetry readout box
  ctx.fillStyle = 'rgba(9, 13, 22, 0.85)';
  ctx.fillRect(80, 560, 864, 340);
  ctx.strokeStyle = isViolation ? '#F43F5E' : '#10B981';
  ctx.lineWidth = 3;
  ctx.strokeRect(80, 560, 864, 340);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#E2E8F0';
  ctx.font = '600 30px monospace';
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
  ctx.fillStyle = isViolation ? '#FDA4AF' : '#6EE7B7';
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

  ctx.fillStyle = '#1E293B';
  ctx.fillRect(0, 0, 1024, 1024);

  ctx.strokeStyle = '#64748B';
  ctx.lineWidth = 10;
  ctx.strokeRect(30, 30, 964, 964);

  // Corner peel indicator
  ctx.fillStyle = spec.accentColorHex || '#F43F5E';
  ctx.beginPath();
  ctx.moveTo(760, 30);
  ctx.lineTo(994, 30);
  ctx.lineTo(994, 264);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#F8FAFC';
  ctx.font = '700 28px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('PEEL  corner ↗', 860, 100);

  ctx.fillStyle = '#F8FAFC';
  ctx.font = '700 40px sans-serif';
  ctx.fillText('OUTER ADHESIVE GRAPHIC LAYER', 512, 240);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '500 30px sans-serif';
  const title = spec.peelOffOuterGraphicTitle || 'PEEL HERE FOR MULTILINGUAL SAFETY & INCI';
  ctx.fillText(title.slice(0, 42), 512, 320);

  // Decorative barcode & marketing filler covering the warning underneath
  ctx.fillStyle = '#0F172A';
  ctx.fillRect(120, 400, 784, 220);
  ctx.fillStyle = '#CBD5E1';
  ctx.font = '500 26px monospace';
  ctx.fillText('DIST. BY ' + (spec.brandName || 'OPENCOMPACT'), 512, 475);
  ctx.fillText('MADE IN USA / EU · 12M PAO · RECYCLABLE VESSEL', 512, 540);

  // Simulated barcode bars
  ctx.fillStyle = '#F8FAFC';
  ctx.fillRect(280, 680, 464, 160);
  ctx.fillStyle = '#090D16';
  for (let x = 305; x < 720; x += 18) {
    const w = (x % 36 === 0) ? 10 : 5;
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
    scene.background = new THREE.Color('#090D16');
    scene.fog = new THREE.FogExp2('#090D16', 0.045);

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
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Studio Environment Reflection (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    // 3-Point Warm/Cool Studio Lighting
    const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x0f172a, 0.85);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.2);
    keyLight.position.set(4, 6, 5);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x34d399, 1.35);
    rimLight.position.set(-4, 3, -5);
    scene.add(rimLight);

    // Contact Shadow Grounding Pedestal
    const pedestalGroup = new THREE.Group();
    const pedestalGeo = new THREE.CylinderGeometry(2.1, 2.25, 0.14, 48);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.35,
      metalness: 0.6,
    });
    const pedestalMesh = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestalMesh.position.y = -1.42;
    pedestalMesh.receiveShadow = true;
    pedestalGroup.add(pedestalMesh);

    const ringGeo = new THREE.RingGeometry(1.92, 1.98, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: linting.overallArtworkStatus === 'VIOLATION' ? 0xf43f5e : 0x10b981,
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

    // Metallic finish helper
    const metalColor =
      spec.metallicFinish === 'gold'
        ? 0xfbbf24
        : spec.metallicFinish === 'platinum'
        ? 0xe2e8f0
        : 0x334155;

    const metalMat = new THREE.MeshPhysicalMaterial({
      color: metalColor,
      metalness: 0.94,
      roughness: 0.18,
      anisotropy: 0.75,
      clearcoat: 0.6,
    });

    const bodyPrimaryMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(spec.primaryColorHex || '#0F172A'),
      roughness: 0.42,
      metalness: 0.25,
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
    <div className="relative w-full h-[480px] rounded-xl border border-slate-800 bg-slate-950 overflow-hidden select-none">
      {/* Top-Left Minimal Spec Header Overlay (Zero Center Occlusion) */}
      <div className="absolute top-3 left-3 z-10 pointer-events-none flex flex-col gap-0.5 bg-slate-900/95 border border-slate-800 rounded-lg px-3 py-2">
        <div className="text-xs font-semibold text-slate-100 tracking-tight">
          {spec.brandName} — {spec.productTitle}
        </div>
        <div className="text-[11px] font-mono text-slate-400 tabular-nums">
          {spec.vesselArchetype.toUpperCase()} · {spec.batchCode} · PEEL LAYER: {peelAmount}%
        </div>
      </div>

      {/* Dedicated Isolated WebGL Canvas Mount */}
      <div ref={canvasMountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Unified Collapsible Bottom Control Dock (Zero Side-Panel Clutter) */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-3 z-10 w-[94%] max-w-[760px] transition-transform duration-200"
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
            className="inline-flex items-center gap-1.5 rounded-t-lg border border-b-0 border-slate-700 bg-slate-900 px-3 py-1 text-[11px] font-medium text-slate-300 hover:text-white cursor-pointer whitespace-nowrap shrink-0"
          >
            {dockCollapsed ? (
              <>
                <ChevronUp className="h-3.5 w-3.5 text-emerald-400" />
                <span>Show 3D Inspector Dock</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                <span>Hide Controls</span>
              </>
            )}
          </button>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 shadow-2xl flex flex-col gap-2.5">
          {/* Row 1: Interactive 3D Peel-Off Label Slider */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-rose-400 shrink-0" />
              <label
                htmlFor="peel-slider-3d"
                className="text-xs font-semibold text-slate-200 whitespace-nowrap shrink-0"
              >
                Interactive 3D Peel-Off Label Inspector:
              </label>
              <span className="text-xs font-mono text-emerald-400 tabular-nums">
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
                className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <button
                type="button"
                onClick={() => {
                  const nextVal = peelAmount > 50 ? 0 : 90;
                  onPeelAmountChange(nextVal);
                  triggerCameraView('back');
                }}
                className="px-2.5 py-1 rounded-md text-[11px] font-medium border border-rose-500/50 bg-rose-950/50 text-rose-200 hover:bg-rose-900/60 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {peelAmount > 50 ? 'Seal Flap' : 'Peel Back Warning Flap'}
              </button>
            </div>
          </div>

          {/* Row 2: Camera View Presets & Vessel Archetype Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/90">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400 mr-1 whitespace-nowrap">Camera:</span>
              <button
                type="button"
                onClick={() => triggerCameraView('front')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                  cameraPreset === 'front'
                    ? 'bg-emerald-500 text-slate-950 font-semibold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Eye className="h-3 w-3 inline mr-1" />
                Front Claims
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerCameraView('back');
                  if (peelAmount < 65) onPeelAmountChange(80);
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                  cameraPreset === 'back'
                    ? 'bg-emerald-500 text-slate-950 font-semibold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Layers className="h-3 w-3 inline mr-1" />
                Back Peel-Off Layer
              </button>
              <button
                type="button"
                onClick={() => triggerCameraView('orbit')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                  cameraPreset === 'orbit'
                    ? 'bg-emerald-500 text-slate-950 font-semibold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <RotateCcw className="h-3 w-3 inline mr-1" />
                360° Turntable
              </button>
            </div>

            {onVesselArchetypeChange && (
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span className="text-[11px] text-slate-400 whitespace-nowrap">3D Vessel:</span>
                {(
                  [
                    { id: 'pressed-palette', label: 'Compact Palette' },
                    { id: 'dropper-serum', label: 'Glass Dropper' },
                    { id: 'airless-pump', label: 'Airless Primer' },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onVesselArchetypeChange(item.id)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                      spec.vesselArchetype === item.id
                        ? 'border border-emerald-500/60 bg-emerald-950/60 text-emerald-300'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
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
