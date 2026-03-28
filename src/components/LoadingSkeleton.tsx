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
    <div className="space-y-6 relative py-4 max-w-2xl mx-auto">
      <div className="border border-war-border bg-war-surface/50 rounded-2xl p-6 backdrop-blur-md overflow-hidden text-center h-48 flex flex-col items-center justify-center">
        {/* Simple elegant spinner */}
        <div className="w-8 h-8 rounded-full border-[3px] border-war-border border-t-war-accent animate-spin mb-6" />
        
        {/* Status */}
        <motion.p
          key={stepIndex}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-medium text-war-text mb-2"
        >
          {STEPS[stepIndex].label}
        </motion.p>
        
        {/* Progress bar */}
        <div className="w-64 h-1.5 bg-war-border rounded-full overflow-hidden shrink-0 mt-4">
          <motion.div
            className="h-full bg-war-accent rounded-full"
            initial={{ width: '5%' }}
            animate={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
}
