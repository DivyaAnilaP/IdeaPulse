import { useState } from 'react'
import { Button } from './ui/button'
import { usePDF } from 'react-to-pdf'
import type { IdeaAnalysis } from '../types'
import { useToast } from './ui/use-toast'

interface AnalysisResultProps {
  analysis: IdeaAnalysis
  onReset: () => void
}

export default function AnalysisResult({ analysis, onReset }: AnalysisResultProps) {
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()
  const { toPDF, targetRef } = usePDF({
    filename: 'startup-analysis.pdf',
    page: {
      margin: 20,
      format: 'a4',
      orientation: 'portrait'
    },
    method: 'save'
  })

  const handleExport = async () => {
    try {
      setIsExporting(true)
      await new Promise(resolve => setTimeout(resolve, 100))
      await toPDF()
      toast({
        title: "Export Successful",
        description: "Your analysis has been exported as PDF.",
      })
    } catch (error) {
      console.error('PDF export failed:', error)
      toast({
        title: "Export Failed",
        description: "Failed to export the analysis. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="bg-white">
      {/* Buttons container - outside of PDF content */}
      <div className="flex justify-end mb-4 print:hidden">
        <div className="flex space-x-4">
          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {isExporting ? 'Exporting...' : 'Export as PDF'}
          </Button>
          <Button
            onClick={onReset}
            className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50"
          >
            New Analysis
          </Button>
        </div>
      </div>

      {/* PDF content */}
      <div ref={targetRef} className="p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">Analysis Results</h2>
        </div>

        <div className="space-y-6">
          {/* Idea Summary */}
          <section className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Idea Summary</h3>
            <p className="text-gray-700">{analysis.ideaSummary}</p>
          </section>

          {/* Viability Score */}
          <section className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Viability Score</h3>
            <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-blue-600 rounded-full"
                style={{ width: `${analysis.viabilityScore}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-gray-700">Score: {analysis.viabilityScore}/100</p>
          </section>

          {/* SWOT Analysis */}
          <section className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">SWOT Analysis</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-blue-600 mb-3">Strengths</h4>
                <ul className="space-y-2">
                  {analysis.swotAnalysis.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-blue-600">•</span>
                      <span className="text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-red-600 mb-3">Weaknesses</h4>
                <ul className="space-y-2">
                  {analysis.swotAnalysis.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-red-600">•</span>
                      <span className="text-gray-700">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-green-600 mb-3">Opportunities</h4>
                <ul className="space-y-2">
                  {analysis.swotAnalysis.opportunities.map((opportunity, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-green-600">•</span>
                      <span className="text-gray-700">{opportunity}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-yellow-600 mb-3">Threats</h4>
                <ul className="space-y-2">
                  {analysis.swotAnalysis.threats.map((threat, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-yellow-600">•</span>
                      <span className="text-gray-700">{threat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Competitors */}
          <section className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Competitors</h3>
            <div className="space-y-4">
              {analysis.competitors.map((competitor, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900">{competitor.name}</h4>
                  <p className="text-gray-700 mt-1">{competitor.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Market Insights */}
          <section className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Market Insights</h3>
            <ul className="space-y-3">
              {analysis.marketInsights.map((insight, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-indigo-600">•</span>
                  <span className="text-gray-700">{insight}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Recommendations */}
          <section className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Recommendations</h3>
            <ul className="space-y-3">
              {analysis.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-purple-600">•</span>
                  <span className="text-gray-700">{recommendation}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>

  )
  
} 