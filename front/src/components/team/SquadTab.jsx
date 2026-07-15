import { FaUsers } from "react-icons/fa";
import PanelCard from "../common/PanelCard";
import NoDataState from "../matches/NoDataState";
import PlayerAvatar from "./PlayerAvatar";
import PlayerProfileLink from "./PlayerProfileLink";
import { formatNumber } from "./teamPageUtils";

const getCompetitionLabel = (player) => {
  if(Number(player.competitions_count || 0) > 1){
    return `${player.league?.name || "Multiple competitions"} +${Number(player.competitions_count) - 1}`;
  }

  return player.league?.name || `Season ${player.season}`;
};

const getCompetitionTitle = (player) => {
  if(!Array.isArray(player.competitions) || player.competitions.length === 0){
    return "";
  }

  return player.competitions.map((competition) => competition.name).filter(Boolean).join(", ");
};

const PlayerTable = ({ players }) => {
  if(players.length === 0){
    return (
      <NoDataState
        title="No Players Synced Yet"
        message="Sync players for this team from the admin panel before the squad appears here."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[860px] text-left text-sm">
        <thead className="bg-[#111111] text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3 font-medium">Player</th>
            <th className="px-4 py-3 font-medium">Position</th>
            <th className="px-4 py-3 font-medium">League</th>
            <th className="px-4 py-3 text-right font-medium">Apps</th>
            <th className="px-4 py-3 text-right font-medium">Minutes</th>
            <th className="px-4 py-3 text-right font-medium">Goals</th>
            <th className="px-4 py-3 text-right font-medium">Assists</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={`${player.api_player_id}-${player.league?.api_league_id}-${player.season}`} className="border-t border-[#2a2a2a]">
              <td className="px-4 py-4">
                <PlayerProfileLink
                  player={player}
                  className="group flex min-w-0 items-center gap-3 rounded-md transition-colors hover:text-[#a78bfa]"
                >
                  <PlayerAvatar player={player} />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white transition-colors group-hover:text-[#a78bfa]">{player.name || "Player"}</p>
                    {player.nationality && (
                      <p className="truncate text-xs text-gray-500">{player.nationality}</p>
                    )}
                  </div>
                </PlayerProfileLink>
              </td>
              <td className="px-4 py-4 text-gray-300">{player.position || "POS"}</td>
              <td className="px-4 py-4 text-gray-300" title={getCompetitionTitle(player)}>
                {getCompetitionLabel(player)}
              </td>
              <td className="px-4 py-4 text-right text-gray-300">{formatNumber(player.appearances)}</td>
              <td className="px-4 py-4 text-right text-gray-300">{formatNumber(player.minutes)}</td>
              <td className="px-4 py-4 text-right text-gray-300">{formatNumber(player.goals)}</td>
              <td className="px-4 py-4 text-right text-gray-300">{formatNumber(player.assists)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const SquadTab = ({ onSeasonChange, players, seasonOptions, selectedSeason }) => {
  return (
    <PanelCard className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2a2a2a] p-5">
        <div>
          <h2 className="flex items-center gap-2 font-semibold text-white">
            <FaUsers className="text-[#8b5cf6]" />
            Squad
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Player data comes from synced team statistics.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
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
          <span className="rounded-full bg-[#8b5cf6]/15 px-3 py-1 text-xs text-[#a78bfa]">
            {players.length} players
          </span>
        </div>
      </div>
      <div className="p-5">
        <PlayerTable players={players} />
      </div>
    </PanelCard>
  );
};

export default SquadTab;
