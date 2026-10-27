/* ============================================================
   Cal.com – inline embed rezervačného kalendára
   Načíta sa až keď sa používateľ priblíži k sekcii Kontakt.
   ============================================================ */
(function () {
  'use strict';

  var mount = document.getElementById('calInline');
  if (!mount) return;

  var CAL_LINK = 'cizmar.photo/automobilove-fotenie';
  var started = false;

  function initEmbed() {
    if (started) return;
    started = true;

    /* oficiálny Cal.com bootstrap */
    (function (C, A, L) {
      var p = function (a, ar) { a.q.push(ar); };
      var d = C.document;

      C.Cal = C.Cal || function () {
        var cal = C.Cal;
        var ar = arguments;

        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          d.head.appendChild(d.createElement('script')).src = A;
          cal.loaded = true;
        }

        if (ar[0] === L) {
          var api = function () { p(api, arguments); };
          var namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === 'string') {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ['initNamespace', namespace]);
          } else {
            p(cal, ar);
          }
          return;
        }

        p(cal, ar);
      };
    })(window, 'https://app.cal.com/embed/embed.js', 'init');

    window.Cal('init', { origin: 'https://cal.com' });

    window.Cal('inline', {
      elementOrSelector: '#calInline',
      calLink: CAL_LINK,
      config: {
        layout: 'month_view',
        theme: 'light'
      }
    });

    window.Cal('ui', {
      cssVarsPerTheme: {
        light: { 'cal-brand': '#e2342b' },
        dark: { 'cal-brand': '#e2342b' }
      },
      hideEventTypeDetails: false,
      layout: 'month_view'
    });

    /* keď sa iframe naozaj vykreslí, schováme loader */
    var tries = 0;
    var timer = setInterval(function () {
      tries += 1;
      if (mount.querySelector('iframe')) {
        clearInterval(timer);
        var loader = mount.querySelector('.cal-inline__loader');
        if (loader) loader.parentNode.removeChild(loader);
        mount.setAttribute('aria-busy', 'false');
      } else if (tries > 60) {
        clearInterval(timer);
        mount.setAttribute('aria-busy', 'false');
      }
    }, 500);
  }

  /* lazy load – 700px pred sekciou */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i += 1) {
        if (entries[i].isIntersecting) {
          io.disconnect();
          initEmbed();
          break;
        }
      }
    }, { rootMargin: '700px 0px' });

    io.observe(mount);
  } else {
    initEmbed();
  }
})();
