'use client';

import { useRef, type KeyboardEvent } from 'react';
import type { Mode } from '@/lib/prompts';
import { NotesIcon, QuizIcon, WandIcon, LightbulbIcon } from '@/components/Icons';

export type ModeConfig = {
  key: Mode;
  label: string;
  compact: string;
  short: string;
  hint: string;
  placeholder: string;
  inputLabel?: string;
  Icon: typeof NotesIcon;
};

export const MODES: ModeConfig[] = [
  {
    key: 'summarize',
    label: 'Summarize',
    compact: 'Summarize',
    short: 'Summary',
    hint: 'Condense long notes into clean, structured key points.',
    placeholder: 'Paste a lecture transcript, textbook section, or your messy class notes…',
    Icon: NotesIcon,
  },
  {
    key: 'quiz',
    label: 'Generate Quiz',
    compact: 'Quiz',
    short: 'Quiz',
    hint: 'Turn your material into 5 practice questions with answers.',
    placeholder: 'Paste the chapter or topic you want to be tested on…',
    Icon: QuizIcon,
  },
  {
    key: 'improve',
    label: 'Improve Answer',
    compact: 'Improve',
    short: 'Improved',
    hint: 'Polish a draft into clear, exam-ready academic writing.',
    placeholder: 'Paste your draft answer and it will come back sharper…',
    Icon: WandIcon,
  },
  {
    key: 'explain',
    label: 'Explain Topic',
    compact: 'Explain',
    short: 'Explain',
    hint: 'Get a simple, beginner-friendly explanation of any topic or concept.',
    inputLabel: 'Topic or concept',
    placeholder: 'Enter a topic or concept you want explained simply…',
    Icon: LightbulbIcon,
  },
];

export default function ModeSwitcher({
  mode,
  onChange,
  disabled,
}: {
  mode: Mode;
  onChange: (mode: Mode) => void;
  disabled?: boolean;
}) {
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const activeIndex = MODES.findIndex((m) => m.key === mode);
  const tabWidth = `calc((100% - 0.75rem) / ${MODES.length})`;

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const delta = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!delta) return;

    e.preventDefault();
    const next = (activeIndex + delta + MODES.length) % MODES.length;
    onChange(MODES[next].key);
    tabsRef.current[next]?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label="Study mode"
      onKeyDown={handleKeyDown}
      className="panel relative grid gap-1 rounded-2xl p-1.5"
      style={{ gridTemplateColumns: `repeat(${MODES.length}, minmax(0, 1fr))` }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-1.5 left-1.5 rounded-xl bg-gradient-to-br from-brand to-brand-deep shadow-[0_6px_20px_-8px_rgb(42_131_95/0.9)] ring-1 ring-sage/25 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          width: tabWidth,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />

      {MODES.map(({ key, label, compact, Icon }, i) => {
        const selected = key === mode;

        return (
          <button
            key={key}
            ref={(el) => {
              tabsRef.current[i] = el;
            }}
            role="tab"
            type="button"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            disabled={disabled}
            onClick={() => onChange(key)}
            className={`relative z-10 flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-300 disabled:cursor-not-allowed ${
              selected ? 'text-white' : 'text-muted hover:text-sage-bright'
            }`}
          >
            <Icon
              className={`h-4 w-4 shrink-0 transition-transform duration-300 ${
                selected ? 'scale-110' : ''
              }`}
            />
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{compact}</span>
          </button>
        );
      })}
    </div>
  );
}