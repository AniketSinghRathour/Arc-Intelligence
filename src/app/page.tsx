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
      <header className="border-b border-war-border bg-war-surface/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-war-accent pulse-dot" />
            <span className="font-mono text-xs text-war-muted tracking-widest uppercase">
              Story Arc Tracker
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] text-war-muted hidden sm:block">
              Investigative Intelligence Board
            </span>
            <div className="flex items-center gap-1.5 border border-war-accent/20 px-2.5 py-1 rounded-md bg-war-accent/5">
              <span className="w-1.5 h-1.5 rounded-full bg-war-accent animate-pulse" />
              <span className="font-mono text-[9px] text-war-accent uppercase tracking-wider font-semibold">
                System Online
              </span>
            </div>
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
          <div className="inline-flex items-center gap-3 border border-war-border rounded-full px-5 py-2 bg-war-surface shadow-[0_4px_20px_-10px_rgba(0,0,0,0.5)] transition-colors hover:border-war-accent/30 cursor-default">
            <div className="relative flex items-center justify-center">
              <span className="absolute w-3 h-3 rounded-full bg-war-accent animate-ping opacity-40" />
              <span className="relative w-1.5 h-1.5 rounded-full bg-war-accent" />
            </div>
            <span className="font-mono text-[10px] text-war-text uppercase tracking-[0.2em] font-medium">
              Live Intelligence Engine
            </span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-syne font-bold text-war-text leading-[1.1] tracking-tight">
            Story Arc
            <span className="text-war-accent relative inline-block">
              <span className="relative z-10 px-2 drop-shadow-[0_0_15px_rgba(0,255,136,0.3)]">Tracker</span>
            </span>
          </h1>
          <p className="font-mono text-sm text-war-muted max-w-2xl mx-auto leading-loose">
            Paste any news article URL to extract real-time intelligence. 
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
              className="bg-war-accent text-war-bg font-syne font-bold px-8 py-4 rounded-xl hover:bg-war-accent/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 whitespace-nowrap text-sm relative z-10 overflow-hidden group shadow-[0_0_20px_rgba(0,255,136,0.1)] hover:shadow-[0_0_30px_rgba(0,255,136,0.25)]"
            >
              <div className="absolute inset-0 w-[200%] h-full bg-white/20 -translate-x-[150%] group-hover:translate-x-[50%] transition-transform duration-[800ms] ease-in-out skew-x-12" />
              <span className="relative z-20 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-war-bg border-t-transparent animate-spin" />
                    Extracting...
                  </>
                ) : 'Extract Intelligence →'}
              </span>
            </button>
          </div>

          {/* Supported sites toggle */}
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={() => setShowSites(!showSites)}
              className="font-mono text-[10px] text-war-muted hover:text-war-accent transition-colors"
            >
              {showSites ? '▾' : '▸'} Supported sites
            </button>
            {EXAMPLE_URLS.map((ex) => (
              <button
                key={ex.label}
                onClick={() => setUrl(ex.url)}
                className="font-mono text-[10px] text-war-muted border border-war-border px-2 py-1 rounded-full hover:border-war-accent/50 hover:text-war-accent transition-all"
              >
                {ex.label} ↗
              </button>
            ))}
          </div>

          <AnimatePresence>
            {showSites && (
              <motion.div
                key="sites"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-war-surface border border-war-border rounded-xl p-4">
                  <p className="font-mono text-[9px] text-war-muted uppercase tracking-widest mb-3">
                    Works well with
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SUPPORTED_SITES.map((site) => (
                      <span
                        key={site}
                        className="font-mono text-[10px] bg-war-card border border-war-border rounded-full px-3 py-1 text-war-muted"
                      >
                        {site}
                      </span>
                    ))}
                  </div>
                  <p className="font-mono text-[9px] text-war-muted mt-3">
                    Note: Sites with JS-only rendering or hard paywalls may not extract content.
                    Use the full direct article URL, not homepage URLs.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
                    <p className="font-mono text-[9px] text-war-muted uppercase tracking-widest">
                      Intelligence Report
                    </p>
                    <h2 className="font-syne text-xl font-bold text-war-text leading-snug">
                      {result.headline}
                    </h2>
                    <p className="font-mono text-xs text-war-muted leading-relaxed max-w-2xl">
                      {result.summary}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <a
                      href={result.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[10px] text-war-accent border border-war-accent/30 px-3 py-1.5 rounded-lg hover:bg-war-accent/10 transition-colors"
                    >
                      View Source ↗
                    </a>
                    <span className="font-mono text-[9px] text-war-muted">
                      {new Date(result.scrapedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <MetricsRow data={result} />

              {/* Sentiment Pulse */}
              <div className="bg-war-card border border-war-border rounded-xl p-5 hover:border-war-accent/30 transition-all duration-300 shadow-lg group">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-mono text-[9px] text-war-muted uppercase tracking-widest mb-1 group-hover:text-war-accent transition-colors">
                      Sentiment Pulse
                    </p>
                    <p className="font-syne text-sm text-war-text">
                      Narrative Arc Visualisation
                    </p>
                  </div>
                  <div className="font-mono text-[10px] text-war-muted text-right opacity-50 group-hover:opacity-100 transition-opacity">
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
                <div className="bg-war-card border border-war-border rounded-xl p-5 h-full group hover:border-war-accent/30 transition-all duration-300">
                  <p className="font-mono text-[9px] text-war-muted uppercase tracking-widest mb-1 group-hover:text-war-accent transition-colors">
                    Narrative Scroll
                  </p>
                  <p className="font-syne text-sm text-war-text mb-4">Chronological Timeline</p>
                  <Timeline events={result.events} highlightedIndex={highlightedEvent} />
                </div>

                <div className="bg-war-card border border-war-border rounded-xl p-5 h-full group hover:border-war-accent/30 transition-all duration-300">
                  <p className="font-mono text-[9px] text-war-muted uppercase tracking-widest mb-1 group-hover:text-war-accent transition-colors">
                    Entity Connection Web
                  </p>
                  <p className="font-syne text-sm text-war-text mb-4">Key Players & Relationships</p>
                  <EntityWeb entities={result.entities} mermaidDiagram={result.mermaidDiagram} />
                </div>
              </div>

              {/* Deep Analysis Panels */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Contrarian viewpoints */}
                <div className="border-l-2 border-war-blue bg-war-card rounded-r-xl p-5 shadow-lg group hover:bg-war-surface transition-colors">
                  <div className="w-full flex items-center justify-between">
                    <div>
                      <p className="font-mono text-[9px] text-war-muted uppercase tracking-widest mb-1 group-hover:text-war-blue transition-colors">
                        Devil's Advocate Protocol
                      </p>
                      <p className="font-syne text-sm text-war-blue font-medium">
                        Contrarian & Alternative Perspectives
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
                        <span className="font-mono text-xs text-war-blue mt-0.5 opacity-80">
                          {['Bear', 'Bull', 'Alt'][i % 3]}
                        </span>
                        <p className="font-mono text-[11px] text-war-muted leading-relaxed">{vp}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Horizon Radar */}
                <div className="border-l-2 border-war-accent bg-war-card rounded-r-xl p-5 shadow-lg group hover:bg-war-surface transition-colors">
                  <div className="w-full flex items-center justify-between">
                    <div>
                      <p className="font-mono text-[9px] text-war-muted uppercase tracking-widest mb-1 group-hover:text-war-accent transition-colors">
                        Horizon Radar
                      </p>
                      <p className="font-syne text-sm text-war-accent font-medium">
                        What To Watch Next (Predictions)
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
                             <span className={`font-mono text-[9px] uppercase px-1.5 py-0.5 rounded border ${PCol}`}>{pred.probability} Prob</span>
                             <span className="font-mono text-[9px] text-war-muted tracking-widest uppercase">{pred.timeframe}</span>
                          </div>
                          <p className="font-syne text-[12px] text-war-text leading-snug">{pred.implication}</p>
                        </motion.div>
                      );
                    }) : (
                      <p className="font-mono text-xs text-war-muted">Predictions are only available for newly generated reports.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* New analysis CTA */}
              <div className="flex flex-wrap items-center justify-center gap-4 py-8 border-t border-war-border/50">
                <button
                  onClick={() => {
                    setResult(null);
                    setUrl('');
                    setError(null);
                    inputRef.current?.focus();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="font-mono text-xs text-war-muted border border-war-border px-5 py-2.5 rounded-xl hover:border-war-accent/50 hover:text-war-accent hover:bg-war-surface transition-all"
                >
                  ← New Investigation
                </button>
                
                <button
                  onClick={() => {
                    alert("Mock: In a production environment, this would split the screen and allow you to paste another URL to append its extracted entities and events to the current graph, building a multi-month Story Arc.");
                  }}
                  className="font-mono text-xs text-war-bg bg-war-text px-5 py-2.5 rounded-xl hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-2"
                >
                  ➕ Add Source to Arc
                </button>

                <button
                  onClick={() => window.print()}
                  className="font-mono text-xs text-war-accent border border-war-accent/30 bg-war-accent/10 px-5 py-2.5 rounded-xl hover:bg-war-accent/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  ⬇ Export Intel Briefing
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
