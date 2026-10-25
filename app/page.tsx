'use client';

import React, { useState } from 'react';
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
  Terminal,
  BookOpen,
  Wand2,
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
  DETERMINISTIC_PRESET_RESULTS,
  OPENCOMPACT_README_MD,
  SILVERING_FIVE_PILLARS,
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
    label: 'Neon Pressed Compact (D&C Red 28)',
    presetKey: 'huda-matrix',
    rawChemicalString:
      'RAW_BATCH_INGEST // SKU: OC-NEON-01 (Eye & Lid Pressed Compact) => Talc: 440,000 ppm | CI 45410 (D&C Red No. 28 Aluminum Lake): 18,500 ppm (1.85%) | CI 15850 (D&C Red No. 7 Lake): 9,400 ppm | CI 77510 (Ferric Ferrocyanide): 14,000 ppm | BACK_LABEL_WARNING: 3.5pt font buried behind peel-off sticker layer',
  },
  'ca-pfas-trap': {
    label: 'Clean Beauty Primer (0.1% PTFE)',
    presetKey: 'ca-pfas-trap',
    rawChemicalString:
      'RAW_BATCH_INGEST // SKU: OC-PFAS-02 (Leave-On Facial Primer) => Aqua: 510,000 ppm | Cyclopentasiloxane (D5): 45,000 ppm (4.5%) | Polytetrafluoroethylene (PTFE): 1,000 ppm (0.10%) | Perfluorononyl Dimethicone: 250 ppm | Niacinamide: 30,000 ppm | FRONT_CLAIM: "100% Non-Toxic Clean Beauty"',
  },
  'silvering-toner': {
    label: 'Silvering Luxe Toning Elixir (CI 60730)',
    presetKey: 'silvering-toner',
    rawChemicalString:
      'RAW_BATCH_INGEST // SKU: SLV-TONE-01 (Translucent Silver/Gray Hair & Scalp Elixir) => Aqua: 780,000 ppm | CI 60730 (Ext. D&C Violet No. 2 / Acid Violet 43): 1,200 ppm (0.12%) | Biotinoyl Tripeptide-1: 500 ppm | Niacinamide: 20,000 ppm | OUTER_LABEL: 7.5pt high-contrast print, positive non-drug claims',
  },
};

export default function HomePage() {
  const showLandingDefault =
    (process.env.NEXT_PUBLIC_SHOW_LANDING_PAGE ?? 'true') !== 'false';

  const [activeView, setActiveView] = useState<'landing' | 'studio'>(
    showLandingDefault ? 'landing' : 'studio'
  );
  const [studioPresetId, setStudioPresetId] = useState<string>('huda-matrix');

  // Hero Live Interactive Sandbox States
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

  const handleRunInstantMockAudit = () => {
    setIsRunningMockAudit(true);
    setMockAuditStage(
      'Tokenizing raw INCI chemical string & normalizing ppm concentrations...'
    );
    setTimeout(() => {
      setMockAuditStage(
        'Cross-indexing US FDA 21 CFR Parts 73/74, CA AB 2762/496, & EU EC 1223/2009 Annexes...'
      );
    }, 220);
    setTimeout(() => {
      setIsRunningMockAudit(false);
      setHasRunMockAudit(true);
    }, 520);
  };

  const launchStudioWithPreset = (presetId: string) => {
    setStudioPresetId(presetId);
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
      {/* STRICT 3-ZONE TOP BAR CONTRACT */}
      <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-slate-800/90 bg-slate-950 sticky top-0 z-30">
        {/* Zone 1: Single text element Brand Wordmark */}
        <a
          href="#top"
          className="text-lg font-bold tracking-tight text-slate-50 whitespace-nowrap shrink-0"
          style={{ fontFamily: 'var(--font-display), sans-serif' }}
        >
          OpenCompact
        </a>

        {/* Zone 2: 4 concise single-line navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <a
            href="#sandbox"
            className="hover:text-slate-50 transition-colors whitespace-nowrap shrink-0"
          >
            Sandbox
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
            Founder Ethos
          </a>
          <a
            href="#readme"
            className="hover:text-slate-50 transition-colors whitespace-nowrap shrink-0"
          >
            README
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <Button size="default" onClick={() => launchStudioWithPreset(sandboxKey)}>
            <span>Launch App Studio</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </header>

      {/* HERO SECTION + LIVE INTERACTIVE SANDBOX WIDGET */}
      <section
        id="top"
        className="relative px-6 pt-16 pb-20 border-b border-slate-800/80 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.12),_transparent_62%)]"
      >
        <div className="max-w-[1240px] mx-auto flex flex-col items-center text-center space-y-6">
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400 font-mono">
            <span>OPEN-SOURCE REPOSITORY</span>
            <span aria-hidden="true">·</span>
            <span>MODELS/GEMINI-4-ARGON</span>
            <span aria-hidden="true">·</span>
            <span>US FDA MOCRA / CA AB 2762 / EU EC 1223/2009</span>
          </div>

          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-50 max-w-4xl drop-shadow-[0_0_30px_rgba(16,185,129,0.42)]"
            style={{
              fontFamily: 'var(--font-display), sans-serif',
              textWrap: 'balance',
            }}
          >
            The Open Source Shield Against Regulatory Patchworks.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            <strong className="text-emerald-300 font-semibold">OpenCompact</strong> unites a{' '}
            <em>cosmetic makeup compact</em>, an <em>international regulatory compact</em>, and a{' '}
            <em>compact open-source engine</em>. Audit raw INCI formulations, inspect 3D packaging
            peel-off layers, clone product URLs into compliant brands, and generate 15-day FDA MoCRA
            dossiers with Gemini 4 Argon.
          </p>

          {/* Hero Call-To-Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
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

          {/* LIVE INTERACTIVE SANDBOX WIDGET IN HERO BLOCK */}
          <div
            id="sandbox"
            className="w-full max-w-[1140px] mt-8 text-left rounded-xl border border-slate-800 bg-slate-900/95 shadow-2xl overflow-hidden"
          >
            {/* Sandbox Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-slate-950 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Terminal className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-mono font-semibold text-slate-100">
                  LIVE INTERACTIVE SANDBOX — GEMINI 4 ARGON INSTANT MOCK AUDITOR
                </span>
              </div>

              {/* Sample Formulation Selector Buttons */}
              <div className="flex flex-wrap items-center gap-1.5">
                {Object.entries(SANDBOX_RAW_SAMPLES).map(([key, sample]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setSandboxKey(key);
                      setSandboxInput(sample.rawChemicalString);
                      handleRunInstantMockAudit();
                    }}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
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

            {/* Sandbox Input + Instant Output Table */}
            <div className="p-5 space-y-5">
              <div className="flex flex-col md:flex-row gap-3 items-stretch">
                <textarea
                  rows={3}
                  value={sandboxInput}
                  onChange={(e) => setSandboxInput(e.target.value)}
                  aria-label="Raw chemical formulation string for instant audit"
                  className="flex-1 rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-xs font-mono text-slate-200 leading-relaxed focus:outline-none focus:border-emerald-500"
                />
                <div className="flex flex-col justify-between gap-2 shrink-0 md:w-56">
                  <Button
                    onClick={handleRunInstantMockAudit}
                    disabled={isRunningMockAudit}
                    className="w-full h-full min-h-[48px]"
                  >
                    <Play className="h-4 w-4" />
                    <span>
                      {isRunningMockAudit ? 'Argon Auditing...' : 'Run Instant Mock Audit'}
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
                            activeSandboxResult.overallStatus === 'PASS'
                              ? 'pass'
                              : 'violation'
                          }
                        >
                          [{activeSandboxResult.overallStatus}]
                        </Badge>
                        <span className="font-semibold text-slate-100">
                          {activeSandboxResult.productName}
                        </span>
                      </div>
                      <span className="font-mono text-slate-400 text-[11px]">
                        Evaluated across 3 Jurisdictions in 180ms
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
                                <Badge
                                  variant={row.usFda.status === 'PASS' ? 'pass' : 'violation'}
                                >
                                  [{row.usFda.status}]
                                </Badge>
                                <p className="text-[11px] text-slate-300 line-clamp-2">
                                  {row.usFda.justification}
                                </p>
                              </TableCell>
                              <TableCell className="space-y-1">
                                <Badge
                                  variant={
                                    row.california.status === 'PASS' ? 'pass' : 'violation'
                                  }
                                >
                                  [{row.california.status}]
                                </Badge>
                                <p className="text-[11px] text-slate-300 line-clamp-2">
                                  {row.california.justification}
                                </p>
                              </TableCell>
                              <TableCell className="space-y-1">
                                <Badge
                                  variant={row.eu.status === 'PASS' ? 'pass' : 'violation'}
                                >
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
        </div>
      </section>

      {/* ARCHITECTURAL SPEC BENTO GRID (3 GEMINI 4 ARGON CAPABILITY CARDS) */}
      <section id="architecture" className="px-6 py-20 border-b border-slate-800/80">
        <div className="max-w-[1240px] mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="text-xs font-mono text-emerald-400">
                ARCHITECTURAL SPECIFICATION · GEMINI 4 ARGON
              </div>
              <h2
                className="text-2xl sm:text-3xl font-bold text-slate-50 tracking-tight"
                style={{ fontFamily: 'var(--font-display), sans-serif' }}
              >
                Engineered for Cross-Border Toxicology, 3D Spatial Packaging &amp; Long-Decode
                Filings
              </h2>
            </div>
            <Button variant="outline" onClick={() => launchStudioWithPreset('huda-matrix')}>
              <span>Explore All 3 Modules in Studio</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Asymmetric Bento Grid (col-span-2 + col-span-1) */}
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
                  className="text-xl font-bold text-slate-50"
                  style={{ fontFamily: 'var(--font-display), sans-serif' }}
                >
                  Cross-Border Legislative Multi-File Indexing
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Cosmetic formulations fail when an ingredient approved in Europe is banned in the
                  US eye area or restricted at the state level in California. Gemini 4 Argon holds
                  the full statutory tables of <strong>US FDA 21 CFR Parts 73/74/700</strong>,{' '}
                  <strong>MoCRA Section 605/608</strong>,{' '}
                  <strong>California Toxic-Free Cosmetics Act (AB 2762 &amp; AB 496)</strong>, and{' '}
                  <strong>EU Regulation (EC) No 1223/2009 Annexes II–VI</strong> in unified context
                  to pinpoint ppm-level conflicts in a single pass.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 mt-6 border-t border-slate-800 font-mono text-xs">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-slate-400 text-[11px]">US FDA 21 CFR § 74.2328</div>
                  <div className="text-rose-400 font-semibold mt-1">
                    Red 28 Eye Ban (0 ppm)
                  </div>
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

            {/* Bento Card 2: Native Multimodal Vision & 3D Twin */}
            <Card className="flex flex-col justify-between border-slate-800 bg-slate-900/90 p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-400 font-semibold">
                    02. Native Multimodal Vision
                  </span>
                  <Layers className="h-4 w-4 text-emerald-400" />
                </div>
                <h3
                  className="text-xl font-bold text-slate-50"
                  style={{ fontFamily: 'var(--font-display), sans-serif' }}
                >
                  Automated Packaging Artwork Layer &amp; 3D Vessel Vetting
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Ingests print-ready dielines, product URLs, or packaging videos to synthesize an
                  interactive <strong>Three.js 3D Packaging Twin</strong>. Automatically catches
                  buried peel-off safety warnings, sub-6pt micro-typography, and FDA structure/function
                  drug-claim crossovers under <strong>21 CFR § 701.2</strong>.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => launchStudioWithPreset('huda-matrix')}
                >
                  <span>Test 3D Peel-Off Layer Inspector</span>
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
                    className="text-xl font-bold text-slate-50"
                    style={{ fontFamily: 'var(--font-display), sans-serif' }}
                  >
                    Autonomous Multi-Page 15-Day MoCRA Adverse Event Dossier Generation
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Under <strong>21 U.S.C. § 364a (MoCRA Section 605)</strong>, brands have just{' '}
                    <strong>15 business days</strong> to submit a formal Serious Adverse Event
                    packet when a consumer requires emergency medical care. Gemini 4 Argon’s long
                    decode pipeline synthesizes unstructured customer support logs and QC batch
                    records into a self-consistent legal submission packet—complete with Patient
                    Anonymized Profiles, Chronological Stability Mapping, Toxicological Hazard
                    Assessments, and 1-Year Clinical Follow-Up Templates.
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
                      <span>Launch Preset 3 MoCRA Dossier Generator</span>
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
        <div className="max-w-[1240px] mx-auto space-y-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="text-xs font-mono text-emerald-400">
                MODERN BEAUTY INDUSTRY ETHOS · INSPIRED BY ALEXIS EIZINAS OF SILVERING
              </div>
              <h2
                className="text-2xl sm:text-3xl font-bold text-slate-50 tracking-tight"
                style={{ fontFamily: 'var(--font-display), sans-serif' }}
              >
                Five Pillars of Purposeful Formulation, Positive Communication &amp; Open-Source
                Democratization
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Inspired by beauty veteran and industrial designer{' '}
                <strong>Alexis Eizinas (Founder of Silvering)</strong> in{' '}
                <em>
                  Authority Magazine’s &quot;Five Things You Need To Know To Succeed In The Modern
                  Beauty Industry&quot;
                </em>
                —OpenCompact pairs statutory toxicology with brand integrity for underserved
                consumer niches.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Button
                variant="default"
                onClick={() => launchStudioWithPreset('silvering-toner')}
              >
                <Wand2 className="h-4 w-4" />
                <span>Audit Silvering Luxe Toning Elixir</span>
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
                    className="text-sm font-bold text-slate-50 leading-snug"
                    style={{ fontFamily: 'var(--font-display), sans-serif' }}
                  >
                    {pillar.title}
                  </h3>
                  <div className="text-xs font-medium text-slate-300">{pillar.subtitle}</div>
                  <p className="text-xs text-slate-400 leading-relaxed">{pillar.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* GITHUB README.MD & OPEN-SOURCE REPOSITORY EXPLORER */}
      <section id="readme" className="px-6 py-20 border-b border-slate-800/80">
        <div className="max-w-[1240px] mx-auto space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-mono text-emerald-400">
                OPEN-SOURCE REPOSITORY DOCUMENTATION
              </div>
              <h2
                className="text-2xl font-bold text-slate-50 tracking-tight"
                style={{ fontFamily: 'var(--font-display), sans-serif' }}
              >
                README.md — Fork-Ready Compliance Infrastructure
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

      {/* QUIET FOOTER */}
      <footer className="px-6 py-8 bg-slate-950 text-xs text-slate-400">
        <div className="max-w-[1240px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className="font-bold text-slate-100"
              style={{ fontFamily: 'var(--font-display), sans-serif' }}
            >
              OpenCompact
            </span>
            <span aria-hidden="true">·</span>
            <span>Open-Source Cosmetic Compliance Engine &amp; 3D Brand Twin Simulator</span>
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
