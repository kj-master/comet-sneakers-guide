import { useState } from 'react';
import { ChevronDown } from './Icons';
import { FaqItem } from '../data/sneakers';
import { slugifyFaqId, triggerHaptic } from '../utils/device';

interface FaqAccordionProps {
  items: FaqItem[];
  defaultOpenCount?: number;
  headingLevel?: 'h3' | 'h4';
  idPrefix: string;
  showStickerNumbers?: boolean;
  showExpandCollapse?: boolean;
}

const STICKER_COLORS = [
  { bg: '#FFD166', fg: '#141414', rot: '-3deg' },
  { bg: '#C6FF3D', fg: '#14161A', rot: '2deg' },
  { bg: '#FF8A5B', fg: '#2B1D14', rot: '-2deg' },
  { bg: '#DCE7F5', fg: '#14213D', rot: '3deg' },
];

export function FaqAccordion({
  items,
  defaultOpenCount = 0,
  headingLevel = 'h3',
  idPrefix,
  showStickerNumbers = false,
  showExpandCollapse = false,
}: FaqAccordionProps) {
  const [openIndices, setOpenIndices] = useState<Record<number, boolean>>(() => {
    const initial: Record<number, boolean> = {};
    for (let i = 0; i < Math.min(defaultOpenCount, items.length); i++) {
      initial[i] = true;
    }
    return initial;
  });

  const toggle = (index: number) => {
    triggerHaptic(6);
    setOpenIndices((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const expandAll = () => {
    triggerHaptic(8);
    const next: Record<number, boolean> = {};
    items.forEach((_, idx) => {
      next[idx] = true;
    });
    setOpenIndices(next);
  };

  const collapseAll = () => {
    triggerHaptic(8);
    setOpenIndices({});
  };

  const HeadingTag = headingLevel;

  return (
    <div>
      {showExpandCollapse && (
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={expandAll}
            className="inline-flex min-h-[48px] items-center justify-center rounded-xl border-2 border-[#141414] bg-[#FFFFFF] px-4 py-2 text-sm font-bold text-[#141414] shadow-[2px_2px_0px_#141414] transition-transform active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414]"
          >
            Expand all
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="inline-flex min-h-[48px] items-center justify-center rounded-xl border-2 border-[#141414] bg-[#EFEAE1] px-4 py-2 text-sm font-bold text-[#141414] shadow-[2px_2px_0px_#141414] transition-transform active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414]"
          >
            Collapse all
          </button>
        </div>
      )}

      <div className="space-y-3">
        {items.map((item, idx) => {
          const isOpen = Boolean(openIndices[idx]);
          const buttonId = `${idPrefix}-btn-${idx}`;
          const panelId = `${idPrefix}-panel-${idx}`;
          const headingId = slugifyFaqId(item.q);
          const sticker = STICKER_COLORS[idx % STICKER_COLORS.length];

          return (
            <div
              key={item.q}
              className="rounded-[20px] border-2 border-[#141414] bg-[#FFFFFF] transition-shadow"
              style={{ boxShadow: isOpen ? '4px 4px 0px #141414' : '2px 2px 0px #141414' }}
            >
              <HeadingTag
                id={headingId}
                className="font-display scroll-mt-20 text-base font-bold text-[#141414] sm:text-lg"
              >
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(idx)}
                  className="flex min-h-[56px] w-full items-center justify-between gap-3 px-4 py-3.5 text-left sm:px-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414]"
                >
                  <span className="flex items-center gap-3">
                    {showStickerNumbers && (
                      <span
                        aria-hidden="true"
                        className="sticker-badge font-display inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-[#141414] text-sm font-extrabold tabular-nums"
                        style={{
                          backgroundColor: sticker.bg,
                          color: sticker.fg,
                          transform: `rotate(${sticker.rot})`,
                        }}
                      >
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    )}
                    <span>{item.q}</span>
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-[#141414] transition-transform duration-150 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
              </HeadingTag>

              {/* Keep all answers in the DOM */}
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                hidden={!isOpen}
                className={`pb-4 text-base leading-relaxed text-[#2B1D14] ${
                  showStickerNumbers ? 'pl-14 pr-4 sm:pl-16 sm:pr-5' : 'px-4 sm:px-5'
                }`}
              >
                {item.a}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
