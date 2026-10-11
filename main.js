'use strict';

/* Interacciones del portafolio: tema, menú, scroll y partículas en Canvas 2D.
   No requiere bibliotecas, API keys ni conexión a un servidor. */
const root = document.documentElement;
root.classList.add('js-enabled');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Tema con preferencia guardada. Si no existe, respeta la preferencia del sistema.
const themeToggle = document.querySelector('#themeToggle');
const THEME_KEY = 'je-portfolio-theme';
let savedTheme;
try { savedTheme = localStorage.getItem(THEME_KEY); } catch (_) { /* Privacidad del navegador */ }
const initialTheme = savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : 'dark';
function setTheme(theme) {
  root.dataset.theme = theme;
  themeToggle?.setAttribute('aria-label', theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro');
  themeToggle?.setAttribute('title', theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
  const meta = document.querySelector('meta[name="theme-color"]');
  meta?.setAttribute('content', theme === 'dark' ? '#090b12' : '#f6f7fb');
}
setTheme(initialTheme);
themeToggle?.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  setTheme(next);
  try { localStorage.setItem(THEME_KEY, next); } catch (_) { /* opcional */ }
});

// Navegación accesible para móviles.
const navToggle = document.querySelector('#navToggle');
const navLinks = document.querySelector('#navLinks');
function closeMenu() {
  navLinks?.classList.remove('is-open');
  navToggle?.setAttribute('aria-expanded', 'false');
  navToggle?.setAttribute('aria-label', 'Abrir menú');
  document.body.classList.remove('menu-open');
}
navToggle?.addEventListener('click', () => {
  const willOpen = !navLinks.classList.contains('is-open');
  navLinks.classList.toggle('is-open', willOpen);
  navToggle.setAttribute('aria-expanded', String(willOpen));
  navToggle.setAttribute('aria-label', willOpen ? 'Cerrar menú' : 'Abrir menú');
  document.body.classList.toggle('menu-open', willOpen);
});
navLinks?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
document.addEventListener('pointerdown', event => {
  if (navLinks?.classList.contains('is-open') && !event.target.closest('.nav')) closeMenu();
});
window.addEventListener('resize', () => { if (window.innerWidth > 860) closeMenu(); }, { passive: true });

// Animaciones discretas, respetando la preferencia de reducir movimiento.
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !prefersReducedMotion.matches) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  revealItems.forEach(el => revealObserver.observe(el));
} else revealItems.forEach(el => el.classList.add('is-visible'));

const sectionLinks = Array.from(document.querySelectorAll('.nav-link'));
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        sectionLinks.forEach(a => {
          const active = a.getAttribute('href') === `#${entry.target.id}`;
          a.classList.toggle('is-active', active);
          if (active) a.setAttribute('aria-current', 'location');
          else a.removeAttribute('aria-current');
        });
      }
    });
  }, { rootMargin: '-26% 0px -58% 0px' });
  document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));
}

const progress = document.querySelector('#readingProgress');
let scrollQueued = false;
function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  if (progress) progress.style.width = `${scrollable > 0 ? Math.min(100,window.scrollY / scrollable * 100) : 0}%`;
  scrollQueued = false;
}
window.addEventListener('scroll', () => {
  if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateProgress); }
}, { passive: true });
window.addEventListener('resize', updateProgress, { passive: true });
updateProgress();
document.querySelector('#currentYear').textContent = String(new Date().getFullYear());

// Fotografía: añade src/img/yo.jpg para reemplazar automáticamente el marcador visual.
const portrait = document.querySelector('#portraitImage');
if (portrait) {
  portrait.addEventListener('load', () => {
    if (portrait.naturalWidth > 0) {
      portrait.hidden = false;
      document.querySelector('#portraitFallback')?.setAttribute('aria-hidden', 'true');
    }
  });
  portrait.addEventListener('error', () => { portrait.hidden = true; });
  if (portrait.complete && portrait.naturalWidth) portrait.hidden = false;
}

/* ===============================================================
   CASOS DE ESTUDIO
   Para colocar tus fotografías, guarda los archivos con estos
   nombres exactos dentro de src/img/. Se mostrarán en "Ver más".
   =============================================================== */
const projectDetails = {
  miturno: {
    category: '01 / HEALTH TECH · SISTEMA WEB',
    title: 'MiTurno',
    intro: 'Sistema para apoyar la organización de la atención médica, desde el registro del paciente hasta el seguimiento de su atención. Integra herramientas de priorización y un flujo de trabajo dirigido al personal médico y administrativo.',
    problem: 'En un centro de atención, el registro disperso, la falta de seguimiento y la dificultad para identificar casos prioritarios complican la coordinación. MiTurno busca reunir la información operativa en una interfaz clara.',
    features: [
      'Recepción, registro y clasificación de pacientes mediante niveles de triaje.',
      'Sala de espera y seguimiento del estado de cada atención.',
      'Módulos para consulta, historial clínico y gestión de camas.',
      'Paneles, alertas y exploración de funciones de apoyo con IA.'
    ],
    stack: ['React', 'Vite', 'Tailwind CSS', 'Firebase', 'PWA', 'Integración de IA'],
    images: [
      { src: './src/img/miturno-1.jpg', label: 'Recepción y triaje' },
      { src: './src/img/miturno-2.jpg', label: 'Sala de espera' },
      { src: './src/img/miturno-3.jpg', label: 'Consulta y seguimiento' }
    ]
  },
  pos: {
    category: '02 / COMERCIO · PUNTO DE VENTA',
    title: 'La Casa del Globo',
    intro: 'Sistema POS orientado a las tareas cotidianas de una tienda: registrar ventas, consultar productos, organizar pedidos y mantener el control de la operación desde un mismo lugar.',
    problem: 'Cuando un negocio maneja pedidos personalizados, inventario y ventas en distintos registros, se vuelve más complicado consultar datos y dar seguimiento. Este proyecto reúne procesos comerciales en una sola herramienta.',
    features: [
      'Registro de ventas y generación de tickets.',
      'Administración de productos e inventario.',
      'Seguimiento de pedidos personalizados y clientes.',
      'Reportes y paneles de información del negocio.'
    ],
    stack: ['React', 'JavaScript', 'Tailwind CSS', 'Cloud Firestore', 'Firebase Authentication'],
    images: [
      { src: './src/img/pos-1.jpg', label: 'Panel de ventas' },
      { src: './src/img/pos-2.jpg', label: 'Inventario y productos' },
      { src: './src/img/pos-3.jpg', label: 'Pedidos y reportes' }
    ]
  },
  split: {
    category: '03 / FITNESS TECH · APLICACIÓN WEB',
    title: 'S / Split',
    intro: 'Aplicación deportiva centrada en el seguimiento de actividades y una experiencia de consulta interactiva, conectando una interfaz construida en React con servicios backend.',
    problem: 'El seguimiento deportivo puede estar dividido entre diferentes pantallas y herramientas. S / Split explora una experiencia integrada para consultar y organizar información sobre actividad física.',
    features: [
      'Registro y consulta de información relacionada con actividades deportivas.',
      'Interfaz con componentes reutilizables y navegación responsiva.',
      'Chat deportivo conectado a una API propia.',
      'Integración entre frontend React y backend Node.js / Express.'
    ],
    stack: ['React', 'Vite', 'Node.js', 'Express', 'Firebase', 'APIs REST'],
    images: [
      { src: './src/img/split-1.jpg', label: 'Vista principal' },
      { src: './src/img/split-2.jpg', label: 'Actividad deportiva' },
      { src: './src/img/split-3.jpg', label: 'Chat deportivo' }
    ]
  }
};

const projectDialog = document.querySelector('#projectDialog');
const dialogClose = document.querySelector('#dialogClose');
const dialogBottomClose = document.querySelector('#dialogBottomClose');

function makeTextNode(tag, className, content) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  el.textContent = content;
  return el;
}

function showProject(id) {
  const project = projectDetails[id];
  if (!project || !projectDialog) return;

  document.querySelector('#dialogCategory').textContent = project.category;
  document.querySelector('#dialogTitle').textContent = project.title;
  document.querySelector('#dialogIntro').textContent = project.intro;
  document.querySelector('#dialogProblem').textContent = project.problem;

  const featureList = document.querySelector('#dialogFeatures');
  featureList.replaceChildren(...project.features.map(feature => makeTextNode('li', '', feature)));

  const stack = document.querySelector('#dialogStack');
  stack.replaceChildren(...project.stack.map(tech => makeTextNode('span', '', tech)));

  const gallery = document.querySelector('#dialogGallery');
  gallery.replaceChildren();
  project.images.forEach((item, index) => {
    const figure = document.createElement('figure');
    figure.className = 'gallery-tile';
    const media = makeTextNode('div', 'gallery-tile__media', '');
    const fallback = document.createElement('div');
    fallback.className = 'gallery-tile__placeholder';
    fallback.append(
      makeTextNode('span', 'gallery-tile__placeholder-icon', '▧'),
      makeTextNode('strong', '', `Imagen 0${index + 1}`),
      makeTextNode('small', '', item.src.replace('./', ''))
    );
    const link = document.createElement('a');
    link.className = 'gallery-tile__image-link';
    link.href = item.src;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', `Ampliar ${item.label}`);
    link.hidden = true;
    const img = document.createElement('img');
    img.alt = `Captura de ${project.title}: ${item.label}`;
    img.loading = 'eager';
    img.addEventListener('load', () => {
      if (img.naturalWidth > 0) {
        fallback.hidden = true;
        link.hidden = false;
      }
    });
    img.addEventListener('error', () => { link.hidden = true; fallback.hidden = false; });
    link.append(img);
    media.append(fallback, link);
    figure.append(media, makeTextNode('figcaption', '', item.label));
    gallery.append(figure);
    img.src = item.src;
  });

  if (!projectDialog.open) projectDialog.showModal();
  document.body.classList.add('dialog-open');
  projectDialog.scrollTop = 0;
  dialogClose?.focus();
}

document.querySelectorAll('[data-project]').forEach(button => {
  button.addEventListener('click', () => showProject(button.dataset.project));
});
function closeProject() { if (projectDialog?.open) projectDialog.close(); }
dialogClose?.addEventListener('click', closeProject);
dialogBottomClose?.addEventListener('click', closeProject);
projectDialog?.addEventListener('click', event => { if (event.target === projectDialog) closeProject(); });
projectDialog?.addEventListener('close', () => document.body.classList.remove('dialog-open'));

/* ===============================================================
   RECURSOS COMPARTIDOS — AGREGA AQUÍ LOS TUYOS
   1. Duplica un objeto con título, descripción, URL y categoría.
   2. Puedes usar enlaces externos o archivos locales, por ejemplo:
      url: './src/recursos/mi-guia.pdf'
   3. Categorías sugeridas: Documentación, Cursos, Libros,
      Herramientas. Puedes crear otras cuando quieras.
   Nota: recursos de ejemplo; sustituye por los que tú utilizas.
   =============================================================== */
const recursosCompartidos = [
  {
    title: 'MDN Web Docs',
    description: 'Referencia de HTML, CSS y JavaScript para repasar conceptos y buscar ejemplos de implementación.',
    category: 'Documentación',
    label: 'DESARROLLO WEB',
    url: 'https://developer.mozilla.org/es/'
  },
  {
    title: 'Aprende React',
    description: 'Guía oficial para entender componentes, estado y fundamentos de interfaces en React.',
    category: 'Documentación',
    label: 'REACT',
    url: 'https://es.react.dev/learn'
  },
  {
    title: 'Pro Git (en español)',
    description: 'Libro gratuito de referencia para comprender Git, ramas, commits y trabajo colaborativo.',
    category: 'Libros',
    label: 'CONTROL DE VERSIONES',
    url: 'https://git-scm.com/book/es/v2'
  },
  {
    title: 'freeCodeCamp',
    description: 'Ejercicios y rutas de aprendizaje de programación y desarrollo web para practicar desde cero.',
    category: 'Cursos',
    label: 'PRÁCTICA',
    url: 'https://www.freecodecamp.org/espanol/learn/'
  }
];

const resourceFilters = document.querySelector('#resourceFilters');
const resourcesGrid = document.querySelector('#resourcesGrid');
const resourceCount = document.querySelector('#resourceCount');

function renderResources(category = 'Todos') {
  if (!resourceFilters || !resourcesGrid || !resourceCount) return;
  const categories = ['Todos', ...new Set(recursosCompartidos.map(resource => resource.category))];
  resourceFilters.replaceChildren(...categories.map(name => {
    const button = makeTextNode('button', 'resource-filter', name);
    button.type = 'button';
    const active = name === category;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
    button.addEventListener('click', () => renderResources(name));
    return button;
  }));

  const filtered = category === 'Todos' ? recursosCompartidos : recursosCompartidos.filter(item => item.category === category);
  resourcesGrid.replaceChildren(...filtered.map((resource, index) => {
    const card = document.createElement('article');
    card.className = 'resource-card';
    const head = document.createElement('div');
    head.className = 'resource-card__head';
    head.append(makeTextNode('span', 'resource-card__number', `0${index + 1} / ${resource.category.toUpperCase()}`), makeTextNode('span', 'resource-card__icon', '↗'));
    const badge = makeTextNode('span', 'resource-card__badge', resource.label || 'RECURSO');
    const title = makeTextNode('h3', '', resource.title);
    const description = makeTextNode('p', '', resource.description);
    const link = makeTextNode('a', 'resource-card__link', 'Abrir recurso ↗');
    link.href = resource.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    card.append(head, badge, title, description, link);
    return card;
  }));
  resourceCount.textContent = `${filtered.length} ${filtered.length === 1 ? 'recurso' : 'recursos'}`;
}
renderResources();

// Fondo interactivo de partículas: movimiento orgánico y repulsión al acercar el cursor.
(() => {
  const canvas = document.querySelector('#particleCanvas');
  const hero = document.querySelector('.hero');
  const ctx = canvas?.getContext('2d', { alpha: true });
  if (!canvas || !hero || !ctx) return;

  let width = 0, height = 0, dpr = 1, raf = 0, particles = [];
  let running = false, visible = true;
  const pointer = { x: -1000, y: -1000, active: false };
  const PALETTE = { dark: [151, 226, 207], light: [37, 115, 110] };
  const bounds = () => hero.getBoundingClientRect();
  const rand = (min, max) => min + Math.random() * (max - min);

  function sizeCanvas() {
    const rect = bounds();
    width = Math.max(1, Math.round(rect.width));
    height = Math.max(1, Math.round(rect.height));
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Un número limitado de partículas en móviles para cuidar el rendimiento.
    const desired = Math.min(width < 650 ? 32 : 75, Math.max(21, Math.round(width * height / 15500)));
    particles = Array.from({ length: desired }, () => ({
      x: rand(0,width), y: rand(0,height), vx: rand(-.17,.17), vy: rand(-.17,.17),
      radius: rand(.8,1.65), phase: rand(0,Math.PI*2)
    }));
  }

  function drawFrame(timestamp = 0) {
    if (!running) return;
    ctx.clearRect(0,0,width,height);
    const rgb = PALETTE[root.dataset.theme === 'light' ? 'light' : 'dark'];
    const mouseRange = 128;
    const linkRange = width < 650 ? 98 : 145;
    const linkRange2 = linkRange*linkRange;
    const animate = !prefersReducedMotion.matches;
    for (const p of particles) {
      if (animate) {
        // El cursor repele los puntos cercanos; se desacelera de forma natural.
        if (pointer.active) {
          const dx = p.x-pointer.x, dy = p.y-pointer.y;
          const dist2 = dx*dx+dy*dy;
          if (dist2 > 1 && dist2 < mouseRange*mouseRange) {
            const dist = Math.sqrt(dist2);
            const force = (mouseRange-dist)/mouseRange * .68;
            p.vx += dx/dist*force;
            p.vy += dy/dist*force;
          }
        }
        p.vx *= .969; p.vy *= .969;
        p.vx = Math.max(-2.3,Math.min(2.3,p.vx));
        p.vy = Math.max(-2.3,Math.min(2.3,p.vy));
        p.x += p.vx + Math.cos(timestamp*.00037+p.phase)*.1;
        p.y += p.vy + Math.sin(timestamp*.00043+p.phase)*.1;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
      }
      ctx.beginPath();
      ctx.fillStyle = `rgba(${rgb.join(',')},.45)`;
      ctx.arc(p.x,p.y,p.radius,0,Math.PI*2);
      ctx.fill();
    }
    for (let i=0;i<particles.length;i++) {
      const p = particles[i];
      for (let j=i+1;j<particles.length;j++) {
        const q = particles[j];
        const dx = p.x-q.x, dy=p.y-q.y, dist2=dx*dx+dy*dy;
        if (dist2 < linkRange2) {
          ctx.strokeStyle = `rgba(${rgb.join(',')},${((1-Math.sqrt(dist2)/linkRange)*.15).toFixed(3)})`;
          ctx.lineWidth = .7;
          ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y); ctx.stroke();
        }
      }
    }
    if (animate) raf = requestAnimationFrame(drawFrame);
    else running = false;
  }
  function start() { if (!running && visible && !document.hidden) { running = true; raf = requestAnimationFrame(drawFrame); } }
  function stop() { running = false; cancelAnimationFrame(raf); }
  hero.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch') return;
    const rect = bounds();
    pointer.x = event.clientX-rect.left;
    pointer.y = event.clientY-rect.top;
    pointer.active = true;
  }, { passive: true });
  hero.addEventListener('pointerleave', () => { pointer.active = false; }, { passive: true });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else start(); });
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible) start(); else stop();
    }, { threshold: 0 });
    io.observe(hero);
  }
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { stop(); sizeCanvas(); start(); }, 160);
  }, { passive: true });
  sizeCanvas(); start();
})();
