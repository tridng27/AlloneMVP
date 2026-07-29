// Active nav link for the current page (clean URLs: /san-pham, no .html extension)
const currentPage = location.pathname.replace(/\/+$/, '').split('/').pop().replace(/\.html$/, '') || 'index';
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

// Lead-capture forms (Đăng Ký, Liên Hệ) — posts to LEAD_WEBHOOK_URL (js/config.js) once
// the CRM backend is deployed; simulates success locally while that's unset.
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const formError = document.getElementById('formError');

async function submitLead(form) {
  const formData = new FormData(form);

  // Honeypot: a real visitor never fills this hidden field, a bot script often does.
  if (formData.get('hp_website')) {
    return true;
  }

  const fields = {};
  formData.forEach((value, key) => {
    if (key !== 'hp_website') fields[key] = value;
  });

  const payload = {
    formType: form.dataset.formType || 'unknown',
    submittedAt: new Date().toISOString(),
    page: location.pathname,
    fields,
  };

  if (!LEAD_WEBHOOK_URL) {
    console.info('LEAD_WEBHOOK_URL not configured (js/config.js) — simulating success.', payload);
    return true;
  }

  const response = await fetch(LEAD_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return response.ok;
}

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

    const submitButton = contactForm.querySelector('button[type="submit"]');
    if (submitButton) submitButton.disabled = true;

    submitLead(contactForm)
      .then((ok) => {
        if (!ok) throw new Error('Webhook rejected submission');
        formSuccess.hidden = false;
        contactForm.reset();
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
      })
      .catch((err) => {
        console.error('Lead submission failed:', err);
        formError.hidden = false;
        formError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      })
      .finally(() => {
        if (submitButton) submitButton.disabled = false;
      });
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
