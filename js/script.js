document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav ul');
    const navLinks = document.querySelectorAll('nav a');
    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.querySelector('.nav-overlay').classList.toggle('active');
        document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';

        // Animate nav links
        navLinks.forEach((link, index) => {
            if (isMenuOpen) {
                link.style.animation = `fadeInRight 0.3s ease forwards ${index * 0.1}s`;
            } else {
                link.style.animation = '';
            }
        });
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
                    }, 300); // Wait for menu animation to complete
                }
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isMenuOpen && !navMenu.contains(e.target)) {
            toggleMenu();
        }
    });

    // Handle scroll position for smooth section transitions
    document.addEventListener('scroll', () => {
        if (isMenuOpen) {
            toggleMenu();
        }
    });
});
