// 1. Disable Right Click
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    showProtectionToast('Right-click is disabled.');
});

// 2. Disable Keyboard Shortcuts for DevTools
document.addEventListener('keydown', (e) => {
    if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        showProtectionToast('Developer tools restricted.');
        return false;
    }
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
        e.preventDefault();
        showProtectionToast('Developer tools restricted.');
        return false;
    }
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'J' || e.key === 'j')) {
        e.preventDefault();
        showProtectionToast('Developer tools restricted.');
        return false;
    }
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
        showProtectionToast('Developer tools restricted.');
        return false;
    }
    if ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
        showProtectionToast('View source disabled.');
        return false;
    }
    if ((e.ctrlKey || e.metaKey) && (e.key === 'S' || e.key === 's')) {
        e.preventDefault();
        showProtectionToast('Save disabled.');
        return false;
    }
    if ((e.ctrlKey || e.metaKey) && (e.key === 'P' || e.key === 'p')) {
        e.preventDefault();
        showProtectionToast('Print disabled.');
        return false;
    }
});

// 3. Disable Drag
document.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'IMG' || e.target.tagName === 'A') {
        e.preventDefault();
        showProtectionToast('Dragging disabled.');
        return false;
    }
});

// 4. Disable Selection on Sensitive Elements
document.addEventListener('selectstart', (e) => {
    const protectedAreas = document.querySelectorAll('#hero h1, .about-image, .credentials-card, .contact-card');
    protectedAreas.forEach(area => {
        if (area.contains(e.target)) {
            e.preventDefault();
            return false;
        }
    });
});

// 5. Protection Toast
function showProtectionToast(message) {
    const existingToast = document.querySelector('.protection-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'protection-toast';
    toast.innerHTML = `
        <span>◆</span>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2200);
}

const toastStyles = document.createElement('style');
toastStyles.textContent = `
    .protection-toast {
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%) translateY(80px);
        background: rgba(10, 10, 10, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #ffffff;
        padding: 10px 22px;
        border-radius: 4px;
        font-family: 'Hagrid', 'Segoe UI', sans-serif;
        font-size: 0.7rem;
        letter-spacing: 0.5px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 99999;
        opacity: 0;
        transition: all 0.3s ease;
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
        pointer-events: none;
    }
    .protection-toast.show {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }
`;
document.head.appendChild(toastStyles);

// 6. Detect DevTools via Timing
let devtoolsOpen = false;
const threshold = 160;

function detectDevTools() {
    const start = performance.now();
    debugger;
    const end = performance.now();
    if (end - start > threshold) {
        if (!devtoolsOpen) {
            devtoolsOpen = true;
            showProtectionToast('⚠️ Developer tools detected.');
            document.body.style.filter = 'blur(16px)';
            document.body.style.pointerEvents = 'none';
            setTimeout(() => {
                document.body.style.filter = '';
                document.body.style.pointerEvents = '';
                devtoolsOpen = false;
            }, 2500);
        }
    }
}
setInterval(detectDevTools, 2000);

// 7. Prevent iframe embedding
if (window.top !== window.self) {
    window.top.location = window.self.location;
}

// 8. Disable copy/cut
document.addEventListener('copy', (e) => {
    const protectedAreas = document.querySelectorAll('#hero h1, .about-text, .credentials-card, .contact-card');
    protectedAreas.forEach(area => {
        if (area.contains(e.target)) {
            e.preventDefault();
            e.clipboardData.setData('text/plain', 'Content protected. © Victor Tarra 2026');
            showProtectionToast('Copying disabled.');
        }
    });
});

document.addEventListener('cut', (e) => {
    e.preventDefault();
    showProtectionToast('Cutting disabled.');
});

// ============================================
// ===== INTERACTIONS =====
// ============================================

// ===== CUSTOM CURSOR =====
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursor) {
        cursor.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px)`;
    }
});

function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    if (cursorFollower) {
        cursorFollower.style.transform = `translate(${followerX - 16}px, ${followerY - 16}px)`;
    }
    requestAnimationFrame(animateFollower);
}
animateFollower();

// Hover effect on interactive elements
const interactiveElements = document.querySelectorAll('a, button, .btn, .credentials-card, .contact-card, .tag');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        if (cursorFollower) cursorFollower.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
        if (cursorFollower) cursorFollower.classList.remove('hover');
    });
});

// ===== NAVIGATION SCROLL =====
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== MOBILE NAV =====
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const allNavLinks = document.querySelectorAll('.nav-links a');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ===== SCROLL REVEAL =====
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -30px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, observerOptions);

document.querySelectorAll('.section-container').forEach(el => {
    if (!el.closest('#hero')) {
        observer.observe(el);
    } else {
        el.classList.add('revealed');
    }
});

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section');
const navAnchors = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    navAnchors.forEach(link => {
        link.classList.remove('nav-link-active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('nav-link-active');
        }
    });
});
