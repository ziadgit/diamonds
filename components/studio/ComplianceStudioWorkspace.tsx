'use client';

import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import {
  Sparkles,
  Upload,
  FileCode2,
  Download,
  Copy,
  Check,
  Search,
  Layers,
  Globe,
  Video,
  Wand2,
  AlertTriangle,
  FileText,
  ArrowLeft,
  CheckCircle2,
  Sliders,
  FlaskConical,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { OpenCompactLogo } from '@/components/ui/opencompact-logo';
import {
  ComplianceAuditResult,
  DETERMINISTIC_PRESET_RESULTS,
  PRESET_INPUTS,
  SAMPLE_PRODUCT_URLS,
  synthesizeUrlBrandResult,
} from '@/lib/compliance-data';
import { BrandTwin3DViewport } from './BrandTwin3DViewport';

interface ComplianceStudioWorkspaceProps {
  initialPresetId?: string;
  initialFormulationRaw?: string;
  initialCustomAuditResult?: ComplianceAuditResult | null;
  initialSourceUrl?: string;
  onBackToLanding?: () => void;
  onOpenReadmeModal?: () => void;
}

const CASING_PALETTE_OPTIONS = [
  { label: 'Peony Blush', primary: '#F9E8EC', secondary: '#F2D2D9', accent: '#C86D7E' },
  { label: 'Champagne Silk', primary: '#F7EFE8', secondary: '#EAD8C9', accent: '#C59B6D' },
  { label: 'Camellia Lilac', primary: '#F3ECF8', secondary: '#E2D4F0', accent: '#A67DB8' },
  { label: 'Peach Cashmere', primary: '#FBF0EA', secondary: '#F2DCCF', accent: '#D48C70' },
];

export function ComplianceStudioWorkspace({
  initialPresetId = 'huda-matrix',
  initialFormulationRaw,
  initialCustomAuditResult = null,
  initialSourceUrl,
  onBackToLanding,
  onOpenReadmeModal,
}: ComplianceStudioWorkspaceProps) {
  const defaultPresetKey = DETERMINISTIC_PRESET_RESULTS[initialPresetId]
    ? initialPresetId
    : 'huda-matrix';

  const [activePresetId, setActivePresetId] = useState<string>(
    initialCustomAuditResult ? initialCustomAuditResult.presetId : defaultPresetKey
  );
  const [activeTab, setActiveTab] = useState<string>('matrix');
  const [sidebarMode, setSidebarMode] = useState<'remix' | 'formula' | 'vessel'>('remix');

  // Source Control Sidebar States
  const [productName, setProductName] = useState<string>(
    initialCustomAuditResult?.productName || PRESET_INPUTS[defaultPresetKey].productName
  );
  const [productCategory, setProductCategory] = useState<string>(
    initialCustomAuditResult?.productCategory || PRESET_INPUTS[defaultPresetKey].productCategory
  );
  const [brandPrompt, setBrandPrompt] = useState<string>(
    PRESET_INPUTS[defaultPresetKey].brandPrompt
  );
  const [formulationRaw, setFormulationRaw] = useState<string>(
    initialFormulationRaw || PRESET_INPUTS[defaultPresetKey].formulationRaw
  );
  const [artworkMetadata, setArtworkMetadata] = useState(
    PRESET_INPUTS[defaultPresetKey].artworkMetadata
  );
  const [adverseEventLogs, setAdverseEventLogs] = useState<string>(
    PRESET_INPUTS[defaultPresetKey].adverseEventLogs
  );

  // URL Ingestion & Distinct Brand Generator States
  const [sourceProductUrl, setSourceProductUrl] = useState<string>(
    initialSourceUrl || SAMPLE_PRODUCT_URLS[0].url
  );
  const [urlActionLoading, setUrlActionLoading] = useState<
    'none' | 'audit-url' | 'generate-distinct-brand'
  >('none');

  // Multimodal Video / Image Frame Ingestion State
  const [extractedFrames, setExtractedFrames] = useState<
    Array<{ data: string; mimeType: string; timestampSec: number }>
  >([]);
  const [uploadedMediaName, setUploadedMediaName] = useState<string>('');
  const [isExtractingVideo, setIsExtractingVideo] = useState<boolean>(false);

  // Audit Result & Decode Animation States
  const [auditResult, setAuditResult] = useState<ComplianceAuditResult>(
    initialCustomAuditResult || DETERMINISTIC_PRESET_RESULTS[defaultPresetKey]
  );
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [isDecodingDossier, setIsDecodingDossier] = useState<boolean>(false);
  const [decodeStepText, setDecodeStepText] = useState<string>('');
  const [apiError, setApiError] = useState<string | null>(null);

  // Interactive Workspace Controls
  const [matrixSearch, setMatrixSearch] = useState<string>('');
  const [matrixFilter, setMatrixFilter] = useState<'ALL' | 'VIOLATION' | 'PASS'>('ALL');
  const [peelAmount, setPeelAmount] = useState<number>(
    (initialCustomAuditResult || DETERMINISTIC_PRESET_RESULTS[defaultPresetKey]).brandTwin3D
      .hasPeelOffStickerTrap
      ? 65
      : 0
  );
  const [dossierViewMode, setDossierViewMode] = useState<'markdown' | 'structured'>('markdown');
  const [copiedState, setCopiedState] = useState<boolean>(false);

  const jsonFileInputRef = useRef<HTMLInputElement | null>(null);
  const mediaFileInputRef = useRef<HTMLInputElement | null>(null);
  const mainCanvasTopRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (initialCustomAuditResult) {
      setAuditResult(initialCustomAuditResult);
      setProductName(initialCustomAuditResult.productName);
      setProductCategory(initialCustomAuditResult.productCategory);
      setPeelAmount(initialCustomAuditResult.brandTwin3D.hasPeelOffStickerTrap ? 75 : 0);
    }
  }, [initialCustomAuditResult]);

  const triggerLongDecodeSequence = (callback?: () => void) => {
    setIsDecodingDossier(true);
    setDecodeStepText('Indexing 21 U.S.C. § 364a (MoCRA Section 605) & clinical triage logs...');
    setTimeout(() => {
      setDecodeStepText(
        'Cross-referencing retain sample HPLC/ICP-MS stability telemetry & NOAEL margins...'
      );
    }, 350);
    setTimeout(() => {
      setDecodeStepText(
        'Synthesizing 15-Day Form FDA 3500A MedWatch packet & 1-year follow-up protocols...'
      );
    }, 700);
    setTimeout(() => {
      setIsDecodingDossier(false);
      if (callback) callback();
    }, 1050);
  };

  const handleSelectPreset = (presetKey: string) => {
    const presetInput = PRESET_INPUTS[presetKey];
    const presetResult = DETERMINISTIC_PRESET_RESULTS[presetKey];
    if (!presetInput || !presetResult) return;

    setApiError(null);
    setActivePresetId(presetKey);
    setProductName(presetInput.productName);
    setProductCategory(presetInput.productCategory);
    setBrandPrompt(presetInput.brandPrompt);
    setFormulationRaw(presetInput.formulationRaw);
    setArtworkMetadata(presetInput.artworkMetadata);
    setAdverseEventLogs(presetInput.adverseEventLogs);
    setAuditResult(presetResult);
    setPeelAmount(presetResult.brandTwin3D.hasPeelOffStickerTrap ? 75 : 0);

    if (presetKey === 'mocra-adverse-event') {
      setActiveTab('dossier');
      triggerLongDecodeSequence();
    }
  };

  const handleUrlBrandAction = async (
    mode: 'audit-url' | 'generate-distinct-brand',
    rawUrlInput?: string
  ) => {
    const targetUrl = (rawUrlInput ?? sourceProductUrl).trim() || SAMPLE_PRODUCT_URLS[0].url;
    setSourceProductUrl(targetUrl);
    setApiError(null);
    setUrlActionLoading(mode);

    const immediateResult = synthesizeUrlBrandResult(targetUrl, mode);
    setAuditResult(immediateResult);
    setActivePresetId(immediateResult.presetId);
    setProductName(immediateResult.productName);
    setProductCategory(immediateResult.productCategory);
    setPeelAmount(immediateResult.brandTwin3D.hasPeelOffStickerTrap ? 75 : 0);

    const formattedInci = immediateResult.matrixRows
      .map(
        (r) =>
          `${r.inciName} (${r.ingredientName}): ${r.concentrationPpm} ppm (${r.concentrationPercent})`
      )
      .join('\n');
    setFormulationRaw(formattedInci);

    mainCanvasTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    setTimeout(() => {
      setUrlActionLoading('none');
    }, 280);
  };

  const handleFormulationFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setFormulationRaw(text);
    setActivePresetId('custom');
  };

  const handleMediaFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedMediaName(file.name);
    setArtworkMetadata((prev) => ({ ...prev, uploadedFileName: file.name }));

    if (file.type.startsWith('video/')) {
      setIsExtractingVideo(true);
      try {
        const videoUrl = URL.createObjectURL(file);
        const video = document.createElement('video');
        video.src = videoUrl;
        video.muted = true;
        video.playsInline = true;

        await new Promise<void>((resolve, reject) => {
          video.onloadeddata = () => resolve();
          video.onerror = () => reject(new Error('Failed to decode video stream'));
        });

        const duration = Math.max(1, video.duration || 3);
        const timestamps = [0.2, duration * 0.45, duration * 0.8];
        const frames: Array<{ data: string; mimeType: string; timestampSec: number }> = [];

        const offscreen = document.createElement('canvas');
        offscreen.width = 480;
        offscreen.height = 270;
        const ctx = offscreen.getContext('2d')!;

        for (const ts of timestamps) {
          video.currentTime = Math.min(ts, duration - 0.05);
          await new Promise<void>((resolve) => {
            video.onseeked = () => resolve();
          });
          ctx.drawImage(video, 0, 0, offscreen.width, offscreen.height);
          frames.push({
            data: offscreen.toDataURL('image/jpeg', 0.8),
            mimeType: 'image/jpeg',
            timestampSec: Number(ts.toFixed(1)),
          });
        }

        URL.revokeObjectURL(videoUrl);
        setExtractedFrames(frames);
      } catch {
        setExtractedFrames([]);
      } finally {
        setIsExtractingVideo(false);
      }
    } else if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setExtractedFrames([
            {
              data: reader.result,
              mimeType: file.type,
              timestampSec: 0,
            },
          ]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const runLiveArgonAudit = async () => {
    setIsAuditing(true);
    setApiError(null);

    try {
      const response = await fetch('/api/compliance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          presetId: activePresetId,
          urlMode: 'none',
          sourceProductUrl,
          productName,
          productCategory,
          brandPrompt,
          formulationRaw,
          artworkMetadata,
          adverseEventLogs,
          videoFramesBase64: extractedFrames,
        }),
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || `Server returned ${response.status}`);
      }

      const result = data as ComplianceAuditResult;
      setAuditResult(result);
      setProductName(result.productName);
      setPeelAmount(result.brandTwin3D.hasPeelOffStickerTrap ? 75 : 0);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Live API audit notice';
      setApiError(message);
    } finally {
      setIsAuditing(false);
    }
  };

  const filteredRows = auditResult.matrixRows.filter((row) => {
    const matchesSearch =
      row.ingredientName.toLowerCase().includes(matrixSearch.toLowerCase()) ||
      row.inciName.toLowerCase().includes(matrixSearch.toLowerCase()) ||
      row.casNumber.toLowerCase().includes(matrixSearch.toLowerCase());
    if (!matchesSearch) return false;
    if (matrixFilter === 'ALL') return true;
    const hasViolation =
      row.usFda.status === 'VIOLATION' ||
      row.california.status === 'VIOLATION' ||
      row.eu.status === 'VIOLATION';
    return matrixFilter === 'VIOLATION' ? hasViolation : !hasViolation;
  });

  const handleDownloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyDossier = async () => {
    await navigator.clipboard.writeText(auditResult.mocraDossier.compiledMarkdownDocument);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2000);
  };

  const usStatus = auditResult.matrixRows.some((r) => r.usFda.status === 'VIOLATION')
    ? 'VIOLATION'
    : 'PASS';
  const caStatus = auditResult.matrixRows.some((r) => r.california.status === 'VIOLATION')
    ? 'VIOLATION'
    : 'PASS';
  const euStatus = auditResult.matrixRows.some((r) => r.eu.status === 'VIOLATION')
    ? 'VIOLATION'
    : 'PASS';

  return (
    <div className="min-h-screen bg-[#FAF6F3] text-[#281E1C] flex flex-col">
      {/* Studio Top Bar Contract (3-Zone Header in Light Feminine Porcelain) */}
      <header className="flex items-center justify-between gap-8 px-6 py-3.5 border-b border-[#EADCD7] bg-white/95 backdrop-blur-md sticky top-0 z-30">
        {/* Zone 1: Bespoke Rose-Gold & Porcelain Compact Logo */}
        <a
          href="/"
          onClick={(e) => {
            if (onBackToLanding) {
              e.preventDefault();
              onBackToLanding();
            }
          }}
          className="shrink-0"
        >
          <OpenCompactLogo size="sm" showSubtitle={false} />
        </a>

        {/* Zone 2: Concise Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-[11px] font-medium tracking-[0.2em] uppercase text-[#786662]">
          <button
            type="button"
            onClick={() => setActiveTab('matrix')}
            className={`hover:text-[#281E1C] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'matrix'
                ? 'text-[#B85D6F] underline underline-offset-8 decoration-[#B85D6F]'
                : ''
            }`}
          >
            Formulation Matrix
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('packaging')}
            className={`hover:text-[#281E1C] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'packaging'
                ? 'text-[#B85D6F] underline underline-offset-8 decoration-[#B85D6F]'
                : ''
            }`}
          >
            2D Carton &amp; Claims
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('dossier');
              triggerLongDecodeSequence();
            }}
            className={`hover:text-[#281E1C] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'dossier'
                ? 'text-[#B85D6F] underline underline-offset-8 decoration-[#B85D6F]'
                : ''
            }`}
          >
            15-Day MoCRA Filing
          </button>
          {onOpenReadmeModal && (
            <button
              type="button"
              onClick={onOpenReadmeModal}
              className="hover:text-[#281E1C] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Documentation
            </button>
          )}
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {onBackToLanding ? (
            <Button variant="outline" size="sm" onClick={onBackToLanding}>
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Notebooks</span>
            </Button>
          ) : (
            <Button size="sm" onClick={runLiveArgonAudit} disabled={isAuditing}>
              <Sparkles className="h-3.5 w-3.5" />
              <span>{isAuditing ? 'Auditing...' : 'Run Argon Audit'}</span>
            </Button>
          )}
        </div>
      </header>

      {/* Main Sidebar + Performance Canvas Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 max-w-[1640px] w-full mx-auto">
        {/* LEFT SIDEBAR: SEGMENTED STUDIO DOCK */}
        <aside className="lg:col-span-4 xl:col-span-3 border-b lg:border-b-0 lg:border-r border-[#EADCD7] bg-[#FDF9F7] p-5 flex flex-col gap-5 overflow-y-auto lg:max-h-[calc(100vh-61px)]">
          {/* Segmented Mode Pill Switcher */}
          <div className="grid grid-cols-3 gap-1 p-1 rounded-full bg-[#F5EBE8] border border-[#E4D3CD]">
            <button
              type="button"
              onClick={() => setSidebarMode('remix')}
              className={`py-2 px-2 rounded-full text-[10px] font-semibold tracking-wider uppercase transition-all cursor-pointer flex items-center justify-center gap-1 ${
                sidebarMode === 'remix'
                  ? 'bg-white text-[#9E4758] shadow-xs border border-[#E4D3CD]'
                  : 'text-[#786662] hover:text-[#281E1C]'
              }`}
            >
              <Wand2 className="h-3 w-3 shrink-0" />
              <span>Remix</span>
            </button>
            <button
              type="button"
              onClick={() => setSidebarMode('formula')}
              className={`py-2 px-2 rounded-full text-[10px] font-semibold tracking-wider uppercase transition-all cursor-pointer flex items-center justify-center gap-1 ${
                sidebarMode === 'formula'
                  ? 'bg-white text-[#9E4758] shadow-xs border border-[#E4D3CD]'
                  : 'text-[#786662] hover:text-[#281E1C]'
              }`}
            >
              <FlaskConical className="h-3 w-3 shrink-0" />
              <span>Formula</span>
            </button>
            <button
              type="button"
              onClick={() => setSidebarMode('vessel')}
              className={`py-2 px-2 rounded-full text-[10px] font-semibold tracking-wider uppercase transition-all cursor-pointer flex items-center justify-center gap-1 ${
                sidebarMode === 'vessel'
                  ? 'bg-white text-[#9E4758] shadow-xs border border-[#E4D3CD]'
                  : 'text-[#786662] hover:text-[#281E1C]'
              }`}
            >
              <Sliders className="h-3 w-3 shrink-0" />
              <span>3D &amp; Claims</span>
            </button>
          </div>

          {/* MODE 1: URL BRAND REMIXER & CURATED CASE STUDIES */}
          {sidebarMode === 'remix' && (
            <div className="space-y-5">
              {/* Instant URL Brand Remixer Card */}
              <div className="rounded-3xl border border-[#E4C5CE] bg-white p-4 space-y-3.5 shadow-[0_8px_28px_rgba(184,93,111,0.08)]">
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B85D6F] flex items-center gap-1.5">
                    <Wand2 className="h-3.5 w-3.5" />
                    <span>URL Brand Remixer</span>
                  </span>
                  <p className="text-xs text-[#6E5A56] leading-relaxed">
                    Paste any Sephora, Ulta, or beauty product link to immediately generate a new 3D
                    product mockup &amp; compliant formulation.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {SAMPLE_PRODUCT_URLS.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setSourceProductUrl(item.url);
                          handleUrlBrandAction('generate-distinct-brand', item.url);
                        }}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-all cursor-pointer border ${
                          sourceProductUrl === item.url
                            ? 'border-[#B85D6F] bg-[#FBF0F2] text-[#9E4758]'
                            : 'border-[#EADCD7] bg-[#FAF6F3] text-[#786662] hover:text-[#281E1C]'
                        }`}
                      >
                        {item.id === 'url-huda-neon'
                          ? 'Sephora Neon Compact'
                          : item.id === 'url-ca-pfas-primer'
                          ? 'Ulta Velvet Primer'
                          : 'Silvering Elixir'}
                      </button>
                    ))}
                  </div>

                  <input
                    type="url"
                    value={sourceProductUrl}
                    onChange={(e) => setSourceProductUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleUrlBrandAction('generate-distinct-brand', sourceProductUrl);
                      }
                    }}
                    placeholder="https://www.sephora.com/product/..."
                    className="w-full rounded-2xl border border-[#E4D3CD] bg-[#FAF6F3] px-3.5 py-2 text-xs text-[#281E1C] focus:outline-none focus:border-[#B85D6F]"
                  />
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleUrlBrandAction('generate-distinct-brand', sourceProductUrl)}
                    disabled={urlActionLoading !== 'none'}
                    className="w-full justify-center"
                  >
                    <Wand2 className="h-3.5 w-3.5" />
                    <span>
                      {urlActionLoading === 'generate-distinct-brand'
                        ? 'Rendering 3D Mockup...'
                        : 'Remix into New 3D Brand'}
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUrlBrandAction('audit-url', sourceProductUrl)}
                    disabled={urlActionLoading !== 'none'}
                    className="w-full justify-center"
                  >
                    <Search className="h-3.5 w-3.5" />
                    <span>
                      {urlActionLoading === 'audit-url'
                        ? 'Auditing Reference...'
                        : 'Audit Original URL Safety'}
                    </span>
                  </Button>
                </div>
              </div>

              {/* Curated Beauty Case Study Collection */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8E5B65]">
                    Curated Reference Collection
                  </span>
                  <span className="text-[10px] text-[#B85D6F]">1-Tap Load</span>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {Object.entries(PRESET_INPUTS).map(([key, preset]) => {
                    const isSelected = activePresetId === key;
                    const presetRes = DETERMINISTIC_PRESET_RESULTS[key];
                    const swatches =
                      presetRes?.brandTwin3D.palettePanColorsHex?.slice(0, 5) || [];
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleSelectPreset(key)}
                        className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#B85D6F] bg-[#FFF5F7] shadow-[0_6px_20px_rgba(184,93,111,0.10)]'
                            : 'border-[#EADCD7] bg-white hover:border-[#D8B4A6]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span
                            className="text-base font-semibold text-[#281E1C] truncate"
                            style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
                          >
                            {preset.name}
                          </span>
                          <div className="flex items-center -space-x-1 shrink-0">
                            {swatches.map((hex, idx) => (
                              <span
                                key={idx}
                                className="h-3.5 w-3.5 rounded-full border border-white shadow-xs"
                                style={{ backgroundColor: hex }}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="text-[10px] tracking-wider uppercase text-[#9E6B74] font-semibold mb-1">
                          {preset.badgeLabel}
                        </div>
                        <p className="text-xs text-[#6E5A56] leading-relaxed line-clamp-2">
                          {preset.shortDescription}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* MODE 2: FORMULA & INCI LAB */}
          {sidebarMode === 'formula' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B85D6F] block">
                    Formulation Sheet (INCI / ppm)
                  </span>
                  <p className="text-xs text-[#6E5A56] mt-0.5">
                    Edit raw INCI concentrations or upload a lab batch file.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => jsonFileInputRef.current?.click()}
                  className="text-xs font-medium text-[#B85D6F] hover:text-[#9E4758] flex items-center gap-1 cursor-pointer"
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>Import</span>
                </button>
                <input
                  ref={jsonFileInputRef}
                  type="file"
                  accept=".json,.txt,.csv"
                  onChange={handleFormulationFileUpload}
                  className="hidden"
                />
              </div>

              <textarea
                rows={10}
                value={formulationRaw}
                onChange={(e) => {
                  setFormulationRaw(e.target.value);
                  setActivePresetId('custom');
                }}
                placeholder="Paste INCI ingredient list with ppm or % concentrations..."
                className="w-full rounded-2xl border border-[#E4D3CD] bg-white p-3.5 text-xs font-mono text-[#281E1C] leading-relaxed focus:outline-none focus:border-[#B85D6F]"
              />

              <div className="space-y-2 pt-2 border-t border-[#EADCD7]">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8E5B65] block">
                  Consumer Clinical &amp; Adverse Event Logs
                </span>
                <textarea
                  rows={4}
                  value={adverseEventLogs}
                  onChange={(e) => setAdverseEventLogs(e.target.value)}
                  placeholder="Paste consumer clinical reports for 15-day MoCRA dossier..."
                  className="w-full rounded-2xl border border-[#E4D3CD] bg-white p-3 text-xs font-mono text-[#3D2E2B] focus:outline-none focus:border-[#B85D6F]"
                />
              </div>

              <Button onClick={runLiveArgonAudit} disabled={isAuditing} className="w-full">
                <Sparkles className="h-4 w-4" />
                <span>
                  {isAuditing ? 'Auditing with Gemini 4 Argon...' : 'Audit Custom Formulation'}
                </span>
              </Button>
            </div>
          )}

          {/* MODE 3: 3D VESSEL, ARTWORK & CLAIMS */}
          {sidebarMode === 'vessel' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B85D6F] flex items-center gap-1.5">
                  <Video className="h-3.5 w-3.5" />
                  <span>3D Packaging &amp; Finish Direction</span>
                </span>
                <textarea
                  rows={3}
                  value={brandPrompt}
                  onChange={(e) => setBrandPrompt(e.target.value)}
                  placeholder="Describe luxury compact, frosted glass serum flacon, or metallic finish..."
                  className="w-full rounded-2xl border border-[#E4D3CD] bg-white p-3 text-xs text-[#281E1C] focus:outline-none focus:border-[#B85D6F]"
                />
              </div>

              <div
                onClick={() => mediaFileInputRef.current?.click()}
                className="rounded-2xl border border-dashed border-[#D8B4A6] bg-white p-4 text-center hover:border-[#B85D6F] transition-colors cursor-pointer"
              >
                <Upload className="h-4 w-4 text-[#B85D6F] mx-auto mb-1.5" />
                <div className="text-xs font-medium text-[#281E1C]">
                  {uploadedMediaName ||
                    artworkMetadata.uploadedFileName ||
                    'Upload Carton Dieline or Product Video (.mp4)'}
                </div>
                <div className="text-[11px] text-[#786662] mt-0.5">
                  {isExtractingVideo
                    ? 'Extracting keyframes for packaging review...'
                    : 'Extracts keyframes for 3D vessel & label prominence'}
                </div>
                <input
                  ref={mediaFileInputRef}
                  type="file"
                  accept="video/*,image/*,.pdf"
                  onChange={handleMediaFileUpload}
                  className="hidden"
                />
              </div>

              {extractedFrames.length > 0 && (
                <div className="grid grid-cols-3 gap-1.5">
                  {extractedFrames.map((frame, i) => (
                    <div
                      key={i}
                      className="relative rounded-lg overflow-hidden border border-[#E4D3CD] bg-white aspect-video"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={frame.data}
                        alt={`Extracted frame ${i + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-0.5 right-1 text-[9px] font-mono bg-white/90 px-1 rounded text-[#9E4758]">
                        {frame.timestampSec}s
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Quick Peel-Off & Font Prominence Overrides */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-xl border border-[#EADCD7] bg-white p-3">
                  <label className="text-[10px] uppercase tracking-wider text-[#786662] block">
                    Warning Font (pt)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={artworkMetadata.fontSizePt}
                    onChange={(e) =>
                      setArtworkMetadata((prev) => ({
                        ...prev,
                        fontSizePt: Number(e.target.value),
                      }))
                    }
                    className="w-full bg-transparent text-sm font-mono text-[#281E1C] focus:outline-none tabular-nums mt-1"
                  />
                </div>
                <div className="rounded-xl border border-[#EADCD7] bg-white p-3 flex flex-col justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-[#786662] block">
                    Back Label Layer
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setArtworkMetadata((prev) => ({
                        ...prev,
                        isBehindPeelOffLayer: !prev.isBehindPeelOffLayer,
                      }))
                    }
                    className={`text-left text-xs font-semibold cursor-pointer mt-1 ${
                      artworkMetadata.isBehindPeelOffLayer ? 'text-[#BE123C]' : 'text-[#047857]'
                    }`}
                  >
                    {artworkMetadata.isBehindPeelOffLayer ? 'PEEL-OFF TRAP' : 'DIRECT PRINT'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* RIGHT MAIN PERFORMANCE CANVAS */}
        <main
          ref={mainCanvasTopRef}
          className="lg:col-span-8 xl:col-span-9 p-6 lg:p-8 flex flex-col gap-6 overflow-y-auto"
        >
          {/* ALWAYS-VISIBLE 3D PRODUCT MOCKUP + BRAND IDENTITY SHOWCASE AT TOP OF STUDIO */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
            {/* Left 7 Cols: Live Interactive Three.js 3D Product Mockup */}
            <div className="xl:col-span-7 flex flex-col gap-3">
              <BrandTwin3DViewport
                spec={auditResult.brandTwin3D}
                linting={auditResult.artworkLinting}
                peelAmount={peelAmount}
                onPeelAmountChange={setPeelAmount}
                onVesselArchetypeChange={(archetype) =>
                  setAuditResult((prev) => ({
                    ...prev,
                    brandTwin3D: {
                      ...prev.brandTwin3D,
                      vesselArchetype: archetype,
                    },
                  }))
                }
              />

              {/* Live 3D Casing Color & Finish Customizer Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 rounded-2xl border border-[#EADCD7] bg-white">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#8E5B65]">
                  Customize 3D Casing Palette:
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {CASING_PALETTE_OPTIONS.map((opt) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() =>
                        setAuditResult((prev) => ({
                          ...prev,
                          brandTwin3D: {
                            ...prev.brandTwin3D,
                            primaryColorHex: opt.primary,
                            secondaryColorHex: opt.secondary,
                            accentColorHex: opt.accent,
                          },
                        }))
                      }
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border border-[#EADCD7] bg-[#FAF6F3] hover:border-[#B85D6F] cursor-pointer transition-colors"
                    >
                      <span
                        className="h-3 w-3 rounded-full border border-[#C86D7E]/40"
                        style={{ backgroundColor: opt.primary }}
                      />
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Brand Dossier Summary, Shade Swatches & Clean Substitutions */}
            <div className="xl:col-span-5 flex flex-col justify-between rounded-3xl border border-[#EADCD7] bg-white p-6 shadow-[0_12px_35px_rgba(140,105,100,0.07)] space-y-5">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Badge variant={auditResult.overallStatus === 'PASS' ? 'pass' : 'violation'}>
                    [{auditResult.overallStatus}]
                  </Badge>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#9E6B74] font-semibold">
                    {auditResult.productCategory}
                  </span>
                </div>

                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#B85D6F]">
                  {auditResult.brandTwin3D.brandName}
                </div>

                <h1
                  className="text-2xl sm:text-3xl font-semibold text-[#281E1C] leading-tight"
                  style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
                >
                  {auditResult.productName}
                </h1>

                <p className="text-xs text-[#6E5A56] leading-relaxed">
                  {auditResult.summaryHeadline}
                </p>

                {/* Shade Swatch Palette */}
                <div className="pt-2">
                  <div className="text-[10px] uppercase tracking-widest text-[#8E5B65] mb-2">
                    Formulation Shade &amp; Pigment Swatches
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {(auditResult.brandTwin3D.palettePanColorsHex || []).map((hex, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() =>
                          setAuditResult((prev) => ({
                            ...prev,
                            brandTwin3D: {
                              ...prev.brandTwin3D,
                              pigmentOrLiquidHex: hex,
                            },
                          }))
                        }
                        className="h-7 w-7 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform cursor-pointer"
                        style={{ backgroundColor: hex }}
                        title={`Apply shade ${hex} to 3D mockup`}
                      />
                    ))}
                  </div>
                </div>

                {/* If URL Remix Substitutions exist, highlight them right here */}
                {auditResult.urlRemixMetadata?.substitutedIngredients &&
                  auditResult.urlRemixMetadata.substitutedIngredients.length > 0 && (
                    <div className="pt-3 border-t border-[#F0E5E1] space-y-2">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#065F46]">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Clean Ingredient Substitutions Applied</span>
                      </div>
                      <div className="space-y-2 max-h-[165px] overflow-y-auto pr-1">
                        {auditResult.urlRemixMetadata.substitutedIngredients.map((sub, idx) => (
                          <div
                            key={idx}
                            className="rounded-2xl border border-[#EADCD7] bg-[#FAF6F3] p-2.5 text-[11px] space-y-0.5"
                          >
                            <div className="text-[#9F1239] line-through font-mono">
                              − {sub.replaced}
                            </div>
                            <div className="text-[#065F46] font-semibold font-mono">
                              + {sub.replacement}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              {/* 3-Market Retail Clearance Strip */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#F0E5E1]">
                <div className="rounded-2xl border border-[#EADCD7] bg-[#FAF6F3] p-2.5 text-center">
                  <div className="text-[9px] uppercase tracking-wider text-[#8E5B65] mb-1">
                    US FDA MoCRA
                  </div>
                  <Badge variant={usStatus === 'PASS' ? 'pass' : 'violation'}>[{usStatus}]</Badge>
                </div>
                <div className="rounded-2xl border border-[#EADCD7] bg-[#FAF6F3] p-2.5 text-center">
                  <div className="text-[9px] uppercase tracking-wider text-[#8E5B65] mb-1">
                    California
                  </div>
                  <Badge variant={caStatus === 'PASS' ? 'pass' : 'violation'}>[{caStatus}]</Badge>
                </div>
                <div className="rounded-2xl border border-[#EADCD7] bg-[#FAF6F3] p-2.5 text-center">
                  <div className="text-[9px] uppercase tracking-wider text-[#8E5B65] mb-1">
                    European Union
                  </div>
                  <Badge variant={euStatus === 'PASS' ? 'pass' : 'violation'}>[{euStatus}]</Badge>
                </div>
              </div>
            </div>
          </div>

          {apiError && (
            <Alert variant="warning">
              <AlertTitle className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-[#92400E]" />
                <span>Formulation Audit Notice</span>
              </AlertTitle>
              <AlertDescription>
                {apiError} — Displaying verified statutory toxicology telemetry.
              </AlertDescription>
            </Alert>
          )}

          {/* SHADCN TABS FOR DEEP TOXICOLOGY MATRIX, 2D CARTON LINTING & 15-DAY MOCRA DOSSIER */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <TabsList>
                <TabsTrigger value="matrix">
                  <Globe className="h-3.5 w-3.5 mr-1.5" />
                  <span>Global Retail Matrix</span>
                </TabsTrigger>
                <TabsTrigger value="packaging">
                  <Layers className="h-3.5 w-3.5 mr-1.5" />
                  <span>2D Carton Dieline &amp; Claims</span>
                </TabsTrigger>
                <TabsTrigger
                  value="dossier"
                  onClick={() => {
                    if (!isDecodingDossier) triggerLongDecodeSequence();
                  }}
                >
                  <FileCode2 className="h-3.5 w-3.5 mr-1.5" />
                  <span>15-Day FDA MoCRA Dossier</span>
                </TabsTrigger>
              </TabsList>

              <div className="text-[11px] font-mono text-[#8E5B65] tabular-nums">
                Engine: {auditResult.modelEngine}
              </div>
            </div>

            {/* TAB 1: THE GLOBAL MATRIX GRID */}
            <TabsContent value="matrix" className="space-y-4">
              <Card>
                <CardHeader className="pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EADCD7]">
                  <div>
                    <CardTitle className="text-2xl">
                      Multi-Jurisdictional Formulation &amp; Retail Clearance Matrix
                    </CardTitle>
                    <CardDescription>
                      Evaluating parts-per-million (ppm) ingredient concentrations across US FDA
                      (MoCRA / 21 CFR), California (Toxic-Free Cosmetics Act), and European Union
                      (EC 1223/2009).
                    </CardDescription>
                  </div>

                  {/* Search & Segmented Status Filter */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <div className="relative">
                      <Search className="h-3.5 w-3.5 text-[#8E5B65] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={matrixSearch}
                        onChange={(e) => setMatrixSearch(e.target.value)}
                        placeholder="Filter INCI or CAS..."
                        className="pl-8 pr-3 py-1.5 rounded-full border border-[#E4D3CD] bg-[#FAF6F3] text-xs text-[#281E1C] focus:outline-none focus:border-[#B85D6F]"
                      />
                    </div>
                    <div className="flex items-center gap-1 p-1 rounded-full bg-[#F5EBE8] border border-[#E4D3CD]">
                      {(['ALL', 'VIOLATION', 'PASS'] as const).map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setMatrixFilter(status)}
                          className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                            matrixFilter === status
                              ? 'bg-white text-[#9E4758] shadow-xs'
                              : 'text-[#786662] hover:text-[#281E1C]'
                          }`}
                        >
                          {status === 'ALL'
                            ? 'All'
                            : status === 'VIOLATION'
                            ? 'Violations'
                            : 'Cleared'}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[220px]">Evaluated Ingredient &amp; CAS</TableHead>
                        <TableHead className="text-right w-[130px]">Evaluated Conc.</TableHead>
                        <TableHead className="w-[270px]">US FDA (MoCRA / 21 CFR)</TableHead>
                        <TableHead className="w-[270px]">California (Toxic-Free Act)</TableHead>
                        <TableHead className="w-[270px]">European Union (EC 1223/2009)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRows.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-[#786662]">
                            No ingredients match the current filter criteria.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredRows.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell className="space-y-1">
                              <div
                                className="font-semibold text-[#281E1C] text-base"
                                style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
                              >
                                {row.ingredientName}
                              </div>
                              <div className="text-[11px] font-mono text-[#9E6B74]">
                                INCI: {row.inciName} · CAS {row.casNumber}
                              </div>
                              <div className="text-[11px] text-[#786662]">
                                {row.roleInFormulation}
                              </div>
                            </TableCell>

                            <TableCell className="text-right font-mono tabular-nums">
                              <div className="text-sm font-semibold text-[#281E1C]">
                                {row.concentrationPpm.toLocaleString()} ppm
                              </div>
                              <div className="text-[11px] text-[#786662]">
                                ({row.concentrationPercent})
                              </div>
                            </TableCell>

                            {/* US FDA Column */}
                            <TableCell className="space-y-1.5">
                              <div className="flex items-center justify-between gap-2">
                                <Badge
                                  variant={row.usFda.status === 'PASS' ? 'pass' : 'violation'}
                                >
                                  [{row.usFda.status}]
                                </Badge>
                                <span className="text-[11px] font-mono text-[#8E5B65] truncate">
                                  {row.usFda.citation}
                                </span>
                              </div>
                              <div className="text-[11px] font-mono text-[#9E4758]">
                                Limit: {row.usFda.maxThreshold}
                              </div>
                              <p className="text-xs text-[#5C4A47] leading-relaxed">
                                {row.usFda.justification}
                              </p>
                            </TableCell>

                            {/* California Column */}
                            <TableCell className="space-y-1.5">
                              <div className="flex items-center justify-between gap-2">
                                <Badge
                                  variant={
                                    row.california.status === 'PASS' ? 'pass' : 'violation'
                                  }
                                >
                                  [{row.california.status}]
                                </Badge>
                                <span className="text-[11px] font-mono text-[#8E5B65] truncate">
                                  {row.california.citation}
                                </span>
                              </div>
                              <div className="text-[11px] font-mono text-[#9E4758]">
                                Limit: {row.california.maxThreshold}
                              </div>
                              <p className="text-xs text-[#5C4A47] leading-relaxed">
                                {row.california.justification}
                              </p>
                            </TableCell>

                            {/* European Union Column */}
                            <TableCell className="space-y-1.5">
                              <div className="flex items-center justify-between gap-2">
                                <Badge variant={row.eu.status === 'PASS' ? 'pass' : 'violation'}>
                                  [{row.eu.status}]
                                </Badge>
                                <span className="text-[11px] font-mono text-[#8E5B65] truncate">
                                  {row.eu.citation}
                                </span>
                              </div>
                              <div className="text-[11px] font-mono text-[#9E4758]">
                                Limit: {row.eu.maxThreshold}
                              </div>
                              <p className="text-xs text-[#5C4A47] leading-relaxed">
                                {row.eu.justification}
                              </p>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 2: 2D CARTON DIELINE & PACKAGING CLAIMS */}
            <TabsContent value="packaging" className="space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                <div className="xl:col-span-7 space-y-4">
                  <Card className="p-6 space-y-5">
                    <div className="flex items-center justify-between border-b border-[#EADCD7] pb-3">
                      <span className="text-xs font-mono text-[#8E5B65]">
                        2D UNFOLDED CARTON DIELINE — 21 CFR § 701.2 PROMINENCE AUDIT
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-[#B85D6F] tabular-nums">
                          Peel Layer: {peelAmount}%
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setPeelAmount(peelAmount > 50 ? 0 : 90)}
                        >
                          {peelAmount > 50 ? 'Restore Outer Sticker' : 'Peel Back Sticker'}
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Front Carton Panel */}
                      <div className="rounded-2xl border border-[#E4D3CD] bg-[#FAF6F3] p-5 flex flex-col justify-between min-h-[280px]">
                        <div className="text-[11px] font-mono text-[#8E5B65] flex justify-between">
                          <span>FRONT PRINCIPAL DISPLAY PANEL</span>
                          <span>21 CFR § 701.10</span>
                        </div>
                        <div className="my-auto text-center space-y-2 py-4 border-y border-[#EADCD7]">
                          <div className="text-xs tracking-[0.22em] uppercase text-[#B85D6F] font-semibold">
                            {auditResult.brandTwin3D.brandName}
                          </div>
                          <div
                            className="text-xl font-bold text-[#281E1C]"
                            style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
                          >
                            {auditResult.artworkLinting.frontPanelHeader}
                          </div>
                          <p className="text-xs text-[#786662]">
                            {auditResult.artworkLinting.frontPanelSubclaim}
                          </p>
                        </div>
                        <div className="text-[11px] font-mono text-[#8E5B65] text-center">
                          NET WT: {auditResult.brandTwin3D.netWeightLabel}
                        </div>
                      </div>

                      {/* Back Carton Panel with Interactive Peel-Off Layer */}
                      <div className="relative rounded-2xl border border-[#FECDD3] bg-[#FFF1F2]/50 p-5 flex flex-col justify-between min-h-[280px] overflow-hidden">
                        <div className="text-[11px] font-mono text-[#9F1239] flex justify-between">
                          <span>BACK INFORMATION PANEL (UNDERNEATH LAYER)</span>
                          <span>{auditResult.artworkLinting.warningFontSizePt} pt font</span>
                        </div>

                        <div className="my-auto space-y-3 p-3.5 rounded-xl bg-white border border-[#FECDD3]">
                          <Badge variant="violation">[HIDDEN BELOW PEEL-OFF LAYER]</Badge>
                          <p className="text-xs font-mono text-[#881337] leading-relaxed">
                            {auditResult.artworkLinting.buriedPeelOffWarningText}
                          </p>
                          <div className="text-[11px] font-mono text-[#5C4A47] tabular-nums">
                            Evaluated Font: {auditResult.artworkLinting.warningFontSizePt} pt (Min
                            6.0 pt) · Contrast: {auditResult.artworkLinting.contrastRatio}:1 (Min
                            4.5:1)
                          </div>
                        </div>

                        <div className="text-[11px] font-mono text-[#8E5B65]">
                          LOT: {auditResult.brandTwin3D.batchCode}
                        </div>

                        {/* Sliding Outer Peel-Off Graphic Sticker Layer */}
                        <div
                          className="absolute inset-0 bg-[#FAF3F0] border-2 border-[#D8B4A6] p-5 flex flex-col justify-between transition-transform duration-200"
                          style={{
                            transform: `translateX(${peelAmount * 0.92}%) rotate(${
                              peelAmount * 0.08
                            }deg)`,
                            opacity: Math.max(0.12, 1 - peelAmount / 115),
                          }}
                        >
                          <div className="flex items-center justify-between text-[11px] font-mono text-[#B85D6F]">
                            <span>OUTER PEEL-OFF ADHESIVE STICKER</span>
                            <span>PEEL CORNER →</span>
                          </div>
                          <div className="my-auto text-center space-y-2">
                            <div
                              className="text-lg font-semibold text-[#281E1C]"
                              style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
                            >
                              {auditResult.brandTwin3D.peelOffOuterGraphicTitle}
                            </div>
                            <p className="text-xs text-[#6E5A56]">
                              {auditResult.artworkLinting.backPanelSurfaceText}
                            </p>
                          </div>
                          <div className="text-[11px] font-mono text-[#8E5B65] text-center">
                            Click &quot;Peel Back Sticker&quot; to expose buried FDA warning
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Right 5 Cols: Compliance Alerts & Silvering Mission Alignment */}
                <div className="xl:col-span-5 space-y-4">
                  <div className="space-y-3">
                    {auditResult.artworkLinting.alerts.map((alertItem) => (
                      <Alert
                        key={alertItem.id}
                        variant={
                          alertItem.severity === 'CRITICAL'
                            ? 'destructive'
                            : alertItem.severity === 'WARNING'
                            ? 'warning'
                            : 'emerald'
                        }
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <Badge
                            variant={alertItem.severity === 'NOMINAL' ? 'pass' : 'violation'}
                          >
                            [{alertItem.severity}]
                          </Badge>
                          <span className="text-[11px] font-mono text-[#8E5B65]">
                            {alertItem.regulationCitation}
                          </span>
                        </div>
                        <AlertTitle>{alertItem.title}</AlertTitle>
                        <AlertDescription className="space-y-2 mt-1">
                          <p>{alertItem.description}</p>
                          <div className="rounded-xl bg-white/90 border border-[#EADCD7] p-2.5 text-[11px] font-mono text-[#281E1C]">
                            <span className="text-[#B85D6F] font-semibold">Remediation: </span>
                            {alertItem.remediationAction}
                          </div>
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TAB 3: AUTONOMOUS MOCRA DOSSIER GENERATOR */}
            <TabsContent value="dossier" className="space-y-4">
              <Card className="overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-[#FAF4F2] border-b border-[#EADCD7]">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-[#B85D6F]" />
                    <div>
                      <div className="text-xs font-mono font-semibold text-[#281E1C]">
                        {auditResult.mocraDossier.dossierId}.md —{' '}
                        {auditResult.mocraDossier.fdaFormReference}
                      </div>
                      <div className="text-[11px] font-mono text-[#8E5B65]">
                        {auditResult.mocraDossier.submissionWindowStatus} · FEI:{' '}
                        {auditResult.mocraDossier.facilityFeiNumber}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1 p-1 rounded-full bg-[#F5EBE8] border border-[#E4D3CD]">
                      <button
                        type="button"
                        onClick={() => setDossierViewMode('markdown')}
                        className={`px-3 py-1 rounded-full text-[11px] font-medium cursor-pointer ${
                          dossierViewMode === 'markdown'
                            ? 'bg-white text-[#9E4758] shadow-xs'
                            : 'text-[#786662] hover:text-[#281E1C]'
                        }`}
                      >
                        Compiled Dossier
                      </button>
                      <button
                        type="button"
                        onClick={() => setDossierViewMode('structured')}
                        className={`px-3 py-1 rounded-full text-[11px] font-medium cursor-pointer ${
                          dossierViewMode === 'structured'
                            ? 'bg-white text-[#9E4758] shadow-xs'
                            : 'text-[#786662] hover:text-[#281E1C]'
                        }`}
                      >
                        Clinical Tables
                      </button>
                    </div>

                    <Button variant="outline" size="sm" onClick={handleCopyDossier}>
                      {copiedState ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-[#065F46]" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy Packet</span>
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleDownloadFile(
                          auditResult.mocraDossier.compiledMarkdownDocument,
                          `${auditResult.mocraDossier.dossierId}.md`,
                          'text/markdown'
                        )
                      }
                    >
                      <Download className="h-3.5 w-3.5 text-[#B85D6F]" />
                      <span>Export .md</span>
                    </Button>

                    <Button
                      variant="default"
                      size="sm"
                      onClick={() =>
                        handleDownloadFile(
                          JSON.stringify(auditResult.mocraDossier, null, 2),
                          `${auditResult.mocraDossier.dossierId}.json`,
                          'application/json'
                        )
                      }
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Export .json</span>
                    </Button>
                  </div>
                </div>

                {isDecodingDossier ? (
                  <div className="p-8 space-y-6 font-mono">
                    <div className="flex items-center justify-between text-xs text-[#B85D6F] border-b border-[#EADCD7] pb-3">
                      <span>GEMINI 4 ARGON LONG DECODE HORIZON PIPELINE ACTIVE...</span>
                      <span>15-DAY FDA MOCRA SUBMISSION SYNTHESIS</span>
                    </div>
                    <div className="text-xs text-[#6E5A56]">{decodeStepText}</div>
                    <div className="space-y-3">
                      <div className="h-5 w-2/3 rounded bg-[#F5EBE8] animate-pulse" />
                      <div className="h-4 w-full rounded bg-[#FAF3F0] animate-pulse" />
                      <div className="h-4 w-5/6 rounded bg-[#FAF3F0] animate-pulse" />
                    </div>
                  </div>
                ) : dossierViewMode === 'markdown' ? (
                  <div className="p-6 font-mono text-xs leading-relaxed text-[#281E1C] overflow-x-auto">
                    <div className="markdown-body space-y-4">
                      <Markdown>{auditResult.mocraDossier.compiledMarkdownDocument}</Markdown>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {auditResult.mocraDossier.patientAnonymizedProfiles.map((pt, i) => (
                        <div
                          key={i}
                          className="rounded-2xl border border-[#EADCD7] bg-[#FAF6F3] p-4 space-y-2 text-xs"
                        >
                          <div className="flex items-center justify-between font-mono">
                            <span className="font-semibold text-[#281E1C]">{pt.patientCode}</span>
                            <span className="text-[#8E5B65]">{pt.ageGroupAndDemographics}</span>
                          </div>
                          <p className="text-[#5C4A47]">
                            <strong className="text-[#281E1C]">Exposure: </strong>
                            {pt.exposureTimeline}
                          </p>
                          <p className="text-[#5C4A47]">
                            <strong className="text-[#281E1C]">Clinical Presentation: </strong>
                            {pt.clinicalPresentation}
                          </p>
                          <p className="text-[#881337] bg-[#FFF1F2] border border-[#FECDD3] p-2.5 rounded-xl">
                            <strong>ER / Medical Intervention: </strong>
                            {pt.emergencyInterventionRequired}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
