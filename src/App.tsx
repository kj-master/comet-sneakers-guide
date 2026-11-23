import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from './components/Icons';
import {
  PRODUCTS,
  FAQ_ITEMS,
  QUICK_ANSWER_TEXT,
  CROFFLE_LOCATIONS,
  OccasionOption,
  StyleOption,
  formatINR,
} from './data/sneakers';
import { MOODS, MoodKey } from './data/moods';
import { ProductImage } from './components/ProductImage';
import { ShoesOnWireHero } from './components/ShoesOnWireHero';
import { PickerSection } from './components/PickerSection';
import { FaqAccordion } from './components/FaqAccordion';
import { WavyDivider } from './components/WavyDivider';
import {
  copyTextWithFallback,
  isReducedMotionPreferred,
  isSaveDataEnabled,
  triggerHaptic,
} from './utils/device';

const ShoeSpotlight = lazy(() =>
  import('./components/ShoeSpotlight').then((m) => ({ default: m.ShoeSpotlight }))
);
const SoleLayerVisual = lazy(() =>
  import('./components/SoleAndFitVisuals').then((m) => ({ default: m.SoleLayerVisual }))
);
const SizeAdviceVisual = lazy(() =>
  import('./components/SoleAndFitVisuals').then((m) => ({ default: m.SizeAdviceVisual }))
);
const CareMaterialVisual = lazy(() =>
  import('./components/SoleAndFitVisuals').then((m) => ({ default: m.CareMaterialVisual }))
);
const DesktopCursorBlob = lazy(() =>
  import('./components/DesktopCursorBlob').then((m) => ({ default: m.DesktopCursorBlob }))
);

const PAGE_TITLE = 'Best Sneakers Under ₹5000 in India (2026) | Comet';
const PAGE_DESCRIPTION =
  "Sneakers under ₹5000 in India, picked by budget, style and occasion. Comet's X Lows start at ₹4,299, Aeon V2 at ₹4,499. Free 7-day returns and exchanges.";

type StretchFilter = 'all' | 'frostbite' | 'aeres' | 'apex';

const MARQUEE_FACTS = [
  'X Lows from ₹4,299',
  'Aeon V2 from ₹4,499',
  'UK 3 to 12',
  'Free 7-day returns and exchanges',
  'Free shipping across India',
];

const NAV_LINKS = [
  { href: '#picker', label: 'Picker' },
  { href: '#under-5000', label: 'Under ₹5,000' },
  { href: '#faq', label: 'FAQ' },
  { href: '#cafe-crawl', label: 'Sunday cafe crawl' },
] as const;

export default function App() {
  const [activeMoodKey, setActiveMoodKey] = useState<MoodKey>('xl-cortado');
  const [budget, setBudget] = useState<number>(5000);
  const [occasion, setOccasion] = useState<OccasionOption>('College lectures');
  const [styleChoice, setStyleChoice] = useState<StyleOption>('Neutral and clean');
  const [stretchFilter, setStretchFilter] = useState<StretchFilter>('all');
  const [selectedMumbaiStop, setSelectedMumbaiStop] = useState<string>(CROFFLE_LOCATIONS[0]);

  const [menuOpen, setMenuOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [hideStickyBar, setHideStickyBar] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [saveData] = useState(() => isSaveDataEnabled());

  const menuBtnRef = useRef<HTMLButtonElement | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const faqEndSentinelRef = useRef<HTMLDivElement | null>(null);

  const heroMood = MOODS[activeMoodKey];
  const sourbombMood = MOODS['aeon-sourbomb'];
  const cortadoMood = MOODS['xl-cortado'];

  // Runtime SEO metadata fallback (primary static tags live in index.html)
  useEffect(() => {
    document.documentElement.lang = 'en-IN';
    document.title = PAGE_TITLE;

    const ensureMeta = (attr: 'name' | 'property', key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    ensureMeta('name', 'description', PAGE_DESCRIPTION);
    ensureMeta('property', 'og:title', PAGE_TITLE);
    ensureMeta('property', 'og:description', PAGE_DESCRIPTION);
    ensureMeta('name', 'twitter:title', PAGE_TITLE);
    ensureMeta('name', 'twitter:description', PAGE_DESCRIPTION);
  }, []);

  // Hide mobile sticky bottom bar when a form control is focused or soft keyboard opens
  useEffect(() => {
    let fieldFocused = false;
    let keyboardOpen = false;

    const syncBar = () => setHideStickyBar(fieldFocused || keyboardOpen);

    const onFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
        fieldFocused = true;
        syncBar();
      }
    };

    const onFocusOut = () => {
      const active = document.activeElement as HTMLElement | null;
      fieldFocused = Boolean(active && ['INPUT', 'TEXTAREA', 'SELECT'].includes(active.tagName));
      syncBar();
    };

    const vv = window.visualViewport;
    const onViewportResize = () => {
      if (!vv) return;
      keyboardOpen = window.innerHeight - vv.height > 140;
      syncBar();
    };

    document.addEventListener('focusin', onFocusIn, { passive: true });
    document.addEventListener('focusout', onFocusOut, { passive: true });
    vv?.addEventListener('resize', onViewportResize, { passive: true });

    return () => {
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('focusout', onFocusOut);
      vv?.removeEventListener('resize', onViewportResize);
    };
  }, []);

  // Show floating "Back to top" button only after passing #faq
  useEffect(() => {
    const sentinel = faqEndSentinelRef.current;
    if (!sentinel || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowBackToTop(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // Focus trap & Escape key handling for mobile menu sheet
  useEffect(() => {
    if (!menuOpen) return;

    const sheetEl = sheetRef.current;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusables = sheetEl?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    focusables?.[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setMenuOpen(false);
        menuBtnRef.current?.focus();
        return;
      }
      if (e.key === 'Tab' && focusables && focusables.length > 0) {
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  const xLowsUnder5k = PRODUCTS.filter((p) => p.family === 'X Lows' && p.price <= 5000);
  const aeonUnder5k = PRODUCTS.filter((p) => p.family === 'Aeon V2' && p.price <= 5000);

  const frostbiteStretch = PRODUCTS.filter((p) => p.id === 'xl-frostbite');
  const aeresStretch = PRODUCTS.filter((p) => p.family === 'Aeres' && p.style === 'stretch');
  const apexStretch = PRODUCTS.filter((p) => p.family === 'Apex' && p.style === 'stretch');
  const cortadoProduct = PRODUCTS.find((p) => p.id === 'xl-cortado')!;

  const generalFaqs = FAQ_ITEMS.filter((item) => item.tag !== 'crawl');
  const crawlFaqs = FAQ_ITEMS.filter((item) => item.tag === 'crawl');

  const jumpToPicker = () => {
    triggerHaptic();
    const el = document.getElementById('picker');
    if (el) {
      el.scrollIntoView({ behavior: isReducedMotionPreferred() ? 'auto' : 'smooth', block: 'start' });
    }
  };

  const scrollToTop = () => {
    triggerHaptic();
    window.scrollTo({ top: 0, behavior: isReducedMotionPreferred() ? 'auto' : 'smooth' });
  };

  const handleCopyPageLink = async () => {
    triggerHaptic();
    const ok = await copyTextWithFallback(window.location.href);
    if (ok) {
      setLinkCopied(true);
      window.setTimeout(() => setLinkCopied(false), 2200);
    }
  };

  const cssVars = {
    '--mood-bg': heroMood.bg,
    '--mood-surface': heroMood.surface,
    '--mood-ink': heroMood.ink,
    '--mood-muted': heroMood.mutedInk,
    '--mood-accent': heroMood.accent,
    '--mood-accent-ink': heroMood.accentInk,
    '--mood-pop': heroMood.pop,
    '--mood-pop-ink': heroMood.popInk,
    '--mood-border': heroMood.border,
  } as React.CSSProperties;

  return (
    <div
      style={cssVars}
      data-save-data={saveData ? 'true' : undefined}
      className="page-shell relative bg-[#FAF8F5] text-[#141414] pb-[calc(5.75rem+env(safe-area-inset-bottom))] md:pb-0"
    >
      {/* Subtle Film-Grain Texture Overlay */}
      {!saveData && (
        <div className="film-grain pointer-events-none fixed inset-0 z-40" aria-hidden="true" />
      )}

      {/* Desktop-only Custom Cursor Blob */}
      {!saveData && (
        <Suspense fallback={null}>
          <DesktopCursorBlob color={heroMood.accent} />
        </Suspense>
      )}

      {/* Active-Mood Top Band: Header + Shoes-on-a-Wire Hero */}
      <div
        className="mood-transition"
        style={{ backgroundColor: heroMood.bg, color: heroMood.ink }}
      >
        <header
          className="border-b-2 mood-transition"
          style={{
            borderColor: heroMood.border,
            paddingTop: 'env(safe-area-inset-top)',
          }}
        >
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2 sm:px-6 lg:px-8">
            <a
              href="#top"
              id="top"
              className="font-display inline-flex min-h-[48px] items-center text-base font-extrabold tracking-tight whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ color: heroMood.ink }}
            >
              Comet sneakers guide
            </a>

            {/* Compact Menu Button on Mobile */}
            <button
              ref={menuBtnRef}
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-sheet"
              onClick={() => {
                triggerHaptic();
                setMenuOpen(true);
              }}
              className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-xl border-2 px-4 text-sm font-extrabold transition-transform active:scale-[0.98] md:hidden focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                borderColor: heroMood.border,
                backgroundColor: heroMood.surface,
                color: '#141414',
                boxShadow: `2px 2px 0px ${heroMood.border}`,
              }}
            >
              Menu
            </button>

            {/* Inline Desktop Navigation */}
            <nav
              aria-label="Primary sections"
              className="hidden md:flex md:flex-wrap md:items-center md:gap-4 text-sm font-bold"
            >
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="inline-flex min-h-[48px] items-center px-2 whitespace-nowrap shrink-0 hover:underline decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section
          aria-labelledby="main-heading"
          className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-9 lg:px-8 lg:py-11"
        >
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <h1
                id="main-heading"
                className="font-display text-[1.9rem] font-extrabold leading-[1.06] tracking-tight sm:text-4xl lg:text-[2.85rem] text-balance"
              >
                Best Sneakers Under ₹5,000 in India: Find Your Comet
              </h1>
              <p
                className="mt-3.5 text-base font-medium leading-relaxed sm:text-lg"
                style={{ color: heroMood.ink }}
              >
                Two Comet sneaker families come in under ₹5,000: X Lows from ₹4,299 and Aeon V2 from
                ₹4,499. Use the picker to match your budget, where you will wear them and your style.
              </p>
              <p
                className="mt-2 text-sm font-bold"
                style={{ color: heroMood.mutedInk }}
              >
                Prices checked on wearcomet.com on 21 Nov 2026.
              </p>
            </div>

            <div className="lg:col-span-7">
              <ShoesOnWireHero
                activeMoodKey={activeMoodKey}
                onSelectMoodKey={setActiveMoodKey}
                mood={heroMood}
              />
            </div>
          </div>
        </section>

        {/* Marquee Ticker built strictly from DATA facts */}
        <div
          aria-hidden="true"
          className="marquee-wrap overflow-hidden border-y-2 py-2.5 mood-transition"
          style={{
            borderColor: heroMood.border,
            backgroundColor: heroMood.pop,
            color: heroMood.popInk,
          }}
        >
          <div className="marquee-track flex items-center gap-8 font-display text-sm font-extrabold tracking-tight uppercase">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex items-center gap-8 pr-8">
                {MARQUEE_FACTS.map((fact) => (
                  <span key={`${dup}-${fact}`} className="flex items-center gap-8 whitespace-nowrap">
                    <span>{fact}</span>
                    <span className="inline-block h-2 w-2 rotate-45 border border-current" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Full-Width Sheet Navigation */}
      {menuOpen && (
        <div
          id="mobile-nav-sheet"
          ref={sheetRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className="fixed inset-0 z-50 flex flex-col justify-between overflow-y-auto px-4 md:hidden"
          style={{
            backgroundColor: heroMood.bg,
            color: heroMood.ink,
            paddingTop: 'calc(0.75rem + env(safe-area-inset-top))',
            paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom))',
          }}
        >
          <div>
            <div
              className="flex items-center justify-between border-b-2 pb-3"
              style={{ borderColor: heroMood.border }}
            >
              <span className="font-display text-lg font-extrabold tracking-tight">
                Comet sneakers guide
              </span>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic();
                  setMenuOpen(false);
                  menuBtnRef.current?.focus();
                }}
                className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-xl border-2 px-4 text-sm font-extrabold focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{
                  borderColor: heroMood.border,
                  backgroundColor: heroMood.surface,
                  color: '#141414',
                }}
              >
                Close
              </button>
            </div>

            <nav aria-label="Mobile navigation links" className="mt-6 flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => {
                    triggerHaptic();
                    setMenuOpen(false);
                  }}
                  className="font-display flex min-h-[56px] w-full items-center justify-between rounded-2xl border-2 px-4 py-3 text-lg font-extrabold focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{
                    borderColor: heroMood.border,
                    backgroundColor: heroMood.surface,
                    color: '#141414',
                    boxShadow: `3px 3px 0px ${heroMood.border}`,
                  }}
                >
                  <span>{link.label}</span>
                  <ArrowUpRight className="h-5 w-5 shrink-0" />
                </a>
              ))}
            </nav>
          </div>

          <div className="mt-8 space-y-2 border-t-2 pt-4" style={{ borderColor: heroMood.border }}>
            <button
              type="button"
              onClick={handleCopyPageLink}
              className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl border-2 px-4 py-2.5 text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                borderColor: heroMood.border,
                backgroundColor: heroMood.accent,
                color: heroMood.accentInk,
              }}
            >
              {linkCopied ? 'Link copied' : 'Copy page link'}
            </button>
            <p className="sr-only" aria-live="polite">
              {linkCopied ? 'Guide link copied to clipboard.' : ''}
            </p>
          </div>
        </div>
      )}

      {/* Transition from Hero Mood to Clean Drop Canvas */}
      <WavyDivider topColor={heroMood.bg} bottomColor="#FAF8F5" variant="wave" />

      <main>
        {/* Interactive Picker Section */}
        <div className="bg-[#FAF8F5] py-8 sm:py-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <PickerSection
              budget={budget}
              onBudgetChange={setBudget}
              occasion={occasion}
              onOccasionChange={setOccasion}
              styleChoice={styleChoice}
              onStyleChoiceChange={setStyleChoice}
              heroMood={heroMood}
            />
          </div>
        </div>

        {/* Comet Sneakers Under ₹5,000 */}
        <section
          aria-labelledby="under-5000"
          className="cv-auto bg-[#FAF8F5] py-8 sm:py-12"
        >
          <div className="mx-auto max-w-6xl border-t-2 border-[#141414]/15 px-4 pt-10 sm:px-6 lg:px-8">
            <h2
              id="under-5000"
              className="scroll-mt-20 font-display text-3xl font-extrabold tracking-tight text-[#141414] md:text-4xl text-balance"
            >
              Comet sneakers under ₹5,000 on wearcomet.com
            </h2>

            <Suspense
              fallback={
                <div
                  aria-hidden="true"
                  className="mt-6 min-h-[380px] rounded-[28px] border-2 border-[#141414]/15 bg-[#F4EADB]/60"
                />
              }
            >
              <ShoeSpotlight />
            </Suspense>

            {/* X Lows */}
            <div className="mt-10">
              <h3 className="font-display text-xl font-extrabold tracking-tight text-[#141414] tabular-nums">
                X Lows: from ₹4,299
              </h3>
              <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {xLowsUnder5k.map((product) => (
                  <article
                    key={product.id}
                    className="flex flex-col justify-between overflow-hidden rounded-[24px] border-2 border-[#141414] bg-[#FFFFFF] shadow-[4px_4px_0px_#141414] transition-transform duration-150 [@media(hover:hover)]:hover:-translate-y-1"
                  >
                    <div>
                      <ProductImage product={product} />
                      <div className="p-5">
                        <p className="text-sm font-semibold text-[#524E48]">
                          {product.family} · {product.colour}
                        </p>
                        <p className="font-display mt-1 text-lg font-extrabold text-[#141414]">
                          Comet sneakers {product.family} {product.model}
                        </p>
                        <p className="font-display mt-1.5 text-2xl font-extrabold tracking-tight text-[#141414] tabular-nums">
                          {formatINR(product.price)}
                        </p>
                        {product.id === 'xl-cortado' && (
                          <p className="mt-2 text-sm leading-relaxed text-[#3B3833]">
                            Canvas upper with a microfiber underlay, synthetic leather footbed, and
                            rubber and EVA sole.
                          </p>
                        )}
                        {product.id === 'xl-chestnut' && (
                          <p className="mt-2 text-sm leading-relaxed text-[#3B3833]">
                            Faux-suede upper with a roomy toe box and SpaceWalk 3-layer sole. Keep
                            suede parts away from water.
                          </p>
                        )}
                        {product.id === 'xl-snow' && (
                          <p className="mt-2 text-sm leading-relaxed text-[#3B3833]">
                            Low-top with a roomy toe box and SpaceWalk 3-layer sole, described by
                            Comet for 9AM to 9PM comfort.
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="px-5 pb-5">
                      <a
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border-2 border-[#141414] bg-[#F4EADB] px-4 py-2.5 text-sm font-bold text-[#141414] transition-colors active:scale-[0.99] [@media(hover:hover)]:hover:bg-[#141414] [@media(hover:hover)]:hover:text-[#FFFFFF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414]"
                      >
                        <span>
                          See {product.family} {product.model} on wearcomet.com
                        </span>
                        <ArrowUpRight className="h-4 w-4 shrink-0" />
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Aeon V2 */}
            <div className="mt-10">
              <h3 className="font-display text-xl font-extrabold tracking-tight text-[#141414] tabular-nums">
                Aeon V2: from ₹4,499
              </h3>
              <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {aeonUnder5k.map((product) => (
                  <article
                    key={product.id}
                    className="flex flex-col justify-between overflow-hidden rounded-[24px] border-2 border-[#141414] bg-[#FFFFFF] shadow-[4px_4px_0px_#C6FF3D] transition-transform duration-150 [@media(hover:hover)]:hover:-translate-y-1"
                  >
                    <div>
                      <ProductImage product={product} />
                      <div className="p-5">
                        <p className="text-sm font-semibold text-[#524E48]">
                          {product.family} · {product.colour}
                        </p>
                        <p className="font-display mt-1 text-lg font-extrabold text-[#141414]">
                          Comet sneakers {product.family} {product.model}
                        </p>
                        <p className="font-display mt-1.5 text-2xl font-extrabold tracking-tight text-[#141414] tabular-nums">
                          {formatINR(product.price)}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-[#3B3833]">
                          Comet describes Aeon V2 as made for a snug fit and all-day wear.
                        </p>
                      </div>
                    </div>
                    <div className="px-5 pb-5">
                      <a
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border-2 border-[#141414] bg-[#C6FF3D] px-4 py-2.5 text-sm font-bold text-[#14161A] transition-colors active:scale-[0.99] [@media(hover:hover)]:hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414]"
                      >
                        <span>
                          See {product.family} {product.model} on wearcomet.com
                        </span>
                        <ArrowUpRight className="h-4 w-4 shrink-0" />
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* What to check in any sneaker under ₹5,000 */}
        <section
          aria-labelledby="what-to-check-heading"
          className="cv-auto bg-[#FAF8F5] py-8 sm:py-12"
        >
          <div className="mx-auto max-w-6xl border-t-2 border-[#141414]/15 px-4 pt-10 sm:px-6 lg:px-8">
            <h2
              id="what-to-check-heading"
              className="font-display text-3xl font-extrabold tracking-tight text-[#141414] md:text-4xl text-balance"
            >
              What to check in any sneaker under ₹5,000
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-[24px] border-2 border-[#141414] bg-[#FFFFFF] p-5 shadow-[4px_4px_0px_#141414] sm:p-6">
                <h3 className="font-display text-lg font-extrabold text-[#141414]">Sole</h3>
                <p className="mt-2 text-base leading-relaxed text-[#3B3833]">
                  Look for a rubber outsole and a cushioned midsole. X Lows list natural rubber and
                  an EVA insert inside Comet&apos;s SpaceWalk 3-layer sole (insole, cushioned EVA
                  insert, natural rubber outsole).
                </p>
                <Suspense
                  fallback={
                    <div
                      aria-hidden="true"
                      className="mt-4 min-h-[150px] rounded-2xl border-2 border-[#141414]/15 bg-[#F4EADB]/60"
                    />
                  }
                >
                  <SoleLayerVisual />
                </Suspense>
              </div>

              <div className="rounded-[24px] border-2 border-[#141414] bg-[#FFFFFF] p-5 shadow-[4px_4px_0px_#141414] sm:p-6">
                <h3 className="font-display text-lg font-extrabold text-[#141414]">
                  Toe box and fit
                </h3>
                <p className="mt-2 text-base leading-relaxed text-[#3B3833]">
                  X Lows have a roomy toe box with Oxford construction made for broad Indian feet.
                  Sizes run UK 3 to 12 with a size chart on each product page, and women are advised
                  to size down one.
                </p>
                <Suspense
                  fallback={
                    <div
                      aria-hidden="true"
                      className="mt-4 min-h-[130px] rounded-2xl border-2 border-[#141414]/15 bg-[#F4EADB]/60"
                    />
                  }
                >
                  <SizeAdviceVisual />
                </Suspense>
              </div>

              <div className="rounded-[24px] border-2 border-[#141414] bg-[#FFFFFF] p-5 shadow-[4px_4px_0px_#141414] sm:p-6">
                <h3 className="font-display text-lg font-extrabold text-[#141414]">
                  Materials and care
                </h3>
                <p className="mt-2 text-base leading-relaxed text-[#3B3833]">
                  X Lows use faux leather and faux suede (Cortado uses canvas with a microfiber
                  underlay). Keep suede parts away from water, and wipe rather than scrub.
                </p>
                <Suspense
                  fallback={
                    <div
                      aria-hidden="true"
                      className="mt-4 min-h-[130px] rounded-2xl border-2 border-[#141414]/15 bg-[#F4EADB]/60"
                    />
                  }
                >
                  <CareMaterialVisual />
                </Suspense>
              </div>

              <div className="flex flex-col justify-between rounded-[24px] border-2 border-[#141414] bg-[#FFFFFF] p-5 shadow-[4px_4px_0px_#141414] sm:p-6">
                <div>
                  <h3 className="font-display text-lg font-extrabold text-[#141414]">Returns</h3>
                  <p className="mt-2 text-base leading-relaxed text-[#3B3833]">
                    Free shipping across India (usually dispatched within 24 hours, delivery in 3 to
                    5 days) and free returns and exchanges for 7 days from delivery, so you can test
                    the fit.
                  </p>
                </div>

                <div className="mt-4 rounded-2xl border-2 border-[#141414] bg-[#F4EADB] p-4">
                  <p className="text-sm font-bold text-[#2B1D14]">
                    Delivery &amp; returns timeline (wearcomet.com)
                  </p>
                  <div className="mt-3 grid grid-cols-1 gap-2 text-center sm:grid-cols-3">
                    <div className="rounded-xl border-2 border-[#141414] bg-[#FFFFFF] p-3">
                      <p className="font-display text-base font-extrabold text-[#141414] tabular-nums">
                        24 hrs
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-[#524E48]">Usual dispatch</p>
                    </div>
                    <div className="rounded-xl border-2 border-[#141414] bg-[#FFFFFF] p-3">
                      <p className="font-display text-base font-extrabold text-[#141414] tabular-nums">
                        3–5 days
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-[#524E48]">Free delivery</p>
                    </div>
                    <div className="rounded-xl border-2 border-[#141414] bg-[#C6FF3D] p-3">
                      <p className="font-display text-base font-extrabold text-[#14161A] tabular-nums">
                        7 days
                      </p>
                      <p className="mt-0.5 text-sm font-bold text-[#14161A]">Free returns</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-5 text-base font-semibold text-[#3B3833]">
              Do not just take any brand&apos;s word for it. Read owner threads on r/SneakersIndia
              too.
            </p>
          </div>
        </section>

        {/* Torn-paper transition into calm neutral */}
        <WavyDivider topColor="#FAF8F5" bottomColor="#ECE7DF" variant="torn" />

        {/* When Comet is not the right pick: Calm Neutral Mood */}
        <section
          aria-labelledby="limits"
          className="cv-auto bg-[#ECE7DF] py-10 text-[#141414] sm:py-14"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl rounded-[24px] border-2 border-[#141414] bg-[#FAF8F5] p-6 shadow-[5px_5px_0px_#141414] sm:p-8">
              <h2
                id="limits"
                className="scroll-mt-20 font-display text-3xl font-extrabold tracking-tight text-[#141414] md:text-4xl text-balance"
              >
                When Comet is not the right pick
              </h2>
              <p className="mt-3 text-base leading-relaxed text-[#2D2B28]">
                If your cap is below ₹4,299, Comet is not the answer. Comet is not the cheapest
                sneaker brand. Suede parts also need keeping dry.
              </p>
              <p className="mt-4 text-base font-bold text-[#141414]">
                If ₹4,299 works,{' '}
                <a
                  href="#under-5000"
                  className="inline-flex min-h-[48px] items-center underline decoration-[#0A6E66] decoration-2 underline-offset-4 hover:text-[#0A6E66] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414]"
                >
                  start with X Lows
                </a>
                .
              </p>
            </div>
          </div>
        </section>

        {/* Wavy transition into Dark Sourbomb Stretch Picks */}
        <WavyDivider topColor="#ECE7DF" bottomColor={sourbombMood.bg} variant="wave" />

        {/* Just above ₹5,000: Dark Sourbomb Mood for Contrast */}
        <section
          id="stretch-picks"
          aria-labelledby="stretch-heading"
          className="cv-auto scroll-mt-20 py-12 sm:py-16"
          style={{ backgroundColor: sourbombMood.bg, color: sourbombMood.ink }}
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2
                  id="stretch-heading"
                  className="font-display text-3xl font-extrabold tracking-tight md:text-4xl text-balance"
                >
                  Just above ₹5,000: stretch picks
                </h2>
                <p
                  className="mt-2 max-w-2xl text-base leading-relaxed"
                  style={{ color: sourbombMood.mutedInk }}
                >
                  Every listed pair above the ₹5,000 ceiling on wearcomet.com, grouped by family with
                  the exact difference over ₹5,000.
                </p>
              </div>

              {/* Interactive Family Filter */}
              <div
                className="flex flex-wrap gap-2 rounded-2xl border-2 border-[#F4FFE0]/25 bg-[#1D2026] p-1.5"
                role="group"
                aria-label="Filter stretch picks by sneaker family"
              >
                {(
                  [
                    { id: 'all', label: 'All (11)' },
                    { id: 'frostbite', label: 'X Lows Frostbite (1)' },
                    { id: 'aeres', label: 'Aeres (6)' },
                    { id: 'apex', label: 'Apex (4)' },
                  ] as const
                ).map((tab) => {
                  const active = stretchFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => {
                        triggerHaptic();
                        setStretchFilter(tab.id);
                      }}
                      className={`min-h-[48px] rounded-xl px-3.5 py-2 text-sm font-bold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C6FF3D] ${
                        active
                          ? 'bg-[#C6FF3D] text-[#14161A]'
                          : 'text-[#F4FFE0] [@media(hover:hover)]:hover:bg-[#2A2E37]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 space-y-10">
              {(stretchFilter === 'all' || stretchFilter === 'frostbite') && (
                <div>
                  <h3 className="font-display text-xl font-extrabold text-[#C6FF3D]">
                    X Lows Frostbite
                  </h3>
                  <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {frostbiteStretch.map((product) => (
                      <StretchCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              )}

              {(stretchFilter === 'all' || stretchFilter === 'aeres') && (
                <div>
                  <h3 className="font-display text-xl font-extrabold text-[#C6FF3D]">Aeres</h3>
                  <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {aeresStretch.map((product) => (
                      <StretchCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              )}

              {(stretchFilter === 'all' || stretchFilter === 'apex') && (
                <div>
                  <h3 className="font-display text-xl font-extrabold text-[#C6FF3D]">Apex</h3>
                  <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {apexStretch.map((product) => (
                      <StretchCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Torn transition into Light FAQ Section with Big Sticker Numbers */}
        <WavyDivider topColor={sourbombMood.bg} bottomColor="#FAF8F5" variant="torn" />

        {/* Frequently asked questions: Light with Big Sticker Numbers */}
        <section
          id="faq"
          aria-labelledby="faq-heading"
          className="cv-auto scroll-mt-20 bg-[#FAF8F5] py-12 sm:py-16"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2
              id="faq-heading"
              className="font-display text-3xl font-extrabold tracking-tight text-[#141414] md:text-4xl text-balance"
            >
              Frequently asked questions
            </h2>

            <div className="mt-6 max-w-3xl">
              <FaqAccordion
                items={generalFaqs}
                defaultOpenCount={3}
                headingLevel="h3"
                idPrefix="faq"
                showStickerNumbers={true}
                showExpandCollapse={true}
              />
            </div>
          </div>
          <div ref={faqEndSentinelRef} className="h-px w-full" aria-hidden="true" />
        </section>

        {/* Wavy transition into Cortado Mood Café Crawl Section */}
        <WavyDivider topColor="#FAF8F5" bottomColor={cortadoMood.bg} variant="wave" />

        {/* Sunday cafe crawl in Mumbai: Cortado Mood */}
        <section
          id="cafe-crawl"
          aria-labelledby="cafe-crawl-heading"
          className="cv-auto scroll-mt-20 py-12 sm:py-16"
          style={{ backgroundColor: cortadoMood.bg, color: cortadoMood.ink }}
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2
              id="cafe-crawl-heading"
              className="font-display text-3xl font-extrabold tracking-tight md:text-4xl text-balance"
            >
              What should I wear for a Sunday café crawl in Mumbai?
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
              <div className="space-y-8 lg:col-span-7">
                {/* Highlighted Quick answer box (EXACT 54-word copy preserved) */}
                <div
                  className="rounded-[24px] border-2 border-[#2B1D14] p-5 shadow-[5px_5px_0px_#2B1D14] sm:p-6"
                  style={{ backgroundColor: cortadoMood.pop, color: cortadoMood.popInk }}
                >
                  <p className="font-display text-sm font-extrabold tracking-wide uppercase">
                    Quick answer
                  </p>
                  <p className="mt-2 text-base font-semibold leading-relaxed sm:text-lg">
                    {QUICK_ANSWER_TEXT}
                  </p>
                </div>

                <div>
                  <h3 className="font-display text-xl font-extrabold">Three quick questions</h3>
                  <div className="mt-4">
                    <FaqAccordion
                      items={crawlFaqs}
                      defaultOpenCount={3}
                      headingLevel="h4"
                      idPrefix="crawl"
                    />
                  </div>
                </div>

                <div className="text-base">
                  <p className="font-semibold">
                    Croffle Guys locations in Mumbai: {CROFFLE_LOCATIONS.join(', ')} (source:{' '}
                    <a
                      href="https://thecroffleguys.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[48px] items-center underline decoration-[#0A6E66] decoration-2 underline-offset-4 hover:text-[#0A6E66] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B1D14]"
                    >
                      thecroffleguys.com
                    </a>
                    )
                  </p>
                </div>
              </div>

              {/* Interactive Cortado Crawl Stop Card */}
              <div className="overflow-hidden rounded-[24px] border-2 border-[#2B1D14] bg-[#FFFFFF] text-[#2B1D14] shadow-[5px_5px_0px_#0A6E66] lg:col-span-5">
                <ProductImage product={cortadoProduct} />
                <div className="p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="text-sm font-bold text-[#543D2F]">
                      Comet sneakers X Lows Cortado · Cream Canvas
                    </p>
                    <p className="font-display text-xl font-extrabold tabular-nums">
                      {formatINR(cortadoProduct.price)}
                    </p>
                  </div>

                  <p className="mt-3 text-sm font-bold text-[#543D2F]">
                    Pick a Mumbai stop (The Croffle Guys)
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {CROFFLE_LOCATIONS.map((loc) => {
                      const active = loc === selectedMumbaiStop;
                      return (
                        <button
                          key={loc}
                          type="button"
                          aria-pressed={active}
                          onClick={() => {
                            triggerHaptic();
                            setSelectedMumbaiStop(loc);
                          }}
                          className="min-h-[48px] rounded-xl border-2 px-3.5 py-2 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B1D14]"
                          style={{
                            borderColor: '#2B1D14',
                            backgroundColor: active ? cortadoMood.accent : '#F4EADB',
                            color: active ? cortadoMood.accentInk : '#2B1D14',
                          }}
                        >
                          {loc}
                        </button>
                      );
                    })}
                  </div>

                  <p className="mt-3 text-base leading-relaxed text-[#3B2B22]">
                    Starting in <strong className="text-[#2B1D14]">{selectedMumbaiStop}</strong>:
                    canvas upper with a microfiber underlay, roomy toe box and cushioned SpaceWalk
                    sole for hours on foot.
                  </p>

                  <a
                    href={cortadoProduct.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border-2 border-[#2B1D14] px-4 py-2.5 text-sm font-bold shadow-[2px_2px_0px_#2B1D14] transition-transform active:scale-[0.99] [@media(hover:hover)]:hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B1D14]"
                    style={{
                      backgroundColor: cortadoMood.accent,
                      color: cortadoMood.accentInk,
                    }}
                  >
                    <span>See X Lows Cortado on wearcomet.com</span>
                    <ArrowUpRight className="h-4 w-4 shrink-0" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-[#2B1D14] bg-[#E9D2B8] text-[#2A1A10]">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="max-w-3xl text-base leading-relaxed">
            Student concept for an SEO assignment at Atlas SkillTech University x Schbang. Not made,
            endorsed or commissioned by Comet or The Croffle Guys. Product facts and prices are from
            wearcomet.com and location names from thecroffleguys.com, checked on 21 Nov 2026. Always
            confirm current prices on wearcomet.com.
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm font-bold">
            <a
              href="https://www.wearcomet.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] items-center gap-1.5 underline decoration-[#2A1A10]/50 underline-offset-4 hover:text-[#B8412A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2A1A10]"
            >
              <span>Visit wearcomet.com</span>
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <a
              href="https://thecroffleguys.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] items-center gap-1.5 underline decoration-[#2A1A10]/50 underline-offset-4 hover:text-[#B8412A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2A1A10]"
            >
              <span>Visit thecroffleguys.com</span>
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <a
              href="/llms.txt"
              className="inline-flex min-h-[48px] items-center underline decoration-[#2A1A10]/50 underline-offset-4 hover:text-[#B8412A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2A1A10]"
            >
              llms.txt (for AI tools)
            </a>
          </div>
        </div>
      </footer>

      {/* Floating Back to Top Button (visible after scrolling past FAQ) */}
      {showBackToTop && !menuOpen && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed right-4 z-30 inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-xl border-2 border-[#141414] bg-[#FFFFFF] px-3.5 py-2 text-sm font-extrabold text-[#141414] shadow-[3px_3px_0px_#141414] transition-transform active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414] bottom-[calc(4.9rem+env(safe-area-inset-bottom))] md:bottom-6"
        >
          Back to top ↑
        </button>
      )}

      {/* Mobile Sticky Bottom Bar (hides when field is focused or keyboard open) */}
      <div
        aria-hidden={hideStickyBar || menuOpen}
        className={`fixed inset-x-0 bottom-0 z-30 border-t-2 px-4 pt-2 backdrop-blur-sm transition-transform duration-200 md:hidden mood-transition ${
          hideStickyBar || menuOpen ? 'translate-y-full pointer-events-none' : 'translate-y-0'
        }`}
        style={{
          backgroundColor: heroMood.bg,
          color: heroMood.ink,
          borderColor: heroMood.border,
          paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom))',
        }}
      >
        <div className="mx-auto flex max-w-md items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold" style={{ color: heroMood.mutedInk }}>
              Current budget
            </p>
            <p className="font-display text-base font-extrabold tabular-nums">
              {formatINR(budget)}
            </p>
          </div>
          <button
            type="button"
            onClick={jumpToPicker}
            tabIndex={hideStickyBar || menuOpen ? -1 : undefined}
            className="inline-flex min-h-[48px] items-center justify-center rounded-xl border-2 px-4 py-2 text-sm font-bold transition-transform active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{
              borderColor: heroMood.border,
              backgroundColor: heroMood.accent,
              color: heroMood.accentInk,
              boxShadow: `2px 2px 0px ${heroMood.border}`,
            }}
          >
            Jump to picker
          </button>
        </div>
      </div>
    </div>
  );
}

function StretchCard({ product }: { product: (typeof PRODUCTS)[number] }) {
  const overAmount = product.price - 5000;
  const barPct = Math.min(100, Math.round((overAmount / 1299) * 100));

  return (
    <article className="flex flex-col justify-between overflow-hidden rounded-[24px] border-2 border-[#C6FF3D]/40 bg-[#1D2026] text-[#F4FFE0] shadow-[4px_4px_0px_#C6FF3D] transition-transform duration-150 [@media(hover:hover)]:hover:-translate-y-1">
      <div>
        <ProductImage product={product} />
        <div className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <span className="font-medium text-[#C9D4BA]">{product.colour}</span>
            <span className="sticker-badge inline-block -rotate-2 rounded-lg border-2 border-[#14161A] bg-[#A78BFA] px-2.5 py-0.5 text-sm font-extrabold text-[#14161A] tabular-nums">
              {formatINR(overAmount)} over
            </span>
          </div>
          <p className="font-display mt-2 text-base font-extrabold text-[#F4FFE0]">
            Comet sneakers {product.family} {product.model}
          </p>
          <p className="font-display mt-1 text-xl font-extrabold tracking-tight text-[#C6FF3D] tabular-nums">
            {formatINR(product.price)}
          </p>

          <div className="mt-2.5" aria-hidden="true">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#2E333D]">
              <div
                className="h-full rounded-full bg-[#C6FF3D]"
                style={{ width: `${barPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 pb-4">
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border-2 border-[#14161A] bg-[#C6FF3D] px-4 py-2 text-sm font-bold text-[#14161A] transition-colors active:scale-[0.99] [@media(hover:hover)]:hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C6FF3D]"
        >
          <span>
            See {product.family} {product.model} on wearcomet.com
          </span>
          <ArrowUpRight className="h-4 w-4 shrink-0" />
        </a>
      </div>
    </article>
  );
}
