// ============================================
// ===== SECURITY PROTECTION =====
// ============================================

// Disable right click
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// Disable keyboard shortcuts
document.addEventListener('keydown', function(e) {
    var blocked = ['F12', 'I', 'J', 'C', 'U', 'S', 'P'];
    var ctrl = e.ctrlKey || e.metaKey;
    var shift = e.shiftKey;

    if (e.key === 'F12') {
        e.preventDefault();
        return false;
    }
    if (ctrl && shift && blocked.slice(0, 4).indexOf(e.key.toUpperCase()) !== -1) {
        e.preventDefault();
        return false;
    }
    if (ctrl && blocked.slice(4).indexOf(e.key.toUpperCase()) !== -1) {
        e.preventDefault();
        return false;
    }
});

// Disable drag
document.addEventListener('dragstart', function(e) {
    e.preventDefault();
});

// Disable copy on protected areas
document.addEventListener('copy', function(e) {
    var areas = document.querySelectorAll('#hero h1, .about-main, .creds-block, .contact-item');
    var target = e.target;
    var protected = false;
    areas.forEach(function(area) {
        if (area.contains(target)) {
            protected = true;
        }
    });
    if (protected) {
        e.preventDefault();
        e.clipboardData.setData('text/plain', '© Victor Tarra 2026');
    }
});

// ============================================
// ===== NAVIGATION =====
// ============================================

var navLinks = document.querySelectorAll('.sidebar-nav a');
var sections = document.querySelectorAll('section');

// Smooth scroll for sidebar links
navLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        var target = document.querySelector(link.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
        // Update active state
        navLinks.forEach(function(l) { l.classList.remove('active'); });
        link.classList.add('active');
    });
});

// ===== SCROLL REVEAL =====
var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.container').forEach(function(el) {
    var section = el.closest('section');
    if (section && section.id !== 'hero') {
        observer.observe(el);
    } else if (section && section.id === 'hero') {
        el.classList.add('revealed');
    }
});

// ===== ACTIVE NAV ON SCROLL =====
window.addEventListener('scroll', function() {
    var current = '';
    sections.forEach(function(section) {
        if (window.scrollY >= section.offsetTop - 200) {
            current = section.id;
        }
    });
    navLinks.forEach(function(link) {
        var href = link.getAttribute('href');
        if (href === '#' + current) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});
