import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Free Background Remover Online - Remove Image Background Instantly | BgRemover.ai',
  description:
    'Remove image backgrounds for free with AI. No login required, instant results, HD quality PNG download. The fastest background remover online.',
  keywords: 'background remover, remove background, image background remover, ai background remover, free background remover',
  openGraph: {
    title: 'Free AI Background Remover — Instant, No Login Required',
    description: 'Remove image backgrounds in seconds with AI. Free, fast, and no signup needed.',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'BgRemover.ai',
  description: 'Free AI-powered image background remover. No login required.',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
