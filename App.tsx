import React, { useState } from 'react';
import { InputForm } from './components/InputForm';
import { ScenarioView } from './components/ScenarioView';
import { generateScenario } from './services/geminiService';
import { DualScenarioResponse, UserInput, Scene } from './types';

function App() {
  const [data, setData] = useState<DualScenarioResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (input: UserInput) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await generateScenario(input);
      setData(result);
    } catch (err) {
      setError("시나리오를 생성하는 도중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatTextForCopy = (scenario: DualScenarioResponse) => {
    const ko = scenario.ko;
    
    let text = `제목: "${ko.title}"\n`;
    text += `장르: ${ko.genre}\n`;
    text += `주인공:\n\n`;
    text += `이름: ${ko.protagonist.name}\n\n`;
    text += `특징: ${ko.protagonist.features}\n\n`;
    text += `시놉시스\n\n${ko.synopsis}\n\n`;
    text += `시나리오\n`;
    
    ko.scenes.forEach((scene: Scene) => {
      text += `장면 ${scene.scene_number}: ${scene.title}\n\n`;
      text += `시각: ${scene.time}\n\n`;
      text += `액션: ${scene.action}\n\n`;
      text += `감정: ${scene.emotion}\n\n`;
      text += `시각적 포인트: ${scene.visual_point}\n\n`;
      text += `사운드: ${scene.sound}\n\n`;
    });

    return text;
  };

  const handleCopy = () => {
    if (!data) return;
    const text = formatTextForCopy(data);
    navigator.clipboard.writeText(text).then(() => {
      alert("전체 시나리오가 클립보드에 복사되었습니다!");
    }).catch(err => {
      console.error("복사 실패:", err);
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎬</span>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              DuoScript AI
            </h1>
          </div>
          <div className="text-sm text-slate-500 hidden sm:block font-medium">
            한/영 시나리오 자동 생성기
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Intro Text */}
        {!data && !loading && (
          <div className="text-center mb-12 py-12">
            <h2 className="text-4xl font-extrabold text-slate-800 mb-6 leading-tight">
              상상만 하세요, <br className="sm:hidden" />대본은 AI가 씁니다.
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              캐릭터 설정과 간단한 줄거리만 입력하면, <br className="hidden sm:block"/> 
              장면별 상세 묘사가 포함된 전문적인 시나리오를 <span className="text-indigo-600 font-bold">한글과 영어</span>로 동시에 작성해드립니다.
            </p>
          </div>
        )}

        {/* Input Form */}
        <div className="mb-12">
            <InputForm onSubmit={handleGenerate} isLoading={loading} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8 text-center shadow-sm" role="alert">
            <strong className="font-bold block mb-1">오류 발생</strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Results */}
        {data && (
          <div className="animate-fade-in-up">
            <div className="flex items-center justify-between mb-6 border-b pb-4 border-slate-200">
              <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-8 bg-indigo-600 rounded-full"></span>
                완성된 시나리오
              </h3>
              <button
                onClick={handleCopy}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                전체 복사
              </button>
            </div>
            
            <ScenarioView data={data} />
          </div>
        )}
      </main>

      {/* Floating Copy Button Removed in favor of scene-specific copy and header global copy */}
    </div>
  );
}

export default App;
