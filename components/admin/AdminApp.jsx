'use client';

import { useEffect, useState } from 'react';
import { LockKeyhole, ArrowLeft } from 'lucide-react';
import StatsView from './StatsView';
import { loadHistory } from '../../lib/storage';

const DEFAULT_PIN = '1612'; // ink 색 hex 마지막 네 자리. 운영 시 변경 가능.
const SESSION_KEY = 'tcmp.admin.unlocked';

export default function AdminApp() {
  const [unlocked, setUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.sessionStorage.getItem(SESSION_KEY) === '1') {
      setUnlocked(true);
    }
  }, []);

  useEffect(() => {
    if (unlocked) setHistory(loadHistory());
  }, [unlocked]);

  function handleUnlock(e) {
    e.preventDefault();
    const pin = getConfiguredPin();
    if (pinInput === pin) {
      setUnlocked(true);
      setError('');
      try { window.sessionStorage.setItem(SESSION_KEY, '1'); } catch {}
    } else {
      setError('PIN이 일치하지 않습니다.');
    }
  }

  function refresh() {
    setHistory(loadHistory());
  }

  if (!unlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-16">
        <form
          onSubmit={handleUnlock}
          className="w-full max-w-sm anim-fade-up"
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-[11px] tracking-[0.3em] text-gray-mid mb-6">
              <LockKeyhole size={14} strokeWidth={1.5} className="text-gold" />
              ADMIN · TCMP
            </div>
            <h1 className="font-display-kr text-[26px] sm:text-[32px] text-ink">
              관리자 영역
            </h1>
            <p className="mt-3 prose-kr italic text-[14px] text-gray-mid">
              통계 열람을 위해 PIN을 입력해 주세요.
            </p>
          </div>

          <label className="block">
            <span className="block text-[11px] tracking-[0.3em] text-gray-mid mb-2">PIN</span>
            <input
              type="password"
              inputMode="numeric"
              autoComplete="off"
              autoFocus
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              className="w-full bg-transparent border-b border-beige-dark py-3 font-code text-[20px] tracking-[0.3em] text-ink text-center focus:outline-none focus:border-ink transition-colors"
              placeholder="● ● ● ●"
              maxLength={8}
            />
          </label>

          {error && (
            <p className="mt-3 text-center text-[12px] text-shadow">{error}</p>
          )}

          <button
            type="submit"
            className="mt-8 w-full rounded-full bg-ink text-cream py-3 font-serif-kr text-[14px] hover:bg-gold transition-colors duration-300"
          >
            확인
          </button>

          <a
            href="/"
            className="mt-6 inline-flex items-center justify-center gap-1.5 w-full text-[12px] text-gray-mid hover:text-ink transition-colors"
          >
            <ArrowLeft size={12} strokeWidth={1.75} />
            진단으로 돌아가기
          </a>
        </form>
      </div>
    );
  }

  return <StatsView history={history} onRefresh={refresh} />;
}

function getConfiguredPin() {
  if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_ADMIN_PIN) {
    return process.env.NEXT_PUBLIC_ADMIN_PIN;
  }
  return DEFAULT_PIN;
}
