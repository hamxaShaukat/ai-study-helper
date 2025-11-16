
import { GoogleGenAI, Type } from "@google/genai";
import type { Summaries, Flashcard, Quiz } from '../types/types';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export async function generateSummaries(text: string): Promise<Summaries> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Generate 3 types of summaries (short, medium, long) for the following text. Return ONLY a valid JSON object with keys "short", "medium", and "long":\n\n${text}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          short: { type: Type.STRING },
          medium: { type: Type.STRING },
          long: { type: Type.STRING },
        },
        required: ["short", "medium", "long"],
      },
    },
  });

  const jsonString = response?.text?.trim() ?? "";
  return JSON.parse(jsonString) as Summaries;
}


export async function generateFlashcards(text: string): Promise<Flashcard[]> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Create 12 flashcards from the following content. Each flashcard should have a 'front' (a question) and a 'back' (the answer). Return ONLY a valid JSON array of objects:\n\n${text}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            front: { type: Type.STRING, description: "The question side of the flashcard." },
            back: { type: Type.STRING, description: "The answer side of the flashcard." },
          },
          required: ["front", "back"],
        },
      },
    },
  });

  const jsonString = response?.text?.trim() ?? "";
  return JSON.parse(jsonString) as Flashcard[];
}

export async function generateQuiz(text: string): Promise<Quiz> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Generate a quiz from the following text. The quiz should contain 10 multiple-choice questions and 5 short-answer questions. For MCQs, provide 4 options and the correct answer. Return ONLY a valid JSON object with keys "mcqs" and "short_questions":\n\n${text}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          mcqs: {
            type: Type.ARRAY,
            description: "An array of multiple-choice questions.",
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                answer: { type: Type.STRING },
              },
              required: ["question", "options", "answer"],
            },
          },
          short_questions: {
            type: Type.ARRAY,
            description: "An array of short-answer questions.",
            items: { type: Type.STRING },
          },
        },
        required: ["mcqs", "short_questions"],
      },
    },
  });
  
  const jsonString = response?.text?.trim() ?? "";
  return JSON.parse(jsonString) as Quiz;
}