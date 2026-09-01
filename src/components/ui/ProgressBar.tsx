interface ProgressBarProps {
  percentage: number;
  color?: string;
  height?: string;
  exceeded?: boolean;
}

export function ProgressBar({ percentage, color = 'bg-pinkfanta-500', height = 'h-3', exceeded = false }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percentage));
  return (
    <div className={`w-full ${height} bg-pinkfanta-100 rounded-full border-2 border-[#171717] overflow-hidden`}>
      <div
        className={`h-full ${exceeded ? 'bg-red-500' : color} rounded-full transition-all duration-500 ease-out`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
