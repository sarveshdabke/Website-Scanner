function getScoreColor(score) {
  if (score >= 80) return { bg: 'bg-green-100', text: 'text-green-700', ring: 'ring-green-500' };
  if (score >= 50) return { bg: 'bg-yellow-100', text: 'text-yellow-700', ring: 'ring-yellow-500' };
  return { bg: 'bg-red-100', text: 'text-red-700', ring: 'ring-red-500' };
}

function ScoreCard({ title, score }) {
  const colors = getScoreColor(score);

  return (
    <div className={`rounded-xl p-5 ${colors.bg} ring-1 ${colors.ring} flex flex-col items-center justify-center`}>
      <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
      <p className={`text-4xl font-bold ${colors.text}`}>{score}</p>
      <p className="text-xs text-gray-500 mt-1">out of 100</p>
    </div>
  );
}

export default ScoreCard;