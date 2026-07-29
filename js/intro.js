(function () {
  const track = document.getElementById('introTrack');
  if (!track) return;

  const ICONS = {
    sparkle: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v3M12 18v3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M3 12h3M18 12h3M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/><circle cx="12" cy="12" r="3"/></svg>',
    users: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    idcard: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8.5" cy="12" r="2"/><path d="M13 10h6M13 14h4"/></svg>',
    phone: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>',
    mail: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 8.97 6.2a2 2 0 0 0 2.06 0L22 7"/></svg>',
    layers: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/></svg>',
    book: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4.5A2.5 2.5 0 0 1 4.5 2H12v18H4.5A2.5 2.5 0 0 0 2 22.5v-18Z"/><path d="M22 4.5A2.5 2.5 0 0 0 19.5 2H12v18h7.5a2.5 2.5 0 0 1 2.5 2.5v-18Z"/></svg>'
  };

  const MODULES = [
    { title: 'AI Integration', tag: 'Đã tích hợp trong CRM', blurb: 'Biến dữ liệu thành hành động — AI hỗ trợ ra quyết định trong toàn bộ hành trình khách hàng.', live: true, icon: ICONS.sparkle },
    { title: 'CRM', tag: 'Đang triển khai', blurb: 'Quản lý khách hàng, bán hàng và vận hành trên một nền tảng duy nhất.', live: true, icon: ICONS.users },
    { title: 'HRM', tag: 'Sắp ra mắt', blurb: 'Quản lý hồ sơ nhân sự, chấm công, tính lương và hiệu suất đội ngũ trên cùng một hệ thống.', live: false, icon: ICONS.idcard },
    { title: 'Call', tag: 'Sắp ra mắt', blurb: 'Tổng đài gọi ra/gọi vào tích hợp trực tiếp trong CRM, tự động ghi âm và lưu lịch sử chăm sóc.', live: false, icon: ICONS.phone },
    { title: 'Email', tag: 'Sắp ra mắt', blurb: 'Thiết kế, gửi và đo lường hiệu quả chiến dịch email tự động theo hành vi khách hàng.', live: false, icon: ICONS.mail },
    { title: 'ERP', tag: 'Sắp ra mắt', blurb: 'Quản lý tài chính, kho hàng và chuỗi cung ứng, kết nối liền mạch với dữ liệu bán hàng.', live: false, icon: ICONS.layers },
    { title: 'LMS', tag: 'Sắp ra mắt', blurb: 'Đào tạo và phát triển đội ngũ với khoá học nội bộ, theo dõi tiến độ và cấp chứng chỉ.', live: false, icon: ICONS.book }
  ];

  const cardsContainer = document.getElementById('introCards');
  MODULES.forEach((m) => {
    const el = document.createElement('article');
    el.className = 'intro-card' + (m.live ? ' is-live' : '');
    el.innerHTML =
      '<div class="intro-card-icon">' + m.icon + '</div>' +
      '<h3>' + m.title + '</h3>' +
      '<p>' + m.blurb + '</p>' +
      '<span class="intro-card-tag">' + m.tag + '</span>';
    cardsContainer.appendChild(el);
  });

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const particlesEl = document.querySelector('.intro-particles');
  if (particlesEl) {
    const count = window.innerWidth < 700 ? 10 : 18;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'intro-particle';
      p.style.left = (Math.random() * 100).toFixed(2) + '%';
      p.style.top = (Math.random() * 100).toFixed(2) + '%';
      p.style.animationDuration = (4 + Math.random() * 4).toFixed(2) + 's';
      p.style.animationDelay = (Math.random() * 4).toFixed(2) + 's';
      particlesEl.appendChild(p);
    }
  }

  const circleWrap = document.getElementById('introCircleWrap');
  const hint = document.getElementById('introHint');
  const skipBtn = document.getElementById('introSkip');
  const canvas = document.getElementById('introShatterCanvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  const cardEls = Array.from(cardsContainer.children);

  const IDLE_END = 0.06;
  const CARDS_END = 0.78;

  function clamp01(v) { return Math.max(0, Math.min(1, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }

  // Cards settle in a wide ring around the circle, large enough to read in full.
  function getOrbitSlot(index, total) {
    const mobile = window.innerWidth < 700;
    const angle = -Math.PI / 2 + (index / total) * Math.PI * 2;
    if (mobile) {
      const radiusPx = Math.min(window.innerWidth * 0.42, 175);
      const x = (radiusPx / window.innerWidth) * 100 * Math.cos(angle);
      const y = (radiusPx / window.innerHeight) * 100 * Math.sin(angle);
      return { x: x, y: y, scale: 1 };
    }
    const radiusX = 25; // vw
    const radiusY = 26; // vh
    const x = Math.cos(angle) * radiusX;
    const y = Math.sin(angle) * radiusY;
    return { x: x, y: y, scale: 0.88 };
  }

  // ---- Particle shatter/merge system (circle -> particles -> navbar) ----
  let particles = [];
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resizeCanvas() {
    if (!canvas) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    buildParticles();
  }

  function buildParticles() {
    const count = window.innerWidth < 700 ? 70 : 130;
    const margin = window.innerWidth * 0.07;
    const usable = window.innerWidth - margin * 2;
    particles = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      // particles start right on the circle's rim, not scattered across its face,
      // so the burst reads as the shell cracking apart rather than dots appearing mid-air
      const rimJitter = (Math.random() - 0.5) * 10;
      const scatterAngle = angle + (Math.random() - 0.5) * 1.1;
      const scatterDist = 50 + Math.random() * 110;
      particles.push({
        angle: angle,
        rimJitter: rimJitter,
        scatterAngle: scatterAngle,
        scatterDist: scatterDist,
        targetX: margin + (i / (count - 1)) * usable,
        targetY: 36,
        size: 1.3 + Math.random() * 1.8
      });
    }
  }

  resizeCanvas();

  function drawParticles(morphT, circleRadius) {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (morphT <= 0) return;

    ctx.save();
    ctx.scale(dpr, dpr);

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const phase1T = clamp01(morphT / 0.45);
    const phase2T = clamp01((morphT - 0.45) / 0.55);
    const endFade = clamp01((morphT - 0.92) / 0.08);

    particles.forEach((p) => {
      const rimR = circleRadius + p.rimJitter;
      const baseX = cx + Math.cos(p.angle) * rimR;
      const baseY = cy + Math.sin(p.angle) * rimR;
      const scatterX = cx + Math.cos(p.scatterAngle) * (rimR + p.scatterDist);
      const scatterY = cy + Math.sin(p.scatterAngle) * (rimR + p.scatterDist);

      let x, y;
      if (phase2T <= 0) {
        x = lerp(baseX, scatterX, phase1T);
        y = lerp(baseY, scatterY, phase1T);
      } else {
        x = lerp(scatterX, p.targetX, phase2T);
        y = lerp(scatterY, p.targetY, phase2T);
      }

      const opacity = phase1T * (1 - endFade);
      const size = p.size * (1 - 0.35 * phase2T);

      ctx.beginPath();
      ctx.arc(x, y, Math.max(size, 0.4), 0, Math.PI * 2);
      ctx.shadowColor = 'rgba(255,255,255,' + (opacity * 0.5) + ')';
      ctx.shadowBlur = 4;
      ctx.fillStyle = 'rgba(10,10,22,' + opacity + ')';
      ctx.fill();
    });

    ctx.restore();
  }

  let ticking = false;

  function render() {
    ticking = false;
    const rect = track.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    let progress = total > 0 ? (-rect.top) / total : 0;
    progress = clamp01(progress);

    const cardsProgress = clamp01((progress - IDLE_END) / (CARDS_END - IDLE_END));
    const circleGrowScale = lerp(1, 1.3, cardsProgress);

    const morphT = clamp01((progress - CARDS_END) / (1 - CARDS_END));
    const dissolveT = clamp01(morphT / 0.45);
    // a quick "about to burst" bulge right before the circle dissolves into particles
    const burst = 1 + 0.14 * Math.sin(Math.min(dissolveT, 1) * Math.PI);
    const circleOpacity = lerp(1, 0, dissolveT);

    if (circleWrap) {
      circleWrap.style.opacity = circleOpacity;
      circleWrap.style.transform =
        'translate(-50%, -50%) scale(' + (circleGrowScale * burst) + ')';
    }

    const cardsFadeT = clamp01(morphT / 0.3);
    const segLen = (CARDS_END - IDLE_END) / cardEls.length;

    cardEls.forEach((el, i) => {
      const segStart = IDLE_END + i * segLen;
      const t = clamp01((progress - segStart) / segLen);
      const slot = getOrbitSlot(i, cardEls.length);

      const x = lerp(0, slot.x, t);
      const y = lerp(0, slot.y, t);
      const scale = lerp(0.28, slot.scale, t);
      let opacity = t;

      opacity *= (1 - cardsFadeT);

      el.style.transform = 'translate(-50%, -50%) translate(' + x + 'vw, ' + y + 'vh) scale(' + scale + ')';
      el.style.opacity = opacity;
    });

    drawParticles(morphT, 110 * circleGrowScale);

    if (hint) hint.style.opacity = progress < 0.05 ? 1 : 0;
    if (skipBtn) {
      skipBtn.style.opacity = progress < 0.96 ? 1 : 0;
      skipBtn.style.pointerEvents = progress < 0.96 ? 'auto' : 'none';
    }
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(render);
    }
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        window.addEventListener('scroll', onScroll, { passive: true });
        render();
      } else {
        window.removeEventListener('scroll', onScroll);
      }
    });
  }, { threshold: 0 });
  io.observe(track);

  window.addEventListener('resize', () => {
    resizeCanvas();
    render();
  });

  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      const rect = track.getBoundingClientRect();
      const targetY = window.scrollY + rect.bottom - window.innerHeight + 2;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  }

  render();
})();
