import { useEffect } from "react";
import { useGame } from "@/hooks/use-game";
import { useGetWords, useGetDailyChallenge } from "@workspace/api-client-react";
import { Keyboard } from "@/components/keyboard";
import { WordDisplay } from "@/components/word-display";
import { BlackHole } from "@/components/black-hole";
import { ScoreCard } from "@/components/score-card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function GamePage({ mode = "solo" }: { mode?: "solo" | "daily" }) {
  const { state, setWord, guess, reset } = useGame(mode);
  
  const wordsQuery = useGetWords({}, { query: { enabled: mode === "solo" } });
  const dailyQuery = useGetDailyChallenge({ query: { enabled: mode === "daily" } });

  const isLoading = mode === "solo" ? wordsQuery.isLoading : dailyQuery.isLoading;

  useEffect(() => {
    if (mode === "solo" && wordsQuery.data?.words?.length) {
      if (!state.word && !state.isGameOver) {
        const words = wordsQuery.data.words;
        const randomWord = words[Math.floor(Math.random() * words.length)];
        setWord(randomWord);
      }
    } else if (mode === "daily" && dailyQuery.data?.word) {
      if (!state.word && !state.isGameOver) {
        setWord(dailyQuery.data.word);
      }
    }
  }, [mode, wordsQuery.data, dailyQuery.data, state.word, state.isGameOver, setWord]);

  const handleNextGame = () => {
    reset();
    if (mode === "solo" && wordsQuery.data?.words?.length) {
      const words = wordsQuery.data.words;
      const randomWord = words[Math.floor(Math.random() * words.length)];
      setWord(randomWord);
    }
  };

  if (isLoading || !state.word) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="flex flex-col items-center gap-4 text-primary">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="animate-pulse">Establishing connection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row p-4 gap-8 max-w-7xl mx-auto w-full mt-8">
      {/* Game Info & Interactions */}
      <div className="flex-1 flex flex-col items-center gap-8 justify-center">
        <div className="w-full flex justify-between items-center px-4 py-2 border border-border/50 bg-card/50 backdrop-blur rounded-lg shadow-lg">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground uppercase tracking-widest">Score</span>
            <span className="text-2xl font-mono text-secondary glow-text">{state.score}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-muted-foreground uppercase tracking-widest">Streak</span>
            <span className="text-2xl font-mono text-primary glow-text">{state.streak}</span>
          </div>
        </div>

        <WordDisplay word={state.word} guessed={state.guessed} isGameOver={state.isGameOver} />

        <div className="w-full max-w-3xl">
          <Keyboard guessed={state.guessed} word={state.word} onGuess={guess} disabled={state.isGameOver} />
        </div>
      </div>

      {/* Visuals */}
      <div className="w-full md:w-[400px] lg:w-[500px] h-[400px] md:h-auto border border-border/30 rounded-xl overflow-hidden relative glow-box bg-black/40">
        <BlackHole wrongGuesses={state.wrong} isGameOver={state.isGameOver} won={state.won} />
        
        {state.isGameOver && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 z-10 animate-in fade-in zoom-in duration-500">
            <ScoreCard state={state} mode={mode} />
            {mode === "solo" ? (
              <Button onClick={handleNextGame} className="mt-6 w-full max-w-sm glow-box hover:bg-primary/90 transition-all text-white font-bold">
                INITIATE NEXT SEQUENCE
              </Button>
            ) : (
              <div className="mt-6 text-center text-muted-foreground text-sm">
                <p>Daily Challenge Complete.</p>
                <p>Return tomorrow for a new transmission.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}