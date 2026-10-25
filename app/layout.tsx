import type { Metadata } from 'next';
import {
  Playfair_Display,
  Plus_Jakarta_Sans,
  JetBrains_Mono,
} from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-serif',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'OpenCompact — Prestige Beauty Formulation & Regulatory Atelier',
  description:
    'The prestige cosmetic formulation, 3D packaging studio, and global regulatory compliance maison powered by Gemini 4 Argon. Built for modern beauty founders and brands.',
  openGraph: {
    title: 'OpenCompact — Prestige Beauty Formulation & Regulatory Atelier',
    description:
      'The prestige cosmetic formulation, 3D packaging studio, and global regulatory compliance maison powered by Gemini 4 Argon.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OpenCompact — Prestige Beauty Formulation & Regulatory Atelier',
    description:
      'The prestige cosmetic formulation, 3D packaging studio, and global regulatory compliance maison powered by Gemini 4 Argon.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${plusJakarta.variable} ${jetbrainsMono.variable} dark`}
    >
      <body
        suppressHydrationWarning
        className="min-h-screen bg-slate-950 text-slate-50 antialiased selection:bg-emerald-500/30 selection:text-emerald-200"
        style={{ fontFamily: 'var(--font-sans), sans-serif' }}
      >
        {children}
      </body>
    </html>
  );
}
