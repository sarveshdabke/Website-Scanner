function SeoReport({ data }) {
  if (data.error) {
    return <p className="text-[#EF4444] text-sm">Error: {data.error}</p>;
  }

  const rows = [
    ['Page Title', data.title || 'N/A'],
    ['Title Length', `${data.titleLength} characters`],
    ['H1 Tags', data.h1Count],
    ['H2 Tags', data.h2Count],
    ['Word Count', data.wordCount],
    ['Total Links', data.totalLinks],
    ['Images Missing Alt', `${data.imagesWithoutAlt} / ${data.totalImages}`],
    ['Mobile Friendly', data.hasViewport ? 'Yes' : 'No'],
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#1E2530] rounded-xl overflow-hidden border border-[#1E2530]">
        {rows.map(([label, value]) => (
          <div key={label} className="bg-[#131820] px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-[#8892A0]">{label}</span>
            <span className="text-sm font-medium text-[#E8EDF2] font-mono-score">{value}</span>
          </div>
        ))}
      </div>

      <div>
        <p className="text-sm text-[#8892A0] mb-1.5">Meta Description</p>
        <p className="text-sm text-[#E8EDF2] bg-[#0D1117] p-3 rounded-xl border border-[#1E2530] font-mono-score">
          {data.metaDescription || 'Missing'}
        </p>
      </div>

      {data.issues?.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <p className="text-sm font-semibold text-[#E8EDF2]">Issues Found</p>
            <span className="text-xs font-medium bg-[#EF4444]/15 text-[#EF4444] px-2 py-0.5 rounded-full font-mono-score">
              {data.issues.length}
            </span>
          </div>
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

export default SeoReport;