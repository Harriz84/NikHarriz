const DAYS=window.BERLIN_DAY_PARTS||[];
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
const mapsSearch=q=>'https://www.google.com/maps/search/?'+new URLSearchParams({api:'1',query:q});
const mapsDir=(a,b,m)=>'https://www.google.com/maps/dir/?'+new URLSearchParams({api:'1',origin:a,destination:b,travelmode:m});

const PHOTO_HINTS={
  'Berlin Marriott Hotel':['Potsdamer Platz'],
  'Vertrek vanaf hotel':['Potsdamer Platz'],
  'Terug naar hotel':['Potsdamer Platz'],
  'Uitchecken & bagage opslaan':['Potsdamer Platz'],
  'Bagage ophalen bij hotel':['Potsdamer Platz'],
  'Potsdamer Platz & hotelomgeving':['Potsdamer Platz'],
  'NENI Berlin':['Bikini Berlin','NENI Berlin restaurant'],
  'ANOHA Kindermuseum':['ANOHA Berlin','Jewish Museum Berlin'],
  'Burgermeister Potsdamer Platz':['Potsdamer Platz','Burgermeister Berlin'],
  'Arminiusmarkthalle':['Arminiusmarkthalle Berlin','Moabit Berlin'],
  'The Wall Museum':['East Side Gallery','Berlin Wall Museum East Side Gallery'],
  'BeachMitte':['BeachMitte Berlin','Berlin-Mitte'],
  'Zicht op Molecule Man & Badeschiff':['Molecule Man Berlin','Badeschiff Berlin'],
  'Snelle lunch rond Hackescher Markt':['Hackescher Markt'],
  'Bikini Berlin & stukje Kurfürstendamm':['Bikini Berlin','Kurfürstendamm'],
  'Mauerpark markt & karaoke':['Mauerpark'],
  'Boxhagener Platz vlooienmarkt':['Boxhagener Platz'],
  'Gedenkstätte Berliner Mauer – Bernauer Straße':['Berlin Wall Memorial','Bernauer Straße'],
  'Berlin Hauptbahnhof & vertrek':['Berlin Hauptbahnhof']
};

const photoCache=new Map();
function best(l,m){const r=l.recommend.toLowerCase();return(m==='walking'&&r.includes('lopen')||m==='transit'&&r.includes('ov')||m==='driving'&&r.includes('taxi'))?'best':''}
function save(l){if(l.walk<=15||l.scenic)return'';const x=Math.min(l.transit,l.taxi),d=l.walk-x;if(d<5)return'';return`<p class="saving">⏱️ ${l.taxi<=l.transit?'Taxi':'OV'} bespaart ongeveer ${d} minuten ten opzichte van lopen.</p>`}

function media(s){
  const wiki=s.wiki_exact||'';
  const hints=PHOTO_HINTS[s.title]||[];
  return`<div class="media" data-wiki="${esc(wiki)}" data-title="${esc(s.title)}" data-hints="${esc(JSON.stringify(hints))}">
    <div class="fallback"><b>${esc(s.typeIcon)}</b><span>Passende locatie­foto wordt geladen…</span></div>
    <img alt="${esc(s.title)}" loading="lazy" referrerpolicy="no-referrer">
    <a class="credit" target="_blank" rel="noopener">📷 Wikipedia / Wikimedia Commons</a>
    <span class="letter">${esc(s.letter)}</span>
  </div>`
}

function stop(day,s){return`<article class="stop">${media(s)}<div class="content"><div class="time">${esc(s.time)}</div><h3>${esc(s.title)}</h3><div class="badges"><span>${esc(s.typeIcon)} ${esc(s.type)}</span><span>⏳ ${esc(s.visit)}</span><span>📌 ${esc(s.inside)}</span></div><p>${esc(s.summary)}</p><details><summary>Meer uitleg en praktisch</summary><div class="details"><p><strong>Wat doen jullie?</strong> ${esc(s.details)}</p><p><strong>Praktisch:</strong> ${esc(s.practical)}</p><p><strong>Adres:</strong> ${esc(s.address)}</p></div></details><div class="buttons"><a class="primary" href="${mapsSearch(s.address)}">📍 Google Maps</a><a href="${esc(s.video)}">▶️ Filmpjes</a>${s.official?`<a href="${esc(s.official)}">🌐 Website</a>`:''}</div></div></article>`}
function leg(day,l){const a=day.stops.find(x=>x.letter===l.from),b=day.stops.find(x=>x.letter===l.to);return`<section class="leg"><div class="legtop"><strong>${l.from} → ${l.to}: ${esc(b.title)}</strong><span>${esc(l.distance)}</span></div><div class="modes"><a class="mode ${best(l,'walking')}" href="${mapsDir(a.address,b.address,'walking')}">🚶<b>${l.walk} min</b><span>Lopen</span><small>live route</small></a><a class="mode ${best(l,'transit')}" href="${mapsDir(a.address,b.address,'transit')}">🚆<b>${l.transit} min</b><span>OV</span><small>live route</small></a><a class="mode ${best(l,'driving')}" href="${mapsDir(a.address,b.address,'driving')}">🚕<b>${l.taxi} min</b><span>Taxi</span><small>rijroute</small></a></div><div class="advice"><strong>Advies: ${esc(l.recommend)}</strong><br>${esc(l.note)}</div>${save(l)}</section>`}
function day(d){let flow='';d.stops.forEach((s,i)=>{flow+=stop(d,s);if(d.legs[i])flow+=leg(d,d.legs[i])});const hero=d.stops.find(s=>s.wiki_exact)||d.stops[0];return`<section class="day" id="${d.id}"><div class="dayhead media" data-wiki="${esc(hero.wiki_exact||'')}" data-title="${esc(hero.title)}" data-hints="[]"><div class="fallback"><b>🗺️</b><span>${esc(d.date)}</span></div><img alt="${esc(d.title)}" referrerpolicy="no-referrer"><a class="credit" target="_blank" rel="noopener">📷 Wikipedia / Wikimedia Commons</a><div class="shade"></div><div class="daytitle"><span>${esc(d.date)}</span><h2>${esc(d.title)}</h2><p>${esc(d.summary)}</p></div></div><div class="meta"><span>🌡️ ${esc(d.weather)}</span><span>🕒 ${d.start}–${d.end}</span><span>🚶 ${esc(d.stats.walk)}</span><span>📍 ${esc(d.stats.visit)}</span></div><div class="routes">${d.fullRoutes.map(r=>`<a class="route" href="${esc(r.url)}">🗺️ ${esc(r.label)}</a>`).join('')}</div>${flow}</section>`}

async function summary(lang,title){
  const key=`summary:${lang}:${title}`;if(photoCache.has(key))return photoCache.get(key);
  const promise=fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`)
    .then(r=>r.ok?r.json():null)
    .then(j=>j&&(j.thumbnail?.source||j.originalimage?.source)?{url:j.thumbnail?.source||j.originalimage?.source,page:j.content_urls?.desktop?.page||`https://${lang}.wikipedia.org/wiki/${encodeURIComponent(title)}`} : null)
    .catch(()=>null);
  photoCache.set(key,promise);return promise;
}

async function searchPhoto(lang,query){
  const key=`search:${lang}:${query}`;if(photoCache.has(key))return photoCache.get(key);
  const promise=fetch(`https://${lang}.wikipedia.org/w/rest.php/v1/search/page?q=${encodeURIComponent(query)}&limit=8`)
    .then(r=>r.ok?r.json():null)
    .then(j=>{
      const pages=j?.pages||[];
      const exact=pages.find(p=>p.thumbnail&&p.title.toLowerCase()===query.toLowerCase());
      const item=exact||pages.find(p=>p.thumbnail);
      if(!item?.thumbnail?.url)return null;
      const url=item.thumbnail.url.startsWith('//')?'https:'+item.thumbnail.url:item.thumbnail.url;
      return{url,page:`https://${lang}.wikipedia.org/wiki/${encodeURIComponent(item.key||item.title)}`};
    }).catch(()=>null);
  photoCache.set(key,promise);return promise;
}

async function findPhoto(el){
  const wiki=el.dataset.wiki||'';
  const title=el.dataset.title||'';
  let hints=[];try{hints=JSON.parse(el.dataset.hints||'[]')}catch{}
  const attempts=[];
  if(wiki)attempts.push(()=>summary('en',wiki),()=>summary('de',wiki));
  for(const q of [...hints,title].filter(Boolean)){
    attempts.push(()=>searchPhoto('de',q),()=>searchPhoto('en',q));
  }
  for(const attempt of attempts){
    const found=await attempt();
    if(found?.url)return found;
  }
  return null;
}

async function loadMedia(el){
  const found=await findPhoto(el);
  const fallback=el.querySelector('.fallback span');
  if(!found){if(fallback)fallback.textContent='Geen passende openbare foto gevonden';return}
  const img=el.querySelector('img');
  const credit=el.querySelector('.credit');
  img.onload=()=>el.classList.add('loaded');
  img.onerror=()=>{el.classList.remove('loaded');if(fallback)fallback.textContent='Foto kon niet worden geladen';};
  img.src=found.url;
  credit.href=found.page;
}

function init(){
  document.getElementById('daynav').innerHTML=DAYS.map(d=>`<a href="#${d.id}"><b>${esc(d.short)}</b><small>${esc(d.date.split(' ',1)[0])} ${esc(d.date.split(' ').slice(1).join(' '))}</small></a>`).join('')+'<a href="#install"><b>📲</b><small>Installeren</small></a>';
  document.getElementById('app').innerHTML=DAYS.map(day).join('');
  const items=[...document.querySelectorAll('.media')];
  if('IntersectionObserver'in window){
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){loadMedia(e.target);io.unobserve(e.target)}}),{rootMargin:'500px'});
    items.forEach(x=>io.observe(x));
  }else items.forEach(loadMedia);
  if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js');
}
document.addEventListener('DOMContentLoaded',init);
