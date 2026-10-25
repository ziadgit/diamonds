'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Markdown from 'react-markdown';
import {
  Sparkles,
  Star,
  ArrowRight,
  Check,
  Copy,
  Layers,
  FileCode2,
  Globe,
  Play,
  BookOpen,
  Wand2,
  Link2,
  Search,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  ComplianceAuditResult,
  DETERMINISTIC_PRESET_RESULTS,
  OPENCOMPACT_README_MD,
  SAMPLE_PRODUCT_URLS,
  SILVERING_FIVE_PILLARS,
  synthesizeUrlBrandResult,
} from '@/lib/compliance-data';
import { ComplianceStudioWorkspace } from '@/components/studio/ComplianceStudioWorkspace';

const SANDBOX_RAW_SAMPLES: Record<
  string,
  {
    label: string;
    presetKey: string;
    rawChemicalString: string;
  }
> = {
  'huda-matrix': {
    label: 'Pressed Pigment Compact (Red 28)',
    presetKey: 'huda-matrix',
    rawChemicalString:
      'FORMULATION SHEET // Electric Neon Pressed Compact (Eye & Lid) => Talc: 440,000 ppm | CI 45410 (D&C Red No. 28 Aluminum Lake): 18,500 ppm (1.85%) | CI 15850 (D&C Red No. 7 Lake): 9,400 ppm | CI 77510 (Ferric Ferrocyanide): 14,000 ppm | BACK LABEL: 3.5pt warning buried beneath peel-off sticker',
  },
  'ca-pfas-trap': {
    label: 'Velvet Silk Primer (0.1% PTFE)',
    presetKey: 'ca-pfas-trap',
    rawChemicalString:
      'FORMULATION SHEET // Velvet Blur Facial Primer => Aqua: 510,000 ppm | Cyclopentasiloxane (D5): 45,000 ppm (4.5%) | Polytetrafluoroethylene (PTFE): 1,000 ppm (0.10%) | Perfluorononyl Dimethicone: 250 ppm | Niacinamide: 30,000 ppm | CLAIM: "100% Clean Beauty"',
  },
  'silvering-toner': {
    label: 'Silvering Toning Elixir (Clean Pass)',
    presetKey: 'silvering-toner',
    rawChemicalString:
      'FORMULATION SHEET // Silvering Luxe Toning & Scalp Elixir => Aqua: 780,000 ppm | CI 60730 (Ext. D&C Violet No. 2 / Acid Violet 43): 1,200 ppm (0.12%) | Biotinoyl Tripeptide-1: 500 ppm | Niacinamide: 20,000 ppm | OUTER LABEL: 7.5pt high-contrast print, positive cosmetic claims',
  },
};

export default function HomePage() {
  const showLandingDefault =
    (process.env.NEXT_PUBLIC_SHOW_LANDING_PAGE ?? 'true') !== 'false';

  const [activeView, setActiveView] = useState<'landing' | 'studio'>(
    showLandingDefault ? 'landing' : 'studio'
  );
  const [studioPresetId, setStudioPresetId] = useState<string>('huda-matrix');
  const [studioCustomAuditResult, setStudioCustomAuditResult] =
    useState<ComplianceAuditResult | null>(null);
  const [studioInitialUrl, setStudioInitialUrl] = useState<string>(SAMPLE_PRODUCT_URLS[0].url);

  // Simple Entry Point: Instant URL Brand Remixer & Auditor on Homepage
  const [heroUrlInput, setHeroUrlInput] = useState<string>(SAMPLE_PRODUCT_URLS[0].url);
  const [heroUrlResult, setHeroUrlResult] = useState<ComplianceAuditResult | null>(null);
  const [isRemixingHeroUrl, setIsRemixingHeroUrl] = useState<boolean>(false);

  // Hero Live Interactive Formulation Sandbox States
  const [sandboxKey, setSandboxKey] = useState<string>('huda-matrix');
  const [sandboxInput, setSandboxInput] = useState<string>(
    SANDBOX_RAW_SAMPLES['huda-matrix'].rawChemicalString
  );
  const [isRunningMockAudit, setIsRunningMockAudit] = useState<boolean>(false);
  const [mockAuditStage, setMockAuditStage] = useState<string>('');
  const [hasRunMockAudit, setHasRunMockAudit] = useState<boolean>(true);

  // GitHub Star & README Modal States
  const [starred, setStarred] = useState<boolean>(false);
  const [starCount, setStarCount] = useState<number>(2480);
  const [readmeModalOpen, setReadmeModalOpen] = useState<boolean>(false);
  const [copiedReadme, setCopiedReadme] = useState<boolean>(false);

  const handleHeroUrlAction = (
    mode: 'generate-distinct-brand' | 'audit-url',
    overrideUrl?: string
  ) => {
    const targetUrl = (overrideUrl ?? heroUrlInput).trim() || SAMPLE_PRODUCT_URLS[0].url;
    setHeroUrlInput(targetUrl);
    setIsRemixingHeroUrl(true);

    const synthesized = synthesizeUrlBrandResult(targetUrl, mode);
    setTimeout(() => {
      setHeroUrlResult(synthesized);
      setIsRemixingHeroUrl(false);
    }, 180);
  };

  const handleRunInstantMockAudit = () => {
    setIsRunningMockAudit(true);
    setMockAuditStage('Analyzing INCI formulation & normalizing ppm concentrations...');
    setTimeout(() => {
      setMockAuditStage(
        'Cross-indexing US FDA MoCRA, California Toxic-Free Cosmetics Act & EU EC 1223/2009...'
      );
    }, 200);
    setTimeout(() => {
      setIsRunningMockAudit(false);
      setHasRunMockAudit(true);
    }, 450);
  };

  const launchStudioWithPreset = (presetId: string) => {
    setStudioCustomAuditResult(null);
    setStudioPresetId(presetId);
    setActiveView('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const launchStudioWithCustomResult = (result: ComplianceAuditResult, sourceUrl: string) => {
    setStudioCustomAuditResult(result);
    setStudioInitialUrl(sourceUrl);
    setActiveView('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeSandboxResult =
    DETERMINISTIC_PRESET_RESULTS[sandboxKey] || DETERMINISTIC_PRESET_RESULTS['huda-matrix'];

  if (activeView === 'studio') {
    return (
      <>
        <ComplianceStudioWorkspace
          initialPresetId={studioPresetId}
          initialCustomAuditResult={studioCustomAuditResult}
          initialSourceUrl={studioInitialUrl}
          onBackToLanding={() => setActiveView('landing')}
          onOpenReadmeModal={() => setReadmeModalOpen(true)}
        />
        <Dialog open={readmeModalOpen} onOpenChange={setReadmeModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>OpenCompact — GitHub README.md</DialogTitle>
              <DialogDescription>
                Open-source repository documentation, Gemini 4 Argon architecture, and CLI
                quickstart.
              </DialogDescription>
            </DialogHeader>
            <div className="prose prose-invert max-w-none text-xs leading-relaxed font-mono bg-slate-950 p-5 rounded-xl border border-slate-800 overflow-x-auto">
              <div className="markdown-body space-y-3">
                <Markdown>{OPENCOMPACT_README_MD}</Markdown>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      {/* STRICT 3-ZONE TOP BAR CONTRACT WITH LUXURY COMPACT EMBLEM */}
      <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-md sticky top-0 z-30">
        {/* Zone 1: Iconic Compact Mirror Logo + Editorial Serif Wordmark */}
        <a href="#top" className="flex items-center gap-3 whitespace-nowrap shrink-0 group">
          <span className="h-9 w-9 rounded-full border-2 border-emerald-400/80 bg-gradient-to-br from-emerald-950 via-slate-900 to-amber-950/60 flex items-center justify-center shadow-[0_0_22px_rgba(16,185,129,0.28)]">
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

        {/* Zone 2: 4 Concise Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium tracking-wider uppercase text-slate-400">
          <a
            href="#collections"
            className="hover:text-slate-50 transition-colors whitespace-nowrap shrink-0"
          >
            Collections
          </a>
          <a
            href="#sandbox"
            className="hover:text-slate-50 transition-colors whitespace-nowrap shrink-0"
          >
            Formula Lab
          </a>
          <a
            href="#architecture"
            className="hover:text-slate-50 transition-colors whitespace-nowrap shrink-0"
          >
            Architecture
          </a>
          <a
            href="#founder-ethos"
            className="hover:text-slate-50 transition-colors whitespace-nowrap shrink-0"
          >
            Beauty Ethos
          </a>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <Button size="default" onClick={() => launchStudioWithPreset(sandboxKey)}>
            <span>Launch App Studio</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </header>

      {/* EDITORIAL PRESTIGE BEAUTY HERO + SIMPLE 1-STEP ENTRY POINT */}
      <section
        id="top"
        className="relative px-6 pt-12 pb-20 border-b border-slate-800/80 overflow-hidden bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.14),_transparent_65%)]"
      >
        <div className="max-w-[1280px] mx-auto space-y-12">
          {/* Split Editorial Hero: Left Brand Identity + Right Luxury Compact & Serum Photography */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Luxury Brand Crest */}
              <div className="inline-flex items-center gap-3 text-xs tracking-widest uppercase text-emerald-400 font-medium">
                <span>MODERN BEAUTY ATELIER &amp; REGULATORY ENGINE</span>
                <span aria-hidden="true">·</span>
                <span>US FDA · CALIFORNIA · EU</span>
              </div>

              <h1
                className="text-4xl sm:text-5xl lg:text-[54px] font-semibold tracking-tight text-slate-50 leading-[1.1] drop-shadow-[0_0_30px_rgba(16,185,129,0.40)]"
                style={{
                  fontFamily: 'var(--font-serif), Georgia, serif',
                  textWrap: 'balance',
                }}
              >
                The Open Source Shield Against Regulatory Patchworks.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Designed for modern beauty founders, formulators, and retail buyers at the standard
                of <strong className="text-slate-100">Sephora</strong> and{' '}
                <strong className="text-slate-100">Silvering</strong>. Paste any beauty product URL
                to remix it into a 100% globally compliant luxury brand, inspect 3D packaging peel
                layers, and generate 15-day FDA MoCRA dossiers.
              </p>

              {/* Hero Call-To-Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <Button size="lg" onClick={() => launchStudioWithPreset(sandboxKey)}>
                  <Sparkles className="h-4 w-4" />
                  <span>Launch App Studio</span>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setStarred((prev) => !prev);
                    setStarCount((prev) => (starred ? prev - 1 : prev + 1));
                    setReadmeModalOpen(true);
                  }}
                >
                  <Star
                    className={`h-4 w-4 ${
                      starred ? 'fill-emerald-400 text-emerald-400' : 'text-slate-300'
                    }`}
                  />
                  <span>Star on GitHub</span>
                  <span className="font-mono text-xs text-emerald-400 tabular-nums ml-1">
                    {starCount.toLocaleString()}
                  </span>
                </Button>
              </div>
            </div>

            {/* Right Column: Luxury Editorial Beauty Still-Life */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-slate-800/90 bg-slate-900 shadow-[0_25px_70px_rgba(0,0,0,0.65)] aspect-[16/11]">
                <Image
                  src="/images/opencompact_luxury_hero.jpg"
                  alt="OpenCompact luxury cosmetic compact mirror and botanical serum bottle on travertine stone"
                  fill
                  priority
                  referrerPolicy="no-referrer"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                  <div>
                    <div className="text-[11px] uppercase tracking-widest text-emerald-300 font-medium">
                      3D Brand Twin + Formulation Clearance
                    </div>
                    <div
                      className="text-base font-semibold text-slate-50"
                      style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
                    >
                      Every Compact Vetted for Retail Readiness
                    </div>
                  </div>
                  <Badge variant="pass">[PASS · 3 JURISDICTIONS]</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* SIMPLE START HERE BAR: INSTANT PRODUCT URL BRAND REMIXER & AUDITOR */}
          <div className="rounded-2xl border border-emerald-500/40 bg-slate-900/95 p-6 shadow-[0_20px_60px_rgba(16,185,129,0.10)] space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-emerald-400">
                  <Wand2 className="h-4 w-4" />
                  <span>START HERE — INSTANT PRODUCT URL BRAND REMIXER &amp; SAFETY AUDITOR</span>
                </div>
                <h2
                  className="text-xl sm:text-2xl font-semibold text-slate-50"
                  style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
                >
                  Paste Any Beauty Product URL to Remix a Clean, Compliant Luxury Brand
                </h2>
              </div>

              {/* 1-Click Sample Product URLs */}
              <div className="flex flex-wrap items-center gap-1.5">
                {SAMPLE_PRODUCT_URLS.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => {
                      setHeroUrlInput(sample.url);
                      handleHeroUrlAction('generate-distinct-brand', sample.url);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
                      heroUrlInput === sample.url
                        ? 'border-emerald-500/60 bg-emerald-950/40 text-emerald-300'
                        : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {sample.id === 'url-huda-neon'
                      ? 'Try: Sephora Neon Palette'
                      : sample.id === 'url-ca-pfas-primer'
                      ? 'Try: Ulta Velvet Primer'
                      : 'Try: Silvering Toning Elixir'}
                  </button>
                ))}
              </div>
            </div>

            {/* URL Input + Action Buttons */}
            <div className="flex flex-col md:flex-row gap-3 items-stretch">
              <div className="relative flex-1">
                <Link2 className="h-4 w-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={heroUrlInput}
                  onChange={(e) => setHeroUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleHeroUrlAction('generate-distinct-brand', heroUrlInput);
                    }
                  }}
                  placeholder="Paste any Sephora, Ulta, or beauty brand product URL (e.g., https://www.sephora.com/product/...)"
                  className="w-full h-full min-h-[48px] pl-10 pr-4 rounded-xl border border-slate-700 bg-slate-950 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
                <Button
                  size="lg"
                  onClick={() => handleHeroUrlAction('generate-distinct-brand', heroUrlInput)}
                  disabled={isRemixingHeroUrl}
                  className="w-full sm:w-auto"
                >
                  <Wand2 className="h-4 w-4" />
                  <span>
                    {isRemixingHeroUrl
                      ? 'Synthesizing Brand...'
                      : 'Remix into Compliant Brand'}
                  </span>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handleHeroUrlAction('audit-url', heroUrlInput)}
                  disabled={isRemixingHeroUrl}
                  className="w-full sm:w-auto"
                >
                  <Search className="h-4 w-4" />
                  <span>Audit Original URL</span>
                </Button>
              </div>
            </div>

            {/* IMMEDIATE URL REMIX / AUDIT RESULT SHOWCASE RIGHT IN HERO */}
            {heroUrlResult && (
              <div
                className={`rounded-xl border p-5 space-y-4 transition-all ${
                  heroUrlResult.overallStatus === 'PASS'
                    ? 'border-emerald-500/60 bg-slate-950/95'
                    : 'border-rose-500/60 bg-slate-950/95'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <Badge
                        variant={heroUrlResult.overallStatus === 'PASS' ? 'pass' : 'violation'}
                      >
                        [{heroUrlResult.overallStatus}]
                      </Badge>
                      <span className="text-emerald-400 font-medium flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>
                          {heroUrlResult.urlRemixMetadata?.mode === 'generate-distinct-brand'
                            ? 'Similar-But-Distinct Compliant Brand Synthesized'
                            : 'Reference Product URL Compliance Audit'}
                        </span>
                      </span>
                      <span className="text-slate-500">·</span>
                      <span className="font-mono text-slate-400 truncate max-w-md">
                        {heroUrlResult.urlRemixMetadata?.sourceUrl}
                      </span>
                    </div>

                    <h3
                      className="text-xl font-semibold text-slate-50"
                      style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
                    >
                      {heroUrlResult.productName}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                      {heroUrlResult.urlRemixMetadata?.differentiationStrategy ||
                        heroUrlResult.summaryHeadline}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <Button
                      size="default"
                      onClick={() => launchStudioWithCustomResult(heroUrlResult, heroUrlInput)}
                    >
                      <Layers className="h-4 w-4" />
                      <span>Interact with 3D Brand Twin in Studio</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Before -> After Clean Substitutions (if in Remix mode) */}
                {heroUrlResult.urlRemixMetadata?.substitutedIngredients &&
                  heroUrlResult.urlRemixMetadata.substitutedIngredients.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                        Clean Formulation Substitutions (Removing Regulatory Traps):
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {heroUrlResult.urlRemixMetadata.substitutedIngredients.map((sub, i) => (
                          <div
                            key={i}
                            className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 text-xs space-y-1"
                          >
                            <div className="font-mono text-rose-400 line-through text-[11px]">
                              Replaced: {sub.replaced}
                            </div>
                            <div className="font-mono text-emerald-300 font-semibold">
                              Clean Substitute: {sub.replacement}
                            </div>
                            <p className="text-slate-400 text-[11px] leading-relaxed">
                              {sub.reason}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Quick 3-Jurisdiction Table Preview for the URL Result */}
                <div className="rounded-xl border border-slate-800 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Evaluated Ingredient</TableHead>
                        <TableHead className="text-right">Concentration</TableHead>
                        <TableHead>US FDA (MoCRA)</TableHead>
                        <TableHead>California (Toxic-Free)</TableHead>
                        <TableHead>European Union (EC 1223/2009)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {heroUrlResult.matrixRows.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell>
                            <div className="font-semibold text-slate-100">{row.ingredientName}</div>
                            <div className="text-[11px] font-mono text-slate-400">
                              {row.inciName} · CAS {row.casNumber}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-mono tabular-nums">
                            <div className="font-semibold text-slate-100">
                              {row.concentrationPpm.toLocaleString()} ppm
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {row.concentrationPercent}
                            </div>
                          </TableCell>
                          <TableCell className="space-y-1">
                            <Badge variant={row.usFda.status === 'PASS' ? 'pass' : 'violation'}>
                              [{row.usFda.status}]
                            </Badge>
                            <p className="text-[11px] text-slate-300 line-clamp-2">
                              {row.usFda.justification}
                            </p>
                          </TableCell>
                          <TableCell className="space-y-1">
                            <Badge
                              variant={row.california.status === 'PASS' ? 'pass' : 'violation'}
                            >
                              [{row.california.status}]
                            </Badge>
                            <p className="text-[11px] text-slate-300 line-clamp-2">
                              {row.california.justification}
                            </p>
                          </TableCell>
                          <TableCell className="space-y-1">
                            <Badge variant={row.eu.status === 'PASS' ? 'pass' : 'violation'}>
                              [{row.eu.status}]
                            </Badge>
                            <p className="text-[11px] text-slate-300 line-clamp-2">
                              {row.eu.justification}
                            </p>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CURATED BEAUTY CASE STUDIES (SEPHORA / PRESTIGE PRODUCT SHOWCASE) */}
      <section id="collections" className="px-6 py-16 border-b border-slate-800/80">
        <div className="max-w-[1280px] mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <div className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
                CURATED FORMULATION &amp; PACKAGING CASE STUDIES
              </div>
              <h2
                className="text-2xl sm:text-3xl font-semibold text-slate-50"
                style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
              >
                Select a Product Archetype to Inspect in the 3D Compliance Studio
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-md">
              Each product pairs an interactive Three.js 3D packaging vessel with parts-per-million
              toxicology across the US, California, and the European Union.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Huda Matrix Pressed Pigment Compact */}
            <Card className="border-slate-800 bg-slate-900/90 overflow-hidden flex flex-col justify-between group hover:border-rose-500/50 transition-all">
              <div>
                <div className="relative h-52 w-full overflow-hidden bg-slate-950">
                  <Image
                    src="/images/product_compact_palette.jpg"
                    alt="Pressed pigment eyeshadow compact palette"
                    fill
                    referrerPolicy="no-referrer"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="violation">[US FDA EYE VIOLATION · EU PASS]</Badge>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <div className="text-[11px] uppercase tracking-wider text-slate-400">
                    Pressed Pigment Compact · Case Study 01
                  </div>
                  <CardTitle
                    className="text-xl text-slate-50"
                    style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
                  >
                    The Huda Matrix — Neon Pressed Palette
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-slate-300 leading-relaxed space-y-2">
                  <p>
                    Contains 1.85% D&amp;C Red No. 28 Aluminum Lake—permitted in the EU, but banned
                    in the US eye area under 21 CFR § 74.2328, with a 3.5pt warning buried beneath a
                    peel-off sticker.
                  </p>
                </CardContent>
              </div>
              <div className="p-6 pt-2">
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => launchStudioWithPreset('huda-matrix')}
                >
                  <span>Inspect Compact &amp; Peel Layer</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>

            {/* Card 2: California PFAS Primer Trap */}
            <Card className="border-slate-800 bg-slate-900/90 overflow-hidden flex flex-col justify-between group hover:border-rose-500/50 transition-all">
              <div>
                <div className="relative h-52 w-full overflow-hidden bg-slate-950">
                  <Image
                    src="/images/opencompact_luxury_hero.jpg"
                    alt="Clean beauty complexion primer"
                    fill
                    referrerPolicy="no-referrer"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="violation">[CA AB 2762 PFAS BAN]</Badge>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <div className="text-[11px] uppercase tracking-wider text-slate-400">
                    Complexion Primer · Case Study 02
                  </div>
                  <CardTitle
                    className="text-xl text-slate-50"
                    style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
                  >
                    The California PFAS Trap — Velvet Primer
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-slate-300 leading-relaxed space-y-2">
                  <p>
                    Marketed as &quot;Clean Beauty&quot; while containing 0.10% PTFE (Teflon) and
                    4.5% Cyclopentasiloxane (D5)—triggering California Toxic-Free Cosmetics Act and
                    EU 0.1% D5 bans.
                  </p>
                </CardContent>
              </div>
              <div className="p-6 pt-2">
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => launchStudioWithPreset('ca-pfas-trap')}
                >
                  <span>Inspect Primer &amp; CA Bans</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>

            {/* Card 3: Silvering Luxe Toning Elixir */}
            <Card className="border-slate-800 bg-slate-900/90 overflow-hidden flex flex-col justify-between group hover:border-emerald-500/50 transition-all">
              <div>
                <div className="relative h-52 w-full overflow-hidden bg-slate-950">
                  <Image
                    src="/images/product_silvering_serum.jpg"
                    alt="Silvering frosted glass hair toning serum bottle"
                    fill
                    referrerPolicy="no-referrer"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="pass">[GLOBAL RETAIL CLEARANCE]</Badge>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <div className="text-[11px] uppercase tracking-wider text-emerald-400">
                    Botanical Hair &amp; Scalp Elixir · Case Study 03
                  </div>
                  <CardTitle
                    className="text-xl text-slate-50"
                    style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
                  >
                    Silvering Luxe — Toning &amp; Lustre Elixir
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-slate-300 leading-relaxed space-y-2">
                  <p>
                    Inspired by Alexis Eizinas of Silvering: purposeful silver-hair formulation with
                    0.12% Acid Violet 43, zero PFAS, 7.5pt direct-printed typography, and positive
                    cosmetic claims.
                  </p>
                </CardContent>
              </div>
              <div className="p-6 pt-2">
                <Button
                  variant="default"
                  className="w-full justify-between"
                  onClick={() => launchStudioWithPreset('silvering-toner')}
                >
                  <span>Inspect Clean Gold-Standard</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* LIVE INTERACTIVE FORMULATION SANDBOX WIDGET */}
      <section id="sandbox" className="px-6 py-16 border-b border-slate-800/80 bg-slate-900/25">
        <div className="max-w-[1280px] mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
                INSTANT FORMULATION SANDBOX
              </div>
              <h2
                className="text-2xl sm:text-3xl font-semibold text-slate-50"
                style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
              >
                Test Raw INCI Ingredient Strings Against Global Retail Thresholds
              </h2>
            </div>

            {/* Sample Formulation Selector Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {Object.entries(SANDBOX_RAW_SAMPLES).map(([key, sample]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setSandboxKey(key);
                    setSandboxInput(sample.rawChemicalString);
                    handleRunInstantMockAudit();
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    sandboxKey === key
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/95 shadow-2xl overflow-hidden p-6 space-y-5">
            <div className="flex flex-col md:flex-row gap-3 items-stretch">
              <textarea
                rows={3}
                value={sandboxInput}
                onChange={(e) => setSandboxInput(e.target.value)}
                aria-label="Raw chemical formulation string for instant audit"
                className="flex-1 rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-xs font-mono text-slate-200 leading-relaxed focus:outline-none focus:border-emerald-500"
              />
              <div className="flex flex-col justify-between gap-2 shrink-0 md:w-60">
                <Button
                  onClick={handleRunInstantMockAudit}
                  disabled={isRunningMockAudit}
                  className="w-full h-full min-h-[48px]"
                >
                  <Play className="h-4 w-4" />
                  <span>
                    {isRunningMockAudit ? 'Auditing Formula...' : 'Run Instant Mock Audit'}
                  </span>
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => launchStudioWithPreset(sandboxKey)}
                  className="w-full"
                >
                  <span>Open 3D Twin in Studio</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {isRunningMockAudit ? (
              <div className="rounded-xl border border-emerald-500/40 bg-slate-950 p-6 space-y-3 font-mono text-xs">
                <div className="text-emerald-400 font-semibold">{mockAuditStage}</div>
                <div className="h-3 w-3/4 rounded bg-slate-800 animate-pulse" />
                <div className="h-3 w-1/2 rounded bg-slate-800 animate-pulse" />
              </div>
            ) : (
              hasRunMockAudit && (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          activeSandboxResult.overallStatus === 'PASS' ? 'pass' : 'violation'
                        }
                      >
                        [{activeSandboxResult.overallStatus}]
                      </Badge>
                      <span className="font-semibold text-slate-100">
                        {activeSandboxResult.productName}
                      </span>
                    </div>
                    <span className="font-mono text-slate-400 text-[11px]">
                      Evaluated across US FDA, California &amp; EU
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Evaluated Ingredient</TableHead>
                          <TableHead className="text-right">Concentration</TableHead>
                          <TableHead>US FDA (MoCRA)</TableHead>
                          <TableHead>California (Toxic-Free)</TableHead>
                          <TableHead>European Union (EC 1223/2009)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activeSandboxResult.matrixRows.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell>
                              <div className="font-semibold text-slate-100">
                                {row.ingredientName}
                              </div>
                              <div className="text-[11px] font-mono text-slate-400">
                                {row.inciName} · CAS {row.casNumber}
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-mono tabular-nums">
                              <div className="font-semibold text-slate-100">
                                {row.concentrationPpm.toLocaleString()} ppm
                              </div>
                              <div className="text-[11px] text-slate-400">
                                {row.concentrationPercent}
                              </div>
                            </TableCell>
                            <TableCell className="space-y-1">
                              <Badge variant={row.usFda.status === 'PASS' ? 'pass' : 'violation'}>
                                [{row.usFda.status}]
                              </Badge>
                              <p className="text-[11px] text-slate-300 line-clamp-2">
                                {row.usFda.justification}
                              </p>
                            </TableCell>
                            <TableCell className="space-y-1">
                              <Badge
                                variant={row.california.status === 'PASS' ? 'pass' : 'violation'}
                              >
                                [{row.california.status}]
                              </Badge>
                              <p className="text-[11px] text-slate-300 line-clamp-2">
                                {row.california.justification}
                              </p>
                            </TableCell>
                            <TableCell className="space-y-1">
                              <Badge variant={row.eu.status === 'PASS' ? 'pass' : 'violation'}>
                                [{row.eu.status}]
                              </Badge>
                              <p className="text-[11px] text-slate-300 line-clamp-2">
                                {row.eu.justification}
                              </p>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ARCHITECTURAL SPEC BENTO GRID (3 GEMINI 4 ARGON CAPABILITY CARDS) */}
      <section id="architecture" className="px-6 py-20 border-b border-slate-800/80">
        <div className="max-w-[1280px] mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
                ARCHITECTURAL SPECIFICATION · GEMINI 4 ARGON
              </div>
              <h2
                className="text-2xl sm:text-3xl font-semibold text-slate-50 tracking-tight"
                style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
              >
                Unified Toxicology, 3D Packaging Vetting &amp; Autonomous 15-Day MoCRA Filings
              </h2>
            </div>
            <Button variant="outline" onClick={() => launchStudioWithPreset('huda-matrix')}>
              <span>Explore All 3 Modules in Studio</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Bento Card 1: 1M Unified Context Window */}
            <Card className="lg:col-span-2 flex flex-col justify-between border-slate-800 bg-slate-900/90 p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-400 font-semibold">
                    01. 1M Unified Context Window
                  </span>
                  <Globe className="h-4 w-4 text-emerald-400" />
                </div>
                <h3
                  className="text-xl font-semibold text-slate-50"
                  style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
                >
                  Cross-Border Legislative Multi-File Indexing
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Cosmetic launches stall when an ingredient permitted in Europe is restricted in
                  the US eye area or banned in California. Gemini 4 Argon holds{' '}
                  <strong>US FDA 21 CFR Parts 73/74/700</strong>,{' '}
                  <strong>MoCRA Section 605/608</strong>,{' '}
                  <strong>California Toxic-Free Cosmetics Act (AB 2762 &amp; AB 496)</strong>, and{' '}
                  <strong>EU Regulation (EC) No 1223/2009 Annexes II–VI</strong> in unified context
                  to catch parts-per-million conflicts before production.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 mt-6 border-t border-slate-800 font-mono text-xs">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-slate-400 text-[11px]">US FDA 21 CFR § 74.2328</div>
                  <div className="text-rose-400 font-semibold mt-1">Red 28 Eye Ban (0 ppm)</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-slate-400 text-[11px]">California AB 2762 / 496</div>
                  <div className="text-rose-400 font-semibold mt-1">
                    Intentional PFAS / PTFE Ban
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-slate-400 text-[11px]">EU Reg 1223/2009 Annex IV</div>
                  <div className="text-emerald-400 font-semibold mt-1">
                    1,600+ Indexed Substances
                  </div>
                </div>
              </div>
            </Card>

            {/* Bento Card 2: Native Multimodal Vision */}
            <Card className="flex flex-col justify-between border-slate-800 bg-slate-900/90 p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-400 font-semibold">
                    02. Native Multimodal Vision
                  </span>
                  <Layers className="h-4 w-4 text-emerald-400" />
                </div>
                <h3
                  className="text-xl font-semibold text-slate-50"
                  style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
                >
                  Automated Packaging Artwork Layer &amp; 3D Vessel Vetting
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Ingests print-ready dielines, product URLs, or packaging videos to render an
                  interactive <strong>Three.js 3D Packaging Twin</strong>. Flags buried peel-off
                  safety warnings, sub-6pt micro-typography, and FDA structure/function drug-claim
                  crossovers under <strong>21 CFR § 701.2</strong>.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => launchStudioWithPreset('huda-matrix')}
                >
                  <span>Open 3D Peel-Off Layer Inspector</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>

            {/* Bento Card 3: Long Decode Horizon */}
            <Card className="lg:col-span-3 border-slate-800 bg-slate-900/90 p-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-7 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold">
                    <FileCode2 className="h-4 w-4" />
                    <span>03. Long Decode Horizon</span>
                  </div>
                  <h3
                    className="text-xl font-semibold text-slate-50"
                    style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
                  >
                    Autonomous Multi-Page 15-Day MoCRA Adverse Event Dossier Generation
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Under <strong>21 U.S.C. § 364a (MoCRA Section 605)</strong>, Responsible Persons
                    have <strong>15 business days</strong> to file a Serious Adverse Event packet
                    when a consumer requires emergency medical care. Gemini 4 Argon’s long decode
                    horizon compiles unstructured customer care tickets and QC batch logs into a
                    complete legal submission—including Patient Anonymized Profiles, Chronological
                    Stability Mapping, Toxicological Hazard Assessments, and Clinical Follow-Up
                    Templates.
                  </p>
                </div>

                <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs space-y-2">
                  <div className="flex items-center justify-between text-rose-400 border-b border-slate-800 pb-2">
                    <span>PACKET: FDA-MOCRA-SAE-2026-884B</span>
                    <span>15-DAY STATUTORY DEADLINE</span>
                  </div>
                  <div className="text-slate-300">
                    • Section 1: Patient Anonymized Profiles (Mount Sinai ER Case)
                  </div>
                  <div className="text-slate-300">
                    • Section 2: Chronological Batch pH 11.4 &amp; PPD Stability Map
                  </div>
                  <div className="text-slate-300">
                    • Section 3: Synergistic Toxicological Hazard &amp; MoS = 0.04
                  </div>
                  <div className="pt-2">
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => launchStudioWithPreset('mocra-adverse-event')}
                    >
                      <span>Launch 15-Day MoCRA Dossier Generator</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* MODERN BEAUTY FOUNDER ETHOS SECTION (INSPIRED BY ALEXIS EIZINAS OF SILVERING) */}
      <section
        id="founder-ethos"
        className="px-6 py-20 border-b border-slate-800/80 bg-slate-900/30"
      >
        <div className="max-w-[1280px] mx-auto space-y-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
                MODERN BEAUTY INDUSTRY ETHOS · INSPIRED BY ALEXIS EIZINAS OF SILVERING
              </div>
              <h2
                className="text-2xl sm:text-3xl font-semibold text-slate-50 tracking-tight"
                style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
              >
                Five Pillars of Purposeful Formulation, Positive Communication &amp; Brand Integrity
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Inspired by beauty veteran and industrial designer{' '}
                <strong>Alexis Eizinas (Founder of Silvering)</strong> in{' '}
                <em>
                  Authority Magazine’s &quot;Five Things You Need To Know To Succeed In The Modern
                  Beauty Industry&quot;
                </em>
                —OpenCompact pairs statutory toxicology with authentic brand storytelling.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Button variant="default" onClick={() => launchStudioWithPreset('silvering-toner')}>
                <ShieldCheck className="h-4 w-4" />
                <span>Inspect Silvering Luxe Toning Elixir</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {SILVERING_FIVE_PILLARS.map((pillar) => (
              <Card
                key={pillar.number}
                className="border-slate-800 bg-slate-900/90 p-5 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="text-xs font-mono text-emerald-400 font-semibold">
                    {pillar.number}. Pillar
                  </div>
                  <h3
                    className="text-base font-semibold text-slate-50 leading-snug"
                    style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
                  >
                    {pillar.title}
                  </h3>
                  <div className="text-xs font-medium text-emerald-300/90">{pillar.subtitle}</div>
                  <p className="text-xs text-slate-400 leading-relaxed">{pillar.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* GITHUB README.MD & OPEN-SOURCE REPOSITORY EXPLORER */}
      <section id="readme" className="px-6 py-20 border-b border-slate-800/80">
        <div className="max-w-[1280px] mx-auto space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
                OPEN-SOURCE REPOSITORY DOCUMENTATION
              </div>
              <h2
                className="text-2xl font-semibold text-slate-50 tracking-tight"
                style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
              >
                README.md — OpenCompact Architecture &amp; Developer Guide
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  await navigator.clipboard.writeText(OPENCOMPACT_README_MD);
                  setCopiedReadme(true);
                  setTimeout(() => setCopiedReadme(false), 2000);
                }}
              >
                {copiedReadme ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Copied README.md</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy README.md</span>
                  </>
                )}
              </Button>
              <Button size="sm" onClick={() => launchStudioWithPreset('huda-matrix')}>
                <span>Open Compliance Studio</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <Card className="border-slate-800 bg-slate-900/90 overflow-hidden">
            <div className="px-5 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-2">
                <BookOpen className="h-3.5 w-3.5 text-emerald-400" />
                <span>opencompact / README.md</span>
              </span>
              <span>MIT License · Next.js App Router · Gemini 4 Argon</span>
            </div>
            <div className="p-6 font-mono text-xs leading-relaxed text-slate-200 overflow-x-auto prose prose-invert max-w-none">
              <div className="markdown-body space-y-4">
                <Markdown>{OPENCOMPACT_README_MD}</Markdown>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* QUIET LUXURY FOOTER */}
      <footer className="px-6 py-8 bg-slate-950 text-xs text-slate-400">
        <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="h-5 w-5 rounded-full border border-emerald-400/80 bg-emerald-950 flex items-center justify-center">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            <span
              className="font-semibold tracking-wider text-slate-100"
              style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
            >
              OPENCOMPACT
            </span>
            <span aria-hidden="true">·</span>
            <span>Prestige Cosmetic Compliance Atelier &amp; 3D Brand Twin Simulator</span>
          </div>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => launchStudioWithPreset('huda-matrix')}
              className="hover:text-slate-100 transition-colors cursor-pointer"
            >
              Launch Studio
            </button>
            <button
              type="button"
              onClick={() => setReadmeModalOpen(true)}
              className="hover:text-slate-100 transition-colors cursor-pointer"
            >
              README.md
            </button>
          </div>
        </div>
      </footer>

      {/* README Modal Dialog */}
      <Dialog open={readmeModalOpen} onOpenChange={setReadmeModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>OpenCompact — GitHub README.md</DialogTitle>
            <DialogDescription>
              Open-source repository documentation, Gemini 4 Argon architecture, and CLI quickstart.
            </DialogDescription>
          </DialogHeader>
          <div className="prose prose-invert max-w-none text-xs leading-relaxed font-mono bg-slate-950 p-5 rounded-xl border border-slate-800 overflow-x-auto">
            <div className="markdown-body space-y-3">
              <Markdown>{OPENCOMPACT_README_MD}</Markdown>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
