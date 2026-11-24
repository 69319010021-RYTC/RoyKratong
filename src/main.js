import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

import { Environment } from './scene/environment.js';
import { PierAndFair } from './scene/pier.js';
import { AnimatedCrowd } from './models/crowd.js';
import { createKrathong } from './models/krathong.js';
import { updateKrathongPhysics } from './systems/floatingPhysics.js';
import { FireworksSystem } from './systems/fireworks.js';
import { sounds } from './utils/soundEffects.js';

class App {
  constructor() {
    this.krathongs = [];
    this.userKrathong = null;
    this.cameraMode = 'orbit'; // 'orbit' | 'walk' | 'follow'
    this.hoveredKrathong = null;

    // First-Person Walk Controls State
    this.keys = {
      w: false, a: false, s: false, d: false,
      ArrowUp: false, ArrowLeft: false, ArrowDown: false, ArrowRight: false
    };
    this.walkYaw = 0;   // horizontal rotation angle
    this.walkPitch = 0; // vertical pitch angle
    this.isDraggingMouse = false;
    this.prevMousePos = { x: 0, y: 0 };

    this.initThree();
    this.initScene();
    this.initPrepopulatedKrathongs();
    this.initInteractions();
    this.initWalkControls();
    this.initUI();
    this.animate = this.animate.bind(this);

    window.addEventListener('resize', this.onWindowResize.bind(this));
    requestAnimationFrame(this.animate);
  }

  initThree() {
    this.container = document.getElementById('canvas-container');

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x132840, 0.0032); // Softer, brighter moonlit night mist

    // 2. Camera - panoramic vista showing both river and grand fairground
    this.camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.5,
      500
    );
    this.camera.position.set(0, 16, -24);

    // 3. Renderer with performance optimizations
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.28;
    this.container.appendChild(this.renderer.domElement);

    // 4. Orbit Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.02;
    this.controls.minDistance = 3;
    this.controls.maxDistance = 180;
    this.controls.target.set(0, 2.5, 30);

    // 5. Post-Processing: UnrealBloomPass
    const renderScene = new RenderPass(this.scene, this.camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(Math.floor(window.innerWidth / 2), Math.floor(window.innerHeight / 2)),
      1.15,
      0.4,
      0.75
    );

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(renderScene);
    this.composer.addPass(bloomPass);

    this.clock = new THREE.Clock();
  }

  initScene() {
    this.environment = new Environment(this.scene);
    this.pier = new PierAndFair(this.scene);
    this.crowd = new AnimatedCrowd(this.scene);
    this.fireworks = new FireworksSystem(this.scene);
  }

  initPrepopulatedKrathongs() {
    const sampleWishes = [
      { author: 'ครอบครัวสุขสมบูรณ์', wish: 'ขอขมาพระแม่คงคา ขอให้ครอบครัวมีแต่ความสุข ร่มเย็น สุขภาพแข็งแรงตลอดปี', style: 'traditional' },
      { author: 'นารี & กฤษณ์', wish: 'ขอให้ความรักยืนยาว มีแต่ความเข้าใจและสิ่งดีๆ เข้ามาในชีวิตคู่', style: 'lotus' },
      { author: 'น้องต้นกล้า', wish: 'ขอให้สอบติดคณะที่หวัง และขอให้พ่อแม่มีความสุขมากๆ ครับ', style: 'coconut' },
      { author: 'คุณยายสมศรี', wish: 'ขอให้ลูกหลานเจริญก้าวหน้า แคล้วคลาดปลอดภัยจากภยันตรายทั้งปวง', style: 'traditional' },
      { author: 'วัยรุ่นสายมู', wish: 'ขอให้การงานราบรื่น เงินทองไหลมาเทมา ปลดหนี้ปลดสิน สำเร็จทุกประการ', style: 'lotus' },
      { author: 'พี่เอก วิศวะ', wish: 'ขอขมาต่อสายน้ำที่ได้ใช้ประโยชน์ ขอให้ชีวิตราบรื่นเหมือนสายน้ำใส', style: 'coconut' },
      { author: 'กลุ่มเพื่อนสนิท', wish: 'มิตรภาพเหนียวแน่นตลอดไป ขอให้ทุกคนมีความสุขกับทุกวันของชีวิต', style: 'traditional' },
      { author: 'สายลม แสงดาว', wish: 'ขอให้จิตใจสงบร่มเย็น มีสติและพลังในการก้าวข้ามทุกอุปสรรค', style: 'lotus' }
    ];

    sampleWishes.forEach((item, idx) => {
      const krathong = createKrathong(item.style, {
        author: item.author,
        wish: item.wish,
        speed: 0.35 + Math.random() * 0.3
      });

      const spreadX = 40 - idx * 10 + (Math.random() - 0.5) * 6;
      const spreadZ = -8 - Math.random() * 26;
      krathong.position.set(spreadX, 0.2, spreadZ);

      this.scene.add(krathong);
      this.krathongs.push(krathong);
    });
  }

  initInteractions() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.wishPopup = document.getElementById('wish-popup');
    this.wishAuthorEl = document.getElementById('popup-author');
    this.wishTypeEl = document.getElementById('popup-type');
    this.wishTextEl = document.getElementById('popup-wish');

    const onPointerMove = (e) => {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      if (this.cameraMode !== 'walk') {
        this.checkRaycast(e.clientX, e.clientY);
      }
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('click', (e) => {
      sounds.init();
      if (this.cameraMode !== 'walk') {
        this.checkRaycast(e.clientX, e.clientY, true);
      }
    });
  }

  initWalkControls() {
    // Keyboard key listeners for WASD & Arrow Keys
    window.addEventListener('keydown', (e) => {
      const k = e.key.toLowerCase();
      if (k === 'w' || e.code === 'KeyW') this.keys.w = true;
      if (k === 'a' || e.code === 'KeyA') this.keys.a = true;
      if (k === 's' || e.code === 'KeyS') this.keys.s = true;
      if (k === 'd' || e.code === 'KeyD') this.keys.d = true;
      if (e.key === 'ArrowUp') this.keys.ArrowUp = true;
      if (e.key === 'ArrowDown') this.keys.ArrowDown = true;
      if (e.key === 'ArrowLeft') this.keys.ArrowLeft = true;
      if (e.key === 'ArrowRight') this.keys.ArrowRight = true;
    });

    window.addEventListener('keyup', (e) => {
      const k = e.key.toLowerCase();
      if (k === 'w' || e.code === 'KeyW') this.keys.w = false;
      if (k === 'a' || e.code === 'KeyA') this.keys.a = false;
      if (k === 's' || e.code === 'KeyS') this.keys.s = false;
      if (k === 'd' || e.code === 'KeyD') this.keys.d = false;
      if (e.key === 'ArrowUp') this.keys.ArrowUp = false;
      if (e.key === 'ArrowDown') this.keys.ArrowDown = false;
      if (e.key === 'ArrowLeft') this.keys.ArrowLeft = false;
      if (e.key === 'ArrowRight') this.keys.ArrowRight = false;
    });

    // Mouse drag for Look Around in Walk Mode
    const dom = this.renderer.domElement;
    dom.addEventListener('pointerdown', (e) => {
      if (this.cameraMode === 'walk') {
        this.isDraggingMouse = true;
        this.prevMousePos = { x: e.clientX, y: e.clientY };
      }
    });

    window.addEventListener('pointermove', (e) => {
      if (this.cameraMode === 'walk' && this.isDraggingMouse) {
        const deltaX = e.clientX - this.prevMousePos.x;
        const deltaY = e.clientY - this.prevMousePos.y;
        this.prevMousePos = { x: e.clientX, y: e.clientY };

        // Rotate camera view
        this.walkYaw -= deltaX * 0.0035;
        this.walkPitch -= deltaY * 0.0035;
        this.walkPitch = Math.max(-1.1, Math.min(1.1, this.walkPitch));
      }
    });

    window.addEventListener('pointerup', () => {
      this.isDraggingMouse = false;
    });
  }

  checkRaycast(screenX, screenY, isClick = false) {
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const hitMeshes = [];
    for (const k of this.krathongs) {
      k.traverse((child) => {
        if (child.userData && child.userData.parentKrathong) {
          hitMeshes.push(child);
        }
      });
    }

    const intersects = this.raycaster.intersectObjects(hitMeshes, false);

    if (intersects.length > 0) {
      const hitParent = intersects[0].object.userData.parentKrathong;
      this.hoveredKrathong = hitParent;
      document.body.style.cursor = 'pointer';
      this.showWishPopup(hitParent.userData, screenX, screenY);
    } else {
      if (!isClick) {
        this.hoveredKrathong = null;
        document.body.style.cursor = 'default';
        this.hideWishPopup();
      }
    }
  }

  showWishPopup(data, screenX, screenY) {
    if (!this.wishPopup) return;
    this.wishAuthorEl.textContent = `🪷 ${data.author}`;
    this.wishTypeEl.textContent = data.typeName || 'กระทงประเพณี';
    this.wishTextEl.textContent = `“${data.wish}”`;

    const posX = Math.min(window.innerWidth - 320, Math.max(20, screenX + 18));
    const posY = Math.min(window.innerHeight - 200, Math.max(20, screenY - 50));

    this.wishPopup.style.left = `${posX}px`;
    this.wishPopup.style.top = `${posY}px`;
    this.wishPopup.classList.add('visible');
  }

  hideWishPopup() {
    if (this.wishPopup) {
      this.wishPopup.classList.remove('visible');
    }
  }

  initUI() {
    let selectedStyle = 'traditional';

    const styleCards = document.querySelectorAll('.style-card');
    styleCards.forEach((card) => {
      card.addEventListener('click', () => {
        styleCards.forEach((c) => c.classList.remove('active'));
        card.classList.add('active');
        selectedStyle = card.dataset.style;
      });
    });

    const floatBtn = document.getElementById('btn-float');
    const authorInput = document.getElementById('input-author');
    const wishInput = document.getElementById('input-wish');
    const creatorModal = document.getElementById('creator-modal');
    const openModalBtn = document.getElementById('btn-open-modal');
    const closeModalBtn = document.getElementById('btn-close-modal');

    openModalBtn?.addEventListener('click', () => {
      creatorModal.classList.add('visible');
      sounds.init();
    });

    closeModalBtn?.addEventListener('click', () => {
      creatorModal.classList.remove('visible');
    });

    floatBtn?.addEventListener('click', () => {
      sounds.init();
      const author = authorInput.value.trim() || 'ผู้ร่วมงานใจบุญ';
      const wish = wishInput.value.trim() || 'ขอขมาพระแม่คงคา และขอให้ชีวิตพบเจอแต่ความสุขความเจริญ';

      const newKrathong = createKrathong(selectedStyle, {
        author,
        wish,
        speed: 0.55
      });

      // Place into open water (away from the pier ledge)
      newKrathong.position.set(0, 0.2, -8.2);
      this.scene.add(newKrathong);
      this.krathongs.push(newKrathong);
      this.userKrathong = newKrathong;

      creatorModal.classList.remove('visible');
      sounds.playChime();
      this.fireworks.launch(0, -30);

      this.cameraMode = 'follow';
      this.updateCameraToolbar();
      this.showToast(`✨ กระทงของคุณ ${author} ลอยลงสู่สายน้ำแล้ว ✨`);
    });

    const fireworkBtn = document.getElementById('btn-firework');
    fireworkBtn?.addEventListener('click', () => {
      sounds.init();
      this.fireworks.launch();
      sounds.playFireworkBurst();
      this.showToast('🎆 จุดพลุเฉลิมฉลองขึ้นสู่ท้องฟ้าราตรี!');
    });

    // 🚶 Walk Mode Button (WASD First-Person)
    const walkBtn = document.getElementById('btn-walk');
    walkBtn?.addEventListener('click', () => {
      sounds.init();
      if (this.cameraMode !== 'walk') {
        this.cameraMode = 'walk';
        // Place player right in front of Temple Gateway facing the fair!
        this.camera.position.set(0, 3.6, 18);
        this.walkYaw = Math.PI; // Face north towards the fairground
        this.walkPitch = 0;
        this.showToast('🚶 โหมดเดินเที่ยวงาน: ใช้ปุ่ม W A S D เพื่อเดิน และคลิกลากเมาส์เพื่อมองรอบตัว');
      } else {
        this.cameraMode = 'orbit';
        this.controls.target.set(0, 2.5, 30);
        this.camera.position.set(0, 16, -24);
        this.showToast('🎥 สลับเป็นโหมดมุมกล้องอิสระ');
      }
      this.updateCameraToolbar();
    });

    // 🎥 Free Orbit Camera Mode Toggle Button
    const cameraBtn = document.getElementById('btn-camera');
    cameraBtn?.addEventListener('click', () => {
      if (this.cameraMode === 'orbit') {
        if (this.userKrathong) {
          this.cameraMode = 'follow';
          this.showToast('🎥 สลับเป็นโหมด: ติดตามกระทงของคุณ');
        } else {
          this.showToast('ℹ️ กรุณากด "ลอยกระทง" ก่อนเพื่อติดตามกระทงของคุณ');
        }
      } else {
        this.cameraMode = 'orbit';
        this.controls.target.set(0, 2.5, 30);
        this.camera.position.set(0, 16, -24);
        this.showToast('🎥 สลับเป็นโหมด: มุมกล้องอิสระ');
      }
      this.updateCameraToolbar();
    });

    // Sound Ambient Toggle Button
    const soundBtn = document.getElementById('btn-sound');
    soundBtn?.addEventListener('click', () => {
      sounds.init();
      const isMuted = sounds.toggleMute();
      soundBtn.textContent = isMuted ? '🔇 เสียง: ปิด' : '🔊 เสียง: เปิด';
      this.showToast(isMuted ? 'ปิดเสียงบรรยากาศ' : 'เปิดเสียงบรรยากาศสายน้ำ');
    });
  }

  updateCameraToolbar() {
    const walkBtn = document.getElementById('btn-walk');
    const cameraBtn = document.getElementById('btn-camera');
    const wasdHud = document.getElementById('wasd-hud');

    if (walkBtn) {
      if (this.cameraMode === 'walk') {
        walkBtn.classList.add('active-mode');
        walkBtn.innerHTML = '🚶 <span>กำลังเดินชมงาน</span>';
      } else {
        walkBtn.classList.remove('active-mode');
        walkBtn.innerHTML = '🚶 <span>เดินเที่ยวงาน (WASD)</span>';
      }
    }

    if (cameraBtn) {
      if (this.cameraMode === 'follow') {
        cameraBtn.innerHTML = '🎯 <span>ติดตามกระทง</span>';
        cameraBtn.classList.add('active-mode');
      } else if (this.cameraMode === 'orbit') {
        cameraBtn.innerHTML = '🎥 <span>มุมกล้องอิสระ</span>';
        cameraBtn.classList.remove('active-mode');
      } else {
        cameraBtn.classList.remove('active-mode');
      }
    }

    // Show WASD HUD in walk mode
    if (wasdHud) {
      if (this.cameraMode === 'walk') {
        wasdHud.classList.add('visible');
      } else {
        wasdHud.classList.remove('visible');
      }
    }
  }

  showToast(msg) {
    const toast = document.getElementById('toast-msg');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.composer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(this.animate);

    const delta = Math.min(this.clock.getDelta(), 0.1);
    const time = this.clock.getElapsedTime();

    // 1. Update Scene Elements
    this.environment.update(time, delta);
    this.pier.update(time);
    this.crowd.update(time, delta);
    this.fireworks.update(time, delta);

    // 2. Update Krathongs Buoyancy & Drift
    for (const k of this.krathongs) {
      updateKrathongPhysics(k, time, delta);
    }

    // 3. Camera Modes Handling
    if (this.cameraMode === 'walk') {
      this.controls.enabled = false;

      // WASD First-person Movement
      const forwardX = -Math.sin(this.walkYaw);
      const forwardZ = -Math.cos(this.walkYaw);
      const rightX = -forwardZ;
      const rightZ = forwardX;

      let moveX = 0;
      let moveZ = 0;

      if (this.keys.w || this.keys.ArrowUp) { moveX += forwardX; moveZ += forwardZ; }
      if (this.keys.s || this.keys.ArrowDown) { moveX -= forwardX; moveZ -= forwardZ; }
      if (this.keys.d || this.keys.ArrowRight) { moveX += rightX; moveZ += rightZ; }
      if (this.keys.a || this.keys.ArrowLeft) { moveX -= rightX; moveZ -= rightZ; }

      const moveLen = Math.hypot(moveX, moveZ);
      if (moveLen > 0) {
        const speed = 9.0;
        this.camera.position.x += (moveX / moveLen) * speed * delta;
        this.camera.position.z += (moveZ / moveLen) * speed * delta;
      }

      // Fairground boundary limit
      this.camera.position.x = Math.max(-120, Math.min(120, this.camera.position.x));
      this.camera.position.z = Math.max(-5.0, Math.min(150, this.camera.position.z));

      // Natural height adjustment (standing on ground y=2.0 -> eye level y=3.6)
      if (this.camera.position.z < 2.0 && Math.abs(this.camera.position.x) < 5.8) {
        // Steps down to water platform
        this.camera.position.y = Math.max(1.4, 3.6 + (this.camera.position.z - 2.0) * 0.4);
      } else {
        this.camera.position.y = 3.6;
      }

      // Update camera orientation from yaw and pitch
      const euler = new THREE.Euler(this.walkPitch, this.walkYaw, 0, 'YXZ');
      this.camera.quaternion.setFromEuler(euler);

    } else if (this.cameraMode === 'follow' && this.userKrathong) {
      this.controls.enabled = false;
      const targetPos = new THREE.Vector3(
        this.userKrathong.position.x + 3.2,
        this.userKrathong.position.y + 2.4,
        this.userKrathong.position.z + 4.8
      );
      this.camera.position.lerp(targetPos, delta * 3.5);
      this.camera.lookAt(
        this.userKrathong.position.x - 1.2,
        this.userKrathong.position.y + 0.4,
        this.userKrathong.position.z
      );
    } else {
      this.controls.enabled = true;

      // WASD / Arrow Keys Pan Camera in Free Orbit Mode
      const panSpeed = 35.0 * delta;
      // Calculate camera horizontal forward and right vectors
      const camForward = new THREE.Vector3();
      this.camera.getWorldDirection(camForward);
      camForward.y = 0;
      camForward.normalize();

      const camRight = new THREE.Vector3();
      camRight.crossVectors(camForward, new THREE.Vector3(0, 1, 0)).normalize();

      const panDelta = new THREE.Vector3();
      if (this.keys.w || this.keys.ArrowUp) panDelta.addScaledVector(camForward, panSpeed);
      if (this.keys.s || this.keys.ArrowDown) panDelta.addScaledVector(camForward, -panSpeed);
      if (this.keys.d || this.keys.ArrowRight) panDelta.addScaledVector(camRight, panSpeed);
      if (this.keys.a || this.keys.ArrowLeft) panDelta.addScaledVector(camRight, -panSpeed);

      if (panDelta.lengthSq() > 0) {
        this.camera.position.add(panDelta);
        this.controls.target.add(panDelta);
      }

      this.controls.update();
    }

    // 4. Render with Post-processing
    this.composer.render();
  }
}

function startApp() {
  try {
    window.__loyKrathongApp = new App();
    console.log("Loy Krathong 3D App initialized successfully!");
  } catch (err) {
    console.error("App startup error:", err);
    const errDiv = document.createElement('div');
    errDiv.style.position = 'fixed';
    errDiv.style.top = '20px';
    errDiv.style.left = '20px';
    errDiv.style.background = 'rgba(220, 38, 38, 0.95)';
    errDiv.style.color = '#fff';
    errDiv.style.padding = '20px';
    errDiv.style.borderRadius = '12px';
    errDiv.style.zIndex = '999999';
    errDiv.style.fontSize = '14px';
    errDiv.style.fontFamily = 'monospace';
    errDiv.style.whiteSpace = 'pre-wrap';
    errDiv.textContent = `❌ App Error: ${err.message}\n${err.stack}`;
    document.body.appendChild(errDiv);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
