interface WavyDividerProps {
  topColor: string;
  bottomColor: string;
  variant?: 'wave' | 'torn';
}

export function WavyDivider({
  topColor,
  bottomColor,
  variant = 'wave',
}: WavyDividerProps) {
  return (
    <div
      aria-hidden="true"
      className="relative w-full overflow-hidden leading-none mood-transition"
      style={{ backgroundColor: topColor }}
    >
      {variant === 'wave' ? (
        <svg
          viewBox="0 0 1440 48"
          preserveAspectRatio="none"
          className="block h-7 w-full sm:h-10"
        >
          <path
            d="M0,22 C180,46 360,2 540,22 C720,42 900,4 1080,24 C1260,44 1350,14 1440,22 L1440,48 L0,48 Z"
            fill={bottomColor}
            className="mood-transition"
          />
          <path
            d="M0,22 C180,46 360,2 540,22 C720,42 900,4 1080,24 C1260,44 1350,14 1440,22"
            fill="none"
            stroke="#141414"
            strokeWidth="2.5"
          />
        </svg>
      ) : (
        <svg
          viewBox="0 0 1440 42"
          preserveAspectRatio="none"
          className="block h-6 w-full sm:h-9"
        >
          <path
            d="M0,20 L60,12 L120,24 L180,10 L240,22 L300,14 L360,26 L420,12 L480,22 L540,14 L600,25 L660,11 L720,23 L780,13 L840,24 L900,10 L960,22 L1020,14 L1080,25 L1140,12 L1200,22 L1260,13 L1320,24 L1380,12 L1440,20 L1440,42 L0,42 Z"
            fill={bottomColor}
            className="mood-transition"
          />
          <path
            d="M0,20 L60,12 L120,24 L180,10 L240,22 L300,14 L360,26 L420,12 L480,22 L540,14 L600,25 L660,11 L720,23 L780,13 L840,24 L900,10 L960,22 L1020,14 L1080,25 L1140,12 L1200,22 L1260,13 L1320,24 L1380,12 L1440,20"
            fill="none"
            stroke="#141414"
            strokeWidth="2"
          />
        </svg>
      )}
    </div>
  );
}
