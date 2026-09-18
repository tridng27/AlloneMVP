  // Hero hub — the nine AllOne modules wired into the platform at the centre of a
  // wider mesh of data nodes. Each module spoke is a pipeline with a bright
  // highlight running along it into (or out of) the AllOne mark.
  // Three colours: logo blue for the mesh, pipes and nodes; the page ink colour
  // for the labels; bright orange for whatever is moving.
  // Everything that carries colour is rebuilt when the light/dark theme changes,
  // because the labels are canvas textures and cannot inherit CSS.
  // The rail below works on its own if WebGL is unavailable, so the hero never
  // renders empty.
  (function () {
    var stage = document.getElementById("flowStage");
    var label = document.getElementById("flowLabel");
    var track = document.getElementById("flowTrack");
    if (!stage || !label || !track) return;

    var STEPS = [
      { name: "Quản trị dựa trên dữ liệu", ai: false },
      { name: "AI đồng hành ra quyết định", ai: true },
      { name: "Tối ưu theo đặc thù vận hành", ai: false }
    ];

    var dots = Array.prototype.slice.call(track.querySelectorAll(".fr-dot"));
    var active = 0;
    var since = 0;      // ms since the last automatic advance
    var hold = 0;       // pause after a manual pick
    var CYCLE = 3400;
    var paint3d = null; // set once the WebGL scene exists

    function setStep(i) {
      active = i;
      dots.forEach(function (d, n) { d.classList.toggle("is-active", n === i); });
      label.textContent = STEPS[i].name;
      label.classList.toggle("is-ai", STEPS[i].ai);
      if (paint3d) paint3d();
    }

    dots.forEach(function (d, n) {
      d.addEventListener("click", function () {
        setStep(n);
        since = 0;
        hold = 2600;
      });
    });

    setStep(0);

    if (typeof THREE === "undefined") return;
    if (!stage.clientWidth || !stage.clientHeight) return;

    var MODULES = ["Omnichannel", "CRM", "HRM", "SAP", "sERP", "IMS", "EMS", "LMS", "AI"];
    var AI_INDEX = MODULES.indexOf("AI");

    // dark is the page default; light is the explicit opt-in, same rule as the CSS
    var PALETTES = {
      dark: {
        mesh: "#1d5f97",
        hot: "#ff8a3d", label: "#ffffff", labelAI: "#ffb583", halo: "#0a1017",
        glow: "#2a8fd8", glowOpacity: 0.55, meshOpacity: 0.3, dotOpacity: 0.9,
        additive: true,
        // one hue per data node, kept inside the brand's blue-to-amber range so
        // the variety reads as deliberate rather than as confetti
        dots: ["#63b3ec", "#2f93da", "#4fd1c5", "#9ad6ff", "#8b9fe8",
               "#ff8a3d", "#ffc06b", "#c8a6f0", "#5fe0a8", "#ffffff"],
        // MODULES order: Omnichannel, CRM, HRM, SAP, sERP, IMS, EMS, LMS, AI
        modules: ["#4fd1c5", "#63b3ec", "#8b9fe8", "#5fe0a8", "#9ad6ff",
                  "#ffc06b", "#c8a6f0", "#f48fb1", "#ff8a3d"]
      },
      light: {
        mesh: "#a8cae6",
        hot: "#e2690f", label: "#0c1a2b", labelAI: "#a4560f", halo: "#f5f8fb",
        glow: "#8fc4ea", glowOpacity: 0.5, meshOpacity: 0.55, dotOpacity: 0.95,
        additive: false,
        dots: ["#0a57a3", "#0f6fc4", "#0f9184", "#2f7fb8", "#5568c8",
               "#e2690f", "#c77f16", "#7f52c0", "#128a5e", "#24405c"],
        modules: ["#0f9184", "#0f6fc4", "#4a5fc1", "#0d8a5a", "#2f7fb8",
                  "#b7791f", "#7f52c0", "#c0396b", "#e2690f"]
      }
    };

    function currentTheme() {
      return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
    }
    var PAL = PALETTES[currentTheme()];

    var RING = 4.55, TILT = 0.72, LABEL_LIFT = 0.92;
    var WEB_MIN = 2.1, WEB_MAX = 5.9, WEB_COUNT = 150;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0, 23.5);
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

    var tiltGroup = new THREE.Group();
    tiltGroup.rotation.x = -TILT;
    scene.add(tiltGroup);
    var spin = new THREE.Group();
    tiltGroup.add(spin);

    // ---- helpers -----------------------------------------------------------
    function radialTexture(hex) {
      var c = document.createElement("canvas");
      c.width = c.height = 128;
      var ctx = c.getContext("2d");
      var g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      g.addColorStop(0, hex + "cc");
      g.addColorStop(0.45, hex + "3a");
      g.addColorStop(1, hex + "00");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 128, 128);
      var t = new THREE.CanvasTexture(c);
      t.needsUpdate = true;
      return t;
    }

    function discTexture() {
      var c = document.createElement("canvas");
      c.width = c.height = 64;
      var ctx = c.getContext("2d");
      var g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.58, "rgba(255,255,255,1)");
      g.addColorStop(0.8, "rgba(255,255,255,0.5)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 64, 64);
      var t = new THREE.CanvasTexture(c);
      t.needsUpdate = true;
      return t;
    }
    var DISC = null;   // built once, shared by the data nodes and the traffic

    function labelTexture(text, isAI) {
      var dpr = 2, fs = 30 * dpr;
      var c = document.createElement("canvas");
      var ctx = c.getContext("2d");
      var font = '600 ' + fs + 'px Inter, -apple-system, "Segoe UI", Roboto, sans-serif';
      ctx.font = font;
      var w = Math.ceil(ctx.measureText(text).width) + 28 * dpr;
      var h = Math.ceil(fs * 1.5);
      c.width = w; c.height = h;
      ctx = c.getContext("2d");           // resizing resets the context state
      ctx.font = font;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      // a halo in the page ground colour keeps the label legible over the mesh
      ctx.lineJoin = "round";
      ctx.lineWidth = 7 * dpr;
      ctx.strokeStyle = PAL.halo;
      ctx.globalAlpha = 0.75;
      ctx.strokeText(text, w / 2, h / 2);
      ctx.globalAlpha = 1;
      ctx.fillStyle = isAI ? PAL.labelAI : PAL.label;
      ctx.fillText(text, w / 2, h / 2);
      var tex = new THREE.CanvasTexture(c);
      tex.minFilter = THREE.LinearFilter;
      tex.needsUpdate = true;
      return { tex: tex, ratio: w / h };
    }

    // deterministic layout, so the mesh looks the same on every load
    var seed = 20260918;
    function rnd() {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    }

    // ---- centre: the AllOne mark, always facing the reader -----------------
    var glowMat = new THREE.SpriteMaterial({ transparent: true, depthTest: false, depthWrite: false });
    var glow = new THREE.Sprite(glowMat);
    glow.scale.set(7.2, 7.2, 1);
    glow.renderOrder = 1;
    scene.add(glow);

    var hub = new THREE.Sprite(new THREE.SpriteMaterial({ transparent: true, depthTest: false }));
    hub.scale.set(2.75, 2.75, 1);
    hub.renderOrder = 5;
    scene.add(hub);

    var logoSrc = stage.getAttribute("data-logo");
    if (logoSrc) {
      new THREE.TextureLoader().load(logoSrc, function (tex) {
        hub.material.map = tex;
        hub.material.needsUpdate = true;
        render();
      });
    }

    // ---- the nine module nodes and their pipelines -------------------------
    var nodeGeo = new THREE.SphereGeometry(0.32, 18, 18);
    var UP = new THREE.Vector3(0, 1, 0);
    var nodes = [];

    for (var i = 0; i < MODULES.length; i++) {
      var a = (i / MODULES.length) * Math.PI * 2 - Math.PI / 2;
      var pos = new THREE.Vector3(
        Math.cos(a) * RING,
        Math.sin(i * 2.7) * 0.36,          // a little depth so the ring is not a disc
        Math.sin(a) * RING
      );
      var isAI = i === AI_INDEX;

      var node = new THREE.Mesh(nodeGeo, new THREE.MeshBasicMaterial({ color: 0xffffff }));
      node.position.copy(pos);
      node.renderOrder = 3;
      spin.add(node);

      var len = pos.length();
      var pipeMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.55 });
      var pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, len, 8, 1, true), pipeMat);
      pipe.position.copy(pos).multiplyScalar(0.5);
      pipe.quaternion.setFromUnitVectors(UP, pos.clone().normalize());
      spin.add(pipe);

      var hlMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95, depthWrite: false });
      var hl = new THREE.Mesh(new THREE.CylinderGeometry(0.072, 0.072, 1.15, 8, 1, true), hlMat);
      hl.quaternion.copy(pipe.quaternion);
      hl.renderOrder = 4;
      spin.add(hl);

      var sparkMat = new THREE.SpriteMaterial({ transparent: true, opacity: 0.9, depthWrite: false });
      var spark = new THREE.Sprite(sparkMat);
      spark.scale.set(1.4, 1.4, 1);
      spark.renderOrder = 4;
      spin.add(spark);

      var sprite = new THREE.Sprite(new THREE.SpriteMaterial({ transparent: true, depthTest: false }));
      sprite.renderOrder = 6;
      spin.add(sprite);

      nodes.push({
        pos: pos, node: node, pipeMat: pipeMat, hl: hl, hlMat: hlMat,
        spark: spark, sparkMat: sparkMat, sprite: sprite, labelHeight: 0.56,
        isAI: isAI, index: i, along: 1 - i / MODULES.length, text: MODULES[i]
      });
    }

    // ---- the wider data mesh ----------------------------------------------
    // points scattered through a shell around the hub, each wired to its two
    // nearest neighbours and to the module it sits closest to
    var web = [];
    for (var w = 0; w < WEB_COUNT; w++) {
      var u = rnd() * 2 - 1;
      var th = rnd() * Math.PI * 2;
      var rr = WEB_MIN + Math.pow(rnd(), 0.62) * (WEB_MAX - WEB_MIN);
      var s = Math.sqrt(1 - u * u);
      web.push(new THREE.Vector3(Math.cos(th) * s * rr, u * rr * 0.72, Math.sin(th) * s * rr));
    }

    var webPos = [], webHue = [];
    web.forEach(function (p) {
      webPos.push(p.x, p.y, p.z);
      webHue.push(Math.floor(rnd() * PALETTES.dark.dots.length));
    });
    var webGeo = new THREE.BufferGeometry();
    webGeo.setAttribute("position", new THREE.Float32BufferAttribute(webPos, 3));
    webGeo.setAttribute("color", new THREE.Float32BufferAttribute(new Float32Array(web.length * 3), 3));
    DISC = discTexture();
    var dotMat = new THREE.PointsMaterial({
      size: 0.2, sizeAttenuation: true, transparent: true,
      vertexColors: true, map: DISC, alphaTest: 0.02, depthWrite: false
    });
    spin.add(new THREE.Points(webGeo, dotMat));

    var linkPts = [], links = [];
    function addLink(p, q) {
      linkPts.push(p.x, p.y, p.z, q.x, q.y, q.z);
      links.push([p, q]);
    }

    for (var n1 = 0; n1 < web.length; n1++) {
      var best = [];
      for (var n2 = 0; n2 < web.length; n2++) {
        if (n1 === n2) continue;
        best.push([web[n1].distanceTo(web[n2]), n2]);
      }
      best.sort(function (x, y) { return x[0] - y[0]; });
      for (var k = 0; k < 2; k++) {
        if (best[k] && best[k][1] > n1) addLink(web[n1], web[best[k][1]]);
      }
      // and a tie into the nearest module, so the mesh reads as one structure
      var nearest = 0, nd = Infinity;
      for (var m = 0; m < nodes.length; m++) {
        var d = web[n1].distanceTo(nodes[m].pos);
        if (d < nd) { nd = d; nearest = m; }
      }
      if (nd < 3.1) addLink(web[n1], nodes[nearest].pos);
    }

    var meshGeo = new THREE.BufferGeometry();
    meshGeo.setAttribute("position", new THREE.Float32BufferAttribute(linkPts, 3));
    var meshMat = new THREE.LineBasicMaterial({ transparent: true });
    spin.add(new THREE.LineSegments(meshGeo, meshMat));

    // traffic riding the mesh, so the web is not static either
    var TRAFFIC = 26;
    var traffic = [];
    for (var tk = 0; tk < TRAFFIC; tk++) {
      traffic.push({ link: links[Math.floor(rnd() * links.length)], t: rnd(), speed: 0.12 + rnd() * 0.22 });
    }
    var trafficGeo = new THREE.BufferGeometry();
    trafficGeo.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(TRAFFIC * 3), 3));
    var trafficMat = new THREE.PointsMaterial({
      size: 0.17, sizeAttenuation: true, transparent: true, opacity: 0.95,
      map: DISC, depthWrite: false
    });
    spin.add(new THREE.Points(trafficGeo, trafficMat));

    // ---- theme ------------------------------------------------------------
    function applyTheme() {
      PAL = PALETTES[currentTheme()];
      var blend = PAL.additive ? THREE.AdditiveBlending : THREE.NormalBlending;

      glowMat.map = radialTexture(PAL.glow);
      glowMat.opacity = PAL.glowOpacity;
      glowMat.blending = blend;
      glowMat.needsUpdate = true;

      dotMat.opacity = PAL.dotOpacity;
      var ca = webGeo.attributes.color, tint = new THREE.Color();
      for (var d = 0; d < webHue.length; d++) {
        tint.set(PAL.dots[webHue[d] % PAL.dots.length]);
        ca.setXYZ(d, tint.r, tint.g, tint.b);
      }
      ca.needsUpdate = true;
      meshMat.color.set(PAL.mesh);
      meshMat.opacity = PAL.meshOpacity;
      trafficMat.color.set(PAL.hot);

      nodes.forEach(function (it) {
        var hue = PAL.modules[it.index % PAL.modules.length];
        it.node.material.color.set(hue);
        it.pipeMat.color.set(hue);
        it.hlMat.color.set(hue);
        it.hlMat.blending = blend;
        it.hlMat.needsUpdate = true;
        it.sparkMat.map = radialTexture(hue);
        it.sparkMat.blending = blend;
        it.sparkMat.opacity = PAL.additive ? 0.9 : 0.55;
        it.sparkMat.needsUpdate = true;

        var lab = labelTexture(it.text, it.isAI);
        it.sprite.material.map = lab.tex;
        it.sprite.material.needsUpdate = true;
        it.sprite.scale.set(it.labelHeight * lab.ratio, it.labelHeight, 1);
      });

      if (paint3d) paint3d();
      render();
    }

    new MutationObserver(function (list) {
      for (var i2 = 0; i2 < list.length; i2++) {
        if (list[i2].attributeName === "data-theme") { applyTheme(); return; }
      }
    }).observe(document.documentElement, { attributes: true });

    // the webfont usually lands after the first paint — redraw the labels then
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(applyTheme);
    }

    // ---- per-stage behaviour ----------------------------------------------
    // 0: everything feeds the platform  1: AI pushes back out  2: a phased rollout
    var flowDir = 1, gated = false;

    paint3d = function () {
      flowDir = active === 1 ? -1 : 1;
      gated = active === 2;
      glowMat.opacity = PAL.glowOpacity * (active === 1 ? 1.45 : 1);
    };

    function render() { renderer.render(scene, camera); }

    function resize() {
      var w2 = stage.clientWidth, h2 = stage.clientHeight;
      if (!w2 || !h2) return;
      renderer.setSize(w2, h2);
      camera.aspect = w2 / h2;
      camera.updateProjectionMatrix();
      render();
    }

    var t = 0, last = 0;
    var world = new THREE.Vector3();
    var tmp = new THREE.Vector3();

    function frame(now) {
      var dt = last ? Math.min(now - last, 64) : 16;
      last = now;
      t += dt;

      spin.rotation.y = t / 26000;
      tiltGroup.position.y = Math.sin(t / 3000) * 0.12;

      var sweep = (t / 900) % nodes.length;   // which module the rollout is on

      for (var n = 0; n < nodes.length; n++) {
        var it = nodes[n];

        // the highlight carries its own position along the pipe, 1 = at the
        // module and 0 = at the hub. Reversing only flips the sign, so switching
        // stage turns it around from where it is instead of teleporting it.
        it.along -= flowDir * dt / 2600;
        if (it.along > 1) it.along -= 1;
        else if (it.along < 0) it.along += 1;
        var along = it.along;
        it.hl.position.copy(it.pos).multiplyScalar(along);
        it.spark.position.copy(it.hl.position);
        // it leaves the node and is absorbed by the hub, rather than stopping dead
        var ends = Math.min(1, Math.min(along, 1 - along) / 0.16);

        // on the rollout stage only the modules the sweep is passing stay lit
        var ring = nodes.length;
        var gap = Math.min((sweep - n + ring) % ring, (n - sweep + ring) % ring);
        var lit = !gated || gap < 1.5;
        var fade = lit ? 1 : 0.16;

        // fade whatever sits behind the hub so the centre stays readable
        it.sprite.getWorldPosition(world);
        var front = 0.35 + 0.65 * (world.z + RING) / (2 * RING);

        it.hlMat.opacity = 0.95 * fade * ends;
        it.sparkMat.opacity = (PAL.additive ? 0.9 : 0.55) * fade * ends;
        it.sprite.material.opacity = Math.max(0.25, Math.min(1, front)) * (lit ? 1 : 0.4);
        it.pipeMat.opacity = (active === 1 ? 0.75 : 0.55) * (lit ? 1 : 0.3);

        it.sprite.position.set(it.pos.x, it.pos.y + LABEL_LIFT, it.pos.z);
        var target = lit ? 1 : 0.7;
        it.node.scale.setScalar(it.node.scale.x + (target - it.node.scale.x) * 0.1);
      }

      // mesh traffic
      var tp = trafficGeo.attributes.position;
      for (var q = 0; q < traffic.length; q++) {
        var car = traffic[q];
        car.t += car.speed * dt / 1000;
        if (car.t > 1) {
          car.t = 0;
          car.link = links[Math.floor(rnd() * links.length)];
        }
        tmp.lerpVectors(car.link[0], car.link[1], car.t);
        tp.setXYZ(q, tmp.x, tmp.y, tmp.z);
      }
      tp.needsUpdate = true;

      // the hub answers every arrival
      var beat = 1 + Math.sin(t / 650) * 0.035;
      hub.scale.set(2.75 * beat, 2.75 * beat, 1);
      glow.scale.set(7.2 * beat, 7.2 * beat, 1);

      if (hold > 0) {
        hold -= dt;
      } else {
        since += dt;
        if (since >= CYCLE) { since = 0; setStep((active + 1) % 3); }
      }

      render();
      requestAnimationFrame(frame);
    }

    applyTheme();
    resize();

    if (window.ResizeObserver) new ResizeObserver(resize).observe(stage);
    else window.addEventListener("resize", resize);

    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { render(); return; }
    requestAnimationFrame(frame);
  })();
