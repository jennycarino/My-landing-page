// Global variables
let softwareData = null;
let downloadCount = 125742;

// DOM elements
const header = document.getElementById('header');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const modalOverlay = document.getElementById('modal-overlay');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    try {
        // Load software data
        await loadSoftwareData();
        
        // Initialize components
        initializeNavigation();
        initializeScrollEffects();
        initializeAnimations();
        initializeModals();
        initializeCounters();
        initializeVideoHandling();
        
        // Render dynamic content
        renderFeatures();
        renderDownloadSection();
        
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Error initializing application:', error);
        showErrorState();
    }
}

// Load software data from JSON
async function loadSoftwareData() {
    try {
        const response = await fetch('./data/software.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        softwareData = await response.json();
    } catch (error) {
        console.error('Error loading software data:', error);
        // Fallback data for error state
        softwareData = {
            name: "Adobe Premiere Pro",
            version: "2025",
            size: "3.2 GB",
            description: "Professional video editing software",
            image: "https://pixabay.com/get/gdc7706babd54911c958a5c9d327db279b40f95472146f813212700c9582f71807d6fda2bd4fc69eeeab5eef36ab6ce4a06d2238b48c23d2b514b613fe4b47ea5_1280.jpg",
            features: []
        };
    }
}

// Navigation functionality
function initializeNavigation() {
    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        const icon = navToggle.querySelector('i');
        
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu when clicking on links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const icon = navToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    // Smooth scrolling for anchor links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#') && href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Scroll effects
function initializeScrollEffects() {
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        // Header scroll effect
        if (currentScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Fade in animations for sections
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const windowHeight = window.innerHeight;
            
            if (currentScrollY + windowHeight > sectionTop + 100) {
                section.classList.add('fade-in');
            }
        });
        
        lastScrollY = currentScrollY;
    });
}

// Initialize animations
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe all animatable elements
    const animatableElements = document.querySelectorAll('.feature-card, .download-card, .preview-container');
    animatableElements.forEach(el => observer.observe(el));
}

// Initialize video handling
function initializeVideoHandling() {
    const video = document.querySelector('.preview-video video');
    const placeholder = document.querySelector('.preview-video .video-placeholder');
    
    if (video && placeholder) {
        // Show placeholder initially
        placeholder.style.display = 'flex';
        
        video.addEventListener('loadeddata', function() {
            // Hide placeholder when video loads successfully
            placeholder.style.display = 'none';
            video.style.display = 'block';
        });
        
        video.addEventListener('error', function() {
            // Show placeholder if video fails to load
            placeholder.style.display = 'flex';
            video.style.display = 'none';
        });
        
        // Check if video is already loaded
        if (video.readyState >= 2) {
            placeholder.style.display = 'none';
            video.style.display = 'block';
        }
    }
}

// Modal functionality
function initializeModals() {
    // Modal triggers
    const modalTriggers = document.querySelectorAll('[data-modal]');
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const modalType = this.getAttribute('data-modal');
            openModal(modalType);
        });
    });

    // Modal close handlers
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // ESC key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });
}

// Open modal with content
function openModal(type) {
    const modalContent = getModalContent(type);
    modalTitle.textContent = modalContent.title;
    modalBody.innerHTML = modalContent.body;
    
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus management for accessibility
    modalClose.focus();
}

// Close modal
function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Get modal content based on type
function getModalContent(type) {
    const content = {
      download: {
            title: 'Download Adobe Premiere Pro',
            body: `
                <div class="download-modal-content">

                    <div class="download-modal-image" style="background: url('${softwareData.image}') center/cover;"></div>
                    <h4>${softwareData.name} ${softwareData.version}</h4>

                    <div class="download-details">
                        <div class="detail-item">
                            <i class="fas fa-hdd"></i>
                            <span>Size: ${softwareData.size}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-download"></i>
                            <span>Downloads: ${downloadCount.toLocaleString()}</span>
                        </div>

                        <div class="detail-item">
                            <i class="fas fa-shield-alt"></i>
                            <span>Virus Free & Safe</span>
                        </div>

                    </div>
                    <div class="download-options">
                        <h5 style="color: var(--text-primary); margin-bottom: 1rem; text-align: center;">Choose Download Option:</h5>
                        <div class="download-buttons">
                            <button class="download-option-button" onclick="redirectToDownload('drive')">
                                <i class="fab fa-google-drive"></i>
                                <span>Download via Google Drive</span>
                                <small>Fast & Reliable</small>
                            </button>
                            <button class="download-option-button" onclick="redirectToDownload('mediafire')">
                                <i class="fas fa-cloud-download-alt"></i>
                                <span>Download via Mediafire</span>
                                <small>Alternative Mirror</small>
                            </button>
                        </div>
                    </div>

                </div>
               <style>
                    .download-modal-content h4 {
                        color: var(--text-primary);
                        margin-bottom: 0.5rem;
                        text-align: center;
                    }
                    .download-details {
                        margin: 1rem 0;
                    }
                    .detail-item {
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                        margin-bottom: 0.5rem;
                        color: var(--text-secondary);
                    }
                    .detail-item i {
                        color: var(--accent-blue);
                        width: 16px;
                    }
                    .download-note {
                        font-size: 0.8rem;
                        color: var(--text-muted);
                        margin-top: 1rem;
                        text-align: center;
                    }
                    .download-options {
                        margin: 1.5rem 0;
                    }
                    .download-buttons {
                        display: flex;
                        flex-direction: column;
                        gap: 0.75rem;
                    }
                    .download-option-button {
                        display: flex;
                        align-items: center;
                        gap: 1rem;
                        padding: 1rem 1.5rem;
                        background: linear-gradient(135deg, var(--accent-blue), var(--accent-orange));
                        color: var(--text-primary);
                        border: none;
                        border-radius: 8px;
                        font-size: 1rem;
                        font-weight: var(--font-weight-medium);
                        cursor: pointer;
                        transition: var(--transition-medium);
                        text-align: left;
                        position: relative;
                        overflow: hidden;
                        box-shadow: 0 4px 15px rgba(0, 102, 255, 0.2);
                    }
                    .download-option-button:first-child {
                        background: linear-gradient(135deg, #4285f4, #1a73e8);
                    }
                    .download-option-button:last-child {
                        background: linear-gradient(135deg, var(--accent-orange), #e65100);
                    }
                    .download-option-button:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 10px 30px rgba(0, 102, 255, 0.3);
                    }
                    .download-option-button i {
                        font-size: 1.5rem;
                        width: 24px;
                        flex-shrink: 0;
                    }
                    .download-option-button span {
                        flex-grow: 1;
                        font-weight: var(--font-weight-semibold);
                    }
                    .download-option-button small {
                        font-size: 0.8rem;
                        opacity: 0.8;
                        font-weight: var(--font-weight-normal);
                    }
                    @media (max-width: 480px) {
                        .download-option-button {
                            padding: 0.75rem 1rem;
                            gap: 0.75rem;
                        }
                        .download-option-button i {
                            font-size: 1.25rem;
                        }
                    }
                </style>
            `
        },
        contact: {
            title: 'Contact Us',
            body: `
                <div class="contact-content">
                    <p>Get in touch with our support team for any questions or assistance.</p>
                    <div class="contact-methods">
                        <div class="contact-method">
                            <i class="fas fa-envelope"></i>
                            <div>
                                <h5>Email Support</h5>
                                <p>support@adobe.com</p>
                            </div>
                        </div>                        
                        <div class="contact-method">
                            <i class="fas fa-clock"></i>
                            <div>
                                <h5>Support Hours</h5>
                                <p>Monday - Friday: 9 AM - 6 PM PST</p>
                            </div>
                        </div>
                    </div>
                </div>
                <style>
                    .contact-methods {
                        margin-top: 1.5rem;
                    }
                    .contact-method {
                        display: flex;
                        align-items: center;
                        gap: 1rem;
                        margin-bottom: 1rem;
                        padding: 1rem;
                        background: var(--tertiary-bg);
                        border-radius: 8px;
                    }
                    .contact-method i {
                        color: var(--accent-blue);
                        font-size: 1.5rem;
                        width: 30px;
                    }
                    .contact-method h5 {
                        color: var(--text-primary);
                        margin-bottom: 0.25rem;
                    }
                    .contact-method p {
                        color: var(--text-secondary);
                        margin: 0;
                    }
                </style>
            `
        }
    };
    
    return content[type] || { title: 'Information', body: '<p>Content not found.</p>' };
}

// Initialize counters with animation
function initializeCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseFloat(counter.getAttribute('data-count'));
                animateCounter(counter, target);
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
}

// Animate counter numbers
function animateCounter(element, target) {
    const duration = 2000; // 2 seconds
    const start = performance.now();
    const isDecimal = target % 1 !== 0;
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const current = target * easedProgress;
        
        if (isDecimal) {
            element.textContent = current.toFixed(1);
        } else {
            element.textContent = Math.floor(current);
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = isDecimal ? target.toFixed(1) : target;
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Render features section
function renderFeatures() {
    const featuresGrid = document.getElementById('features-grid');
    
    if (!softwareData.features || softwareData.features.length === 0) {
        // Default features if not loaded from JSON
        const defaultFeatures = [
            {
                title: "Professional Timeline Editing",
                description: "Advanced multi-track timeline with precision editing tools and real-time preview capabilities.",
                image: "https://pixabay.com/get/gdc7706babd54911c958a5c9d327db279b40f95472146f813212700c9582f71807d6fda2bd4fc69eeeab5eef36ab6ce4a06d2238b48c23d2b514b613fe4b47ea5_1280.jpg"
            },
            {
                title: "AI Color Correction",
                description: "Intelligent auto-color correction powered by Adobe Sensei AI for professional-grade results.",
                image: "https://pixabay.com/get/ge3ff9427238473efa14005edb43a67042a3da660c1eb51731f1499e9ca8d7895b2a3975eef6319dd4f3b47e05d6c43ed9ca3a48be19127166d00229611acdd12_1280.jpg"
            },
            {
                title: "Motion Graphics Integration",
                description: "Seamless integration with After Effects for stunning motion graphics and visual effects.",
                image: "https://pixabay.com/get/ga4f5dfee11849ffa04af4d56bce667e9cfa7017072ffcbd79d7a7ae791adaf9b5a577843a4ced86892b049941a0add5be68df3360163d521ea4734f5957d7d45_1280.jpg"
            },
            {
                title: "Multi-Camera Editing",
                description: "Edit multiple camera angles simultaneously with synchronized audio and seamless switching.",
                image: "https://pixabay.com/get/gd47f587608afbadfe65844324d8ca28f060f9a9d74f46537ea5b214779a8c7aaa9cd320409a5181abc7edb04986b09625446114085bde5a3a4a077326a6dfb0c_1280.jpg"
            }
        ];
        softwareData.features = defaultFeatures;
    }
    
    featuresGrid.innerHTML = '';
    
    softwareData.features.forEach((feature, index) => {
        const featureCard = document.createElement('div');
        featureCard.className = 'feature-card';
        featureCard.style.animationDelay = `${index * 0.1}s`;
        
        featureCard.innerHTML = `
            <div class="feature-image" style="background-image: url('${feature.image}')"></div>
            <h3>${feature.title}</h3>
            <p>${feature.description}</p>
        `;
        
        featuresGrid.appendChild(featureCard);
    });
}

// Render download section
function renderDownloadSection() {
    const downloadCard = document.getElementById('download-card');
    
    downloadCard.innerHTML = `
        <div class="download-image" style="background-image: url('${softwareData.image}')"></div>
        <div class="download-info">
            <h3>${softwareData.name} ${softwareData.version}</h3>
            <div class="download-meta">
                <span><i class="fas fa-hdd"></i> ${softwareData.size}</span>
                <span><i class="fas fa-download"></i> ${downloadCount.toLocaleString()} downloads</span>
                <span><i class="fas fa-shield-alt"></i>Virus Free & Safe</span>
            </div>
            <button class="download-button" data-modal="download">
                <i class="fas fa-download"></i>
                Download Now
            </button>
            <!--<div class="download-counter">Downloaded ${downloadCount.toLocaleString()} times this month</div>-->
        </div>
    `;
    
    // Re-initialize modal triggers for the new button
    const newDownloadButton = downloadCard.querySelector('[data-modal="download"]');
    newDownloadButton.addEventListener('click', function(e) {
        e.preventDefault();
        openModal('download');
    });
}

// Redirect to download page with source parameter
function redirectToDownload(source) {
    // Update download counter
    downloadCount++;
    
    // Update download counter display
    const counters = document.querySelectorAll('.download-counter');
    counters.forEach(counter => {
        counter.textContent = `Downloaded ${downloadCount.toLocaleString()} times this month`;
    });
    
    // Update download meta
    const downloadMeta = document.querySelectorAll('.download-meta span:nth-child(2)');
    downloadMeta.forEach(meta => {
        meta.innerHTML = `<i class="fas fa-download"></i> ${downloadCount.toLocaleString()} downloads`;
    });
    
    // Get the clicked download button
    const downloadButton = event.target.closest('.download-option-button');
    const originalText = downloadButton.innerHTML;
    
    // Update button state
    downloadButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Redirecting...</span>';
    downloadButton.disabled = true;
    
    // Track download event
    console.log(`Download initiated for: ${softwareData.name} via ${source}`);
    
    // Redirect to download page with source parameter
    setTimeout(() => {
        window.open(`download.html?source=${source}`, '_blank', 'width=600,height=400,scrollbars=no,resizable=no');
        
        // Reset button and close modal
        setTimeout(() => {
            downloadButton.innerHTML = originalText;
            downloadButton.disabled = false;
            closeModal();
        }, 1000);
    }, 500);
}

// Legacy download handler for compatibility
function handleDownload() {
    const downloadButton = event.target.closest('.download-button');
    const originalText = downloadButton.innerHTML;
    
    downloadButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Starting Download...';
    downloadButton.disabled = true;
    
    setTimeout(() => {
        downloadButton.innerHTML = '<i class="fas fa-check"></i> Download Started!';
        
        setTimeout(() => {
            downloadButton.innerHTML = originalText;
            downloadButton.disabled = false;
            closeModal();
        }, 2000);
    }, 1500);
    
    console.log('Download initiated for:', softwareData.name);
}

// Error state handler
function showErrorState() {
    const featuresGrid = document.getElementById('features-grid');
    const downloadCard = document.getElementById('download-card');
    
    featuresGrid.innerHTML = `
        <div class="error-state">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Unable to load features</h3>
            <p>Please check your internet connection and try again.</p>
            <button onclick="location.reload()" class="cta-button">Retry</button>
        </div>
    `;
    
    downloadCard.innerHTML = `
        <div class="error-state">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Unable to load download information</h3>
            <p>Please check your internet connection and try again.</p>
            <button onclick="location.reload()" class="cta-button">Retry</button>
        </div>
    `;
}

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Lazy loading for images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', function() {
    initializeLazyLoading();
});

// Service Worker registration for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(registrationError => console.log('SW registration failed'));
    });
}
