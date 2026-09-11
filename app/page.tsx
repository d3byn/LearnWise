'use client';

import { useState } from 'react';
import ResultCard from '@/components/ResultCard';

type Mode = 'summarize' | 'quiz' | 'improve';

const MODES: { key: Mode; label: string }[] = [
  { key: 'summarize', label: '📝 Summarize' },
  { key: 'quiz', label: '❓ Generate Quiz' },
  { key: 'improve', label: '✨ Improve Answer' },
];

export default function Home() {
  const [mode, setMode] = useState<Mode>('summarize');
  const [content, setContent] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setError('');
    setResult('');

    const trimmed = content.trim();

    if (!trimmed) {
      setError('Please enter some content first.');
      return;
    }

    if (trimmed.length < 20) {
      setError('Please enter at least 20 characters.');
      return;
    }

    if (content.length > 10000) {
      setError('Content is too long (max 10,000 characters).');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, content }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Something went wrong.');
      } else {
        setResult(data.result);
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setContent('');
    setResult('');
    setError('');
  };

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">

        <header className="text-center space-y-2">
          <h1 className="text-5xl font-normal gfs-didot-regular bg-gradient-to-r from-[#8BBB92] via-[#2A835F] to-[#12544F] bg-clip-text text-transparent">
            LearnWise
          </h1>

          <p className="text-[var(--muted)] text-lg">
            Your AI-powered study companion
          </p>
        </header>

        <div className="flex gap-3 justify-center flex-wrap">
          {MODES.map((m) => (
            <button
              key={m.key}
              onClick={() => setMode(m.key)}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                mode === m.key
                  ? 'bg-gradient-to-r from-[#092328] via-[#12544F] to-[#2A835F] text-white shadow-lg shadow-[#2A835F]/20 border border-[#2A835F]/40'
                  : 'bg-[var(--card-bg)] text-[var(--foreground)] border border-[var(--border)] hover:border-[#2A835F] hover:bg-[#12544F]/30 hover:shadow-md'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="bg-[var(--card-bg)] rounded-2xl shadow-sm border border-[var(--border)] p-6 space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your notes, answer, or question here..."
            rows={10}
            className="w-full bg-transparent border border-[var(--border)] rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#2A835F] focus:border-[#2A835F] transition-all resize-none text-[var(--foreground)] placeholder:text-[var(--muted)]"
          />

          <div className="flex justify-between items-center text-sm">
            <button
              onClick={handleClear}
              className="text-[var(--muted)] hover:text-[#8BBB92] transition-colors font-medium"
            >
              Clear
            </button>

            <span
              className={`font-medium ${
                content.length > 10000
                  ? 'text-red-500'
                  : 'text-[var(--muted)]'
              }`}
            >
              {content.length} / 10,000
            </span>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-xl p-4 flex items-start gap-3">
            <span className="text-red-400 text-lg">⚠️</span>

            <p className="text-red-400 text-sm flex-1">
              {error}
            </p>
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#12544F] via-[#2A835F] to-[#12544F] text-white py-4 rounded-xl font-semibold disabled:opacity-50 hover:from-[#092328] hover:via-[#12544F] hover:to-[#2A835F] hover:shadow-lg hover:shadow-[#2A835F]/20 transition-all duration-300 disabled:hover:shadow-none"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />

                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>

              Generating...
            </span>
          ) : (
            '✨ Generate'
          )}
        </button>

        <ResultCard result={result} />

      </div>
    </main>
  );
}