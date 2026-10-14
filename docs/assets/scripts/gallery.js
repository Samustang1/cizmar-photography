/* ============================================================
   gallery.js — filter portfólia + lightbox
   Cizmar Photography · ukážkový skript
   ============================================================ */
(function () {
  'use strict';

  const filtre = document.querySelectorAll('.filter');
  const karty = document.querySelectorAll('.card');

  // Filtrovanie podľa kategórie
  filtre.forEach((tlacidlo) => {
    tlacidlo.addEventListener('click', () => {
      const hodnota = tlacidlo.dataset.filter;

      filtre.forEach((b) => b.classList.remove('is-active'));
      tlacidlo.classList.add('is-active');

      karty.forEach((karta) => {
        const zobraz =
          hodnota === 'all' || karta.dataset.category === hodnota;
        karta.classList.toggle('is-hidden', !zobraz);
      });
    });
  });

  // Jednoduchý lightbox (klik na kartu otvorí veľkú fotku)
  const overlay = document.createElement('div');
  overlay.className = 'lb';
  overlay.innerHTML = '<img alt="">';
  document.body.appendChild(overlay);

  const bigImg = overlay.querySelector('img');

  karty.forEach((karta) => {
    karta.addEventListener('click', () => {
      const img = karta.querySelector('img');
      if (!img) return;
      bigImg.src = img.currentSrc || img.src;
      overlay.classList.add('is-open');
    });
  });

  overlay.addEventListener('click', () => overlay.classList.remove('is-open'));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') overlay.classList.remove('is-open');
  });

  // Načítanie galérie z API
  async function nacitajGaleriu(url) {
    const odpoved = await fetch(url);
    if (!odpoved.ok) throw new Error(`Chyba: ${odpoved.status}`);
    return odpoved.json();
  }

  window.nacitajGaleriu = nacitajGaleriu;
})();
