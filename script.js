/* Keep the original document usable if JavaScript is unavailable. */
(() => {
    const main = document.querySelector('main');
    const sections = ['credentials', 'projects', 'contact'];
    const overview = document.createElement('section');
    overview.className = 'work-overview';
    overview.setAttribute('aria-label', 'Credentials and selected projects');
    overview.innerHTML = `
        <aside class="credentials-summary" aria-labelledby="credentials-summary-title">
            <h2 id="credentials-summary-title" class="eyebrow">My Credentials</h2>
            <p class="degree">BS Information Systems</p>
            <p class="institution">De La Salle–College of Saint Benilde</p>
            <a class="text-link certificate-link" href="#credentials">${document.querySelectorAll('.cert').length} certificates <span aria-hidden="true">↗</span></a>
            <p class="credential-note">Education, certifications<br> &amp; GitHub activity</p>
            <a class="text-link" href="#credentials">Explore credentials <span aria-hidden="true">↗</span></a>
        </aside>
        <section class="selected-work" id="selected-work" aria-labelledby="selected-work-title" tabindex="-1">
            <div class="work-heading"><h2 id="selected-work-title">My Projects</h2><span>Selected academic work / 01—03</span></div>
            <div class="project-list"></div>
        </section>`;
    document.querySelectorAll('.project-card').forEach((card, index) => {
        card.id = `project-${index + 1}`;
        const link = document.createElement('a');
        link.href = '#projects';
        link.dataset.project = card.id;
        link.className = 'project-item';
        link.setAttribute('aria-haspopup', 'dialog');
        const image = card.querySelector('.project-preview img').cloneNode();
        image.alt = '';
        image.loading = 'eager';
        const preview = document.createElement('div');
        preview.className = 'work-image';
        const prompt = document.createElement('span');
        prompt.className = 'work-prompt';
        prompt.textContent = 'View project ↗';
        preview.append(image, prompt);
        const caption = document.createElement('div');
        caption.className = 'work-caption';
        const number = document.createElement('span');
        number.className = 'work-number';
        number.textContent = String(index + 1).padStart(2, '0');
        const title = document.createElement('h3');
        title.textContent = card.querySelector('h3').textContent;
        const arrow = document.createElement('span');
        arrow.className = 'work-arrow';
        arrow.textContent = '↗';
        arrow.setAttribute('aria-hidden', 'true');
        caption.append(number, title, arrow);
        const category = document.createElement('p');
        category.className = 'work-category';
        category.textContent = card.querySelector('.project-tags span').textContent;
        link.append(preview, caption, category);
        overview.querySelector('.project-list').append(link);
    });
    main.append(overview);

    const footer = document.querySelector('.footer');
    const copyright = footer.querySelector('p');
    copyright.className = 'copyright';
    const footerInner = document.createElement('div');
    footerInner.className = 'footer-inner';
    const contactLine = document.createElement('div');
    contactLine.className = 'contact-line';
    const contactPrompt = document.createElement('span');
    contactPrompt.textContent = 'Have a project in mind?';
    const email = document.createElement('a');
    email.className = 'text-link email-link';
    email.href = 'mailto:tarravdc@proton.me';
    email.innerHTML = 'tarravdc@proton.me <span aria-hidden="true">↗</span>';
    contactLine.append(contactPrompt, email);
    const footerMeta = document.createElement('div');
    footerMeta.className = 'footer-meta';
    const socialLinks = document.createElement('div');
    socialLinks.className = 'social-links';
    footerMeta.append(socialLinks, copyright);
    footerInner.append(contactLine, footerMeta);
    footer.replaceChildren(footerInner);
    document.querySelectorAll('.contact-links a:not([href^="mailto"])').forEach(link => {
        const copy = document.createElement('a');
        copy.className = 'text-link';
        copy.href = link.href;
        copy.target = '_blank';
        copy.rel = 'noopener noreferrer';
        copy.textContent = link.querySelector('.contact-label').textContent + ' ↗';
        socialLinks.append(copy);
    });

    const dialogs = new Map();
    sections.forEach(id => {
        const section = document.getElementById(id);
        const dialog = document.createElement('dialog');
        dialog.className = 'detail-dialog';
        dialog.id = `${id}-dialog`;
        document.querySelectorAll(`a[href="#${id}"]`).forEach(link => {
            if (id !== 'projects' || link.dataset.project) {
                link.setAttribute('aria-haspopup', 'dialog');
                link.setAttribute('aria-controls', dialog.id);
            }
        });
        dialog.setAttribute('aria-labelledby', `${id}-title`);
        section.querySelector('h2').id = `${id}-title`;
        const toolbar = document.createElement('div');
        toolbar.className = 'dialog-toolbar';
        const label = document.createElement('span');
        label.textContent = 'VT / ' + section.querySelector('h2').textContent.trim();
        const close = document.createElement('button');
        close.type = 'button';
        close.className = 'dialog-close';
        close.textContent = 'Close ×';
        close.setAttribute('aria-label', `Close ${section.querySelector('h2').textContent.trim()}`);
        close.autofocus = true;
        close.addEventListener('click', () => dialog.close());
        toolbar.append(label, close);
        dialog.append(toolbar, section);
        document.body.append(dialog);
        dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
        dialog.addEventListener('close', () => {
            document.body.classList.remove('dialog-open');
            document.querySelectorAll('[aria-current]').forEach(link => link.removeAttribute('aria-current'));
            if (location.hash === '#' + id) history.replaceState(null, '', location.pathname + location.search);
        });
        dialogs.set(id, dialog);
    });

    function openSection(id, project) {
        const dialog = dialogs.get(id);
        if (!dialog) {
            // A hash with no dialog (e.g. the wordmark's #top) means "leave detail view".
            dialogs.forEach(other => { if (other.open) other.close(); });
            return;
        }
        if (dialog.open) return;
        dialogs.forEach(other => { if (other.open && other !== dialog) other.close(); });
        dialog.showModal();
        document.body.classList.add('dialog-open');
        document.querySelectorAll('#nav-menu a').forEach(link => {
            if (link.hash === '#' + id) link.setAttribute('aria-current', 'page');
        });
        dialog.scrollTop = 0;
        if (project) document.getElementById(project)?.scrollIntoView({ block: 'start' });
        if (id === 'contact') loadContactForm();
    }
    document.addEventListener('click', event => {
        const link = event.target.closest('a[href^="#"]');
        if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        const id = link.hash.slice(1);
        if (id === 'about' || (id === 'projects' && !link.dataset.project)) {
            event.preventDefault();
            const target = document.getElementById(id === 'about' ? 'about' : 'selected-work');
            document.querySelectorAll('#nav-menu a').forEach(item => item.removeAttribute('aria-current'));
            document.querySelector(`#nav-menu a[href="#${id}"]`)?.setAttribute('aria-current', 'location');
            target.focus({ preventScroll: true });
            if (window.matchMedia('(max-width: 1199px), (max-height: 679px)').matches) target.scrollIntoView({ block: 'center', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
            target.classList.remove('section-highlight');
            requestAnimationFrame(() => target.classList.add('section-highlight'));
        } else if (dialogs.has(id)) {
            event.preventDefault();
            openSection(id, link.dataset.project);
        }
    });
    window.addEventListener('hashchange', () => openSection(location.hash.slice(1)));

    function loadContactForm() {
        const wrapper = document.getElementById('jotform-form-wrapper');
        if (wrapper.childElementCount) return;
        const iframe = document.createElement('iframe');
        iframe.title = 'Contact Victor Tarra';
        iframe.src = 'https://form.jotform.com/262283000382043';
        iframe.className = 'contact-iframe';
        // Native iframe scrolling preserves access to long forms and validation messages.
        wrapper.append(iframe);
        document.getElementById('jotform-loader').hidden = true;
        const fallback = document.createElement('p');
        fallback.className = 'form-fallback';
        fallback.innerHTML = 'Prefer a separate page? <a href="https://form.jotform.com/262283000382043" target="_blank" rel="noopener noreferrer">Open the contact form ↗</a>';
        wrapper.append(fallback);
    }
    document.body.classList.add('portfolio');
    document.querySelectorAll('.fade').forEach(element => element.classList.add('show'));
    document.getElementById('github-year').textContent = new Date().getFullYear();
    if (window.lucide) window.lucide.createIcons();
    openSection(location.hash.slice(1));
})();
