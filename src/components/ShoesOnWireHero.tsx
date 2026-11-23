import { useEffect, useRef, useState } from 'react';
import { RefreshCw } from './Icons';
import { PRODUCTS, PRODUCT_ALT_TEXT, PRODUCT_SWATCH_STYLES, formatINR } from '../data/sneakers';
import { HERO_MOOD_ORDER, MoodKey, MoodTheme } from '../data/moods';
import { buildImageSrcSet, isSaveDataEnabled, triggerHaptic } from '../utils/device';

interface ShoesOnWireHeroProps {
  activeMoodKey: MoodKey;
  onSelectMoodKey: (key: MoodKey) => void;
  mood: MoodTheme;
}

interface PendulumState {
  angle: number;
  velocity: number;
  dragging: boolean;
  startX: number;
  lastX: number;
  lastTime: number;
  totalMove: number;
  dragAngle: number;
}

const IDLE_SPEEDS = [0.0014, 0.0018, 0.0013, 0.0021];
const IDLE_PHASES = [0.2, 1.9, 3.4, 5.1];
const BASE_TILTS = [-2.5, 2.2, -1.8, 2.8];

function getWireSagPx(xPct: number, maxSagPx = 24): number {
  const t = Math.max(0, Math.min(1, xPct / 100));
  return 4 * t * (1 - t) * maxSagPx;
}

export function ShoesOnWireHero({
  activeMoodKey,
  onSelectMoodKey,
  mood,
}: ShoesOnWireHeroProps) {
  const heroShoes = HERO_MOOD_ORDER.map((id) => PRODUCTS.find((p) => p.id === id)!).filter(
    Boolean
  );

  const [disableMotion, setDisableMotion] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const stageRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tagRef = useRef<HTMLDivElement | null>(null);
  const pendulums = useRef<PendulumState[]>(
    HERO_MOOD_ORDER.map((_, idx) => ({
      angle: BASE_TILTS[idx],
      velocity: 0,
      dragging: false,
      startX: 0,
      lastX: 0,
      lastTime: 0,
      totalMove: 0,
      dragAngle: 0,
    }))
  );

  const activeIndex = Math.max(0, HERO_MOOD_ORDER.indexOf(activeMoodKey));
  const activeShoe = heroShoes[activeIndex] ?? heroShoes[0];
  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setDisableMotion(mq.matches || isSaveDataEnabled());
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Pause rAF loop when off-screen or when tab is hidden
  useEffect(() => {
    const el = stageRef.current;
    let inViewport = true;
    let tabVisible = document.visibilityState === 'visible';

    const sync = () => setIsVisible(inViewport && tabVisible);

    const observer =
      el && typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            (entries) => {
              inViewport = entries[0]?.isIntersecting ?? true;
              sync();
            },
            { threshold: 0.05 }
          )
        : null;

    if (el && observer) {
      observer.observe(el);
    }

    const onVisChange = () => {
      tabVisible = document.visibilityState === 'visible';
      sync();
    };
    document.addEventListener('visibilitychange', onVisChange);

    return () => {
      observer?.disconnect();
      document.removeEventListener('visibilitychange', onVisChange);
    };
  }, [disableMotion]);

  // Damped requestAnimationFrame spring (only runs while visible and motion allowed)
  useEffect(() => {
    if (disableMotion) {
      cardRefs.current.forEach((el) => {
        if (el) el.style.transform = 'rotate(0deg)';
      });
      if (tagRef.current) tagRef.current.style.transform = 'rotate(0deg)';
      return;
    }

    if (!isVisible) return;

    let rafId = 0;
    let prev = performance.now();

    const step = (now: number) => {
      const dt = Math.min(0.032, (now - prev) / 1000);
      prev = now;

      const stiffness = 36;
      const damping = 4.2;

      pendulums.current.forEach((p, i) => {
        const el = cardRefs.current[i];
        if (!el) return;

        if (p.dragging) {
          el.style.transform = `rotate(${p.dragAngle.toFixed(2)}deg)`;
          return;
        }

        const idleTarget =
          BASE_TILTS[i] + Math.sin(now * IDLE_SPEEDS[i] + IDLE_PHASES[i]) * 2.4;
        const displacement = p.angle - idleTarget;
        const accel = -stiffness * displacement - damping * p.velocity;
        p.velocity += accel * dt;
        p.angle += p.velocity * dt;

        if (p.angle > 28) p.angle = 28;
        if (p.angle < -28) p.angle = -28;

        el.style.transform = `rotate(${p.angle.toFixed(2)}deg)`;
      });

      if (tagRef.current) {
        const activeP = pendulums.current[activeIndexRef.current];
        const tagAngle =
          (activeP ? (activeP.dragging ? activeP.dragAngle : activeP.angle) * 0.65 : 0) +
          Math.sin(now * 0.0024 + 0.8) * 2.6;
        tagRef.current.style.transform = `rotate(${tagAngle.toFixed(2)}deg)`;
      }

      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [disableMotion, isVisible]);

  const handlePointerDown = (index: number, e: React.PointerEvent<HTMLDivElement>) => {
    if (disableMotion) return;
    const p = pendulums.current[index];
    p.dragging = true;
    p.startX = e.clientX;
    p.lastX = e.clientX;
    p.lastTime = performance.now();
    p.totalMove = 0;
    p.dragAngle = p.angle;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (index: number, e: React.PointerEvent<HTMLDivElement>) => {
    const p = pendulums.current[index];
    if (!p.dragging) return;
    const now = performance.now();
    const dx = e.clientX - p.lastX;
    const dt = Math.max(0.008, (now - p.lastTime) / 1000);
    p.totalMove += Math.abs(dx);

    const deltaFromStart = e.clientX - p.startX;
    p.dragAngle = Math.max(-26, Math.min(26, BASE_TILTS[index] - deltaFromStart * 0.22));
    p.velocity = Math.max(-140, Math.min(140, (-dx / dt) * 0.16));
    p.lastX = e.clientX;
    p.lastTime = now;
  };

  const handlePointerUp = (index: number, id: MoodKey) => {
    const p = pendulums.current[index];
    if (!p.dragging) return;
    p.angle = p.dragAngle;
    p.dragging = false;
    if (p.totalMove < 7) {
      p.velocity += index % 2 === 0 ? 32 : -32;
      triggerHaptic(8);
      onSelectMoodKey(id);
    }
  };

  const handleNextPair = () => {
    const nextIdx = (activeIndex + 1) % HERO_MOOD_ORDER.length;
    const p = pendulums.current[nextIdx];
    if (p && !disableMotion) {
      p.velocity += 34;
    }
    triggerHaptic(10);
    onSelectMoodKey(HERO_MOOD_ORDER[nextIdx]);
  };

  const inactiveSlots = [13, 30, 87];
  let inactiveCursor = 0;
  const xPositions = heroShoes.map((_, i) => {
    if (i === activeIndex) return 50;
    const slot = inactiveSlots[inactiveCursor] ?? 87;
    inactiveCursor += 1;
    return slot;
  });

  return (
    <div ref={stageRef} className="relative select-none">
      {disableMotion ? (
        <div
          className="rounded-3xl border-2 p-4 sm:p-6 mood-transition"
          style={{
            borderColor: mood.border,
            backgroundColor: mood.surface,
          }}
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {heroShoes.map((shoe) => {
              const isActive = shoe.id === activeShoe.id;
              const swatch = PRODUCT_SWATCH_STYLES[shoe.id];
              return (
                <button
                  key={shoe.id}
                  type="button"
                  onClick={() => {
                    triggerHaptic(8);
                    onSelectMoodKey(shoe.id as MoodKey);
                  }}
                  aria-pressed={isActive}
                  className="flex min-h-[48px] flex-col rounded-2xl border-2 p-2 text-left transition-transform focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{
                    borderColor: isActive ? mood.accent : mood.border,
                    backgroundColor: '#FFFFFF',
                    color: '#141414',
                    boxShadow: isActive ? `4px 4px 0px ${mood.accent}` : '2px 2px 0px #141414',
                  }}
                >
                  <div className="aspect-square w-full overflow-hidden rounded-xl bg-[#FFFFFF]">
                    {imgErrors[shoe.id] ? (
                      <div
                        className="flex h-full w-full items-end p-2 text-sm font-bold"
                        style={{ backgroundColor: swatch.bg, color: swatch.fg }}
                      >
                        {shoe.model}
                      </div>
                    ) : (
                      <img
                        src={shoe.img}
                        srcSet={buildImageSrcSet(shoe.img)}
                        sizes="(max-width: 639px) 42vw, 150px"
                        alt={PRODUCT_ALT_TEXT[shoe.id]}
                        width={800}
                        height={800}
                        loading={shoe.id === 'xl-cortado' ? 'eager' : 'lazy'}
                        decoding="async"
                        fetchPriority={shoe.id === 'xl-cortado' ? 'high' : 'auto'}
                        referrerPolicy="no-referrer"
                        onError={() => setImgErrors((prev) => ({ ...prev, [shoe.id]: true }))}
                        className="h-full w-full object-cover mix-blend-multiply"
                      />
                    )}
                  </div>
                  <span className="mt-2 text-sm font-bold">
                    {shoe.family} {shoe.model}
                  </span>
                  <span className="text-sm font-semibold tabular-nums">
                    {formatINR(shoe.price)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div
          className="relative h-[308px] w-full overflow-hidden rounded-3xl border-2 sm:h-[350px] mood-transition"
          style={{
            borderColor: mood.border,
            backgroundColor: mood.isDark ? '#1B1E24' : 'rgba(255, 255, 255, 0.55)',
            boxShadow: `6px 6px 0px ${mood.border}`,
          }}
        >
          <svg
            viewBox="0 0 1000 72"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-x-0 top-3 h-14 w-full"
            aria-hidden="true"
          >
            <rect x="6" y="4" width="14" height="22" rx="3" fill={mood.ink} />
            <circle cx="13" cy="15" r="4" fill={mood.accent} />
            <rect x="980" y="4" width="14" height="22" rx="3" fill={mood.ink} />
            <circle cx="987" cy="15" r="4" fill={mood.accent} />
            <path
              d="M 14 15 Q 500 56 986 15"
              fill="none"
              stroke={mood.ink}
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>

          {heroShoes.map((shoe, idx) => {
            const isActive = idx === activeIndex;
            const xPct = xPositions[idx];
            const wireSag = getWireSagPx(xPct, 22);
            const swatch = PRODUCT_SWATCH_STYLES[shoe.id];

            return (
              <div
                key={shoe.id}
                className="absolute top-6 transition-[left,top,z-index] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  left: `${xPct}%`,
                  top: `${Math.round(14 + wireSag + (isActive ? 10 : 0))}px`,
                  transform: 'translateX(-50%)',
                  zIndex: isActive ? 25 : 10 + idx,
                }}
              >
                <div
                  ref={(el) => {
                    cardRefs.current[idx] = el;
                  }}
                  onPointerDown={(e) => handlePointerDown(idx, e)}
                  onPointerMove={(e) => handlePointerMove(idx, e)}
                  onPointerUp={() => handlePointerUp(idx, shoe.id as MoodKey)}
                  onPointerCancel={() => handlePointerUp(idx, shoe.id as MoodKey)}
                  style={{ transformOrigin: '50% 0%', touchAction: 'pan-y' }}
                  className="flex cursor-grab flex-col items-center active:cursor-grabbing"
                >
                  <div className="flex flex-col items-center" aria-hidden="true">
                    <div
                      className="h-4 w-2.5 rounded-sm border border-[#141414]"
                      style={{ backgroundColor: isActive ? mood.accent : mood.pop }}
                    />
                    <div
                      className="w-0.5"
                      style={{
                        height: isActive ? '16px' : '12px',
                        backgroundColor: mood.ink,
                      }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (pendulums.current[idx].totalMove < 7) {
                        triggerHaptic(8);
                        onSelectMoodKey(shoe.id as MoodKey);
                      }
                    }}
                    aria-pressed={isActive}
                    aria-label={`Select ${shoe.family} ${shoe.model}, ${formatINR(shoe.price)}`}
                    className={`group relative flex flex-col rounded-[20px] border-2 border-[#141414] bg-[#FFFFFF] p-1.5 text-left transition-transform duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414] ${
                      isActive
                        ? 'w-[132px] sm:w-[164px] shadow-[5px_6px_0px_#141414]'
                        : 'w-[76px] sm:w-[120px] opacity-95 shadow-[3px_3px_0px_#141414] hover:opacity-100'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -top-2 left-1/2 h-3.5 w-9 -translate-x-1/2 -rotate-2 border border-[#141414]/30"
                      style={{ backgroundColor: '#FFD166', opacity: 0.9 }}
                    />

                    <div className="aspect-square w-full overflow-hidden rounded-[14px] bg-[#FFFFFF]">
                      {imgErrors[shoe.id] ? (
                        <div
                          className="flex h-full w-full flex-col justify-end p-2"
                          style={{ backgroundColor: swatch.bg, color: swatch.fg }}
                        >
                          <span className="text-sm font-bold leading-tight">
                            {shoe.model}
                          </span>
                        </div>
                      ) : (
                        <img
                          src={shoe.img}
                          srcSet={buildImageSrcSet(shoe.img)}
                          sizes={isActive ? '(max-width: 639px) 132px, 162px' : '(max-width: 639px) 76px, 120px'}
                          alt={PRODUCT_ALT_TEXT[shoe.id]}
                          width={800}
                          height={800}
                          loading={shoe.id === 'xl-cortado' ? 'eager' : 'lazy'}
                          fetchPriority={shoe.id === 'xl-cortado' ? 'high' : 'auto'}
                          decoding="async"
                          referrerPolicy="no-referrer"
                          draggable={false}
                          onError={() =>
                            setImgErrors((prev) => ({ ...prev, [shoe.id]: true }))
                          }
                          className="h-full w-full object-cover object-center mix-blend-multiply pointer-events-none"
                        />
                      )}
                    </div>

                    <div className="px-1 pt-1.5 pb-0.5 text-[#141414]">
                      <p className="font-display text-sm font-bold leading-tight tracking-tight truncate">
                        {shoe.model}
                      </p>
                    </div>
                  </button>

                  {isActive && (
                    <div
                      ref={tagRef}
                      style={{ transformOrigin: '50% 0%' }}
                      className="flex flex-col items-center"
                      aria-hidden="true"
                    >
                      <div className="h-3.5 w-0.5" style={{ backgroundColor: mood.ink }} />
                      <div
                        className="relative flex items-center gap-1.5 rounded-lg border-2 border-[#141414] px-3 py-1 shadow-[3px_3px_0px_#141414]"
                        style={{ backgroundColor: mood.accent, color: mood.accentInk }}
                      >
                        <span className="h-2 w-2 rounded-full border border-[#141414] bg-[#FFFFFF]" />
                        <span className="font-display text-sm font-extrabold tracking-tight tabular-nums sm:text-base">
                          {formatINR(shoe.price)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <span
          aria-hidden="true"
          className="inline-block -rotate-1 rounded-lg border-2 px-3 py-1.5 text-sm font-bold tracking-wide sticker-badge"
          style={{
            borderColor: mood.border,
            backgroundColor: mood.pop,
            color: mood.popInk,
          }}
        >
          drag me, tap one
        </span>

        <button
          type="button"
          onClick={handleNextPair}
          className="inline-flex min-h-[48px] items-center gap-2 rounded-xl border-2 px-4 py-2 text-sm font-bold transition-transform hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{
            borderColor: mood.border,
            backgroundColor: mood.accent,
            color: mood.accentInk,
            boxShadow: `3px 3px 0px ${mood.border}`,
          }}
        >
          <RefreshCw className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Next pair</span>
        </button>
      </div>
    </div>
  );
}
