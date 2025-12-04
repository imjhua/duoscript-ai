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

    **The most important element is the Scenario Concept (컨셉)!**
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
    - The style and visual description of the scenario must match the user's selected "Media Style".
    - If Media Style is "2D 애니메이션" or similar, use 2D cel-shaded animation style with hand-drawn outlines, flat color shading, and line-art details. Avoid any photorealistic or live-action elements. Use signals such as "cel-shaded", "hand-drawn", "flat colors", "limited color palette", "2D line art", "not photorealistic", "NOT live-action" in every scene description.
    - If Media Style is "실사" or similar, describe scenes in realistic live-action style, with natural lighting, realistic textures, and cinematic details. Avoid cartoon or animation signals.
    - If Media Style is "웹툰" or similar, describe scenes in webtoon style, with comic panel layouts, bold outlines, vibrant colors, and stylized backgrounds. Avoid photorealistic or animation signals.
    - If Media Style is "3D 애니메이션" or similar, describe scenes in 3D animation style, with depth, shading, and realistic or stylized 3D elements.
    - For other styles, adapt the visual and descriptive language to match the selected media style.
    - Every scene's "visual_point" and "action" must reinforce the selected media style, and never use signals from other styles.

    Requirements:
    - The scenario concept must be the main driver for all creative decisions. Every scene, action, emotion, and visual must clearly reflect the concept.
    - The scenario type, media style, and scenario language should all influence the overall tone, style, and logic of the screenplay. If any is not provided, use your best judgment.
    - The protagonist (main character) does NOT have to be a human. It can be an object, animal, concept, or anything the user sets.
    - The protagonist's "features" field must include a detailed description of their appearance, clothing, and cultural traits, appropriate for the selected language and culture. For example, if Korean, describe Korean-style design, colors, and cultural signals. If English, describe Western-style design, colors, and cultural signals.
    - Structure the output exactly according to the JSON schema provided.
    - Include at least 5 scenes.
    - "visual_point" should describe lighting, colors, or specific visual details, and must always reflect the selected Media Style. For example, if the style is "실사", describe realistic lighting, textures, and cinematic details. If the style is "2D 애니메이션", describe hand-drawn, cel-shaded visuals. If the style is "웹툰", describe comic-style visuals. If the style is "3D 애니메이션", describe 3D rendered visuals. Do not mix signals from other styles.
    - "emotion" should describe the main character's feelings, thoughts, or relevant state in that scene (even if the character is not human).

    Language Output Instructions:
    - If Scenario Language is "한글" or "한국어", generate only the Korean version (ko). The protagonist's nationality, name, cultural background, appearance, clothing, and mannerisms should be Korean and reflect Korean culture.
    - If Scenario Language is "영어" or "English", generate only the English version (en). The protagonist's nationality, name, cultural background, appearance, clothing, and mannerisms should be foreign (e.g., American, British, etc.) and appropriate for the chosen language and culture.
    - If Scenario Language is "둘 다", "both", or not specified, generate both Korean (ko) and English (en) versions. The Korean version should have a Korean protagonist, and the English version should have a foreign protagonist. The English version should be a translation of the Korean version, but adapt the protagonist's name, appearance, clothing, and cultural details to fit the language and culture.
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