
import { GoogleGenAI, Type } from "@google/genai";

export const generateAIQuestions = async (topic: string, count: number = 5) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate ${count} multiple choice questions about "${topic}" for a college level quiz.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING, description: "The question text in HTML format (using <b> tags for emphasis where needed)." },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Exactly 4 options."
            },
            correctOptionIndex: { type: Type.INTEGER, description: "Index of the correct option (0-3)." }
          },
          required: ["text", "options", "correctOptionIndex"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return [];
  }
};
