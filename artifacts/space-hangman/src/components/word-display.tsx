interface WordDisplayProps {
  word: string;
  guessed: string[];
  isGameOver: boolean;
}

export function WordDisplay({ word, guessed, isGameOver }: WordDisplayProps) {
  if (!word) return null;

  return (
    <div className="flex flex-wrap justify-center gap-2 md:gap-4 my-12">
      {word.split("").map((letter, index) => {
        const isRevealed = guessed.includes(letter) || !/[A-Z]/.test(letter);
        const missed = isGameOver && !isRevealed && /[A-Z]/.test(letter);
        
        return (
          <div
            key={index}
            className={`flex items-center justify-center w-10 h-14 md:w-16 md:h-20 border-b-2 text-2xl md:text-4xl font-mono font-bold transition-all duration-500
              ${missed ? "border-destructive text-destructive animate-pulse" : ""}
              ${isRevealed && /[A-Z]/.test(letter) ? "border-secondary text-secondary glow-text animate-in slide-in-from-bottom-2" : ""}
              ${!isRevealed && !missed ? "border-muted-foreground" : ""}
            `}
          >
            {isRevealed || missed ? letter : ""}
          </div>
        );
      })}
    </div>
  );
}
