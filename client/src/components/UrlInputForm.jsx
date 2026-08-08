import { useState } from 'react';

function UrlInputForm({ onScan, isScanning }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    try {
      new URL(formattedUrl);
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    onScan(formattedUrl);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex items-center bg-[#131820] rounded-xl border border-[#1E2530] focus-within:border-[#00FF9C] focus-within:shadow-[0_0_0_3px_rgba(0,255,156,0.15)] transition-all p-1.5 gap-2">
        <span className="pl-3 text-[#4A5261] text-sm select-none">🔗</span>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter a website URL, e.g. example.com"
          disabled={isScanning}
          className="flex-1 px-1 py-2.5 bg-transparent outline-none text-[#E8EDF2] font-mono-score text-sm placeholder:text-[#4A5261] placeholder:font-sans disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={isScanning}
          className="px-5 py-2.5 bg-[#00FF9C] text-[#0A0E14] text-sm font-semibold rounded-lg hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(0,255,156,0.4)] disabled:bg-[#1E2530] disabled:text-[#4A5261] disabled:scale-100 transition-all flex items-center gap-2 shrink-0"
        >
          {isScanning ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-[#0A0E14]/30 border-t-[#0A0E14] rounded-full animate-spin" />
              Scanning
            </>
          ) : (
            <>Scan →</>
          )}
        </button>
      </div>
      {error && <p className="text-[#EF4444] text-sm mt-2 text-center">{error}</p>}
    </form>
  );
}

export default UrlInputForm;