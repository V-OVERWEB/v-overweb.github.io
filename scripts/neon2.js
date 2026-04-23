// neon2.js — без import (использует глобальный THREE)
(function() {
    // Проверяем, загружен ли THREE
    if (typeof THREE === 'undefined') {
        console.error('THREE не загружен! Добавьте script для three.js перед neon2.js');
        return;
    }
    
    // Эмуляция импортов через глобальные объекты
    const EffectComposer = THREE.EffectComposer;
    const RenderPass = THREE.RenderPass;
    const UnrealBloomPass = THREE.UnrealBloomPass;
    
    // =========================================================================
    // КОНФИГУРАЦИЯ
    // =========================================================================
    const BLOOM_STRENGTH = 0.44; 
    
    const CONFIG = {
      RING: { COLOR: '#88ff44', EMISSIVE: '#11ff44', EMISSIVE_INTENSITY: 0.85, ROUGHNESS: 0.4, OPACITY: 0.95 },
      RING_DASHED: { COLOR: '#88ff44', EMISSIVE: '#11ff44', EMISSIVE_INTENSITY: 0.8, ROUGHNESS: 0.3, OPACITY: 0.9 },
      RING_SMALL: { COLOR: '#88ff44', EMISSIVE: '#11ff44', EMISSIVE_INTENSITY: 0.8, ROUGHNESS: 0.2, OPACITY: 0.95 },
      TEXT: { COLOR: '#888888', EMISSIVE: '#888888', EMISSIVE_INTENSITY: 0.2, ROUGHNESS: 0.1, OPACITY: 1 },
      SUBTEXT: { COLOR: '#ffffff', EMISSIVE: '#ffffff', EMISSIVE_INTENSITY: 0.0, ROUGHNESS: 0.3, OPACITY: 1 },
      SPARKLES: '#88ffbb',
      AMBIENT: '#113322',
      DIR_LIGHT: '#ccffdd'
    };
    
    function hexToColor(hex) { return new THREE.Color(hex); }
    
    // --- Сцена ---
    const container = document.getElementById('canvas-container');
    if (!container) {
      console.error('canvas-container не найден!');
      return;
    }
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030603);
    
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0.2, 0.4, 8.2);
    camera.lookAt(0, 0, 0);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.LinearToneMapping;
    renderer.toneMappingExposure = 1.0;
    container.appendChild(renderer.domElement);
    
    // --- Bloom (если есть эффекты) ---
    let composer, bloomPass, secondBloomPass;
    
    if (EffectComposer && RenderPass && UnrealBloomPass) {
        composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));
        
        bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
        bloomPass.threshold = 0.2;
        bloomPass.strength = BLOOM_STRENGTH;
        bloomPass.radius = 0.72;
        composer.addPass(bloomPass);
        
        secondBloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.38, 0.5, 1.2);
        secondBloomPass.threshold = 0.15;
        secondBloomPass.strength = 0.32;
        secondBloomPass.radius = 1.4;
        composer.addPass(secondBloomPass);
    } else {
        console.warn('EffectComposer не загружен, работаем без блума');
        composer = { render: function() { renderer.render(scene, camera); } };
    }
    
    // --- Освещение ---
    scene.add(new THREE.AmbientLight(hexToColor(CONFIG.AMBIENT), 0.7));
    const dirLight = new THREE.DirectionalLight(hexToColor(CONFIG.DIR_LIGHT), 0.9);
    dirLight.position.set(2, 4, 5);
    scene.add(dirLight);
    const fillLight = new THREE.PointLight(0x88ffbb, 0.5);
    fillLight.position.set(-3, 1, 4);
    scene.add(fillLight);
    const bottomLight = new THREE.PointLight(0x22dd88, 0.6);
    bottomLight.position.set(0, -3, 2);
    scene.add(bottomLight);
    
    // --- Кольца ---
    const ringGeo = new THREE.TorusGeometry(3.6, 0.14, 64, 128);
    const ringMat = new THREE.MeshStandardMaterial({
      color: hexToColor(CONFIG.RING.COLOR),
      emissive: hexToColor(CONFIG.RING.EMISSIVE),
      emissiveIntensity: CONFIG.RING.EMISSIVE_INTENSITY,
      roughness: CONFIG.RING.ROUGHNESS,
      transparent: true,
      opacity: CONFIG.RING.OPACITY
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.z = -0.1;
    scene.add(ring);
    
    const ringDashedGeo = new THREE.TorusGeometry(3.0, 0.07, 48, 96);
    const ringDashedMat = new THREE.MeshStandardMaterial({
      color: hexToColor(CONFIG.RING_DASHED.COLOR),
      emissive: hexToColor(CONFIG.RING_DASHED.EMISSIVE),
      emissiveIntensity: CONFIG.RING_DASHED.EMISSIVE_INTENSITY,
      roughness: CONFIG.RING_DASHED.ROUGHNESS,
      transparent: true,
      opacity: CONFIG.RING_DASHED.OPACITY
    });
    const ringDashed = new THREE.Mesh(ringDashedGeo, ringDashedMat);
    ringDashed.position.z = 0.1;
    scene.add(ringDashed);
    
    const ringSmallGeo = new THREE.TorusGeometry(2.45, 0.05, 32, 64);
    const ringSmallMat = new THREE.MeshStandardMaterial({
      color: hexToColor(CONFIG.RING_SMALL.COLOR),
      emissive: hexToColor(CONFIG.RING_SMALL.EMISSIVE),
      emissiveIntensity: CONFIG.RING_SMALL.EMISSIVE_INTENSITY,
      roughness: CONFIG.RING_SMALL.ROUGHNESS,
      transparent: true,
      opacity: CONFIG.RING_SMALL.OPACITY
    });
    const ringSmall = new THREE.Mesh(ringSmallGeo, ringSmallMat);
    ringSmall.position.z = 0.25;
    scene.add(ringSmall);
    
    // --- Частицы ---
    const sparklesGeo = new THREE.BufferGeometry();
    const count = 380;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = 3.7;
      pos[i*3] = Math.cos(angle) * r;
      pos[i*3+1] = Math.sin(angle) * r;
      pos[i*3+2] = -0.5 + (Math.sin(angle * 3) * 0.2);
    }
    sparklesGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const sparklesMat = new THREE.PointsMaterial({
      color: hexToColor(CONFIG.SPARKLES),
      size: 0.055,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const sparkles = new THREE.Points(sparklesGeo, sparklesMat);
    scene.add(sparkles);
    
    // --- Текст ---
    let textMesh, subTextMesh;
    const loader = new THREE.FontLoader();
    
    loader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', (font) => {
      const textGeo = new THREE.TextGeometry('OVERWEB', {
        font: font,
        size: 1.05,
        height: 0.55,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.07,
        bevelSize: 0.05,
        bevelOffset: 0,
        bevelSegments: 8,
      });
      textGeo.center();
      const textMat = new THREE.MeshStandardMaterial({
        color: hexToColor(CONFIG.TEXT.COLOR),
        emissive: hexToColor(CONFIG.TEXT.EMISSIVE),
        emissiveIntensity: CONFIG.TEXT.EMISSIVE_INTENSITY,
        roughness: CONFIG.TEXT.ROUGHNESS,
        transparent: true,
        opacity: CONFIG.TEXT.OPACITY
      });
      textMesh = new THREE.Mesh(textGeo, textMat);
      textMesh.position.z = 0.65;
      textMesh.position.y = 0.1;
      scene.add(textMesh);
      
      const subGeo = new THREE.TextGeometry('Frontend Developer', {
        font: font,
        size: 0.32,
        height: 0.12,
        curveSegments: 8,
        bevelEnabled: true,
        bevelThickness: 0.04,
        bevelSize: 0.02,
        bevelSegments: 5
      });
      subGeo.center();
      const subMat = new THREE.MeshStandardMaterial({
        color: hexToColor(CONFIG.SUBTEXT.COLOR),
        emissive: hexToColor(CONFIG.SUBTEXT.EMISSIVE),
        emissiveIntensity: CONFIG.SUBTEXT.EMISSIVE_INTENSITY,
        roughness: CONFIG.SUBTEXT.ROUGHNESS,
        transparent: true,
        opacity: CONFIG.SUBTEXT.OPACITY
      });
      subTextMesh = new THREE.Mesh(subGeo, subMat);
      subTextMesh.position.y = -1.6;
      subTextMesh.position.z = 0.55;
      scene.add(subTextMesh);
    });
    
    // =========================================================================
    // АНИМАЦИИ с CSS-прозрачностью канваса
    // =========================================================================
    
    const originalRingIntensity = CONFIG.RING.EMISSIVE_INTENSITY;
    const originalRingDashedIntensity = CONFIG.RING_DASHED.EMISSIVE_INTENSITY;
    const originalRingSmallIntensity = CONFIG.RING_SMALL.EMISSIVE_INTENSITY;
    const originalTextIntensity = CONFIG.TEXT.EMISSIVE_INTENSITY;
    
    let currentRingGlow = originalRingIntensity;
    let currentRingDashedGlow = originalRingDashedIntensity;
    let currentRingSmallGlow = originalRingSmallIntensity;
    let currentTextGlow = originalTextIntensity;
    let currentBloomStrength = BLOOM_STRENGTH;
    let currentSecondBloomStrength = 0.32;
    
    let voltageDropActive = false;
    let lastVoltageDrop = 0;
    
    function applyVoltageDrop() {
      if (voltageDropActive) return;
      voltageDropActive = true;
      
      const blinkCount = 3 + Math.floor(Math.random() * 5);
      let currentBlink = 0;
      
      function doBlink() {
        if (currentBlink >= blinkCount) {
          container.style.opacity = '1';
          voltageDropActive = false;
          return;
        }
        
        container.style.opacity = '0.05';
        const offDuration = 50 + Math.random() * 50;
        
        setTimeout(() => {
          const weakFactor = 0.2 + Math.random() * 0.3;
          container.style.opacity = weakFactor;
          
          const onDuration = 70 + Math.random() * 70;
          setTimeout(() => {
            currentBlink++;
            doBlink();
          }, onDuration);
        }, offDuration);
      }
      
      doBlink();
    }
    
    function smoothFlicker() {
      const t = performance.now() / 1000;
      
      const warmWave = Math.sin(t * 0.7) * 0.08;
      const gentlePulse = Math.sin(t * 2.1) * 0.04;
      const microVariation = Math.sin(t * 5.3) * 0.02 + Math.cos(t * 3.8) * 0.02;
      
      let flickerFactor = 0.92 + warmWave + gentlePulse + microVariation;
      flickerFactor = Math.min(1.12, Math.max(0.85, flickerFactor));
      
      const ringFactor = flickerFactor * (0.97 + Math.sin(t * 2.9) * 0.03);
      const ringDashedFactor = flickerFactor * (0.98 + Math.cos(t * 2.4) * 0.025);
      const ringSmallFactor = flickerFactor * (0.99 + Math.sin(t * 3.2) * 0.02);
      const textFactor = flickerFactor * (0.94 + Math.sin(t * 1.8) * 0.05);
      
      currentRingGlow = originalRingIntensity * ringFactor;
      currentRingDashedGlow = originalRingDashedIntensity * ringDashedFactor;
      currentRingSmallGlow = originalRingSmallIntensity * ringSmallFactor;
      currentTextGlow = originalTextIntensity * textFactor;
      
      if (ring.material && !voltageDropActive) ring.material.emissiveIntensity = currentRingGlow;
      if (ringDashed.material && !voltageDropActive) ringDashed.material.emissiveIntensity = currentRingDashedGlow;
      if (ringSmall.material && !voltageDropActive) ringSmall.material.emissiveIntensity = currentRingSmallGlow;
      if (textMesh && textMesh.material && !voltageDropActive) textMesh.material.emissiveIntensity = currentTextGlow;
      
      if (sparklesMat) {
        const sparkleBreath = 0.8 + Math.sin(t * 3.4) * 0.1;
        sparklesMat.color.setHSL(0.33, 1.0, 0.55 * (0.75 + sparkleBreath * 0.25));
        sparklesMat.size = 0.055 * (0.85 + Math.sin(t * 4.2) * 0.07);
      }
      
      if (bloomPass) {
        const bloomBreath = 0.92 + Math.sin(t * 0.9) * 0.05;
        currentBloomStrength = Math.min(0.55, Math.max(0.38, BLOOM_STRENGTH * bloomBreath));
        if (!voltageDropActive) bloomPass.strength = currentBloomStrength;
      }
      
      if (secondBloomPass) {
        const secondBloomBreath = 0.9 + Math.sin(t * 0.6) * 0.06;
        currentSecondBloomStrength = Math.min(0.44, Math.max(0.26, 0.32 * secondBloomBreath));
        if (!voltageDropActive) secondBloomPass.strength = currentSecondBloomStrength;
      }
    }
    
    function scheduleVoltageDrop(now) {
      const gap = 7000 + Math.random() * 8000;
      if (!voltageDropActive && (now - lastVoltageDrop) > gap) {
        lastVoltageDrop = now;
        applyVoltageDrop();
      }
    }
    
    const blinkBtn = document.getElementById('blink3dBtn');
    if (blinkBtn) {
      blinkBtn.addEventListener('click', () => {
        if (!textMesh || voltageDropActive) return;
        
        if (ring.material) ring.material.emissiveIntensity = Math.min(1.2, currentRingGlow * 1.35);
        if (ringDashed.material) ringDashed.material.emissiveIntensity = Math.min(1.15, currentRingDashedGlow * 1.3);
        if (ringSmall.material) ringSmall.material.emissiveIntensity = Math.min(1.18, currentRingSmallGlow * 1.32);
        if (textMesh.material) textMesh.material.emissiveIntensity = Math.min(0.55, currentTextGlow * 1.4);
        if (bloomPass) bloomPass.strength = Math.min(0.72, currentBloomStrength * 1.35);
        if (secondBloomPass) secondBloomPass.strength = Math.min(0.5, currentSecondBloomStrength * 1.3);
        
        setTimeout(() => {
          if (ring.material && !voltageDropActive) ring.material.emissiveIntensity = currentRingGlow;
          if (ringDashed.material && !voltageDropActive) ringDashed.material.emissiveIntensity = currentRingDashedGlow;
          if (ringSmall.material && !voltageDropActive) ringSmall.material.emissiveIntensity = currentRingSmallGlow;
          if (textMesh?.material && !voltageDropActive) textMesh.material.emissiveIntensity = currentTextGlow;
          if (!voltageDropActive && bloomPass) bloomPass.strength = currentBloomStrength;
          if (!voltageDropActive && secondBloomPass) secondBloomPass.strength = currentSecondBloomStrength;
        }, 130);
      });
    }
    
    window.addEventListener('scroll', () => {
      const progress = Math.min(window.scrollY / window.innerHeight, 1.0);
      camera.position.set(0.2, 0.4 - progress * 4.5, 8.2 + progress * 1.5);
    });
    
    let lastTimestamp = 0;
    function animateLighting() {
      const now = performance.now();
      lastTimestamp = now;
      
      smoothFlicker();
      scheduleVoltageDrop(now);
      
      requestAnimationFrame(animateLighting);
    }
    animateLighting();
    
    function render() {
      requestAnimationFrame(render);
      if (composer && composer.render) {
        composer.render();
      } else {
        renderer.render(scene, camera);
      }
    }
    render();
    
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      if (composer && composer.setSize) composer.setSize(window.innerWidth, window.innerHeight);
    });
    
    renderer.domElement.style.pointerEvents = 'none';
    console.log('3D Неон запущен!');
})();