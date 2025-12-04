import React, { useState } from 'react';
import { DualScenarioResponse, ScenarioDetail, Scene } from '../types';

interface ScenarioViewProps {
  data: DualScenarioResponse;
}

const formatSceneText = (data: ScenarioDetail, scene: Scene, isKo: boolean) => {
  if (isKo) {
    return `제목: "${data.title}"
장르: ${data.genre}
매체 스타일: ${data.mediaStyle}
주인공:

이름: ${data.protagonist.name}

특징: ${data.protagonist.features}

시놉시스

${data.synopsis}

시나리오
장면 ${scene.scene_number}: ${scene.title}

시각: ${scene.time}

액션: ${scene.action}

감정: ${scene.emotion}

시각적 포인트(매체 스타일 반영): ${scene.visual_point}

사운드: ${scene.sound}`;
  } else {
    return `Title: "${data.title}"
Genre: ${data.genre}
Media Style: ${data.mediaStyle}
Protagonist:

Name: ${data.protagonist.name}

Features: ${data.protagonist.features}

Synopsis

${data.synopsis}

Scenario
Scene ${scene.scene_number}: ${scene.title}

Time: ${scene.time}

Action: ${scene.action}

Emotion: ${scene.emotion}

Visual Point (Media Style Applied): ${scene.visual_point}

Sound: ${scene.sound}`;
  }
};

const SceneCell: React.FC<{ scene: Scene; data: ScenarioDetail; isKo: boolean }> = ({ scene, data, isKo }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = formatSceneText(data, scene, isKo);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className={`h-full p-6 ${isKo ? 'bg-white' : 'bg-slate-50/50'}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-bold text-indigo-900 text-lg leading-tight">
            {isKo ? `장면 ${scene.scene_number}` : `Scene ${scene.scene_number}`}: {scene.title}
          </h4>
          <p className="text-xs text-slate-500 font-mono uppercase mt-1.5 tracking-wide flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {scene.time}
          </p>
        </div>
        <button
          onClick={handleCopy}
          className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm border
            ${copied
              ? 'bg-green-100 text-green-700 border-green-200'
              : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
            }`}
          title={isKo ? "장면 및 설정 복사" : "Copy Scene & Settings"}
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              {isKo ? "완료" : "Done"}
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              {isKo ? "복사" : "Copy"}
            </>
          )}
        </button>
      </div>

      <div className="space-y-4 text-sm">
        <div>
          <span className="font-bold text-slate-700 block mb-1.5 text-xs uppercase tracking-wider">{isKo ? '액션 (Action)' : 'Action'}</span>
          <p className="text-slate-700 leading-relaxed text-[15px]">{scene.action}</p>
        </div>

        <div className="grid grid-cols-1 gap-3 pt-3 border-t border-slate-200/60 mt-4">
          <div>
            <span className="font-bold text-slate-700 text-xs uppercase tracking-wider block mb-1">{isKo ? '감정 (Emotion)' : 'Emotion'}</span>
            <span className="text-slate-600 italic block">{scene.emotion}</span>
          </div>
          <div>
            <span className="font-bold text-slate-700 text-xs uppercase tracking-wider block mb-1">{isKo ? '시각적 포인트 (Visual)' : 'Visual Point'}</span>
            <span className="text-slate-600 block">{scene.visual_point}</span>
          </div>
          <div>
            <span className="font-bold text-slate-700 text-xs uppercase tracking-wider block mb-1">{isKo ? '사운드 (Sound)' : 'Sound'}</span>
            <span className="text-slate-600 block">{scene.sound}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ScenarioView: React.FC<ScenarioViewProps & { scenarioLanguage?: string }> = ({ data, scenarioLanguage }) => {
  return (
    <div className="w-full space-y-8 pb-12">

      {/* 시나리오 언어 설정값 표시 */}
      <div className="mb-4">
        <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-sm font-semibold border border-blue-100">
          시나리오 언어: {scenarioLanguage || '한글'}
        </span>
      </div>

      {/* 1. Basic Info Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header: Title & Genre */}
        <div className="grid grid-cols-1 lg:grid-cols-2 border-b border-slate-200">
          <div className="p-6 border-b lg:border-b-0 lg:border-r border-slate-200">
            <span className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-1">Korean</span>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">{data.ko.title}</h2>
            <div className="space-x-2">
              <span className="inline-block bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md text-sm font-medium border border-indigo-100">
                {data.ko.genre}
              </span>
              <span className="inline-block bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md text-sm font-medium border border-indigo-100">
                {data.ko.mediaStyle}
              </span>
            </div>
          </div>
          <div className="p-6 bg-slate-50/50">
            <span className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-1">English</span>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">{data.en.title}</h2>
            <div className="space-x-2">
              <span className="inline-block bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md text-sm font-medium border border-indigo-100">
                {data.en.genre}
              </span>
              <span className="inline-block bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md text-sm font-medium border border-indigo-100">
                {data.en.mediaStyle}
              </span>
            </div>
          </div>
        </div>

        {/* Protagonist */}
        <div className="grid grid-cols-1 lg:grid-cols-2 border-b border-slate-200">
          <div className="p-6 border-b lg:border-b-0 lg:border-r border-slate-200">
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> 주인공
            </h3>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <p className="font-bold text-slate-700 mb-1">{data.ko.protagonist.name}</p>
              <p className="text-slate-600 text-sm leading-relaxed">{data.ko.protagonist.features}</p>
            </div>
          </div>
          <div className="p-6 bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Protagonist
            </h3>
            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <p className="font-bold text-slate-700 mb-1">{data.en.protagonist.name}</p>
              <p className="text-slate-600 text-sm leading-relaxed">{data.en.protagonist.features}</p>
            </div>
          </div>
        </div>

        {/* Synopsis */}
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="p-6 border-b lg:border-b-0 lg:border-r border-slate-200">
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> 시놉시스
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">{data.ko.synopsis}</p>
          </div>
          <div className="p-6 bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Synopsis
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">{data.en.synopsis}</p>
          </div>
        </div>
      </div>

      {/* 2. Scenes List */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">🎬</span>
          <h3 className="text-2xl font-bold text-slate-800">
            시나리오 <span className="text-slate-400 font-normal text-lg ml-1">Scenario</span>
          </h3>
        </div>

        <div className="space-y-6">
          {data.ko.scenes.map((sceneKo, idx) => {
            const sceneEn = data.en.scenes[idx];
            return (
              <div key={sceneKo.scene_number} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
                  {/* Korean Scene */}
                  <SceneCell scene={sceneKo} data={data.ko} isKo={true} />
                  {/* English Scene */}
                  <SceneCell scene={sceneEn} data={data.en} isKo={false} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
