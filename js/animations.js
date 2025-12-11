// Scroll Animations Component
class ScrollAnimations {
    constructor() {
        this.animatedElements = new Set();
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupScrollIndicator();
        this.setupBackToTop();
    }

    setupIntersectionObserver() {
        // Optimized options for better performance
        const options = {
            rootMargin: '0px 0px -50px 0px', // Reduced margin for earlier trigger
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    // Use RAF for smoother animation triggering
                    requestAnimationFrame(() => {
                        this.animateElement(entry.target);
                        this.animatedElements.add(entry.target);
                    });
                    // Unobserve after animation to free resources
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        // Observe all animation elements
        const elementsToAnimate = document.querySelectorAll(
            '.slide-up, .slide-left, .slide-right, .slide-in, .fade-in, ' +
            '.culture-card, .global-card, .issue-card, .timeline-item, ' +
            '.profile-card, .reflection-card, .references-list'
        );

        elementsToAnimate.forEach(el => observer.observe(el));
    }

    animateElement(element) {
        // Add specific animation classes based on element type
        if (element.classList.contains('culture-card')) {
            element.classList.add('animate');
            this.staggerAnimation(element, '.card-content li', 100);
        } else if (element.classList.contains('global-card')) {
            this.addGlobalCardAnimation(element);
        } else if (element.classList.contains('timeline-item')) {
            element.style.animationDelay = `${Array.from(element.parentNode.children).indexOf(element) * 0.2}s`;
            element.classList.add('animate');
        } else if (element.classList.contains('profile-card')) {
            element.style.animationDelay = `${Math.random() * 0.5}s`;
            element.classList.add('animate');
        } else {
            element.classList.add('animate');
        }
    }

    addGlobalCardAnimation(card) {
        const cards = Array.from(card.parentNode.children);
        const index = cards.indexOf(card);
        
        // Add different animation directions
        if (index % 3 === 0) {
            card.classList.add('animate-left');
        } else if (index % 3 === 1) {
            card.classList.add('animate-right');
        } else {
            card.classList.add('animate-up');
        }
        
        card.style.animationDelay = `${index * 0.2}s`;
    }

    staggerAnimation(container, selector, delay) {
        const elements = container.querySelectorAll(selector);
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateX(0)';
                el.style.transition = 'all 0.5s ease';
            }, index * delay);
        });
    }

    setupScrollIndicator() {
        const scrollArrow = document.querySelector('.scroll-arrow');
        if (scrollArrow) {
            scrollArrow.addEventListener('click', () => {
                const nextSection = document.querySelector('#profile');
                if (nextSection) {
                    nextSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }

    setupBackToTop() {
        const backToTopBtn = document.getElementById('backToTop');
        if (!backToTopBtn) return;

        let lastScrollY = 0;
        let ticking = false;

        // Show/hide button based on scroll position - optimized with RAF
        const handleScroll = () => {
            lastScrollY = window.pageYOffset;
            if (!ticking) {
                requestAnimationFrame(() => {
                    if (lastScrollY > 300) {
                        backToTopBtn.classList.add('show');
                    } else {
                        backToTopBtn.classList.remove('show');
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        // Scroll to top when clicked
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Parallax effect for hero section - disabled on mobile for performance
class ParallaxEffect {
    constructor() {
        this.heroContent = document.querySelector('.hero-content');
        this.isMobile = window.innerWidth <= 768;
        this.ticking = false;
        this.init();
    }

    init() {
        // Skip parallax on mobile devices for better performance
        if (this.isMobile) return;
        
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    const rate = scrolled * -0.3; // Reduced parallax intensity
                    
                    if (this.heroContent && scrolled < window.innerHeight) {
                        this.heroContent.style.transform = `translate3d(0, ${rate}px, 0)`;
                    }
                    this.ticking = false;
                });
                this.ticking = true;
            }
        }, { passive: true });
    }
}

// Typing effect for hero title
class TypingEffect {
    constructor(element, text, speed = 100) {
        this.element = element;
        this.text = text;
        this.speed = speed;
        this.index = 0;
    }

    start() {
        this.element.innerHTML = '';
        this.type();
    }

    type() {
        if (this.index < this.text.length) {
            this.element.innerHTML += this.text.charAt(this.index);
            this.index++;
            setTimeout(() => this.type(), this.speed);
        }
    }
}

// Initialize scroll animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ScrollAnimations();
    new ParallaxEffect();
    
    // Add typing effect to hero title with delay
    setTimeout(() => {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            const originalText = heroTitle.textContent;
            const typingEffect = new TypingEffect(heroTitle, originalText, 80);
            typingEffect.start();
        }
    }, 1000);
});