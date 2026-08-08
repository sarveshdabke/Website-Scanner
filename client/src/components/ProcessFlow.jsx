const STAGES = [
  { key: 'received', label: 'URL Received' },
  { key: 'seo', label: 'SEO Scan' },
  { key: 'performance', label: 'Performance Scan' },
  { key: 'security', label: 'Security Scan' },
  { key: 'aggregating', label: 'Generating Report' },
];

function getNodeStyle(status) {
  if (status === 'complete') return 'bg-[#00FF9C] border-[#00FF9C] text-[#0A0E14]';
  if (status === 'running') return 'bg-[#00FF9C]/20 border-[#00FF9C] text-[#00FF9C] animate-pulse-glow';
  if (status === 'failed') return 'bg-[#EF4444] border-[#EF4444] text-white';
  return 'bg-[#131820] border-[#1E2530] text-[#4A5261]';
}

function getLineStyle(status) {
  if (status === 'complete') return 'bg-[#00FF9C]';
  return 'bg-[#1E2530]';
}

function ProcessFlow({ stageStatus }) {
  return (
    <div className="w-full max-w-3xl mx-auto py-8 bg-[#131820] rounded-xl border border-[#1E2530] px-6 mt-6">
      <div className="flex items-center justify-between">
        {STAGES.map((stage, index) => {
          const status = stageStatus[stage.key] || 'pending';
          return (
            <div key={stage.key} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full border-2 flex items-center justify-center font-mono-score font-semibold text-xs transition-all duration-300 ${getNodeStyle(status)}`}
                >
                  {status === 'complete' ? '✓' : index + 1}
                </div>
                <p className="text-[11px] mt-2 text-center text-[#8892A0] w-20">{stage.label}</p>
              </div>

              {index < STAGES.length - 1 && (
                <div className={`h-0.5 flex-1 mx-1 rounded transition-all duration-300 ${getLineStyle(status)}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProcessFlow;