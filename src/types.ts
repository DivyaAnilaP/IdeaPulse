export interface IdeaAnalysis {
  ideaSummary: string;
  viabilityScore: number;
  swotAnalysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  competitors: Array<{
    name: string;
    description: string;
  }>;
  marketInsights: string[];
  recommendations: string[];
}

export interface IdeaFormData {
  idea: string;
  targetMarket: string;
  uniqueValueProposition: string;
  businessModel: string;
} 