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
    mediaStyle: { type: Type.STRING }, // 매체 스타일 필드 추가
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
  required: ["title", "genre", "mediaStyle", "protagonist", "synopsis", "scenes"], // mediaStyle도 필수로 지정
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

    The user will provide the following information:
    1. Scenario Type: What is the main subject or theme? (e.g., real world, character, fantasy, documentary, etc.)
    2. Media Style: What is the format or style? (e.g., animation, live-action, webtoon, play, etc.)
    3. Character Settings: Describe the protagonist or main characters. (e.g., a calendar in December 2025 with emotions, reflecting on its meaning at the end of the year)
    4. Scenario Context: Storyline or situation. (e.g., a calendar searching for its purpose at the end of the year)

    Inputs:
    1. Scenario Type: ${input.scenarioType || "(No specific scenario type provided. Use your creativity. Examples: real world, character, fantasy, documentary, etc.)"}
    2. Media Style: ${input.style || "(No specific media style provided. Use your creativity. Examples: animation, live-action, webtoon, play, etc.)"}
    3. Character Settings: ${input.characterConfig}
    4. Scenario Context: ${input.scenarioConfig || "Create a suitable story based on the character."}

    Requirements:
    - The scenario type and media style should both influence the overall tone, style, and logic of the screenplay. If either is not provided, use your best judgment.
    - The protagonist (main character) does NOT have to be a human. It can be an object, animal, concept, or anything the user sets.
    - You MUST generate two versions: one in Korean (ko) and one in English (en).
    - The English version should be a translation of the Korean version.
    - Structure the output exactly according to the JSON schema provided.
    - Include at least 5 scenes.
    - "visual_point" should describe lighting, colors, or specific visual details.
    - "emotion" should describe the main character's feelings, thoughts, or relevant state in that scene (even if the character is not human).
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