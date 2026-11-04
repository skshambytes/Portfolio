import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export const ProfileTiltCard: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Framer motion coordinates for smooth tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 200, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), springConfig);

  // Reflection gloss coordinates
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Normalized from -0.5 to 0.5
    const normX = mouseX / rect.width - 0.5;
    const normY = mouseY / rect.height - 0.5;

    x.set(normX);
    y.set(normY);

    setGlarePos({
      x: (mouseX / rect.width) * 100,
      y: (mouseY / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <motion.div
      className="relative flex items-center justify-center p-4 [perspective:1000px]"
      animate={{ y: [0, -8, 0] }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative group w-64 sm:w-72 md:w-80 rounded-2xl p-3 bg-gradient-to-b from-slate-800/90 to-slate-900/95 border border-cyan-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.6)] cursor-pointer overflow-hidden transition-shadow duration-300 hover:shadow-[0_25px_60px_rgba(0,242,254,0.25)]"
      >
        {/* Dynamic moving glare reflection */}
        <div
          className="pointer-events-none absolute inset-0 z-20 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(0, 242, 254, 0.22) 0%, transparent 65%)`,
          }}
        />

        {/* Ambient border glow */}
        <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-600/20 blur opacity-60 group-hover:opacity-100 transition duration-500" />

        {/* Inner Card Content */}
        <div className="relative z-10 overflow-hidden rounded-xl bg-slate-950/80">
          <div className="relative aspect-[4/5] overflow-hidden">
            <img
              src="/profile.jpg"
              alt="Saksham Raj - Data Analyst and Business Intelligence specialist"
              className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              loading="eager"
            />
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
          </div>

          {/* Bottom Card Ribbon */}
          <div className="p-4 bg-slate-900/90 border-t border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-100 text-lg tracking-wide">Saksham Raj</h3>
                <p className="text-xs text-cyan-400 font-mono">Data Analyst | BI</p>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-[10px] text-cyan-300 font-medium">Available</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
