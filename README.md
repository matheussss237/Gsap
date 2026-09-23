# Portfólio — Matheus Henrique

Portfólio pessoal de **Matheus Henrique**, desenvolvedor back-end em formação (Java, Spring Boot e Segurança da Informação), de Gama — DF.

🔗 **Site:** https://matheussss237.github.io/Gsap/

## Tecnologias

- HTML, CSS e JavaScript puro, sem frameworks e sem etapa de build
- [GSAP 3.13](https://gsap.com) via CDN, com os plugins:
  - **ScrollTrigger**: animações ligadas à rolagem (iniciar, `scrub`, `pin`)
  - **ScrollSmoother**: rolagem suave
  - **SplitText**: textos animados por letra, palavra e linha
  - **ScrambleText** e **Text**: efeito "hacker" no cargo e digitação no loader
- `clip-path` (estilo [Clippy](https://bennettfeely.com/clippy/)) para revelar o site, a foto, o menu e as telas do projeto
- View Transitions API para a troca de tema em círculo

## Animações

| Onde | O que acontece | Recurso |
|---|---|---|
| Entrada | Terminal digita `java -jar portfolio.jar`, contador 000→100 e cortina com clip-path | `timeline`, TextPlugin, clip-path |
| Hero | Nome surge letra por letra, a foto é revelada e o cargo "embaralha" em loop | SplitText, ScrambleText |
| Hero (scroll) | Nome sobe, foto gira e diminui (parallax) | `scrub` |
| Sobre | As palavras "acendem" conforme a rolagem | SplitText + `scrub` |
| Números | Contadores animados | `snap` |
| Stack | Faixas infinitas que aceleram com a velocidade do scroll | `getVelocity()` |
| Projeto | A seção fica fixa e as telas do sistema trocam com a rolagem | `pin` + `scrub` + clip-path |
| Formação | A linha do tempo se desenha | `scrub` |
| Mouse | Cursor personalizado, botões magnéticos, cards 3D | `quickTo` |

Também tem tema claro e escuro (salvo no navegador), menu em tela cheia no celular e suporte a
`prefers-reduced-motion` (quem desativa animações no sistema vê o site sem elas).

## Estrutura

```
index.html
css/style.css
js/main.js
assets/
  img/      foto e prints dos projetos
  icons/    ícones das tecnologias (Devicon)
  cv/       currículo (cv.html + PDF)
```

## Como editar

- **Textos:** estão todos no `index.html`.
- **Cores:** ficam em variáveis no topo do `css/style.css` (`:root` é o tema escuro e `[data-theme="light"]` é o claro).
- **Novo projeto:** copie o bloco `<section class="projects">` no `index.html`.
- **Currículo:** edite `assets/cv/cv.html`, abra no navegador, use *Imprimir → Salvar como PDF* (A4, sem margens, com "gráficos de fundo" ligado) e salve por cima de `assets/cv/Matheus-Henrique-CV.pdf`.

## Rodar localmente

Abra o `index.html` no navegador, ou rode `python -m http.server` e acesse `http://localhost:8000`.
