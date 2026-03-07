/* ============================================
   Three.js Hero Background - Floating Boxes
   ============================================ */
(function () {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xf59e0b, 0.8);
    directionalLight.position.set(10, 20, 15);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x3b82f6, 0.5, 50);
    pointLight.position.set(-15, 10, 10);
    scene.add(pointLight);

    // Create floating warehouse boxes
    const boxes = [];
    const boxCount = 25;
    const boxMaterial = new THREE.MeshPhongMaterial({
        color: 0x1b2a4a,
        transparent: true,
        opacity: 0.6,
        shininess: 80,
    });

    const edgeMaterial = new THREE.LineBasicMaterial({
        color: 0xf59e0b,
        transparent: true,
        opacity: 0.3,
    });

    for (let i = 0; i < boxCount; i++) {
        const w = Math.random() * 2 + 0.5;
        const h = Math.random() * 1.5 + 0.3;
        const d = Math.random() * 2 + 0.5;
        const geometry = new THREE.BoxGeometry(w, h, d);

        const mesh = new THREE.Mesh(geometry, boxMaterial.clone());
        mesh.material.opacity = Math.random() * 0.3 + 0.1;

        mesh.position.set(
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 30
        );

        mesh.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );

        // Add wireframe edges
        const edges = new THREE.EdgesGeometry(geometry);
        const line = new THREE.LineSegments(edges, edgeMaterial.clone());
        line.material.opacity = Math.random() * 0.2 + 0.1;
        mesh.add(line);

        scene.add(mesh);
        boxes.push({
            mesh,
            rotSpeed: {
                x: (Math.random() - 0.5) * 0.005,
                y: (Math.random() - 0.5) * 0.005,
                z: (Math.random() - 0.5) * 0.003,
            },
            floatSpeed: Math.random() * 0.003 + 0.001,
            floatOffset: Math.random() * Math.PI * 2,
        });
    }

    // Particle field
    const particleCount = 100;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 60;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
        color: 0xf59e0b,
        size: 0.08,
        transparent: true,
        opacity: 0.5,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Mouse interaction
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Animation loop
    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;

        boxes.forEach((box) => {
            box.mesh.rotation.x += box.rotSpeed.x;
            box.mesh.rotation.y += box.rotSpeed.y;
            box.mesh.rotation.z += box.rotSpeed.z;
            box.mesh.position.y += Math.sin(time + box.floatOffset) * box.floatSpeed;
        });

        particles.rotation.y += 0.0003;

        // Camera follows mouse subtly
        camera.position.x += (mouseX * 3 - camera.position.x) * 0.02;
        camera.position.y += (-mouseY * 2 - camera.position.y) * 0.02;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
})();
