document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile Menu Toggle ---
  const navHamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (navHamburger && mobileMenu) {
    navHamburger.addEventListener('click', () => {
      navHamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });

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
      const details = document.querySelector('.svc-card-details[data-details="' + index + '"]');

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

  // --- General Reveal on Scroll for other sections ---
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(el => revealObserver.observe(el));

  // --- GSAP & Lenis Premium Scroll (Safety Checked) ---
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && typeof Lenis !== 'undefined') {

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // 1. Hero Initial Load Timeline (Logo Animation & 0.5s Navbar Delay)
    const introTl = gsap.timeline({ defaults: { ease: "power3.out" } });

    introTl
      .to('.hero-logo-img', {
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: "back.out(1.2)"
      })
      .to('.nav', {
        opacity: 1,
        y: 0,
        visibility: "visible",
        duration: 0.8,
        ease: "power2.out"
      }, 0.5) // Navbar appears at 0.5 seconds
      .to('.scroll-indicator', {
        opacity: 1,
        duration: 0.5,
        ease: "sine.out"
      }, 1.2);

    // Separate glow animation for premium clarity
    gsap.to('.hero-logo-img', {
      filter: "drop-shadow(0 0 30px rgba(201, 162, 77, 0.4))",
      duration: 2,
      delay: 0.5,
      ease: "sine.inOut"
    });

    // 2. Hero Scroll Transition Timeline (Pinned, Snapped, and Slowed Down for Premium Float)
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
        pin: ".hero-sticky",
        anticipatePin: 1,
        snap: {
          snapTo: [0, 0.5],
          duration: { min: 0.5, max: 1.0 },
          ease: "power2.inOut"
        }
      }
    });

    scrollTl
      // Fade in building background smoothly (Slow Float)
      .to('.hero-bg-img', { opacity: 1, duration: 0.5, ease: "sine.inOut" }, 0)
      // Move Logo Up & Fade Out smoothly (Slow Float)
      .to('.hero-logo-wrapper', {
        y: "-20vh",
        scale: 0.8,
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut"
      }, 0)
      // Fade out scroll indicator smoothly, ensuring it returns to 1 when scrolled back to top
      .fromTo('.scroll-indicator',
        { opacity: 1 },
        { opacity: 0, duration: 0.2, ease: "none" },
        0
      )

      // Fade in Landing Page Text smoothly
      .to('.hero-content', { opacity: 1, duration: 0.2, ease: "none" }, 0.3)
      .to('.hero-content > *', {
        opacity: 1,
        y: 0,
        stagger: 0.05,
        duration: 0.2,
        ease: "power2.out"
      }, 0.3)
      // Dummy tween to pad the timeline so it holds the landing page from 0.5 to 1.0
      .to({}, { duration: 0.5 });

  } else {
    // Fallback if GSAP/Lenis fail to load
    const heroLogo = document.querySelector('.hero-logo-img');
    const nav = document.querySelector('.nav');
    const scrollInd = document.querySelector('.scroll-indicator');
    const heroContent = document.querySelector('.hero-content');

    if (heroLogo) heroLogo.style.opacity = '1';
    if (nav) { nav.style.opacity = '1'; nav.style.transform = 'translateY(0)'; nav.style.visibility = 'visible'; }
    if (scrollInd) scrollInd.style.opacity = '1';
    if (heroContent) {
      heroContent.style.opacity = '1';
      heroContent.querySelectorAll('*').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    }
  }

});