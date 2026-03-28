'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const STEPS = [
  { label: 'Fetching article...', duration: 1200 },
  { label: 'Stripping ads & trackers...', duration: 800 },
  { label: 'Sending to AI brain...', duration: 600 },
  { label: 'Extracting chronology...', duration: 2000 },
  { label: 'Computing sentiment arc...', duration: 1500 },
  { label: 'Mapping entity web...', duration: 1000 },
  { label: 'Generating relationship graph...', duration: 800 },
  { label: 'Finalising intelligence report...', duration: 600 },
];

export default function LoadingSkeleton() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    let current = 0;
    function advance() {
      current++;
      if (current < STEPS.length - 1) {
        setStepIndex(current);
        setTimeout(advance, STEPS[current].duration);
      }
    }
    const t = setTimeout(advance, STEPS[0].duration);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-8 relative py-4">
      {/* Cool global scanning laser effect over the whole skeleton */}
      <motion.div 
        className="absolute inset-0 z-50 pointer-events-none overflow-hidden rounded-3xl"
      >
        <motion.div
          animate={{ y: ['-10%', '110%'] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
          className="w-full h-32 bg-gradient-to-b from-transparent via-war-accent/5 to-war-accent/20 border-b border-war-accent/50 shadow-[0_4px_20px_rgba(0,255,136,0.3)] opacity-70"
        />
      </motion.div>

      <div className="relative border border-war-accent/20 bg-war-surface/30 rounded-2xl p-6 backdrop-blur-md overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.03)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)] pointer-events-none" />
        
        {/* Status */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-4 h-4">
               <span className="absolute w-full h-full border border-war-accent rounded-full animate-ping opacity-60" />
               <div className="w-1.5 h-1.5 rounded-full bg-war-accent shadow-[0_0_10px_#00ff88]" />
            </div>
            <motion.p
              key={stepIndex}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-mono text-sm tracking-widest uppercase text-war-accent font-semibold drop-shadow-[0_0_8px_rgba(0,255,136,0.8)]"
            >
              {STEPS[stepIndex].label}
            </motion.p>
          </div>
          <p className="font-mono text-[10px] text-war-accent/60 tabular-nums uppercase tracking-widest">
            {Math.round(((stepIndex + 1) / STEPS.length) * 100)}% Complete
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-war-bg/80 rounded-full overflow-hidden relative shadow-inner">
          <motion.div
            className="h-full bg-war-accent relative overflow-hidden"
            initial={{ width: '5%' }}
            animate={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-r from-transparent to-white/40 shadow-[0_0_10px_white]" />
          </motion.div>
        </div>
      </div>

      <div className="opacity-40 space-y-4">
        {/* Skeleton cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-war-surface border border-war-border rounded-xl p-4 shimmer h-24 relative overflow-hidden">
               <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-war-border to-transparent" />
            </div>
          ))}
        </div>

        <div className="bg-war-card border border-war-border rounded-xl p-5 shimmer h-56" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-war-card border border-war-border rounded-xl p-5 relative overflow-hidden h-96">
            <div className="absolute inset-0 shimmer" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 border-2 border-war-border border-t-war-accent/30 rounded-full animate-spin" />
              <div className="w-32 h-2 bg-war-border/30 rounded-full" />
              <div className="w-24 h-2 bg-war-border/30 rounded-full" />
            </div>
          </div>
          <div className="bg-war-card border border-war-border rounded-xl p-5 relative overflow-hidden h-96">
            <div className="absolute inset-0 shimmer" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 border-2 border-war-border border-b-war-accent/30 rounded-full animate-[spin_2s_linear_reverse_infinite]" />
              <div className="w-40 h-2 bg-war-border/30 rounded-full" />
              <div className="w-20 h-2 bg-war-border/30 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
