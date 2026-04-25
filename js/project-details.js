/**
 * Project Details Page — dynamic rendering from projects.json
 * Includes photo gallery with lightbox for project id 6 (NaturalMed Clinic Manager)
 */

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('project') || '1';
    loadProjectDetails(projectId);
    const yr = document.getElementById('current-year');
    if (yr) yr.textContent = new Date().getFullYear();
    initializeProjectNavigation();
});

async function loadProjectDetails(projectId) {
    const lang = (document.documentElement.lang || 'en') === 'pt' ? 'pt' : 'en';
    const jsonPath = `../data/projects_${lang}.json`;

    try {
        const response = await fetch(jsonPath);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        const projectData = data.projects.find(p => p.id == projectId);
        if (!projectData) throw new Error(`Project ${projectId} not found`);
        renderProjectPage(projectData);
    } catch (error) {
        console.error('Error loading project details:', error);
        const el = id => document.getElementById(id);
        if (el('project-title')) el('project-title').textContent = 'Project not found';
        if (el('project-description')) el('project-description').textContent = 'Could not load project data. Please try again.';
    }
}

function renderProjectPage(p) {
    // Cover image — shown when project has an image field
    injectCoverImage(p);
    if (!p) return;

    const lang = (document.documentElement.lang || 'en') === 'pt' ? 'pt' : 'en';

    // Title and meta
    document.title = `${p.title} — Pedro Pestana`;
    const el = id => document.getElementById(id);
    if (el('project-title'))       el('project-title').textContent = p.title || '';
    if (el('project-description')) el('project-description').textContent = p.description || '';
    if (el('project-category'))    el('project-category').textContent = p.category || '';
    if (el('project-year'))        el('project-year').textContent = p.year || '';

    // Header links
    const liveLink = el('project-live-link');
    const ghLink   = el('project-github-link');
    if (liveLink) {
        if (p.link) {
            const isGumroad = p.link.includes('gumroad.com');
            liveLink.href = p.link;
            liveLink.innerHTML = isGumroad
                ? '<i class="fas fa-shopping-cart"></i> Buy on Gumroad'
                : '<i class="fas fa-external-link-alt"></i> Visit Site';
        } else {
            liveLink.style.display = 'none';
        }
    }
    if (ghLink) {
        if (p.github) { ghLink.href = p.github; }
        else { ghLink.style.display = 'none'; }
    }

    // Status banner
    const statusBanner = el('project-status-banner');
    if (statusBanner) {
        if (p.status === 'in-development') {
            statusBanner.innerHTML = '<i class="fas fa-code-branch"></i> This project is currently in active development.';
            statusBanner.style.display = 'block';
        } else if (p.status === 'coming-soon') {
            statusBanner.innerHTML = '<i class="fas fa-clock"></i> Full documentation and code will be published when the project is complete.';
            statusBanner.style.display = 'block';
        } else {
            statusBanner.style.display = 'none';
        }
    }

    // Overview
    const overviewEl = el('project-overview');
    if (overviewEl) {
        if (p.overview && p.overview.length) {
            overviewEl.innerHTML = p.overview.map(para => `<p>${para}</p>`).join('');
            if (p.challenges && p.challenges.length) {
                overviewEl.innerHTML += `<h3>Key Challenges Addressed</h3><ul>${p.challenges.map(c => `<li>${c}</li>`).join('')}</ul>`;
            }
        } else if (p.details) {
            overviewEl.innerHTML = `<p>${p.details}</p>`;
        }
    }

    // Technical implementation
    const techEl = el('project-technical');
    if (techEl) {
        if (p.architecture && p.architecture.length) {
            techEl.innerHTML = `<h3>Architecture</h3><div class="architecture-diagram">${
                p.architecture.map(a => `
                    <div class="arch-component">
                        <h4>${a.layer}</h4>
                        <p>${a.description}</p>
                        <span class="arch-tech">${a.tech}</span>
                    </div>`).join('')
            }</div>`;
            if (p.features && p.features.length) {
                techEl.innerHTML += `<h3>Key Features</h3><div class="feature-grid">${
                    p.features.map(f => `
                        <div class="feature-item">
                            <i class="${f.icon}"></i>
                            <h4>${f.title}</h4>
                            <p>${f.description}</p>
                        </div>`).join('')
                }</div>`;
            }
        } else if (p.technologies && p.technologies.length) {
            techEl.innerHTML = `<div class="tech-tags">${
                p.technologies.map(t => `<span class="tech-tag large">${t}</span>`).join('')
            }</div>`;
        }
    }

    // Tech stack
    const stackEl = el('project-tech-stack');
    if (stackEl) {
        if (p.techStack && p.techStack.length) {
            stackEl.innerHTML = p.techStack.map(cat => `
                <div class="tech-category">
                    <h3>${cat.category}</h3>
                    <div class="tech-tags">${cat.items.map(i => `<span class="tech-tag large">${i}</span>`).join('')}</div>
                </div>`).join('');
        } else if (p.technologies && p.technologies.length) {
            stackEl.innerHTML = `<div class="tech-tags">${
                p.technologies.map(t => `<span class="tech-tag large">${t}</span>`).join('')
            }</div>`;
        }
    }

    // Metrics
    const metricsEl = el('project-metrics');
    if (metricsEl) {
        if (p.metrics && p.metrics.length) {
            metricsEl.innerHTML = `<div class="results-grid">${
                p.metrics.map(m => `
                    <div class="result-item">
                        <div class="result-number">${m.value}</div>
                        <div class="result-label">${m.label}</div>
                    </div>`).join('')
            }</div>`;
            metricsEl.closest('section').style.display = '';
        } else {
            const sec = metricsEl.closest('section');
            if (sec) sec.style.display = 'none';
        }
    }

    // Photo gallery — only for project id 6 (NaturalMed Clinic Manager)
    if (p.id == 6) {
        injectGallery(lang);
    }

    // Related projects sidebar
    const relatedEl = el('related-projects-list');
    if (relatedEl) {
        relatedEl.innerHTML = '';
        // Esconder o aside inteiro até o fetch terminar
        const aside = relatedEl.closest('aside');
        if (aside) aside.style.visibility = 'hidden';
        const detailsPage = lang === 'pt' ? 'projecto-detalhes.html' : 'project-details.html';
        fetch(`../data/projects_${lang}.json`)
            .then(r => r.json())
            .then(data => {
                const related = data.projects
                    .filter(r => r.id != p.id && r.status !== 'coming-soon' && r.status !== 'in-development' && r.title && r.description)
                    .slice(0, 2);
                if (related.length > 0) {
                    relatedEl.innerHTML = related.map(r => `
                        <a href="${detailsPage}?project=${r.id}" class="related-project">
                            <h4>${r.title}</h4>
                            <p>${r.description ? r.description.substring(0, 80) + '…' : ''}</p>
                        </a>`).join('');
                }
                if (aside) aside.style.visibility = 'visible';
            })
            .catch(() => { if (aside) aside.style.visibility = 'visible'; });
    }
}

// ─── GALLERY ────────────────────────────────────────────────────────────────

const GALLERY_IMAGES = [
    { file: 'clinic-01-dashboard.png',    captionEN: 'Dashboard — daily activity, financial overview and upcoming appointments', captionPT: 'Dashboard — actividade diária, resumo financeiro e próximas consultas' },
    { file: 'clinic-02-calendar.png',     captionEN: 'Appointment Calendar — week view with status colour coding (FullCalendar)', captionPT: 'Calendário de Consultas — vista semanal com código de cores por estado' },
    { file: 'clinic-03-patient.png',      captionEN: 'Patient Record — contact details, clinical profile and Ganzhi pillars', captionPT: 'Ficha de Paciente — dados de contacto, perfil clínico e pilares Ganzhi' },
    { file: 'clinic-04-treatment.png',    captionEN: 'Treatment Notes — SOAP note with TCM diagnosis fields', captionPT: 'Notas de Tratamento — nota SOAP com campos de diagnóstico TCM' },
    { file: 'clinic-05-prescription.png', captionEN: 'Herbal Prescription — formula with individual herbs, quantities and preparation', captionPT: 'Prescrição de Ervas — fórmula com ervas individuais, quantidades e preparação' },
    { file: 'clinic-06-invoice.png',      captionEN: 'Invoice — billing with VAT, discount and Quick Select line items', captionPT: 'Factura — facturação com IVA, desconto e linhas de Quick Select' },
    { file: 'clinic-07-financial.png',    captionEN: 'Financial Summary — 6-month revenue vs expenses trend', captionPT: 'Resumo Financeiro — tendência semestral de receitas vs despesas' },
    { file: 'clinic-08-ganzhi.png',       captionEN: 'Stems & Branches (Ganzhi 干支) — TCM astrological pillars calculated from date of birth', captionPT: 'Troncos e Ramos (Ganzhi 干支) — pilares astrológicos TCM calculados a partir da data de nascimento' },
];

function injectGallery(lang) {
    // Find the "Technologies Used" section to insert the gallery before it
    const sections = document.querySelectorAll('.project-section');
    let insertBefore = null;
    sections.forEach(s => {
        const h2 = s.querySelector('h2');
        if (h2 && h2.textContent.includes('Technologies')) insertBefore = s;
    });

    const gallerySection = document.createElement('section');
    gallerySection.className = 'project-section project-gallery-section';
    gallerySection.innerHTML = `
        <h2><i class="fas fa-images"></i> ${lang === 'pt' ? 'Galeria de Screenshots' : 'Screenshot Gallery'}</h2>
        <p class="gallery-intro">${lang === 'pt'
            ? 'Interface do sistema em detalhe — clique em qualquer imagem para ampliar.'
            : 'System interface in detail — click any image to enlarge.'}</p>
        <div class="gallery-grid" id="clinic-gallery">
            ${GALLERY_IMAGES.map((img, i) => `
                <figure class="gallery-item" data-index="${i}">
                    <img
                        src="../assets/projects/clinic/${img.file}"
                        alt="${lang === 'pt' ? img.captionPT : img.captionEN}"
                        loading="lazy"
                    />
                    <figcaption>${lang === 'pt' ? img.captionPT : img.captionEN}</figcaption>
                </figure>
            `).join('')}
        </div>
    `;

    if (insertBefore) {
        insertBefore.parentNode.insertBefore(gallerySection, insertBefore);
    } else {
        // Fallback: append to project-main
        const main = document.querySelector('.project-main');
        if (main) main.appendChild(gallerySection);
    }

    // Inject lightbox markup
    const lightbox = document.createElement('div');
    lightbox.id = 'gallery-lightbox';
    lightbox.className = 'gallery-lightbox';
    lightbox.innerHTML = `
        <button class="lightbox-close" aria-label="Close">&times;</button>
        <button class="lightbox-prev" aria-label="Previous">&#8249;</button>
        <button class="lightbox-next" aria-label="Next">&#8250;</button>
        <div class="lightbox-inner">
            <img id="lightbox-img" src="" alt="" />
            <p id="lightbox-caption" class="lightbox-caption"></p>
        </div>
    `;
    document.body.appendChild(lightbox);

    // Inject gallery + lightbox CSS
    injectGalleryStyles();

    // Wire up events
    initGalleryEvents(lang);
}

function initGalleryEvents(lang) {
    let current = 0;

    const lightbox    = document.getElementById('gallery-lightbox');
    const lbImg       = document.getElementById('lightbox-img');
    const lbCaption   = document.getElementById('lightbox-caption');
    const btnClose    = lightbox.querySelector('.lightbox-close');
    const btnPrev     = lightbox.querySelector('.lightbox-prev');
    const btnNext     = lightbox.querySelector('.lightbox-next');

    function openAt(index) {
        current = (index + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
        const img = GALLERY_IMAGES[current];
        lbImg.src = `../assets/projects/clinic/${img.file}`;
        lbImg.alt = lang === 'pt' ? img.captionPT : img.captionEN;
        lbCaption.textContent = lang === 'pt' ? img.captionPT : img.captionEN;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function close() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Thumbnail clicks
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => openAt(parseInt(item.dataset.index)));
    });

    btnClose.addEventListener('click', close);
    btnPrev.addEventListener('click',  () => openAt(current - 1));
    btnNext.addEventListener('click',  () => openAt(current + 1));

    // Click outside image closes
    lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });

    // Keyboard navigation
    document.addEventListener('keydown', e => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape')     close();
        if (e.key === 'ArrowLeft')  openAt(current - 1);
        if (e.key === 'ArrowRight') openAt(current + 1);
    });
}

function injectGalleryStyles() {
    if (document.getElementById('gallery-styles')) return;
    const style = document.createElement('style');
    style.id = 'gallery-styles';
    style.textContent = `
        /* ── Gallery grid ── */
        .gallery-intro {
            color: var(--text-secondary, #6b7280);
            margin-bottom: 1.5rem;
            font-size: 0.95rem;
        }
        .gallery-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 1rem;
            margin-bottom: 1rem;
        }
        .gallery-item {
            margin: 0;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid var(--border-color, #e5e7eb);
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            background: var(--surface, #f9fafb);
        }
        .gallery-item:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }
        .gallery-item img {
            width: 100%;
            height: 200px;
            object-fit: cover;
            object-position: top;
            display: block;
        }
        .gallery-item figcaption {
            padding: 0.6rem 0.8rem;
            font-size: 0.8rem;
            color: var(--text-secondary, #6b7280);
            line-height: 1.4;
        }

        /* ── Lightbox ── */
        .gallery-lightbox {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.92);
            z-index: 9999;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        }
        .gallery-lightbox.active {
            display: flex;
        }
        .lightbox-inner {
            max-width: 90vw;
            max-height: 90vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
        }
        .lightbox-inner img {
            max-width: 100%;
            max-height: 80vh;
            border-radius: 6px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
            object-fit: contain;
        }
        .lightbox-caption {
            color: #d1d5db;
            font-size: 0.9rem;
            text-align: center;
            max-width: 700px;
            margin: 0;
        }
        .lightbox-close,
        .lightbox-prev,
        .lightbox-next {
            position: fixed;
            background: rgba(255,255,255,0.1);
            border: none;
            color: #fff;
            cursor: pointer;
            border-radius: 50%;
            width: 44px;
            height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            transition: background 0.2s;
            z-index: 10000;
        }
        .lightbox-close:hover,
        .lightbox-prev:hover,
        .lightbox-next:hover {
            background: rgba(255,255,255,0.25);
        }
        .lightbox-close { top: 1.5rem; right: 1.5rem; font-size: 1.8rem; }
        .lightbox-prev  { left: 1rem;  top: 50%; transform: translateY(-50%); font-size: 2rem; }
        .lightbox-next  { right: 1rem; top: 50%; transform: translateY(-50%); font-size: 2rem; }

        @media (max-width: 600px) {
            .gallery-grid { grid-template-columns: 1fr 1fr; }
            .lightbox-prev { left: 0.3rem; }
            .lightbox-next { right: 0.3rem; }
        }
    `;
    document.head.appendChild(style);
}

// ─── NAVIGATION ─────────────────────────────────────────────────────────────

function initializeProjectNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu    = document.querySelector('.nav-menu');
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', navMenu.classList.contains('active').toString());
        });
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
}

// ─── COVER IMAGE ─────────────────────────────────────────────────────────────

function injectCoverImage(p) {
    if (!p.image) return;

    // Only show for projects that have a dedicated cover image
    // (naturalmed-website.png, naturalmed-clinic.png, etc.)
    // Path is relative from /en/ or /pt/ up to assets/
    const imagePath = `../${p.image}`;

    // Find the project header to insert before it
    const header = document.querySelector('.project-header-detail');
    if (!header) return;

    // Don't inject twice
    if (document.getElementById('project-cover-image')) return;

    const coverEl = document.createElement('div');
    coverEl.id = 'project-cover-image';
    coverEl.className = 'project-cover-image';
    coverEl.innerHTML = `<img src="${imagePath}" alt="${p.title}" />`;

    header.parentNode.insertBefore(coverEl, header);

    // Inject cover image styles
    if (document.getElementById('cover-image-styles')) return;
    const style = document.createElement('style');
    style.id = 'cover-image-styles';
    style.textContent = `
        .project-cover-image {
            width: 100%;
            border-radius: 12px;
            overflow: hidden;
            margin-bottom: 2rem;
            border: 1px solid var(--border-color, #e5e7eb);
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        .project-cover-image img {
            width: 100%;
            max-height: 480px;
            object-fit: cover;
            object-position: top;
            display: block;
        }
        @media (max-width: 768px) {
            .project-cover-image img {
                max-height: 240px;
            }
        }
    `;
    document.head.appendChild(style);
}
