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
        {/* Header */}
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            LearnWise
          </h1>
          <p className="text-[var(--muted)] text-lg">Your AI-powered study companion</p>
        </header>

        {/* Mode selector */}
        <div className="flex gap-3 justify-center flex-wrap">
          {MODES.map((m) => (
            <button
              key={m.key}
              onClick={() => setMode(m.key)}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                mode === m.key
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'bg-[var(--card-bg)] text-[var(--foreground)] border border-[var(--border)] hover:border-indigo-300 hover:shadow-md'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Input area */}
        <div className="bg-[var(--card-bg)] rounded-2xl shadow-sm border border-[var(--border)] p-6 space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your notes, answer, or question here..."
            rows={10}
            className="w-full bg-transparent border border-[var(--border)] rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
          />
          <div className="flex justify-between items-center text-sm">
            <button
              onClick={handleClear}
              className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors font-medium"
            >
              Clear
            </button>
            <span className={`font-medium ${content.length > 10000 ? 'text-red-500' : 'text-[var(--muted)]'}`}>
              {content.length} / 10,000
            </span>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3">
            <span className="text-red-500 text-lg">⚠️</span>
            <p className="text-red-700 dark:text-red-400 text-sm flex-1">{error}</p>
          </div>
        )}

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold disabled:opacity-50 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-200 disabled:hover:shadow-none"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Generating...
            </span>
          ) : (
            '✨ Generate'
          )}
        </button>

        {/* Result */}
        <ResultCard result={result} />
      </div>
    </main>
  );
}