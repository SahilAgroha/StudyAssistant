export default function Header() {
  return (
    <header className="border-b border-slate-800">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div>
          <h1 className="text-2xl font-bold">StudyMate</h1>
          <p className="text-sm text-slate-400">
            AI-powered study assistant
          </p>
        </div>
        <button
          type="button"
          className="rounded-full border border-slate-700 px-5 py-2 text-sm text-slate-300 transition hover:border-indigo-500 hover:text-white"
        >
          Study Assistant
        </button>
      </div>
    </header>
  );
}
