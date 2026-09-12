export const prompts = {
  summarize: (content: string) => `
You are an AI study assistant helping a college student.

Task: Summarize the study material below.

Requirements:
- Keep it concise
- Preserve important technical terms
- Remove repetition
- Use simple language
- Organize with bullet points and headings
- Do NOT add information not present in the material

Study material:
${content}
`,
  quiz: (content: string) => `
You are an AI study assistant.

Task: Generate a short quiz based ONLY on the study material below.

Requirements:
- Generate 5 questions
- Mix conceptual and factual questions
- Each question has 4 options (A-D)
- Clearly state the correct answer
- Add a one-sentence explanation per answer
- Do NOT use information outside the material

Study material:
${content}
`,
  improve: (content: string) => `
You are an academic writing assistant.

Task: Improve the student's answer below while preserving its original meaning.

Requirements:
- Correct grammar and sentence structure
- Improve clarity and organization
- Use appropriate academic terminology
- Do NOT add unsupported facts
- Keep it suitable for a college examination

Return in this format:
1. Improved Answer
2. Key Improvements (bullet list)

Student answer:
${content}
`,
  explain: (content: string) => `
You are an AI study assistant explaining topics to college students.

Task: Explain the topic in a clear, structured way.

Requirements:
- Start with a simple explanation (2-3 sentences)
- Provide a relatable analogy or example in a "Think of it like this" section
- End with a key definition or takeaway
- Use simple, clear language
- Make it memorable and easy to understand

Topic to explain:
${content}
`,
};

export type Mode = keyof typeof prompts;