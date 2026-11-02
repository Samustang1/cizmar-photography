/* ============================================================
   Cizmar Photography — Nocturne interactions
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var head = document.getElementById('head');
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- sticky header ---------- */
  var ticking = false;
  function onScroll() {
    var y = window.scrollY || window.pageYOffset || 0;
    if (head) head.classList.toggle('is-stuck', y > 40);
    ticking = false;
  }
  function requestScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }
  }
  window.addEventListener('scroll', requestScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  function setMenu(open) {
    if (!burger || !nav) return;
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Zavrieť menu' : 'Otvoriť menu');
    nav.classList.toggle('is-open', open);
    if (head) head.classList.toggle('is-menu', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  if (burger && nav) {
    burger.addEventListener('click', function () {
      setMenu(burger.getAttribute('aria-expanded') !== 'true');
    });

    Array.prototype.forEach.call(nav.querySelectorAll('a'), function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) setMenu(false);
    });
  }

  /* ---------- aktívna sekcia ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a[href^="#"]'));
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));

  if (navLinks.length && sections.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle('is-current', a.getAttribute('href') === '#' + en.target.id);
        });
      });
    }, { rootMargin: '-42% 0px -52% 0px' });

    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- reveal ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        obs.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- lightbox ---------- */
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var lbCap = document.getElementById('lbCap');
  var lbCount = document.getElementById('lbCount');
  var lbClose = document.getElementById('lbClose');
  var lbPrev = document.getElementById('lbPrev');
  var lbNext = document.getElementById('lbNext');

  var gallery = Array.prototype.slice.call(document.querySelectorAll('.shot'))
    .map(function (fig) {
      var btn = fig.querySelector('.shot__btn');
      var img = fig.querySelector('img');
      if (!btn || !img) return null;
      var idxEl = fig.querySelector('.shot__idx');
      var num = idxEl ? parseInt(idxEl.textContent, 10) : 0;
      return {
        button: btn,
        src: img.currentSrc || img.src,
        alt: img.alt || '',
        order: isNaN(num) ? 0 : num,
        label: (fig.querySelector('.shot__cat') ? fig.querySelector('.shot__cat').textContent + ' — ' : '') +
               (fig.querySelector('h3') ? fig.querySelector('h3').textContent : '')
      };
    })
    .filter(Boolean)
    .sort(function (a, b) { return a.order - b.order; });

  var current = 0;
  var lastTrigger = null;

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function showSlide(i) {
    if (!gallery.length) return;
    current = (i + gallery.length) % gallery.length;
    var slide = gallery[current];
    lbImg.src = slide.src;
    lbImg.alt = slide.alt;
    lbCap.textContent = slide.label;
    lbCount.textContent = pad(current + 1) + ' / ' + pad(gallery.length);
  }

  function openLightbox(trigger) {
    if (!lb) return;
    var idx = gallery.findIndex(function (s) { return s.button === trigger; });
    lastTrigger = trigger;
    showSlide(idx < 0 ? 0 : idx);
    lb.classList.add('is-open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (lbClose) lbClose.focus();
  }

  function closeLightbox() {
    if (!lb) return;
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastTrigger) lastTrigger.focus();
  }

  gallery.forEach(function (slide) {
    slide.button.addEventListener('click', function () { openLightbox(slide.button); });
  });

  if (lb) {
    lbClose.addEventListener('click', closeLightbox);
    lbPrev.addEventListener('click', function () { showSlide(current - 1); });
    lbNext.addEventListener('click', function () { showSlide(current + 1); });
    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target.tagName === 'FIGURE') closeLightbox();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (!lb || !lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showSlide(current - 1);
    if (e.key === 'ArrowRight') showSlide(current + 1);
  });

  /* ---------- plynulé kotvy ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('a[href^="#"]'), function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (!id || id === '#') return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var offset = (id === '#home' || !head) ? 0 : head.getBoundingClientRect().height;
      var top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: Math.max(0, top), behavior: reduceMotion ? 'auto' : 'smooth' });
      if (history.replaceState) history.replaceState(null, '', id);
    });
  });
})();
