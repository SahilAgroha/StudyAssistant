export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface QuizResult {
  question: string;
  selectedAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
}

export interface QuizAttempt {
  id: string;
  topic: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  completedAt: string;
}