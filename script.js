/* ==========================================================
   Dashboard de Estudio · Proyecto Integrador de Ing. de Software
   JavaScript puro, sin dependencias.
   ========================================================== */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     1. DATOS (edita aquí si cambian fechas, bloques o pesos)
  --------------------------------------------------------- */
  const YEAR = 2026;
  const START = new Date(YEAR, 9, 12); // 12 de octubre (mes 9 = octubre)
  const BUDGET_HOURS = 24;
  const STORAGE_KEY = 'sdlc-dashboard:progreso';
  const THEME_KEY = 'dash-theme';
  const BASE_TITLE = document.title;
  const reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  const DAYS = [
    {
      n: 1, day: 12, wd: 'Lun', theme: 'Contexto y estructura',
      title: 'Definir proyecto y documento',
      blocks: ['Caso de estudio del proyecto', 'Portada e introducción', 'Definición de las fases del SDLC'],
      deliverable: 'Secciones iniciales redactadas y esqueleto del documento'
    },
    {
      n: 2, day: 13, wd: 'Mar', theme: 'Planificación temporal',
      title: 'Planificación 36 semanas (Gantt, tareas)',
      blocks: ['Matriz de tareas, dependencias e hitos', 'Construcción del diagrama de Gantt', 'Análisis de riesgos'],
      deliverable: 'Matriz de tareas y cronograma exportado a 36 semanas'
    },
    {
      n: 3, day: 14, wd: 'Mié', theme: 'Marco teórico',
      title: 'Teoría y comparativa de metodologías',
      blocks: ['Estudio de metodologías: Ágil, Tradicional y Moderno', 'Matriz comparativa', 'Justificación de la metodología elegida'],
      deliverable: 'Secciones 3 y 4 redactadas'
    },
    {
      n: 4, day: 15, wd: 'Jue', theme: 'Operatividad Scrum',
      title: 'Scrum (historias BDD, Sprint Planning)',
      blocks: ['5 historias de usuario en formato BDD', 'Estimación Fibonacci y Sprint Planning (20 pts)', 'Seguimiento y plan de contingencia'],
      deliverable: 'Módulo Scrum completo'
    },
    {
      n: 5, day: 16, wd: 'Vie', theme: 'Operatividad Kanban',
      title: 'Kanban y métricas (WIP, Swarming)',
      blocks: ['Tablero Kanban con límites WIP (4 Devs / 2 QA)', 'Resolución con Swarming', 'Lead Time y Cycle Time'],
      deliverable: 'Módulo Kanban completo y matriz de decisión'
    },
    {
      n: 6, day: 17, wd: 'Sáb', theme: 'Enfoque Scrumban',
      title: 'Scrumban y Hotfixes',
      blocks: ['Order Point y On-Demand Planning', 'Simulación de Hotfix (fallo de pagos)', 'Reflexión crítica'],
      deliverable: 'Taller práctico 2 completo'
    },
    {
      n: 7, day: 18, wd: 'Dom', theme: 'Métricas y flujo',
      title: 'Flujo continuo y presentación ejecutiva',
      blocks: ['Cálculo de trabajo activo vs. espera', 'Plan de acción para embudos en QA', 'Síntesis ejecutiva'],
      deliverable: 'Documento completo en versión preliminar'
    },
    {
      n: 8, day: 19, wd: 'Lun', theme: 'Entrega final',
      title: 'Revisión final, auditoría y entrega',
      blocks: ['Verificación de cálculos', 'Revisión ortográfica y de formato', 'Exportación a PDF y entrega en la plataforma'],
      deliverable: 'PDF final subido a la plataforma'
    }
  ];

  const PRIORITIES = [
    { rank: 1, title: 'Operatividad Scrum y Kanban', pct: 25, color: '#5e6ad2',
      items: ['Historias BDD', 'Story Points', 'Sprint Planning', 'Burndown', 'WIP', 'Métricas'] },
    { rank: 2, title: 'Investigación y selección', pct: 20, color: '#0ea5e9',
      items: ['Comparativa de metodologías', 'Justificación de selección'] },
    { rank: 3, title: 'Scrumban y Hotfixes', pct: 20, color: '#f97316',
      items: ['Order Point', 'Clases de servicio', 'Límites WIP', 'Protocolo de incidentes'] },
    { rank: 4, title: 'Planificación y Gantt', pct: 15, color: '#10b981',
      items: ['Cronograma de 36 semanas', 'Dependencias', 'Roles', 'Hitos', 'Riesgos'] },
    { rank: 5, title: 'Métricas y calidad', pct: 10, color: '#a855f7',
      items: ['Tiempos activos', 'Esperas', 'Cuellos de botella', 'Plan de mejora continua'] },
    { rank: 6, title: 'Presentación ejecutiva', pct: 10, color: '#ec4899',
      items: ['Diseño PDF', 'Síntesis ejecutiva', 'Estructura de 8 secciones'] }
  ];

  const PHASES = [
    { name: 'Estudio',   min: 50, kind: 'work',   desc: 'Teoría, lecturas y ejemplos del tema del día.' },
    { name: 'Descanso',  min: 10, kind: 'rest',   desc: 'Aléjate de la pantalla, estírate y toma agua.' },
    { name: 'Práctica',  min: 50, kind: 'work',   desc: 'Ejercicios, simulaciones y cálculos.' },
    { name: 'Descanso',  min: 10, kind: 'rest',   desc: 'Pausa corta para recuperar el enfoque.' },
    { name: 'Redacción', min: 50, kind: 'work',   desc: 'Escribe el entregable del día en tu documento.' },
    { name: 'Repaso',    min: 10, kind: 'review', desc: 'Relee, corrige y anota pendientes para mañana.' }
  ];

  /* ---------------------------------------------------------
     2. UTILIDADES
  --------------------------------------------------------- */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const plural = (n, one, many) => n + ' ' + (n === 1 ? one : many);
  const RING_C = 2 * Math.PI * 34; // circunferencia de los anillos de prioridades

  function loadDone() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(raw) ? raw.filter(n => Number.isInteger(n) && n >= 1 && n <= DAYS.length) : [];
    } catch (e) { return []; }
  }

  const state = { done: new Set(loadDone()), filter: 'all' };

  function saveDone() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(state.done))); } catch (e) { /* sin almacenamiento */ }
  }

  /** Número de día del proyecto para hoy (1 = 12 Oct). <1 antes de empezar, >8 después de entregar. */
  function todayNumber() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.round((today - START) / 86400000) + 1;
  }

  let toastTimer = null;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 3200);
  }

  function setRing(circle, circumference, fraction) {
    circle.style.strokeDasharray = String(circumference);
    circle.style.strokeDashoffset = String(circumference * (1 - fraction));
  }

  /* ---------------------------------------------------------
     3. TEMA CLARO / OSCURO
  --------------------------------------------------------- */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const btn = $('#themeToggle');
    btn.setAttribute('aria-label', theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0d0e11' : '#f6f7f9');
  }

  function initTheme() {
    applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
    $('#themeToggle').addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* ignorar */ }
    });
  }

  /* ---------------------------------------------------------
     4. HERO: resumen colapsable
  --------------------------------------------------------- */
  function initSummary() {
    const box = $('#summaryBox');
    const btn = $('#summaryBtn');
    btn.addEventListener('click', () => {
      const open = !box.classList.contains('is-open');
      box.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
  }

  /* ---------------------------------------------------------
     5. PANEL: estado del plazo y prioridades
  --------------------------------------------------------- */
  function renderDeadline() {
    const t = todayNumber();
    const total = DAYS.length;
    const label = $('#deadlineLabel');
    const value = $('#deadlineValue');
    const sub = $('#deadlineSub');

    if (t < 1) {
      label.textContent = 'Para iniciar';
      value.textContent = plural(1 - t, 'día', 'días');
      sub.textContent = 'El proyecto arranca el 12 de octubre';
    } else if (t <= total) {
      const left = total - t;
      label.textContent = 'Estado del plazo';
      value.textContent = 'Día ' + t + ' de ' + total;
      sub.textContent = left === 0 ? 'Hoy es la entrega' : 'Quedan ' + plural(left, 'día', 'días') + ' para entregar';
    } else {
      label.textContent = 'Estado del plazo';
      value.textContent = 'Finalizado';
      sub.textContent = 'La fecha de entrega ya pasó';
    }
  }

  function renderPriorities() {
    const fmtHours = h => h.toLocaleString('es-MX', { maximumFractionDigits: 1 });

    $('#weightBar').innerHTML = PRIORITIES.map(p =>
      '<span class="weight__seg" style="--accent:' + p.color + ';flex:' + p.pct + '" title="' + p.title + ' · ' + p.pct + '%"></span>'
    ).join('');

    $('#weightLegend').innerHTML = PRIORITIES.map(p =>
      '<li style="--accent:' + p.color + '"><i></i>' + p.title + ' ' + p.pct + '%</li>'
    ).join('');

    $('#priorityGrid').innerHTML = PRIORITIES.map(p => {
      const hours = BUDGET_HOURS * p.pct / 100;
      const c = RING_C.toFixed(2);
      return (
        '<article class="priority card" data-pct="' + p.pct + '" style="--accent:' + p.color + '">' +
          '<div class="priority__top">' +
            '<span class="priority__rank" aria-label="Prioridad ' + p.rank + '">' + p.rank + '</span>' +
            '<div class="ring" role="img" aria-label="' + p.pct + '% del peso total">' +
              '<svg viewBox="0 0 80 80" aria-hidden="true">' +
                '<circle class="ring__track" cx="40" cy="40" r="34"/>' +
                '<circle class="ring__fill" cx="40" cy="40" r="34" style="stroke-dasharray:' + c + ';stroke-dashoffset:' + c + '"/>' +
              '</svg>' +
              '<span class="ring__label">' + p.pct + '%</span>' +
            '</div>' +
          '</div>' +
          '<h4>' + p.title + '</h4>' +
          '<p class="priority__hours">≈ ' + fmtHours(hours) + ' h de ' + BUDGET_HOURS + ' h</p>' +
          '<ul class="chips">' + p.items.map(i => '<li>' + i + '</li>').join('') + '</ul>' +
        '</article>'
      );
    }).join('');

    animatePriorityRings();
  }

  function animatePriorityRings() {
    const cards = $$('.priority');
    const run = card => {
      const fill = $('.ring__fill', card);
      if (fill) fill.style.strokeDashoffset = String(RING_C * (1 - Number(card.dataset.pct) / 100));
    };
    if (!('IntersectionObserver' in window)) { cards.forEach(run); return; }
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) { run(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.3 });
    cards.forEach(c => io.observe(c));
  }

  /* ---------------------------------------------------------
     6. METODOLOGÍA + TEMPORIZADOR
  --------------------------------------------------------- */
  const timer = { idx: 0, running: false, endAt: 0, remaining: PHASES[0].min * 60000, tick: null };
  let audioCtx = null;

  function fmtClock(ms) {
    const s = Math.max(0, Math.ceil(ms / 1000));
    return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  }

  function renderFlow() {
    $('#flow').innerHTML = PHASES.map((p, i) =>
      '<li class="phase card" data-kind="' + p.kind + '">' +
        '<div class="phase__top"><span class="phase__num">Paso ' + (i + 1) + '</span><span class="phase__time">' + p.min + ' min</span></div>' +
        '<h4>' + p.name + '</h4>' +
        '<p>' + p.desc + '</p>' +
      '</li>'
    ).join('');
  }

  function ensureAudio() {
    try {
      if (!audioCtx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (AC) audioCtx = new AC();
      }
      if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    } catch (e) { /* sin audio */ }
  }

  function beep() {
    if (!audioCtx) return;
    try {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      const t = audioCtx.currentTime;
      o.type = 'sine';
      o.frequency.value = 880;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.2, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
      o.connect(g);
      g.connect(audioCtx.destination);
      o.start(t);
      o.stop(t + 0.65);
    } catch (e) { /* ignorar */ }
  }

  function renderTimer() {
    const ph = PHASES[timer.idx];
    const total = ph.min * 60000;
    $('#timerTime').textContent = fmtClock(timer.remaining);
    $('#timerPhase').textContent = ph.name;
    $('#timerStep').textContent = 'Fase ' + (timer.idx + 1) + ' de ' + PHASES.length;
    $('#timerBar').style.width = ((total - timer.remaining) / total * 100) + '%';
    $('#timerCard').dataset.kind = ph.kind;
    $$('#flow .phase').forEach((el, i) => el.classList.toggle('is-active', i === timer.idx));
    $('#timerStart').textContent = timer.running ? 'Pausar' : (timer.remaining < total ? 'Reanudar' : 'Iniciar');
    document.title = timer.running ? fmtClock(timer.remaining) + ' · ' + ph.name : BASE_TITLE;
  }

  function stopTimer() {
    timer.running = false;
    clearInterval(timer.tick);
    timer.tick = null;
  }

  function startTimer() {
    ensureAudio();
    timer.endAt = Date.now() + timer.remaining;
    timer.running = true;
    clearInterval(timer.tick);
    timer.tick = setInterval(timerLoop, 250);
    renderTimer();
  }

  function pauseTimer() {
    timer.remaining = Math.max(0, timer.endAt - Date.now());
    stopTimer();
    renderTimer();
  }

  function resetTimer() {
    stopTimer();
    timer.idx = 0;
    timer.remaining = PHASES[0].min * 60000;
    renderTimer();
  }

  function advancePhase(auto) {
    if (timer.idx >= PHASES.length - 1) {
      resetTimer();
      if (auto) toast('✅ Sesión de 3 horas completada. ¡Buen trabajo!');
      return;
    }
    const wasRunning = timer.running;
    timer.idx += 1;
    timer.remaining = PHASES[timer.idx].min * 60000;
    if (wasRunning) timer.endAt = Date.now() + timer.remaining;
    renderTimer();
    if (auto) toast('Ahora: ' + PHASES[timer.idx].name + ' (' + PHASES[timer.idx].min + ' min)');
  }

  function timerLoop() {
    const left = timer.endAt - Date.now();
    if (left <= 0) {
      beep();
      advancePhase(true);
    } else {
      timer.remaining = left;
      renderTimer();
    }
  }

  function initTimer() {
    renderFlow();
    renderTimer();
    $('#timerStart').addEventListener('click', () => (timer.running ? pauseTimer() : startTimer()));
    $('#timerNext').addEventListener('click', () => advancePhase(false));
    $('#timerReset').addEventListener('click', resetTimer);
  }

  /* ---------------------------------------------------------
     7. CALENDARIO (acordeón / timeline)
  --------------------------------------------------------- */
  function renderTimeline() {
    $('#timeline').innerHTML = DAYS.map(d =>
      '<li class="day" data-day="' + d.n + '">' +
        '<span class="day__node" aria-hidden="true">' + d.n + '</span>' +
        '<div class="day__card card">' +
          '<h3 class="day__heading">' +
            '<button class="day__head" type="button" id="day-btn-' + d.n + '" aria-expanded="false" aria-controls="day-panel-' + d.n + '">' +
              '<span class="day__date">' + d.wd + ' ' + d.day + ' Oct</span>' +
              '<span class="day__titles"><strong>Día ' + d.n + ': ' + d.title + '</strong><small>' + d.theme + '</small></span>' +
              '<span class="status" data-status>Pendiente</span>' +
              '<svg class="chev" viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M5 7.5l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
            '</button>' +
          '</h3>' +
          '<div class="day__panel" id="day-panel-' + d.n + '" role="region" aria-labelledby="day-btn-' + d.n + '">' +
            '<div class="day__panel-inner">' +
              '<ol class="blocks">' +
                d.blocks.map((b, i) => '<li class="block"><span>Bloque ' + (i + 1) + ' · 50 min</span><p>' + b + '</p></li>').join('') +
              '</ol>' +
              '<div class="day__deliverable">' +
                '<label class="check">' +
                  '<input type="checkbox" data-check="' + d.n + '">' +
                  '<span class="check__box" aria-hidden="true"></span>' +
                  '<span class="check__text"><strong>Entregable:</strong> ' + d.deliverable + '</span>' +
                '</label>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</li>'
    ).join('');
  }

  function setOpen(li, open) {
    li.classList.toggle('open', open);
    $('.day__head', li).setAttribute('aria-expanded', String(open));
  }

  function initTimeline() {
    renderTimeline();
    const list = $('#timeline');

    list.addEventListener('click', e => {
      const btn = e.target.closest('.day__head');
      if (!btn) return;
      const li = btn.closest('.day');
      setOpen(li, !li.classList.contains('open'));
    });

    $('#expandAll').addEventListener('click', () => $$('.day', list).forEach(li => setOpen(li, true)));
    $('#collapseAll').addEventListener('click', () => $$('.day', list).forEach(li => setOpen(li, false)));

    // Abre el día de hoy (o el Día 1 si hoy queda fuera del rango)
    const t = todayNumber();
    const first = (t >= 1 && t <= DAYS.length) ? t : 1;
    setOpen($('.day[data-day="' + first + '"]', list), true);
  }

  /* ---------------------------------------------------------
     8. CONTROL DE AVANCE (to-do)
  --------------------------------------------------------- */
  function renderTodo() {
    $('#todoList').innerHTML = DAYS.map(d =>
      '<li class="todo" data-day="' + d.n + '">' +
        '<label class="check">' +
          '<input type="checkbox" data-check="' + d.n + '">' +
          '<span class="check__box" aria-hidden="true"></span>' +
          '<span class="todo__text"><strong>Día ' + d.n + ' · ' + d.deliverable + '</strong><small>' + d.wd + ' ' + d.day + ' Oct · ' + d.theme + '</small></span>' +
        '</label>' +
        '<button class="todo__goto" type="button" data-goto="' + d.n + '">Ver día</button>' +
      '</li>'
    ).join('');
  }

  function statusFor(d) {
    if (state.done.has(d.n)) return ['done', 'Completado'];
    const t = todayNumber();
    if (t === d.n) return ['today', 'Hoy'];
    if (t > d.n) return ['late', 'Atrasado'];
    return ['pending', 'Pendiente'];
  }

  /** Sincroniza toda la interfaz con el estado actual. */
  function sync() {
    const total = DAYS.length;
    const count = state.done.size;
    const frac = count / total;
    const pct = Math.round(frac * 100);

    // Barra superior
    $('#topCount').textContent = count + '/' + total;
    $('#topBar').style.width = pct + '%';
    $('#topBarWrap').setAttribute('aria-valuenow', String(count));

    // Barra y resumen del control de avance
    $('#todoCount').textContent = count + '/' + total + ' completado';
    $('#todoPct').textContent = pct + '%';
    $('#todoBar').style.width = pct + '%';

    // Hero
    $('#heroCount').textContent = count + '/' + total;
    setRing($('#heroRing'), 2 * Math.PI * 52, frac);
    const next = DAYS.find(d => !state.done.has(d.n));
    $('#nextTask').textContent = next ? 'Día ' + next.n + ': ' + next.deliverable : '¡Todo listo! Sube tu PDF final.';

    document.body.classList.toggle('all-done', count === total);

    // Checkboxes, timeline y lista
    const today = todayNumber();
    DAYS.forEach(d => {
      const done = state.done.has(d.n);
      $$('input[data-check="' + d.n + '"]').forEach(cb => { cb.checked = done; });

      const li = $('.day[data-day="' + d.n + '"]');
      li.classList.toggle('is-done', done);
      li.classList.toggle('is-today', !done && today === d.n);
      $('.day__node', li).textContent = done ? '✓' : String(d.n);
      const st = statusFor(d);
      const badge = $('[data-status]', li);
      badge.className = 'status status--' + st[0];
      badge.textContent = st[1];

      $('.todo[data-day="' + d.n + '"]').classList.toggle('is-done', done);
    });

    // Filtro y mensaje vacío
    const list = $('#todoList');
    list.dataset.filter = state.filter;
    $$('.seg button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filter === state.filter)));
    const visible = state.filter === 'all' ? total : state.filter === 'done' ? count : total - count;
    const empty = $('#todoEmpty');
    empty.hidden = visible !== 0;
    if (visible === 0) {
      empty.textContent = state.filter === 'done'
        ? 'Aún no has completado ningún entregable.'
        : '¡No tienes entregables pendientes! 🎉';
    }
  }

  function setDone(n, value) {
    if (value) state.done.add(n); else state.done.delete(n);
    saveDone();
    sync();
    if (value) {
      toast(state.done.size === DAYS.length
        ? '🎉 ¡Completaste los 8 entregables! Sube tu PDF final.'
        : 'Día ' + n + ' completado ✔');
    }
  }

  function goToDay(n) {
    const li = $('.day[data-day="' + n + '"]');
    if (!li) return;
    setOpen(li, true);
    if (li.scrollIntoView) li.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
  }

  function initTodo() {
    renderTodo();

    document.addEventListener('change', e => {
      const cb = e.target.closest ? e.target.closest('input[data-check]') : null;
      if (cb) setDone(Number(cb.dataset.check), cb.checked);
    });

    document.addEventListener('click', e => {
      const go = e.target.closest('[data-goto]');
      if (go) goToDay(Number(go.dataset.goto));

      const f = e.target.closest('.seg button');
      if (f) { state.filter = f.dataset.filter; sync(); }
    });

    $('#resetBtn').addEventListener('click', () => {
      if (state.done.size === 0) { toast('Aún no hay avance que reiniciar.'); return; }
      if (window.confirm('¿Seguro que quieres borrar todo tu avance?')) {
        state.done.clear();
        saveDone();
        sync();
        toast('Avance reiniciado');
      }
    });
  }

  /* ---------------------------------------------------------
     9. ARRANQUE
  --------------------------------------------------------- */
  function init() {
    initTheme();
    initSummary();
    renderDeadline();
    renderPriorities();
    initTimer();
    initTimeline();
    initTodo();
    sync();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
