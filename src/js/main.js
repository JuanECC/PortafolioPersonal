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

// Foto opcional: mientras no la adjuntes, se muestra una ilustración con tus iniciales.
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
