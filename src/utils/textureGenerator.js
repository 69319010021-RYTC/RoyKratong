import * as THREE from 'three';

// Cache generated textures to avoid redundant canvas rendering
const textureCache = new Map();

/**
 * Creates a procedural banana leaf texture with fine parallel veins and rich green gradients
 */
export function getBananaLeafTexture() {
  if (textureCache.has('bananaLeaf')) return textureCache.get('bananaLeaf');

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Base green gradient
  const grad = ctx.createLinearGradient(0, 0, 512, 0);
  grad.addColorStop(0, '#1d5e20');
  grad.addColorStop(0.48, '#2e7d32');
  grad.addColorStop(0.5, '#43a047'); // Midrib
  grad.addColorStop(0.52, '#2e7d32');
  grad.addColorStop(1, '#1b5e20');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Delicate lateral veins
  ctx.strokeStyle = 'rgba(100, 200, 100, 0.22)';
  ctx.lineWidth = 1.2;
  for (let y = 0; y < 512; y += 4) {
    ctx.beginPath();
    ctx.moveTo(256, y);
    ctx.lineTo(0, y + 25 + (Math.sin(y * 0.1) * 3));
    ctx.moveTo(256, y);
    ctx.lineTo(512, y + 25 + (Math.sin(y * 0.1) * 3));
    ctx.stroke();
  }

  // Central midrib highlight
  ctx.strokeStyle = '#66bb6a';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(256, 0);
  ctx.lineTo(256, 512);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  textureCache.set('bananaLeaf', texture);
  return texture;
}

/**
 * Creates a delicate lotus petal texture with soft pink tips fading to silky white
 */
export function getLotusPetalTexture() {
  if (textureCache.has('lotusPetal')) return textureCache.get('lotusPetal');

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Vertical gradient: white base to vibrant lotus pink at top
  const grad = ctx.createLinearGradient(0, 512, 0, 0);
  grad.addColorStop(0, '#f9f9f9');
  grad.addColorStop(0.45, '#fce4ec');
  grad.addColorStop(0.75, '#f06292');
  grad.addColorStop(1, '#d81b60');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 512);

  // Soft longitudinal petal streaks
  ctx.strokeStyle = 'rgba(233, 30, 99, 0.18)';
  ctx.lineWidth = 1;
  for (let x = 10; x < 246; x += 6) {
    ctx.beginPath();
    ctx.moveTo(x, 512);
    ctx.quadraticCurveTo(128, 200, x, 0);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set('lotusPetal', texture);
  return texture;
}

/**
 * Creates a coconut shell fibrous texture with rich brown tones
 */
export function getCoconutShellTexture() {
  if (textureCache.has('coconutShell')) return textureCache.get('coconutShell');

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Dark polished coconut wood base
  ctx.fillStyle = '#3e2723';
  ctx.fillRect(0, 0, 512, 512);

  // Fibrous streaks
  ctx.strokeStyle = 'rgba(93, 64, 55, 0.4)';
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const len = 15 + Math.random() * 40;
    ctx.lineWidth = 0.8 + Math.random() * 1.5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (Math.random() - 0.5) * 6, y + len);
    ctx.stroke();
  }

  // Soft surface flecks
  ctx.fillStyle = 'rgba(141, 110, 99, 0.25)';
  for (let i = 0; i < 600; i++) {
    const px = Math.random() * 512;
    const py = Math.random() * 512;
    ctx.fillRect(px, py, 2, 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set('coconutShell', texture);
  return texture;
}

/**
 * Creates a weathered teak wood plank texture for the pier
 */
export function getWoodPlankTexture() {
  if (textureCache.has('woodPlank')) return textureCache.get('woodPlank');

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#4e342e';
  ctx.fillRect(0, 0, 512, 512);

  // Wood grain bands
  for (let y = 0; y < 512; y += 8) {
    const lightness = 35 + Math.sin(y * 0.05) * 8;
    ctx.fillStyle = `hsl(25, 30%, ${lightness}%)`;
    ctx.fillRect(0, y, 512, 8);
  }

  // Fine dark grain lines
  ctx.strokeStyle = 'rgba(38, 24, 21, 0.6)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 70; i++) {
    const y = Math.random() * 512;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(170, y + 5, 340, y - 5, 512, y + 2);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 6);
  textureCache.set('woodPlank', texture);
  return texture;
}

/**
 * Creates a soft radial glow particle texture (for sparks, flame glow, smoke)
 */
export function getGlowParticleTexture() {
  if (textureCache.has('glowParticle')) return textureCache.get('glowParticle');

  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.2, 'rgba(255, 240, 200, 0.85)');
  grad.addColorStop(0.6, 'rgba(255, 180, 50, 0.35)');
  grad.addColorStop(1, 'rgba(255, 120, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set('glowParticle', texture);
  return texture;
}

/**
 * Creates a procedural full moon texture with soft crater maria
 */
export function getMoonTexture() {
  if (textureCache.has('moon')) return textureCache.get('moon');

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Moon base soft silver/cream
  ctx.fillStyle = '#fff9e6';
  ctx.fillRect(0, 0, 512, 512);

  // Lunar seas (Maria)
  ctx.fillStyle = 'rgba(180, 175, 160, 0.35)';
  const maria = [
    [180, 160, 90], [320, 190, 80], [240, 280, 100],
    [340, 310, 65], [160, 330, 75], [260, 130, 60]
  ];
  for (const [x, y, r] of maria) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set('moon', texture);
  return texture;
}
