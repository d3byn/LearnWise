'use client';

import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BookIcon, CheckIcon, CopyIcon, SparkIcon } from '@/components/Icons';

const SKELETON_WIDTHS = ['92%', '78%', '85%', '60%', '88%', '70%'];

export default function ResultCard({
  result,
  loading,
  label,
}: {
  result: string;
  loading: boolean;
  label: string;
}) {
  
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const copied = copiedText !== null && copiedText === result;

  useEffect(() => {
    if (copiedText === null) return;
    const t = setTimeout(() => setCopiedText(null), 1800);
    return () => clearTimeout(t);
  }, [copiedText]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopiedText(result);
    } catch {
      
    }
  };

  const words = result ? result.trim().split(/\s+/).length : 0;

  return (
    <section
      aria-label="AI result"
      className="panel panel-lit flex flex-col overflow-hidden rounded-2xl"
    >
      <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="min-w-0">
            <h2 className="truncate text-lg leading-tight text-ink">Result</h2>
            <p className="eyebrow mt-0.5 truncate">
              {loading ? 'Thinking…' : result ? `${label} · ${words} words` : label}
            </p>
          </div>
        </div>

        {result && !loading && (
          <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? 'Copied to clipboard' : 'Copy result to clipboard'}
            className={`flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-300 ${
              copied
                ? 'border-sage/40 bg-sage/15 text-sage-bright'
                : 'border-line bg-white/[0.03] text-muted hover:border-line-strong hover:bg-sage/10 hover:text-sage-bright'
            }`}
          >
            {copied ? (
              <CheckIcon className="h-3.5 w-3.5" />
            ) : (
              <CopyIcon className="h-3.5 w-3.5" />
            )}
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </header>

      <div
        aria-live="polite"
        aria-busy={loading}
        className="min-h-[18rem] flex-1 overflow-y-auto px-5 py-5 lg:min-h-[27rem]"
      >
        {loading ? (
          <div className="space-y-3.5" aria-label="Generating">
            <div className="skeleton-line !h-4 !w-2/5" />
            <div className="h-1" />
            {SKELETON_WIDTHS.map((w, i) => (
              <div key={i} className="skeleton-line" style={{ width: w }} />
            ))}
            <div className="h-1" />
            <div className="skeleton-line !h-4 !w-1/3" />
            <div className="skeleton-line !w-4/5" />
            <div className="skeleton-line !w-2/3" />
          </div>
        ) : result ? (
          <div className="markdown animate-rise">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Wide tables scroll on their own rather than stretching the card.
                table: (props) => (
                  <div className="overflow-x-auto">
                    <table {...props} />
                  </div>
                ),
              }}
            >
              {result}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="flex h-full min-h-[15rem] flex-col items-center justify-center gap-3 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-2xl border border-line bg-white/[0.02] text-faint">
              <BookIcon className="h-6 w-6" />
            </span>

            <p className="max-w-[22rem] text-sm text-faint">
              Your study material will appear here.
              <br />
              Paste your notes, then hit Generate.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
