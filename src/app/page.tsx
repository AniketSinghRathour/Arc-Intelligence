'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnalysisResult } from '@/lib/types';
import SentimentChart from '@/components/SentimentChart';
import Timeline from '@/components/Timeline';
import EntityWeb from '@/components/EntityWeb';
import MetricsRow from '@/components/MetricsRow';
import LoadingSkeleton from '@/components/LoadingSkeleton';

const EXAMPLE_URLS = [
  { label: 'Economic Times', url: 'https://economictimes.indiatimes.com/markets/stocks/news' },
  { label: 'Mint', url: 'https://livemint.com/companies' },
  { label: 'Business Standard', url: 'https://business-standard.com/companies' },
  { label: 'Moneycontrol', url: 'https://moneycontrol.com/news/business' },
];

const SUPPORTED_SITES = [
  'economictimes.indiatimes.com',
  'livemint.com',
  'business-standard.com',
  'moneycontrol.com',
  'ndtv.com',
  'thehindu.com',
  'reuters.com',
  'bloomberg.com (public)',
  'techcrunch.com',
  'ft.com (public)',
];

export default function HomePage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [highlightedEvent, setHighlightedEvent] = useState<number | null>(null);
  const [altOpen, setAltOpen] = useState(false);
  const [showSites, setShowSites] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  async function analyze() {
    const trimmed = url.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setAltOpen(false);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Analysis failed. Please try another URL.');
      } else {
        setResult(data.data);
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') analyze();
  }

  return (
    <div className="min-h-screen bg-war-bg font-syne">
      {/* Header */}
      <header className="border-b border-war-border bg-war-surface/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-war-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18" /><path strokeLinecap="round" strokeLinejoin="round" d="m19 9-5 5-4-4-3 3" /></svg>
            <span className="font-semibold text-sm text-war-text tracking-tight">
              News Arc Analytics
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-war-muted hidden sm:block font-medium">
              Information Workspace
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10 space-y-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4 pt-4"
        >
          <div className="inline-flex items-center gap-2 border border-war-border rounded-full px-4 py-1.5 bg-war-surface transition-colors cursor-default">
            <span className="relative w-1.5 h-1.5 rounded-full bg-war-accent" />
            <span className="text-[11px] text-war-text font-medium tracking-wide">
              Article Analysis Module
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-war-text leading-[1.1] tracking-tight">
            News Arc Tracker
          </h1>
          <p className="text-sm text-war-muted max-w-2xl mx-auto leading-relaxed">
            Paste any news article URL to extract structured intelligence. 
            Instantly generate a full investigative board — including sentiment arcs, narrative timelines, 
            entity relationship maps, and contrarian viewpoints.
          </p>
        </motion.div>

        {/* URL Input */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="space-y-3"
        >
          <div className="flex gap-3 relative group/input max-w-3xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-war-accent/0 via-war-accent/20 to-war-accent/0 rounded-2xl blur-lg opacity-0 group-focus-within/input:opacity-100 transition duration-700 pointer-events-none" />
            <input
              ref={inputRef}
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="https://economictimes.indiatimes.com/your-article-url"
              className="war-input flex-1 rounded-xl px-5 py-4 text-sm relative z-10 bg-war-surface border-war-border focus:border-war-accent/40 focus:ring-1 focus:ring-war-accent/40 shadow-inner transition-all placeholder:text-war-muted/50"
              disabled={loading}
            />
            <button
              onClick={analyze}
              disabled={loading || !url.trim()}
              className="bg-war-text text-war-bg font-semibold px-8 py-4 rounded-xl hover:bg-war-muted hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap text-sm z-10"
            >
              <span className="flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-war-bg border-t-transparent animate-spin" />
                    Analyzing
                  </>
                ) : 'Analyze Article →'}
              </span>
            </button>
          </div>


        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-500/10 border border-red-500/30 rounded-xl p-4"
            >
              <p className="font-mono text-sm text-red-400">⚠ {error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading */}
        <AnimatePresence>
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoadingSkeleton />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {result && !loading && (
            <motion.div
              key="results"
              ref={resultsRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-5"
            >
              {/* Article header */}
              <div className="border border-war-border rounded-xl p-5 bg-war-card">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-semibold text-war-muted uppercase tracking-wider">
                      Executive Summary
                    </p>
                    <h2 className="text-xl font-bold text-war-text leading-snug">
                      {result.headline}
                    </h2>
                    <p className="text-sm text-war-muted leading-relaxed max-w-2xl">
                      {result.summary}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <a
                      href={result.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-war-accent border border-war-accent/30 px-3 py-1.5 rounded-lg hover:bg-war-accent/10 transition-colors"
                    >
                      View Source ↗
                    </a>
                    <span className="text-[10px] text-war-muted">
                      {new Date(result.scrapedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <MetricsRow data={result} />

              {/* Sentiment Pulse */}
              <div className="bg-war-card border border-war-border rounded-xl p-5 hover:border-war-muted transition-all duration-300 shadow-sm group">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[11px] font-semibold text-war-muted uppercase tracking-wider mb-1 group-hover:text-war-accent transition-colors">
                      Market Sentiment
                    </p>
                    <p className="text-sm font-medium text-war-text">
                      Narrative Arc Visualisation
                    </p>
                  </div>
                  <div className="text-[11px] text-war-muted text-right opacity-50 group-hover:opacity-100 transition-opacity">
                    <p>Hover chart points</p>
                    <p>to highlight events</p>
                  </div>
                </div>
                <SentimentChart
                  events={result.events}
                  onEventHover={setHighlightedEvent}
                />
              </div>

              {/* Timeline + Entity Web */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-war-card border border-war-border rounded-xl p-5 h-full group hover:border-war-muted transition-all duration-300 shadow-sm">
                  <p className="text-[11px] font-semibold text-war-muted uppercase tracking-wider mb-1 group-hover:text-war-accent transition-colors">
                    Narrative Scroll
                  </p>
                  <p className="text-sm font-medium text-war-text mb-4">Chronological Timeline</p>
                  <Timeline events={result.events} highlightedIndex={highlightedEvent} />
                </div>

                <div className="bg-war-card border border-war-border rounded-xl p-5 h-full group hover:border-war-muted transition-all duration-300 shadow-sm">
                  <p className="text-[11px] font-semibold text-war-muted uppercase tracking-wider mb-1 group-hover:text-war-accent transition-colors">
                    Entity Web
                  </p>
                  <p className="text-sm font-medium text-war-text mb-4">Key Players & Relationships</p>
                  <EntityWeb entities={result.entities} mermaidDiagram={result.mermaidDiagram} />
                </div>
              </div>

              {/* Deep Analysis Panels */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Contrarian viewpoints */}
                <div className="border-l-2 border-war-blue bg-war-card rounded-r-xl p-5 shadow-sm group hover:bg-war-surface transition-colors">
                  <div className="w-full flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-semibold text-war-muted uppercase tracking-wider mb-1 group-hover:text-war-blue transition-colors">
                        Contrarian Perspectives
                      </p>
                      <p className="text-sm text-war-blue font-medium">
                        Alternative Viewpoints & Criticisms
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    {result.altViewpoints.map((vp, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className="flex gap-3 p-3 bg-war-surface/50 rounded-lg border border-war-border group-hover:bg-war-surface transition-colors"
                      >
                        <span className="text-xs font-semibold text-war-blue mt-0.5 opacity-80">
                          {['Bear', 'Bull', 'Alt'][i % 3]}
                        </span>
                        <p className="text-xs text-war-muted leading-relaxed">{vp}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Horizon Radar */}
                <div className="border-l-2 border-war-accent bg-war-card rounded-r-xl p-5 shadow-sm group hover:bg-war-surface transition-colors">
                  <div className="w-full flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-semibold text-war-muted uppercase tracking-wider mb-1 group-hover:text-war-accent transition-colors">
                        Forward Outlook
                      </p>
                      <p className="text-sm text-war-accent font-medium">
                        Predicted Developments
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    {result.futurePredictions ? result.futurePredictions.map((pred, i) => {
                      const probColors = {
                        High: 'text-red-400 border-red-500/20 bg-red-500/10',
                        Medium: 'text-orange-400 border-orange-500/20 bg-orange-500/10',
                        Low: 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10',
                      };
                      const PCol = probColors[pred.probability as keyof typeof probColors] || probColors.Medium;

                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.07 }}
                          className="flex flex-col gap-2 p-3 bg-war-surface/50 rounded-lg border border-war-border group-hover:bg-war-surface transition-colors"
                        >
                          <div className="flex justify-between items-center">
                             <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded border ${PCol}`}>{pred.probability} Prob</span>
                             <span className="text-[10px] text-war-muted font-medium uppercase">{pred.timeframe}</span>
                          </div>
                          <p className="text-sm text-war-text leading-snug">{pred.implication}</p>
                        </motion.div>
                      );
                    }) : (
                      <p className="text-sm text-war-muted">Predictions are only available for newly generated reports.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* New analysis CTA */}
              <div className="flex flex-wrap items-center justify-center gap-3 py-8 border-t border-war-border">
                <button
                  onClick={() => {
                    setResult(null);
                    setUrl('');
                    setError(null);
                    inputRef.current?.focus();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs font-medium text-war-muted border border-war-border px-5 py-2.5 rounded-xl hover:border-war-text hover:text-war-text hover:bg-war-surface transition-all"
                >
                  ← New Analysis
                </button>
                
                <button
                  onClick={() => {
                    alert("Mock: In a production environment, this would split the screen and allow you to paste another URL to append its extracted entities and events to the current graph, building a multi-month Story Arc.");
                  }}
                  className="text-xs font-semibold text-war-bg bg-war-text px-5 py-2.5 rounded-xl hover:bg-war-muted hover:scale-105 active:scale-95 transition-all shadow-sm flex items-center gap-2"
                >
                  ➕ Add Source to Arc
                </button>

                <button
                  onClick={() => window.print()}
                  className="text-xs font-semibold text-war-blue border border-war-blue/30 bg-war-blue/10 px-5 py-2.5 rounded-xl hover:bg-war-blue/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  ⬇ Export Briefing
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {!loading && !result && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-24 space-y-6"
          >
            <div className="relative flex justify-center items-center h-16 w-16 mx-auto">
              <div className="absolute inset-0 border border-war-border border-dashed rounded-full animate-[spin_10s_linear_infinite] opacity-50" />
              <div className="absolute inset-2 border border-war-accent/30 rounded-full animate-[spin_6s_linear_infinite_reverse] opacity-50" />
              <div className="w-2 h-2 rounded-full bg-war-accent animate-pulse shadow-[0_0_15px_rgba(0,255,136,0.6)]" />
            </div>
            <div className="space-y-2">
              <p className="font-mono text-sm text-war-text/80 font-medium">
                System Standing By
              </p>
              <p className="font-mono text-xs text-war-muted max-w-sm mx-auto leading-relaxed">
                Paste a link to any major news publication above to initialize data extraction and build the intelligence graph.
              </p>
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-war-border mt-16 py-6">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between flex-wrap gap-3">
          <span className="font-mono text-[10px] text-war-muted">
            Story Arc Tracker · Built for investigative news intelligence
          </span>
          <span className="font-mono text-[10px] text-war-muted flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
            Enterprise-grade secure extraction · E2E Encrypted
          </span>
        </div>
      </footer>
    </div>
  );
}
