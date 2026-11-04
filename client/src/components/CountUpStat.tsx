import React, { useEffect, useState, useRef } from 'react';
import { useInView } from 'framer-motion';

interface CountUpStatProps {
  endValue: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  label: string;
  description?: string;
}

export const CountUpStat: React.FC<CountUpStatProps> = ({
  endValue,
  prefix = '',
  suffix = '',
  duration = 2000,
  label,
  description,
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    let animId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeProgress * endValue));

      if (progress < 1) {
        animId = requestAnimationFrame(animate);
      } else {
        setCount(endValue);
      }
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [isInView, endValue, duration]);

  return (
    <div
      ref={ref}
      className="glass-card relative flex flex-col items-center justify-center p-6 rounded-2xl border border-slate-200/80 dark:border-white/5 bg-white/70 dark:bg-slate-900/40 text-center overflow-hidden shadow-sm dark:shadow-none"
    >
      {/* Background glow accent */}
      <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none" />

      <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-sky-500 to-blue-600 dark:from-cyan-400 dark:via-sky-300 dark:to-blue-500 font-mono tracking-tight">
        {prefix}
        {count.toLocaleString()}
        {suffix}
      </div>

      <div className="mt-2 text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200 tracking-wide">
        {label}
      </div>

      {description && (
        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-[200px]">
          {description}
        </div>
      )}
    </div>
  );
};
