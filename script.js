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
    heroHeight: window.innerHeight
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

// RequestAnimationFrame-based scroll handler
let ticking = false;
function requestTick(callback) {
    if (!ticking) {
        requestAnimationFrame(() => {
            callback();
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
    
    function handleScroll() {
        const scrollY = window.scrollY;
        
        // Skip if scroll position hasn't changed
        if (scrollY === lastScrollY) return;
        lastScrollY = scrollY;
        
        const viewportHeight = window.innerHeight;
        const scrollProgress = Math.min(scrollY / (viewportHeight * 2), 1);
        
        // Check if scrolled past hero section
        if (scrollY > heroHeight - viewportHeight) {
            document.body.classList.add('scrolled-past-hero');
        } else {
            document.body.classList.remove('scrolled-past-hero');
        }
        
        // Spline Globe zoom effects based on scroll progress
        if (splineContainer) {
            // Calculate zoom scale (1 to 15) - smoother zoom
            const zoomScale = 1 + (scrollProgress * 14);
            
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
        
        if (scrollY > CONFIG.scrollThreshold) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
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
// INITIALIZATION
// =====================================================
function init() {
    // Wait for components to load
    setTimeout(() => {
        initPreloader();
        // initCustomCursor(); // Removed
        // initParticles(); // Removed
        initZoomEffect();
        initNavigation();
        initRevealAnimations();
        initStatCircles();
        initSmoothScroll();
        initBackToTop();
        initSoundToggle();
        initImageErrorHandling();
        
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

// Re-initialize some features on window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        CONFIG.heroHeight = window.innerHeight;
    }, 250);
});
