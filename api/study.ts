// export const config = {
//   runtime: "edge",
// };
export const maxDuration = 120;

export default async function handler(request: Request) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await request.json();

    if (!body || typeof body.topic !== "string" || !body.topic.trim()) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid 'topic' in request body." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // const apiKey = process.env.GEMINI_API_KEY;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("GEMINI_API_KEY is not configured.");
      return new Response(
        JSON.stringify({ error: "Server configuration error." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
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
${body.topic}
`.trim();

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      console.error(
        `Gemini API error: ${geminiResponse.status} ${geminiResponse.statusText}`
      );
      return new Response(
        JSON.stringify({ error: "Failed to generate study material from AI." }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    const result = await geminiResponse.json();
    const textResponse = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResponse) {
      console.error("Empty response from Gemini API.");
      return new Response(
        JSON.stringify({ error: "Received empty response from AI." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    let parsedData: any;
    try {
      parsedData = JSON.parse(textResponse);
    } catch (e) {
      console.error("Failed to parse Gemini response as JSON:", textResponse);
      return new Response(
        JSON.stringify({ error: "Received malformed data from AI." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate structure
    if (!parsedData || typeof parsedData !== "object") {
      throw new Error("Invalid response format");
    }

    const isValidQuestions =
      Array.isArray(parsedData.questions) &&
      parsedData.questions.length > 0 &&
      parsedData.questions.every(
        (q: any) =>
          typeof q === "object" &&
          q !== null &&
          typeof q.question === "string" &&
          Array.isArray(q.options) &&
          q.options.length === 4 &&
          q.options.every((opt: any) => typeof opt === "string") &&
          typeof q.correctAnswer === "number" &&
          Number.isInteger(q.correctAnswer) &&
          q.correctAnswer >= 0 &&
          q.correctAnswer < 4 &&
          typeof q.explanation === "string"
      );

    const isValidFlashcards =
      Array.isArray(parsedData.flashcards) &&
      parsedData.flashcards.length > 0 &&
      parsedData.flashcards.every(
        (f: any) =>
          typeof f === "object" &&
          f !== null &&
          typeof f.front === "string" &&
          typeof f.back === "string"
      );

    if (!isValidQuestions || !isValidFlashcards) {
      console.error("Gemini response failed validation", parsedData);
      return new Response(
        JSON.stringify({ error: "Generated material has an invalid structure." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(parsedData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Serverless function error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
