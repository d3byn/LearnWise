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
    <div className="border rounded-lg p-4 min-h-[120px] bg-gray-50">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold">✨ AI Result</h2>
        {result && (
          <button
            onClick={handleCopy}
            className="text-sm px-3 py-1 border rounded-md hover:bg-gray-100"
          >
            {copied ? 'Copied!' : '📋 Copy'}
          </button>
        )}
      </div>

      {result ? (
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown>{result}</ReactMarkdown>
        </div>
      ) : (
        <p className="text-gray-400 text-sm">
          Your AI-generated study material will appear here.
        </p>
      )}
    </div>
  );
}