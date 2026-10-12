/* =====================================================================
   Cizmar Photography  ·  v2 "Editorial"
   Vanilla JS: menu, reveal, filtre, lightbox, formulár (odoslanie e-mailu).
   Formulár odosiela cez FormSubmit — príjemca dostane e-mail v schránke,
   návštevník nikdy neopúšťa stránku (žiadny mailto klient).
   ===================================================================== */
(function () {
  'use strict';

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var doc = document;

  /* ---------- 1. Mobilné menu ---------- */
  function initMenu() {
    var burger = $('#burger');
    var nav = $('#nav');
    if (!burger || !nav) return;

    var setOpen = function (open) {
      nav.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Zavrieť menu' : 'Otvoriť menu');
      doc.body.style.overflow = open ? 'hidden' : '';
    };

    burger.addEventListener('click', function () {
      setOpen(!nav.classList.contains('is-open'));
    });

    $$('.nav__link, .nav__cta', nav).forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });

    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
  }

  /* ---------- 2. Reveal on scroll ---------- */
  function initReveal() {
    var items = $$('.reveal');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 3. Filtre portfólia ---------- */
  function initFilters() {
    var filterBar = $('.filters');
    if (!filterBar) return;
    var items = $$('[data-category]');

    filterBar.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('.filter') : null;
      if (!btn) return;
      var value = btn.getAttribute('data-filter');

      $$('.filter', filterBar).forEach(function (b) {
        var active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-selected', active ? 'true' : 'false');
      });

      items.forEach(function (item) {
        var show = value === 'all' || item.getAttribute('data-category') === value;
        item.style.display = show ? '' : 'none';
      });
    });
  }

  /* ---------- 4. Lightbox ---------- */
  function initLightbox() {
    var lb = $('#lightbox');
    if (!lb) return;

    var imgEl = $('#lbImg');
    var capEl = $('#lbCap');
    var figures = $$('[data-category]');
    var current = 0;

    var collect = function () {
      return figures.filter(function (f) { return f.style.display !== 'none'; });
    };

    var render = function (list, index) {
      if (!list.length) return;
      current = (index + list.length) % list.length;
      var fig = list[current];
      var img = $('img', fig);
      imgEl.src = img.src;
      imgEl.alt = img.alt || '';
      if (capEl) {
        var cat = $('.work__cat', fig);
        var name = $('.work__name', fig);
        capEl.textContent = [cat ? cat.textContent : '', name ? name.textContent : ''].join(' — ');
      }
    };

    var open = function (fig) {
      var list = collect();
      var idx = list.indexOf(fig);
      render(list, idx < 0 ? 0 : idx);
      lb.classList.add('is-open');
      lb.setAttribute('aria-hidden', 'false');
      doc.body.style.overflow = 'hidden';
    };

    var close = function () {
      lb.classList.remove('is-open');
      lb.setAttribute('aria-hidden', 'true');
      doc.body.style.overflow = '';
    };

    figures.forEach(function (fig) {
      fig.addEventListener('click', function () { open(fig); });
      fig.setAttribute('tabindex', '0');
      fig.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(fig); }
      });
    });

    var prev = $('#lbPrev'), next = $('#lbNext'), closeBtn = $('#lbClose');
    if (prev) prev.addEventListener('click', function () { render(collect(), current - 1); });
    if (next) next.addEventListener('click', function () { render(collect(), current + 1); });
    if (closeBtn) closeBtn.addEventListener('click', close);
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    doc.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') render(collect(), current - 1);
      if (e.key === 'ArrowRight') render(collect(), current + 1);
    });
  }

  /* ---------- 5. Rezervačný formulár ---------- */
  /*  Odosiela na FormSubmit — e-mail príde do schránky (cizsamko@gmail.com),
      bez otvárania e-mailového klienta u návštevníka.
      Ak by JS zlyhal, formulár sa odošle natívne cez atribút action. */
  function initForm() {
    var form = $('#bookingForm');
    if (!form) return;

    var note = $('#formNote');
    var hint = $('#formHint');
    var submitBtn = $('#submitBtn');
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var ENDPOINT = 'https://formsubmit.co/ajax/cizsamko@gmail.com';
    var REQUIRED = ['name', 'email', 'message', 'gdpr'];

    var valueOf = function (name) {
      var field = form.querySelector('[name="' + name + '"]');
      if (!field) return '';
      if (field.type === 'checkbox') return field.checked ? (field.value || 'on') : '';
      return (field.value || '').trim();
    };

    var setError = function (name, message) {
      var field = form.querySelector('[name="' + name + '"]');
      if (field) {
        var wrap = field.closest('.field');
        if (wrap) wrap.classList.toggle('has-error', !!message);
      }
      var slot = form.querySelector('[data-error-for="' + name + '"]');
      if (slot) slot.textContent = message || '';
    };

    /* Skontroluje jedno pole a vráti text chyby (alebo prázdny reťazec). */
    var checkField = function (name) {
      var value = valueOf(name);
      if (name === 'name' && value.length < 2) return 'Prosím, vyplň meno.';
      if (name === 'email' && !emailRe.test(value)) return 'Zadaj platný e-mail.';
      if (name === 'message' && value.length < 5) return 'Napíš aspoň krátku správu.';
      if (name === 'gdpr' && !value) return 'Potrebujeme tvoj súhlas.';
      return '';
    };

    var isComplete = function () {
      return REQUIRED.every(function (name) { return !checkField(name); });
    };

    /* Tlačidlo sa odomkne až keď sú vyplnené všetky povinné polia. */
    var syncButton = function () {
      var ok = isComplete();
      if (submitBtn) {
        submitBtn.disabled = !ok;
        submitBtn.setAttribute('aria-disabled', ok ? 'false' : 'true');
      }
      if (hint) hint.hidden = ok;
      return ok;
    };

    var validate = function (showErrors) {
      var ok = true;
      REQUIRED.forEach(function (name) {
        var message = checkField(name);
        if (message) ok = false;
        if (showErrors !== false) setError(name, message);
      });
      return ok;
    };

    var showNote = function (text, type) {
      if (!note) return;
      note.textContent = text;
      note.classList.remove('is-success', 'is-error');
      if (type) note.classList.add('is-' + type);
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate(true)) { showNote('Skontroluj označené polia.', 'error'); syncButton(); return; }

      var data = new FormData(form);
      var payload = {
        name: data.get('name') || '',
        email: data.get('email') || '',
        phone: data.get('phone') || '',
        car: data.get('car') || '',
        datum: data.get('date') || '',
        cas: data.get('time') || '',
        lokalita: data.get('location') || '',
        sluzba: data.get('package') || '',
        sprava: data.get('message') || '',
        _subject: 'Nová rezervácia fotenia — ' + (data.get('name') || ''),
        _template: 'table',
        _captcha: 'false',
        _honey: data.get('_honey') || ''
      };

      if (submitBtn) submitBtn.classList.add('is-loading');
      showNote('Odosielam…', '');

      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (res) { return res.json(); })
        .then(function (res) {
          if (res && (res.success === 'true' || res.success === true)) {
            form.reset();
            showNote('Ďakujem! Rezervácia dorazila — ozvem sa ti čo najskôr.', 'success');
          } else {
            showNote((res && res.message) ? res.message : 'Odoslanie zlyhalo. Skús znova alebo napíš na cizsamko@gmail.com.', 'error');
          }
        })
        .catch(function () {
          showNote('Nepodarilo sa odoslať. Skús znova alebo napíš na cizsamko@gmail.com.', 'error');
        })
        .then(function () { if (submitBtn) submitBtn.classList.remove('is-loading'); });
    });

    /* Živá kontrola: čistenie chýb, odomykanie tlačidla, chyba po opustení poľa */
    form.addEventListener('input', function (e) {
      var name = e.target && e.target.name;
      if (name && REQUIRED.indexOf(name) !== -1 && !checkField(name)) setError(name, '');
      syncButton();
    });
    form.addEventListener('change', function (e) {
      var name = e.target && e.target.name;
      if (name && REQUIRED.indexOf(name) !== -1 && !checkField(name)) setError(name, '');
      syncButton();
    });
    $$('input, select, textarea', form).forEach(function (field) {
      field.addEventListener('blur', function () {
        if (!field.name || REQUIRED.indexOf(field.name) === -1) return;
        setError(field.name, checkField(field.name));
      });
    });

    syncButton();
  }

  /* ---------- 5b. Predvyplnenie balíka z kariet ---------- */
  function initPackageShortcut() {
    var select = $('#package');
    if (!select) return;
    $$('[data-package]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var val = btn.getAttribute('data-package');
        Array.prototype.forEach.call(select.options, function (o) {
          if (o.value === val) select.value = val;
        });
      });
    });
  }

  /* ---------- 6. Rok ---------- */
  function initYear() {
    var y = $('#year');
    if (y) y.textContent = new Date().getFullYear();
  }

  doc.addEventListener('DOMContentLoaded', function () {
    initMenu();
    initReveal();
    initFilters();
    initLightbox();
    initForm();
    initYear();
  });
})();
