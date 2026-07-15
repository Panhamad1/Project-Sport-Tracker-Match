const LeagueSelectorCard = ({ league, active, onSelect }) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(league)}
      className={`w-full rounded-lg border p-4 text-left transition-all ${
        active
          ? "border-[#8b5cf6] bg-[#8b5cf6]/15"
          : "border-[#2a2a2a] bg-[#111111] hover:border-[#8b5cf6]/60"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-semibold text-white">{league.name}</p>
          <p className="mt-1 truncate text-xs text-gray-500">{league.country}</p>
        </div>
        <span className="rounded-full bg-black/25 px-2.5 py-1 text-xs text-[#c4b5fd]">
          {league.apiLeagueId}
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 text-xs text-gray-400">
        <span>Season {league.season}</span>
        {active && <span className="text-[#a78bfa]">Selected</span>}
      </div>
    </button>
  );
};

export default LeagueSelectorCard;
