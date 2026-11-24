import * as THREE from 'three';
import { getMoonTexture, getGlowParticleTexture } from '../utils/textureGenerator.js';
import { getWaveHeight } from '../systems/floatingPhysics.js';

export class Environment {
  constructor(scene) {
    this.scene = scene;
    this.lanterns = [];
    this.initSky();
    this.initMoon();
    this.initStars();
    this.initRiver();
    this.initSkyLanterns();
  }

  initSky() {
    // Significantly brighter, luminous moonlit sky dome while maintaining rich nighttime atmosphere
    const skyGeo = new THREE.SphereGeometry(220, 32, 24);
    skyGeo.scale(-1, 1, 1);

    const vertexShader = `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      varying vec3 vWorldPosition;
      void main() {
        float h = normalize(vWorldPosition).y;
        // Bright, luminous, crystal-clear moonlit sapphire night sky
        vec3 horizonColor = vec3(0.24, 0.42, 0.70); // Radiant cyan-indigo glow at horizon
        vec3 midColor     = vec3(0.14, 0.28, 0.54); // Royal sapphire blue
        vec3 zenithColor  = vec3(0.08, 0.18, 0.38); // Deep clear midnight blue at zenith

        vec3 color;
        if (h < 0.35) {
          color = mix(horizonColor, midColor, h / 0.35);
        } else {
          color = mix(midColor, zenithColor, (h - 0.35) / 0.65);
        }
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const skyMat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      side: THREE.BackSide,
      depthWrite: false
    });

    const skyDome = new THREE.Mesh(skyGeo, skyMat);
    this.scene.add(skyDome);
  }

  initMoon() {
    // Full Moon mesh
    const moonGeo = new THREE.SphereGeometry(8.0, 24, 24);
    const moonMat = new THREE.MeshBasicMaterial({
      map: getMoonTexture(),
      color: 0xfffae6
    });
    this.moon = new THREE.Mesh(moonGeo, moonMat);
    this.moon.position.set(50, 75, -110);
    this.scene.add(this.moon);

    // Glowing Moon Halo
    const haloMat = new THREE.SpriteMaterial({
      map: getGlowParticleTexture(),
      color: 0xfff4c2,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const moonHalo = new THREE.Sprite(haloMat);
    moonHalo.scale.set(48, 48, 1);
    this.moon.add(moonHalo);

    // Primary Moonlight
    this.moonLight = new THREE.DirectionalLight(0xe2f0ff, 1.95);
    this.moonLight.position.set(50, 75, -110);
    this.moonLight.target.position.set(0, 0, 30);
    this.scene.add(this.moonLight);
    this.scene.add(this.moonLight.target);

    // Luminous moonlit ambient fill light (bright and clear)
    const ambientLight = new THREE.AmbientLight(0x527699, 1.7);
    this.scene.add(ambientLight);
  }

  initStars() {
    // 2,500+ Twinkling Stars across the whole celestial dome
    const starCount = 2600;
    const starGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(Math.random());
      const r = 200;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = Math.max(8, r * Math.cos(phi));
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const starMat = new THREE.PointsMaterial({
      map: getGlowParticleTexture(),
      color: 0xffffff,
      size: 1.25,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.starPoints = new THREE.Points(starGeo, starMat);
    this.scene.add(this.starPoints);
  }

  initRiver() {
    // River spans in front of pier (Z <= 0).
    // River plane of length 180 (along Z) centered at Z = -90 extends from Z = 0 to Z = -180.
    // Width 240 (along X from -120 to 120).
    this.riverGeo = new THREE.PlaneGeometry(240, 180, 55, 55);
    this.riverGeo.rotateX(-Math.PI / 2);

    this.riverMat = new THREE.MeshStandardMaterial({
      color: 0x145a80,      // Clear radiant moonlit sapphire teal
      emissive: 0x08334f,   // Soft inner water radiance
      roughness: 0.14,
      metalness: 0.70,
      flatShading: false
    });

    this.riverMesh = new THREE.Mesh(this.riverGeo, this.riverMat);
    this.riverMesh.position.set(0, 0, -90);
    this.riverMesh.receiveShadow = true;
    this.scene.add(this.riverMesh);

    this.riverBasePositions = this.riverGeo.attributes.position.array.slice();
    this.frameCounter = 0;
  }

  /**
   * Sky Lanterns (โคมลอยยี่เป็ง) distributed over the ENTIRE map
   * Rising from river, fairground, food court, stage, and parking lot!
   */
  initSkyLanterns() {
    const lanternCount = 110;
    const lanternGroup = new THREE.Group();

    const bodyGeo = new THREE.CylinderGeometry(0.5, 0.7, 1.4, 10, 1, true);
    const capGeo = new THREE.SphereGeometry(0.5, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2);
    capGeo.translate(0, 0.7, 0);

    const lanternMat = new THREE.MeshStandardMaterial({
      color: 0xff7700,
      emissive: 0xff5500,
      emissiveIntensity: 2.2,
      roughness: 0.3,
      side: THREE.DoubleSide
    });

    for (let i = 0; i < lanternCount; i++) {
      const lantern = new THREE.Group();
      const body = new THREE.Mesh(bodyGeo, lanternMat);
      const cap = new THREE.Mesh(capGeo, lanternMat);
      lantern.add(body);
      lantern.add(cap);

      // Scatter widely across the whole map: X from -110 to 110, Z from -60 to 150
      lantern.position.set(
        -110 + Math.random() * 220,
        5 + Math.random() * 75,
        -60 + Math.random() * 210
      );

      lantern.scale.setScalar(0.7 + Math.random() * 0.7);

      lantern.userData = {
        riseSpeed: 0.35 + Math.random() * 0.45,
        swaySpeed: 0.5 + Math.random() * 0.7,
        swayPhase: Math.random() * Math.PI * 2,
        initialX: lantern.position.x
      };

      this.lanterns.push(lantern);
      lanternGroup.add(lantern);
    }

    this.scene.add(lanternGroup);
  }

  update(time, delta) {
    // 1. Update River Waves
    const positions = this.riverGeo.attributes.position.array;
    const base = this.riverBasePositions;
    const riverOffsetZ = this.riverMesh.position.z;

    for (let i = 0; i < positions.length; i += 3) {
      // Pass world Z (local base[i+2] + riverMesh.position.z) to getWaveHeight
      positions[i + 1] = getWaveHeight(base[i], base[i + 2] + riverOffsetZ, time);
    }
    this.riverGeo.attributes.position.needsUpdate = true;

    this.frameCounter++;
    if (this.frameCounter % 2 === 0) {
      this.riverGeo.computeVertexNormals();
    }

    // 2. Animate Sky Lanterns across map
    for (const lantern of this.lanterns) {
      const u = lantern.userData;
      lantern.position.y += u.riseSpeed * delta * 4.2;
      lantern.position.x = u.initialX + Math.sin(time * u.swaySpeed + u.swayPhase) * 2.5;
      lantern.rotation.y += delta * 0.15;

      if (lantern.position.y > 90) {
        lantern.position.y = 5;
        lantern.position.x = -110 + Math.random() * 220;
        lantern.position.z = -60 + Math.random() * 210;
        u.initialX = lantern.position.x;
      }
    }

    // 3. Twinkle Stars
    if (this.starPoints) {
      this.starPoints.rotation.y = time * 0.0015;
    }
  }
}
