import { Link } from "react-router-dom";
import { FaRunning } from "react-icons/fa";
import PanelCard from "../common/PanelCard";
import NoDataState from "../matches/NoDataState";
import TeamLogo from "./TeamLogo";
import { formatNumber } from "./playerPageUtils";

const StatisticsTable = ({ statistics }) => {
  if(statistics.length === 0){
    return (
      <NoDataState
        title="No Player Statistics"
        message="Sync this player through team player sync before statistics appear here."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[920px] text-left text-sm">
        <thead className="bg-[#111111] text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3 font-medium">Season</th>
            <th className="px-4 py-3 font-medium">Team</th>
            <th className="px-4 py-3 font-medium">League</th>
            <th className="px-4 py-3 font-medium">Position</th>
            <th className="px-4 py-3 text-right font-medium">Apps</th>
            <th className="px-4 py-3 text-right font-medium">Minutes</th>
            <th className="px-4 py-3 text-right font-medium">Goals</th>
            <th className="px-4 py-3 text-right font-medium">Assists</th>
            <th className="px-4 py-3 text-right font-medium">Cards</th>
          </tr>
        </thead>
        <tbody>
          {statistics.map((statistic) => (
            <tr key={`${statistic.team?.api_team_id}-${statistic.league?.api_league_id}-${statistic.season}`} className="border-t border-[#2a2a2a]">
              <td className="px-4 py-4 text-gray-300">{statistic.season}</td>
              <td className="px-4 py-4">
                {statistic.team?.api_team_id ? (
                  <Link to={`/teams/${statistic.team.api_team_id}`} className="flex min-w-0 items-center gap-3 transition-colors hover:text-[#a78bfa]">
                    <TeamLogo team={statistic.team} />
                    <span className="truncate font-semibold text-white">{statistic.team?.name || "Saved Team"}</span>
                  </Link>
                ) : (
                  <div className="flex min-w-0 items-center gap-3">
                    <TeamLogo team={statistic.team} />
                    <span className="truncate font-semibold text-white">{statistic.team?.name || "Saved Team"}</span>
                  </div>
                )}
              </td>
              <td className="px-4 py-4 text-gray-300">{statistic.league?.name || "Saved League"}</td>
              <td className="px-4 py-4 text-gray-300">{statistic.position || "POS"}</td>
              <td className="px-4 py-4 text-right text-gray-300">{formatNumber(statistic.appearances)}</td>
              <td className="px-4 py-4 text-right text-gray-300">{formatNumber(statistic.minutes)}</td>
              <td className="px-4 py-4 text-right text-gray-300">{formatNumber(statistic.goals)}</td>
              <td className="px-4 py-4 text-right text-gray-300">{formatNumber(statistic.assists)}</td>
              <td className="px-4 py-4 text-right text-gray-300">
                {formatNumber(statistic.yellow_cards)} / {formatNumber(statistic.red_cards)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const PlayerStatisticsTab = ({ statistics }) => {
  return (
    <PanelCard className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2a2a2a] p-5">
        <div>
          <h2 className="flex items-center gap-2 font-semibold text-white">
            <FaRunning className="text-[#8b5cf6]" />
            Season Statistics
          </h2>
          <p className="mt-1 text-xs text-gray-500">Stats are loaded from saved player statistics.</p>
        </div>
        <span className="rounded-full bg-[#8b5cf6]/15 px-3 py-1 text-xs text-[#a78bfa]">
          {statistics.length} rows
        </span>
      </div>
      <div className="p-5">
        <StatisticsTable statistics={statistics} />
      </div>
    </PanelCard>
  );
};

export default PlayerStatisticsTab;
