import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { GameState } from "@/hooks/use-game";
import { Share2, Download, Trophy, Skull } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface ScoreCardProps {
  state: GameState;
  mode: "solo" | "daily";
}

export function ScoreCard({ state, mode }: ScoreCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const { user } = useAuth();

  const handleShare = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#0a0a0f",
        scale: 2,
      });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `space-hangman-${mode}-${Date.now()}.png`;
      link.click();
    } catch (error) {
      console.error("Failed to export image", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div
        ref={cardRef}
        className={`w-full p-6 rounded-xl border ${state.won ? "border-secondary/50 bg-secondary/10" : "border-destructive/50 bg-destructive/10"} backdrop-blur-md relative overflow-hidden`}
        style={{ boxShadow: state.won ? "0 0 20px rgba(34,211,238,0.2)" : "0 0 20px rgba(239,68,68,0.2)" }}
      >
        <div className="absolute -top-10 -right-10 opacity-20 pointer-events-none">
          {state.won ? <Trophy size={120} /> : <Skull size={120} />}
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <defs>
                <radialGradient id="bh-card" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="black"/>
                  <stop offset="100%" stopColor="#6b21a8"/>
                </radialGradient>
              </defs>
              <circle cx="100" cy="100" r="80" fill="#a855f720" />
              <circle cx="100" cy="100" r="35" fill="url(#bh-card)" />
              <circle cx="100" cy="100" r="35" fill="none" stroke="#c084fc" strokeWidth="2" />
            </svg>
          </div>
          <h3 className="font-mono text-sm tracking-widest uppercase text-muted-foreground">
            Transmission Log
          </h3>
        </div>

        <div className="space-y-4 relative z-10">
          <div>
            <p className="text-xs text-muted-foreground uppercase">Operative</p>
            <p className="text-lg font-bold">{user?.displayName || user?.email || "Guest Operative"}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase">Score</p>
              <p className="text-2xl font-mono text-secondary" style={{ textShadow: "0 0 10px currentColor" }}>{state.score}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase">Streak</p>
              <p className="text-2xl font-mono text-primary" style={{ textShadow: "0 0 10px currentColor" }}>{state.streak}</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground uppercase">Target Word</p>
            <p className="text-xl font-mono tracking-widest">{state.word}</p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground uppercase">Status</p>
            <p className={`text-lg font-bold uppercase tracking-wider ${state.won ? "text-secondary" : "text-destructive"}`}>
              {state.won ? "MISSION SUCCESS" : "ORBIT COLLAPSED"}
            </p>
          </div>
        </div>
      </div>

      <Button
        onClick={handleShare}
        disabled={isExporting}
        variant="outline"
        className="w-full flex items-center gap-2 border-primary/30 hover:bg-primary/20 text-primary"
      >
        {isExporting ? <Download className="w-4 h-4 animate-bounce" /> : <Share2 className="w-4 h-4" />}
        {isExporting ? "Exporting..." : "Share Transmission"}
      </Button>
    </div>
  );
}
