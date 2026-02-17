(function () {
  'use strict';

  // ----- Header scroll
  const header = document.getElementById('header');
  if (header) {
    let lastY = window.scrollY;
    window.addEventListener('scroll', function () {
      const y = window.scrollY;
      if (y > 80) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
      lastY = y;
    }, { passive: true });
  }

  // ----- Mobile menu
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (menuToggle && nav) {
    function closeMenu() {
      nav.classList.remove('open');
      menuToggle.classList.remove('open');
      document.body.style.overflow = '';
    }
    menuToggle.addEventListener('click', function () {
      nav.classList.toggle('open');
      menuToggle.classList.toggle('open');
      document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    });
    document.querySelectorAll('.nav a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
    document.addEventListener('click', function (e) {
      if (!nav.classList.contains('open')) return;
      if (nav.contains(e.target) || menuToggle.contains(e.target)) return;
      closeMenu();
    });
  }

  // ----- Scroll animations (Intersection Observer)
  function revealSection(sectionEl) {
    if (!sectionEl) return;
    sectionEl.querySelectorAll('.animate-in').forEach(function (el) {
      el.classList.add('visible');
    });
  }
  const animateEls = document.querySelectorAll('.animate-in:not(.reveal)');
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  });
  animateEls.forEach(function (el) { observer.observe(el); });

  // Quand on clique sur un lien ancre (#sur-mesure, #services…), révéler le contenu de la section cible
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function () {
      const id = link.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (target) setTimeout(function () { revealSection(target); }, 100);
    });
  });
  // Au chargement, si l’URL contient déjà une ancre, révéler la section
  if (window.location.hash) {
    const target = document.getElementById(window.location.hash.slice(1));
    if (target) setTimeout(function () { revealSection(target); }, 200);
  }

  // Service blocks scroll reveal
  const serviceBlocks = document.querySelectorAll('.service-block');
  const blockObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { rootMargin: '0px 0px -100px 0px', threshold: 0.05 });
  serviceBlocks.forEach(function (el) { blockObserver.observe(el); });

  // ----- Newsletter form (Formspree)
  const form = document.querySelector('.newsletter-form');
  const thanks = document.querySelector('.newsletter-thanks');
  const submitBtn = form ? form.querySelector('.newsletter-btn') : null;
  if (form && thanks && submitBtn) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const formAction = form.getAttribute('action');
      if (!formAction || formAction.indexOf('YOUR_FORM_ID') !== -1) {
        submitBtn.textContent = 'DEMANDE ENVOYÉE...';
        submitBtn.classList.add('sent');
        form.classList.add('hidden');
        thanks.classList.remove('hidden');
        return;
      }
      submitBtn.disabled = true;
      submitBtn.textContent = 'Envoi...';
      const formData = new FormData(form);
      fetch(formAction, { method: 'POST', body: formData, headers: { 'Accept': 'application/json' } })
        .then(function () {
          submitBtn.textContent = 'DEMANDE ENVOYÉE...';
          submitBtn.classList.add('sent');
          setTimeout(function () {
            form.classList.add('hidden');
            thanks.classList.remove('hidden');
          }, 600);
        })
        .catch(function () {
          submitBtn.textContent = 'SOLLICITER L\'ACCÈS';
          submitBtn.disabled = false;
        });
    });
  }

  // ----- Top link: show only when scrolled
  const topLink = document.querySelector('.top-link');
  if (topLink) {
    window.addEventListener('scroll', function () {
      topLink.style.opacity = window.scrollY > 400 ? '0.6' : '0.3';
    }, { passive: true });
  }

  // ----- Reveal (scroll animations)
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });
  revealEls.forEach(function (el) { revealObserver.observe(el); });

  // ----- Cookie banner
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.querySelector('.js-accept-cookies');
  if (cookieBanner && !localStorage.getItem('phantomart-cookies')) {
    setTimeout(function () {
      cookieBanner.classList.add('visible');
      cookieBanner.setAttribute('aria-hidden', 'false');
    }, 1500);
  }
  if (acceptBtn) {
    acceptBtn.addEventListener('click', function () {
      localStorage.setItem('phantomart-cookies', 'accepted');
      cookieBanner.classList.remove('visible');
      cookieBanner.setAttribute('aria-hidden', 'true');
    });
  }

  // ----- Modal (Mentions légales / Politique confidentialité)
  function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }
  function closeModals() {
    document.querySelectorAll('.modal.open').forEach(function (m) {
      m.classList.remove('open');
      m.setAttribute('aria-hidden', 'true');
    });
    document.body.style.overflow = '';
  }
  document.querySelectorAll('.js-open-mentions').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      openModal('mentions-legales');
    });
  });
  document.querySelectorAll('.js-open-confidentialite').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      openModal('politique-confidentialite');
    });
  });
  document.querySelectorAll('.js-close-modal').forEach(function (btn) {
    btn.addEventListener('click', closeModals);
  });

  // ----- Parallax léger sur le hero (optionnel)
  const heroBg = document.querySelector('.hero-bg img');
  if (heroBg) {
    window.addEventListener('scroll', function () {
      const y = window.scrollY;
      const vh = window.innerHeight;
      if (y < vh) {
        heroBg.style.transform = 'scale(' + (1 + 0.05 * (1 - y / vh)) + ')';
      }
    }, { passive: true });
  }
})();
