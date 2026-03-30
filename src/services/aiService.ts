// src/services/aiService.ts
import type { IdeaAnalysis } from "../types";

/**
 * Improved aiService:
 * - Uses VITE_* env vars
 * - Tries Google v1, then v1beta
 * - Falls back to OpenAI if Google fails
 * - Keeps your schema & validation logic
 */

/* ---------- Types (kept/extended) ---------- */
interface Part {
  text: string;
}

interface Content {
  role: string;
  parts: Part[];
}

interface Candidate {
  content: Content;
  finishReason: string;
  safetyRatings: Array<{
    category: string;
    probability: string;
    blocked: boolean;
  }>;
}

interface GeminiResponse {
  candidates?: Candidate[];
  usageMetadata?: {
    promptTokenCount?: number;
    candidatesTokenCount?: number;
    totalTokenCount?: number;
  };
  modelVersion?: string;
}

/* ---------- Env vars (Vite) ---------- */
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const GOOGLE_MODEL_NAME = import.meta.env.VITE_GOOGLE_MODEL_NAME || "gemini-1.5-flash";
const GOOGLE_MODEL_ACTION = import.meta.env.VITE_GOOGLE_MODEL_VERSION || "generateContent"; // appended as :generateContent
const GOOGLE_API_URL_V1 = import.meta.env.VITE_GOOGLE_API_URL || "https://generativelanguage.googleapis.com/v1/models";
const GOOGLE_API_URL_V1BETA = import.meta.env.VITE_GOOGLE_API_URL_BETA || "https://generativelanguage.googleapis.com/v1beta/models";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_MODEL = "gpt-4o-mini";

/* ---------- JSON Schema (unchanged) ---------- */
const ideaAnalysisSchema = {
  type: "object",
  properties: {
    ideaSummary: { type: "string" },
    viabilityScore: { type: "number", minimum: 0, maximum: 100 },
    swotAnalysis: {
      type: "object",
      properties: {
        strengths: { type: "array", items: { type: "string" } },
        weaknesses: { type: "array", items: { type: "string" } },
        opportunities: { type: "array", items: { type: "string" } },
        threats: { type: "array", items: { type: "string" } }
      },
      required: ["strengths", "weaknesses", "opportunities", "threats"]
    },
    competitors: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" }
        },
        required: ["name", "description"]
      }
    },
    marketInsights: { type: "array", items: { type: "string" } },
    recommendations: { type: "array", items: { type: "string" } }
  },
  required: [
    "ideaSummary",
    "viabilityScore",
    "swotAnalysis",
    "competitors",
    "marketInsights",
    "recommendations"
  ]
};

/* ---------- Helper: validate structure ---------- */
function isValidAnalysis(analysis: any): analysis is IdeaAnalysis {
  return (
    typeof analysis === "object" &&
    typeof analysis.ideaSummary === "string" &&
    typeof analysis.viabilityScore === "number" &&
    analysis.viabilityScore >= 0 &&
    analysis.viabilityScore <= 100 &&
    typeof analysis.swotAnalysis === "object" &&
    Array.isArray(analysis.swotAnalysis.strengths) &&
    Array.isArray(analysis.swotAnalysis.weaknesses) &&
    Array.isArray(analysis.swotAnalysis.opportunities) &&
    Array.isArray(analysis.swotAnalysis.threats) &&
    Array.isArray(analysis.competitors) &&
    analysis.competitors.every((c: any) =>
      typeof c === "object" &&
      typeof c.name === "string" &&
      typeof c.description === "string"
    ) &&
    Array.isArray(analysis.marketInsights) &&
    Array.isArray(analysis.recommendations)
  );
}

/* ---------- Low-level Google call ---------- */
async function callGoogleGenerate(urlBase: string, modelName: string, bodyObj: any) {
  const modelPath = modelName.startsWith("models/") ? modelName : `models/${modelName}`;
  const url = `${urlBase}/${modelPath}:${GOOGLE_MODEL_ACTION}?key=${GOOGLE_API_KEY}`;

  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bodyObj),
  });

  let json;
  try {
    json = await resp.json();
  } catch (e) {
    throw new Error(`Google response parse error (status ${resp.status})`);
  }
  if (!resp.ok) {
    const msg = json?.error?.message || JSON.stringify(json);
    throw new Error(`Google API error: ${msg}`);
  }
  return json as GeminiResponse;
}

/* ---------- OpenAI fallback ---------- */
async function callOpenAIChat(prompt: string) {
  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [
        { role: "system", content: "You are IdeaPulse — an assistant that evaluates startup ideas and returns a JSON object matching the required schema." },
        { role: "user", content: prompt }
      ],
      max_tokens: 800,
      temperature: 0.2
    })
  });

  const json = await resp.json().catch(() => null);
  if (!resp.ok) {
    throw new Error(json?.error?.message || `OpenAI error, status ${resp.status}`);
  }
  return json;
}

/* ---------- Main exported function (analyzeIdea) ---------- */
export async function analyzeIdea(ideaFormDataJson: string): Promise<IdeaAnalysis> {
  // Build a clear prompt and a Google-style generation body that requests JSON
  const promptText = `Analyze this startup idea and return a JSON object matching the schema:
{"ideaSummary": "...", "viabilityScore": number, "swotAnalysis": {"strengths": [], "weaknesses": [], "opportunities": [], "threats": []}, "competitors": [{"name":"", "description":""}], "marketInsights": [], "recommendations": [] }
Idea JSON: ${ideaFormDataJson}
If some data is unknown, use "unknown". Keep answers concise.`;

  // Prepare Google body (v1/v1beta often accept a similar shape; we include system+contents)
  const googleRequestBody = {
    systemInstruction: {
      parts: [{ text: "You are a startup advisor that outputs valid JSON only, following the requested schema." }]
    },
    contents: [
      {
        role: "user",
        parts: [{ text: promptText }]
      }
    ],
    // request JSON output - some Google versions support responseMimeType
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: ideaAnalysisSchema,
      temperature: 0.2
    }
  };

  // Debug logs (remove for production)
  console.log("analyzeIdea: GOOGLE_API_KEY present?", !!GOOGLE_API_KEY);
  console.log("analyzeIdea: OPENAI_API_KEY present?", !!OPENAI_API_KEY);

  // Try Google v1 first, then v1beta; fallback to OpenAI if Google fails
  if (GOOGLE_API_KEY) {
    try {
      console.log("Trying Google v1 endpoint...");
      const googleResp = await callGoogleGenerate(GOOGLE_API_URL_V1, GOOGLE_MODEL_NAME, googleRequestBody);
      const message = googleResp?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!message) throw new Error("Google v1 returned no textual content.");

      try {
        const parsed = JSON.parse(message) as IdeaAnalysis;
        if (!isValidAnalysis(parsed)) throw new Error("Google v1 returned JSON but schema validation failed.");
        return parsed;
      } catch (parseErr) {
        // If parsing fails, surface helpful debug info and fall back
        console.warn("Google v1 parse/validation failed:", parseErr);
        // Proceed to try v1beta or OpenAI
      }
    } catch (err) {
      console.warn("Google v1 failed:", err);
      // try v1beta
      try {
        console.log("Trying Google v1beta endpoint...");
        const googleRespBeta = await callGoogleGenerate(GOOGLE_API_URL_V1BETA, GOOGLE_MODEL_NAME, googleRequestBody);
        const message = googleRespBeta?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!message) throw new Error("Google v1beta returned no textual content.");

        try {
          const parsed = JSON.parse(message) as IdeaAnalysis;
          if (!isValidAnalysis(parsed)) throw new Error("Google v1beta returned JSON but schema validation failed.");
          return parsed;
        } catch (parseErr) {
          console.warn("Google v1beta parse/validation failed:", parseErr);
          // will fall through to OpenAI fallback if available
        }
      } catch (err2) {
        console.warn("Google v1beta also failed:", err2);
        // fallback to OpenAI
      }
    }
  }

  // OpenAI fallback
  if (OPENAI_API_KEY) {
    try {
      console.log("Falling back to OpenAI...");
      const openaiResp = await callOpenAIChat(promptText);
      const text = openaiResp?.choices?.[0]?.message?.content || openaiResp?.choices?.[0]?.text;
      if (!text) throw new Error("OpenAI returned no content.");

      // Remove code fences if present
      const cleaned = (text as string).replace(/^```json\s*/i, "").replace(/```$/i, "").trim();

      try {
        const parsed = JSON.parse(cleaned) as IdeaAnalysis;
        if (!isValidAnalysis(parsed)) throw new Error("OpenAI returned JSON but schema validation failed.");
        return parsed;
      } catch (parseErr) {
        console.warn("OpenAI parse/validation failed:", parseErr);
        throw new Error("Failed to parse analysis from OpenAI. Check prompt/schema and API responses in console.");
      }
    } catch (openErr) {
      console.error("OpenAI fallback failed:", openErr);
      throw openErr instanceof Error ? openErr : new Error("OpenAI fallback failed.");
    }
  }

  // If we reach here, no API keys available or all attempts failed
  throw new Error("No working AI provider available. Ensure VITE_GOOGLE_API_KEY or VITE_OPENAI_API_KEY is set in your .env and restart the dev server.");
}

/* ---------- Mock helper (unchanged) ---------- */
export async function getMockAnalysis(): Promise<IdeaAnalysis> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    ideaSummary: "This is a mock analysis of your startup idea. It includes strengths, weaknesses, opportunities, and threats.",
    viabilityScore: 75,
    swotAnalysis: {
      strengths: ["Mock strength 1", "Mock strength 2"],
      weaknesses: ["Mock weakness 1", "Mock weakness 2"],
      opportunities: ["Mock opportunity 1", "Mock opportunity 2"],
      threats: ["Mock threat 1", "Mock threat 2"]
    },
    competitors: [
      {
        name: "Mock Competitor 1",
        description: "Description of mock competitor 1"
      }
    ],
    marketInsights: ["Mock market insight 1", "Mock market insight 2"],
    recommendations: ["Mock recommendation 1", "Mock recommendation 2"]
  };
}
