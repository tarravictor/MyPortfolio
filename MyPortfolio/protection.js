
document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Disable right-click only on images and specific elements
    document.addEventListener('contextmenu', function(e) {
        // Only block on images, not on whole page
        if (e.target.tagName === 'IMG' || 
            e.target.classList.contains('card') ||
            e.target.closest('.education-card') ||
            e.target.closest('.certificate-card')) {
            e.preventDefault();
            showTempMessage('⚠️ Right-click disabled on this element');
        }
    });

    document.addEventListener('keydown', function(e) {

        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && e.key === 'I')) {
            e.preventDefault();
            showTempMessage('⚠️ Developer tools are restricted');
            return false;
        }
    });
    

    let lastCopyTime = 0;
    document.addEventListener('copy', function(e) {
        const now = Date.now();
        if (now - lastCopyTime < 1000) { 
            showTempMessage('⚠️ Please slow down on copying');
        }
        lastCopyTime = now;
    });
    
   
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.setAttribute('draggable', 'false');
        img.addEventListener('dragstart', function(e) {
            e.preventDefault();
        });
    });
    

    setTimeout(obfuscateContactInfo, 1000);
    

    function showTempMessage(text) {

        const oldMsg = document.querySelector('.protection-msg');
        if (oldMsg) oldMsg.remove();
        

        const msg = document.createElement('div');
        msg.className = 'protection-msg';
        msg.innerHTML = text;
        msg.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff4444;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            z-index: 10000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            animation: fadeInOut 3s ease;
        `;
        
        // Add CSS for animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateY(-10px); }
                10% { opacity: 1; transform: translateY(0); }
                90% { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(-10px); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(msg);
        

        setTimeout(() => msg.remove(), 3000);
    }
    

    function obfuscateContactInfo() {

        const emailElements = document.querySelectorAll('[href^="mailto:"]');
        emailElements.forEach(el => {
            const email = el.getAttribute('href').replace('mailto:', '');
        
            if (email.includes('@')) {
                const [name, domain] = email.split('@');
                const obfuscated = name.charAt(0) + '•••@' + domain;
                el.setAttribute('title', 'Click to reveal email');
                el.setAttribute('data-email', email);
                el.textContent = obfuscated;
                
                // Click to reveal temporarily
                el.addEventListener('click', function(e) {
                    e.preventDefault();
                    const original = this.getAttribute('data-email');
                    this.textContent = original;
                    setTimeout(() => {
                        this.textContent = obfuscated;
                    }, 3000);
                    window.location.href = 'mailto:' + original;
                });
            }
        });
    }
    
   
    document.addEventListener('keydown', function(e) {

        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            showTempMessage('⚠️ Use the download buttons instead');
            return false;
        }
    });
    

    const printStyle = document.createElement('style');
    printStyle.textContent = `
        @media print {
            body::before {
                content: "Copyright © " attr(data-year) " - Confidential";
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                text-align: center;
                color: rgba(0,0,0,0.1);
                font-size: 40px;
                z-index: 9999;
            }
        }
    `;
    document.head.appendChild(printStyle);
    document.body.setAttribute('data-year', new Date().getFullYear());
});