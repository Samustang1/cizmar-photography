/* ============================================================
   Cizmar Photography — interakcie
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- rok ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- progres + sticky hlavička + nahor ---------- */
  var head = document.getElementById('head');
  var progress = document.getElementById('progress');
  var toTop = document.getElementById('toTop');
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset || 0;

    if (head) head.classList.toggle('is-stuck', y > 40);

    if (progress) {
      var doc = document.documentElement;
      var max = doc.scrollHeight - doc.clientHeight;
      var ratio = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      progress.style.transform = 'scaleX(' + ratio + ')';
    }

    if (toTop) toTop.classList.toggle('is-visible', y > 700);

    ticking = false;
  }

  function requestScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }
  }

  window.addEventListener('scroll', requestScroll, { passive: true });
  window.addEventListener('resize', requestScroll);
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- mobilné menu ---------- */
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
      if (window.innerWidth > 820) setMenu(false);
    });
  }

  /* ---------- aktívna položka navigácie ---------- */
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

  /* ---------- reveal pri scrollovaní ---------- */
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

  /* ---------- filtre portfólia ---------- */
  var filters = Array.prototype.slice.call(document.querySelectorAll('.filter'));
  var items = Array.prototype.slice.call(document.querySelectorAll('.work__item'));
  var workGrid = document.getElementById('work');
  var empty = document.getElementById('workEmpty');

  function applyFilter(value) {
    var visible = 0;

    items.forEach(function (item) {
      var match = value === 'all' || item.getAttribute('data-category') === value;
      item.classList.toggle('is-hidden', !match);
      if (match) {
        visible += 1;
        item.classList.add('is-in');
      }
    });

    if (workGrid) {
      workGrid.classList.toggle('is-filtered', value !== 'all');
      workGrid.classList.toggle('is-solo', value !== 'all' && visible === 1);
    }

    if (empty) empty.hidden = visible !== 0;
  }

  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filters.forEach(function (b) {
        b.classList.remove('is-active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');
      applyFilter(btn.getAttribute('data-filter'));
    });
  });

  /* ---------- lightbox ---------- */
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var lbCap = document.getElementById('lbCap');
  var lbClose = document.getElementById('lbClose');
  var lbPrev = document.getElementById('lbPrev');
  var lbNext = document.getElementById('lbNext');

  var gallery = [];
  var current = 0;
  var lastTrigger = null;

  function buildGallery() {
    gallery = items
      .filter(function (item) { return !item.classList.contains('is-hidden'); })
      .map(function (item) {
        var img = item.querySelector('img');
        var cap = item.querySelector('.work__title');
        var cat = item.querySelector('.work__cat');
        if (!img) return null;
        return {
          src: img.currentSrc || img.src,
          alt: img.alt || '',
          label: (cat ? cat.textContent + ' — ' : '') + (cap ? cap.textContent : '')
        };
      })
      .filter(Boolean);
  }

  function showSlide(i) {
    if (!gallery.length) return;
    current = (i + gallery.length) % gallery.length;
    var slide = gallery[current];
    lbImg.src = slide.src;
    lbImg.alt = slide.alt;
    lbCap.textContent = slide.label;
  }

  function openLightbox(trigger) {
    if (!lb) return;
    buildGallery();
    var img = trigger.querySelector('img');
    var idx = gallery.findIndex(function (s) {
      return img && (s.src === img.currentSrc || s.src === img.src);
    });
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

  Array.prototype.forEach.call(document.querySelectorAll('.work__media'), function (btn) {
    btn.addEventListener('click', function () { openLightbox(btn); });
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

  /* ---------- plynulý posun na kotvy ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('a[href^="#"]'), function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (!id || id === '#') return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var offset = id === '#home' || !head ? 0 : head.getBoundingClientRect().height;
      var top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: Math.max(0, top), behavior: reduceMotion ? 'auto' : 'smooth' });
      if (history.replaceState) history.replaceState(null, '', id);
    });
  });
})();
