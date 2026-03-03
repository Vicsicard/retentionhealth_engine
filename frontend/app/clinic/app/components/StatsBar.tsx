interface Props {
  counts: {
    total: number;
    STABLE: number;
    MONITOR: number;
    ELEVATED: number;
  };
  window: { from: string; to: string };
}

export default function StatsBar({ counts, window }: Props) {
  return (
    <div className="card mb-6">
      <div className="text-sm text-gray-500 mb-4">
        {window.from} to {window.to}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <div className="text-2xl font-semibold text-gray-900">{counts.total}</div>
          <div className="text-sm text-gray-600">Total Seats</div>
        </div>
        
        <div>
          <div className="text-2xl font-semibold text-green-600">{counts.STABLE}</div>
          <div className="text-sm text-gray-600">Stable</div>
        </div>
        
        <div>
          <div className="text-2xl font-semibold text-yellow-600">{counts.MONITOR}</div>
          <div className="text-sm text-gray-600">Monitor</div>
        </div>
        
        <div>
          <div className="text-2xl font-semibold text-red-600">{counts.ELEVATED}</div>
          <div className="text-sm text-gray-600">Elevated Risk</div>
        </div>
      </div>
    </div>
  );
}
