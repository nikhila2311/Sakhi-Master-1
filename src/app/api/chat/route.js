import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'edge';

const genAI = new GoogleGenerativeAI(process.env.GEMENI_API_KEY || '');

const buildPrompt = (messages) => ({
  contents: messages
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    })),
});

export async function POST(req) {
  const { messages } = await req.json();

  const model = genAI.getGenerativeModel({
    model: 'models/gemini-2.0-flash-001',
  });

  const result = await model.generateContent(buildPrompt(messages));
  const response = await result.response;

  // Clean output: remove leading/trailing whitespace and return raw markdown-style text
  const text = response.text().trim();

  return new Response(text, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}