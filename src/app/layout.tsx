import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Story Arc Tracker — Investigative Intelligence',
  description: 'Transform any news article into a dynamic investigative board with sentiment analysis, entity mapping, and narrative intelligence.',
  keywords: 'news analysis, sentiment analysis, investigative journalism, business intelligence',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-war-bg text-war-text antialiased">{children}</body>
    </html>
  );
}
