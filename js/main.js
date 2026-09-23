/* =========================================================
   Portfólio — Matheus Henrique
   Animações: GSAP + ScrollTrigger + ScrollSmoother + SplitText
   ========================================================= */

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, ScrambleTextPlugin, TextPlugin);

const root = document.documentElement;
const body = document.body;
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

document.querySelector(".year").textContent = new Date().getFullYear();

/* ---------------------------------------------------------
   TEMA CLARO / ESCURO
   --------------------------------------------------------- */
const themeBtn = document.querySelector(".theme-toggle");

function applyTheme(theme) {
  root.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]').content = theme === "light" ? "#f0fdf4" : "#071a12";
  try { localStorage.setItem("tema", theme); } catch (e) {}
}

themeBtn.addEventListener("click", () => {
  const next = root.dataset.theme === "light" ? "dark" : "light";

  // Sem suporte a View Transitions (ou movimento reduzido): troca direto
  if (!document.startViewTransition || reduceMotion) return applyTheme(next);

  // Círculo que se expande a partir do botão
  const { left, top, width, height } = themeBtn.getBoundingClientRect();
  const x = left + width / 2;
  const y = top + height / 2;
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

  document.startViewTransition(() => applyTheme(next)).ready.then(() => {
    root.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 700, easing: "cubic-bezier(0.76, 0, 0.24, 1)", pseudoElement: "::view-transition-new(root)" }
    );
  });
});

/* ---------------------------------------------------------
   SCROLL SUAVE (ScrollSmoother)
   --------------------------------------------------------- */
const smoother = reduceMotion ? null : ScrollSmoother.create({
  wrapper: "#smooth-wrapper",
  content: "#smooth-content",
  smooth: 1.2,
  effects: true,
  smoothTouch: 0.1
});

function scrollToTarget(target) {
  if (smoother) smoother.scrollTo(target, true, "top top");
  else target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
}

/* ---------------------------------------------------------
   MENU EM TELA CHEIA (celular)
   --------------------------------------------------------- */
const menu = document.querySelector(".menu");
const menuBtn = document.querySelector(".menu-btn");
let menuOpen = false;
let menuTl;

function toggleMenu(open = !menuOpen) {
  menuOpen = open;
  menuBtn.setAttribute("aria-expanded", open);
  menuBtn.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  menu.setAttribute("aria-hidden", !open);
  smoother?.paused(open);

  const b = menuBtn.getBoundingClientRect();
  const x = b.left + b.width / 2;
  const y = b.top + b.height / 2;
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

  menuTl?.kill();
  if (open) {
    menuTl = gsap.timeline()
      .set(menu, { visibility: "visible" })
      .fromTo(menu, { clipPath: `circle(0px at ${x}px ${y}px)` },
        { clipPath: `circle(${r}px at ${x}px ${y}px)`, duration: 0.9, ease: "expo.inOut" })
      .fromTo(".menu-links a", { yPercent: 100, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, stagger: 0.06, duration: 0.7, ease: "expo.out" }, "-=0.35")
      .fromTo(".menu-foot a", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, stagger: 0.05 }, "<0.2");
  } else {
    menuTl = gsap.timeline()
      .to(menu, { clipPath: `circle(0px at ${x}px ${y}px)`, duration: 0.7, ease: "expo.inOut" })
      .set(menu, { visibility: "hidden" });
  }
  if (reduceMotion) menuTl.progress(1);
}

menuBtn.addEventListener("click", () => toggleMenu());
addEventListener("keydown", (e) => e.key === "Escape" && menuOpen && toggleMenu(false));

/* Links internos (#secao) passam pelo ScrollSmoother */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    if (menuOpen) {
      toggleMenu(false);
      setTimeout(() => scrollToTarget(target), 450);
    } else {
      scrollToTarget(target);
    }
  });
});

/* ---------------------------------------------------------
   Tudo que depende das fontes carregadas (SplitText mede o texto)
   --------------------------------------------------------- */
const fontsReady = Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2000))]);

fontsReady.then(() => {
  if (reduceMotion) {
    document.querySelector(".loader").remove();
    body.classList.remove("is-loading");
    startNavWatcher();
    return;
  }

  const heroChars = SplitText.create(".hero-title .split-chars", { type: "chars", charsClass: "char" }).chars;

  playIntro(heroChars);
  scrollAnimations();
  startNavWatcher();
  if (finePointer) pointerEffects();

  addEventListener("load", () => ScrollTrigger.refresh());
});

/* =========================================================
   1) ANIMAÇÃO DE ENTRADA
   ========================================================= */
function playIntro(heroChars) {
  smoother?.paused(true);

  const count = { v: 0 };
  const num = document.querySelector(".loader-count .num");

  gsap.timeline({ defaults: { ease: "expo.out" } })
    // Terminal "rodando" o portfólio
    .to(".loader-cmd", { text: "java -jar portfolio.jar", duration: 1, ease: "none" }, 0.2)
    .to(count, {
      v: 100, duration: 1.8, ease: "power3.inOut",
      onUpdate: () => (num.textContent = String(Math.round(count.v)).padStart(3, "0"))
    }, 0.3)
    .to(".loader-bar i", { scaleX: 1, duration: 1.8, ease: "power3.inOut" }, 0.3)
    .to(".loader-inner", { yPercent: -30, autoAlpha: 0, duration: 0.6, ease: "power2.in" }, "+=0.1")

    // Cortina com clip-path revelando o site
    .to(".loader", { clipPath: "inset(0% 0% 100% 0%)", duration: 1.1, ease: "expo.inOut" }, "-=0.2")
    .set(".loader", { display: "none" })

    // Hero
    .from(heroChars, { yPercent: 120, rotate: 6, stagger: 0.035, duration: 1.2 }, "-=0.55")
    .fromTo(".photo-frame",
      { clipPath: "inset(100% 0% 0% 0% round 200px 200px 28px 28px)" },
      { clipPath: "inset(0% 0% 0% 0% round 200px 200px 28px 28px)", duration: 1.4, ease: "expo.inOut" }, "<-0.2")
    .from(".photo-frame > *", { scale: 1.4, duration: 1.8 }, "<")
    .from(".photo-ring", { scale: 0.85, autoAlpha: 0, duration: 1.2 }, "<0.5")
    .from(".hero-meta .pill", { y: 20, autoAlpha: 0, stagger: 0.08, duration: 0.9 }, "<")
    .from(".hero-role, .hero-desc, .hero-cta", { y: 30, autoAlpha: 0, stagger: 0.1, duration: 1 }, "<0.1")
    .from(".photo-tag", { x: -30, autoAlpha: 0, duration: 1 }, "<0.2")
    .from(".nav", { yPercent: -100, autoAlpha: 0, duration: 1 }, "<")
    .from(".scroll-indicator", { autoAlpha: 0, y: 20, duration: 1 }, "<")
    .add(() => {
      body.classList.remove("is-loading");
      smoother?.paused(false);
      startScramble();
    }, "<");
}

/* Cargo que "embaralha" e troca (ScrambleText) */
function startScramble() {
  const roles = ["Back-End", "Java & Spring", "de APIs REST", "focado em Segurança", "Back-End"];
  const tl = gsap.timeline({ repeat: -1, delay: 1.5 });
  roles.slice(1).forEach((role) => {
    tl.to(".scramble", {
      duration: 1.1,
      scrambleText: { text: role, chars: "01<>/{}#$*", speed: 0.5, revealDelay: 0.3 }
    }).to({}, { duration: 2.2 });
  });
}

/* =========================================================
   2) ANIMAÇÕES NO SCROLL
   ========================================================= */
function scrollAnimations() {
  const mm = gsap.matchMedia();

  /* --- Hero: parallax com scrub ao sair da tela --- */
  const heroOut = { trigger: ".hero", start: "top top", end: "bottom top", scrub: true };
  gsap.to(".hero-title", { yPercent: -30, ease: "none", scrollTrigger: heroOut });
  gsap.to(".hero-photo", { yPercent: 18, rotate: -4, scale: 0.92, ease: "none", scrollTrigger: heroOut });
  gsap.to(".hero-bg", { yPercent: 25, autoAlpha: 0.3, ease: "none", scrollTrigger: heroOut });

  /* --- Etiquetas "01 Sobre mim" etc. --- */
  gsap.utils.toArray(".eyebrow").forEach((el) => {
    gsap.from(el, { x: -30, autoAlpha: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%" } });
  });

  /* --- Títulos de seção: linhas sobem por trás de uma máscara --- */
  gsap.utils.toArray(".split-lines").forEach((el) => {
    SplitText.create(el, {
      type: "lines", mask: "lines", autoSplit: true,
      onSplit: (self) => gsap.from(self.lines, {
        yPercent: 110, stagger: 0.1, duration: 1.1, ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 85%" }
      })
    });
  });

  /* --- Sobre: palavras "acendem" conforme a rolagem (scrub) --- */
  SplitText.create(".split-words", {
    type: "words", autoSplit: true,
    onSplit: (self) => gsap.fromTo(self.words, { opacity: 0.12 }, {
      opacity: 1, stagger: 0.1, ease: "none",
      scrollTrigger: { trigger: ".about-text", start: "top 80%", end: "bottom 55%", scrub: true }
    })
  });

  /* --- Números que contam --- */
  gsap.utils.toArray(".counter").forEach((el) => {
    el.textContent = el.dataset.to;
    gsap.from(el, {
      textContent: 0, snap: { textContent: 1 }, duration: 1.6, ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 90%" }
    });
  });
  ScrollTrigger.batch(".stat", {
    start: "top 90%",
    onEnter: (els) => gsap.from(els, { y: 50, autoAlpha: 0, stagger: 0.12, duration: 1, ease: "expo.out" })
  });

  /* --- Faixas de texto infinitas que aceleram com a rolagem --- */
  const loops = gsap.utils.toArray(".marquee-row").map((row) => {
    row.innerHTML += row.innerHTML; // duplica para o loop não ter emenda
    const reverse = row.classList.contains("reverse");
    return gsap.fromTo(row, { xPercent: reverse ? -50 : 0 },
      { xPercent: reverse ? 0 : -50, duration: 28, ease: "none", repeat: -1 });
  });
  ScrollTrigger.create({
    trigger: ".marquee", start: "top bottom", end: "bottom top",
    onUpdate: (self) => {
      const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 250, 6);
      gsap.to(loops, { timeScale: boost, duration: 0.2, overwrite: true });
      gsap.to(loops, { timeScale: 1, duration: 1.2, delay: 0.2, ease: "power2.out" });
    }
  });

  /* --- Cards de habilidades --- */
  ScrollTrigger.batch(".skill-card", {
    start: "top 88%",
    onEnter: (els) => gsap.from(els, { y: 80, rotateX: -25, autoAlpha: 0, stagger: 0.1, duration: 1.1, ease: "expo.out", transformPerspective: 900 })
  });

  /* --- Projeto: textos entram --- */
  gsap.from(".project-info > :not(.eyebrow)", {
    y: 40, autoAlpha: 0, stagger: 0.07, duration: 1, ease: "expo.out",
    scrollTrigger: { trigger: ".projects", start: "top 65%" }
  });

  /* --- Projeto: navegador cresce com clip-path ao chegar --- */
  gsap.fromTo(".browser",
    { clipPath: "inset(12% 12% 12% 12% round 40px)", scale: 0.9 },
    { clipPath: "inset(0% 0% 0% 0% round 16px)", scale: 1, ease: "none",
      scrollTrigger: { trigger: ".project-visual", start: "top bottom", end: "top 35%", scrub: 1 } });

  /* --- Projeto: PIN + telas trocando com o scroll ---
         No computador a seção fica fixa; no celular só troca as telas */
  const screens = gsap.utils.toArray(".browser-screens img");
  const steps = gsap.utils.toArray(".screen-steps span");

  mm.add({ desktop: "(min-width: 961px)", mobile: "(max-width: 960px)" }, (ctx) => {
    const { desktop } = ctx.conditions;
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: desktop ? ".projects-pin" : ".project-visual",
        start: desktop ? "top top" : "top 55%",
        end: desktop ? `+=${(screens.length - 1) * 110}%` : "bottom top",
        pin: desktop,
        scrub: 1,
        onUpdate: (self) => {
          // cada etapa = troca (0.5) + pausa (0.5); a aba muda na metade da troca
          const t = self.progress * tl.duration();
          const i = Math.max(0, Math.min(screens.length - 1, Math.floor(t - 0.25) + 1));
          steps.forEach((s, n) => s.classList.toggle("active", n === i));
        }
      }
    });
    screens.slice(1).forEach((img, i) => {
      tl.to(screens[i], { scale: 1.08, filter: "brightness(0.6)" })
        .fromTo(img, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)" }, "<")
        .to({}, { duration: 0.5 }); // segura a tela um pouco antes da próxima
    });
    tl.to({}, { duration: 0.4 }); // pequena pausa no final antes de soltar o pin
  });

  /* --- "Em breve" --- */
  gsap.from(".soon-card", {
    y: 80, scale: 0.95, autoAlpha: 0, duration: 1.2, ease: "expo.out",
    scrollTrigger: { trigger: ".soon-card", start: "top 85%" }
  });

  /* --- Formação: linha do tempo se desenha com scrub --- */
  gsap.from(".timeline-line i", {
    scaleY: 0, ease: "none",
    scrollTrigger: { trigger: ".timeline", start: "top 70%", end: "bottom 60%", scrub: true }
  });
  gsap.utils.toArray(".tl-item").forEach((item) => {
    gsap.timeline({ scrollTrigger: { trigger: item, start: "top 75%" } })
      .from(item.querySelector(".tl-dot"), { scale: 0, duration: 0.6, ease: "back.out(3)" })
      .from(item.querySelectorAll(":scope > :not(.tl-dot)"), { x: 40, autoAlpha: 0, stagger: 0.08, duration: 0.9, ease: "expo.out" }, "<");
  });

  /* --- Contato: letras sobem --- */
  const contactChars = SplitText.create(".contact-title .split-chars", { type: "chars", charsClass: "char" }).chars;
  gsap.timeline({ scrollTrigger: { trigger: ".contact", start: "top 65%" } })
    .from(contactChars, { yPercent: 120, rotate: 8, stagger: 0.03, duration: 1.2, ease: "expo.out" })
    .from(".contact-desc, .contact-mail, .contact-links .btn", { y: 30, autoAlpha: 0, stagger: 0.08, duration: 1, ease: "expo.out" }, "-=0.8");

  /* --- Rodapé --- */
  gsap.from(".footer > *", {
    y: 20, autoAlpha: 0, stagger: 0.08, duration: 0.8,
    scrollTrigger: { trigger: ".footer", start: "top 98%" }
  });
}

/* ---------------------------------------------------------
   Navbar: fundo ao rolar, some ao descer, volta ao subir,
   e marca o link da seção atual
   --------------------------------------------------------- */
function startNavWatcher() {
  const nav = document.querySelector(".nav");
  let hidden = false;

  ScrollTrigger.create({
    start: 0, end: "max",
    onUpdate: (self) => {
      const y = self.scroll();
      nav.classList.toggle("is-scrolled", y > 40);
      const hide = self.direction === 1 && y > window.innerHeight * 0.6 && !menuOpen;
      if (hide !== hidden) {
        hidden = hide;
        gsap.to(nav, { yPercent: hide ? -110 : 0, duration: 0.5, ease: "power3.out" });
      }
    }
  });

  document.querySelectorAll("main section[id]").forEach((section) => {
    const link = document.querySelector(`.nav-links a[href="#${section.id}"]`);
    if (!link) return;
    ScrollTrigger.create({
      trigger: section, start: "top 50%", end: "bottom 50%",
      onToggle: (self) => link.classList.toggle("active", self.isActive)
    });
  });
}

/* =========================================================
   3) EFEITOS DE MOUSE (só no computador)
   ========================================================= */
function pointerEffects() {
  /* --- Cursor personalizado --- */
  const cursor = document.querySelector(".cursor");
  const label = cursor.querySelector(".cursor-label");
  const xTo = gsap.quickTo(cursor, "x", { duration: 0.45, ease: "power3" });
  const yTo = gsap.quickTo(cursor, "y", { duration: 0.45, ease: "power3" });

  addEventListener("pointermove", (e) => {
    xTo(e.clientX);
    yTo(e.clientY);
    gsap.to(cursor, { opacity: 1, duration: 0.3, overwrite: "auto" });
  });
  document.addEventListener("pointerleave", () => gsap.to(cursor, { opacity: 0, duration: 0.3 }));

  document.querySelectorAll("a, button, [data-cursor]").forEach((el) => {
    el.addEventListener("pointerenter", () => {
      const text = el.dataset.cursor;
      label.textContent = text || "";
      gsap.to(cursor, { scale: text ? 5 : 2.6, opacity: text ? 1 : 0.35, duration: 0.4, ease: "power3.out" });
      gsap.to(label, { opacity: text ? 1 : 0, scale: text ? 0.2 : 1, duration: 0.3 });
    });
    el.addEventListener("pointerleave", () => {
      gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.4, ease: "power3.out" });
      gsap.to(label, { opacity: 0, duration: 0.2 });
    });
  });

  /* --- Botões magnéticos --- */
  document.querySelectorAll("[data-magnetic]").forEach((el) => {
    const inner = el.querySelector("span") || el;
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      gsap.to(el, { x: dx * 0.3, y: dy * 0.4, duration: 0.5, ease: "power3.out" });
      if (inner !== el) gsap.to(inner, { x: dx * 0.15, y: dy * 0.2, duration: 0.5, ease: "power3.out" });
    });
    el.addEventListener("pointerleave", () => {
      gsap.to([el, inner], { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.35)" });
    });
  });

  /* --- Cards com inclinação 3D e brilho que segue o mouse --- */
  document.querySelectorAll("[data-tilt]").forEach((card) => {
    const rx = gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "power3" });
    const ry = gsap.quickTo(card, "rotationY", { duration: 0.5, ease: "power3" });
    gsap.set(card, { transformPerspective: 900 });
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      rx((0.5 - py) * 10);
      ry((px - 0.5) * 12);
      card.style.setProperty("--mx", `${px * 100}%`);
      card.style.setProperty("--my", `${py * 100}%`);
    });
    card.addEventListener("pointerleave", () => { rx(0); ry(0); });
  });

  /* --- Brilho do fundo do hero segue o mouse --- */
  const gx = gsap.quickTo(".glow-1", "x", { duration: 2, ease: "power2" });
  const gy = gsap.quickTo(".glow-1", "y", { duration: 2, ease: "power2" });
  document.querySelector(".hero").addEventListener("pointermove", (e) => {
    gx((e.clientX / innerWidth - 0.5) * 160);
    gy((e.clientY / innerHeight - 0.5) * 120);
  });
}
