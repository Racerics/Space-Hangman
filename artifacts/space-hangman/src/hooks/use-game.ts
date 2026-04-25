import { useReducer, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { firestore } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export type GameState = {
  word: string;
  guessed: string[];
  wrong: number;
  score: number;
  streak: number;
  isGameOver: boolean;
  won: boolean;
};

type Action =
  | { type: "SET_WORD"; payload: string }
  | { type: "GUESS"; payload: string }
  | { type: "RESET" };

const MAX_WRONG = 6;

function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "SET_WORD":
      return {
        word: action.payload.toUpperCase(),
        guessed: [],
        wrong: 0,
        score: 0,
        streak: 0,
        isGameOver: false,
        won: false,
      };
    case "GUESS": {
      if (state.isGameOver) return state;
      const letter = action.payload.toUpperCase();
      if (state.guessed.includes(letter)) return state;

      const newGuessed = [...state.guessed, letter];
      const isCorrect = state.word.includes(letter);

      let newWrong = state.wrong;
      let newStreak = state.streak;
      let newScore = state.score;

      if (isCorrect) {
        newStreak += 1;
        newScore += 10 * newStreak;
      } else {
        newWrong += 1;
        newStreak = 0;
      }

      const allRevealed = state.word
        .split("")
        .every((char) => newGuessed.includes(char) || !/[A-Z]/.test(char));
      const won = allRevealed;
      const isGameOver = won || newWrong >= MAX_WRONG;

      return {
        ...state,
        guessed: newGuessed,
        wrong: newWrong,
        streak: newStreak,
        score: newScore,
        isGameOver,
        won,
      };
    }
    case "RESET":
      return {
        word: "",
        guessed: [],
        wrong: 0,
        score: 0,
        streak: 0,
        isGameOver: false,
        won: false,
      };
    default:
      return state;
  }
}

export function useGame(mode: "solo" | "daily") {
  const [state, dispatch] = useReducer(gameReducer, {
    word: "",
    guessed: [],
    wrong: 0,
    score: 0,
    streak: 0,
    isGameOver: false,
    won: false,
  });

  const { user } = useAuth();

  useEffect(() => {
    if (!state.isGameOver || !state.word || !user) return;

    addDoc(collection(firestore, "scores"), {
      userId: user.uid,
      userName: user.displayName || user.email || "Anonymous Astronaut",
      userAvatar: user.photoURL || null,
      score: state.score,
      streak: state.streak,
      word: state.word,
      mode,
      won: state.won,
      createdAt: serverTimestamp(),
    }).catch(() => {});
  }, [state.isGameOver]);

  const setWord = (word: string) => dispatch({ type: "SET_WORD", payload: word });
  const guess = (letter: string) => dispatch({ type: "GUESS", payload: letter });
  const reset = () => dispatch({ type: "RESET" });

  return { state, setWord, guess, reset };
}
