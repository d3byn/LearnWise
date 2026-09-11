'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function ResultCard({ result }: { result: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6 min-h-[160px] shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <span className="text-2xl">✨</span>
          <span>AI Result</span>
        </h2>
        {result && (
          <button
            onClick={handleCopy}
            className="text-sm px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors font-medium"
          >
            {copied ? '✓ Copied!' : '📋 Copy'}
          </button>
        )}
      </div>

      {result ? (
        <div className="prose prose-slate dark:prose-invert prose-sm max-w-none prose-headings:text-[var(--foreground)] prose-p:text-[var(--foreground)] prose-strong:text-[var(--foreground)] prose-li:text-[var(--foreground)]">
          <ReactMarkdown>{result}</ReactMarkdown>
        </div>
      ) : (
        <div className="flex items-center justify-center h-24">
          <p className="text-[var(--muted)] text-sm">
            Your AI-generated study material will appear here
          </p>
        </div>
      )}
    </div>
  );
}