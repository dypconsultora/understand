/* =========================================================
   UNDERSTAND STUDIO — sistema de movimiento (GSAP 3.15)
   ScrollSmoother · ScrollTrigger · SplitText · ScrambleText · DrawSVG
   ========================================================= */
(() => {
  "use strict";

  const html = document.documentElement;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const NS = "http://www.w3.org/2000/svg";

  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     Modo día / noche (funciona aunque falle la CDN)
     --------------------------------------------------------- */
  (function theme() {
    const btn = $("#theme-toggle");
    if (!btn) return;
    const meta = $('meta[name="theme-color"]');
    const noMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sync = () => {
      const light = html.dataset.theme === "light";
      const tx = window.__T || {};
      btn.setAttribute("aria-label", light ? (tx.toDark || "Activar modo noche") : (tx.toLight || "Activar modo día"));
      if (meta) meta.setAttribute("content", light ? "#f2f2f0" : "#1b1c1f");
    };
    const apply = (t) => {
      html.dataset.theme = t;
      try { localStorage.setItem("understand-theme", t); } catch (e) { /* almacenamiento no disponible */ }
      sync();
    };
    sync();
    btn.addEventListener("click", () => {
      const next = html.dataset.theme === "light" ? "dark" : "light";
      if (!document.startViewTransition || noMotion) { apply(next); return; }
      const r = btn.getBoundingClientRect();
      const x = r.left + r.width / 2;
      const y = r.top + r.height / 2;
      const R = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
      const vt = document.startViewTransition(() => apply(next));
      vt.ready.then(() => {
        html.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${R}px at ${x}px ${y}px)`] },
          { duration: 1000, easing: "cubic-bezier(0.76, 0, 0.24, 1)", pseudoElement: "::view-transition-new(root)" }
        );
      });
    });
  })();

  // Si la CDN falla, el sitio queda usable y estático.
  if (!window.gsap || !window.ScrollTrigger) {
    html.classList.add("is-ready");
    const l = $("#loader");
    if (l) l.remove();
    return;
  }

  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, ScrambleTextPlugin, DrawSVGPlugin);

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let introSeen = false;
  try {
    introSeen = sessionStorage.getItem("understand-intro") === "1";
    sessionStorage.setItem("understand-intro", "1");
  } catch (e) { /* almacenamiento no disponible */ }
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const rnd = gsap.utils.random;
  const pad2 = (n) => String(n).padStart(2, "0");

  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);

  let smoother = null;
  if (!reduce) {
    smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.15,
      effects: true,
      smoothTouch: false,
    });
    smoother.paused(true);
  }

  /* ---------------------------------------------------------
     Scroll a anclas + motivo del formulario
     --------------------------------------------------------- */
  function scrollToTarget(hash) {
    const target = hash === "#top" ? 0 : $(hash);
    if (target === null) return;
    const pos = (target && target.dataset.scrollPos) || "top top";
    if (smoother) {
      smoother.scrollTo(target, true, pos);
    } else {
      const off = parseInt(pos.split(" ")[1], 10) || 0;
      const y = target === 0 ? 0 : target.getBoundingClientRect().top + window.scrollY - off;
      window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
    }
  }

  function setMotivo(value) {
    const select = $("#motivo");
    if (!select) return;
    const opt = [...select.options].find((o) => o.value === value || o.text === value);
    if (opt) {
      select.value = opt.value || opt.text;
      const field = select.closest(".field");
      field.classList.remove("is-flash");
      void field.offsetWidth;
      field.classList.add("is-flash");
    }
  }

  const svgEl = (tag, attrs, parent) => {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  };

  /* ---------------------------------------------------------
     Hero: plano de obra de fondo (líneas de cota + pulsos)
     --------------------------------------------------------- */
  function buildPlan() {
    const svg = $("#plan");
    if (!svg) return { lines: [], pulses: [], marks: [], lbls: [] };
    const H = [[144, 120, 1320], [288, 0, 1440], [468, 260, 1440], [612, 0, 1180], [756, 160, 1300]];
    const V = [[216, 60, 860], [504, 0, 900], [864, 100, 820], [1152, 0, 900], [1332, 200, 780]];
    const lines = [], pulses = [], marks = [], lbls = [];
    H.forEach(([y, a, b], i) => {
      const d = i % 2 ? `M${b} ${y}H${a}` : `M${a} ${y}H${b}`;
      lines.push(svgEl("path", { d, class: "ln" }, svg));
      pulses.push(svgEl("path", { d, class: "pulse" }, svg));
    });
    V.forEach(([x, a, b], i) => {
      const d = i % 2 ? `M${x} ${b}V${a}` : `M${x} ${a}V${b}`;
      lines.push(svgEl("path", { d, class: "ln" }, svg));
      if (i % 2 === 0) pulses.push(svgEl("path", { d, class: "pulse" }, svg));
    });
    // cotas
    const dims = [
      { d: "M504 96H1152M504 88v16M1152 88v16", t: "6.00 m", x: 828, y: 84, r: 0 },
      { d: "M1392 288V612M1384 288h16M1384 612h16", t: "3.00 m", x: 1412, y: 450, r: 90 },
    ];
    dims.forEach((o) => {
      lines.push(svgEl("path", { d: o.d, class: "ln ln--solid" }, svg));
      const t = svgEl("text", { x: o.x, y: o.y, class: "lbl", "text-anchor": "middle", transform: o.r ? `rotate(${o.r} ${o.x} ${o.y})` : "" }, svg);
      t.textContent = o.t;
      lbls.push(t);
    });
    // marcas en los cruces
    H.forEach(([y, a, b]) => V.forEach(([x, c, d]) => {
      if (x >= a && x <= b && y >= c && y <= d && Math.random() > 0.35) {
        marks.push(svgEl("path", { d: `M${x - 6} ${y}h12M${x} ${y - 6}v12`, class: "mark" }, svg));
      }
    }));
    return { lines, pulses, marks, lbls };
  }

  /* ---------------------------------------------------------
     Proceso: stand isométrico generado por código
     --------------------------------------------------------- */
  function buildIso() {
    const svg = $("#iso");
    if (!svg) return null;
    const K = 46, C = 0.866, S = 0.5, OX = 240, OY = 182;
    const P = (x, y, z) => [OX + (x - y) * K * C, OY + (x + y) * K * S - z * K];
    const pt = (p) => P(...p).map((v) => v.toFixed(1)).join(" ");
    const poly = (arr) => "M" + arr.map(pt).join("L") + "Z";
    const line = (arr) => "M" + arr.map(pt).join("L");
    const box = (x, y, z, w, d, h) => ({
      t: poly([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]]),
      l: poly([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]]),
      r: poly([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]]),
      edge: poly([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]]) +
        line([[x, y + d, z + h], [x, y + d, z], [x + w, y + d, z], [x + w, y, z], [x + w, y, z + h]]) +
        line([[x + w, y + d, z], [x + w, y + d, z + h]]),
      foot: poly([[x, y, 0.15], [x + w, y, 0.15], [x + w, y + d, 0.15], [x, y + d, 0.15]]),
    });

    const defs = svgEl("defs", {}, svg);
    const bg = svgEl("linearGradient", { id: "iso-beam", x1: "0", y1: "0", x2: "0", y2: "1" }, defs);
    svgEl("stop", { offset: "0", "stop-color": "#fff1e2", "stop-opacity": "0.75" }, bg);
    svgEl("stop", { offset: "1", "stop-color": "#ffb48f", "stop-opacity": "0" }, bg);
    const sg = svgEl("linearGradient", { id: "iso-screen", x1: "0", y1: "0", x2: "1", y2: "1" }, defs);
    svgEl("stop", { offset: "0", "stop-color": "#96004f" }, sg);
    svgEl("stop", { offset: "0.55", "stop-color": "#e5008e" }, sg);
    svgEl("stop", { offset: "1", "stop-color": "#2a2d33" }, sg);

    const g = (cls) => svgEl("g", { class: cls || "" }, svg);
    const out = { faces: {}, edges: {}, grid: [], dims: [], dimTxt: [] };

    // Cotas
    const gd = g("dims");
    const dimX = line([[0, 4.55, 0], [6, 4.55, 0]]) + line([[0, 4.4, 0], [0, 4.7, 0]]) + line([[6, 4.4, 0], [6, 4.7, 0]]);
    const dimY = line([[6.55, 0, 0], [6.55, 4, 0]]) + line([[6.4, 0, 0], [6.7, 0, 0]]) + line([[6.4, 4, 0], [6.7, 4, 0]]);
    out.dims.push(svgEl("path", { d: dimX, class: "dim" }, gd), svgEl("path", { d: dimY, class: "dim" }, gd));
    const tx = (p, ang, s) => {
      const [x, y] = P(...p);
      const t = svgEl("text", { x: 0, y: 0, class: "dimtxt", "text-anchor": "middle", transform: `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${ang})` }, gd);
      t.textContent = s;
      out.dimTxt.push(t);
    };
    tx([3, 5.0, 0], 30, "6.00 m");
    tx([7.0, 2, 0], -30, "4.00 m");

    // Piso
    const fl = box(0, 0, 0, 6, 4, 0.15);
    const gf = g("floor");
    out.faces.floor = [svgEl("path", { d: fl.l, class: "face l" }, gf), svgEl("path", { d: fl.r, class: "face r" }, gf), svgEl("path", { d: fl.t, class: "face t" }, gf)];
    const gg = g("grid");
    for (let i = 1; i < 6; i++) out.grid.push(svgEl("path", { d: line([[i, 0, 0.15], [i, 4, 0.15]]), class: "gridl" }, gg));
    for (let j = 1; j < 4; j++) out.grid.push(svgEl("path", { d: line([[0, j, 0.15], [6, j, 0.15]]), class: "gridl" }, gg));
    out.edges.floor = svgEl("path", { d: fl.edge, class: "edge" }, svg);

    // Pared de fondo con panel gráfico, pantalla y logo
    const bw = box(0, 0, 0.15, 6, 0.2, 3.0);
    const gb = g("back");
    out.faces.back = [svgEl("path", { d: bw.l, class: "face l" }, gb), svgEl("path", { d: bw.r, class: "face r" }, gb), svgEl("path", { d: bw.t, class: "face t" }, gb)];
    out.panel = svgEl("path", { d: poly([[0.3, 0.2, 0.45], [5.7, 0.2, 0.45], [5.7, 0.2, 3.0], [0.3, 0.2, 3.0]]), class: "panel" }, gb);
    const scr = poly([[3.4, 0.2, 1.0], [5.35, 0.2, 1.0], [5.35, 0.2, 2.4], [3.4, 0.2, 2.4]]);
    out.screen = svgEl("path", { d: scr, class: "screen" }, gb);
    out.screenOn = svgEl("path", { d: scr, class: "screen-on" }, gb);
    // Logo real proyectado sobre el plano de la pared (eje x → (c, s), eje z → abajo)
    const LW = 2.6, LH = LW * 370 / 1600, LX = 0.6, LZ = 2.75;
    const [ox, oy] = P(LX, 0.2, LZ);
    const gl0 = svgEl("g", { transform: `matrix(${(K * C).toFixed(3)} ${(K * S).toFixed(3)} 0 ${K} ${ox.toFixed(1)} ${oy.toFixed(1)})` }, gb);
    const clip = svgEl("clipPath", { id: "iso-logo-clip", clipPathUnits: "userSpaceOnUse" }, defs);
    out.logoClip = svgEl("rect", { x: 0, y: -0.1, width: 0, height: LH + 0.2 }, clip);
    out.logoLine = svgEl("image", { href: "assets/img/logo.png", x: 0, y: 0, width: LW, height: LH, class: "logo-img", "clip-path": "url(#iso-logo-clip)", preserveAspectRatio: "none" }, gl0);
    out.logoW = LW;
    const [dx, dy] = P(LX + LW * 0.865, 0.2, LZ - LH * 0.496);
    out.logoDot = svgEl("circle", { cx: dx.toFixed(1), cy: dy.toFixed(1), r: 4.5, class: "logo-dot" }, gb);
    out.edges.back = svgEl("path", { d: bw.edge, class: "edge" }, svg);

    // Pared lateral
    const sw = box(0, 0.2, 0.15, 0.2, 3.8, 3.0);
    const gs = g("side");
    out.faces.side = [svgEl("path", { d: sw.l, class: "face l" }, gs), svgEl("path", { d: sw.r, class: "face r" }, gs), svgEl("path", { d: sw.t, class: "face t" }, gs)];
    out.edges.side = svgEl("path", { d: sw.edge, class: "edge" }, svg);

    // Luces sobre la pared de fondo
    const gl = g("lights");
    out.beams = []; out.spots = []; out.lamps = [];
    [1.3, 3.0, 4.7].forEach((x) => {
      const cx = x + 0.4, cy = 2.1, r = 0.62;
      const [lx, ly] = P(x, 0.3, 3.15);
      const a = P(cx + r, cy - r, 0.15), b = P(cx - r, cy + r, 0.15);
      out.beams.push(svgEl("path", { d: `M${lx.toFixed(1)} ${ly.toFixed(1)}L${a[0].toFixed(1)} ${a[1].toFixed(1)}L${b[0].toFixed(1)} ${b[1].toFixed(1)}Z`, class: "beam" }, gl));
      const [sx, sy] = P(cx, cy, 0.15);
      out.spots.push(svgEl("ellipse", { cx: sx.toFixed(1), cy: sy.toFixed(1), rx: (0.9 * K * 1.2247).toFixed(1), ry: (0.9 * K * 0.707).toFixed(1), fill: "rgba(255,225,200,0.16)" }, gl));
      out.lamps.push(svgEl("circle", { cx: lx.toFixed(1), cy: ly.toFixed(1), r: 4.5, class: "lamp" }, svg));
    });

    // Piezas que se fabrican y se montan: mostrador y tótem
    const piece = (b, cls, extra) => {
      const shadow = svgEl("path", { d: b.foot, class: "shadow" }, svg);
      const wire = svgEl("path", { d: b.edge, class: "edge" }, svg);
      const ghost = svgEl("path", { d: b.edge, class: "ghost" }, svg);
      const gp = g("piece " + cls);
      svgEl("path", { d: b.l, class: "face l" }, gp);
      svgEl("path", { d: b.r, class: "face r" }, gp);
      svgEl("path", { d: b.t, class: "face t" }, gp);
      if (extra) extra(gp);
      return { shadow, wire, ghost, g: gp };
    };
    out.counter = piece(box(1.6, 2.5, 0.15, 2.0, 0.7, 1.05), "counter", (gp) => {
      svgEl("path", { d: poly([[1.6, 3.2, 0.55], [3.6, 3.2, 0.55], [3.6, 3.2, 0.75], [1.6, 3.2, 0.75]]), class: "stripe" }, gp);
    });
    out.totem = piece(box(4.9, 2.9, 0.15, 0.6, 0.6, 3.0), "totem", (gp) => {
      const [cx, cy] = P(5.2, 3.5, 2.75);
      svgEl("circle", { cx: cx.toFixed(1), cy: cy.toFixed(1), r: 7, fill: "none", stroke: "#fff", "stroke-width": 2 }, gp);
    });
    return out;
  }

  function isoTimeline(iso) {
    const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } });
    const structEdges = [iso.edges.floor, iso.edges.back, iso.edges.side];
    const wires = [iso.counter.wire, iso.totem.wire];
    const ghosts = [iso.counter.ghost, iso.totem.ghost];
    const pieces = [iso.counter.g, iso.totem.g];
    const shadows = [iso.counter.shadow, iso.totem.shadow];
    const faces = [...iso.faces.floor, ...iso.faces.back, ...iso.faces.side];

    gsap.set([...faces, iso.panel, iso.screen, iso.screenOn, ...ghosts, ...pieces, ...shadows, ...iso.beams, ...iso.spots, ...iso.dimTxt], { opacity: 0 });
    gsap.set(iso.logoDot, { scale: 0, transformOrigin: "50% 50%" });
    gsap.set(shadows, { scale: 0.6, transformOrigin: "50% 50%" });
    gsap.set([...structEdges, ...wires, ...iso.grid, ...iso.dims], { drawSVG: "0%" });

    // 01 · Diseño: cotas, grilla y estructura en línea
    tl.to(iso.dims, { drawSVG: "100%", duration: 0.55, stagger: 0.12 }, 0)
      .to(iso.dimTxt, { opacity: 1, duration: 0.25, stagger: 0.1 }, 0.3)
      .to(iso.grid, { drawSVG: "100%", duration: 0.45, stagger: 0.035 }, 0.05)
      .to([...structEdges, ...wires], { drawSVG: "100%", duration: 0.65, stagger: 0.07 }, 0.15)
    // 02 · Desarrollo: superficies, panel gráfico y logo
      .to(faces, { opacity: 1, duration: 0.45, stagger: 0.04 }, 1.0)
      .to([iso.panel, iso.screen], { opacity: 1, duration: 0.3 }, 1.3)
      .to(iso.logoClip, { attr: { width: iso.logoW }, duration: 0.45, ease: "power2.inOut" }, 1.45)
      .to(structEdges, { opacity: 0.18, duration: 0.3 }, 1.5)
      .to([...iso.dims, ...iso.dimTxt], { opacity: 0.35, duration: 0.3 }, 1.6)
      .to(iso.grid, { opacity: 0.35, duration: 0.3 }, 1.6)
    // 03 · Producción: las piezas aparecen flotando sobre su lugar
      .to(wires, { opacity: 0, duration: 0.2 }, 2.0)
      .to(ghosts, { opacity: 1, duration: 0.2 }, 2.0)
      .fromTo(pieces, { y: -110, opacity: 0 }, { y: -64, opacity: 1, duration: 0.55, stagger: 0.15, ease: "power2.out" }, 2.05)
      .to(shadows, { opacity: 0.3, duration: 0.4 }, 2.1)
    // 04 · Montaje: bajan, se encienden las luces, la pantalla y el punto
      .to(pieces, { y: 0, duration: 0.45, stagger: 0.12, ease: "bounce.out" }, 3.0)
      .to(shadows, { opacity: 0.6, scale: 1, duration: 0.35, stagger: 0.12 }, 3.0)
      .to(ghosts, { opacity: 0, duration: 0.2 }, 3.3)
      .to(iso.lamps, { fill: "#fff3e8", duration: 0.08, stagger: 0.08 }, 3.5)
      .to(iso.beams, { keyframes: [{ opacity: 0.7, duration: 0.05 }, { opacity: 0.15, duration: 0.05 }, { opacity: 1, duration: 0.12 }], stagger: 0.08 }, 3.5)
      .to(iso.spots, { opacity: 1, duration: 0.2, stagger: 0.08 }, 3.55)
      .to(iso.screenOn, { opacity: 1, duration: 0.25 }, 3.6)
      .to(iso.logoDot, { scale: 1, duration: 0.3, ease: "back.out(3)" }, 3.7)
      .to({}, { duration: 0.01 }, 4);
    return tl;
  }

  /* ---------------------------------------------------------
     Preloader
     --------------------------------------------------------- */
  function runLoader(onExit) {
    const loader = $("#loader");
    const logo = $(".loader .logo");
    const mark = $(".loader .logo__mark");
    const dot = $(".loader .logo__dot");
    const panels = $$(".loader__panels i");
    const num = $("#loader-num");
    const word = $("#loader-word");
    const words = (window.__T && window.__T.phases) || ["Diseño", "Desarrollo", "Producción", "Montaje"];

    // El punto rueda de izquierda a derecha y el logo aparece detrás suyo
    const W = logo.offsetWidth;
    const DOT = 0.865; // posición final del punto dentro del logo
    const roll = { p: 0 };
    const paint = () => {
      gsap.set(dot, { x: -W * DOT * (1 - roll.p) });
      gsap.set(mark, { clipPath: `inset(0% ${100 - DOT * 100 * roll.p}% 0% 0%)` });
    };
    paint();
    gsap.set(dot, { scale: 0, transformOrigin: "50% 50%" });
    gsap.set(".loader__step", { opacity: 0, y: 14 });
    word.textContent = words[0];

    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.to(dot, { scale: 1.6, duration: 0.5, ease: "back.out(3)" }, 0.15)
      .to(".loader__step", { opacity: 1, y: 0, duration: 0.6 }, 0.25)
      .to(dot, { scale: 1, duration: 0.3, ease: "power2.out" }, 0.6)
      .to(roll, { p: 1, duration: 1.5, ease: "power3.inOut", onUpdate: paint }, 0.6)
      .to(mark, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.5, ease: "power2.out" }, 2.0)
      .to(dot, { scale: 1.5, "--dot-glow": 46, duration: 0.22, ease: "power2.out" }, 2.05)
      .to(dot, { scale: 1, "--dot-glow": 0, duration: 0.7, ease: "elastic.out(1, 0.4)" }, 2.27);

    // Las cuatro etapas van pasando abajo
    words.slice(1).forEach((w, i) => {
      const at = 0.75 + (i + 1) * 0.45;
      tl.to(word, { yPercent: -110, duration: 0.2, ease: "power2.in" }, at)
        .call(() => { word.textContent = w; num.textContent = pad2(i + 2); }, null, at + 0.2)
        .fromTo(word, { yPercent: 110 }, { yPercent: 0, duration: 0.3, ease: "power3.out" }, at + 0.2);
    });

    // Salida: los paneles se levantan uno por uno
    tl.to([".loader__brand", ".loader__step"], { y: -40, opacity: 0, duration: 0.5, stagger: 0.06, ease: "power3.in" }, 2.95)
      .add(() => onExit && onExit(), 3.3)
      .to(panels, { yPercent: -101, duration: 1.0, stagger: 0.08, ease: "expo.inOut" }, 3.3)
      .add(() => loader.remove());
    return tl;
  }

  /* ---------------------------------------------------------
     HERO
     --------------------------------------------------------- */
  function heroIntro(plan) {
    const split = SplitText.create("#hero-title", { type: "lines,words", mask: "lines", linesClass: "split-line" });
    const em = $("#hero-title em");

    const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
    tl.from(split.words, { yPercent: 115, rotate: 4, duration: 1.5, stagger: 0.06, transformOrigin: "0% 100%" }, 0)
      .fromTo(em, { "--dot-y": "-1.6em", "--dot-s": 0.4 }, { "--dot-y": "0em", "--dot-s": 1, duration: 1.1, ease: "bounce.out" }, 0.75)
      .from(".hero__sub", { y: 36, opacity: 0, filter: "blur(10px)", duration: 1.4, clearProps: "filter" }, 0.55)
      .from(".hero__ctas .btn", { y: 36, opacity: 0, duration: 1.3, stagger: 0.1 }, 0.65)
      .from("#stage", { y: 140, opacity: 0, duration: 1.8 }, 0.55)
      .from(".badge", { scale: 0, rotate: -120, duration: 1.4, ease: "back.out(1.6)" }, 1.2)
      .from(".stat", { y: 40, opacity: 0, duration: 1.3, stagger: 0.08 }, 0.9)
      .add(() => split.revert(), 2.6);

    if (plan.lines.length) {
      gsap.set(plan.lines, { drawSVG: "0% 0%" });
      gsap.set(plan.pulses, { drawSVG: "0% 0%" });
      gsap.set(plan.marks, { scale: 0, transformOrigin: "50% 50%" });
      gsap.set(plan.lbls, { opacity: 0 });
      tl.to(plan.lines, { drawSVG: "0% 100%", duration: 2, stagger: 0.07, ease: "power3.inOut" }, 0)
        .to(plan.marks, { scale: 1, duration: 0.6, stagger: 0.04, ease: "back.out(3)" }, 1.2)
        .to(plan.lbls, { opacity: 1, duration: 0.8, stagger: 0.2 }, 1.4)
        .add(() => startPulses(plan.pulses), 1.6);
    }
    return tl;
  }

  let pulseTweens = [];
  function startPulses(pulses) {
    pulseTweens = pulses.map((p) =>
      gsap.fromTo(p, { drawSVG: "0% 0%" }, {
        keyframes: [
          { drawSVG: "0% 6%", duration: 0.3, ease: "none" },
          { drawSVG: "94% 100%", duration: rnd(2.2, 3.6), ease: "power1.inOut" },
          { drawSVG: "100% 100%", duration: 0.3, ease: "none" },
        ],
        repeat: -1,
        repeatDelay: rnd(0.6, 4),
        delay: rnd(0, 3),
      })
    );
  }

  /* Escenario: proyectos reales que se van reemplazando */
  function stage() {
    const slides = $$(".slide");
    if (slides.length < 2) return { pause() {}, resume() {} };
    const dashes = $$("#stage-dashes i");
    const numEl = $("#stage-num");
    const nameEl = $("#stage-name");
    const evEl = $("#stage-ev");
    const HOLD = 4.2;
    let idx = 0, busy = false, kb = null, timer = null;

    const kenBurns = (img) => {
      if (kb) kb.kill();
      kb = gsap.fromTo(img, { scale: 1.04 }, { scale: 1.14, duration: HOLD + 1.6, ease: "none" });
    };
    const runTimer = () => {
      if (timer) timer.kill();
      dashes.forEach((d, i) => gsap.set(d, { "--p": i < idx ? 1 : 0 }));
      timer = gsap.to(dashes[idx], { "--p": 1, duration: HOLD, ease: "none", onComplete: () => go(idx + 1, 1) });
    };
    function go(n, dir) {
      if (busy) return;
      busy = true;
      const next = (n + slides.length) % slides.length;
      const cur = slides[idx];
      const nx = slides[next];
      const cImg = $("img", cur), nImg = $("img", nx);
      gsap.set(cur, { zIndex: 1 });
      gsap.set(nx, { zIndex: 2, visibility: "visible" });
      nx.classList.add("is-on");
      const from = dir > 0 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)";
      gsap.fromTo(nx, { clipPath: from }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "expo.inOut" });
      gsap.fromTo(nImg, { xPercent: 10 * dir }, { xPercent: 0, duration: 1.6, ease: "expo.out" });
      kenBurns(nImg);
      gsap.to(cImg, {
        xPercent: -14 * dir, duration: 1.3, ease: "expo.inOut",
        onComplete: () => {
          cur.classList.remove("is-on");
          gsap.set(cur, { visibility: "hidden", clearProps: "zIndex" });
          gsap.set(cImg, { xPercent: 0 });
          busy = false;
        },
      });
      idx = next;
      numEl.textContent = pad2(idx + 1);
      gsap.to(nameEl, { duration: 0.9, scrambleText: { text: nx.dataset.name, chars: "upperCase", speed: 0.8 } });
      gsap.to(evEl, { duration: 0.9, scrambleText: { text: nx.dataset.ev, chars: "0123456789·", speed: 0.8 } });
      runTimer();
    }
    kenBurns($("img", slides[0]));
    runTimer();
    const st = $("#stage");
    st.addEventListener("click", () => go(idx + 1, 1));
    return {
      pause() { if (timer) timer.pause(); if (kb) kb.pause(); },
      resume() { if (timer) timer.resume(); if (kb) kb.resume(); },
    };
  }

  function heroScroll(pageST) {
    gsap.fromTo("#stage-tilt",
      { rotateX: 22, scale: 0.9, transformPerspective: 1800 },
      { rotateX: 0, scale: 1, ease: "none",
        scrollTrigger: { trigger: ".hero__stage", start: "top 98%", end: "top 22%", scrub: true } });

    gsap.to(".hero__inner", {
      y: 140, opacity: 0.15, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "+=750", scrub: true },
    });
    gsap.to(".hero__bg", {
      yPercent: 18, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });

    // Carrusel y pulsos sólo mientras el hero se ve
    const show = stage();
    ScrollTrigger.create({
      trigger: ".hero", start: "top top", end: "bottom top",
      onToggle: (self) => {
        pulseTweens.forEach((t) => (self.isActive ? t.resume() : t.pause()));
        if (self.isActive) show.resume(); else show.pause();
      },
    });

    // Sello que gira más rápido con la velocidad del scroll
    const rot = gsap.to(".badge__rot", { rotation: 360, svgOrigin: "100 100", duration: 20, ease: "none", repeat: -1 });
    let spin = 1;
    gsap.ticker.add(() => {
      const v = Math.abs(pageST.getVelocity());
      spin += (1 + Math.min(v / 180, 9) - spin) * 0.08;
      rot.timeScale(spin);
    });

    // Glow que sigue al puntero + leve inclinación del escenario
    if (finePointer) {
      const glow = $(".hero__glow");
      const hero = $(".hero");
      const gx = gsap.quickTo(glow, "x", { duration: 1.4, ease: "power3" });
      const gy = gsap.quickTo(glow, "y", { duration: 1.4, ease: "power3" });
      const st = $("#stage");
      const ry = gsap.quickTo(st, "rotationY", { duration: 1.2, ease: "power3" });
      const rx = gsap.quickTo(st, "rotationX", { duration: 1.2, ease: "power3" });
      gsap.set(glow, { x: window.innerWidth * 0.62, y: window.innerHeight * 0.32 });
      gsap.set(st, { transformPerspective: 1600 });
      window.addEventListener("pointermove", (e) => {
        const r = hero.getBoundingClientRect();
        if (e.clientY > r.bottom) return;
        gx(e.clientX);
        gy(e.clientY - r.top);
        ry((e.clientX / window.innerWidth - 0.5) * 5);
        rx(-(e.clientY / window.innerHeight - 0.5) * 3);
      }, { passive: true });
    }

    // Contadores
    $$("[data-count]").forEach((el) => {
      const end = +el.dataset.count;
      const o = { v: +(el.dataset.from || 0) };
      gsap.to(o, {
        v: end, duration: 2.2, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
        onUpdate: () => (el.textContent = Math.round(o.v)),
      });
    });
  }

  /* ---------------------------------------------------------
     Marquee reactivo a la velocidad de scroll
     --------------------------------------------------------- */
  function marquees(pageST) {
    const rows = $$(".marquee");
    const tweens = [];
    const inners = [];
    rows.forEach((m) => {
      const inner = $(".marquee__inner", m);
      inner.innerHTML += inner.innerHTML;
      const dir = +m.dataset.dir || 1;
      tweens.push(gsap.fromTo(inner,
        { xPercent: dir > 0 ? 0 : -50 },
        { xPercent: dir > 0 ? -50 : 0, duration: m.classList.contains("marquee--sm") ? 60 : 52, ease: "none", repeat: -1 }));
      inners.push(inner);
    });

    let active = false, speed = 1, dirSign = 1, skew = 0;
    ScrollTrigger.create({
      trigger: ".stack", start: "top bottom", end: "bottom top",
      onToggle: (s) => {
        active = s.isActive;
        tweens.forEach((t) => (active ? t.resume() : t.pause()));
      },
    });
    const setSkew = inners.map((el) => gsap.quickSetter(el, "skewX", "deg"));
    gsap.ticker.add(() => {
      if (!active) return;
      const v = pageST.getVelocity();
      if (Math.abs(v) > 5) dirSign = v > 0 ? 1 : -1;
      const target = dirSign * (1 + Math.min(Math.abs(v) / 220, 7));
      speed += (target - speed) * 0.08;
      tweens.forEach((t) => t.timeScale(speed));
      skew += (gsap.utils.clamp(-9, 9, v / -260) - skew) * 0.1;
      setSkew.forEach((s) => s(skew));
    });
  }

  /* ---------------------------------------------------------
     Estudio: manifiesto que se ilumina
     --------------------------------------------------------- */
  function studio() {
    const ms = SplitText.create("#manifesto", { type: "words", wordsClass: "w" });
    gsap.fromTo(ms.words, { opacity: 0.13 }, {
      opacity: 1, stagger: 0.1, ease: "none",
      scrollTrigger: { trigger: "#manifesto", start: "top 82%", end: "bottom 42%", scrub: true },
    });
    gsap.fromTo("#studio-media img", { yPercent: -6, scale: 1.08 }, {
      yPercent: 6, scale: 1, ease: "none",
      scrollTrigger: { trigger: "#studio-media", start: "top bottom", end: "bottom top", scrub: true },
    });
    gsap.fromTo("#studio-media", { clipPath: "inset(10% 6% 10% 6% round 32px)" }, {
      clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 1.6, ease: "expo.inOut",
      scrollTrigger: { trigger: "#studio-media", start: "top 82%", once: true },
    });
  }

  /* ---------------------------------------------------------
     Servicios: tarjetas apiladas con foto en parallax
     --------------------------------------------------------- */
  function services(mm) {
    mm.add("(min-width: 768px)", () => {
      const cards = $$(".scard");
      const last = cards[cards.length - 1];
      const off = (i) => 104 + i * 22;
      cards.forEach((card, i) => {
        if (card === last) return;
        ScrollTrigger.create({
          trigger: card,
          start: () => `top ${off(i)}px`,
          endTrigger: last,
          end: () => `top ${off(cards.length - 1)}px`,
          pin: true,
          pinSpacing: false,
        });
        gsap.to($(".scard__shell", card), {
          scale: 0.93, "--dim": 0.6, ease: "none",
          scrollTrigger: { trigger: cards[i + 1], start: "top bottom", end: () => `top ${off(i + 1)}px`, scrub: true },
        });
      });
    });

    $$(".scard").forEach((card) => {
      gsap.fromTo($(".scard__media img", card), { yPercent: -7 }, {
        yPercent: 7, ease: "none",
        scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true },
      });
      gsap.from($(".scard__txt", card).children, {
        y: 40, opacity: 0, duration: 1.2, stagger: 0.08, ease: "expo.out",
        scrollTrigger: { trigger: card, start: "top 75%", once: true },
      });
      gsap.fromTo($(".scard__media", card), { clipPath: "inset(12% 12% 12% 12% round 24px)" }, {
        clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 1.6, ease: "expo.inOut",
        scrollTrigger: { trigger: card, start: "top 80%", once: true },
      });
    });
  }

  /* ---------------------------------------------------------
     Proyectos: scroll horizontal + parallax + lightbox
     --------------------------------------------------------- */
  function projects(mm, pageST) {
    const cards = $$(".pcard");
    const total = cards.length;
    ScrollTrigger.create({
      trigger: ".projects", start: "top 300%", once: true,
      onEnter: () => cards.forEach((c) => { const im = $("img", c); im.loading = "eager"; }),
    });

    mm.add("(min-width: 1024px)", () => {
      const track = $("#projects-track");
      const rail = $("#projects-rail");
      const bar = $("#pj-bar");
      const count = $("#pj-count");
      const dist = () => track.scrollWidth - document.documentElement.clientWidth;
      const tween = gsap.to(track, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: ".projects",
          start: "top top",
          end: () => "+=" + dist(),
          pin: true,
          scrub: 1,
          refreshPriority: 1,
          invalidateOnRefresh: true,
          onUpdate(self) {
            gsap.set(bar, { scaleX: self.progress });
            count.textContent = pad2(gsap.utils.clamp(1, total, Math.round(self.progress * (total - 1)) + 1));
          },
        },
      });

      cards.forEach((card) => {
        gsap.fromTo(card,
          { y: 90, rotate: 2.5, opacity: 0.2 },
          { y: 0, rotate: 0, opacity: 1, ease: "power2.out",
            scrollTrigger: { trigger: card, containerAnimation: tween, start: "left 100%", end: "left 62%", scrub: true } });
        gsap.fromTo($("img", card), { xPercent: -5 }, {
          xPercent: 5, ease: "none",
          scrollTrigger: { trigger: card, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
        });
      });
      gsap.fromTo(".projects__outro-img", { xPercent: -6, scale: 1.12 }, {
        xPercent: 0, scale: 1, ease: "none",
        scrollTrigger: { trigger: ".projects__outro", containerAnimation: tween, start: "left right", end: "right right", scrub: true },
      });
      gsap.from(".projects__outro > :not(img)", {
        y: 40, opacity: 0, stagger: 0.1, ease: "power2.out",
        scrollTrigger: { trigger: ".projects__outro", containerAnimation: tween, start: "left 100%", end: "left 65%", scrub: true },
      });

      // Las columnas se inclinan con la velocidad
      const setSkew = gsap.quickSetter(rail, "skewX", "deg");
      let skew = 0;
      const tick = () => {
        skew += (gsap.utils.clamp(-4, 4, pageST.getVelocity() / -400) - skew) * 0.1;
        setSkew(skew);
      };
      gsap.ticker.add(tick);
      return () => { gsap.ticker.remove(tick); gsap.set(rail, { skewX: 0 }); };
    });

    mm.add("(max-width: 1023px)", () => {
      gsap.from(".pcol", {
        x: 80, opacity: 0, duration: 1.2, stagger: 0.08, ease: "expo.out",
        scrollTrigger: { trigger: "#projects-rail", start: "top 85%", once: true },
      });
    });

    lightbox(cards);
  }

  function lightbox(cards) {
    const lb = $("#lightbox");
    if (!lb || !cards.length) return;
    const img = $("#lb-img");
    const num = $("#lb-num");
    const name = $("#lb-name");
    const ev = $("#lb-ev");
    const items = cards.map((c, i) => ({ card: c, src: $("img", c).getAttribute("src"), alt: $("img", c).alt, name: c.dataset.name, ev: c.dataset.ev, n: pad2(i + 1) }));
    let cur = -1, open = false, lastFocus = null;

    const fill = (it) => {
      img.src = it.src; img.alt = it.alt;
      num.textContent = it.n; name.textContent = it.name; ev.textContent = it.ev;
    };
    const ready = () => (img.decode ? img.decode().catch(() => {}) : Promise.resolve());

    async function show(i) {
      cur = i; open = true;
      lastFocus = document.activeElement;
      fill(items[i]);
      await ready();
      lb.setAttribute("aria-hidden", "false");
      gsap.set(lb, { visibility: "visible" });
      if (smoother) smoother.paused(true);
      const r0 = items[i].card.getBoundingClientRect();
      gsap.set(img, { clearProps: "transform,clipPath,opacity" });
      const rf = img.getBoundingClientRect();
      const s = Math.max(r0.width / rf.width, r0.height / rf.height);
      const ix = Math.max(0, (rf.width * s - r0.width) / 2 / s);
      const iy = Math.max(0, (rf.height * s - r0.height) / 2 / s);
      const tl = gsap.timeline({ defaults: { ease: "expo.inOut" } });
      tl.fromTo(".lightbox__bg", { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power2.out" }, 0)
        .fromTo(img, {
          x: r0.left + r0.width / 2 - (rf.left + rf.width / 2),
          y: r0.top + r0.height / 2 - (rf.top + rf.height / 2),
          scale: s,
          clipPath: `inset(${iy}px ${ix}px ${iy}px ${ix}px round ${22 / s}px)`,
        }, { x: 0, y: 0, scale: 1, clipPath: "inset(0px 0px 0px 0px round 19px)", duration: 1 }, 0)
        .fromTo([".lightbox__cap", ".lightbox__ui"], { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "expo.out" }, 0.55);
      $("#lb-close").focus({ preventScroll: true });
    }
    function hide() {
      if (!open) return;
      open = false;
      gsap.timeline({
        onComplete: () => {
          gsap.set(lb, { visibility: "hidden" });
          lb.setAttribute("aria-hidden", "true");
          if (smoother) smoother.paused(false);
          if (lastFocus) lastFocus.focus({ preventScroll: true });
        },
      })
        .to([".lightbox__cap", ".lightbox__ui"], { opacity: 0, y: 12, duration: 0.3, ease: "power2.in" }, 0)
        .to(img, { opacity: 0, scale: 0.94, duration: 0.45, ease: "power3.in" }, 0)
        .to(".lightbox__bg", { opacity: 0, duration: 0.5, ease: "power2.inOut" }, 0.1);
    }
    function step(dir) {
      if (!open) return;
      const i = (cur + dir + items.length) % items.length;
      cur = i;
      gsap.to(img, {
        opacity: 0, x: -50 * dir, duration: 0.3, ease: "power2.in",
        onComplete: async () => {
          fill(items[i]);
          await ready();
          gsap.fromTo(img, { opacity: 0, x: 50 * dir }, { opacity: 1, x: 0, duration: 0.6, ease: "expo.out" });
          gsap.fromTo(name, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6, ease: "expo.out" });
        },
      });
    }

    items.forEach((it, i) => it.card.addEventListener("click", () => show(i)));
    $("#lb-close").addEventListener("click", hide);
    $(".lightbox__bg").addEventListener("click", hide);
    $("#lb-prev").addEventListener("click", () => step(-1));
    $("#lb-next").addEventListener("click", () => step(1));
    document.addEventListener("keydown", (e) => {
      if (!open) return;
      if (e.key === "Escape") hide();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    });
  }

  /* ---------------------------------------------------------
     Proceso: el stand se arma con el scroll
     --------------------------------------------------------- */
  function processBuild(mm) {
    const iso = buildIso();
    if (!iso) return;
    const tl = isoTimeline(iso);
    const names = (window.__T && window.__T.phases) || ["Diseño", "Desarrollo", "Producción", "Montaje"];
    const numEl = $("#phase-num");
    const nameEl = $("#phase-name");
    const meter = $("#build-meter");
    let phase = 1;
    const sync = () => {
      gsap.set(meter, { scaleX: tl.progress() });
      const p = gsap.utils.clamp(1, 4, Math.floor(tl.time() + 0.02) + 1);
      if (p !== phase) {
        phase = p;
        numEl.textContent = pad2(p);
        gsap.to(nameEl, { duration: 0.4, scrambleText: { text: names[p - 1], chars: "lowerCase", speed: 1.4 }, overwrite: true });
      }
    };
    tl.eventCallback("onUpdate", sync);

    mm.add("(min-width: 961px)", () => {
      const vis = $("#build-visual");
      const steps = $(".steps-wrap");
      ScrollTrigger.create({
        trigger: vis, start: "top 110px",
        end: () => "+=" + Math.max(0, steps.offsetHeight - vis.offsetHeight),
        pin: true, pinSpacing: false, invalidateOnRefresh: true,
      });
      ScrollTrigger.create({ trigger: "#steps", start: "top 62%", end: "bottom 75%", scrub: 0.6, animation: tl });
    });
    mm.add("(max-width: 960px)", () => {
      ScrollTrigger.create({ trigger: "#build-visual", start: "top 85%", end: "bottom 25%", scrub: 0.6, animation: tl });
    });

    gsap.to("#steps-fill", {
      scaleY: 1, ease: "none",
      scrollTrigger: { trigger: "#steps", start: "top 62%", end: "bottom 62%", scrub: true },
    });
    $$(".step").forEach((s) => {
      ScrollTrigger.create({
        trigger: s, start: "top 62%",
        onEnter: () => s.classList.add("is-active"),
        onLeaveBack: () => s.classList.remove("is-active"),
      });
    });
  }

  /* ---------------------------------------------------------
     Enfoque: statement + bento con spotlight
     --------------------------------------------------------- */
  function focus() {
    const st = SplitText.create("#statement", { type: "words", wordsClass: "w" });
    gsap.fromTo(st.words, { opacity: 0.12, y: 20 }, {
      opacity: 1, y: 0, stagger: 0.12, ease: "power1.out",
      scrollTrigger: { trigger: "#statement", start: "top 80%", end: "bottom 50%", scrub: true },
    });

    const tiles = $$(".tile");
    gsap.set(tiles, { y: 90, opacity: 0, rotateX: -10, transformOrigin: "50% 100%" });
    ScrollTrigger.batch(tiles, {
      start: "top 90%", once: true,
      onEnter: (batch) => gsap.to(batch, { y: 0, opacity: 1, rotateX: 0, duration: 1.5, stagger: 0.09, ease: "expo.out" }),
    });

    const bento = $("#bento");
    if (finePointer && bento) {
      bento.addEventListener("pointermove", (e) => {
        tiles.forEach((t) => {
          const r = t.getBoundingClientRect();
          t.style.setProperty("--mx", `${e.clientX - r.left}px`);
          t.style.setProperty("--my", `${e.clientY - r.top}px`);
        });
      }, { passive: true });
      tiles.forEach((t) => {
        const core = $(".tile__core", t);
        gsap.set(core, { transformPerspective: 900 });
        const rx = gsap.quickTo(core, "rotationX", { duration: 0.8, ease: "power3" });
        const ry = gsap.quickTo(core, "rotationY", { duration: 0.8, ease: "power3" });
        t.addEventListener("pointermove", (e) => {
          const r = t.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - 0.5) * 6);
          rx(-((e.clientY - r.top) / r.height - 0.5) * 6);
        });
        t.addEventListener("pointerleave", () => { rx(0); ry(0); });
      });
    }
    const photo = $(".tile--photo");
    if (photo) photo.addEventListener("click", () => scrollToTarget("#contacto"));

    const loops = [];
    loops.push(gsap.fromTo(".vis-target circle:not(.fill)", { scale: 0.85, opacity: 0.2, svgOrigin: "100 100" },
      { scale: 1, opacity: 1, duration: 1.8, stagger: { each: 0.3, repeat: -1, yoyo: true }, ease: "sine.inOut" }));
    loops.push(gsap.timeline({ repeat: -1, repeatDelay: 0.8 })
      .fromTo(".vis-plan .w", { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.4, stagger: 0.35, ease: "power2.inOut" })
      .fromTo(".vis-plan .d", { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.6, ease: "power2.out" }, "-=0.4")
      .fromTo(".vis-plan text", { opacity: 0 }, { opacity: 1, duration: 0.3 }, "-=0.2")
      .to(".vis-plan .pen", { scale: 1.8, transformOrigin: "50% 50%", duration: 0.3, yoyo: true, repeat: 1 }, "<")
      .to([".vis-plan .w", ".vis-plan .d", ".vis-plan text"], { opacity: 0, duration: 0.4 }, "+=1.4")
      .set([".vis-plan .w", ".vis-plan .d"], { opacity: 1 }));
    const blocks = $$(".vis-blocks i");
    loops.push(gsap.timeline({ repeat: -1, repeatDelay: 1 })
      .fromTo(blocks, { y: -120, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.35, ease: "bounce.out" })
      .fromTo(".vis-blocks b", { y: -120, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "bounce.out" }, "-=0.2")
      .to([...blocks, ".vis-blocks b"], { opacity: 0, y: 20, duration: 0.4, stagger: 0.05, ease: "power2.in" }, "+=1.6"));

    loops.forEach((l) => l.pause());
    ScrollTrigger.create({
      trigger: "#bento", start: "top bottom", end: "bottom top",
      onToggle: (s) => loops.forEach((l) => (s.isActive ? l.resume() : l.pause())),
    });
  }

  /* ---------------------------------------------------------
     CTA final + footer
     --------------------------------------------------------- */
  function tail() {
    const fin = SplitText.create("#finale-title", { type: "words", wordsClass: "w" });
    gsap.from(fin.words, {
      yPercent: 60, opacity: 0, rotateX: -50, transformPerspective: 800, transformOrigin: "50% 100%",
      stagger: 0.08, ease: "power2.out",
      scrollTrigger: { trigger: ".finale", start: "top 75%", end: "center 55%", scrub: 1 },
    });
    gsap.fromTo(".finale__glow", { scale: 0.6, opacity: 0.3 }, {
      scale: 1.15, opacity: 1, ease: "none",
      scrollTrigger: { trigger: ".finale", start: "top bottom", end: "bottom top", scrub: true },
    });
  }

  function footerAnim() {
    const mark = $(".logo--footer .logo__mark");
    const dot = $(".logo--footer .logo__dot");
    gsap.set(mark, { clipPath: "inset(0% 100% 0% 0%)" });
    gsap.set(dot, { y: -260, opacity: 0 });
    gsap.timeline({ scrollTrigger: { trigger: "#footer-word", start: "top 92%", once: true } })
      .to(mark, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut" })
      .set(dot, { opacity: 1 }, 0.9)
      .to(dot, { y: 0, duration: 1.1, ease: "bounce.out" }, 0.9);
    gsap.from(".footer__col", {
      y: 40, opacity: 0, stagger: 0.08, duration: 1.2, ease: "expo.out",
      scrollTrigger: { trigger: ".footer", start: "top 85%", once: true },
    });
    const seal = gsap.to(".seal__rot", { rotation: 360, svgOrigin: "100 100", duration: 24, ease: "none", repeat: -1, paused: true });
    ScrollTrigger.create({ trigger: ".footer", start: "top bottom", onToggle: (s) => (s.isActive ? seal.resume() : seal.pause()) });
  }

  /* ---------------------------------------------------------
     Reveals genéricos (títulos, textos, eyebrows)
     --------------------------------------------------------- */
  function reveals() {
    $$("[data-split]").forEach((el) => {
      SplitText.create(el, {
        type: "lines", mask: "lines", linesClass: "split-line", autoSplit: true,
        onSplit(self) {
          return gsap.from(self.lines, {
            yPercent: 110, duration: 1.4, stagger: 0.1, ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        },
      });
    });
    $$("[data-reveal]").forEach((el) => {
      gsap.from(el, {
        y: 50, opacity: 0, filter: "blur(8px)", duration: 1.4, ease: "expo.out", clearProps: "filter",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });
    });
    $$("[data-reveal-group]").forEach((g) => {
      gsap.from(g.children, {
        y: 30, opacity: 0, duration: 1.2, stagger: 0.08, ease: "expo.out",
        scrollTrigger: { trigger: g, start: "top 88%", once: true },
      });
    });
    $$("[data-scramble]").forEach((el) => {
      const txt = el.textContent;
      ScrollTrigger.create({
        trigger: el, start: "top 92%", once: true,
        onEnter: () => gsap.to(el, { duration: 1.1, scrambleText: { text: txt, chars: "01/<>·", speed: 0.7 } }),
      });
    });
  }

  /* ---------------------------------------------------------
     NAV: indicador activo + progreso
     --------------------------------------------------------- */
  function nav() {
    const ind = $(".nav__indicator");
    const links = $$(".nav__links a");
    const progress = $("#nav-progress");
    let activeLink = null;

    const moveInd = (link) => {
      if (!link) { gsap.to(ind, { opacity: 0, duration: 0.4, ease: "power2.out" }); return; }
      gsap.to(ind, { x: link.offsetLeft, width: link.offsetWidth, opacity: 1, duration: 0.7, ease: "expo.out" });
    };
    links.forEach((l) => l.addEventListener("mouseenter", () => moveInd(l)));
    $(".nav__links").addEventListener("mouseleave", () => moveInd(activeLink));

    const secs = links.map((l) => $("#" + l.dataset.nav));
    const endEl = $("#enfoque");
    const box = (el) => (el.parentElement && el.parentElement.classList.contains("pin-spacer") ? el.parentElement : el);
    const check = () => {
      const mid = window.innerHeight * 0.5;
      let found = null;
      secs.forEach((s, i) => { if (s && box(s).getBoundingClientRect().top <= mid) found = links[i]; });
      if (endEl && endEl.getBoundingClientRect().top <= mid) found = null;
      if (found !== activeLink) {
        activeLink = found;
        links.forEach((l) => l.classList.toggle("is-active", l === found));
        moveInd(found);
      }
    };
    ScrollTrigger.create({
      start: 0, end: "max",
      onUpdate: (self) => { gsap.set(progress, { scaleX: self.progress }); check(); },
      onRefresh: check,
    });
  }

  /* ---------------------------------------------------------
     Menú mobile
     --------------------------------------------------------- */
  function menu() {
    const burger = $(".nav__burger");
    const m = $("#menu");
    let open = false;
    let tl = null;
    const build = () => {
      const r = burger.getBoundingClientRect();
      const x = Math.round(r.left + r.width / 2);
      const y = Math.round(r.top + r.height / 2);
      return gsap.timeline({ paused: true })
        .set(m, { visibility: "visible" })
        .fromTo(m, { clipPath: `circle(0px at ${x}px ${y}px)` }, { clipPath: `circle(${Math.hypot(window.innerWidth, window.innerHeight) * 1.05}px at ${x}px ${y}px)`, duration: 0.9, ease: "expo.inOut" })
        .fromTo(".menu__label", { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.06, ease: "expo.out" }, 0.3)
        .fromTo([".menu .eyebrow", ".menu__list .mono", ".menu__foot"], { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.03, ease: "expo.out" }, 0.4);
    };
    const setOpen = (v, after) => {
      open = v;
      burger.setAttribute("aria-expanded", String(v));
      const tx = window.__T || {};
      burger.setAttribute("aria-label", v ? (tx.closeMenu || "Cerrar menú") : (tx.openMenu || "Abrir menú"));
      m.setAttribute("aria-hidden", String(!v));
      if (v) {
        tl = build();
        tl.play();
        if (smoother) smoother.paused(true);
      } else if (tl) {
        if (smoother) smoother.paused(false);
        tl.timeScale(1.6).reverse().eventCallback("onReverseComplete", () => {
          gsap.set(m, { visibility: "hidden" });
          if (after) after();
        });
      }
    };
    burger.addEventListener("click", () => setOpen(!open));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && open) setOpen(false); });
    return { isOpen: () => open, close: (after) => setOpen(false, after) };
  }

  /* ---------------------------------------------------------
     Botones magnéticos
     --------------------------------------------------------- */
  function magnetic() {
    if (!finePointer || reduce) return;
    $$(".magnetic").forEach((el) => {
      const xTo = gsap.quickTo(el, "x", { duration: 0.8, ease: "elastic.out(1, 0.4)" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.8, ease: "elastic.out(1, 0.4)" });
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.28);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.38);
      });
      el.addEventListener("pointerleave", () => { xTo(0); yTo(0); });
    });
  }

  /* ---------------------------------------------------------
     Formulario → abre el cliente de correo con la consulta
     --------------------------------------------------------- */
  function form() {
    const f = $("#contact-form");
    if (!f) return;
    const status = $("#form-status");
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;
      $$("[required]", f).forEach((inp) => {
        const wrap = inp.closest(".field");
        const valid = inp.checkValidity() && inp.value.trim() !== "";
        wrap.classList.toggle("is-invalid", !valid);
        if (!valid) {
          ok = false;
          wrap.classList.remove("is-flash");
          void wrap.offsetWidth;
          wrap.classList.add("is-flash");
        }
      });
      if (!ok) {
        status.className = "form__status mono err";
        status.textContent = (window.__T && window.__T.formErr) || "Revisá los campos marcados.";
        return;
      }
      const d = new FormData(f);
      const tipo = d.get("motivo") || "Nuevo proyecto";
      const idioma = window.__LANG === "en" ? "English" : "Español";
      const subject = `Consulta web — ${tipo}`;
      const body = [
        `Nombre: ${d.get("nombre") || "-"}`,
        `Email: ${d.get("email")}`,
        `Tipo de proyecto: ${tipo}`,
        `Idioma del sitio: ${idioma}`,
        "",
        d.get("mensaje"),
      ].join("\n");
      window.location.href = `mailto:hola@understandstudio.com.ar?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      status.className = "form__status mono ok";
      status.textContent = (window.__T && window.__T.formOk) || "Abriendo tu correo para enviar la consulta…";
    });
    $$("input, select, textarea", f).forEach((inp) => {
      const clear = () => inp.closest(".field").classList.remove("is-invalid");
      inp.addEventListener("input", clear);
      inp.addEventListener("change", clear);
    });
  }

  /* ---------------------------------------------------------
     INIT
     --------------------------------------------------------- */
  function bindLinks(menuApi) {
    $$("[data-scroll-link]").forEach((a) => {
      a.addEventListener("click", (e) => {
        const href = a.getAttribute("href");
        if (!href || !href.startsWith("#")) return;
        e.preventDefault();
        if (a.dataset.motivo) setMotivo(a.dataset.motivo);
        if (menuApi.isOpen()) menuApi.close(() => scrollToTarget(href));
        else scrollToTarget(href);
      });
    });
    $$("#to-top, [data-to-top]").forEach((b) => b.addEventListener("click", () => scrollToTarget("#top")));
    // El botón flotante de subir aparece después del primer tramo de scroll
    const fabTop = $(".fab--top");
    if (fabTop) {
      const toggle = () => fabTop.classList.toggle("is-visible", window.scrollY > window.innerHeight * 0.6);
      window.addEventListener("scroll", toggle, { passive: true });
      toggle();
    }
  }

  function goToHash() {
    let ry = null;
    try { ry = sessionStorage.getItem("understand-restore-y"); sessionStorage.removeItem("understand-restore-y"); } catch (e) { /* sin almacenamiento */ }
    if (ry !== null) {
      ScrollTrigger.refresh();
      if (smoother) smoother.scrollTo(+ry, false); else window.scrollTo(0, +ry);
      return;
    }
    const h = window.location.hash;
    if (!h || h === "#top" || h === "#main") return;
    const el = $(h);
    if (!el) return;
    ScrollTrigger.refresh();
    if (smoother) smoother.scrollTo(el, false, el.dataset.scrollPos || "top top");
    else el.scrollIntoView();
  }

  function initReduced() {
    const l = $("#loader");
    if (l) l.remove();
    html.classList.add("is-ready");
    const iso = buildIso();
    if (iso) isoTimeline(iso).progress(1);
    $$(".step").forEach((s) => s.classList.add("is-active"));
    const fill = $("#steps-fill");
    if (fill) fill.style.transform = "scaleY(1)";
    nav();
    const menuApi = menu();
    bindLinks(menuApi);
    lightbox($$(".pcard"));
    form();
    goToHash();
  }

  function init() {
    if (reduce) { initReduced(); return; }

    const plan = buildPlan();
    const mm = gsap.matchMedia();
    const pageST = ScrollTrigger.create({ start: 0, end: "max" });

    // Orden = orden en la página (los pins afectan lo que viene después)
    heroScroll(pageST);
    marquees(pageST);
    studio();
    services(mm);
    projects(mm, pageST);
    processBuild(mm);
    focus();
    tail();
    footerAnim();
    reveals();
    nav();

    const menuApi = menu();
    bindLinks(menuApi);
    magnetic();
    form();

    const hero = heroIntro(plan);
    gsap.set(".nav__pill", { y: -90, opacity: 0 });

    const start = () => {
      hero.play();
      gsap.to(".nav__pill", { y: 0, opacity: 1, duration: 1.4, ease: "expo.out", delay: 0.35 });
      html.classList.add("is-ready");
      if (smoother) smoother.paused(false);
      ScrollTrigger.refresh();
      goToHash();
    };

    if (introSeen || window.location.hash) {
      const l = $("#loader");
      if (l) gsap.to(l, { opacity: 0, duration: 0.5, ease: "power2.out", onComplete: () => l.remove() });
      start();
    } else {
      runLoader(start);
    }
  }

  let started = false;
  const go = () => { if (started) return; started = true; init(); };
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(go);
    setTimeout(go, 2500);
  } else {
    window.addEventListener("load", go);
  }
})();
