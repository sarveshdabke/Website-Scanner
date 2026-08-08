export function getScoreStatus(score) {
  if (score >= 80) {
    return {
      label: 'Good',
      hex: '#22C55E',
      text: 'text-[#22C55E]',
      bg15: 'bg-[#22C55E]/15',
      border: 'border-[#22C55E]/40',
      bar: 'bg-[#22C55E]',
      dot: 'bg-[#22C55E]',
      glow: 'shadow-[0_0_10px_rgba(34,197,94,0.5)]',
    };
  }
  if (score >= 50) {
    return {
      label: 'Needs Improvement',
      hex: '#F59E0B',
      text: 'text-[#F59E0B]',
      bg15: 'bg-[#F59E0B]/15',
      border: 'border-[#F59E0B]/40',
      bar: 'bg-[#F59E0B]',
      dot: 'bg-[#F59E0B]',
      glow: 'shadow-[0_0_10px_rgba(245,158,11,0.5)]',
    };
  }
  return {
    label: 'Poor',
    hex: '#EF4444',
    text: 'text-[#EF4444]',
    bg15: 'bg-[#EF4444]/15',
    border: 'border-[#EF4444]/40',
    bar: 'bg-[#EF4444]',
    dot: 'bg-[#EF4444]',
    glow: 'shadow-[0_0_10px_rgba(239,68,68,0.5)]',
  };
}

export const ACCENT = '#00FF9C';