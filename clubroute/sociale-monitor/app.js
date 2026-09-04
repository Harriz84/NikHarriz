const TEAL = '#068c8f';
const TEAL_DARK = '#006d70';
const ORANGE = '#ff8a1c';
const MUTED = '#91a0ae';

const POP_2026 = {
  'Maasbroeksche Blokken': 726,
  'Boxmeer buitengebied Oost': 48,
  'Hollesteeg': 1320,
  'De Elzen': 1547,
  'Bakelgeert-Noord': 2602,
  'Boxmeer Centrum': 2101,
  'Villapark ’t Zand': 528,
  'Boxmeer buitengebied West': 40,
  'Bakelgeert-Zuid': 1121,
  'Bedrijventerrein Saxa Gotha': 327,
  'Luneven': 2571
};

const ORDER = [
  'Maasbroeksche Blokken',
  'Boxmeer buitengebied Oost',
  'Hollesteeg',
  'De Elzen',
  'Bakelgeert-Noord',
  'Boxmeer Centrum',
  'Villapark ’t Zand',
  'Boxmeer buitengebied West',
  'Bakelgeert-Zuid',
  'Bedrijventerrein Saxa Gotha',
  'Luneven'
];

const TOTAL_2026 = Object.values(POP_2026).reduce((a,b)=>a+b,0);
const PDOK_URL = 'https://api.pdok.nl/cbs/wijken-en-buurten-2025/ogc/v1/collections/buurten/items?f=json&limit=100&bbox=5.89,51.60,6.02,51.70';

let featuresByName = {};
let selected = 'boxmeer';
let geoLayer = null;
let charts = [];
let labelsEnabled = true;

const map = L.map('map', { zoomControl:false, preferCanvas:true }).setView([51.646, 5.948], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom:19,
  attribution:'© OpenStreetMap'
}).addTo(map);
L.control.zoom({position:'topright'}).addTo(map);

const normalize = s => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`]/g,"'").trim();
const allowed = new Map(ORDER.map(n => [normalize(n), n]));
const fmtInt = n => Number.isFinite(Number(n)) ? new Intl.NumberFormat('nl-NL').format(Number(n)) : '–';
const fmtDec = (n,d=1) => Number.isFinite(Number(n)) ? Number(n).toLocaleString('nl-NL',{minimumFractionDigits:d,maximumFractionDigits:d}) : '–';
const safe = v => (v === null || v === undefined || Number(v) <= -99990) ? null : Number(v);
const pct = v => safe(v) === null ? '–' : `${fmtInt(v)}%`;

function prop(feature,key){ return feature?.properties ? safe(feature.properties[key]) : null; }
function textProp(feature,key){ const v=feature?.properties?.[key]; return (v===null||v===undefined||String(v).includes('-99997')) ? null : v; }

function weightedPercent(features, field, weightField='aantal_inwoners'){
  let num=0, den=0;
  features.forEach(f=>{
    const p=prop(f,field), w=prop(f,weightField);
    if(p!==null && w!==null && w>0){ num += p*w; den += w; }
  });
  return den ? num/den : null;
}

function aggregateBoxmeer(){
  const fs = ORDER.map(n=>featuresByName[n]).filter(Boolean);
  const sum = field => fs.reduce((t,f)=>t+(prop(f,field)||0),0);
  const households = sum('aantal_huishoudens');
  const inwoners = sum('aantal_inwoners');
  const land = sum('oppervlakte_land_in_ha');
  const water = sum('oppervlakte_water_in_ha');
  return {
    name:'Boxmeer', type:'Wijk', properties:{
      aantal_inwoners: inwoners || 12850,
      aantal_huishoudens: households,
      gemiddelde_huishoudsgrootte: households ? inwoners/households : null,
      mannen: sum('mannen'), vrouwen: sum('vrouwen'),
      oppervlakte_land_in_ha: land,
      oppervlakte_water_in_ha: water,
      bevolkingsdichtheid_inwoners_per_km2: land ? inwoners/(land/100) : null,
      omgevingsadressendichtheid: weightedPercent(fs,'omgevingsadressendichtheid'),
      percentage_personen_0_tot_15_jaar: weightedPercent(fs,'percentage_personen_0_tot_15_jaar'),
      percentage_personen_15_tot_25_jaar: weightedPercent(fs,'percentage_personen_15_tot_25_jaar'),
      percentage_personen_25_tot_45_jaar: weightedPercent(fs,'percentage_personen_25_tot_45_jaar'),
      percentage_personen_45_tot_65_jaar: weightedPercent(fs,'percentage_personen_45_tot_65_jaar'),
      percentage_personen_65_jaar_en_ouder: weightedPercent(fs,'percentage_personen_65_jaar_en_ouder'),
      percentage_eenpersoonshuishoudens: weightedPercent(fs,'percentage_eenpersoonshuishoudens','aantal_huishoudens'),
      percentage_huishoudens_zonder_kinderen: weightedPercent(fs,'percentage_huishoudens_zonder_kinderen','aantal_huishoudens'),
      percentage_huishoudens_met_kinderen: weightedPercent(fs,'percentage_huishoudens_met_kinderen','aantal_huishoudens'),
      percentage_met_herkomstland_nederland: weightedPercent(fs,'percentage_met_herkomstland_nederland'),
      percentage_met_herkomstland_uit_europa_excl_nl: weightedPercent(fs,'percentage_met_herkomstland_uit_europa_excl_nl'),
      percentage_met_herkomstland_buiten_europa: weightedPercent(fs,'percentage_met_herkomstland_buiten_europa')
    }
  };
}

function selectedFeature(){
  return selected === 'boxmeer' ? aggregateBoxmeer() : featuresByName[selected];
}

function currentPopulation(){ return selected === 'boxmeer' ? TOTAL_2026 : POP_2026[selected]; }

function renderNeighbourLists(filter=''){
  const q=normalize(filter);
  const names=ORDER.filter(n=>normalize(n).includes(q));
  const html=names.map(n=>`<button class="buurt-row ${selected===n?'active':''}" data-name="${n.replace(/"/g,'&quot;')}"><span>${n}</span><strong>${fmtInt(POP_2026[n])}</strong></button>`).join('');
  document.getElementById('buurtList').innerHTML=html;
  document.querySelectorAll('.buurt-row').forEach(btn=>btn.addEventListener('click',()=>selectArea(btn.dataset.name)));

  document.getElementById('mobileBuurtStrip').innerHTML = [
    `<button class="mobile-chip ${selected==='boxmeer'?'active':''}" data-name="boxmeer">Heel Boxmeer</button>`,
    ...ORDER.map(n=>`<button class="mobile-chip ${selected===n?'active':''}" data-name="${n.replace(/"/g,'&quot;')}">${n}</button>`)
  ].join('');
  document.querySelectorAll('.mobile-chip').forEach(btn=>btn.addEventListener('click',()=>selectArea(btn.dataset.name)));
}

function layerStyle(feature){
  const name=feature.properties.__name;
  const isSelected=selected===name;
  return {
    color: isSelected ? ORANGE : TEAL_DARK,
    weight: isSelected ? 4 : 1.7,
    fillColor: isSelected ? ORANGE : TEAL,
    fillOpacity: isSelected ? .28 : .10
  };
}

function refreshLayerStyles(){
  if(!geoLayer) return;
  geoLayer.eachLayer(layer=>{
    const name=layer.feature?.properties?.__name;
    layer.setStyle(layerStyle(layer.feature));
    if(labelsEnabled && selected===name) layer.openTooltip(); else layer.closeTooltip();
  });
}

function selectArea(name){
  if(name!=='boxmeer' && !featuresByName[name]) return;
  selected=name;
  renderNeighbourLists(document.getElementById('sideSearch')?.value || '');
  renderData();
  refreshLayerStyles();

  if(name==='boxmeer'){
    fitBoxmeer();
    document.querySelector('[data-level="wijk"]')?.classList.add('active');
    document.querySelector('[data-level="buurt"]')?.classList.remove('active');
  } else {
    const layer=findLayer(name);
    if(layer) map.fitBounds(layer.getBounds(),{padding:[28,28],maxZoom:15});
    document.querySelector('[data-level="wijk"]')?.classList.remove('active');
    document.querySelector('[data-level="buurt"]')?.classList.add('active');
  }
}

function findLayer(name){
  let found=null;
  geoLayer?.eachLayer(l=>{ if(l.feature?.properties?.__name===name) found=l; });
  return found;
}

function fitBoxmeer(){ if(geoLayer && geoLayer.getBounds().isValid()) map.fitBounds(geoLayer.getBounds(),{padding:[18,18]}); }

function renderData(){
  const f=selectedFeature();
  if(!f) return;
  const p=f.properties || {};
  const isWijk=selected==='boxmeer';

  document.getElementById('areaTitle').textContent=isWijk?'Boxmeer':selected;
  document.getElementById('areaSubtitle').textContent=isWijk?'Wijk in Land van Cuijk · 11 buurten':'Buurt in wijk Boxmeer · Land van Cuijk';
  document.getElementById('breadcrumbs').innerHTML=isWijk?'Land van Cuijk &nbsp;›&nbsp; <b>Boxmeer</b>':`Land van Cuijk &nbsp;›&nbsp; Boxmeer &nbsp;›&nbsp; <b>${selected}</b>`;
  document.getElementById('detailLevel').textContent=isWijk?'Geaggregeerd uit CBS-buurten':'CBS-buurtniveau';
  document.getElementById('freshness').innerHTML=`<strong>Actualiteit:</strong> inwoners <b>2026</b> · demografie/huishoudens/ruimte <b>2025</b>${!isWijk && textProp(f,'buurtcode') ? ` · ${textProp(f,'buurtcode')}`:''}`;

  const kpis=[
    ['👥','Inwoners',fmtInt(currentPopulation()),'2026'],
    ['🏠','Huishoudens',fmtInt(safe(p.aantal_huishoudens)),'CBS 2025'],
    ['🧓','65+',pct(p.percentage_personen_65_jaar_en_ouder),'CBS 2025'],
    ['👤','Eenpersoon',pct(p.percentage_eenpersoonshuishoudens),'huishoudens · 2025']
  ];
  document.getElementById('kpiGrid').innerHTML=kpis.map(([icon,label,value,meta])=>`<div class="kpi-card"><div class="kpi-top"><span class="kpi-icon">${icon}</span>${label}</div><div class="kpi-value">${value}</div><div class="kpi-meta">${meta}</div></div>`).join('');

  const land=safe(p.oppervlakte_land_in_ha), water=safe(p.oppervlakte_water_in_ha);
  const profile=[
    ['Gem. huishouden', safe(p.gemiddelde_huishoudsgrootte)!==null?fmtDec(p.gemiddelde_huishoudsgrootte):'–','personen'],
    ['Bevolkingsdichtheid', fmtInt(safe(p.bevolkingsdichtheid_inwoners_per_km2)),'inw./km²'],
    ['Oppervlakte land', land!==null?fmtInt(land):'–','hectare'],
    ['Oppervlakte water', water!==null?fmtInt(water):'–','hectare'],
    ['Mannen', fmtInt(safe(p.mannen)),'CBS 2025'],
    ['Vrouwen', fmtInt(safe(p.vrouwen)),'CBS 2025'],
    ['Herkomst Nederland', pct(p.percentage_met_herkomstland_nederland),'inwoners'],
    ['Herkomst buiten Europa', pct(p.percentage_met_herkomstland_buiten_europa),'inwoners']
  ];
  if(!isWijk){ profile.push(['Meest voorkomende postcode', textProp(f,'meest_voorkomende_postcode') || '–','CBS 2025']); }
  document.getElementById('profileGrid').innerHTML=profile.map(([label,value,meta])=>`<div class="profile-item"><span>${label}</span><strong>${value}</strong><small>${meta}</small></div>`).join('');

  renderCharts(f);
}

function renderCharts(f){
  charts.forEach(c=>c.destroy()); charts=[];
  const p=f.properties || {};
  const baseOpts={responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{display:false},ticks:{font:{size:10}}},y:{beginAtZero:true,grid:{color:'#edf1f4'},ticks:{font:{size:10}}}}};

  const ageVals=[p.percentage_personen_0_tot_15_jaar,p.percentage_personen_15_tot_25_jaar,p.percentage_personen_25_tot_45_jaar,p.percentage_personen_45_tot_65_jaar,p.percentage_personen_65_jaar_en_ouder].map(v=>safe(v));
  charts.push(new Chart(document.getElementById('ageChart'),{
    type:'bar',
    data:{labels:['0–15','15–25','25–45','45–65','65+'],datasets:[{data:ageVals,backgroundColor:TEAL,borderRadius:6}]},
    options:{...baseOpts,plugins:{...baseOpts.plugins,title:{display:true,text:'Leeftijdsopbouw (%)',align:'start',font:{size:12,weight:'700'}}},scales:{...baseOpts.scales,y:{...baseOpts.scales.y,suggestedMax:35,ticks:{callback:v=>v+'%',font:{size:10}}}}}
  }));

  const hhVals=[p.percentage_eenpersoonshuishoudens,p.percentage_huishoudens_zonder_kinderen,p.percentage_huishoudens_met_kinderen].map(v=>safe(v));
  charts.push(new Chart(document.getElementById('householdChart'),{
    type:'doughnut',
    data:{labels:['Eenpersoon','Zonder kinderen','Met kinderen'],datasets:[{data:hhVals,backgroundColor:[TEAL,ORANGE,'#52b43b'],borderWidth:0}]},
    options:{responsive:true,maintainAspectRatio:false,cutout:'66%',plugins:{legend:{position:'bottom',labels:{boxWidth:9,usePointStyle:true,font:{size:9}}},title:{display:true,text:'Huishoudens (%)',align:'start',font:{size:12,weight:'700'}}}}
  }));

  const names=[...ORDER].sort((a,b)=>POP_2026[b]-POP_2026[a]);
  charts.push(new Chart(document.getElementById('populationChart'),{
    type:'bar',
    data:{labels:names,datasets:[{data:names.map(n=>POP_2026[n]),backgroundColor:names.map(n=>selected===n?ORANGE:TEAL),borderRadius:6}]},
    options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},title:{display:false}},scales:{x:{beginAtZero:true,grid:{color:'#edf1f4'},ticks:{font:{size:9}}},y:{grid:{display:false},ticks:{font:{size:9}}}}}
  }));
}

async function loadPDOK(){
  const status=document.getElementById('mapStatus');
  try{
    const res=await fetch(PDOK_URL,{headers:{'Accept':'application/geo+json, application/json'}});
    if(!res.ok) throw new Error(`PDOK ${res.status}`);
    const data=await res.json();
    const matches=(data.features||[]).filter(f=>allowed.has(normalize(f.properties?.buurtnaam)));
    matches.forEach(f=>{
      const canonical=allowed.get(normalize(f.properties.buurtnaam));
      f.properties.__name=canonical;
      featuresByName[canonical]=f;
    });
    if(Object.keys(featuresByName).length<11) console.warn('Niet alle Boxmeer-buurten gevonden',Object.keys(featuresByName));

    geoLayer=L.geoJSON({type:'FeatureCollection',features:matches},{
      style:layerStyle,
      onEachFeature:(feature,layer)=>{
        const name=feature.properties.__name;
        layer.bindTooltip(`<strong>${name}</strong><br>${fmtInt(POP_2026[name])} inwoners · 2026`,{sticky:true,className:'area-tooltip'});
        layer.on('click',()=>selectArea(name));
        layer.on('mouseover',()=>{ if(selected!==name) layer.setStyle({fillOpacity:.20,weight:2.5}); });
        layer.on('mouseout',()=>refreshLayerStyles());
      }
    }).addTo(map);

    status.textContent=`CBS-kaart · ${Object.keys(featuresByName).length} buurten`;
    status.classList.add('ok');
    fitBoxmeer();
    renderNeighbourLists();
    renderData();
  } catch(err){
    console.error(err);
    status.textContent='CBS-kaart kon niet laden';
    status.classList.add('error');
    document.getElementById('freshness').innerHTML='<strong>Let op:</strong> de live CBS-kaartlaag kon niet laden. De actuele inwoneraantallen 2026 blijven zichtbaar.';
    renderNeighbourLists();
    // fallback aggregate cards based on current population only
    document.getElementById('kpiGrid').innerHTML=`<div class="kpi-card"><div class="kpi-top">👥 Inwoners</div><div class="kpi-value">${fmtInt(TOTAL_2026)}</div><div class="kpi-meta">2026</div></div>`;
  }
}

function wireUI(){
  document.getElementById('fitButton').addEventListener('click',()=>selectArea('boxmeer'));
  document.getElementById('showAllButton').addEventListener('click',()=>selectArea('boxmeer'));
  document.getElementById('sideSearch').addEventListener('input',e=>renderNeighbourLists(e.target.value));
  document.getElementById('globalSearch').addEventListener('keydown',e=>{
    if(e.key!=='Enter') return;
    const q=normalize(e.target.value);
    const match=ORDER.find(n=>normalize(n).includes(q));
    if(match) selectArea(match);
  });
  document.getElementById('boundaryToggle').addEventListener('change',e=>{
    if(!geoLayer) return;
    if(e.target.checked) geoLayer.addTo(map); else map.removeLayer(geoLayer);
  });
  document.getElementById('labelsToggle').addEventListener('change',e=>{ labelsEnabled=e.target.checked; refreshLayerStyles(); });
  document.querySelectorAll('#levelSwitch button').forEach(btn=>btn.addEventListener('click',()=>{
    if(btn.dataset.level==='wijk') selectArea('boxmeer');
    if(btn.dataset.level==='buurt' && selected==='boxmeer') selectArea('Boxmeer Centrum');
  }));
}

wireUI();
renderNeighbourLists();
loadPDOK();
