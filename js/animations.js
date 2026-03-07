/* ============================================
   GSAP Scroll Animations
   ============================================ */
(function () {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // Animate all [data-animate] elements
    const animatedElements = document.querySelectorAll('[data-animate]');

    animatedElements.forEach((el) => {
        const delay = parseInt(el.dataset.delay || '0', 10) / 1000;

        gsap.to(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                once: true,
                onEnter: () => el.classList.add('animated'),
            },
            delay: delay,
        });
    });

    // Hero elements animate immediately (no scroll needed)
    setTimeout(() => {
        document.querySelectorAll('.hero [data-animate]').forEach((el) => {
            const delay = parseInt(el.dataset.delay || '0', 10);
            setTimeout(() => el.classList.add('animated'), delay);
        });
    }, 800);

    // Parallax on hero section
    gsap.to('.hero-content', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
        },
        y: 100,
        opacity: 0.3,
    });

    gsap.to('.hero-stats', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
        },
        y: 60,
        opacity: 0,
    });

    // ---- Parallax Backgrounds ----
    document.querySelectorAll('.parallax-bg').forEach((bg) => {
        gsap.to(bg, {
            scrollTrigger: {
                trigger: bg.parentElement,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
            },
            y: -120,
            ease: 'none',
        });
    });

    // Infrastructure floating shapes parallax (different speeds)
    const infraBg = document.querySelector('.infra-parallax-bg');
    if (infraBg) {
        gsap.to(infraBg, {
            scrollTrigger: {
                trigger: '#infrastructure',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
            },
            y: -80,
            rotation: 3,
            ease: 'none',
        });
    }

    // About image parallax - floats slower than text
    const aboutImage = document.querySelector('.about-image .image-wrapper');
    if (aboutImage) {
        gsap.to(aboutImage, {
            scrollTrigger: {
                trigger: '#about',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
            },
            y: -40,
            ease: 'none',
        });
    }

    // Section headers - subtle upward parallax
    document.querySelectorAll('.section-header').forEach((header) => {
        gsap.to(header, {
            scrollTrigger: {
                trigger: header.closest('.section'),
                start: 'top bottom',
                end: 'center center',
                scrub: 1,
            },
            y: -20,
            ease: 'none',
        });
    });

    // Service cards - staggered parallax depth
    document.querySelectorAll('.service-card').forEach((card, i) => {
        gsap.to(card, {
            scrollTrigger: {
                trigger: '#services',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
            },
            y: (i % 2 === 0) ? -30 : -15,
            ease: 'none',
        });
    });

    // Proximity items - slide in from left with parallax
    document.querySelectorAll('.proximity-item').forEach((item, i) => {
        gsap.fromTo(item,
            { x: -30, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 90%',
                    end: 'top 60%',
                    scrub: 1,
                },
                x: 0,
                opacity: 1,
                ease: 'power2.out',
            }
        );
    });

    // Location map - gentle scale parallax
    const locationMap = document.querySelector('.location-map');
    if (locationMap) {
        gsap.fromTo(locationMap,
            { scale: 0.95 },
            {
                scrollTrigger: {
                    trigger: '#location',
                    start: 'top 70%',
                    end: 'center center',
                    scrub: 1,
                },
                scale: 1,
                ease: 'power2.out',
            }
        );
    }

    // Contact cards - float up with varying speeds
    document.querySelectorAll('.contact-card').forEach((card, i) => {
        gsap.to(card, {
            scrollTrigger: {
                trigger: '#contact',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
            },
            y: -(10 + i * 8),
            ease: 'none',
        });
    });

    // Footer parallax - content rises slightly
    const footer = document.querySelector('.footer');
    if (footer) {
        gsap.fromTo(footer.querySelector('.footer-grid'),
            { y: 40, opacity: 0.5 },
            {
                scrollTrigger: {
                    trigger: footer,
                    start: 'top bottom',
                    end: 'top 50%',
                    scrub: 1,
                },
                y: 0,
                opacity: 1,
                ease: 'power2.out',
            }
        );
    }

    // Stagger animations for grids
    const grids = ['.warehouse-grid', '.infra-grid', '.services-grid'];
    grids.forEach((selector) => {
        const grid = document.querySelector(selector);
        if (!grid) return;
        const cards = grid.children;

        ScrollTrigger.create({
            trigger: grid,
            start: 'top 80%',
            once: true,
            onEnter: () => {
                gsap.fromTo(
                    cards,
                    { opacity: 0, y: 40 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        stagger: 0.12,
                        ease: 'power3.out',
                    }
                );
            },
        });
    });

    // ---- Hero Text Magnetic Distortion ----
    const distortTexts = document.querySelectorAll('.distort-text');
    const isTouchDevice = 'ontouchstart' in window;

    if (!isTouchDevice) {
        distortTexts.forEach((el) => {
            const text = el.textContent;
            el.innerHTML = '';
            el.setAttribute('aria-label', text);

            [...text].forEach((char) => {
                const span = document.createElement('span');
                span.className = 'distort-char';
                span.textContent = char === ' ' ? '\u00A0' : char;
                el.appendChild(span);
            });
        });

        const chars = document.querySelectorAll('.distort-char');
        const hero = document.querySelector('.hero');
        const RADIUS = 120;

        hero.addEventListener('mousemove', (e) => {
            const mx = e.clientX;
            const my = e.clientY;

            chars.forEach((char) => {
                const rect = char.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = mx - cx;
                const dy = my - cy;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < RADIUS) {
                    const force = (1 - dist / RADIUS) * 0.8;
                    const moveX = -dx * force * 0.3;
                    const moveY = -dy * force * 0.3;
                    const scale = 1 + force * 0.15;
                    const blur = force * 1.5;

                    gsap.to(char, {
                        x: moveX,
                        y: moveY,
                        scale: scale,
                        filter: `blur(${blur}px)`,
                        opacity: 1 - force * 0.2,
                        duration: 0.3,
                        ease: 'power2.out',
                    });
                } else {
                    gsap.to(char, {
                        x: 0,
                        y: 0,
                        scale: 1,
                        filter: 'blur(0px)',
                        opacity: 1,
                        duration: 0.6,
                        ease: 'elastic.out(1, 0.4)',
                    });
                }
            });
        });

        hero.addEventListener('mouseleave', () => {
            chars.forEach((char) => {
                gsap.to(char, {
                    x: 0,
                    y: 0,
                    scale: 1,
                    filter: 'blur(0px)',
                    opacity: 1,
                    duration: 0.8,
                    ease: 'elastic.out(1, 0.3)',
                });
            });
        });
    }

    // Number counter animation
    const counters = document.querySelectorAll('[data-count]');
    counters.forEach((counter) => {
        const target = parseInt(counter.dataset.count, 10);

        ScrollTrigger.create({
            trigger: counter,
            start: 'top 90%',
            once: true,
            onEnter: () => {
                const obj = { val: 0 };
                gsap.to(obj, {
                    val: target,
                    duration: 2,
                    ease: 'power2.out',
                    onUpdate: () => {
                        counter.textContent = Math.round(obj.val).toLocaleString();
                    },
                });
            },
        });
    });
})();
