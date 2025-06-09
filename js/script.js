document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.mobile-nav');
    const navLinks = document.querySelectorAll('.mobile-nav a');
    const overlay = document.querySelector('.nav-overlay');
    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        if (overlay) {
            overlay.classList.toggle('active');
        }
    }

    // Toggle menu on hamburger click
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Close menu when clicking navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            if (isMenuOpen) {
                toggleMenu();
            }

            // Smooth scroll to section if it's an anchor link
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const section = document.querySelector(href);
                if (section) {
                    setTimeout(() => {
                        section.scrollIntoView({ behavior: 'smooth' });
                    }, 300);
                }
            }
        });
    });

    // Close menu when clicking outside or on overlay
    document.addEventListener('click', (e) => {
        if (isMenuOpen && !nav.contains(e.target) && !hamburger.contains(e.target)) {
            toggleMenu();
        }
    });

    if (overlay) {
        overlay.addEventListener('click', () => {
            if (isMenuOpen) {
                toggleMenu();
            }
        });
    }

    // Close menu on scroll
    document.addEventListener('scroll', () => {
        if (isMenuOpen) {
            toggleMenu();
        }
    });
});
