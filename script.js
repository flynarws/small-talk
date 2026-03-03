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
            if (href === '#' || href === '#waitlist') {
                e.preventDefault();

                // Scroll to waitlist section
                if (href === '#waitlist') {
                    const target = document.querySelector('#waitlist');
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

    // === WAITLIST FORM HANDLING ===
    const waitlistForm = document.getElementById('waitlist-form');
    const waitlistSuccess = document.getElementById('waitlist-success');

    if (waitlistForm) {
        waitlistForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(waitlistForm);
            const data = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                city: formData.get('city'),
                plan: formData.get('plan'),
                marketing: formData.get('marketing') === 'on',
                timestamp: new Date().toISOString()
            };

            // Validate phone number (Australian format)
            const phoneRegex = /^(?:\+?61|0)[2-478](?:[ -]?[0-9]){8}$/;
            const phoneInput = document.getElementById('phone');
            const phoneValue = phoneInput.value.replace(/\s/g, '');

            if (!phoneRegex.test(phoneValue)) {
                phoneInput.focus();
                phoneInput.style.borderColor = 'var(--shu-vermillion)';
                alert('Please enter a valid Australian mobile number');
                return;
            }

            // Show loading state
            const submitBtn = waitlistForm.querySelector('.btn-submit');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoading = submitBtn.querySelector('.btn-loading');

            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';

            try {
                // Send to backend API
                const response = await fetch('/api/waitlist', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    const result = await response.json();

                    // Show success state
                    waitlistForm.style.display = 'none';
                    waitlistSuccess.style.display = 'block';

                    // Update position in queue
                    const positionEl = document.getElementById('waitlist-position');
                    if (positionEl && result.position) {
                        positionEl.textContent = result.position;
                    } else {
                        positionEl.textContent = Math.floor(Math.random() * 500) + 100;
                    }

                    // Setup share buttons
                    setupShareButtons(data.email);

                    // Scroll to success message
                    waitlistSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

                } else {
                    throw new Error('Failed to join waitlist');
                }

            } catch (error) {
                console.error('Waitlist submission error:', error);

                // For demo purposes, show success anyway (remove in production)
                // In production, show an error message instead
                waitlistForm.style.display = 'none';
                waitlistSuccess.style.display = 'block';

                const positionEl = document.getElementById('waitlist-position');
                positionEl.textContent = Math.floor(Math.random() * 500) + 100;

                setupShareButtons(data.email);
                waitlistSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Production error handling:
                // alert('Oops! Something went wrong. Please try again or email us at hello@small-talk.com.au');
                // submitBtn.disabled = false;
                // btnText.style.display = 'inline';
                // btnLoading.style.display = 'none';
            }
        });

        // Real-time phone number formatting
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');

                // Remove leading 0 or 61
                if (value.startsWith('61')) {
                    value = value.substring(2);
                }
                if (value.startsWith('0')) {
                    value = value.substring(1);
                }

                // Format as: 0XXX XXX XXX
                if (value.length > 0) {
                    value = '0' + value;
                }
                if (value.length > 4) {
                    value = value.slice(0, 4) + ' ' + value.slice(4);
                }
                if (value.length > 8) {
                    value = value.slice(0, 8) + ' ' + value.slice(8, 11);
                }

                e.target.value = value;

                // Reset border color on input
                e.target.style.borderColor = 'transparent';
            });
        }
    }

    // Setup share buttons
    function setupShareButtons(email) {
        const shareButtons = document.querySelectorAll('.share-btn');
        shareButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const platform = this.dataset.platform;
                const text = encodeURIComponent('Just joined the waitlist for small talk - prepaid mobile built for Gen Z 🔥 Talk Less. Connect More. 話すより、つながる');
                const url = encodeURIComponent('https://small-talk.com.au');

                let shareUrl = '';
                if (platform === 'twitter') {
                    shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
                } else if (platform === 'instagram') {
                    // Instagram doesn't support web sharing, open their profile
                    shareUrl = 'https://instagram.com/smalltalk_au';
                }

                if (shareUrl) {
                    window.open(shareUrl, '_blank', 'width=600,height=400');
                }
            });
        });
    }

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
