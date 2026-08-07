import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import UrlInputForm from '../components/UrlInputForm';
import ScanHistory from '../components/ScanHistory';
import LoadingSpinner from '../components/LoadingSpinner';
import { scanWebsite, getScanHistory } from '../services/api';

function Home() {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await getScanHistory();
      setHistory(data);
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  const handleScan = async (url) => {
    setIsScanning(true);
    setError('');
    try {
      const result = await scanWebsite(url);
      navigate(`/report/${result.id}`);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Scan failed. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Website Scanner</h1>
      <p className="text-center text-gray-500 mb-8">Analyze SEO, Performance & Security in one click</p>

      <UrlInputForm onScan={handleScan} isScanning={isScanning} />

      {error && <p className="text-red-500 text-center mt-4">{error}</p>}

      {isScanning && <LoadingSpinner message="Scanning website — this may take up to 30 seconds..." />}

      <div className="mt-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Scans</h2>
        <ScanHistory scans={history} />
      </div>
    </div>
  );
}

export default Home;