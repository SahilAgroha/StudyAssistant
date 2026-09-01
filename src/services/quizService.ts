import type { QuizQuestion, Flashcard } from "../types/quiz";

export interface StudyMaterial {
  questions: QuizQuestion[];
  flashcards: Flashcard[];
}

// ─── Validators ──────────────────────────────────────────────────────────────

function isValidQuizQuestions(data: unknown): data is QuizQuestion[] {
  if (!Array.isArray(data) || data.length === 0) return false;

  return data.every((item: unknown) => {
    if (typeof item !== "object" || item === null) return false;

    const q = item as Record<string, unknown>;

    return (
      typeof q.question === "string" &&
      Array.isArray(q.options) &&
      q.options.length > 0 &&
      (q.options as unknown[]).every(
        (option) => typeof option === "string"
      ) &&
      typeof q.correctAnswer === "number" &&
      Number.isInteger(q.correctAnswer) &&
      q.correctAnswer >= 0 &&
      q.correctAnswer < (q.options as unknown[]).length &&
      (q.explanation === undefined ||
        typeof q.explanation === "string")
    );
  });
}

function isValidFlashcards(data: unknown): data is Flashcard[] {
  if (!Array.isArray(data) || data.length === 0) return false;

  return data.every((item: unknown) => {
    if (typeof item !== "object" || item === null) return false;

    const f = item as Record<string, unknown>;

    return (
      typeof f.front === "string" &&
      typeof f.back === "string"
    );
  });
}

function isValidStudyMaterial(data: unknown): data is StudyMaterial {
  if (typeof data !== "object" || data === null) return false;

  const d = data as Record<string, unknown>;

  return (
    isValidQuizQuestions(d.questions) &&
    isValidFlashcards(d.flashcards)
  );
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const generateStudyMaterial = async (
  topic: string,
  signal?: AbortSignal
): Promise<StudyMaterial> => {
  if (!topic.trim()) {
    throw new Error("Please enter a study topic.");
  }

  try {
    const response = await fetch("/api/study", {
      method: "POST",
      signal,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ topic }),
    });

    if (!response.ok) {
      let errorMessage = "Failed to generate study material.";
      try {
        const errorData = await response.json();
        errorMessage = errorData?.error || errorMessage;
      } catch {
        // Ignore JSON parsing failure
      }
      throw new Error(errorMessage);
    }

    const parsedData = await response.json();

    // ─── Validate Generated Data ───────────────────────────────────────────

    if (!isValidStudyMaterial(parsedData)) {
      console.error(
        "Invalid study material returned by API:",
        parsedData
      );

      throw new Error(
        "The AI returned data with an invalid structure. Please try again."
      );
    }

    // ─── Success ───────────────────────────────────────────────────────────

    console.log("Study material generated successfully via /api/study.");

    return parsedData;
  } catch (error) {
    // Don't treat user cancellation as a normal API error
    if (
      error instanceof DOMException &&
      error.name === "AbortError"
    ) {
      console.log("Study material generation was cancelled.");
      throw error;
    }

    console.error(
      "Study material generation failed:",
      error
    );

    throw error;
  }
};

// Keep the old export alias so nothing else breaks
export const generateQuiz = generateStudyMaterial;