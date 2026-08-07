import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import ScoreCard from '../components/ScoreCard';
import SeoReport from '../components/SeoReport';
import PerformanceReport from '../components/PerformanceReport';
import SecurityReport from '../components/SecurityReport';
import LoadingSpinner from '../components/LoadingSpinner';
import { getScanById } from '../services/api';
import { generatePDFReport } from '../utils/generatePDF';

function ReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadScan();
  }, [id]);

  const loadScan = async () => {
    setLoading(true);
    try {
      const data = await getScanById(id);
      // Database se aaya data JSON strings mein hai, parse karo
      const parsed = {
        url: data.url,
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

  if (loading) return <LoadingSpinner message="Loading report..." />;
  if (error) return <p className="text-center text-red-500 py-12">{error}</p>;
  if (!scan) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => navigate('/')} className="text-blue-600 hover:underline mb-4">
        ← Back to Home
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{scan.url}</h1>
        </div>
        <button
          onClick={() => generatePDFReport(scan)}
          className="mt-3 sm:mt-0 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
        >
          Download PDF
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <ScoreCard title="Overall" score={scan.overallScore} />
        <ScoreCard title="SEO" score={scan.seo.score || 0} />
        <ScoreCard title="Performance" score={scan.performance.score || 0} />
        <ScoreCard title="Security" score={scan.security.score || 0} />
      </div>

      <div className="space-y-6">
        <section className="bg-white p-5 rounded-xl border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">SEO Report</h2>
          <SeoReport data={scan.seo} />
        </section>

        <section className="bg-white p-5 rounded-xl border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Performance Report</h2>
          <PerformanceReport data={scan.performance} />
        </section>

        <section className="bg-white p-5 rounded-xl border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Security Report</h2>
          <SecurityReport data={scan.security} />
        </section>
      </div>
    </div>
  );
}

export default ReportPage;