// small talk - Landing Page JavaScript
// Calm, Direct, Warm, Considered

document.addEventListener('DOMContentLoaded', function() {

    // === NAVBAR SCROLL EFFECT ===
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        // Add shadow on scroll
        if (currentScroll > 50) {
            navbar.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.08)';
        } else {
            navbar.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });

    // === SMOOTH SCROLL FOR ANCHOR LINKS ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Skip empty hashes
            if (href === '#' || href === '#activate') {
                e.preventDefault();

                // Scroll to activate section
                if (href === '#activate') {
                    const target = document.querySelector('#activate');
                    if (target) {
                        const navHeight = navbar.offsetHeight;
                        const targetPosition = target.offsetTop - navHeight;
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
                return;
            }

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // === PLAN CARD HOVER ANALYTICS (placeholder) ===
    const planCards = document.querySelectorAll('.plan-card');
    planCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const planName = this.querySelector('.plan-name').textContent;
            // console.log(`User viewing: ${planName} plan`);
        });
    });

    // === INTERSECTION OBSERVER FOR ANIMATIONS ===
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Animate sections on scroll
    const animatedElements = document.querySelectorAll('.pillar, .plan-card, .differentiator, .market-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // === STAT COUNTER ANIMATION ===
    const statNumber = document.querySelector('.stat-number');
    let hasAnimated = false;

    const statObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                animateValue(statNumber, 0, 73, 1500);
                hasAnimated = true;
            }
        });
    }, { threshold: 0.5 });

    if (statNumber) {
        statObserver.observe(statNumber);
    }

    function animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value + '%';
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // === MOBILE MENU TOGGLE (if needed) ===
    // Placeholder for future mobile hamburger menu implementation

    // === FORM VALIDATION (placeholder for future activation form) ===
    // Will be implemented when activation forms are added

    // === TRACK CTA CLICKS (placeholder) ===
    const ctaButtons = document.querySelectorAll('.btn-primary, .btn-plan');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Future: Track button clicks for analytics
            const buttonText = this.textContent.trim();
            // console.log(`CTA clicked: ${buttonText}`);
        });
    });

    // === PLAN COMPARISON TOOLTIP (future enhancement) ===
    // Could add tooltips showing plan differences on hover

    // === PREFETCH ACTIVATION PAGE (performance optimization) ===
    // When user hovers over CTA, prefetch the activation page
    const mainCTAs = document.querySelectorAll('a[href="#activate"]');
    mainCTAs.forEach(cta => {
        cta.addEventListener('mouseenter', function() {
            // Future: Prefetch activation page assets
        }, { once: true });
    });

});

// === HELPER FUNCTIONS ===

// Debounce function for performance
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

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}
