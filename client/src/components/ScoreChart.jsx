import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getScoreStatus } from '../utils/scoreUtils';

function colorForScore(score) {
  return getScoreStatus(score).hex;
}

function ScoreChart({ seoScore, performanceScore, securityScore, overallScore }) {
  const barData = [
    { name: 'SEO', score: seoScore },
    { name: 'Performance', score: performanceScore },
    { name: 'Security', score: securityScore },
  ];

  const overallStatus = getScoreStatus(overallScore);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-[#131820] rounded-xl border border-[#1E2530] p-5">
        <p className="text-sm font-medium text-[#8892A0] mb-4">Score Comparison</p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={barData} barSize={40}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E2530" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#8892A0' }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#8892A0' }} axisLine={false} tickLine={false} />
            <Tooltip
              cursor={{ fill: '#1E2530' }}
              contentStyle={{ borderRadius: 10, border: '1px solid #1E2530', background: '#161D27', color: '#E8EDF2' }}
            />
            <Bar dataKey="score" radius={[8, 8, 0, 0]}>
              {barData.map((entry, index) => (
                <Cell key={index} fill={colorForScore(entry.score)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-[#131820] rounded-xl border border-[#1E2530] p-5">
        <p className="text-sm font-medium text-[#8892A0] mb-4">Score Distribution</p>
        <div className="relative">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={barData}
                dataKey="score"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
              >
                {barData.map((entry, index) => (
                  <Cell key={index} fill={colorForScore(entry.score)} stroke="none" />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #1E2530', background: '#161D27', color: '#E8EDF2' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className={`text-3xl font-bold font-mono-score ${overallStatus.text}`}>{overallScore}</p>
            <p className="text-xs text-[#4A5261]">Overall</p>
          </div>
        </div>
        <div className="flex justify-center gap-4 mt-2">
          {barData.map((entry) => (
            <div key={entry.name} className="flex items-center gap-1.5 text-xs text-[#8892A0]">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colorForScore(entry.score) }} />
              {entry.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ScoreChart;