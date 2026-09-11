'use client';

import { useMemo, useState } from 'react';
import ResultCard from '@/components/ResultCard';
import ModeSwitcher, { MODES } from '@/components/ModeSwitcher';
import type { Mode } from '@/lib/prompts';
import {
  AlertIcon,
  EraserIcon,
  SparkIcon,
  SpinnerIcon,
} from '@/components/Icons';

const MAX_CHARS = 10000;
const MIN_CHARS = 20;

const SAMPLE = `Photosynthesis is the process by which green plants, algae and some bacteria convert light energy into chemical energy. It takes place mainly in the chloroplasts, which contain the pigment chlorophyll. The process has two stages: the light-dependent reactions, which occur in the thylakoid membranes and produce ATP and NADPH, and the Calvin cycle, which occurs in the stroma and fixes carbon dioxide into glucose. Oxygen is released as a by-product when water molecules are split during the light-dependent reactions.`;

export default function Home() {
  const [mode, setMode] = useState<Mode>('summarize');
  const [content, setContent] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const active = useMemo(
    () => MODES.find((m) => m.key === mode) ?? MODES[0],
    [mode],
  );

  const count = content.length;
  const trimmedLength = content.trim().length;
  const overLimit = count > MAX_CHARS;
  const tooShort = count > 0 && trimmedLength < MIN_CHARS;
  const fillPct = Math.min(100, (count / MAX_CHARS) * 100);

  const handleGenerate = async () => {
    setError('');
    const trimmed = content.trim();

    if (!trimmed) {
      setError('Please enter some content first.');
      return;
    }
    if (trimmed.length < MIN_CHARS) {
      setError(`Please enter at least ${MIN_CHARS} characters.`);
      return;
    }
    if (count > MAX_CHARS) {
      setError('Content is too long (max 10,000 characters).');
      return;
    }

    setResult('');
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
    } catch {
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && !loading) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <>

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 pb-20 pt-12 sm:pt-16">
        <div className="mx-auto max-w-2xl text-center animate-rise">

          <h1 className="mt-3 font-display text-5xl leading-[1.05] sm:text-6xl">
            <span className="gradient-text">|| LearnWise ||</span>
            <br />
            <span className="text-ink">study smarter, not longer.</span>
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-muted">
            Drop in your notes and turn them into tight summaries, practice quizzes, or exam-ready answers.
          </p>
        </div>

        <div className="mt-12 grid items-start gap-6 lg:grid-cols-2">
          {/* Composer  */}
          <div
            className="space-y-4 animate-rise"
            style={{ animationDelay: '80ms' }}
          >
            <ModeSwitcher mode={mode} onChange={setMode} disabled={loading} />

            <p className="px-1 text-sm text-muted">{active.hint}</p>

            <div className="panel panel-lit overflow-hidden rounded-2xl">
              <label htmlFor="content" className="sr-only">
                Study material
              </label>

              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={active.placeholder}
                rows={11}
                spellCheck={false}
                className="w-full resize-none bg-transparent px-5 py-5 text-[0.9375rem] leading-relaxed text-ink outline-none placeholder:text-faint"
              />

              {/* Fill meter */}
              <div className="h-px w-full bg-line">
                <div
                  className={`h-px transition-[width,background-color] duration-500 ${overLimit
                    ? 'bg-danger'
                    : fillPct > 85
                      ? 'bg-amber-400'
                      : 'bg-sage/70'
                    }`}
                  style={{ width: `${fillPct}%` }}
                />
              </div>

              <div className="flex items-center justify-between gap-3 px-4 py-2.5">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleClear}
                    disabled={!content && !result}
                    className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-faint transition-colors hover:bg-white/[0.04] hover:text-sage-bright disabled:pointer-events-none disabled:opacity-40"
                  >
                    <EraserIcon className="h-3.5 w-3.5" />
                    Clear
                  </button>

                  {!content && (
                    <button
                      type="button"
                      onClick={() => setContent(SAMPLE)}
                      className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-faint transition-colors hover:bg-white/[0.04] hover:text-sage-bright"
                    >
                      Try an example
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {tooShort && (
                    <span className="text-xs text-faint">
                      {MIN_CHARS - trimmedLength} more characters
                    </span>
                  )}

                  <span
                    className={`font-mono text-xs tabular-nums transition-colors ${overLimit
                      ? 'text-danger'
                      : fillPct > 85
                        ? 'text-amber-400'
                        : 'text-faint'
                      }`}
                  >
                    {count.toLocaleString()}
                    <span className="text-faint/60"> / 10,000</span>
                  </span>
                </div>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="animate-rise flex items-start gap-3 rounded-xl border border-danger/25 bg-danger/[0.08] px-4 py-3"
              >
                <AlertIcon className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
                <p className="flex-1 text-sm text-danger">{error}</p>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                className="group relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-brand-deep via-brand to-brand-deep bg-[length:200%_100%] px-6 py-3.5 font-medium text-white shadow-[0_12px_32px_-14px_rgb(42_131_95/0.9)] ring-1 ring-sage/20 transition-all duration-500 hover:bg-[position:100%_0] hover:shadow-[0_16px_40px_-14px_rgb(42_131_95/0.95)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none"
              >
                {loading ? (
                  <>
                    <SpinnerIcon className="h-4 w-4 animate-spin" />
                    Generating…
                  </>
                ) : (
                  <>
                    <SparkIcon className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                    Generate
                  </>
                )}
              </button>

              <kbd className="hidden shrink-0 rounded-lg border border-line bg-white/[0.03] px-2.5 py-2 font-mono text-[0.6875rem] text-faint sm:block">
                ⌘ ↵
              </kbd>
            </div>
          </div>

          {/* Result  */}
          <div
            className="animate-rise lg:sticky lg:top-24"
            style={{ animationDelay: '160ms' }}
          >
            <ResultCard
              result={result}
              loading={loading}
              label={active.short}
            />
          </div>
        </div>
      </main>

      <footer className=" px-5 py-6">
        <p className="mx-auto max-w-6xl text-center text-xs text-[var(--muted)]">
          Made by{' '}
          <a
            href="https://github.com/d3byn"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8BBB92] hover:text-[#2A835F] transition-colors duration-200 font-medium"
          >
            Debayan
          </a>
        </p>
      </footer>
    </>
  );
}
