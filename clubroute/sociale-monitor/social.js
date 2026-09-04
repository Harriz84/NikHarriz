(function(){
  const H={
    boxmeer:{lonely:46,severe:13,emotional:29,social:32,regie:87,rondkomen:13,support:94,volunteer:25,mantelzorg:15,stress:18,anxiety:9,suicide:10,year:'2024',level:'WIJK'},
    'Maasbroeksche Blokken':{lonely:39,severe:10,emotional:23,social:26,regie:91,rondkomen:8,year:'2024',level:'BUURT'},
    'Boxmeer buitengebied Oost':{severe:10,emotional:21,social:29,rondkomen:5,year:'2022',level:'BUURT',note:'Kleine buurt; niet alle recente indicatoren zijn publiceerbaar.'},
    'Hollesteeg':{lonely:42,severe:12,emotional:25,social:30,regie:88,rondkomen:12,support:95,year:'2024',level:'BUURT'},
    'De Elzen':{lonely:46,severe:12,emotional:28,social:30,regie:86,rondkomen:9,support:95,year:'2024',level:'BUURT'},
    'Bakelgeert-Noord':{lonely:51,severe:17,emotional:34,social:36,regie:84,rondkomen:17,year:'2024',level:'BUURT'},
    'Boxmeer Centrum':{lonely:47,severe:14,emotional:30,social:33,regie:86,rondkomen:13,support:94,year:'2024',level:'BUURT'},
    'Villapark ’t Zand':{lonely:37,severe:7,emotional:18,social:25,regie:92,rondkomen:5,support:96,year:'2024',level:'BUURT'},
    'Boxmeer buitengebied West':{lonely:40,severe:11,emotional:24,social:31,regie:64,rondkomen:16,year:'2022',level:'BUURT',note:'Laatste publiceerbare buurtwaarden zijn ouder.'},
    'Bakelgeert-Zuid':{lonely:46,severe:14,emotional:30,social:33,regie:85,rondkomen:15,year:'2024',level:'BUURT'},
    'Bedrijventerrein Saxa Gotha':{lonely:47,severe:14,emotional:30,social:33,regie:86,rondkomen:17,support:93,year:'2024',level:'BUURT'},
    'Luneven':{lonely:45,severe:13,emotional:28,social:32,regie:88,rondkomen:13,support:94,year:'2024',level:'BUURT'}
  };
  const WMO={boxmeer:87,'Maasbroeksche Blokken':17,'Boxmeer buitengebied Oost':null,'Hollesteeg':50,'De Elzen':157,'Bakelgeert-Noord':89,'Boxmeer Centrum':123,'Villapark ’t Zand':50,'Boxmeer buitengebied West':null,'Bakelgeert-Zuid':93,'Bedrijventerrein Saxa Gotha':52,'Luneven':67};
  const YOUTH={boxmeer:10,'Maasbroeksche Blokken':4.3,'Boxmeer buitengebied Oost':2.78,'Hollesteeg':12,'De Elzen':13,'Bakelgeert-Noord':11,'Boxmeer Centrum':10,'Villapark ’t Zand':9.4,'Boxmeer buitengebied West':null,'Bakelgeert-Zuid':7.8,'Bedrijventerrein Saxa Gotha':21,'Luneven':11};
  const CEO={know:67,speed:73,fit:85,municipality:7.7,result:82,provider:8.2};
  const LINKS={rivm:'https://data.rivm.nl/data/regiobeeld/config/figures/',wmo:'https://www.cbs.nl/nl-nl/cijfers/detail/86158NED',social:'https://www.cbs.nl/nl-nl/cijfers/detail/86156NED',youth:'https://www.cbs.nl/nl-nl/cijfers/detail/86165NED',ceo:'https://www.waarstaatjegemeente.nl/report/ceo_wmo/2024/UitvoeringCEOWmo_Land%20van%20Cuijk_1982.pdf'};

  const style=document.createElement('style');
  style.textContent=`
    .social-hero{background:linear-gradient(135deg,#e8f7f5,#fbfdfd);border:1px solid #cfe7e4;border-radius:15px;padding:14px;margin-bottom:12px}.social-hero-top{display:flex;justify-content:space-between;align-items:flex-start;gap:10px}.social-hero strong{font-size:14px}.social-hero p{margin:5px 0 0;color:#657181;font-size:10px;line-height:1.5}.social-hero-badge{font-size:8px;font-weight:850;color:#006d70;background:#fff;border:1px solid #cde6e3;border-radius:999px;padding:5px 7px;white-space:nowrap}
    .social-nav{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;margin:2px 0 12px}.social-nav::-webkit-scrollbar{display:none}.social-nav button{border:1px solid var(--line);background:#fff;border-radius:999px;padding:7px 10px;font-size:9px;white-space:nowrap;color:#566474}.social-nav button:hover{border-color:#a9d4d1;color:#006d70}
    .social-headlines{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.signal-card{border:1px solid var(--line);border-radius:13px;padding:12px;background:#fff;min-height:136px;display:flex;flex-direction:column}.signal-label{font-size:10px;font-weight:750;color:#485666}.signal-value{font-size:27px;font-weight:900;letter-spacing:-.03em;margin:7px 0 2px}.signal-unit{font-size:9px;color:#788493;margin-left:3px}.signal-compare{font-size:8.5px;color:#667382;min-height:15px;margin:2px 0 7px}.signal-track{height:7px;border-radius:999px;background:#edf1f3;position:relative;overflow:visible;margin:2px 0 10px}.signal-fill{height:100%;border-radius:999px;background:#068c8f}.signal-marker{position:absolute;top:-3px;width:2px;height:13px;background:#ff8a1c;border-radius:2px}.signal-footer{margin-top:auto;display:flex;justify-content:space-between;align-items:center;gap:7px;color:#929ba8;font-size:7.5px}.level-pill{display:inline-flex;border-radius:999px;padding:3px 6px;font-size:7px;font-weight:900;letter-spacing:.05em;background:#e8f7f5;color:#006d70}.level-pill.wijk{background:#edf3ff;color:#3c65a8}.level-pill.gemeente{background:#fff0df;color:#a86512}
    .social-section{scroll-margin-top:55px}.social-section-title{display:flex;align-items:flex-end;justify-content:space-between;gap:8px;margin:19px 0 8px}.social-section-title h3{font-size:13px;margin:0}.social-section-title span{font-size:8px;color:#8d98a5;text-align:right}.social-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.social-mini{border:1px solid var(--line);border-radius:12px;padding:11px;min-height:96px;background:#fff;display:flex;flex-direction:column}.social-mini>span{font-size:9px;color:#667382;line-height:1.3}.social-mini strong{display:block;font-size:19px;margin:5px 0 2px}.social-mini .mini-compare{font-size:8px;color:#7a8694;margin-bottom:7px}.social-mini small{font-size:7.5px;color:#929ca8;margin-top:auto}.social-warning{background:#fff8ed;border:1px solid #f1deb9;border-radius:11px;padding:9px 10px;font-size:8.5px;color:#735f40;margin:10px 0;line-height:1.45}
    .context-card{border:1px solid var(--line);border-radius:12px;padding:12px;background:#f9fbfc;font-size:9px;line-height:1.5;color:#64717f}.context-card strong{color:#263341}.care-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.care-card{border:1px solid var(--line);border-radius:12px;padding:12px;background:#fff}.care-card span{font-size:9px;color:#657181}.care-card strong{display:block;font-size:23px;margin:6px 0 2px}.care-card p{font-size:8px;line-height:1.4;color:#7d8895;margin:5px 0}.care-card a,.social-source-link{font-size:8px;color:#068c8f;text-decoration:none;font-weight:750}
    .ceo-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.ceo-card{border:1px solid var(--line);border-radius:12px;padding:11px;background:#fff;min-height:102px;display:flex;flex-direction:column}.ceo-card span{font-size:9px;color:#667382;line-height:1.35}.ceo-card strong{font-size:20px;display:block;margin:6px 0}.ceo-card small{font-size:7.5px;color:#939daa;margin-top:auto}
    .compare-details{border:1px solid var(--line);border-radius:12px;margin-top:16px;overflow:hidden}.compare-details summary{cursor:pointer;list-style:none;padding:11px 12px;font-size:10px;font-weight:800;background:#f8fafb}.compare-details summary::-webkit-details-marker{display:none}.social-table-wrap{overflow-x:auto}.social-table{width:100%;border-collapse:collapse;font-size:9px;min-width:650px}.social-table th,.social-table td{padding:8px 9px;border-bottom:1px solid #eef1f4;text-align:right;white-space:nowrap}.social-table th:first-child,.social-table td:first-child{text-align:left}.social-table tr.active{background:#eef9f7}.social-table th{background:#fff;color:#66717e;position:sticky;top:0}.sources-strip{display:flex;gap:7px;overflow-x:auto;scrollbar-width:none;margin-top:10px}.sources-strip::-webkit-scrollbar{display:none}.sources-strip a{white-space:nowrap;border:1px solid var(--line);border-radius:999px;padding:6px 8px;font-size:8px;color:#5b6876;text-decoration:none}.sources-strip a:hover{border-color:#a8d2cf;color:#006d70}
    @media(max-width:600px){.social-headlines{grid-template-columns:1fr}.signal-card{min-height:124px}.signal-value{font-size:30px}.social-grid,.care-grid,.ceo-grid{grid-template-columns:1fr}.social-mini{min-height:88px}.social-hero p{font-size:9px}.social-nav{margin-bottom:10px}.social-section-title h3{font-size:12px}}
  `;
  document.head.appendChild(style);

  const pct=v=>v===null||v===undefined?'–':`${Number(v).toLocaleString('nl-NL',{maximumFractionDigits:1})}%`;
  const num=v=>v===null||v===undefined?'–':Number(v).toLocaleString('nl-NL',{maximumFractionDigits:1});
  const lc=l=>l==='WIJK'?' wijk':l==='GEMEENTE'?' gemeente':'';
  const pill=l=>`<span class="level-pill${lc(l)}">${l}</span>`;
  function ownHealth(){return H[selected]||null;}
  function fallbackHealth(key){const own=ownHealth();if(own&&own[key]!==undefined&&own[key]!==null)return {value:own[key],level:own.level,year:own.year};return {value:H.boxmeer[key],level:'WIJK',year:H.boxmeer.year};}
  function careValue(map){const v=map[selected];if(v!==null&&v!==undefined)return {value:v,level:selected==='boxmeer'?'WIJK':'BUURT'};return {value:map.boxmeer,level:'WIJK'};}
  function deltaText(value,benchmark,unit='pp'){
    if(selected==='boxmeer'||value===null||value===undefined||benchmark===null||benchmark===undefined)return 'Wijkgemiddelde Boxmeer';
    const d=Number(value)-Number(benchmark),abs=Math.abs(d).toLocaleString('nl-NL',{maximumFractionDigits:1});
    if(Math.abs(d)<.05)return 'Gelijk aan Boxmeer';
    return `${abs} ${unit==='pp'?'p.p.':''} ${d>0?'hoger':'lager'} dan Boxmeer`.replace('  ',' ');
  }
  function meter(value,max,benchmark){const v=Math.max(0,Math.min(100,Number(value||0)/max*100));const b=Math.max(0,Math.min(100,Number(benchmark||0)/max*100));return `<div class="signal-track"><div class="signal-fill" style="width:${v}%"></div><i class="signal-marker" style="left:${b}%" title="Boxmeer"></i></div>`;}
  function signal(label,value,benchmark,{unit='%',max=100,level='BUURT',year='2024',source='RIVM',deltaUnit='pp'}={}){
    const val=unit==='%'?pct(value):num(value);return `<div class="signal-card"><span class="signal-label">${label}</span><div><span class="signal-value">${val}</span>${unit!=='%'?`<span class="signal-unit">${unit}</span>`:''}</div><div class="signal-compare">${deltaText(value,benchmark,deltaUnit)}</div>${meter(value,max,benchmark)}<div class="signal-footer"><span>${source} · ${year}</span>${pill(level)}</div></div>`;
  }
  function mini(label,m,benchmark,positive=false){const v=m.value;return `<div class="social-mini"><span>${label}</span><strong>${pct(v)}</strong><div class="mini-compare">${deltaText(v,benchmark,'pp')}</div><small>${pill(m.level)} ${m.year}</small></div>`;}

  function inject(){
    const tabs=document.getElementById('viewTabs');if(!tabs)return;
    let btn=tabs.querySelector('[data-view="social"]');
    if(!btn){btn=document.createElement('button');btn.dataset.view='social';btn.innerHTML='Sociaal <span>kern</span>';tabs.insertBefore(btn,tabs.querySelector('[data-view="all"]'));}
    let pane=document.getElementById('view-social');
    if(!pane){pane=document.createElement('div');pane.className='view-pane';pane.id='view-social';pane.innerHTML='<div id="socialContent"></div>';document.getElementById('view-all').parentNode.insertBefore(pane,document.getElementById('view-all'));}
    btn.onclick=()=>{document.querySelectorAll('#viewTabs button').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.view-pane').forEach(x=>x.classList.remove('active'));btn.classList.add('active');pane.classList.add('active');render();};
    const title=document.getElementById('areaTitle');if(title)new MutationObserver(()=>render()).observe(title,{childList:true,subtree:true,characterData:true});
    render();
  }

  function render(){
    const host=document.getElementById('socialContent');if(!host)return;
    const name=selected==='boxmeer'?'Boxmeer':selected, own=ownHealth();
    const lonely=fallbackHealth('lonely'),severe=fallbackHealth('severe'),emotional=fallbackHealth('emotional'),social=fallbackHealth('social'),regie=fallbackHealth('regie'),rond=fallbackHealth('rondkomen'),support=fallbackHealth('support');
    const wmo=careValue(WMO),youth=careValue(YOUTH),box=H.boxmeer;
    const caution=(selected!=='boxmeer'&&(!own||own.year!=='2024'))?`<div class="social-warning"><strong>Datadetail:</strong> voor deze kleine buurt is niet iedere indicator in 2024 publiceerbaar. Waar nodig toont de monitor de laatst beschikbare buurtwaarde of expliciet het wijkniveau.</div>`:'';
    const youngShare=(()=>{try{const f=selectedFeature();return f?prop(f,'percentage_personen_0_tot_15_jaar'):null}catch(e){return null}})();
    const rows=ORDER.map(n=>{const h=H[n]||{};return `<tr class="${selected===n?'active':''}"><td>${n}</td><td>${h.lonely===undefined?'–':pct(h.lonely)}</td><td>${h.rondkomen===undefined?'–':pct(h.rondkomen)}</td><td>${WMO[n]===null?'–':num(WMO[n])}</td><td>${YOUTH[n]===null?'–':pct(YOUTH[n])}</td></tr>`}).join('');

    host.innerHTML=`
      <div class="social-hero"><div class="social-hero-top"><div><strong>Sociaal profiel · ${name}</strong><p>De belangrijkste signalen voor sociaal werk, met bronjaar en geografisch niveau direct bij ieder cijfer.</p></div><span class="social-hero-badge">Boxmeer als referentie</span></div></div>
      <div class="social-nav"><button data-jump="wellbeing">Welzijn</button><button data-jump="youth">Jeugd</button><button data-jump="wmo">Wmo</button><button data-jump="income">Bestaanszekerheid</button><button data-jump="experience">Cliëntervaring</button></div>
      <div class="social-headlines">
        ${signal('Eenzaamheid',lonely.value,box.lonely,{level:lonely.level,year:lonely.year,source:'RIVM'})}
        ${signal('Moeite met rondkomen',rond.value,box.rondkomen,{level:rond.level,year:rond.year,source:'RIVM'})}
        ${signal('Wmo-gebruik',wmo.value,WMO.boxmeer,{unit:'per 1.000',max:180,level:wmo.level,year:'2024',source:'CBS',deltaUnit:'abs'})}
        ${signal('Jongeren met jeugdzorg',youth.value,YOUTH.boxmeer,{level:youth.level,year:'2024',source:'CBS'})}
      </div>
      ${caution}

      <section class="social-section" id="social-wellbeing"><div class="social-section-title"><h3>Welzijn & mentale gezondheid</h3><span>RIVM Gezondheidsmonitor</span></div><div class="social-grid">
        ${mini('Ernstig eenzaam',severe,box.severe)}
        ${mini('Emotioneel eenzaam',emotional,box.emotional)}
        ${mini('Sociaal eenzaam',social,box.social)}
        ${mini('Regie over eigen leven',regie,box.regie,true)}
        ${mini('Krijgt steun van anderen',support,box.support,true)}
        ${selected==='boxmeer'?mini('Veel stress',{value:box.stress,level:'WIJK',year:'2024'},box.stress):''}
      </div></section>

      <section class="social-section" id="social-youth"><div class="social-section-title"><h3>Jeugd & gezin</h3><span>CBS 2024/2025</span></div><div class="care-grid"><div class="care-card"><span>Jongeren met jeugdzorg</span><strong>${pct(youth.value)}</strong><p>${deltaText(youth.value,YOUTH.boxmeer,'pp')}. Kleine aantallen kunnen vanwege privacy worden afgeschermd.</p><div>${pill(youth.level)}</div></div><div class="care-card"><span>Aandeel inwoners 0–15 jaar</span><strong>${youngShare===null?'–':pct(youngShare)}</strong><p>Demografische context uit de officiële wijk- en buurtkerncijfers.</p><div>${pill(selected==='boxmeer'?'WIJK':'BUURT')}</div></div></div><div class="sources-strip"><a href="${LINKS.youth}" target="_blank" rel="noopener">CBS jeugddata ↗</a><a href="${LINKS.social}" target="_blank" rel="noopener">Stapeling sociaal domein ↗</a></div></section>

      <section class="social-section" id="social-wmo"><div class="social-section-title"><h3>Wmo & ondersteuning</h3><span>gebruik en ondersteuning</span></div><div class="care-grid"><div class="care-card"><span>Wmo-gebruik</span><strong>${num(wmo.value)} <small style="font-size:9px">per 1.000</small></strong><p>${deltaText(wmo.value,WMO.boxmeer,'abs')}. De nieuwste detailtabellen kunnen op wijkniveau ook type maatwerkvoorziening tonen.</p><div>${pill(wmo.level)}</div></div><div class="context-card"><strong>Wat kan hier nog bij?</strong><br>Hulp bij huishouden, begeleiding, hulpmiddelen, ondersteuning thuis, zorg in natura/PGB en stapeling met Jeugdwet en Participatiewet. Waar buurtdata ontbreekt, blijft het label <b>WIJK</b> zichtbaar.</div></div><div class="sources-strip"><a href="${LINKS.wmo}" target="_blank" rel="noopener">CBS Wmo 2025 ↗</a><a href="${LINKS.social}" target="_blank" rel="noopener">Gebruik sociaal domein ↗</a></div></section>

      <section class="social-section" id="social-income"><div class="social-section-title"><h3>Bestaanszekerheid</h3><span>ervaren én geregistreerde signalen</span></div><div class="care-grid"><div class="care-card"><span>Moeite met rondkomen</span><strong>${pct(rond.value)}</strong><p>${deltaText(rond.value,box.rondkomen,'pp')}.</p><div>${pill(rond.level)}</div></div><div class="context-card"><strong>Combineer met harde data.</strong><br>In de monitor staan daarnaast bijstand, WW, arbeidsongeschiktheid, inkomen en andere CBS-indicatoren. Zo kun je ervaren financiële druk naast geregistreerde bestaanszekerheidsdata leggen.</div></div></section>

      <section class="social-section" id="social-experience"><div class="social-section-title"><h3>Cliëntervaring Wmo</h3><span>Land van Cuijk · gemeenteniveau</span></div><div class="ceo-grid">
        <div class="ceo-card"><span>Wist waar men moest zijn</span><strong>${CEO.know}%</strong><small>${pill('GEMEENTE')} CEO Wmo</small></div>
        <div class="ceo-card"><span>Vond dat men snel werd geholpen</span><strong>${CEO.speed}%</strong><small>${pill('GEMEENTE')} CEO Wmo</small></div>
        <div class="ceo-card"><span>Oplossing sluit aan bij behoefte</span><strong>${CEO.fit}%</strong><small>${pill('GEMEENTE')} CEO Wmo</small></div>
        <div class="ceo-card"><span>Tevreden met resultaat</span><strong>${CEO.result}%</strong><small>${pill('GEMEENTE')} CEO Wmo</small></div>
        <div class="ceo-card"><span>Rapportcijfer hulp bij aanvraag</span><strong>${String(CEO.municipality).replace('.',',')}</strong><small>${pill('GEMEENTE')}</small></div>
        <div class="ceo-card"><span>Rapportcijfer zorgaanbieder</span><strong>${String(CEO.provider).replace('.',',')}</strong><small>${pill('GEMEENTE')}</small></div>
      </div><div class="sources-strip"><a href="${LINKS.ceo}" target="_blank" rel="noopener">CEO Wmo bronrapport ↗</a><a href="${LINKS.rivm}" target="_blank" rel="noopener">RIVM gezondheidsdata ↗</a></div></section>

      <details class="compare-details"><summary>Vergelijk alle 11 buurten van Boxmeer</summary><div class="social-table-wrap"><table class="social-table"><thead><tr><th>Buurt</th><th>Eenzaam</th><th>Rondkomen</th><th>Wmo / 1.000</th><th>Jeugdzorg</th></tr></thead><tbody>${rows}</tbody></table></div></details>
    `;
    host.querySelectorAll('.social-nav button').forEach(b=>b.onclick=()=>document.getElementById(`social-${b.dataset.jump}`)?.scrollIntoView({behavior:'smooth',block:'start'}));
  }
  inject();
})();