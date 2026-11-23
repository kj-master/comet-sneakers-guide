import { useEffect, useRef, useState } from 'react';

interface DesktopCursorBlobProps {
  color: string;
}

export function DesktopCursorBlob({ color }: DesktopCursorBlobProps) {
  const blobRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const pointerFine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const check = () => setEnabled(pointerFine.matches && !reduced.matches);
    check();
    pointerFine.addEventListener('change', check);
    reduced.addEventListener('change', check);
    return () => {
      pointerFine.removeEventListener('change', check);
      reduced.removeEventListener('change', check);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let isHovering = false;
    let visible = false;
    let rafId = 0;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      visible = true;
      const target = e.target as HTMLElement | null;
      isHovering = Boolean(target?.closest('a, button, input[type="range"]'));
    };

    const onLeave = () => {
      visible = false;
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.22;
      currentY += (targetY - currentY) * 0.22;

      if (blobRef.current) {
        const scale = isHovering ? 2.1 : 1;
        blobRef.current.style.opacity = visible ? '0.42' : '0';
        blobRef.current.style.transform = `translate3d(${currentX - 12}px, ${currentY - 12}px, 0) scale(${scale})`;
      }
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafId);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={blobRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-50 h-6 w-6 rounded-full border-2 border-[#141414] transition-[background-color,opacity] duration-200"
      style={{
        backgroundColor: color,
        opacity: 0,
        willChange: 'transform',
      }}
    />
  );
}
