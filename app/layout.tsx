import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Public_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-display',
});

const publicSans = Public_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'OpenCompact — Open-Source Cosmetic Compliance Engine & 3D Brand Twin Simulator',
  description:
    'Open-source regulatory intelligence platform and developer studio powered by Gemini 4 Argon. Audit cosmetic formulations, 3D packaging artwork layers, and 15-day MoCRA adverse event dossiers across US FDA, California, and the EU.',
  openGraph: {
    title: 'OpenCompact — Open-Source Cosmetic Compliance Engine & 3D Brand Twin Simulator',
    description:
      'Open-source regulatory intelligence platform and developer studio powered by Gemini 4 Argon.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OpenCompact — Open-Source Cosmetic Compliance Engine & 3D Brand Twin Simulator',
    description:
      'Open-source regulatory intelligence platform and developer studio powered by Gemini 4 Argon.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${publicSans.variable} ${jetbrainsMono.variable} dark`}
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
