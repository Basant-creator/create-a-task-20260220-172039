document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.querySelector('i').classList.toggle('fa-bars');
            hamburger.querySelector('i').classList.toggle('fa-times');
        });

        // Close menu when a link is clicked (on mobile)
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    hamburger.querySelector('i').classList.remove('fa-times');
                    hamburger.querySelector('i').classList.add('fa-bars');
                }
            });
        });
    }

    // Highlight current page in navigation
    const currentPath = window.location.pathname;
    navLinks.forEach(link => {
        // Adjust paths for public/app directories
        let linkPath = link.getAttribute('href');
        // Handle root index.html vs public/index.html
        if (linkPath === 'index.html') linkPath = '/public/index.html';
        if (linkPath === 'login.html') linkPath = '/public/login.html';
        if (linkPath === 'signup.html') linkPath = '/public/signup.html';
        if (linkPath.startsWith('app/')) linkPath = '/' + linkPath;

        if (currentPath.endsWith(linkPath)) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Show/hide auth links based on token presence
    const token = localStorage.getItem('token');
    const authLinks = document.querySelectorAll('.nav-link.hidden-auth');
    const publicAuthLinks = document.querySelectorAll('.nav-link:not(.hidden-auth)'); // These are Login/Signup/Index

    if (token) {
        authLinks.forEach(link => link.style.display = 'block'); // Show Dashboard, Profile, Settings
        publicAuthLinks.forEach(link => {
            // Hide Login/Signup
            if (link.href.includes('login.html') || link.href.includes('signup.html')) {
                link.style.display = 'none';
            }
        });
    } else {
        authLinks.forEach(link => link.style.display = 'none');
        publicAuthLinks.forEach(link => {
            // Show Login/Signup
            if (link.href.includes('login.html') || link.href.includes('signup.html')) {
                link.style.display = 'block';
            }
        });
    }
});