// Background: 3D Retro Synthwave Sunset
// - Striped sun on horizon
// - Wireframe mountain ranges, scrolling perspective grid floor, stars, horizon flare
// - Muted purples (toned for behind-UI readability), subtle slow drift
// - Mouse parallax
// Preserves the API surface used by the rest of the page:
//   window.__updateBgAccent(hex)  — no-op (palette is fixed for this look)
//   window.__updateBgTheme(theme) — swaps between dusk (dark) and dawn (light) variants
//   window.__setBgSpeed(s)

(function () {
  const canvas = document.getElementById('bg-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  // Apply user-selected intensity (55) as a soft canvas opacity so the UI on top stays legible.
  canvas.style.opacity = '0.72';

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 500);
  camera.position.set(0, 2.0, 8);
  camera.lookAt(0, 2.3, 0);

  const clock = new THREE.Clock();

  // ── Toned-down synthwave palette ──────────────────────────
  const PAL = {
    skyTop:     new THREE.Color(0x140826),
    skyMid:     new THREE.Color(0x33174f),
    skyHorizon: new THREE.Color(0x6b2a6a),
    sunRim:     0xff9ec7,
    sunMid:     0xd95f9d,
    sunDeep:    0x6b2a6f,
    grid:       new THREE.Color(0xb074e6),
    gridHot:    new THREE.Color(0xff79c6),
    mountain:   new THREE.Color(0x7848a8),
    mountainFill: new THREE.Color(0x180a2a),
    star:       new THREE.Color(0xe6cfff),
  };

  // ── 1. Sky backdrop (vertex-coloured gradient plane) ────
  const skyGeo = new THREE.PlaneGeometry(260, 130, 1, 4);
  const rows = [
    PAL.skyTop,
    PAL.skyTop.clone().lerp(PAL.skyMid, 0.5),
    PAL.skyMid,
    PAL.skyHorizon,
    PAL.skyHorizon.clone().multiplyScalar(0.4),
  ];
  const skyColors = [];
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 2; c++) {
      const col = rows[r];
      skyColors.push(col.r, col.g, col.b);
    }
  }
  skyGeo.setAttribute('color', new THREE.Float32BufferAttribute(skyColors, 3));
  const skyMat = new THREE.MeshBasicMaterial({ vertexColors: true, depthWrite: false });
  const sky = new THREE.Mesh(skyGeo, skyMat);
  sky.position.set(0, 5, -70);
  scene.add(sky);

  // ── 2. Striped retro sun (canvas texture) ───────────────
  // Matches reference: peach top → hot pink → deep magenta with thick
  // horizontal stripes cutting through the lower 2/3 of the disc.
  function makeSunTexture() {
    const SZ = 512;
    const c = document.createElement('canvas');
    c.width = c.height = SZ;
    const ctx = c.getContext('2d');

    // Body gradient (vivid, like the reference)
    const grad = ctx.createLinearGradient(0, 0, 0, SZ);
    grad.addColorStop(0.00, '#ffe9b8');   // hot peach rim at top
    grad.addColorStop(0.10, '#ffb0c8');   // peachy pink
    grad.addColorStop(0.30, '#ff6ea8');   // bright pink
    grad.addColorStop(0.50, '#ee3a8a');   // hot magenta
    grad.addColorStop(0.72, '#c12772');   // deep magenta
    grad.addColorStop(0.92, '#7a1b5c');
    grad.addColorStop(1.00, '#3a0a3a');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(SZ / 2, SZ / 2, SZ / 2 - 4, 0, Math.PI * 2);
    ctx.fill();

    // Horizontal stripes (cuts) — clean, increasing thickness downward,
    // starting around the middle of the disc
    ctx.globalCompositeOperation = 'destination-out';
    const stripes = [
      [0.500, 0.018],
      [0.555, 0.022],
      [0.615, 0.028],
      [0.685, 0.034],
      [0.762, 0.042],
      [0.848, 0.052],
      [0.945, 0.060],
    ];
    stripes.forEach(([y, h]) => ctx.fillRect(0, y * SZ, SZ, h * SZ));
    ctx.globalCompositeOperation = 'source-over';

    const tex = new THREE.CanvasTexture(c);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
  }

  // Outer glow texture — soft pink halo around the sun (no stripes)
  function makeSunGlowTexture() {
    const SZ = 512;
    const c = document.createElement('canvas');
    c.width = c.height = SZ;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(SZ/2, SZ/2, SZ * 0.18, SZ/2, SZ/2, SZ / 2);
    g.addColorStop(0.00, 'rgba(255,200,220,0.70)');
    g.addColorStop(0.30, 'rgba(255,120,180,0.45)');
    g.addColorStop(0.60, 'rgba(200,60,140,0.18)');
    g.addColorStop(1.00, 'rgba(120,30,100,0.00)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, SZ, SZ);
    const tex = new THREE.CanvasTexture(c);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
  }

  const sunTex = makeSunTexture();
  const sunGlowTex = makeSunGlowTexture();

  const sunMat = new THREE.MeshBasicMaterial({
    map: sunTex, transparent: true, depthWrite: false,
  });
  const sun = new THREE.Mesh(new THREE.PlaneGeometry(13, 13), sunMat);
  sun.position.set(0, 4.8, -50);
  scene.add(sun);

  // Soft halo behind the sun — separate glow texture so it doesn't multiply the stripes
  const glowMat = new THREE.MeshBasicMaterial({
    map: sunGlowTex, transparent: true, depthWrite: false,
    opacity: 0.85, blending: THREE.AdditiveBlending,
  });
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(26, 26), glowMat);
  glow.position.set(0, 4.8, -50.6);
  scene.add(glow);

  // Hot inner rim (additive, smaller) — boosts the bright top of the sun
  const innerGlowMat = new THREE.MeshBasicMaterial({
    map: sunGlowTex, transparent: true, depthWrite: false,
    opacity: 0.45, blending: THREE.AdditiveBlending,
  });
  const innerGlow = new THREE.Mesh(new THREE.PlaneGeometry(15, 15), innerGlowMat);
  innerGlow.position.set(0, 5.2, -49.8);
  scene.add(innerGlow);

  // ── 3. Horizon flare (thin glowing band) ────────────────
  function makeFlareTex() {
    const W = 1024, H = 64;
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const ctx = c.getContext('2d');
    for (let y = 0; y < H; y++) {
      const a = Math.max(0, 1 - Math.abs(y - H / 2) / (H / 2));
      const g = ctx.createLinearGradient(0, 0, W, 0);
      g.addColorStop(0,   'rgba(255,158,199,0)');
      g.addColorStop(0.35,'rgba(255,180,210,0.55)');
      g.addColorStop(0.50,'rgba(255,240,250,0.95)');
      g.addColorStop(0.65,'rgba(255,180,210,0.55)');
      g.addColorStop(1,   'rgba(255,158,199,0)');
      ctx.globalAlpha = a;
      ctx.fillStyle = g;
      ctx.fillRect(0, y, W, 1);
    }
    return new THREE.CanvasTexture(c);
  }
  const flareMat = new THREE.MeshBasicMaterial({
    map: makeFlareTex(), transparent: true, depthWrite: false,
    blending: THREE.AdditiveBlending, opacity: 0.65,
  });
  const flare = new THREE.Mesh(new THREE.PlaneGeometry(90, 2.4), flareMat);
  flare.position.set(0, 0.45, -42);
  scene.add(flare);

  // ── 4. Perspective grid floor (shader) ──────────────────
  const gridUniforms = {
    uTime:     { value: 0 },
    uColor:    { value: PAL.grid.clone() },
    uColorHot: { value: PAL.gridHot.clone() },
    uGround:   { value: new THREE.Color(0x0c0420) },
    uOpacity:  { value: 1.0 },
  };
  const gridGeo = new THREE.PlaneGeometry(200, 200, 1, 1);
  gridGeo.rotateX(-Math.PI / 2);
  const gridMat = new THREE.ShaderMaterial({
    uniforms: gridUniforms,
    transparent: true,
    depthWrite: false,
    extensions: { derivatives: true },
    vertexShader: `
      varying vec3 vPos;
      void main() {
        vPos = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      #ifdef GL_OES_standard_derivatives
      #extension GL_OES_standard_derivatives : enable
      #endif
      precision highp float;
      uniform float uTime;
      uniform vec3  uColor;
      uniform vec3  uColorHot;
      uniform vec3  uGround;
      uniform float uOpacity;
      varying vec3  vPos;

      float gridLine(float coord, float width) {
        float g = abs(fract(coord - 0.5) - 0.5) / max(fwidth(coord), 1e-5);
        return 1.0 - min(g / width, 1.0);
      }
      void main() {
        // Cell size = 2 world units; scroll in +z (toward camera)
        float zScroll = (vPos.z + uTime * 4.0) * 0.5;
        float xCoord  = vPos.x * 0.5;
        float gx = gridLine(xCoord, 1.0);
        float gz = gridLine(zScroll, 1.0);
        float g  = max(gx, gz);

        // Distance fades: kill near horizon, gentle near camera
        float d = length(vPos.xz);
        float fadeFar  = 1.0 - smoothstep(35.0, 75.0, d);
        float fadeNear = smoothstep(0.0, 4.0, d);
        float fade = fadeFar * fadeNear;

        // Tint hotter toward horizon
        vec3 lineCol = mix(uColor, uColorHot, smoothstep(8.0, 50.0, -vPos.z));

        // Composite: dark opaque ground + bright grid lines on top
        float groundA = fade * 0.92;
        float lineA   = g * fade;
        vec3 outCol = mix(uGround, lineCol, lineA);
        float outA  = max(groundA, lineA) * uOpacity;
        if (outA < 0.01) discard;
        gl_FragColor = vec4(outCol, outA);
      }
    `,
  });
  const gridMesh = new THREE.Mesh(gridGeo, gridMat);
  gridMesh.position.set(0, 0.0, -30);
  scene.add(gridMesh);

  // ── 5. Mountain clusters — real 3D conical peaks, framing the sides ─
  // Each cluster is a row of low-poly cones with jittered base rings
  // (gives jagged silhouette, not flat strips), solid dark fill + subtle
  // wireframe edges + sun-facing rim hint.
  function makeMountainCluster(seed, sideSign, layer) {
    function rand(i) {
      const s = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
      return s - Math.floor(s);
    }
    const group = new THREE.Group();
    const fillMats = [];
    const lineMats = [];

    const N = layer.count;
    for (let i = 0; i < N; i++) {
      const sides  = 4 + Math.floor(rand(i + 1) * 3);            // 4-6 sided pyramids
      const radius = layer.radius[0] + rand(i + 2) * (layer.radius[1] - layer.radius[0]);
      const height = layer.height[0] + rand(i + 3) * (layer.height[1] - layer.height[0]);

      const cone = new THREE.ConeGeometry(radius, height, sides, 1);
      // Jitter the base ring vertices to roughen the silhouette
      const pos = cone.attributes.position;
      for (let v = 0; v < pos.count; v++) {
        const py = pos.getY(v);
        if (py < 0) {
          const jr = 0.6 + rand(i * 11 + v) * 0.5;
          pos.setX(v, pos.getX(v) * jr);
          pos.setZ(v, pos.getZ(v) * jr);
          pos.setY(v, py + (rand(i * 17 + v) - 0.5) * 0.4);
        } else {
          // Apex jitter — slight asymmetry, but stays at peak height
          pos.setX(v, pos.getX(v) + (rand(i * 23) - 0.5) * radius * 0.25);
          pos.setZ(v, pos.getZ(v) + (rand(i * 29) - 0.5) * radius * 0.25);
        }
      }
      cone.computeVertexNormals();

      const fillMat = new THREE.MeshBasicMaterial({
        color: layer.fill, depthWrite: true,
      });
      const fill = new THREE.Mesh(cone, fillMat);

      // Position along the row, pushed out to the side, occasional overlap
      const t = (i / Math.max(1, N - 1)) - 0.5;
      fill.position.x = sideSign * (layer.baseX + Math.abs(t) * layer.spreadX) + (rand(i + 31) - 0.5) * 2.4;
      fill.position.y = height / 2 - 0.2;
      fill.position.z = layer.zBase + t * layer.spreadZ + (rand(i + 37) - 0.5) * 2.0;
      fill.rotation.y = rand(i + 41) * Math.PI * 2;
      group.add(fill);

      // Subtle wireframe edges (only on near/mid layers)
      if (layer.wire) {
        const edges = new THREE.EdgesGeometry(cone, 18);
        const lineMat = new THREE.LineBasicMaterial({
          color: PAL.mountain, transparent: true, opacity: layer.wireOpacity,
        });
        const lines = new THREE.LineSegments(edges, lineMat);
        lines.position.copy(fill.position);
        lines.rotation.copy(fill.rotation);
        group.add(lines);
        lineMats.push(lineMat);
      }

      // Sun-facing rim — a thin pink plane behind the mountain tilted toward sun.
      // We fake it with a slightly larger same-shape mesh in a warm color rendered
      // behind the fill; subtle, only on near layer.
      if (layer.rim) {
        const rimMat = new THREE.MeshBasicMaterial({
          color: 0x7a2b6e, transparent: true, opacity: 0.35, depthWrite: false,
        });
        const rim = new THREE.Mesh(cone.clone(), rimMat);
        rim.position.copy(fill.position);
        rim.position.x -= sideSign * 0.18;
        rim.position.z -= 0.05;
        rim.rotation.copy(fill.rotation);
        rim.scale.set(1.05, 1.02, 1.05);
        group.add(rim);
        fillMats.push(rimMat);
      }

      fillMats.push(fillMat);
    }
    return { group, fillMats, lineMats };
  }

  // Layer config. Near = big mountains framing the sides, close to camera.
  const NEAR_L = makeMountainCluster(2.7, -1, {
    count: 6, radius: [3.2, 5.0], height: [5.5, 9.0],
    baseX: 11, spreadX: 8, zBase: -14, spreadZ: 8,
    fill: PAL.mountainFill, wire: true, wireOpacity: 0.55, rim: true,
  });
  const NEAR_R = makeMountainCluster(7.3, 1, {
    count: 6, radius: [3.2, 5.0], height: [5.5, 9.0],
    baseX: 11, spreadX: 8, zBase: -14, spreadZ: 8,
    fill: PAL.mountainFill, wire: true, wireOpacity: 0.55, rim: true,
  });
  const MID_L = makeMountainCluster(11.1, -1, {
    count: 5, radius: [3.0, 4.6], height: [4.0, 6.5],
    baseX: 9, spreadX: 6, zBase: -28, spreadZ: 8,
    fill: new THREE.Color(0x100620), wire: true, wireOpacity: 0.35, rim: false,
  });
  const MID_R = makeMountainCluster(13.9, 1, {
    count: 5, radius: [3.0, 4.6], height: [4.0, 6.5],
    baseX: 9, spreadX: 6, zBase: -28, spreadZ: 8,
    fill: new THREE.Color(0x100620), wire: true, wireOpacity: 0.35, rim: false,
  });
  const FAR_L = makeMountainCluster(17.5, -1, {
    count: 4, radius: [2.6, 3.6], height: [2.5, 4.0],
    baseX: 7, spreadX: 5, zBase: -42, spreadZ: 6,
    fill: new THREE.Color(0x0a0418), wire: false, wireOpacity: 0, rim: false,
  });
  const FAR_R = makeMountainCluster(19.8, 1, {
    count: 4, radius: [2.6, 3.6], height: [2.5, 4.0],
    baseX: 7, spreadX: 5, zBase: -42, spreadZ: 6,
    fill: new THREE.Color(0x0a0418), wire: false, wireOpacity: 0, rim: false,
  });
  scene.add(NEAR_L.group); scene.add(NEAR_R.group);
  scene.add(MID_L.group);  scene.add(MID_R.group);
  scene.add(FAR_L.group);  scene.add(FAR_R.group);

  // Expose merged mat arrays for theme hook
  const ALL_MTN = [NEAR_L, NEAR_R, MID_L, MID_R, FAR_L, FAR_R];
  const mtnLineMats = ALL_MTN.flatMap(c => c.lineMats);
  const mtnFillMats = ALL_MTN.flatMap(c => c.fillMats);

  // ── 6. Stars ────────────────────────────────────────────
  const STARS = 240;
  const starPos = new Float32Array(STARS * 3);
  const starPhase = new Float32Array(STARS);
  for (let i = 0; i < STARS; i++) {
    starPos[i*3]   = (Math.random() - 0.5) * 130;
    starPos[i*3+1] = 4.5 + Math.random() * 24;
    starPos[i*3+2] = -30 - Math.random() * 45;
    starPhase[i]   = Math.random() * Math.PI * 2;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({
    color: PAL.star, size: 0.13, transparent: true, opacity: 0.85, sizeAttenuation: true,
  });
  const stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  // A few brighter "streaks" — small bigger points
  const BRIGHT = 18;
  const brightPos = new Float32Array(BRIGHT * 3);
  for (let i = 0; i < BRIGHT; i++) {
    brightPos[i*3]   = (Math.random() - 0.5) * 110;
    brightPos[i*3+1] = 7 + Math.random() * 18;
    brightPos[i*3+2] = -35 - Math.random() * 30;
  }
  const brightGeo = new THREE.BufferGeometry();
  brightGeo.setAttribute('position', new THREE.BufferAttribute(brightPos, 3));
  const brightMat = new THREE.PointsMaterial({
    color: 0xffffff, size: 0.28, transparent: true, opacity: 0.9, sizeAttenuation: true,
  });
  scene.add(new THREE.Points(brightGeo, brightMat));

  // ── Mouse parallax ──────────────────────────────────────
  let mx = 0, my = 0, tx = 0, ty = 0;
  window.addEventListener('mousemove', (e) => {
    mx = (e.clientX / window.innerWidth  - 0.5);
    my = (e.clientY / window.innerHeight - 0.5);
  });

  // ── Resize ──────────────────────────────────────────────
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ── Public hooks (preserve old API) ─────────────────────
  window.__updateBgAccent = function () { /* palette intentionally fixed for synthwave look */ };

  window.__updateBgTheme = function (theme) {
    if (theme === 'light') {
      // Pastel dawn — same composition, lighter sky & desaturated mountains
      const lRows = [
        new THREE.Color(0xe8d4ec),
        new THREE.Color(0xf0d5dc),
        new THREE.Color(0xf6c8c8),
        new THREE.Color(0xf9b5c4),
        new THREE.Color(0xc89eb6),
      ];
      const arr = sky.geometry.attributes.color.array;
      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 2; c++) {
          const idx = (r * 2 + c) * 3;
          arr[idx] = lRows[r].r; arr[idx+1] = lRows[r].g; arr[idx+2] = lRows[r].b;
        }
      }
      sky.geometry.attributes.color.needsUpdate = true;
      gridUniforms.uColor.value.set(0xc97aa8);
      gridUniforms.uColorHot.value.set(0xff5e96);
      gridUniforms.uGround.value.set(0xe7c6d8);
      gridUniforms.uOpacity.value = 0.75;
      mtnLineMats.forEach(m => m.color.set(0xa86fc0));
      mtnFillMats.forEach(m => m.color.set(0xd3a8c3));
      starMat.opacity = 0;
      brightMat.opacity = 0;
      flareMat.opacity = 0.45;
      canvas.style.opacity = '0.55';
    } else {
      const dRows = [
        PAL.skyTop,
        PAL.skyTop.clone().lerp(PAL.skyMid, 0.5),
        PAL.skyMid,
        PAL.skyHorizon,
        PAL.skyHorizon.clone().multiplyScalar(0.4),
      ];
      const arr = sky.geometry.attributes.color.array;
      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 2; c++) {
          const idx = (r * 2 + c) * 3;
          arr[idx] = dRows[r].r; arr[idx+1] = dRows[r].g; arr[idx+2] = dRows[r].b;
        }
      }
      sky.geometry.attributes.color.needsUpdate = true;
      gridUniforms.uColor.value.copy(PAL.grid);
      gridUniforms.uColorHot.value.copy(PAL.gridHot);
      gridUniforms.uGround.value.set(0x0c0420);
      gridUniforms.uOpacity.value = 1.0;
      mtnLineMats.forEach(m => m.color.copy(PAL.mountain));
      NEAR_L.fillMats.concat(NEAR_R.fillMats).forEach(m => m.color.copy(PAL.mountainFill));
      MID_L.fillMats.concat(MID_R.fillMats).forEach(m => m.color.set(0x100620));
      FAR_L.fillMats.concat(FAR_R.fillMats).forEach(m => m.color.set(0x0a0418));
      starMat.opacity = 0.85;
      brightMat.opacity = 0.9;
      flareMat.opacity = 0.65;
      canvas.style.opacity = '0.72';
    }
  };

  let speed = 1;
  window.__setBgSpeed = (s) => { speed = s; };

  // Initial theme sync (in case page already set data-theme)
  if (document.documentElement.getAttribute('data-theme') === 'light') {
    window.__updateBgTheme('light');
  }

  // ── Animate ─────────────────────────────────────────────
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime() * speed;
    gridUniforms.uTime.value = t;

    // Mouse parallax + very slow vertical bob
    tx += (mx * 1.4 - tx) * 0.035;
    ty += (-my * 0.7 - ty) * 0.035;
    const bob = Math.sin(t * 0.16) * 0.05;
    camera.position.x = tx;
    camera.position.y = 2.0 + ty + bob;
    camera.lookAt(tx * 0.35, 2.3 + ty * 0.4, 0);

    // Sun gently breathes
    const sy = 4.8 + Math.sin(t * 0.08) * 0.08;
    sun.position.y = sy;
    glow.position.y = sy;
    innerGlow.position.y = sy + 0.4;
    glow.material.opacity = 0.80 + Math.sin(t * 0.5) * 0.08;
    innerGlow.material.opacity = 0.42 + Math.sin(t * 0.7) * 0.06;

    // Star twinkle (size pulse)
    starMat.size = 0.12 + Math.sin(t * 0.6) * 0.018;

    // Horizon flare gentle pulse
    flareMat.opacity = (document.documentElement.getAttribute('data-theme') === 'light' ? 0.45 : 0.65)
                      + Math.sin(t * 0.4) * 0.05;

    renderer.render(scene, camera);
  }
  animate();
})();
