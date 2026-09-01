import { useState, useCallback } from "react";
import type { QuizAttempt } from "../types/quiz";
import { getQuizHistory, saveQuizAttempt, clearQuizHistory as clearStorageHistory } from "../services/quizStorage";

export function useQuizHistory() {
  const [quizHistory, setQuizHistory] = useState<QuizAttempt[]>(() => getQuizHistory());

  const addAttempt = useCallback((attempt: QuizAttempt) => {
    saveQuizAttempt(attempt);
    setQuizHistory(getQuizHistory());
  }, []);

  const clearHistory = useCallback(() => {
    clearStorageHistory();
    setQuizHistory([]);
  }, []);

  return {
    quizHistory,
    addAttempt,
    clearHistory,
  };
}
