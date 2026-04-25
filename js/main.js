/**
 * Main JavaScript file for Pedro Pestana's professional website
 * Bilingual Version (EN/PT) based on production code
 * This is vanilla JavaScript with no external dependencies
 */

// ══════════════════════════════════════════════════════════════
// LANGUAGE DETECTION & i18n
// ══════════════════════════════════════════════════════════════

function getPageLanguage() {
    const htmlLang = document.documentElement.lang || 'en';
    return htmlLang === 'pt' ? 'pt' : 'en';
}

const LANG = getPageLanguage();

// i18n strings
const i18n = {
    en: {
        viewDetails: 'View Details',
        buyOnGumroad: 'Buy on Gumroad',
        viewDemo: 'View Demo',
        code: 'Code',
        comingSoon: 'Coming Soon',
        inDevelopment: 'In Development',
        detailsComingSoon: 'Details coming soon',
        readArticle: 'Read Article',
        inPreparation: 'In preparation',
        featured: 'Featured',
        noProjects: 'No projects available.',
        noSkills: 'No skills data available.',
        noArticles: 'No articles available.',
        fillAllFields: 'Please fill in all required fields.',
        thankYou: 'Thank you for your message! In a production environment, this would be sent to a backend API. For now, you can send it directly via email.'
    },
    pt: {
        viewDetails: 'Ver Detalhes',
        buyOnGumroad: 'Comprar no Gumroad',
        viewDemo: 'Ver Demo',
        code: 'Código',
        comingSoon: 'Em Breve',
        inDevelopment: 'Em Desenvolvimento',
        detailsComingSoon: 'Detalhes em breve',
        readArticle: 'Ler Artigo',
        inPreparation: 'Em preparação',
        featured: 'Destaque',
        noProjects: 'Nenhum projecto disponível.',
        noSkills: 'Dados de competências não disponíveis.',
        noArticles: 'Nenhum artigo disponível.',
        fillAllFields: 'Por favor preencha todos os campos obrigatórios.',
        thankYou: 'Obrigado pela sua mensagem! Num ambiente de produção, seria enviada para um servidor. Por agora, pode enviá-la directamente por email.'
    }
};

function t(key) {
    return (i18n[LANG] && i18n[LANG][key]) || i18n.en[key] || key;
}

// Global state and configuration
// Resolve the path to /data/ relative to the current page location,
// so the site works both at the root and inside a subfolder (e.g. /github.io-main/).
const DATA_BASE = (() => {
    const depth = window.location.pathname.split('/').filter(Boolean).length;
    // Pages are always inside /en/ or /pt/ (depth >= 2), so go up one level to reach /data/
    return '../data/';
})();

const CONFIG = {
    dataPaths: {
        projects: `${DATA_BASE}projects_${LANG}.json`,
        skills: `${DATA_BASE}skills_${LANG}.json`,
        articles: `${DATA_BASE}articles_${LANG}.json`
    },
    featuredProjectCount: 3,
    featuredArticleCount: 1
};

// Fallback data in case JSON files fail to load
const FALLBACK_DATA = {
    projects: [
        {
            "id": 1,
            "title": "Urban Growth Analysis Platform",
            "description": "A cloud-based platform for analyzing urban expansion patterns using satellite imagery and machine learning.",
            "details": "Built with Google Earth Engine for processing, PostgreSQL/PostGIS for spatial data storage, and a React frontend for visualization.",
            "category": "spatial-analysis",
            "technologies": ["Python", "Google Earth Engine", "PostGIS", "React", "FastAPI"],
            "year": "2023",
            "featured": true,
            "link": "#",
            "github": "#"
        },
        {
            "id": 2,
            "title": "Geospatial ETL Pipeline Framework",
            "description": "A modular framework for building scalable spatial data pipelines with automatic quality assurance.",
            "details": "Designed to handle diverse geospatial data formats with automated schema detection, transformation, and validation.",
            "category": "data-pipeline",
            "technologies": ["Python", "Apache Airflow", "PostGIS", "Docker", "AWS S3"],
            "year": "2023",
            "featured": true,
            "link": "#",
            "github": "#"
        },
        {
            "id": 3,
            "title": "Agricultural Monitoring System",
            "description": "Real-time crop health monitoring using satellite data and custom vegetation indices.",
            "details": "Integrates Sentinel-2 imagery with ground sensor data to provide farmers with actionable insights.",
            "category": "web-mapping",
            "technologies": ["JavaScript", "Leaflet", "Python", "PostGIS", "STAC API"],
            "year": "2022",
            "featured": true,
            "link": "#",
            "github": "#"
        },
        {
            "id": 4,
            "title": "QGIS Automation Toolkit",
            "description": "A collection of Python scripts and plugins for automating repetitive QGIS workflows.",
            "category": "automation",
            "technologies": ["Python", "PyQGIS", "QGIS", "PostgreSQL"],
            "year": "2022",
            "featured": false,
            "link": "#",
            "github": "#"
        }
    ],
    skills: [
        {
            "id": "gis",
            "name": "GIS & Geospatial",
            "skills": [
                {
                    "name": "QGIS",
                    "proficiency": "expert",
                    "experience": "8+ years"
                },
                {
                    "name": "Google Earth Engine",
                    "proficiency": "expert",
                    "experience": "5+ years"
                },
                {
                    "name": "Remote Sensing",
                    "proficiency": "advanced",
                    "experience": "7+ years"
                },
                {
                    "name": "Spatial Analysis",
                    "proficiency": "expert",
                    "experience": "8+ years"
                },
                {
                    "name": "Cartography",
                    "proficiency": "advanced",
                    "experience": "6+ years"
                }
            ]
        },
        {
            "id": "programming",
            "name": "Programming Languages",
            "skills": [
                {
                    "name": "Python",
                    "proficiency": "expert",
                    "experience": "8+ years"
                },
                {
                    "name": "R",
                    "proficiency": "advanced",
                    "experience": "5+ years"
                },
                {
                    "name": "JavaScript/TypeScript",
                    "proficiency": "advanced",
                    "experience": "6+ years"
                },
                {
                    "name": "SQL",
                    "proficiency": "expert",
                    "experience": "8+ years"
                },
                {
                    "name": "Bash/Shell",
                    "proficiency": "intermediate",
                    "experience": "4+ years"
                }
            ]
        },
        {
            "id": "data",
            "name": "Data & Databases",
            "skills": [
                {
                    "name": "PostGIS",
                    "proficiency": "expert",
                    "experience": "7+ years"
                },
                {
                    "name": "PostgreSQL",
                    "proficiency": "expert",
                    "experience": "8+ years"
                },
                {
                    "name": "Spatial Databases",
                    "proficiency": "expert",
                    "experience": "7+ years"
                },
                {
                    "name": "Data Modeling",
                    "proficiency": "advanced",
                    "experience": "6+ years"
                },
                {
                    "name": "ETL/Data Pipelines",
                    "proficiency": "advanced",
                    "experience": "5+ years"
                }
            ]
        },
        {
            "id": "systems",
            "name": "Systems & Architecture",
            "skills": [
                {
                    "name": "Cloud Architecture",
                    "proficiency": "advanced",
                    "experience": "5+ years"
                },
                {
                    "name": "SaaS Design",
                    "proficiency": "advanced",
                    "experience": "4+ years"
                },
                {
                    "name": "API Design",
                    "proficiency": "advanced",
                    "experience": "5+ years"
                },
                {
                    "name": "Microservices",
                    "proficiency": "intermediate",
                    "experience": "3+ years"
                },
                {
                    "name": "System Integration",
                    "proficiency": "advanced",
                    "experience": "5+ years"
                }
            ]
        },
        {
            "id": "tools",
            "name": "Tools & Platforms",
            "skills": [
                {
                    "name": "Docker",
                    "proficiency": "advanced",
                    "experience": "4+ years"
                },
                {
                    "name": "Git",
                    "proficiency": "expert",
                    "experience": "8+ years"
                },
                {
                    "name": "AWS",
                    "proficiency": "intermediate",
                    "experience": "3+ years"
                },
                {
                    "name": "Linux/Unix",
                    "proficiency": "advanced",
                    "experience": "6+ years"
                },
                {
                    "name": "CI/CD",
                    "proficiency": "intermediate",
                    "experience": "3+ years"
                }
            ]
        }
    ],
    articles: [
        {
            "id": 1,
            "title": "Designing Scalable Geospatial Data Pipelines",
            "subtitle": "An architectural overview of building robust ETL pipelines for spatial data",
            "excerpt": "An architectural overview of building robust ETL pipelines for spatial data, covering data ingestion, transformation, quality assurance, and deployment strategies for handling terabyte-scale geospatial datasets.",
            "category": "spatial-data-engineering",
            "date": "March 2024",
            "readtime": "12 min read",
            "tags": ["PostGIS", "Python", "Data Pipelines", "Cloud Architecture", "Spatial Analysis", "ETL"],
            "featured": true
        },
        {
            "id": 2,
            "title": "Automating QGIS Workflows with Python",
            "subtitle": "A practical guide to scripting repetitive GIS tasks in QGIS using PyQGIS",
            "excerpt": "A practical guide to scripting repetitive GIS tasks in QGIS using PyQGIS, with examples of batch processing, custom plugin development, and integration with external data sources.",
            "category": "gis-automation",
            "date": "January 2024",
            "readtime": "8 min read",
            "tags": ["QGIS", "Python", "Automation", "PyQGIS"],
            "featured": false
        },
        {
            "id": 3,
            "title": "Urban Growth Analysis with Google Earth Engine",
            "subtitle": "Leveraging Landsat and Sentinel imagery to analyze urban expansion patterns over time",
            "excerpt": "Leveraging Landsat and Sentinel imagery to analyze urban expansion patterns over time, with code examples for NDVI calculation, change detection, and visualization of results.",
            "category": "remote-sensing",
            "date": "November 2023",
            "readtime": "10 min read",
            "tags": ["Google Earth Engine", "JavaScript", "Remote Sensing", "Urban Analysis"],
            "featured": false
        },
        {
            "id": 4,
            "title": "Advanced Spatial Queries in PostGIS",
            "subtitle": "Exploring advanced PostGIS functionality for complex spatial analysis",
            "excerpt": "Exploring advanced PostGIS functionality for complex spatial analysis, including nearest neighbor searches, network routing, spatial joins at scale, and performance optimization techniques.",
            "category": "spatial-databases",
            "date": "September 2023",
            "readtime": "15 min read",
            "tags": ["PostGIS", "PostgreSQL", "Spatial SQL", "Performance"],
            "featured": false
        },
        {
            "id": 5,
            "title": "Building Interactive Geospatial Dashboards",
            "subtitle": "Architectural patterns for creating performant web mapping applications with real-time data visualization",
            "excerpt": "Architectural patterns for creating performant web mapping applications with real-time data visualization, focusing on Leaflet/Mapbox integration, data streaming, and responsive design.",
            "category": "web-mapping",
            "date": "July 2023",
            "readtime": "9 min read",
            "tags": ["JavaScript", "Leaflet", "Web GIS", "Data Visualization"],
            "featured": false
        },
        {
            "id": 6,
            "title": "Real-time Spatial Data Streaming Architecture",
            "subtitle": "Designing systems for processing and visualizing live geospatial data streams",
            "excerpt": "Designing systems for processing and visualizing live geospatial data streams from IoT sensors, mobile devices, and satellite feeds with low latency requirements.",
            "category": "spatial-data-engineering",
            "date": "May 2023",
            "readtime": "11 min read",
            "tags": ["Kafka", "WebSockets", "Real-time", "IoT", "Stream Processing"],
            "featured": false
        }
    ]
};

// DOM Ready function
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, current page:', getCurrentPage());
    
    // Initialize common functionality
    initializeNavigation();
    initializeCurrentYear();
    initializeCodeSnippets();
    
    // Load data based on current page
    const currentPage = getCurrentPage();
    
    if (currentPage === 'index') {
        console.log('Loading featured projects...');
        loadFeaturedProjects();
    } else if (currentPage === 'skills') {
        console.log('Loading skills...');
        loadSkills();
        // Setup skill filters AFTER skills are loaded
        setTimeout(() => setupSkillFilters(), 100);
    } else if (currentPage === 'projects') {
        console.log('Loading projects...');
        loadProjects();
        setupProjectFilters();
    } else if (currentPage === 'articles') {
        console.log('Loading articles...');
        loadArticles();
        setupArticleFilters();
    } else if (currentPage === 'contact') {
        console.log('Setting up contact form...');
        setupContactForm();
    }
});

/**
 * Get the current page name from the URL
 */
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';
    
    if (page === 'index.html' || page === '' || page === '/') {
        return 'index';
    } else if (page === 'about.html' || page === 'sobre.html') {
        return 'about';
    } else if (page === 'skills.html' || page === 'competencias.html') {
        return 'skills';
    } else if (page === 'projects.html' || page === 'projectos.html') {
        return 'projects';
    } else if (page === 'articles.html' || page === 'artigos.html') {
        return 'articles';
    } else if (page === 'contact.html' || page === 'contacto.html') {
        return 'contact';
    } else if (page === 'project-details.html' || page === 'projecto-detalhes.html') {
        return 'project-details';
    } else if (page === 'article-details.html' || page === 'artigo-detalhes.html') {
        return 'article-details';
    }
    return 'index';
}

/**
 * Initialize mobile navigation menu
 */
function initializeNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', 
                navMenu.classList.contains('active').toString());
        });
        
        // Close menu when clicking a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
                navMenu.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

/**
 * Update current year in footer
 */
function initializeCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

/**
 * Initialize syntax highlighting for code snippets
 * (Basic implementation - in a real site, use a library like Prism.js)
 */
function initializeCodeSnippets() {
    // Add basic styling to code blocks
    document.querySelectorAll('pre code').forEach(block => {
        // Simple keyword highlighting for demo purposes
        const code = block.textContent;
        const highlighted = code
            .replace(/\b(def|import|from|return|class|function|if|else|for|while|try|except)\b/g, 
                '<span class="keyword">$1</span>')
            .replace(/\b(\d+)\b/g, '<span class="number">$1</span>')
            .replace(/(["'].*?["'])/g, '<span class="string">$1</span>')
            .replace(/\/\/.*$/gm, '<span class="comment">$&</span>');
        
        block.innerHTML = highlighted;
    });
}

/**
 * Load and display featured projects on the homepage
 */
async function loadFeaturedProjects() {
    const container = document.getElementById('featured-projects-container');
    if (!container) {
        console.log('Featured projects container not found');
        return;
    }
    
    try {
        // Check if we're running on file:// protocol
        if (window.location.protocol === 'file:') {
            console.log('Running on file:// protocol, using inline fallback data');
            // Use fallback data
            const featuredProjects = FALLBACK_DATA.projects
                .filter(p => p.featured)
                .slice(0, CONFIG.featuredProjectCount);
            displayProjects(featuredProjects, container, false);
            return;
        }
        
        console.log('Fetching projects from:', CONFIG.dataPaths.projects);
        const response = await fetch(CONFIG.dataPaths.projects);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const projects = data.projects || [];
        
        console.log('Loaded projects:', projects.length);
        
        // Get featured projects (first N projects marked as featured)
        const featuredProjects = projects
            .filter(p => p.featured)
            .slice(0, CONFIG.featuredProjectCount);
        
        console.log('Featured projects:', featuredProjects.length);
        
        if (featuredProjects.length === 0) {
            container.innerHTML = '<p class="no-data">No featured projects available.</p>';
            return;
        }
        
        displayProjects(featuredProjects, container, false);
    } catch (error) {
        console.error('Error loading featured projects:', error);
        // Use fallback data
        const featuredProjects = FALLBACK_DATA.projects
            .filter(p => p.featured)
            .slice(0, CONFIG.featuredProjectCount);
        displayProjects(featuredProjects, container, false);
    }
}

/**
 * Load and display all projects on the projects page
 */
async function loadProjects() {
    const container = document.getElementById('projects-container');
    if (!container) {
        console.log('Projects container not found');
        return;
    }
    
    try {
        // Check if we're running on file:// protocol
        if (window.location.protocol === 'file:') {
            console.log('Running on file:// protocol, using inline fallback data');
            // Use fallback data
            displayProjects(FALLBACK_DATA.projects, container, true);
            return;
        }
        
        console.log('Fetching projects from:', CONFIG.dataPaths.projects);
        const response = await fetch(CONFIG.dataPaths.projects);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const projects = data.projects || [];
        
        console.log('Loaded projects:', projects.length);
        
        if (projects.length === 0) {
            container.innerHTML = '<p class="no-data">No projects available.</p>';
            return;
        }
        
        displayProjects(projects, container, true);
    } catch (error) {
        console.error('Error loading projects:', error);
        // Use fallback data
        displayProjects(FALLBACK_DATA.projects, container, true);
    }
}

/**
 * Display projects in a container
 */
function displayProjects(projects, container, detailed) {
    container.innerHTML = '';
    projects.forEach(project => {
        container.appendChild(createProjectCard(project, detailed));
    });
}

/**
 * Create a project card element
 */
function createProjectCard(project, detailed = false) {
    const card = document.createElement('article');
    const isComingSoon = project.status === 'coming-soon';
    const isInDev = project.status === 'in-development';
    card.className = 'project-card' + (isComingSoon ? ' project-coming-soon' : '');
    card.dataset.technology = project.technologies ? project.technologies.join(' ') : '';
    card.dataset.category = project.category || '';

    // Status badge
    const statusBadge = isComingSoon
        ? `<span class="project-status status-coming-soon"><i class="fas fa-clock"></i> ${t('comingSoon')}</span>`
        : isInDev
        ? `<span class="project-status status-in-development"><i class="fas fa-code-branch"></i> ${t('inDevelopment')}</span>`
        : '';

    // Format technologies as tags
    const techTags = project.technologies ? project.technologies.map(tech =>
        `<span class="tech-tag">${tech}</span>`
    ).join('') : '';

    // Create project details page URL
    const detailsPage = LANG === 'pt' ? 'projecto-detalhes.html' : 'project-details.html';
    const detailsUrl = `${detailsPage}?project=${project.id}`;

    // Footer links
    const detailsLink = isComingSoon
        ? `<span class="btn-text btn-disabled"><i class="fas fa-clock"></i> ${t('detailsComingSoon')}</span>`
        : `<a href="${detailsUrl}" class="btn-text">${t('viewDetails')} <i class="fas fa-arrow-right"></i></a>`;
    const githubLink = project.github && project.github !== '#'
        ? `<a href="${project.github}" class="btn-text" target="_blank"><i class="fab fa-github"></i> ${t('code')}</a>`
        : '';
    const isGumroad = project.link && project.link.includes('gumroad.com');
    const buyLink = isGumroad
        ? `<a href="${project.link}" class="btn-text btn-buy" target="_blank"><i class="fas fa-shopping-cart"></i> ${t('buyOnGumroad')}</a>`
        : '';

    // Create card content
    card.innerHTML = `
        <div class="project-header">
            <div class="project-title-row">
                <h3 class="project-title">${project.title || 'Untitled Project'}</h3>
                ${statusBadge}
            </div>
            <div class="project-meta">
                ${project.category ? `<span class="project-category">${project.category}</span>` : ''}
                ${project.year ? `<span class="project-year">${project.year}</span>` : ''}
            </div>
        </div>
        <div class="project-body">
            <p class="project-description">${project.description || 'No description available.'}</p>
            ${detailed && project.details ? `<p class="project-details">${project.details}</p>` : ''}
            ${techTags ? `<div class="project-tech">${techTags}</div>` : ''}
        </div>
        <div class="project-footer">
            ${detailsLink}
            ${buyLink}
            ${githubLink}
        </div>
    `;

    return card;
}

/**
 * Set up project filtering on the projects page
 */
function setupProjectFilters() {
    const techFilter = document.getElementById('technology-filter');
    const categoryFilter = document.getElementById('category-filter');
    const clearButton = document.getElementById('clear-filters');
    
    if (!techFilter || !categoryFilter || !clearButton) {
        console.log('Project filter elements not found');
        return;
    }
    
    // Filter function
    const filterProjects = () => {
        const techValue = techFilter.value.toLowerCase();
        const categoryValue = categoryFilter.value.toLowerCase();
        
        document.querySelectorAll('.project-card').forEach(card => {
            const cardTech = card.dataset.technology.toLowerCase();
            const cardCategory = card.dataset.category.toLowerCase();
            
            const techMatch = techValue === 'all' || cardTech.includes(techValue);
            const categoryMatch = categoryValue === 'all' || cardCategory.includes(categoryValue);
            
            card.style.display = (techMatch && categoryMatch) ? 'block' : 'none';
        });
    };
    
    // Event listeners
    techFilter.addEventListener('change', filterProjects);
    categoryFilter.addEventListener('change', filterProjects);
    clearButton.addEventListener('click', () => {
        techFilter.value = 'all';
        categoryFilter.value = 'all';
        filterProjects();
    });
}

/**
 * Load and display skills on the skills page
 */
async function loadSkills() {
    const container = document.getElementById('skills-container');
    if (!container) {
        console.log('Skills container not found');
        return;
    }
    
    try {
        // Check if we're running on file:// protocol
        if (window.location.protocol === 'file:') {
            console.log('Running on file:// protocol, using inline fallback data');
            // Use fallback data
            displaySkills(FALLBACK_DATA.skills, container);
            return;
        }
        
        console.log('Fetching skills from:', CONFIG.dataPaths.skills);
        const response = await fetch(CONFIG.dataPaths.skills);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const skillsData = await response.json();
        
        if (!skillsData.categories || skillsData.categories.length === 0) {
            container.innerHTML = '<p class="no-data">No skills data available.</p>';
            return;
        }
        
        console.log('Loaded skill categories:', skillsData.categories.length);
        displaySkills(skillsData.categories, container);
        
    } catch (error) {
        console.error('Error loading skills:', error);
        // Use fallback data
        displaySkills(FALLBACK_DATA.skills, container);
    }
}

/**
 * Display skills in a container
 */
function displaySkills(categories, container) {
    container.innerHTML = '';
    categories.forEach(category => {
        const categoryElement = createSkillCategory(category);
        container.appendChild(categoryElement);
    });
}

/**
 * Create a skill category element
 */
function createSkillCategory(category) {
    const section = document.createElement('section');
    section.className = 'skill-category';
    section.dataset.category = category.id || '';
    
    // Create skill items HTML
    const skillItems = (category.skills || []).map(skill => `
        <div class="skill-item" data-proficiency="${skill.proficiency || 'intermediate'}">
            <span class="proficiency-dot ${skill.proficiency || 'intermediate'}"></span>
            <span class="skill-name">${skill.name || 'Unknown Skill'}</span>
            ${skill.experience ? `<span class="skill-experience">${skill.experience}</span>` : ''}
        </div>
    `).join('');
    
    section.innerHTML = `
        <h3>${category.name || 'Unnamed Category'}</h3>
        <div class="skill-items">
            ${skillItems || '<p>No skills listed</p>'}
        </div>
    `;
    
    return section;
}

/**
 * Set up skill filtering on the skills page
 */
function setupSkillFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (filterButtons.length === 0) {
        console.log('No filter buttons found on skills page');
        return;
    }
    
    console.log('Found', filterButtons.length, 'filter buttons');
    
    // Add click event to each filter button
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Button clicked:', this.textContent);
            
            // Remove active class from all buttons
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get the filter value
            const filterValue = this.getAttribute('data-filter');
            console.log('Filter value:', filterValue);
            
            // Filter the skills
            applySkillFilter(filterValue);
        });
    });
}

/**
 * Apply skill filter
 */
function applySkillFilter(filterValue) {
    const skillCategories = document.querySelectorAll('.skill-category');
    console.log('Found', skillCategories.length, 'skill categories');
    
    if (filterValue === 'all') {
        // Show all categories
        skillCategories.forEach(category => {
            category.style.display = 'block';
            category.style.opacity = '1';
        });
    } else {
        // Filter by category
        skillCategories.forEach(category => {
            const categoryId = category.getAttribute('data-category');
            
            if (categoryId === filterValue) {
                category.style.display = 'block';
                // Add slight delay for smooth transition
                setTimeout(() => {
                    category.style.opacity = '1';
                }, 10);
            } else {
                category.style.opacity = '0';
                setTimeout(() => {
                    category.style.display = 'none';
                }, 300);
            }
        });
    }
}

/**
 * Load and display articles on the articles page
 */
async function loadArticles() {
    const container = document.getElementById('articles-container');
    if (!container) {
        console.log('Articles container not found');
        return;
    }
    
    try {
        // Check if we're running on file:// protocol
        if (window.location.protocol === 'file:') {
            console.log('Running on file:// protocol, using inline fallback data');
            // Use fallback data
            displayArticles(FALLBACK_DATA.articles, container);
            return;
        }
        
        console.log('Fetching articles from:', CONFIG.dataPaths.articles);
        const response = await fetch(CONFIG.dataPaths.articles);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const articles = data.articles || [];
        
        console.log('Loaded articles:', articles.length);
        
        if (articles.length === 0) {
            container.innerHTML = '<p class="no-data">No articles available.</p>';
            return;
        }
        
        displayArticles(articles, container);
    } catch (error) {
        console.error('Error loading articles:', error);
        // Use fallback data
        displayArticles(FALLBACK_DATA.articles, container);
    }
}

/**
 * Display articles in a container
 */
function displayArticles(articles, container) {
    container.innerHTML = '';
    
    // Sort articles by date (newest first)
    articles.sort((a, b) => {
        const dateA = new Date(a.date || '1970-01-01');
        const dateB = new Date(b.date || '1970-01-01');
        return dateB - dateA;
    });
    
    articles.forEach((article, index) => {
        const isFeatured = article.featured && index === 0;
        const articleElement = createArticleCard(article, isFeatured);
        container.appendChild(articleElement);
    });
}

/**
 * Create an article card element
 */
function createArticleCard(article, isFeatured = false) {
    const card = document.createElement('article');
    const isInPrep = article.status === 'in-preparation';
    card.className = 'article-card' + (isInPrep ? ' article-in-preparation' : '');
    if (isFeatured) card.classList.add('featured');

    card.dataset.category = article.category || '';
    card.dataset.date = article.date || '';

    const detailsPage = LANG === 'pt' ? 'artigo-detalhes.html' : 'article-details.html';
    const detailsUrl = `${detailsPage}?article=${article.id}`;

    // Status badge
    const statusBadge = isInPrep
        ? `<span class="article-status status-in-preparation"><i class="fas fa-pen"></i> ${t('inPreparation')}</span>`
        : '';

    // Note (e.g. translation notice)
    const noteHtml = article.note
        ? `<p class="article-note"><i class="fas fa-info-circle"></i> ${article.note}</p>`
        : '';

    // Read link — disabled for in-preparation
    const readLink = isInPrep
        ? `<span class="btn-text btn-disabled"><i class="fas fa-clock"></i> ${t('comingSoon')}</span>`
        : `<a href="${detailsUrl}" class="btn-text">${t('readArticle')} <i class="fas fa-arrow-right"></i></a>`;

    // Format tags
    const tags = article.tags ? article.tags.map(tag =>
        `<span class="tag">${tag}</span>`
    ).join('') : '';

    if (isFeatured) {
        card.innerHTML = `
            ${article.featured ? `<div class="article-badge">${t('featured')}</div>` : ''}
            <div class="article-content">
                <div class="article-meta">
                    <span class="article-category">${article.category || 'General'}</span>
                    <span class="article-date">${article.date || 'N/A'}</span>
                    ${article.readtime ? `<span class="article-readtime">${article.readtime}</span>` : ''}
                    ${statusBadge}
                </div>
                <h2 class="article-title">${article.title || 'Untitled Article'}</h2>
                <p class="article-excerpt">${article.excerpt || 'No excerpt available.'}</p>
                ${noteHtml}
                ${tags ? `<div class="article-tags">${tags}</div>` : ''}
                ${readLink}
            </div>
            <div class="article-visual">
                <div class="placeholder-visual">
                    <i class="fas fa-chart-network"></i>
                </div>
            </div>
        `;
    } else {
        card.innerHTML = `
            <div class="article-content">
                <div class="article-meta">
                    <span class="article-category">${article.category || 'General'}</span>
                    <span class="article-date">${article.date || 'N/A'}</span>
                    ${article.readtime ? `<span class="article-readtime">${article.readtime}</span>` : ''}
                    ${statusBadge}
                </div>
                <h2 class="article-title">${article.title || 'Untitled Article'}</h2>
                <p class="article-subtitle">${article.subtitle || ''}</p>
                <p class="article-excerpt">${article.excerpt || 'No excerpt available.'}</p>
                ${noteHtml}
                ${tags ? `<div class="article-tags">${tags}</div>` : ''}
                ${readLink}
            </div>
        `;
    }

    return card;
}

/**
 * Set up article filtering on the articles page
 */
function setupArticleFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const yearFilter = document.getElementById('year-filter');
    const clearButton = document.getElementById('clear-filters');
    
    if (!categoryFilter || !yearFilter || !clearButton) {
        console.log('Article filter elements not found');
        return;
    }
    
    // Filter function
    const filterArticles = () => {
        const categoryValue = categoryFilter.value.toLowerCase();
        const yearValue = yearFilter.value.toLowerCase();
        
        document.querySelectorAll('.article-card').forEach(card => {
            const cardCategory = card.dataset.category.toLowerCase();
            const cardDate = card.dataset.date.toLowerCase();
            const cardYear = cardDate.split(' ')[0]; // Extract year from date
            
            const categoryMatch = categoryValue === 'all' || cardCategory.includes(categoryValue);
            const yearMatch = yearValue === 'all' || cardYear.includes(yearValue);
            
            card.style.display = (categoryMatch && yearMatch) ? 'flex' : 'none';
        });
    };
    
    // Event listeners
    categoryFilter.addEventListener('change', filterArticles);
    yearFilter.addEventListener('change', filterArticles);
    clearButton.addEventListener('click', () => {
        categoryFilter.value = 'all';
        yearFilter.value = 'all';
        filterArticles();
    });
}

/**
 * Handle contact form submission
 * Note: In a production environment, this would send to a backend API
 * For this static version, we use mailto as a fallback
 */
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) {
        console.log('Contact form not found');
        return;
    }
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Validate form
        if (!data.name || !data.email || !data.subject || !data.message) {
            alert(t('fillAllFields'));
            return;
        }

        // Get the full visible text of the selected option (not the value)
        const subjectSelect = contactForm.querySelector('[name="subject"]');
        const subjectText = subjectSelect ? subjectSelect.options[subjectSelect.selectedIndex].text : data.subject;
        
        const prefix = LANG === 'pt' ? 'Pedido Website' : 'Site Request';
        const labelName = LANG === 'pt' ? 'Nome Completo' : 'Full name';
        const labelEmail = 'Email';
        const labelMessage = LANG === 'pt' ? 'Mensagem' : 'Message';
        
        const subject = prefix + ': ' + subjectText;
        const body = labelName + ': ' + data.name + '\n' + labelEmail + ': ' + data.email + '\n' + labelMessage + ': ' + data.message;
        const mailtoLink = `mailto:info@pedropestana.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        window.location.href = mailtoLink;
        
        this.reset();
    });
}

// Export functions for use in script tags in HTML files
window.loadFeaturedProjects = loadFeaturedProjects;
window.loadProjects = loadProjects;
window.loadSkills = loadSkills;
window.loadArticles = loadArticles;
window.setupProjectFilters = setupProjectFilters;
window.setupSkillFilters = setupSkillFilters;
window.setupArticleFilters = setupArticleFilters;
window.setupContactForm = setupContactForm;
