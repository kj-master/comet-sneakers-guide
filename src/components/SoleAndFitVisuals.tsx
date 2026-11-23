import { useState } from 'react';
import { triggerHaptic } from '../utils/device';

interface SoleLayer {
  id: 'insole' | 'eva' | 'outsole';
  name: string;
  fact: string;
  color: string;
  textColor: string;
}

const SOLE_LAYERS: SoleLayer[] = [
  {
    id: 'insole',
    name: '1. Insole',
    fact: 'Top layer inside X Lows for step-in cushioning.',
    color: '#FF8A5B',
    textColor: '#2B1D14',
  },
  {
    id: 'eva',
    name: '2. Cushioned EVA insert',
    fact: 'Middle cushioned EVA insert inside the SpaceWalk 3-layer sole.',
    color: '#C6FF3D',
    textColor: '#14161A',
  },
  {
    id: 'outsole',
    name: '3. Natural rubber outsole',
    fact: 'Bottom natural rubber outsole for grip across daily walks.',
    color: '#14161A',
    textColor: '#F4FFE0',
  },
];

export function SoleLayerVisual() {
  const [activeLayer, setActiveLayer] = useState<SoleLayer['id']>('eva');
  const current = SOLE_LAYERS.find((l) => l.id === activeLayer) ?? SOLE_LAYERS[1];

  return (
    <div className="mt-4 rounded-2xl border-2 border-[#141414] bg-[#F4EADB] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-bold text-[#2B1D14]">
          SpaceWalk 3-layer sole diagram (X Lows)
        </span>
        <div className="flex flex-wrap gap-2">
          {SOLE_LAYERS.map((layer) => {
            const active = layer.id === activeLayer;
            return (
              <button
                key={layer.id}
                type="button"
                onClick={() => {
                  triggerHaptic(6);
                  setActiveLayer(layer.id);
                }}
                aria-pressed={active}
                className={`min-h-[48px] rounded-lg border-2 px-3 py-1.5 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414] ${
                  active
                    ? 'border-[#141414] bg-[#14161A] text-[#F4FFE0]'
                    : 'border-[#141414]/30 bg-[#FFFFFF] text-[#141414] hover:border-[#141414]'
                }`}
              >
                {layer.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-5">
        <svg
          viewBox="0 0 220 112"
          className="h-24 w-48 shrink-0"
          role="img"
          aria-label="Diagram of X Lows SpaceWalk 3-layer sole: insole, cushioned EVA insert, and natural rubber outsole"
        >
          {SOLE_LAYERS.map((layer, i) => {
            const baseY = 18 + i * 26;
            const active = layer.id === activeLayer;
            const shiftY = active ? (i === 0 ? -6 : i === 2 ? 6 : 0) : 0;
            return (
              <g
                key={layer.id}
                onClick={() => {
                  triggerHaptic(6);
                  setActiveLayer(layer.id);
                }}
                style={{
                  transform: `translateY(${shiftY}px)`,
                  transition: 'transform 180ms cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: 'pointer',
                }}
              >
                <rect
                  x="16"
                  y={baseY}
                  width="188"
                  height="21"
                  rx="7"
                  fill={layer.color}
                  stroke="#141414"
                  strokeWidth={active ? '2.5' : '1.5'}
                />
                <text
                  x="110"
                  y={baseY + 13.5}
                  textAnchor="middle"
                  fill={layer.textColor}
                  fontSize="9.5"
                  fontWeight="700"
                  fontFamily="DM Sans, sans-serif"
                >
                  {layer.name}
                </text>
              </g>
            );
          })}
        </svg>

        <p className="text-sm leading-relaxed text-[#2B1D14]">
          <strong className="text-[#141414]">{current.name}:</strong> {current.fact}
        </p>
      </div>
    </div>
  );
}

const UK_SIZES = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export function SizeAdviceVisual() {
  const [selectedUk, setSelectedUk] = useState<number>(6);
  const [womensMode, setWomensMode] = useState<boolean>(true);

  const recommendedUk = womensMode ? Math.max(3, selectedUk - 1) : selectedUk;

  return (
    <div className="mt-4 rounded-2xl border-2 border-[#141414] bg-[#DCE7F5] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-bold text-[#14213D]">
          Interactive UK 3–12 size-down check
        </span>
        <div className="inline-flex gap-1 rounded-xl border-2 border-[#14213D] bg-[#FFFFFF] p-1">
          <button
            type="button"
            aria-pressed={!womensMode}
            onClick={() => {
              triggerHaptic(6);
              setWomensMode(false);
            }}
            className={`min-h-[48px] rounded-lg px-3 text-sm font-bold transition-colors ${
              !womensMode ? 'bg-[#14213D] text-[#FFFFFF]' : 'text-[#14213D]'
            }`}
          >
            Standard UK
          </button>
          <button
            type="button"
            aria-pressed={womensMode}
            onClick={() => {
              triggerHaptic(6);
              setWomensMode(true);
            }}
            className={`min-h-[48px] rounded-lg px-3 text-sm font-bold transition-colors ${
              womensMode ? 'bg-[#FFD166] text-[#14213D]' : 'text-[#14213D]'
            }`}
          >
            Women&apos;s advice
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {UK_SIZES.map((sz) => {
          const active = sz === selectedUk;
          return (
            <button
              key={sz}
              type="button"
              onClick={() => {
                triggerHaptic(6);
                setSelectedUk(sz);
              }}
              aria-pressed={active}
              className={`min-h-[48px] min-w-[48px] rounded-lg border-2 px-2 text-sm font-extrabold tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14213D] ${
                active
                  ? 'border-[#14213D] bg-[#14213D] text-[#FFFFFF]'
                  : 'border-[#14213D]/30 bg-[#FFFFFF] text-[#14213D] hover:border-[#14213D]'
              }`}
            >
              {sz}
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-sm leading-relaxed text-[#14213D]">
        {womensMode && selectedUk > 3 ? (
          <>
            Usual UK {selectedUk} → <strong>try UK {recommendedUk}</strong> (Comet advises women to
            go one size smaller).
          </>
        ) : womensMode && selectedUk === 3 ? (
          <>
            UK 3 is the smallest listed size in the UK 3 to 12 range; check the size chart on each
            product page.
          </>
        ) : (
          <>
            Selected <strong>UK {selectedUk}</strong>.
          </>
        )}{' '}
        {selectedUk === 8
          ? 'UK 8 fits a 26.5 cm foot on Comet’s X Lows size chart.'
          : 'Check the size chart on each product page.'}
      </p>
    </div>
  );
}

export function CareMaterialVisual() {
  const [material, setMaterial] = useState<'canvas' | 'suede'>('suede');

  return (
    <div className="mt-4 rounded-2xl border-2 border-[#141414] bg-[#E9D2B8] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-bold text-[#2A1A10]">Compare upper care</span>
        <div className="inline-flex gap-1 rounded-xl border-2 border-[#2A1A10] bg-[#FFFFFF] p-1">
          <button
            type="button"
            aria-pressed={material === 'suede'}
            onClick={() => {
              triggerHaptic(6);
              setMaterial('suede');
            }}
            className={`min-h-[48px] rounded-lg px-3 text-sm font-bold transition-colors ${
              material === 'suede' ? 'bg-[#B8412A] text-[#FFFFFF]' : 'text-[#2A1A10]'
            }`}
          >
            Faux suede (Chestnut)
          </button>
          <button
            type="button"
            aria-pressed={material === 'canvas'}
            onClick={() => {
              triggerHaptic(6);
              setMaterial('canvas');
            }}
            className={`min-h-[48px] rounded-lg px-3 text-sm font-bold transition-colors ${
              material === 'canvas' ? 'bg-[#2A1A10] text-[#FFFFFF]' : 'text-[#2A1A10]'
            }`}
          >
            Canvas (Cortado)
          </button>
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-[#2A1A10]">
        {material === 'suede'
          ? 'Faux-suede upper: keep suede parts away from water. Clean different materials separately with a microfiber cloth or soft brush, wipe instead of scrubbing, avoid harsh cleaning liquids and air dry at room temperature.'
          : 'Canvas upper with a microfiber underlay and synthetic leather footbed: clean different materials separately, wipe instead of scrubbing, use a microfiber cloth or soft brush, avoid harsh cleaning liquids and air dry at room temperature.'}
      </p>
    </div>
  );
}
