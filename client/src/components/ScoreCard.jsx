import { getScoreStatus } from '../utils/scoreUtils';

function ScoreCard({ title, score, icon: Icon }) {
  const status = getScoreStatus(score);

  return (
    <div className="bg-[#131820] rounded-xl border border-[#1E2530] p-5 hover:border-opacity-60 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-150" style={{ '--hover-border': status.hex }}>
      <div className="flex items-center gap-2 mb-3">
        {Icon && (
          <span className={`w-7 h-7 rounded-full flex items-center justify-center ${status.bg15}`}>
            <Icon className={`w-3.5 h-3.5 ${status.text}`} />
          </span>
        )}
        <p className="text-sm font-medium text-[#8892A0]">{title}</p>
      </div>

      <div className="flex items-end gap-1 mb-2">
        <p className="text-3xl font-bold text-[#E8EDF2] font-mono-score">{score}</p>
        <p className="text-sm text-[#4A5261] mb-1 font-mono-score">/100</p>
      </div>

      <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full border ${status.bg15} ${status.text} ${status.border}`}>
        {status.label}
      </span>

      <div className="mt-3 h-1.5 bg-[#1E2530] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${status.bar} transition-all duration-700`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export default ScoreCard;