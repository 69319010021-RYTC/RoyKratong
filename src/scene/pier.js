import * as THREE from 'three';
import { getWoodPlankTexture } from '../utils/textureGenerator.js';

/**
 * Grand Thai Temple Fairground (มหกรรมงานวัดลอยกระทงขนาดใหญ่)
 * Updates:
 * - 3D Double-sided stage backdrop with authentic backstage wall and service door
 * - Food Court entrance archway (ซุ้มประตูทางเข้าโซนอาหาร) with wooden columns
 * - Parking lot billboard mounted on sturdy timber columns
 * - Animated Ferris Wheel (ชิงช้าสวรรค์งานวัดหมุนได้จริงพร้อมไฟนีออน)
 * - Carousel / Merry-Go-Round & Carnival Games (ซุ้มปาเป้ายิงเป้า)
 */
export class PierAndFair {
  constructor(scene) {
    this.scene = scene;
    this.woodTex = getWoodPlankTexture();
    this.GROUND_Y = 2.0;

    // Interactive animated rides
    this.ferrisWheelRotor = null;
    this.carouselRotor = null;

    this.initExpansiveGround();
    this.initWoodenPier();
    this.initWaterfrontPavilion();
    this.initMaeKhongkhaShrine();
    this.initGrandTempleArch();
    this.initMarketAvenue();
    this.initDiningPlazaWithArch();
    this.initRestroomComplex();
    this.initGrandPerformanceStage();
    this.initParkingLotZone();
    this.initTempleSanctuary();
    this.initFerrisWheelAndRides();
    this.initLanternPolesAndStrings();
    this.initPerimeterFoliage();
  }

  initExpansiveGround() {
    const groundGeo = new THREE.BoxGeometry(280, 2.0, 210);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x332820,
      roughness: 0.82,
      metalness: 0.05
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.set(0, 1.0, 105);
    ground.receiveShadow = true;
    this.scene.add(ground);

    const createFillLight = (x, z, intensity = 1.4) => {
      const light = new THREE.PointLight(0xffc107, intensity, 60, 1.6);
      light.position.set(x, 8.5, z);
      this.scene.add(light);
    };

    createFillLight(0, 35, 1.6);
    createFillLight(0, 70, 1.6);
    createFillLight(50, 50, 1.5);
    createFillLight(-45, 50, 1.4);
    createFillLight(0, 98, 1.7);
    createFillLight(0, 140, 1.5);
  }

  initWoodenPier() {
    const pierGroup = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({
      map: this.woodTex,
      color: 0x5d4037,
      roughness: 0.75,
      metalness: 0.1
    });

    const deck = new THREE.Mesh(new THREE.BoxGeometry(12, 0.4, 18), woodMat);
    deck.position.set(0, 1.8, 7);
    deck.receiveShadow = true;
    pierGroup.add(deck);

    const pileGeo = new THREE.CylinderGeometry(0.28, 0.32, 6, 10);
    const pilePositions = [
      [-5.5, 14], [5.5, 14],
      [-5.5, 8],  [5.5, 8],
      [-5.5, 2],  [5.5, 2],
      [-5.5, -2], [5.5, -2]
    ];
    for (const [px, pz] of pilePositions) {
      const pile = new THREE.Mesh(pileGeo, woodMat);
      pile.position.set(px, -0.2, pz);
      pierGroup.add(pile);
    }

    const railMat = new THREE.MeshStandardMaterial({ color: 0x4e342e, roughness: 0.8 });
    for (const side of [-5.8, 5.8]) {
      const topRail = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 14), railMat);
      topRail.position.set(side, 2.9, 9);
      pierGroup.add(topRail);

      for (let z = 3; z <= 15; z += 3) {
        const baluster = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.1, 8), railMat);
        baluster.position.set(side, 2.45, z);
        pierGroup.add(baluster);
      }
    }

    for (let i = 0; i < 5; i++) {
      const step = new THREE.Mesh(new THREE.BoxGeometry(11.2, 0.35, 1.1), woodMat);
      step.position.set(0, 1.6 - i * 0.3, -1.8 - i * 0.85);
      step.receiveShadow = true;
      pierGroup.add(step);
    }

    const ledge = new THREE.Mesh(new THREE.BoxGeometry(11.6, 0.35, 1.8), woodMat);
    ledge.position.set(0, 0.25, -5.4);
    pierGroup.add(ledge);

    this.scene.add(pierGroup);
  }

  initWaterfrontPavilion() {
    const salaGroup = new THREE.Group();
    salaGroup.position.set(0, this.GROUND_Y, 8);

    const woodMat = new THREE.MeshStandardMaterial({ color: 0x4e342e, roughness: 0.7 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.3, metalness: 0.7 });
    const roofMat = new THREE.MeshStandardMaterial({ color: 0xb71c1c, roughness: 0.4 });

    const posts = [[-4.8, -3.5], [4.8, -3.5], [-4.8, 3.5], [4.8, 3.5]];
    for (const [px, pz] of posts) {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 4.4, 12), woodMat);
      col.position.set(px, 2.2, pz);
      salaGroup.add(col);
    }

    const roof = new THREE.Mesh(new THREE.ConeGeometry(7.5, 3.2, 4), roofMat);
    roof.position.set(0, 5.6, 0);
    roof.rotation.y = Math.PI / 4;
    salaGroup.add(roof);

    const spire = new THREE.Mesh(new THREE.ConeGeometry(0.18, 2.0, 8), goldMat);
    spire.position.set(0, 8.0, 0);
    salaGroup.add(spire);

    const lantern = new THREE.Mesh(
      new THREE.SphereGeometry(0.35, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xff8800, emissiveIntensity: 2.5 })
    );
    lantern.position.set(0, 3.8, 0);
    salaGroup.add(lantern);

    this.scene.add(salaGroup);
  }

  initMaeKhongkhaShrine() {
    const shrineGroup = new THREE.Group();
    shrineGroup.position.set(-14, this.GROUND_Y, 10);

    const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.3, metalness: 0.7 });
    const clothMat = new THREE.MeshStandardMaterial({ color: 0xffc107, roughness: 0.5 });

    const table = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.0, 1.8), clothMat);
    table.position.y = 0.5;
    shrineGroup.add(table);

    const statue = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.38, 1.1, 12), goldMat);
    statue.position.set(0, 1.55, 0);
    shrineGroup.add(statue);

    const censer = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.2, 0.35, 12), goldMat);
    censer.position.set(0, 1.17, 0.5);
    shrineGroup.add(censer);

    for (let i = 0; i < 5; i++) {
      const stick = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.015, 0.55, 6),
        new THREE.MeshBasicMaterial({ color: 0xff1744 })
      );
      stick.position.set((Math.random() - 0.5) * 0.15, 1.45, 0.5 + (Math.random() - 0.5) * 0.15);
      shrineGroup.add(stick);
    }

    this.scene.add(shrineGroup);
  }

  initGrandTempleArch() {
    const archGroup = new THREE.Group();
    archGroup.position.set(0, this.GROUND_Y, 22);

    const pillarMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.25, metalness: 0.8 });
    const roofMat = new THREE.MeshStandardMaterial({ color: 0xb71c1c, roughness: 0.4 });

    for (const x of [-9, 9]) {
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.75, 9.0, 16), pillarMat);
      pillar.position.set(x, 4.5, 0);
      archGroup.add(pillar);

      const cap = new THREE.Mesh(new THREE.ConeGeometry(0.95, 0.7, 12), goldMat);
      cap.position.set(x, 9.2, 0);
      archGroup.add(cap);
    }

    const beam = new THREE.Mesh(new THREE.BoxGeometry(20, 0.9, 1.4), goldMat);
    beam.position.set(0, 8.8, 0);
    archGroup.add(beam);

    for (let t = 0; t < 3; t++) {
      const width = 20.0 - t * 3.5;
      const depth = 5.0 - t * 0.8;
      const height = 0.85;

      const roofSlab = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), roofMat);
      roofSlab.position.set(0, 9.6 + t * 0.95, 0);
      archGroup.add(roofSlab);

      const ridge = new THREE.Mesh(new THREE.BoxGeometry(width + 0.5, 0.2, 0.4), goldMat);
      ridge.position.set(0, 9.6 + t * 0.95 + height / 2 + 0.1, 0);
      archGroup.add(ridge);
    }

    const finial = new THREE.Mesh(new THREE.ConeGeometry(0.25, 2.2, 8), goldMat);
    finial.position.set(0, 13.0, 0);
    archGroup.add(finial);

    // Double-sided 3D Signboard
    const signCanvas = document.createElement('canvas');
    signCanvas.width = 1024;
    signCanvas.height = 256;
    const sctx = signCanvas.getContext('2d');

    sctx.fillStyle = '#881337';
    sctx.fillRect(0, 0, 1024, 256);
    sctx.strokeStyle = '#ffd700';
    sctx.lineWidth = 14;
    sctx.strokeRect(10, 10, 1004, 236);

    sctx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
    sctx.lineWidth = 4;
    sctx.strokeRect(24, 24, 976, 208);

    sctx.fillStyle = '#ffd700';
    sctx.font = 'bold 54px Prompt, -apple-system, sans-serif';
    sctx.textAlign = 'center';
    sctx.fillText('งานประเพณีลอยกระทง วัดคงคาราม', 512, 108);

    sctx.fillStyle = '#ffffff';
    sctx.font = '32px Prompt, -apple-system, sans-serif';
    sctx.fillText('ขอขมาพระแม่คงคา • ชมดนตรีไทย • อาหารงานวัด', 512, 180);

    const signTex = new THREE.CanvasTexture(signCanvas);

    const signFrame = new THREE.Mesh(
      new THREE.BoxGeometry(10.8, 2.7, 0.35),
      new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.6 })
    );
    signFrame.position.set(0, 7.2, 0);
    archGroup.add(signFrame);

    const frontSign = new THREE.Mesh(new THREE.PlaneGeometry(10.4, 2.4), new THREE.MeshBasicMaterial({ map: signTex }));
    frontSign.position.set(0, 7.2, -0.19);
    frontSign.rotation.y = Math.PI;
    archGroup.add(frontSign);

    const backSign = new THREE.Mesh(new THREE.PlaneGeometry(10.4, 2.4), new THREE.MeshBasicMaterial({ map: signTex }));
    backSign.position.set(0, 7.2, 0.19);
    archGroup.add(backSign);

    this.scene.add(archGroup);
  }

  initMarketAvenue() {
    const stallsGroup = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.7 });

    const createStall = (title, color1, color2, x, z, rotY) => {
      const stall = new THREE.Group();
      stall.position.set(x, this.GROUND_Y, z);
      stall.rotation.y = rotY;

      const counter = new THREE.Mesh(new THREE.BoxGeometry(4.8, 1.1, 2.2), woodMat);
      counter.position.y = 0.55;
      stall.add(counter);

      for (const px of [-2.2, 2.2]) {
        for (const pz of [-1.0, 1.0]) {
          const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 3.2, 8), woodMat);
          pole.position.set(px, 1.6, pz);
          stall.add(pole);
        }
      }

      for (let s = 0; s < 7; s++) {
        const mat = new THREE.MeshStandardMaterial({
          color: s % 2 === 0 ? color1 : color2,
          roughness: 0.5
        });
        const strip = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.1, 2.8), mat);
        strip.position.set(-2.1 + s * 0.7, 3.1 - (s % 2) * 0.04, 0);
        strip.rotation.x = 0.2;
        stall.add(strip);
      }

      const lantern = new THREE.Mesh(
        new THREE.SphereGeometry(0.24, 10, 10),
        new THREE.MeshStandardMaterial({ color: 0xffd54f, emissive: 0xff9900, emissiveIntensity: 2.2 })
      );
      lantern.position.set(0, 2.8, 0.5);
      stall.add(lantern);

      return stall;
    };

    stallsGroup.add(createStall('ร้านกระทง', 0x2e7d32, 0xffeb3b, -20, 32, 0.3));
    stallsGroup.add(createStall('ร้านผัดไทย', 0xd32f2f, 0xffffff, -20, 46, 0.15));
    stallsGroup.add(createStall('ร้านลูกชิ้นปิ้ง', 0xff9800, 0x5d4037, -20, 60, 0.15));
    stallsGroup.add(createStall('ร้านขนมเบื้อง', 0x9c27b0, 0xffeb3b, -20, 74, 0.2));

    stallsGroup.add(createStall('ร้านน้ำสมุนไพร', 0x00bcd4, 0xffffff, 20, 32, -0.3));
    stallsGroup.add(createStall('ซุ้มปาโป่ง', 0x1976d2, 0xffd600, 20, 46, -0.15));
    stallsGroup.add(createStall('ซุ้มตักปลา', 0x00e676, 0xffffff, 20, 60, -0.15));
    stallsGroup.add(createStall('ร้านสายไหม', 0xff4081, 0xffeb3b, 20, 74, -0.2));

    this.scene.add(stallsGroup);
  }

  /**
   * Dining Plaza WITH PROPER ENTRANCE ARCHWAY (No floating sign!)
   */
  initDiningPlazaWithArch() {
    const diningGroup = new THREE.Group();
    diningGroup.position.set(52, this.GROUND_Y, 52);

    const woodMat = new THREE.MeshStandardMaterial({ color: 0x4e342e });
    const tableMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.6 });
    const redChairMat = new THREE.MeshStandardMaterial({ color: 0xd32f2f, roughness: 0.5 });
    const blueChairMat = new THREE.MeshStandardMaterial({ color: 0x1976d2, roughness: 0.5 });
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x757575, roughness: 0.4 });

    // 1. Food Court Entrance Archway Gate (ซุ้มประตูทางเข้าโซนอาหารพร้อมเสาจริง)
    const arch = new THREE.Group();
    arch.position.set(0, 0, -18);

    // Left and Right Posts
    for (const px of [-4.5, 4.5]) {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 4.8, 10), woodMat);
      p.position.set(px, 2.4, 0);
      arch.add(p);
    }
    // Top wooden beam
    const topBeam = new THREE.Mesh(new THREE.BoxGeometry(10.5, 0.35, 0.4), woodMat);
    topBeam.position.set(0, 4.8, 0);
    arch.add(topBeam);

    // Double-sided carved signboard on archway
    const sCanvas = document.createElement('canvas');
    sCanvas.width = 512;
    sCanvas.height = 128;
    const sctx = sCanvas.getContext('2d');
    sctx.fillStyle = '#1e3a8a';
    sctx.fillRect(0, 0, 512, 128);
    sctx.strokeStyle = '#ffd700';
    sctx.lineWidth = 6;
    sctx.strokeRect(6, 6, 500, 116);

    sctx.fillStyle = '#ffd700';
    sctx.font = 'bold 34px Prompt, sans-serif';
    sctx.textAlign = 'center';
    sctx.fillText('🍜 โซนลานอาหารงานวัด', 256, 55);
    sctx.fillStyle = '#ffffff';
    sctx.font = '22px Prompt, sans-serif';
    sctx.fillText('FOOD COURT & DINING PLAZA', 256, 95);

    const sTex = new THREE.CanvasTexture(sCanvas);

    // Sign plate box
    const sPlate = new THREE.Mesh(new THREE.BoxGeometry(7.2, 1.6, 0.15), woodMat);
    sPlate.position.set(0, 3.8, 0);
    arch.add(sPlate);

    // Front & Back faces
    const fFace = new THREE.Mesh(new THREE.PlaneGeometry(7.0, 1.45), new THREE.MeshBasicMaterial({ map: sTex }));
    fFace.position.set(0, 3.8, -0.09);
    fFace.rotation.y = Math.PI;
    arch.add(fFace);

    const bFace = new THREE.Mesh(new THREE.PlaneGeometry(7.0, 1.45), new THREE.MeshBasicMaterial({ map: sTex }));
    bFace.position.set(0, 3.8, 0.09);
    arch.add(bFace);

    diningGroup.add(arch);

    // 2. Dining Tables with Parasols
    const umbrellaColors = [0xff9800, 0x4caf50, 0xe91e63, 0x00bcd4, 0xffeb3b, 0x9c27b0];
    const tableSpots = [
      { x: -9, z: -10 }, { x: 0, z: -10 }, { x: 9, z: -10 },
      { x: -9, z: 0 },   { x: 9, z: 0 },
      { x: -9, z: 10 },  { x: 0, z: 10 },  { x: 9, z: 10 }
    ];

    tableSpots.forEach((spot, idx) => {
      const set = new THREE.Group();
      set.position.set(spot.x, 0, spot.z);

      const table = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 0.1, 16), tableMat);
      table.position.y = 0.95;
      set.add(table);

      const tableLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.25, 0.95, 8), poleMat);
      tableLeg.position.y = 0.475;
      set.add(tableLeg);

      const umbColor = umbrellaColors[idx % umbrellaColors.length];
      const umbrella = new THREE.Mesh(
        new THREE.ConeGeometry(2.1, 0.9, 12),
        new THREE.MeshStandardMaterial({ color: umbColor, side: THREE.DoubleSide })
      );
      umbrella.position.y = 3.2;
      set.add(umbrella);

      const umbPole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3.2, 8), poleMat);
      umbPole.position.y = 1.6;
      set.add(umbPole);

      for (let c = 0; c < 4; c++) {
        const angle = (c * Math.PI * 2) / 4;
        const chairGroup = new THREE.Group();
        chairGroup.position.set(Math.cos(angle) * 1.8, 0, Math.sin(angle) * 1.8);
        chairGroup.rotation.y = -angle - Math.PI / 2;

        const chairMat = c % 2 === 0 ? redChairMat : blueChairMat;
        const seat = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.08, 0.55), chairMat);
        seat.position.y = 0.55;
        chairGroup.add(seat);

        const back = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.5, 0.06), chairMat);
        back.position.set(0, 0.82, -0.25);
        chairGroup.add(back);

        for (const lx of [-0.22, 0.22]) {
          for (const lz of [-0.22, 0.22]) {
            const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.55, 6), chairMat);
            leg.position.set(lx, 0.275, lz);
            chairGroup.add(leg);
          }
        }
        set.add(chairGroup);
      }

      const plate = new THREE.Mesh(
        new THREE.CylinderGeometry(0.24, 0.22, 0.04, 10),
        new THREE.MeshStandardMaterial({ color: 0xffffff })
      );
      plate.position.set(0.4, 1.02, 0.3);
      set.add(plate);

      const cup = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.06, 0.2, 8),
        new THREE.MeshStandardMaterial({ color: 0xff80ab })
      );
      cup.position.set(-0.4, 1.1, -0.2);
      set.add(cup);

      diningGroup.add(set);
    });

    this.scene.add(diningGroup);
  }

  initRestroomComplex() {
    const rrGroup = new THREE.Group();
    rrGroup.position.set(88, this.GROUND_Y, 52);
    rrGroup.rotation.y = -Math.PI / 2;

    const wallMat = new THREE.MeshStandardMaterial({ color: 0xe0e0e0, roughness: 0.6 });
    const roofMat = new THREE.MeshStandardMaterial({ color: 0xbf360c, roughness: 0.4 });
    const doorMat = new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.7 });

    const building = new THREE.Mesh(new THREE.BoxGeometry(11, 4.4, 6.5), wallMat);
    building.position.y = 2.2;
    rrGroup.add(building);

    const roof = new THREE.Mesh(new THREE.ConeGeometry(8.0, 2.2, 4), roofMat);
    roof.scale.set(1.5, 1, 0.9);
    roof.position.set(0, 5.2, 0);
    roof.rotation.y = Math.PI / 4;
    rrGroup.add(roof);

    for (const dx of [-2.6, 2.6]) {
      const door = new THREE.Mesh(new THREE.BoxGeometry(1.7, 2.8, 0.1), doorMat);
      door.position.set(dx, 1.4, 3.3);
      rrGroup.add(door);
    }

    const signCanvas = document.createElement('canvas');
    signCanvas.width = 512;
    signCanvas.height = 128;
    const sctx = signCanvas.getContext('2d');
    sctx.fillStyle = '#0284c7';
    sctx.fillRect(0, 0, 512, 128);
    sctx.strokeStyle = '#ffffff';
    sctx.lineWidth = 6;
    sctx.strokeRect(6, 6, 500, 116);

    sctx.fillStyle = '#ffffff';
    sctx.font = 'bold 36px Prompt, sans-serif';
    sctx.textAlign = 'center';
    sctx.fillText('🚻 ห้องน้ำ (RESTROOMS)', 256, 55);
    sctx.font = '24px Prompt, sans-serif';
    sctx.fillText('ชาย (MEN)  |  หญิง (WOMEN)', 256, 95);

    const signTex = new THREE.CanvasTexture(signCanvas);
    const sign = new THREE.Mesh(
      new THREE.PlaneGeometry(5.2, 1.3),
      new THREE.MeshBasicMaterial({ map: signTex })
    );
    sign.position.set(0, 3.6, 3.35);
    rrGroup.add(sign);

    const sinkCounter = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 1.0, 1.2),
      new THREE.MeshStandardMaterial({ color: 0xb0bec5 })
    );
    sinkCounter.position.set(0, 0.5, 4.6);
    rrGroup.add(sinkCounter);

    this.scene.add(rrGroup);
  }

  /**
   * Grand Performance Stage WITH 2-SIDED BACKDROP (Front & Backstage Wall!)
   */
  initGrandPerformanceStage() {
    const stageZone = new THREE.Group();
    stageZone.position.set(0, this.GROUND_Y, 105);

    const woodMat = new THREE.MeshStandardMaterial({ color: 0x4e342e });
    const trussMat = new THREE.MeshStandardMaterial({ color: 0x78909c, metalness: 0.8, roughness: 0.3 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.3, metalness: 0.7 });

    // Stage Platform
    const stage = new THREE.Mesh(new THREE.BoxGeometry(18, 1.4, 10), woodMat);
    stage.position.y = 0.7;
    stageZone.add(stage);

    const step = new THREE.Mesh(new THREE.BoxGeometry(8, 0.7, 1.2), woodMat);
    step.position.set(0, 0.35, 5.6);
    stageZone.add(step);

    // Truss Columns
    for (const tx of [-9, 9]) {
      const colBack = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 8.5, 8), trussMat);
      colBack.position.set(tx, 4.5, -4.5);
      stageZone.add(colBack);

      const colFront = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 8.5, 8), trussMat);
      colFront.position.set(tx, 4.5, 4.5);
      stageZone.add(colFront);
    }
    const topBack = new THREE.Mesh(new THREE.BoxGeometry(18.5, 0.3, 0.3), trussMat);
    topBack.position.set(0, 8.6, -4.5);
    stageZone.add(topBack);

    const topFront = new THREE.Mesh(new THREE.BoxGeometry(18.5, 0.3, 0.3), trussMat);
    topFront.position.set(0, 8.6, 4.5);
    stageZone.add(topFront);

    // Spotlights (Balanced emissive, NOT overblown!)
    const spotColors = [0xff1744, 0xffea00, 0x00e676, 0x2979ff, 0xd500f9];
    for (let s = 0; s < 7; s++) {
      const col = spotColors[s % spotColors.length];
      const spotMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.3, 0.5, 8),
        new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 1.8 })
      );
      spotMesh.position.set(-6 + s * 2, 8.3, 4.5);
      spotMesh.rotation.x = Math.PI / 4;
      stageZone.add(spotMesh);
    }

    // -------------------------------------------------------------
    // STAGE BACKDROP: SOLID 3D WALL WITH BOTH FRONT & BACK SIDES!
    // Stage platform is at Z=105. Audience is at Z=95..100 (-Z relative to stage).
    // Backstage / parking lot is at Z=120..145 (+Z relative to stage).
    // -------------------------------------------------------------
    const backdropBox = new THREE.Mesh(
      new THREE.BoxGeometry(16.5, 6.5, 0.4),
      new THREE.MeshStandardMaterial({ color: 0x2b1d0c, roughness: 0.8 })
    );
    backdropBox.position.set(0, 4.65, 3.8); // Located at rear of stage platform
    stageZone.add(backdropBox);

    // FRONT BANNER CANVAS (Facing audience at -Z / toward pier)
    const frontCanvas = document.createElement('canvas');
    frontCanvas.width = 1024;
    frontCanvas.height = 512;
    const fctx = frontCanvas.getContext('2d');
    fctx.fillStyle = '#6b114d';
    fctx.fillRect(0, 0, 1024, 512);
    fctx.strokeStyle = '#ffd700';
    fctx.lineWidth = 16;
    fctx.strokeRect(10, 10, 1004, 492);

    fctx.fillStyle = '#ffd700';
    fctx.font = 'bold 50px Prompt, sans-serif';
    fctx.textAlign = 'center';
    fctx.fillText('เวทีการแสดงดนตรีไทยและรำวงย้อนยุค', 512, 160);
    fctx.fillStyle = '#ffffff';
    fctx.font = '32px Prompt, sans-serif';
    fctx.fillText('งานเทศกาลลอยกระทง วัดคงคาราม', 512, 240);
    fctx.fillStyle = '#f472b6';
    fctx.font = '28px Prompt, sans-serif';
    fctx.fillText('✨ ยินดีต้อนรับทุกท่านร่วมสนุกและสืบสานประเพณี ✨', 512, 320);

    const fTex = new THREE.CanvasTexture(frontCanvas);
    const frontPlane = new THREE.Mesh(new THREE.PlaneGeometry(16.4, 6.4), new THREE.MeshBasicMaterial({ map: fTex }));
    frontPlane.position.set(0, 4.65, 3.58);
    // Faces -Z towards the audience and fairground
    frontPlane.rotation.y = Math.PI;
    stageZone.add(frontPlane);

    // BACKSTAGE WALL CANVAS (Facing parking lot at +Z)
    const backCanvas = document.createElement('canvas');
    backCanvas.width = 1024;
    backCanvas.height = 512;
    const bctx = backCanvas.getContext('2d');
    bctx.fillStyle = '#1e293b';
    bctx.fillRect(0, 0, 1024, 512);
    bctx.strokeStyle = '#475569';
    bctx.lineWidth = 10;
    bctx.strokeRect(10, 10, 1004, 492);

    bctx.fillStyle = '#94a3b8';
    bctx.font = 'bold 56px Prompt, sans-serif';
    bctx.textAlign = 'center';
    bctx.fillText('🚪 โซนหลังเวที (BACKSTAGE)', 512, 180);
    bctx.font = '32px Prompt, sans-serif';
    bctx.fillText('เฉพาะนักแสดงและทีมงานเครื่องเสียงเท่านั้น', 512, 260);
    bctx.fillStyle = '#f59e0b';
    bctx.font = '26px Prompt, sans-serif';
    bctx.fillText('STAFF & PERFORMERS ONLY', 512, 330);

    const bTex = new THREE.CanvasTexture(backCanvas);
    const backPlane = new THREE.Mesh(new THREE.PlaneGeometry(16.4, 6.4), new THREE.MeshBasicMaterial({ map: bTex }));
    backPlane.position.set(0, 4.65, 4.02);
    // Faces +Z towards parking lot
    backPlane.rotation.y = 0;
    stageZone.add(backPlane);

    // Instruments on Stage
    const drum = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.2, 1.8, 16),
      new THREE.MeshStandardMaterial({ color: 0xd7ccc8 })
    );
    drum.position.set(-5.5, 2.2, -1.5);
    drum.rotation.z = 0.25;
    stageZone.add(drum);

    const ranat = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.4, 0.6), goldMat);
    ranat.position.set(0, 1.6, -1.5);
    stageZone.add(ranat);

    const gongRing = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.08, 8, 24), goldMat);
    gongRing.position.set(5.5, 2.0, -1.5);
    gongRing.rotation.x = Math.PI / 2;
    stageZone.add(gongRing);

    // Audience Benches
    for (let r = 0; r < 3; r++) {
      const bench = new THREE.Mesh(
        new THREE.BoxGeometry(14, 0.45, 0.8),
        new THREE.MeshStandardMaterial({ color: 0x5d4037 })
      );
      bench.position.set(0, 0.25, 10 + r * 3.5);
      stageZone.add(bench);
    }

    this.scene.add(stageZone);
  }

  /**
   * Rear Parking Lot WITH SOLID POST-MOUNTED SIGN!
   */
  initParkingLotZone() {
    const parkingGroup = new THREE.Group();
    parkingGroup.position.set(0, this.GROUND_Y, 145);

    const asphaltMat = new THREE.MeshStandardMaterial({ color: 0x1f2429, roughness: 0.9 });
    const asphalt = new THREE.Mesh(new THREE.BoxGeometry(160, 0.05, 55), asphaltMat);
    asphalt.position.y = 0.02;
    parkingGroup.add(asphalt);

    const lineMat = new THREE.MeshBasicMaterial({ color: 0xf1f5f9 });
    const centerLine = new THREE.Mesh(new THREE.BoxGeometry(140, 0.06, 0.2), lineMat);
    centerLine.position.set(0, 0.05, 0);
    parkingGroup.add(centerLine);

    for (let i = -6; i <= 6; i++) {
      const x = i * 10;
      const slotN = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.06, 12), lineMat);
      slotN.position.set(x, 0.05, -12);
      parkingGroup.add(slotN);

      const slotS = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.06, 12), lineMat);
      slotS.position.set(x, 0.05, 12);
      parkingGroup.add(slotS);
    }

    const createPickupTruck = (color) => {
      const truck = new THREE.Group();
      const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.35, metalness: 0.3 });
      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 });
      const glassMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.1 });

      const cab = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.3, 2.0), bodyMat);
      cab.position.set(0, 1.25, 0.6);
      truck.add(cab);

      const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.7, 0.1), glassMat);
      windshield.position.set(0, 1.45, -0.42);
      truck.add(windshield);

      const hood = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.75, 1.6), bodyMat);
      hood.position.set(0, 0.8, -1.2);
      truck.add(hood);

      const bed = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.85, 2.5), bodyMat);
      bed.position.set(0, 0.85, 2.6);
      truck.add(bed);

      const wheelGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.28, 12);
      wheelGeo.rotateZ(Math.PI / 2);
      for (const [wx, wy, wz] of [[-1.15, 0.38, -1.2], [1.15, 0.38, -1.2], [-1.15, 0.38, 2.6], [1.15, 0.38, 2.6]]) {
        const wheel = new THREE.Mesh(wheelGeo, wheelMat);
        wheel.position.set(wx, wy, wz);
        truck.add(wheel);
      }
      return truck;
    };

    const createSedan = (color) => {
      const car = new THREE.Group();
      const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.3, metalness: 0.4 });
      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 });
      const glassMat = new THREE.MeshStandardMaterial({ color: 0x0369a1, roughness: 0.1 });

      const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.75, 4.4), bodyMat);
      lowerBody.position.y = 0.75;
      car.add(lowerBody);

      const roofCabin = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.7, 2.2), glassMat);
      roofCabin.position.set(0, 1.45, 0);
      car.add(roofCabin);

      const wheelGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.25, 12);
      wheelGeo.rotateZ(Math.PI / 2);
      for (const [wx, wy, wz] of [[-1.08, 0.34, -1.3], [1.08, 0.34, -1.3], [-1.08, 0.34, 1.3], [1.08, 0.34, 1.3]]) {
        const wheel = new THREE.Mesh(wheelGeo, wheelMat);
        wheel.position.set(wx, wy, wz);
        car.add(wheel);
      }
      return car;
    };

    const t1 = createPickupTruck(0xf8fafc); t1.position.set(-45, 0, -12); parkingGroup.add(t1);
    const s1 = createSedan(0x1e3a8a);       s1.position.set(-25, 0, -12); parkingGroup.add(s1);
    const t2 = createPickupTruck(0x78716c); t2.position.set(-5, 0, -12);  parkingGroup.add(t2);
    const s2 = createSedan(0xdc2626);       s2.position.set(15, 0, -12);  parkingGroup.add(s2);
    const t3 = createPickupTruck(0xf59e0b); t3.position.set(35, 0, -12);  parkingGroup.add(t3);

    const p6 = createSedan(0xffffff); p6.position.set(-35, 0, 12); p6.rotation.y = Math.PI; parkingGroup.add(p6);
    const p7 = createPickupTruck(0x166534); p7.position.set(-15, 0, 12); p7.rotation.y = Math.PI; parkingGroup.add(p7);
    const p8 = createSedan(0x18181b); p8.position.set(25, 0, 12); p8.rotation.y = Math.PI; parkingGroup.add(p8);

    // Stage crew van behind stage
    const crewVan = createPickupTruck(0x334155);
    crewVan.scale.set(1.2, 1.2, 1.2);
    crewVan.position.set(0, 0, -25);
    parkingGroup.add(crewVan);

    // -------------------------------------------------------------
    // PARKING LOT SIGN: PROPER STURDY POLE-MOUNTED SIGNBOARD!
    // -------------------------------------------------------------
    const signGroup = new THREE.Group();
    signGroup.position.set(-55, 0, 0);

    const steelMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.3 });
    // Two steel poles anchored into ground!
    for (const sx of [-2.5, 2.5]) {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 5.0, 8), steelMat);
      pole.position.set(sx, 2.5, 0);
      signGroup.add(pole);
    }

    const pSignCanvas = document.createElement('canvas');
    pSignCanvas.width = 512;
    pSignCanvas.height = 160;
    const psctx = pSignCanvas.getContext('2d');
    psctx.fillStyle = '#1e3a8a';
    psctx.fillRect(0, 0, 512, 160);
    psctx.strokeStyle = '#ffffff';
    psctx.lineWidth = 6;
    psctx.strokeRect(6, 6, 500, 148);

    psctx.fillStyle = '#ffffff';
    psctx.font = 'bold 38px Prompt, sans-serif';
    psctx.textAlign = 'center';
    psctx.fillText('🅿️ ลานจอดรถงานวัด', 256, 60);
    psctx.font = '22px Prompt, sans-serif';
    psctx.fillText('PARKING LOT', 256, 100);
    psctx.fillText('รถยนต์และรถจักรยานยนต์', 256, 135);

    const pSignTex = new THREE.CanvasTexture(pSignCanvas);

    // Sign plate box
    const signBoard = new THREE.Mesh(
      new THREE.BoxGeometry(6.4, 2.0, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x1e293b })
    );
    signBoard.position.set(0, 4.0, 0);
    signGroup.add(signBoard);

    // Front & Back faces
    const pf = new THREE.Mesh(new THREE.PlaneGeometry(6.2, 1.85), new THREE.MeshBasicMaterial({ map: pSignTex }));
    pf.position.set(0, 4.0, 0.11);
    signGroup.add(pf);

    const pb = new THREE.Mesh(new THREE.PlaneGeometry(6.2, 1.85), new THREE.MeshBasicMaterial({ map: pSignTex }));
    pb.position.set(0, 4.0, -0.11);
    pb.rotation.y = Math.PI;
    signGroup.add(pb);

    parkingGroup.add(signGroup);

    this.scene.add(parkingGroup);
  }

  /**
   * Animated Ferris Wheel (ชิงช้าสวรรค์หมุนได้จริง) & Carnival Attractions
   * Fills empty open space on West Side (X = -28 to -40, Z = 26)
   */
  initFerrisWheelAndRides() {
    const rideGroup = new THREE.Group();
    rideGroup.position.set(-35, this.GROUND_Y, 26);

    const steelMat = new THREE.MeshStandardMaterial({ color: 0x90caf9, metalness: 0.8, roughness: 0.3 });
    const neonColors = [0xff1744, 0x00e676, 0xffea00, 0x00e5ff, 0xd500f9, 0xff9100];

    // 1. Two A-Frame Support Legs
    for (const side of [-1.8, 1.8]) {
      const leg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.28, 16.5, 8), steelMat);
      leg1.position.set(side, 8.0, -3.2);
      leg1.rotation.x = -0.38;
      rideGroup.add(leg1);

      const leg2 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.28, 16.5, 8), steelMat);
      leg2.position.set(side, 8.0, 3.2);
      leg2.rotation.x = 0.38;
      rideGroup.add(leg2);
    }

    // 2. Spinning Rotor Wheel (Rotates in update loop!)
    this.ferrisWheelRotor = new THREE.Group();
    this.ferrisWheelRotor.position.set(0, 13.5, 0);

    // Center Axle
    const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 4.2, 12), steelMat);
    axle.rotation.z = Math.PI / 2;
    this.ferrisWheelRotor.add(axle);

    // 2 Large Rings (Outer wheel rings)
    for (const rx of [-1.2, 1.2]) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(10.5, 0.14, 8, 32),
        new THREE.MeshStandardMaterial({ color: 0xffd54f, emissive: 0xffaa00, emissiveIntensity: 1.2 })
      );
      ring.position.set(rx, 0, 0);
      ring.rotation.y = Math.PI / 2;
      this.ferrisWheelRotor.add(ring);
    }

    // 12 Spokes & 12 Gondolas (กระเช้าชิงช้าสวรรค์)
    const spokeCount = 12;
    this.gondolas = [];

    for (let i = 0; i < spokeCount; i++) {
      const angle = (i * Math.PI * 2) / spokeCount;

      // Spoke struts
      for (const rx of [-1.2, 1.2]) {
        const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 21, 6), steelMat);
        spoke.position.set(rx, 0, 0);
        spoke.rotation.x = angle;
        this.ferrisWheelRotor.add(spoke);
      }

      // Glowing Neon Bulb on spoke tip
      const col = neonColors[i % neonColors.length];
      const bulb = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 8, 8),
        new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 3.5 })
      );
      bulb.position.set(0, Math.sin(angle) * 10.5, Math.cos(angle) * 10.5);
      this.ferrisWheelRotor.add(bulb);

      // Hanging Passenger Gondola (กระเช้า)
      const gondola = new THREE.Group();
      gondola.position.set(0, Math.sin(angle) * 10.5, Math.cos(angle) * 10.5);

      const gColor = neonColors[(i + 2) % neonColors.length];
      const gBox = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 1.4, 1.4),
        new THREE.MeshStandardMaterial({ color: gColor, roughness: 0.4 })
      );
      gBox.position.y = -0.7;
      gondola.add(gBox);

      this.ferrisWheelRotor.add(gondola);
      this.gondolas.push(gondola);
    }

    rideGroup.add(this.ferrisWheelRotor);

    // Ferris Wheel Ticket Booth
    const booth = new THREE.Mesh(
      new THREE.BoxGeometry(2.8, 2.2, 2.2),
      new THREE.MeshStandardMaterial({ color: 0x0284c7 })
    );
    booth.position.set(0, 1.1, 8.5);
    rideGroup.add(booth);

    // 3. Carousel / Merry-Go-Round (ม้าหมุนงานวัดพร้อมหลังคาสีสันสดใส)
    const carouselGroup = new THREE.Group();
    carouselGroup.position.set(0, 0, -22); // Placed at X=-35, Z=4

    // Carousel Base Platform
    const cBase = new THREE.Mesh(
      new THREE.CylinderGeometry(5.2, 5.5, 0.4, 20),
      new THREE.MeshStandardMaterial({ color: 0xffd54f, roughness: 0.4 })
    );
    cBase.position.y = 0.2;
    carouselGroup.add(cBase);

    // Center ornate column
    const cCenter = new THREE.Mesh(
      new THREE.CylinderGeometry(0.6, 0.8, 4.2, 12),
      new THREE.MeshStandardMaterial({ color: 0x880e4f, roughness: 0.3 })
    );
    cCenter.position.y = 2.3;
    carouselGroup.add(cCenter);

    // Rotating canopy & horses
    this.carouselRotor = new THREE.Group();
    this.carouselRotor.position.y = 0.4;

    const cRoof = new THREE.Mesh(
      new THREE.ConeGeometry(5.4, 1.8, 16),
      new THREE.MeshStandardMaterial({ color: 0xd81b60, roughness: 0.3 })
    );
    cRoof.position.y = 4.4;
    this.carouselRotor.add(cRoof);

    // Spire
    const cSpire = new THREE.Mesh(
      new THREE.ConeGeometry(0.18, 1.4, 8),
      new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.7 })
    );
    cSpire.position.y = 5.8;
    this.carouselRotor.add(cSpire);

    // Carousel mounts / horses (6 around perimeter)
    const horseColors = [0xffffff, 0x8d6e63, 0xffd54f, 0x42a5f5, 0xab47bc, 0x26a69a];
    for (let h = 0; h < 6; h++) {
      const hAngle = (h * Math.PI * 2) / 6;
      const hx = Math.cos(hAngle) * 3.6;
      const hz = Math.sin(hAngle) * 3.6;

      // Brass pole
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 3.8, 8),
        new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8, roughness: 0.2 })
      );
      pole.position.set(hx, 1.9, hz);
      this.carouselRotor.add(pole);

      // Horse body
      const horse = new THREE.Group();
      horse.position.set(hx, 1.4, hz);
      horse.rotation.y = -hAngle + Math.PI / 2;

      const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.45, 0.5, 1.2),
        new THREE.MeshStandardMaterial({ color: horseColors[h % horseColors.length] })
      );
      horse.add(body);

      const saddle = new THREE.Mesh(
        new THREE.BoxGeometry(0.48, 0.12, 0.5),
        new THREE.MeshStandardMaterial({ color: 0xd32f2f })
      );
      saddle.position.y = 0.27;
      horse.add(saddle);

      this.carouselRotor.add(horse);
    }

    carouselGroup.add(this.carouselRotor);
    rideGroup.add(carouselGroup);

    this.scene.add(rideGroup);
  }

  initTempleSanctuary() {
    const sanctuaryGroup = new THREE.Group();
    sanctuaryGroup.position.set(-50, this.GROUND_Y, 62);

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      emissive: 0xffaa00,
      emissiveIntensity: 0.75,
      metalness: 0.85,
      roughness: 0.2
    });

    for (let i = 0; i < 4; i++) {
      const size = 14 - i * 2.2;
      const tier = new THREE.Mesh(new THREE.BoxGeometry(size, 1.4, size), goldMat);
      tier.position.y = i * 1.4 + 0.7;
      sanctuaryGroup.add(tier);
    }

    const ring = new THREE.Mesh(new THREE.CylinderGeometry(4.8, 5.4, 1.8, 8), goldMat);
    ring.position.y = 6.4;
    sanctuaryGroup.add(ring);

    const bell = new THREE.Mesh(
      new THREE.SphereGeometry(4.0, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.65),
      goldMat
    );
    bell.position.y = 7.8;
    bell.rotation.x = Math.PI;
    sanctuaryGroup.add(bell);

    for (let i = 0; i < 7; i++) {
      const r = 2.5 - i * 0.32;
      const spireRing = new THREE.Mesh(new THREE.CylinderGeometry(r, r + 0.1, 0.55, 16), goldMat);
      spireRing.position.y = 10.5 + i * 0.6;
      sanctuaryGroup.add(spireRing);
    }

    const needle = new THREE.Mesh(new THREE.ConeGeometry(0.48, 7.5, 16), goldMat);
    needle.position.y = 18.0;
    sanctuaryGroup.add(needle);

    this.scene.add(sanctuaryGroup);
  }

  initLanternPolesAndStrings() {
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x3e2723 });
    const bulbGeo = new THREE.SphereGeometry(0.12, 8, 8);
    const lightColors = [0xffea00, 0xff1744, 0x00e676, 0x2979ff, 0xff9100];

    const createPole = (x, z, height = 7.0) => {
      const pole = new THREE.Group();
      pole.position.set(x, this.GROUND_Y, z);

      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.4, 0.4, 8),
        new THREE.MeshStandardMaterial({ color: 0x9e9e9e })
      );
      base.position.y = 0.2;
      pole.add(base);

      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, height, 8), poleMat);
      col.position.y = height / 2;
      pole.add(col);

      const bar = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.12, 0.12), poleMat);
      bar.position.y = height - 0.2;
      pole.add(bar);

      const lantern = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 10, 10),
        new THREE.MeshStandardMaterial({ color: 0xffcc00, emissive: 0xffaa00, emissiveIntensity: 2.2 })
      );
      lantern.position.y = height - 0.6;
      pole.add(lantern);

      this.scene.add(pole);
      return new THREE.Vector3(x, this.GROUND_Y + height - 0.2, z);
    };

    const addStringBetweenPoles = (p1, p2, count = 12) => {
      for (let i = 0; i <= count; i++) {
        const t = i / count;
        const x = p1.x + (p2.x - p1.x) * t;
        const z = p1.z + (p2.z - p1.z) * t;
        const sag = Math.sin(t * Math.PI) * 0.8;
        const y = p1.y + (p2.y - p1.y) * t - sag;

        const col = lightColors[i % lightColors.length];
        const bulb = new THREE.Mesh(
          bulbGeo,
          new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 2.5 })
        );
        bulb.position.set(x, y, z);
        this.scene.add(bulb);
      }
    };

    const leftPoles = [
      createPole(-10, 24),
      createPole(-10, 44),
      createPole(-10, 64),
      createPole(-10, 84)
    ];

    const rightPoles = [
      createPole(10, 24),
      createPole(10, 44),
      createPole(10, 64),
      createPole(10, 84)
    ];

    for (let i = 0; i < leftPoles.length - 1; i++) {
      addStringBetweenPoles(leftPoles[i], leftPoles[i + 1], 12);
      addStringBetweenPoles(rightPoles[i], rightPoles[i + 1], 12);
      addStringBetweenPoles(leftPoles[i], rightPoles[i], 12);
    }
    addStringBetweenPoles(leftPoles[leftPoles.length - 1], rightPoles[rightPoles.length - 1], 12);
  }

  initPerimeterFoliage() {
    const palmPositions = [
      [55, 25], [70, 45], [80, 80],
      [-55, 25], [-70, 45], [-75, 80],
      [-50, 140], [50, 140], [0, 175]
    ];

    palmPositions.forEach(([x, z]) => {
      const tree = new THREE.Group();
      tree.position.set(x, this.GROUND_Y, z);

      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.55, 9, 8),
        new THREE.MeshStandardMaterial({ color: 0x4e342e, roughness: 0.85 })
      );
      trunk.position.y = 4.5;
      tree.add(trunk);

      const frondMat = new THREE.MeshStandardMaterial({
        color: 0x1b5e20,
        roughness: 0.7,
        side: THREE.DoubleSide
      });
      for (let i = 0; i < 7; i++) {
        const angle = (i * Math.PI * 2) / 7;
        const frond = new THREE.Mesh(new THREE.ConeGeometry(0.8, 4.5, 4), frondMat);
        frond.scale.set(1, 1, 0.15);
        frond.position.set(0, 9.0, 0);
        frond.rotation.y = angle;
        frond.rotation.z = 1.1;
        tree.add(frond);
      }
      this.scene.add(tree);
    });
  }

  update(time) {
    // Rotate Ferris Wheel continuously
    if (this.ferrisWheelRotor) {
      this.ferrisWheelRotor.rotation.x = time * 0.35;

      // Keep hanging gondolas upright with gravity!
      if (this.gondolas) {
        for (const g of this.gondolas) {
          g.rotation.x = -this.ferrisWheelRotor.rotation.x;
        }
      }
    }

    // Rotate Carousel / Merry-Go-Round
    if (this.carouselRotor) {
      this.carouselRotor.rotation.y = time * 0.6;
    }
  }
}
