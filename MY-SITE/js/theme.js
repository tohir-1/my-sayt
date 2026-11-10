/* ============================================================
   MY SITE — THEME (Dark / Light + LocalStorage)
   ============================================================ */

(function () {
  'use strict';

  const STORAGE_KEY = 'mysite-theme';
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');

  /* ---------- 1. Get initial theme ---------- */
  function getInitialTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;

    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    return prefersLight ? 'light' : 'dark';
  }

  /* ---------- 2. Apply theme ---------- */
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);

    // Update meta theme-color (mobile browser bar)
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', theme === 'dark' ? '#0B0D17' : '#F8FAFC');
    }

    // Dispatch event for other scripts
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
  }

  /* ---------- 3. Toggle theme ---------- */
  function toggleTheme() {
    const current = root.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  }

  /* ---------- 4. Init ---------- */
  function init() {
    // Apply saved / system theme (no flash)
    const initial = getInitialTheme();
    root.setAttribute('data-theme', initial);
    localStorage.setItem(STORAGE_KEY, initial);

    if (toggle) {
      toggle.addEventListener('click', toggleTheme);

      // Keyboard support
      toggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleTheme();
        }
      });
    }

    // Listen to system changes (only if user hasn't chosen)
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(e.matches ? 'light' : 'dark');
      }
    });
  }

  // Run immediately to prevent FOUC (Flash of Unstyled Content)
  // Since this script is loaded after DOM, apply inline:
  (function preventFlash() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      root.setAttribute('data-theme', saved);
    } else {
      const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
      root.setAttribute('data-theme', prefersLight ? 'light' : 'dark');
    }
  })();

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();