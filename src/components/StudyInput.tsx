interface StudyInputProps {
  topic: string;
  onTopicChange: (topic: string) => void;
  isGenerating: boolean;
  error: string;
  onClearError: () => void;
  onGenerateQuiz: () => void;
  onClear: () => void;
}

export default function StudyInput({
  topic,
  onTopicChange,
  isGenerating,
  error,
  onClearError,
  onGenerateQuiz,
  onClear,
}: StudyInputProps) {
  return (
    <>
      {/* Hero */}
      <section className="text-center">
        <div className="mb-6 inline-flex rounded-full border border-indigo-500/40 bg-indigo-500/10 px-5 py-2 text-sm text-indigo-300">
          AI Study Assistant
        </div>
        <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
          Turn your notes into a quiz
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-400">
          Paste your study notes, a topic, or a concept — and instantly get an
          interactive quiz to test your understanding.
        </p>
      </section>

      {/* Input Card */}
      <section className="mx-auto mt-12 max-w-5xl rounded-2xl border border-slate-800 bg-slate-900/80 p-7 shadow-xl">
        <label
          htmlFor="topic"
          className="text-sm font-semibold text-slate-300"
        >
          What do you want to study?
        </label>

        <textarea
          id="topic"
          value={topic}
          onChange={(event) => {
            onTopicChange(event.target.value);
            if (error) {
              onClearError();
            }
          }}
          placeholder={[
            "You can paste:",
            "  • Your study notes",
            "  • A topic (e.g. \"Photosynthesis\" or \"React hooks\")",
            "  • A concept you want to test yourself on",
          ].join("\n")}
          disabled={isGenerating}
          rows={8}
          className="mt-3 w-full resize-none rounded-xl border border-slate-700 bg-[#020617] p-5 font-mono text-sm text-white outline-none transition placeholder:whitespace-pre placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        />

        {/* Error banner */}
        {error && (
          <div className="mt-4 flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
            <span className="mt-0.5 shrink-0 text-red-400">⚠</span>
            <div className="flex-1">
              <p className="text-sm text-red-400">{error}</p>
              {error.includes("API") && (
                <p className="mt-1 text-xs text-red-400/70">
                  Tip: Click "Generate Study Material" to retry with the same input.
                </p>
              )}
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-col items-center justify-between gap-5 sm:flex-row">
          <p className="text-sm text-slate-500">
            Example: "Explain operating system processes, threads, and scheduling."
          </p>

          <div className="flex shrink-0 gap-3">
            <button
              type="button"
              onClick={onClear}
              disabled={!topic || isGenerating}
              className="rounded-xl border border-slate-700 px-6 py-3 font-medium text-slate-300 transition hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={onGenerateQuiz}
              disabled={!topic.trim() || isGenerating}
              className="min-w-52 rounded-xl bg-indigo-500 px-7 py-3 font-semibold transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Generating...
                </span>
              ) : (
                "Generate Study Material"
              )}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
