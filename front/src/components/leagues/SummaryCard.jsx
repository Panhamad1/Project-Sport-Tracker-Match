import PanelCard from "../common/PanelCard";

const SummaryCard = ({ label, value, icon }) => {
  return (
    <PanelCard className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-gray-400">{label}</p>
          <p className="mt-2 text-2xl font-bold text-white">{value}</p>
        </div>
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#8b5cf6]/15 text-[#a78bfa]">
          {icon}
        </span>
      </div>
    </PanelCard>
  );
};

export default SummaryCard;
