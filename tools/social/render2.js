const { chromium } = require('playwright');
const fs = require('fs');
const posts = JSON.parse(fs.readFileSync('posts2.json','utf8'));
const logo = 'data:image/png;base64,' + fs.readFileSync('logo.png').toString('base64');
const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
const css = `*{box-sizing:border-box;margin:0}
body{width:1080px;height:1350px;font-family:Inter,sans-serif;-webkit-font-smoothing:antialiased}
.s{width:1080px;height:1350px;padding:96px 96px 88px;display:flex;flex-direction:column;position:relative}
.dark{background:#3B2E29;color:#EFE8DB}.light{background:#EFE8DB;color:#3B2E29}
.k{font-size:30px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;opacity:.8}
h1{font-family:Lora,serif;font-weight:400;font-size:96px;line-height:1.08;letter-spacing:-.01em;margin-top:56px}
.num{font-family:Lora,serif;font-size:220px;line-height:1;opacity:.22}
h2{font-family:Lora,serif;font-weight:400;font-size:74px;line-height:1.12;margin-top:28px}
p{font-size:40px;line-height:1.45;margin-top:44px;max-width:860px}
.rule{height:2px;background:currentColor;opacity:.35;margin-top:auto}
.foot{display:flex;justify-content:space-between;align-items:center;margin-top:30px;font-size:28px;font-weight:500;letter-spacing:.04em}
.logo{width:150px;height:150px;border-radius:50%;object-fit:cover}
.swipe{font-size:30px;font-weight:600}
.cta h2{font-size:84px}`;
const foot = (i,n) => `<div class="rule"></div><div class="foot"><span>THOUGHTFUL CONSTRUCTION &amp; GROUNDWORKS</span><span>${i} / ${n}</span></div>`;
(async()=>{
 const b = await chromium.launch(); const pg = await b.newPage({viewport:{width:1080,height:1350}});
 for (const P of posts) {
  const n = P.tips.length + 2 + (P.outro?1:0); const dir = 'out/'+P.slug; fs.mkdirSync(dir,{recursive:true});
  const slides = [];
  slides.push(`<div class="s dark"><img class="logo" src="${logo}"><div class="k" style="margin-top:56px">${esc(P.kicker)}</div><h1>${esc(P.title)}</h1><div class="swipe" style="margin-top:56px">Swipe →</div>${foot(1,n)}</div>`);
  P.tips.forEach((t,i)=> slides.push(`<div class="s light"><div class="num">${i+1}</div><h2>${esc(t[0])}</h2><p>${esc(t[1])}</p>${foot(i+2,n)}</div>`));
  if (P.outro) slides.push(`<div class="s dark"><div class="k">${P.slug.startsWith("06")?"A word of caution":"In short"}</div><h2 style="margin-top:40px">${esc(P.outro[0])}</h2><p>${esc(P.outro[1])}</p>${foot(n-1,n)}</div>`);
  slides.push(`<div class="s dark cta"><img class="logo" src="${logo}"><h2 style="margin-top:64px">Building on the Fowey estuary.</h2><p>New builds, renovation, bathrooms, decks and groundworks.</p><p style="margin-top:40px"><b>WhatsApp 07455 432332</b><br>thoughtfulconstruction.co.uk</p>${foot(n,n)}</div>`);
  for (let i=0;i<slides.length;i++){
   await pg.setContent(`<html><head><style>${css}</style></head><body>${slides[i]}</body></html>`);
   await pg.waitForTimeout(150);
   await pg.screenshot({path:`${dir}/${String(i+1).padStart(2,'0')}.jpg`, type:'jpeg', quality:92});
  }
  fs.writeFileSync(dir+'/caption.txt', P.caption);
 }
 await b.close();
})();
