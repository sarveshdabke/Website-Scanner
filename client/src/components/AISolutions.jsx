import { useState } from 'react';
import { getAIAnalysis } from '../services/api';

const PRIORITY_STYLES = {
  high: { bg: 'bg-[#EF4444]/15', text: 'text-[#EF4444]', border: 'border-[#EF4444]', label: '🔴 High Priority' },
  medium: { bg: 'bg-[#F59E0B]/15', text: 'text-[#F59E0B]', border: 'border-[#F59E0B]', label: '🟡 Medium Priority' },
  low: { bg: 'bg-[#3B82F6]/15', text: 'text-[#3B82F6]', border: 'border-[#3B82F6]', label: '🔵 Low Priority' },
};

function AISolutions({ scanId }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleGetSolutions = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAIAnalysis(scanId);
      setResult(data);
    } catch (err) {
      setError('Could not generate AI solutions. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-xl p-[1px] bg-gradient-to-r from-[#00FF9C] via-[#00D9FF] to-[#00FF9C] animate-gradient">
      <div className="bg-[#131820] rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">✨</span>
            <h2 className="text-lg font-semibold text-[#E8EDF2] font-heading">AI Recommendations</h2>
          </div>
          {!result && (
            <button
              onClick={handleGetSolutions}
              disabled={loading}
              className="px-4 py-2 bg-[#00FF9C] text-[#0A0E14] text-sm font-semibold rounded-lg hover:shadow-[0_0_20px_rgba(0,255,156,0.4)] disabled:bg-[#1E2530] disabled:text-[#4A5261] transition-all"
            >
              {loading ? 'Analyzing...' : 'Get AI Solutions'}
            </button>
          )}
        </div>

        {error && <p className="text-[#EF4444] text-sm">{error}</p>}

        {loading && (
          <div className="flex items-center gap-2 text-[#8892A0] text-sm py-4 font-mono-score">
            <div className="w-4 h-4 border-2 border-[#1E2530] border-t-[#00FF9C] rounded-full animate-spin"></div>
            AI is analyzing your report...
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <p className="text-sm text-[#E8EDF2] bg-[#0D1117] p-3 rounded-lg border border-[#1E2530]">
              {result.assessment}
            </p>

            <div className="space-y-3">
              {result.fixes?.map((fix, i) => {
                const style = PRIORITY_STYLES[fix.priority] || PRIORITY_STYLES.low;
                return (
                  <div key={i} className={`bg-[#0D1117] border-l-4 ${style.border} border-t border-r border-b border-t-[#1E2530] border-r-[#1E2530] border-b-[#1E2530] rounded-lg p-4`}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-sm text-[#E8EDF2]">{fix.title}</p>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                        {style.label}
                      </span>
                    </div>
                    <p className="text-sm text-[#8892A0] leading-relaxed font-mono-score">{fix.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default AISolutions;