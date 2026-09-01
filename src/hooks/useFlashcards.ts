import { useState, useCallback } from "react";
import type { Flashcard } from "../types/quiz";

export function useFlashcards() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);

  const startFlashcards = useCallback((cards: Flashcard[]) => {
    setFlashcards(cards);
  }, []);

  const clearFlashcards = useCallback(() => {
    setFlashcards([]);
  }, []);

  return { flashcards, startFlashcards, clearFlashcards };
}
