'use client';

import { motion } from 'framer-motion';
import { AnalysisResult } from '@/lib/types';

interface Props {
  data: AnalysisResult;
}

const ARC_COLORS: Record<string, string> = {
  'Bullish Growth':    '#00ff88',
  'Crisis Spiral':     '#ff4d4d',
  'Cautious Recovery': '#ffb347',
  'Power Shift':       '#4d9fff',
  'Regulatory Storm':  '#ff4d4d',
  'Turnaround Play':   '#00ff88',
  'Stagnation':        '#6b6b7a',
};

export default function MetricsRow({ data }: Props) {
  const sentColor = data.avgSentiment >= 0.3 ? '#00ff88' : data.avgSentiment <= -0.3 ? '#ff4d4d' : '#ffb347';
  const arcColor = ARC_COLORS[data.arcType] || '#4d9fff';

  const metrics = [
    {
      label: 'Events Extracted',
      value: data.events.length.toString(),
      sub: 'chronological',
      color: '#4d9fff',
    },
    {
      label: 'Avg. Sentiment',
      value: `${data.avgSentiment > 0 ? '+' : ''}${data.avgSentiment.toFixed(2)}`,
      sub: data.avgSentiment >= 0.3 ? 'positive arc' : data.avgSentiment <= -0.3 ? 'negative arc' : 'neutral arc',
      color: sentColor,
    },
    {
      label: 'Key Entities',
      value: data.entities.length.toString(),
      sub: 'mapped & linked',
      color: '#ffb347',
    },
    {
      label: 'Arc Type',
      value: data.arcType,
      sub: 'AI classified',
      color: arcColor,
      small: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {metrics.map((m, i) => (
        <motion.div
          key={m.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07, duration: 0.35 }}
          whileHover={{ scale: 1.03, y: -4 }}
          className="bg-war-surface border border-war-border rounded-xl p-5 relative overflow-hidden group hover:border-transparent transition-all z-10 cursor-default"
          style={{ boxShadow: `0 4px 20px -10px rgba(0,0,0,0.5)` }}
        >
          {/* Animated background glow on hover */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-[0.08] transition-opacity duration-300 pointer-events-none" 
            style={{ backgroundColor: m.color }} 
          />
          {/* Glowing border replacement */}
          <div 
            className="absolute inset-0 border-[1.5px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" 
            style={{ borderColor: m.color, boxShadow: `inset 0 0 20px -10px ${m.color}` }} 
          />
          
          <div className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
            <p className="font-mono text-[10px] text-war-muted uppercase tracking-widest mb-2 flex justify-between items-center">
              {m.label}
              <span className="w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_8px_currentColor]" style={{ backgroundColor: m.color, color: m.color }} />
            </p>
            <p
              className={`font-syne font-bold leading-tight drop-shadow-md ${m.small ? 'text-lg lg:text-xl' : 'text-3xl'}`}
              style={{ color: m.color }}
            >
              {m.value}
            </p>
            <p className="font-mono text-[11px] text-war-muted mt-2 opacity-80 group-hover:opacity-100 transition-opacity">{m.sub}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
