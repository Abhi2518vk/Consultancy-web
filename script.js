document.addEventListener('DOMContentLoaded', () => {

  /* ======= MOBILE MENU TOGGLE ======= */
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
      });
    });
  }

  /* ======= SMOOTH SCROLL FOR NAV ======= */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  /* ======= SERVICE ACCORDION — ONLY ONE AT A TIME ======= */
  const allCards = document.querySelectorAll('.svc-card');
  const allBtns = document.querySelectorAll('.svc-learn-btn');
  const allDetails = document.querySelectorAll('.svc-card-details');

  function closeAllServices() {
    allBtns.forEach(b => b.classList.remove('active'));
    allDetails.forEach(d => d.classList.remove('open'));
    allCards.forEach(c => c.classList.remove('active'));
  }

  allBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const index = btn.getAttribute('data-index');
      const details = document.querySelector('[data-details="' + index + '"]');
      const card = btn.closest('.svc-card');
      const isCurrentlyOpen = btn.classList.contains('active');

      // Always close everything first
      closeAllServices();

      // If it was already open, we just closed it — done
      if (isCurrentlyOpen) return;

      // Otherwise open only this one
      btn.classList.add('active');
      details.classList.add('open');
      card.classList.add('active');
    });
  });

  /* ======= HERO PARTICLES ======= */
  const particleContainer = document.getElementById('hero-particles');
  if (particleContainer) {
    for (let i = 0; i < 25; i++) {
      const p = document.createElement('div');
      p.classList.add('particle');
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDuration = (6 + Math.random() * 10) + 's';
      p.style.animationDelay = Math.random() * 8 + 's';
      const size = (2 + Math.random() * 3) + 'px';
      p.style.width = size;
      p.style.height = size;
      particleContainer.appendChild(p);
    }
  }

  /* ======= SCROLL REVEAL ======= */
  const revealElements = document.querySelectorAll(
    '.mv-card, .value-card, .svc-card, .why-card, .stat-item, .about-intro, .footer-col, .process-step, .industry-card'
  );
  revealElements.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ======= ANIMATED STAT COUNTERS ======= */
  const statNumbers = document.querySelectorAll('.stat-number');
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        let current = 0;
        const step = Math.max(1, Math.floor(target / 60));
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = current;
        }, 25);
        statsObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => statsObserver.observe(el));

  /* ======= NAV SHRINK ON SCROLL ======= */
  const nav = document.getElementById('nav');
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 100) {
          nav.style.padding = '8px 0';
          nav.style.boxShadow = '0 4px 30px rgba(0,0,0,0.25)';
        } else {
          nav.style.padding = '18px 0';
          nav.style.boxShadow = '0 4px 30px rgba(0,0,0,0.1)';
        }
        ticking = false;
      });
      ticking = true;
    }
  });

});