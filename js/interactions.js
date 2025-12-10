// Interactive Components
class InteractiveComponents {
    constructor() {
        this.init();
    }

    init() {
        this.setupCultureCards();
        this.setupTimelineInteraction();
        this.setupStatCounters();
        this.setupImageLazyLoading();
        this.setupTooltips();
        this.setupFormValidation();
        this.setupKeyboardNavigation();
    }

    setupCultureCards() {
        const cultureCards = document.querySelectorAll('.culture-card');
        
        cultureCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.addHoverEffect(card);
            });

            card.addEventListener('mouseleave', () => {
                this.removeHoverEffect(card);
            });

            // Add click interaction
            card.addEventListener('click', () => {
                this.expandCultureCard(card);
            });
        });
    }

    addHoverEffect(card) {
        const overlay = card.querySelector('.card-overlay');
        const content = card.querySelector('.card-content');
        
        if (overlay) {
            overlay.style.background = 'linear-gradient(transparent, rgba(212, 175, 55, 0.9))';
        }
        
        if (content) {
            content.style.maxHeight = content.scrollHeight + 'px';
        }
    }

    removeHoverEffect(card) {
        const overlay = card.querySelector('.card-overlay');
        const content = card.querySelector('.card-content');
        
        if (overlay) {
            overlay.style.background = 'linear-gradient(transparent, rgba(0, 0, 0, 0.8))';
        }
    }

    expandCultureCard(card) {
        // Toggle expanded state
        card.classList.toggle('expanded');
        
        if (card.classList.contains('expanded')) {
            card.style.gridColumn = '1 / -1';
            card.style.transform = 'scale(1.02)';
            card.style.zIndex = '10';
        } else {
            card.style.gridColumn = '';
            card.style.transform = '';
            card.style.zIndex = '';
        }
    }

    setupTimelineInteraction() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        timelineItems.forEach((item, index) => {
            item.addEventListener('mouseenter', () => {
                const year = item.querySelector('.timeline-year');
                const content = item.querySelector('.timeline-content');
                
                if (year) {
                    year.style.transform = 'scale(1.1)';
                    year.style.boxShadow = '0 6px 15px rgba(212, 175, 55, 0.4)';
                }
                
                if (content) {
                    content.style.transform = 'translateY(-5px) scale(1.02)';
                }
            });

            item.addEventListener('mouseleave', () => {
                const year = item.querySelector('.timeline-year');
                const content = item.querySelector('.timeline-content');
                
                if (year) {
                    year.style.transform = 'scale(1)';
                    year.style.boxShadow = '0 4px 10px rgba(212, 175, 55, 0.3)';
                }
                
                if (content) {
                    content.style.transform = 'translateY(0) scale(1)';
                }
            });
        });
    }

    setupStatCounters() {
        const statItems = document.querySelectorAll('.stat-item h4');
        
        statItems.forEach(stat => {
            const finalNumber = stat.textContent.match(/\d+/);
            if (finalNumber) {
                const target = parseInt(finalNumber[0]);
                const suffix = stat.textContent.replace(/\d+/, '');
                this.animateCounter(stat, target, suffix);
            }
        });
    }

    animateCounter(element, target, suffix = '') {
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + suffix;
        }, 20);
    }

    setupImageLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    setupTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.showTooltip(e.target, e.target.dataset.tooltip);
            });

            element.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        });
    }

    showTooltip(element, text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(44, 62, 80, 0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 0.9rem;
            z-index: 1000;
            pointer-events: none;
            transform: translateY(-100%);
            margin-top: -10px;
        `;
        
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top + window.scrollY + 'px';
        
        setTimeout(() => {
            tooltip.style.opacity = '1';
            tooltip.style.transition = 'opacity 0.3s ease';
        }, 10);
    }

    hideTooltip() {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    setupFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                }
            });
        });
    }

    validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                this.showFieldError(field, 'This field is required');
                isValid = false;
            } else {
                this.clearFieldError(field);
            }
        });
        
        return isValid;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #e74c3c;
            font-size: 0.8rem;
            margin-top: 4px;
        `;
        
        field.parentNode.appendChild(errorElement);
        field.style.borderColor = '#e74c3c';
    }

    clearFieldError(field) {
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
        field.style.borderColor = '';
    }

    setupKeyboardNavigation() {
        // Enable keyboard navigation for interactive elements
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close any expanded elements
                const expandedCards = document.querySelectorAll('.culture-card.expanded');
                expandedCards.forEach(card => {
                    this.expandCultureCard(card);
                });
            }
            
            if (e.key === 'Tab') {
                // Enhance tab navigation visibility
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }
}

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.init();
    }

    init() {
        this.measurePageLoad();
        this.measureScrollPerformance();
        this.measureAnimationPerformance();
    }

    measurePageLoad() {
        window.addEventListener('load', () => {
            const navigation = performance.getEntriesByType('navigation')[0];
            this.metrics.pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
            console.log(`Page load time: ${this.metrics.pageLoadTime}ms`);
        });
    }

    measureScrollPerformance() {
        let scrollCount = 0;
        let scrollStart = null;
        
        window.addEventListener('scroll', () => {
            if (!scrollStart) {
                scrollStart = performance.now();
            }
            scrollCount++;
            
            // Measure every 100 scroll events
            if (scrollCount % 100 === 0) {
                const scrollEnd = performance.now();
                const averageScrollTime = (scrollEnd - scrollStart) / 100;
                console.log(`Average scroll event time: ${averageScrollTime}ms`);
                scrollStart = performance.now();
            }
        });
    }

    measureAnimationPerformance() {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
                if (entry.entryType === 'measure') {
                    console.log(`Animation ${entry.name}: ${entry.duration}ms`);
                }
            });
        });
        
        observer.observe({ entryTypes: ['measure'] });
    }
}

// Initialize interactive components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new InteractiveComponents();
    
    // Initialize performance monitoring in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        new PerformanceMonitor();
    }
});