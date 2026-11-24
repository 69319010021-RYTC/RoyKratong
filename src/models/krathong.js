import * as THREE from 'three';
import {
  getBananaLeafTexture,
  getLotusPetalTexture,
  getCoconutShellTexture,
  getGlowParticleTexture
} from '../utils/textureGenerator.js';

let krathongIdCounter = 1;

/**
 * Creates the candle and 3 incense sticks assembly (shared across all krathong types)
 */
function createCandleAndIncense() {
  const group = new THREE.Group();

  // 1. Center Candle (Wax cylinder)
  const candleGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.7, 16);
  const candleMat = new THREE.MeshStandardMaterial({
    color: 0xffe082,
    roughness: 0.35,
    metalness: 0.1
  });
  const candle = new THREE.Mesh(candleGeo, candleMat);
  candle.position.set(0, 0.35, 0);
  candle.castShadow = true;
  group.add(candle);

  // Candle wick
  const wickGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.15, 8);
  const wickMat = new THREE.MeshBasicMaterial({ color: 0x212121 });
  const wick = new THREE.Mesh(wickGeo, wickMat);
  wick.position.set(0, 0.75, 0);
  group.add(wick);

  // Flickering Candle Flame (Teardrop shape)
  const flameGeo = new THREE.ConeGeometry(0.09, 0.35, 12);
  const flameMat = new THREE.MeshStandardMaterial({
    color: 0xffaa00,
    emissive: 0xff7700,
    emissiveIntensity: 3.2,
    roughness: 0.2
  });
  const flame = new THREE.Mesh(flameGeo, flameMat);
  flame.position.set(0, 0.92, 0);
  group.add(flame);

  // Inner bright core
  const coreGeo = new THREE.ConeGeometry(0.045, 0.2, 8);
  const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const core = new THREE.Mesh(coreGeo, coreMat);
  core.position.set(0, 0.86, 0);
  group.add(core);

  // Soft PointLight for flame glow (optimized distance & decay)
  const flameLight = new THREE.PointLight(0xff9911, 1.2, 4.5, 2.0);
  flameLight.position.set(0, 0.95, 0);
  group.add(flameLight);

  // 2. Three Incense Sticks (ธูป 3 ดอก)
  const incenseMat = new THREE.MeshStandardMaterial({ color: 0x8d6e63, roughness: 0.9 });
  const redTipMat = new THREE.MeshBasicMaterial({ color: 0xff1744 }); // burning ember

  for (let i = 0; i < 3; i++) {
    const angle = (i * Math.PI * 2) / 3;
    const stickGroup = new THREE.Group();
    stickGroup.position.set(Math.cos(angle) * 0.12, 0.45, Math.sin(angle) * 0.12);
    // Slight tilt outwards
    stickGroup.rotation.x = (Math.random() - 0.5) * 0.18;
    stickGroup.rotation.z = (Math.random() - 0.5) * 0.18;

    const stickGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.9, 6);
    const stick = new THREE.Mesh(stickGeo, incenseMat);
    stickGroup.add(stick);

    // Red glowing tip
    const tipGeo = new THREE.SphereGeometry(0.02, 6, 6);
    const tip = new THREE.Mesh(tipGeo, redTipMat);
    tip.position.y = 0.45;
    stickGroup.add(tip);

    group.add(stickGroup);
  }

  // 3. Smoke Particle System for incense
  const particleCount = 20;
  const smokeGeo = new THREE.BufferGeometry();
  const smokePositions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    smokePositions[i * 3] = (Math.random() - 0.5) * 0.08;
    smokePositions[i * 3 + 1] = 0.85 + Math.random() * 1.5;
    smokePositions[i * 3 + 2] = (Math.random() - 0.5) * 0.08;
  }
  smokeGeo.setAttribute('position', new THREE.BufferAttribute(smokePositions, 3));

  const smokeMat = new THREE.PointsMaterial({
    map: getGlowParticleTexture(),
    color: 0xcccccc,
    size: 0.28,
    transparent: true,
    opacity: 0.25,
    depthWrite: false,
    blending: THREE.NormalBlending
  });
  const smokeParticles = new THREE.Points(smokeGeo, smokeMat);
  group.add(smokeParticles);

  return { group, flame, flameLight, smokeParticles };
}

/**
 * Creates folded banana leaf petal
 */
function createBananaFoldPetal(bananaLeafTex) {
  const geom = new THREE.ConeGeometry(0.22, 0.55, 4);
  geom.scale(1, 1, 0.35); // flatten to petal blade shape
  const mat = new THREE.MeshStandardMaterial({
    map: bananaLeafTex,
    color: 0x388e3c,
    roughness: 0.6,
    metalness: 0.1,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geom, mat);
  mesh.castShadow = true;
  return mesh;
}

/**
 * Creates bright marigold flower mesh (ดอกดาวเรือง)
 */
function createMarigoldFlower() {
  const flower = new THREE.Group();
  const petalMat = new THREE.MeshStandardMaterial({
    color: 0xffb300,
    roughness: 0.8,
    metalness: 0.05
  });

  // Layered clustered spherical domes to simulate ruffly marigold
  for (let i = 0; i < 5; i++) {
    const domeGeo = new THREE.DodecahedronGeometry(0.12 - i * 0.015, 1);
    const dome = new THREE.Mesh(domeGeo, petalMat);
    dome.position.y = i * 0.04;
    dome.scale.set(1.1, 0.7, 1.1);
    dome.rotation.y = i * 0.8;
    flower.add(dome);
  }
  return flower;
}

/**
 * TYPE 1: Traditional Banana Leaf Krathong (กระทงใบตองดั้งเดิม)
 */
export function createTraditionalKrathong(data = {}) {
  const root = new THREE.Group();
  const leafTex = getBananaLeafTexture();

  // 1. Banana trunk base disk
  const baseGeo = new THREE.CylinderGeometry(1.05, 1.15, 0.45, 32);
  const baseMat = new THREE.MeshStandardMaterial({
    map: leafTex,
    color: 0x2e7d32,
    roughness: 0.7
  });
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.position.y = 0.22;
  root.add(base);

  // 2. Folded Banana Leaf Petals (2 concentric tiers)
  const outerPetalCount = 18;
  for (let i = 0; i < outerPetalCount; i++) {
    const angle = (i * Math.PI * 2) / outerPetalCount;
    const petal = createBananaFoldPetal(leafTex);
    petal.position.set(Math.cos(angle) * 1.15, 0.42, Math.sin(angle) * 1.15);
    petal.rotation.y = -angle + Math.PI / 2;
    petal.rotation.x = 0.45; // angle outwards
    root.add(petal);
  }

  const innerPetalCount = 14;
  for (let i = 0; i < innerPetalCount; i++) {
    const angle = (i * Math.PI * 2) / innerPetalCount + 0.15;
    const petal = createBananaFoldPetal(leafTex);
    petal.scale.set(0.85, 0.85, 0.85);
    petal.position.set(Math.cos(angle) * 0.88, 0.48, Math.sin(angle) * 0.88);
    petal.rotation.y = -angle + Math.PI / 2;
    petal.rotation.x = 0.28;
    root.add(petal);
  }

  // 3. Ring of bright golden Marigold flowers (ดอกดาวเรือง)
  const flowerCount = 9;
  for (let i = 0; i < flowerCount; i++) {
    const angle = (i * Math.PI * 2) / flowerCount;
    const marigold = createMarigoldFlower();
    marigold.position.set(Math.cos(angle) * 0.58, 0.46, Math.sin(angle) * 0.58);
    root.add(marigold);
  }

  // 4. Center Candle and Incense Sticks
  const candleData = createCandleAndIncense();
  root.add(candleData.group);

  // Setup metadata
  setupKrathongUserData(root, 'traditional', 'กระทงใบตองดั้งเดิม', data, candleData);
  return root;
}

/**
 * TYPE 2: Lotus Flower Krathong (กระทงดอกบัวสวรรค์)
 */
export function createLotusKrathong(data = {}) {
  const root = new THREE.Group();
  const petalTex = getLotusPetalTexture();

  // 1. Lotus sepal green base
  const baseGeo = new THREE.CylinderGeometry(0.7, 0.9, 0.35, 24);
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x43a047, roughness: 0.6 });
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.position.y = 0.18;
  root.add(base);

  // Helper to create smooth curved lotus petal
  function createLotusPetal(scale = 1.0) {
    const geom = new THREE.ConeGeometry(0.35 * scale, 0.9 * scale, 12, 1, true);
    geom.scale(1, 1, 0.35); // flatten to petal curvature
    const mat = new THREE.MeshStandardMaterial({
      map: petalTex,
      color: 0xffffff,
      roughness: 0.35,
      metalness: 0.05,
      side: THREE.DoubleSide
    });
    return new THREE.Mesh(geom, mat);
  }

  // Outer Lotus Petals (wide open)
  const outerCount = 14;
  for (let i = 0; i < outerCount; i++) {
    const angle = (i * Math.PI * 2) / outerCount;
    const petal = createLotusPetal(1.15);
    petal.position.set(Math.cos(angle) * 0.95, 0.42, Math.sin(angle) * 0.95);
    petal.rotation.y = -angle + Math.PI / 2;
    petal.rotation.x = 0.55;
    root.add(petal);
  }

  // Middle Lotus Petals
  const midCount = 10;
  for (let i = 0; i < midCount; i++) {
    const angle = (i * Math.PI * 2) / midCount + 0.25;
    const petal = createLotusPetal(0.95);
    petal.position.set(Math.cos(angle) * 0.65, 0.48, Math.sin(angle) * 0.65);
    petal.rotation.y = -angle + Math.PI / 2;
    petal.rotation.x = 0.35;
    root.add(petal);
  }

  // Golden Central Pod
  const podGeo = new THREE.CylinderGeometry(0.35, 0.25, 0.18, 16);
  const podMat = new THREE.MeshStandardMaterial({ color: 0xffd54f, roughness: 0.5 });
  const pod = new THREE.Mesh(podGeo, podMat);
  pod.position.y = 0.38;
  root.add(pod);

  // Candle and incense
  const candleData = createCandleAndIncense();
  root.add(candleData.group);

  setupKrathongUserData(root, 'lotus', 'กระทงดอกบัวสวรรค์', data, candleData);
  return root;
}

/**
 * TYPE 3: Coconut Shell Krathong (กระทงกะลามะพร้าว)
 */
export function createCoconutKrathong(data = {}) {
  const root = new THREE.Group();
  const shellTex = getCoconutShellTexture();

  // 1. Carved Coconut Shell (Hemisphere)
  const shellGeo = new THREE.SphereGeometry(1.0, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
  const shellMat = new THREE.MeshStandardMaterial({
    map: shellTex,
    color: 0x4e342e,
    roughness: 0.55,
    metalness: 0.1,
    side: THREE.DoubleSide
  });
  const shell = new THREE.Mesh(shellGeo, shellMat);
  shell.rotation.x = Math.PI; // bowl opening facing up
  shell.position.y = 0.48;
  root.add(shell);

  // 2. Melted candle wax inside the shell
  const waxGeo = new THREE.CylinderGeometry(0.92, 0.92, 0.15, 24);
  const waxMat = new THREE.MeshStandardMaterial({
    color: 0xfff59d,
    roughness: 0.25,
    metalness: 0.05
  });
  const wax = new THREE.Mesh(waxGeo, waxMat);
  wax.position.y = 0.4;
  root.add(wax);

  // 3. Floating loose colorful petals on the wax surface
  const petalColors = [0xff80ab, 0xffd54f, 0xe040fb, 0xff5252, 0xffffff];
  for (let i = 0; i < 18; i++) {
    const angle = (i * Math.PI * 2) / 18 + Math.random() * 0.2;
    const r = 0.45 + Math.random() * 0.35;
    const petalGeo = new THREE.CircleGeometry(0.08, 6);
    const color = petalColors[i % petalColors.length];
    const petalMat = new THREE.MeshStandardMaterial({ color, side: THREE.DoubleSide, roughness: 0.6 });
    const petal = new THREE.Mesh(petalGeo, petalMat);
    petal.position.set(Math.cos(angle) * r, 0.48, Math.sin(angle) * r);
    petal.rotation.x = -Math.PI / 2 + (Math.random() - 0.5) * 0.2;
    petal.rotation.z = Math.random() * Math.PI;
    root.add(petal);
  }

  // Candle and incense
  const candleData = createCandleAndIncense();
  root.add(candleData.group);

  setupKrathongUserData(root, 'coconut', 'กระทงกะลามะพร้าว', data, candleData);
  return root;
}

/**
 * Attaches metadata, physics handles, and raycasting bounds to the krathong
 */
function setupKrathongUserData(root, type, typeNameTh, data, candleData) {
  root.userData = {
    id: krathongIdCounter++,
    isKrathong: true,
    type: type,
    typeName: typeNameTh,
    author: data.author || 'ผู้ร่วมงานประเพณี',
    wish: data.wish || 'ขอขมาพระแม่คงคา และขอให้มีแต่ความสุขความเจริญ',
    timeCreated: Date.now(),
    floating: true,
    speed: data.speed || (0.45 + Math.random() * 0.3),
    rotSpeed: (Math.random() - 0.5) * 0.12,
    flameMesh: candleData.flame,
    flameLight: candleData.flameLight,
    smokeParticles: candleData.smokeParticles
  };

  // Add an invisible bounding hit-sphere for reliable raycaster click & hover
  const hitGeo = new THREE.SphereGeometry(1.3, 12, 12);
  const hitMat = new THREE.MeshBasicMaterial({ visible: false });
  const hitMesh = new THREE.Mesh(hitGeo, hitMat);
  hitMesh.position.y = 0.5;
  hitMesh.userData = { parentKrathong: root };
  root.add(hitMesh);
}

/**
 * Factory function to create krathong by style key
 */
export function createKrathong(style, data = {}) {
  switch (style) {
    case 'lotus':
      return createLotusKrathong(data);
    case 'coconut':
      return createCoconutKrathong(data);
    case 'traditional':
    default:
      return createTraditionalKrathong(data);
  }
}
