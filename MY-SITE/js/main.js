/* ============================================================
   MY SITE — MAIN
   Loader, Header, Mobile Menu, Scroll Progress, Back-to-Top, Toast
   ============================================================ */

(function () {
  'use strict';

  /* ---------- 1. LOADER ---------- */
  function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
        setTimeout(() => loader.remove(), 600);
      }, 400);
    });

    // Safety fallback: hide after 3s regardless
    setTimeout(() => {
      if (loader && !loader.classList.contains('hidden')) {
        loader.classList.add('hidden');
      }
    }, 3000);
  }

  /* ---------- 2. HEADER SCROLL STATE ---------- */
  function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;

    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 3. MOBILE MENU ---------- */
  function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    if (!hamburger || !mobileMenu) return;

    const links = mobileMenu.querySelectorAll('a');

    function openMenu() {
      hamburger.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
      mobileMenu.classList.add('open');
      mobileMenu.setAttribute('aria-hidden', 'false');
      document.body.classList.add('no-scroll');
    }

    function closeMenu() {
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('no-scroll');
    }

    function toggleMenu() {
      if (mobileMenu.classList.contains('open')) closeMenu();
      else openMenu();
    }

    hamburger.addEventListener('click', toggleMenu);

    // Close on link click
    links.forEach((link) => link.addEventListener('click', closeMenu));

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        closeMenu();
        hamburger.focus();
      }
    });

    // Close on resize to desktop
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth > 1024 && mobileMenu.classList.contains('open')) {
          closeMenu();
        }
      }, 150);
    });
  }

  /* ---------- 4. ACTIVE NAV LINK ---------- */
  function initActiveLink() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    const allLinks = document.querySelectorAll('.nav__link, .mobile-menu__link');

    allLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;

      const isActive =
        href === path ||
        (path === 'index.html' && href === 'index.html') ||
        (path === '' && href === 'index.html');

      if (isActive) link.classList.add('active');
      else link.classList.remove('active');
    });
  }

  /* ---------- 5. SCROLL PROGRESS ---------- */
  function initScrollProgress() {
    const progress = document.getElementById('scrollProgress');
    if (!progress) return;

    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progress.style.width = percent + '%';
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 6. BACK TO TOP ---------- */
  function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    const onScroll = () => {
      btn.classList.toggle('visible', window.scrollY > 500);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- 7. FOOTER YEAR ---------- */
  function initYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  /* ---------- 8. TOAST NOTIFICATIONS (global) ---------- */
  window.showToast = function (title, message, type = 'info', duration = 4000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;

    const icons = {
      success: '✓',
      error: '✕',
      info: 'i',
    };

    toast.innerHTML = `
      <div class="toast__icon">${icons[type] || 'i'}</div>
      <div class="toast__content">
        <div class="toast__title">${title}</div>
        ${message ? `<div class="toast__msg">${message}</div>` : ''}
      </div>
      <button class="toast__close" aria-label="Yopish">&times;</button>
    `;

    container.appendChild(toast);

    // Show animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => toast.classList.add('show'));
    });

    // Auto dismiss
    const timer = setTimeout(() => dismissToast(toast), duration);

    // Manual close
    const closeBtn = toast.querySelector('.toast__close');
    closeBtn.addEventListener('click', () => {
      clearTimeout(timer);
      dismissToast(toast);
    });

    function dismissToast(el) {
      el.classList.remove('show');
      setTimeout(() => el.remove(), 400);
    }
  };

  /* ---------- 9. SMOOTH ANCHOR LINKS ---------- */
  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      const href = link.getAttribute('href');
      if (href === '#' || href.length < 2) return;

      link.addEventListener('click', (e) => {
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();

        const headerH = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--header-h')
        ) || 80;

        const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  /* ---------- 10. LAZY IMAGE FALLBACK ---------- */
  function initImageFallback() {
    document.querySelectorAll('img').forEach((img) => {
      img.addEventListener('error', function () {
        // Replace broken image with gradient placeholder
        this.style.background = 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)';
        this.style.objectFit = 'cover';
        this.alt = this.alt || 'Rasm mavjud emas';
      });
    });
  }

  /* ---------- 11. INIT ALL ---------- */
  function init() {
    initLoader();
    initHeaderScroll();
    initMobileMenu();
    initActiveLink();
    initScrollProgress();
    initBackToTop();
    initYear();
    initSmoothAnchors();
    initImageFallback();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();