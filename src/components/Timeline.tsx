'use client';

import { motion } from 'framer-motion';
import { NewsEvent } from '@/lib/types';

interface Props {
  events: NewsEvent[];
  highlightedIndex: number | null;
  onEventHover?: (index: number | null) => void;
}

const TAG_COLORS: Record<string, { bg: string; text: string; dot: string; glow: string }> = {
  bullish:       { bg: 'rgba(16, 185, 129, 0.1)',   text: '#10b981', dot: '#10b981', glow: 'rgba(16, 185, 129, 0.15)' },
  bearish:       { bg: 'rgba(244, 63, 94, 0.1)',    text: '#f43f5e', dot: '#f43f5e', glow: 'rgba(244, 63, 94, 0.15)' },
  critical:      { bg: 'rgba(244, 63, 94, 0.1)',    text: '#f43f5e', dot: '#f43f5e', glow: 'rgba(244, 63, 94, 0.15)' },
  controversial: { bg: 'rgba(245, 158, 11, 0.1)',   text: '#f59e0b', dot: '#f59e0b', glow: 'rgba(245, 158, 11, 0.15)' },
  neutral:       { bg: 'rgba(107, 114, 128, 0.1)',  text: '#6b7280', dot: '#6b7280', glow: 'rgba(107, 114, 128, 0.15)' },
};

export default function Timeline({ events, highlightedIndex, onEventHover }: Props) {
  return (
    <div className="relative pt-4 pb-6 px-2">
      {/* Vertical tracking line with energy pulse */}
      <div className="absolute left-[23px] top-8 bottom-6 w-[2px] overflow-hidden rounded-full z-0">
        <motion.div 
          initial={{ height: 0 }}
          animate={{ height: '100%' }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{ transformOrigin: 'top' }}
          className="w-full h-full bg-gradient-to-b from-war-border via-war-border/50 to-transparent absolute inset-0" 
        />
        {/* Dynamic Highlight Fill */}
        <motion.div
          initial={{ opacity: 0, height: '0%' }}
          animate={{ 
            opacity: highlightedIndex !== null ? 1 : 0,
            height: highlightedIndex !== null 
                   ? `calc(${(highlightedIndex / Math.max(events.length - 1, 1)) * 100}% + 32px)` 
                   : '0%'
          }}
          transition={{ type: "spring", stiffness: 150, damping: 20 }}
          className="absolute left-0 top-0 w-full bg-gradient-to-b from-transparent via-war-accent/50 to-war-accent opacity-80 shadow-[0_4px_12px_var(--color-accent)] blur-[1px] rounded-full"
        />
      </div>

      <div className="space-y-8">
        {events.map((event, i) => {
          const colors = TAG_COLORS[event.tag.toLowerCase()] || TAG_COLORS.neutral;
          const isHighlighted = highlightedIndex === i;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, type: 'spring', stiffness: 200, damping: 20 }}
              className="flex gap-5 relative group"
              onMouseEnter={() => onEventHover?.(i)}
              onMouseLeave={() => onEventHover?.(null)}
            >
              {/* Dot column */}
              <div className="w-8 flex-shrink-0 flex justify-center mt-5 relative z-10 h-max">
                <div className="relative flex justify-center items-center h-4 w-4">
                  {isHighlighted && (
                    <motion.div
                      layoutId="active-dot-glow"
                      className="absolute inset-0 rounded-full blur-[8px]"
                      style={{ background: colors.dot }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  {isHighlighted && (
                    <span 
                      className="absolute w-5 h-5 rounded-full animate-ping opacity-40" 
                      style={{ background: colors.dot }} 
                    />
                  )}
                  <div
                    className="w-3.5 h-3.5 rounded-full transition-all duration-300 relative z-10"
                    style={{
                      background: isHighlighted ? colors.dot : 'var(--color-border)',
                      boxShadow: isHighlighted ? `0 0 10px ${colors.dot}` : 'none',
                      border: isHighlighted ? 'none' : '2px solid var(--color-muted)'
                    }}
                  />
                </div>
              </div>

              {/* Content card */}
              <motion.div
                animate={{
                  scale: isHighlighted ? 1.02 : 1,
                  y: isHighlighted ? -2 : 0,
                  boxShadow: isHighlighted ? `0 10px 30px -10px ${colors.glow}` : '0 4px 20px -10px rgba(0,0,0,0.05)',
                }}
                whileHover={{
                  scale: 1.03,
                  y: -5,
                  boxShadow: `0 20px 40px -10px ${colors.glow}`,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`flex-1 rounded-2xl border p-5 overflow-hidden relative backdrop-blur-xl transition-colors cursor-pointer group/card ${
                  isHighlighted ? 'z-20 border-war-muted bg-war-surface' : 'z-10 border-war-border bg-war-card'
                }`}
                style={isHighlighted ? { borderColor: colors.dot } : {}}
              >
                {/* Subtle background glow when highlighted or hovered */}
                <div 
                  className={`absolute top-0 right-0 w-48 h-48 blur-[60px] rounded-full pointer-events-none transition-opacity duration-500 max-w-full ${isHighlighted ? 'opacity-30' : 'opacity-0'} group-hover/card:opacity-40`}
                  style={{ background: colors.dot }}
                />
                
                <div className="flex items-start justify-between gap-4 mb-3 relative z-10">
                  <div className="space-y-1 flex-1">
                    <span className="text-[11px] font-semibold text-war-muted uppercase tracking-wider">
                      {event.date}
                    </span>
                    <h3 className={`text-base font-bold leading-snug tracking-tight transition-colors duration-300 ${isHighlighted ? 'text-war-text dark:text-white' : 'text-war-text'}`}>
                      {event.title}
                    </h3>
                  </div>
                  <span
                    className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full flex-shrink-0 mt-0.5 shadow-sm"
                    style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.glow}` }}
                  >
                    {event.tag}
                  </span>
                </div>
                
                <p className={`text-sm leading-relaxed relative z-10 transition-colors duration-300 ${isHighlighted ? 'text-war-text/90' : 'text-war-muted'}`}>
                  {event.summary}
                </p>
                
                {/* Bi-directional Sentiment bar */}
                <div className="mt-5 pt-4 border-t border-war-border/30 flex items-center gap-4 relative z-10">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-war-muted/80 w-12">Impact</span>
                  <div className="flex-1 h-2 bg-war-surface border border-war-border/40 rounded-full overflow-hidden flex shadow-inner relative">
                    {/* Background reference lines */}
                    <div className="absolute inset-0 flex justify-between items-center px-1 pointer-events-none opacity-20">
                      <div className="w-0.5 h-1 bg-war-muted" />
                      <div className="w-0.5 h-1 bg-war-muted" />
                      <div className="w-0.5 h-1 bg-war-muted" />
                      <div className="w-0.5 h-1 bg-war-muted" />
                      <div className="w-0.5 h-1 bg-war-muted" />
                    </div>
                    {/* Left (Negative) Side */}
                    <div className="w-1/2 flex justify-end">
                      {event.sentiment < 0 && (
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.abs(event.sentiment) * 100}%` }}
                          transition={{ duration: 1, ease: 'easeOut', delay: i * 0.1 + 0.3 }}
                          className="h-full rounded-l-full bg-gradient-to-l from-red-500 to-red-600 shadow-sm"
                        />
                      )}
                    </div>
                    {/* Divider center marker */}
                    <div className="w-px h-full bg-war-muted/50 z-10" />
                    {/* Right (Positive) Side */}
                    <div className="w-1/2 flex justify-start">
                      {event.sentiment > 0 && (
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${event.sentiment * 100}%` }}
                          transition={{ duration: 1, ease: 'easeOut', delay: i * 0.1 + 0.3 }}
                          className="h-full rounded-r-full bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-sm"
                        />
                      )}
                    </div>
                  </div>
                  <span
                    className="text-[11px] font-bold w-10 text-right tabular-nums drop-shadow-sm"
                    style={{ color: event.sentiment >= 0 ? 'var(--color-blue)' : 'var(--color-red)' }}
                  >
                    {event.sentiment > 0 ? '+' : ''}{event.sentiment.toFixed(2)}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
