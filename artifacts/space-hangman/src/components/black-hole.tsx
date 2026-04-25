import { useRef, useEffect } from "react";

interface BlackHoleProps {
  wrongGuesses: number;
  isGameOver: boolean;
  won: boolean;
}

export function BlackHole({ wrongGuesses, isGameOver, won }: BlackHoleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Array<{x: number; y: number; vx: number; vy: number; life: number; color: string}>>([]);

  const size = won ? 0.1 : isGameOver ? 2.5 : 0.4 + (wrongGuesses / 6) * 1.8;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;

    if (won && particlesRef.current.length === 0) {
      for (let i = 0; i < 80; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 3;
        particlesRef.current.push({
          x: cx, y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          color: `hsl(${Math.random() * 60 + 240}, 100%, ${60 + Math.random() * 30}%)`,
        });
      }
    }

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      t += 0.02;

      if (won) {
        // Supernova burst particles
        particlesRef.current = particlesRef.current
          .map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, life: p.life - 0.015 }))
          .filter(p => p.life > 0);
        particlesRef.current.forEach(p => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3 * p.life, 0, Math.PI * 2);
          ctx.fillStyle = p.color.replace(")", `, ${p.life})`).replace("hsl(", "hsla(");
          ctx.fill();
        });
        if (particlesRef.current.length > 0) {
          animRef.current = requestAnimationFrame(draw);
        }
        return;
      }

      const radius = size * 40;

      // Event horizon glow layers
      for (let r = radius + 40; r > radius; r -= 4) {
        const alpha = ((radius + 40 - r) / 40) * 0.15;
        const gradient = ctx.createRadialGradient(cx, cy, r - 4, cx, cy, r);
        gradient.addColorStop(0, `rgba(138, 43, 226, ${alpha})`);
        gradient.addColorStop(1, `rgba(0, 0, 0, 0)`);
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // Accretion disk
      for (let i = 0; i < 3; i++) {
        const diskAngle = t * (0.5 + i * 0.2) * (i % 2 === 0 ? 1 : -1);
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(diskAngle);
        ctx.scale(1, 0.3);
        const diskGrad = ctx.createRadialGradient(0, 0, radius, 0, 0, radius + 30 + i * 8);
        const hue = 260 + i * 20 + wrongGuesses * 15;
        diskGrad.addColorStop(0, `hsla(${hue}, 100%, 60%, 0.7)`);
        diskGrad.addColorStop(1, `hsla(${hue}, 100%, 40%, 0)`);
        ctx.beginPath();
        ctx.arc(0, 0, radius + 30 + i * 8, 0, Math.PI * 2);
        ctx.fillStyle = diskGrad;
        ctx.fill();
        ctx.restore();
      }

      // Core black hole
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      coreGrad.addColorStop(0, "rgb(0, 0, 0)");
      coreGrad.addColorStop(0.8, "rgb(5, 0, 20)");
      coreGrad.addColorStop(1, "rgba(30, 0, 60, 0.9)");
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      // Photon ring
      ctx.beginPath();
      ctx.arc(cx, cy, radius + 1, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${280 + wrongGuesses * 10}, 100%, 70%, 0.9)`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Orbital particles being pulled in
      for (let i = 0; i < 6; i++) {
        const angle = t * 2 + (i * Math.PI * 2) / 6;
        const dist = radius + 20 + Math.sin(t * 3 + i) * 10;
        const px = cx + Math.cos(angle) * dist;
        const py = cy + Math.sin(angle) * dist * 0.4;
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${200 + i * 20}, 100%, 70%, 0.8)`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [wrongGuesses, isGameOver, won, size]);

  return (
    <canvas
      ref={canvasRef}
      width={200}
      height={200}
      className="w-full h-full"
      style={{ display: "block" }}
    />
  );
}
