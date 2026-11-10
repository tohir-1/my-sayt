/* ============================================================
   MY SITE — PROJECTS
   Data, Filter, Search, Modal
   ============================================================ */

(function () {
  'use strict';

  /* ---------- 1. PROJECT DATA ---------- */
  // Rasm o'rniga "gradient" ishlatamiz, shunda rasmlar yuklanmasa ham sayt chiroyli turadi
  const PROJECTS = [
    {
      id: 1,
      name: 'Tohir Tarilov Portfolio',
      category: 'htmlcss',
      gradient: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
      description: 'Zamonaviy shaxsiy portfolio sayt. Dark/Light rejim, animatsiyalar, responsiv dizayn va toza kod.',
      longDescription: 'Tohir Tarilov Portfolio — bu to\'liq funksional shaxsiy portfolio veb-sayti. HTML5, CSS3 va Vanilla JavaScript yordamida yaratilgan. Dark/Light rejim, LocalStorage, scroll animatsiyalar, mobil menyu, loyihalar filtri va modal oynalar mavjud.',
      tech: ['HTML5', 'CSS3', 'JavaScript'],
      demo: 'https://example.com',
      github: 'https://github.com',
    },
    {
      id: 2,
      name: 'EduZone',
      category: 'webapp',
      gradient: 'linear-gradient(135deg, #10B981, #3B82F6)',
      description: 'Onlayn ta\'lim platformasi. Kurslar, video darslar va foydalanuvchi profili.',
      longDescription: 'EduZone — onlayn ta\'lim platformasi bo\'lib, unda foydalanuvchilar kurslarga yozilishi, video darslarni ko\'rishi va o\'z progressini kuzatishi mumkin.',
      tech: ['HTML', 'CSS', 'JavaScript', 'LocalStorage'],
      demo: 'https://example.com',
      github: 'https://github.com',
    },
    {
      id: 3,
      name: 'AVTOBOZOR',
      category: 'webapp',
      gradient: 'linear-gradient(135deg, #F59E0B, #EF4444)',
      description: 'Avtomobillar savdosi uchun onlayn platforma. Filtr va qidiruv tizimi.',
      longDescription: 'AVTOBOZOR — avtomobillar savdosi uchun onlayn platforma. Kengaytirilgan filtr, qidiruv, sevimlilar ro\'yxati va batafsil ma\'lumot sahifalari.',
      tech: ['HTML', 'CSS', 'JavaScript'],
      demo: 'https://example.com',
      github: 'https://github.com',
    },
    {
      id: 4,
      name: 'PulNazorat',
      category: 'webapp',
      gradient: 'linear-gradient(135deg, #22C55E, #10B981)',
      description: 'Shaxsiy moliyaviy boshqaruv ilovasi. Daromad va xarajatlar statistikasi.',
      longDescription: 'PulNazorat — shaxsiy moliyaviy boshqaruv ilovasi. Daromad va xarajatlarni kuzatish, kategoriyalar bo\'yicha statistika, diagrammalar va oylik hisobotlar.',
      tech: ['HTML', 'CSS', 'JavaScript', 'Chart.js'],
      demo: 'https://example.com',
      github: 'https://github.com',
    },
    {
      id: 5,
      name: 'CodeMaster',
      category: 'javascript',
      gradient: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
      description: 'Dasturlashni o\'rganish uchun interaktiv platforma. Testlar va mashqlar.',
      longDescription: 'CodeMaster — dasturlashni o\'rganuvchilar uchun interaktiv platforma. Kod yozish mashqlari, testlar, natijalar va reyting tizimi.',
      tech: ['HTML', 'CSS', 'JavaScript'],
      demo: 'https://example.com',
      github: 'https://github.com',
    },
    {
      id: 6,
      name: 'LogoMaker',
      category: 'ui',
      gradient: 'linear-gradient(135deg, #EC4899, #8B5CF6)',
      description: 'Logo yaratish vositasi. Turli shakllar, ranglar va shriftlar.',
      longDescription: 'LogoMaker — oddiy va qulay logo yaratish vositasi. Turli shakllar, ranglar, shriftlar va eksport imkoniyatlari.',
      tech: ['HTML', 'CSS', 'JavaScript', 'Canvas'],
      demo: 'https://example.com',
      github: 'https://github.com',
    },
    {
      id: 7,
      name: 'Music Finder',
      category: 'javascript',
      gradient: 'linear-gradient(135deg, #06B6D4, #3B82F6)',
      description: 'Musiqa qidirish va tinglash ilovasi. API integratsiyasi bilan.',
      longDescription: 'Music Finder — musiqa qidirish va tinglash ilovasi. Tashqi API orqali qo\'shiqlarni qidirish, pleylistlar yaratish va sevimlilarni saqlash.',
      tech: ['HTML', 'CSS', 'JavaScript', 'API'],
      demo: 'https://example.com',
      github: 'https://github.com',
    },
    {
      id: 8,
      name: 'Dashboard UI',
      category: 'ui',
      gradient: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
      description: 'Zamonaviy admin panel interfeysi. Grafikalar va statistikalar.',
      longDescription: 'Dashboard UI — zamonaviy admin panel interfeysi. Grafikalar, statistikalar, jadvallar va foydalanuvchi boshqaruvi. Glassmorphism va gradient effektlar bilan.',
      tech: ['HTML', 'CSS', 'JavaScript'],
      demo: 'https://example.com',
      github: 'https://github.com',
    },
    {
      id: 9,
      name: 'Weather App',
      category: 'javascript',
      gradient: 'linear-gradient(135deg, #0EA5E9, #22C55E)',
      description: 'Ob-havo ma\'lumotlarini ko\'rsatuvchi ilova. Real vaqt ma\'lumotlari.',
      longDescription: 'Weather App — ob-havo ma\'lumotlarini ko\'rsatuvchi ilova. OpenWeatherMap API orqali real vaqt ma\'lumotlari, shahar bo\'yicha qidiruv va 5 kunlik prognoz.',
      tech: ['HTML', 'CSS', 'JavaScript', 'API'],
      demo: 'https://example.com',
      github: 'https://github.com',
    },
  ];

  let currentFilter = 'all';
  let currentSearch = '';
  let currentProject = null;

  const grid = document.getElementById('projectsGrid');
  const filterTabs = document.getElementById('filterTabs');
  const searchInput = document.getElementById('projectSearch');
  const emptyState = document.getElementById('emptyState');
  const countEl = document.getElementById('projectsCount');
  const modal = document.getElementById('projectModal');

  if (!grid) return;

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function getFilteredProjects() {
    return PROJECTS.filter((p) => {
      const matchCategory = currentFilter === 'all' || p.category === currentFilter;
      const search = currentSearch.toLowerCase().trim();
      const matchSearch = !search || p.name.toLowerCase().includes(search) || p.description.toLowerCase().includes(search) || p.tech.some((t) => t.toLowerCase().includes(search));
      return matchCategory && matchSearch;
    });
  }

  function renderProjects() {
    const filtered = getFilteredProjects();

    if (countEl) countEl.textContent = filtered.length;

    if (filtered.length === 0) {
      grid.innerHTML = '';
      if (emptyState) emptyState.hidden = false;
      return;
    }

    if (emptyState) emptyState.hidden = true;

    grid.innerHTML = filtered.map((p) => `
      <article class="project-card reveal" data-id="${p.id}">
        <!-- Rasm o'rniga gradient va loyiha nomi -->
        <div class="project-card__img" style="background: ${p.gradient}; display: flex; align-items: center; justify-content: center;">
          <span style="color: white; font-size: 1.4rem; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2); text-align: center; padding: 0 20px;">
            ${escapeHtml(p.name)}
          </span>
        </div>
        <div class="project-card__body">
          <h3 class="project-card__title">${escapeHtml(p.name)}</h3>
          <p class="project-card__desc">${escapeHtml(p.description)}</p>
          <div class="project-card__tags">
            ${p.tech.map((t) => `<span>${escapeHtml(t)}</span>`).join('')}
          </div>
          <div class="project-card__links">
            <a href="${escapeHtml(p.demo)}" target="_blank" rel="noopener" class="btn btn--sm btn--primary">Ko'rish</a>
            <a href="${escapeHtml(p.github)}" target="_blank" rel="noopener" class="btn btn--sm btn--outline">GitHub</a>
            <button class="btn btn--sm btn--outline" data-details="${p.id}">Batafsil</button>
          </div>
        </div>
      </article>
    `).join('');

    requestAnimationFrame(() => {
      grid.querySelectorAll('.reveal').forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 60);
      });
    });

    grid.querySelectorAll('[data-details]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.details, 10);
        openModal(id);
      });
    });
  }

  function initFilter() {
    if (!filterTabs) return;
    filterTabs.addEventListener('click', (e) => {
      const tab = e.target.closest('.filter-tab');
      if (!tab) return;
      filterTabs.querySelectorAll('.filter-tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.dataset.filter || 'all';
      renderProjects();
    });
  }

  function initSearch() {
    if (!searchInput) return;
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        currentSearch = e.target.value;
        renderProjects();
      }, 200);
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchInput.value = '';
        currentSearch = '';
        renderProjects();
      }
    });
  }

  function openModal(id) {
    if (!modal) return;
    const project = PROJECTS.find((p) => p.id === id);
    if (!project) return;

    currentProject = project;

    const img = document.getElementById('modalImg');
    const title = document.getElementById('modalTitle');
    const desc = document.getElementById('modalDesc');
    const tags = document.getElementById('modalTags');
    const demo = document.getElementById('modalDemo');
    const github = document.getElementById('modalGithub');

    // Modalda ham rasm o'rniga gradient
    if (img) {
      img.style.display = 'none'; // Rasmni yashirish
      // Modal sarlavhasi qismiga gradient qo'shish
      const modalImgWrap = document.querySelector('.modal__img');
      if (modalImgWrap) {
         modalImgWrap.style.background = project.gradient;
         modalImgWrap.style.display = 'flex';
         modalImgWrap.style.alignItems = 'center';
         modalImgWrap.style.justifyContent = 'center';
         modalImgWrap.innerHTML = `<span style="color: white; font-size: 2rem; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">${escapeHtml(project.name)}</span>`;
      }
    }
    
    if (title) title.textContent = project.name;
    if (desc) desc.textContent = project.longDescription || project.description;
    if (tags) tags.innerHTML = project.tech.map((t) => `<span>${escapeHtml(t)}</span>`).join('');
    if (demo) demo.href = project.demo;
    if (github) github.href = project.github;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');

    const closeBtn = modal.querySelector('.modal__close');
    if (closeBtn) setTimeout(() => closeBtn.focus(), 100);
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    currentProject = null;

    // Modalni yopganda rasm joyini tozalash (keyingi ochilishga tayyorlash)
    const modalImgWrap = document.querySelector('.modal__img');
    if (modalImgWrap) {
        modalImgWrap.innerHTML = '<img src="" alt="" id="modalImg" />'; // Asl holatiga qaytarish
        modalImgWrap.style.background = 'var(--bg-primary)';
    }
  }

  function initModal() {
    if (!modal) return;
    modal.querySelectorAll('[data-close-modal]').forEach((el) => {
      el.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeModal();
      }
    });

    modal.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const focusable = modal.querySelectorAll('a[href], button, textarea, input, select');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  function init() {
    renderProjects();
    initFilter();
    initSearch();
    initModal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();