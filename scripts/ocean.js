'use strict';

/* ─────────────────────────────────────────
   DESCENT — canvas engine
   ───────────────────────────────────────── */

const canvas = document.getElementById('c');
const ctx    = canvas.getContext('2d');

let W, H;
function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

/* ── STATE ── */
let mouse  = { x: -999, y: -999 };
let depth  = 0;   // 0 → 1  (scroll progress)
let t      = 0;   // time in seconds

/* ── MOUSE / CURSOR ── */
const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let ringX = 0, ringY = 0;

window.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  if (dot)  { dot.style.left  = e.clientX + 'px'; dot.style.top  = e.clientY + 'px'; }
});

// ring lags behind cursor
function animateRing() {
  ringX += (mouse.x - ringX) * 0.12;
  ringY += (mouse.y - ringY) * 0.12;
  if (ring) { ring.style.left = ringX + 'px'; ring.style.top = ringY + 'px'; }
  requestAnimationFrame(animateRing);
}
animateRing();

/* ── SCROLL / DEPTH ── */
const gaugeFill = document.getElementById('gaugeFill');
const gaugeVal  = document.getElementById('gaugeVal');
const MAX_DEPTH = 11000;

function onScroll() {
  const scrollable = document.body.scrollHeight - window.innerHeight;
  depth = scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0;
  if (gaugeFill) gaugeFill.style.height = (depth * 100) + '%';
  if (gaugeVal)  gaugeVal.textContent   = Math.round(depth * MAX_DEPTH).toLocaleString() + 'm';
}
window.addEventListener('scroll', onScroll, { passive: true });

/* ─────────────────────────────────────────
   BACKGROUND — smooth zone interpolation
   ───────────────────────────────────────── */

// Five colour zones: [top-rgb, bottom-rgb]
const BG_ZONES = [
  { t: [0, 28, 68],   b: [0, 14, 46]   },  // sunlit
  { t: [0,  7, 46],   b: [6,  0, 34]   },  // twilight
  { t: [3,  0, 18],   b: [1,  0,  9]   },  // midnight
  { t: [1,  0,  8],   b: [0,  0,  4]   },  // abyssal
  { t: [0,  0,  3],   b: [0,  0,  0]   },  // hadal
];

function lerp(a, b, k) { return a + (b - a) * k; }

function lerpRGB(c0, c1, k) {
  return [lerp(c0[0], c1[0], k), lerp(c0[1], c1[1], k), lerp(c0[2], c1[2], k)];
}

function drawBG() {
  const zCount  = BG_ZONES.length;
  const raw     = depth * (zCount - 1);
  const zIdx    = Math.floor(raw);
  const zFrac   = raw - zIdx;
  const z0      = BG_ZONES[Math.min(zIdx,     zCount - 1)];
  const z1      = BG_ZONES[Math.min(zIdx + 1, zCount - 1)];

  const top = lerpRGB(z0.t, z1.t, zFrac);
  const bot = lerpRGB(z0.b, z1.b, zFrac);

  const grd = ctx.createLinearGradient(0, 0, 0, H);
  grd.addColorStop(0, `rgb(${top.map(Math.round).join(',')})`);
  grd.addColorStop(1, `rgb(${bot.map(Math.round).join(',')})`);
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, W, H);
}

/* ─────────────────────────────────────────
   MOUSE TORCH
   ───────────────────────────────────────── */

function drawTorch() {
  if (mouse.x < 0) return;
  // torch weakens in the deep (it's colder, darker, pressure bends light)
  const intensity = lerp(0.072, 0.022, depth);
  const radius    = lerp(300,   200,   depth);

  const grd = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, radius);
  grd.addColorStop(0,   `rgba(130, 215, 255, ${intensity})`);
  grd.addColorStop(0.35, `rgba(80, 170, 255, ${intensity * 0.45})`);
  grd.addColorStop(1,   'rgba(0,0,0,0)');
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.arc(mouse.x, mouse.y, radius, 0, Math.PI * 2);
  ctx.fill();
}

/* ─────────────────────────────────────────
   BIOLUMINESCENT PARTICLES
   ───────────────────────────────────────── */

class Orb {
  constructor(randomY) {
    this.reset(randomY);
  }

  reset(randomY = false) {
    this.x    = Math.random() * W;
    this.y    = randomY ? Math.random() * H : H + 8;
    this.r    = Math.random() * 1.6 + 0.4;
    this.vy   = -(Math.random() * 0.38 + 0.12);
    this.vx   = (Math.random() - 0.5) * 0.22;
    this.age  = 0;
    this.life = Math.random() * 380 + 180;
    this.phi  = Math.random() * Math.PI * 2;
    this.ps   = Math.random() * 0.018 + 0.005;
    this.base = Math.random() * 0.55 + 0.25;
    // hue: 170–200 (cyan-blue) at surface, shifts to 240–280 (violet) in deep
    this.hue0 = 175 + Math.random() * 22;
  }

  update() {
    this.x  += this.vx + Math.sin(t * 0.4 + this.phi) * 0.08;
    this.y  += this.vy;
    this.age++;
    if (this.y < -6 || this.age > this.life) this.reset();
  }

  draw() {
    // shift hue with depth
    const hue  = this.hue0 + depth * 80;
    const sat  = Math.round(lerp(95, 75, depth));
    const lit  = Math.round(lerp(72, 82, depth));

    // pulse
    const pulse = Math.sin(t * this.ps * 60 + this.phi) * 0.28 + 0.72;

    // torch proximity
    const dx   = this.x - mouse.x;
    const dy   = this.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const boost = Math.max(0, 1 - dist / 240);

    const alpha = Math.min(1, this.base * pulse + boost * 0.85);
    const radius = this.r * (1 + boost * 2.8);

    // glow ring
    const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, radius * 5);
    grd.addColorStop(0, `hsla(${hue},${sat}%,${lit}%,${alpha})`);
    grd.addColorStop(1, `hsla(${hue},${sat}%,${lit}%,0)`);
    ctx.beginPath();
    ctx.arc(this.x, this.y, radius * 5, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();
  }
}

const TOTAL   = 160;
const orbs    = Array.from({ length: TOTAL }, () => new Orb(true));

/* ─────────────────────────────────────────
   DEEP STREAKS — rare light pulses at depth
   ───────────────────────────────────────── */

class Streak {
  constructor() { this.reset(); }
  reset() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.len = Math.random() * 60 + 20;
    this.a  = 0;
    this.maxA = Math.random() * 0.4 + 0.1;
    this.life = 0;
    this.maxLife = Math.random() * 60 + 30;
    this.hue = Math.random() < 0.5 ? 180 : 290; // cyan or violet
  }
  update() {
    this.life++;
    const half = this.maxLife / 2;
    this.a = this.life < half
      ? (this.life / half) * this.maxA
      : ((this.maxLife - this.life) / half) * this.maxA;
    if (this.life >= this.maxLife) this.reset();
  }
  draw() {
    if (depth < 0.5) return; // only in the deep
    ctx.save();
    ctx.globalAlpha = this.a * (depth - 0.5) * 2;
    ctx.strokeStyle = `hsl(${this.hue}, 90%, 75%)`;
    ctx.lineWidth   = 0.5;
    ctx.shadowColor = `hsl(${this.hue}, 90%, 70%)`;
    ctx.shadowBlur  = 6;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x, this.y + this.len);
    ctx.stroke();
    ctx.restore();
  }
}

const streaks = Array.from({ length: 18 }, () => new Streak());

/* ─────────────────────────────────────────
   RENDER LOOP
   ───────────────────────────────────────── */

let last = 0;
function frame(now) {
  t = now * 0.001;

  ctx.clearRect(0, 0, W, H);
  drawBG();
  drawTorch();

  // active particle count shrinks with depth (fewer things live down here)
  const active = Math.round(TOTAL * lerp(1, 0.35, depth));
  for (let i = 0; i < active; i++) {
    orbs[i].update();
    orbs[i].draw();
  }

  streaks.forEach(s => { s.update(); s.draw(); });

  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

/* ─────────────────────────────────────────
   SCROLL REVEAL
   ───────────────────────────────────────── */

const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('vis');
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.18 });

document.querySelectorAll('.content').forEach(el => obs.observe(el));

/* ─────────────────────────────────────────
   CURSOR HINT — fade on first mouse move
   ───────────────────────────────────────── */

const hint = document.getElementById('cursorHint');
if (hint) {
  window.addEventListener('mousemove', () => {
    hint.style.transition = 'opacity 1.5s ease';
    hint.style.opacity    = '0';
  }, { once: true });
}
