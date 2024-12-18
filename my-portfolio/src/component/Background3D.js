import React, { useEffect, useRef } from "react";
import venusTexture from "../assets/venus_surface.jpg";
import { ShaderMaterial } from "three";
import * as THREE from "three";

//import { motion } from "framer-motion";
const Background3D = ({ headerPosition }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
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
    const geometry = new THREE.SphereGeometry(7, 32, 32); // adjust size of 7 (radius)
    const sphere = new THREE.Mesh(geometry, shaderMaterial);

    if (headerPosition === "bottom") {
      scene.add(sphere);
    } else {
      scene.remove(sphere);
    }

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
        distance * Math.cos(angle2)
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

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Make the sphere spin in all directions
      sphere.rotation.x += 0.003;
      sphere.rotation.y += 0.005;
      sphere.rotation.z += 0.002;

      // Rotate stars group around the planet
      starsGroup.rotation.y += 0.002;

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
      // For animation
      // initial={{ x: "0%", y: "0%", scale: 1 }}
      // animate={{
      //   x:
      //     headerPosition === "top"
      //       ? "calc(var(--header-width, 200px) - 50%)"
      //       : "0%",
      //   y: headerPosition === "top" ? "-38%" : "0%", // Move up next to the header
      //   scale: headerPosition === "top" ? 0.2 : 1,
      // }}
      // transition={{ duration: 0.5 }}
    />
  );
};

export default Background3D;
