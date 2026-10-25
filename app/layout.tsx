import type { Metadata } from 'next';
import {
  Cormorant_Garamond,
  Plus_Jakarta_Sans,
  JetBrains_Mono,
} from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
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
  title: 'OpenCompact — Prestige Beauty Formulation & 3D Brand Notebook',
  description:
    'The minimalist beauty brand notebook, live 3D packaging studio, and global cosmetic compliance atelier powered by Gemini 4 Argon.',
  openGraph: {
    title: 'OpenCompact — Prestige Beauty Formulation & 3D Brand Notebook',
    description:
      'The minimalist beauty brand notebook, live 3D packaging studio, and global cosmetic compliance atelier powered by Gemini 4 Argon.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OpenCompact — Prestige Beauty Formulation & 3D Brand Notebook',
    description:
      'The minimalist beauty brand notebook, live 3D packaging studio, and global cosmetic compliance atelier powered by Gemini 4 Argon.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`}
    >
      <body
        suppressHydrationWarning
        className="min-h-screen bg-[#FAF6F3] text-[#281E1C] antialiased selection:bg-[#F3D7DC] selection:text-[#692332]"
        style={{ fontFamily: 'var(--font-sans), sans-serif' }}
      >
        {children}
      </body>
    </html>
  );
}
