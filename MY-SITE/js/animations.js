/* ============================================================
   MY SITE — ANIMATIONS
   Scroll Reveal, Typing, Counter, Skill Bars
   ============================================================ */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. SCROLL REVEAL ---------- */
  function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    // If reduced motion or no IntersectionObserver → show all
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      elements.forEach((el) => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    elements.forEach((el) => observer.observe(el));
  }

  /* ---------- 2. TYPING EFFECT ---------- */
  function initTyping() {
    const el = document.getElementById('typingText');
    if (!el) return;

    const phrases = [
      'Frontend Developer',
      'UI/UX Designer',
      'Web Animator',
      'Creative Coder',
    ];

    if (prefersReducedMotion) {
      el.textContent = phrases[0];
      return;
    }

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeoutId;

    function type() {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        el.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
      } else {
        el.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
      }

      let delay = isDeleting ? 50 : 100;

      if (!isDeleting && charIndex === currentPhrase.length) {
        delay = 1800;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 400;
      }

      timeoutId = setTimeout(type, delay);
    }

    type();

    // Cleanup on unload
    window.addEventListener('beforeunload', () => clearTimeout(timeoutId));
  }

  /* ---------- 3. COUNTER ANIMATION ---------- */
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      counters.forEach((el) => {
        const target = parseInt(el.dataset.count, 10) || 0;
        const suffix = el.dataset.suffix || '';
        el.textContent = target + suffix;
      });
      return;
    }

    const animate = (el) => {
      const target = parseInt(el.dataset.count, 10) || 0;
      const suffix = el.dataset.suffix || '';
      const duration = 1800;
      const start = performance.now();

      function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target * eased);

        el.textContent = value + suffix;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target + suffix;
        }
      }

      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    counters.forEach((el) => observer.observe(el));
  }

  /* ---------- 4. SKILL BARS ---------- */
  function initSkillBars() {
    const bars = document.querySelectorAll('.skill-bar');
    if (!bars.length) return;

    function fillBar(bar) {
      const percent = parseInt(bar.dataset.percent, 10) || 0;
      const fill = bar.querySelector('.skill-bar__fill');
      const label = bar.querySelector('.skill-bar__percent');
      if (!fill) return;

      fill.style.width = percent + '%';

      if (label) {
        // Animate percentage counter
        const duration = 1400;
        const start = performance.now();

        function step(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          label.textContent = Math.round(percent * eased) + '%';

          if (progress < 1) requestAnimationFrame(step);
          else label.textContent = percent + '%';
        }
        requestAnimationFrame(step);
      }
    }

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      bars.forEach(fillBar);
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            fillBar(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    bars.forEach((bar) => observer.observe(bar));
  }

  /* ---------- 5. HERO PARALLAX (subtle) ---------- */
  function initParallax() {
    if (prefersReducedMotion) return;

    const glows = document.querySelectorAll('.hero__glow');
    if (!glows.length || window.innerWidth < 1024) return;

    let ticking = false;

    window.addEventListener(
      'scroll',
      () => {
        if (ticking) return;
        ticking = true;

        requestAnimationFrame(() => {
          const y = window.scrollY;
          glows.forEach((glow, i) => {
            const speed = i === 0 ? 0.15 : 0.08;
            glow.style.transform = `translateY(${y * speed}px)`;
          });
          ticking = false;
        });
      },
      { passive: true }
    );
  }

  /* ---------- 6. RIPPLE ON BUTTONS ---------- */
  function initButtonRipple() {
    if (prefersReducedMotion) return;

    document.querySelectorAll('.btn').forEach((btn) => {
      btn.addEventListener('click', function (e) {
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        const ripple = document.createElement('span');
        ripple.style.cssText = `
          position: absolute;
          left: ${x}px;
          top: ${y}px;
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background: rgba(255,255,255,0.5);
          transform: scale(0);
          animation: rippleAnim 0.6s ease-out;
          pointer-events: none;
          z-index: 0;
        `;

        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });

    // Inject keyframes once
    if (!document.getElementById('rippleKeyframes')) {
      const style = document.createElement('style');
      style.id = 'rippleKeyframes';
      style.textContent = `
        @keyframes rippleAnim {
          to { transform: scale(2.5); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  /* ---------- 7. INIT ALL ---------- */
  function init() {
    initScrollReveal();
    initTyping();
    initCounters();
    initSkillBars();
    initParallax();
    initButtonRipple();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();