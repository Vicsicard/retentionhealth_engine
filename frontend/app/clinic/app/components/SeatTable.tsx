import type { DashboardSeat } from "@/lib/types";
import RiskBadge from "./RiskBadge";

interface Props {
  seats: DashboardSeat[];
}

export default function SeatTable({ seats }: Props) {
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Engagement</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Check-In</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Flags</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {seats.map((seat) => (
              <tr key={seat.seat_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{seat.patient_external_id}</td>
                <td className="px-6 py-4">
                  <RiskBadge tier={seat.risk_tier} />
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{seat.engagement_rate}%</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {seat.last_check_in_date || "Never"}
                </td>
                <td className="px-6 py-4 text-sm">
                  {seat.flags.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {seat.flags.map((flag) => (
                        <span key={flag} className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">
                          {flag.replace(/_/g, " ")}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400">None</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
