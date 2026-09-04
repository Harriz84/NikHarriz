(function(){
  const css = `
    .expert-banner{display:flex;gap:10px;align-items:flex-start;background:#f8fafc;border:1px solid var(--line);border-radius:12px;padding:11px 12px;margin-bottom:12px;color:#617080;font-size:10px;line-height:1.45}.expert-banner strong{display:block;color:var(--ink);font-size:11px;margin-bottom:2px}.expert-icon{width:28px;height:28px;flex:0 0 28px;border-radius:9px;background:var(--teal-soft);display:grid;place-items:center;color:var(--teal-dark);font-weight:900}
    .source-group{border:0;margin:14px 0}.source-group>summary{list-style:none;display:flex;align-items:center;justify-content:space-between;gap:10px;cursor:pointer;padding:9px 0;border-bottom:1px solid var(--line)}.source-group>summary::-webkit-details-marker{display:none}.source-group-title{display:flex;align-items:center;gap:7px;font-size:12px;font-weight:850}.source-group-title:before{content:'›';display:inline-grid;place-items:center;width:18px;height:18px;border-radius:6px;background:#f1f5f6;color:var(--teal-dark);transition:transform .18s}.source-group[open] .source-group-title:before{transform:rotate(90deg)}.source-group-count{font-size:8px;color:#8b96a4;background:#f6f8fa;border-radius:999px;padding:4px 7px}
    .source-indicator-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;padding-top:9px}.source-indicator-card{width:100%;text-align:left;border:1px solid var(--line);border-radius:12px;background:#fff;padding:11px;min-height:122px;display:flex;flex-direction:column;gap:7px;color:var(--ink);transition:border-color .15s,box-shadow .15s}.source-indicator-card:hover{border-color:#aed8d5;box-shadow:0 4px 16px rgba(22,42,54,.05)}.indicator-head{display:flex;align-items:flex-start;justify-content:space-between;gap:8px}.indicator-title{display:block;font-size:11px;font-weight:800;line-height:1.3;color:#253142}.indicator-context{display:block;font-size:9px;color:#7c8795;margin-top:3px;line-height:1.25}.indicator-value-human{font-size:21px;font-weight:880;letter-spacing:-.02em;margin-top:1px}.indicator-unit-human{font-size:9px;color:#7d8996;font-weight:600;margin-left:4px}.indicator-footer{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:auto;font-size:8px;color:#929ca8}.indicator-source{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.source-level{flex:0 0 auto;display:inline-block;border-radius:999px;padding:3px 6px;font-size:7px;font-weight:900;letter-spacing:.04em;background:var(--teal-soft);color:var(--teal-dark)}.source-level.wijk{background:#edf3ff;color:#3d65a6}.source-level.gemeente{background:#fff0df;color:#a8630c}.indicator-explanation{display:none;border-top:1px solid #eef1f4;margin-top:2px;padding-top:7px;font-size:8.5px;color:#6d7886;line-height:1.45}.source-indicator-card.open .indicator-explanation{display:block}.source-indicator-card.open{border-color:#9acbc7}
    .technical-label{display:inline-flex;align-items:center;gap:5px;font-size:8px;color:#75818f;background:#f4f6f8;border-radius:999px;padding:3px 7px;margin-left:5px;font-weight:700}.dataset-info code{max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    @media(max-width:600px){.source-indicator-grid{grid-template-columns:1fr}.source-indicator-card{min-height:108px;padding:12px}.indicator-title{font-size:12px}.indicator-context{font-size:9px}.indicator-value-human{font-size:24px}.source-group>summary{padding:11px 1px}.expert-banner{font-size:9px}.dataset-info{grid-template-columns:1fr}.dataset-info code{grid-column:1;grid-row:auto;margin-top:5px;max-width:100%}}
  `;
  const s=document.createElement('style');s.textContent=css;document.head.appendChild(s);

  function cleanupText(text){return String(text||'').replace(/\s+/g,' ').trim();}
  function sentence(text){const t=cleanupText(text);if(!t)return'';const m=t.match(/^(.{1,150}?)(?:\.(?:\s|$)|$)/);return (m?m[1]:t).trim();}
  function titleCaseFirst(t){return t? t.charAt(0).toUpperCase()+t.slice(1):t;}
  function facilityFromDescription(desc){
    const d=cleanupText(desc);
    const patterns=[
      /(?:gemiddeld\s+)?aantal\s+(?:vestigingen\s+van\s+)?(.+?)\s+binnen\s+(?:een\s+afstand\s+van\s+)?\d/i,
      /afstand\s+tot\s+(?:de\s+)?(.+?)(?:\.|,|\s+in\s+kilometer|$)/i,
      /(?:nabijheid|bereikbaarheid)\s+van\s+(.+?)(?:\.|,|$)/i
    ];
    for(const p of patterns){const m=d.match(p);if(m&&m[1])return titleCaseFirst(m[1].replace(/^(het|de|een)\s+/i,'').trim());}
    return '';
  }
  function humanTitle(item,datasetKey){
    const raw=cleanupText(item.label);
    if(datasetKey==='amenities' && /^(binnen|afstand|aantal binnen)/i.test(raw)){
      const f=facilityFromDescription(item.description);if(f)return f;
    }
    if(raw && !/^(binnen \d|aantal|afstand)$/i.test(raw))return raw;
    const first=sentence(item.description);return first||raw||'Indicator';
  }
  function humanContext(item,datasetKey){
    const raw=cleanupText(item.label),desc=cleanupText(item.description);
    if(datasetKey==='amenities'){
      if(/^(binnen|afstand)/i.test(raw))return raw;
      const km=desc.match(/binnen\s+(\d+(?:[,.]\d+)?)\s*(?:kilometer|km)/i);if(km)return `Binnen ${km[1]} km`;
      if(/afstand/i.test(desc))return 'Afstand tot voorziening';
    }
    return item.category||'';
  }
  function humanValue(item,datasetKey){
    const u=cleanupText(item.meta?.unit||item.unit||'').toLowerCase();
    const n=Number(item.value);
    if(Number.isFinite(n)){
      const val=n.toLocaleString('nl-NL',{maximumFractionDigits:Number.isInteger(n)?0:2});
      if(u==='%')return {value:`${val}%`,unit:''};
      if(/kilometer|\bkm\b/.test(u))return {value:val,unit:'km'};
      if(/1 000 euro/.test(u))return {value:`€ ${new Intl.NumberFormat('nl-NL').format(n*1000)}`,unit:''};
      if(u==='aantal')return {value:val,unit:datasetKey==='amenities'?'gemiddeld aantal':''};
      return {value:val,unit:item.meta?.unit||''};
    }
    return {value:cleanupText(item.value)||'–',unit:''};
  }
  function level(){return selected==='boxmeer'?'WIJK':'BUURT';}
  function levelClass(l){return l==='WIJK'?' wijk':l==='GEMEENTE'?' gemeente':'';}
  function sourceName(key){return key==='amenities'?'CBS Voorzieningen':key==='benefits'?'CBS Sociale zekerheid':'CBS Kerncijfers';}

  // Replace the technical source-data renderer with a human-readable version.
  renderAllData = async function(){
    const container=document.getElementById('allDataContainer'), ds=DATASETS[currentDataset];
    container.innerHTML=`<div class="loading-panel">${ds.name} wordt rechtstreeks bevraagd…</div>`;
    const data=await fetchDataset(currentDataset);let items=flattenRows(data);
    const q=normalize(document.getElementById('indicatorSearch')?.value||'');
    if(q)items=items.filter(x=>normalize(`${x.label} ${x.category} ${x.description}`).includes(q));
    const badge=document.getElementById('allCountBadge');if(badge)badge.textContent=items.length?items.length:'';
    document.getElementById('datasetInfo').innerHTML=`<strong>${ds.name}</strong><span>${ds.note}</span><code>${ds.id} · ${regionCode()||''}</code>`;
    if(!items.length){container.innerHTML='<div class="empty-state">Geen publiceerbare waarden gevonden voor deze selectie.</div>';return;}
    const groups={};items.forEach(x=>(groups[x.category]??=[]).push(x));
    const entries=Object.entries(groups).sort((a,b)=>a[0].localeCompare(b[0]));
    container.innerHTML=entries.map(([cat,arr],idx)=>`<details class="source-group" ${q||idx<2?'open':''}><summary><span class="source-group-title">${cat}</span><span class="source-group-count">${arr.length} indicatoren</span></summary><div class="source-indicator-grid">${arr.map(x=>{
      const hv=humanValue(x,currentDataset),title=humanTitle(x,currentDataset),context=humanContext(x,currentDataset),desc=cleanupText(x.description);
      return `<button type="button" class="source-indicator-card"><div class="indicator-head"><div><span class="indicator-title">${title}</span>${context?`<span class="indicator-context">${context}</span>`:''}</div><span class="source-level${levelClass(level())}">${level()}</span></div><div><span class="indicator-value-human">${hv.value}</span>${hv.unit?`<span class="indicator-unit-human">${hv.unit}</span>`:''}</div><div class="indicator-footer"><span class="indicator-source">${sourceName(currentDataset)} · ${ds.year}</span><span>ⓘ details</span></div>${desc?`<div class="indicator-explanation">${desc}</div>`:''}</button>`;
    }).join('')}</div></details>`).join('');
    container.querySelectorAll('.source-indicator-card').forEach(card=>card.addEventListener('click',()=>card.classList.toggle('open')));
  };

  function upgradeLabels(){
    const all=document.querySelector('[data-view="all"]');
    if(all){const badge=all.querySelector('#allCountBadge');const count=badge?.textContent||'';all.innerHTML=`Alle brondata <span id="allCountBadge">${count}</span>`;}
    const apis=document.querySelector('[data-view="apis"]');if(apis)apis.textContent="Bronnen & API's";
    const view=document.getElementById('view-all');
    if(view && !view.querySelector('.expert-banner')){
      const banner=document.createElement('div');banner.className='expert-banner';banner.innerHTML='<div class="expert-icon">↯</div><div><strong>Alle brondata <span class="technical-label">technische weergave</span></strong>Hier zie je de volledige officiële API-respons. De monitor vertaalt technische veldnamen naar leesbare indicatoren; tik op een kaart voor de bronomschrijving.</div>';
      view.insertBefore(banner,view.firstChild);
    }
    const search=document.getElementById('indicatorSearch');if(search)search.placeholder='Zoek bijvoorbeeld Wmo, jeugdzorg, WOZ, huisarts, inkomen…';
  }
  upgradeLabels();
})();