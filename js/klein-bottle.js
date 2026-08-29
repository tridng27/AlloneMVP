  // Klein bottle — real parametric 3D model (the classic "figure-8" immersion), not a
  // flat SVG approximation. Wireframe meridians/parallels + a few highlighted lines
  // carry traveling "spark" dots (data points) with a short fading trail.
  (function () {
    if (typeof THREE === "undefined") return;
    var stage = document.getElementById("kleinStage");
    if (!stage || stage.clientWidth === 0 || stage.clientHeight === 0) return;

    function kleinPoint(u, v) {
      var cu = Math.cos(u), su = Math.sin(u);
      var x, y;
      if (u < Math.PI) {
        x = 6 * cu * (1 + su) + 4 * (1 - cu / 2) * cu * Math.cos(v);
        y = 16 * su + 4 * (1 - cu / 2) * su * Math.cos(v);
      } else {
        x = 6 * cu * (1 + su) + 4 * (1 - cu / 2) * Math.cos(v + Math.PI);
        y = 16 * su;
      }
      var z = 4 * (1 - cu / 2) * Math.sin(v);
      return [x, y, z];
    }

    // sample the surface once to find a center/scale that frames it consistently
    var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity, minZ = Infinity, maxZ = -Infinity;
    for (var si = 0; si <= 40; si++) {
      for (var sj = 0; sj <= 40; sj++) {
        var sp = kleinPoint((si / 40) * Math.PI * 2, (sj / 40) * Math.PI * 2);
        minX = Math.min(minX, sp[0]); maxX = Math.max(maxX, sp[0]);
        minY = Math.min(minY, sp[1]); maxY = Math.max(maxY, sp[1]);
        minZ = Math.min(minZ, sp[2]); maxZ = Math.max(maxZ, sp[2]);
      }
    }
    var cx = (minX + maxX) / 2, cy = (minY + maxY) / 2, cz = (minZ + maxZ) / 2;
    var extent = Math.max(maxX - minX, maxY - minY, maxZ - minZ);
    var scale = 14 / extent;

    function toVec(u, v) {
      var p = kleinPoint(u, v);
      return new THREE.Vector3((p[0] - cx) * scale, (p[1] - cy) * scale, (p[2] - cz) * scale);
    }

    function cssColor(name, fallback) {
      var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return v || fallback;
    }

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(38, stage.clientWidth / stage.clientHeight, 0.1, 100);
    camera.position.set(0, -1, 26);
    camera.lookAt(0, 0, 0);

    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (e) { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(stage.clientWidth, stage.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.addEventListener("webglcontextlost", function (e) { e.preventDefault(); });
    stage.appendChild(renderer.domElement);

    var group = new THREE.Group();
    scene.add(group);

    // a faint solid surface under the wireframe — pure line art can't show the handle
    // actually looping *through* the body (the hole reads as a flat tangle without it)
    var uDiv = 56, vDiv = 28;
    var surfPositions = [];
    var surfIndices = [];
    for (var su = 0; su <= uDiv; su++) {
      var su_u = (su / uDiv) * Math.PI * 2;
      for (var sv = 0; sv <= vDiv; sv++) {
        var sv_v = (sv / vDiv) * Math.PI * 2;
        var svec = toVec(su_u, sv_v);
        surfPositions.push(svec.x, svec.y, svec.z);
      }
    }
    for (var sa = 0; sa < uDiv; sa++) {
      for (var sb = 0; sb < vDiv; sb++) {
        var s0 = sa * (vDiv + 1) + sb;
        var s1 = s0 + 1;
        var s2 = s0 + (vDiv + 1);
        var s3 = s2 + 1;
        surfIndices.push(s0, s2, s1, s1, s2, s3);
      }
    }
    var surfGeo = new THREE.BufferGeometry();
    surfGeo.setAttribute("position", new THREE.Float32BufferAttribute(surfPositions, 3));
    surfGeo.setIndex(surfIndices);
    var surfMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false });
    group.add(new THREE.Mesh(surfGeo, surfMat));

    // WebGL renders THREE.Line at a fixed ~1 device pixel no matter what opacity
    // or color you set (linewidth is ignored on nearly every platform) — on a
    // canvas this small that 1px hairline anti-aliases down to almost nothing.
    // Building the wireframe as thin solid tubes instead gives it real
    // screen-space thickness so the white/black color actually reads.
    function buildTubeLine(pts, closed, radius) {
      var curve = new THREE.CatmullRomCurve3(pts, closed);
      var mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 });
      var geo = new THREE.TubeGeometry(curve, pts.length, radius, 5, closed);
      group.add(new THREE.Mesh(geo, mat));
      return mat;
    }

    var uLines = 14, vLines = 7, uSeg = 80, vSeg = 60, lineRadius = 0.032;
    var meshLines = [];
    for (var iu = 0; iu < uLines; iu++) {
      var u = (iu / uLines) * Math.PI * 2;
      var pts = [];
      for (var j = 0; j < vSeg; j++) pts.push(toVec(u, (j / vSeg) * Math.PI * 2));
      meshLines.push(buildTubeLine(pts, true, lineRadius));
    }
    for (var iv = 0; iv < vLines; iv++) {
      var v = (iv / vLines) * Math.PI * 2;
      var pts2 = [];
      for (var k = 0; k <= uSeg; k++) pts2.push(toVec((k / uSeg) * Math.PI * 2, v));
      meshLines.push(buildTubeLine(pts2, false, lineRadius));
    }

    // sparks run the length of the tube (fixed v, sweeping u top-to-bottom-and-back)
    // rather than around a single cross-section ring — reads as vertical motion along
    // the bottle's lines instead of a small horizontal circling loop.
    //
    // The figure-8 immersion glues u=0 to u=2*PI with the cross-section flipped
    // (v -> PI - v), not identity — that's the Klein bottle's non-orientable twist.
    // A spark held at a fixed v therefore hits a real seam (a jump) every time u wraps.
    // Fix: treat one full period as two laps of u — lap 0 at v, lap 1 at PI - v — so the
    // end of every lap lands exactly on the start of the next with no discontinuity.
    var sparkDefs = [
      { v: 0.0, cssVar: "--brand", fallback: "#0f6fc4" },
      { v: Math.PI * 0.66, cssVar: "--warm", fallback: "#b96a26" },
      { v: Math.PI * 1.33, cssVar: "--brand-strong", fallback: "#0a57a3" }
    ];
    var sparks = [];
    sparkDefs.forEach(function (def, idx) {
      // guide line traces the full two-lap closed loop so it reads as one
      // continuous ring around the bottle instead of an open arc with a gap
      var pts = [];
      for (var j2 = 0; j2 <= uSeg; j2++) pts.push(toVec((j2 / uSeg) * Math.PI * 2, def.v));
      for (var j3 = 1; j3 <= uSeg; j3++) pts.push(toVec((j3 / uSeg) * Math.PI * 2, Math.PI - def.v));
      var lineMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.85 });
      group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat));

      var dots = [];
      for (var d = 0; d < 3; d++) {
        var dotMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 1 - d * 0.32 });
        var mesh = new THREE.Mesh(new THREE.SphereGeometry(0.32 - d * 0.07, 10, 10), dotMat);
        group.add(mesh);
        dots.push({ mesh: mesh, mat: dotMat });
      }
      sparks.push({ v: def.v, cssVar: def.cssVar, fallback: def.fallback, lineMat: lineMat, dots: dots, speed: 0.16 + idx * 0.045 });
    });

    function isDarkMode() {
      var explicit = document.documentElement.getAttribute("data-theme");
      if (explicit === "dark") return true;
      if (explicit === "light") return false;
      return !!(window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches);
    }

    function applyTheme() {
      // plain black/white reads reliably against either background —
      // the themed line tokens (--line-strong, --ink-soft) were too low-contrast here.
      var lineColor = new THREE.Color(isDarkMode() ? 0xffffff : 0x000000);
      meshLines.forEach(function (m) { m.color.copy(lineColor); });
      surfMat.color.copy(new THREE.Color(cssColor("--brand-tint", "#e7f1fa")));
      sparks.forEach(function (s) {
        var c = new THREE.Color(cssColor(s.cssVar, s.fallback));
        s.lineMat.color.copy(c);
        s.dots.forEach(function (d) { d.mat.color.copy(c); });
      });
    }
    applyTheme();

    var themeToggleBtn = document.getElementById("themeToggle");
    if (themeToggleBtn) themeToggleBtn.addEventListener("click", function () { setTimeout(applyTheme, 0); });
    if (window.matchMedia) {
      try { matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applyTheme); } catch (e) {}
    }

    var reduceMotion = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    var clock = new THREE.Clock();
    function renderFrame() {
      var t = clock.getElapsedTime();
      if (!reduceMotion) group.rotation.y = t * 0.16;
      sparks.forEach(function (s) {
        s.dots.forEach(function (d, idx) {
          var raw = reduceMotion ? (idx * 0.2) : (t * s.speed - idx * 0.09);
          var cycle = ((raw % 2) + 2) % 2;  // 0..2 — one closed loop spans two laps of u
          var lap = cycle < 1 ? 0 : 1;
          var p = cycle - lap;              // 0..1 progress within the current lap
          var vEff = lap === 0 ? s.v : (Math.PI - s.v);
          d.mesh.position.copy(toVec(p * Math.PI * 2, vEff));
        });
      });
      renderer.render(scene, camera);
    }
    if (reduceMotion) {
      group.rotation.y = 0.5;
      renderFrame();
    } else {
      (function animate() {
        requestAnimationFrame(animate);
        renderFrame();
      })();
    }

    if (window.ResizeObserver) {
      new ResizeObserver(function () {
        if (stage.clientWidth === 0 || stage.clientHeight === 0) return;
        camera.aspect = stage.clientWidth / stage.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(stage.clientWidth, stage.clientHeight);
        if (reduceMotion) renderFrame();
      }).observe(stage);
    }
  })();
