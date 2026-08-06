(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var euro = new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });

    var phases = [
      {
        l: 'A', name: 'Bouw de basis', period: 'aug–dec 2026', tag: 'Continuïteit en bescherming',
        lead: 'De tijdelijke extra kasruimte wordt volledig gebruikt om kwetsbaarheid weg te nemen.',
        chips: ['Zorgpot € 1.265', 'Buffer € 5.000', 'Reserve groeit'],
        left: '<h4>Maandroute</h4><ul><li>Aug–sep: doelruimte € 1.613,29</li><li>Okt–dec: doelruimte € 1.670,05</li><li>Elke maand: € 83,19 jaarpot, € 150 auto, € 150 reserve en € 253 zorg</li></ul>',
        right: '<h4>Belangrijk</h4><ul><li>DUO staat deze vijf maanden niet in de uitgaven.</li><li>Het tijdelijke voordeel wordt geen nieuwe vaste bestedingsruimte.</li><li>Boek direct op de salarisdag.</li></ul>',
        result: 'Eind december: zorgpot € 1.265, buffer € 5.000 en € 55,78 door naar vakantie 2027.'
      },
      {
        l: 'B', name: 'Vakantie vooruit', period: 'jan–jul 2027', tag: 'Maak 2027 af en start 2028',
        lead: 'Na de drie vaste reserveringen is € 1.123,82 per maand beschikbaar voor het actieve doel.',
        chips: ['Vakantie 2027 € 5.364,20', 'Vakantie 2028 € 2.558,32', 'Reserve € 1.800'],
        left: '<h4>Actieve boekingen</h4><ul><li>Jan–apr: € 1.123,82 p/m naar vakantie 2027</li><li>Mei: € 813,14 naar vakantie 2027</li><li>Mei restant: € 310,68 naar vakantie 2028</li><li>Jun–jul: € 1.123,82 p/m naar vakantie 2028</li></ul>',
        right: '<h4>Beslismoment juli</h4><ul><li>Stop € 150 maandelijkse reservegroei zodra € 1.800 is bereikt.</li><li>Die € 150 gaat vanaf augustus naar het actieve doel.</li><li>Jaarpot en autopot blijven doorlopen.</li></ul>',
        result: 'De basisfase is klaar: vakantie 2027 is betaald, 2028 heeft voorsprong en de reserve staat op doel.'
      },
      {
        l: 'C', name: 'Freo naar nul', period: 'sep–okt 2027', tag: 'Twee maanden versnellen',
        lead: 'De volledige actieve ruimte wordt tijdelijk gebruikt om de maandlast van € 307,91 definitief vrij te maken.',
        chips: ['Startschuld € 3.126,04', 'September € 1.273,82 extra', 'Oktober € 0'],
        left: '<h4>September</h4><ul><li>Reguliere termijn: € 307,91</li><li>Extra aflossing: € 1.273,82</li><li>Geschatte restschuld: € 1.564,63</li></ul>',
        right: '<h4>Oktober</h4><ul><li>Geschat slotbedrag: € 1.574,80</li><li>Resterende doelruimte: circa € 6,93</li><li>Vraag vóór 15 oktober het actuele aflosbedrag op.</li></ul>',
        result: 'Freo staat administratief op € 0. Vanaf november valt € 307,91 per maand structureel vrij.'
      },
      {
        l: 'D', name: 'Vakantie 2028 klaar', period: 'nov–dec 2027', tag: 'Een volledig jaar vooruit',
        lead: 'De voorsprong uit 2026 werkt door totdat op 1 januari 2028 € 7.000 klaarstaat.',
        chips: ['Start nov € 3.839,07', 'November + € 1.581,73', 'December + € 1.579,20'],
        left: '<h4>Opbouw</h4><ul><li>Eind juli: € 2.558,32</li><li>Augustus: € 3.832,14</li><li>Oktober: € 3.839,07</li><li>November: € 5.420,80</li><li>December: € 7.000</li></ul>',
        right: '<h4>Wat dit verandert</h4><ul><li>De vakantie wordt betaald uit geld dat er al is.</li><li>De resterende circa € 2,53 gaat naar herstel en toekomst.</li><li>Vanaf 2028 verdwijnt de inhaalsprint.</li></ul>',
        result: 'Op 1 januari 2028 staat € 7.000 klaar voor juli 2028.'
      },
      {
        l: 'E', name: 'Structurele vrijheid', period: 'vanaf jan 2028', tag: 'Elk jaar vóór zijn',
        lead: 'Vakantie wordt een vaste maandroute. Wat daarna overblijft gaat eerst naar herstel en vervolgens naar groei.',
        chips: ['Maandruimte € 1.912,88', 'Vakantie € 583,34 p/m', 'Herstel + toekomst € 1.096,35'],
        left: '<h4>Herstelstand</h4><ul><li>Reserve terug naar € 1.800</li><li>Zorgtekort in vijf maanden aanvullen</li><li>Buffer volledig herstellen tot € 5.000</li><li>Autopot van € 150 blijft lopen</li></ul>',
        right: '<h4>Groeistand</h4><ul><li>€ 500 vermogen / pensioen</li><li>€ 400 grote toekomstige doelen</li><li>€ 196,35 vrije keuze zonder schuldgevoel</li><li>Alleen toepassen als de beschermpotten intact zijn.</li></ul>',
        result: 'Het plan draait structureel: vakantie vooraf klaar, beschermpotten eerst hersteld en daarna bewust vermogen opbouwen.'
      }
    ];

    var buttons = document.getElementById('phaseButtons');
    var stage = document.getElementById('stage');
    var active = 0;
    var timer = null;

    function buttonMarkup(p) {
      return '<span class="letter">' + p.l + '</span>' +
        '<span><strong>' + p.name + '</strong><small>' + p.period + '</small></span>' +
        '<span>›</span>';
    }

    function stageMarkup(p) {
      var chips = p.chips.map(function (x) {
        return '<span class="chip">' + x + '</span>';
      }).join('');
      return '<span class="tag">Fase ' + p.l + ' · ' + p.tag + '</span>' +
        '<h3>' + p.name + '</h3>' +
        '<p class="stageLead">' + p.lead + '</p>' +
        '<div class="chips">' + chips + '</div>' +
        '<div class="phaseGrid"><div class="note">' + p.left + '</div><div class="note">' + p.right + '</div></div>' +
        '<div class="result">' + p.result + '</div>' +
        '<div class="playbar">' +
        '<button class="btn" id="prev" type="button">← Vorige</button>' +
        '<button class="btn primary" id="play" type="button">' + (timer ? 'Pauzeer' : 'Speel route af') + '</button>' +
        '<button class="btn" id="next" type="button">Volgende →</button>' +
        (timer ? '<span class="dot"></span><b>Route speelt</b>' : '') +
        '</div>';
    }

    function renderPhase(index) {
      active = index;
      var phaseButtons = document.querySelectorAll('.phaseBtn');
      for (var i = 0; i < phaseButtons.length; i++) {
        phaseButtons[i].classList.toggle('active', i === index);
      }
      if (!stage) return;
      stage.innerHTML = stageMarkup(phases[index]);
      document.getElementById('prev').addEventListener('click', function () {
        renderPhase((active + phases.length - 1) % phases.length);
      });
      document.getElementById('next').addEventListener('click', function () {
        renderPhase((active + 1) % phases.length);
      });
      document.getElementById('play').addEventListener('click', togglePlay);
    }

    function togglePlay() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      } else {
        timer = window.setInterval(function () {
          renderPhase((active + 1) % phases.length);
        }, 3200);
      }
      renderPhase(active);
    }

    if (buttons && stage) {
      buttons.innerHTML = '';
      phases.forEach(function (p, index) {
        var b = document.createElement('button');
        b.className = 'phaseBtn' + (index === 0 ? ' active' : '');
        b.type = 'button';
        b.innerHTML = buttonMarkup(p);
        b.addEventListener('click', function () { renderPhase(index); });
        buttons.appendChild(b);
      });
      renderPhase(0);
    }

    var start = new Date(2026, 7, 1);
    var slider = document.getElementById('monthSlider');

    function monthData(i) {
      var d = new Date(start.getFullYear(), start.getMonth() + i, 1);
      var y = d.getFullYear();
      var m = d.getMonth();
      var data = {
        d: d, care: 0, buffer: 0, reserve: 0, vac: 0, vacTarget: 5364.2,
        freoPaid: 0, phase: 'A', title: 'Bouw de basis',
        text: 'Zorgpot, buffer en reserve worden automatisch gevuld.',
        result: 'Elke euro verkort de kwetsbare opbouwfase.'
      };

      if (i <= 4) {
        data.care = Math.min(1265, (i + 1) * 253);
        data.buffer = [977.10, 1954.20, 2988.06, 4021.92, 5000][i];
        data.reserve = (i + 1) * 150;
        data.vac = i === 4 ? 55.78 : 0;
      } else if (i <= 11) {
        data.phase = 'B'; data.care = 1265; data.buffer = 5000;
        data.reserve = Math.min(1800, 750 + (i - 4) * 150);
        var x = i - 5;
        if (x <= 3) data.vac = 55.78 + (x + 1) * 1123.82;
        else if (x === 4) data.vac = 5364.20;
        else { data.vacTarget = 7000; data.vac = x === 5 ? 1434.50 : 2558.32; }
        data.title = 'Financier vakantie vooruit';
        data.text = 'Eerst vakantie 2027 afmaken, daarna iedere euro naar vakantie 2028.';
        data.result = i === 9 ? 'Vakantie 2027 bereikt € 5.364,20. Het restant schuift door naar 2028.' : 'De vakantiepot groeit zonder dat het leefgeld omhoog gaat.';
      } else if (i === 12) {
        data.phase = 'B'; data.care = 1265; data.buffer = 5000; data.reserve = 1800;
        data.vac = 3832.14; data.vacTarget = 7000;
        data.title = 'Voorsprong vergroten';
        data.text = 'De vrijgevallen € 150 reservegroei verhoogt het actieve doel.';
        data.result = 'Vakantie 2028 staat eind augustus op € 3.832,14.';
      } else if (i <= 14) {
        data.phase = 'C'; data.care = 1265; data.buffer = 5000; data.reserve = 1800;
        data.vac = 3832.14; data.vacTarget = 7000; data.freoPaid = i === 13 ? 5135.37 : 6700;
        data.title = 'Freo naar nul';
        data.text = i === 13 ? 'Reguliere termijn plus € 1.273,82 extra aflossen.' : 'Betaal het actuele slotbedrag en wacht op administratieve bevestiging.';
        data.result = i === 14 ? 'Freo € 0. De maandlast van € 307,91 valt vrij.' : 'Geschatte restschuld na september: € 1.564,63.';
      } else if (i <= 16) {
        data.phase = 'D'; data.care = 1265; data.buffer = 5000; data.reserve = 1800;
        data.vac = i === 15 ? 5420.80 : 7000; data.vacTarget = 7000; data.freoPaid = 6700;
        data.title = 'Vakantie 2028 afronden';
        data.text = 'De vrijgevallen maandlast versnelt de laatste opbouw.';
        data.result = i === 16 ? 'Op 1 januari 2028 staat € 7.000 klaar.' : 'Na november staat de vakantiepot op € 5.420,80.';
      } else {
        data.phase = 'E'; data.care = 1265; data.buffer = 5000; data.reserve = 1800;
        data.vac = Math.min(7000, (m + 1) * 583.34); data.vacTarget = 7000; data.freoPaid = 6700;
        data.title = 'Structureel ritme';
        data.text = 'Deze maand € 583,34 voor vakantie ' + (y + 1) + ' en € 1.096,35 voor herstel of groei.';
        data.result = 'De basis bepaalt de volgorde: eerst herstellen, daarna groeien.';
      }
      return data;
    }

    function pct(v, target) {
      return Math.max(0, Math.min(100, (v / target) * 100));
    }

    function setWidth(id, value) {
      var el = document.getElementById(id);
      if (el) el.style.width = value + '%';
    }

    function updateMonth(i) {
      var x = monthData(i);
      var names = ['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december'];
      var monthName = names[x.d.getMonth()];
      document.getElementById('monthLabel').textContent = monthName.charAt(0).toUpperCase() + monthName.slice(1) + ' ' + x.d.getFullYear();
      document.getElementById('phaseLabel').textContent = 'Fase ' + x.phase;
      document.getElementById('focusTitle').textContent = x.title;
      document.getElementById('focusText').textContent = x.text;
      document.getElementById('careVal').textContent = euro.format(x.care);
      document.getElementById('bufferVal').textContent = euro.format(x.buffer);
      document.getElementById('reserveVal').textContent = euro.format(x.reserve);
      document.getElementById('vacLabel').textContent = (x.phase === 'A' || (x.phase === 'B' && i <= 9)) ? 'Vakantie 2027' : 'Vakantie ' + (x.d.getFullYear() + 1);
      document.getElementById('vacVal').textContent = euro.format(x.vac);
      document.getElementById('freoVal').textContent = euro.format(x.freoPaid);
      setWidth('careBar', pct(x.care, 1265));
      setWidth('bufferBar', pct(x.buffer, 5000));
      setWidth('reserveBar', pct(x.reserve, 1800));
      setWidth('vacBar', pct(x.vac, x.vacTarget));
      setWidth('freoBar', pct(x.freoPaid, 6700));
      document.getElementById('monthResult').textContent = x.result;
    }

    if (slider) {
      var sliderHandler = function () { updateMonth(Number(slider.value)); };
      slider.addEventListener('input', sliderHandler);
      slider.addEventListener('change', sliderHandler);
      slider.addEventListener('touchmove', sliderHandler, { passive: true });
      updateMonth(Number(slider.value));
    }

    function confetti() {
      var colors = ['#407fb9','#6e994e','#d7a330','#8767a2','#c75f61','#ef5a18'];
      for (var i = 0; i < 55; i++) {
        var s = document.createElement('span');
        s.className = 'confetti';
        s.style.left = (Math.random() * 100) + 'vw';
        s.style.background = colors[i % colors.length];
        s.style.setProperty('--x', ((Math.random() - 0.5) * 300) + 'px');
        s.style.animationDelay = (Math.random() * 0.4) + 's';
        document.body.appendChild(s);
        window.setTimeout((function (node) { return function () { node.remove(); }; })(s), 3400);
      }
    }

    var celebrate = document.getElementById('celebrate');
    var finalCelebrate = document.getElementById('finalCelebrate');
    if (celebrate) celebrate.addEventListener('click', confetti);
    if (finalCelebrate) finalCelebrate.addEventListener('click', confetti);

    var reveals = document.querySelectorAll('.reveal,.metric');
    for (var r = 0; r < reveals.length; r++) reveals[r].classList.add('show');
    var planbars = document.querySelectorAll('.planbar');
    for (var p = 0; p < planbars.length; p++) planbars[p].style.width = planbars[p].getAttribute('data-width') + '%';

    var values = document.querySelectorAll('[data-count]');
    for (var v = 0; v < values.length; v++) {
      values[v].textContent = euro.format(Number(values[v].getAttribute('data-count')));
    }

    var checks = Array.prototype.slice.call(document.querySelectorAll('.check input'));
    checks.forEach(function (c) {
      c.addEventListener('change', function () {
        if (checks.every(function (x) { return x.checked; })) confetti();
      });
    });
  });
})();