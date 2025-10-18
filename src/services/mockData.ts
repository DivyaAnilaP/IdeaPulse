import type { IdeaAnalysis } from '../types';

export const mockAnalysis: IdeaAnalysis = {
  ideaSummary: "A comprehensive AI-powered platform that helps small businesses automate their social media marketing and content creation, with a focus on personalized engagement and analytics.",
  viabilityScore: 85,
  swotAnalysis: {
    strengths: [
      "AI-powered automation reduces manual work",
      "Scalable business model with subscription-based revenue",
      "Growing market demand for social media automation",
      "Strong technical team with AI expertise"
    ],
    weaknesses: [
      "High initial development costs",
      "Dependency on social media platform APIs",
      "Need for continuous AI model training",
      "Limited brand recognition in early stages"
    ],
    opportunities: [
      "Expanding market for social media marketing tools",
      "Potential for enterprise-level features",
      "Integration with emerging social platforms",
      "Growing demand for AI-powered business solutions"
    ],
    threats: [
      "Established competitors with larger market share",
      "Rapid changes in social media algorithms",
      "Potential regulatory changes in AI usage",
      "Increasing competition in the automation space"
    ]
  },
  competitors: [
    {
      name: "Buffer",
      description: "Established social media management platform with strong brand recognition and comprehensive features."
    },
    {
      name: "Hootsuite",
      description: "Enterprise-focused social media management tool with advanced analytics and team collaboration features."
    },
    {
      name: "Later",
      description: "Visual-first social media scheduler with strong focus on Instagram marketing."
    }
  ],
  marketInsights: [
    "Social media marketing automation market expected to grow at 15% CAGR",
    "Small businesses increasingly adopting AI tools for marketing",
    "Growing demand for personalized social media content",
    "Shift towards data-driven marketing decisions",
    "Increasing importance of social media presence for business success"
  ],
  recommendations: [
    "Focus on AI-powered personalization as a key differentiator",
    "Develop a freemium model to attract small businesses",
    "Build strong integration capabilities with major social platforms",
    "Invest in user education and support resources",
    "Consider strategic partnerships with marketing agencies",
    "Implement robust analytics and reporting features"
  ]
}; 