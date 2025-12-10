// Component Loader
async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        const html = await response.text();
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = html;
        }
    } catch (error) {
        console.error(`Error loading component ${componentPath}:`, error);
    }
}

// Load all components before initializing
async function loadAllComponents() {
    await Promise.all([
        loadComponent('preloader-container', 'components/preloader.html'),
        loadComponent('nav-container-wrapper', 'components/navigation.html'),
        loadComponent('hero-container', 'components/hero.html')
    ]);
    
    console.log('✅ All components loaded');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAllComponents);
} else {
    loadAllComponents();
}
