// ===== SECURITY & PRIVACY PROTECTION =====

// 1. Disable Right Click
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    showProtectionToast('Right-click is disabled to protect content.');
});

// 2. Disable Keyboard Shortcuts for DevTools
document.addEventListener('keydown', (e) => {
    // F12
    if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        showProtectionToast('Developer tools access is restricted.');
        return false;
    }
    // Ctrl+Shift+I / Cmd+Option+I
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
        e.preventDefault();
        showProtectionToast('Developer tools access is restricted.');
        return false;
    }
    // Ctrl+Shift+J / Cmd+Option+J
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'J' || e.key === 'j')) {
        e.preventDefault();
        showProtectionToast('Developer tools access is restricted.');
        return false;
    }
    // Ctrl+Shift+C / Cmd+Option+C
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
        showProtectionToast('Developer tools access is restricted.');
        return false;
    }
    // Ctrl+U / Cmd+Option+U (View Source)
    if ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
        showProtectionToast('Viewing source code is disabled.');
        return false;
    }
    // Ctrl+S / Cmd+S (Save Page)
    if ((e.ctrlKey || e.metaKey) && (e.key === 'S' || e.key === 's')) {
        e.preventDefault();
        showProtectionToast('Saving page content is disabled.');
        return false;
    }
    // Ctrl+P / Cmd+P (Print)
    if ((e.ctrlKey || e.metaKey) && (e.key === 'P' || e.key === 'p')) {
        e.preventDefault();
        showProtectionToast('Printing is disabled.');
        return false;
    }
});

// 3. Disable Drag on Images and Content
document.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'IMG' || e.target.tagName === 'A') {
        e.preventDefault();
        showProtectionToast('Dragging content is disabled.');
        return false;
    }
});

// 4. Disable Selection on Sensitive Elements
document.addEventListener('selectstart', (e) => {
    const protectedAreas = document.querySelectorAll('#hero h1, .about-image, .about-initials, .credentials-card, .contact-info-card');
    protectedAreas.forEach(area => {
        if (area.contains(e.target)) {
            e.preventDefault();
            return false;
        }
    });
});

// 5. Protection Toast Notification
function showProtectionToast(message) {
    // Remove existing toast if any
    const existingToast = document.querySelector('.protection-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'protection-toast';
    toast.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="#00d4aa" stroke-width="1.5"/>
            <path d="M8 4.5V8.5M8 10.5V11" stroke="#00d4aa" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Remove after 2.5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// Add toast styles dynamically
const toastStyles = document.createElement('style');
toastStyles.textContent = `
    .protection-toast {
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: rgba(10, 10, 10, 0.95);
        border: 1px solid rgba(0, 212, 170, 0.4);
        color: #ffffff;
        padding: 12px 24px;
        border-radius: 50px;
        font-family: 'Hagrid', 'Segoe UI', sans-serif;
        font-size: 0.8rem;
        letter-spacing: 0.5px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 99999;
        opacity: 0;
        transition: all 0.3s ease;
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        pointer-events: none;
    }
    .protection-toast.show {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }
`;
document.head.appendChild(toastStyles);

// 6. Detect DevTools Open (Console)
// Override console methods to prevent tampering
const noopConsole = function() {};
if (typeof console !== 'undefined') {
    const methods = ['log', 'debug', 'info', 'warn', 'error', 'table', 'trace', 'dir', 'dirxml', 'group', 'groupCollapsed', 'groupEnd', 'time', 'timeEnd', 'profile', 'profileEnd', 'count', 'assert', 'clear'];
    methods.forEach(method => {
        console[method] = noopConsole;
    });
}

// 7. Detect DevTools via Timing
let devtoolsOpen = false;
const threshold = 160;

function detectDevTools() {
    const start = performance.now();
    debugger;
    const end = performance.now();
    if (end - start > threshold) {
        if (!devtoolsOpen) {
            devtoolsOpen = true;
            showProtectionToast('⚠️ Developer tools detected. Please close it.');
            // Blur the page content
            document.body.style.filter = 'blur(20px)';
            document.body.style.pointerEvents = 'none';
            setTimeout(() => {
                document.body.style.filter = '';
                document.body.style.pointerEvents = '';
                devtoolsOpen = false;
            }, 3000);
        }
    }
}
setInterval(detectDevTools, 2000);

// 8. Watermark Console Warning
const consoleWarning = document.createElement('div');
consoleWarning.style.display = 'none';
consoleWarning.textContent = '%c⚠️ STOP! %cThis is a protected website. Unauthorized access to console is prohibited. %cVictor Tarra © 2026';
document.body.appendChild(consoleWarning);

// Override toString to show warning if someone tries to view source
Object.defineProperty(window, 'devtools', {
    get: function() {
        showProtectionToast('⚠️ Unauthorized access detected.');
        return {};
    }
});

// 9. Prevent iframe embedding (clickjacking protection)
if (window.top !== window.self) {
    window.top.location = window.self.location;
}

// 10. Detect Print Screen (basic detection)
window.addEventListener('blur', () => {
    // Could indicate Alt+Tab or Print Screen
    // Lightweight detection
});

// 11. Clear clipboard if someone tries to copy
document.addEventListener('copy', (e) => {
    const protectedAreas = document.querySelectorAll('#hero h1, .about-text, .credentials-card, .contact-info-card');
    protectedAreas.forEach(area => {
        if (area.contains(e.target)) {
            e.preventDefault();
            e.clipboardData.setData('text/plain', 'Copying is disabled on this website. © Victor Tarra');
            showProtectionToast('Copying content is restricted.');
        }
    });
});

// 12. Disable cut
document.addEventListener('cut', (e) => {
    e.preventDefault();
    showProtectionToast('Cutting content is disabled.');
});

// ============================================
// ===== BELOW: YOUR ORIGINAL SCRIPT.JS =====
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
        cursor.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
    }
});

function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    if (cursorFollower) {
        cursorFollower.style.transform = `translate(${followerX - 18}px, ${followerY - 18}px)`;
    }
    requestAnimationFrame(animateFollower);
}
animateFollower();

// Hover effect on interactive elements
const interactiveElements = document.querySelectorAll('a, button, .btn, .credentials-card, .contact-info-card, .tag');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        if (cursorFollower) cursorFollower.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
        if (cursorFollower) cursorFollower.classList.remove('hover');
    });
});

// ===== NAVIGATION SCROLL EFFECT =====
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// ===== MOBILE NAVIGATION =====
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

// ===== SCROLL REVEAL ANIMATION =====
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

// ===== PARALLAX ORB MOVEMENT =====
const orb = document.querySelector('.hero-orb');
document.addEventListener('mousemove', (e) => {
    if (!orb) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    orb.style.transform = `translate(${x}px, ${y}px)`;
});
