import { FaUser } from "react-icons/fa";
import { getPlayerDisplayName } from "./dreamTeamUtils";

const PlayerSearchResult = ({ alreadyUsed, onSelect, player }) => {
  const displayName = getPlayerDisplayName(player);

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={alreadyUsed}
      className={`flex w-full items-center gap-3 rounded-lg p-2 text-left transition-all ${
        alreadyUsed
          ? "cursor-not-allowed opacity-50"
          : "hover:bg-[#1a1a1a]"
      }`}
    >
      {player.photo ? (
        <img src={player.photo} alt="" className="h-10 w-10 rounded-full object-cover" />
      ) : (
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-[#a78bfa]">
          <FaUser />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">{displayName}</p>
        <p className="text-xs text-gray-500">
          {alreadyUsed
            ? "Already selected"
            : [player.position, player.nationality, player.age ? `${player.age} years old` : null].filter(Boolean).join(" - ") || "Saved player"}
        </p>
      </div>
    </button>
  );
};

export default PlayerSearchResult;
