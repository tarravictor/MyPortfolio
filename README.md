# Victor Tarra — Portfolio

[Live site](https://tarravictor.github.io/MyPortfolio/)

Built with HTML, CSS & JavaScript. No dependencies or build step required.

## Local preview

Run `python3 -m http.server 4173` from this directory, then open http://localhost:4173.

## Layout

The desktop presentation uses an editorial grid: a large name and introduction,
a monochrome portrait, a quiet credentials column, and three image-led project
previews. Contact and social links sit along the bottom edge. There are no
container cards in the main composition.

About Me and My Projects focus and briefly highlight their visible sections.
Credentials, project previews, and Contact open native dialogs with the complete
original content. Escape or Close dismisses a dialog and restores focus. Detail
panels scroll when necessary. The contact form loads only when opened.

Below 1200px wide or 680px tall, the page uses natural scrolling. Mobile puts
projects before credentials and uses full-width previews. Reduced motion is
respected. Without JavaScript, the original detail sections and direct contact
form link remain accessible.

- `style.css`: shared visual system and original detail components
- `github-credentials.css`: GitHub activity components
- `portfolio.css`: editorial composition, detail views, responsive styles
- `script.js`: project previews, focus navigation, dialogs, lazy contact form

## Validation

Browser-tested with Chromium at 1920×1080, 1440×900, 1366×768, and 1280×720:
no vertical or horizontal page overflow; the hero, project section, and footer
do not overlap. Reviewed desktop and mobile screenshots and refined the layout
after rendering.

Also checked 1024×768, 768×1024, 390×844, and 320×568 for horizontal overflow.
Checked navigation focus, all three project previews, credentials/contact dialogs,
Escape and Close, focus restoration, deep linking, reduced motion, and JavaScript
errors. The external contact form loaded successfully; no message was submitted.
External links are preserved, but availability of third-party destinations is
controlled by their providers.
