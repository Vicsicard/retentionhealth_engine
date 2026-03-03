import type { RiskTier } from "@/lib/types";

interface Props {
  tier: RiskTier;
}

export default function RiskBadge({ tier }: Props) {
  const styles = {
    STABLE: "bg-green-100 text-green-800",
    MONITOR: "bg-yellow-100 text-yellow-800",
    ELEVATED: "bg-red-100 text-red-800"
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[tier]}`}>
      {tier}
    </span>
  );
}
