(function(){
  const style=document.createElement('style');
  style.textContent=`
  .age-life-section{margin:18px 0 20px}.age-life-head{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;margin-bottom:10px}.age-life-head h3{margin:0;font-size:14px}.age-life-head span{font-size:9px;color:#8b95a2;text-align:right}.age-life-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:9px}.age-life-card{border:1px solid var(--line);border-radius:13px;padding:12px;background:#fff;min-height:112px;display:flex;flex-direction:column}.age-life-top{display:flex;align-items:center;gap:8px}.age-life-icon{width:28px;height:28px;border-radius:9px;background:var(--teal-soft);display:grid;place-items:center;font-size:15px}.age-life-label{font-size:10px;font-weight:800;color:#344153;line-height:1.15}.age-life-range{font-size:8px;color:#8c96a5;margin-top:2px}.age-life-value{font-size:22px;font-weight:850;margin:8px 0 1px}.age-life-pct{font-size:10px;color:var(--teal-dark);font-weight:800}.age-life-bar{height:6px;background:#edf2f4;border-radius:999px;overflow:hidden;margin-top:auto}.age-life-bar>span{display:block;height:100%;background:var(--teal);border-radius:999px}.age-life-note{font-size:8px;color:#909aa7;margin-top:7px;line-height:1.35}.age-adult-breakdown{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:9px}.age-adult-item{border:1px solid var(--line);border-radius:10px;padding:9px 10px;display:flex;align-items:center;justify-content:space-between;gap:12px;background:#fafcfc}.age-adult-item span{font-size:9px;color:#657181}.age-adult-item strong{font-size:12px}.age-source-note{margin-top:8px;font-size:8px;color:#8b95a2;line-height:1.4}
  @media(max-width:1200px){.age-life-grid{grid-template-columns:1fr 1fr}}
  @media(max-width:600px){.age-life-section{margin:15px 0 18px}.age-life-head{align-items:flex-start}.age-life-head h3{font-size:13px}.age-life-head span{font-size:8px;max-width:145px}.age-life-grid{grid-template-columns:1fr 1fr;gap:7px}.age-life-card{min-height:104px;padding:10px}.age-life-value{font-size:20px;margin-top:7px}.age-life-label{font-size:9px}.age-life-range{font-size:7.5px}.age-life-note{font-size:7.5px}.age-adult-breakdown{grid-template-columns:1fr}.age-adult-item{padding:8px 9px}}
  `;
  document.head.appendChild(style);

  function valid(v){return v!==null&&v!==undefined&&!Number.isNaN(Number(v))}
  function count(pop,pct){if(!valid(pop)||!valid(pct))return null;return Math.round((Number(pop)*Number(pct)/100)/5)*5}
  function formatCount(v){return valid(v)?new Intl.NumberFormat('nl-NL').format(v):'–'}
  function formatPct(v){return valid(v)?`${Number(v).toLocaleString('nl-NL',{maximumFractionDigits:1})}%`:'–'}

  function values(){
    const f=typeof selectedFeature==='function'?selectedFeature():null;
    if(!f)return null;
    const pop=prop(f,'aantal_inwoners');
    const child=prop(f,'percentage_personen_0_tot_15_jaar');
    const youth=prop(f,'percentage_personen_15_tot_25_jaar');
    const adult1=prop(f,'percentage_personen_25_tot_45_jaar');
    const adult2=prop(f,'percentage_personen_45_tot_65_jaar');
    const senior=prop(f,'percentage_personen_65_jaar_en_ouder');
    const adult=(valid(adult1)&&valid(adult2))?adult1+adult2:null;
    return {pop,child,youth,adult1,adult2,adult,senior};
  }

  function card(icon,label,range,pct,pop){
    const n=count(pop,pct);
    const w=valid(pct)?Math.min(100,Math.max(0,Number(pct))):0;
    return `<div class="age-life-card"><div class="age-life-top"><div class="age-life-icon">${icon}</div><div><div class="age-life-label">${label}</div><div class="age-life-range">${range}</div></div></div><div class="age-life-value">± ${formatCount(n)}</div><div class="age-life-pct">${formatPct(pct)} van de inwoners</div><div class="age-life-bar"><span style="width:${w}%"></span></div><div class="age-life-note">Geschat aantal op basis van CBS-percentage</div></div>`;
  }

  function ensureSection(){
    let section=document.getElementById('ageLifeSection');
    if(section)return section;
    const overview=document.getElementById('view-overview');
    if(!overview)return null;
    section=document.createElement('section');
    section.id='ageLifeSection';
    section.className='age-life-section';
    const profileHead=Array.from(overview.querySelectorAll('.subhead')).find(el=>/kernprofiel/i.test(el.textContent||''));
    if(profileHead) overview.insertBefore(section,profileHead); else overview.prepend(section);
    return section;
  }

  function renderAgeLife(){
    const section=ensureSection();
    if(!section)return;
    const v=values();
    if(!v||!valid(v.pop)){section.innerHTML='';return;}
    const a1=count(v.pop,v.adult1),a2=count(v.pop,v.adult2);
    section.innerHTML=`
      <div class="age-life-head"><h3>Wie wonen hier?</h3><span>Leeftijdsopbouw · CBS 2025</span></div>
      <div class="age-life-grid">
        ${card('🧒','Kinderen','0–14 jaar',v.child,v.pop)}
        ${card('🧑','Jongeren','15–24 jaar',v.youth,v.pop)}
        ${card('👤','Volwassenen','25–64 jaar',v.adult,v.pop)}
        ${card('🧓','Senioren','65 jaar en ouder',v.senior,v.pop)}
      </div>
      <div class="age-adult-breakdown">
        <div class="age-adult-item"><span>Volwassenen 25–44 jaar</span><strong>± ${formatCount(a1)} · ${formatPct(v.adult1)}</strong></div>
        <div class="age-adult-item"><span>Volwassenen 45–64 jaar</span><strong>± ${formatCount(a2)} · ${formatPct(v.adult2)}</strong></div>
      </div>
      <div class="age-source-note">De aantallen zijn afgerond, omdat CBS op wijk- en buurtniveau de leeftijdsgroepen als percentages publiceert. Het percentage is de officiële bronwaarde; het aantal is daarvan afgeleid op basis van het officiële inwonertal.</div>`;
  }

  const baseRenderData=typeof renderData==='function'?renderData:null;
  if(baseRenderData){
    renderData=async function(){const r=await baseRenderData.apply(this,arguments);renderAgeLife();return r;};
  }
  const title=document.getElementById('areaTitle');
  if(title)new MutationObserver(()=>renderAgeLife()).observe(title,{childList:true,subtree:true,characterData:true});
  setTimeout(renderAgeLife,800);
})();