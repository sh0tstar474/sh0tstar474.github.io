/* ===================================
   PROJECT DATA - Edit your projects here
   =================================== */
const projects = [
    {
        id: 1,
        title: "Kaioken Animation",
        category: "Animation • Featured",
        gifUrl: "https://imgur.com/uZVZq0R",
        description: "An animation based on the Kaioken technique from Dragon Ball Z.",
        shortDescription: "An animation based on the Kaioken technique from Dragon Ball Z.",
        features: [
            "R6 Rigging",
            "Smooth Animation",
            "Bezier Curves"
        ],
        technologies: [
            "Blender",
            "Inverse Kinematics",
            "Animation Principles",
            "Video Editing"
        ],
        liveUrl: "#",
        githubUrl: "#"
    }
];

/* ===================================
   UTILITIES & HELPERS
   =================================== */
const Utils = {
    // Sanitize user input to prevent XSS
    sanitizeHTML: (str) => {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    },

    // Debounce function for performance
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for scroll events
    throttle: (func, limit) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Convert Imgur URLs to direct media links
    getImgurDirectURL: (url) => {
        if (!url || typeof url !== 'string') return '';
        
        if (url.includes('imgur.com/') && !url.includes('i.imgur.com')) {
            const imgurId = url.split('/').pop().split('.')[0];
            return `https://i.imgur.com/${imgurId}.mp4`;
        }
        return url;
    },

    // Check if URL is a video
    isVideoURL: (url) => {
        if (!url || typeof url !== 'string') return false;
        return url.toLowerCase().endsWith('.mp4') || 
               url.toLowerCase().includes('.mp4?') ||
               url.toLowerCase().endsWith('.webm') ||
               url.toLowerCase().endsWith('.mov');
    },

    // Validate email format
    isValidEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Log errors safely
    logError: (context, error) => {
        if (console && console.error) {
            console.error(`[${context}]`, error);
        }
    }
};

/* ===================================
   DOM ELEMENTS CACHE
   =================================== */
const DOM = {
    // Header & Navigation
    header: document.querySelector('header'),
    navLinks: document.querySelectorAll('.nav-link'),
    mobileMenuBtn: document.querySelector('.mobile-menu-btn'),
    mobileNav: document.querySelector('.mobile-nav'),
    
    // Projects
    filterBtns: document.querySelectorAll('.filter-btn'),
    projectsGrid: document.querySelector('.projects-grid'),
    viewAllBtn: document.getElementById('viewAllBtn'),
    
    // Modal
    modal: document.getElementById('projectModal'),
    modalOverlay: null, // Will be set after modal content is created
    modalClose: document.getElementById('modalClose'),
    modalPrevBtn: document.getElementById('modalPrevBtn'),
    modalNextBtn: document.getElementById('modalNextBtn'),
    modalCategory: document.getElementById('modalCategory'),
    modalTitle: document.getElementById('modalTitle'),
    modalImage: document.getElementById('modalImage'),
    modalDescription: document.getElementById('modalDescription'),
    modalFeatures: document.getElementById('modalFeatures'),
    modalTech: document.getElementById('modalTech'),
    modalLiveLink: document.getElementById('modalLiveLink'),
    modalGithubLink: document.getElementById('modalGithubLink'),
    
    // Contact Form
    contactForm: document.getElementById('contactForm'),
    formInputs: {
        name: document.getElementById('name'),
        email: document.getElementById('email'),
        subject: document.getElementById('subject'),
        message: document.getElementById('message')
    },
    formStatus: null, // Will be set after checking DOM
    
    // Sections
    sections: document.querySelectorAll('section[id]')
};

/* ===================================
   STATE MANAGEMENT
   =================================== */
const State = {
    currentProjectIndex: 0,
    isModalOpen: false,
    isMobileMenuOpen: false,
    activeFilter: 'all'
};

/* ===================================
   MOBILE MENU
   =================================== */
function initMobileMenu() {
    if (!DOM.mobileMenuBtn || !DOM.mobileNav) return;

    DOM.mobileMenuBtn.addEventListener('click', () => {
        State.isMobileMenuOpen = !State.isMobileMenuOpen;
        
        DOM.mobileMenuBtn.setAttribute('aria-expanded', State.isMobileMenuOpen);
        
        if (State.isMobileMenuOpen) {
            DOM.mobileNav.removeAttribute('hidden');
            DOM.mobileNav.style.display = 'block';
            document.body.style.overflow = 'hidden';
        } else {
            DOM.mobileNav.setAttribute('hidden', '');
            DOM.mobileNav.style.display = 'none';
            document.body.style.overflow = '';
        }
    });

    // Close mobile menu when clicking nav links
    const mobileNavLinks = DOM.mobileNav.querySelectorAll('.nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            State.isMobileMenuOpen = false;
            DOM.mobileMenuBtn.setAttribute('aria-expanded', 'false');
            DOM.mobileNav.setAttribute('hidden', '');
            DOM.mobileNav.style.display = 'none';
            document.body.style.overflow = '';
        });
    });
}

/* ===================================
   HEADER SCROLL EFFECT
   =================================== */
function initHeaderScroll() {
    if (!DOM.header) return;

    const handleScroll = Utils.throttle(() => {
        if (window.scrollY > 50) {
            DOM.header.classList.add('scrolled');
        } else {
            DOM.header.classList.remove('scrolled');
        }
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });
}

/* ===================================
   RENDER PROJECTS FROM DATA
   =================================== */
function renderProjects() {
    if (!DOM.projectsGrid) {
        Utils.logError('renderProjects', 'Projects grid element not found');
        return;
    }

    try {
        DOM.projectsGrid.innerHTML = projects.map(project => {
            const mediaUrl = Utils.getImgurDirectURL(project.gifUrl);
            const isVideo = Utils.isVideoURL(mediaUrl);
            
            // Sanitize text content
            const title = Utils.sanitizeHTML(project.title);
            const category = Utils.sanitizeHTML(project.category);
            const description = Utils.sanitizeHTML(project.shortDescription);
            
            return `
                <article class="project-card scroll-reveal-scale" data-project="${project.id}" role="listitem">
                    <div class="project-img">
                        ${isVideo ? `
                            <video 
                                autoplay 
                                loop 
                                muted 
                                playsinline
                                preload="metadata"
                                aria-label="${title} preview video"
                            >
                                <source src="${mediaUrl}" type="video/mp4">
                                Your browser does not support the video tag.
                            </video>
                        ` : `
                            <img 
                                src="${mediaUrl}" 
                                alt="${title} preview"
                                loading="lazy"
                            />
                        `}
                    </div>
                    <div class="project-content">
                        <span class="project-category">${category}</span>
                        <h3>${title}</h3>
                        <p>${description}</p>
                        <button class="btn btn-outline view-project-btn" aria-label="View ${title} project details">
                            View Project
                        </button>
                    </div>
                </article>
            `;
        }).join('');

        // Cache newly created elements
        DOM.projectCards = document.querySelectorAll('.project-card');
        DOM.viewProjectBtns = document.querySelectorAll('.view-project-btn');
        
        initProjectClickHandlers();
        
        // Trigger scroll reveal for newly added projects
        setTimeout(() => {
            const revealOnScroll = new Event('scroll');
            window.dispatchEvent(revealOnScroll);
        }, 100);
    } catch (error) {
        Utils.logError('renderProjects', error);
        DOM.projectsGrid.innerHTML = '<p>Error loading projects. Please refresh the page.</p>';
    }
}

/* ===================================
   PROJECT CLICK HANDLERS
   =================================== */
function initProjectClickHandlers() {
    if (!DOM.projectCards || !DOM.viewProjectBtns) return;

    // Open modal when clicking project cards
    DOM.projectCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't open if clicking the button directly
            if (!e.target.closest('.btn')) {
                const projectId = parseInt(card.getAttribute('data-project'));
                const index = projects.findIndex(p => p.id === projectId);
                if (index !== -1) {
                    State.currentProjectIndex = index;
                    openModal(index);
                }
            }
        });
    });
    
    // Open modal from "View Project" buttons
    DOM.viewProjectBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const projectCard = btn.closest('.project-card');
            if (projectCard) {
                const projectId = parseInt(projectCard.getAttribute('data-project'));
                const index = projects.findIndex(p => p.id === projectId);
                if (index !== -1) {
                    State.currentProjectIndex = index;
                    openModal(index);
                }
            }
        });
    });
}

/* ===================================
   PROJECT FILTERS
   =================================== */
function initProjectFilters() {
    if (!DOM.filterBtns) return;

    DOM.filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            
            // Update active button and aria-pressed state
            DOM.filterBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            
            State.activeFilter = filter;
            filterProjects(filter);
        });
    });
}

function filterProjects(filter) {
    if (!DOM.projectCards) return;

    DOM.projectCards.forEach((card, index) => {
        const projectId = parseInt(card.getAttribute('data-project'));
        const project = projects.find(p => p.id === projectId);
        
        if (!project) {
            card.style.display = 'none';
            return;
        }
        
        let shouldShow = false;
        
        if (filter === 'all') {
            shouldShow = true;
        } else if (filter === 'featured') {
            shouldShow = index < 3;
        } else {
            const category = project.category.toLowerCase();
            shouldShow = category.includes(filter.toLowerCase());
        }
        
        // Smooth fade effect
        if (shouldShow) {
            card.style.display = 'block';
            // Force reflow
            void card.offsetWidth;
            setTimeout(() => {
                card.style.opacity = '1';
                card.classList.add('revealed');
            }, 10);
        } else {
            card.style.opacity = '0';
            card.classList.remove('revealed');
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

/* ===================================
   VIEW ALL PROJECTS BUTTON
   =================================== */
function initViewAllButton() {
    if (!DOM.viewAllBtn) return;

    DOM.viewAllBtn.addEventListener('click', () => {
        // Reset to "All Work" filter
        DOM.filterBtns.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
            if (btn.getAttribute('data-filter') === 'all') {
                btn.classList.add('active');
                btn.setAttribute('aria-pressed', 'true');
            }
        });
        
        State.activeFilter = 'all';
        filterProjects('all');
        
        // Scroll to projects section
        const projectsSection = document.getElementById('projects');
        if (projectsSection) {
            projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}

/* ===================================
   PROJECT MODAL
   =================================== */
function initProjectModal() {
    if (!DOM.modal) return;

    // Set modal overlay reference
    DOM.modalOverlay = DOM.modal.querySelector('.modal-overlay');

    // Close modal
    if (DOM.modalClose) {
        DOM.modalClose.addEventListener('click', closeModal);
    }
    
    if (DOM.modalOverlay) {
        DOM.modalOverlay.addEventListener('click', closeModal);
    }
    
    // Navigation buttons
    if (DOM.modalPrevBtn) {
        DOM.modalPrevBtn.addEventListener('click', () => navigateProjects(-1));
    }
    
    if (DOM.modalNextBtn) {
        DOM.modalNextBtn.addEventListener('click', () => navigateProjects(1));
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', handleModalKeyboard);
}

function openModal(index) {
    const project = projects[index];
    if (!project || !DOM.modal) return;

    try {
        // Update modal content with sanitized data
        if (DOM.modalCategory) {
            DOM.modalCategory.textContent = project.category;
        }
        
        if (DOM.modalTitle) {
            DOM.modalTitle.textContent = project.title;
        }
        
        // Render media (video or image)
        if (DOM.modalImage) {
            const mediaUrl = Utils.getImgurDirectURL(project.gifUrl);
            const isVideo = Utils.isVideoURL(mediaUrl);
            
            DOM.modalImage.innerHTML = isVideo ? `
                <video 
                    autoplay 
                    loop 
                    muted 
                    playsinline
                    preload="metadata"
                    aria-label="${Utils.sanitizeHTML(project.title)} preview video"
                >
                    <source src="${mediaUrl}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            ` : `
                <img 
                    src="${mediaUrl}" 
                    alt="${Utils.sanitizeHTML(project.title)} preview"
                />
            `;
        }
        
        if (DOM.modalDescription) {
            DOM.modalDescription.textContent = project.description;
        }
        
        // Update features
        if (DOM.modalFeatures) {
            DOM.modalFeatures.innerHTML = project.features
                .map(feature => `<li>${Utils.sanitizeHTML(feature)}</li>`)
                .join('');
        }
        
        // Update technologies
        if (DOM.modalTech) {
            DOM.modalTech.innerHTML = project.technologies
                .map(tech => `<li>${Utils.sanitizeHTML(tech)}</li>`)
                .join('');
        }
        
        // Update links with proper security attributes
        if (DOM.modalLiveLink) {
            DOM.modalLiveLink.href = project.liveUrl;
        }
        
        if (DOM.modalGithubLink) {
            DOM.modalGithubLink.href = project.githubUrl;
        }
        
        // Update navigation buttons
        updateNavigationButtons();
        
        // Show modal
        DOM.modal.removeAttribute('hidden');
        DOM.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        State.isModalOpen = true;
        
        // Focus trap - focus the close button
        if (DOM.modalClose) {
            DOM.modalClose.focus();
        }
    } catch (error) {
        Utils.logError('openModal', error);
    }
}

function closeModal() {
    if (!DOM.modal) return;

    DOM.modal.setAttribute('hidden', '');
    DOM.modal.style.display = 'none';
    document.body.style.overflow = '';
    State.isModalOpen = false;
}

function navigateProjects(direction) {
    State.currentProjectIndex += direction;
    
    // Loop around
    if (State.currentProjectIndex < 0) {
        State.currentProjectIndex = projects.length - 1;
    } else if (State.currentProjectIndex >= projects.length) {
        State.currentProjectIndex = 0;
    }
    
    openModal(State.currentProjectIndex);
}

function updateNavigationButtons() {
    if (!DOM.modalPrevBtn || !DOM.modalNextBtn) return;

    // Enable all buttons (looping is enabled)
    DOM.modalPrevBtn.disabled = false;
    DOM.modalNextBtn.disabled = false;
}

function handleModalKeyboard(e) {
    if (!State.isModalOpen) return;
    
    switch(e.key) {
        case 'Escape':
            closeModal();
            break;
        case 'ArrowLeft':
            e.preventDefault();
            navigateProjects(-1);
            break;
        case 'ArrowRight':
            e.preventDefault();
            navigateProjects(1);
            break;
    }
}

/* ===================================
   CONTACT FORM WITH VALIDATION
   =================================== */
function initContactForm() {
    if (!DOM.contactForm) return;

    // Get or create form status element
    DOM.formStatus = DOM.contactForm.querySelector('.form-status');
    if (!DOM.formStatus) {
        DOM.formStatus = document.createElement('div');
        DOM.formStatus.className = 'form-status';
        DOM.formStatus.setAttribute('role', 'status');
        DOM.formStatus.setAttribute('aria-live', 'polite');
        DOM.contactForm.appendChild(DOM.formStatus);
    }

    // Real-time validation
    Object.values(DOM.formInputs).forEach(input => {
        if (!input) return;

        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            // Clear error on input
            if (input.classList.contains('error')) {
                input.classList.remove('error');
                const errorMsg = input.parentElement.querySelector('.error-message');
                if (errorMsg) errorMsg.textContent = '';
            }
        });
    });

    DOM.contactForm.addEventListener('submit', handleFormSubmit);
}

function validateField(field) {
    if (!field) return true;

    const errorMsg = field.parentElement.querySelector('.error-message');
    let isValid = true;
    let message = '';

    // Get field value and trim whitespace
    const value = field.value.trim();

    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        message = 'This field is required';
    }
    // Email validation
    else if (field.type === 'email' && value && !Utils.isValidEmail(value)) {
        isValid = false;
        message = 'Please enter a valid email address';
    }
    // Length validation
    else if (value.length > parseInt(field.getAttribute('maxlength') || 10000)) {
        isValid = false;
        message = `Maximum ${field.getAttribute('maxlength')} characters allowed`;
    }

    // Update UI
    if (!isValid) {
        field.classList.add('error');
        if (errorMsg) {
            errorMsg.textContent = message;
        }
    } else {
        field.classList.remove('error');
        if (errorMsg) {
            errorMsg.textContent = '';
        }
    }

    return isValid;
}

function validateForm() {
    let isValid = true;

    Object.values(DOM.formInputs).forEach(field => {
        if (field && !validateField(field)) {
            isValid = false;
        }
    });

    return isValid;
}

async function handleFormSubmit(e) {
    e.preventDefault();

    // Validate all fields
    if (!validateForm()) {
        showFormStatus('Please fix the errors above', 'error');
        return;
    }

    // Get sanitized form data
    const formData = {
        name: Utils.sanitizeHTML(DOM.formInputs.name.value.trim()),
        email: Utils.sanitizeHTML(DOM.formInputs.email.value.trim()),
        subject: Utils.sanitizeHTML(DOM.formInputs.subject.value.trim()),
        message: Utils.sanitizeHTML(DOM.formInputs.message.value.trim())
    };

    // Show loading state
    const submitBtn = DOM.contactForm.querySelector('.btn-submit');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    if (btnText && btnLoader) {
        btnText.setAttribute('hidden', '');
        btnLoader.removeAttribute('hidden');
    }
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');

    try {
        // Simulate API call (replace with actual endpoint)
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Success
        showFormStatus(
            `Thank you, ${formData.name}! Your message has been sent successfully. I'll get back to you at ${formData.email} soon.`,
            'success'
        );

        // Reset form
        DOM.contactForm.reset();

        // In production, send data to server:
        // const response = await sendContactForm(formData);
        // if (response.ok) { ... }
    } catch (error) {
        Utils.logError('handleFormSubmit', error);
        showFormStatus(
            'Sorry, there was an error sending your message. Please try again or contact me directly.',
            'error'
        );
    } finally {
        // Reset button state
        if (btnText && btnLoader) {
            btnText.removeAttribute('hidden');
            btnLoader.setAttribute('hidden', '');
        }
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
    }
}

function showFormStatus(message, type) {
    if (!DOM.formStatus) return;

    DOM.formStatus.textContent = message;
    DOM.formStatus.className = `form-status ${type}`;

    // Auto-hide after 10 seconds
    setTimeout(() => {
        DOM.formStatus.className = 'form-status';
        DOM.formStatus.textContent = '';
    }, 10000);
}

/* ===================================
   SMOOTH SCROLLING
   =================================== */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Skip if just "#"
            if (href === '#' || href === '#!') {
                e.preventDefault();
                return;
            }
            
            const targetElement = document.querySelector(href);
            if (!targetElement) return;
            
            e.preventDefault();
            
            const headerOffset = 100;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });
}

/* ===================================
   SCROLL REVEAL ANIMATIONS
   =================================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale'
    );
    
    if (revealElements.length === 0) return;

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const revealPoint = 100;
        
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < windowHeight - revealPoint) {
                element.classList.add('revealed');
            }
        });
    };
    
    // Initial check
    revealOnScroll();
    
    // Throttled scroll listener for performance
    const throttledReveal = Utils.throttle(revealOnScroll, 100);
    window.addEventListener('scroll', throttledReveal, { passive: true });
}

/* ===================================
   ACTIVE NAVIGATION
   =================================== */
function updateActiveNavLink() {
    const scrollPos = window.scrollY + 150;
    
    DOM.sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            // Remove active from all
            DOM.navLinks.forEach(link => link.classList.remove('active'));
            
            // Add active to current
            const activeLinks = document.querySelectorAll(`a[href="#${sectionId}"]`);
            activeLinks.forEach(link => {
                link.classList.add('active');
            });
        }
    });
}

/* ===================================
   PERFORMANCE OPTIMIZATION
   =================================== */
function initPerformanceOptimizations() {
    // Lazy load videos when they enter viewport
    if ('IntersectionObserver' in window) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const video = entry.target;
                    if (video.tagName === 'VIDEO' && !video.src) {
                        const source = video.querySelector('source');
                        if (source && source.dataset.src) {
                            source.src = source.dataset.src;
                            video.load();
                        }
                    }
                    videoObserver.unobserve(video);
                }
            });
        }, { rootMargin: '50px' });

        // Observe all videos
        document.querySelectorAll('video').forEach(video => {
            videoObserver.observe(video);
        });
    }
}

/* ===================================
   ERROR BOUNDARY
   =================================== */
function setupGlobalErrorHandler() {
    window.addEventListener('error', (event) => {
        Utils.logError('Global Error', event.error);
        // Prevent default error handling in production
        // event.preventDefault();
    });

    window.addEventListener('unhandledrejection', (event) => {
        Utils.logError('Unhandled Promise Rejection', event.reason);
        // event.preventDefault();
    });
}

/* ===================================
   INITIALIZATION
   =================================== */
function init() {
    try {
        // Setup error handling
        setupGlobalErrorHandler();

        // Render projects first
        renderProjects();
        
        // Initialize all features
        initMobileMenu();
        initHeaderScroll();
        initProjectFilters();
        initViewAllButton();
        initProjectModal();
        initContactForm();
        initSmoothScrolling();
        initScrollReveal();
        initPerformanceOptimizations();
        
        // Set initial active nav link
        updateActiveNavLink();
        
        // Optimized scroll listener
        const handleScroll = Utils.throttle(() => {
            updateActiveNavLink();
        }, 100);
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        console.log('✅ Portfolio initialized successfully!');
        console.log(`📊 Loaded ${projects.length} project${projects.length !== 1 ? 's' : ''}`);
    } catch (error) {
        Utils.logError('Initialization', error);
        console.error('❌ Portfolio initialization failed');
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Export for testing (optional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Utils, State, projects };
}
