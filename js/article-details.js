/**
 * Article Details Page — dynamic rendering from articles_en.json / articles_pt.json
 */

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('article') || '1';
    const yr = document.getElementById('current-year');
    if (yr) yr.textContent = new Date().getFullYear();
    loadArticleDetails(articleId);
    initializeNavigation();
});

async function loadArticleDetails(articleId) {
    const lang = (document.documentElement.lang || 'en') === 'pt' ? 'pt' : 'en';
    const jsonPath = `../data/articles_${lang}.json`;
    try {
        const response = await fetch(jsonPath);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        const article = data.articles.find(a => a.id == articleId);
        if (!article) throw new Error(`Article ${articleId} not found`);
        renderArticlePage(article, lang);
    } catch (error) {
        console.error('Error loading article details:', error);
        const el = id => document.getElementById(id);
        if (el('article-title'))   el('article-title').textContent = lang === 'pt' ? 'Artigo não encontrado' : 'Article not found';
        if (el('article-content')) el('article-content').innerHTML = `<p>${lang === 'pt' ? 'Não foi possível carregar o artigo.' : 'Could not load article data.'}</p>`;
    }
}

function renderArticlePage(a, lang) {
    const el = id => document.getElementById(id);

    document.title = `${a.title} — Pedro Pestana`;

    if (el('article-category')) el('article-category').textContent = a.category || '';
    if (el('article-date'))     el('article-date').textContent     = a.date     || '';
    if (el('article-readtime')) el('article-readtime').textContent = a.readtime || '';
    if (el('article-title'))    el('article-title').textContent    = a.title    || '';
    if (el('article-subtitle')) el('article-subtitle').textContent = a.subtitle || '';

    // Status banner
    const banner = el('article-status-banner');
    if (banner) {
        if (a.status === 'in-preparation') {
            banner.innerHTML = `<i class="fas fa-pen"></i> ${lang === 'pt' ? 'Este artigo está em preparação.' : 'This article is currently in preparation.'}`;
            banner.style.display = 'block';
        } else {
            banner.style.display = 'none';
        }
    }

    // Main content
    const contentEl = el('article-content');
    if (contentEl) {
        let html = '';

        if (a.note) {
            html += `<div class="article-note-box"><i class="fas fa-info-circle"></i> ${a.note}</div>`;
        }

        if (a.content && a.content.length) {
            html += a.content.map(block => renderBlock(block)).join('');
        } else if (a.excerpt) {
            html += `<p>${a.excerpt}</p>`;
            if (a.github) {
                html += `<p><a href="${a.github}" target="_blank" class="btn btn-outline" style="margin-top:1rem;">
                    <i class="fab fa-github"></i> ${lang === 'pt' ? 'Ver código no GitHub' : 'View code on GitHub'}
                </a></p>`;
            }
        }

        contentEl.innerHTML = html;
    }

    // Tags
    const tagsEl = el('article-tags');
    if (tagsEl && a.tags && a.tags.length) {
        tagsEl.innerHTML = a.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
    }

    // Inject article styles
    injectArticleStyles();

    // Related articles
    const relatedEl = el('related-articles-list');
    if (relatedEl) {
        relatedEl.innerHTML = '';
        const detailsPage = lang === 'pt' ? 'artigo-detalhes.html' : 'article-details.html';
        fetch(`../data/articles_${lang}.json`)
            .then(r => r.json())
            .then(data => {
                const related = data.articles
                    .filter(r => r.id != a.id && r.status !== 'in-preparation')
                    .slice(0, 3);
                if (!related.length) {
                    const aside = relatedEl.closest('aside');
                    if (aside) aside.style.display = 'none';
                    return;
                }
                relatedEl.innerHTML = related.map(r => `
                    <a href="${detailsPage}?article=${r.id}" class="related-article">
                        <span class="related-article-category">${r.category || ''}</span>
                        <h4>${r.title}</h4>
                        <p>${r.excerpt ? r.excerpt.substring(0, 80) + '…' : ''}</p>
                    </a>`).join('');
            })
            .catch(() => { relatedEl.innerHTML = ''; });
    }
}

function renderBlock(block) {
    const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    switch (block.type) {
        case 'heading1':
            return `<h2 class="article-h1">${block.text}</h2>`;
        case 'heading2':
            return `<h3 class="article-h2">${block.text}</h3>`;
        case 'heading3':
            return `<h4 class="article-h3">${block.text}</h4>`;
        case 'paragraph':
            return `<p>${block.text}</p>`;
        case 'authors':
            return `<p class="article-authors"><em>${block.text}</em></p>`;
        case 'keywords':
            return `<p class="article-keywords"><em>${block.text}</em></p>`;
        case 'formula':
            return `<div class="article-formula"><code>${block.text}</code></div>`;
        case 'code':
            return `<pre class="article-code"><code>${esc(block.text)}</code></pre>`;
        case 'caption':
            return `<p class="article-caption">${block.text}</p>`;
        case 'list':
            return `<ul class="article-list">${(block.items || []).map(i => `<li>${i}</li>`).join('')}</ul>`;
        case 'table':
            const headers = (block.headers || []).map(h => `<th>${h}</th>`).join('');
            const rows = (block.rows || []).map(row =>
                `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`
            ).join('');
            return `<div class="article-table-wrap"><table class="article-table"><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table></div>`;
        case 'references':
            return `<ol class="article-references">${(block.items || []).map(i => `<li>${i}</li>`).join('')}</ol>`;
        default:
            return '';
    }
}

function injectArticleStyles() {
    if (document.getElementById('article-content-styles')) return;
    const style = document.createElement('style');
    style.id = 'article-content-styles';
    style.textContent = `
        .article-note-box {
            background: var(--surface, #f0f9ff);
            border-left: 4px solid var(--primary, #3b82f6);
            padding: 0.75rem 1rem;
            border-radius: 4px;
            margin-bottom: 1.5rem;
            font-size: 0.9rem;
            color: var(--text-secondary, #6b7280);
        }
        .article-authors {
            color: var(--text-secondary, #6b7280);
            font-size: 0.95rem;
            margin-bottom: 1.5rem;
        }
        .article-keywords {
            color: var(--text-secondary, #6b7280);
            font-size: 0.9rem;
            margin-bottom: 2rem;
            padding-bottom: 1.5rem;
            border-bottom: 1px solid var(--border-color, #e5e7eb);
        }
        .article-h1 {
            font-size: 1.35rem;
            font-weight: 700;
            margin: 2.5rem 0 1rem;
            padding-top: 1rem;
            border-top: 2px solid var(--border-color, #e5e7eb);
            color: var(--text-primary, #111827);
        }
        .article-h2 {
            font-size: 1.1rem;
            font-weight: 600;
            margin: 2rem 0 0.75rem;
            color: var(--text-primary, #111827);
        }
        .article-h3 {
            font-size: 1rem;
            font-weight: 600;
            margin: 1.5rem 0 0.5rem;
            color: var(--text-primary, #111827);
            font-style: italic;
        }
        .article-formula {
            background: var(--surface, #f8fafc);
            border: 1px solid var(--border-color, #e5e7eb);
            border-radius: 6px;
            padding: 0.75rem 1.25rem;
            margin: 1rem 0;
            font-family: 'Source Code Pro', 'Courier New', monospace;
            font-size: 0.95rem;
            overflow-x: auto;
        }
        .article-code {
            background: #1e293b;
            color: #e2e8f0;
            border-radius: 8px;
            padding: 1.25rem 1.5rem;
            margin: 1rem 0;
            font-size: 0.82rem;
            font-family: 'Source Code Pro', 'Courier New', monospace;
            overflow-x: auto;
            line-height: 1.6;
        }
        .article-code code {
            background: none;
            color: inherit;
            font-size: inherit;
        }
        .article-caption {
            font-size: 0.82rem;
            color: var(--text-secondary, #6b7280);
            text-align: center;
            margin-top: -0.5rem;
            margin-bottom: 1.5rem;
            font-style: italic;
        }
        .article-list {
            padding-left: 1.5rem;
            margin: 0.75rem 0 1rem;
        }
        .article-list li {
            margin-bottom: 0.4rem;
            line-height: 1.6;
        }
        .article-table-wrap {
            overflow-x: auto;
            margin: 1rem 0 1.5rem;
        }
        .article-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.88rem;
        }
        .article-table th {
            background: var(--surface, #f8fafc);
            font-weight: 600;
            text-align: left;
            padding: 0.6rem 0.75rem;
            border: 1px solid var(--border-color, #e5e7eb);
        }
        .article-table td {
            padding: 0.5rem 0.75rem;
            border: 1px solid var(--border-color, #e5e7eb);
            vertical-align: top;
        }
        .article-table tr:nth-child(even) td {
            background: var(--surface, #f8fafc);
        }
        .article-references {
            padding-left: 1.5rem;
            font-size: 0.88rem;
            line-height: 1.7;
            color: var(--text-secondary, #6b7280);
        }
        .article-references li {
            margin-bottom: 0.5rem;
        }
    `;
    document.head.appendChild(style);
}

function initializeNavigation() {
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
