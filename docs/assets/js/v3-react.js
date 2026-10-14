/* ============================================================
   Cizmar Photography — React demo (živý komponent)
   Malý interaktívny komponent: prepínanie farebného filtra
   na fotke auta. Používa React 18 (UMD) bez buildu.
   ============================================================ */
(function () {
  'use strict';

  var mount = document.getElementById('reactDemo');
  if (!mount || !window.React || !window.ReactDOM) return;

  var h = React.createElement;
  var useState = React.useState;

  var FILTRE = [
    { id: 'prirodzena', label: 'Prirodzená', css: 'none' },
    { id: 'tepla', label: 'Teplá', css: 'sepia(.22) saturate(1.15) contrast(1.02)' },
    { id: 'studena', label: 'Studená', css: 'saturate(1.05) hue-rotate(-14deg) brightness(1.03)' },
    { id: 'cb', label: 'Čiernobiela', css: 'grayscale(1) contrast(1.12)' },
    { id: 'vivid', label: 'Živá', css: 'saturate(1.55) contrast(1.06)' }
  ];

  function Demo() {
    var state = useState(FILTRE[0]);
    var aktivny = state[0];
    var setAktivny = state[1];

    return h('div', { className: 'rdemo' },
      h('figure', { className: 'rdemo__media' },
        h('img', {
          src: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80',
          alt: 'Ukážka farebného filtra na aute',
          loading: 'lazy',
          style: { filter: aktivny.css },
          onError: function (e) {
            e.target.onerror = null;
            e.target.src = 'https://picsum.photos/seed/auto-hero/1000/625';
          }
        })
      ),
      h('div', { className: 'rdemo__bar' },
        h('span', { className: 'rdemo__label' }, 'Filter: ', h('b', null, aktivny.label)),
        h('div', { className: 'rdemo__btns' },
          FILTRE.map(function (f) {
            return h('button', {
              key: f.id,
              type: 'button',
              className: 'rdemo__btn' + (f.id === aktivny.id ? ' is-active' : ''),
              onClick: function () { setAktivny(f); }
            }, f.label);
          })
        )
      )
    );
  }

  try {
    if (typeof ReactDOM.createRoot === 'function') {
      ReactDOM.createRoot(mount).render(h(Demo));
    } else {
      ReactDOM.render(h(Demo), mount);
    }
  } catch (e) {
    mount.textContent = '';
  }
})();
