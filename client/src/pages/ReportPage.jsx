import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Search, Zap, Shield } from 'lucide-react';
import ScoreCard from '../components/ScoreCard';
import ScoreChart from '../components/ScoreChart';
import SeoReport from '../components/SeoReport';
import PerformanceReport from '../components/PerformanceReport';
import SecurityReport from '../components/SecurityReport';
import AISolutions from '../components/AISolutions';
import LoadingSpinner from '../components/LoadingSpinner';
import { getScanById } from '../services/api';
import { generatePDFReport } from '../utils/generatePDF';
import { getScoreStatus } from '../utils/scoreUtils';

const NAV_SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'seo', label: 'SEO' },
  { id: 'performance', label: 'Performance' },
  { id: 'security', label: 'Security' },
  { id: 'ai', label: 'AI Insights' },
];

function ScoreGauge({ score }) {
  const status = getScoreStatus(score);
  const radius = 85;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-56 h-56 mx-auto">
      <div
        className="absolute inset-0 rounded-full animate-pulse-glow"
        style={{ background: `radial-gradient(circle, ${status.hex}22 0%, transparent 70%)`, filter: 'blur(20px)' }}
      />
      <svg className="w-56 h-56 -rotate-90 relative">
        <circle cx="112" cy="112" r={radius} stroke="#1E2530" strokeWidth="14" fill="none" />
        <circle
          cx="112"
          cy="112"
          r={radius}
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
          stroke={status.hex}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.2s ease-out', filter: `drop-shadow(0 0 8px ${status.hex}88)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-5xl font-bold text-[#E8EDF2] font-mono-score">{score}</p>
        <p className="text-xs text-[#4A5261] font-mono-score">/ 100</p>
        <p className={`text-xs font-medium mt-1 ${status.text}`}>{status.label}</p>
      </div>
    </div>
  );
}

function ReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const sectionRefs = useRef({});

  useEffect(() => {
    loadScan();
  }, [id]);

  const loadScan = async () => {
    setLoading(true);
    try {
      const data = await getScanById(id);
      const parsed = {
        url: data.url,
        createdAt: data.created_at,
        overallScore: data.overall_score,
        seo: JSON.parse(data.seo_data),
        performance: JSON.parse(data.performance_data),
        security: JSON.parse(data.security_data),
      };
      setScan(parsed);
    } catch (err) {
      setError('Could not load report');
    } finally {
      setLoading(false);
    }
  };

  const scrollTo = (sectionId) => {
    sectionRefs.current[sectionId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) return <LoadingSpinner message="Loading report..." />;
  if (error) return <p className="text-center text-[#EF4444] py-12">{error}</p>;
  if (!scan) return null;

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-10 bg-[#0A0E14]/90 backdrop-blur border-b border-[#1E2530]">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between h-14">
          <button onClick={() => navigate('/')} className="text-sm text-[#8892A0] hover:text-[#00FF9C] transition-colors">
            ← Back
          </button>
          <div className="hidden sm:flex items-center gap-1">
            {NAV_SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className="px-3 py-1.5 text-sm text-[#8892A0] hover:text-[#00FF9C] rounded-lg transition-colors"
              >
                {s.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => generatePDFReport(scan)}
            className="px-4 py-1.5 border border-[#00FF9C]/40 text-[#00FF9C] text-sm font-medium rounded-lg hover:bg-[#00FF9C] hover:text-[#0A0E14] transition-colors"
          >
            Download PDF
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div ref={(el) => (sectionRefs.current.overview = el)}>
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-[#E8EDF2] font-heading">{scan.url}</h1>
            <p className="text-sm text-[#4A5261] font-mono-score">Scanned {new Date(scan.createdAt).toLocaleString()}</p>
          </div>

          <div className="bg-[#131820] rounded-xl border border-[#1E2530] p-8 flex flex-col items-center">
            <ScoreGauge score={scan.overallScore} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <ScoreCard title="SEO" score={scan.seo.score || 0} icon={Search} />
            <ScoreCard title="Performance" score={scan.performance.score || 0} icon={Zap} />
            <ScoreCard title="Security" score={scan.security.score || 0} icon={Shield} />
          </div>

          <div className="mt-4">
            <ScoreChart
              seoScore={scan.seo.score || 0}
              performanceScore={scan.performance.score || 0}
              securityScore={scan.security.score || 0}
              overallScore={scan.overallScore}
            />
          </div>
        </div>

        <section ref={(el) => (sectionRefs.current.seo = el)} className="bg-[#131820] p-5 rounded-xl border border-[#1E2530] scroll-mt-20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#E8EDF2] font-heading">SEO Analysis</h2>
            <span className="text-sm font-semibold text-[#8892A0] font-mono-score">{scan.seo.score || 0}/100</span>
          </div>
          <SeoReport data={scan.seo} />
        </section>

        <section ref={(el) => (sectionRefs.current.performance = el)} className="bg-[#131820] p-5 rounded-xl border border-[#1E2530] scroll-mt-20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#E8EDF2] font-heading">Performance</h2>
            <span className="text-sm font-semibold text-[#8892A0] font-mono-score">{scan.performance.score || 0}/100</span>
          </div>
          <PerformanceReport data={scan.performance} />
        </section>

        <section ref={(el) => (sectionRefs.current.security = el)} className="bg-[#131820] p-5 rounded-xl border border-[#1E2530] scroll-mt-20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#E8EDF2] font-heading">Security Overview</h2>
            <span className="text-sm font-semibold text-[#8892A0] font-mono-score">{scan.security.score || 0}/100</span>
          </div>
          <SecurityReport data={scan.security} />
        </section>

        <div ref={(el) => (sectionRefs.current.ai = el)} className="scroll-mt-20">
          <AISolutions scanId={id} />
        </div>
      </div>
    </div>
  );
}

export default ReportPage;