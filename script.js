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

  // Trigger counters when hero is visible (guard for pages without hero)
  const heroSection = document.getElementById('hero');
  if (heroSection && statNumbers.length) {
    const statObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCounters();
        statObserver.unobserve(heroSection);
      }
    }, { threshold: 0.3 });
    statObserver.observe(heroSection);
  }

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

  // ---------- Package group tabs ----------
  const packageTabs = document.querySelectorAll('.package-tab');
  const packageCards = document.querySelectorAll('.package-card');

  if (packageTabs.length && packageCards.length) {
    const setActiveGroup = (group) => {
      packageTabs.forEach((tab) => {
        const isActive = tab.getAttribute('data-group') === group;
        tab.classList.toggle('active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      packageCards.forEach((card) => {
        const matches = card.getAttribute('data-group') === group;
        card.style.display = matches ? '' : 'none';
      });
    };

    const initialGroup = packageTabs[0].getAttribute('data-group');
    setActiveGroup(initialGroup);

    packageTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const group = tab.getAttribute('data-group');
        if (!group) return;
        setActiveGroup(group);
      });
    });
  }

  // ---------- Women’s Day entry modal ----------
  const womensOfferModal = document.getElementById('womensOfferModal');
  if (womensOfferModal) {
    const womensOfferClose = document.getElementById('womensOfferClose');
    const womensOfferView = document.getElementById('womensOfferView');
    const womensOfferLater = document.getElementById('womensOfferLater');

    const openWomensOffer = () => {
      womensOfferModal.classList.add('open');
      womensOfferModal.setAttribute('aria-hidden', 'false');
    };

    const closeWomensOffer = () => {
      womensOfferModal.classList.remove('open');
      womensOfferModal.setAttribute('aria-hidden', 'true');
      try {
        sessionStorage.setItem('womensOfferSeen', 'true');
      } catch (_) {
        // ignore storage errors
      }
    };

    // Show once per session
    let seen = false;
    try {
      seen = sessionStorage.getItem('womensOfferSeen') === 'true';
    } catch (_) {
      seen = false;
    }

    if (!seen) {
      setTimeout(openWomensOffer, 800);
    }

    womensOfferClose?.addEventListener('click', closeWomensOffer);
    womensOfferLater?.addEventListener('click', closeWomensOffer);

    womensOfferView?.addEventListener('click', () => {
      closeWomensOffer();
    });

    womensOfferModal.addEventListener('click', (e) => {
      if (e.target === womensOfferModal) {
        closeWomensOffer();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && womensOfferModal.classList.contains('open')) {
        closeWomensOffer();
      }
    });
  }

  // ---------- Test details modal ----------
  const TEST_DETAILS = {
    cbc: {
      title: 'Complete Blood Count (CBC)',
      subtitle: 'Baseline health screening • Infection • Anemia',
      category: 'Hematology',
      description: 'A complete blood count evaluates red cells, white cells, and platelets to screen for anemia, infections, inflammation, and certain blood disorders.',
      sample: 'EDTA whole blood',
      fasting: 'No fasting required',
      idealFor: 'Routine health check, fatigue, fever, suspected infections, anemia screening',
      tat: 'Reports typically available within 12 hours',
      prep: 'Avoid strenuous exercise and heavy meals just before sample collection, if possible.',
      minPrice: 250,
      maxPrice: 450,
    },
    hba1c: {
      title: 'HbA1c (Glycated Hemoglobin)',
      subtitle: 'Average sugar control over 3 months',
      category: 'Diabetes Care',
      description: 'HbA1c reflects your average blood glucose control over the last 2–3 months and helps in diagnosing and monitoring diabetes.',
      sample: 'Whole blood',
      fasting: 'No fasting required',
      idealFor: 'Known diabetics, high fasting sugars, strong family history of diabetes',
      tat: 'Same day reporting in most cases',
      prep: 'No special preparation needed. Continue regular medicines unless advised otherwise by your doctor.',
      minPrice: 450,
      maxPrice: 750,
    },
    thyroid: {
      title: 'Thyroid Profile (T3, T4, TSH)',
      subtitle: 'Thyroid balance • Weight • Energy',
      category: 'Hormone Profile',
      description: 'A three‑parameter thyroid panel (T3, T4, TSH) to screen for hypo‑ or hyper‑thyroidism and to monitor ongoing thyroid treatment.',
      sample: 'Serum',
      fasting: 'Fasting preferred (8–10 hours), but not mandatory',
      idealFor: 'Weight changes, hair loss, fatigue, menstrual irregularities, thyroid medication monitoring',
      tat: 'Reports available within 24 hours',
      prep: 'Inform your doctor about any thyroid medications or supplements you are taking.',
      minPrice: 600,
      maxPrice: 1100,
    },
    lft: {
      title: 'Liver Function Test (LFT)',
      subtitle: 'Liver enzymes • Jaundice • Medication monitoring',
      category: 'Biochemistry',
      description: 'A panel of liver enzymes and proteins used to assess overall liver health, detect damage, and monitor the effect of medicines on the liver.',
      sample: 'Serum',
      fasting: '10–12 hours fasting recommended',
      idealFor: 'Jaundice, abdominal discomfort, long‑term medications, fatty liver, alcohol use',
      tat: 'Reports usually available within 24 hours',
      prep: 'Avoid alcohol for at least 24 hours prior to testing, unless otherwise advised.',
      minPrice: 500,
      maxPrice: 950,
    },
    lipid: {
      title: 'Lipid Profile',
      subtitle: 'Cholesterol • Triglycerides • Heart risk',
      category: 'Cardiac Risk',
      description: 'Measures total cholesterol, HDL (good cholesterol), LDL (bad cholesterol), and triglycerides to estimate your risk for heart disease.',
      sample: 'Serum',
      fasting: '12 hours fasting strongly recommended',
      idealFor: 'Routine preventive check‑ups, diabetes, hypertension, overweight, family history of heart disease',
      tat: 'Reports within 12–24 hours',
      prep: 'Overnight fasting with only water allowed; avoid heavy fatty meals the previous night.',
      minPrice: 550,
      maxPrice: 1200,
    },
    vitd: {
      title: 'Vitamin D (25‑OH)',
      subtitle: 'Bone health • Immunity • Fatigue',
      category: 'Vitamin Profile',
      description: 'Measures 25‑OH Vitamin D levels which are crucial for bone strength, immunity, and overall well‑being.',
      sample: 'Serum',
      fasting: 'Fasting not mandatory',
      idealFor: 'Bone pains, frequent fractures, fatigue, limited sun exposure, elderly, post‑menopausal women',
      tat: 'Reports within 24–36 hours',
      prep: 'No special preparation required. Inform your doctor about any Vitamin D supplements.',
      minPrice: 900,
      maxPrice: 1800,
    },
  };

  const modalBackdrop = document.getElementById('testModal');
  const modalClose = document.getElementById('testModalClose');

  const titleEl = document.getElementById('testModalTitle');
  const subtitleEl = document.getElementById('testModalSubtitle');
  const categoryEl = document.getElementById('testModalCategory');
  const descEl = document.getElementById('testModalDescription');
  const sampleEl = document.getElementById('testModalSample');
  const fastingEl = document.getElementById('testModalFasting');
  const idealForEl = document.getElementById('testModalIdealFor');
  const tatEl = document.getElementById('testModalTat');
  const prepEl = document.getElementById('testModalPrep');
  const priceEl = document.getElementById('testModalPrice');

  const openTestModal = (testId) => {
    const test = TEST_DETAILS[testId];
    if (!test || !modalBackdrop) return;

    titleEl.textContent = test.title;
    subtitleEl.textContent = test.subtitle;
    categoryEl.textContent = test.category;
    descEl.textContent = test.description;
    sampleEl.textContent = test.sample;
    fastingEl.textContent = test.fasting;
    idealForEl.textContent = test.idealFor;
    tatEl.textContent = test.tat;
    prepEl.textContent = test.prep;

    const price =
      test.minPrice +
      Math.floor(Math.random() * (test.maxPrice - test.minPrice + 1));
    priceEl.textContent = `₹ ${price.toLocaleString('en-IN')}`;

    modalBackdrop.classList.add('open');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    // Simple focus management
    modalClose?.focus();
  };

  const closeTestModal = () => {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('open');
    modalBackdrop.setAttribute('aria-hidden', 'true');
  };

  document.querySelectorAll('.test-details-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const testId = btn.getAttribute('data-test-id');
      if (testId) {
        openTestModal(testId);
      }
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeTestModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeTestModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop?.classList.contains('open')) {
      closeTestModal();
    }
  });

});
