/* ============================================================
   Cizmar Photography — photo-first portfolio
   Menu, scrollspy, lightbox a drobné UI detaily.
   ============================================================ */

(function () {
  'use strict';

  var doc = document;
  var body = doc.body;
  var head = doc.getElementById('head');
  var burger = doc.getElementById('burger');
  var nav = doc.getElementById('nav');
  var brand = doc.querySelector('.brand');
  var year = doc.getElementById('year');

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  /* ---------- zamknutie stránky (menu / lightbox) ---------- */

  var menuOpen = false;
  var lbOpen = false;

  function syncLock() {
    body.classList.toggle('is-locked', menuOpen || lbOpen);
  }

  /* ---------- mobilné menu ---------- */

  function setMenu(open) {
    if (!head || !burger || !nav || menuOpen === open) return;

    menuOpen = open;
    head.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Zavrieť menu' : 'Otvoriť menu');
    syncLock();

    if (open) {
      var first = nav.querySelector('a');
      if (first) {
        window.setTimeout(function () {
          first.focus();
        }, 80);
      }
    } else if (nav.contains(doc.activeElement) && window.innerWidth <= 900) {
      burger.focus();
    }
  }

  if (burger) {
    burger.addEventListener('click', function () {
      setMenu(!menuOpen);
    });
  }

  if (nav) {
    nav.addEventListener('click', function (event) {
      var link = event.target.closest('a');
      if (link && menuOpen) setMenu(false);
    });
  }

  window.addEventListener('resize', function () {
    if (window.innerWidth > 900 && menuOpen) setMenu(false);
  });

  /* ---------- hlavička + scrollspy ---------- */

  var navLinks = [];
  if (nav) {
    for (var i = 0; i < nav.children.length; i += 1) {
      if (nav.children[i].tagName === 'A') navLinks.push(nav.children[i]);
    }
  }

  var sections = [];
  navLinks.forEach(function (link) {
    var href = link.getAttribute('href');
    if (href && href.charAt(0) === '#') {
      var section = doc.querySelector(href);
      if (section) sections.push(section);
    }
  });

  var ticking = false;

  function updateScrollUI() {
    var y = window.pageYOffset || doc.documentElement.scrollTop || 0;

    if (head) head.classList.toggle('is-stuck', y > 24);

    var mid = window.innerHeight * 0.38;
    var currentId = '';

    sections.forEach(function (section) {
      var rect = section.getBoundingClientRect();
      if (rect.top <= mid && rect.bottom > mid) currentId = section.id;
    });

    navLinks.forEach(function (link) {
      link.classList.toggle('is-active', link.getAttribute('href') === '#' + currentId);
    });

    ticking = false;
  }

  function requestScrollUI() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateScrollUI);
  }

  window.addEventListener('scroll', requestScrollUI, { passive: true });
  window.addEventListener('resize', requestScrollUI);
  updateScrollUI();

  /* ---------- lightbox ---------- */

  var figures = Array.prototype.slice.call(doc.querySelectorAll('.ph'));
  var lb = doc.getElementById('lightbox');
  var lbImg = doc.getElementById('lbImg');
  var lbCount = doc.getElementById('lbCount');
  var lbCap = doc.getElementById('lbCap');
  var lbClose = doc.getElementById('lbClose');
  var lbPrev = doc.getElementById('lbPrev');
  var lbNext = doc.getElementById('lbNext');

  if (!figures.length || !lb || !lbImg || !lbCount || !lbCap || !lbClose || !lbPrev || !lbNext) {
    return;
  }

  var current = 0;
  var lastTrigger = null;
  var imageRequest = 0;

  function pad(n) {
    return n < 10 ? '0' + n : String(n);
  }

  function dataFor(figure) {
    var img = figure.querySelector('img');
    var cap = figure.querySelector('.ph__cap');
    var category = cap ? cap.querySelector('span') : null;
    var title = cap ? cap.querySelector('b') : null;
    var caption = [
      category ? category.textContent.trim() : '',
      title ? title.textContent.trim() : ''
    ].filter(Boolean).join(' · ');

    return {
      src: img ? img.getAttribute('src') : '',
      alt: img ? img.getAttribute('alt') : '',
      caption: caption || (img ? img.getAttribute('alt') : '')
    };
  }

  function largeSrc(src) {
    return src
      .replace(/([?&])w=\d+/, '$1w=2200')
      .replace(/([?&])q=\d+/, '$1q=85');
  }

  function show(index) {
    current = (index + figures.length) % figures.length;
    var data = dataFor(figures[current]);

    lbImg.src = data.src;
    lbImg.alt = data.alt;
    lbCount.textContent = pad(current + 1) + ' / ' + pad(figures.length);
    lbCap.textContent = data.caption;

    var request = ++imageRequest;
    var large = largeSrc(data.src);

    if (large && large !== data.src) {
      var preload = new Image();
      preload.onload = function () {
        if (request === imageRequest && lbOpen) {
          lbImg.src = large;
        }
      };
      preload.src = large;
    }
  }

  function open(index, trigger) {
    lastTrigger = trigger || figures[index].querySelector('.ph__btn');
    lbOpen = true;
    lb.classList.add('is-open');
    lb.setAttribute('aria-hidden', 'false');
    syncLock();
    show(index);

    /* počkáme, kým sa dialog zobrazí, aby focus neostal na mriežke */
    window.setTimeout(function () {
      lbClose.focus();
    }, 50);
  }

  function close() {
    if (!lbOpen) return;

    lbOpen = false;
    imageRequest += 1;
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden', 'true');
    syncLock();

    if (lastTrigger && typeof lastTrigger.focus === 'function') {
      lastTrigger.focus();
    }
  }

  figures.forEach(function (figure, index) {
    var trigger = figure.querySelector('.ph__btn');
    if (!trigger) return;

    trigger.addEventListener('click', function () {
      open(index, trigger);
    });
  });

  lbClose.addEventListener('click', close);

  lbPrev.addEventListener('click', function () {
    if (lbOpen) show(current - 1);
  });

  lbNext.addEventListener('click', function () {
    if (lbOpen) show(current + 1);
  });

  lb.addEventListener('click', function (event) {
    if (event.target === lb) close();
  });

  doc.addEventListener('keydown', function (event) {
    if (lbOpen) {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        show(current + 1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        show(current - 1);
      } else if (event.key === 'Tab') {
        var first = lbClose;
        var last = lbNext;

        if (event.shiftKey && doc.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && doc.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
      return;
    }

    if (menuOpen && event.key === 'Escape') {
      event.preventDefault();
      setMenu(false);
      return;
    }

    if (menuOpen && event.key === 'Tab') {
      var menuItems = [brand].concat(navLinks, [burger]).filter(Boolean);
      var firstItem = menuItems[0];
      var lastItem = menuItems[menuItems.length - 1];

      if (event.shiftKey && doc.activeElement === firstItem) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && doc.activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    }
  });

  /* ===== Rezervačný formulár — konfigurácia z inline scriptu ===== */
  var form = doc.getElementById('bookingForm');
  if (form) {
    var dateInput = doc.getElementById('booking-date');
    var timeInput = doc.getElementById('booking-time');
    var durationInput = doc.getElementById('booking-duration');
    var typeInput = doc.getElementById('booking-type');
    var config = window.BOOKING_CONFIG || {
      booking: { minDuration: 2, maxDuration: 4, defaultDuration: 3, minNoticeHours: 48, maxHorizonDays: 60 },
      availability: { weekday: { enabled: true, start: '15:00', end: '19:00', slotMinutes: 30 }, weekend: { enabled: true, start: '09:00', end: '19:00', slotMinutes: 30 } },
      services: [{id:'auto',label:'Fotenie auta'},{id:'motorsport',label:'Motorsport'}]
    };

    function pad2(n) { return String(n).padStart(2, '0'); }

    function addDays(date, days) {
      var d = new Date(date);
      d.setDate(d.getDate() + days);
      return d;
    }

    function formatDate(d) {
      return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
    }

    function isWeekend(date) {
      var day = date.getDay();
      return day === 0 || day === 6;
    }

    function getSlotMinutes(dayType) {
      return config?.availability?.[dayType]?.slotMinutes || 30;
    }

    function getTimeRange(dayType) {
      var avail = config?.availability?.[dayType];
      if (!avail || !avail.enabled) return null;
      return { start: avail.start, end: avail.end };
    }

    function generateTimeSlots(start, end, slotMinutes) {
      var slots = [];
      var parts = start.split(':');
      var h = parseInt(parts[0], 10);
      var m = parseInt(parts[1], 10);
      var endParts = end.split(':');
      var endH = parseInt(endParts[0], 10);
      var endM = parseInt(endParts[1], 10);
      var endTotal = endH * 60 + endM;
      while (h * 60 + m <= endTotal) {
        slots.push(pad2(h) + ':' + pad2(m));
        m += slotMinutes;
        if (m >= 60) { h += Math.floor(m / 60); m = m % 60; }
      }
      return slots;
    }

    function updateTimeSelect() {
      if (!dateInput || !timeInput) return;
      var selected = dateInput.value ? new Date(dateInput.value + 'T00:00:00') : null;
      if (!selected) { timeInput.innerHTML = '<option value="">Vyber dátum</option>'; return; }
      var weekend = isWeekend(selected);
      var dayType = weekend ? 'weekend' : 'weekday';
      var range = getTimeRange(dayType);
      var slotMin = getSlotMinutes(dayType);
      if (!range) { timeInput.innerHTML = '<option value="">Nedostupné</option>'; return; }
      // max start time = end - minDuration * 60
      var minDur = config?.booking?.minDuration || 2;
      var endTotal = parseInt(range.end.split(':')[0], 10) * 60 + parseInt(range.end.split(':')[1], 10);
      var maxStartTotal = endTotal - minDur * 60;
      var startParts = range.start.split(':');
      var h = parseInt(startParts[0], 10);
      var m = parseInt(startParts[1], 10);
      var slots = [];
      while (h * 60 + m <= maxStartTotal) {
        slots.push(pad2(h) + ':' + pad2(m));
        m += slotMin;
        if (m >= 60) { h += Math.floor(m / 60); m = m % 60; }
      }
      var currentVal = timeInput.value;
      timeInput.innerHTML = '<option value="">Vyber čas</option>' + slots.map(function(s) {
        return '<option value="' + s + '"' + (s === currentVal ? ' selected' : '') + '>' + s + '</option>';
      }).join('');
    }

    function updateDurationOptions() {
      if (!durationInput || !config) return;
      var minD = config.booking.minDuration || 2;
      var maxD = config.booking.maxDuration || 4;
      var defD = config.booking.defaultDuration || 3;
      var html = '';
      for (var d = minD; d <= maxD; d++) {
        html += '<option value="' + d + '"' + (d === defD ? ' selected' : '') + '>' + d + ' hodin' + (d > 2 ? 'y' : 'a') + '</option>';
      }
      durationInput.innerHTML = html;
    }

    function updateTypeOptions() {
      if (!typeInput || !config) return;
      var html = '';
      (config.services || []).forEach(function(s) {
        html += '<option value="' + s.id + '">' + s.label + '</option>';
      });
      typeInput.innerHTML = html;
    }

    function updateDateSelect() {
      if (!dateInput) return;
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      var minDate = addDays(today, Math.ceil((config.booking.minNoticeHours || 48) / 24));
      var maxDate = addDays(today, config.booking.maxHorizonDays || 60);

      var currentVal = dateInput.value;
      var html = '<option value="">Vyber dátum</option>';
      var d = new Date(minDate);
      while (d <= maxDate) {
        var weekend = isWeekend(d);
        var dayType = weekend ? 'weekend' : 'weekday';
        var range = getTimeRange(dayType);
        if (range) {
          var val = formatDate(d);
          html += '<option value="' + val + '"' + (val === currentVal ? ' selected' : '') + '>' + val + '</option>';
        }
        d = addDays(d, 1);
      }
      dateInput.innerHTML = html;
    }

    function initForm() {
      // Set date input min/max
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      var minDate = addDays(today, Math.ceil((config.booking.minNoticeHours || 48) / 24));
      var maxDate = addDays(today, config.booking.maxHorizonDays || 60);
      if (dateInput) {
        dateInput.min = formatDate(minDate);
        dateInput.max = formatDate(maxDate);
      }
      updateTimeSelect();
      updateDurationOptions();
      updateTypeOptions();

      if (dateInput) {
        dateInput.addEventListener('change', function() {
          updateTimeSelect();
        });
      }
    }

    initForm();

    form.addEventListener('submit', function (e) {
      var fd = new FormData(form);
      var data = {};
      fd.forEach(function (v, k) { data[k] = v; });

      // validation: duration
      if (parseInt(data.duration, 10) < (config?.booking?.minDuration || 2)) {
        e.preventDefault();
        alert('Minimálna dĺžka fotenia je ' + (config?.booking?.minDuration || 2) + ' hodiny.');
        return;
      }

      // validation: date within range
      var selectedDate = data.date ? new Date(data.date + 'T00:00:00') : null;
      var today = new Date(); today.setHours(0,0,0,0);
      var minDate = addDays(today, Math.ceil((config?.booking?.minNoticeHours || 48) / 24));
      var maxDate = addDays(today, config?.booking?.maxHorizonDays || 60);
      if (!selectedDate || selectedDate < minDate || selectedDate > maxDate) {
        e.preventDefault();
        alert('Dátum musí byť aspoň ' + (config?.booking?.minNoticeHours || 48) + ' hodín vopred a max. ' + (config?.booking?.maxHorizonDays || 60) + ' dní vpred.');
        return;
      }

      // validation: time matches availability
      if (selectedDate && timeInput && data.time) {
        var weekend = isWeekend(selectedDate);
        var dayType = weekend ? 'weekend' : 'weekday';
        var range = getTimeRange(dayType);
        if (!range) { e.preventDefault(); alert('Tento deň nie je dostupný na rezerváciu.'); return; }
        var minAllowed = range.start;
        var maxStartTotal = parseInt(range.end.split(':')[0],10)*60 + parseInt(range.end.split(':')[1],10) - (config?.booking?.minDuration||2)*60;
        var maxAllowedH = Math.floor(maxStartTotal/60);
        var maxAllowedM = maxStartTotal%60;
        var maxAllowed = pad2(maxAllowedH) + ':' + pad2(maxAllowedM);
        if (data.time < minAllowed || data.time > maxAllowed) {
          e.preventDefault();
          alert('Čas mimo dostupnosti: ' + (weekend ? 'víkend ' + range.start + '–' + maxAllowed : 'pracovný deň ' + range.start + '–' + maxAllowed));
          return;
        }
      }
      // If validation passes, form submits normally to FormSubmit
    });
  }

})();
