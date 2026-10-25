'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Copy,
  Check,
  Search,
  Sliders,
  Plus,
  BookOpen,
  PanelLeftClose,
  PanelLeftOpen,
  Compass,
  Box,
  Trash2,
  Share2,
  RefreshCw,
  FileCheck2,
  Palette,
  Beaker,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { OpenCompactLogo } from '@/components/ui/opencompact-logo';
import { ComplianceStudioWorkspace } from '@/components/studio/ComplianceStudioWorkspace';
import {
  SAMPLE_PRODUCT_URLS,
  ComplianceAuditResult,
  BrandTwin3DSpec,
  synthesizeUrlBrandResult,
  OPENCOMPACT_README_MD,
  SILVERING_FIVE_PILLARS,
} from '@/lib/compliance-data';

const BrandTwin3DViewport = dynamic(
  () =>
    import('@/components/studio/BrandTwin3DViewport').then(
      (mod) => mod.BrandTwin3DViewport
    ),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[520px] rounded-2xl bg-[#FAF5F2] border border-[#EADCD7] flex flex-col items-center justify-center gap-3 text-[#7A6A65] text-xs">
        <Sparkles className="w-5 h-5 text-[#B85D6F] animate-pulse" />
        <span>Sculpting 3D Porcelain &amp; Rose-Gold Product Twin...</span>
      </div>
    ),
  }
);

export interface UserBrandNotebook {
  id: string;
  title: string;
  sourceInput: string;
  mode: 'generate-distinct-brand' | 'audit-url';
  createdAt: string;
  result: ComplianceAuditResult;
  twinOverride: BrandTwin3DSpec;
  peelAmount: number;
  selectedSwatchIdx: number;
}

const FEMININE_VESSEL_THEMES: Array<{
  label: string;
  primaryColorHex: string;
  secondaryColorHex: string;
  accentColorHex: string;
  metallicFinish: 'gold' | 'platinum' | 'obsidian';
}> = [
  {
    label: 'Peony Blush',
    primaryColorHex: '#F9E8EC',
    secondaryColorHex: '#F2D2D9',
    accentColorHex: '#C86D7E',
    metallicFinish: 'gold',
  },
  {
    label: 'Porcelain Silk',
    primaryColorHex: '#F7EFE8',
    secondaryColorHex: '#EAD8C9',
    accentColorHex: '#C59B6D',
    metallicFinish: 'gold',
  },
  {
    label: 'Camellia Lilac',
    primaryColorHex: '#F3ECF8',
    secondaryColorHex: '#E2D4F0',
    accentColorHex: '#A67DB8',
    metallicFinish: 'platinum',
  },
  {
    label: 'Peach Cashmere',
    primaryColorHex: '#FBF0EA',
    secondaryColorHex: '#F2DCCF',
    accentColorHex: '#D48C70',
    metallicFinish: 'gold',
  },
];

function createDefaultNotebooks(): UserBrandNotebook[] {
  return SAMPLE_PRODUCT_URLS.map((preset, idx) => {
    const synthesized = synthesizeUrlBrandResult(
      preset.url,
      'generate-distinct-brand'
    );
    return {
      id: `notebook-seed-${idx + 1}`,
      title: synthesized.brandTwin3D.brandName,
      sourceInput: preset.url,
      mode: 'generate-distinct-brand',
      createdAt: idx === 0 ? 'Just now' : idx === 1 ? 'Yesterday' : 'Oct 22',
      result: {
        ...synthesized,
        auditTimestamp: '2026-10-25T12:00:00.000Z',
      },
      twinOverride: { ...synthesized.brandTwin3D },
      peelAmount: 0,
      selectedSwatchIdx: 0,
    };
  });
}

export default function OpenCompactPage() {
  // Primary navigation mode:
  // 'new-prompt' -> Minimalist Google / ChatGPT centered entry point
  // 'notebook'   -> Dedicated Brand Remix Notebook with immediate 3D Product Mockup
  // 'showcase'   -> Editorial Showcase & Repository Homepage (accessible anytime)
  // 'studio'     -> Full Multi-Tab Regulatory Lab Studio
  const [viewMode, setViewMode] = useState<
    'new-prompt' | 'notebook' | 'showcase' | 'studio'
  >('new-prompt');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // User Notebooks state (initialized identically on SSR and first client render to prevent hydration mismatch)
  const [notebooks, setNotebooks] = useState<UserBrandNotebook[]>(() =>
    createDefaultNotebooks()
  );
  const [activeNotebookId, setActiveNotebookId] =
    useState<string>('notebook-seed-1');
  const [hasHydratedStorage, setHasHydratedStorage] = useState(false);

  // Minimalist omnibar prompt/URL state
  const [promptInput, setPromptInput] = useState('');
  const [promptMode, setPromptMode] = useState<
    'generate-distinct-brand' | 'audit-url'
  >('generate-distinct-brand');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [followUpInput, setFollowUpInput] = useState('');

  // Editorial Showcase states
  const [sandboxConcentration, setSandboxConcentration] = useState<number>(0.12);
  const [sandboxPfasFree, setSandboxPfasFree] = useState<boolean>(false);
  const [readmeModalOpen, setReadmeModalOpen] = useState(false);
  const [copiedReadme, setCopiedReadme] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Hydrate saved notebooks from localStorage on client post-hydration frame
  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      try {
        const saved = localStorage.getItem('opencompact_feminine_notebooks_v4');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setNotebooks(parsed);
            setActiveNotebookId(parsed[0].id);
          }
        }
      } catch {
        // Fallback to default notebooks
      }
      setHasHydratedStorage(true);
    });
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  // Save notebooks whenever updated after initial storage hydration
  useEffect(() => {
    if (!hasHydratedStorage) return;
    try {
      localStorage.setItem(
        'opencompact_feminine_notebooks_v4',
        JSON.stringify(notebooks)
      );
    } catch {
      // Ignore quota errors
    }
  }, [notebooks, hasHydratedStorage]);

  const activeNotebook =
    notebooks.find((n) => n.id === activeNotebookId) || notebooks[0];

  const [argon3DPrompt, setArgon3DPrompt] = useState('');
  const [isGenerating3D, setIsGenerating3D] = useState(false);

  // Create a new Notebook from any URL or natural language brand prompt
  // Calls both /api/compliance and /api/argon-3d (models/gemini-4-argon) to generate a new 3D model
  const handleCreateRemixNotebook = async (
    rawInputText?: string,
    overrideMode?: 'generate-distinct-brand' | 'audit-url'
  ) => {
    const query = (rawInputText ?? promptInput).trim();
    if (!query) return;

    const chosenMode = overrideMode ?? promptMode;
    setIsSynthesizing(true);

    let newResult: ComplianceAuditResult = synthesizeUrlBrandResult(
      query,
      chosenMode
    );

    try {
      const [complianceRes, argon3DRes] = await Promise.allSettled([
        fetch('/api/compliance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            urlMode: chosenMode,
            sourceProductUrl: query,
            brandPrompt: `Synthesize a feminine Parisian luxury 3D packaging twin and compliant formulation for: ${query}`,
            formulationRaw: SAMPLE_PRODUCT_URLS[0].defaultFormulation,
          }),
        }),
        fetch('/api/argon-3d', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: query,
            brandName: newResult.brandTwin3D.brandName,
            productTitle: newResult.brandTwin3D.productTitle,
            primaryColorHex: newResult.brandTwin3D.primaryColorHex,
            secondaryColorHex: newResult.brandTwin3D.secondaryColorHex,
            accentColorHex: newResult.brandTwin3D.accentColorHex,
            palettePanColorsHex: newResult.brandTwin3D.palettePanColorsHex,
          }),
        }),
      ]);

      if (complianceRes.status === 'fulfilled' && complianceRes.value.ok) {
        const data = await complianceRes.value.json();
        if (
          data &&
          data.brandTwin3D &&
          typeof data.brandTwin3D.primaryColorHex === 'string' &&
          Array.isArray(data.matrixRows)
        ) {
          newResult = data;
        }
      }

      if (argon3DRes.status === 'fulfilled' && argon3DRes.value.ok) {
        const data3D = await argon3DRes.value.json();
        if (
          data3D?.procedural3DModel &&
          Array.isArray(data3D.procedural3DModel.customPrimitives) &&
          data3D.procedural3DModel.customPrimitives.length > 0
        ) {
          newResult = {
            ...newResult,
            brandTwin3D: {
              ...newResult.brandTwin3D,
              procedural3DModel: data3D.procedural3DModel,
            },
          };
        }
      }
    } catch {
      // Deterministic synthesizer already prepared `newResult` with procedural3DModel
    }

    const newNotebook: UserBrandNotebook = {
      id: `notebook-${Date.now()}`,
      title: newResult.brandTwin3D.brandName,
      sourceInput: query,
      mode: chosenMode,
      createdAt: 'Just now',
      result: newResult,
      twinOverride: { ...newResult.brandTwin3D },
      peelAmount: 0,
      selectedSwatchIdx: 0,
    };

    setNotebooks((prev) => [newNotebook, ...prev]);
    setActiveNotebookId(newNotebook.id);
    setPromptInput('');
    setFollowUpInput('');
    setIsSynthesizing(false);
    setViewMode('notebook');
  };

  // Dedicated live Gemini 4 Argon 3D Model Sculptor for the active notebook
  const handleSculptNew3DWithArgon = async (customDesignBrief?: string) => {
    if (!activeNotebook) return;
    const designBrief =
      (customDesignBrief ?? argon3DPrompt).trim() ||
      `Bespoke Parisian couture 3D vessel for ${activeNotebook.twinOverride.brandName} — ${activeNotebook.twinOverride.productTitle}`;

    setIsGenerating3D(true);
    try {
      const res = await fetch('/api/argon-3d', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: designBrief,
          brandName: activeNotebook.twinOverride.brandName,
          productTitle: activeNotebook.twinOverride.productTitle,
          primaryColorHex: activeNotebook.twinOverride.primaryColorHex,
          secondaryColorHex: activeNotebook.twinOverride.secondaryColorHex,
          accentColorHex: activeNotebook.twinOverride.accentColorHex,
          palettePanColorsHex: activeNotebook.twinOverride.palettePanColorsHex,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (
          data?.procedural3DModel &&
          Array.isArray(data.procedural3DModel.customPrimitives) &&
          data.procedural3DModel.customPrimitives.length > 0
        ) {
          handleUpdateActiveTwin({
            procedural3DModel: data.procedural3DModel,
          });
          setArgon3DPrompt('');
        }
      }
    } catch {
      // Keep current model on transient failure
    } finally {
      setIsGenerating3D(false);
    }
  };

  const handleUpdateActiveTwin = (partial: Partial<BrandTwin3DSpec>) => {
    if (!activeNotebook) return;
    setNotebooks((prev) =>
      prev.map((nb) =>
        nb.id === activeNotebook.id
          ? { ...nb, twinOverride: { ...nb.twinOverride, ...partial } }
          : nb
      )
    );
  };

  const handleUpdatePeelAmount = (val: number) => {
    if (!activeNotebook) return;
    setNotebooks((prev) =>
      prev.map((nb) =>
        nb.id === activeNotebook.id ? { ...nb, peelAmount: val } : nb
      )
    );
  };

  const handleSelectSwatch = (swatchHex: string, index: number) => {
    if (!activeNotebook) return;
    setNotebooks((prev) =>
      prev.map((nb) =>
        nb.id === activeNotebook.id
          ? {
              ...nb,
              selectedSwatchIdx: index,
              twinOverride: {
                ...nb.twinOverride,
                accentColorHex: swatchHex,
                pigmentOrLiquidHex: swatchHex,
              },
            }
          : nb
      )
    );
  };

  const handleDeleteNotebook = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (notebooks.length <= 1) return;
    const filtered = notebooks.filter((n) => n.id !== id);
    setNotebooks(filtered);
    if (activeNotebookId === id) {
      setActiveNotebookId(filtered[0].id);
    }
  };

  const handleCopyReadme = () => {
    navigator.clipboard.writeText(OPENCOMPACT_README_MD);
    setCopiedReadme(true);
    setTimeout(() => setCopiedReadme(false), 2000);
  };

  const handleShareNotebook = () => {
    if (!activeNotebook) return;
    const summary = `${activeNotebook.twinOverride.brandName} — ${activeNotebook.twinOverride.productTitle}\n${activeNotebook.result.summaryHeadline}\nSource: ${activeNotebook.sourceInput}`;
    navigator.clipboard.writeText(summary);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  // Interactive Sandbox calculations for the Editorial Showcase view
  const sandboxUsPass = sandboxConcentration <= 0.1;
  const sandboxCaPass = !sandboxPfasFree ? false : sandboxConcentration <= 0.08;
  const sandboxEuPass = !sandboxPfasFree ? false : sandboxConcentration <= 0.05;

  return (
    <div className="min-h-screen bg-[#FAF6F3] text-[#281E1C] flex flex-col selection:bg-[#B85D6F]/20 selection:text-[#281E1C]">
      {/* Top Minimalist Couture Bar */}
      <header className="sticky top-0 z-40 h-16 bg-[#FAF6F3]/90 backdrop-blur-md border-b border-[#EADCD7] px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen((v) => !v)}
            className="p-2 rounded-full text-[#7A6A65] hover:text-[#281E1C] hover:bg-[#F3EAE6] transition-colors"
            title={sidebarOpen ? 'Hide Notebooks Sidebar' : 'Show Notebooks Sidebar'}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="w-4 h-4" />
            ) : (
              <PanelLeftOpen className="w-4 h-4" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setViewMode('new-prompt')}
            className="text-left focus:outline-none"
          >
            <OpenCompactLogo size="sm" />
          </button>
        </div>

        {/* Center Mode Switcher Pills */}
        <div className="hidden md:flex items-center gap-1 p-1 rounded-full bg-[#F3EAE6] border border-[#EADCD7]">
          <button
            type="button"
            onClick={() => setViewMode('new-prompt')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
              viewMode === 'new-prompt'
                ? 'bg-white text-[#281E1C] shadow-xs'
                : 'text-[#7A6A65] hover:text-[#281E1C]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#B85D6F]" />
            New Remix Prompt
          </button>
          <button
            type="button"
            onClick={() => setViewMode('notebook')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
              viewMode === 'notebook'
                ? 'bg-white text-[#281E1C] shadow-xs'
                : 'text-[#7A6A65] hover:text-[#281E1C]'
            }`}
          >
            <Box className="w-3.5 h-3.5 text-[#B85D6F]" />
            Active 3D Notebook
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-[#FBF2F3] text-[#B85D6F] text-[10px]">
              {notebooks.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('showcase')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
              viewMode === 'showcase'
                ? 'bg-white text-[#281E1C] shadow-xs'
                : 'text-[#7A6A65] hover:text-[#281E1C]'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-[#B85D6F]" />
            Editorial Homepage
          </button>
          <button
            type="button"
            onClick={() => setViewMode('studio')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
              viewMode === 'studio'
                ? 'bg-white text-[#281E1C] shadow-xs'
                : 'text-[#7A6A65] hover:text-[#281E1C]'
            }`}
          >
            <Beaker className="w-3.5 h-3.5 text-[#B85D6F]" />
            Full Lab Studio
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setViewMode(viewMode === 'showcase' ? 'new-prompt' : 'showcase')
            }
            className="text-xs rounded-full md:hidden"
          >
            {viewMode === 'showcase' ? 'New Prompt' : 'Editorial Home'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setReadmeModalOpen(true)}
            className="text-xs text-[#7A6A65] hover:text-[#281E1C] hidden sm:inline-flex"
          >
            <BookOpen className="w-3.5 h-3.5 mr-1.5 text-[#B85D6F]" />
            README
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => setViewMode('new-prompt')}
            className="rounded-full text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            New Remix
          </Button>
        </div>
      </header>

      {/* Main Workspace Container: Left Notebook Sidebar + Dynamic Canvas */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Collapsible Notebook Sidebar (ChatGPT / NotebookLM Inspired) */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 290, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="shrink-0 bg-[#F6EFEA] border-r border-[#EADCD7] flex flex-col justify-between overflow-hidden select-none"
            >
              <div className="p-4 space-y-4 overflow-y-auto flex-1">
                {/* New Brand Remix Button */}
                <button
                  type="button"
                  onClick={() => setViewMode('new-prompt')}
                  className={`w-full py-2.5 px-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    viewMode === 'new-prompt'
                      ? 'bg-white border-[#B85D6F]/40 text-[#281E1C] shadow-xs'
                      : 'bg-white/70 border-[#EADCD7] text-[#281E1C] hover:bg-white'
                  }`}
                >
                  <span className="flex items-center gap-2.5 text-xs font-medium">
                    <span className="w-6 h-6 rounded-full bg-[#FBF2F3] border border-[#E5C1C8] flex items-center justify-center text-[#B85D6F]">
                      <Plus className="w-3.5 h-3.5" />
                    </span>
                    New Brand Remix
                  </span>
                  <span className="text-[10px] font-mono text-[#9E8C86]">
                    URL / 3D
                  </span>
                </button>

                {/* User's Saved Brand Notebooks */}
                <div className="space-y-1.5">
                  <div className="px-2 flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8C7A75]">
                      Your Brand Notebooks ({notebooks.length})
                    </span>
                  </div>

                  <div className="space-y-1">
                    {notebooks.map((nb) => {
                      const isSelected =
                        nb.id === activeNotebook?.id && viewMode === 'notebook';
                      return (
                        <div
                          key={nb.id}
                          onClick={() => {
                            setActiveNotebookId(nb.id);
                            setViewMode('notebook');
                          }}
                          className={`group relative rounded-xl p-2.5 cursor-pointer transition-all border ${
                            isSelected
                              ? 'bg-white border-[#D6958E] shadow-xs'
                              : 'border-transparent hover:bg-white/60 hover:border-[#EADCD7]'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            {/* 3D Vessel Swatch Preview Pill */}
                            <div
                              className="w-4 h-4 rounded-full shrink-0 mt-0.5 border border-[#281E1C]/15 shadow-2xs"
                              style={{
                                background: `linear-gradient(135deg, ${nb.twinOverride.primaryColorHex} 0%, ${nb.twinOverride.accentColorHex} 100%)`,
                              }}
                            />
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-medium text-[#281E1C] truncate">
                                {nb.twinOverride.brandName}
                              </div>
                              <div className="text-[11px] text-[#7A6A65] truncate italic font-serif">
                                {nb.twinOverride.productTitle}
                              </div>
                              <div className="mt-1 flex items-center gap-1.5 text-[10px] text-[#9E8C86]">
                                <span className="truncate max-w-[140px]">
                                  {nb.sourceInput.replace(/^https?:\/\/(www\.)?/, '')}
                                </span>
                                <span>•</span>
                                <span>{nb.createdAt}</span>
                              </div>
                            </div>
                            {notebooks.length > 1 && (
                              <button
                                type="button"
                                onClick={(e) => handleDeleteNotebook(nb.id, e)}
                                className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-[#9E8C86] hover:text-[#B93848] hover:bg-[#FDF2F3] transition-all"
                                title="Delete Notebook"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom Directory Links in Sidebar */}
              <div className="p-3 border-t border-[#EADCD7] bg-[#F2E8E3]/60 space-y-1">
                <button
                  type="button"
                  onClick={() => setViewMode('showcase')}
                  className={`w-full px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                    viewMode === 'showcase'
                      ? 'bg-white text-[#281E1C] font-medium shadow-2xs'
                      : 'text-[#6E5D58] hover:bg-white/70 hover:text-[#281E1C]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Compass className="w-3.5 h-3.5 text-[#B85D6F]" />
                    Editorial Homepage
                  </span>
                  <ArrowRight className="w-3 h-3 opacity-60" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('studio')}
                  className={`w-full px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                    viewMode === 'studio'
                      ? 'bg-white text-[#281E1C] font-medium shadow-2xs'
                      : 'text-[#6E5D58] hover:bg-white/70 hover:text-[#281E1C]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Beaker className="w-3.5 h-3.5 text-[#B85D6F]" />
                    Full Regulatory Lab
                  </span>
                  <ArrowRight className="w-3 h-3 opacity-60" />
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content Canvas */}
        <main className="flex-1 overflow-y-auto">
          {/* =====================================================================
              VIEW 1: MINIMALIST GOOGLE / CHATGPT / NOTEBOOK ENTRY POINT
             ===================================================================== */}
          {viewMode === 'new-prompt' && (
            <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between px-4 sm:px-8 py-10 max-w-4xl mx-auto">
              <div className="flex-1 flex flex-col items-center justify-center text-center my-auto py-8">
                {/* Subtle Editorial Floral Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FBF2F3] border border-[#E5C1C8] text-[#9E4758] text-[11px] tracking-[0.18em] uppercase mb-6"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Atelier de Beauté • 3D Brand &amp; Formulation Notebook</span>
                </motion.div>

                {/* Feminine High-Fashion Serif Greeting */}
                <motion.h1
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.05 }}
                  className="font-serif text-4xl sm:text-6xl font-normal tracking-tight text-[#281E1C] leading-[1.08] max-w-2xl"
                >
                  What beauty icon shall we{' '}
                  <span className="italic font-normal text-[#B85D6F]">
                    reimagine in 3D
                  </span>{' '}
                  today?
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="mt-4 text-sm sm:text-base text-[#7A6A65] max-w-xl font-light leading-relaxed"
                >
                  Paste any Sephora, Ulta, or prestige product URL — or describe a cosmetic concept. Each remix creates a dedicated{' '}
                  <strong className="font-medium text-[#281E1C]">
                    Brand Notebook
                  </strong>{' '}
                  with an interactive 3D compact mockup, shade palette, and clean EU/MoCRA formulation.
                </motion.p>

                {/* Google / ChatGPT Minimalist Omnibar Card */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="w-full max-w-2xl mt-8 bg-white rounded-3xl border border-[#E2D2CC] shadow-[0_20px_60px_-20px_rgba(120,75,65,0.14)] p-3 sm:p-4 transition-all focus-within:border-[#B85D6F] focus-within:shadow-[0_20px_60px_-15px_rgba(184,93,111,0.20)]"
                >
                  <div className="flex items-center gap-3 px-2 py-1">
                    <Search className="w-5 h-5 text-[#B85D6F] shrink-0" />
                    <input
                      type="text"
                      value={promptInput}
                      onChange={(e) => setPromptInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCreateRemixNotebook();
                      }}
                      placeholder="Paste a product URL (e.g. sephora.com/product/...) or describe a luxury clean product..."
                      className="w-full bg-transparent text-sm sm:text-base text-[#281E1C] placeholder:text-[#A69590] focus:outline-none"
                    />
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[#F2E8E3] flex flex-wrap items-center justify-between gap-2 px-1">
                    {/* Mode Toggle Pills */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setPromptMode('generate-distinct-brand')}
                        className={`px-3 py-1 rounded-full text-xs transition-all flex items-center gap-1.5 ${
                          promptMode === 'generate-distinct-brand'
                            ? 'bg-[#FBF2F3] text-[#9E4758] border border-[#E5C1C8] font-medium'
                            : 'text-[#7A6A65] hover:bg-[#FAF6F3]'
                        }`}
                      >
                        <Sparkles className="w-3 h-3" />
                        Remix Brand + 3D Mockup
                      </button>
                      <button
                        type="button"
                        onClick={() => setPromptMode('audit-url')}
                        className={`px-3 py-1 rounded-full text-xs transition-all flex items-center gap-1.5 ${
                          promptMode === 'audit-url'
                            ? 'bg-[#FBF2F3] text-[#9E4758] border border-[#E5C1C8] font-medium'
                            : 'text-[#7A6A65] hover:bg-[#FAF6F3]'
                        }`}
                      >
                        <FileCheck2 className="w-3 h-3" />
                        Audit Existing URL
                      </button>
                    </div>

                    <Button
                      variant="default"
                      size="default"
                      onClick={() => handleCreateRemixNotebook()}
                      disabled={isSynthesizing || !promptInput.trim()}
                      className="rounded-full px-5"
                    >
                      {isSynthesizing ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Sculpting 3D Notebook...
                        </>
                      ) : (
                        <>
                          Create 3D Notebook
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>

                {/* Instant 1-Click Starter Prompts / URLs */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2 max-w-2xl">
                  <span className="text-[11px] uppercase tracking-[0.16em] text-[#9E8C86] mr-1">
                    Try a 1-click remix:
                  </span>
                  {SAMPLE_PRODUCT_URLS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setPromptInput(item.url);
                        handleCreateRemixNotebook(
                          item.url,
                          'generate-distinct-brand'
                        );
                      }}
                      className="px-3.5 py-1.5 rounded-full bg-white hover:bg-[#FBF2F3] border border-[#EADCD7] hover:border-[#D6958E] text-xs text-[#574945] hover:text-[#281E1C] transition-all flex items-center gap-1.5 shadow-2xs"
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-[#C86D7E]" />
                      <span>{item.label.replace(/ URL$/, '')}</span>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const customUrl =
                        'https://www.dior.com/en_us/beauty/products/roseraie-velvet-compact-palette';
                      setPromptInput(customUrl);
                      handleCreateRemixNotebook(
                        customUrl,
                        'generate-distinct-brand'
                      );
                    }}
                    className="px-3.5 py-1.5 rounded-full bg-white hover:bg-[#FBF2F3] border border-[#EADCD7] hover:border-[#D6958E] text-xs text-[#574945] hover:text-[#281E1C] transition-all flex items-center gap-1.5 shadow-2xs"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E6A8B2]" />
                    <span>Peony Rose Couture Compact</span>
                  </button>
                </div>

                {/* Recent Notebooks Strip */}
                <div className="w-full max-w-3xl mt-12 pt-8 border-t border-[#EADCD7]">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] uppercase tracking-[0.18em] text-[#8C7A75] font-medium">
                      Recent Brand Notebooks (Click to open 3D Mockup)
                    </span>
                    <button
                      type="button"
                      onClick={() => setViewMode('showcase')}
                      className="text-xs text-[#B85D6F] hover:underline flex items-center gap-1"
                    >
                      <span>Explore Full Editorial Homepage</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-left">
                    {notebooks.slice(0, 3).map((nb) => (
                      <div
                        key={nb.id}
                        onClick={() => {
                          setActiveNotebookId(nb.id);
                          setViewMode('notebook');
                        }}
                        className="group p-4 rounded-2xl bg-white border border-[#EADCD7] hover:border-[#D6958E] shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-1.5">
                              {nb.twinOverride.palettePanColorsHex
                                .slice(0, 4)
                                .map((hex, i) => (
                                  <span
                                    key={i}
                                    className="w-3.5 h-3.5 rounded-full border border-[#281E1C]/10"
                                    style={{ backgroundColor: hex }}
                                  />
                                ))}
                            </div>
                            <span className="text-[10px] font-mono text-[#9E8C86]">
                              3D TWIN READY
                            </span>
                          </div>
                          <div className="font-serif text-lg font-medium text-[#281E1C] group-hover:text-[#B85D6F] transition-colors">
                            {nb.twinOverride.brandName}
                          </div>
                          <div className="text-xs text-[#7A6A65] italic font-serif">
                            {nb.twinOverride.productTitle}
                          </div>
                        </div>
                        <div className="mt-3 pt-2.5 border-t border-[#F5ECE8] flex items-center justify-between text-[11px] text-[#8C7A75]">
                          <span className="truncate">
                            {nb.sourceInput.replace(/^https?:\/\/(www\.)?/, '')}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#B85D6F] group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              VIEW 2: DEDICATED BRAND NOTEBOOK (WITH IMMEDIATE 3D PRODUCT MOCKUP)
             ===================================================================== */}
          {viewMode === 'notebook' && activeNotebook && (
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
              {/* Notebook Header Bar */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#EADCD7]">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge
                      variant={
                        activeNotebook.result.overallStatus === 'PASS'
                          ? 'pass'
                          : 'violation'
                      }
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      {activeNotebook.result.overallStatus === 'PASS'
                        ? '100% Globally Cleared 3D Brand Notebook'
                        : 'Regulatory Violations Detected in Audited URL'}
                    </Badge>
                    <span className="text-xs font-mono text-[#8C7A75] truncate max-w-md">
                      Source: {activeNotebook.sourceInput}
                    </span>
                  </div>
                  <h1 className="font-serif text-3xl sm:text-5xl text-[#281E1C] tracking-tight">
                    {activeNotebook.twinOverride.brandName}{' '}
                    <span className="italic font-normal text-[#B85D6F]">
                      — {activeNotebook.twinOverride.productTitle}
                    </span>
                  </h1>
                  <p className="mt-1 text-sm text-[#7A6A65] italic font-serif">
                    {activeNotebook.twinOverride.subtitle}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShareNotebook}
                    className="rounded-full text-xs"
                  >
                    {copiedShare ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#2D6A4F]" />
                        Copied Brief
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5" />
                        Copy Brand Brief
                      </>
                    )}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setViewMode('studio')}
                    className="rounded-full text-xs"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    Open in Full Lab Studio
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setViewMode('new-prompt')}
                    className="rounded-full text-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Remix Another URL
                  </Button>
                </div>
              </div>

              {/* HERO ROW OF NOTEBOOK: LIVE 3D PRODUCT MOCKUP (LEFT) + BRAND & SHADE ATELIER (RIGHT) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left 7 Columns: Live Interactive Three.js 3D Product Mockup + Argon 3D CAD Sculptor */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Live Gemini 4 Argon 3D CAD Sculptor Bar */}
                  <div className="p-4 rounded-2xl bg-white border border-[#EADCD7] shadow-2xs space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#B85D6F]" />
                        <span className="text-xs font-semibold text-[#281E1C]">
                          Gemini 4 Argon 3D Model Sculptor
                        </span>
                        <span className="text-[10px] font-mono text-[#9E4758] bg-[#FBF2F3] border border-[#E5C1C8] px-2 py-0.5 rounded-full">
                          models/gemini-4-argon
                        </span>
                      </div>
                      <span className="text-[11px] text-[#7A6A65]">
                        Synthesize a brand-new multi-part 3D CAD vessel
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={argon3DPrompt}
                        onChange={(e) => setArgon3DPrompt(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSculptNew3DWithArgon();
                        }}
                        placeholder="Describe a new 3D vessel (e.g. 'Octagonal porcelain compact with rose-quartz crystal gem', 'Sculpted amphora bottle')..."
                        className="flex-1 bg-[#FAF6F3] border border-[#EADCD7] rounded-full px-4 py-2 text-xs text-[#281E1C] placeholder:text-[#A69590] focus:outline-none focus:border-[#B85D6F]"
                      />
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleSculptNew3DWithArgon()}
                        disabled={isGenerating3D}
                        className="rounded-full shrink-0"
                      >
                        {isGenerating3D ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            Argon Sculpting 3D...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            Generate 3D Model
                          </>
                        )}
                      </Button>
                    </div>

                    {/* 1-Click Argon 3D Silhouette Generators */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] uppercase tracking-wider text-[#8C7A75] mr-1">
                        Sculpt with Argon:
                      </span>
                      {[
                        {
                          label: 'Octagonal Cushion Compact',
                          prompt:
                            'Octagonal blush porcelain cushion compact with stepped rose-gold gallery rim, open mirror lid, 6 petal-arranged silk pigment pans, and faceted rose-quartz gem clasp',
                        },
                        {
                          label: 'Amphora Lathe Elixir Flacon',
                          prompt:
                            'Curved amphora glass elixir flacon revolved on a lathe with suspended botanical pearl capsule, double gold torus collar rings, and faceted dodecahedron crystal stopper',
                        },
                        {
                          label: '12-Faceted Camellia Crème Jar',
                          prompt:
                            '12-sided fluted porcelain camellia crème jar with rose-gold waist belt, whipped cashmere emulsion dome, and crystal crown jewel finial',
                        },
                        {
                          label: 'Tiered Parisian Lipstick Tower',
                          prompt:
                            'Hexagonal porcelain & rose-gold lipstick tower with beveled satin rose pigment bullet, translucent crystal cloche dome, and top pearl sphere finial',
                        },
                      ].map((preset3D) => (
                        <button
                          key={preset3D.label}
                          type="button"
                          disabled={isGenerating3D}
                          onClick={() => handleSculptNew3DWithArgon(preset3D.prompt)}
                          className="px-2.5 py-1 rounded-full text-[11px] bg-[#FAF6F3] hover:bg-[#FBF2F3] border border-[#EADCD7] hover:border-[#D6958E] text-[#574945] hover:text-[#281E1C] transition-all cursor-pointer"
                        >
                          {preset3D.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Live 3D Casing & Vessel Finish Toolbar */}
                  <div className="p-3.5 rounded-2xl bg-white border border-[#EADCD7] shadow-2xs flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Palette className="w-4 h-4 text-[#B85D6F]" />
                      <span className="text-xs font-medium text-[#281E1C]">
                        3D Porcelain &amp; Enamel Finish:
                      </span>
                    </div>

                    {/* Feminine Color Theme Swatches */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {FEMININE_VESSEL_THEMES.map((theme) => {
                        const isCurrent =
                          activeNotebook.twinOverride.primaryColorHex ===
                          theme.primaryColorHex;
                        return (
                          <button
                            key={theme.label}
                            type="button"
                            onClick={() =>
                              handleUpdateActiveTwin({
                                primaryColorHex: theme.primaryColorHex,
                                secondaryColorHex: theme.secondaryColorHex,
                                accentColorHex: theme.accentColorHex,
                                metallicFinish: theme.metallicFinish,
                              })
                            }
                            className={`px-2.5 py-1 rounded-full text-[11px] flex items-center gap-1.5 border transition-all ${
                              isCurrent
                                ? 'bg-[#FBF2F3] border-[#B85D6F] text-[#281E1C] font-medium shadow-2xs'
                                : 'bg-[#FAF6F3] border-[#EADCD7] text-[#7A6A65] hover:text-[#281E1C]'
                            }`}
                          >
                            <span
                              className="w-3 h-3 rounded-full border border-[#281E1C]/15"
                              style={{
                                background: `linear-gradient(135deg, ${theme.primaryColorHex} 0%, ${theme.accentColorHex} 100%)`,
                              }}
                            />
                            {theme.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* LIVE INTERACTIVE THREE.JS 3D PRODUCT MOCKUP */}
                  <BrandTwin3DViewport
                    spec={activeNotebook.twinOverride}
                    linting={activeNotebook.result.artworkLinting}
                    peelAmount={activeNotebook.peelAmount}
                    onPeelAmountChange={handleUpdatePeelAmount}
                  />

                  {/* Gemini 4 Argon 3D CAD Scene Graph Telemetry Card */}
                  {activeNotebook.twinOverride.procedural3DModel && (
                    <div className="p-4 rounded-2xl bg-white border border-[#EADCD7] shadow-2xs space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-xs font-semibold text-[#281E1C] flex items-center gap-1.5">
                          <Box className="w-3.5 h-3.5 text-[#B85D6F]" />
                          <span>
                            Argon 3D Assembly:{' '}
                            {activeNotebook.twinOverride.procedural3DModel.modelTitle}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-[#7A6A65]">
                          {
                            activeNotebook.twinOverride.procedural3DModel
                              .customPrimitives.length
                          }{' '}
                          Procedural Meshes
                          {activeNotebook.twinOverride.procedural3DModel
                            .latheProfilePoints?.length
                            ? ` + ${activeNotebook.twinOverride.procedural3DModel.latheProfilePoints.length}-Pt Lathe Hull`
                            : ''}
                        </span>
                      </div>
                      <p className="text-xs text-[#6E5D58] leading-relaxed">
                        {
                          activeNotebook.twinOverride.procedural3DModel
                            .architecturalNotes
                        }
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {activeNotebook.twinOverride.procedural3DModel.customPrimitives.map(
                          (part, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF6F3] border border-[#EADCD7] text-[10px] text-[#574945]"
                            >
                              <span
                                className="w-2 h-2 rounded-full border border-[#281E1C]/15"
                                style={{ backgroundColor: part.colorHex }}
                              />
                              <span>{part.partName}</span>
                              <span className="font-mono text-[#9E8C86]">
                                ({part.geometryType})
                              </span>
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right 5 Columns: Remixed Brand Identity, Clickable Shade Swatches, & Clean Substitutions */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Card 1: Remixed Brand House Identity & Interactive Shade Swatches */}
                  <Card className="rounded-2xl border-[#EADCD7] bg-white">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#B85D6F]">
                          Remixed Brand Identity
                        </span>
                        <Badge variant="pass">
                          {activeNotebook.result.productCategory}
                        </Badge>
                      </div>
                      <CardTitle className="font-serif text-2xl text-[#281E1C] mt-1">
                        {activeNotebook.twinOverride.brandName}
                      </CardTitle>
                      <CardDescription className="text-xs text-[#6E5D58] leading-relaxed">
                        {activeNotebook.result.urlRemixMetadata
                          .differentiationStrategy ||
                          activeNotebook.result.summaryHeadline}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-5">
                      {/* Clickable 9-Pan Shade Swatches that update the 3D Mockup live */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] uppercase tracking-[0.15em] text-[#7A6A65] font-medium">
                            Harmonized 9-Pan Shade Palette (Click to tint 3D Vessel)
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {activeNotebook.twinOverride.palettePanColorsHex
                            .slice(0, 6)
                            .map((hex, idx) => {
                              const isSelected =
                                activeNotebook.selectedSwatchIdx === idx;
                              const shadeNames = [
                                'Pivoine Rose',
                                'Soie de Nacre',
                                'Velours Mauve',
                                'Pétale Doré',
                                'Cachemire Rosé',
                                'Lumière Iris',
                              ];
                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => handleSelectSwatch(hex, idx)}
                                  className={`p-2 rounded-xl border text-left transition-all flex items-center gap-2 ${
                                    isSelected
                                      ? 'bg-[#FBF2F3] border-[#B85D6F] shadow-2xs'
                                      : 'bg-[#FAF6F3]/70 border-[#EADCD7] hover:bg-white'
                                  }`}
                                >
                                  <span
                                    className="w-5 h-5 rounded-full shrink-0 border border-[#281E1C]/15 shadow-inner"
                                    style={{ backgroundColor: hex }}
                                  />
                                  <div className="min-w-0">
                                    <div className="text-[11px] font-medium text-[#281E1C] truncate">
                                      {shadeNames[idx]}
                                    </div>
                                    <div className="text-[9px] font-mono text-[#8C7A75]">
                                      {hex}
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                        </div>
                      </div>

                      {/* Before -> After Clean Ingredient Substitutions */}
                      <div className="pt-3 border-t border-[#F2E8E3]">
                        <div className="text-[11px] uppercase tracking-[0.15em] text-[#7A6A65] font-medium mb-2.5">
                          Before → After Clean Botanical Substitutions
                        </div>
                        <div className="space-y-2.5">
                          {activeNotebook.result.urlRemixMetadata.substitutedIngredients
                            .length > 0 ? (
                            activeNotebook.result.urlRemixMetadata.substitutedIngredients.map(
                              (sub, idx) => (
                                <div
                                  key={idx}
                                  className="p-3 rounded-xl bg-[#FAF6F3] border border-[#EADCD7] space-y-1"
                                >
                                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                                    <span className="line-through text-[#B93848] font-medium">
                                      {sub.replaced}
                                    </span>
                                    <ArrowRight className="w-3 h-3 text-[#8C7A75]" />
                                    <span className="text-[#2D6A4F] font-semibold">
                                      {sub.replacement}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-[#6E5D58] leading-relaxed">
                                    {sub.reason}
                                  </p>
                                </div>
                              )
                            )
                          ) : (
                            <div className="p-3 rounded-xl bg-[#FAF6F3] border border-[#EADCD7] flex items-center justify-between">
                              <span className="text-xs text-[#6E5D58]">
                                Auditing original URL formulation. Click to generate a clean remix:
                              </span>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() =>
                                  handleCreateRemixNotebook(
                                    activeNotebook.sourceInput,
                                    'generate-distinct-brand'
                                  )
                                }
                              >
                                Remix Clean Brand
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* BOTTOM ROW OF NOTEBOOK: MULTI-MARKET CLEARANCE TABLE + FOLLOW-UP REMIX BAR */}
              <Card className="rounded-2xl border-[#EADCD7] bg-white overflow-hidden">
                <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#FAF6F3] border-b border-[#EADCD7]">
                  <div>
                    <CardTitle className="font-serif text-xl text-[#281E1C]">
                      Multi-Jurisdictional Regulatory Clearance Matrix
                    </CardTitle>
                    <CardDescription className="text-xs text-[#7A6A65]">
                      Deterministic ingredient-by-ingredient toxicology audit across US FDA MoCRA, California AB 2762, and EU Regulation (EC) No 1223/2009.
                    </CardDescription>
                  </div>
                  <Badge
                    variant={
                      activeNotebook.result.overallStatus === 'PASS'
                        ? 'pass'
                        : 'violation'
                    }
                  >
                    {activeNotebook.result.overallStatus === 'PASS'
                      ? 'All 3 Global Markets Cleared'
                      : 'Jurisdictional Conflict Flagged'}
                  </Badge>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>INCI Ingredient</TableHead>
                        <TableHead>CAS Number</TableHead>
                        <TableHead>Conc. %</TableHead>
                        <TableHead>US FDA MoCRA</TableHead>
                        <TableHead>California AB 2762</TableHead>
                        <TableHead>EU (EC) 1223/2009</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeNotebook.result.matrixRows.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className="font-medium text-[#281E1C]">
                            <div>{row.ingredientName}</div>
                            <div className="text-[11px] text-[#7A6A65] font-normal">
                              {row.inciName}
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-xs text-[#7A6A65]">
                            {row.casNumber}
                          </TableCell>
                          <TableCell className="font-mono text-xs text-[#281E1C]">
                            {row.concentrationPercent}
                          </TableCell>
                          {(['usFda', 'california', 'eu'] as const).map(
                            (jurKey) => {
                              const j = row[jurKey];
                              return (
                                <TableCell key={jurKey}>
                                  <div className="flex items-center gap-1.5">
                                    {j.status === 'PASS' ? (
                                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2D6A4F]" />
                                    ) : (
                                      <XCircle className="w-3.5 h-3.5 text-[#B93848]" />
                                    )}
                                    <span className="text-xs font-medium text-[#281E1C]">
                                      {j.status}
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-[#7A6A65] mt-0.5">
                                    {j.citation}
                                  </div>
                                </TableCell>
                              );
                            }
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Follow-up Notebook Prompt Bar (Spin off a new Notebook variation) */}
              <div className="p-4 rounded-2xl bg-white border border-[#EADCD7] shadow-sm flex flex-col sm:flex-row items-center gap-3">
                <div className="flex items-center gap-2.5 flex-1 w-full">
                  <Sparkles className="w-4 h-4 text-[#B85D6F] shrink-0" />
                  <input
                    type="text"
                    value={followUpInput}
                    onChange={(e) => setFollowUpInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && followUpInput.trim()) {
                        handleCreateRemixNotebook(
                          followUpInput,
                          'generate-distinct-brand'
                        );
                      }
                    }}
                    placeholder="Paste another product URL or prompt to spin off a new 3D Brand Notebook..."
                    className="w-full bg-transparent text-sm text-[#281E1C] placeholder:text-[#A69590] focus:outline-none"
                  />
                </div>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() =>
                    handleCreateRemixNotebook(
                      followUpInput,
                      'generate-distinct-brand'
                    )
                  }
                  disabled={isSynthesizing || !followUpInput.trim()}
                  className="rounded-full shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Create New Notebook
                </Button>
              </div>
            </div>
          )}

          {/* =====================================================================
              VIEW 3: ACCESSIBLE EDITORIAL SHOWCASE & HOMEPAGE
             ===================================================================== */}
          {viewMode === 'showcase' && (
            <div className="space-y-20 pb-24">
              {/* Sunlit Parisian Vanity Hero Section */}
              <section className="relative overflow-hidden border-b border-[#EADCD7] bg-gradient-to-b from-[#FBF2F3]/70 via-[#FAF6F3] to-[#FAF6F3] pt-12 pb-20 px-4 sm:px-8">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-6 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#E5C1C8] text-[#9E4758] text-[11px] tracking-[0.18em] uppercase">
                      <Sparkles className="w-3 h-3" />
                      <span>La Maison OpenCompact • Clean Beauty Intelligence</span>
                    </div>

                    <h1 className="font-serif text-4xl sm:text-6xl text-[#281E1C] font-normal tracking-tight leading-[1.06]">
                      Where Haute Couture{' '}
                      <span className="italic text-[#B85D6F]">Formulation</span>{' '}
                      Meets Global Retail Clearance.
                    </h1>

                    <p className="text-base text-[#6E5D58] leading-relaxed font-light max-w-xl">
                      Inspired by Alexis Eizinas of Silvering. OpenCompact unites sunlit 3D packaging art direction with deterministic toxicology across US FDA MoCRA, California AB 2762, and EU Regulation (EC) 1223/2009.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <Button
                        variant="default"
                        size="lg"
                        onClick={() => setViewMode('new-prompt')}
                        className="rounded-full"
                      >
                        <Sparkles className="w-4 h-4" />
                        Launch Minimalist Remix Notebook
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => setViewMode('notebook')}
                        className="rounded-full"
                      >
                        <Box className="w-4 h-4 text-[#B85D6F]" />
                        View Active 3D Product Twin
                      </Button>
                    </div>
                  </div>

                  {/* Sunlit Parisian Vanity Photography Card */}
                  <div className="lg:col-span-6">
                    <div className="relative rounded-3xl overflow-hidden border border-[#EADCD7] shadow-[0_24px_60px_-20px_rgba(120,75,65,0.18)] bg-white p-3">
                      <div className="relative h-[420px] w-full rounded-2xl overflow-hidden">
                        <Image
                          src="/images/feminine_vanity_hero.jpg"
                          alt="OpenCompact Parisian Vanity & Refillable Rose-Gold Compact"
                          fill
                          className="object-cover"
                          referrerPolicy="no-referrer"
                          priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#281E1C]/50 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-[#EADCD7] flex items-center justify-between">
                          <div>
                            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#B85D6F]">
                              Verified Retail Readiness
                            </div>
                            <div className="font-serif text-lg text-[#281E1C]">
                              Sephora Clean • Credo • EU Annex II/III
                            </div>
                          </div>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => setViewMode('notebook')}
                            className="rounded-full text-xs"
                          >
                            Interact in 3D
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Interactive Regulatory Concentration Sandbox */}
              <section className="max-w-7xl mx-auto px-4 sm:px-8">
                <div className="rounded-3xl bg-white border border-[#EADCD7] p-6 sm:p-10 shadow-xs">
                  <div className="max-w-2xl mb-8">
                    <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#B85D6F]">
                      Interactive Formulation Sandbox
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl text-[#281E1C] mt-1">
                      Test Live Active Thresholds Across Three Jurisdictions
                    </h2>
                    <p className="text-sm text-[#7A6A65] mt-2">
                      Drag the active Retinol concentration slider or toggle PFAS substitution to see how a formula passes in the US while triggering restrictions in Europe.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-5 space-y-6 p-6 rounded-2xl bg-[#FAF6F3] border border-[#EADCD7]">
                      <div>
                        <div className="flex items-center justify-between text-xs font-medium text-[#281E1C] mb-2">
                          <span>Active Retinol Concentration (Leave-On)</span>
                          <span className="font-mono text-sm text-[#B85D6F]">
                            {sandboxConcentration.toFixed(2)}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min={0.01}
                          max={0.2}
                          step={0.01}
                          value={sandboxConcentration}
                          onChange={(e) =>
                            setSandboxConcentration(parseFloat(e.target.value))
                          }
                          className="w-full accent-[#B85D6F] cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] font-mono text-[#8C7A75] mt-1">
                          <span>0.01%</span>
                          <span>EU Cap: 0.05%</span>
                          <span>US Cap: 0.10%</span>
                          <span>0.20%</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[#EADCD7] flex items-center justify-between">
                        <div>
                          <div className="text-xs font-medium text-[#281E1C]">
                            Substitute PTFE (PFAS) with Boron Nitride Silk
                          </div>
                          <div className="text-[11px] text-[#7A6A65]">
                            Required for California AB 2762 &amp; EU REACH
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSandboxPfasFree((v) => !v)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                            sandboxPfasFree
                              ? 'bg-[#2D6A4F] text-white'
                              : 'bg-[#FBF2F3] text-[#B93848] border border-[#E5C1C8]'
                          }`}
                        >
                          {sandboxPfasFree
                            ? 'PFAS-Free (Boron Silk)'
                            : 'Contains PTFE'}
                        </button>
                      </div>
                    </div>

                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        {
                          market: 'US FDA MoCRA',
                          pass: sandboxUsPass,
                          note: sandboxUsPass
                            ? 'Cleared for US retail distribution'
                            : 'Exceeds 0.10% CIR safety threshold',
                        },
                        {
                          market: 'California AB 2762',
                          pass: sandboxCaPass,
                          note: sandboxCaPass
                            ? 'PFAS-free & cleared for CA retail'
                            : 'Blocked by intentionally added PFAS / cap',
                        },
                        {
                          market: 'EU (EC) 1223/2009',
                          pass: sandboxEuPass,
                          note: sandboxEuPass
                            ? 'Complies with EU Annex III 0.05% cap'
                            : 'Exceeds EU 0.05% Retinol leave-on limit',
                        },
                      ].map((m) => (
                        <div
                          key={m.market}
                          className={`p-5 rounded-2xl border ${
                            m.pass
                              ? 'bg-[#F4FBF7] border-[#B7E4C7]'
                              : 'bg-[#FDF2F3] border-[#F2C6CC]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-[#281E1C]">
                              {m.market}
                            </span>
                            {m.pass ? (
                              <CheckCircle2 className="w-4 h-4 text-[#2D6A4F]" />
                            ) : (
                              <XCircle className="w-4 h-4 text-[#B93848]" />
                            )}
                          </div>
                          <div
                            className={`font-serif text-xl font-medium ${
                              m.pass ? 'text-[#2D6A4F]' : 'text-[#B93848]'
                            }`}
                          >
                            {m.pass ? 'Cleared' : 'Restricted'}
                          </div>
                          <p className="text-xs text-[#6E5D58] mt-1">{m.note}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Silvering 5 Pillars Editorial Section */}
              <section className="max-w-7xl mx-auto px-4 sm:px-8">
                <div className="mb-8">
                  <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#B85D6F]">
                    Modern Beauty Founder Ethos • Authority Magazine
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl text-[#281E1C] mt-1">
                    Five Pillars Inspired by Alexis Eizinas of Silvering
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {SILVERING_FIVE_PILLARS.map((pillar) => (
                    <div
                      key={pillar.number}
                      className="p-5 rounded-2xl bg-white border border-[#EADCD7] flex flex-col justify-between"
                    >
                      <div>
                        <span className="font-serif text-2xl italic text-[#B85D6F]">
                          {pillar.number}
                        </span>
                        <h3 className="font-serif text-lg font-medium text-[#281E1C] mt-2">
                          {pillar.title}
                        </h3>
                        <p className="text-xs text-[#7A6A65] mt-2 leading-relaxed">
                          {pillar.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* =====================================================================
              VIEW 4: FULL REGULATORY LAB STUDIO
             ===================================================================== */}
          {viewMode === 'studio' && (
            <div className="py-6">
              <ComplianceStudioWorkspace />
            </div>
          )}
        </main>
      </div>

      {/* GitHub README Modal */}
      <Dialog open={readmeModalOpen} onOpenChange={setReadmeModalOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-white border-[#EADCD7] text-[#281E1C]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="font-serif text-2xl text-[#281E1C]">
                OpenCompact — Repository Documentation
              </DialogTitle>
              <Button variant="outline" size="sm" onClick={handleCopyReadme}>
                {copiedReadme ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#2D6A4F]" />
                    Copied Markdown
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy README.md
                  </>
                )}
              </Button>
            </div>
            <DialogDescription className="text-xs text-[#7A6A65]">
              Open-source 3D cosmetic packaging twin &amp; multi-jurisdictional formulation studio.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 p-6 rounded-2xl bg-[#FAF6F3] border border-[#EADCD7] prose prose-sm max-w-none text-[#281E1C]">
            <div className="markdown-body">
              <Markdown>{OPENCOMPACT_README_MD}</Markdown>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
