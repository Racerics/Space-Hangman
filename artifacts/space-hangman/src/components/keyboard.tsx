import { Button } from "@/components/ui/button";

interface KeyboardProps {
  guessed: string[];
  word: string;
  onGuess: (letter: string) => void;
  disabled: boolean;
}

export function Keyboard({ guessed, word, onGuess, disabled }: KeyboardProps) {
  const rows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ];

  return (
    <div className="flex flex-col gap-2 w-full max-w-3xl mx-auto mt-8">
      {rows.map((row, i) => (
        <div key={i} className="flex justify-center gap-1 md:gap-2">
          {row.map((letter) => {
            const isGuessed = guessed.includes(letter);
            const isCorrect = isGuessed && word.includes(letter);
            const isWrong = isGuessed && !word.includes(letter);

            let variant: "default" | "outline" | "secondary" | "destructive" = "outline";
            let className = "w-8 h-10 md:w-12 md:h-14 font-mono text-lg md:text-xl transition-all duration-300";

            if (isCorrect) {
              variant = "secondary";
              className += " glow-box bg-secondary/20 text-secondary border-secondary";
            } else if (isWrong) {
              variant = "destructive";
              className += " opacity-50 bg-destructive/10 border-destructive/30";
            } else {
              className += " hover:bg-primary/20 hover:text-primary hover:border-primary border-border/50 bg-card/40 text-muted-foreground";
            }

            return (
              <Button
                key={letter}
                variant={variant}
                onClick={() => onGuess(letter)}
                disabled={disabled || isGuessed}
                className={className}
              >
                {letter}
              </Button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
