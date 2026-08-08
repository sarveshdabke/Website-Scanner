function metricStatus(key, rawValue) {
  const num = parseFloat(rawValue);
  if (isNaN(num)) return { label: '—', color: 'text-[#4A5261]', bg: 'bg-[#1E2530]' };

  const thresholds = {
    firstContentfulPaint: [1.8, 3],
    largestContentfulPaint: [2.5, 4],
    speedIndex: [3.4, 5.8],
    totalBlockingTime: [200, 600],
    cumulativeLayoutShift: [0.1, 0.25],
  };

  const [good, poor] = thresholds[key] || [0, 0];
  if (num <= good) return { label: '✓ Good', color: 'text-[#22C55E]', bg: 'bg-[#22C55E]/15' };
  if (num <= poor) return { label: '⚠ Needs work', color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/15' };
  return { label: '● Poor', color: 'text-[#EF4444]', bg: 'bg-[#EF4444]/15' };
}

function PerformanceReport({ data }) {
  if (data.error) {
    return <p className="text-[#EF4444] text-sm">Error: {data.error}</p>;
  }

  const metrics = [
    { key: 'firstContentfulPaint', label: 'First Contentful Paint', value: data.metrics?.firstContentfulPaint },
    { key: 'largestContentfulPaint', label: 'Largest Contentful Paint', value: data.metrics?.largestContentfulPaint },
    { key: 'totalBlockingTime', label: 'Total Blocking Time', value: data.metrics?.totalBlockingTime },
    { key: 'cumulativeLayoutShift', label: 'Cumulative Layout Shift', value: data.metrics?.cumulativeLayoutShift },
    { key: 'speedIndex', label: 'Speed Index', value: data.metrics?.speedIndex },
  ];

  const subScores = [
    { label: 'Performance', value: data.performanceScore },
    { label: 'Accessibility', value: data.accessibilityScore },
    { label: 'Best Practices', value: data.bestPracticesScore },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        {subScores.map((s) => (
          <div key={s.label} className="bg-[#0D1117] rounded-xl p-3 text-center border border-[#1E2530]">
            <p className="text-xl font-bold text-[#E8EDF2] font-mono-score">{s.value}</p>
            <p className="text-xs text-[#8892A0] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div>
        <p className="text-sm font-semibold text-[#E8EDF2] mb-2">Core Web Vitals</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {metrics.map((m) => {
            const status = metricStatus(m.key, m.value);
            return (
              <div key={m.key} className="border border-[#1E2530] rounded-xl p-3 bg-[#131820]">
                <p className="text-xs text-[#4A5261]">{m.label}</p>
                <p className="text-lg font-semibold text-[#E8EDF2] mt-1 font-mono-score">{m.value}</p>
                <span className={`inline-block text-xs font-medium mt-1.5 px-2 py-0.5 rounded-full ${status.bg} ${status.color}`}>
                  {status.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {data.issues?.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-[#E8EDF2] mb-2">Issues Found</p>
          <div className="space-y-2">
            {data.issues.map((issue, i) => (
              <div key={i} className="flex items-start gap-2 bg-[#EF4444]/10 border-l-4 border-[#EF4444] rounded-lg px-3 py-2.5 text-sm text-[#E8EDF2]">
                <span className="text-[#EF4444]">⚠</span>
                <span>{issue}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PerformanceReport;