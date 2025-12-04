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
  mediaStyle: string;
  protagonist: Protagonist;
  synopsis: string;
  scenes: Scene[];
}

export interface DualScenarioResponse {
  ko: ScenarioDetail;
  en: ScenarioDetail;
}

// animationType: 예시) 캐릭터, 실제현실, 판타지, 다큐멘터리 등
// scenarioType: 예시) 캐릭터, 실제현실, 판타지, 다큐멘터리 등
export interface UserInput {
  characterConfig: string;
  scenarioConfig: string;
  scenarioType?: string; // 시나리오 유형(예: 캐릭터, 실제현실, 판타지 등)
  style?: string; // 매체 스타일(예: 애니메이션, 실사, 웹툰 등)
}