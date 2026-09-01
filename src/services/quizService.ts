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

// ─── Delay Helper ─────────────────────────────────────────────────────────────

function wait(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Request aborted", "AbortError"));
      return;
    }

    const timeout = setTimeout(resolve, ms);

    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timeout);
        reject(new DOMException("Request aborted", "AbortError"));
      },
      { once: true }
    );
  });
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const generateStudyMaterial = async (
  topic: string,
  signal?: AbortSignal
): Promise<StudyMaterial> => {
  if (!topic.trim()) {
    throw new Error("Please enter a study topic.");
  }

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "API key is missing. Please add VITE_GEMINI_API_KEY to your .env file."
    );
  }

  const prompt = `
You are an AI study assistant.

Generate structured study material based on the following topic or notes.

Return ONLY a valid JSON object.
Do not use markdown.
Do not use code fences.
Do not include any text before or after the JSON.

The JSON MUST match this exact structure:

{
  "questions": [
    {
      "question": "string",
      "options": [
        "string",
        "string",
        "string",
        "string"
      ],
      "correctAnswer": 0,
      "explanation": "string"
    }
  ],
  "flashcards": [
    {
      "front": "string",
      "back": "string"
    }
  ]
}

Rules:
- Generate 5 to 8 quiz questions.
- Each question must have exactly 4 options.
- Generate 5 to 10 flashcards.
- correctAnswer must be a 0-based integer index.
- correctAnswer must point to the correct option.
- Every question must have an explanation.
- Every flashcard must have a front and back.
- Make the questions educational and relevant to the provided topic.
- Avoid duplicate questions.
- Ensure the JSON is valid and can be parsed directly with JSON.parse().

Topic/Notes:
${topic}
`.trim();

  try {
    // ─── Gemini API Request ────────────────────────────────────────────────

    const maxRetries = 3;

    let response: Response | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      console.log(
        `Gemini API request attempt ${attempt + 1}/${maxRetries}`
      );

      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          signal,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              responseMimeType: "application/json",
            },
          }),
        }
      );

      // Successful request
      if (response.ok) {
        break;
      }

      // Retry temporary server/rate-limit errors
      if (
        (response.status === 503 || response.status === 429) &&
        attempt < maxRetries - 1
      ) {
        const delay = 1000 * Math.pow(2, attempt);

        console.warn(
          `Gemini returned ${response.status}. Retrying in ${
            delay / 1000
          } seconds...`
        );

        await wait(delay, signal);
        continue;
      }

      // Non-retryable error or final retry failed
      break;
    }

    // ─── Validate Response ─────────────────────────────────────────────────

    if (!response) {
      throw new Error("No response received from Gemini API.");
    }

    if (!response.ok) {
      let errorMessage = "";

      try {
        const errorData = await response.json();

        errorMessage =
          errorData?.error?.message ||
          errorData?.message ||
          "";
      } catch {
        // Ignore JSON parsing failure
      }

      if (response.status === 400) {
        throw new Error(
          `Bad request (400). ${
            errorMessage || "Check the Gemini API request format."
          }`
        );
      }

      if (response.status === 401 || response.status === 403) {
        throw new Error(
          `Gemini API authentication failed ( ${
            response.status
          } ). ${
            errorMessage || "Check that your API key is valid."
          }`
        );
      }

      if (response.status === 404) {
        throw new Error(
          `Gemini model not found (404). ${
            errorMessage || "Check the model name."
          }`
        );
      }

      if (response.status === 429) {
        throw new Error(
          `Gemini API rate limit reached (429). ${
            errorMessage || "Please try again later."
          }`
        );
      }

      if (response.status === 503) {
        throw new Error(
          `Gemini service is temporarily unavailable (503). ${
            errorMessage || "Please try again in a few seconds."
          }`
        );
      }

      throw new Error(
        `Gemini API request failed with status ${
          response.status
        }. ${errorMessage}`
      );
    }

    // ─── Parse Gemini Response ─────────────────────────────────────────────

    const result = await response.json();

    const textResponse =
      result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResponse) {
      console.error("Unexpected Gemini response:", result);

      throw new Error(
        "The AI returned an empty response."
      );
    }

    // ─── Parse JSON ────────────────────────────────────────────────────────

    let parsedData: unknown;

    try {
      parsedData = JSON.parse(textResponse);
    } catch (error) {
      console.error(
        "Failed to parse Gemini response:",
        textResponse
      );

      throw new Error(
        "The AI returned malformed data that could not be parsed."
      );
    }

    // ─── Validate Generated Data ───────────────────────────────────────────

    if (!isValidStudyMaterial(parsedData)) {
      console.error(
        "Invalid study material returned by Gemini:",
        parsedData
      );

      throw new Error(
        "The AI returned data with an invalid structure. Please try again."
      );
    }

    // ─── Success ───────────────────────────────────────────────────────────

    console.log("Study material generated successfully.");

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