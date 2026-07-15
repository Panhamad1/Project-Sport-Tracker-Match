import { hasValue } from "./playerPageUtils";

const InfoItem = ({ icon, label, value }) => {
  if(!hasValue(value)){
    return null;
  }

  return (
    <div className="rounded-lg border border-[#2a2a2a] bg-[#111111] p-4">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span className="text-[#8b5cf6]">{icon}</span>
        {label}
      </div>
      <p className="mt-2 text-sm font-medium text-white">{value}</p>
    </div>
  );
};

export default InfoItem;
