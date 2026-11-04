import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'A' ||
          target.tagName === 'BUTTON' ||
          target.closest('a') ||
          target.closest('button') ||
          target.getAttribute('role') === 'button' ||
          target.classList.contains('cursor-pointer'))
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousemove', handleElementHover, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousemove', handleElementHover);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  // Smooth lerp loop for the outer trailing glow ring
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let animId: number;
    const lerp = () => {
      setTrailingPos((prev) => {
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        return {
          x: prev.x + dx * 0.18,
          y: prev.y + dy * 0.18,
        };
      });
      animId = requestAnimationFrame(lerp);
    };

    animId = requestAnimationFrame(lerp);
    return () => cancelAnimationFrame(animId);
  }, [position]);

  if (!isVisible) return null;

  return (
    <>
      {/* Inner precise dot */}
      <div
        className="pointer-events-none fixed z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400 transition-transform duration-75"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: isHovered ? '8px' : '6px',
          height: isHovered ? '8px' : '6px',
          boxShadow: '0 0 10px #00f2fe',
        }}
      />
      {/* Outer fluid trailing glow circle */}
      <div
        className="pointer-events-none fixed z-[9998] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/40 bg-cyan-400/10 backdrop-blur-[1px] transition-all duration-150 ease-out"
        style={{
          left: `${trailingPos.x}px`,
          top: `${trailingPos.y}px`,
          width: isHovered ? '48px' : '32px',
          height: isHovered ? '48px' : '32px',
          boxShadow: isHovered ? '0 0 24px rgba(0, 242, 254, 0.45)' : '0 0 12px rgba(0, 242, 254, 0.2)',
        }}
      />
    </>
  );
};
