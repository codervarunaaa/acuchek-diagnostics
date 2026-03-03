/* ============================================
   ACUCHEK DIAGNOSTICS — Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Navbar scroll behavior ----------
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ---------- Mobile nav toggle ----------
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = navToggle.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      const spans = navToggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    });
  });

  // ---------- Smooth scroll for anchor links ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 10;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---------- Scroll-triggered fade-up animations ----------
  const fadeElements = document.querySelectorAll('.fade-up');
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1,
  };

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger animation for sibling elements
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        fadeObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach(el => fadeObserver.observe(el));

  // ---------- Animated stat counters ----------
  const statNumbers = document.querySelectorAll('.hero-stat-number');
  let statsCounted = false;

  const animateCounters = () => {
    if (statsCounted) return;
    statsCounted = true;

    statNumbers.forEach(el => {
      const target = parseInt(el.getAttribute('data-count'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1800;
      const startTime = performance.now();

      const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);
        el.textContent = current + suffix;
        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = target + suffix;
        }
      };

      requestAnimationFrame(update);
    });
  };

  // Trigger counters when hero is visible
  const heroSection = document.getElementById('hero');
  const statObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateCounters();
      statObserver.unobserve(heroSection);
    }
  }, { threshold: 0.3 });
  statObserver.observe(heroSection);

  // ---------- Back to top ----------
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---------- Active nav link highlighting ----------
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = navLinks.querySelectorAll('a[href^="#"]');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }, { passive: true });

});
