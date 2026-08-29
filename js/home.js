  (function () {
    var root = document.documentElement;
    var KEY = "allone-theme";

    try {
      var saved = localStorage.getItem(KEY);
      if (saved === "dark" || saved === "light") root.setAttribute("data-theme", saved);
    } catch (e) {}

    var toggle = document.getElementById("themeToggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        var systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        var current = root.getAttribute("data-theme") || (systemDark ? "dark" : "light");
        var next = current === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", next);
        try { localStorage.setItem(KEY, next); } catch (e) {}
      });
    }

    var navToggle = document.getElementById("navToggle");
    var header = document.getElementById("siteHeader");
    if (navToggle && header) {
      navToggle.addEventListener("click", function () {
        var open = header.classList.toggle("is-open");
        navToggle.setAttribute("aria-expanded", String(open));
      });
      document.querySelectorAll("#mobileNav a").forEach(function (a) {
        a.addEventListener("click", function () {
          header.classList.remove("is-open");
          navToggle.setAttribute("aria-expanded", "false");
        });
      });
    }

    // desktop dropdown — hover opens it via CSS; this adds click + keyboard
    var navItems = document.querySelectorAll(".main-nav .nav-item");
    function closeNavItem(item) {
      item.classList.remove("is-open");
      var t = item.querySelector(".nav-trigger");
      if (t) t.setAttribute("aria-expanded", "false");
    }
    navItems.forEach(function (item) {
      var trigger = item.querySelector(".nav-trigger");
      if (!trigger) return;
      trigger.addEventListener("click", function (e) {
        e.stopPropagation();
        var open = item.classList.toggle("is-open");
        trigger.setAttribute("aria-expanded", String(open));
      });
      item.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && item.classList.contains("is-open")) {
          closeNavItem(item);
          trigger.focus();
        }
      });
    });
    document.addEventListener("click", function (e) {
      navItems.forEach(function (item) {
        if (item.classList.contains("is-open") && !item.contains(e.target)) closeNavItem(item);
      });
    });

    // solution pager — one module (CRM / Omni / LMS / AI) shown at a time
    var pager = document.querySelector(".solution-pager");
    if (pager) {
      var scCards = Array.prototype.slice.call(pager.querySelectorAll(".solution-card"));
      var scDots = Array.prototype.slice.call(pager.querySelectorAll(".pager-dot"));
      var scActive = 0;
      var showSolution = function (i) {
        scActive = (i + scCards.length) % scCards.length;
        scCards.forEach(function (card, idx) {
          var isActive = idx === scActive;
          card.classList.toggle("is-active", isActive);
          card.setAttribute("aria-hidden", String(!isActive));
        });
        scDots.forEach(function (dot, idx) {
          var isActive = idx === scActive;
          dot.classList.toggle("is-active", isActive);
          dot.setAttribute("aria-selected", String(isActive));
        });
      };
      scDots.forEach(function (dot, idx) {
        dot.addEventListener("click", function () { showSolution(idx); });
      });
      pager.querySelectorAll(".pager-arrow").forEach(function (btn) {
        var dir = Number(btn.getAttribute("data-dir"));
        btn.addEventListener("click", function () { showSolution(scActive + dir); });
      });
      pager.addEventListener("keydown", function (e) {
        if (!e.target.closest(".pager-dot, .pager-arrow")) return;
        if (e.key === "ArrowRight") showSolution(scActive + 1);
        if (e.key === "ArrowLeft") showSolution(scActive - 1);
      });
      showSolution(0);
    }

    var y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();

    var revealEls = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      revealEls.forEach(function (el, i) {
        el.style.transitionDelay = Math.min(i * 55, 280) + "ms";
        io.observe(el);
      });
    } else {
      revealEls.forEach(function (el) { el.classList.add("in-view"); });
    }
  })();
