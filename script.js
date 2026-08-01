/* ============================================================
   CONSULTANCY WEBSITE — INTERACTIVE BEHAVIORS
   Scroll reveals, parallax, counters, testimonials, nav
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Preloader ----
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      initHeroReveal();
    }, 2000);
  });

  // Fallback if load already fired
  if (document.readyState === 'complete') {
    setTimeout(() => {
      preloader.classList.add('hidden');
      initHeroReveal();
    }, 2000);
  }


  // ---- Hero Word-by-Word Reveal ----
  function initHeroReveal() {
    const wordInners = document.querySelectorAll('.hero__title .word-inner');
    const description = document.getElementById('hero-description');
    const actions = document.getElementById('hero-actions');

    wordInners.forEach((word, i) => {
      setTimeout(() => {
        word.classList.add('revealed');
      }, 200 + i * 150);
    });

    setTimeout(() => {
      description.classList.add('revealed');
    }, 200 + wordInners.length * 150 + 100);

    setTimeout(() => {
      actions.classList.add('revealed');
    }, 200 + wordInners.length * 150 + 300);
  }


  // ---- Sticky Nav ----
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  function handleNavScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 80) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
    lastScroll = scrollY;
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });


  // ---- Mobile Menu ----
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('[data-mobile-link]');

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });


  // ---- Smooth Scroll for Anchor Links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = nav.offsetHeight;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });


  // ---- Hero Parallax ----
  const heroParallax = document.getElementById('hero-parallax');
  const heroSection = document.getElementById('hero');

  function handleParallax() {
    if (!heroParallax) return;
    const scrollY = window.scrollY;
    const heroHeight = heroSection.offsetHeight;
    if (scrollY <= heroHeight) {
      const translateY = scrollY * 0.3;
      heroParallax.style.transform = `scale(1.1) translateY(${translateY}px)`;
    }
  }

  window.addEventListener('scroll', handleParallax, { passive: true });


  // ---- Scroll Reveal (IntersectionObserver) ----
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Calculate stagger delay from CSS variable
        const style = getComputedStyle(entry.target);
        const staggerIndex = style.getPropertyValue('--i');
        const delay = staggerIndex ? parseInt(staggerIndex) * 120 : 0;

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  // ---- Animated Counters ----
  const counters = document.querySelectorAll('.counter');
  let countersAnimated = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        animateCounters();
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const impactSection = document.getElementById('impact');
  if (impactSection) {
    counterObserver.observe(impactSection);
  }

  function animateCounters() {
    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const isDecimal = counter.hasAttribute('data-decimal');
      const duration = 2000;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = target * eased;

        if (isDecimal) {
          counter.textContent = current.toFixed(1);
        } else {
          counter.textContent = Math.floor(current);
        }

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          if (isDecimal) {
            counter.textContent = target.toFixed(1);
          } else {
            counter.textContent = target;
          }
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }


  // ---- Testimonial Rotation ----
  const testimonials = document.querySelectorAll('.testimonial');
  const dots = document.querySelectorAll('.testimonials__dot');
  let currentTestimonial = 0;
  let testimonialInterval;

  function showTestimonial(index) {
    testimonials.forEach((t, i) => {
      t.classList.toggle('active', i === index);
    });
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === index);
    });
    currentTestimonial = index;
  }

  function nextTestimonial() {
    const next = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(next);
  }

  // Auto-rotate
  function startTestimonialRotation() {
    testimonialInterval = setInterval(nextTestimonial, 5000);
  }

  startTestimonialRotation();

  // Dot click
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(testimonialInterval);
      showTestimonial(parseInt(dot.getAttribute('data-dot')));
      startTestimonialRotation();
    });
  });


  // ---- Service Card Hover Tilt (subtle) ----
  const serviceCards = document.querySelectorAll('.service-card');

  serviceCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -3;
      const rotateY = ((x - centerX) / centerX) * 3;

      card.style.transform = `translateY(-4px) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });


  // ---- Active Nav Link Highlighting ----
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  function updateActiveNav() {
    const scrollPos = window.scrollY + nav.offsetHeight + 100;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('nav__link--active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('nav__link--active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });


  // ---- Hide scroll indicator after scrolling ----
  const heroScroll = document.getElementById('hero-scroll');
  let scrollHidden = false;

  function handleScrollIndicator() {
    if (!scrollHidden && window.scrollY > 200) {
      heroScroll.style.opacity = '0';
      heroScroll.style.transition = 'opacity 0.5s ease';
      scrollHidden = true;
    }
  }

  window.addEventListener('scroll', handleScrollIndicator, { passive: true });

});
