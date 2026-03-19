/* ============================================
   Main JavaScript - RNS Warehouses
   ============================================ */
(function () {
    // ---- Loader ----
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => loader.classList.add('hidden'), 1200);
    });

    // ---- Navbar scroll effect ----
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section, .hero');

    function handleScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link tracking
        let current = '';
        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ---- Mobile menu ----
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    navMenu.querySelectorAll('.nav-link').forEach((link) => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ---- 3D Tilt effect on warehouse cards ----
    const tiltCards = document.querySelectorAll('[data-tilt]');
    const isTouchDevice = 'ontouchstart' in window;

    if (!isTouchDevice) {
        tiltCards.forEach((card) => {
            let rafId = null;
            let currentRotateX = 0, currentRotateY = 0;
            let targetRotateX = 0, targetRotateY = 0;

            function animateTilt() {
                currentRotateX += (targetRotateX - currentRotateX) * 0.12;
                currentRotateY += (targetRotateY - currentRotateY) * 0.12;

                card.style.transform = `
                    rotateX(${currentRotateX}deg)
                    rotateY(${currentRotateY}deg)
                    translateZ(10px)
                    scale3d(1.02, 1.02, 1.02)
                `;

                // Move the shine based on mouse position
                const shine = card.querySelector('.card-image::before');
                if (Math.abs(currentRotateX - targetRotateX) > 0.01 || Math.abs(currentRotateY - targetRotateY) > 0.01) {
                    rafId = requestAnimationFrame(animateTilt);
                }
            }

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                targetRotateX = ((y - centerY) / centerY) * -12;
                targetRotateY = ((x - centerX) / centerX) * 12;

                if (!rafId) {
                    rafId = requestAnimationFrame(animateTilt);
                }
            });

            card.addEventListener('mouseleave', () => {
                targetRotateX = 0;
                targetRotateY = 0;

                // Smooth return animation
                function resetTilt() {
                    currentRotateX += (0 - currentRotateX) * 0.1;
                    currentRotateY += (0 - currentRotateY) * 0.1;

                    if (Math.abs(currentRotateX) > 0.1 || Math.abs(currentRotateY) > 0.1) {
                        card.style.transform = `
                            rotateX(${currentRotateX}deg)
                            rotateY(${currentRotateY}deg)
                            translateZ(0px)
                            scale3d(1, 1, 1)
                        `;
                        rafId = requestAnimationFrame(resetTilt);
                    } else {
                        card.style.transform = '';
                        currentRotateX = 0;
                        currentRotateY = 0;
                        rafId = null;
                    }
                }
                cancelAnimationFrame(rafId);
                rafId = requestAnimationFrame(resetTilt);
            });
        });
    }

    // ---- Smooth scroll for anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ---- Contact Form Handler ----
    const form = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Sending...</span>';
            submitBtn.disabled = true;

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: { Accept: 'application/json' },
                });

                if (response.ok) {
                    gtag('event', 'conversion', {'send_to': 'AW-17013129006/j0ZZCJvxx4ocEK7-vrA_'});
                    formStatus.textContent = 'Message sent successfully! We will get back to you soon.';
                    formStatus.className = 'form-status success';
                    form.reset();
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (err) {
                formStatus.textContent = 'Something went wrong. Please try calling us directly.';
                formStatus.className = 'form-status error';
            }

            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

            setTimeout(() => {
                formStatus.className = 'form-status';
            }, 5000);
        });
    }
})();
