import { useRef, useState } from "react";
import type { QuizAttempt } from "./types/quiz";

import { generateStudyMaterial } from "./services/quizService";
import { useQuizEngine } from "./hooks/useQuizEngine";
import { useQuizHistory } from "./hooks/useQuizHistory";
import { useFlashcards } from "./hooks/useFlashcards";

import Header from "./components/layout/Header";
import StudyInput from "./components/StudyInput";
import QuizCard from "./components/QuizCard";
import QuizResultView from "./components/QuizResult";
import QuizHistory from "./components/QuizHistory";
import FlashcardDeck from "./components/FlashcardDeck";

// Which study-mode tab is active
type StudyTab = "quiz" | "flashcards";

function App() {
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<StudyTab>("quiz");

  // Holds the AbortController for the in-flight request.
  // If the user submits again before the previous request finishes,
  // we abort the old one so its response can never overwrite the newer result.
  const abortControllerRef = useRef<AbortController | null>(null);

  const { quizHistory, addAttempt, clearHistory } = useQuizHistory();
  const {
    questions,
    currentQuestion,
    currentQuizQuestion,
    selectedAnswer,
    quizFinished,
    currentAttempt,
    startQuiz,
    handleAnswerSelect,
    handleNext,
    handlePrevious,
    handleRetryWrong,
    clearQuiz,
    setCurrentAttempt,
  } = useQuizEngine(topic, addAttempt);

  const { flashcards, startFlashcards, clearFlashcards } = useFlashcards();

  const hasMaterial = questions.length > 0 || flashcards.length > 0;

  const handleGenerateQuiz = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic or paste your notes.");
      return;
    }

    // Cancel any previous in-flight request so its response cannot
    // overwrite the result of this (newer) request.
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setIsGenerating(true);
      setError("");

      const material = await generateStudyMaterial(topic, controller.signal);

      // Guard: if this request was aborted while awaiting, do nothing.
      if (controller.signal.aborted) return;

      startQuiz(material.questions);
      startFlashcards(material.flashcards);
      setActiveTab("quiz");

      setTimeout(() => {
        document.getElementById("study-section")?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    } catch (err) {
      // Ignore errors from aborted requests (they belong to a stale submission)
      if (err instanceof Error && err.name === "AbortError") return;

      console.error("Failed to generate study material:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while generating the study material."
      );
    } finally {
      // Only clear the loading spinner if this is still the current controller
      if (!controller.signal.aborted) {
        setIsGenerating(false);
      }
    }
  };

  const handleCreateNew = () => {
    clearQuiz();
    clearFlashcards();
    setTopic("");
    setError("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectHistory = (attempt: QuizAttempt) => {
    setCurrentAttempt(attempt);
  };

  const handleClear = () => {
    setTopic("");
    setError("");
  };

  return (
    <div className="relative min-h-screen bg-[#020617] text-white">
      <Header />

      {/* Full-screen generating overlay */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-[#020617]/80 backdrop-blur-sm">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-indigo-500" />
          <p className="text-lg font-semibold text-slate-200">
            Generating your study material…
          </p>
          <p className="text-sm text-slate-500">
            The AI is crafting questions and flashcards
          </p>
        </div>
      )}

      <main className="mx-auto max-w-6xl px-6 py-16">
        <StudyInput
          topic={topic}
          onTopicChange={setTopic}
          isGenerating={isGenerating}
          error={error}
          onClearError={() => setError("")}
          onGenerateQuiz={handleGenerateQuiz}
          onClear={handleClear}
        />

        {/* Empty state — shown when no material has been generated yet */}
        {!hasMaterial && !isGenerating && !error && (
          <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-800 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/10 text-3xl">
              📝
            </div>
            <h3 className="text-xl font-semibold text-slate-300">
              No study material yet
            </h3>
            <p className="max-w-sm text-sm text-slate-500">
              Paste your notes or enter a topic above and click{" "}
              <span className="font-medium text-indigo-400">
                Generate Study Material
              </span>{" "}
              to create an interactive quiz and flashcards.
            </p>
          </div>
        )}

        {/* Study Material Tabs */}
        {hasMaterial && !quizFinished && (
          <div id="study-section">
            {/* Tab switcher */}
            <div className="mt-10 flex gap-2 rounded-xl border border-slate-800 bg-slate-900/50 p-1">
              <button
                type="button"
                onClick={() => setActiveTab("quiz")}
                className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
                  activeTab === "quiz"
                    ? "bg-indigo-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                📋 Quiz ({questions.length} questions)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("flashcards")}
                className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
                  activeTab === "flashcards"
                    ? "bg-indigo-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                🃏 Flashcards ({flashcards.length} cards)
              </button>
            </div>

            {/* Quiz tab */}
            {activeTab === "quiz" && currentQuizQuestion && (
              <QuizCard
                question={currentQuizQuestion}
                questionNumber={currentQuestion + 1}
                totalQuestions={questions.length}
                selectedAnswer={selectedAnswer}
                onAnswer={handleAnswerSelect}
                onNext={handleNext}
                onPrevious={handlePrevious}
                isFirstQuestion={currentQuestion === 0}
                isLastQuestion={currentQuestion === questions.length - 1}
              />
            )}

            {/* Flashcards tab */}
            {activeTab === "flashcards" && (
              <FlashcardDeck cards={flashcards} />
            )}
          </div>
        )}

        {/* Result */}
        {quizFinished && currentAttempt && (
          <div id="study-section">
            <QuizResultView
              attempt={currentAttempt}
              onRetryWrong={handleRetryWrong}
              onCreateNew={handleCreateNew}
            />

            {/* Keep flashcards available after finishing the quiz */}
            {flashcards.length > 0 && (
              <div className="mt-10">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Review Flashcards
                </h3>
                <FlashcardDeck cards={flashcards} />
              </div>
            )}
          </div>
        )}

        {/* History */}
        <QuizHistory
          history={quizHistory}
          onSelect={handleSelectHistory}
          onClear={clearHistory}
        />
      </main>
    </div>
  );
}

export default App;