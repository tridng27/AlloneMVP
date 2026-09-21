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
        // dark is the page default, so no attribute set means "dark"
        var current = root.getAttribute("data-theme") || "dark";
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

    // product bento: four open cards on desktop, an accordion on phones.
    // markup ships expanded, so this only ever collapses things — no JS, no loss.
    var bentoCards = Array.prototype.slice.call(document.querySelectorAll(".bento-card"));
    if (bentoCards.length) {
      var narrow = window.matchMedia("(max-width: 720px)");

      var setCard = function (card, open) {
        var btn = card.querySelector(".bc-summary");
        var body = card.querySelector(".bc-body");
        if (!btn || !body) return;
        btn.setAttribute("aria-expanded", String(open));
        body.hidden = !open;
      };

      var applyBento = function () {
        var collapsible = narrow.matches;
        bentoCards.forEach(function (card, i) {
          card.classList.toggle("is-collapsible", collapsible);
          var btn = card.querySelector(".bc-summary");
          if (btn) btn.tabIndex = collapsible ? 0 : -1;
          // on phones the first card stays open so the section never reads as empty
          setCard(card, collapsible ? i === 0 : true);
        });
      };

      bentoCards.forEach(function (card) {
        var btn = card.querySelector(".bc-summary");
        if (!btn) return;
        btn.addEventListener("click", function () {
          if (!card.classList.contains("is-collapsible")) return;
          setCard(card, btn.getAttribute("aria-expanded") !== "true");
        });
      });

      applyBento();
      if (narrow.addEventListener) narrow.addEventListener("change", applyBento);
      else if (narrow.addListener) narrow.addListener(applyBento);
    }

    // pricing: annual is the listed rate, monthly is the same figure +20%.
    // both values ship in the markup, so this only ever swaps text.
    var billingBtns = Array.prototype.slice.call(document.querySelectorAll(".billing-btn"));
    if (billingBtns.length) {
      var priceNums = Array.prototype.slice.call(document.querySelectorAll(".price-num[data-annual]"));
      billingBtns.forEach(function (btn) {
        btn.addEventListener("click", function () {
          var cycle = btn.getAttribute("data-cycle");
          billingBtns.forEach(function (b) {
            var on = b === btn;
            b.classList.toggle("is-active", on);
            b.setAttribute("aria-pressed", String(on));
          });
          priceNums.forEach(function (el) {
            el.textContent = el.getAttribute(cycle === "monthly" ? "data-monthly" : "data-annual");
          });
        });
      });
    }

    // operational showcase: one panel per tab. the markup ships every panel
    // visible, so without JS they simply stack.
    var opsTabs = Array.prototype.slice.call(document.querySelectorAll(".ops-tab"));
    if (opsTabs.length) {
      var showTab = function (tab, focus) {
        opsTabs.forEach(function (t) {
          var on = t === tab;
          t.classList.toggle("is-active", on);
          t.setAttribute("aria-selected", String(on));
          t.tabIndex = on ? 0 : -1;
          var panel = document.getElementById(t.getAttribute("aria-controls"));
          if (panel) panel.hidden = !on;
        });
        if (focus) tab.focus();
      };
      opsTabs.forEach(function (tab, i) {
        tab.addEventListener("click", function () { showTab(tab); });
        tab.addEventListener("keydown", function (e) {
          var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
          if (!d) return;
          e.preventDefault();
          showTab(opsTabs[(i + d + opsTabs.length) % opsTabs.length], true);
        });
      });
      showTab(opsTabs[0]);
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
