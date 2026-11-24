(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Mobile menu */
  var toggle = document.getElementById('menu-toggle');
  var menu = document.getElementById('mobile-menu');

  function setMenu(open) {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.classList.toggle('hidden', !open);
    var iconOpen = toggle.querySelector('[data-icon="open"]');
    var iconClose = toggle.querySelector('[data-icon="close"]');
    if (iconOpen && iconClose) {
      iconOpen.classList.toggle('hidden', open);
      iconClose.classList.toggle('hidden', !open);
    }
  }

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        toggle.focus();
      }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 768) setMenu(false);
    });
  }

  /* Smooth scroll for in-page links */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      setMenu(false);
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      if (history.pushState) history.pushState(null, '', id);
    });
  });

  /* Legal dialogs (Privacy Policy, Terms of Service) */
  var lastTrigger = null;

  document.querySelectorAll('[data-open-dialog]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var dialog = document.getElementById(btn.getAttribute('data-open-dialog'));
      if (!dialog) return;
      lastTrigger = btn;
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }
      document.body.classList.add('modal-open');
    });
  });

  document.querySelectorAll('dialog.legal').forEach(function (dialog) {
    dialog.querySelectorAll('[data-close-dialog]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (typeof dialog.close === 'function') {
          dialog.close();
        } else {
          dialog.removeAttribute('open');
          document.body.classList.remove('modal-open');
        }
      });
    });
    // Click on the backdrop closes the dialog
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog && typeof dialog.close === 'function') dialog.close();
    });
    // Esc closes natively; tidy up afterwards
    dialog.addEventListener('close', function () {
      document.body.classList.remove('modal-open');
      if (lastTrigger) lastTrigger.focus();
    });
  });

  /* Current year in footer */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
