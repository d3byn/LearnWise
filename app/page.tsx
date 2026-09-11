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
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <header className="text-center">
        <h1 className="text-3xl font-bold">LearnWise</h1>
        <p className="text-gray-500">Your AI-powered study assistant</p>
      </header>

      {/* Mode selector */}
      <div className="flex gap-3 justify-center flex-wrap">
        {MODES.map((m) => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            className={`px-4 py-2 rounded-lg border transition ${
              mode === m.key ? 'bg-black text-white' : 'bg-white hover:bg-gray-50'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Input area */}
      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste your notes, answer, or question here..."
          rows={8}
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
        />
        <div className="flex justify-between text-sm text-gray-400 mt-1">
          <button onClick={handleClear} className="hover:text-gray-600">
            Clear
          </button>
          <span className={content.length > 10000 ? 'text-red-500' : ''}>
            {content.length} / 10,000
          </span>
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
          ⚠️ {error}
        </p>
      )}

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full bg-black text-white py-3 rounded-lg disabled:opacity-50 hover:bg-gray-800 transition"
      >
        {loading ? 'Generating...' : '✨ Generate'}
      </button>

      <ResultCard result={result} />
    </main>
  );
}