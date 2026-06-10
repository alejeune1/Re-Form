import { useId } from 'react';

type PatchedTypographyProps = {
  className?: string;
};

const panels = [
  { points: '-40,18 178,-10 225,168 70,232 -48,166', fill: 'denimDark' },
  { points: '125,-16 352,10 320,220 178,250', fill: 'canvas' },
  { points: '294,18 510,-12 536,164 342,222', fill: 'ecru' },
  { points: '424,126 620,70 666,276 470,300', fill: 'sage' },
  { points: '584,0 780,22 748,202 632,276', fill: 'denim' },
  { points: '704,104 920,60 954,282 746,302', fill: 'brown' },
  { points: '862,-10 1096,20 1060,190 906,240', fill: 'sand' },
  { points: '1010,112 1214,54 1268,278 1056,302', fill: 'denimDark' },
  { points: '1146,18 1320,-8 1348,176 1196,238', fill: 'ecru' },
];

const seamPaths = [
  { d: 'M182 4 C160 72 174 152 224 232', width: 7 },
  { d: 'M336 18 C300 92 324 168 386 232', width: 6 },
  { d: 'M516 4 C492 86 530 168 620 244', width: 7 },
  { d: 'M746 18 C720 94 750 184 846 260', width: 6 },
  { d: 'M944 28 C900 100 926 180 1046 238', width: 7 },
  { d: 'M1164 28 C1118 88 1148 170 1258 230', width: 6 },
  { d: 'M66 224 C256 176 448 198 634 236', width: 6 },
  { d: 'M690 236 C850 196 1018 198 1198 240', width: 6 },
];

const handStitches = [
  'M166 52 l26 18 M184 48 l-14 28',
  'M188 126 l30 14 M206 120 l-14 30',
  'M326 76 l30 20 M348 70 l-18 32',
  'M520 92 l34 16 M542 84 l-14 34',
  'M746 112 l34 18 M768 104 l-16 34',
  'M930 124 l36 18 M954 116 l-18 36',
  'M1142 110 l34 18 M1164 102 l-16 34',
  'M270 190 l36 14 M294 184 l-18 30',
  'M840 218 l38 14 M864 210 l-18 32',
  'M1032 212 l38 16 M1058 204 l-20 34',
];

export default function PatchedTypography({ className = '' }: PatchedTypographyProps) {
  const rawId = useId().replace(/:/g, '');
  const id = `patched-title-${rawId}`;
  const textProps = {
    x: 10,
    y: 250,
    textLength: 1240,
    lengthAdjust: 'spacingAndGlyphs',
    fontFamily: 'Arial Black, Inter, system-ui, sans-serif',
    fontSize: 214,
    fontWeight: 950,
    letterSpacing: -12,
  } as const;

  return (
    <svg
      className={className}
      viewBox="0 0 1320 330"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMinYMid meet"
    >
      <defs>
        <filter id={`${id}-soft-volume`} x="-8%" y="-18%" width="116%" height="142%">
          <feDropShadow dx="0" dy="18" stdDeviation="11" floodColor="#5A4632" floodOpacity="0.22" />
          <feDropShadow dx="-2" dy="-3" stdDeviation="2" floodColor="#FFF7EA" floodOpacity="0.72" />
          <feDropShadow dx="2" dy="4" stdDeviation="2.2" floodColor="#6B5238" floodOpacity="0.22" />
        </filter>

        <filter id={`${id}-grain`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.78" numOctaves="2" seed="8" result="noise" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="table" tableValues="0 0.16" />
          </feComponentTransfer>
        </filter>

        <pattern id={`${id}-denimDark`} width="34" height="34" patternUnits="userSpaceOnUse" patternTransform="rotate(-18)">
          <rect width="34" height="34" fill="#435C72" />
          <path d="M0 7H34M0 17H34M0 27H34" stroke="#243D51" strokeWidth="2.2" opacity="0.5" />
          <path d="M8 0V34M22 0V34" stroke="#D7CEC0" strokeWidth="1.1" opacity="0.22" />
        </pattern>
        <pattern id={`${id}-denim`} width="32" height="32" patternUnits="userSpaceOnUse" patternTransform="rotate(12)">
          <rect width="32" height="32" fill="#6F8799" />
          <path d="M0 8H32M0 18H32M0 28H32" stroke="#415A70" strokeWidth="2" opacity="0.45" />
          <path d="M5 0V32M19 0V32" stroke="#ECDFCC" strokeWidth="1" opacity="0.18" />
        </pattern>
        <pattern id={`${id}-canvas`} width="30" height="30" patternUnits="userSpaceOnUse" patternTransform="rotate(6)">
          <rect width="30" height="30" fill="#D3BE9C" />
          <path d="M0 6H30M0 17H30M6 0V30M19 0V30" stroke="#81694A" strokeWidth="1.3" opacity="0.34" />
        </pattern>
        <pattern id={`${id}-ecru`} width="30" height="30" patternUnits="userSpaceOnUse">
          <rect width="30" height="30" fill="#F0E3CF" />
          <path d="M0 9H30M0 21H30M9 0V30M22 0V30" stroke="#B9A280" strokeWidth="1.1" opacity="0.26" />
        </pattern>
        <pattern id={`${id}-sage`} width="32" height="32" patternUnits="userSpaceOnUse" patternTransform="rotate(24)">
          <rect width="32" height="32" fill="#7F8C6E" />
          <path d="M0 10H32M0 22H32" stroke="#4E5945" strokeWidth="1.7" opacity="0.4" />
          <path d="M7 0V32M21 0V32" stroke="#D5D2BD" strokeWidth="1" opacity="0.2" />
        </pattern>
        <pattern id={`${id}-brown`} width="30" height="30" patternUnits="userSpaceOnUse" patternTransform="rotate(-8)">
          <rect width="30" height="30" fill="#7A5D3E" />
          <path d="M0 8H30M0 20H30" stroke="#422F21" strokeWidth="1.7" opacity="0.42" />
          <path d="M8 0V30M20 0V30" stroke="#C8AD86" strokeWidth="1" opacity="0.28" />
        </pattern>
        <pattern id={`${id}-sand`} width="30" height="30" patternUnits="userSpaceOnUse" patternTransform="rotate(18)">
          <rect width="30" height="30" fill="#BCA789" />
          <path d="M0 7H30M0 18H30M8 0V30M21 0V30" stroke="#765D3F" strokeWidth="1.2" opacity="0.3" />
        </pattern>

        <clipPath id={`${id}-text-clip`}>
          <text {...textProps}>à la matière.</text>
        </clipPath>
      </defs>

      <g filter={`url(#${id}-soft-volume)`}>
        <text {...textProps} fill="none" stroke="#6F5438" strokeWidth="18" strokeLinejoin="round" opacity="0.28">
          à la matière.
        </text>

        <g clipPath={`url(#${id}-text-clip)`}>
          <rect x="-40" y="-20" width="1400" height="380" fill="#E8DCC8" />
          {panels.map((panel) => (
            <polygon key={panel.points} points={panel.points} fill={`url(#${id}-${panel.fill})`} />
          ))}
          <rect x="-40" y="-20" width="1400" height="380" filter={`url(#${id}-grain)`} opacity="0.75" />

          <g opacity="0.82">
            {seamPaths.map((seam) => (
              <path
                key={seam.d}
                d={seam.d}
                fill="none"
                stroke="#493623"
                strokeWidth={seam.width}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="26 18"
              />
            ))}
          </g>

          <g opacity="0.9">
            {handStitches.map((stitch) => (
              <path
                key={stitch}
                d={stitch}
                fill="none"
                stroke="#EADDC9"
                strokeWidth="4.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </g>

          <path
            d="M14 62 C246 32 452 48 650 82 C830 112 1030 80 1278 44"
            fill="none"
            stroke="#FFF7EA"
            strokeWidth="18"
            strokeLinecap="round"
            opacity="0.12"
          />
          <path
            d="M42 270 C270 226 520 254 720 270 C910 286 1080 258 1270 230"
            fill="none"
            stroke="#4F3B29"
            strokeWidth="22"
            strokeLinecap="round"
            opacity="0.12"
          />
        </g>

        <text {...textProps} fill="none" stroke="#3D2C1E" strokeWidth="3.2" strokeLinejoin="round" opacity="0.2">
          à la matière.
        </text>
      </g>
    </svg>
  );
}
