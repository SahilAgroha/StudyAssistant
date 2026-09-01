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

const mockQuestions: QuizQuestion[] = [
  {
    question: "What is inheritance in Java?",
    options: [
      "Acquiring properties and behavior from another class",
      "Creating multiple objects from one class",
      "Converting Java code into machine code",
      "Handling runtime exceptions",
    ],
    correctAnswer: 0,
  },
  {
    question: "Which keyword is used to inherit a class in Java?",
    options: [
      "implements",
      "extends",
      "inherits",
      "super",
    ],
    correctAnswer: 1,
  },
  {
    question: "What does polymorphism allow?",
    options: [
      "One interface to have multiple implementations",
      "A class to have only one object",
      "A method to never be overridden",
      "A program to run without compilation",
    ],
    correctAnswer: 0,
  },
  {
    question:
      "Which concept allows a child class to provide its own implementation of a parent method?",
    options: [
      "Encapsulation",
      "Inheritance",
      "Method overriding",
      "Abstraction",
    ],
    correctAnswer: 2,
  },
  {
    question: "Which keyword refers to the immediate parent class?",
    options: [
      "this",
      "parent",
      "super",
      "base",
    ],
    correctAnswer: 2,
  },
];

function App() {
  const [topic, setTopic] = useState("");

  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [selectedAnswers, setSelectedAnswers] = useState<
    number[]
  >([]);

  const [quizFinished, setQuizFinished] = useState(false);

  const [showHistory, setShowHistory] = useState(false);

  const [history, setHistory] = useState<QuizAttempt[]>([]);

  useEffect(() => {
    setHistory(getQuizHistory());
  }, []);

  const generateQuiz = () => {
    if (!topic.trim()) {
      return;
    }

    setQuiz(mockQuestions);
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setQuizFinished(false);

    setTimeout(() => {
      document
        .getElementById("quiz-section")
        ?.scrollIntoView({
          behavior: "smooth",
        });
    }, 100);
  };

  const selectAnswer = (answerIndex: number) => {
    if (selectedAnswers[currentQuestion] !== undefined) {
      return;
    }

    setSelectedAnswers((previous) => {
      const updated = [...previous];
      updated[currentQuestion] = answerIndex;
      return updated;
    });
  };

  const nextQuestion = () => {
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion((previous) => previous + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((previous) => previous - 1);
    }
  };

  const finishQuiz = () => {
    if (selectedAnswers.length !== quiz.length) {
      return;
    }

    const correctAnswers = quiz.reduce(
      (count, question, index) => {
        return (
          count +
          (selectedAnswers[index] === question.correctAnswer
            ? 1
            : 0)
        );
      },
      0
    );

    const score = Math.round(
      (correctAnswers / quiz.length) * 100
    );

    const attempt: QuizAttempt = {
      id: Date.now().toString(),
      topic: topic.trim(),
      totalQuestions: quiz.length,
      correctAnswers,
      score,
      completedAt: new Date().toISOString(),
    };

    saveQuizAttempt(attempt);

    setHistory(getQuizHistory());
    setQuizFinished(true);

    setTimeout(() => {
      document
        .getElementById("result-section")
        ?.scrollIntoView({
          behavior: "smooth",
        });
    }, 100);
  };

  const calculateScore = () => {
    return quiz.reduce((score, question, index) => {
      return (
        score +
        (selectedAnswers[index] === question.correctAnswer
          ? 1
          : 0)
      );
    }, 0);
  };

  const getResults = (): QuizResult[] => {
    return quiz.map((question, index) => ({
      question: question.question,
      selectedAnswer: selectedAnswers[index],
      correctAnswer: question.correctAnswer,
      isCorrect:
        selectedAnswers[index] === question.correctAnswer,
    }));
  };

  const retryWrongAnswers = () => {
    const wrongQuestions = quiz.filter(
      (question, index) =>
        selectedAnswers[index] !== question.correctAnswer
    );

    setQuiz(wrongQuestions);
    setSelectedAnswers([]);
    setCurrentQuestion(0);
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
    setQuiz([]);
    setSelectedAnswers([]);
    setCurrentQuestion(0);
    setQuizFinished(false);
    setTopic("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleClear = () => {
    setTopic("");
  };

  const handleClearHistory = () => {
    clearQuizHistory();
    setHistory([]);
  };

  const score = calculateScore();

  const progress =
    quiz.length > 0
      ? ((currentQuestion + 1) / quiz.length) * 100
      : 0;

  const currentQuizQuestion = quiz[currentQuestion];

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      {/* HEADER */}

      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div>
            <h1 className="text-2xl font-bold">
              StudyMate
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              AI-powered study assistant
            </p>
          </div>

          <button
            onClick={() => setShowHistory(!showHistory)}
            className="rounded-full border border-slate-700 px-5 py-2 text-sm text-slate-300 transition hover:border-indigo-500 hover:text-white"
          >
            {showHistory
              ? "Study Assistant"
              : "Quiz History"}
          </button>
        </div>
      </header>

      {/* HISTORY */}

      {showHistory ? (
        <main className="mx-auto max-w-5xl px-6 py-16">
          <div className="mb-10">
            <h2 className="text-3xl font-bold">
              Quiz History
            </h2>

            <p className="mt-2 text-slate-400">
              Review your previous quiz attempts.
            </p>
          </div>

          {history.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-16 text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-2xl">
                📚
              </div>

              <h3 className="text-xl font-semibold">
                No quiz history yet
              </h3>

              <p className="mt-2 text-slate-400">
                Complete your first quiz and it will
                appear here.
              </p>

              <button
                onClick={() => setShowHistory(false)}
                className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 font-semibold transition hover:bg-indigo-500"
              >
                Create Quiz
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {history.map((attempt) => (
                  <div
                    key={attempt.id}
                    className="flex flex-col justify-between gap-5 rounded-2xl border border-slate-800 bg-slate-900 p-6 md:flex-row md:items-center"
                  >
                    <div>
                      <h3 className="text-lg font-semibold">
                        {attempt.topic}
                      </h3>

                      <p className="mt-1 text-sm text-slate-400">
                        {attempt.correctAnswers} /{" "}
                        {attempt.totalQuestions} correct
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {new Date(
                          attempt.completedAt
                        ).toLocaleString()}
                      </p>
                    </div>

                    <div className="text-left md:text-right">
                      <p className="text-3xl font-bold text-indigo-400">
                        {attempt.score}%
                      </p>

                      <p className="text-sm text-slate-500">
                        Score
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setShowHistory(false)}
                  className="rounded-xl border border-slate-700 px-5 py-3 text-slate-300 transition hover:border-indigo-500"
                >
                  Back to Study
                </button>

                <button
                  onClick={handleClearHistory}
                  className="rounded-xl border border-red-900 px-5 py-3 text-red-400 transition hover:bg-red-950"
                >
                  Clear History
                </button>
              </div>
            </>
          )}
        </main>
      ) : (
        <>
          {/* HERO */}

          <main className="mx-auto max-w-6xl px-6 py-20">
            <section className="text-center">
              <div className="mx-auto mb-7 inline-flex rounded-full border border-indigo-500/40 bg-indigo-500/10 px-5 py-2 text-sm text-indigo-300">
                Turn your notes into interactive quizzes
              </div>

              <h2 className="text-5xl font-bold tracking-tight md:text-6xl">
                Learn smarter.
                <br />

                <span className="text-indigo-400">
                  Test yourself.
                </span>
              </h2>

              <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-slate-400">
                Paste your study notes or enter a topic.
                Your study assistant will turn them into
                an interactive quiz.
              </p>
            </section>

            {/* INPUT */}

            <section className="mt-16 rounded-2xl border border-slate-800 bg-slate-900/80 p-7 shadow-2xl">
              <div className="mb-4 flex items-center justify-between">
                <label className="font-semibold">
                  What do you want to study?
                </label>

                <span className="text-sm text-slate-500">
                  {topic.length} characters
                </span>
              </div>

              <textarea
                value={topic}
                onChange={(event) =>
                  setTopic(event.target.value)
                }
                placeholder="Paste your notes or enter a topic..."
                className="min-h-[220px] w-full resize-none rounded-xl border border-slate-700 bg-[#020617] p-5 text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />

              <div className="mt-6 flex flex-col justify-between gap-5 md:flex-row md:items-center">
                <p className="text-sm text-slate-500">
                  Example: Explain operating system
                  processes, threads, and scheduling.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={handleClear}
                    disabled={!topic}
                    className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-slate-300 transition hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Clear
                  </button>

                  <button
                    onClick={generateQuiz}
                    disabled={!topic.trim()}
                    className="rounded-xl bg-indigo-600 px-7 py-3 font-semibold transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Generate Quiz
                  </button>
                </div>
              </div>
            </section>

            {/* EMPTY STATE */}

            {quiz.length === 0 && (
              <section className="mt-10 rounded-2xl border border-dashed border-slate-800 p-16 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-2xl">
                  📚
                </div>

                <h3 className="text-xl font-semibold">
                  Your quiz will appear here
                </h3>

                <p className="mt-2 text-slate-500">
                  Enter a topic or paste your notes above
                  to get started.
                </p>
              </section>
            )}

            {/* QUIZ */}

            {quiz.length > 0 && !quizFinished && (
              <section
                id="quiz-section"
                className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-7"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">
                    Question {currentQuestion + 1} of{" "}
                    {quiz.length}
                  </h3>

                  <span className="text-sm text-slate-400">
                    {Math.round(progress)}%
                  </span>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-indigo-500 transition-all duration-300"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>

                <h2 className="mt-10 text-2xl font-bold">
                  {currentQuizQuestion.question}
                </h2>

                <div className="mt-7 space-y-4">
                  {currentQuizQuestion.options.map(
                    (option, index) => {
                      const selected =
                        selectedAnswers[
                          currentQuestion
                        ] === index;

                      return (
                        <button
                          key={option}
                          onClick={() =>
                            selectAnswer(index)
                          }
                          className={`w-full rounded-xl border p-5 text-left transition ${
                            selected
                              ? "border-indigo-500 bg-indigo-500/10"
                              : "border-slate-800 bg-[#020617] hover:border-indigo-500/50"
                          }`}
                        >
                          {option}
                        </button>
                      );
                    }
                  )}
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    onClick={previousQuestion}
                    disabled={currentQuestion === 0}
                    className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-slate-300 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    ← Previous
                  </button>

                  {currentQuestion ===
                  quiz.length - 1 ? (
                    <button
                      onClick={finishQuiz}
                      disabled={
                        selectedAnswers.length !==
                        quiz.length
                      }
                      className="rounded-xl bg-indigo-600 px-7 py-3 font-semibold transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      Finish Quiz
                    </button>
                  ) : (
                    <button
                      onClick={nextQuestion}
                      disabled={
                        selectedAnswers[
                          currentQuestion
                        ] === undefined
                      }
                      className="rounded-xl bg-indigo-600 px-7 py-3 font-semibold transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      Next →
                    </button>
                  )}
                </div>
              </section>
            )}

            {/* RESULT */}

            {quizFinished && (
              <section
                id="result-section"
                className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-7"
              >
                <div className="text-center">
                  <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-full border-8 border-indigo-500">
                    <div>
                      <p className="text-5xl font-bold">
                        {Math.round(
                          (score / quiz.length) * 100
                        )}
                        %
                      </p>

                      <p className="mt-1 text-slate-500">
                        Score
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-10 grid gap-5 md:grid-cols-2">
                  <div className="rounded-2xl border border-emerald-900 bg-emerald-950/20 p-7 text-center">
                    <p className="text-4xl font-bold text-emerald-400">
                      {score}
                    </p>

                    <p className="mt-2 text-slate-400">
                      Correct
                    </p>
                  </div>

                  <div className="rounded-2xl border border-red-900 bg-red-950/20 p-7 text-center">
                    <p className="text-4xl font-bold text-red-400">
                      {quiz.length - score}
                    </p>

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
                    {getResults().map(
                      (result, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#020617] p-5"
                        >
                          <div className="flex items-center gap-4">
                            <span
                              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
                                result.isCorrect
                                  ? "bg-emerald-950 text-emerald-400"
                                  : "bg-red-950 text-red-400"
                              }`}
                            >
                              {index + 1}
                            </span>

                            <span className="text-slate-300">
                              {result.question}
                            </span>
                          </div>

                          <span className="text-xl">
                            {result.isCorrect
                              ? "✓"
                              : "×"}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  <button
                    onClick={retryWrongAnswers}
                    disabled={score === quiz.length}
                    className="rounded-xl bg-indigo-600 px-6 py-4 font-semibold transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Retry Wrong Answers
                  </button>

                  <button
                    onClick={createNewQuiz}
                    className="rounded-xl border border-slate-700 px-6 py-4 font-semibold text-slate-300 transition hover:border-indigo-500 hover:text-white"
                  >
                    Create New Quiz
                  </button>
                </div>
              </section>
            )}
          </main>
        </>
      )}
    </div>
  );
}

export default App;