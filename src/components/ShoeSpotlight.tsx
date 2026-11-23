import { useState } from 'react';
import { ArrowUpRight, ZoomIn, ZoomOut } from './Icons';
import { PRODUCTS, PRODUCT_ALT_TEXT, formatINR } from '../data/sneakers';
import { buildImageSrcSet, triggerHaptic } from '../utils/device';

interface Hotspot {
  id: string;
  label: string;
  detail: string;
  xPct: number;
  yPct: number;
}

const UNDER_5K_IDS = ['xl-cortado', 'xl-chestnut', 'xl-snow', 'aeon-sourbomb'] as const;

const SWATCH_COLORS: Record<string, { primary: string; secondary: string }> = {
  'xl-cortado': { primary: '#E8E0D0', secondary: '#8C6E54' },
  'xl-chestnut': { primary: '#4B372D', secondary: '#1B1918' },
  'xl-snow': { primary: '#CBD6DF', secondary: '#556877' },
  'aeon-sourbomb': { primary: '#C6FF3D', secondary: '#14161A' },
};

function getHotspotsForShoe(id: string): Hotspot[] {
  if (id === 'aeon-sourbomb') {
    return [
      {
        id: 'fit',
        label: 'Snug fit upper',
        detail: 'Comet describes Aeon V2 as made for a snug fit and all-day wear.',
        xPct: 54,
        yPct: 48,
      },
      {
        id: 'sizing',
        label: 'UK 3 to 12 sizing',
        detail:
          'Sizes run UK 3 to 12 with a size chart on the product page. Women are advised to go one size smaller.',
        xPct: 30,
        yPct: 58,
      },
      {
        id: 'returns',
        label: '7-day free returns',
        detail:
          'Free shipping across India in 3 to 5 days, plus free returns and exchanges up to 7 days from delivery.',
        xPct: 72,
        yPct: 68,
      },
    ];
  }

  const upperDetail =
    id === 'xl-cortado'
      ? 'Canvas upper with a microfiber underlay and synthetic leather footbed.'
      : id === 'xl-chestnut'
        ? 'Faux-suede upper. Keep suede parts away from water; wipe, do not scrub.'
        : 'Upper of faux leather and faux suede. Keep suede parts away from water.';

  return [
    {
      id: 'toebox',
      label: 'Roomy toe box',
      detail: 'Oxford construction made for broad Indian feet, giving toes space during long walks.',
      xPct: 24,
      yPct: 57,
    },
    {
      id: 'upper',
      label: 'Upper material',
      detail: upperDetail,
      xPct: 52,
      yPct: 45,
    },
    {
      id: 'sole',
      label: 'SpaceWalk 3-layer sole',
      detail:
        'Insole, cushioned EVA insert and natural rubber outsole — built for 9AM to 9PM comfort, says Comet.',
      xPct: 56,
      yPct: 74,
    },
  ];
}

export function ShoeSpotlight() {
  const under5kShoes = UNDER_5K_IDS.map((id) => PRODUCTS.find((p) => p.id === id)!).filter(
    Boolean
  );
  const [selectedId, setSelectedId] = useState<string>(under5kShoes[0].id);
  const [activePinId, setActivePinId] = useState<string>('toebox');
  const [zoomed, setZoomed] = useState<boolean>(false);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const selectedShoe = under5kShoes.find((s) => s.id === selectedId) ?? under5kShoes[0];
  const hotspots = getHotspotsForShoe(selectedShoe.id);
  const activeHotspot = hotspots.find((h) => h.id === activePinId) ?? hotspots[0];

  const handleSelectShoe = (id: string) => {
    triggerHaptic(6);
    setSelectedId(id);
    const nextHotspots = getHotspotsForShoe(id);
    setActivePinId(nextHotspots[0].id);
    setZoomed(false);
  };

  return (
    <div className="mt-6 overflow-hidden rounded-[24px] border-2 border-[#141414] bg-[#FFFFFF] shadow-[6px_6px_0px_#141414]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#141414] bg-[#14161A] px-4 py-3 text-[#F4FFE0] sm:px-6">
        <p className="font-display text-sm font-bold tracking-tight" aria-hidden="true">
          Inspect each pair under ₹5,000
        </p>
        <div
          className="flex flex-wrap gap-2"
          role="tablist"
          aria-label="Choose a Comet sneaker under ₹5,000"
        >
          {under5kShoes.map((shoe) => {
            const active = shoe.id === selectedShoe.id;
            const swatch = SWATCH_COLORS[shoe.id];
            return (
              <button
                key={shoe.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => handleSelectShoe(shoe.id)}
                className={`inline-flex min-h-[48px] items-center gap-2 rounded-xl border-2 px-3 py-1.5 text-sm font-bold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C6FF3D] ${
                  active
                    ? 'border-[#C6FF3D] bg-[#C6FF3D] text-[#14161A]'
                    : 'border-[#F4FFE0]/25 bg-[#1D2026] text-[#F4FFE0] hover:border-[#F4FFE0]/65'
                }`}
              >
                <span
                  className="inline-block h-3.5 w-3.5 rounded-sm border border-[#141414]/50 shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${swatch.primary} 55%, ${swatch.secondary} 55%)`,
                  }}
                  aria-hidden="true"
                />
                <span>
                  {shoe.family} {shoe.model}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="relative flex flex-col justify-between bg-[#F4EADB] p-4 sm:p-6 lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-bold text-[#2B1D14]" aria-hidden="true">
              Tap pins 1–3 on the shoe
            </span>
            <button
              type="button"
              onClick={() => {
                triggerHaptic(6);
                setZoomed((z) => !z);
              }}
              aria-pressed={zoomed}
              className="inline-flex min-h-[48px] items-center gap-1.5 rounded-xl border-2 border-[#141414] bg-[#FFFFFF] px-3.5 py-2 text-sm font-bold text-[#141414] shadow-[2px_2px_0px_#141414] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414]"
            >
              {zoomed ? (
                <>
                  <ZoomOut className="h-4 w-4" aria-hidden="true" />
                  <span>Reset zoom</span>
                </>
              ) : (
                <>
                  <ZoomIn className="h-4 w-4" aria-hidden="true" />
                  <span>Zoom 1.25×</span>
                </>
              )}
            </button>
          </div>

          <div className="relative mx-auto mt-3 aspect-[4/3] w-full max-w-lg overflow-hidden rounded-[20px] border-2 border-[#141414] bg-[#FFFFFF]">
            <div
              className="h-full w-full transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ transform: zoomed ? 'scale(1.25)' : 'scale(1)' }}
            >
              {imgErrors[selectedShoe.id] ? (
                <div
                  className="flex h-full w-full flex-col justify-between p-6"
                  style={{
                    backgroundColor: SWATCH_COLORS[selectedShoe.id].primary,
                    color: selectedShoe.id === 'xl-chestnut' ? '#F6F3EE' : '#141414',
                  }}
                >
                  <span className="text-sm font-semibold">
                    Comet sneakers · {selectedShoe.family}
                  </span>
                  <div>
                    <p className="font-display text-2xl font-bold">{selectedShoe.model}</p>
                    <p className="text-sm opacity-80">{selectedShoe.colour}</p>
                  </div>
                </div>
              ) : (
                <img
                  key={selectedShoe.id}
                  src={selectedShoe.img}
                  srcSet={buildImageSrcSet(selectedShoe.img)}
                  sizes="(max-width: 1023px) 92vw, 512px"
                  alt={PRODUCT_ALT_TEXT[selectedShoe.id]}
                  width={800}
                  height={600}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onError={() =>
                    setImgErrors((prev) => ({ ...prev, [selectedShoe.id]: true }))
                  }
                  className="h-full w-full object-cover object-center mix-blend-multiply"
                />
              )}
            </div>

            {!zoomed &&
              hotspots.map((pin, index) => {
                const isSelected = pin.id === activeHotspot.id;
                return (
                  <button
                    key={pin.id}
                    type="button"
                    onClick={() => {
                      triggerHaptic(6);
                      setActivePinId(pin.id);
                    }}
                    aria-label={`Inspect ${pin.label}`}
                    aria-pressed={isSelected}
                    style={{ left: `${pin.xPct}%`, top: `${pin.yPct}%` }}
                    className={`absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[#141414] text-sm font-extrabold shadow-[2px_2px_0px_#141414] transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414] ${
                      isSelected
                        ? 'scale-110 bg-[#C6FF3D] text-[#141414]'
                        : 'bg-[#14161A] text-[#F4FFE0] hover:scale-105'
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              })}
          </div>
        </div>

        <div className="flex flex-col justify-between border-t-2 border-[#141414] p-5 sm:p-6 lg:col-span-5 lg:border-l-2 lg:border-t-0">
          <div>
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-sm font-semibold text-[#524E48]">
                {selectedShoe.family} · {selectedShoe.colour}
              </p>
              <p className="font-display text-2xl font-extrabold tracking-tight text-[#141414] tabular-nums">
                {formatINR(selectedShoe.price)}
              </p>
            </div>

            <p className="font-display mt-1 text-xl font-extrabold text-[#141414]">
              Comet sneakers {selectedShoe.family} {selectedShoe.model}
            </p>

            <div className="mt-5 space-y-2.5">
              {hotspots.map((pin, index) => {
                const isSelected = pin.id === activeHotspot.id;
                return (
                  <button
                    key={pin.id}
                    type="button"
                    onClick={() => {
                      triggerHaptic(6);
                      setActivePinId(pin.id);
                    }}
                    aria-expanded={isSelected}
                    className={`min-h-[48px] w-full rounded-2xl border-2 p-3.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414] ${
                      isSelected
                        ? 'border-[#141414] bg-[#F4EADB] shadow-[3px_3px_0px_#141414]'
                        : 'border-[#141414]/20 bg-[#FFFFFF] hover:border-[#141414]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#141414] text-sm font-extrabold ${
                          isSelected
                            ? 'bg-[#C6FF3D] text-[#141414]'
                            : 'bg-[#14161A] text-[#F4FFE0]'
                        }`}
                      >
                        {index + 1}
                      </span>
                      <span className="text-base font-bold text-[#141414]">{pin.label}</span>
                    </div>
                    <p className="mt-1.5 pl-8.5 text-sm leading-relaxed text-[#2B1D14]">
                      {pin.detail}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-[#141414]/15">
            <a
              href={selectedShoe.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] w-full items-center justify-center gap-1.5 rounded-xl border-2 border-[#141414] bg-[#0A6E66] px-4 py-2.5 text-base font-bold text-[#FFFFFF] shadow-[3px_3px_0px_#141414] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414]"
            >
              <span>
                See {selectedShoe.family} {selectedShoe.model} on wearcomet.com
              </span>
              <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
