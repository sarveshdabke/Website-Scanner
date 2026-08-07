import { useNavigate } from 'react-router';

function ScanHistory({ scans }) {
  const navigate = useNavigate();

  if (!scans || scans.length === 0) {
    return <p className="text-gray-500 text-center py-6">No scans yet. Try scanning a website above.</p>;
  }

  return (
    <div className="space-y-2">
      {scans.map((scan) => (
        <div
          key={scan.id}
          onClick={() => navigate(`/report/${scan.id}`)}
          className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md cursor-pointer transition-shadow"
        >
          <div>
            <p className="font-medium text-gray-800">{scan.url}</p>
            <p className="text-xs text-gray-500">{new Date(scan.created_at).toLocaleString()}</p>
          </div>
          <div className={`text-lg font-bold ${scan.overall_score >= 80 ? 'text-green-600' : scan.overall_score >= 50 ? 'text-yellow-600' : 'text-red-500'}`}>
            {scan.overall_score}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ScanHistory;