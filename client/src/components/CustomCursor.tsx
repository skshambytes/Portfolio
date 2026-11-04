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

    const handlePointerMove = (e: PointerEvent | MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

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

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Using capture: true guarantees events are received even if children stop propagation
    window.addEventListener('pointermove', handlePointerMove, { capture: true, passive: true });
    window.addEventListener('mousemove', handlePointerMove, { capture: true, passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove, { capture: true });
      window.removeEventListener('mousemove', handlePointerMove, { capture: true });
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  // Smooth lerp loop for the outer trailing glow ring
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let animId: number;
    const lerp = () => {
      setTrailingPos((prev) => {
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        return {
          x: prev.x + dx * 0.22,
          y: prev.y + dy * 0.22,
        };
      });
      animId = requestAnimationFrame(lerp);
    };

    animId = requestAnimationFrame(lerp);
    return () => cancelAnimationFrame(animId);
  }, [position]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none select-none">
      {/* Inner precise dot */}
      <div
        className="pointer-events-none select-none fixed z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400 transition-transform duration-75"
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
        className="pointer-events-none select-none fixed z-[9998] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/40 bg-cyan-400/10 backdrop-blur-[1px] transition-all duration-150 ease-out"
        style={{
          left: `${trailingPos.x}px`,
          top: `${trailingPos.y}px`,
          width: isHovered ? '46px' : '30px',
          height: isHovered ? '46px' : '30px',
          boxShadow: isHovered ? '0 0 20px rgba(0, 242, 254, 0.4)' : '0 0 10px rgba(0, 242, 254, 0.15)',
        }}
      />
    </div>
  );
};
