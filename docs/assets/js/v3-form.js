/* ============================================================
   Cizmar Photography — V3 · rezervačný formulár
   Rovnaká logika ako na starom webe (FormSubmit AJAX),
   ale napojená na tmavý v3 formulár (#bookingForm).
   ============================================================ */
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  function initForm() {
    var form = document.getElementById('bookingForm');
    if (!form) return;

    var note = document.getElementById('formNote');
    var hint = document.getElementById('formHint');
    var submitBtn = document.getElementById('submitBtn');
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
        var wrap = field.closest('.vfield');
        if (wrap) wrap.classList.toggle('has-error', !!message);
      }
      var slot = form.querySelector('[data-error-for="' + name + '"]');
      if (slot) slot.textContent = message || '';
    };

    var checkField = function (name) {
      var value = valueOf(name);
      if (name === 'name' && value.length < 2) return 'Prosím, vyplň meno.';
      if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Zadaj platný e-mail.';
      if (name === 'message' && value.length < 5) return 'Napíš aspoň krátku správu.';
      if (name === 'gdpr' && !value) return 'Potrebujeme tvoj súhlas.';
      return '';
    };

    var submitBtnEl = form.querySelector('#submitBtn');

    var syncButton = function () {
      var complete = REQUIRED.every(function (n) { return !checkField(n); });
      if (submitBtnEl) submitBtnEl.disabled = !complete;
      var hint = form.querySelector('#formHint');
      if (hint) hint.hidden = complete;
      return complete;
    };

    var showNote = function (text, type) {
      var note = form.querySelector('#formNote');
      if (!note) return;
      note.textContent = text || '';
      note.classList.remove('is-success', 'is-error');
      if (type) note.classList.add('is-' + type);
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var invalid = REQUIRED.filter(function (n) { return checkField(n); });
      REQUIRED.forEach(function (n) { setError(n, checkField(n)); });
      if (invalid.length) { showNote('Skontroluj označené polia.', 'error'); syncButton(); return; }

      var data = new FormData(form);
      var code = data.get('phoneCode') || '';
      var digits = (data.get('phone') || '').replace(/\D/g, '');
      var payload = {
        name: data.get('name') || '',
        email: data.get('email') || '',
        phone: digits ? (code + ' ' + digits) : '',
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

      if (submitBtnEl) submitBtnEl.classList.add('is-loading');
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
        .then(function () { if (submitBtnEl) submitBtnEl.classList.remove('is-loading'); });
    });

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
    Array.prototype.forEach.call(form.querySelectorAll('input, select, textarea'), function (field) {
      field.addEventListener('blur', function () {
        if (!field.name || REQUIRED.indexOf(field.name) === -1) return;
        setError(field.name, checkField(field.name));
      });
    });

    var phoneInput = form.querySelector('[name="phone"]');
    if (phoneInput) {
      phoneInput.addEventListener('input', function () {
        var digits = phoneInput.value.replace(/\D/g, '').slice(0, 15);
        if (digits !== phoneInput.value) phoneInput.value = digits;
      });
    }

    /* Vyber štandardný balík, ak na niekto klikne na kartu/prvok s data-package */
    Array.prototype.forEach.call(document.querySelectorAll('[data-package]'), function (btn) {
      btn.addEventListener('click', function () {
        var val = btn.getAttribute('data-package');
        var select = form.querySelector('#bk-package');
        if (!select) return;
        Array.prototype.forEach.call(select.options, function (o) {
          if (o.value === val) select.value = val;
        });
      });
    });

    syncButton();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForm);
  } else {
    initForm();
  }
})();
