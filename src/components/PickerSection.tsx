import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight } from './Icons';
import {
  PRODUCTS,
  Product,
  OccasionOption,
  StyleOption,
  formatINR,
  getWhyItFits,
} from '../data/sneakers';
import { MOODS, MoodTheme } from '../data/moods';
import { isReducedMotionPreferred, triggerHaptic } from '../utils/device';
import { ProductImage } from './ProductImage';

interface PickerSectionProps {
  budget: number;
  onBudgetChange: (next: number) => void;
  occasion: OccasionOption;
  onOccasionChange: (next: OccasionOption) => void;
  styleChoice: StyleOption;
  onStyleChoiceChange: (next: StyleOption) => void;
  heroMood: MoodTheme;
}

const OCCASIONS: OccasionOption[] = [
  'College lectures',
  'Cafe and weekend outings',
  'Long walking days and travel',
];

const STYLES: StyleOption[] = ['Neutral and clean', 'Colour pop'];

const CONFETTI_PIECES = [
  { tx: '-54px', ty: '-36px', rot: '-80deg', delay: '0ms' },
  { tx: '-28px', ty: '-52px', rot: '45deg', delay: '30ms' },
  { tx: '0px', ty: '-58px', rot: '-35deg', delay: '15ms' },
  { tx: '28px', ty: '-52px', rot: '75deg', delay: '40ms' },
  { tx: '54px', ty: '-34px', rot: '-65deg', delay: '20ms' },
  { tx: '-42px', ty: '-16px', rot: '110deg', delay: '50ms' },
  { tx: '44px', ty: '-18px', rot: '-110deg', delay: '35ms' },
  { tx: '-18px', ty: '-30px', rot: '95deg', delay: '25ms' },
  { tx: '18px', ty: '-32px', rot: '-90deg', delay: '45ms' },
];

interface MatchedItem {
  product: Product;
  overBy: number;
}

export function PickerSection({
  budget,
  onBudgetChange,
  occasion,
  onOccasionChange,
  styleChoice,
  onStyleChoiceChange,
  heroMood,
}: PickerSectionProps) {
  const sliderPct = Math.max(0, Math.min(100, ((budget - 4000) / (6500 - 4000)) * 100));

  const pickerAccentTheme: MoodTheme =
    styleChoice === 'Colour pop'
      ? MOODS['aeon-sourbomb']
      : heroMood.id === 'aeon-sourbomb'
        ? MOODS['xl-cortado']
        : heroMood;

  const [confettiKey, setConfettiKey] = useState(0);
  const prevHadResultsRef = useRef<boolean>(budget >= 4299);
  const prevStyleRef = useRef<StyleOption>(styleChoice);
  const prevOccasionRef = useRef<OccasionOption>(occasion);

  useEffect(() => {
    const hasResultsNow = budget >= 4299;
    const styleChanged = prevStyleRef.current !== styleChoice;
    const occasionChanged = prevOccasionRef.current !== occasion;
    const justAppeared = !prevHadResultsRef.current && hasResultsNow;

    if (
      hasResultsNow &&
      (justAppeared || styleChanged || occasionChanged) &&
      !isReducedMotionPreferred()
    ) {
      setConfettiKey((k) => k + 1);
    }

    prevHadResultsRef.current = hasResultsNow;
    prevStyleRef.current = styleChoice;
    prevOccasionRef.current = occasion;
  }, [budget, styleChoice, occasion]);

  const results = useMemo<MatchedItem[]>(() => {
    if (budget < 4299) {
      return [];
    }

    const chosenStyleKey = styleChoice === 'Neutral and clean' ? 'neutral' : 'colour';
    const otherStyleKey = chosenStyleKey === 'neutral' ? 'colour' : 'neutral';

    const sortCheapestWithOccasion = (list: Product[]) => {
      return [...list].sort((a, b) => {
        if (a.price !== b.price) return a.price - b.price;
        if (occasion === 'Cafe and weekend outings') {
          if (a.id === 'xl-cortado') return -1;
          if (b.id === 'xl-cortado') return 1;
        }
        return 0;
      });
    };

    const inBudgetChosen = sortCheapestWithOccasion(
      PRODUCTS.filter((p) => p.style === chosenStyleKey && p.price <= budget)
    );

    if (inBudgetChosen.length > 0) {
      return inBudgetChosen.slice(0, 3).map((product) => ({
        product,
        overBy: 0,
      }));
    }

    const allChosen = sortCheapestWithOccasion(
      PRODUCTS.filter((p) => p.style === chosenStyleKey)
    );
    const cheapestChosen = allChosen[0];

    const inBudgetOther = sortCheapestWithOccasion(
      PRODUCTS.filter((p) => p.style === otherStyleKey && p.price <= budget)
    );
    const bestOther = inBudgetOther[0];

    const combined: MatchedItem[] = [];
    if (bestOther) {
      combined.push({ product: bestOther, overBy: 0 });
    }
    if (cheapestChosen) {
      combined.push({
        product: cheapestChosen,
        overBy: Math.max(0, cheapestChosen.price - budget),
      });
    }

    return combined.sort((a, b) => a.product.price - b.product.price).slice(0, 3);
  }, [budget, occasion, styleChoice]);

  const handleSliderChange = (raw: string) => {
    const num = Number(raw);
    if (Number.isNaN(num)) return;
    const snapped = Math.min(6500, Math.max(4000, Math.round(num / 100) * 100));
    onBudgetChange(snapped);
  };

  const stepBudget = (delta: number) => {
    const base = budget === 4299 ? (delta > 0 ? 4300 : 4200) : budget + delta;
    const next = Math.min(6500, Math.max(4000, base));
    triggerHaptic(6);
    onBudgetChange(next);
  };

  return (
    <section id="picker" aria-labelledby="picker-heading" className="scroll-mt-20">
      <div className="mb-5 md:mb-7 flex flex-wrap items-baseline justify-between gap-2">
        <h2
          id="picker-heading"
          className="font-display text-3xl font-extrabold tracking-tight text-[#141414] md:text-4xl text-balance"
        >
          Find your Comet under ₹5,000
        </h2>
        <span className="text-sm font-bold text-[#3B3833] tabular-nums">
          {budget < 4299
            ? '0 matches under ₹4,299'
            : `${results.length} ${results.length === 1 ? 'match' : 'matches'} shown`}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start lg:gap-8">
        {/* Controls Deck */}
        <div
          className="space-y-6 rounded-[24px] border-2 border-[#141414] bg-[#14161A] p-4 text-[#F4FFE0] sm:p-6 lg:col-span-5 mood-transition"
          style={{ boxShadow: `6px 6px 0px ${pickerAccentTheme.accent}` }}
        >
          {/* Step 1: Budget — Large text above slider, 40px sneaker thumb, 48px hit area, −/+ step buttons */}
          <div>
            <h3 className="font-display text-base font-bold text-[#F4FFE0]">
              <label htmlFor="budget-slider">1. Your budget</label>
            </h3>

            <div className="mt-2 flex items-center justify-between gap-3">
              <output
                htmlFor="budget-slider"
                aria-live="polite"
                className="font-display inline-block rounded-xl border-2 border-[#141414] px-3.5 py-1 text-3xl font-extrabold tracking-tight tabular-nums sm:text-4xl mood-transition"
                style={{
                  backgroundColor: pickerAccentTheme.accent,
                  color: pickerAccentTheme.accentInk,
                }}
              >
                {formatINR(budget)}
              </output>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => stepBudget(-100)}
                  disabled={budget <= 4000}
                  aria-label="Decrease budget by 100 rupees"
                  className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-xl border-2 border-[#F4FFE0]/30 bg-[#22252C] px-3 text-base font-bold text-[#F4FFE0] transition-colors hover:border-[#F4FFE0] disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFFFFF]"
                >
                  −100
                </button>
                <button
                  type="button"
                  onClick={() => stepBudget(100)}
                  disabled={budget >= 6500}
                  aria-label="Increase budget by 100 rupees"
                  className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-xl border-2 border-[#F4FFE0]/30 bg-[#22252C] px-3 text-base font-bold text-[#F4FFE0] transition-colors hover:border-[#F4FFE0] disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFFFFF]"
                >
                  +100
                </button>
              </div>
            </div>

            <div className="relative mt-5">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-[19px] h-2.5 overflow-hidden rounded-full bg-[#2A2D35]"
              >
                <div
                  className="h-full rounded-full mood-transition"
                  style={{
                    width: `${sliderPct}%`,
                    backgroundColor: pickerAccentTheme.accent,
                  }}
                />
              </div>

              {/* Red dotted line marking ₹5,000 ceiling (40% across ₹4,000–₹6,500) */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-[6px] h-9 border-l-2 border-dotted border-[#FF4D4D]"
                style={{ left: '40%' }}
              >
                <span className="absolute -top-5 -translate-x-1/2 text-sm font-bold text-[#FF8585] tabular-nums whitespace-nowrap">
                  ₹5,000
                </span>
              </div>

              <input
                id="budget-slider"
                type="range"
                min={4000}
                max={6500}
                step={budget === 4299 ? 1 : 100}
                value={budget}
                onChange={(e) => handleSliderChange(e.target.value)}
                aria-valuemin={4000}
                aria-valuemax={6500}
                aria-valuenow={budget}
                aria-valuetext={formatINR(budget)}
                className="sneaker-range relative z-10"
              />

              {/* 40px (>=32px) Sneaker Icon Slider Thumb */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-1 z-20 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border-2 border-[#141414] shadow-[2px_2px_0px_#141414] mood-transition"
                style={{
                  left: `calc(${sliderPct}% + ${(50 - sliderPct) * 0.28}px)`,
                  backgroundColor: pickerAccentTheme.accent,
                  color: pickerAccentTheme.accentInk,
                }}
              >
                <svg viewBox="0 0 28 18" className="h-5 w-6" fill="none">
                  <path
                    d="M2 13.5C2 14.3 2.7 15 3.5 15H24.5C25.3 15 26 14.3 26 13.5V12C26 10.6 24.9 9.7 23.3 9.5L17.5 8.5L13.5 3.5C12.9 2.8 11.9 2.6 11.1 3L8.8 4.2C8.3 4.5 7.7 4.4 7.3 4L6.2 3C5.7 2.5 4.8 2.8 4.6 3.5L2.3 10.7C2.1 11.3 2 11.9 2 12.5V13.5Z"
                    fill="currentColor"
                    stroke="#141414"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <line x1="2.5" y1="12.5" x2="25.5" y2="12.5" stroke="#141414" strokeWidth="1.2" />
                </svg>
              </div>

              <div className="flex justify-between text-sm font-semibold text-[#C9D4BA] tabular-nums">
                <span>₹4,000</span>
                <span>₹6,500</span>
              </div>
            </div>
          </div>

          {/* Step 2: Occasion (full-width thumb chips, >=48px, 8px gap) */}
          <div className="border-t border-[#F4FFE0]/15 pt-4">
            <h3 className="font-display text-base font-bold text-[#F4FFE0]">
              2. Where you will wear them
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {OCCASIONS.map((item) => {
                const active = occasion === item;
                return (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      triggerHaptic(6);
                      onOccasionChange(item);
                    }}
                    className="min-h-[48px] w-full rounded-xl border-2 px-4 py-2.5 text-left text-base font-bold transition-transform active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFFFFF] mood-transition"
                    style={{
                      borderColor: active ? '#141414' : 'rgba(244, 255, 224, 0.25)',
                      backgroundColor: active ? pickerAccentTheme.pop : '#22252C',
                      color: active ? pickerAccentTheme.popInk : '#F4FFE0',
                    }}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Style (wrapping large chips, >=48px, 8px gap) */}
          <div className="border-t border-[#F4FFE0]/15 pt-4">
            <h3 className="font-display text-base font-bold text-[#F4FFE0]">3. Your style</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {STYLES.map((item) => {
                const active = styleChoice === item;
                return (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      triggerHaptic(6);
                      onStyleChoiceChange(item);
                    }}
                    className="min-h-[48px] flex-1 basis-[140px] rounded-xl border-2 px-3 py-2.5 text-center text-base font-bold transition-transform active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFFFFF] mood-transition"
                    style={{
                      borderColor: active ? '#141414' : 'rgba(244, 255, 224, 0.25)',
                      backgroundColor: active ? pickerAccentTheme.accent : '#22252C',
                      color: active ? pickerAccentTheme.accentInk : '#F4FFE0',
                    }}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live Result Region */}
        <div aria-live="polite" aria-atomic="false" className="relative lg:col-span-7">
          {confettiKey > 0 && budget >= 4299 && (
            <div
              key={confettiKey}
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-8 z-30"
            >
              {CONFETTI_PIECES.map((c, idx) => (
                <span
                  key={idx}
                  className="confetti-piece absolute block h-2.5 w-2.5 rounded-sm border border-[#141414]"
                  style={
                    {
                      backgroundColor:
                        idx % 2 === 0 ? pickerAccentTheme.accent : pickerAccentTheme.pop,
                      '--tx': c.tx,
                      '--ty': c.ty,
                      '--rot': c.rot,
                      animationDelay: c.delay,
                    } as React.CSSProperties
                  }
                />
              ))}
            </div>
          )}

          {budget < 4299 ? (
            <div
              key="honest-answer"
              className="animate-honest-shake rounded-[24px] border-2 border-[#141414] bg-[#EFEAE1] p-6 text-[#141414] shadow-[5px_5px_0px_#141414] sm:p-8"
            >
              <span
                className="sticker-badge inline-block -rotate-2 rounded-lg border-2 border-[#141414] px-3 py-0.5 text-sm font-extrabold"
                style={{
                  backgroundColor: pickerAccentTheme.pop,
                  color: pickerAccentTheme.popInk,
                }}
              >
                Honest answer
              </span>
              <p className="mt-3 text-lg font-semibold leading-relaxed text-[#141414]">
                Comet&apos;s lowest price on wearcomet.com is ₹4,299, so we are not the right pick
                under that.
              </p>
              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic(8);
                    onBudgetChange(4299);
                  }}
                  className="inline-flex min-h-[48px] items-center justify-center rounded-xl border-2 border-[#141414] px-5 py-2.5 text-base font-bold shadow-[3px_3px_0px_#141414] transition-transform hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414]"
                  style={{
                    backgroundColor: pickerAccentTheme.accent,
                    color: pickerAccentTheme.accentInk,
                  }}
                >
                  Try ₹4,299
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {results.map(({ product, overBy }, idx) => (
                  <article
                    key={`${product.id}-${styleChoice}-${occasion}`}
                    style={{ animationDelay: `${idx * 50}ms` }}
                    className="animate-card-pop flex flex-col justify-between overflow-hidden rounded-[24px] border-2 border-[#141414] bg-[#FFFFFF] text-[#141414] shadow-[4px_4px_0px_#141414] transition-transform duration-150 hover:-translate-y-1"
                  >
                    <div>
                      <ProductImage
                        product={product}
                        sizes="(max-width: 767px) 92vw, (max-width: 1279px) 42vw, 240px"
                      />
                      <div className="p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                          <span className="font-medium text-[#524E48]">{product.colour}</span>
                          <span
                            className="sticker-badge inline-block -rotate-2 rounded-lg border-2 border-[#141414] px-2.5 py-0.5 text-sm font-extrabold tabular-nums"
                            style={{
                              backgroundColor:
                                overBy === 0 ? pickerAccentTheme.accent : pickerAccentTheme.pop,
                              color:
                                overBy === 0
                                  ? pickerAccentTheme.accentInk
                                  : pickerAccentTheme.popInk,
                            }}
                          >
                            {overBy === 0
                              ? 'Under budget'
                              : `${formatINR(overBy)} over your budget`}
                          </span>
                        </div>

                        <p className="font-display mt-2 text-lg font-extrabold leading-snug text-[#141414]">
                          Comet sneakers {product.family} {product.model}
                        </p>

                        <p className="font-display mt-1 text-2xl font-extrabold tracking-tight text-[#141414] tabular-nums">
                          {formatINR(product.price)}
                        </p>

                        <p className="mt-2 text-base leading-relaxed text-[#3B3833]">
                          {getWhyItFits(product.family, occasion)}
                        </p>
                      </div>
                    </div>

                    <div className="px-4 pb-4 pt-1">
                      <a
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[48px] w-full items-center justify-center gap-1.5 rounded-xl border-2 border-[#141414] px-4 py-2.5 text-base font-bold shadow-[2px_2px_0px_#141414] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414] mood-transition"
                        style={{
                          backgroundColor: pickerAccentTheme.accent,
                          color: pickerAccentTheme.accentInk,
                        }}
                      >
                        <span>See it on wearcomet.com</span>
                        <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                      </a>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span
                  aria-hidden="true"
                  className="sticker-badge inline-block -rotate-1 rounded-lg border-2 border-[#141414] bg-[#FFFFFF] px-2.5 py-0.5 text-sm font-extrabold text-[#141414]"
                >
                  Free 7-day returns
                </span>
                <p className="text-sm font-semibold text-[#2B1D14]">
                  Free returns and exchanges for 7 days. Women are advised to go one size smaller.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
