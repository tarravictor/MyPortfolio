// ============================================
// ===== SECURITY PROTECTION =====
// ============================================

document.addEventListener('contextmenu', (e) => e.preventDefault());

document.addEventListener('keydown', (e) => {
    const blocked = ['F12', 'I', 'J', 'C', 'U', 'S', 'P'];
    const ctrl = e.ctrlKey || e.metaKey;
    const shift = e.shiftKey;

    if (e.key === 'F12') return e.preventDefault();
    if (ctrl && shift && blocked.slice(0, 4).includes(e.key.toUpperCase())) {
        e.preventDefault();
    }
    if (ctrl && blocked.slice(4).includes(e.key.toUpperCase())) {
        e.preventDefault();
    }
});

document.addEventListener('dragstart', (e) => e.preventDefault());

document.addEventListener('copy', (e) => {
    const areas = document.querySelectorAll('#hero h1, .about-text, .creds-card, .contact-link');
    areas.forEach(area => {
        if (area.contains(e.target)) {
            e.preventDefault();
            e.clipboardData.setData('text/plain', '© Victor Tarra 2026');
        }
    });
});

// ============================================
// ===== NAVIGATION =====
// ============================================

const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navAnchors = document.querySelectorAll('.nav-links a');

navToggle?.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

navAnchors.forEach(link => {
    link.addEventListener('click', () => {
        navToggle?.classList.remove('active');
        navLinks?.classList.remove('active');
    });
});

// ===== SCROLL REVEAL =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.section-container').forEach(el => {
    if (!el.closest('#hero')) observer.observe(el);
    else el.classList.add('revealed');
});

// ===== ACTIVE NAV =====
const sections = document.querySelectorAll('section');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 120) {
            current = section.id;
        }
    });
    navAnchors.forEach(link => {
        link.classList.toggle('nav-link-active', link.getAttribute('href') === `#${current}`);
    });
});
