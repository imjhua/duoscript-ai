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

    **The most important element is the Scenario Concept (시나리오 컨셉)!**
    - The Scenario Concept determines the overall mood, style, and direction of the entire scenario. It must be reflected in every scene, action, emotion, and visual description.
    - Always prioritize the Scenario Concept above all other inputs. All creative choices, details, and atmosphere should be strongly influenced by this concept.

    The user will provide the following information:
    1. Scenario Type: What is the main subject or theme? (e.g., real world, character, fantasy, documentary, etc.)
    2. Media Style: What is the format or style? (e.g., animation, live-action, webtoon, play, etc.)
    3. Character Settings: Describe the protagonist or main characters. (e.g., a calendar in December 2025 with emotions, reflecting on its meaning at the end of the year)
    4. Scenario Context: Storyline or situation. (e.g., a calendar searching for its purpose at the end of the year)
    5. Scenario Language: Which language should the scenario be written in? (Korean or English)
    6. Scenario Concept: The overall concept or mood in one word (e.g., cute, futuristic, dreamy, dark and serious, etc.)

    Inputs:
    1. Scenario Type: ${input.scenarioType || "(No specific scenario type provided. Use your creativity. Examples: real world, character, fantasy, documentary, etc.)"}
    2. Media Style: ${input.style || "(No specific media style provided. Use your creativity. Examples: animation, live-action, webtoon, play, etc.)"}
    3. Character Settings: ${input.characterConfig}
    4. Scenario Context: ${input.scenarioConfig || "Create a suitable story based on the character."}
    5. Scenario Language: ${input.scenarioLanguage || "한글"}
    6. Scenario Concept: ${input.scenarioConcept || "(No specific concept provided. Use your creativity. Examples: cute, futuristic, dreamy, dark and serious, etc.)"}

    Style Enforcement:
    - This entire scenario must be in a 2D cel-shaded animation style with hand-drawn outlines, flat color shading, and line-art details. Avoid any photorealistic or live-action elements. Use signals such as "cel-shaded", "hand-drawn", "flat colors", "limited color palette", "2D line art", "not photorealistic", "NOT live-action" in every scene description.
    - For example, describe scenes like: "A worn calendar hangs on the wall, drawn in hand-drawn 2D animation with cel-shaded lighting and clean line-art outlines. The dim room is portrayed with flat colors and soft gradients, avoiding any photorealistic texture. Faint moonlight is represented in stylized blue shading, and floating dust motes appear as simple particle-like dots, not realistic debris."
    - Every scene's "visual_point" and "action" must reinforce the 2D animation style, and never use photorealistic or filmic signals.

    Requirements:
    - The scenario concept must be the main driver for all creative decisions. Every scene, action, emotion, and visual must clearly reflect the concept.
    - The scenario type, media style, and scenario language should all influence the overall tone, style, and logic of the screenplay. If any is not provided, use your best judgment.
    - The protagonist (main character) does NOT have to be a human. It can be an object, animal, concept, or anything the user sets.
    - You MUST generate two versions: one in Korean (ko) and one in English (en).
    - The English version should be a translation of the Korean version.
    - Structure the output exactly according to the JSON schema provided.
    - Include at least 5 scenes.
    - "visual_point" should describe lighting, colors, or specific visual details, always in 2D animation style.
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