/* About page: hero figures roll like an odometer and always land back on
   their real value. Each digit is a reel of 0-9 repeated; a spin jumps the
   reel to the first copy of the digit, then animates down to the last copy. */
(function () {
  var odos = document.querySelectorAll(".ab-odo");
  if (!odos.length) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var LOOPS = 3;          // copies of 0-9 per reel = how far a spin travels
  var EVERY = 4200;       // ms between spins
  var reels = [];

  function place(reel, index, animate) {
    reel.style.transition = animate ? "" : "none";
    reel.style.transform = "translateY(" + -index + "em)";
  }

  Array.prototype.forEach.call(odos, function (odo) {
    var value = odo.getAttribute("data-value") || odo.textContent;
    odo.textContent = "";
    value.split("").forEach(function (ch) {
      var win = document.createElement("span");
      var reel = document.createElement("span");
      win.className = "ab-odo-win";
      reel.className = "ab-odo-reel";
      for (var l = 0; l < LOOPS; l++) {
        for (var d = 0; d < 10; d++) {
          var cell = document.createElement("span");
          cell.textContent = d;
          reel.appendChild(cell);
        }
      }
      reel.digit = +ch;
      place(reel, (LOOPS - 1) * 10 + reel.digit, false);
      win.appendChild(reel);
      odo.appendChild(win);
      reels.push(reel);
    });
  });

  function spin() {
    reels.forEach(function (reel, i) {
      place(reel, reel.digit, false);
      void reel.offsetHeight; // commit the jump before animating
      setTimeout(function () {
        place(reel, (LOOPS - 1) * 10 + reel.digit, true);
      }, 40 + i * 110);
    });
  }

  var timer = null;
  function start() { if (!timer) { spin(); timer = setInterval(spin, EVERY); } }
  function stop() { clearInterval(timer); timer = null; }

  var hero = document.querySelector(".ab-figures") || odos[0];
  var visible = true;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      visible && !document.hidden ? start() : stop();
    }).observe(hero);
  } else {
    start();
  }
  document.addEventListener("visibilitychange", function () {
    document.hidden || !visible ? stop() : start();
  });
})();
