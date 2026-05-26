'use client';

import { useEffect, useMemo, useState } from 'react';
import IntroScreen from './screens/IntroScreen';
import DemographicsScreen from './screens/DemographicsScreen';
import QuestionScreen from './screens/QuestionScreen';
import ResultScreen from './screens/ResultScreen';
import { calculateResult } from '../lib/scoring';
import { saveResult, getLatest } from '../lib/storage';
import { emptyDemographics } from '../lib/demographics';
import codes from '../data/codes.json';

/**
 * step 의미:
 *   0 → 인트로
 *   1 → 인구통계 (일반 사항)
 *   2~6 → 질문 화면 (각각 한 지표 분량, screenIndex = step - 1)
 *   7 → 결과
 */
const STEP_INTRO = 0;
const STEP_DEMO = 1;
const STEP_Q_START = 2;
const STEP_Q_END = 6;
const STEP_RESULT = 7;

export default function TcmpApp() {
  const [step, setStep] = useState(STEP_INTRO);
  const [answers, setAnswers] = useState({});
  const [demographics, setDemographics] = useState(emptyDemographics());
  const [latest, setLatest] = useState(null);
  const [savedResult, setSavedResult] = useState(null);

  useEffect(() => { setLatest(getLatest()); }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const result = useMemo(() => {
    if (step !== STEP_RESULT) return null;
    if (savedResult) return savedResult;
    return calculateResult(answers);
  }, [step, answers, savedResult]);

  useEffect(() => {
    if (step === STEP_RESULT && result && !savedResult) {
      saveResult(result, demographics);
      setLatest({ code: result.code, scores: result.scores, demographics, timestamp: Date.now() });
    }
  }, [step, result, savedResult, demographics]);

  function handleAnswer(qid, value) {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  }

  function handlePickDemo(key, val) {
    setDemographics((prev) => ({ ...(prev || {}), [key]: val }));
  }

  function restart() {
    setAnswers({});
    setDemographics(emptyDemographics());
    setSavedResult(null);
    setStep(STEP_INTRO);
  }

  function showLatestResult() {
    const r = getLatest();
    if (!r) return;
    setSavedResult({
      code: r.code,
      letters: r.code.split(''),
      scores: r.scores,
      data: codes[r.code] || null,
    });
    setStep(STEP_RESULT);
  }

  if (step === STEP_INTRO) {
    return <IntroScreen onStart={() => setStep(STEP_DEMO)} latest={latest} onShowLatest={showLatestResult} />;
  }
  if (step === STEP_DEMO) {
    return (
      <DemographicsScreen
        value={demographics}
        onPick={handlePickDemo}
        onPrev={() => setStep(STEP_INTRO)}
        onNext={() => setStep(STEP_Q_START)}
      />
    );
  }
  if (step >= STEP_Q_START && step <= STEP_Q_END) {
    const screenIndex = step - 1; // 1~5
    return (
      <QuestionScreen
        key={step}
        screenIndex={screenIndex}
        answers={answers}
        onAnswer={handleAnswer}
        onPrev={() => setStep((s) => Math.max(STEP_DEMO, s - 1))}
        onNext={() => setStep((s) => Math.min(STEP_RESULT, s + 1))}
      />
    );
  }
  return <ResultScreen result={result} onRestart={restart} />;
}
