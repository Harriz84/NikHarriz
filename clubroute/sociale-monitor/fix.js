const __baseRenderData = renderData;
renderData = async function(){
  await __baseRenderData();
  const f = selectedFeature();
  const v = f ? prop(f,'percentage_personen_65_jaar_en_ouder') : null;
  const cards = document.querySelectorAll('#kpiGrid .kpi-card');
  if(cards[2]){
    const value = cards[2].querySelector('.kpi-value');
    if(value) value.textContent = v===null ? '–' : `${fmtInt(v)}%`;
  }
};