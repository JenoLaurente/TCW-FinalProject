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
        const options = {
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animateElement(entry.target);
                    this.animatedElements.add(entry.target);
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

        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        // Scroll to top when clicked
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Parallax effect for hero section
class ParallaxEffect {
    constructor() {
        this.heroContent = document.querySelector('.hero-content');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            if (this.heroContent && scrolled < window.innerHeight) {
                this.heroContent.style.transform = `translateY(${rate}px)`;
            }
        });
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