import { useEffect, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.2,
      opacity: Math.random() * 0.7 + 0.3,
      twinkle: Math.random() * Math.PI * 2,
      speed: 0.005 + Math.random() * 0.01,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        s.twinkle += s.speed;
        const a = s.opacity * (0.6 + Math.sin(s.twinkle) * 0.4);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 200, 255, ${a})`;
        ctx.fill();
      });
      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

export default function Home() {
  const { user } = useAuth();
  return (
    <div className="relative flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <StarField />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-3xl">
        <div className="mb-8 relative group">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
          <div className="relative z-10 w-32 h-32 md:w-48 md:h-48 flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <defs>
                <radialGradient id="bh" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="black"/>
                  <stop offset="70%" stopColor="#1a0040"/>
                  <stop offset="100%" stopColor="#6b21a8"/>
                </radialGradient>
                <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.6"/>
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0"/>
                </radialGradient>
              </defs>
              <circle cx="100" cy="100" r="80" fill="url(#glow)" />
              <ellipse cx="100" cy="100" rx="65" ry="20" fill="none" stroke="#7c3aed" strokeWidth="3" opacity="0.7" />
              <ellipse cx="100" cy="100" rx="50" ry="15" fill="none" stroke="#a855f7" strokeWidth="2" opacity="0.5" />
              <circle cx="100" cy="100" r="35" fill="url(#bh)" />
              <circle cx="100" cy="100" r="35" fill="none" stroke="#c084fc" strokeWidth="2" />
            </svg>
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4" style={{
          background: "linear-gradient(135deg, #c084fc, #67e8f9, #a855f7)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          textShadow: "0 0 40px rgba(168, 85, 247, 0.4)",
        }}>
          SPACE HANGMAN
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
          Decipher cosmic signals before the black hole consumes your ship.
          A high-stakes word puzzle in the depths of space.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button asChild size="lg" className="h-14 px-8 text-lg rounded-full" style={{
            background: "linear-gradient(135deg, #7c3aed, #a855f7)",
            boxShadow: "0 0 20px rgba(168, 85, 247, 0.4)",
          }}>
            <Link href="/game">
              INITIATE SOLO MISSION
            </Link>
          </Button>

          <Button asChild size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-primary/40 hover:bg-primary/10 hover:text-primary backdrop-blur-sm">
            <Link href="/daily">
              DAILY CHALLENGE
            </Link>
          </Button>

          <Button asChild size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-400 backdrop-blur-sm">
            <Link href="/leaderboard">
              LEADERBOARD
            </Link>
          </Button>
        </div>

        {!user && (
          <p className="mt-8 text-sm text-muted-foreground">
            <Link href="/sign-in" className="text-primary hover:underline hover:text-primary/80 transition-colors">
              Sign in with Google
            </Link>{" "}
            to save your scores and compete on the leaderboard.
          </p>
        )}
      </div>
    </div>
  );
}
