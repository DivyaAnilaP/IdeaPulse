// src/services/aiService.ts
import type { IdeaAnalysis } from '../types';

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
  candidates: Candidate[];
  usageMetadata: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
  modelVersion: string;
}

export async function analyzeIdea(ideaFormDataJson: string): Promise<IdeaAnalysis> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY; // Use Gemini API key

  if (!apiKey) {
    throw new Error("Gemini API key is not configured. Please check your .env file and ensure the development server is restarted.");
  }

  try {
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text: "You are a startup advisor that helps validate startup ideas. Your output should always be in the specified JSON format."
            }
          ]
        },
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Analyze this startup idea provided as a JSON string and provide detailed feedback. The startup idea is: ${ideaFormDataJson}`
              }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: ideaAnalysisSchema,
          temperature: 0.7
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.error?.message || 
        `Failed to analyze idea. Status: ${response.status}`
      );
    }

    const data: GeminiResponse = await response.json();
    const message = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!message) {
      throw new Error("No response content received from Gemini.");
    }

    try {
      const analysis = JSON.parse(message) as IdeaAnalysis;
      
      // Validate the analysis structure
      if (!isValidAnalysis(analysis)) {
        throw new Error("Invalid analysis structure received from Gemini.");
      }

      return analysis;
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", parseError);
      throw new Error("Failed to parse the analysis response. Please try again.");
    }
  } catch (error) {
    console.error("Error analyzing idea:", error);
    throw error instanceof Error ? error : new Error("An unexpected error occurred");
  }
}

// Define the schema as a constant
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

export async function getMockAnalysis(): Promise<IdeaAnalysis> {
  // Simulate a delay to mimic API response time
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
