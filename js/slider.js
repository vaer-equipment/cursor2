document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    
    let currentSlide = 0;
    let touchStartX = 0;
    let touchEndX = 0;
    let currentTranslate = 0;
    let autoPlayInterval;
    let isAnimating = false;
    const TRANSITION_TIME = 400; // match CSS transition time

    // Debounce helper
    function debounce(callback, time) {
        let timeoutId = null;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => callback.apply(null, args), time);
        };
    }

    // Add transition to slider
    slider.style.transition = `transform ${TRANSITION_TIME}ms cubic-bezier(0.4, 0, 0.2, 1)`;

    // Initialize
    function updateSlider(animate = true) {
        if (isAnimating) return;
        isAnimating = true;

        if (!animate) {
            slider.style.transition = 'none';
        }
        slider.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        if (!animate) {
            // Force reflow
            slider.offsetHeight;
            slider.style.transition = `transform ${TRANSITION_TIME}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        }
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });

        // Reset isAnimating after transition
        setTimeout(() => {
            isAnimating = false;
        }, TRANSITION_TIME);
    }
    
    // Next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlider();
    }
    
    // Previous slide
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlider();
    }
    
    // Start auto play
    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(nextSlide, 5000);
    }
    
    // Stop auto play
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
        }
    }
    
    // Event Listeners
    prevBtn.addEventListener('click', () => {
        prevSlide();
        stopAutoPlay();
        startAutoPlay();
    });
    
    nextBtn.addEventListener('click', () => {
        nextSlide();
        stopAutoPlay();
        startAutoPlay();
    });
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateSlider();
            stopAutoPlay();
            startAutoPlay();
        });
    });
    
    // Touch events for mobile
    const isTouchDevice = 'ontouchstart' in window;
    
    if (isTouchDevice) {
        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            currentTranslate = -currentSlide * 100;
            stopAutoPlay();
        }, { passive: true });
        
        slider.addEventListener('touchmove', debounce((e) => {
            if (!touchStartX) return;
            
            touchEndX = e.touches[0].clientX;
            const diff = touchStartX - touchEndX;
            let movePercent = (diff / window.innerWidth) * 100;
            
            // Add resistance at edges
            if ((currentSlide === 0 && diff < 0) || 
                (currentSlide === slides.length - 1 && diff > 0)) {
                movePercent /= 4;
            }
            
            slider.style.transform = `translateX(${currentTranslate - movePercent}%)`;
            
            // Prevent vertical scrolling when swiping horizontally
            if (Math.abs(diff) > 5) {
                e.preventDefault();
            }
        }, 10), { passive: false });
        
        slider.addEventListener('touchend', () => {
            if (!touchStartX || !touchEndX) return;
            
            const diff = touchStartX - touchEndX;
            const swipeThreshold = window.innerWidth * 0.15;
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0 && currentSlide < slides.length - 1) {
                    nextSlide();
                } else if (diff < 0 && currentSlide > 0) {
                    prevSlide();
                } else {
                    updateSlider();
                }
            } else {
                updateSlider();
            }
            
            touchStartX = 0;
            touchEndX = 0;
            startAutoPlay();
        });
        
        // Add touch cancel handler
        slider.addEventListener('touchcancel', () => {
            touchStartX = 0;
            touchEndX = 0;
            updateSlider();
            startAutoPlay();
        });
    }
    
    // Mouse drag fallback for non-touch devices
    if (!isTouchDevice) {
        let isDragging = false;
        
        slider.addEventListener('mousedown', (e) => {
            isDragging = true;
            touchStartX = e.clientX;
            currentTranslate = -currentSlide * 100;
            stopAutoPlay();
            slider.style.cursor = 'grabbing';
        });
        
        slider.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            touchEndX = e.clientX;
            const diff = touchStartX - touchEndX;
            let movePercent = (diff / window.innerWidth) * 100;
            
            if ((currentSlide === 0 && diff < 0) || 
                (currentSlide === slides.length - 1 && diff > 0)) {
                movePercent /= 4;
            }
            
            slider.style.transform = `translateX(${currentTranslate - movePercent}%)`;
        });
        
        window.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            
            const diff = touchStartX - touchEndX;
            const swipeThreshold = window.innerWidth * 0.15;
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0 && currentSlide < slides.length - 1) {
                    nextSlide();
                } else if (diff < 0 && currentSlide > 0) {
                    prevSlide();
                } else {
                    updateSlider();
                }
            } else {
                updateSlider();
            }
            
            touchStartX = 0;
            touchEndX = 0;
            slider.style.cursor = '';
            startAutoPlay();
        });
    }
    
    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoPlay();
        } else {
            startAutoPlay();
        }
    });
    
    // Initialize slider
    updateSlider();
    startAutoPlay();
});

