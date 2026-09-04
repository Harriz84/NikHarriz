const COLORS = { boxmeer:'#2f7ee6', noord:'#ff8a1c', zuid:'#52b43b' };

const areas = {
  boxmeer: {
    id:'boxmeer', name:'Boxmeer', type:'Wijk', parent:'Land van Cuijk', color:COLORS.boxmeer,
    center:[51.6468,5.9474], zoom:14,
    kpis:[['👥','Inwoners','12.460','± 2024'],['🏠','Huishoudens','5.610','± 2024'],['🧓','% 65+','22%','± 2024'],['€','Lage inkomens','10%','± 2024']],
    compare:{age:22,income:10,benefit:3.1},
    population:[12400,12490,12580,12690,12810], incomeTrend:[10.8,10.6,10.4,10.2,10.0]
  },
  noord: {
    id:'noord', name:'Bakelgeert-Noord', type:'Buurt', parent:'Boxmeer', color:COLORS.noord,
    center:[51.6435,5.9532], zoom:15,
    kpis:[['👥','Inwoners','1.540','± 2024'],['🏠','Huishoudens','680','± 2024'],['🧓','% 65+','24%','± 2024'],['€','Lage inkomens','11%','± 2024']],
    compare:{age:24,income:11,benefit:3.6},
    population:[1460,1480,1500,1520,1540], incomeTrend:[12.4,12.4,12.0,11.5,11.0]
  },
  zuid: {
    id:'zuid', name:'Bakelgeert-Zuid', type:'Buurt', parent:'Boxmeer', color:COLORS.zuid,
    center:[51.6405,5.9503], zoom:15,
    kpis:[['👥','Inwoners','1.260','± 2024'],['🏠','Huishoudens','540','± 2024'],['🧓','% 65+','20%','± 2024'],['€','Lage inkomens','7%','± 2024']],
    compare:{age:20,income:7,benefit:2.4},
    population:[1200,1210,1225,1240,1260], incomeTrend:[8.2,8.0,7.8,7.4,7.0]
  }
};

const polygons = {
  boxmeer:[[51.655,5.932],[51.655,5.957],[51.648,5.965],[51.638,5.961],[51.633,5.948],[51.638,5.935]],
  noord:[[51.6466,5.9487],[51.6455,5.9581],[51.6420,5.9589],[51.6405,5.9518],[51.6430,5.9463]],
  zuid:[[51.6430,5.9463],[51.6405,5.9518],[51.6382,5.9522],[51.6365,5.9475],[51.6388,5.9435]]
};

const themes = ['👥 Demografie','♿ Inkomen','⌂ Wonen','♿ Wmo','⚭ Jeugd','⚙ Participatie','♡ Gezondheid','🛡 Veiligheid','🎓 Onderwijs','ϟ Energie'];
const insights = [
  ['👥','Demografie','inwoners · leeftijdsopbouw · huishoudens · verhuizingen','Buurtniveau'],
  ['€','Inkomen & bestaanszekerheid','gemiddeld inkomen · lage inkomens · bijstand · schulden','Buurtniveau'],
  ['⌂','Wonen','koop/huur · WOZ · woningtypen · energieverbruik · zonnepanelen','Buurtniveau'],
  ['♿','Sociaal domein','Wmo · jeugdhulp · participatie · mantelzorg','Buurt / Wijk'],
  ['♡','Gezondheid','ervaren gezondheid · eenzaamheid · leefstijl','Buurt / Wijk'],
  ['🛡','Veiligheid','woninginbraak · overlast · incidenten','Wijkniveau'],
  ['🎓','Onderwijs & jeugd','onderwijsachterstand · jongeren','Wijk / Gemeente']
];

let selected = 'noord';
let charts = [];

const map = L.map('map',{zoomControl:false}).setView(areas.noord.center, areas.noord.zoom);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19, attribution:'© OpenStreetMap'}).addTo(map);
L.control.zoom({position:'topright'}).addTo(map);

const layers = {};
for (const [id, coords] of Object.entries(polygons)) {
  const a = areas[id];
  layers[id] = L.polygon(coords,{color:a.color,weight:id==='boxmeer'?2:3,fillColor:a.color,fillOpacity:id==='boxmeer'?.05:.14,dashArray:id==='boxmeer'?'6 6':null})
    .addTo(map)
    .bindTooltip(a.name,{permanent:true,direction:'center',className:'area-label'})
    .on('click',()=>selectArea(id));
}

L.marker(areas.noord.center).addTo(map).bindPopup('<strong>Bakelgeert-Noord</strong><br>Klik voor buurtprofiel').on('click',()=>selectArea('noord'));
L.marker(areas.zuid.center).addTo(map).bindPopup('<strong>Bakelgeert-Zuid</strong><br>Klik voor buurtprofiel').on('click',()=>selectArea('zuid'));

function selectArea(id){
  selected=id; const a=areas[id];
  map.flyTo(a.center,a.zoom,{duration:.6});
  renderAll();
  Object.entries(layers).forEach(([key,layer])=>layer.setStyle({fillOpacity:key===id ? .22 : key==='boxmeer' ? .05 : .10,weight:key===id ? 4 : key==='boxmeer' ? 2 : 3}));
}

function renderAll(){
  const a=areas[selected];
  document.getElementById('areaTitle').textContent=a.name;
  document.getElementById('areaSubtitle').textContent=`${a.type} in ${a.parent} · Land van Cuijk`;
  document.getElementById('breadcrumbs').innerHTML = selected==='boxmeer'
    ? `Land van Cuijk &nbsp;›&nbsp; <b>Boxmeer</b>`
    : `Land van Cuijk &nbsp;›&nbsp; Boxmeer &nbsp;›&nbsp; <b>${a.name}</b>`;

  document.getElementById('kpiGrid').innerHTML=a.kpis.map(([icon,label,value,meta])=>`<div class="kpi-card"><div class="kpi-top"><span class="kpi-icon">${icon}</span>${label}</div><div class="kpi-value">${value}</div><div class="kpi-meta">${meta}</div></div>`).join('');

  document.getElementById('insightGrid').innerHTML=insights.map(([icon,title,text,level])=>`<button class="insight-card" onclick="alert('${title}: in het echte dashboard opent hier de detailweergave met grafieken, bron en historie.')"><div class="insight-icon">${icon}</div><h3>${title} <span style="float:right">›</span></h3><p>${text}</p><span class="level-badge">${level}</span></button>`).join('');

  renderComparison();
  renderCharts();
}

function renderComparison(){
  const arr=[areas.boxmeer,areas.noord,areas.zuid];
  document.getElementById('compareLegend').innerHTML=arr.map(x=>`<span style="margin-left:12px"><span class="dot" style="background:${x.color}"></span> ${x.name}</span>`).join('');
  const metrics=[['% 65+','aandeel inwoners','age',30,'%'],['Lage inkomens','% van huishoudens','income',15,'%'],['Bijstand','% 18–65 jaar','benefit',5,'%']];
  document.getElementById('comparisonGrid').innerHTML=metrics.map(([title,sub,key,max,suffix])=>`<div class="metric"><div class="metric-title">${title}</div><div class="metric-sub">${sub}</div>${arr.map(x=>`<div class="barrow"><div class="bar" style="background:${x.color};width:${Math.max(8,(x.compare[key]/max)*72)}%"></div><span>${String(x.compare[key]).replace('.',',')}${suffix}</span></div>`).join('')}</div>`).join('');
}

function renderCharts(){
  charts.forEach(c=>c.destroy()); charts=[];
  const arr=[areas.boxmeer,areas.noord,areas.zuid];
  const common={responsive:true,maintainAspectRatio:false,plugins:{legend:{display:true,labels:{boxWidth:8,usePointStyle:true,font:{size:9}}}},scales:{x:{grid:{display:false},ticks:{font:{size:9}}},y:{grid:{color:'#eef1f5'},ticks:{font:{size:9}}}}};
  charts.push(new Chart(document.getElementById('populationChart'),{type:'line',data:{labels:['2020','2021','2022','2023','2024'],datasets:arr.map(x=>({label:x.name,data:x.population,borderColor:x.color,backgroundColor:x.color,tension:.35,pointRadius:2}))},options:{...common,plugins:{...common.plugins,title:{display:true,text:'Bevolking 2020–2024',align:'start',font:{size:12,weight:'700'}}}}}));
  charts.push(new Chart(document.getElementById('incomeChart'),{type:'line',data:{labels:['2020','2021','2022','2023','2024'],datasets:arr.map(x=>({label:x.name,data:x.incomeTrend,borderColor:x.color,backgroundColor:x.color,tension:.35,pointRadius:2}))},options:{...common,plugins:{...common.plugins,title:{display:true,text:'Lage inkomens 2020–2024',align:'start',font:{size:12,weight:'700'}}}}}));
}

function initSidebars(){
  document.getElementById('compareList').innerHTML=[areas.boxmeer,areas.noord,areas.zuid].map(x=>`<div class="compare-chip"><span class="dot" style="background:${x.color}"></span>${x.name}<span class="remove">×</span></div>`).join('');
  document.getElementById('themeGrid').innerHTML=themes.map((t,i)=>`<button class="theme-btn ${i===0?'active':''}">${t}</button>`).join('');
  document.querySelectorAll('.theme-btn').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.theme-btn').forEach(x=>x.classList.remove('active'));btn.classList.add('active')}));
  document.querySelectorAll('#levelSwitch button').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('#levelSwitch button').forEach(x=>x.classList.remove('active'));btn.classList.add('active'); if(btn.dataset.level==='wijk') selectArea('boxmeer');}));
}

initSidebars();
renderAll();
