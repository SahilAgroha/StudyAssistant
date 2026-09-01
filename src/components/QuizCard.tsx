import type { QuizQuestion } from "../types/study";

interface QuizCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  onAnswer: (answer: string) => void;
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

  const getOptionStyle = (option: string) => {
    // Before answering
    if (!hasAnswered) {
      return "border-slate-700 bg-slate-950 hover:border-indigo-500 hover:bg-slate-900";
    }

    // Correct answer
    if (option === question.correctAnswer) {
      return "border-emerald-500 bg-emerald-500/10";
    }

    // User's wrong answer
    if (option === selectedAnswer) {
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
        {question.options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onAnswer(option)}
            disabled={hasAnswered}
            className={`w-full rounded-xl border p-4 text-left text-sm font-medium text-slate-200 transition ${getOptionStyle(
              option
            )} ${
              !hasAnswered
                ? "cursor-pointer"
                : "cursor-default"
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <span>{option}</span>

              {hasAnswered && option === question.correctAnswer && (
                <span className="text-emerald-400">✓</span>
              )}

              {hasAnswered &&
                option === selectedAnswer &&
                option !== question.correctAnswer && (
                  <span className="text-red-400">✕</span>
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
              isCorrect ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {isCorrect ? "Correct! 🎉" : "Not quite."}
          </p>

          {!isCorrect && (
            <p className="mt-2 text-sm text-slate-300">
              <span className="font-medium text-slate-200">
                Correct answer:
              </span>{" "}
              {question.correctAnswer}
            </p>
          )}

          <p className="mt-2 text-sm leading-6 text-slate-400">
            {question.explanation}
          </p>
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