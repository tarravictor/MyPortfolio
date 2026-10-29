<div align="center">

<img src="favicon.svg" width="72" alt="Portfolio logo" />

# VICTOR TARRA

**Information Systems student · De La Salle College of Saint Benilde**

*One route line. Every section is a station.*

<br />

[![Visit the live site](https://img.shields.io/badge/%E2%86%92%20VISIT%20THE%20LIVE%20SITE-213C91?style=for-the-badge)](https://tarravictor.github.io/MyPortfolio/)

<br />

[![Portfolio screenshot](docs/screenshot.png)](https://tarravictor.github.io/MyPortfolio/)

<br />

![HTML5](https://img.shields.io/badge/HTML5-213C91?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-2D4FB8?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-213C91?style=flat-square&logo=javascript&logoColor=white)
![No build step](https://img.shields.io/badge/BUILD%20STEP-NONE-2D4FB8?style=flat-square)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-213C91?style=flat-square&logo=github&logoColor=white)

</div>

<br />

## The route

```text
  ●  START
  ┃
  ◉  01  ABOUT         who I am, what I study
  ┃
  ◉  02  PROJECTS      BeepAlerts.PH · TommyCo · APPDAET
  ┃
  ◉  03  CREDENTIALS   education, certificates, GitHub
  ┃
  ◉  04  CONTACT       say hello
  ┃
  ●  END OF LINE
```

The page is drawn as a transit map. The line fills in as you scroll, and each section lights up as a station.

## Design

| | |
|---|---|
| **Typeface** | Overpass |
| **Accent** | a single blue, `#2D4FB8` (light) / `#7D97F0` (dark) |
| **Theme** | light and dark, with a manual toggle |
| **Stack** | plain HTML, CSS and JavaScript. No framework, no build |

## Security

The site is static, with no backend or stored data of its own, and it is hardened accordingly:

- Content-Security-Policy on every page, with inline scripts allowed by hash instead of `'unsafe-inline'`
- No third-party scripts. The only external requests are fonts, the contact form frame and a few images
- External links use `rel="noopener noreferrer"`
- CodeQL scanning and Dependabot are enabled

## Run locally

```bash
git clone https://github.com/tarravictor/MyPortfolio.git
cd MyPortfolio
python3 -m http.server 4173
```

Open <http://localhost:4173>.

<br />

<div align="center">

**[LinkedIn](https://linkedin.com/in/tarravictor)** &nbsp;·&nbsp; **[GitHub](https://github.com/tarravictor)** &nbsp;·&nbsp; **tarravdc@proton.me**

</div>
