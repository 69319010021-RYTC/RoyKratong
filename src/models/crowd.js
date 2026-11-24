import * as THREE from 'three';

/**
 * Creates highly-detailed, smooth, non-blocky 3D human characters
 * with traditional Thai festival attire (Chut Thai, Sabai, Chong Kraben, Sinh).
 * Characters distributed across all festival zones:
 * - Pier & waterfront
 * - Market Street boulevard
 * - Dining Plaza
 * - Restroom walkway
 * - Golden Pagoda & Sand Stupas
 * - Grand Performance Stage audience
 * - Rear Parking Lot visitors
 */
export class AnimatedCrowd {
  constructor(scene) {
    this.scene = scene;
    this.characters = [];
    this.GROUND_Y = 2.0;
    this.initCrowd();
  }

  createSmoothCharacter(config) {
    const root = new THREE.Group();
    const { isFemale, silkColor, garmentColor, heightScale = 1.0 } = config;

    const skinMat = new THREE.MeshStandardMaterial({
      color: config.skinTone || 0xf0c29e,
      roughness: 0.5,
      metalness: 0.05
    });

    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x1f1915,
      roughness: 0.7
    });

    const silkMat = new THREE.MeshStandardMaterial({
      color: silkColor,
      roughness: 0.35,
      metalness: 0.2
    });

    const garmentMat = new THREE.MeshStandardMaterial({
      color: garmentColor,
      roughness: 0.45,
      metalness: 0.15
    });

    const goldTrimMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      roughness: 0.3,
      metalness: 0.7
    });

    // 1. Head & Neck
    const headGroup = new THREE.Group();
    headGroup.position.y = 1.88 * heightScale;

    const headGeo = new THREE.SphereGeometry(0.18, 16, 16);
    headGeo.scale(1.0, 1.15, 1.05);
    const head = new THREE.Mesh(headGeo, skinMat);
    headGroup.add(head);

    const neckGeo = new THREE.CylinderGeometry(0.07, 0.08, 0.16, 12);
    const neck = new THREE.Mesh(neckGeo, skinMat);
    neck.position.y = -0.16;
    headGroup.add(neck);

    if (isFemale) {
      const hairBaseGeo = new THREE.SphereGeometry(0.19, 14, 14, 0, Math.PI * 2, 0, Math.PI * 0.65);
      hairBaseGeo.scale(1.02, 1.15, 1.08);
      const hairBase = new THREE.Mesh(hairBaseGeo, hairMat);
      hairBase.position.y = 0.04;
      headGroup.add(hairBase);

      const bun = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 12), hairMat);
      bun.position.set(0, 0.12, -0.16);
      headGroup.add(bun);

      const flower = new THREE.Mesh(
        new THREE.SphereGeometry(0.045, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
      );
      flower.position.set(0.18, 0.08, -0.05);
      headGroup.add(flower);
    } else {
      const maleHairGeo = new THREE.SphereGeometry(0.19, 14, 14, 0, Math.PI * 2, 0, Math.PI * 0.6);
      maleHairGeo.scale(1.03, 1.12, 1.06);
      const maleHair = new THREE.Mesh(maleHairGeo, hairMat);
      maleHair.position.y = 0.05;
      headGroup.add(maleHair);
    }
    root.add(headGroup);

    // 2. Torso
    const torsoGroup = new THREE.Group();
    torsoGroup.position.y = 1.35 * heightScale;

    const chestGeo = new THREE.CylinderGeometry(0.24, 0.20, 0.65, 16);
    const chest = new THREE.Mesh(chestGeo, silkMat);
    torsoGroup.add(chest);

    if (isFemale) {
      const sabaiGeo = new THREE.CylinderGeometry(0.25, 0.21, 0.66, 16, 1, true, 0, Math.PI * 0.9);
      const sabaiMat = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        roughness: 0.3,
        metalness: 0.5,
        side: THREE.DoubleSide
      });
      const sabai = new THREE.Mesh(sabaiGeo, sabaiMat);
      sabai.rotation.z = 0.18;
      torsoGroup.add(sabai);
    } else {
      const buttonGeo = new THREE.SphereGeometry(0.02, 6, 6);
      for (let b = 0; b < 3; b++) {
        const btn = new THREE.Mesh(buttonGeo, goldTrimMat);
        btn.position.set(0, 0.2 - b * 0.12, 0.21);
        torsoGroup.add(btn);
      }
    }
    root.add(torsoGroup);

    // 3. Smooth Arms
    function createSmoothArm(side = 1) {
      const armGroup = new THREE.Group();
      armGroup.position.set(side * 0.32, 1.62 * heightScale, 0);

      const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), silkMat);
      armGroup.add(shoulder);

      const upperArmGeo = new THREE.CylinderGeometry(0.075, 0.065, 0.35, 12);
      upperArmGeo.translate(0, -0.175, 0);
      const upperArm = new THREE.Mesh(upperArmGeo, silkMat);
      armGroup.add(upperArm);

      const forearmGroup = new THREE.Group();
      forearmGroup.position.set(0, -0.35, 0);

      const forearmGeo = new THREE.CylinderGeometry(0.065, 0.055, 0.32, 12);
      forearmGeo.translate(0, -0.16, 0);
      const forearm = new THREE.Mesh(forearmGeo, skinMat);
      forearmGroup.add(forearm);

      const handGeo = new THREE.SphereGeometry(0.06, 10, 10);
      handGeo.scale(0.8, 1.2, 0.5);
      const hand = new THREE.Mesh(handGeo, skinMat);
      hand.position.set(0, -0.36, 0);
      forearmGroup.add(hand);

      armGroup.add(forearmGroup);
      return { armGroup, upperArm, forearmGroup, hand };
    }

    const leftArm = createSmoothArm(-1);
    const rightArm = createSmoothArm(1);
    root.add(leftArm.armGroup);
    root.add(rightArm.armGroup);

    // 4. Lower Body & Legs
    const lowerBodyGroup = new THREE.Group();
    lowerBodyGroup.position.y = 0.95 * heightScale;

    let leftLegGroup, rightLegGroup;

    if (isFemale) {
      const skirtGeo = new THREE.CylinderGeometry(0.21, 0.28, 0.88, 16);
      const skirt = new THREE.Mesh(skirtGeo, garmentMat);
      skirt.position.y = -0.44;
      lowerBodyGroup.add(skirt);

      const borderGeo = new THREE.CylinderGeometry(0.282, 0.285, 0.14, 16, 1, true);
      const border = new THREE.Mesh(borderGeo, goldTrimMat);
      border.position.y = -0.81;
      lowerBodyGroup.add(border);

      const footGeo = new THREE.BoxGeometry(0.1, 0.06, 0.22);
      const leftFoot = new THREE.Mesh(footGeo, goldTrimMat);
      leftFoot.position.set(-0.1, -0.92, 0.04);
      lowerBodyGroup.add(leftFoot);
      const rightFoot = new THREE.Mesh(footGeo, goldTrimMat);
      rightFoot.position.set(0.1, -0.92, 0.04);
      lowerBodyGroup.add(rightFoot);
    } else {
      const chongGeo = new THREE.SphereGeometry(0.28, 14, 14);
      chongGeo.scale(1.0, 0.9, 1.15);
      const chong = new THREE.Mesh(chongGeo, garmentMat);
      chong.position.y = -0.15;
      lowerBodyGroup.add(chong);

      function createSmoothLeg(side = 1) {
        const legGroup = new THREE.Group();
        legGroup.position.set(side * 0.13, -0.25, 0);

        const legGeo = new THREE.CylinderGeometry(0.09, 0.075, 0.65, 12);
        legGeo.translate(0, -0.325, 0);
        const leg = new THREE.Mesh(legGeo, garmentMat);
        legGroup.add(leg);

        const shoeGeo = new THREE.BoxGeometry(0.12, 0.08, 0.24);
        const shoeMat = new THREE.MeshStandardMaterial({ color: 0x2b1d0c, roughness: 0.5 });
        const shoe = new THREE.Mesh(shoeGeo, shoeMat);
        shoe.position.set(0, -0.68, 0.05);
        legGroup.add(shoe);

        return { legGroup, leg };
      }

      leftLegGroup = createSmoothLeg(-1);
      rightLegGroup = createSmoothLeg(1);
      lowerBodyGroup.add(leftLegGroup.legGroup);
      lowerBodyGroup.add(rightLegGroup.legGroup);
    }
    root.add(lowerBodyGroup);

    return {
      root,
      headGroup,
      torsoGroup,
      leftArm,
      rightArm,
      lowerBodyGroup,
      leftLegGroup,
      rightLegGroup,
      isFemale
    };
  }

  initCrowd() {
    const crowdGroup = new THREE.Group();

    const crowdConfigs = [
      { isFemale: true,  silkColor: 0xe91e63, garmentColor: 0x880e4f },
      { isFemale: false, silkColor: 0xffd54f, garmentColor: 0x3f51b5 },
      { isFemale: true,  silkColor: 0x00bcd4, garmentColor: 0x006064 },
      { isFemale: false, silkColor: 0xffffff, garmentColor: 0x4e342e },
      { isFemale: true,  silkColor: 0xffb74d, garmentColor: 0xb71c1c },
      { isFemale: false, silkColor: 0x4caf50, garmentColor: 0x2e7d32 },
      { isFemale: true,  silkColor: 0xba68c8, garmentColor: 0x4a148c },
      { isFemale: true,  silkColor: 0xfff9c4, garmentColor: 0xf57c00 }
    ];

    // Helper to register a linear walking character
    const addWalker = (cfg, startX, startZ, axis, minVal, maxVal, speed = 1.1) => {
      const char = this.createSmoothCharacter(cfg);
      char.root.position.set(startX, this.GROUND_Y, startZ);

      const isAlongZ = axis === 'z';
      this.characters.push({
        ...char,
        type: 'walker',
        axis,
        speed: speed + Math.random() * 0.25,
        direction: 1,
        minVal,
        maxVal,
        walkCyclePhase: Math.random() * Math.PI * 2
      });
      crowdGroup.add(char.root);
    };

    // 1. Walkers on the Pier (Z = 2 to 14)
    addWalker(crowdConfigs[0], -2.0, 4.0, 'z', 2.0, 14.0, 1.0);
    addWalker(crowdConfigs[1], 2.0, 12.0, 'z', 2.0, 14.0, 1.1);
    addWalker(crowdConfigs[7], 0.0, 8.0, 'z', 3.0, 13.0, 0.95);

    // 2. Walkers on Central Boulevard (Clear corridor between stalls: X = -8 to 8, Z = 25 to 88)
    addWalker(crowdConfigs[2], -3.5, 30.0, 'z', 26.0, 86.0, 1.2);
    addWalker(crowdConfigs[3], 3.5, 65.0, 'z', 26.0, 86.0, 1.15);
    addWalker(crowdConfigs[4], -1.0, 48.0, 'z', 26.0, 86.0, 1.05);
    addWalker(crowdConfigs[5], 2.0, 36.0, 'z', 26.0, 86.0, 1.25);
    addWalker(crowdConfigs[6], -2.5, 76.0, 'z', 26.0, 86.0, 1.1);
    addWalker(crowdConfigs[0], 4.2, 52.0, 'z', 26.0, 86.0, 1.0);

    // 3. Walkers along Market Stalls Corridor (Shopping lane along left stalls: X = -12, Z = 32 to 74)
    addWalker(crowdConfigs[1], -13.0, 38.0, 'z', 32.0, 74.0, 0.9);
    addWalker(crowdConfigs[2], 13.0, 58.0, 'z', 32.0, 74.0, 0.95);

    // 4. Walkers going to/from Dining Plaza (East walkway corridor: X = 12 to 46, Z = 48)
    addWalker(crowdConfigs[3], 16.0, 48.0, 'x', 14.0, 46.0, 1.1);
    addWalker(crowdConfigs[4], 38.0, 48.0, 'x', 14.0, 46.0, 1.0);
    addWalker(crowdConfigs[5], 28.0, 48.0, 'x', 14.0, 46.0, 1.15);

    // 5. Walkers heading towards the Restroom Complex (Walkway corridor: X = 58 to 82, Z = 52)
    addWalker(crowdConfigs[6], 60.0, 52.0, 'x', 58.0, 82.0, 1.15);
    addWalker(crowdConfigs[7], 76.0, 52.0, 'x', 58.0, 82.0, 1.05);

    // 6. Walkers around Ferris Wheel & Carousel Zone (West plaza walkway: X = -35, Z = 10 to 42)
    addWalker(crowdConfigs[0], -26.0, 26.0, 'z', 12.0, 40.0, 1.05);
    addWalker(crowdConfigs[1], -44.0, 30.0, 'z', 14.0, 38.0, 1.1);
    addWalker(crowdConfigs[2], -35.0, 12.0, 'x', -44.0, -25.0, 1.0);

    // 7. Walkers heading to/from Golden Pagoda Sanctuary (Path: X = -45 to -15, Z = 62)
    addWalker(crowdConfigs[3], -18.0, 62.0, 'x', -42.0, -16.0, 1.1);
    addWalker(crowdConfigs[4], -34.0, 62.0, 'x', -42.0, -16.0, 1.0);
    addWalker(crowdConfigs[5], -28.0, 64.0, 'x', -40.0, -16.0, 1.05);

    // 8. Walkers in the Rear Parking Lot (Safe driving aisle corridor: X = -40 to 40, Z = 132)
    addWalker(crowdConfigs[6], -20.0, 132.0, 'x', -45.0, 40.0, 1.2);
    addWalker(crowdConfigs[7], 25.0, 132.0, 'x', -45.0, 40.0, 1.15);
    addWalker(crowdConfigs[0], 0.0, 122.0, 'z', 114.0, 142.0, 1.05);
    addWalker(crowdConfigs[1], -30.0, 124.0, 'z', 114.0, 142.0, 1.1);
    addWalker(crowdConfigs[2], 30.0, 136.0, 'z', 114.0, 142.0, 1.0);

    // 7. Diners seated/chatting at Dining Plaza (X = 44 to 62, Z = 42 to 62)
    const diningSpots = [
      { x: 44, z: 42, rot: 0.4 },
      { x: 53, z: 42, rot: -0.2 },
      { x: 62, z: 42, rot: -0.5 },
      { x: 44, z: 52, rot: 2.8 },
      { x: 53, z: 62, rot: 3.1 },
      { x: 62, z: 62, rot: 2.5 },
      { x: 44, z: 62, rot: 1.5 },
      { x: 53, z: 52, rot: -1.2 }
    ];
    diningSpots.forEach((spot, idx) => {
      const cfg = crowdConfigs[(idx + 2) % crowdConfigs.length];
      const char = this.createSmoothCharacter(cfg);
      char.root.position.set(spot.x, this.GROUND_Y, spot.z);
      char.root.rotation.y = spot.rot;
      char.rightArm.armGroup.rotation.x = 0.55;
      char.rightArm.forearmGroup.rotation.x = 0.45;
      this.characters.push({ ...char, type: 'spectator', idlePhase: Math.random() * Math.PI * 2 });
      crowdGroup.add(char.root);
    });

    // 8. Audience in front of Grand Performance Stage (Audience faces stage at Z=105; so rot=0 is facing +Z)
    const audienceSpots = [
      { x: -5.0, z: 96, rot: 0 },
      { x: -1.5, z: 95, rot: 0 },
      { x: 2.5,  z: 96, rot: 0 },
      { x: 6.0,  z: 95, rot: 0 },
      { x: -3.0, z: 99, rot: 0 },
      { x: 3.0,  z: 99, rot: 0 },
      { x: -7.0, z: 98, rot: 0.1 },
      { x: 0.0,  z: 98, rot: 0 },
      { x: 7.0,  z: 98, rot: -0.1 },
      { x: -4.5, z: 101, rot: 0 },
      { x: 4.5,  z: 101, rot: 0 }
    ];
    audienceSpots.forEach((spot, idx) => {
      const cfg = crowdConfigs[(idx + 4) % crowdConfigs.length];
      const char = this.createSmoothCharacter(cfg);
      char.root.position.set(spot.x, this.GROUND_Y, spot.z);
      char.root.rotation.y = spot.rot;
      char.leftArm.armGroup.rotation.x = 0.4;
      char.rightArm.armGroup.rotation.x = 0.4;
      this.characters.push({ ...char, type: 'spectator', idlePhase: Math.random() * Math.PI * 2 });
      crowdGroup.add(char.root);
    });

    // 9. Spectators by the Rides & Carnival Booths (X = -35, Z = 20..35)
    const carnivalSpots = [
      { x: -31.0, z: 34.0, rot: -1.2 },
      { x: -39.0, z: 34.0, rot: 1.2 },
      { x: -32.0, z: 18.0, rot: -2.4 },
      { x: -38.0, z: 18.0, rot: 2.4 }
    ];
    carnivalSpots.forEach((spot, idx) => {
      const cfg = crowdConfigs[(idx + 1) % crowdConfigs.length];
      const char = this.createSmoothCharacter(cfg);
      char.root.position.set(spot.x, this.GROUND_Y, spot.z);
      char.root.rotation.y = spot.rot;
      this.characters.push({ ...char, type: 'spectator', idlePhase: Math.random() * Math.PI * 2 });
      crowdGroup.add(char.root);
    });

    // 10. Worshipers at Chedi Sanctuary (X = -50, Z = 54..70)
    const chediSpots = [
      { x: -46.0, z: 54.0, rot: -0.6 },
      { x: -54.0, z: 54.0, rot: 0.6 }
    ];
    chediSpots.forEach((spot, idx) => {
      const cfg = crowdConfigs[(idx + 3) % crowdConfigs.length];
      const char = this.createSmoothCharacter(cfg);
      char.root.position.set(spot.x, this.GROUND_Y, spot.z);
      char.root.rotation.y = spot.rot;
      char.leftArm.armGroup.rotation.x = 0.8;
      char.rightArm.armGroup.rotation.x = 0.8;
      char.leftArm.forearmGroup.rotation.x = 0.5;
      char.rightArm.forearmGroup.rotation.x = 0.5;
      this.characters.push({ ...char, type: 'spectator', idlePhase: Math.random() * Math.PI * 2 });
      crowdGroup.add(char.root);
    });

    // 11. Floaters kneeling at water steps
    const floaterSpots = [
      { x: -2.2, z: -2.6, y: 1.15 },
      { x: 2.2,  z: -3.6, y: 0.85 },
      { x: -3.8, z: -1.5, y: 1.45 },
      { x: 3.8,  z: -1.5, y: 1.45 }
    ];
    floaterSpots.forEach((spot, idx) => {
      const cfg = crowdConfigs[(idx + 1) % crowdConfigs.length];
      const char = this.createSmoothCharacter(cfg);
      char.root.position.set(spot.x, spot.y, spot.z);
      char.root.rotation.y = Math.PI;

      char.torsoGroup.rotation.x = 0.38;
      char.headGroup.rotation.x = 0.28;
      char.leftArm.armGroup.rotation.x = 0.65;
      char.leftArm.armGroup.rotation.z = 0.25;
      char.leftArm.forearmGroup.rotation.x = 0.45;
      char.rightArm.armGroup.rotation.x = 0.65;
      char.rightArm.armGroup.rotation.z = -0.25;
      char.rightArm.forearmGroup.rotation.x = 0.45;

      const miniKrathong = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.24, 0.1, 12),
        new THREE.MeshStandardMaterial({ color: 0x388e3c })
      );
      const miniFlame = new THREE.Mesh(
        new THREE.ConeGeometry(0.04, 0.15, 8),
        new THREE.MeshBasicMaterial({ color: 0xffaa00 })
      );
      miniFlame.position.y = 0.12;
      miniKrathong.add(miniFlame);
      miniKrathong.position.set(0, 0.8, 0.45);
      char.root.add(miniKrathong);

      this.characters.push({
        ...char,
        type: 'floater',
        floatPhase: Math.random() * Math.PI * 2,
        miniKrathong
      });
      crowdGroup.add(char.root);
    });

    this.scene.add(crowdGroup);
  }

  update(time, delta) {
    for (const char of this.characters) {
      if (char.type === 'walker') {
        const isAlongZ = char.axis === 'z';
        const currentCoord = isAlongZ ? char.root.position.z : char.root.position.x;
        const nextCoord = currentCoord + char.direction * char.speed * delta;

        if (isAlongZ) {
          char.root.position.z = nextCoord;
          if (char.root.position.z < char.minVal) {
            char.direction = 1;
            char.root.rotation.y = 0;
          } else if (char.root.position.z > char.maxVal) {
            char.direction = -1;
            char.root.rotation.y = Math.PI;
          }
        } else {
          char.root.position.x = nextCoord;
          if (char.root.position.x < char.minVal) {
            char.direction = 1;
            char.root.rotation.y = Math.PI / 2; // face east
          } else if (char.root.position.x > char.maxVal) {
            char.direction = -1;
            char.root.rotation.y = -Math.PI / 2; // face west
          }
        }

        char.walkCyclePhase += delta * char.speed * 4.2;
        const swing = Math.sin(char.walkCyclePhase) * 0.45;

        char.leftArm.armGroup.rotation.x = -swing * 0.7;
        char.rightArm.armGroup.rotation.x = swing * 0.7;

        if (char.leftLegGroup && char.rightLegGroup) {
          char.leftLegGroup.legGroup.rotation.x = swing;
          char.rightLegGroup.legGroup.rotation.x = -swing;
        }

        char.torsoGroup.position.y = 1.35 + Math.abs(Math.sin(char.walkCyclePhase * 2)) * 0.04;
      } else if (char.type === 'spectator') {
        char.idlePhase += delta * 0.9;
        char.headGroup.rotation.y = Math.sin(char.idlePhase * 0.4) * 0.2;
      } else if (char.type === 'floater') {
        char.floatPhase += delta * 1.4;
        const dip = Math.sin(char.floatPhase) * 0.05;
        char.torsoGroup.rotation.x = 0.38 + dip;
        if (char.miniKrathong) {
          char.miniKrathong.position.y = 0.8 + dip * 0.4;
        }
      }
    }
  }
}
