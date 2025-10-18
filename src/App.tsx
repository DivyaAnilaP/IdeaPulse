import { useState, useEffect } from 'react'
import { Toaster } from './components/ui/toaster'
import IdeaForm from './components/IdeaForm'
import AnalysisResult from './components/AnalysisResult'
import type { IdeaAnalysis } from './types'

function App() {
  const [analysis, setAnalysis] = useState<IdeaAnalysis | null>(null)

  useEffect(() => {
    console.log("OpenAI API Key from .env:", import.meta.env.VITE_OPENAI_API_KEY);
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      console.warn("VITE_OPENAI_API_KEY is not set. Please check your .env file and ensure the development server is restarted.");
    }
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 font-sans">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Morphing blobs - adjusted for better mobile visibility */}
        <div className="absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-48 h-48 sm:w-96 sm:h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-morph"></div>
        <div className="absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 w-48 h-48 sm:w-96 sm:h-96 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-morph animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-96 sm:h-96 bg-indigo-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-morph animation-delay-4000"></div>
        
        {/* Animated grid - adjusted for mobile */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:16px_16px] sm:bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      </div>

      {/* Header Section */}
      <header className="relative w-full">
        {/* Glassmorphism header background */}
        <div className="absolute inset-0 bg-white/40 backdrop-blur-md border-b border-white/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5"></div>
        
        {/* Animated border gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent animate-shimmer"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center space-y-4 sm:space-y-6 py-6 sm:py-8 md:py-12">
            {/* Logo and Title Container */}
            <div className="flex flex-col md:flex-row items-center gap-3 sm:gap-4 md:gap-6">
              {/* Enhanced Animated logo/icon */}
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 group">
                {/* Outer glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-300 animate-pulse-slow"></div>
                
                {/* Main logo container */}
                <div className="relative h-full w-full">
                  {/* Rotating background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl rotate-45 animate-pulse-slow group-hover:animate-glow transition-all duration-300"></div>
                  
                  {/* Inner container with glass effect */}
                  <div className="absolute inset-2 bg-white/90 backdrop-blur-sm rounded-xl rotate-45 transition-transform duration-300 group-hover:scale-95"></div>
                  
                  {/* Logo text with enhanced styling */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <span className="text-lg sm:text-xl md:text-2xl font-display font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient group-hover:scale-110 transition-transform duration-300">
                        SV
                      </span>
                      {/* Decorative dot */}
                      <div className="absolute -top-1 -right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full animate-ping"></div>
                    </div>
                  </div>
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10"></div>
              </div>

              {/* Title and Description */}
              <div className="flex flex-col items-center md:items-start">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
                  Startup Idea Validator
                </h1>
                <p className="mt-2 text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl">
                  Transform your idea into a validated business opportunity
                </p>
              </div>
            </div>

            {/* Decorative Elements - Hidden on mobile for better performance */}
            <div className="absolute -top-6 -left-6 w-8 h-8 sm:w-12 sm:h-12 border-2 border-blue-500/20 rounded-lg rotate-45 animate-float backdrop-blur-sm hidden md:block"></div>
            <div className="absolute -bottom-6 -right-6 w-8 h-8 sm:w-12 sm:h-12 border-2 border-purple-500/20 rounded-lg rotate-45 animate-float animation-delay-1000 backdrop-blur-sm hidden md:block"></div>
            <div className="absolute top-1/2 -right-10 w-6 h-6 sm:w-8 sm:h-8 border-2 border-indigo-500/20 rounded-full animate-float animation-delay-2000 backdrop-blur-sm hidden md:block"></div>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto py-4 sm:py-6 md:py-8 px-4 sm:px-6 lg:px-8">
        <div className="px-2 sm:px-4 py-4 sm:py-6">
          <div className="bg-white/60 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-glass border border-white/20 p-4 sm:p-6 md:p-8 transform transition-all duration-500 hover:shadow-glass-hover hover:scale-[1.01]">
            {!analysis ? (
              <IdeaForm onSubmit={setAnalysis} />
            ) : (
              <AnalysisResult analysis={analysis} onReset={() => setAnalysis(null)} />
            )}
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  )
}

export default App
