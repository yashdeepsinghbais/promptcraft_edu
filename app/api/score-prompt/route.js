import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req) {
  console.log("🚀 API HIT!");

  try {
    const body = await req.json();
    console.log("🧠 Incoming prompt:", body.prompt);

    const systemPrompt = `
You are a Prompt Expert AI designed to help users write better prompts for LLMs.

Analyze the given prompt and do the following:

1. Score it from 1 to 10 based on clarity, specificity, and usefulness.
2. Classify the prompt into:
   - Beginner: Very basic, lacks detail, vague or too short.
   - Intermediate: Reasonable detail but lacks context or goal clarity.
   - Advanced: Highly specific, includes context, clear goal, and structure.
3. Identify key issues.
4. Suggest improvements.
5. Rewrite the prompt into an improved version.

Be honest in scoring. Do not give high scores to vague or short prompts. Reply in this format:

Score: x/10  
Level: Beginner/Intermediate/Advanced  
Key Issues:  
1. ...  
2. ...  
Suggestions to Improve:  
...  
**Revised Prompt:**  
...
`;

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: body.prompt, // 🔥 fixed here!
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const aiReply = response.data.choices[0].message.content;
    console.log("✅ AI Reply:", aiReply);
    return NextResponse.json({ result: aiReply });

  } catch (error) {
    console.error('🔥 Error in API call:', error.response?.data || error.message);
    return NextResponse.json({ error: 'Failed to fetch AI response.' }, { status: 500 });
  }
}
