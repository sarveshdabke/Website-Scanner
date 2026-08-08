import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import UrlInputForm from '../components/UrlInputForm';
import ScanHistory from '../components/ScanHistory';
import ProcessFlow from '../components/ProcessFlow';
import { getScanHistory, getScanStreamUrl } from '../services/api';

function Home() {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [stageStatus, setStageStatus] = useState({});
  const navigate = useNavigate();
  const eventSourceRef = useRef(null);

  useEffect(() => {
    loadHistory();
    return () => {
      if (eventSourceRef.current) eventSourceRef.current.close();
    };
  }, []);

  const loadHistory = async () => {
    try {
      const data = await getScanHistory();
      setHistory(data);
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  const handleScan = (url) => {
    setIsScanning(true);
    setError('');
    setStageStatus({});

    const streamUrl = getScanStreamUrl(url);
    const es = new EventSource(streamUrl);
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      const payload = JSON.parse(event.data);

      if (payload.stage === 'done') {
        es.close();
        setIsScanning(false);
        navigate(`/report/${payload.data.id}`);
        return;
      }

      if (payload.stage === 'error') {
        es.close();
        setIsScanning(false);
        setError(payload.data?.message || 'Scan failed');
        return;
      }

      setStageStatus((prev) => ({ ...prev, [payload.stage]: payload.status }));
    };

    es.onerror = () => {
      es.close();
      setIsScanning(false);
      setError('Connection lost during scan. Please try again.');
    };
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,255,156,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }}
      />

      <div className="relative max-w-4xl mx-auto px-4 pt-20 pb-6 text-center">
        <div className="inline-block px-3 py-1 bg-[#00FF9C]/5 border border-[#00FF9C]/30 rounded-full text-xs font-medium text-[#00FF9C] tracking-wide mb-4" style={{ letterSpacing: '0.05em' }}>
          SEO · PERFORMANCE · SECURITY
        </div>
        <h1 className="text-4xl font-bold text-[#E8EDF2] mb-3 tracking-tight font-heading">
          Website <span className="text-[#00FF9C]">Scanner</span>
        </h1>
        <p className="text-[#8892A0] mb-10">Analyze any website's SEO, performance and security in seconds.</p>

        <UrlInputForm onScan={handleScan} isScanning={isScanning} />

        {error && <p className="text-[#EF4444] text-center mt-4 text-sm">{error}</p>}
      </div>

      {isScanning && (
        <div className="max-w-4xl mx-auto px-4 relative">
          <ProcessFlow stageStatus={stageStatus} />
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 pb-20 pt-8 relative">
        <h2 className="text-lg font-semibold text-[#E8EDF2] mb-4 font-heading">Recent Scans</h2>
        <ScanHistory scans={history} />
      </div>
    </div>
  );
}

export default Home;