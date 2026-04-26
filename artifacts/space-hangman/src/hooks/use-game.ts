import { useReducer, useEffect, useRef } from "react";
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

export const MAX_WRONG = 6;

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

const INITIAL_STATE: GameState = {
  word: "",
  guessed: [],
  wrong: 0,
  score: 0,
  streak: 0,
  isGameOver: false,
  won: false,
};

export function useGame(mode: "solo" | "daily") {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);
  const { user } = useAuth();

  // Use a ref to avoid stale closures on game-over submission
  const stateRef = useRef(state);
  const userRef = useRef(user);
  const scoreSentRef = useRef(false);

  useEffect(() => { stateRef.current = state; }, [state]);
  useEffect(() => { userRef.current = user; }, [user]);

  // Reset score-sent flag when a new word starts
  useEffect(() => {
    if (state.word && !state.isGameOver) {
      scoreSentRef.current = false;
    }
  }, [state.word, state.isGameOver]);

  // Submit score to Firestore once per game, only when signed in
  useEffect(() => {
    if (!state.isGameOver || !state.word || scoreSentRef.current) return;
    if (!userRef.current) return;

    scoreSentRef.current = true;
    const { word, score, streak, won } = stateRef.current;
    const u = userRef.current;

    addDoc(collection(firestore, "scores"), {
      userId: u.uid,
      userName: u.displayName || u.email || "Anonymous Astronaut",
      userAvatar: u.photoURL || null,
      score,
      streak,
      word,
      mode,
      won,
      createdAt: serverTimestamp(),
    }).catch(() => {});
  }, [state.isGameOver, mode]);

  const setWord = (word: string) => {
    if (word) dispatch({ type: "SET_WORD", payload: word });
  };

  const guess = (letter: string) => {
    const l = letter.toUpperCase();
    if (/^[A-Z]$/.test(l)) dispatch({ type: "GUESS", payload: l });
  };

  const reset = () => dispatch({ type: "RESET" });

  return { state, setWord, guess, reset };
}
