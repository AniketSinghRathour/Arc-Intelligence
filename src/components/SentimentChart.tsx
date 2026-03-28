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
  bullish: '#10b981',
  bearish: '#f43f5e',
  critical: '#f43f5e',
  controversial: '#f59e0b',
  neutral: '#6b7280',
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
        className="bg-war-surface/95 border border-war-border rounded-xl p-4 max-w-xs backdrop-blur-xl shadow-xl"
        style={{ borderColor: `${color}40` }}
      >
        <p className="text-[11px] font-semibold text-war-muted mb-2 uppercase tracking-wider">{d.date}</p>
        <p className="text-sm text-war-text font-bold mb-3 leading-snug">{d.title}</p>
        <div className="flex items-center justify-between pt-3 border-t border-war-border/50">
          <span
            className="text-[10px] uppercase px-2.5 py-1 rounded-full font-bold shadow-sm"
            style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}
          >
            {d.tag}
          </span>
          <span className="text-[13px] font-bold drop-shadow-sm" style={{ color }}>
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
      <circle cx={cx} cy={cy} r={14} fill={color} opacity={0.15} className="animate-pulse origin-center" style={{ transformOrigin: `${cx}px ${cy}px` }} />
      <circle cx={cx} cy={cy} r={7} fill="var(--color-surface)" stroke={color} strokeWidth={3} />
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
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="sentimentGradientNeg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <ReferenceLine y={0} stroke="var(--color-border)" strokeWidth={1} />
        <XAxis
          dataKey="date"
          tick={{ fill: 'var(--color-muted)', fontSize: 10, fontFamily: 'inherit' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[-1.1, 1.1]}
          ticks={[-1, -0.5, 0, 0.5, 1]}
          tick={{ fill: 'var(--color-muted)', fontSize: 10, fontFamily: 'inherit' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="sentiment"
          stroke="#10b981"
          strokeWidth={2}
          fill="url(#sentimentGradient)"
          dot={<CustomDot />}
          activeDot={renderActiveDot}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
