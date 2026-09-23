gsap.registerPlugin(ScrollTrigger);

// Quebra o título do hero em letras para animar uma por uma
document.querySelectorAll(".split").forEach(el => {
  el.innerHTML = [...el.textContent].map(c => `<span class="char">${c}</span>`).join("");
});

/* =====================================================
   1) ANIMAÇÃO DE ENTRADA
   Contador 0 → 100, a tela verde sobe e o hero aparece
   ===================================================== */
const counter = { v: 0 };
const intro = gsap.timeline();

intro
  .to(counter, {
    v: 100, duration: 2, ease: "power2.inOut",
    onUpdate: () => (document.querySelector(".intro-count").textContent = Math.round(counter.v))
  })
  .to(".intro-bar", { scaleX: 1, duration: 2, ease: "power2.inOut" }, 0)
  .to(".intro", { yPercent: -100, duration: 1, ease: "power4.inOut" })
  .from(".hero-title .char", { yPercent: 110, stagger: 0.06, duration: 0.8, ease: "back.out(1.7)" }, "-=0.4")
  .from(".hero-sub, .nav, .scroll-hint", { y: 30, opacity: 0, stagger: 0.1 }, "-=0.5");

/* =====================================================
   2) REVEAL: elementos surgem ao entrar na tela
   ===================================================== */
gsap.utils.toArray(".reveal").forEach(el => {
  gsap.from(el, {
    y: 60, opacity: 0, duration: 1,
    scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" }
  });
});

/* =====================================================
   3) SCRUB: título do hero sobe/some conforme o scroll
   ===================================================== */
gsap.to(".hero-title", {
  yPercent: -40, opacity: 0.2,
  scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
});

/* =====================================================
   4) SCRUB: texto gigante anda para o lado
   ===================================================== */
gsap.fromTo(".marquee-text", { xPercent: 10 }, {
  xPercent: -60,
  scrollTrigger: { trigger: ".marquee", start: "top bottom", end: "bottom top", scrub: 1 }
});

/* =====================================================
   5) PIN + SCRUB: seção fixa e cards rolam na horizontal
   ===================================================== */
const track = document.querySelector(".projetos-track");

gsap.to(track, {
  x: () => -(track.scrollWidth - window.innerWidth),
  ease: "none",
  scrollTrigger: {
    trigger: ".projetos",
    pin: true,                                   // fixa a seção
    scrub: 1,                                    // suaviza o movimento
    end: () => "+=" + track.scrollWidth,         // duração do pin
    invalidateOnRefresh: true
  }
});

/* =====================================================
   6) SCRUB: barras de habilidade enchem com o scroll
   ===================================================== */
gsap.from(".bar i", {
  scaleX: 0, stagger: 0.2,
  scrollTrigger: { trigger: ".skills", start: "top 70%", end: "center center", scrub: 1 }
});
