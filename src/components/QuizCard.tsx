import type { QuizQuestion } from "../types/quiz";

interface QuizCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  onAnswer: (answer: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
}

function QuizCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswer,
  onNext,
  onPrevious,
  isFirstQuestion,
  isLastQuestion,
}: QuizCardProps) {
  const hasAnswered = selectedAnswer !== null;

  const isCorrect = selectedAnswer === question.correctAnswer;

  const getOptionStyle = (optionIndex: number) => {
    // Before answering
    if (!hasAnswered) {
      return "border-slate-700 bg-slate-950 hover:border-indigo-500 hover:bg-slate-900";
    }

    // Correct answer
    if (optionIndex === question.correctAnswer) {
      return "border-emerald-500 bg-emerald-500/10";
    }

    // User's wrong answer
    if (optionIndex === selectedAnswer) {
      return "border-red-500 bg-red-500/10";
    }

    // Other options
    return "border-slate-800 bg-slate-950 opacity-60";
  };

  return (
    <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-slate-300">
            Question {questionNumber} of {totalQuestions}
          </span>

          <span className="text-slate-500">
            {Math.round((questionNumber / totalQuestions) * 100)}%
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all duration-300"
            style={{
              width: `${(questionNumber / totalQuestions) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question */}
      <h3 className="text-xl font-semibold leading-8 text-white">
        {question.question}
      </h3>

      {/* Options */}
      <div className="mt-6 space-y-3">
        {question.options.map((option, index) => (
          <button
            key={option}
            type="button"
            onClick={() => onAnswer(index)}
            disabled={hasAnswered}
            className={`w-full rounded-xl border p-4 text-left text-sm font-medium text-slate-200 transition ${getOptionStyle(
              index
            )} ${
              !hasAnswered
                ? "cursor-pointer"
                : "cursor-default"
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <span>{option}</span>

              {/* Correct answer */}
              {hasAnswered &&
                index === question.correctAnswer && (
                  <span className="text-emerald-400">
                    ✓
                  </span>
                )}

              {/* User selected wrong answer */}
              {hasAnswered &&
                index === selectedAnswer &&
                index !== question.correctAnswer && (
                  <span className="text-red-400">
                    ✕
                  </span>
                )}
            </div>
          </button>
        ))}
      </div>

      {/* Answer Feedback */}
      {hasAnswered && (
        <div
          className={`mt-6 rounded-xl border p-4 ${
            isCorrect
              ? "border-emerald-500/30 bg-emerald-500/10"
              : "border-red-500/30 bg-red-500/10"
          }`}
        >
          <p
            className={`font-semibold ${
              isCorrect
                ? "text-emerald-400"
                : "text-red-400"
            }`}
          >
            {isCorrect ? "Correct! 🎉" : "Not quite."}
          </p>

          {/* Show correct answer if user was wrong */}
          {!isCorrect && (
            <p className="mt-2 text-sm text-slate-300">
              <span className="font-medium text-slate-200">
                Correct answer:
              </span>{" "}
              {question.options[question.correctAnswer]}
            </p>
          )}

          {/* Explanation */}
          {"explanation" in question &&
            question.explanation && (
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {question.explanation}
              </p>
            )}
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrevious}
          disabled={isFirstQuestion}
          className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-30"
        >
          ← Previous
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!hasAnswered}
          className="rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-30"
        >
          {isLastQuestion ? "Finish Quiz" : "Next →"}
        </button>
      </div>
    </section>
  );
}

export default QuizCard;