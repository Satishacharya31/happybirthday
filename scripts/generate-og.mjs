/**
 * Dynamic OG image generator using Satori (same engine as Vercel OG).
 * Renders JSX-style layout → SVG → PNG via sharp.
 * Run: npm run og   (also auto-runs during: npm run build)
 */
import satori from 'satori';
import sharp  from 'sharp';
import { fileURLToPath } from 'url';
import { readFileSync, statSync } from 'fs';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath   = path.resolve(__dirname, '../public/og-image.png');

// ── Fonts from local @fontsource packages (no network needed) ───────────────
const playfairBold = readFileSync(
  path.resolve(__dirname, '../node_modules/@fontsource/playfair-display/files/playfair-display-latin-700-normal.woff2')
);
const montserrat = readFileSync(
  path.resolve(__dirname, '../node_modules/@fontsource/montserrat/files/montserrat-latin-600-normal.woff2')
);

console.log('✨ Rendering OG image with Satori...');

// ── Layout (satori JSX as plain objects) ────────────────────────────────────
// Satori accepts the h() object tree directly — no JSX transform needed.
function h(type, props, ...children) {
  return { type, props: { ...props, children: children.flat().filter(Boolean) } };
}

// Cake SVG drawn inline as a data-image for the right panel
const cakeSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 360" width="240" height="360">
  <defs>
    <radialGradient id="fG" cx="50%" cy="80%" r="60%">
      <stop offset="0%" stop-color="#FFE033"/>
      <stop offset="60%" stop-color="#FF6A00"/>
      <stop offset="100%" stop-color="#cc3300" stop-opacity="0.3"/>
    </radialGradient>
    <radialGradient id="fg2" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FF8C00" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#FF8C00" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <!-- table -->
  <ellipse cx="120" cy="340" rx="105" ry="12" fill="#1a0a00"/>
  <ellipse cx="120" cy="336" rx="105" ry="7" fill="none" stroke="#D4AF37" stroke-width="2"/>
  <!-- shadow -->
  <ellipse cx="120" cy="308" rx="88" ry="9" fill="#000" opacity="0.4"/>
  <!-- plate -->
  <ellipse cx="120" cy="306" rx="88" ry="9" fill="#222"/>
  <!-- tier1 side -->
  <rect x="34" y="205" width="172" height="100" rx="6" fill="#FFF0F5"/>
  <ellipse cx="120" cy="205" rx="86" ry="9" fill="#ffe8f0"/>
  <ellipse cx="120" cy="305" rx="86" ry="7" fill="#ffd0e0" opacity="0.6"/>
  <!-- tier1 rosettes top -->
  ${Array.from({length:9},(_,i)=>{const a=(i/9)*Math.PI*2;const cx=120+Math.round(Math.cos(a)*74);const cy=220+Math.round(Math.sin(a)*8);const c=['#FF69B4','#FF1493','#FFB6C1','#DB3D68','#FF85C2'][i%5];return `<circle cx="${cx}" cy="${cy}" r="6" fill="${c}"/>`;}).join('')}
  <!-- tier1 rosettes bottom -->
  ${Array.from({length:9},(_,i)=>{const a=(i/9)*Math.PI*2;const cx=120+Math.round(Math.cos(a)*74);const cy=295+Math.round(Math.sin(a)*8);const c=['#FF69B4','#FF1493','#FFB6C1','#DB3D68','#FF85C2'][i%5];return `<circle cx="${cx}" cy="${cy}" r="6" fill="${c}"/>`;}).join('')}
  <!-- gold band -->
  <ellipse cx="120" cy="255" rx="86" ry="6" fill="none" stroke="#D4AF37" stroke-width="3"/>
  <!-- tier2 side -->
  <rect x="72" y="120" width="96" height="85" rx="5" fill="#ffffff"/>
  <ellipse cx="120" cy="120" rx="48" ry="7" fill="#fff5f8"/>
  <ellipse cx="120" cy="205" rx="48" ry="6" fill="#ffe8f0" opacity="0.7"/>
  <!-- tier2 rosettes -->
  ${Array.from({length:7},(_,i)=>{const a=(i/7)*Math.PI*2;const cx=120+Math.round(Math.cos(a)*40);const cy=133+Math.round(Math.sin(a)*6);const c=['#FF69B4','#FF1493','#FFB6C1','#DB3D68','#FF85C2'][i%5];return `<circle cx="${cx}" cy="${cy}" r="5" fill="${c}"/>`;}).join('')}
  ${Array.from({length:7},(_,i)=>{const a=(i/7)*Math.PI*2;const cx=120+Math.round(Math.cos(a)*40);const cy=196+Math.round(Math.sin(a)*6);const c=['#FF69B4','#FF1493','#FFB6C1','#DB3D68','#FF85C2'][i%5];return `<circle cx="${cx}" cy="${cy}" r="5" fill="${c}"/>`;}).join('')}
  <!-- tier2 gold band -->
  <ellipse cx="120" cy="163" rx="48" ry="5" fill="none" stroke="#D4AF37" stroke-width="2.5"/>
  <!-- flowers tier1 -->
  ${Array.from({length:5},(_,i)=>{const a=(i/5)*Math.PI*2;const cx=120+Math.round(Math.cos(a)*80);const cy=215+Math.round(Math.sin(a)*7);const c=['#FF69B4','#FF1493','#FFB6C1','#DB3D68','#FF85C2'][i%5];return `<circle cx="${cx}" cy="${cy}" r="8" fill="${c}" opacity="0.9"/><circle cx="${cx}" cy="${cy}" r="3.5" fill="#FFDA44"/>`;}).join('')}
  <!-- flowers tier2 -->
  ${Array.from({length:4},(_,i)=>{const a=(i/4)*Math.PI*2;const cx=120+Math.round(Math.cos(a)*44);const cy=128+Math.round(Math.sin(a)*5);const c=['#FF69B4','#FF1493','#FFB6C1','#DB3D68'][i%4];return `<circle cx="${cx}" cy="${cy}" r="6" fill="${c}" opacity="0.9"/><circle cx="${cx}" cy="${cy}" r="2.5" fill="#FFDA44"/>`;}).join('')}
  <!-- candle holder -->
  <ellipse cx="120" cy="120" rx="10" ry="3.5" fill="#D4AF37"/>
  <!-- candle body -->
  <rect x="115" y="82" width="10" height="38" rx="4" fill="#FFF5F8"/>
  <rect x="113" y="93" width="14" height="3" rx="1" fill="#D4AF37"/>
  <rect x="113" y="105" width="14" height="3" rx="1" fill="#D4AF37"/>
  <!-- wick -->
  <line x1="120" y1="82" x2="120" y2="77" stroke="#444" stroke-width="1.5"/>
  <!-- flame glow -->
  <ellipse cx="120" cy="66" rx="22" ry="22" fill="url(#fg2)" opacity="0.7"/>
  <!-- flame -->
  <ellipse cx="120" cy="64" rx="8" ry="16" fill="url(#fG)"/>
  <ellipse cx="120" cy="67" rx="4.5" ry="10" fill="#FFE033" opacity="0.9"/>
  <ellipse cx="120" cy="52" rx="2" ry="3" fill="white" opacity="0.9"/>
  <!-- text on cake -->
  <text x="120" y="158" text-anchor="middle" font-family="Georgia,serif" font-size="9.5" font-weight="700" fill="#DB3D68" letter-spacing="0.5">Happy Birthday</text>
  <text x="120" y="172" text-anchor="middle" font-family="Georgia,serif" font-size="13" font-weight="900" fill="#D4AF37" letter-spacing="1.5">Saniya</text>
</svg>`;

const cakeDataUri = `data:image/svg+xml;base64,${Buffer.from(cakeSvg).toString('base64')}`;

const node = h('div', {
  style: {
    width: '100%', height: '100%',
    display: 'flex', flexDirection: 'row',
    background: 'linear-gradient(135deg, #1a0010 0%, #0a000d 55%, #000005 100%)',
    fontFamily: 'Montserrat',
    position: 'relative',
    overflow: 'hidden',
  },
},
  // ── Pink radial glow bottom ──
  h('div', { style: {
    position: 'absolute', bottom: 0, left: '35%',
    width: '700px', height: '400px',
    background: 'radial-gradient(ellipse, rgba(180,20,80,0.22) 0%, transparent 70%)',
    borderRadius: '50%',
  }}),
  // ── Gold glow top ──
  h('div', { style: {
    position: 'absolute', top: 0, left: '40%',
    width: '600px', height: '300px',
    background: 'radial-gradient(ellipse, rgba(212,175,55,0.12) 0%, transparent 65%)',
    borderRadius: '50%',
  }}),

  // ── Left: text panel ──
  h('div', { style: {
    display: 'flex', flexDirection: 'column', justifyContent: 'center',
    width: '620px', padding: '60px 64px',
    position: 'relative', zIndex: 2,
  }},
    // accent line
    h('div', { style: {
      position: 'absolute', left: '44px', top: '60px', bottom: '60px',
      width: '2px',
      background: 'linear-gradient(to bottom, transparent, #DB3D68, transparent)',
    }}),
    // tag
    h('div', { style: {
      fontSize: 14, fontWeight: 600, letterSpacing: '4px', textTransform: 'uppercase',
      color: '#DB3D68', marginBottom: '20px', opacity: 0.9,
    }}, '✦  A SPECIAL SURPRISE  ✦'),
    // "Happy Birthday"
    h('div', { style: {
      fontSize: 88, fontWeight: 700, lineHeight: 1.05,
      fontFamily: 'Playfair',
      background: 'linear-gradient(135deg, #DB3D68 0%, #D4AF37 55%, #FF85C2 100%)',
      backgroundClip: 'text',
      color: 'transparent',
      marginBottom: '4px',
    }}, 'Happy'),
    h('div', { style: {
      fontSize: 88, fontWeight: 700, lineHeight: 1.05,
      fontFamily: 'Playfair',
      background: 'linear-gradient(135deg, #DB3D68 10%, #D4AF37 60%, #FF85C2 100%)',
      backgroundClip: 'text',
      color: 'transparent',
      marginBottom: '16px',
    }}, 'Birthday'),
    // Name
    h('div', { style: {
      fontSize: 64, fontWeight: 700,
      fontFamily: 'Playfair',
      background: 'linear-gradient(90deg, #D4AF37 0%, #FFD700 100%)',
      backgroundClip: 'text',
      color: 'transparent',
      marginBottom: '28px',
    }}, 'Saniya 🎂'),
    // divider
    h('div', { style: {
      width: '80px', height: '2px', marginBottom: '24px',
      background: 'linear-gradient(90deg, #DB3D68, #D4AF37)',
      borderRadius: '2px',
    }}),
    // subtitle
    h('div', { style: {
      fontSize: 16, color: 'rgba(255,255,255,0.42)', letterSpacing: '2.5px',
    }}, 'Open your gift — something beautiful awaits'),
  ),

  // ── Right: cake image panel ──
  h('div', { style: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flex: 1, position: 'relative', zIndex: 2,
  }},
    // soft glow behind cake
    h('div', { style: {
      position: 'absolute',
      width: '300px', height: '300px',
      background: 'radial-gradient(circle, rgba(219,61,104,0.18) 0%, transparent 70%)',
      borderRadius: '50%',
    }}),
    h('img', {
      src: cakeDataUri,
      width: 260, height: 390,
      style: { objectFit: 'contain', position: 'relative', zIndex: 3 },
    }),
  ),
);

const svg = await satori(node, {
  width: 1200, height: 630,
  fonts: [
    { name: 'Montserrat', data: montserrat,   weight: 600, style: 'normal' },
    { name: 'Playfair',   data: playfairBold,  weight: 700, style: 'normal' },
  ],
});

await sharp(Buffer.from(svg)).png({ compressionLevel: 8 }).toFile(outPath);

const kb = (statSync(outPath).size / 1024).toFixed(1);
console.log(`✅  OG image → public/og-image.png  (${kb} KB  •  1200×630)`);
