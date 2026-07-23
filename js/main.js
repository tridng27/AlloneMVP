// Active nav link for the current page
const currentPage = location.pathname.split('/').pop().replace('.html', '') || 'index';
document.querySelectorAll('[data-nav]').forEach((link) => {
  if (link.getAttribute('data-nav') === currentPage) {
    link.classList.add('active');
    link.setAttribute('aria-current', 'page');
  }
});

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const siteHeader = document.getElementById('site-header');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteHeader.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.querySelectorAll('.mobile-nav a').forEach((link) => {
    link.addEventListener('click', () => {
      siteHeader.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Solutions tabs (section 3)
const tabsRoot = document.querySelector('[data-tabs]');
if (tabsRoot) {
  const buttons = tabsRoot.querySelectorAll('.tab-btn');
  const panels = tabsRoot.querySelectorAll('.tab-panel');

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');

      buttons.forEach((b) => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-selected', String(b === btn));
      });
      panels.forEach((panel) => {
        panel.classList.toggle('active', panel.getAttribute('data-panel') === target);
      });
    });
  });
}

// Contact form — MVP client-side handling (no backend wired up yet)
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const formError = document.getElementById('formError');

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    formSuccess.hidden = true;
    formError.hidden = true;

    if (!contactForm.checkValidity()) {
      formError.hidden = false;
      formError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // TODO: replace with a real submission endpoint when the backend is ready.
    formSuccess.hidden = false;
    contactForm.reset();
    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

// Footer year
const yearEl = document.getElementById('currentYear');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Scroll reveal for hero elements
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 60, 300)}ms`;
    observer.observe(el);
  });
} else {
  revealEls.forEach((el) => el.classList.add('in-view'));
}
