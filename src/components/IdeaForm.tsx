import { useState } from 'react';
import type { IdeaFormData, IdeaAnalysis } from '../types';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { useToast } from './ui/use-toast';
import { analyzeIdea } from '../services/aiService';

interface IdeaFormProps {
  onSubmit: (analysis: IdeaAnalysis) => void;
}

interface FormErrors {
  idea?: string;
  targetMarket?: string;
  uniqueValueProposition?: string;
  businessModel?: string;
}

export default function IdeaForm({ onSubmit }: IdeaFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState<IdeaFormData>({
    idea: '',
    targetMarket: '',
    uniqueValueProposition: '',
    businessModel: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.idea.trim()) {
      newErrors.idea = 'Please describe your startup idea';
      isValid = false;
    } else if (formData.idea.length < 20) {
      newErrors.idea = 'Please provide a more detailed description of your idea';
      isValid = false;
    }

    if (!formData.targetMarket.trim()) {
      newErrors.targetMarket = 'Please specify your target market';
      isValid = false;
    }

    if (!formData.uniqueValueProposition.trim()) {
      newErrors.uniqueValueProposition = 'Please explain your unique value proposition';
      isValid = false;
    }

    if (!formData.businessModel.trim()) {
      newErrors.businessModel = 'Please describe your business model';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields correctly before submitting.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const analysis = await analyzeIdea(JSON.stringify(formData));
      onSubmit(analysis);
      toast({
        title: "Analysis Complete",
        description: "Your startup idea has been analyzed successfully.",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze your idea. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof IdeaFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        <div className="animate-slide-up group" style={{ animationDelay: '100ms' }}>
          <label htmlFor="idea" className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-blue-600 transition-colors duration-200">
            Startup Idea
          </label>
          <Textarea
            id="idea"
            value={formData.idea}
            onChange={(e) => handleInputChange('idea', e.target.value)}
            placeholder="Describe your startup idea in detail..."
            className={`min-h-[120px] bg-white/50 backdrop-blur-sm border-gray-200 
              focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
              hover:border-blue-300 hover:shadow-sm
              focus:shadow-lg focus:shadow-blue-500/10
              transition-all duration-200 hover:bg-white/70 
              ${errors.idea ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
          />
          {errors.idea && (
            <p className="mt-1 text-sm text-red-600 animate-shake">{errors.idea}</p>
          )}
        </div>

        <div className="animate-slide-up group" style={{ animationDelay: '200ms' }}>
          <label htmlFor="targetMarket" className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-blue-600 transition-colors duration-200">
            Target Market
          </label>
          <Textarea
            id="targetMarket"
            value={formData.targetMarket}
            onChange={(e) => handleInputChange('targetMarket', e.target.value)}
            placeholder="Who is your target market? Describe your ideal customers..."
            className={`min-h-[120px] bg-white/50 backdrop-blur-sm border-gray-200 
              focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
              hover:border-blue-300 hover:shadow-sm
              focus:shadow-lg focus:shadow-blue-500/10
              transition-all duration-200 hover:bg-white/70 
              ${errors.targetMarket ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
          />
          {errors.targetMarket && (
            <p className="mt-1 text-sm text-red-600 animate-shake">{errors.targetMarket}</p>
          )}
        </div>

        <div className="animate-slide-up group" style={{ animationDelay: '300ms' }}>
          <label htmlFor="uniqueValueProposition" className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-blue-600 transition-colors duration-200">
            Unique Value Proposition
          </label>
          <Textarea
            id="uniqueValueProposition"
            value={formData.uniqueValueProposition}
            onChange={(e) => handleInputChange('uniqueValueProposition', e.target.value)}
            placeholder="What makes your solution unique? How does it solve the problem better than existing solutions?"
            className={`min-h-[120px] bg-white/50 backdrop-blur-sm border-gray-200 
              focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
              hover:border-blue-300 hover:shadow-sm
              focus:shadow-lg focus:shadow-blue-500/10
              transition-all duration-200 hover:bg-white/70 
              ${errors.uniqueValueProposition ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
          />
          {errors.uniqueValueProposition && (
            <p className="mt-1 text-sm text-red-600 animate-shake">{errors.uniqueValueProposition}</p>
          )}
        </div>

        <div className="animate-slide-up group" style={{ animationDelay: '400ms' }}>
          <label htmlFor="businessModel" className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-blue-600 transition-colors duration-200">
            Business Model
          </label>
          <Textarea
            id="businessModel"
            value={formData.businessModel}
            onChange={(e) => handleInputChange('businessModel', e.target.value)}
            placeholder="How will you make money? Describe your revenue streams, pricing strategy, and cost structure..."
            className={`min-h-[120px] bg-white/50 backdrop-blur-sm border-gray-200 
              focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
              hover:border-blue-300 hover:shadow-sm
              focus:shadow-lg focus:shadow-blue-500/10
              transition-all duration-200 hover:bg-white/70 
              ${errors.businessModel ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
          />
          {errors.businessModel && (
            <p className="mt-1 text-sm text-red-600 animate-shake">{errors.businessModel}</p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="relative overflow-hidden group animate-slide-up w-full sm:w-auto"
        style={{ animationDelay: '500ms' }}
      >
        <span className="relative z-10 flex items-center justify-center space-x-2">
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <span>Analyze Idea</span>
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          )}
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
      </Button>
    </form>
  );
} 