import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserInput, DualScenarioResponse } from "../types";

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

const sceneSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    scene_number: { type: Type.INTEGER },
    title: { type: Type.STRING },
    time: { type: Type.STRING },
    action: { type: Type.STRING },
    visual_point: { type: Type.STRING },
    sound: { type: Type.STRING },
    emotion: { type: Type.STRING },
  },
  required: ["scene_number", "title", "time", "action", "visual_point", "sound", "emotion"],
};

const scenarioDetailSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    genre: { type: Type.STRING },
    protagonist: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        features: { type: Type.STRING },
      },
      required: ["name", "features"],
    },
    synopsis: { type: Type.STRING },
    scenes: {
      type: Type.ARRAY,
      items: sceneSchema,
    },
  },
  required: ["title", "genre", "protagonist", "synopsis", "scenes"],
};

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    ko: scenarioDetailSchema,
    en: scenarioDetailSchema,
  },
  required: ["ko", "en"],
};

export const generateScenario = async (input: UserInput): Promise<DualScenarioResponse> => {
  const modelId = "gemini-2.5-flash"; // Using flash for faster text generation

  const prompt = `
    You are a professional screenwriter assistant.
    Generate a creative screenplay draft based on the user's input.
    
    Inputs:
    1. Character Settings: ${input.characterConfig}
    2. Scenario Context: ${input.scenarioConfig || "Create a suitable story based on the character."}

    Requirements:
    - You MUST generate two versions: one in Korean (ko) and one in English (en).
    - The English version should be a translation of the Korean version.
    - Structure the output exactly according to the JSON schema provided.
    - Include at least 5 scenes.
    - "visual_point" should describe lighting, colors, or specific visual details.
    - "emotion" should describe the character's feelings in that scene.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7, 
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini.");
    }

    return JSON.parse(text) as DualScenarioResponse;
  } catch (error) {
    console.error("Error generating scenario:", error);
    throw error;
  }
};