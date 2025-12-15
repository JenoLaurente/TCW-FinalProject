/* =====================================================
   DUBAI CULTURAL E-PORTFOLIO - MAIN JAVASCRIPT
   ===================================================== */

// =====================================================
// CONFIGURATION
// =====================================================
const CONFIG = {
    particleCount: 25,
    preloaderDuration: 2000,
    scrollThreshold: 100,
    heroHeight: window.innerHeight,
    isMobile: window.innerWidth <= 768,
    isTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
};

// Performance optimization - throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Debounce function for resize events
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// RequestAnimationFrame-based scroll handler with improved performance
let ticking = false;
let lastKnownScrollY = 0;
function requestTick(callback) {
    lastKnownScrollY = window.scrollY;
    if (!ticking) {
        requestAnimationFrame(() => {
            callback(lastKnownScrollY);
            ticking = false;
        });
        ticking = true;
    }
}

// =====================================================
// PRELOADER
// =====================================================
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    
    if (!preloader) return;
    
    document.body.classList.add('loading');
    
    setTimeout(() => {
        preloader.classList.add('loaded');
        document.body.classList.remove('loading');
        
        // Show hero content after preloader
        setTimeout(() => {
            const heroContent = document.querySelector('.hero-content');
            if (heroContent) {
                heroContent.classList.add('visible');
            }
        }, 500);
    }, CONFIG.preloaderDuration);
}

// =====================================================
// CUSTOM CURSOR
// =====================================================
function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    if (!cursor || !follower || window.innerWidth <= 768) return;
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        // Smooth cursor movement
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .btn, .nav-link, .profile-card, .culture-item');
    
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            follower.classList.add('hovering');
        });
        
        el.addEventListener('mouseleave', () => {
            follower.classList.remove('hovering');
        });
    });
}

// =====================================================
// PARTICLES
// =====================================================
function initParticles() {
    const container = document.querySelector('.particles-container');
    
    if (!container) return;
    
    for (let i = 0; i < CONFIG.particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (5 + Math.random() * 5) + 's';
        container.appendChild(particle);
    }
}

// =====================================================
// 3D SPLINE GLOBE ZOOM EFFECT
// =====================================================
function initZoomEffect() {
    const globeWrapper = document.querySelector('.globe-wrapper');
    const splineContainer = document.querySelector('.spline-globe-container');
    const dubaiPoint = document.querySelector('.dubai-point');
    const dubaiGallery = document.querySelector('.dubai-gallery');
    const heroContent = document.querySelector('.hero-content');
    
    if (!globeWrapper) return;
    
    const heroSection = document.getElementById('home');
    const heroHeight = heroSection ? heroSection.offsetHeight : window.innerHeight * 3;
    
    // Cache values for performance
    let lastScrollY = -1;
    let cachedViewportHeight = window.innerHeight;
    
    // Reduce animation complexity on mobile
    const maxZoomScale = CONFIG.isMobile ? 8 : 14;
    const transitionSpeed = CONFIG.isMobile ? '0.1s' : '0.15s';
    
    // Set initial transition speed
    if (splineContainer) {
        splineContainer.style.transition = `transform ${transitionSpeed} linear, opacity 0.3s ease`;
    }
    
    function handleScroll(scrollY = window.scrollY) {
        // Skip if scroll position hasn't changed significantly
        if (Math.abs(scrollY - lastScrollY) < 2) return;
        lastScrollY = scrollY;
        
        const scrollProgress = Math.min(scrollY / (cachedViewportHeight * 2), 1);
        
        // Check if scrolled past hero section
        if (scrollY > heroHeight - cachedViewportHeight) {
            document.body.classList.add('scrolled-past-hero');
        } else {
            document.body.classList.remove('scrolled-past-hero');
        }
        
        // Skip heavy animations if reduced motion is preferred
        if (CONFIG.reducedMotion) {
            if (scrollProgress > 0.5) {
                heroContent?.classList.add('visible');
            }
            return;
        }
        
        // Spline Globe zoom effects based on scroll progress
        if (splineContainer) {
            // Calculate zoom scale - reduced on mobile for performance
            const zoomScale = 1 + (scrollProgress * maxZoomScale);
            
            // Apply zoom transform to container using GPU-accelerated properties
            splineContainer.style.transform = `scale3d(${zoomScale}, ${zoomScale}, 1)`;
            
            // Fade out globe as we zoom
            const globeOpacity = scrollProgress < 0.3 ? 1 : Math.max(1 - ((scrollProgress - 0.3) / 0.25), 0);
            splineContainer.style.opacity = globeOpacity;
        }
        
        // Show Dubai point marker when starting to zoom
        if (dubaiPoint) {
            if (scrollProgress > 0.1 && scrollProgress < 0.45) {
                dubaiPoint.classList.add('visible');
            } else {
                dubaiPoint.classList.remove('visible');
            }
        }
        
        // Dubai Gallery - show multiple images then transition to main
        if (dubaiGallery) {
            if (scrollProgress > 0.35) {
                dubaiGallery.classList.add('visible');
                
                // After showing all images, transition to main full-screen image
                if (scrollProgress > 0.7) {
                    dubaiGallery.classList.add('show-main');
                } else {
                    dubaiGallery.classList.remove('show-main');
                }
            } else {
                dubaiGallery.classList.remove('visible');
                dubaiGallery.classList.remove('show-main');
            }
        }
        
        // Show hero content when gallery is showing
        if (heroContent) {
            if (scrollProgress > 0.5) {
                heroContent.classList.add('visible');
            } else {
                heroContent.classList.remove('visible');
            }
        }
    }
    
    // Initial call and optimized scroll listener using RAF
    handleScroll();
    window.addEventListener('scroll', () => requestTick(handleScroll), { passive: true });
}

// =====================================================
// NAVIGATION
// =====================================================
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollProgressBar = document.getElementById('scrollProgress');
    const heroSection = document.getElementById('home');
    
    // Cache values for performance
    let lastNavScrollY = -1;
    
    // Scroll effect for navbar and progress bar
    function handleNavScroll() {
        const scrollY = window.scrollY;
        
        // Skip if scroll position hasn't changed
        if (scrollY === lastNavScrollY) return;
        lastNavScrollY = scrollY;
        
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollY / docHeight) * 100;
        
        // Get hero section height to determine when to hide navbar
        const heroHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;
        
        if (scrollY > CONFIG.scrollThreshold) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
        
        // Hide navbar after scrolling past hero section
        if (scrollY > heroHeight * 0.8) {
            navbar?.classList.add('nav-hidden');
        } else {
            navbar?.classList.remove('nav-hidden');
        }
        
        // Update scroll progress bar
        if (scrollProgressBar) {
            scrollProgressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
        }
    }
    
    window.addEventListener('scroll', () => requestTick(handleNavScroll), { passive: true });
    handleNavScroll();
    
    // Mobile menu toggle
    hamburger?.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu?.classList.toggle('active');
    });
    
    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
        });
    });
    
    // Scroll spy for active link - throttled for performance
    const sections = document.querySelectorAll('section[id]');
    
    const updateActiveLink = throttle(() => {
        const scrollY = window.scrollY + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, 100);
    
    window.addEventListener('scroll', updateActiveLink, { passive: true });
}

// =====================================================
// REVEAL ANIMATIONS
// =====================================================
function initRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    
    if (!revealElements.length) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, delay * 150);
            }
        });
    }, observerOptions);
    
    revealElements.forEach(el => observer.observe(el));
}

// =====================================================
// STAT CIRCLE ANIMATIONS
// =====================================================
function initStatCircles() {
    const statCircles = document.querySelectorAll('.stat-progress');
    
    if (!statCircles.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const circle = entry.target;
                const percent = circle.dataset.percent || 0;
                const circumference = 2 * Math.PI * 45; // radius = 45
                const offset = circumference - (percent / 100) * circumference;
                circle.style.strokeDashoffset = offset;
            }
        });
    }, { threshold: 0.5 });
    
    statCircles.forEach(circle => observer.observe(circle));
}

// =====================================================
// SMOOTH SCROLL
// =====================================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// =====================================================
// BACK TO TOP
// =====================================================
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    
    if (!backToTop) return;
    
    function toggleBackToTop() {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }
    
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// =====================================================
// SOUND TOGGLE (PLACEHOLDER)
// =====================================================
function initSoundToggle() {
    const soundToggle = document.querySelector('.sound-toggle');
    
    if (!soundToggle) return;
    
    soundToggle.addEventListener('click', () => {
        const icon = soundToggle.querySelector('i');
        if (icon.classList.contains('fa-volume-up')) {
            icon.classList.remove('fa-volume-up');
            icon.classList.add('fa-volume-mute');
        } else {
            icon.classList.remove('fa-volume-mute');
            icon.classList.add('fa-volume-up');
        }
    });
}

// =====================================================
// IMAGE ERROR HANDLING
// =====================================================
function initImageErrorHandling() {
    document.querySelectorAll('img').forEach(img => {
        // Add loading attribute for lazy loading
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
        
        img.addEventListener('error', function() {
            // Try to reload with different quality/size
            const src = this.src;
            if (src.includes('unsplash.com') && !src.includes('retry')) {
                // Try alternative image source or placeholder
                this.src = src.replace(/w=\d+/, 'w=600') + '&retry=1';
            } else {
                // Use a fallback placeholder
                this.style.background = 'linear-gradient(135deg, var(--navy-light), var(--navy))';
                this.style.minHeight = '200px';
                console.warn('Image failed to load:', this.src);
            }
        });
        
        // Ensure images are visible when loaded
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
    });
}

// =====================================================
// JOURNEY MAP ANIMATION
// =====================================================
function initJourneyMap() {
    const journeyPath = document.querySelector('.journey-line-progress');
    const journeyItems = document.querySelectorAll('.journey-item');
    const journeyMap = document.querySelector('.journey-map');
    
    if (!journeyPath || !journeyMap) return;
    
    // Get the total length of the path
    const pathLength = journeyPath.getTotalLength();
    
    // Set up the path for animation - start hidden
    journeyPath.style.strokeDasharray = pathLength;
    journeyPath.style.strokeDashoffset = pathLength;
    
    function animateJourney() {
        const rect = journeyMap.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Calculate how much of the journey map is visible
        const mapTop = rect.top;
        const mapHeight = rect.height;
        
        // Progress calculation - starts as soon as section is 20% visible
        // Completes when section is fully scrolled through
        let progress = 0;
        
        if (mapTop < windowHeight * 0.8) {
            // Slower progress calculation - takes longer to complete
            const scrolledIntoSection = (windowHeight * 0.8) - mapTop;
            const totalScrollDistance = mapHeight * 1.2; // Complete over 120% of section height (slower)
            progress = Math.min(1, Math.max(0, scrolledIntoSection / totalScrollDistance));
        }
        
        // Apply the progress to the path - draw the line
        const drawLength = pathLength * (1 - progress);
        journeyPath.style.strokeDashoffset = drawLength;
        
        // Animate journey items - show them quickly (cards still appear fast)
        // Item 1: 5% progress, Item 2: 25% progress, Item 3: 45% progress
        journeyItems.forEach((item, index) => {
            const itemThreshold = (index * 0.2) + 0.05;
            
            if (progress >= itemThreshold) {
                item.classList.add('active');
            }
        });
    }
    
    // Initial call
    animateJourney();
    
    // Add scroll listener with throttling for performance
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(() => {
                animateJourney();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }, { passive: true });
}

// =====================================================
// INITIALIZATION
// =====================================================
function init() {
    // Wait for components to load
    setTimeout(() => {
        // Update mobile detection
        CONFIG.isMobile = window.innerWidth <= 768;
        CONFIG.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        // Add mobile class to body for CSS optimizations
        if (CONFIG.isMobile) {
            document.body.classList.add('is-mobile');
        }
        if (CONFIG.isTouch) {
            document.body.classList.add('is-touch');
        }
        
        initPreloader();
        initZoomEffect();
        initNavigation();
        initRevealAnimations();
        initStatCircles();
        initSmoothScroll();
        initBackToTop();
        initSoundToggle();
        initImageErrorHandling();
        initJourneyMap();
        
        console.log('Dubai Cultural e-Portfolio initialized successfully!');
    }, 100);
}

// Run on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Wait for components to load
        window.addEventListener('componentsLoaded', init);
    });
} else {
    // Wait for components to load
    window.addEventListener('componentsLoaded', init);
}

// Re-initialize some features on window resize with debouncing
const handleResize = debounce(() => {
    CONFIG.heroHeight = window.innerHeight;
    CONFIG.isMobile = window.innerWidth <= 768;
    CONFIG.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Update body classes
    document.body.classList.toggle('is-mobile', CONFIG.isMobile);
    document.body.classList.toggle('is-touch', CONFIG.isTouch);
}, 250);

window.addEventListener('resize', handleResize, { passive: true });
