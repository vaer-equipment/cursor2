document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('nav a');
    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.classList.toggle('menu-open');
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

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isMenuOpen && !nav.contains(e.target) && !hamburger.contains(e.target)) {
            toggleMenu();
        }
    });

    // Close menu on scroll
    document.addEventListener('scroll', () => {
        if (isMenuOpen) {
            toggleMenu();
        }
    });
});
