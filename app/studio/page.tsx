'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Markdown from 'react-markdown';
import { ComplianceStudioWorkspace } from '@/components/studio/ComplianceStudioWorkspace';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { OPENCOMPACT_README_MD } from '@/lib/compliance-data';

export default function StudioPage() {
  const router = useRouter();
  const [readmeOpen, setReadmeOpen] = useState(false);

  return (
    <>
      <ComplianceStudioWorkspace
        initialPresetId="huda-matrix"
        onBackToLanding={() => router.push('/')}
        onOpenReadmeModal={() => setReadmeOpen(true)}
      />

      <Dialog open={readmeOpen} onOpenChange={setReadmeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>OpenCompact — GitHub README.md</DialogTitle>
            <DialogDescription>
              Open-source repository documentation, Gemini 4 Argon architecture, and quickstart CLI
              reference.
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
