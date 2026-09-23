// Highlight showcases, shared by both front-end systems (main.js pages and home.js pages).
//
// <div data-hl-root>                      one showcase
//   [data-hl-point="k"]                   something the visitor reads: a legend row, a step, a card
//   [data-hl-target="k"]                  what lights up for it: a box over a screenshot, a mock row,
//                                         an iso plate, a diagram node (space-separate several keys)
//   [data-hl-screen="s"] + point data-screen="s"
//                                         optional: several screenshots stacked, one shown per point
//   <video data-hl-video> + point data-t="12.5"
//                                         optional: a screen recording drives the highlight instead of
//                                         the timer; each point starts at its data-t second
//
// Without a video the points cycle on a timer while the showcase is on screen, and stop for good
// once the visitor clicks one.
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function hasKey(el, attr, k) {
    return (el.getAttribute(attr) || '').split(' ').indexOf(k) !== -1;
  }

  document.querySelectorAll('[data-hl-root]').forEach(function (root) {
    var points = Array.prototype.slice.call(root.querySelectorAll('[data-hl-point]'));
    if (!points.length) return;
    var keys = points.map(function (p) { return p.getAttribute('data-hl-point'); });
    var targets = root.querySelectorAll('[data-hl-target]');
    var screens = root.querySelectorAll('[data-hl-screen]');
    var screenWrap = root.querySelector('.hl-screens');
    var video = root.querySelector('video[data-hl-video]');
    var current = -1;

    function apply(i) {
      if (i === current) return;
      current = i;
      var k = keys[i];
      var screen = points[i].getAttribute('data-screen');
      points.forEach(function (p, j) {
        p.classList.toggle('is-active', j === i);
        if (p.tagName === 'BUTTON') p.setAttribute('aria-pressed', j === i ? 'true' : 'false');
      });
      targets.forEach(function (t) { t.classList.toggle('is-active', hasKey(t, 'data-hl-target', k)); });
      if (screen && screens.length) {
        screens.forEach(function (s) { s.classList.toggle('is-active', s.getAttribute('data-hl-screen') === screen); });
        if (screenWrap) screenWrap.classList.add('has-active');
      }
    }

    if (video) {
      var times = points.map(function (p) { return parseFloat(p.getAttribute('data-t')) || 0; });
      video.addEventListener('timeupdate', function () {
        var i = 0;
        times.forEach(function (t, j) { if (video.currentTime >= t) i = j; });
        apply(i);
      });
      points.forEach(function (p, j) {
        p.addEventListener('click', function () {
          video.currentTime = times[j];
          var play = video.play && video.play();
          if (play && play.catch) play.catch(function () {});
        });
      });
      apply(0);
      return;
    }

    var delay = parseInt(root.getAttribute('data-hl-delay'), 10) || 3400;
    var timer = null;
    var pinned = false;
    var visible = false;
    var hovering = false;

    function stop() { clearInterval(timer); timer = null; }
    function start() {
      if (reduce || pinned || hovering || !visible || timer) return;
      timer = setInterval(function () { apply((current + 1) % keys.length); }, delay);
    }

    points.forEach(function (p, j) {
      p.addEventListener('mouseenter', function () { apply(j); });
      p.addEventListener('focus', function () { apply(j); });
      p.addEventListener('click', function () { pinned = true; stop(); apply(j); });
    });
    root.addEventListener('mouseenter', function () { hovering = true; stop(); });
    root.addEventListener('mouseleave', function () { hovering = false; start(); });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          visible = e.isIntersecting;
          if (visible) start(); else stop();
        });
      }, { threshold: 0.25 }).observe(root);
    } else {
      visible = true;
      start();
    }
    apply(0);
  });
})();
