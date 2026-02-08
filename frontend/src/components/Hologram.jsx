import React, { useRef, useEffect } from "react";
import * as THREE from "three";

export default function Hologram({ className, offset = { x: 0, y: 0 } }) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const mount = mountRef.current;

    const scene = new THREE.Scene();
    const width = mount.clientWidth || 220;
    const height = mount.clientHeight || 220;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.z = 140;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    mount.appendChild(renderer.domElement);

    // Sphere with soft emissive material
    const geom = new THREE.IcosahedronGeometry(44, 3);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x66ccff,
      emissive: 0x3ac6ff,
      metalness: 0.25,
      roughness: 0.25,
      transparent: true,
      opacity: 0.95,
    });
    const sphere = new THREE.Mesh(geom, mat);
    scene.add(sphere);

    // Wireframe overlay
    const wireGeo = new THREE.IcosahedronGeometry(48, 3);
    const wireMat = new THREE.LineBasicMaterial({ color: 0x7cf, transparent: true, opacity: 0.35 });
    const wire = new THREE.LineSegments(new THREE.WireframeGeometry(wireGeo), wireMat);
    scene.add(wire);

    // Rotating ring
    const ringGeo = new THREE.TorusGeometry(60, 1.6, 16, 120);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x66f7ff, transparent: true, opacity: 0.12 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.3;
    ring.rotation.y = Math.PI / 12;
    scene.add(ring);

    // Lights
    const ambient = new THREE.AmbientLight(0x99ddff, 0.6);
    scene.add(ambient);
    const p = new THREE.PointLight(0x66ccff, 1.4);
    p.position.set(120, 60, 200);
    scene.add(p);

    // handle resize
    const handleResize = () => {
      const w = mount.clientWidth || 220;
      const h = mount.clientHeight || 220;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);

    // reduced motion opt-out
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let rafId;
    const animate = () => {
      if (!reduced) {
        sphere.rotation.y += 0.0065;
        sphere.rotation.x += 0.0032;
        wire.rotation.y -= 0.005;
        ring.rotation.z += 0.0022;
      }

      // read latest parallax from DOM node (written by outer effect)
      const p = (mount && mount.__parallax) || { x: 0, y: 0 };
      // apply parallax to meshes (sphere + overlays) rather than the camera
      const targetX = (p.x || 0) * 0.03;
      const targetY = (p.y || 0) * 0.03;
      // lerp sphere position toward mouse-derived target
      sphere.position.x += (targetX - sphere.position.x) * 0.12;
      sphere.position.y += (-targetY - sphere.position.y) * 0.12;
      // make overlays follow with slight lag
      wire.position.x += (sphere.position.x - wire.position.x) * 0.08;
      wire.position.y += (sphere.position.y - wire.position.y) * 0.08;
      ring.position.x += (sphere.position.x - ring.position.x) * 0.06;
      ring.position.y += (sphere.position.y - ring.position.y) * 0.06;

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      try { mount.removeChild(renderer.domElement); } catch (e) { /* ignore */ }
    };
    // cleanup handled above
  }, []);

  // keep parallax values in the mount node for the RAF loop to read
  useEffect(() => {
    if (!mountRef.current) return;
    // debug log to confirm Hologram receives offset prop
    console.log("Hologram offset prop ->", { x: offset.x || 0, y: offset.y || 0 });
    mountRef.current.__parallax = { x: offset.x || 0, y: offset.y || 0 };
  }, [offset]);

  return <div className={`hologram-3d ${className || ""}`} ref={mountRef} aria-hidden />;
}
