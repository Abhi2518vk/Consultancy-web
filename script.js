document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile Menu Toggle ---
  const navHamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (navHamburger && mobileMenu) {
    navHamburger.addEventListener('click', () => {
      navHamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navHamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
      });
    });
  }

  // --- Service Card Accordion ---
  const learnBtns = document.querySelectorAll('.svc-learn-btn');

  learnBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const index = btn.getAttribute('data-index');
      const details = document.querySelector(`.svc-card-details[data-details="${index}"]`);
      const parentCard = btn.closest('.svc-card');

      // Close all other open cards
      document.querySelectorAll('.svc-card-details.open').forEach(openDetails => {
        if (openDetails !== details) {
          openDetails.classList.remove('open');
          openDetails.previousElementSibling.querySelector('.svc-learn-btn').classList.remove('active');
          openDetails.previousElementSibling.querySelector('.svc-plus').textContent = '+';
        }
      });

      // Toggle current card
      details.classList.toggle('open');
      btn.classList.toggle('active');

      const plusIcon = btn.querySelector('.svc-plus');
      plusIcon.textContent = details.classList.contains('open') ? '×' : '+';
    });
  });

  // --- Stats Counter ---
  const stats = document.querySelectorAll('.stat-number');
  let countersStarted = false;

  function startCounters() {
    if (countersStarted) return;
    const statsSection = document.querySelector('.stats-banner');
    if (!statsSection) return;

    const rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom >= 0) {
      countersStarted = true;
      stats.forEach(stat => {
        const target = +stat.getAttribute('data-target');
        let current = 0;
        const increment = target / 100;

        const updateCounter = () => {
          current += increment;
          if (current < target) {
            stat.innerText = Math.ceil(current);
            setTimeout(updateCounter, 20);
          } else {
            stat.innerText = target;
          }
        };
        updateCounter();
      });
    }
  }

  window.addEventListener('scroll', startCounters);

  // --- Reveal on Scroll ---
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(el => revealObserver.observe(el));

});