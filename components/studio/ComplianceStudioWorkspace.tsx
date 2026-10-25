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
  Link2,
  Wand2,
  AlertTriangle,
  FileText,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
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
  const [urlRemixBannerFlash, setUrlRemixBannerFlash] = useState<boolean>(
    Boolean(initialCustomAuditResult?.urlRemixMetadata)
  );

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
  const [visualizerMode, setVisualizerMode] = useState<'3d-twin' | '2d-dieline'>('3d-twin');
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
      setUrlRemixBannerFlash(Boolean(initialCustomAuditResult.urlRemixMetadata));
    }
  }, [initialCustomAuditResult]);

  // Trigger simulated long-decode skeleton animation for Preset 3 or live dossier decode
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

  // Load 1-Click Beauty Case Study Preset
  const handleSelectPreset = (presetKey: string) => {
    const presetInput = PRESET_INPUTS[presetKey];
    const presetResult = DETERMINISTIC_PRESET_RESULTS[presetKey];
    if (!presetInput || !presetResult) return;

    setApiError(null);
    setUrlRemixBannerFlash(false);
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

  // Instant + Live URL Brand Remixer & Auditor
  const handleUrlBrandAction = async (
    mode: 'audit-url' | 'generate-distinct-brand',
    rawUrlInput?: string
  ) => {
    const targetUrl = (rawUrlInput ?? sourceProductUrl).trim() || SAMPLE_PRODUCT_URLS[0].url;
    setSourceProductUrl(targetUrl);
    setApiError(null);
    setUrlActionLoading(mode);

    // 1. Immediate synthesis so the user sees instant results for ANY URL without waiting
    const immediateResult = synthesizeUrlBrandResult(targetUrl, mode);
    setAuditResult(immediateResult);
    setActivePresetId(immediateResult.presetId);
    setProductName(immediateResult.productName);
    setProductCategory(immediateResult.productCategory);
    setPeelAmount(immediateResult.brandTwin3D.hasPeelOffStickerTrap ? 75 : 0);
    setUrlRemixBannerFlash(true);

    // Update sidebar formulation preview to match the remixed/audited product
    const formattedInci = immediateResult.matrixRows
      .map((r) => `${r.inciName} (${r.ingredientName}): ${r.concentrationPpm} ppm (${r.concentrationPercent})`)
      .join('\n');
    setFormulationRaw(formattedInci);

    // Scroll main canvas to top so the user immediately sees the Brand Remix Showcase
    mainCanvasTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    setTimeout(() => {
      setUrlActionLoading('none');
    }, 350);
  };

  // Handle JSON / TXT Formulation File Drop or Upload
  const handleFormulationFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setFormulationRaw(text);
    setActivePresetId('custom');
  };

  // Handle Video (.mp4/.webm) or Image Artwork Upload with In-Browser Keyframe Extraction
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
        setActiveTab('packaging');
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
          setActiveTab('packaging');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Run Live Gemini 4 Argon Server Audit on Custom Formulation
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

  // Filtered Matrix Rows
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

  // Export Dossier Helpers
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

  const violationCount = auditResult.matrixRows.reduce((acc, row) => {
    return (
      acc +
      (row.usFda.status === 'VIOLATION' ? 1 : 0) +
      (row.california.status === 'VIOLATION' ? 1 : 0) +
      (row.eu.status === 'VIOLATION' ? 1 : 0)
    );
  }, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      {/* Studio Top Bar Contract (3-Zone Header with Luxury Compact Emblem) */}
      <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-md sticky top-0 z-30">
        {/* Zone 1: Luxury Compact Logo & Editorial Wordmark */}
        <a
          href="/"
          onClick={(e) => {
            if (onBackToLanding) {
              e.preventDefault();
              onBackToLanding();
            }
          }}
          className="flex items-center gap-3 whitespace-nowrap shrink-0 group"
        >
          <span className="h-9 w-9 rounded-full border-2 border-emerald-400/80 bg-gradient-to-br from-emerald-950 via-slate-900 to-amber-950/60 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.25)]">
            <span className="h-5 w-5 rounded-full border border-amber-300/70 bg-emerald-400/20 flex items-center justify-center">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
            </span>
          </span>
          <span
            className="text-xl font-semibold tracking-wider text-slate-50"
            style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
          >
            OPENCOMPACT
          </span>
        </a>

        {/* Zone 2: Concise Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium tracking-wide uppercase text-slate-400">
          <button
            type="button"
            onClick={() => setActiveTab('matrix')}
            className={`hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'matrix' ? 'text-emerald-400 underline underline-offset-8' : ''
            }`}
          >
            01. Formulation Matrix
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('packaging')}
            className={`hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'packaging' ? 'text-emerald-400 underline underline-offset-8' : ''
            }`}
          >
            02. 3D Packaging Twin
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('dossier');
              triggerLongDecodeSequence();
            }}
            className={`hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'dossier' ? 'text-emerald-400 underline underline-offset-8' : ''
            }`}
          >
            03. MoCRA Legal Dossier
          </button>
          {onOpenReadmeModal && (
            <button
              type="button"
              onClick={onOpenReadmeModal}
              className="hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
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
              <span>Atelier Home</span>
            </Button>
          ) : (
            <Button size="sm" onClick={runLiveArgonAudit} disabled={isAuditing}>
              <Sparkles className="h-3.5 w-3.5" />
              <span>{isAuditing ? 'Auditing Formula...' : 'Run Deep Audit'}</span>
            </Button>
          )}
        </div>
      </header>

      {/* Main Sidebar + Performance Canvas Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 max-w-[1600px] w-full mx-auto">
        {/* LEFT SIDEBAR: PRESTIGE BEAUTY FORMULATION & BRAND CONTROLS */}
        <aside className="lg:col-span-4 xl:col-span-3 border-b lg:border-b-0 lg:border-r border-slate-800/80 bg-slate-900/50 p-5 flex flex-col gap-6 overflow-y-auto lg:max-h-[calc(100vh-65px)]">
          {/* 1. Product URL Brand Remixer & Auditor (Featured at Top of Sidebar) */}
          <div className="rounded-xl border border-emerald-500/40 bg-slate-950/90 p-4 space-y-3 shadow-[0_0_25px_rgba(16,185,129,0.08)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Wand2 className="h-3.5 w-3.5" />
                <span>Product URL Brand Remixer</span>
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Paste any Sephora, Ulta, or brand product URL to audit its ingredients or instantly
              remix it into a clean, globally compliant luxury brand.
            </p>

            <div className="space-y-2">
              <label className="text-[11px] text-slate-400 block">
                Quick-Fill Reference Product URL:
              </label>
              <select
                aria-label="Sample product URLs"
                value={
                  SAMPLE_PRODUCT_URLS.some((u) => u.url === sourceProductUrl)
                    ? sourceProductUrl
                    : 'custom'
                }
                onChange={(e) => {
                  if (e.target.value !== 'custom') {
                    setSourceProductUrl(e.target.value);
                  }
                }}
                className="w-full rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                {SAMPLE_PRODUCT_URLS.map((item) => (
                  <option key={item.id} value={item.url}>
                    {item.label}
                  </option>
                ))}
                <option value="custom">Custom Product URL...</option>
              </select>

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
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 gap-2 pt-1">
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
                    ? 'Synthesizing Luxury Brand...'
                    : 'Remix URL into Compliant Brand'}
                </span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUrlBrandAction('audit-url', sourceProductUrl)}
                disabled={urlActionLoading !== 'none'}
                className="w-full justify-center text-xs"
              >
                <Search className="h-3.5 w-3.5" />
                <span>
                  {urlActionLoading === 'audit-url'
                    ? 'Auditing Reference URL...'
                    : 'Audit Original URL For Violations'}
                </span>
              </Button>
            </div>
          </div>

          {/* 2. Curated Beauty Case Studies (1-Click Presets) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Curated Beauty Case Studies
              </span>
              <span className="text-[11px] text-emerald-400">1-Click Load</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {Object.entries(PRESET_INPUTS).map(([key, preset]) => {
                const isSelected = activePresetId === key;
                const isPassPreset = key === 'silvering-toner';
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSelectPreset(key)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? isPassPreset
                          ? 'border-emerald-500/70 bg-emerald-950/30 shadow-[0_0_20px_rgba(16,185,129,0.12)]'
                          : 'border-rose-500/70 bg-rose-950/25 shadow-[0_0_20px_rgba(244,63,94,0.12)]'
                        : 'border-slate-800 bg-slate-900/90 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-100 truncate">
                        {preset.name}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mb-1">
                      {preset.badgeLabel}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                      {preset.shortDescription}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Formulation Lab Ingestion (INCI & PPM) */}
          <div className="space-y-2.5 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Formulation Sheet (INCI / ppm)
              </span>
              <button
                type="button"
                onClick={() => jsonFileInputRef.current?.click()}
                className="text-[11px] font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
              >
                <Upload className="h-3 w-3" />
                <span>Import File</span>
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
              rows={5}
              value={formulationRaw}
              onChange={(e) => {
                setFormulationRaw(e.target.value);
                setActivePresetId('custom');
              }}
              placeholder="Paste INCI ingredient list with ppm or % concentrations..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs font-mono text-slate-200 leading-relaxed focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* 4. 3D Packaging Vessel & Artwork Upload */}
          <div className="space-y-2.5 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Video className="h-3.5 w-3.5 text-emerald-400" />
                <span>Packaging Artwork & 3D Vessel</span>
              </span>
            </div>

            <textarea
              rows={2}
              value={brandPrompt}
              onChange={(e) => setBrandPrompt(e.target.value)}
              placeholder="Describe luxury compact, dropper bottle, or finish..."
              className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            />

            <div
              onClick={() => mediaFileInputRef.current?.click()}
              className="rounded-xl border border-dashed border-slate-700 bg-slate-950/70 p-3 text-center hover:border-emerald-500/60 transition-colors cursor-pointer"
            >
              <Upload className="h-4 w-4 text-slate-400 mx-auto mb-1" />
              <div className="text-xs font-medium text-slate-200">
                {uploadedMediaName ||
                  artworkMetadata.uploadedFileName ||
                  'Upload Carton Artwork or Product Video'}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {isExtractingVideo
                  ? 'Extracting keyframes for packaging review...'
                  : 'Inspects label prominence & peel-off layers'}
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
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                {extractedFrames.map((frame, i) => (
                  <div
                    key={i}
                    className="relative rounded-md overflow-hidden border border-slate-700 bg-slate-950 aspect-video"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={frame.data}
                      alt={`Extracted frame ${i + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-0.5 right-1 text-[9px] font-mono bg-slate-950/80 px-1 rounded text-emerald-300">
                      {frame.timestampSec}s
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Peel-Off & Font Prominence Overrides */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="rounded-lg border border-slate-800 bg-slate-950 p-2">
                <label className="text-[10px] text-slate-400 block">
                  Warning Font Size (pt)
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
                  className="w-full bg-transparent text-xs font-mono text-slate-100 focus:outline-none tabular-nums mt-0.5"
                />
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950 p-2 flex flex-col justify-between">
                <span className="text-[10px] text-slate-400 block">Back Label Layer</span>
                <button
                  type="button"
                  onClick={() =>
                    setArtworkMetadata((prev) => ({
                      ...prev,
                      isBehindPeelOffLayer: !prev.isBehindPeelOffLayer,
                    }))
                  }
                  className={`text-left text-xs font-mono font-semibold cursor-pointer ${
                    artworkMetadata.isBehindPeelOffLayer ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {artworkMetadata.isBehindPeelOffLayer ? 'PEEL-OFF TRAP' : 'DIRECT PRINT'}
                </button>
              </div>
            </div>
          </div>

          {/* 5. Consumer Care & Adverse Event Log Input */}
          <div className="space-y-2 pt-4 border-t border-slate-800">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
              Consumer Care & Adverse Event Logs
            </span>
            <textarea
              rows={3}
              value={adverseEventLogs}
              onChange={(e) => setAdverseEventLogs(e.target.value)}
              placeholder="Paste consumer clinical reports for 15-day MoCRA dossier..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs font-mono text-slate-300 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <Button onClick={runLiveArgonAudit} disabled={isAuditing} className="w-full mt-1">
            <Sparkles className="h-4 w-4" />
            <span>
              {isAuditing ? 'Running Deep Formulation Audit...' : 'Run Custom Formulation Audit'}
            </span>
          </Button>
        </aside>

        {/* RIGHT MAIN PERFORMANCE CANVAS */}
        <main
          ref={mainCanvasTopRef}
          className="lg:col-span-8 xl:col-span-9 p-6 flex flex-col gap-6 overflow-y-auto"
        >
          {/* Quick Top URL Brand Remixer Bar (So users can also paste any URL right at top of Studio) */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs text-slate-300 shrink-0">
              <Link2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span className="font-semibold text-slate-100">Instant URL Brand Remixer:</span>
            </div>
            <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
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
                placeholder="Paste any Sephora, Ulta, or beauty product URL to remix..."
                className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  onClick={() => handleUrlBrandAction('generate-distinct-brand', sourceProductUrl)}
                  disabled={urlActionLoading !== 'none'}
                >
                  <Wand2 className="h-3.5 w-3.5" />
                  <span>Remix into Compliant Brand</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUrlBrandAction('audit-url', sourceProductUrl)}
                  disabled={urlActionLoading !== 'none'}
                >
                  <Search className="h-3.5 w-3.5" />
                  <span>Audit URL</span>
                </Button>
              </div>
            </div>
          </div>

          {/* URL Remix / Distinct Compliant Brand Result Showcase Banner */}
          {auditResult.urlRemixMetadata && urlRemixBannerFlash && (
            <Card
              className={
                auditResult.urlRemixMetadata.mode === 'generate-distinct-brand'
                  ? 'border-emerald-500/70 bg-gradient-to-br from-emerald-950/35 via-slate-900 to-slate-950 shadow-[0_0_35px_rgba(16,185,129,0.14)]'
                  : 'border-rose-500/60 bg-gradient-to-br from-rose-950/30 via-slate-900 to-slate-950'
              }
            >
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>
                        {auditResult.urlRemixMetadata.mode === 'generate-distinct-brand'
                          ? 'NEW COMPLIANT LUXURY BRAND SYNTHESIZED FROM URL'
                          : 'ORIGINAL PRODUCT URL COMPLIANCE AUDIT COMPLETE'}
                      </span>
                    </div>
                    <CardTitle
                      className="text-xl text-slate-50"
                      style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
                    >
                      {auditResult.brandTwin3D.brandName} — {auditResult.brandTwin3D.productTitle}
                    </CardTitle>
                    <p className="text-xs text-slate-400 font-mono truncate max-w-2xl">
                      Source URL: {auditResult.urlRemixMetadata.sourceUrl}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => setActiveTab('packaging')}
                    >
                      <Layers className="h-3.5 w-3.5" />
                      <span>View 3D Remixed Packaging Twin</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <CardDescription className="text-slate-200 pt-1 text-xs leading-relaxed">
                  {auditResult.urlRemixMetadata.differentiationStrategy}
                </CardDescription>
              </CardHeader>

              {auditResult.urlRemixMetadata.substitutedIngredients.length > 0 && (
                <CardContent className="space-y-2.5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                    Clean Formulation Substitutions Applied (Before → After):
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {auditResult.urlRemixMetadata.substitutedIngredients.map((sub, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-slate-800 bg-slate-950/90 p-3.5 text-xs space-y-1.5"
                      >
                        <div className="font-mono text-rose-400 line-through text-[11px]">
                          Removed: {sub.replaced}
                        </div>
                        <div className="font-mono text-emerald-300 font-semibold text-xs">
                          Added: {sub.replacement}
                        </div>
                        <p className="text-slate-400 text-[11px] leading-relaxed">{sub.reason}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          )}

          {/* Top Audit Summary Banner */}
          <div
            className={`rounded-xl border p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              auditResult.overallStatus === 'PASS'
                ? 'border-emerald-500/50 bg-emerald-950/20'
                : 'border-rose-500/50 bg-rose-950/20'
            }`}
          >
            <div className="space-y-1.5 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <Badge variant={auditResult.overallStatus === 'PASS' ? 'pass' : 'violation'}>
                  [{auditResult.overallStatus}]
                </Badge>
                <span className="font-semibold text-slate-200">{auditResult.productName}</span>
                <span aria-hidden="true">·</span>
                <span>{auditResult.productCategory}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-slate-300 tabular-nums">
                  {violationCount === 0
                    ? '0 Regulatory Violations (Retail Ready)'
                    : `${violationCount} Jurisdictional Flags`}
                </span>
              </div>
              <h1
                className="text-lg sm:text-xl font-semibold text-slate-50 tracking-tight"
                style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
              >
                {auditResult.summaryHeadline}
              </h1>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={() => setActiveTab('packaging')}>
                <Layers className="h-3.5 w-3.5 text-emerald-400" />
                <span>3D Packaging Twin</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setActiveTab('dossier');
                  triggerLongDecodeSequence();
                }}
              >
                <FileCode2 className="h-3.5 w-3.5 text-rose-400" />
                <span>15-Day MoCRA Dossier</span>
              </Button>
            </div>
          </div>

          {apiError && (
            <Alert variant="warning">
              <AlertTitle className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <span>Formulation Audit Notice</span>
              </AlertTitle>
              <AlertDescription>
                {apiError} — Displaying verified statutory toxicology telemetry.
              </AlertDescription>
            </Alert>
          )}

          {/* SHADCN TABS WORKSPACE CANVAS */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <TabsList>
                <TabsTrigger value="matrix">
                  <Globe className="h-3.5 w-3.5 mr-1.5" />
                  <span>01. Global Retail Compliance Matrix</span>
                </TabsTrigger>
                <TabsTrigger value="packaging">
                  <Layers className="h-3.5 w-3.5 mr-1.5" />
                  <span>02. 3D Brand Twin & Label Inspector</span>
                </TabsTrigger>
                <TabsTrigger
                  value="dossier"
                  onClick={() => {
                    if (!isDecodingDossier) triggerLongDecodeSequence();
                  }}
                >
                  <FileCode2 className="h-3.5 w-3.5 mr-1.5" />
                  <span>03. 15-Day FDA MoCRA Dossier</span>
                </TabsTrigger>
              </TabsList>

              <div className="text-xs font-mono text-slate-400 tabular-nums">
                Engine: {auditResult.modelEngine}
              </div>
            </div>

            {/* TAB 1: THE GLOBAL MATRIX GRID */}
            <TabsContent value="matrix" className="space-y-4">
              <Card>
                <CardHeader className="pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800">
                  <div>
                    <CardTitle
                      className="text-lg"
                      style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
                    >
                      Multi-Jurisdictional Formulation & Retail Clearance Matrix
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
                      <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={matrixSearch}
                        onChange={(e) => setMatrixSearch(e.target.value)}
                        placeholder="Filter INCI or CAS..."
                        className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-950 border border-slate-800">
                      {(['ALL', 'VIOLATION', 'PASS'] as const).map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setMatrixFilter(status)}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                            matrixFilter === status
                              ? 'bg-slate-800 text-emerald-300'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {status === 'ALL'
                            ? 'All Ingredients'
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
                        <TableHead className="w-[220px]">Evaluated Ingredient & CAS</TableHead>
                        <TableHead className="text-right w-[130px]">Evaluated Conc.</TableHead>
                        <TableHead className="w-[270px]">US FDA (MoCRA / 21 CFR)</TableHead>
                        <TableHead className="w-[270px]">California (Toxic-Free Act)</TableHead>
                        <TableHead className="w-[270px]">European Union (EC 1223/2009)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRows.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-slate-400">
                            No ingredients match the current filter criteria.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredRows.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell className="space-y-1">
                              <div className="font-semibold text-slate-100">
                                {row.ingredientName}
                              </div>
                              <div className="text-[11px] font-mono text-slate-400">
                                INCI: {row.inciName} · CAS {row.casNumber}
                              </div>
                              <div className="text-[11px] text-slate-400">
                                {row.roleInFormulation}
                              </div>
                            </TableCell>

                            <TableCell className="text-right font-mono tabular-nums">
                              <div className="text-sm font-semibold text-slate-100">
                                {row.concentrationPpm.toLocaleString()} ppm
                              </div>
                              <div className="text-[11px] text-slate-400">
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
                                <span className="text-[11px] font-mono text-slate-400 truncate">
                                  {row.usFda.citation}
                                </span>
                              </div>
                              <div className="text-[11px] font-mono text-slate-300">
                                Limit: {row.usFda.maxThreshold}
                              </div>
                              <p className="text-xs text-slate-300 leading-relaxed">
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
                                <span className="text-[11px] font-mono text-slate-400 truncate">
                                  {row.california.citation}
                                </span>
                              </div>
                              <div className="text-[11px] font-mono text-slate-300">
                                Limit: {row.california.maxThreshold}
                              </div>
                              <p className="text-xs text-slate-300 leading-relaxed">
                                {row.california.justification}
                              </p>
                            </TableCell>

                            {/* European Union Column */}
                            <TableCell className="space-y-1.5">
                              <div className="flex items-center justify-between gap-2">
                                <Badge variant={row.eu.status === 'PASS' ? 'pass' : 'violation'}>
                                  [{row.eu.status}]
                                </Badge>
                                <span className="text-[11px] font-mono text-slate-400 truncate">
                                  {row.eu.citation}
                                </span>
                              </div>
                              <div className="text-[11px] font-mono text-slate-300">
                                Limit: {row.eu.maxThreshold}
                              </div>
                              <p className="text-xs text-slate-300 leading-relaxed">
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

            {/* TAB 2: MULTIMODAL 3D BRAND TWIN & PACKAGING LINTING */}
            <TabsContent value="packaging" className="space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                {/* Left 7 Cols: Interactive 3D Packaging Twin + 2D Dieline Box Preview */}
                <div className="xl:col-span-7 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2
                        className="text-lg font-semibold text-slate-100"
                        style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
                      >
                        Interactive 3D Packaging Twin & Peel-Off Label Inspector
                      </h2>
                      <p className="text-xs text-slate-400">
                        Paired with the formulation matrix. Drag to orbit the 3D compact/bottle or
                        peel back the adhesive label layer.
                      </p>
                    </div>

                    <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-900 border border-slate-800">
                      <button
                        type="button"
                        onClick={() => setVisualizerMode('3d-twin')}
                        className={`px-3 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                          visualizerMode === '3d-twin'
                            ? 'bg-slate-800 text-emerald-300 border border-emerald-500/40'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        3D Vessel Studio
                      </button>
                      <button
                        type="button"
                        onClick={() => setVisualizerMode('2d-dieline')}
                        className={`px-3 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                          visualizerMode === '2d-dieline'
                            ? 'bg-slate-800 text-emerald-300 border border-emerald-500/40'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        2D Carton Dieline
                      </button>
                    </div>
                  </div>

                  {visualizerMode === '3d-twin' ? (
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
                  ) : (
                    /* 2D Package Box Text Alignment & Peel-Off Simulator */
                    <Card className="p-6 space-y-5 bg-slate-950 border-slate-800">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <span className="text-xs font-mono text-slate-400">
                          2D UNFOLDED CARTON DIELINE — 21 CFR § 701.2 PROMINENCE AUDIT
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-emerald-400 tabular-nums">
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
                        <div className="rounded-xl border border-slate-700 bg-slate-900 p-5 flex flex-col justify-between min-h-[300px]">
                          <div className="text-[11px] font-mono text-slate-400 flex justify-between">
                            <span>FRONT PRINCIPAL DISPLAY PANEL</span>
                            <span>21 CFR § 701.10</span>
                          </div>
                          <div className="my-auto text-center space-y-2 py-4 border-y border-slate-800">
                            <div className="text-xs font-mono tracking-widest text-emerald-400">
                              {auditResult.brandTwin3D.brandName}
                            </div>
                            <div
                              className="text-lg font-bold text-slate-50"
                              style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
                            >
                              {auditResult.artworkLinting.frontPanelHeader}
                            </div>
                            <p className="text-xs text-slate-400">
                              {auditResult.artworkLinting.frontPanelSubclaim}
                            </p>
                          </div>
                          <div className="text-[11px] font-mono text-slate-400 text-center">
                            NET WT: {auditResult.brandTwin3D.netWeightLabel}
                          </div>
                        </div>

                        {/* Back Carton Panel with Interactive Peel-Off Layer */}
                        <div className="relative rounded-xl border border-rose-500/60 bg-slate-900 p-5 flex flex-col justify-between min-h-[300px] overflow-hidden">
                          <div className="text-[11px] font-mono text-rose-300 flex justify-between">
                            <span>BACK INFORMATION PANEL (UNDERNEATH LAYER)</span>
                            <span>{auditResult.artworkLinting.warningFontSizePt} pt font</span>
                          </div>

                          <div className="my-auto space-y-3 p-3 rounded-lg bg-rose-950/40 border border-rose-500/50">
                            <Badge variant="violation">[HIDDEN BELOW PEEL-OFF LAYER]</Badge>
                            <p className="text-xs font-mono text-rose-100 leading-relaxed">
                              {auditResult.artworkLinting.buriedPeelOffWarningText}
                            </p>
                            <div className="text-[11px] font-mono text-slate-300 tabular-nums">
                              Evaluated Font: {auditResult.artworkLinting.warningFontSizePt} pt (Min
                              6.0 pt) · Contrast: {auditResult.artworkLinting.contrastRatio}:1 (Min
                              4.5:1)
                            </div>
                          </div>

                          <div className="text-[11px] font-mono text-slate-400">
                            LOT: {auditResult.brandTwin3D.batchCode}
                          </div>

                          {/* Sliding Outer Peel-Off Graphic Sticker Layer */}
                          <div
                            className="absolute inset-0 bg-slate-800 border-2 border-slate-600 p-5 flex flex-col justify-between transition-transform duration-200"
                            style={{
                              transform: `translateX(${peelAmount * 0.92}%) rotate(${
                                peelAmount * 0.08
                              }deg)`,
                              opacity: Math.max(0.12, 1 - peelAmount / 115),
                            }}
                          >
                            <div className="flex items-center justify-between text-[11px] font-mono text-amber-300">
                              <span>OUTER PEEL-OFF ADHESIVE STICKER</span>
                              <span>PEEL CORNER →</span>
                            </div>
                            <div className="my-auto text-center space-y-2">
                              <div className="text-sm font-semibold text-slate-100">
                                {auditResult.brandTwin3D.peelOffOuterGraphicTitle}
                              </div>
                              <p className="text-xs text-slate-300">
                                {auditResult.artworkLinting.backPanelSurfaceText}
                              </p>
                            </div>
                            <div className="text-[11px] font-mono text-slate-400 text-center">
                              Drag Peel Slider to expose buried FDA warning underneath
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}

                  {/* Typography & Contrast Quantitative Telemetry Strip */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5">
                      <div className="text-[11px] text-slate-400">Warning Typography Size</div>
                      <div className="text-base font-mono font-semibold text-slate-50 tabular-nums mt-0.5">
                        {auditResult.artworkLinting.warningFontSizePt} pt{' '}
                        <span className="text-xs text-slate-400 font-normal">
                          / {auditResult.artworkLinting.requiredMinFontSizePt} pt min
                        </span>
                      </div>
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5">
                      <div className="text-[11px] text-slate-400">Luminance Contrast Ratio</div>
                      <div className="text-base font-mono font-semibold text-slate-50 tabular-nums mt-0.5">
                        {auditResult.artworkLinting.contrastRatio}:1{' '}
                        <span className="text-xs text-slate-400 font-normal">
                          / {auditResult.artworkLinting.requiredMinContrastRatio}:1 min
                        </span>
                      </div>
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5">
                      <div className="text-[11px] text-slate-400">Peel-Off Layer Occlusion</div>
                      <div
                        className={`text-base font-mono font-semibold mt-0.5 ${
                          auditResult.artworkLinting.isBehindPeelOffLayer
                            ? 'text-rose-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {auditResult.artworkLinting.isBehindPeelOffLayer
                          ? 'VIOLATION (BURIED)'
                          : 'PASS (SURFACE)'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right 5 Cols: Side-by-Side Compliance Alert Cards & Silvering Mission Linter */}
                <div className="xl:col-span-5 space-y-4">
                  <div>
                    <h3
                      className="text-lg font-semibold text-slate-100"
                      style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
                    >
                      Packaging Artwork & Claim Compliance Alerts
                    </h3>
                    <p className="text-xs text-slate-400">
                      Automated structural typography, peel-off prominence, and brand-mission claim
                      evaluation.
                    </p>
                  </div>

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
                          <span className="text-[11px] font-mono text-slate-300">
                            {alertItem.regulationCitation}
                          </span>
                        </div>
                        <AlertTitle>{alertItem.title}</AlertTitle>
                        <AlertDescription className="space-y-2 mt-1">
                          <p>{alertItem.description}</p>
                          <div className="rounded-lg bg-slate-950/60 border border-slate-800/80 p-2.5 text-[11px] font-mono text-slate-200">
                            <span className="text-emerald-400 font-semibold">Remediation: </span>
                            {alertItem.remediationAction}
                          </div>
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>

                  {/* Silvering 5-Pillar Positive Messaging & Drug-Claim Boundary Card */}
                  <Card className="border-slate-800 bg-slate-900/90">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between gap-2">
                        <CardTitle
                          className="text-base"
                          style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
                        >
                          Modern Beauty Founder Ethos & Claim Audit
                        </CardTitle>
                        <Badge
                          variant={
                            auditResult.artworkLinting.silveringMissionAlignment.status === 'PASS'
                              ? 'pass'
                              : 'violation'
                          }
                        >
                          [{auditResult.artworkLinting.silveringMissionAlignment.status}]
                        </Badge>
                      </div>
                      <CardDescription>
                        Inspired by Alexis Eizinas of Silvering: positive consumer communication
                        &amp; FDA cosmetic vs. drug boundary check.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2.5 text-xs">
                      <div className="flex items-center justify-between font-mono text-slate-300 border-b border-slate-800 pb-2">
                        <span>Brand Integrity & Tone Score:</span>
                        <span className="text-emerald-400 font-semibold">
                          {auditResult.artworkLinting.silveringMissionAlignment.toneScore}
                        </span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        <strong className="text-slate-100">Positive Messaging Check: </strong>
                        {
                          auditResult.artworkLinting.silveringMissionAlignment
                            .positiveMessagingAssessment
                        }
                      </p>
                      <p className="text-slate-300 leading-relaxed">
                        <strong className="text-slate-100">
                          FD&amp;C Act § 201(g) Drug Crossover:{' '}
                        </strong>
                        {
                          auditResult.artworkLinting.silveringMissionAlignment
                            .drugClaimCrossoverCheck
                        }
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* TAB 3: AUTONOMOUS MOCRA DOSSIER GENERATOR (LONG DECODE DISPLAY) */}
            <TabsContent value="dossier" className="space-y-4">
              <Card className="border-slate-800 bg-slate-950 overflow-hidden">
                {/* Code-Editor Header Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-slate-900 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-emerald-400" />
                    <div>
                      <div className="text-xs font-mono font-semibold text-slate-100">
                        {auditResult.mocraDossier.dossierId}.md —{' '}
                        {auditResult.mocraDossier.fdaFormReference}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        {auditResult.mocraDossier.submissionWindowStatus} · FEI:{' '}
                        {auditResult.mocraDossier.facilityFeiNumber}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-950 border border-slate-800">
                      <button
                        type="button"
                        onClick={() => setDossierViewMode('markdown')}
                        className={`px-2.5 py-1 rounded text-[11px] font-medium cursor-pointer ${
                          dossierViewMode === 'markdown'
                            ? 'bg-slate-800 text-emerald-300'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Compiled Dossier Editor
                      </button>
                      <button
                        type="button"
                        onClick={() => setDossierViewMode('structured')}
                        className={`px-2.5 py-1 rounded text-[11px] font-medium cursor-pointer ${
                          dossierViewMode === 'structured'
                            ? 'bg-slate-800 text-emerald-300'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Structured Clinical Tables
                      </button>
                    </div>

                    <Button variant="outline" size="sm" onClick={handleCopyDossier}>
                      {copiedState ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
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
                      <Download className="h-3.5 w-3.5 text-emerald-400" />
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

                {/* Skeleton Long-Decode Loader or Full Multi-Page Legal Packet */}
                {isDecodingDossier ? (
                  <div className="p-8 space-y-6 font-mono">
                    <div className="flex items-center justify-between text-xs text-emerald-400 border-b border-slate-800 pb-3">
                      <span>GEMINI 4 ARGON LONG DECODE HORIZON PIPELINE ACTIVE...</span>
                      <span>15-DAY FDA MOCRA SUBMISSION SYNTHESIS</span>
                    </div>
                    <div className="text-xs text-slate-300">{decodeStepText}</div>
                    <div className="space-y-3">
                      <div className="h-5 w-2/3 rounded bg-slate-800/80 animate-pulse" />
                      <div className="h-4 w-full rounded bg-slate-800/60 animate-pulse" />
                      <div className="h-4 w-5/6 rounded bg-slate-800/60 animate-pulse" />
                      <div className="h-24 w-full rounded-lg bg-slate-900 border border-slate-800 animate-pulse mt-4" />
                      <div className="h-4 w-3/4 rounded bg-slate-800/60 animate-pulse" />
                      <div className="h-4 w-4/5 rounded bg-slate-800/60 animate-pulse" />
                    </div>
                  </div>
                ) : dossierViewMode === 'markdown' ? (
                  <div className="grid grid-cols-1 lg:grid-cols-12">
                    {/* Left Quick-Jump Dossier Sections */}
                    <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-900/40 p-4 space-y-3">
                      <div className="text-xs font-semibold text-slate-200">
                        15-Day Submission Packet Index
                      </div>
                      <div className="space-y-1.5 text-xs font-mono text-slate-400">
                        <div className="p-2 rounded bg-slate-900 border border-slate-800 text-emerald-300">
                          01. Patient Anonymized Profiles (
                          {auditResult.mocraDossier.patientAnonymizedProfiles.length})
                        </div>
                        <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">
                          02. Chronological Stability Mapping (
                          {auditResult.mocraDossier.chronologicalStabilityMapping.length})
                        </div>
                        <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">
                          03. Toxicological Hazard Assessment
                        </div>
                        <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">
                          04. Clinical Follow-Up Templates (
                          {auditResult.mocraDossier.clinicalInterviewTemplates.length})
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-800 space-y-1.5 text-[11px] font-mono text-slate-400">
                        <div>
                          Responsible Entity:{' '}
                          <span className="text-slate-200">
                            {auditResult.mocraDossier.responsiblePersonEntity}
                          </span>
                        </div>
                        <div>
                          Batch Lot:{' '}
                          <span className="text-rose-300">
                            {auditResult.mocraDossier.batchNumber}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Code-Themed Markdown Document Canvas */}
                    <div className="lg:col-span-9 p-6 font-mono text-xs leading-relaxed text-slate-200 overflow-x-auto prose prose-invert max-w-none">
                      <div className="markdown-body space-y-4">
                        <Markdown>{auditResult.mocraDossier.compiledMarkdownDocument}</Markdown>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Structured Clinical & Stability Tables View */
                  <div className="p-6 space-y-6">
                    {/* Section 1: Patient Anonymized Data Profiles */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-emerald-400 font-mono">
                        01. PATIENT ANONYMIZED DATA PROFILES &amp; EMERGENCY INTERVENTION
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {auditResult.mocraDossier.patientAnonymizedProfiles.map((pt, i) => (
                          <div
                            key={i}
                            className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 space-y-2 text-xs"
                          >
                            <div className="flex items-center justify-between font-mono">
                              <span className="font-semibold text-slate-100">{pt.patientCode}</span>
                              <span className="text-slate-400">{pt.ageGroupAndDemographics}</span>
                            </div>
                            <p className="text-slate-300">
                              <strong className="text-slate-100">Exposure: </strong>
                              {pt.exposureTimeline}
                            </p>
                            <p className="text-slate-300">
                              <strong className="text-slate-100">Clinical Presentation: </strong>
                              {pt.clinicalPresentation}
                            </p>
                            <p className="text-rose-200 bg-rose-950/30 border border-rose-500/30 p-2 rounded">
                              <strong>ER / Medical Intervention: </strong>
                              {pt.emergencyInterventionRequired}
                            </p>
                            <p className="text-emerald-300 font-mono text-[11px]">
                              Outcome: {pt.outcomeStatus}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Section 2: Chronological Formulation Stability Mapping */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-emerald-400 font-mono">
                        02. CHRONOLOGICAL FORMULATION STABILITY &amp; BATCH FORENSICS
                      </h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Timestamp</TableHead>
                            <TableHead>Manufacturing / QC Phase</TableHead>
                            <TableHead>pH &amp; Viscosity Telemetry</TableHead>
                            <TableHead>Contaminant / Excursion Finding</TableHead>
                            <TableHead>Disposition</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {auditResult.mocraDossier.chronologicalStabilityMapping.map((item, i) => (
                            <TableRow key={i}>
                              <TableCell className="font-mono">{item.timestamp}</TableCell>
                              <TableCell className="font-semibold">{item.phase}</TableCell>
                              <TableCell className="font-mono text-amber-300">
                                {item.phAndViscosityReading}
                              </TableCell>
                              <TableCell>{item.contaminantOrDegradationFinding}</TableCell>
                              <TableCell className="font-mono text-rose-300">
                                {item.disposition}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Section 3: Toxicological Hazard Assessment */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-emerald-400 font-mono">
                        03. TOXICOLOGICAL HAZARD &amp; MARGIN OF SAFETY (MoS) ASSESSMENT
                      </h3>
                      <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 space-y-2 text-xs">
                        <div>
                          <strong className="text-slate-100">Primary Causative Agent: </strong>
                          <span className="font-mono text-rose-300">
                            {
                              auditResult.mocraDossier.toxicologicalHazardAssessment
                                .primaryCausativeAgent
                            }
                          </span>
                        </div>
                        <div>
                          <strong className="text-slate-100">Mechanistic Pathway: </strong>
                          <span className="text-slate-300">
                            {
                              auditResult.mocraDossier.toxicologicalHazardAssessment
                                .mechanisticPathway
                            }
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 font-mono">
                          <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                            NOAEL Comparison:{' '}
                            {auditResult.mocraDossier.toxicologicalHazardAssessment.noaelComparison}
                          </div>
                          <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-emerald-300">
                            Margin of Safety:{' '}
                            {
                              auditResult.mocraDossier.toxicologicalHazardAssessment
                                .dermalAndOcularMarginOfSafety
                            }
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 4: Structured Follow-Up Clinical Interview Templates */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-emerald-400 font-mono">
                        04. STRUCTURED FOLLOW-UP CLINICAL INTERVIEW TEMPLATES
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {auditResult.mocraDossier.clinicalInterviewTemplates.map((tpl, i) => (
                          <div
                            key={i}
                            className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 space-y-2.5 text-xs"
                          >
                            <div className="font-mono font-semibold text-slate-100">
                              {tpl.sectionCode}
                            </div>
                            <p className="text-slate-300">{tpl.clinicianPrompt}</p>
                            <div className="space-y-1 pt-1">
                              {tpl.mandatoryDataFields.map((field, fIdx) => (
                                <div
                                  key={fIdx}
                                  className="font-mono text-[11px] text-emerald-300 flex items-center gap-1.5"
                                >
                                  <span>[ ]</span>
                                  <span>{field}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
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
