const { chromium } = require('playwright');
const fs = require('fs');
const logo = 'data:image/png;base64,' + fs.readFileSync('logo.png').toString('base64');
const N = 8;
const css = `*{box-sizing:border-box;margin:0}
body{width:1080px;height:1350px;font-family:Inter,sans-serif;-webkit-font-smoothing:antialiased}
.s{width:1080px;height:1350px;padding:96px 96px 88px;display:flex;flex-direction:column;position:relative;overflow:hidden}
.dark{background:#3B2E29;color:#EFE8DB}.light{background:#EFE8DB;color:#3B2E29}.slate{background:#4a5560;color:#EFE8DB}
.k{font-size:30px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;opacity:.8}
h1{font-family:Lora,serif;font-weight:400;font-size:100px;line-height:1.06;margin-top:48px}
h2{font-family:Lora,serif;font-weight:400;font-size:76px;line-height:1.1;margin-top:28px}
p{font-size:40px;line-height:1.45;margin-top:40px;max-width:880px}
.rule{height:2px;background:currentColor;opacity:.35;margin-top:auto}
.foot{display:flex;justify-content:space-between;margin-top:30px;font-size:28px;font-weight:500;letter-spacing:.04em}
.logo{width:140px;height:140px;border-radius:50%}
.swipe{font-size:30px;font-weight:600;margin-top:48px}
.scales{position:absolute;right:-60px;top:-40px;width:620px;height:900px;opacity:.18}
svg text{font-family:Inter,sans-serif}`;
const foot = i => `<div class="rule"></div><div class="foot"><span>THOUGHTFUL CONSTRUCTION &amp; GROUNDWORKS</span><span>${i} / ${N}</span></div>`;
// fish-scale pattern
let sc=''; for(let r=0;r<12;r++){for(let c=0;c<8;c++){const x=c*90+(r%2?45:0), y=r*80; sc+=`<path d="M${x} ${y} h80 v40 a40 40 0 0 1 -80 0 z" fill="none" stroke="#EFE8DB" stroke-width="3"/>`}}
const scales = `<svg class="scales" viewBox="0 0 700 960">${sc}</svg>`;
// side-section diagram (close-up): wall, battens, slates lapping
const wallX=250, gap=170, top=120, L=400, nB=4, T=26, K=46;
let parts=`<rect x="100" y="80" width="${wallX-100}" height="820" fill="#cdbfa6"/>`;
parts+=`<text x="175" y="520" text-anchor="middle" font-size="30" fill="#3B2E29" letter-spacing="4" transform="rotate(-90 175 520)">WALL</text>`;
for(let i=0;i<nB;i++){const y=top+i*gap; parts+=`<rect x="${wallX}" y="${y}" width="50" height="34" fill="#a27b55"/>`;}
const x1=wallX+50;
for(let i=nB-1;i>=0;i--){const y=top+i*gap;
 parts+=`<polygon points="${x1},${y} ${x1+T},${y} ${x1+T+K},${y+L} ${x1+K},${y+L}" fill="#5b6670" stroke="#2c333a" stroke-width="3"/>`;
 parts+=`<line x1="${x1-40}" y1="${y+17}" x2="${x1+T+4}" y2="${y+17}" stroke="#c47a3a" stroke-width="8" stroke-linecap="round"/>`;}
// rain arrow
parts+=`<path d="M 470 140 L 420 1000" stroke="#4a7fa8" stroke-width="5" stroke-dasharray="14 12" fill="none"/>`;
const diagram = `<svg viewBox="0 0 900 1000" width="888" height="900" style="margin-top:10px">${parts}
<text x="500" y="160" font-size="34" fill="#3B2E29" font-weight="600">1. Nailed at the top</text>
<text x="500" y="200" font-size="28" fill="#3B2E29">to a timber batten</text>
<text x="500" y="420" font-size="34" fill="#3B2E29" font-weight="600">2. The slate above</text>
<text x="500" y="460" font-size="28" fill="#3B2E29">laps over it and hides</text>
<text x="500" y="495" font-size="28" fill="#3B2E29">the nail from the weather</text>
<text x="500" y="710" font-size="34" fill="#3B2E29" font-weight="600">3. Rain runs down</text>
<text x="500" y="750" font-size="28" fill="#3B2E29">the face, never into</text>
<text x="500" y="785" font-size="28" fill="#3B2E29">the wall</text>
</svg>`;
const S = [
`<div class="s slate">${scales}<img class="logo" src="${logo}"><div class="k" style="margin-top:56px">Fowey house history · 1</div><h1>Why so many Fowey houses wear slate on their walls</h1><div class="swipe">Swipe →</div>${foot(1)}</div>`,
`<div class="s light"><div class="k">Look at which walls</div><h2>It's nearly always the side facing the weather</h2><p>Rain off the sea doesn't fall, it's driven sideways. Builders here hung slate on the south and west walls to shed it, and often left the sheltered sides as bare stone or render.</p><p style="opacity:.75">Next time you walk up from the quay, see which way the slated walls face.</p>${foot(2)}</div>`,
`<div class="s dark"><div class="k">Local stone</div><h2>A roof material, used on walls</h2><p>Cornwall has been quarrying slate for centuries, so it was the obvious thing to hand. Hung vertically, it lasts far longer than paint or render in salt air, and needs very little looking after.</p>${foot(3)}</div>`,
`<div class="s light"><div class="k">How it's hung</div>${diagram}${foot(4)}</div>`,
`<div class="s dark"><div class="k">When it goes wrong</div><h2>Slates rarely fail. The nails do.</h2><p>Old iron nails rust through, and slates start to slide out. If a whole row has slipped, it's usually the nails or battens behind them that have gone, not the slate.</p>${foot(5)}</div>`,
`<div class="s light"><div class="k">Repairing it properly</div><h2>Copper nails, lime mortar, matching slate</h2><p>Copper or bronze nails, not plain steel. Lime mortar, not hard cement, which cracks and breaks slates. Reuse the sound slates and match the size and thickness of the rest, so the repair disappears.</p>${foot(6)}</div>`,
`<div class="s slate">${scales}<div class="k">A two-minute check</div><h2>Walk round your house after a storm</h2><p>Look for slipped or missing slates, gaps at corners and window edges, and rust streaks below nail lines. Catch one slipped slate now and you avoid a soaked wall later.</p>${foot(7)}</div>`,
`<div class="s dark"><img class="logo" src="${logo}"><h2 style="margin-top:56px">Next in the series: why so many Fowey houses are painted the colours they are.</h2><p>Need a slate-hung wall looked at? Message us on WhatsApp: 07455 432332.</p>${foot(8)}</div>`
];
(async()=>{const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1080,height:1350}});
const dir='out/h1-slate-hanging';fs.mkdirSync(dir,{recursive:true});
for(let i=0;i<S.length;i++){await pg.setContent(`<html><head><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Lora&display=swap" rel="stylesheet"><style>${css}</style></head><body>${S[i]}</body></html>`,{waitUntil:'networkidle'}).catch(()=>{});await pg.waitForTimeout(400);await pg.screenshot({path:`${dir}/${String(i+1).padStart(2,'0')}.jpg`,type:'jpeg',quality:92});}
await b.close();console.log('done')})();
