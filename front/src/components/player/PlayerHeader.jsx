import PanelCard from "../common/PanelCard";
import PlayerPhoto from "./PlayerPhoto";

const PlayerHeader = ({
  onSeasonChange,
  player,
  profileChips,
  seasonOptions,
  selectedSeason,
}) => {
  return (
    <PanelCard className="overflow-hidden">
      <div className="p-5">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center">
            <PlayerPhoto player={player} />
            <div className="min-w-0">
              <p className="text-sm font-medium text-[#8b5cf6]">Player Profile</p>
              <h1 className="mt-1 truncate text-3xl font-bold">{player.name}</h1>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-400">
                {profileChips.map((chip) => (
                  <span key={chip.key} className="rounded-full bg-[#111111] px-3 py-1">{chip.label}</span>
                ))}
              </div>
            </div>
          </div>

          {player.injured && (
            <span className="rounded-full bg-red-500/15 px-3 py-1 text-xs font-medium text-red-200">
              Injured
            </span>
          )}

          <label className="flex items-center gap-2 text-xs text-gray-400">
            Season
            <select
              value={selectedSeason}
              onChange={(event) => onSeasonChange(event.target.value)}
              className="rounded-lg border border-[#2a2a2a] bg-[#111111] px-3 py-2 text-sm text-white outline-none transition-colors focus:border-[#8b5cf6]"
            >
              {seasonOptions.map((season) => (
                <option key={season} value={season}>
                  {season}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </PanelCard>
  );
};

export default PlayerHeader;
