/* ============================================
   Modern Minimal Cursor - Apple-style
   ============================================ */
(function () {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    document.body.style.cursor = 'none';

    // Create cursor elements
    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    const circle = document.createElement('div');
    circle.className = 'cursor-circle';
    document.body.appendChild(dot);
    document.body.appendChild(circle);

    let mouseX = -100, mouseY = -100;
    let circleX = -100, circleY = -100;
    let isHovering = false;
    let isPressed = false;
    let visible = true;

    // Track mouse
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!visible) {
            visible = true;
            dot.style.opacity = '1';
            circle.style.opacity = '1';
        }
    });

    // Smooth circle follow
    function animate() {
        circleX += (mouseX - circleX) * 0.12;
        circleY += (mouseY - circleY) * 0.12;

        dot.style.transform = `translate(${mouseX}px, ${mouseY}px) scale(${isPressed ? 0.7 : 1})`;
        circle.style.transform = `translate(${circleX}px, ${circleY}px) scale(${isHovering ? 1.4 : isPressed ? 0.85 : 1})`;

        requestAnimationFrame(animate);
    }
    animate();

    // Hover states
    const hoverTargets = 'a, button, [data-tilt], .service-card, .infra-card, .extra-card, .contact-card, .proximity-item, input, textarea, select';

    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(hoverTargets)) {
            isHovering = true;
            dot.classList.add('is-hover');
            circle.classList.add('is-hover');
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(hoverTargets)) {
            isHovering = false;
            dot.classList.remove('is-hover');
            circle.classList.remove('is-hover');
        }
    });

    // Click
    document.addEventListener('mousedown', () => {
        isPressed = true;
        circle.classList.add('is-press');
    });
    document.addEventListener('mouseup', () => {
        isPressed = false;
        circle.classList.remove('is-press');
    });

    // Hide when leaving window
    document.addEventListener('mouseleave', () => {
        visible = false;
        dot.style.opacity = '0';
        circle.style.opacity = '0';
    });

    // Set cursor:none on interactive elements
    document.querySelectorAll(hoverTargets).forEach((el) => {
        el.style.cursor = 'none';
    });

    // Card glow follow
    const glowCards = document.querySelectorAll('.warehouse-card, .service-card, .infra-card');
    glowCards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--glow-x', (e.clientX - rect.left) + 'px');
            card.style.setProperty('--glow-y', (e.clientY - rect.top) + 'px');
        });
    });
})();
