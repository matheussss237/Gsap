# Portfólio GSAP + ScrollTrigger

Portfólio com animações ligadas à rolagem da página, feito com [GSAP](https://gsap.com) e o plugin **ScrollTrigger**.

Para abrir, basta abrir o `index.html` no navegador (o GSAP é carregado por CDN).

## Animações (em `script.js`)

| # | Efeito | Recurso do ScrollTrigger |
|---|--------|--------------------------|
| 1 | **Animação de entrada**: contador de 0 a 100, a tela verde sobe e as letras do nome aparecem uma a uma | `gsap.timeline()` (roda ao carregar a página) |
| 2 | Títulos e textos surgem ao entrar na tela | `toggleActions` (**inicia** a animação) |
| 3 | O nome do hero sobe e some enquanto você rola | `scrub: true` (**controla a progressão**) |
| 4 | Texto gigante anda para o lado | `scrub: 1` (**suaviza**) |
| 5 | Seção de projetos fica fixa e os cards rolam na horizontal | `pin: true` + `scrub` (**fixa**) |
| 6 | Barras de habilidades enchem conforme o scroll | `scrub` + `stagger` |
