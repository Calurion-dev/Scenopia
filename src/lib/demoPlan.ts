const plan = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  <rect width="1600" height="1000" fill="#E9E5DA"/>
  <g stroke="#D8D2C4" stroke-width="1">
    ${Array.from({ length: 31 }, (_, i) => `<line x1="${i * 50}" y1="0" x2="${i * 50}" y2="1000"/>`).join("")}
    ${Array.from({ length: 20 }, (_, i) => `<line x1="0" y1="${i * 50}" x2="1600" y2="${i * 50}"/>`).join("")}
  </g>
  <rect x="90" y="90" width="1420" height="820" fill="none" stroke="#202526" stroke-width="22"/>
  <rect x="90" y="90" width="1420" height="820" fill="none" stroke="#202526" stroke-width="6" transform="translate(16 16)" opacity="0.25"/>
  <line x1="1080" y1="90" x2="1080" y2="390" stroke="#202526" stroke-width="18"/>
  <line x1="1080" y1="390" x2="1510" y2="390" stroke="#202526" stroke-width="18"/>
  <rect x="1120" y="120" width="350" height="230" fill="#DDD6C6" stroke="#B9B09E" stroke-width="3"/>
  <text x="1145" y="155" font-family="monospace" font-size="24" fill="#6E6658">RÉSERVE</text>
  <line x1="250" y1="90" x2="600" y2="90" stroke="#7FA9B5" stroke-width="26"/>
  <line x1="250" y1="78" x2="600" y2="78" stroke="#202526" stroke-width="4"/>
  <line x1="250" y1="102" x2="600" y2="102" stroke="#202526" stroke-width="4"/>
  <text x="330" y="140" font-family="monospace" font-size="24" fill="#6E6658">FENÊTRE</text>
  <line x1="1330" y1="910" x2="1510" y2="910" stroke="#E9E5DA" stroke-width="30"/>
  <path d="M1330 910 A 180 180 0 0 0 1510 730" fill="none" stroke="#B9B09E" stroke-width="4" stroke-dasharray="10 10"/>
  <text x="1260" y="960" font-family="monospace" font-size="24" fill="#6E6658">PORTE</text>
  <rect x="560" y="430" width="480" height="230" rx="18" fill="#D6CDBB" stroke="#9F947F" stroke-width="4"/>
  <text x="700" y="560" font-family="monospace" font-size="28" fill="#6E6658">TABLE</text>
  <circle cx="430" cy="545" r="55" fill="none" stroke="#9F947F" stroke-width="4"/>
  <circle cx="1170" cy="545" r="55" fill="none" stroke="#9F947F" stroke-width="4"/>
  <text x="150" y="960" font-family="monospace" font-size="26" fill="#6E6658">STUDIO — 7,2 × 4,2 m</text>
</svg>`;

export const DEMO_PLAN = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(plan)}`;

const blank = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  <rect width="1600" height="1000" fill="#E9E5DA"/>
  <g stroke="#D8D2C4" stroke-width="1">
    ${Array.from({ length: 31 }, (_, i) => `<line x1="${i * 50}" y1="0" x2="${i * 50}" y2="1000"/>`).join("")}
    ${Array.from({ length: 20 }, (_, i) => `<line x1="0" y1="${i * 50}" x2="1600" y2="${i * 50}"/>`).join("")}
  </g>
  <rect x="70" y="70" width="1460" height="860" fill="none" stroke="#202526" stroke-width="14"/>
  <text x="100" y="130" font-family="monospace" font-size="26" fill="#8A8172">PLAN VIERGE — place ton mobilier et tes éléments</text>
</svg>`;

export const BLANK_PLAN = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(blank)}`;
