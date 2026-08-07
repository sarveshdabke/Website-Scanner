function SeoReport({ data }) {
  if (data.error) {
    return <p className="text-red-500">Error: {data.error}</p>;
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div><span className="font-medium text-gray-700">Title:</span> {data.title || 'N/A'}</div>
        <div><span className="font-medium text-gray-700">Title Length:</span> {data.titleLength}</div>
        <div><span className="font-medium text-gray-700">H1 Count:</span> {data.h1Count}</div>
        <div><span className="font-medium text-gray-700">H2 Count:</span> {data.h2Count}</div>
        <div><span className="font-medium text-gray-700">Word Count:</span> {data.wordCount}</div>
        <div><span className="font-medium text-gray-700">Total Links:</span> {data.totalLinks}</div>
        <div><span className="font-medium text-gray-700">Images without Alt:</span> {data.imagesWithoutAlt} / {data.totalImages}</div>
        <div><span className="font-medium text-gray-700">Mobile Friendly:</span> {data.hasViewport ? 'Yes' : 'No'}</div>
      </div>

      <div>
        <p className="font-medium text-gray-700 mb-1">Meta Description:</p>
        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{data.metaDescription || 'Missing'}</p>
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

export default SeoReport;