import { AnalysisResult } from './types';

const SYSTEM_PROMPT = `You are an expert financial and business journalist AI. Your task is to analyze news articles and extract structured intelligence.

WARNING: You must STRICTLY base your entire analysis on the provided article text. DO NOT hallucinate generic trends or copy previous templates. Every single event, entity, and sentiment score must be a direct result of the specific, unique nuances in the provided article.

You MUST respond with ONLY a valid JSON object — no markdown, no backticks, no preamble, no explanation. Just raw JSON.

The JSON must match this exact schema:
{
  "headline": "string — a sharp, punchy rewrite of the article headline",
  "summary": "string — 2-3 sentence executive summary of the story",
  "arcType": "string — one of: Bullish Growth | Crisis Spiral | Cautious Recovery | Power Shift | Regulatory Storm | Turnaround Play | Stagnation",
  "avgSentiment": number — average sentiment from -1.0 (very negative) to +1.0 (very positive),
  "events": [
    {
      "date": "string — e.g. 'Jan 2024' or 'Q3 2023'",
      "title": "string — short title of this event (max 8 words)",
      "summary": "string — 1-2 sentence description of what happened",
      "sentiment": number — sentiment for THIS event, -1.0 to +1.0,
      "tag": "string — one of: bullish | bearish | neutral | critical | controversial"
    }
  ],
  "entities": [
    {
      "name": "string — full name of person, company, or institution",
      "type": "string — one of: person | company | regulator | institution",
      "role": "string — their role in this story (max 5 words)",
      "connections": [
        {
          "label": "string — relationship verb phrase (e.g. 'acquired', 'resigned from', 'filed suit against')",
          "target": "string — the target entity name"
        }
      ]
    }
  ],
  "altViewpoints": [
    "string — a contrarian or alternative perspective on this story",
    "string — another alternative viewpoint",
    "string — a third alternative perspective (e.g. what the bears / critics / skeptics say)"
  ],
  "futurePredictions": [
    {
      "implication": "string — concise prediction of what happens next based on the story (max 10 words)",
      "probability": "string — strictly one of: High, Medium, Low",
      "timeframe": "string — e.g. 1-3 months, Q4 2024, Immediate"
    }
  ],
  "mermaidDiagram": "string — a valid Mermaid graph LR diagram showing entity relationships. Use --> with labels. IMPORTANT: Do NOT use quotes inside node labels. Make sure it uses valid syntax. Example: graph LR\\n  A[CEO] -->|resigned from| B[Company Name Group]"
}

Rules:
- Extract 4-8 events minimum, ordered chronologically
- Extract 3-6 key entities
- Provide 3 contrarian viewpoints and exactly 3 future predictions
- Sentiment scores: +0.7 to +1.0 = very bullish, +0.3 to +0.7 = positive, -0.3 to +0.3 = neutral, -0.7 to -0.3 = negative, -1.0 to -0.7 = crisis
- The mermaidDiagram MUST be a single string with \\n for newlines, valid Mermaid syntax
- If the article lacks dates, infer approximate timeframes from context
- If only one article is provided (not a multi-year saga), events can be sub-events or aspects of the story`;

export async function analyzeWithAI(
  articleText: string,
  articleTitle: string,
  sourceUrl: string
): Promise<AnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set in environment variables. See .env.example');
  }

  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  const userMessage = `Analyze this news article and extract structured intelligence.

Article Title: ${articleTitle}
Source URL: ${sourceUrl}

Article Content:
${articleText}

Remember: Respond with ONLY the JSON object. No markdown, no explanation.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: SYSTEM_PROMPT }]
      },
      contents: [{
        parts: [{ text: userMessage }]
      }],
      generationConfig: {
        temperature: 0.3,
        responseMimeType: 'application/json',
      }
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${errText}`);
  }

  const data = await response.json();

  if (data.error) {
    console.error('Gemini Error:', data.error);
    throw new Error(`Gemini reported an error: ${data.error.message || JSON.stringify(data.error)}`);
  }

  const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawContent) {
    console.error('Gemini API Response:', JSON.stringify(data, null, 2));
    throw new Error(`No response from AI model. Response data: ${JSON.stringify(data)}`);
  }

  // Strip any accidental markdown fences
  const cleaned = rawContent
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  let parsed: Omit<AnalysisResult, 'scrapedAt' | 'sourceUrl'>;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    // Try to extract JSON from the response
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        parsed = JSON.parse(jsonMatch[0]);
      } catch (err) {
        console.error('Invalid JSON content inside match:', jsonMatch[0], '\\nError:', err);
        require('fs').writeFileSync('invalid_json.log', jsonMatch[0]);
        throw new Error('AI returned invalid JSON. Try again or use a different model.');
      }
    } else {
      console.error('No JSON match found in content:', cleaned);
      require('fs').writeFileSync('invalid_json.log', cleaned);
      throw new Error('AI response did not contain valid JSON.');
    }
  }

  return {
    ...parsed,
    scrapedAt: new Date().toISOString(),
    sourceUrl,
  };
}
