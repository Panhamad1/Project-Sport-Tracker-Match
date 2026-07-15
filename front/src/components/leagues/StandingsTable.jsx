import { Link } from "react-router-dom";
import FormBadge from "./FormBadge";
import TeamLogo from "./TeamLogo";
import { formatNumber, getTeamDisplay, getTeamPath } from "./leagueHelpers";

const StandingsTable = ({ group }) => {
  return (
    <div className="overflow-hidden rounded-lg border border-[#2a2a2a]">
      <div className="border-b border-[#2a2a2a] bg-[#111111] px-4 py-3">
        <h3 className="font-semibold text-white">{group.name}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="bg-[#0a0a0a] text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">Club</th>
              <th className="px-4 py-3 text-right font-medium">PL</th>
              <th className="px-4 py-3 text-right font-medium">W</th>
              <th className="px-4 py-3 text-right font-medium">D</th>
              <th className="px-4 py-3 text-right font-medium">L</th>
              <th className="px-4 py-3 text-right font-medium">GF</th>
              <th className="px-4 py-3 text-right font-medium">GA</th>
              <th className="px-4 py-3 text-right font-medium">GD</th>
              <th className="px-4 py-3 text-right font-medium">PTS</th>
              <th className="px-4 py-3 text-right font-medium">Form</th>
            </tr>
          </thead>
          <tbody>
            {group.rows.map((standing) => (
              <tr key={`${standing.team_id}-${standing.rank}`} className="border-t border-[#2a2a2a]">
                <td className="px-4 py-4">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#1a1a1a] text-sm font-semibold text-white">
                    {formatNumber(standing.rank)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  {getTeamPath(standing.team) ? (
                    <Link
                      to={getTeamPath(standing.team)}
                      className="flex min-w-0 items-center gap-3 rounded-lg transition-colors hover:text-[#a78bfa]"
                    >
                      <TeamLogo team={standing.team} />
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-white transition-colors hover:text-[#a78bfa]">{getTeamDisplay(standing)}</p>
                        {(standing.description || standing.status) && (
                          <p className="truncate text-xs text-gray-500">{standing.description || standing.status}</p>
                        )}
                      </div>
                    </Link>
                  ) : (
                    <div className="flex min-w-0 items-center gap-3">
                      <TeamLogo team={standing.team} />
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-white">{getTeamDisplay(standing)}</p>
                        {(standing.description || standing.status) && (
                          <p className="truncate text-xs text-gray-500">{standing.description || standing.status}</p>
                        )}
                      </div>
                    </div>
                  )}
                </td>
                <td className="px-4 py-4 text-right text-gray-300">{formatNumber(standing.played)}</td>
                <td className="px-4 py-4 text-right text-gray-300">{formatNumber(standing.win)}</td>
                <td className="px-4 py-4 text-right text-gray-300">{formatNumber(standing.draw)}</td>
                <td className="px-4 py-4 text-right text-gray-300">{formatNumber(standing.lose)}</td>
                <td className="px-4 py-4 text-right text-gray-300">{formatNumber(standing.goals_for)}</td>
                <td className="px-4 py-4 text-right text-gray-300">{formatNumber(standing.goals_against)}</td>
                <td className="px-4 py-4 text-right text-gray-300">{formatNumber(standing.goals_diff)}</td>
                <td className="px-4 py-4 text-right font-bold text-white">{formatNumber(standing.points)}</td>
                <td className="px-4 py-4">
                  <div className="flex justify-end gap-1">
                    {(standing.form || "").slice(-5).split("").map((letter, index) => (
                      <FormBadge key={`${standing.team_id}-${letter}-${index}`} letter={letter} />
                    ))}
                    {!standing.form && <span className="text-xs text-gray-500">-</span>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StandingsTable;
