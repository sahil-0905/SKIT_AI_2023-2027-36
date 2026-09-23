import { useRef, useEffect } from "react";
import * as THREE from "three";

function ThreeBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0d0e14, 4, 16);

    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // ---------- Soft glowing orbs (bokeh style) ----------
    const orbColors = [0x7c5cf5, 0x9c6cf5, 0x38bdb2];
    const orbs = [];

    const orbTexture = (() => {
      const size = 128;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      gradient.addColorStop(0, "rgba(255,255,255,1)");
      gradient.addColorStop(0.4, "rgba(255,255,255,0.4)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);
      return new THREE.CanvasTexture(canvas);
    })();

    for (let i = 0; i < 14; i++) {
      const color = orbColors[i % orbColors.length];
      const material = new THREE.SpriteMaterial({
        map: orbTexture,
        color,
        transparent: true,
        opacity: 0.25 + Math.random() * 0.3,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const sprite = new THREE.Sprite(material);
      const scale = 0.8 + Math.random() * 2.2;
      sprite.scale.set(scale, scale, 1);
      sprite.position.set(
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 9,
        (Math.random() - 0.5) * 8 - 2
      );
      scene.add(sprite);
      orbs.push({
        sprite,
        speed: 0.15 + Math.random() * 0.25,
        offset: Math.random() * Math.PI * 2,
        driftX: (Math.random() - 0.5) * 0.15,
      });
    }

    // ---------- One large wireframe icosahedron, off to the side ----------
    const wireGeo = new THREE.IcosahedronGeometry(2.6, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x7c5cf5,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    wireMesh.position.set(5.5, 1.5, -3);
    scene.add(wireMesh);

    const wireGeo2 = new THREE.IcosahedronGeometry(1.6, 1);
    const wireMat2 = new THREE.MeshBasicMaterial({
      color: 0x38bdb2,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const wireMesh2 = new THREE.Mesh(wireGeo2, wireMat2);
    wireMesh2.position.set(-5, -2, -2);
    scene.add(wireMesh2);

    // ---------- Tiny particle dust ----------
    const particleCount = 100;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 16;
    }
    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.015,
      transparent: true,
      opacity: 0.35,
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // ---------- Mouse parallax ----------
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // ---------- Animation loop ----------
    const clock = new THREE.Clock();
    let animationId;

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      orbs.forEach((o) => {
        o.sprite.position.y += Math.sin(elapsed * o.speed + o.offset) * 0.0025;
        o.sprite.position.x += o.driftX * 0.01;
      });

      wireMesh.rotation.y += 0.0012;
      wireMesh.rotation.x += 0.0005;
      wireMesh2.rotation.y -= 0.0009;
      wireMesh2.rotation.x += 0.0007;

      particles.rotation.y += 0.0004;

      camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.02;
      camera.position.y += (-mouseY * 0.3 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      orbTexture.dispose();
      orbs.forEach((o) => o.sprite.material.dispose());
      wireGeo.dispose();
      wireMat.dispose();
      wireGeo2.dispose();
      wireMat2.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 -z-0"
      style={{ pointerEvents: "none" }}
    />
  );
}

export default ThreeBackground;