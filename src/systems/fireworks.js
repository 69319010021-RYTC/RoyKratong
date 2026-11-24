import * as THREE from 'three';
import { getGlowParticleTexture } from '../utils/textureGenerator.js';

export class FireworksSystem {
  constructor(scene) {
    this.scene = scene;
    this.activeFireworks = [];
    this.autoTimer = 0;
    this.nextAutoInterval = 7.0; // first auto firework after 7 seconds
    this.particleTex = getGlowParticleTexture();

    this.palette = [
      0xffd700, // Gold
      0xff1744, // Ruby Red
      0x00e676, // Emerald Green
      0x00e5ff, // Cyan
      0xff4081, // Lotus Pink
      0xff9100  // Warm Orange
    ];
  }

  launch(targetX = null, targetZ = null) {
    // Starting position across the river or behind pagoda
    const startX = targetX !== null ? targetX : -35 + (Math.random() - 0.5) * 50;
    const startZ = targetZ !== null ? targetZ : -35 - Math.random() * 40;
    const peakY = 32 + Math.random() * 22;

    const color = this.palette[Math.floor(Math.random() * this.palette.length)];

    // Rocket trail mesh
    const rocketGeo = new THREE.SphereGeometry(0.25, 8, 8);
    const rocketMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const rocket = new THREE.Mesh(rocketGeo, rocketMat);
    rocket.position.set(startX, 0.5, startZ);
    this.scene.add(rocket);

    // Rocket light
    const rocketLight = new THREE.PointLight(color, 1.5, 12);
    rocketLight.position.copy(rocket.position);
    this.scene.add(rocketLight);

    const firework = {
      state: 'ascending',
      rocket,
      rocketLight,
      color,
      x: startX,
      y: 0.5,
      z: startZ,
      vy: 24 + Math.random() * 8, // upward velocity
      peakY,
      particles: null,
      flashLight: null,
      age: 0
    };

    this.activeFireworks.push(firework);
  }

  explode(fw) {
    fw.state = 'exploding';

    // Remove ascending rocket
    this.scene.remove(fw.rocket);
    this.scene.remove(fw.rocketLight);
    fw.rocket.geometry.dispose();
    fw.rocket.material.dispose();

    // Create explosion particle cloud
    const count = 240;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = fw.x;
      positions[i * 3 + 1] = fw.y;
      positions[i * 3 + 2] = fw.z;

      // Spherical explosion velocity
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const speed = 7.0 + Math.random() * 9.5;

      velocities[i * 3] = speed * Math.sin(phi) * Math.cos(theta);
      velocities[i * 3 + 1] = speed * Math.cos(phi);
      velocities[i * 3 + 2] = speed * Math.sin(phi) * Math.sin(theta);
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      map: this.particleTex,
      color: fw.color,
      size: 1.6,
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(geo, mat);
    this.scene.add(particles);

    // Dynamic Flash Light casting intense reflections on river water
    const flashLight = new THREE.PointLight(fw.color, 5.0, 75, 1.8);
    flashLight.position.set(fw.x, fw.y, fw.z);
    this.scene.add(flashLight);

    fw.particles = particles;
    fw.velocities = velocities;
    fw.flashLight = flashLight;
    fw.particleMat = mat;
    fw.explosionAge = 0;
  }

  update(time, delta) {
    // 1. Auto launch interval
    this.autoTimer += delta;
    if (this.autoTimer > this.nextAutoInterval) {
      this.launch();
      this.autoTimer = 0;
      this.nextAutoInterval = 8.0 + Math.random() * 6.0; // Next in 8-14 sec
    }

    // 2. Update active fireworks
    for (let i = this.activeFireworks.length - 1; i >= 0; i--) {
      const fw = this.activeFireworks[i];

      if (fw.state === 'ascending') {
        fw.y += fw.vy * delta;
        fw.vy -= 9.8 * delta * 0.4; // slight drag
        fw.rocket.position.y = fw.y;
        fw.rocketLight.position.y = fw.y;

        if (fw.y >= fw.peakY || fw.vy <= 0) {
          this.explode(fw);
        }
      } else if (fw.state === 'exploding') {
        fw.explosionAge += delta;
        const positions = fw.particles.geometry.attributes.position.array;
        const vel = fw.velocities;

        // Apply physics to sparks: drag and gravity
        for (let j = 0; j < vel.length; j += 3) {
          vel[j] *= 0.96; // drag X
          vel[j + 1] = (vel[j + 1] - 8.5 * delta) * 0.96; // gravity & drag Y
          vel[j + 2] *= 0.96; // drag Z

          positions[j] += vel[j] * delta;
          positions[j + 1] += vel[j + 1] * delta;
          positions[j + 2] += vel[j + 2] * delta;
        }

        fw.particles.geometry.attributes.position.needsUpdate = true;

        // Fade out
        const fade = Math.max(0, 1.0 - (fw.explosionAge / 2.2));
        fw.particleMat.opacity = fade;
        if (fw.flashLight) {
          fw.flashLight.intensity = fade * 5.0;
        }

        // Cleanup
        if (fw.explosionAge > 2.2) {
          this.scene.remove(fw.particles);
          this.scene.remove(fw.flashLight);
          fw.particles.geometry.dispose();
          fw.particles.material.dispose();
          this.activeFireworks.splice(i, 1);
        }
      }
    }
  }
}
