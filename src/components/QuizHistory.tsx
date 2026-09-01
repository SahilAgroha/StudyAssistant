import type { QuizAttempt } from "../types/quiz";

interface QuizHistoryProps {
  history: QuizAttempt[];
  onSelect: (attempt: QuizAttempt) => void;
  onClear: () => void;
}

const QuizHistory = ({
  history,
  onSelect,
  onClear,
}: QuizHistoryProps) => {
  if (history.length === 0) {
    return (
      <section className="mx-auto mt-10 w-full max-w-5xl rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-slate-900 text-2xl">
          📚
        </div>

        <h2 className="mt-4 text-xl font-semibold text-white">
          No quiz history yet
        </h2>

        <p className="mt-2 text-slate-500">
          Complete your first quiz and your results will appear here.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto mt-10 w-full max-w-5xl">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Quiz History
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your recently completed quizzes
          </p>
        </div>

        <button
          type="button"
          onClick={onClear}
          className="rounded-lg border border-red-500/30 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
        >
          Clear History
        </button>
      </div>

      <div className="space-y-3">
        {history.map((attempt) => (
          <button
            key={attempt.id}
            type="button"
            onClick={() => onSelect(attempt)}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/70 p-5 text-left transition hover:border-indigo-500/50 hover:bg-slate-900"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="font-semibold text-white">
                  {attempt.topic}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {attempt.totalQuestions} questions
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  {new Date(attempt.completedAt).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div>
                  <p className="text-xs text-slate-500">
                    Correct
                  </p>

                  <p className="mt-1 font-semibold text-emerald-400">
                    {attempt.correctAnswers}
                  </p>
                </div>

                <div className="h-10 w-px bg-slate-800" />

                <div className="text-right">
                  <p className="text-xs text-slate-500">
                    Score
                  </p>

                  <p className="mt-1 text-xl font-bold text-indigo-400">
                    {attempt.score}%
                  </p>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default QuizHistory;