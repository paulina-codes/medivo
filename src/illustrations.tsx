import React from 'react';

/*
 * Medivo – gezeichnete Illustrationen
 * ------------------------------------
 * Alle Motive sind als SVG im Stil „Linie + leicht versetzte Farbfläche" gezeichnet.
 * Ein gemeinsamer Filter (#md-hand) lässt die Linien minimal wackeln, damit sie
 * handgezeichnet wirken. Jede Form wird zweimal gerendert:
 *   1. als Farbfläche, leicht versetzt darunter (Riso-/Stempel-Look)
 *   2. als Fläche mit Kontur darüber – spätere Formen verdecken frühere
 *
 * Klassen innerhalb der Motive:
 *   .ink      → mit Linienfarbe gefüllt (Augen, Punkte)
 *   .hl       → weißer Glanzpunkt
 *   .nostroke → nur Farbfläche, keine Kontur (Wangen, Flecken)
 *
 * Eigene Zeichnungen (z. B. die Katze) lassen sich einfach austauschen:
 * Komponente ersetzen oder ein <img src="cat.svg"> zurückgeben.
 */

const C = {
  sage: '#B3C8AC', sageL: '#D6E3CF', sageD: '#8FAA8B',
  rose: '#F2B7B0', roseL: '#F8DAD5', roseD: '#E79B93',
  peach: '#F6C8A2', butter: '#F5D68C', sky: '#B4D3DD', skyL: '#DCEBF0',
  lav: '#CDC1E5', blue: '#AFC2DD', fur: '#FFF8F1', patch: '#EDC096',
  brown: '#CF9A6E', brownD: '#B98157', stone: '#E6E1DB', white: '#FFFFFF',
};

export const IllDefs = () => (
  <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
    <filter id="md-hand" x="-15%" y="-15%" width="130%" height="130%">
      <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="11" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.6" xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </svg>
);

export type IllProps = { size?: number; className?: string; title?: string };

function Ill({ vb = 64, size = 40, className = '', title, children }: IllProps & { vb?: number; children: React.ReactNode }) {
  const dx = (vb * 0.022).toFixed(2);
  const dy = (vb * 0.026).toFixed(2);
  return (
    <svg
      className={`ill ${className}`}
      viewBox={`0 0 ${vb} ${vb}`}
      width={size}
      height={size}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <g filter="url(#md-hand)">
        <g className="ill-fill" transform={`translate(${dx} ${dy})`}>{children}</g>
        <g className="ill-line">{children}</g>
      </g>
    </svg>
  );
}

/* ---------- Marke ---------- */

export const Sprout = (p: IllProps) => (
  <Ill {...p}>
    <path d="M32 56 C32 46 32 38 31 29" fill="none" />
    <path d="M31 36 C21 36 13 29 12 18 C23 17 30 24 31 36 Z" fill={C.sage} />
    <path d="M32 29 C33 17 41 9 53 9 C53 21 45 29 32 29 Z" fill={C.sageL} />
    <path d="M18 22 C23 26 27 30 30 34" fill="none" />
    <path d="M48 13 C43 18 38 23 34 27" fill="none" />
  </Ill>
);

/* ---------- Companion: Katze ---------- */

export type CatMood = 'happy' | 'cheer' | 'sleepy';

export const Cat = ({ mood = 'happy', ...p }: IllProps & { mood?: CatMood }) => (
  <Ill vb={160} {...p}>
    {/* Schwanz */}
    <path d="M106 128 C130 130 144 112 139 97 C136 88 127 87 125 94 C129 104 123 116 105 117 Z" fill={C.fur} />
    <path d="M131 92 C136 92 139 96 139 100 C135 101 131 99 129 95 Z" className="nostroke" fill={C.patch} />
    {/* Körper */}
    <path d="M48 132 C42 106 52 84 80 83 C108 84 118 106 112 132 Z" fill={C.fur} />
    <path d="M90 88 C102 90 110 100 112 112 C102 110 94 100 90 88 Z" className="nostroke" fill={C.patch} />
    <path d="M70 100 C74 106 86 106 90 100" fill="none" />
    {/* Pfoten */}
    <ellipse cx="65" cy="131" rx="11" ry="6.5" fill={C.fur} />
    <ellipse cx="95" cy="131" rx="11" ry="6.5" fill={C.fur} />
    {mood === 'cheer' && <path d="M112 100 C122 92 126 82 122 76 C118 72 112 76 112 84" fill={C.fur} />}
    {/* Ohren */}
    <path d="M40 54 L38 18 L66 38 Z" fill={C.fur} />
    <path d="M45 46 L44 28 L59 39 Z" className="nostroke" fill={C.roseL} />
    <path d="M120 54 L122 18 L94 38 Z" fill={C.fur} />
    <path d="M115 46 L116 28 L101 39 Z" className="nostroke" fill={C.roseL} />
    {/* Kopf */}
    <path d="M32 68 C30 45 51 34 80 34 C109 34 130 45 128 68 C126 90 107 98 80 98 C53 98 34 90 32 68 Z" fill={C.fur} />
    <path d="M93 36 C106 36 120 42 125 55 C113 57 100 50 93 36 Z" className="nostroke" fill={C.patch} />
    <path d="M44 44 C50 40 56 39 60 40 C56 46 50 48 44 44 Z" className="nostroke" fill={C.brown} />
    {/* Gesicht */}
    {mood === 'sleepy' ? (
      <>
        <path d="M56 66 Q63 70 70 66" fill="none" />
        <path d="M90 66 Q97 70 104 66" fill="none" />
      </>
    ) : mood === 'cheer' ? (
      <>
        <path d="M56 67 Q63 59 70 67" fill="none" />
        <path d="M90 67 Q97 59 104 67" fill="none" />
      </>
    ) : (
      <>
        <ellipse cx="63" cy="64" rx="5.2" ry="6" className="ink" />
        <circle cx="65" cy="61.5" r="1.8" className="hl" />
        <ellipse cx="97" cy="64" rx="5.2" ry="6" className="ink" />
        <circle cx="99" cy="61.5" r="1.8" className="hl" />
      </>
    )}
    <path d="M77 73 L83 73 L80 76.5 Z" fill={C.roseD} />
    <path d="M80 76.5 Q77 81 72.5 78.5 M80 76.5 Q83 81 87.5 78.5" fill="none" />
    <ellipse cx="54" cy="78" rx="7.5" ry="4.2" className="nostroke" fill={C.rose} />
    <ellipse cx="106" cy="78" rx="7.5" ry="4.2" className="nostroke" fill={C.rose} />
    <path d="M40 72 L26 69 M41 77 L27 79 M120 72 L134 69 M119 77 L133 79" fill="none" />
    {/* Herz / Zzz */}
    {mood === 'sleepy' ? (
      <path d="M128 30 H138 L128 42 H138 M142 16 H149 L142 25 H149" fill="none" />
    ) : (
      <path d="M140 46 C132 40 129 36 129 32 C129 28 132 26 135 26 C137 26 139 27.5 140 29.5 C141 27.5 143 26 145 26 C148 26 151 28 151 32 C151 36 148 40 140 46 Z" fill={C.rose} />
    )}
  </Ill>
);

/** Nur der Katzenkopf – für Modus-Kachel und Avatar */
export const CatHead = (p: IllProps) => (
  <Ill {...p}>
    <path d="M12 30 L11 9 L27 20 Z" fill={C.fur} />
    <path d="M52 30 L53 9 L37 20 Z" fill={C.fur} />
    <path d="M15 25 L14.5 15 L23 21 Z" className="nostroke" fill={C.roseL} />
    <path d="M49 25 L49.5 15 L41 21 Z" className="nostroke" fill={C.roseL} />
    <path d="M8 36 C7 24 18 18 32 18 C46 18 57 24 56 36 C55 48 45 53 32 53 C19 53 9 48 8 36 Z" fill={C.fur} />
    <path d="M38 19 C46 19 53 23 55 30 C48 30 42 26 38 19 Z" className="nostroke" fill={C.patch} />
    <ellipse cx="24" cy="35" rx="2.8" ry="3.2" className="ink" />
    <ellipse cx="40" cy="35" rx="2.8" ry="3.2" className="ink" />
    <circle cx="25" cy="33.6" r="0.9" className="hl" />
    <circle cx="41" cy="33.6" r="0.9" className="hl" />
    <path d="M30.5 40 L33.5 40 L32 41.8 Z" fill={C.roseD} />
    <path d="M32 41.8 Q30 44 28 42.6 M32 41.8 Q34 44 36 42.6" fill="none" />
    <ellipse cx="19" cy="42" rx="3.6" ry="2" className="nostroke" fill={C.rose} />
    <ellipse cx="45" cy="42" rx="3.6" ry="2" className="nostroke" fill={C.rose} />
  </Ill>
);

/* ---------- Modi ---------- */

export const Trophy = (p: IllProps) => (
  <Ill {...p}>
    <path d="M21 16 H13 C12 27 16 31 22 31" fill="none" />
    <path d="M43 16 H51 C52 27 48 31 42 31" fill="none" />
    <path d="M20 11 H44 V24 C44 34 39 40 32 40 C25 40 20 34 20 24 Z" fill={C.butter} />
    <path d="M26 16 V26" fill="none" />
    <path d="M29 40 H35 V47 H29 Z" fill={C.brown} />
    <path d="M21 47 H43 V54 H21 Z" fill={C.brownD} />
  </Ill>
);

export const Bolt = ({ color = C.sky, ...p }: IllProps & { color?: string }) => (
  <Ill {...p}>
    <path d="M37 6 L15 37 H30 L25 58 L49 25 H34 Z" fill={color} />
    <path d="M52 12 L56 8 M54 20 L59 19" fill="none" />
  </Ill>
);

export const MoonIll = (p: IllProps) => (
  <Ill {...p}>
    <path d="M42 9 C29 11 20 21 20 34 C20 47 31 56 44 54 C34 50 27 42 27 32 C27 22 33 14 42 9 Z" fill={C.butter} />
    <path d="M47 22 L47 28 M44 25 L50 25" fill="none" />
    <circle cx="52" cy="38" r="1.6" className="ink" />
  </Ill>
);

export const Puzzle = (p: IllProps) => (
  <Ill {...p}>
    <path d="M12 20 H25 C23 14 27 9 32 9 C37 9 41 14 39 20 H52 V32 C58 30 61 34 61 38 C61 43 57 46 52 44 V56 H12 V44 C18 46 21 42 21 38 C21 34 18 30 12 32 Z" fill={C.blue} />
  </Ill>
);

export const Grandma = (p: IllProps) => (
  <Ill {...p}>
    <circle cx="32" cy="12" r="7" fill={C.stone} />
    <circle cx="32" cy="36" r="19" fill="#F7DFCF" />
    <path d="M13 35 C13 21 21 16 32 16 C43 16 51 21 51 35 C45 28 39 25 32 25 C25 25 19 28 13 35 Z" fill={C.stone} />
    <circle cx="25" cy="38" r="5" fill="none" />
    <circle cx="39" cy="38" r="5" fill="none" />
    <path d="M30 38 H34" fill="none" />
    <circle cx="25" cy="38" r="1.4" className="ink" />
    <circle cx="39" cy="38" r="1.4" className="ink" />
    <path d="M27 47 Q32 51 37 47" fill="none" />
    <ellipse cx="19" cy="45" rx="3.4" ry="2" className="nostroke" fill={C.rose} />
    <ellipse cx="45" cy="45" rx="3.4" ry="2" className="nostroke" fill={C.rose} />
  </Ill>
);

/* ---------- Gamification ---------- */

export const Star = (p: IllProps) => (
  <Ill {...p}>
    <path d="M32 7 L39.5 23.5 L57 25 L44 37 L48 54 L32 45 L16 54 L20 37 L7 25 L24.5 23.5 Z" fill={C.butter} />
    <path d="M25 31 Q27 29 29 31 M35 31 Q37 29 39 31 M28 37 Q32 40 36 37" fill="none" />
  </Ill>
);

export const Gamepad = (p: IllProps) => (
  <Ill {...p}>
    <path d="M15 22 C8 22 5 30 5 38 C5 46 9 51 14 51 C19 51 21 45 25 42 H39 C43 45 45 51 50 51 C55 51 59 46 59 38 C59 30 56 22 49 22 Z" fill={C.roseD} />
    <path d="M17 31 V41 M12 36 H22" fill="none" />
    <circle cx="44" cy="32" r="2.6" fill={C.butter} />
    <circle cx="50" cy="38" r="2.6" fill={C.white} />
  </Ill>
);

export const Chest = (p: IllProps) => (
  <Ill {...p}>
    <path d="M9 30 H55 V54 H9 Z" fill={C.brown} />
    <path d="M9 30 C9 18 18 13 32 13 C46 13 55 18 55 30 Z" fill={C.peach} />
    <path d="M9 38 H55 M20 14.5 V30 M44 14.5 V30" fill="none" />
    <path d="M28 33 H36 V42 H28 Z" fill={C.butter} />
    <path d="M56 8 L58 13 L63 15 L58 17 L56 22 L54 17 L49 15 L54 13 Z" fill={C.butter} />
  </Ill>
);

export const Sparkle = ({ color = C.butter, ...p }: IllProps & { color?: string }) => (
  <Ill {...p}>
    <path d="M30 6 C32 23 37 28 54 30 C37 32 32 37 30 54 C28 37 23 32 6 30 C23 28 28 23 30 6 Z" fill={color} />
    <path d="M51 46 L52.5 50 L56.5 51.5 L52.5 53 L51 57 L49.5 53 L45.5 51.5 L49.5 50 Z" fill={C.white} />
  </Ill>
);

/* ---------- Gesundheit ---------- */

export const PillIll = (p: IllProps) => (
  <Ill {...p}>
    <g transform="rotate(-38 32 32)">
      <path d="M32 22 H19 A10 10 0 0 0 19 42 H32 Z" fill={C.rose} />
      <path d="M32 22 H45 A10 10 0 0 1 45 42 H32 Z" fill={C.white} />
      <path d="M17 27 Q15 30 16 33" fill="none" />
    </g>
  </Ill>
);

export const HeartIll = ({ color = C.rose, ...p }: IllProps & { color?: string }) => (
  <Ill {...p}>
    <path d="M32 54 C14 42 8 32 8 23 C8 15 14 10 21 10 C26 10 30 13 32 17 C34 13 38 10 43 10 C50 10 56 15 56 23 C56 32 50 42 32 54 Z" fill={color} />
    <path d="M16 22 C16 18 18 16 21 16" fill="none" />
  </Ill>
);

export const FlowerIll = (p: IllProps) => (
  <Ill {...p}>
    <path d="M32 40 C32 48 31 54 30 59 M31 51 C26 48 22 48 19 50 C23 54 27 54 31 51" fill="none" />
    <circle cx="32" cy="15" r="8" fill={C.roseL} />
    <circle cx="44" cy="24" r="8" fill={C.roseL} />
    <circle cx="40" cy="38" r="8" fill={C.roseL} />
    <circle cx="24" cy="38" r="8" fill={C.roseL} />
    <circle cx="20" cy="24" r="8" fill={C.roseL} />
    <circle cx="32" cy="28" r="7" fill={C.butter} />
  </Ill>
);

export const Glass = (p: IllProps) => (
  <Ill {...p}>
    <path d="M17 10 H47 L43 56 H21 Z" fill="#F4FAFB" />
    <path d="M19.5 28 C25 25 30 31 36 28 C40 26 43 27 44.7 28 L43 56 H21 Z" className="nostroke" fill={C.sky} />
    <path d="M19.5 28 C25 25 30 31 36 28 C40 26 43 27 44.7 28" fill="none" />
    <path d="M24 36 V48" fill="none" />
  </Ill>
);

export const CalendarIll = (p: IllProps) => (
  <Ill {...p}>
    <path d="M10 16 H54 V54 H10 Z" fill={C.white} />
    <path d="M10 16 H54 V26 H10 Z" fill={C.rose} />
    <path d="M21 10 V20 M43 10 V20" fill="none" />
    <circle cx="21" cy="36" r="2" className="ink" />
    <circle cx="32" cy="36" r="2" className="ink" />
    <circle cx="43" cy="36" r="4" fill={C.sage} />
    <circle cx="21" cy="46" r="2" className="ink" />
    <circle cx="32" cy="46" r="2" className="ink" />
  </Ill>
);

export const Clipboard = (p: IllProps) => (
  <Ill {...p}>
    <path d="M13 12 H51 V58 H13 Z" fill={C.peach} />
    <path d="M18 18 H46 V53 H18 Z" fill={C.white} />
    <path d="M25 8 H39 V16 H25 Z" fill={C.sage} />
    <path d="M23 28 H41 M23 35 H41 M23 42 H34" fill="none" />
  </Ill>
);

export const Shield = (p: IllProps) => (
  <Ill {...p}>
    <path d="M32 7 L52 15 V30 C52 44 43 52 32 57 C21 52 12 44 12 30 V15 Z" fill={C.sageL} />
    <path d="M24 32 L30 38 L41 25" fill="none" />
  </Ill>
);

export const GlobeIll = (p: IllProps) => (
  <Ill {...p}>
    <circle cx="32" cy="32" r="23" fill={C.skyL} />
    <path d="M19 20 C25 22 24 30 30 31 C35 32 33 40 27 42 C24 43 22 48 23 52" className="nostroke" fill={C.sage} />
    <path d="M9 32 H55 M32 9 C22 18 22 46 32 55 C42 46 42 18 32 9" fill="none" />
  </Ill>
);

export const Brain = (p: IllProps) => (
  <Ill {...p}>
    <path d="M31 13 C25 9 15 12 15 20 C9 22 8 32 14 35 C11 43 19 50 25 46 C27 52 31 52 31 48 Z" fill={C.roseL} />
    <path d="M33 13 C39 9 49 12 49 20 C55 22 56 32 50 35 C53 43 45 50 39 46 C37 52 33 52 33 48 Z" fill={C.roseL} />
    <path d="M20 24 C23 24 25 26 25 29 M21 38 C24 37 27 38 28 41 M44 24 C41 24 39 26 39 29 M43 38 C40 37 37 38 36 41" fill="none" />
  </Ill>
);

export const Drop = (p: IllProps) => (
  <Ill {...p}>
    <path d="M32 7 C32 7 13 30 13 41 C13 51 21 57 32 57 C43 57 51 51 51 41 C51 30 32 7 32 7 Z" fill={C.sky} />
    <path d="M22 42 C22 47 25 50 29 51" fill="none" />
  </Ill>
);

export const Butterfly = (p: IllProps) => (
  <Ill {...p}>
    <path d="M31 30 C24 14 9 10 8 20 C7 28 16 32 31 32 Z" fill={C.lav} />
    <path d="M33 30 C40 14 55 10 56 20 C57 28 48 32 33 32 Z" fill={C.lav} />
    <path d="M31 34 C20 34 13 40 16 48 C19 54 27 48 31 36 Z" fill={C.roseL} />
    <path d="M33 34 C44 34 51 40 48 48 C45 54 37 48 33 36 Z" fill={C.roseL} />
    <path d="M32 24 V50 M32 24 C30 19 27 16 24 15 M32 24 C34 19 37 16 40 15" fill="none" />
  </Ill>
);

export const Leaf = (p: IllProps) => (
  <Ill {...p}>
    <path d="M12 52 C10 30 24 12 54 10 C54 38 38 54 12 52 Z" fill={C.sage} />
    <path d="M12 52 C22 40 32 30 44 20" fill="none" />
  </Ill>
);

export const Cloud = (p: IllProps) => (
  <Ill {...p}>
    <path d="M16 46 C8 46 6 36 13 33 C12 24 22 20 28 25 C31 16 46 16 47 28 C55 28 58 36 54 42 C52 45 49 46 46 46 Z" fill={C.blue} />
    <path d="M22 52 L20 57 M32 52 L30 57 M42 52 L40 57" fill="none" />
  </Ill>
);

export const Belly = (p: IllProps) => (
  <Ill {...p}>
    <circle cx="32" cy="32" r="22" fill={C.peach} />
    <path d="M32 32 C32 29 36 29 36 32 C36 37 28 37 28 32 C28 25 40 25 40 32 C40 41 24 41 24 32" fill="none" />
  </Ill>
);

export type FaceKind = 'great' | 'good' | 'okay' | 'low' | 'sleepy' | 'queasy';

const faceFill: Record<FaceKind, string> = {
  great: C.butter, good: C.sageL, okay: C.skyL, low: C.lav, sleepy: C.lav, queasy: '#D9E6C3',
};

export const Face = ({ kind = 'good', ...p }: IllProps & { kind?: FaceKind }) => (
  <Ill {...p}>
    <circle cx="32" cy="33" r="22" fill={faceFill[kind]} />
    {kind === 'sleepy' || kind === 'great' ? (
      <path d={kind === 'great' ? 'M21 30 Q25 25 29 30 M35 30 Q39 25 43 30' : 'M21 30 Q25 33 29 30 M35 30 Q39 33 43 30'} fill="none" />
    ) : (
      <>
        <circle cx="25" cy="30" r="2.4" className="ink" />
        <circle cx="39" cy="30" r="2.4" className="ink" />
      </>
    )}
    {kind === 'great' && <path d="M23 39 Q32 48 41 39 Z" fill={C.white} />}
    {kind === 'good' && <path d="M25 40 Q32 45 39 40" fill="none" />}
    {kind === 'okay' && <path d="M25 42 H39" fill="none" />}
    {kind === 'low' && <path d="M25 44 Q32 39 39 44" fill="none" />}
    {kind === 'sleepy' && <path d="M29 42 Q32 44 35 42 M46 12 H53 L46 20 H53" fill="none" />}
    {kind === 'queasy' && <path d="M24 42 Q27 39 30 42 Q33 45 36 42 Q39 39 41 42" fill="none" />}
    {(kind === 'great' || kind === 'good') && (
      <>
        <ellipse cx="19" cy="38" rx="3.4" ry="2" className="nostroke" fill={C.rose} />
        <ellipse cx="45" cy="38" rx="3.4" ry="2" className="nostroke" fill={C.rose} />
      </>
    )}
  </Ill>
);

/* ---------- Hilfen für die App ---------- */

export const illColors = C;

/** Wählt eine passende Illustration für ein frei eingegebenes Symptom */
export function SymptomIll({ name, size = 30 }: { name: string; size?: number }) {
  const n = name.toLowerCase();
  if (n.includes('kopf') || n.includes('migr')) return <Brain size={size} />;
  if (n.includes('schmerz')) return <Bolt size={size} color={C.rose} />;
  if (n.includes('müd') || n.includes('fatigue') || n.includes('erschöpf')) return <Face kind="sleepy" size={size} />;
  if (n.includes('übel')) return <Face kind="queasy" size={size} />;
  if (n.includes('angst') || n.includes('stress') || n.includes('stimmung')) return <Cloud size={size} />;
  if (n.includes('schlaf')) return <MoonIll size={size} />;
  if (n.includes('verdau') || n.includes('bauch') || n.includes('magen')) return <Belly size={size} />;
  return <HeartIll size={size} />;
}
