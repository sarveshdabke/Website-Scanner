function PerformanceReport({ data }) {
  if (data.error) {
    return <p className="text-red-500">Error: {data.error}</p>;
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
        <div><span className="font-medium text-gray-700">Performance:</span> {data.performanceScore}</div>
        <div><span className="font-medium text-gray-700">Accessibility:</span> {data.accessibilityScore}</div>
        <div><span className="font-medium text-gray-700">Best Practices:</span> {data.bestPracticesScore}</div>
      </div>

      <div>
        <p className="font-medium text-gray-700 mb-2">Core Metrics:</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
          <div className="bg-gray-50 p-2 rounded">
            <p className="text-gray-500 text-xs">First Contentful Paint</p>
            <p className="font-medium">{data.metrics?.firstContentfulPaint}</p>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <p className="text-gray-500 text-xs">Largest Contentful Paint</p>
            <p className="font-medium">{data.metrics?.largestContentfulPaint}</p>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <p className="text-gray-500 text-xs">Total Blocking Time</p>
            <p className="font-medium">{data.metrics?.totalBlockingTime}</p>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <p className="text-gray-500 text-xs">Cumulative Layout Shift</p>
            <p className="font-medium">{data.metrics?.cumulativeLayoutShift}</p>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <p className="text-gray-500 text-xs">Speed Index</p>
            <p className="font-medium">{data.metrics?.speedIndex}</p>
          </div>
        </div>
      </div>

      {data.issues?.length > 0 && (
        <div>
          <p className="font-medium text-red-600 mb-1">Issues Found:</p>
          <ul className="list-disc list-inside text-sm text-red-500 space-y-1">
            {data.issues.map((issue, i) => <li key={i}>{issue}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

export default PerformanceReport;