
// Three.js 3D Desktop Background Scene
(function() {
  const canvas = document.getElementById('bg-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x0D1117, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 30);

  // Fog
  scene.fog = new THREE.FogExp2(0x0D1117, 0.018);

  // ── Grid plane ──────────────────────────────────────────────
  const gridHelper = new THREE.GridHelper(200, 80, 0x0e3a3a, 0x0a2020);
  gridHelper.position.y = -12;
  scene.add(gridHelper);

  // ── Particle field ───────────────────────────────────────────
  const particleCount = 1800;
  const positions = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 120;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
    sizes[i] = Math.random() * 2 + 0.5;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  pGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const pMat = new THREE.PointsMaterial({
    color: 0x2dd4bf,
    size: 0.15,
    transparent: true,
    opacity: 0.55,
    sizeAttenuation: true,
  });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // ── Floating geometric objects ───────────────────────────────
  const accentColor = new THREE.Color(0x2dd4bf);
  const dimColor    = new THREE.Color(0x0f4c4c);

  function makeWireframe(geo, x, y, z) {
    const mat = new THREE.MeshBasicMaterial({ color: accentColor, wireframe: true, transparent: true, opacity: 0.18 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    scene.add(mesh);
    return mesh;
  }

  const shapes = [
    makeWireframe(new THREE.IcosahedronGeometry(3.5, 1),  -18, 4, -8),
    makeWireframe(new THREE.OctahedronGeometry(2.5, 0),    16, -2, -12),
    makeWireframe(new THREE.TorusGeometry(3, 0.6, 12, 48), 5,  8, -18),
    makeWireframe(new THREE.TetrahedronGeometry(2.5, 0),  -8, -6, -15),
    makeWireframe(new THREE.IcosahedronGeometry(2, 0),     22, 6, -20),
    makeWireframe(new THREE.TorusKnotGeometry(2, 0.5, 80, 12), -22, -4, -22),
  ];

  // ── Constellation lines ──────────────────────────────────────
  const linePoints = [];
  for (let i = 0; i < 40; i++) {
    const x = (Math.random() - 0.5) * 80;
    const y = (Math.random() - 0.5) * 50;
    const z = (Math.random() - 0.5) * 40 - 10;
    linePoints.push(new THREE.Vector3(x, y, z));
  }
  // Connect nearby points
  const lineMat = new THREE.LineBasicMaterial({ color: 0x2dd4bf, transparent: true, opacity: 0.08 });
  for (let i = 0; i < linePoints.length; i++) {
    for (let j = i + 1; j < linePoints.length; j++) {
      if (linePoints[i].distanceTo(linePoints[j]) < 22) {
        const lg = new THREE.BufferGeometry().setFromPoints([linePoints[i], linePoints[j]]);
        scene.add(new THREE.Line(lg, lineMat));
      }
    }
  }

  // ── Ambient light ────────────────────────────────────────────
  scene.add(new THREE.AmbientLight(0x2dd4bf, 0.3));
  const ptLight = new THREE.PointLight(0x2dd4bf, 1.5, 60);
  ptLight.position.set(0, 10, 10);
  scene.add(ptLight);

  // ── Mouse parallax ───────────────────────────────────────────
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ── Resize ───────────────────────────────────────────────────
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ── Animation loop ───────────────────────────────────────────
  let clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    targetX += (mouseX * 1.5 - targetX) * 0.04;
    targetY += (mouseY * 1.0 - targetY) * 0.04;

    camera.position.x = targetX;
    camera.position.y = -targetY + 0;
    camera.lookAt(0, 0, 0);

    // Rotate shapes
    shapes.forEach((s, i) => {
      s.rotation.x = t * (0.12 + i * 0.03);
      s.rotation.y = t * (0.08 + i * 0.02);
      s.position.y += Math.sin(t * 0.5 + i * 1.2) * 0.004;
    });

    // Drift particles
    particles.rotation.y = t * 0.012;
    particles.rotation.x = t * 0.005;

    // Pulse point light
    ptLight.intensity = 1.2 + Math.sin(t * 1.5) * 0.3;

    renderer.render(scene, camera);
  }
  animate();
})();
