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

        <h2 className="gfs-didot-regular font-normal text-xl flex items-center gap-2">
          <span className="text-2xl">✨</span>
          <span>AI Result</span>
        </h2>
        {result && (
          <button
            onClick={handleCopy}
            className="text-sm px-4 py-2 bg-gradient-to-r from-[#092328] to-[#12544F] text-[#8BBB92] border border-[#2A835F]/30 rounded-lg hover:from-[#12544F] hover:to-[#2A835F] hover:text-white transition-all duration-300 font-medium"
          >
            {copied ? '✓ Copied!' : '📋 Copy'}
          </button>
        )}
      </div>

      {result ? (
        <div className="prose prose-invert prose-sm max-w-none prose-headings:text-[var(--foreground)] prose-p:text-[var(--foreground)] prose-strong:text-[#8BBB92] prose-li:text-[var(--foreground)] prose-a:text-[#8BBB92]">
          <ReactMarkdown>
            {result}
          </ReactMarkdown>
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