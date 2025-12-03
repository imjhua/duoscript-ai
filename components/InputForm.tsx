import React, { useState } from 'react';
import { UserInput } from '../types';

interface InputFormProps {
  onSubmit: (input: UserInput) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [characterConfig, setCharacterConfig] = useState('');
  const [scenarioConfig, setScenarioConfig] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!characterConfig.trim()) return;
    onSubmit({ characterConfig, scenarioConfig });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 w-full mb-8">
      <div className="space-y-6">
        <div>
          <label htmlFor="character" className="block text-sm font-bold text-slate-700 mb-2">
            캐릭터 설정 <span className="text-red-500 text-xs ml-1">(필수)</span>
          </label>
          <textarea
            id="character"
            value={characterConfig}
            onChange={(e) => setCharacterConfig(e.target.value)}
            placeholder="예) 눈이 크고 표정이 풍부한, 작고 동그랗고 복슬복슬한 생물..."
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all min-h-[100px] text-sm resize-y"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="scenario" className="block text-sm font-bold text-slate-700 mb-2">
            시나리오 내용 <span className="text-slate-400 text-xs font-normal ml-1">(옵션)</span>
          </label>
          <textarea
            id="scenario"
            value={scenarioConfig}
            onChange={(e) => setScenarioConfig(e.target.value)}
            placeholder="예) 마법의 숲을 탐험하며 신비한 생물들과 교감하는 이야기..."
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