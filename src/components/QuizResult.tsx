import type { QuizQuestion } from "../types/study";

interface QuizResultProps {
  questions: QuizQuestion[];
  answers: Record<string, string>;
  onRetryWrong: () => void;
  onNewQuiz: () => void;
}

function QuizResult({
  questions,
  answers,
  onRetryWrong,
  onNewQuiz,
}: QuizResultProps) {
  const correctQuestions = questions.filter(
    (question) => answers[question.id] === question.correctAnswer
  );

  const wrongQuestions = questions.filter(
    (question) => answers[question.id] !== question.correctAnswer
  );

  const correctCount = correctQuestions.length;
  const wrongCount = wrongQuestions.length;

  const totalQuestions = questions.length;

  const score =
    totalQuestions === 0
      ? 0
      : Math.round((correctCount / totalQuestions) * 100);

  const getScoreMessage = () => {
    if (score === 100) {
      return "Perfect score! Excellent work. 🎉";
    }

    if (score >= 80) {
      return "Great job! You have a strong understanding.";
    }

    if (score >= 60) {
      return "Good effort! A little more practice will help.";
    }

    return "Keep practicing. You can improve this score!";
  };

  return (
    <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-3xl">
          🎯
        </div>

        <h2 className="mt-5 text-2xl font-bold text-white">
          Quiz Complete!
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          {getScoreMessage()}
        </p>
      </div>

      {/* Score */}
      <div className="mt-8 flex justify-center">
        <div className="flex h-40 w-40 flex-col items-center justify-center rounded-full border-8 border-indigo-500/30">
          <span className="text-4xl font-bold text-white">
            {score}%
          </span>

          <span className="mt-1 text-sm text-slate-500">
            Score
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 text-center">
          <p className="text-3xl font-bold text-emerald-400">
            {correctCount}
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Correct
          </p>
        </div>

        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5 text-center">
          <p className="text-3xl font-bold text-red-400">
            {wrongCount}
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Wrong
          </p>
        </div>
      </div>

      {/* Question Summary */}
      <div className="mt-8">
        <h3 className="mb-4 text-sm font-semibold text-slate-200">
          Question Summary
        </h3>

        <div className="space-y-2">
          {questions.map((question, index) => {
            const isQuestionCorrect =
              answers[question.id] === question.correctAnswer;

            return (
              <div
                key={question.id}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-4 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      isQuestionCorrect
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {index + 1}
                  </span>

                  <span className="truncate text-sm text-slate-400">
                    {question.question}
                  </span>
                </div>

                <span className="ml-3 shrink-0">
                  {isQuestionCorrect ? (
                    <span className="text-emerald-400">✓</span>
                  ) : (
                    <span className="text-red-400">✕</span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        {wrongCount > 0 && (
          <button
            type="button"
            onClick={onRetryWrong}
            className="flex-1 rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
          >
            Retry Wrong Answers
          </button>
        )}

        <button
          type="button"
          onClick={onNewQuiz}
          className="flex-1 rounded-xl border border-slate-700 px-6 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
        >
          Create New Quiz
        </button>
      </div>
    </section>
  );
}

export default QuizResult;