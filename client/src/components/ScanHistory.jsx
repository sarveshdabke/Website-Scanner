import { useNavigate } from 'react-router';
import { getScoreStatus } from '../utils/scoreUtils';

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hr ago`;
  return new Date(dateStr).toLocaleDateString();
}

function ScanHistory({ scans }) {
  const navigate = useNavigate();

  if (!scans || scans.length === 0) {
    return (
      <div className="text-center py-10 bg-[#131820] rounded-xl border border-dashed border-[#1E2530]">
        <p className="text-[#4A5261] text-sm font-mono-score">No scans yet — try scanning a website above.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#131820] rounded-xl border border-[#1E2530] divide-y divide-[#1E2530] overflow-hidden">
      {scans.map((scan) => {
        const status = getScoreStatus(scan.overall_score);
        return (
          <div
            key={scan.id}
            onClick={() => navigate(`/report/${scan.id}`)}
            className={`group flex items-center justify-between p-4 pl-3 border-l-4 hover:bg-[#161D27] cursor-pointer transition-colors ${status.border}`}
            style={{ borderLeftColor: status.hex }}
          >
            <div className="flex items-center gap-3">
              <span className={`w-2.5 h-2.5 rounded-full ${status.dot} ${status.glow}`} />
              <div>
                <p className="font-medium text-[#E8EDF2] text-sm">{scan.url}</p>
                <p className="text-xs text-[#4A5261] font-mono-score">{timeAgo(scan.created_at)}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <p className={`text-sm font-medium hidden sm:block ${status.text}`}>{status.label}</p>
              <div className={`text-lg font-bold font-mono-score ${status.text} w-10 text-right`}>{scan.overall_score}</div>
              <span className="text-[#4A5261] group-hover:translate-x-1 transition-transform inline-block">→</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ScanHistory;