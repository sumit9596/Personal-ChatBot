import { useEffect, useRef } from "react";

export default function InteractiveBackground({ theme = "dark" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // High DPI scaling
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Mouse tracking with smooth interpolation
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;
    let mouseX = width / 2;
    let mouseY = height / 2;
    let lastDropTime = 0;
    let lastDropX = 0;
    let lastDropY = 0;

    // Active ripple drops
    const drops = [];
    const MAX_DROPS = 20;

    // Vivid luminous palettes for both Dark and Light themes
    const darkDropColors = [
      "rgba(52, 211, 153, ",  // Vivid Mint
      "rgba(56, 189, 248, ",  // Electric Sky Blue
      "rgba(167, 139, 250, ", // Neon Violet
      "rgba(251, 191, 36, ",  // Golden Amber
    ];

    const lightDropColors = [
      "rgba(2, 132, 199, ",   // Bold Electric Cyan
      "rgba(124, 58, 237, ",  // Deep Royal Violet
      "rgba(5, 150, 105, ",   // Rich Jade Mint
      "rgba(234, 88, 12, ",   // Sunset Coral
    ];

    function createDrop(x, y, power = 1.0) {
      const isDark = theme === "dark";
      const colors = isDark ? darkDropColors : lightDropColors;
      const colorBase = colors[Math.floor(Math.random() * colors.length)];

      if (drops.length >= MAX_DROPS) {
        drops.shift();
      }

      drops.push({
        x,
        y,
        radius: 2,
        maxRadius: (110 + Math.random() * 70) * power,
        speed: (2.8 + Math.random() * 1.5) * power,
        alpha: 0.95 * power,
        colorBase,
        sparkles: Array.from({ length: 6 }, () => ({
          angle: Math.random() * Math.PI * 2,
          dist: 0,
          speed: 2.0 + Math.random() * 3.0,
          alpha: 1.0,
          size: 1.5 + Math.random() * 2.2,
        })),
      });
    }

    // Ambient floating orbs with strong luminous presence
    let time = 0;
    const orbs = [
      {
        baseX: 0.2,
        baseY: 0.3,
        freqX: 0.0006,
        freqY: 0.0008,
        radius: 420,
        darkColor: "rgba(16, 185, 129, 0.24)",
        lightColor: "rgba(14, 165, 233, 0.28)",
      },
      {
        baseX: 0.8,
        baseY: 0.65,
        freqX: 0.0007,
        freqY: 0.0005,
        radius: 450,
        darkColor: "rgba(139, 92, 246, 0.22)",
        lightColor: "rgba(124, 58, 237, 0.25)",
      },
      {
        baseX: 0.5,
        baseY: 0.18,
        freqX: 0.0009,
        freqY: 0.0006,
        radius: 360,
        darkColor: "rgba(245, 158, 11, 0.20)",
        lightColor: "rgba(249, 115, 22, 0.22)",
      },
      {
        baseX: 0.85,
        baseY: 0.25,
        freqX: 0.0005,
        freqY: 0.0009,
        radius: 380,
        darkColor: "rgba(56, 189, 248, 0.22)",
        lightColor: "rgba(16, 185, 129, 0.24)",
      },
    ];

    // Constellation micro-particles
    const particleCount = width < 768 ? 25 : 45;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 1.8 + 1.0,
      baseAlpha: Math.random() * 0.35 + 0.3,
    }));

    // Mouse events
    const handlePointerMove = (e) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;

      // Update CSS variables for border/spotlight effects
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);

      const now = performance.now();
      const distFromLastDrop = Math.hypot(
        e.clientX - lastDropX,
        e.clientY - lastDropY
      );

      // Trigger vibrant dropping ripple on cursor motion
      if (distFromLastDrop > 35 && now - lastDropTime > 65) {
        createDrop(e.clientX, e.clientY, 0.85);
        lastDropX = e.clientX;
        lastDropY = e.clientY;
        lastDropTime = now;
      }
    };

    const handlePointerDown = (e) => {
      createDrop(e.clientX, e.clientY, 1.6);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("resize", handleResize);

    // Initial dramatic splash
    createDrop(width * 0.5, height * 0.35, 1.5);
    createDrop(width * 0.25, height * 0.6, 1.1);

    // Animation Render Loop
    const render = () => {
      time += 1;

      // Smooth mouse follow easing
      mouseX += (targetMouseX - mouseX) * 0.1;
      mouseY += (targetMouseY - mouseY) * 0.1;

      const isDark = theme === "dark";

      // 1. Base Canvas Background Fill
      ctx.fillStyle = isDark ? "#090b10" : "#f1f5f9";
      ctx.fillRect(0, 0, width, height);

      // 2. Ambient Floating Glowing Orbs
      orbs.forEach((orb) => {
        const ox = (orb.baseX + Math.sin(time * orb.freqX) * 0.16) * width;
        const oy = (orb.baseY + Math.cos(time * orb.freqY) * 0.16) * height;

        const grad = ctx.createRadialGradient(ox, oy, 0, ox, oy, orb.radius);
        grad.addColorStop(0, isDark ? orb.darkColor : orb.lightColor);
        grad.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(ox, oy, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. High-Intensity Cursor Spotlight (Luminous Glow)
      const spotRadius = isDark ? 400 : 380;
      const spotGrad = ctx.createRadialGradient(
        mouseX,
        mouseY,
        0,
        mouseX,
        mouseY,
        spotRadius
      );

      if (isDark) {
        spotGrad.addColorStop(0, "rgba(52, 211, 153, 0.38)");
        spotGrad.addColorStop(0.3, "rgba(56, 189, 248, 0.22)");
        spotGrad.addColorStop(0.65, "rgba(167, 139, 250, 0.14)");
        spotGrad.addColorStop(1, "rgba(0,0,0,0)");
      } else {
        spotGrad.addColorStop(0, "rgba(2, 132, 199, 0.42)");
        spotGrad.addColorStop(0.35, "rgba(124, 58, 237, 0.26)");
        spotGrad.addColorStop(0.7, "rgba(5, 150, 105, 0.16)");
        spotGrad.addColorStop(1, "rgba(0,0,0,0)");
      }

      ctx.fillStyle = spotGrad;
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, spotRadius, 0, Math.PI * 2);
      ctx.fill();

      // 4. Interactive Tech Grid (Brightly illuminates near cursor)
      const gridSize = 42;
      const maxProximity = 220;

      for (let gx = 0; gx < width; gx += gridSize) {
        for (let gy = 0; gy < height; gy += gridSize) {
          const dist = Math.hypot(gx - mouseX, gy - mouseY);
          if (dist < maxProximity) {
            const intensity = 1 - dist / maxProximity;
            const dotRadius = 1.3 + intensity * 2.2;
            const alpha = 0.25 + intensity * 0.75;

            ctx.fillStyle = isDark
              ? `rgba(52, 211, 153, ${alpha})`
              : `rgba(2, 132, 199, ${alpha})`;
            ctx.beginPath();
            ctx.arc(gx, gy, dotRadius, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillStyle = isDark
              ? "rgba(255, 255, 255, 0.04)"
              : "rgba(15, 23, 42, 0.05)";
            ctx.fillRect(gx, gy, 1.2, 1.2);
          }
        }
      }

      // 5. Water / Light Dropping Ripples
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];
        d.radius += d.speed;
        d.alpha *= 0.96; // Smooth decay

        if (d.alpha <= 0.015 || d.radius >= d.maxRadius) {
          drops.splice(i, 1);
          continue;
        }

        // Primary Outer Ripple Ring
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `${d.colorBase}${d.alpha})`;
        ctx.lineWidth = isDark ? 2.2 : 2.5;
        ctx.stroke();

        // Secondary Echo Ring
        if (d.radius > 14) {
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.radius * 0.62, 0, Math.PI * 2);
          ctx.strokeStyle = `${d.colorBase}${d.alpha * 0.6})`;
          ctx.lineWidth = isDark ? 1.4 : 1.6;
          ctx.stroke();
        }

        // Tertiary Echo Ring for big drops
        if (d.radius > 32) {
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.radius * 0.32, 0, Math.PI * 2);
          ctx.strokeStyle = `${d.colorBase}${d.alpha * 0.35})`;
          ctx.lineWidth = 1.0;
          ctx.stroke();
        }

        // Core Splash Drop Flash
        if (d.radius < 26) {
          const coreGrad = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, 18);
          coreGrad.addColorStop(0, `${d.colorBase}${d.alpha * 0.9})`);
          coreGrad.addColorStop(1, `${d.colorBase}0)`);
          ctx.fillStyle = coreGrad;
          ctx.beginPath();
          ctx.arc(d.x, d.y, 18, 0, Math.PI * 2);
          ctx.fill();
        }

        // Sparkle Particles Dispersing
        d.sparkles.forEach((s) => {
          s.dist += s.speed;
          s.alpha *= 0.94;
          const sx = d.x + Math.cos(s.angle) * s.dist;
          const sy = d.y + Math.sin(s.angle) * s.dist;
          ctx.fillStyle = `${d.colorBase}${d.alpha * s.alpha})`;
          ctx.beginPath();
          ctx.arc(sx, sy, s.size, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // 6. Constellation Micro-Particles with Proximity Interaction
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        if (p.x > width) { p.x = width; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        if (p.y > height) { p.y = height; p.vy *= -1; }

        const mDist = Math.hypot(p.x - mouseX, p.y - mouseY);
        let alpha = p.baseAlpha;
        if (mDist < 140) {
          const mFactor = 1 - mDist / 140;
          alpha += mFactor * 0.65;
          p.x += ((p.x - mouseX) / mDist) * 0.7;
          p.y += ((p.y - mouseY) / mDist) * 0.7;
        }

        ctx.fillStyle = isDark
          ? `rgba(255, 255, 255, ${alpha})`
          : `rgba(15, 23, 42, ${alpha * 0.9})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 90) {
            const lineAlpha = (1 - dist / 90) * (isDark ? 0.16 : 0.14);
            ctx.strokeStyle = isDark
              ? `rgba(52, 211, 153, ${lineAlpha})`
              : `rgba(2, 132, 199, ${lineAlpha})`;
            ctx.lineWidth = 1.0;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="interactive-background-canvas"
      aria-hidden="true"
    />
  );
}
