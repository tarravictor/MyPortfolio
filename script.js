// Victor Tarra — Portfolio
(() => {
  const year = new Date().getFullYear();
  const ghYear = document.getElementById('github-year');
  if (ghYear) ghYear.textContent = year;

  // ----- Route line: fill with scroll, mark passed + current station -----
  const fill = document.getElementById('route-fill');
  const links = [...document.querySelectorAll('.route a[data-station]')];
  const stations = links.map(a => document.getElementById(a.dataset.station));
  const vertical = matchMedia('(min-width: 1000px)');

  let ticking = false;
  let lastCurrent = -1;
  const update = () => {
    ticking = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    const mark = innerHeight * 0.4;
    const tops = stations.map(s => (s ? s.getBoundingClientRect().top : Infinity) - mark);
    tops[0] = -scrollY; // the line starts moving with the first scroll

    // Current station = last section whose top has crossed 40% of the viewport
    let current = 0;
    tops.forEach((t, i) => { if (t <= 0) current = i; });
    if (scrollY >= max - 2) current = stations.length - 1;

    // Fill the line between evenly spaced dots, proportional to progress toward the next station
    let frac = 0;
    if (current < stations.length - 1 && scrollY < max - 2) {
      const span = tops[current + 1] - tops[current];
      frac = span > 0 ? Math.min(1, Math.max(0, -tops[current] / span)) : 0;
    }
    const p = (current + frac) / (stations.length - 1);
    if (fill) fill.style.transform = vertical.matches ? `scaleY(${p})` : `scaleX(${p})`;
    if (current !== lastCurrent) {
      const a = links[current];
      if (lastCurrent !== -1 && a) { a.classList.remove('arrive'); void a.offsetWidth; a.classList.add('arrive'); }
      lastCurrent = current;
    }
    links.forEach((a, i) => {
      a.classList.toggle('active', i === current);
      a.classList.toggle('passed', i < current);
      if (i === current) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    });
  };
  const nowAt = document.getElementById('now-at');
  let lastName = 'Start';
  const wayfind = () => {
    const active = links.find(a => a.classList.contains('active'));
    const name = active ? active.querySelector('.label').textContent : 'Start';
    if (nowAt && name !== lastName) {
      lastName = name;
      nowAt.textContent = name;
      nowAt.classList.remove('swap'); void nowAt.offsetWidth; nowAt.classList.add('swap');
          }
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { update(); wayfind(); }); } };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  update();
  wayfind();

  // ----- Scroll reveals: things appear as you reach them, once -----
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!calm && 'IntersectionObserver' in window) {
    const groups = [
      '.station > h2', '.statement', '.about-list > div', '.intro',
      '.project .shot', '.project-body > *', '.timeline', '.timeline li',
      '.sub', '.certs tbody tr', '.gh-head', '.gh-chart', '.orgs li',
      '.email-row', '.socials', '.form-details', '.footer-inner > *'
    ];
    const targets = new Set();
    groups.forEach(sel => document.querySelectorAll(sel).forEach(el => targets.add(el)));
    targets.forEach(el => {
      // stagger siblings that share a parent (rows, list items, project text)
      const sibs = [...el.parentElement.children].filter(c => targets.has(c));
      el.style.setProperty('--i', Math.min(sibs.indexOf(el), 8));
      el.setAttribute('data-reveal', '');
    });
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    targets.forEach(el => io.observe(el));
    // anything above the fold on load (e.g. deep link) shows right away
    addEventListener('load', () => targets.forEach(el => {
      if (el.getBoundingClientRect().bottom < 0) el.classList.add('is-in');
    }));
  }

  // ----- Theme toggle (remembers choice; otherwise follows the device) -----
  const root = document.documentElement;
  const darkQuery = matchMedia('(prefers-color-scheme: dark)');
  const themeBtns = document.querySelectorAll('.js-theme');
  const isDark = () => root.dataset.theme ? root.dataset.theme === 'dark' : darkQuery.matches;
  const paintTheme = () => {
    const dark = isDark();
    themeBtns.forEach(btn => {
      btn.classList.toggle('is-dark', dark);
      btn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
      const label = btn.querySelector('.theme-label');
      if (label) label.textContent = dark ? 'Light theme' : 'Dark theme';
    });
    document.querySelectorAll('meta[name="theme-color"]').forEach(m => m.setAttribute('content', dark ? '#0E131C' : '#F6F7F9'));
  };
  themeBtns.forEach(btn => btn.addEventListener('click', () => {
    root.dataset.theme = isDark() ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
    paintTheme();
  }));
  darkQuery.addEventListener?.('change', paintTheme);
  paintTheme();

  // ----- Screenshot lightbox -----
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbTitle = document.getElementById('lightbox-title');
  const lbVisit = document.getElementById('lightbox-visit');
  let opener = null;
  document.querySelectorAll('button.shot').forEach(btn => btn.addEventListener('click', () => {
    const img = btn.querySelector('img');
    opener = btn;
    lbImg.src = btn.dataset.full || img.currentSrc || img.src;
    lbImg.alt = img.alt;
    lbTitle.textContent = btn.dataset.title;
    lbVisit.href = btn.dataset.href;
    lbVisit.setAttribute('aria-label', `Visit ${btn.dataset.title} (opens in a new tab)`);
    if (lb.showModal) lb.showModal(); else window.open(btn.dataset.href, '_blank', 'noopener');
  }));
  document.getElementById('lightbox-close')?.addEventListener('click', () => lb.close());
  lb?.addEventListener('click', e => { if (e.target === lb) lb.close(); });
  lb?.addEventListener('close', () => opener?.focus());

  // ----- Copy email -----
  const toast = document.getElementById('toast');
  const copyBtn = document.getElementById('copy-email');
  let timer;
  copyBtn?.addEventListener('click', async () => {
    const label = copyBtn;
    try {
      await navigator.clipboard.writeText('tarravdc@proton.me');
    } catch {
      location.href = 'mailto:tarravdc@proton.me';
      return;
    }
    label.textContent = 'Copied';
    toast.textContent = 'Email copied';
    toast.classList.add('show');
    clearTimeout(timer);
    timer = setTimeout(() => {
      toast.classList.remove('show');
      label.textContent = 'Copy';
    }, 3000);
  });

  // ----- Load Jotform only when opened -----
  document.getElementById('form-details')?.addEventListener('toggle', e => {
    const box = document.getElementById('jotform-container');
    if (!e.target.open || box.childElementCount) return;
    const iframe = document.createElement('iframe');
    iframe.title = 'Contact Victor Tarra';
    iframe.src = 'https://form.jotform.com/262283000382043';
    iframe.loading = 'lazy';
    box.append(iframe);
  });

  // ----- Seal fallback -----
  document.querySelectorAll('.seal').forEach(img => img.addEventListener('error', () => {
    img.src = `https://placehold.co/96x96/FFFFFF/17202A?text=${img.id === 'seal-sbca' ? 'SBCA' : 'CSB'}`;
  }, { once: true }));
})();
