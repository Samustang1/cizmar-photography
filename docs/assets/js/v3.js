/* ============================================================
   Cizmar Photography — V3 · FUTURE
   Interakcie: HUD readout, scroll progress, kurzorová žiara,
   tilt + spotlight kariet, magnetické tlačidlá, scramble nadpisu,
   parallax, aktívna navigácia a časticové pozadie.
   ============================================================ */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ===================== ROK V PÄTIČKE ===================== */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ===================== MOBILNÉ MENU ===================== */
  var burger = document.getElementById('nav-burger') || $('.burger');
  var nav = document.getElementById('nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    $$('a', nav).forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ===================== ODHALENIE PRI SCROLLI ===================== */
  var revealEls = $$('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ===================== FILTER PORTFÓLIA ===================== */
  var filters = $$('.filter');
  var cards = $$('.card');
  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var value = btn.getAttribute('data-filter');
      filters.forEach(function (b) {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');
      cards.forEach(function (card) {
        var show = value === 'all' || card.getAttribute('data-category') === value;
        card.classList.toggle('is-hidden', !show);
      });
    });
  });

  /* ===================== PROGRESS BAR + HUD READOUT ===================== */
  var progress = document.createElement('div');
  progress.className = 'progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progress);

  var hud = $('.hud');
  var readout = null, clockEl = null, scrollEl = null;
  if (hud && nav) {
    readout = document.createElement('div');
    readout.className = 'hud__meta';
    readout.setAttribute('aria-hidden', 'true');
    readout.innerHTML =
      '<span>LOC <b class="js-clock">--:--</b></span>' +
      '<span>SCROLL <b class="js-scroll">0%</b></span>';
    hud.insertBefore(readout, nav);
    clockEl = $('.js-clock', readout);
    scrollEl = $('.js-scroll', readout);
  }

  var ticking = false;
  function updateScroll() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - doc.clientHeight;
    var ratio = max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0;
    progress.style.transform = 'scaleX(' + ratio + ')';
    if (scrollEl) scrollEl.textContent = Math.round(ratio * 100) + '%';
    ticking = false;
  }
  function requestScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(updateScroll); }
  }
  window.addEventListener('scroll', requestScroll, { passive: true });
  window.addEventListener('resize', requestScroll);
  updateScroll();

  /* ===================== ŽIVÝ ČAS (Europe/Bratislava) ===================== */
  if (clockEl) {
    var fmt;
    try {
      fmt = new Intl.DateTimeFormat('sk-SK', {
        hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Europe/Bratislava'
      });
    } catch (e) { fmt = null; }
    var tickClock = function () {
      var d = new Date();
      clockEl.textContent = fmt ? fmt.format(d)
        : ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
    };
    tickClock();
    setInterval(tickClock, 15000);
  }

  /* ===================== AKTÍVNY ODKAZ V NAVIGÁCII ===================== */
  var navLinks = $$('.hud__nav a[href^="#"]');
  var sections = $$('section[id]');
  if (navLinks.length && sections.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle('is-current', a.getAttribute('href') === '#' + en.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ===================== KURZOROVÁ ŽIARA ===================== */
  if (!reduce && canHover) {
    var glow = document.createElement('div');
    glow.className = 'cursor-glow';
    glow.setAttribute('aria-hidden', 'true');
    document.body.appendChild(glow);

    var gx = window.innerWidth / 2, gy = window.innerHeight / 2;
    var tx = gx, ty = gy;
    window.addEventListener('mousemove', function (e) {
      tx = e.clientX; ty = e.clientY;
      glow.style.opacity = '1';
    }, { passive: true });
    (function follow() {
      gx += (tx - gx) * 0.16;
      gy += (ty - gy) * 0.16;
      glow.style.transform = 'translate(' + gx.toFixed(1) + 'px,' + gy.toFixed(1) + 'px)';
      requestAnimationFrame(follow);
    })();
  }

  /* ===================== TILT + SPOTLIGHT KARIET ===================== */
  if (!reduce && canHover) {
    cards.forEach(function (card) {
      var spot = document.createElement('span');
      spot.className = 'spot';
      spot.setAttribute('aria-hidden', 'true');
      card.appendChild(spot);

      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        card.style.setProperty('--tilt-x', ((0.5 - py) * 8).toFixed(2) + 'deg');
        card.style.setProperty('--tilt-y', ((px - 0.5) * 8).toFixed(2) + 'deg');
        spot.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
        spot.style.setProperty('--my', (py * 100).toFixed(1) + '%');
      });
      card.addEventListener('mouseleave', function () {
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
      });
    });
  }

  /* ===================== MAGNETICKÉ TLAČIDLÁ ===================== */
  if (!reduce && canHover) {
    $$('.btn').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        btn.style.transform = 'translate(' + (x * 0.22).toFixed(1) + 'px,' + (y * 0.35).toFixed(1) + 'px)';
      });
      btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
    });
  }

  /* ===================== SCRAMBLE NADPISU ===================== */
  var emWord = $('.hero__title em');
  if (emWord) {
    var finalText = emWord.textContent;
    if (reduce) {
      emWord.textContent = finalText;
    } else {
      var glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#@$%&/\<>*01';
      var start = performance.now();
      var duration = 1100;
      var scramble = function (now) {
        var p = Math.min(1, (now - start) / duration);
        var settled = Math.floor(finalText.length * p);
        var out = finalText.slice(0, settled);
        for (var i = settled; i < finalText.length; i++) {
          out += glyphs.charAt(Math.floor(Math.random() * glyphs.length));
        }
        emWord.textContent = out;
        if (p < 1) requestAnimationFrame(scramble);
        else emWord.textContent = finalText;
      };
      requestAnimationFrame(scramble);
    }
  }

  /* ===================== PARALLAX HERO VIZUÁLU ===================== */
  var visual = $('.hero__visual');
  if (visual && !reduce && canHover) {
    window.addEventListener('mousemove', function (e) {
      var x = (e.clientX / window.innerWidth - 0.5) * 18;
      var y = (e.clientY / window.innerHeight - 0.5) * 18;
      visual.style.setProperty('--px', x.toFixed(1) + 'px');
      visual.style.setProperty('--py', y.toFixed(1) + 'px');
    }, { passive: true });
  }

  /* ===================== LIGHTBOX PORTFÓLIA ===================== */
  var lb = document.getElementById('lightbox');
  if (lb && cards.length) {
    var lbImg = document.getElementById('lbImg');
    var lbCap = document.getElementById('lbCap');
    var lbCurrent = 0;
    var visibleCards = function () {
      return cards.filter(function (c) { return !c.classList.contains('is-hidden'); });
    };
    var renderLb = function (list, index) {
      if (!list.length) return;
      lbCurrent = (index + list.length) % list.length;
      var fig = list[lbCurrent];
      var img = fig.querySelector('img');
      if (!img) return;
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt || '';
      var cat = fig.querySelector('figcaption span');
      var name = fig.querySelector('figcaption strong');
      if (lbCap) lbCap.textContent = [cat ? cat.textContent : '', name ? name.textContent : ''].join(' — ');
    };
    var openLb = function (fig) {
      var list = visibleCards();
      renderLb(list, list.indexOf(fig));
      lb.classList.add('is-open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };
    var closeLb = function () {
      lb.classList.remove('is-open');
      lb.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };
    cards.forEach(function (fig) {
      fig.addEventListener('click', function () { openLb(fig); });
      fig.setAttribute('tabindex', '0');
      fig.setAttribute('role', 'button');
      fig.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLb(fig); }
      });
    });
    var lbPrev = document.getElementById('lbPrev');
    var lbNext = document.getElementById('lbNext');
    var lbClose = document.getElementById('lbClose');
    if (lbPrev) lbPrev.addEventListener('click', function () { renderLb(visibleCards(), lbCurrent - 1); });
    if (lbNext) lbNext.addEventListener('click', function () { renderLb(visibleCards(), lbCurrent + 1); });
    if (lbClose) lbClose.addEventListener('click', closeLb);
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') renderLb(visibleCards(), lbCurrent - 1);
      if (e.key === 'ArrowRight') renderLb(visibleCards(), lbCurrent + 1);
    });
  }

  /* ===================== TLAČIDLO NAHOR ===================== */
  var toTop = document.getElementById('toTop');
  if (toTop) {
    var toggleTop = function () {
      toTop.classList.toggle('is-visible', (window.scrollY || window.pageYOffset) > 600);
    };
    window.addEventListener('scroll', toggleTop, { passive: true });
    toggleTop();
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
  }

  /* ===================== ČASTICOVÉ POZADIE ===================== */
  var canvas = document.getElementById('fx');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0, H = 0, particles = [];

  function seed() {
    var count = Math.max(24, Math.min(64, Math.round(window.innerWidth / 28)));
    particles = [];
    for (var i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.2 * dpr,
        vy: (Math.random() - 0.5) * 0.2 * dpr,
        r: (Math.random() * 1.4 + 0.5) * dpr
      });
    }
  }
  function resize() {
    W = canvas.width = Math.floor(window.innerWidth * dpr);
    H = canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    seed();
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    var i, j, p;
    for (i = 0; i < particles.length; i++) {
      p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; else if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; else if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(79,70,229,0.42)';
      ctx.fill();
    }
    var link = 150 * dpr * dpr;
    for (i = 0; i < particles.length; i++) {
      for (j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var dist2 = dx * dx + dy * dy;
        if (dist2 < link) {
          var alpha = 0.18 * (1 - dist2 / link);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(236,72,153,' + alpha.toFixed(3) + ')';
          ctx.lineWidth = dpr * 0.6;
          ctx.stroke();
        }
      }
    }
  }
  function loop() { draw(); requestAnimationFrame(loop); }

  resize();
  window.addEventListener('resize', resize);
  if (reduce) draw(); else loop();
})();
