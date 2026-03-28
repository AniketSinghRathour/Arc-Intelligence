'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { motion } from 'framer-motion';
import { NewsEvent } from '@/lib/types';

interface Props {
  events: NewsEvent[];
  onEventHover?: (index: number | null) => void;
}

const TAG_COLORS: Record<string, string> = {
  bullish: '#00ff88',
  bearish: '#ff4d4d',
  critical: '#ff4d4d',
  controversial: '#ffb347',
  neutral: '#6b6b7a',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomDot(props: any) {
  const { cx, cy, payload } = props;
  const color = TAG_COLORS[payload.tag] || '#4d9fff';
  return (
    <circle
      cx={cx}
      cy={cy}
      r={6}
      fill={color}
      stroke="#0a0a0b"
      strokeWidth={2}
    />
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const d = payload[0].payload as NewsEvent & { sentiment: number };
    const color = TAG_COLORS[d.tag] || '#4d9fff';
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 5 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className="bg-war-surface/95 border border-war-border rounded-xl p-4 max-w-xs backdrop-blur-xl"
        style={{ boxShadow: `0 15px 35px -10px ${color}30`, borderColor: `${color}40` }}
      >
        <p className="font-mono text-[10px] text-war-muted mb-2 uppercase tracking-widest">{d.date}</p>
        <p className="font-syne text-[14px] text-white font-semibold mb-3 leading-snug drop-shadow-sm">{d.title}</p>
        <div className="flex items-center justify-between pt-3 border-t border-war-border/50">
          <span
            className="text-[10px] uppercase font-mono px-2.5 py-1 rounded-full font-bold shadow-sm"
            style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}
          >
            {d.tag}
          </span>
          <span className="text-[13px] font-mono font-bold drop-shadow-sm" style={{ color }}>
            {d.sentiment > 0 ? '+' : ''}{d.sentiment.toFixed(2)}
          </span>
        </div>
      </motion.div>
    );
  }
  return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderActiveDot = (props: any) => {
  const { cx, cy, payload } = props;
  const color = TAG_COLORS[payload.tag] || '#4d9fff';
  return (
    <g>
      <circle cx={cx} cy={cy} r={14} fill={color} opacity={0.2} className="animate-ping origin-center" style={{ transformOrigin: `${cx}px ${cy}px` }} />
      <circle cx={cx} cy={cy} r={7} fill="#18181c" stroke={color} strokeWidth={3} style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
    </g>
  );
};

export default function SentimentChart({ events, onEventHover }: Props) {
  const data = events.map((e) => ({
    ...e,
    sentiment: e.sentiment,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, bottom: 0, left: -10 }}
        onMouseMove={(state) => {
          if (state.activeTooltipIndex !== undefined) {
            onEventHover?.(state.activeTooltipIndex);
          }
        }}
        onMouseLeave={() => onEventHover?.(null)}
      >
        <defs>
          <linearGradient id="sentimentGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00ff88" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="sentimentGradientNeg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ff4d4d" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#ff4d4d" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e1e24" />
        <ReferenceLine y={0} stroke="#2a2a30" strokeWidth={1} />
        <XAxis
          dataKey="date"
          tick={{ fill: '#6b6b7a', fontSize: 10, fontFamily: 'JetBrains Mono' }}
          axisLine={{ stroke: '#2a2a30' }}
          tickLine={false}
        />
        <YAxis
          domain={[-1.1, 1.1]}
          ticks={[-1, -0.5, 0, 0.5, 1]}
          tick={{ fill: '#6b6b7a', fontSize: 10, fontFamily: 'JetBrains Mono' }}
          axisLine={{ stroke: '#2a2a30' }}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="sentiment"
          stroke="#00ff88"
          strokeWidth={2}
          fill="url(#sentimentGradient)"
          dot={<CustomDot />}
          activeDot={renderActiveDot}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
