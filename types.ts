export interface Protagonist {
  name: string;
  features: string;
}

export interface Scene {
  scene_number: number;
  title: string;
  time: string;
  action: string;
  visual_point: string;
  sound: string;
  emotion: string;
}

export interface ScenarioDetail {
  title: string;
  genre: string;
  protagonist: Protagonist;
  synopsis: string;
  scenes: Scene[];
}

export interface DualScenarioResponse {
  ko: ScenarioDetail;
  en: ScenarioDetail;
}

export interface UserInput {
  characterConfig: string;
  scenarioConfig: string;
}