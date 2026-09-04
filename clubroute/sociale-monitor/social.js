(function(){
  const H={
    boxmeer:{lonely:46,severe:13,emotional:29,social:32,regie:87,rondkomen:13,support:94,volunteer:25,mantelzorg:15,stress:18,anxiety:9,suicide:10,year:'2024',level:'WIJK'},
    'Maasbroeksche Blokken':{lonely:39,severe:10,emotional:23,social:26,regie:91,rondkomen:8,year:'2024',level:'BUURT'},
    'Boxmeer buitengebied Oost':{severe:10,emotional:21,social:29,rondkomen:5,year:'2022',level:'BUURT',note:'Kleine buurt; niet alle 2024-indicatoren zijn publiceerbaar.'},
    'Hollesteeg':{lonely:42,severe:12,emotional:25,social:30,regie:88,rondkomen:12,support:95,year:'2024',level:'BUURT'},
    'De Elzen':{lonely:46,severe:12,emotional:28,social:30,regie:86,rondkomen:9,support:95,year:'2024',level:'BUURT'},
    'Bakelgeert-Noord':{lonely:51,severe:17,emotional:34,social:36,regie:84,rondkomen:17,year:'2024',level:'BUURT'},
    'Boxmeer Centrum':{lonely:47,severe:14,emotional:30,social:33,regie:86,rondkomen:13,support:94,year:'2024',level:'BUURT'},
    'Villapark ’t Zand':{lonely:37,severe:7,emotional:18,social:25,regie:92,rondkomen:5,support:96,year:'2024',level:'BUURT'},
    'Boxmeer buitengebied West':{lonely:40,severe:11,emotional:24,social:31,regie:64,rondkomen:16,year:'2022',level:'BUURT',note:'Laatste publiceerbare buurtwaarden zijn ouder; regie is uit 2020.'},
    'Bakelgeert-Zuid':{lonely:46,severe:14,emotional:30,social:33,regie:85,rondkomen:15,year:'2024',level:'BUURT'},
    'Bedrijventerrein Saxa Gotha':{lonely:47,severe:14,emotional:30,social:33,regie:86,rondkomen:17,support:93,year:'2024',level:'BUURT'},
    'Luneven':{lonely:45,severe:13,emotional:28,social:32,regie:88,rondkomen:13,support:94,year:'2024',level:'BUURT'}
  };

  const WMO={boxmeer:87,'Maasbroeksche Blokken':17,'Boxmeer buitengebied Oost':null,'Hollesteeg':50,'De Elzen':157,'Bakelgeert-Noord':89,'Boxmeer Centrum':123,'Villapark ’t Zand':50,'Boxmeer buitengebied West':null,'Bakelgeert-Zuid':93,'Bedrijventerrein Saxa Gotha':52,'Luneven':67};
  const YOUTH={boxmeer:10,'Maasbroeksche Blokken':4.3,'Boxmeer buitengebied Oost':2.78,'Hollesteeg':12,'De Elzen':13,'Bakelgeert-Noord':11,'Boxmeer Centrum':10,'Villapark ’t Zand':9.4,'Boxmeer buitengebied West':null,'Bakelgeert-Zuid':7.8,'Bedrijventerrein Saxa Gotha':21,'Luneven':11};
  const CEO={know:67,speed:73,fit:85,municipality:7.7,result:82,provider:8.2};
  const LINKS={
    rivm:'https://data.rivm.nl/data/regiobeeld/config/figures/',
    wmo:'https://www.cbs.nl/nl-nl/cijfers/detail/86158NED',
    social:'https://www.cbs.nl/nl-nl/cijfers/detail/86156NED',
    youth:'https://www.cbs.nl/nl-nl/cijfers/detail/86165NED',
    ceo:'https://www.waarstaatjegemeente.nl/report/ceo_wmo/2024/UitvoeringCEOWmo_Land%20van%20Cuijk_1982.pdf'
  };

  const style=document.createElement('style');
  style.textContent=`
    .social-hero{background:linear-gradient(135deg,#e8f7f5,#f8fbfa);border:1px solid #cfe7e4;border-radius:14px;padding:14px;margin-bottom:12px}.social-hero strong{font-size:14px}.social-hero p{margin:5px 0 0;color:#657181;font-size:10px;line-height:1.45}.social-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.social-card{border:1px solid var(--line);border-radius:12px;padding:11px;background:#fff;min-height:96px;display:flex;flex-direction:column}.social-card .label{font-size:9px;color:#687386}.social-card strong{font-size:21px;margin:6px 0 3px}.social-card small{font-size:8px;color:#929ba8;margin-top:auto}.level-pill{display:inline-block;border-radius:999px;padding:3px 6px;font-size:7px;font-weight:900;letter-spacing:.05em;margin-left:4px;background:#e8f7f5;color:#006d70}.level-pill.wijk{background:#edf3ff;color:#3c65a8}.level-pill.gemeente{background:#fff0df;color:#b46708}.social-section-title{display:flex;align-items:flex-end;justify-content:space-between;gap:8px;margin:18px 0 8px}.social-section-title h3{font-size:13px;margin:0}.social-section-title span{font-size:8px;color:#8d98a5}.social-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.social-mini{border:1px solid var(--line);border-radius:11px;padding:10px;min-height:82px}.social-mini span{display:block;font-size:8.5px;color:#6b7685}.social-mini strong{display:block;font-size:16px;margin:4px 0}.social-mini small{font-size:7.5px;color:#969fab}.social-warning{background:#fff8ed;border:1px solid #f4dfbd;border-radius:10px;padding:9px 10px;font-size:8.5px;color:#7b6542;margin-top:8px}.social-table-wrap{overflow-x:auto;border:1px solid var(--line);border-radius:12px}.social-table{width:100%;border-collapse:collapse;font-size:9px;min-width:620px}.social-table th,.social-table td{padding:8px 9px;border-bottom:1px solid #eef1f4;text-align:right;white-space:nowrap}.social-table th:first-child,.social-table td:first-child{text-align:left}.social-table tr.active{background:#eef9f7}.social-table th{background:#f8fafb;color:#66717e;position:sticky;top:0}.source-row{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}.source-link{border:1px solid var(--line);border-radius:11px;padding:10px;text-decoration:none;color:var(--ink);display:flex;flex-direction:column;gap:4px}.source-link strong{font-size:10px}.source-link span{font-size:8px;color:#788390;line-height:1.4}.source-link em{font-style:normal;font-size:7.5px;color:#068c8f;margin-top:auto}.ceo-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.ceo-card{border:1px solid var(--line);border-radius:11px;padding:10px;background:#fff;min-height:90px}.ceo-card span{font-size:8px;color:#6f7a88;line-height:1.3}.ceo-card strong{font-size:18px;display:block;margin:5px 0}.ceo-card small{font-size:7.5px;color:#9aa3af}@media(max-width:700px){.social-kpis{grid-template-columns:1fr 1fr}.social-grid{grid-template-columns:1fr 1fr}.ceo-grid{grid-template-columns:1fr 1fr}.source-row{grid-template-columns:1fr}}`;
  document.head.appendChild(style);

  function pct(v){return v===null||v===undefined?'–':`${String(v).replace('.',',')}%`}
  function num(v){return v===null||v===undefined?'–':String(v).replace('.',',')}
  function levelClass(level){return level==='BUURT'?'':level==='WIJK'?' wijk':' gemeente'}
  function pill(level){return `<span class="level-pill${levelClass(level)}">${level}</span>`}
  function ownHealth(){return H[selected]||null}
  function fallbackHealth(key){const own=ownHealth();if(own&&own[key]!==undefined&&own[key]!==null)return {value:own[key],level:own.level,year:own.year};const b=H.boxmeer;return {value:b[key],level:'WIJK',year:b.year}}
  function careValue(map){const v=map[selected];if(v!==null&&v!==undefined)return {value:v,level:selected==='boxmeer'?'WIJK':'BUURT'};return {value:map.boxmeer,level:'WIJK'} }

  function inject(){
    const tabs=document.getElementById('viewTabs');if(!tabs||document.querySelector('[data-view="social"]'))return;
    const btn=document.createElement('button');btn.dataset.view='social';btn.innerHTML='Sociaal <span>nieuw</span>';tabs.insertBefore(btn,tabs.querySelector('[data-view="all"]'));
    const pane=document.createElement('div');pane.className='view-pane';pane.id='view-social';pane.innerHTML='<div id="socialContent"></div>';
    const overview=document.getElementById('view-overview');overview.parentNode.insertBefore(pane,document.getElementById('view-all'));
    btn.addEventListener('click',()=>{document.querySelectorAll('#viewTabs button').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.view-pane').forEach(x=>x.classList.remove('active'));btn.classList.add('active');pane.classList.add('active');render();});
    const obs=new MutationObserver(()=>render());const title=document.getElementById('areaTitle');if(title)obs.observe(title,{childList:true,subtree:true,characterData:true});
    render();
  }

  function render(){
    const host=document.getElementById('socialContent');if(!host)return;
    const name=selected==='boxmeer'?'Boxmeer':selected;
    const loneliness=fallbackHealth('lonely'), severe=fallbackHealth('severe'), regie=fallbackHealth('regie'), rond=fallbackHealth('rondkomen');
    const wmo=careValue(WMO), youth=careValue(YOUTH), own=ownHealth();
    const caution=(selected!=='boxmeer'&&(!own||own.year!=='2024'))?`<div class="social-warning">Voor deze kleine buurt is niet alles in 2024 publiceerbaar. Waar nodig tonen we de laatst beschikbare buurtwaarde of expliciet het wijkniveau.</div>`:'';
    const extra=[['Emotioneel eenzaam',fallbackHealth('emotional')],['Sociaal eenzaam',fallbackHealth('social')],['Krijgt steun van anderen',fallbackHealth('support')]];
    if(selected==='boxmeer'){extra.push(['Vrijwilligerswerk',{value:H.boxmeer.volunteer,level:'WIJK',year:'2024'}],['Mantelzorger',{value:H.boxmeer.mantelzorg,level:'WIJK',year:'2024'}],['Veel stress',{value:H.boxmeer.stress,level:'WIJK',year:'2024'}],['Hoog risico angst/depressie',{value:H.boxmeer.anxiety,level:'WIJK',year:'2024'}],['Suïcidegedachten afgelopen jaar',{value:H.boxmeer.suicide,level:'WIJK',year:'2024'}]);}
    const rows=ORDER.map(n=>{const h=H[n]||{};return `<tr class="${selected===n?'active':''}"><td>${n}</td><td>${h.lonely===undefined?'–':pct(h.lonely)}</td><td>${h.rondkomen===undefined?'–':pct(h.rondkomen)}</td><td>${WMO[n]===null?'–':num(WMO[n])}</td><td>${YOUTH[n]===null?'–':pct(YOUTH[n])}</td></tr>`}).join('');
    host.innerHTML=`
      <div class="social-hero"><strong>Sociaal profiel · ${name}</strong><p>Hier staan de indicatoren die voor sociaal werk het meest betekenisvol zijn. Iedere waarde toont het echte bronniveau: buurt waar mogelijk, anders wijk of gemeente.</p></div>
      <div class="social-kpis">
        <div class="social-card"><span class="label">Eenzaam</span><strong>${pct(loneliness.value)}</strong><small>${pill(loneliness.level)} RIVM Gezondheidsmonitor · ${loneliness.year}</small></div>
        <div class="social-card"><span class="label">Moeite met rondkomen</span><strong>${pct(rond.value)}</strong><small>${pill(rond.level)} RIVM · ${rond.year}</small></div>
        <div class="social-card"><span class="label">Wmo-gebruik</span><strong>${num(wmo.value)}</strong><small>${pill(wmo.level)} cliënten per 1.000 · CBS 2024</small></div>
        <div class="social-card"><span class="label">Jongeren met jeugdzorg</span><strong>${pct(youth.value)}</strong><small>${pill(youth.level)} CBS · 2024</small></div>
      </div>
      ${caution}
      <div class="social-section-title"><h3>Sociale & mentale gezondheid</h3><span>Gezondheidsmonitor 2024, tenzij anders vermeld</span></div>
      <div class="social-grid">
        <div class="social-mini"><span>Ernstig eenzaam</span><strong>${pct(severe.value)}</strong><small>${pill(severe.level)} ${severe.year}</small></div>
        <div class="social-mini"><span>Regie over eigen leven</span><strong>${pct(regie.value)}</strong><small>${pill(regie.level)} ${regie.year}</small></div>
        ${extra.map(([label,m])=>`<div class="social-mini"><span>${label}</span><strong>${pct(m.value)}</strong><small>${pill(m.level)} ${m.year||'2024'}</small></div>`).join('')}
      </div>
      <div class="social-section-title"><h3>Cliëntervaring Wmo · Land van Cuijk</h3><span>gemeenteniveau · onderzoeksresultaten 2023</span></div>
      <div class="ceo-grid">
        <div class="ceo-card"><span>Wist meteen waar men moest zijn</span><strong>${CEO.know}%</strong><small>${pill('GEMEENTE')} CEO Wmo</small></div>
        <div class="ceo-card"><span>Vond dat men snel werd geholpen</span><strong>${CEO.speed}%</strong><small>${pill('GEMEENTE')} CEO Wmo</small></div>
        <div class="ceo-card"><span>Oplossing voldoet aan behoefte</span><strong>${CEO.fit}%</strong><small>${pill('GEMEENTE')} CEO Wmo</small></div>
        <div class="ceo-card"><span>Tevreden met resultaat ondersteuning</span><strong>${CEO.result}%</strong><small>${pill('GEMEENTE')} CEO Wmo</small></div>
        <div class="ceo-card"><span>Rapportcijfer hulp bij aanvraag</span><strong>${String(CEO.municipality).replace('.',',')}</strong><small>${pill('GEMEENTE')} gemeente</small></div>
        <div class="ceo-card"><span>Rapportcijfer zorgaanbieder</span><strong>${String(CEO.provider).replace('.',',')}</strong><small>${pill('GEMEENTE')} ondersteuning</small></div>
      </div>
      <div class="social-section-title"><h3>Vergelijk alle buurten</h3><span>buurtdata waar publiceerbaar</span></div>
      <div class="social-table-wrap"><table class="social-table"><thead><tr><th>Buurt</th><th>Eenzaam</th><th>Rondkomen</th><th>Wmo /1.000</th><th>Jeugdzorg</th></tr></thead><tbody>${rows}</tbody></table></div>
      <div class="social-section-title"><h3>Bronnen & API's</h3><span>transparant per indicator</span></div>
      <div class="source-row">
        <a class="source-link" href="${LINKS.rivm}" target="_blank" rel="noopener"><strong>RIVM Regiobeeld / Gezondheidsmonitor</strong><span>Eenzaamheid, rondkomen, regie, sociale steun, stress en mentale gezondheid. Wijk/buurt waar publiceerbaar.</span><em>Open JSON · bestanden bijgewerkt juli 2026</em></a>
        <a class="source-link" href="${LINKS.wmo}" target="_blank" rel="noopener"><strong>CBS Wmo 2025</strong><span>Wmo-cliënten en typen maatwerkvoorzieningen op wijkniveau. De buurtvergelijking gebruikt de laatst beschikbare buurtcijfers 2024.</span><em>CBS StatLine · geen sleutel</em></a>
        <a class="source-link" href="${LINKS.social}" target="_blank" rel="noopener"><strong>CBS Gebruik sociaal domein 2025</strong><span>Stapeling Jeugd, Wmo en Participatiewet op wijkniveau: één of meerdere voorzieningen en combinaties.</span><em>CBS StatLine · geen sleutel</em></a>
        <a class="source-link" href="${LINKS.ceo}" target="_blank" rel="noopener"><strong>VNG / Waarstaatjegemeente · CEO Wmo</strong><span>Cliëntervaring: toegankelijkheid, snelheid, passendheid, tevredenheid en rapportcijfers.</span><em>Gemeente Land van Cuijk</em></a>
      </div>
      <div class="method-note"><strong>Interpretatie.</strong> Vooral bij kleine buurten kunnen percentages op weinig inwoners zijn gebaseerd of worden cijfers afgeschermd. Daarom blijft het bronjaar en geografische niveau altijd zichtbaar.</div>`;
  }

  inject();
})();