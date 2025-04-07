'use client';

import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setAiResponse('');

    try {
      const res = await fetch('/api/score-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (res.ok) {
        setAiResponse(data.result);
      } else {
        setAiResponse('❌ Failed to get feedback from AI.');
      }
    } catch {
      setAiResponse('⚠️ Error: Could not connect to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-100 via-white to-green-100 py-10">
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-xl border border-yellow-200">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold mb-2">🎓 PromptCraft EDU</h1>
          <p className="text-gray-700">
            Learn how to write better prompts and become a Prompt Master! 🧠✨
          </p>
        </div>

        <div className="mb-4">
          <p className="mb-2 font-semibold">🧑‍🏫 What Makes a Good Prompt?</p>
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
            <li><strong>Beginner</strong>: General request (e.g., &quot;Explain photosynthesis&quot;).</li>
            <li><strong>Intermediate</strong>: Slightly focused (e.g., &quot;Explain photosynthesis for 8th grade&quot;).</li>
            <li><strong>Advanced</strong>: Specific + style + audience (e.g., &quot;Explain photosynthesis using a short story for 8th graders with fun analogies&quot;).</li>
          </ul>
        </div>

        <textarea
          className="w-full border border-gray-300 rounded-md p-3 mb-4"
          rows={5}
          placeholder="✍️ Try this: Explain Newton&apos;s first law like I’m a 10-year-old..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md"
        >
          {isLoading ? 'Scoring your prompt...' : 'Analyze My Prompt 🚀'}
        </button>

        {aiResponse && (
          <div className="mt-6 bg-gray-100 p-4 rounded-xl space-y-4">
            <h2 className="text-xl font-semibold">📚 AI Feedback</h2>
            <p><strong>🧮 Score:</strong> {aiResponse.match(/Score:\s*(\d+\/\d+)/)?.[1] ?? 'N/A'}</p>
            <p><strong>🎯 Level:</strong> {aiResponse.match(/Level:\s*(.*)/)?.[1] ?? 'N/A'}</p>

            <div>
              <h3 className="font-semibold">🔍 Key Issues:</h3>
              <ul className="list-disc list-inside">
                {aiResponse
                  .split('\n')
                  .filter(line => line.trim().match(/^\d+\./))
                  .map((line, idx) => (
                    <li key={idx}>{line.replace(/^\d+\.\s*/, '')}</li>
                  ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold">💡 Suggestions to Improve:</h3>
              <p>{aiResponse.includes('Suggestions to Improve:') ? 
                aiResponse.split('Suggestions to Improve:')[1].split('**Revised Prompt:**')[0].trim()
                : 'No suggestions provided.'}</p>
            </div>

            <div>
              <h3 className="font-semibold">📝 Improved Prompt:</h3>
              <pre className="bg-white p-3 rounded whitespace-pre-wrap">
                {aiResponse.split('**Revised Prompt:**')[1]?.trim() ?? 'N/A'}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
