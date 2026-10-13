import React from 'react';
import { Product } from '../types';

interface ProductVisualProps {
  product: Product;
  className?: string;
  zoom?: boolean;
}

export const ProductVisual: React.FC<ProductVisualProps> = ({ product, className = '', zoom = false }) => {
  const [imageError, setImageError] = React.useState(false);

  if (product.imageUrl && !imageError) {
    return (
      <div className={`relative overflow-hidden bg-[#F6F1E7] flex items-center justify-center ${className}`}>
        <img
          src={product.imageUrl}
          alt={product.title}
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
            zoom ? 'hover:scale-105' : ''
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1B1A]/20 via-transparent to-transparent pointer-events-none" />
      </div>
    );
  }

  // Museum-grade handcrafted metallic brass vector illustrations
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-b from-[#F9F6F0] via-[#F3EDE2] to-[#EAE1D1] flex items-center justify-center select-none ${className}`}
    >
      {/* Subtle radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#DFC085]/20 via-transparent to-transparent pointer-events-none" />
      
      {/* Background blueprint/grid lines */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#1C1B1A 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />

      <div className={`relative z-10 w-full h-full flex items-center justify-center p-6 transition-transform duration-500 ${zoom ? 'group-hover:scale-105' : ''}`}>
        {renderPresetSvg(product.svgPreset)}
      </div>

      {/* Brass hallmark insignia badge */}
      <div className="absolute bottom-2 right-2 text-[10px] uppercase font-serif tracking-widest text-[#9A7730]/60 pointer-events-none">
        VC·BRASS
      </div>
    </div>
  );
};

function renderPresetSvg(preset: Product['svgPreset']) {
  switch (preset) {
    case 'telescope':
      return (
        <svg viewBox="0 0 320 240" className="w-full h-full max-h-56 filter drop-shadow-md" fill="none">
          <defs>
            <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DFBF7B" />
              <stop offset="45%" stopColor="#C5A059" />
              <stop offset="75%" stopColor="#9A7730" />
              <stop offset="100%" stopColor="#6C511B" />
            </linearGradient>
            <linearGradient id="woodGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4A2511" />
              <stop offset="50%" stopColor="#6D371A" />
              <stop offset="100%" stopColor="#3E1E0D" />
            </linearGradient>
            <linearGradient id="specular" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Tripod legs */}
          <line x1="160" y1="120" x2="70" y2="230" stroke="url(#woodGrad)" strokeWidth="7" strokeLinecap="round" />
          <line x1="160" y1="120" x2="160" y2="235" stroke="url(#woodGrad)" strokeWidth="7.5" strokeLinecap="round" />
          <line x1="160" y1="120" x2="250" y2="230" stroke="url(#woodGrad)" strokeWidth="7" strokeLinecap="round" />

          {/* Tripod spreader chain and brass brackets */}
          <line x1="100" y1="185" x2="220" y2="185" stroke="#9A7730" strokeWidth="2.5" strokeDasharray="4 3" />
          <circle cx="160" cy="185" r="4" fill="url(#brassGrad)" />
          <circle cx="100" cy="185" r="3" fill="#6C511B" />
          <circle cx="220" cy="185" r="3" fill="#6C511B" />

          {/* Brass tripod mount yolk */}
          <rect x="153" y="110" width="14" height="22" rx="3" fill="url(#brassGrad)" />
          <circle cx="160" cy="115" r="8" fill="url(#brassGrad)" stroke="#6C511B" strokeWidth="1.5" />
          <circle cx="160" cy="115" r="3" fill="#FFFFFF" opacity="0.6" />

          {/* Main Spyglass Barrel (Angled at ~25 degrees) */}
          <g transform="rotate(-22 160 115)">
            {/* Dew cap / Large front objective */}
            <rect x="230" y="103" width="45" height="26" rx="2" fill="url(#brassGrad)" />
            <rect x="272" y="101" width="6" height="30" rx="1.5" fill="#DFBF7B" stroke="#6C511B" strokeWidth="1" />
            <ellipse cx="277" cy="116" rx="2" ry="14" fill="#3A5A6D" />

            {/* Main polished barrel */}
            <rect x="110" y="106" width="125" height="20" fill="url(#brassGrad)" />
            <rect x="110" y="107" width="125" height="4" fill="url(#specular)" />

            {/* Knurled brass trim rings */}
            <rect x="155" y="104.5" width="10" height="23" fill="#DFBF7B" stroke="#9A7730" strokeWidth="1" />
            <rect x="215" y="104.5" width="8" height="23" fill="#DFBF7B" stroke="#9A7730" strokeWidth="1" />

            {/* Draw tubes */}
            <rect x="55" y="108.5" width="58" height="15" fill="url(#brassGrad)" />
            <rect x="25" y="110.5" width="32" height="11" fill="url(#brassGrad)" />

            {/* Eyepiece and focus knurl */}
            <rect x="18" y="109" width="8" height="14" rx="2" fill="#DFBF7B" />
            <ellipse cx="18" cy="116" rx="3" ry="8" fill="#6C511B" />
          </g>
        </svg>
      );

    case 'compass':
      return (
        <svg viewBox="0 0 320 240" className="w-full h-full max-h-56 filter drop-shadow-md" fill="none">
          <defs>
            <linearGradient id="brassComp" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E9D39C" />
              <stop offset="40%" stopColor="#C5A059" />
              <stop offset="85%" stopColor="#8D6F34" />
            </linearGradient>
            <radialGradient id="dialGrad">
              <stop offset="0%" stopColor="#FAF7F0" />
              <stop offset="80%" stopColor="#E6DCBF" />
              <stop offset="100%" stopColor="#C4B48A" />
            </radialGradient>
          </defs>

          {/* Hardwood box base underneath */}
          <rect x="50" y="55" width="220" height="140" rx="10" fill="#422210" stroke="#8D6F34" strokeWidth="2.5" />
          <rect x="58" y="63" width="204" height="124" rx="6" fill="#582E17" />
          {/* Brass corner brackets on box */}
          <path d="M50 75 L50 55 L70 55" stroke="#C5A059" strokeWidth="4" />
          <path d="M270 75 L270 55 L250 55" stroke="#C5A059" strokeWidth="4" />
          <path d="M50 175 L50 195 L70 195" stroke="#C5A059" strokeWidth="4" />
          <path d="M270 175 L270 195 L250 195" stroke="#C5A059" strokeWidth="4" />

          {/* Solid Brass Compass Casing */}
          <circle cx="160" cy="125" r="58" fill="url(#brassComp)" stroke="#6C511B" strokeWidth="3" />
          <circle cx="160" cy="125" r="51" fill="url(#dialGrad)" stroke="#8D6F34" strokeWidth="1.5" />

          {/* Degree ticks */}
          <circle cx="160" cy="125" r="46" stroke="#8D6F34" strokeWidth="1" strokeDasharray="2 4" />

          {/* 8-point Compass Rose */}
          <polygon points="160,82 165,120 160,125" fill="#8D6F34" />
          <polygon points="160,82 155,120 160,125" fill="#C5A059" />
          <polygon points="160,168 155,130 160,125" fill="#8D6F34" />
          <polygon points="160,168 165,130 160,125" fill="#C5A059" />
          <polygon points="203,125 165,120 160,125" fill="#8D6F34" />
          <polygon points="203,125 165,130 160,125" fill="#C5A059" />
          <polygon points="117,125 155,130 160,125" fill="#8D6F34" />
          <polygon points="117,125 155,120 160,125" fill="#C5A059" />

          {/* Cardinal Directions */}
          <text x="160" y="96" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#3D2910" fontFamily="serif">N</text>
          <text x="160" y="162" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#3D2910" fontFamily="serif">S</text>
          <text x="194" y="128" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#3D2910" fontFamily="serif">E</text>
          <text x="126" y="128" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#3D2910" fontFamily="serif">W</text>

          {/* Sundial Gnomon Bracket */}
          <polygon points="160,105 162,125 158,125" fill="#C5A059" stroke="#6C511B" strokeWidth="1" />
          <circle cx="160" cy="125" r="4.5" fill="#DFBF7B" stroke="#523912" strokeWidth="1.5" />
          <circle cx="160" cy="125" r="1.5" fill="#FFFFFF" />

          {/* Brass Hinge & Top Latch */}
          <rect x="154" y="63" width="12" height="6" rx="2" fill="url(#brassComp)" />
          <circle cx="160" cy="61" r="5" fill="none" stroke="#C5A059" strokeWidth="2.5" />
        </svg>
      );

    case 'clock':
      return (
        <svg viewBox="0 0 320 240" className="w-full h-full max-h-56 filter drop-shadow-md" fill="none">
          <defs>
            <linearGradient id="clockBrass" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DFC386" />
              <stop offset="50%" stopColor="#C5A059" />
              <stop offset="100%" stopColor="#7E6024" />
            </linearGradient>
            <linearGradient id="castIron" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3C3935" />
              <stop offset="100%" stopColor="#1C1B1A" />
            </linearGradient>
          </defs>

          {/* Wall mount backplate */}
          <rect x="42" y="30" width="14" height="180" rx="3" fill="url(#castIron)" />
          <circle cx="49" cy="45" r="3" fill="#C5A059" />
          <circle cx="49" cy="195" r="3" fill="#C5A059" />

          {/* Victorian ornate bracket scrolls */}
          <path
            d="M56 50 C110 50, 130 90, 145 90 C160 90, 175 70, 175 60"
            stroke="url(#castIron)"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M56 180 C110 180, 140 145, 155 145 C170 145, 175 165, 175 175"
            stroke="url(#castIron)"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="175" cy="60" r="5" fill="#C5A059" />
          <circle cx="175" cy="175" r="5" fill="#C5A059" />

          {/* Drop hanger chain / post */}
          <line x1="175" y1="65" x2="175" y2="85" stroke="#C5A059" strokeWidth="4" />
          <line x1="175" y1="155" x2="175" y2="175" stroke="#C5A059" strokeWidth="4" />

          {/* Clock Outer Brass Drum Casing */}
          <circle cx="175" cy="120" r="52" fill="url(#clockBrass)" stroke="#5E4515" strokeWidth="3" />
          <circle cx="175" cy="120" r="45" fill="#F8F3E8" stroke="#8D6F34" strokeWidth="1.5" />

          {/* Dial chapter ring */}
          <circle cx="175" cy="120" r="42" stroke="#8D6F34" strokeWidth="0.8" />
          <circle cx="175" cy="120" r="33" stroke="#8D6F34" strokeWidth="0.5" />

          {/* Roman Numerals */}
          <text x="175" y="93" textAnchor="middle" fontSize="7.5" fontWeight="bold" fill="#1C1B1A" fontFamily="serif">XII</text>
          <text x="175" y="152" textAnchor="middle" fontSize="7.5" fontWeight="bold" fill="#1C1B1A" fontFamily="serif">VI</text>
          <text x="204" y="122.5" textAnchor="middle" fontSize="7.5" fontWeight="bold" fill="#1C1B1A" fontFamily="serif">III</text>
          <text x="146" y="122.5" textAnchor="middle" fontSize="7.5" fontWeight="bold" fill="#1C1B1A" fontFamily="serif">IX</text>

          {/* Station inscription */}
          <text x="175" y="105" textAnchor="middle" fontSize="4.5" fill="#7E6024" letterSpacing="1" fontFamily="sans-serif">VICTORIA STATION</text>
          <text x="175" y="137" textAnchor="middle" fontSize="3.5" fill="#9A7730" letterSpacing="0.5" fontFamily="serif">LONDON 1879</text>

          {/* Clock Hands (Ornate spade) */}
          <line x1="175" y1="120" x2="162" y2="104" stroke="#1C1B1A" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="175" y1="120" x2="194" y2="114" stroke="#1C1B1A" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="175" cy="120" r="3" fill="#C5A059" stroke="#1C1B1A" strokeWidth="1" />
        </svg>
      );

    case 'astrolabe':
      return (
        <svg viewBox="0 0 320 240" className="w-full h-full max-h-56 filter drop-shadow-md" fill="none">
          <defs>
            <linearGradient id="astroBrass" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F2DFB5" />
              <stop offset="50%" stopColor="#C5A059" />
              <stop offset="100%" stopColor="#7E5C1B" />
            </linearGradient>
          </defs>

          {/* Shackle suspension ring */}
          <circle cx="160" cy="38" r="14" stroke="url(#astroBrass)" strokeWidth="4.5" fill="none" />
          <polygon points="152,48 168,48 164,62 156,62" fill="url(#astroBrass)" />

          {/* Main Mater / Drum */}
          <circle cx="160" cy="130" r="66" fill="url(#astroBrass)" stroke="#5B4011" strokeWidth="2" />
          <circle cx="160" cy="130" r="59" fill="#1C1B1A" stroke="#C5A059" strokeWidth="1.2" />

          {/* Altitude and azimuth curves (climate plate) */}
          <circle cx="160" cy="130" r="48" stroke="#8D6F34" strokeWidth="0.8" opacity="0.6" />
          <circle cx="160" cy="130" r="36" stroke="#8D6F34" strokeWidth="0.8" opacity="0.6" />
          <circle cx="160" cy="130" r="22" stroke="#8D6F34" strokeWidth="0.8" opacity="0.6" />

          {/* Openwork Rete with star pointers */}
          <circle cx="172" cy="122" r="30" stroke="#E5CE95" strokeWidth="1.8" fill="none" opacity="0.9" />
          <polygon points="172,92 175,98 169,98" fill="#F4E0A8" />
          <polygon points="198,110 204,114 200,118" fill="#F4E0A8" />
          <polygon points="150,140 144,144 146,138" fill="#F4E0A8" />

          {/* Alidade / Sight Rule (Rotating bar across diameter) */}
          <rect
            x="96"
            y="127"
            width="128"
            height="6"
            rx="2"
            fill="url(#astroBrass)"
            stroke="#5B4011"
            strokeWidth="0.8"
            transform="rotate(-30 160 130)"
          />
          {/* Central horse wedge pin */}
          <circle cx="160" cy="130" r="5" fill="#E5CE95" stroke="#5B4011" strokeWidth="1.2" />
          <circle cx="160" cy="130" r="2" fill="#5B4011" />
        </svg>
      );

    case 'helmet':
      return (
        <svg viewBox="0 0 320 240" className="w-full h-full max-h-56 filter drop-shadow-md" fill="none">
          <defs>
            <linearGradient id="helmetCopper" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C97E5B" />
              <stop offset="50%" stopColor="#9C5232" />
              <stop offset="100%" stopColor="#5E2C17" />
            </linearGradient>
            <linearGradient id="helmetBrass" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5DFB3" />
              <stop offset="50%" stopColor="#C5A059" />
              <stop offset="100%" stopColor="#7E5C1B" />
            </linearGradient>
          </defs>

          {/* Breastplate collar */}
          <path
            d="M90 190 C90 170, 110 160, 160 160 C210 160, 230 170, 230 190 C230 205, 205 215, 160 215 C115 215, 90 205, 90 190 Z"
            fill="url(#helmetBrass)"
            stroke="#5B4011"
            strokeWidth="2"
          />

          {/* Collar Wingnuts */}
          {[105, 125, 145, 175, 195, 215].map((x, i) => (
            <circle key={i} cx={x} cy={192} r="3" fill="#FFE199" stroke="#6C4910" strokeWidth="1" />
          ))}

          {/* Main helmet bonnet dome */}
          <path
            d="M105 160 C100 95, 130 50, 160 50 C190 50, 220 95, 215 160 Z"
            fill="url(#helmetCopper)"
            stroke="#5E2C17"
            strokeWidth="2"
          />

          {/* Front face port / barred glass window */}
          <circle cx="160" cy="118" r="24" fill="#3D5A6E" stroke="url(#helmetBrass)" strokeWidth="6" />
          {/* Window bars */}
          <line x1="144" y1="108" x2="176" y2="128" stroke="#C5A059" strokeWidth="3" />
          <line x1="144" y1="128" x2="176" y2="108" stroke="#C5A059" strokeWidth="3" />
          <line x1="160" y1="96" x2="160" y2="140" stroke="#C5A059" strokeWidth="3" />

          {/* Side circular ports */}
          <ellipse cx="116" cy="116" rx="5" ry="14" fill="#3D5A6E" stroke="url(#helmetBrass)" strokeWidth="3" />
          <ellipse cx="204" cy="116" rx="5" ry="14" fill="#3D5A6E" stroke="url(#helmetBrass)" strokeWidth="3" />

          {/* Air intake fitting */}
          <rect x="185" y="70" width="16" height="10" rx="2" fill="url(#helmetBrass)" stroke="#5B4011" strokeWidth="1" />

          {/* Authentic nameplate */}
          <rect x="142" y="166" width="36" height="12" rx="1" fill="url(#helmetBrass)" stroke="#5B4011" strokeWidth="1" />
          <text x="160" y="174" textAnchor="middle" fontSize="4.5" fill="#4B310A" fontWeight="bold">NAVY MARK V</text>
        </svg>
      );

    case 'hourglass':
      return (
        <svg viewBox="0 0 320 240" className="w-full h-full max-h-56 filter drop-shadow-md" fill="none">
          <defs>
            <linearGradient id="glassSand" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#DFD5C2" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="brassHour" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C5A059" />
              <stop offset="50%" stopColor="#DFBF7B" />
              <stop offset="100%" stopColor="#8D6F34" />
            </linearGradient>
          </defs>

          {/* Gimbal outer ring */}
          <ellipse cx="160" cy="120" rx="58" ry="62" stroke="url(#brassHour)" strokeWidth="4.5" fill="none" />
          {/* Gimbal pivot knobs */}
          <circle cx="102" cy="120" r="5" fill="#C5A059" stroke="#6C511B" strokeWidth="1" />
          <circle cx="218" cy="120" r="5" fill="#C5A059" stroke="#6C511B" strokeWidth="1" />

          {/* Top and Bottom brass plates */}
          <rect x="126" y="62" width="68" height="8" rx="2" fill="url(#brassHour)" />
          <rect x="126" y="170" width="68" height="8" rx="2" fill="url(#brassHour)" />

          {/* 3 Brass pillars */}
          <line x1="132" y1="70" x2="132" y2="170" stroke="url(#brassHour)" strokeWidth="3" />
          <line x1="160" y1="70" x2="160" y2="170" stroke="url(#brassHour)" strokeWidth="1.5" strokeDasharray="4 2" />
          <line x1="188" y1="70" x2="188" y2="170" stroke="url(#brassHour)" strokeWidth="3" />

          {/* Glass Ampoule Outline */}
          <path
            d="M136 74 C136 102, 155 116, 158 120 C155 124, 136 138, 136 166 L184 166 C184 138, 165 124, 162 120 C165 116, 184 102, 184 74 Z"
            fill="url(#glassSand)"
            stroke="#9A8256"
            strokeWidth="1.5"
          />

          {/* Top Sand (Draining) */}
          <path d="M140 85 C146 100, 154 115, 160 119 C166 115, 174 100, 180 85 Z" fill="#E8DEC8" />
          {/* Falling sand trickle stream */}
          <line x1="160" y1="120" x2="160" y2="152" stroke="#C5A059" strokeWidth="1.2" />
          {/* Bottom Sand (Accumulated mound) */}
          <path d="M142 165 C148 152, 172 152, 178 165 Z" fill="#DFD2B7" />
        </svg>
      );

    case 'sextant':
    default:
      return (
        <svg viewBox="0 0 320 240" className="w-full h-full max-h-56 filter drop-shadow-md" fill="none">
          <defs>
            <linearGradient id="sextBrass" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DFBF7B" />
              <stop offset="50%" stopColor="#C5A059" />
              <stop offset="100%" stopColor="#7E5C1B" />
            </linearGradient>
          </defs>

          {/* Triangular Sextant Frame */}
          <path
            d="M160 55 L90 175 C130 185, 190 185, 230 175 Z"
            stroke="url(#sextBrass)"
            strokeWidth="6"
            strokeLinejoin="round"
            fill="#F6F1E7"
          />
          {/* Vernier Arc Limbs */}
          <path d="M85 180 C130 192, 190 192, 235 180" stroke="#7E5C1B" strokeWidth="4" fill="none" />
          <path d="M88 178 C130 189, 190 189, 232 178" stroke="#FFE9B8" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />

          {/* Index Arm Pivot */}
          <circle cx="160" cy="55" r="9" fill="url(#sextBrass)" stroke="#5B4011" strokeWidth="2" />
          <line x1="160" y1="55" x2="175" y2="182" stroke="url(#sextBrass)" strokeWidth="4.5" strokeLinecap="round" />
          <circle cx="175" cy="182" r="5" fill="#DFBF7B" stroke="#5B4011" strokeWidth="1" />

          {/* Sighting Telescope Tube */}
          <rect x="180" y="90" width="46" height="12" rx="2" fill="url(#sextBrass)" stroke="#5B4011" strokeWidth="1" transform="rotate(35 180 90)" />

          {/* Mirrors & Colored Sun Filters */}
          <rect x="144" y="50" width="8" height="14" fill="#88A3B2" stroke="#5B4011" strokeWidth="1" />
          <circle cx="125" cy="115" r="7" fill="#4B6E4A" opacity="0.8" stroke="#C5A059" strokeWidth="1.5" />
          <circle cx="132" cy="120" r="7" fill="#8B4E38" opacity="0.8" stroke="#C5A059" strokeWidth="1.5" />
        </svg>
      );
  }
}
