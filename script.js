// Navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            navMenu.classList.remove('active');
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 10px 40px rgba(139, 21, 56, 0.15)';
    } else {
        navbar.style.boxShadow = '0 10px 40px rgba(139, 21, 56, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Carousel functionality
const carouselTrack = document.getElementById('carouselTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const carouselDots = document.getElementById('carouselDots');
const carouselContainer = document.querySelector('.carousel-container');
let currentIndex = 0;
let carouselItems = [];
let itemWidth = 0;
let isTransitioning = false;

if (carouselTrack && carouselContainer) {
    carouselItems = Array.from(carouselTrack.children);
    
    // Create dots
    carouselItems.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            if (!isTransitioning) goToSlide(index);
        });
        carouselDots.appendChild(dot);
    });
    
    // Calculate item width based on container
    function calculateItemWidth() {
        if (carouselItems.length === 0) return 0;
        // Get the actual width of the first carousel item
        const firstItem = carouselItems[0];
        itemWidth = firstItem.offsetWidth;
        return itemWidth;
    }
    
    // Update carousel position (for initialization and resize)
    function updateCarousel(skipTransitionCheck = false) {
        if (!skipTransitionCheck && isTransitioning) return;
        
        calculateItemWidth();
        if (itemWidth === 0) {
            // Retry after a short delay if width not calculated yet
            setTimeout(() => updateCarousel(skipTransitionCheck), 50);
            return;
        }
        
        const translateX = -currentIndex * itemWidth;
        carouselTrack.style.transform = `translateX(${translateX}px)`;
        
        // Update dots
        updateDots();
    }
    
    // Go to specific slide
    function goToSlide(index) {
        if (isTransitioning) return;
        
        isTransitioning = true;
        currentIndex = index;
        if (currentIndex < 0) currentIndex = carouselItems.length - 1;
        if (currentIndex >= carouselItems.length) currentIndex = 0;
        
        // Update carousel without transition check since we just set isTransitioning
        calculateItemWidth();
        if (itemWidth === 0) {
            // Retry after a short delay if width not calculated yet
            setTimeout(() => {
                calculateItemWidth();
                if (itemWidth > 0) {
                    const translateX = -currentIndex * itemWidth;
                    carouselTrack.style.transform = `translateX(${translateX}px)`;
                    updateDots();
                }
                isTransitioning = false;
            }, 50);
            return;
        }
        
        const translateX = -currentIndex * itemWidth;
        carouselTrack.style.transform = `translateX(${translateX}px)`;
        updateDots();
        
        // Reset transition lock after animation
        setTimeout(() => {
            isTransitioning = false;
        }, 600);
    }
    
    // Update dots helper
    function updateDots() {
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    // Next slide
    function nextSlide() {
        if (isTransitioning) return;
        currentIndex++;
        if (currentIndex >= carouselItems.length) currentIndex = 0;
        goToSlide(currentIndex);
    }
    
    // Previous slide
    function prevSlide() {
        if (isTransitioning) return;
        currentIndex--;
        if (currentIndex < 0) currentIndex = carouselItems.length - 1;
        goToSlide(currentIndex);
    }
    
    // Button event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            nextSlide();
        });
    }
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            prevSlide();
        });
    }
    
    // Auto-play carousel
    let autoPlayInterval = setInterval(() => {
        if (!isTransitioning) nextSlide();
    }, 5000);
    
    // Pause on hover
    carouselContainer.addEventListener('mouseenter', () => {
        clearInterval(autoPlayInterval);
    });
    
    carouselContainer.addEventListener('mouseleave', () => {
        autoPlayInterval = setInterval(() => {
            if (!isTransitioning) nextSlide();
        }, 5000);
    });
    
    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartTime = 0;
    
    carouselTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartTime = Date.now();
        clearInterval(autoPlayInterval);
    }, { passive: true });
    
    carouselTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const touchDuration = Date.now() - touchStartTime;
        const swipeDistance = touchStartX - touchEndX;
        const minSwipeDistance = 50;
        
        if (Math.abs(swipeDistance) > minSwipeDistance && touchDuration < 300) {
            if (swipeDistance > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        
        // Restart autoplay
        autoPlayInterval = setInterval(() => {
            if (!isTransitioning) nextSlide();
        }, 5000);
    }, { passive: true });
    
    // Initialize after DOM is fully loaded
    function initializeCarousel() {
        // Wait for layout to be calculated
        setTimeout(() => {
            updateCarousel(true); // Skip transition check on init
        }, 100);
    }
    
    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeCarousel);
    } else {
        initializeCarousel();
    }
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            calculateItemWidth();
            updateCarousel();
        }, 250);
    });
}

// Tab functionality
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');
        
        // Remove active class from all buttons and panels
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanels.forEach(panel => panel.classList.remove('active'));
        
        // Add active class to clicked button and corresponding panel
        button.classList.add('active');
        const targetPanel = document.getElementById(targetTab);
        if (targetPanel) {
            targetPanel.classList.add('active');
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.testimonial-card, .student-card, .topic-content').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Student cards click handlers
document.querySelectorAll('.student-card').forEach(card => {
    card.addEventListener('click', (e) => {
        const studentId = card.getAttribute('data-student');
        if (studentId && !e.target.classList.contains('view-profile-btn')) {
            window.location.href = `student-profile.html?id=${studentId}`;
        }
    });
});

// Form validation (if forms are added later)
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#e74c3c';
        } else {
            input.style.borderColor = '';
        }
    });
    
    return isValid;
}

// Utility function to format phone numbers
function formatPhoneNumber(phone) {
    const cleaned = ('' + phone).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phone;
}

// Lazy loading for images (if images are added)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Console message
console.log('%cBeyond the Rumors', 'color: #8B1538; font-size: 24px; font-weight: bold;');
console.log('%cIdentity Construction in Education City, Qatar', 'color: #666; font-size: 14px;');

