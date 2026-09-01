import { useState, useCallback } from "react";
import type { QuizQuestion, QuizResult, QuizAttempt } from "../types/quiz";

export function useQuizEngine(topic: string, onFinish?: (attempt: QuizAttempt) => void) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [quizFinished, setQuizFinished] = useState(false);
  const [currentAttempt, setCurrentAttempt] = useState<QuizAttempt | null>(null);

  const startQuiz = useCallback((newQuestions: QuizQuestion[]) => {
    setQuestions(newQuestions);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setResults([]);
    setCurrentAttempt(null);
    setQuizFinished(false);
  }, []);

  const handleAnswerSelect = useCallback((answer: number) => {
    if (selectedAnswer !== null) return;

    const question = questions[currentQuestion];
    if (!question) return;

    const result: QuizResult = {
      question: question.question,
      selectedAnswer: answer,
      correctAnswer: question.correctAnswer,
      isCorrect: answer === question.correctAnswer,
    };

    setSelectedAnswer(answer);

    setResults((prev) => {
      const updated = [...prev];
      updated[currentQuestion] = result;
      return updated;
    });
  }, [selectedAnswer, questions, currentQuestion]);

  const finishQuiz = useCallback((finalResults: QuizResult[] = results) => {
    const completedResults = finalResults.filter(Boolean);
    const correctAnswers = completedResults.filter((r) => r.isCorrect).length;
    const totalQuestions = questions.length;
    const finalScore = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    const attempt: QuizAttempt = {
      id: crypto.randomUUID(),
      topic: topic.trim(),
      totalQuestions,
      correctAnswers,
      score: finalScore,
      completedAt: new Date().toISOString(),
    };

    setCurrentAttempt(attempt);
    setQuizFinished(true);

    if (onFinish) {
      onFinish(attempt);
    }
  }, [questions.length, results, topic, onFinish]);

  const handleNext = useCallback(() => {
    if (selectedAnswer === null) return;

    if (currentQuestion === questions.length - 1) {
      const question = questions[currentQuestion];
      if (!question) return;

      const currentResult: QuizResult = {
        question: question.question,
        selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect: selectedAnswer === question.correctAnswer,
      };

      const finalResults = [...results];
      finalResults[currentQuestion] = currentResult;
      setResults(finalResults);
      finishQuiz(finalResults);
      return;
    }

    setCurrentQuestion((prev) => prev + 1);
    const nextResult = results[currentQuestion + 1];
    setSelectedAnswer(nextResult ? nextResult.selectedAnswer : null);
  }, [currentQuestion, questions, results, selectedAnswer, finishQuiz]);

  const handlePrevious = useCallback(() => {
    if (currentQuestion === 0) return;

    const previousQuestionIndex = currentQuestion - 1;
    setCurrentQuestion(previousQuestionIndex);
    const previousResult = results[previousQuestionIndex];
    setSelectedAnswer(previousResult ? previousResult.selectedAnswer : null);
  }, [currentQuestion, results]);

  const handleRetryWrong = useCallback(() => {
    const wrongQuestions = questions.filter((_, index) => {
      const result = results[index];
      return result && !result.isCorrect;
    });

    if (wrongQuestions.length > 0) {
      startQuiz(wrongQuestions);
    }
  }, [questions, results, startQuiz]);

  const clearQuiz = useCallback(() => {
    startQuiz([]);
  }, [startQuiz]);

  return {
    questions,
    currentQuestion,
    currentQuizQuestion: questions[currentQuestion],
    selectedAnswer,
    results,
    quizFinished,
    currentAttempt,
    startQuiz,
    handleAnswerSelect,
    handleNext,
    handlePrevious,
    handleRetryWrong,
    clearQuiz,
    setQuestions,
    setCurrentAttempt,
    setQuizFinished,
  };
}
