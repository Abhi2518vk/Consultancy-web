document.addEventListener('DOMContentLoaded', () => {

  // Force the page to always start at the top on load/refresh
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

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
      plusIcon.textContent = details.classList.contains('open') ? '\u00d7' : '+';
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
      duration: 1.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.2
    });

    // Sync Lenis's internal scroll state to 0 too — otherwise it can "remember" the old position
    lenis.scrollTo(0, { immediate: true });

    // Recalculate pin positions now that scroll is confirmed at 0
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // --- Auto-scroll to the "landing" reveal after 3s of settling at the top ---
    // FIX (Issue 2, v2): driven off the NATIVE `scroll` event instead of wheel/touch/
    // keydown + lenis-only scroll. Native `scroll` fires for every possible way scrollY
    // can change — scrollbar drag, momentum/inertia after lifting a finger, keyboard
    // Home/End, programmatic scroll, Lenis-driven scroll, etc. Using it as the single
    // source of truth means arriving at (or leaving) the top is never missed.
    let hasTriggeredAtTop = false;
    let settleTimer = null;
    const TOP_THRESHOLD = 20;
    const SETTLE_DELAY = 3000;

    function fireAutoScroll() {
      hasTriggeredAtTop = true;
      lenis.scrollTo(window.innerHeight * 0.5, {
        duration: 2.5,
        easing: (t) => 1 - Math.pow(1 - t, 3)
      });
    }

    function handleScrollForAutoTrigger() {
      if (window.scrollY >= TOP_THRESHOLD) {
        // Left the top — re-arm so it can fire again next time we're back at top.
        hasTriggeredAtTop = false;
        clearTimeout(settleTimer);
        return;
      }
      if (hasTriggeredAtTop) return; // already fired for this "visit" to the top

      // At/near the top: (re)start the 3s settle countdown. Any further scroll event
      // while still near the top resets this, so it only truly fires 3s after the
      // scrolling has actually stopped.
      clearTimeout(settleTimer);
      settleTimer = setTimeout(() => {
        if (!hasTriggeredAtTop && window.scrollY < TOP_THRESHOLD) {
          fireAutoScroll();
        }
      }, SETTLE_DELAY);
    }

    window.addEventListener('scroll', handleScrollForAutoTrigger, { passive: true });
    lenis.on('scroll', handleScrollForAutoTrigger); // belt-and-suspenders for Lenis-virtualized scroll

    // Run once immediately to start the initial 3s countdown on page load (scrollY is 0 here)
    handleScrollForAutoTrigger();

    // Initial clip state for the tagline's left-to-right reveal
    gsap.set('.hero-logo-tagline-mask', { clipPath: 'inset(0% 100% 0% 0%)' });

    const introTl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    introTl
      // 1. Logo: clean fade only — no bounce, no scale/zoom
      .to('.hero-logo-img', {
        opacity: 1,
        duration: 0.9,
        ease: 'power2.out'
      }, 0)
      // 2. Tagline: wipes in left-to-right while fading up, starting ~400ms after the logo begins
      .to('.hero-logo-tagline-mask', {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 0.7,
        ease: 'power2.out'
      }, 0.4)
      .to('.hero-logo-tagline', {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out'
      }, 0.4)
      .to('.nav', {
        opacity: 1,
        y: 0,
        visibility: 'visible',
        duration: 0.8,
        ease: 'power2.out'
      }, 0.5)
      // 3. Scroll cue only appears once the logo + tagline reveal has fully settled
      .to('.scroll-indicator', {
        opacity: 1,
        duration: 0.6,
        ease: 'power1.out'
      }, 1.3);

    // Very soft ambient glow — just enough to lift the logo off the navy background, nothing flashy
    gsap.to('.hero-logo-img', {
      filter: 'drop-shadow(0 0 18px rgba(201, 162, 77, 0.15))',
      duration: 2.2,
      delay: 0.4,
      ease: 'sine.inOut'
    });

    // Separate glow animation for premium clarity — kept on the logo mark only
    gsap.to('.hero-logo-img', {
      filter: 'drop-shadow(0 0 30px rgba(201, 162, 77, 0.4))',
      duration: 2,
      delay: 0.5,
      ease: 'sine.inOut'
    });

    // 2. Hero Scroll Transition Timeline (Pinned, Snapped, and Slowed Down for Premium Float)
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom bottom',
        // FIX (Issue 1): lowered from 2.2 -> 0.6. This is what caused the buttons/badges to
        // keep "catching up" for ~2s after Lenis physically finished scrolling. 0.6 keeps
        // some smoothing so it doesn't feel snappy/instant, but the lag is no longer noticeable.
        scrub: 0.6,
        pin: '.hero-sticky',
        anticipatePin: 1,
        snap: {
          snapTo: [0, 0.5],
          duration: { min: 0.5, max: 1.0 },
          ease: 'power2.inOut'
        }
      }
    });

    scrollTl
      // Fade in building background smoothly (Slow Float)
      .to('.hero-bg-img', { opacity: 1, duration: 0.5, ease: 'sine.inOut' }, 0)
      // Logo stays pinned in place — only shrinks slightly and fades as content appears
      .to('.hero-logo-wrapper', {
        scale: 0.85,
        opacity: 0,
        duration: 0.35,
        ease: 'power2.inOut'
      }, 0)
      // Fade out scroll indicator smoothly
      .fromTo('.scroll-indicator',
        { opacity: 1 },
        { opacity: 0, duration: 0.2, ease: 'none' },
        0
      )
      // Fade in Landing Page Text smoothly
      .to('.hero-content', { opacity: 1, duration: 0.2, ease: 'none' }, 0.4)
      .to('.hero-content > *', {
        opacity: 1,
        y: 0,
        stagger: 0.05,
        duration: 0.2,
        ease: 'power2.out'
      }, 0.4)
      // Dummy tween to pad the timeline
      .to({}, { duration: 0.5 });

  } else {
    // Fallback if GSAP/Lenis fail to load
    const heroLogo = document.querySelector('.hero-logo-img');
    const heroTagline = document.querySelector('.hero-logo-tagline');
    const nav = document.querySelector('.nav');
    const scrollInd = document.querySelector('.scroll-indicator');
    const heroContent = document.querySelector('.hero-content');

    if (heroLogo) heroLogo.style.opacity = '1';
    if (heroTagline) { heroTagline.style.opacity = '1'; heroTagline.style.transform = 'translateY(0)'; }
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