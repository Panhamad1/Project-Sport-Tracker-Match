import { FaInfoCircle } from "react-icons/fa";
import PanelCard from "../common/PanelCard";

const AdminUsefulIdsCard = ({ presets }) => {
  return (
    <PanelCard className="p-5">
      <h2 className="font-semibold flex items-center gap-2">
        <FaInfoCircle className="text-[#8b5cf6]" />
        Useful IDs
      </h2>
      <div className="mt-4 space-y-2">
        {presets.map((preset) => (
          <div key={preset} className="text-sm text-gray-300 bg-[#111111] border border-[#2a2a2a] rounded px-3 py-2">
            {preset}
          </div>
        ))}
      </div>
    </PanelCard>
  );
};

export default AdminUsefulIdsCard;
