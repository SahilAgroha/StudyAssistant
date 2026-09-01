import { useEffect, useState } from "react";

import type {
  QuizAttempt,
  QuizQuestion,
  QuizResult,
} from "./types/quiz";

import {
  getQuizHistory,
  saveQuizAttempt,
  clearQuizHistory,
} from "./services/quizStorage";

import { generateQuiz } from "./services/quizService";

function App() {
  const [topic, setTopic] = useState("");

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(
    null
  );

  const [results, setResults] = useState<QuizResult[]>([]);

  const [quizFinished, setQuizFinished] = useState(false);

  const [quizHistory, setQuizHistory] = useState<QuizAttempt[]>([]);

  const [isGenerating, setIsGenerating] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    setQuizHistory(getQuizHistory());
  }, []);

  const handleGenerateQuiz = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic or paste your notes.");
      return;
    }

    try {
      setIsGenerating(true);
      setError("");

      const generatedQuestions = await generateQuiz(topic);

      setQuestions(generatedQuestions);
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setResults([]);
      setQuizFinished(false);

      setTimeout(() => {
        document
          .getElementById("quiz-section")
          ?.scrollIntoView({
            behavior: "smooth",
          });
      }, 100);
    } catch (err) {
      console.error("Failed to generate quiz:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while generating the quiz."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) {
      return;
    }

    const question = questions[currentQuestion];

    const result: QuizResult = {
      question: question.question,
      selectedAnswer: answerIndex,
      correctAnswer: question.correctAnswer,
      isCorrect: answerIndex === question.correctAnswer,
    };

    setSelectedAnswer(answerIndex);

    setResults((previous) => [...previous, result]);
  };

  const handleNext = () => {
    if (selectedAnswer === null) {
      return;
    }

    if (currentQuestion === questions.length - 1) {
      finishQuiz();
      return;
    }

    setCurrentQuestion((previous) => previous + 1);
    setSelectedAnswer(null);
  };

  const handlePrevious = () => {
    if (currentQuestion === 0) {
      return;
    }

    const previousQuestionIndex = currentQuestion - 1;

    setCurrentQuestion(previousQuestionIndex);

    const previousResult = results[previousQuestionIndex];

    if (previousResult) {
      setSelectedAnswer(previousResult.selectedAnswer);
    } else {
      setSelectedAnswer(null);
    }
  };

  const finishQuiz = () => {
    const correctAnswers = results.filter(
      (result) => result.isCorrect
    ).length;

    const totalQuestions = questions.length;

    const finalScore =
      totalQuestions > 0
        ? Math.round((correctAnswers / totalQuestions) * 100)
        : 0;

    const attempt: QuizAttempt = {
      id: crypto.randomUUID(),
      topic: topic.trim(),
      totalQuestions,
      correctAnswers,
      score: finalScore,
      completedAt: new Date().toISOString(),
    };

    saveQuizAttempt(attempt);

    setQuizHistory(getQuizHistory());

    setQuizFinished(true);
  };

  const retryWrongAnswers = () => {
    const wrongQuestions = results
      .map((result, index) => {
        if (!result.isCorrect) {
          return questions[index];
        }

        return null;
      })
      .filter(
        (question): question is QuizQuestion =>
          question !== null
      );

    setQuestions(wrongQuestions);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setResults([]);
    setQuizFinished(false);

    setTimeout(() => {
      document
        .getElementById("quiz-section")
        ?.scrollIntoView({
          behavior: "smooth",
        });
    }, 100);
  };

  const createNewQuiz = () => {
    setQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setResults([]);
    setQuizFinished(false);
    setTopic("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleClearHistory = () => {
    clearQuizHistory();
    setQuizHistory([]);
  };

  const currentQuizQuestion = questions[currentQuestion];

  const correctCount = results.filter(
    (result) => result.isCorrect
  ).length;

  const wrongCount = results.filter(
    (result) => !result.isCorrect
  ).length;

  const finalScore =
    results.length > 0
      ? Math.round((correctCount / results.length) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      {/* Navbar */}
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <div>
            <h1 className="text-2xl font-bold">
              StudyMate
            </h1>

            <p className="text-sm text-slate-400">
              AI-powered study assistant
            </p>
          </div>

          <button className="rounded-full border border-slate-700 px-5 py-2 text-sm text-slate-300 transition hover:border-indigo-500 hover:text-white">
            Study Assistant
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-16">
        {/* Hero */}
        <section className="text-center">
          <div className="mb-6 inline-flex rounded-full border border-indigo-500/40 bg-indigo-500/10 px-5 py-2 text-sm text-indigo-300">
            Turn your notes into interactive quizzes
          </div>

          <h2 className="text-5xl font-bold leading-tight md:text-6xl">
            Learn smarter.
            <br />

            <span className="text-indigo-500">
              Test yourself.
            </span>
          </h2>

          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-slate-400">
            Paste your study notes or enter a topic. Your study
            assistant will turn them into an interactive quiz.
          </p>
        </section>

        {/* Study Input */}
        <section className="mx-auto mt-16 max-w-5xl rounded-2xl border border-slate-800 bg-slate-900/80 p-7">
          <div className="mb-5 flex items-center justify-between">
            <label className="text-lg font-semibold">
              What do you want to study?
            </label>

            <span className="text-sm text-slate-500">
              {topic.length} characters
            </span>
          </div>

          <textarea
            value={topic}
            onChange={(event) => {
              setTopic(event.target.value);

              if (error) {
                setError("");
              }
            }}
            placeholder="Paste your notes or enter a topic..."
            className="min-h-52 w-full resize-none rounded-xl border border-slate-700 bg-[#020617] p-5 text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />

          {error && (
            <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="mt-6 flex flex-col items-center justify-between gap-5 sm:flex-row">
            <p className="text-sm text-slate-500">
              Example: Explain operating system processes,
              threads, and scheduling.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setTopic("");
                  setError("");
                }}
                disabled={!topic || isGenerating}
                className="rounded-xl border border-slate-700 px-6 py-3 font-medium text-slate-300 transition hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Clear
              </button>

              <button
                onClick={handleGenerateQuiz}
                disabled={!topic.trim() || isGenerating}
                className="min-w-36 rounded-xl bg-indigo-500 px-7 py-3 font-semibold transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Generating...
                  </span>
                ) : (
                  "Generate Quiz"
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Quiz */}
        {questions.length > 0 &&
          !quizFinished &&
          currentQuizQuestion && (
            <section
              id="quiz-section"
              className="mx-auto mt-10 max-w-5xl rounded-2xl border border-slate-800 bg-slate-900/80 p-7"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Question {currentQuestion + 1} of{" "}
                  {questions.length}
                </h3>

                <span className="text-sm text-slate-400">
                  {Math.round(
                    ((currentQuestion + 1) /
                      questions.length) *
                      100
                  )}
                  %
                </span>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-indigo-500 transition-all duration-300"
                  style={{
                    width: `${
                      ((currentQuestion + 1) /
                        questions.length) *
                      100
                    }%`,
                  }}
                />
              </div>

              <h3 className="mt-10 text-2xl font-bold">
                {currentQuizQuestion.question}
              </h3>

              <div className="mt-7 space-y-4">
                {currentQuizQuestion.options.map(
                  (option, index) => {
                    const isSelected =
                      selectedAnswer === index;

                    const isCorrect =
                      currentQuizQuestion.correctAnswer ===
                      index;

                    let optionClass =
                      "border-slate-700 bg-[#020617] hover:border-indigo-500";

                    if (selectedAnswer !== null) {
                      if (isCorrect) {
                        optionClass =
                          "border-emerald-500 bg-emerald-500/10";
                      } else if (isSelected) {
                        optionClass =
                          "border-red-500 bg-red-500/10";
                      } else {
                        optionClass =
                          "border-slate-800 bg-[#020617] opacity-70";
                      }
                    }

                    return (
                      <button
                        key={`${option}-${index}`}
                        onClick={() =>
                          handleAnswerSelect(index)
                        }
                        disabled={selectedAnswer !== null}
                        className={`w-full rounded-xl border p-5 text-left transition ${optionClass}`}
                      >
                        {option}
                      </button>
                    );
                  }
                )}
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className="rounded-xl border border-slate-700 px-6 py-3 text-slate-300 transition hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  ← Previous
                </button>

                <button
                  onClick={handleNext}
                  disabled={selectedAnswer === null}
                  className="rounded-xl bg-indigo-500 px-7 py-3 font-semibold transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  {currentQuestion ===
                  questions.length - 1
                    ? "Finish Quiz"
                    : "Next →"}
                </button>
              </div>
            </section>
          )}

        {/* Result */}
        {quizFinished && (
          <section
            id="quiz-section"
            className="mx-auto mt-10 max-w-5xl rounded-2xl border border-slate-800 bg-slate-900/80 p-8"
          >
            <div className="flex justify-center">
              <div className="flex h-48 w-48 items-center justify-center rounded-full border-8 border-indigo-500">
                <div className="text-center">
                  <div className="text-5xl font-bold">
                    {finalScore}%
                  </div>

                  <div className="mt-1 text-slate-400">
                    Score
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-8 text-center">
                <div className="text-4xl font-bold text-emerald-400">
                  {correctCount}
                </div>

                <p className="mt-2 text-slate-400">
                  Correct
                </p>
              </div>

              <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-8 text-center">
                <div className="text-4xl font-bold text-red-400">
                  {wrongCount}
                </div>

                <p className="mt-2 text-slate-400">
                  Wrong
                </p>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-xl font-semibold">
                Question Summary
              </h3>

              <div className="mt-5 space-y-3">
                {results.map((result, index) => (
                  <div
                    key={`${result.question}-${index}`}
                    className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#020617] p-5"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm ${
                          result.isCorrect
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {index + 1}
                      </div>

                      <span className="text-slate-300">
                        {result.question}
                      </span>
                    </div>

                    <span
                      className={
                        result.isCorrect
                          ? "text-emerald-400"
                          : "text-red-400"
                      }
                    >
                      {result.isCorrect ? "✓" : "✕"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {wrongCount > 0 && (
                <button
                  onClick={retryWrongAnswers}
                  className="rounded-xl bg-indigo-500 px-6 py-4 font-semibold transition hover:bg-indigo-400"
                >
                  Retry Wrong Answers
                </button>
              )}

              <button
                onClick={createNewQuiz}
                className={`rounded-xl border border-slate-700 px-6 py-4 font-semibold text-slate-300 transition hover:border-slate-500 ${
                  wrongCount === 0
                    ? "md:col-span-2"
                    : ""
                }`}
              >
                Create New Quiz
              </button>
            </div>
          </section>
        )}

        {/* History */}
        {quizHistory.length > 0 && (
          <section className="mx-auto mt-10 max-w-5xl rounded-2xl border border-slate-800 bg-slate-900/80 p-7">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">
                Quiz History
              </h3>

              <button
                onClick={handleClearHistory}
                className="text-sm text-red-400 transition hover:text-red-300"
              >
                Clear History
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {quizHistory.map((attempt) => (
                <div
                  key={attempt.id}
                  className="flex flex-col justify-between gap-3 rounded-xl border border-slate-800 bg-[#020617] p-5 sm:flex-row sm:items-center"
                >
                  <div>
                    <p className="font-medium">
                      {attempt.topic}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {attempt.correctAnswers}/
                      {attempt.totalQuestions} correct
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-indigo-400">
                      {attempt.score}%
                    </p>

                    <p className="text-xs text-slate-600">
                      {new Date(
                        attempt.completedAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;