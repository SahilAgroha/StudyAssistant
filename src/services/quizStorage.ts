import type { QuizAttempt } from "../types/quiz";

const STORAGE_KEY = "studymate_quiz_history";

export const getQuizHistory = (): QuizAttempt[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    return JSON.parse(stored) as QuizAttempt[];
  } catch (error) {
    console.error("Failed to read quiz history:", error);
    return [];
  }
};

export const saveQuizAttempt = (attempt: QuizAttempt): void => {
  try {
    const history = getQuizHistory();

    const updatedHistory = [attempt, ...history];

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedHistory)
    );
  } catch (error) {
    console.error("Failed to save quiz attempt:", error);
  }
};

export const clearQuizHistory = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear quiz history:", error);
  }
};