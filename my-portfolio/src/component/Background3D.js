import React, { useEffect, useRef } from "react";
import venusTexture from "../assets/venus_surface.jpg";
import { ShaderMaterial } from "three";
import * as THREE from "three";

//import { motion } from "framer-motion";
const Background3D = ({ headerPosition }) => {
  const mountRef = useRef(null);
  const messageRef = useRef(null); // message div; we set textContent from effect to avoid re-render (keeps canvas in DOM)

  useEffect(() => {
    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    const renderer = new THREE.WebGLRenderer();

    // Renderer settings
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0xa192f); // Matches your body background

    // Capture mountRef.current inside the effect
    const mountElement = mountRef.current;
    if (mountElement) {
      mountElement.appendChild(renderer.domElement);
    }

    // Texture Loader
    const textureLoader = new THREE.TextureLoader();
    const planetTexture = textureLoader.load(venusTexture);

    // Custom Shader Material for random transparent stripes
    const shaderMaterial = new ShaderMaterial({
      uniforms: {
        uTexture: { value: planetTexture },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        varying vec2 vUv;
  
        void main() {
          vec4 textureColor = texture2D(uTexture, vUv * 0.8); // Scale texture coordinates for less detail
          float dimFactor = 0.6; // Adjust dimming factor (0.0 is black, 1.0 is no dimming)
          gl_FragColor = vec4(textureColor.rgb*dimFactor, dimFactor);
        }
      `,
      transparent: true,
    });

    // Sphere (planet)
    const sphereRadius = 7;
    const geometry = new THREE.SphereGeometry(sphereRadius, 32, 32); // adjust size of 7 (radius)
    const sphere = new THREE.Mesh(geometry, shaderMaterial);

    // --- Mini-game state ---
    let gameState = "waiting"; // "waiting" | "falling" | "attached" | "fallingOff"
    const playerSurface = { lat: 0, lon: 0 }; // radians; lat 0 = North Pole
    const fallVelocity = new THREE.Vector3(0, 0, 0);
    const GRAVITY_STRENGTH = 8;
    const moveSpeed = 10.0; // world units per second (test: easy to outrun tumble)
    const TOUCH_MARGIN = 0.35; // treat as "on surface" when within this of sphere radius
    const FALL_OFF_GRAVITY = 6; // downward acceleration when fallen off (units/s²)
    const OFF_SCREEN_RESET_DELAY = 1.5; // seconds off-screen before reset
    const FALL_OFF_Z_THRESHOLD = -8.0; // z < this → fallingOff (allow walking behind sphere, radius 7)
    const FALL_OFF_Y_THRESHOLD = 1.0; // y < this → fallingOff
    const FALL_OFF_PUSH = 1.5;
    const FALL_TUMBLE_ACCEL = 2.5; // rad/s² — tumble builds up over time
    const FALL_TUMBLE_MAX = 4; // max rad/s
    const GRACE_PERIOD = 1.0; // seconds after touch before fall-off check runs
    const VELOCITY_SMOOTH = 10; // higher = snappier; velocity lerps toward target, gives momentum when keys released
    let moveVelX = 0;
    let moveVelY = 0;
    let offScreenTimer = 0; // seconds the cube has been off-screen (fallingOff only)
    let fallTime = 0; // seconds in the air (for tumble build-up)
    let attachedAtTime = 0; // time when cube touched sphere (for grace period)

    const input = {
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false,
    };

    // Player: Blocky procedural character. Position/quaternion live on the group.
    const playerGroup = new THREE.Group();
    const WALK_SPEED = 8;
    const WALK_AMPLITUDE = 0.4;
    const BOB_AMOUNT = 0.015;
    const LEAN_ANGLE = 7 * (Math.PI / 180);
    const TORSO_BASE_Y = 0.1;
    const HEAD_BASE_Y = 0.25;

    // Blocky: torso (red), head (skin), four limbs (thin boxes)
    const torsoGeom = new THREE.BoxGeometry(0.15, 0.2, 0.08);
    const headGeom = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const limbGeom = new THREE.BoxGeometry(0.04, 0.12, 0.03);
    const legGeom = new THREE.BoxGeometry(0.05, 0.12, 0.04);
    const torsoMat = new THREE.MeshStandardMaterial({ color: 0xff6b6b });
    const headMat = new THREE.MeshStandardMaterial({ color: 0xfff0e0 });
    const limbMat = new THREE.MeshStandardMaterial({ color: 0xb8d4e3 });

    const torso = new THREE.Mesh(torsoGeom, torsoMat);
    torso.position.y = TORSO_BASE_Y;
    playerGroup.add(torso);

    const head = new THREE.Mesh(headGeom, headMat);
    head.position.y = HEAD_BASE_Y;
    playerGroup.add(head);

    const leftArm = new THREE.Mesh(limbGeom, limbMat);
    leftArm.position.set(-0.095, 0.18, 0);
    playerGroup.add(leftArm);
    const rightArm = new THREE.Mesh(limbGeom, limbMat);
    rightArm.position.set(0.095, 0.18, 0);
    playerGroup.add(rightArm);

    const leftLeg = new THREE.Mesh(legGeom, limbMat);
    leftLeg.position.set(-0.03, -0.06, 0);
    playerGroup.add(leftLeg);
    const rightLeg = new THREE.Mesh(legGeom, limbMat);
    rightLeg.position.set(0.03, -0.06, 0);
    playerGroup.add(rightLeg);

    const CHARACTER_SCALE = 4; // Blocky size on the sphere
    playerGroup.scale.setScalar(CHARACTER_SCALE);

    function animateWalking(time) {
      const anyArrowKey =
        input.ArrowUp || input.ArrowDown || input.ArrowLeft || input.ArrowRight;
      if (anyArrowKey && gameState === "attached") {
        const t = time * WALK_SPEED;
        const swing = Math.sin(t) * WALK_AMPLITUDE;
        const bob = Math.abs(Math.sin(t)) * BOB_AMOUNT;
        torso.position.y = TORSO_BASE_Y + bob;
        head.position.y = HEAD_BASE_Y + bob;
        torso.rotation.x = LEAN_ANGLE;
        rightArm.rotation.x = swing;
        leftArm.rotation.x = -swing;
        rightLeg.rotation.x = -swing;
        leftLeg.rotation.x = swing;
      } else {
        torso.position.y = TORSO_BASE_Y;
        head.position.y = HEAD_BASE_Y;
        torso.rotation.x = 0;
        leftArm.rotation.x = 0;
        rightArm.rotation.x = 0;
        leftLeg.rotation.x = 0;
        rightLeg.rotation.x = 0;
      }
    }

    if (headerPosition === "bottom") {
      scene.add(sphere);
      // Player added to scene only when dropping/attached (see Spacebar handler)
    } else {
      scene.remove(sphere);
      scene.remove(playerGroup);
    }

    // --- Input: track keys held down ---
    const keyHandler = (e, value) => {
      if (input.hasOwnProperty(e.key)) {
        e.preventDefault();
        input[e.key] = value;
      }
      if (e.key === " ") {
        e.preventDefault();
        if (value && gameState === "waiting" && headerPosition === "bottom") {
          // Restart: clear any old player, spawn fresh at top, then drop → attached
          if (scene.children.includes(playerGroup)) scene.remove(playerGroup);
          playerGroup.position.set(0, sphereRadius + 2, 0);
          fallVelocity.set(0, 0, 0);
          moveVelX = 0;
          moveVelY = 0;
          if (messageRef.current) messageRef.current.textContent = "";
          playerGroup.quaternion.identity();
          playerGroup.rotation.set(0, 0, 0);
          scene.add(playerGroup);
          gameState = "falling";
        }
      }
    };
    const onKeyDown = (e) => keyHandler(e, true);
    const onKeyUp = (e) => keyHandler(e, false);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    // Stars Group
    const starsGroup = new THREE.Group();

    const starCount = 100;
    for (let i = 0; i < starCount; i++) {
      const starGeometry = new THREE.SphereGeometry(0.05, 8, 8);
      const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const star = new THREE.Mesh(starGeometry, starMaterial);

      // Randomly position stars in a spherical shell around the planet
      const distance = Math.random() * 10 + 7; // Distance from planet
      const angle1 = Math.random() * Math.PI * 2; // Horizontal angle
      const angle2 = Math.random() * Math.PI; // Vertical angle

      star.position.set(
        distance * Math.sin(angle2) * Math.cos(angle1),
        distance * Math.sin(angle2) * Math.sin(angle1),
        distance * Math.cos(angle2),
      );

      starsGroup.add(star);
    }

    scene.add(starsGroup);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1); // ambient light intenstiy
    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(10, 10, 10);
    scene.add(ambientLight, pointLight);

    // Camera position
    camera.position.z = 20;

    // Reusable vectors for surface attachment (avoid per-frame allocations)
    const localPoint = new THREE.Vector3();
    const worldNormal = new THREE.Vector3();
    const CUBE_UP = new THREE.Vector3(0, 1, 0);
    const localDir = new THREE.Vector3(); // for world→lat/lon when locking to surface
    const SNAP_OFFSET = 0.01; // keep cube slightly above surface
    const TURN_SMOOTH = 8; // slerp speed for facing movement direction
    let lastTime = null;
    let prevSphereQuaternion = null; // for tumble sync (attached only)
    const moveDir = new THREE.Vector3();
    const upQuat = new THREE.Quaternion(); // surface normal: local Y = worldNormal
    const invUpQuat = new THREE.Quaternion();
    const yawQuat = new THREE.Quaternion(); // yaw around local Y (0,1,0) so we stay upright
    const targetFacingQuat = new THREE.Quaternion();
    const localForward = new THREE.Vector3();
    const Y_AXIS = new THREE.Vector3(0, 1, 0);
    const tangentUp = new THREE.Vector3();
    const tangentRight = new THREE.Vector3();
    const refAxis = new THREE.Vector3(0, 0, 1);
    const tumbleAxis = new THREE.Vector3();
    const WORLD_UP = new THREE.Vector3(0, 1, 0);

    // World position on sphere surface → (lat, lon) in our convention (North Pole = lat 0)
    const worldPosToLatLon = (worldPos) => {
      sphere.worldToLocal(localDir.copy(worldPos));
      localDir.normalize();
      const lat = Math.acos(THREE.MathUtils.clamp(localDir.y, -1, 1));
      const lon = Math.atan2(localDir.z, localDir.x);
      return { lat, lon };
    };

    // Move-then-Snap: tumble sync → user velocity (final word) → snap to surface → orient upright
    const updatePlayer = (dt) => {
      const pos = playerGroup.position;
      // Step 1: Tumble sync — rotate cube position by sphere's rotation this frame
      if (prevSphereQuaternion === null) {
        prevSphereQuaternion = sphere.quaternion.clone();
      } else {
        const quatDelta = prevSphereQuaternion
          .clone()
          .invert()
          .premultiply(sphere.quaternion);
        pos.applyQuaternion(quatDelta);
        prevSphereQuaternion.copy(sphere.quaternion);
      }
      // Step 2: Move along the surface. Use a tangent basis so we can always move toward the back (z).
      worldNormal.copy(pos).normalize();
      refAxis.set(0, 0, 1);
      if (Math.abs(worldNormal.z) > 0.99) refAxis.set(0, 1, 0);
      tangentRight.crossVectors(worldNormal, refAxis).normalize();
      tangentUp.crossVectors(worldNormal, tangentRight).normalize();
      const targetVelX = (input.ArrowRight ? 1 : 0) - (input.ArrowLeft ? 1 : 0);
      const targetVelY = (input.ArrowUp ? 1 : 0) - (input.ArrowDown ? 1 : 0);
      const blend = 1 - Math.exp(-VELOCITY_SMOOTH * dt);
      moveVelX += (targetVelX * moveSpeed - moveVelX) * blend;
      moveVelY += (targetVelY * moveSpeed - moveVelY) * blend;
      pos.addScaledVector(tangentRight, moveVelX * dt).addScaledVector(tangentUp, moveVelY * dt);
      // Step 3: Snap back to sphere surface (no pole restriction)
      pos.normalize().multiplyScalar(sphereRadius + SNAP_OFFSET);
      // Step 4: Surface normal first (local Up = vector from sphere center to player), then yaw to face movement
      worldNormal.copy(pos).normalize();
      upQuat.setFromUnitVectors(CUBE_UP, worldNormal);
      invUpQuat.copy(upQuat).invert();
      targetFacingQuat.copy(upQuat);
      const keyX = (input.ArrowRight ? 1 : 0) - (input.ArrowLeft ? 1 : 0);
      const keyY = (input.ArrowUp ? 1 : 0) - (input.ArrowDown ? 1 : 0);
      const hasKey = keyX !== 0 || keyY !== 0;
      const moveSpeedSq = moveVelX * moveVelX + moveVelY * moveVelY;
      if (hasKey || moveSpeedSq > 0.01) {
        if (hasKey) {
          const angle = Math.atan2(keyX, keyY);
          moveDir.set(Math.sin(angle), Math.cos(angle), 0);
        } else {
          moveDir.set(moveVelX, moveVelY, 0).normalize();
        }
        localForward.copy(moveDir).applyQuaternion(invUpQuat);
        const yaw = Math.atan2(localForward.x, -localForward.z);
        yawQuat.setFromAxisAngle(Y_AXIS, yaw);
        targetFacingQuat.copy(upQuat).multiply(yawQuat);
      }
      playerGroup.quaternion.slerp(
        targetFacingQuat,
        1 - Math.exp(-TURN_SMOOTH * dt),
      );
      // Keep playerSurface in sync for fall-off logic
      const { lat, lon } = worldPosToLatLon(pos);
      playerSurface.lat = lat;
      playerSurface.lon = lon;
    };

    // Animation loop
    const animate = (time = 0) => {
      requestAnimationFrame(animate);
      if (lastTime === null) lastTime = time;
      const dt = Math.min((time - lastTime) / 1000, 0.1); // cap for stability
      lastTime = time;

      // Make the sphere spin in all directions (tumble difficulty stays on)
      sphere.rotation.x += 0.003;
      sphere.rotation.y += 0.005;
      sphere.rotation.z += 0.002;

      // Rotate stars group around the planet
      starsGroup.rotation.y += 0.002;

      if (gameState === "falling") {
        const p = playerGroup.position;
        const toCenter = new THREE.Vector3(-p.x, -p.y, -p.z).normalize();
        fallVelocity.addScaledVector(toCenter, GRAVITY_STRENGTH * dt);
        p.addScaledVector(fallVelocity, dt);
        const dist = p.length();
        if (dist <= sphereRadius + TOUCH_MARGIN) {
          p.normalize().multiplyScalar(sphereRadius + SNAP_OFFSET);
          const { lat, lon } = worldPosToLatLon(p);
          playerSurface.lat = lat;
          playerSurface.lon = lon;
          gameState = "attached";
          attachedAtTime = time; // start grace period
          prevSphereQuaternion = null; // so first attached frame only stores quat, no tumble apply
          moveVelX = 0;
          moveVelY = 0;
        }
      }

      // Only when attached: run updatePlayer (tumble sync + keys + snap). Once fallingOff, cube never snaps again.
      if (gameState === "attached") {
        updatePlayer(dt);
        // Fall condition only after grace period (1s to get bearings)
        const graceOver = time - attachedAtTime >= GRACE_PERIOD;
        const fellOff =
          graceOver &&
          (playerGroup.position.z < FALL_OFF_Z_THRESHOLD ||
            playerGroup.position.y < FALL_OFF_Y_THRESHOLD);
        if (fellOff) {
          gameState = "fallingOff";
          offScreenTimer = 0;
          fallTime = 0;
          // Shove in drift direction so cube clears the sphere visibly
          fallVelocity.set(moveVelX * 0.8, moveVelY * 0.8, -FALL_OFF_PUSH);
        }
      }

      if (gameState === "fallingOff") {
        fallTime += dt;
        // No snap; apply gravity and move (player never snaps to sphere again)
        fallVelocity.y -= FALL_OFF_GRAVITY * dt;
        playerGroup.position.addScaledVector(fallVelocity, dt);
        // Natural tumble: rotate around axis perpendicular to velocity (tip in direction of fall), speed builds up
        tumbleAxis.crossVectors(fallVelocity, WORLD_UP);
        if (tumbleAxis.lengthSq() < 0.01) tumbleAxis.set(1, 0, 0);
        tumbleAxis.normalize();
        const tumbleSpeed = Math.min(FALL_TUMBLE_MAX, fallTime * FALL_TUMBLE_ACCEL);
        playerGroup.rotateOnWorldAxis(tumbleAxis, tumbleSpeed * dt);
        // Off-screen: behind camera or below view
        const offScreen =
          playerGroup.position.z < -20 || playerGroup.position.y < -15;
        if (offScreen) {
          offScreenTimer += dt;
          if (offScreenTimer >= OFF_SCREEN_RESET_DELAY) {
            gameState = "waiting";
            scene.remove(playerGroup); // only remove player; sphere and stars keep tumbling
            offScreenTimer = 0;
            // if (messageRef.current)
            //   messageRef.current.textContent = "Press Space to Restart";
          }
        } else {
          offScreenTimer = 0;
        }
      }

      animateWalking(time);

      renderer.render(scene, camera);
    };

    animate();

    // Handle resizing
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      if (mountElement) {
        mountElement.removeChild(renderer.domElement);
      }
    };
  }, [headerPosition]); // Add 'headerPosition' as a dependency

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0, // Place in the background
      }}
    >
      <div
        ref={messageRef}
        style={{
          position: "absolute",
          bottom: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          color: "rgba(255, 255, 255, 0.95)",
          fontSize: "clamp(14px, 3vw, 22px)",
          fontFamily: "system-ui, sans-serif",
          textShadow: "0 1px 3px rgba(0,0,0,0.8)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
    </div>
  );
};

export default Background3D;
