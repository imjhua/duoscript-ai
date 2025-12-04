import React, { useState } from 'react';
import { UserInput } from '../types';

interface InputFormProps {
  onSubmit: (input: UserInput) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [characterConfig, setCharacterConfig] = useState('');
  const [scenarioConfig, setScenarioConfig] = useState('');
  const scenarioTypeOptions = [
    '실제현실',
    '캐릭터',
    '판타지',
    '다큐멘터리',
    '코미디',
    '스릴러',
    'SF',
    '로맨스',
    '기타'
  ];
  const [scenarioType, setScenarioType] = useState('실제현실');
  const styleOptions = [
    '2D 애니메이션',
    '3D 애니메이션',
    '실사',
    '웹툰',
    '연극',
    '기타'
  ];
  const [style, setStyle] = useState('2D 애니메이션');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!characterConfig.trim() || !scenarioType || !style) return;
    onSubmit({ characterConfig, scenarioConfig, scenarioType, style });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 w-full mb-8">
      <div className="space-y-6">
        {/* 시나리오 유형 */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            1. 시나리오 유형 <span className="text-red-500 text-xs ml-1">(필수)</span>
          </label>
          <div className="text-xs text-slate-500 mb-2">무엇에 대한 이야기인가요? (예: 실제현실, 캐릭터, 판타지, 다큐멘터리 등)</div>
          <div className="flex flex-wrap gap-3">
            {scenarioTypeOptions.map((opt) => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                <input
                  type="radio"
                  name="scenarioType"
                  value={opt}
                  checked={scenarioType === opt}
                  onChange={() => setScenarioType(opt)}
                  required
                  disabled={isLoading}
                  className="accent-indigo-600"
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
        {/* 매체 스타일 */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            2. 매체 스타일 <span className="text-red-500 text-xs ml-1">(필수)</span>
          </label>
          <div className="text-xs text-slate-500 mb-2">어떤 형식으로 보여줄까요? (예: 애니메이션, 실사, 웹툰, 연극 등)</div>
          <div className="flex flex-wrap gap-3">
            {styleOptions.map((opt) => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                <input
                  type="radio"
                  name="style"
                  value={opt}
                  checked={style === opt}
                  onChange={() => setStyle(opt)}
                  required
                  disabled={isLoading}
                  className="accent-violet-600"
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
        {/* 캐릭터 설정 */}
        <div>
          <label htmlFor="character" className="block text-sm font-bold text-slate-700 mb-2">
            3. 캐릭터 설정 <span className="text-red-500 text-xs ml-1">(필수)</span>
          </label>
          <div className="text-xs text-slate-500 mb-2">주인공/등장인물을 설명해 주세요. (예: 2025년 12월을 맞이한 달력. 감정이 있는 사물로, 한 해의 끝자락에서 스스로의 의미를 고민한다.)</div>
          <textarea
            id="character"
            value={characterConfig}
            onChange={(e) => setCharacterConfig(e.target.value)}
            placeholder="예) 2025년 12월을 맞이한 달력. 감정이 있는 사물로, 한 해의 끝자락에서 스스로의 의미를 고민한다."
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all min-h-[100px] text-sm resize-y"
            required
            disabled={isLoading}
          />
        </div>
        {/* 시나리오 내용 */}
        <div>
          <label htmlFor="scenario" className="block text-sm font-bold text-slate-700 mb-2">
            4. 시나리오 내용 <span className="text-slate-400 text-xs font-normal ml-1">(옵션)</span>
          </label>
          <div className="text-xs text-slate-500 mb-2">줄거리/상황을 자유롭게 입력해 주세요. (예: 연말을 맞아 달력이 스스로의 존재 이유를 찾는 여정을 그린다.)</div>
          <textarea
            id="scenario"
            value={scenarioConfig}
            onChange={(e) => setScenarioConfig(e.target.value)}
            placeholder="예) 연말을 맞아 달력이 스스로의 존재 이유를 찾는 여정을 그린다."
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all min-h-[80px] text-sm resize-y"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !characterConfig.trim()}
          className={`w-full py-3 px-6 rounded-lg text-white font-bold text-lg transition-all shadow-md
            ${isLoading 
              ? 'bg-slate-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg active:scale-[0.99]'
            }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              작가님이 집필중입니다...
            </span>
          ) : '시나리오 생성하기'}
        </button>
      </div>
    </form>
  );
};