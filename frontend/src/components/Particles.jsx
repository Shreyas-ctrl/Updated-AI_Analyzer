import React, { useRef, useEffect } from "react";

export default function Particles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = canvas.clientWidth);
    let h = (canvas.height = canvas.clientHeight);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const particles = [];
    const PARTICLE_COUNT = Math.max(24, Math.floor((w * h) / 20000));

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.7 + Math.random() * 2.2,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
      });
    }

    let mouse = { x: w / 2, y: h / 2 };

    const onMove = (e) => {
      mouse.x = e.clientX - canvas.getBoundingClientRect().left;
      mouse.y = e.clientY - canvas.getBoundingClientRect().top;
    };

    const onResize = () => {
      w = canvas.width = canvas.clientWidth;
      h = canvas.height = canvas.clientHeight;
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("resize", onResize);

    let raf;
    const render = () => {
      ctx.clearRect(0, 0, w, h);

      // parallax offset based on mouse
      const mx = (mouse.x - w / 2) / w;
      const my = (mouse.y - h / 2) / h;

      for (let p of particles) {
        if (!reduced) {
          p.x += p.vx + mx * 0.6;
          p.y += p.vy + my * 0.6;
        }

        // wrap
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        ctx.beginPath();
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
        g.addColorStop(0, "rgba(124,207,255,0.9)");
        g.addColorStop(0.4, "rgba(124,207,255,0.22)");
        g.addColorStop(1, "rgba(124,207,255,0)");

        ctx.fillStyle = g;
        ctx.fillRect(p.x - p.r * 2, p.y - p.r * 2, p.r * 4, p.r * 4);
      }

      raf = requestAnimationFrame(render);
    };

    if (!reduced) render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas className="particles-canvas" ref={canvasRef} aria-hidden />;
}
