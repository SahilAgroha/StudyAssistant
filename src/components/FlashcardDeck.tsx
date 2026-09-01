import { useState } from "react";
import type { Flashcard } from "../types/quiz";

interface FlashcardDeckProps {
  cards: Flashcard[];
}

export default function FlashcardDeck({ cards }: FlashcardDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Empty / invalid state guard
  if (!cards || cards.length === 0) {
    return (
      <section className="mt-8 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-800 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/10 text-3xl">
          🃏
        </div>
        <h3 className="text-xl font-semibold text-slate-300">No flashcards available</h3>
        <p className="max-w-sm text-sm text-slate-500">
          Generate study material to create flashcards from your notes.
        </p>
      </section>
    );
  }

  const currentCard = cards[currentIndex];
  if (!currentCard) return null;

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === cards.length - 1;

  const goNext = () => {
    setCurrentIndex((prev) => prev + 1);
    setIsFlipped(false);
  };

  const goPrevious = () => {
    setCurrentIndex((prev) => prev - 1);
    setIsFlipped(false);
  };

  const handleFlip = () => setIsFlipped((prev) => !prev);

  return (
    <section className="mt-8 w-full" aria-label="Flashcard deck">
      {/* Progress */}
      <div className="mb-4 flex items-center justify-between text-sm">
        <span className="font-medium text-slate-300">
          Card {currentIndex + 1} of {cards.length}
        </span>
        <span className="text-slate-500">
          {Math.round(((currentIndex + 1) / cards.length) * 100)}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-6 h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-indigo-500 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
        />
      </div>

      {/* Card — click anywhere to flip */}
      <button
        type="button"
        onClick={handleFlip}
        aria-label={isFlipped ? "Flip to question" : "Flip to answer"}
        className="group relative h-64 w-full cursor-pointer select-none rounded-2xl border border-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 sm:h-72"
        style={{ perspective: "1200px" }}
      >
        {/* Inner wrapper that rotates */}
        <div
          className="absolute inset-0 transition-transform duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl bg-slate-900 p-8 text-center"
            style={{ backfaceVisibility: "hidden" }}
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
              Question
            </span>
            <p className="text-lg font-semibold leading-7 text-white">
              {currentCard.front}
            </p>
            <span className="mt-2 text-xs text-slate-500">
              Click to reveal answer
            </span>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl bg-indigo-950 p-8 text-center"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
              Answer
            </span>
            <p className="text-lg leading-7 text-white">
              {currentCard.back}
            </p>
            <span className="mt-2 text-xs text-slate-500">
              Click to flip back
            </span>
          </div>
        </div>
      </button>

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={goPrevious}
          disabled={isFirst}
          aria-label="Previous card"
          className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-30"
        >
          ← Previous
        </button>

        <button
          type="button"
          onClick={handleFlip}
          aria-label={isFlipped ? "Show question" : "Reveal answer"}
          className="rounded-xl border border-indigo-500/40 bg-indigo-500/10 px-5 py-3 text-sm font-medium text-indigo-300 transition hover:bg-indigo-500/20"
        >
          {isFlipped ? "Show Question" : "Reveal Answer"}
        </button>

        <button
          type="button"
          onClick={goNext}
          disabled={isLast}
          aria-label="Next card"
          className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-30"
        >
          Next →
        </button>
      </div>
    </section>
  );
}
