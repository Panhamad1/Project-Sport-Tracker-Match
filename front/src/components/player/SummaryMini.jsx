import { formatNumber } from "./playerPageUtils";

const SummaryMini = ({ label, value }) => {
  return (
    <div className="rounded-lg bg-black/25 p-3 text-center">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-white">{formatNumber(value)}</p>
    </div>
  );
};

export default SummaryMini;
