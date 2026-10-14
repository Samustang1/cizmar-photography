/* ============================================================
   Cizmar Photography — V3 · EDITORIAL
   Interakcie: sticky hlavička, mobilné menu, reveal pri scrolli,
   filtre portfólia, lightbox, tlačidlo nahor, progress,
   aktívna navigácia, taby s kódom a typový efekt.
   ============================================================ */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ===================== ROK V PÄTIČKE ===================== */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ===================== HLAVIČKA ===================== */
  var head = document.getElementById('siteHead');
  var progress = document.getElementById('progress');
  var toTop = document.getElementById('toTop');

  var ticking = false;
  function onScroll() {
    var y = window.scrollY || window.pageYOffset || 0;
    if (head) head.classList.toggle('is-stuck', y > 40);

    var doc = document.documentElement;
    var max = doc.scrollHeight - doc.clientHeight;
    var ratio = max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0;
    if (progress) progress.style.transform = 'scaleX(' + ratio + ')';
    if (toTop) toTop.classList.toggle('is-visible', y > 600);

    ticking = false;
  }
  function onScrollThrottled() {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }
  window.addEventListener('scroll', onScrollThrottled, { passive: true });
  window.addEventListener('resize', onScrollThrottled);
  onScroll();

  /* ===================== MOBILNÉ MENU ===================== */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  if (burger && nav) {
    var setNav = function (open) {
      nav.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Zavrieť menu' : 'Otvoriť menu');
    };
    burger.addEventListener('click', function () {
      setNav(!nav.classList.contains('is-open'));
    });
    Array.prototype.forEach.call(nav.querySelectorAll('a'), function (a) {
      a.addEventListener('click', function () { setNav(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setNav(false);
    });
  }

  /* ===================== ODHALENIE PRI SCROLLI ===================== */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in', 'is-visible'); });
  }

  /* ===================== AKTÍVNA NAVIGÁCIA ===================== */
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
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ===================== FILTER PORTFÓLIA ===================== */
  var filters = Array.prototype.slice.call(document.querySelectorAll('.filter'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('.card'));
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

  /* ===================== LIGHTBOX PORTFÓLIA ===================== */
  var lb = document.getElementById('lightbox');
  if (lb && cards.length) {
    var lbImg = document.getElementById('lbImg');
    var lbCap = document.getElementById('lbCap');
    var lbPrev = document.getElementById('lbPrev');
    var lbNext = document.getElementById('lbNext');
    var lbClose = document.getElementById('lbClose');
    var current = 0;

    var visible = function () {
      return cards.filter(function (c) { return !c.classList.contains('is-hidden'); });
    };
    var render = function (list, index) {
      if (!list.length) return;
      current = (index + list.length) % list.length;
      var fig = list[current];
      var img = fig.querySelector('img');
      if (img && lbImg) { lbImg.src = img.currentSrc || img.src; lbImg.alt = img.alt || ''; }
      var cat = fig.querySelector('figcaption span');
      var name = fig.querySelector('figcaption strong');
      if (lbCap) lbCap.textContent = [cat ? cat.textContent : '', name ? name.textContent : ''].join(' · ');
    };
    var open = function (fig) {
      var list = visible();
      render(list, list.indexOf(fig));
      lb.classList.add('is-open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };
    var close = function () {
      lb.classList.remove('is-open');
      lb.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    cards.forEach(function (fig) {
      fig.setAttribute('tabindex', '0');
      fig.setAttribute('role', 'button');
      fig.addEventListener('click', function () { open(fig); });
      fig.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(fig); }
      });
    });
    if (lbPrev) lbPrev.addEventListener('click', function () { render(visible(), current - 1); });
    if (lbNext) lbNext.addEventListener('click', function () { render(visible(), current + 1); });
    if (lbClose) lbClose.addEventListener('click', close);
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') render(visible(), current - 1);
      if (e.key === 'ArrowRight') render(visible(), current + 1);
    });
  }

  /* ===================== TLAČIDLO NAHOR ===================== */
  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
  }

})();
