<h1>
  <img src="./app/favicon.ico" alt="LearnWise logo" width="24" style="vertical-align: middle; margin-right: 8px;" />
  LearnWise
</h1>

# LearnWise

An AI study assistant. Paste your notes and get back a summary, a practice quiz, or a polished answer.

## Modes

| Mode | What it does |
| --- | --- |
| **Summarize** | Condenses long notes into structured key points |
| **Quiz** | Generates 5 multiple-choice questions with answers and explanations |
| **Improve** | Rewrites a draft answer into clear, exam-ready academic writing |
| **Explain Topic** | Enter any topic and get a beginner-friendly explanation in simple language. |

## Setup

```bash
npm install
```

Create a `.env.local` file in the project root:

```
GEMINI_API_KEY=your_key_here
```

Get a key from [Google AI Studio](https://aistudio.google.com/apikey).

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Gemini API

## Structure

```
app/
  page.tsx           UI
  api/ai/route.ts    Validates input, calls Gemini
components/          ModeSwitcher, ResultCard, Icons
lib/prompts.ts       Prompt templates per mode
```

Input is capped at 20–10,000 characters.


*Project made for ShadowFox AI Engineer Virtual Internship*