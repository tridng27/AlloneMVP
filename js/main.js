// Active nav link for the current page (clean URLs: /crm, no .html extension)
const currentPage = location.pathname.replace(/\/+$/, '').split('/').pop().replace(/\.html$/, '') || 'index';
document.querySelectorAll('[data-nav]').forEach((link) => {
  if (link.getAttribute('data-nav') === currentPage) {
    link.classList.add('active');
    link.setAttribute('aria-current', 'page');
  }
});

// The "Sản Phẩm" and "Giải Pháp" nav triggers represent a group of pages
// (dropdown items), so they need to read as active for any page in their group.
const NAV_GROUPS = {
  crm: ['crm', 'omni', 'lms'],
  'case-study-liam-education': ['case-study-liam-education', 'case-study-aztravel'],
};
Object.entries(NAV_GROUPS).forEach(([groupNav, pages]) => {
  if (!pages.includes(currentPage)) return;
  document.querySelectorAll(`[data-nav="${groupNav}"]`).forEach((link) => {
    link.classList.add('active');
    link.setAttribute('aria-current', 'page');
  });
});

// Light/dark theme toggle — dark is the default (no attribute set), light is
// an explicit opt-in persisted to localStorage under the same key home.js uses.
(function () {
  var root = document.documentElement;
  var KEY = 'allone-theme';

  try {
    var saved = localStorage.getItem(KEY);
    if (saved === 'dark' || saved === 'light') root.setAttribute('data-theme', saved);
  } catch (e) {}

  var themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var current = root.getAttribute('data-theme') || 'dark';
      var next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem(KEY, next); } catch (e) {}
    });
  }
})();

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

// Giải Pháp dropdown: click/touch toggle (hover/focus-within handled by CSS alone)
document.querySelectorAll('.nav-item.has-dropdown').forEach((item) => {
  const toggle = item.querySelector('.nav-dropdown-toggle');
  if (!toggle) return;

  toggle.addEventListener('click', (event) => {
    if (window.matchMedia('(hover: hover)').matches) return;
    event.preventDefault();
    const isOpen = item.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
});

document.addEventListener('click', (event) => {
  document.querySelectorAll('.nav-item.open').forEach((item) => {
    if (!item.contains(event.target)) {
      item.classList.remove('open');
      item.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded', 'false');
    }
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    document.querySelectorAll('.nav-item.open').forEach((item) => {
      item.classList.remove('open');
      item.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded', 'false');
    });
  }
});

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

// Lead-capture forms (Đăng Ký, Liên Hệ) — posts straight to Web3Forms (js/config.js),
// which emails each submission to your inbox. Simulates success locally while unset.
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const formError = document.getElementById('formError');
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

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

  const formType = form.dataset.formType || 'unknown';
  const payload = {
    access_key: WEB3FORMS_ACCESS_KEY,
    subject: `AllOne website — new ${formType} submission`,
    from_name: fields.fullName || 'AllOne website',
    page: location.pathname,
    submitted_at: new Date().toISOString(),
    ...fields,
  };

  if (!WEB3FORMS_ACCESS_KEY) {
    console.info('WEB3FORMS_ACCESS_KEY not configured (js/config.js) — simulating success.', payload);
    return true;
  }

  const response = await fetch(WEB3FORMS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });

  const result = await response.json().catch(() => ({}));
  return response.ok && result.success !== false;
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
