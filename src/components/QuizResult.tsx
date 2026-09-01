import type { QuizAttempt } from "../types/quiz";

interface QuizResultProps {
  attempt: QuizAttempt;
  onRetryWrong: () => void;
  onCreateNew: () => void;
}

const QuizResult = ({
  attempt,
  onRetryWrong,
  onCreateNew,
}: QuizResultProps) => {
  const wrongAnswers = attempt.totalQuestions - attempt.correctAnswers;

  return (
    <section className="mx-auto mt-10 w-full max-w-5xl rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
      {/* Score */}
      <div className="flex justify-center">
        <div className="flex h-48 w-48 flex-col items-center justify-center rounded-full border-8 border-indigo-500">
          <span className="text-5xl font-bold text-white">
            {attempt.score}%
          </span>

          <span className="mt-1 text-sm text-slate-400">
            Score
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-8 text-center">
          <p className="text-4xl font-bold text-emerald-400">
            {attempt.correctAnswers}
          </p>

          <p className="mt-2 text-lg text-slate-400">
            Correct
          </p>
        </div>

        <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-8 text-center">
          <p className="text-4xl font-bold text-red-400">
            {wrongAnswers}
          </p>

          <p className="mt-2 text-lg text-slate-400">
            Wrong
          </p>
        </div>
      </div>

      {/* Quiz information */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-white">
          Quiz Summary
        </h2>

        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Topic
              </p>

              <p className="mt-1 text-lg font-medium text-white">
                {attempt.topic}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Questions
              </p>

              <p className="mt-1 text-lg font-medium text-white">
                {attempt.totalQuestions}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Completed
              </p>

              <p className="mt-1 text-sm text-slate-300">
                {new Date(attempt.completedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <button
          type="button"
          onClick={onRetryWrong}
          disabled={wrongAnswers === 0}
          className="rounded-xl bg-indigo-600 px-6 py-4 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500"
        >
          Retry Wrong Answers
        </button>

        <button
          type="button"
          onClick={onCreateNew}
          className="rounded-xl border border-slate-700 bg-transparent px-6 py-4 font-semibold text-slate-200 transition hover:border-indigo-500 hover:bg-indigo-500/10"
        >
          Create New Quiz
        </button>
      </div>
    </section>
  );
};

export default QuizResult;