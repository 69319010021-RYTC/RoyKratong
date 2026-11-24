import * as THREE from 'three';

/**
 * Global wave height function used by both the river mesh and krathongs
 * Multi-octave sinusoidal wave generator for realistic gentle river currents
 */
export function getWaveHeight(x, z, time) {
  // Wave 1: Gentle primary swell along the river
  const w1 = Math.sin(x * 0.12 + time * 1.6) * 0.22;
  // Wave 2: Cross river ripples
  const w2 = Math.cos(z * 0.15 + time * 1.3) * 0.18;
  // Wave 3: Diagonal high-frequency wave
  const w3 = Math.sin((x + z) * 0.22 + time * 2.2) * 0.10;
  // Wave 4: Fine gentle ripple
  const w4 = Math.cos((x * 0.8 - z * 0.6) + time * 3.0) * 0.05;

  return w1 + w2 + w3 + w4;
}

/**
 * Calculates wave normal gradient to orient floating objects naturally with the slope
 */
export function getWaveNormal(x, z, time, delta = 0.3) {
  const hL = getWaveHeight(x - delta, z, time);
  const hR = getWaveHeight(x + delta, z, time);
  const hD = getWaveHeight(x, z - delta, time);
  const hU = getWaveHeight(x, z + delta, time);

  // Gradient approximation
  const normal = new THREE.Vector3(
    (hL - hR) / (2 * delta),
    1.0,
    (hD - hU) / (2 * delta)
  ).normalize();

  return normal;
}

/**
 * Updates floating physics for a krathong
 */
export function updateKrathongPhysics(krathong, time, delta) {
  // 1. Current drift: slowly move downstream (towards negative X or along river curve)
  if (krathong.userData.floating) {
    const driftSpeed = krathong.userData.speed || 0.65;
    krathong.position.x -= driftSpeed * delta;
    // Gentle lateral meander
    krathong.position.z += Math.sin(time * 0.5 + krathong.userData.id * 1.7) * 0.15 * delta;

    // Slow organic yaw spin
    krathong.rotation.y += (krathong.userData.rotSpeed || 0.08) * delta;

    // Respawn if drifted too far away downstream
    if (krathong.position.x < -80) {
      krathong.position.x = 45 + Math.random() * 20;
      krathong.position.z = -15 + (Math.random() - 0.5) * 35;
    }
  }

  // 2. Wave height (Heave)
  const currentWaveY = getWaveHeight(krathong.position.x, krathong.position.z, time);
  krathong.position.y = currentWaveY + 0.05; // slight buoyancy lift

  // 3. Slope alignment (Pitch & Roll)
  const normal = getWaveNormal(krathong.position.x, krathong.position.z, time);
  // Pitch and roll target angles
  const targetPitch = Math.atan2(normal.z, normal.y) * 0.75;
  const targetRoll = -Math.atan2(normal.x, normal.y) * 0.75;

  krathong.rotation.x = THREE.MathUtils.lerp(krathong.rotation.x, targetPitch, delta * 5);
  krathong.rotation.z = THREE.MathUtils.lerp(krathong.rotation.z, targetRoll, delta * 5);

  // 4. Candle flicker animation
  if (krathong.userData.flameMesh && krathong.userData.flameLight) {
    const flicker = Math.sin(time * 18 + krathong.userData.id * 3) * 0.2 +
                    Math.cos(time * 26 + krathong.userData.id) * 0.15;
    krathong.userData.flameMesh.scale.set(
      1 + flicker * 0.3,
      1 + flicker * 0.45,
      1 + flicker * 0.3
    );
    krathong.userData.flameLight.intensity = (1.5 + flicker * 0.6);
  }

  // 5. Smoke particles
  if (krathong.userData.smokeParticles) {
    const positions = krathong.userData.smokeParticles.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 1] += delta * (0.8 + (i % 3) * 0.2); // rise Y
      positions[i] += Math.sin(time * 2 + i) * delta * 0.15; // wind sway
      positions[i + 2] += Math.cos(time * 2 + i) * delta * 0.15;

      // Reset smoke particle when too high
      if (positions[i + 1] > 2.5) {
        positions[i + 1] = 0.5;
        positions[i] = (Math.random() - 0.5) * 0.1;
        positions[i + 2] = (Math.random() - 0.5) * 0.1;
      }
    }
    krathong.userData.smokeParticles.geometry.attributes.position.needsUpdate = true;
  }
}
