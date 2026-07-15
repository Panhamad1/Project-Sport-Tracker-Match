import { Link } from "react-router-dom";
import PanelCard from "../common/PanelCard";
import NoDataState from "../matches/NoDataState";
import SummaryMini from "./SummaryMini";
import TeamLogo from "./TeamLogo";

const PlayerClubsTab = ({ clubRows }) => {
  if(clubRows.length === 0){
    return <NoDataState message="No team history is saved for this player yet." />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {clubRows.map((row) => (
        <PanelCard key={row.team?.api_team_id || row.team?.name} className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <TeamLogo team={row.team} />
              <div className="min-w-0">
                {row.team?.api_team_id ? (
                  <Link to={`/teams/${row.team.api_team_id}`} className="truncate font-semibold text-white transition-colors hover:text-[#a78bfa]">
                    {row.team?.name || "Saved Team"}
                  </Link>
                ) : (
                  <p className="truncate font-semibold text-white">{row.team?.name || "Saved Team"}</p>
                )}
                <p className="mt-1 truncate text-xs text-gray-500">{row.leagues.join(", ") || "Saved League"}</p>
              </div>
            </div>
            <span className="rounded-full bg-[#8b5cf6]/15 px-3 py-1 text-xs text-[#a78bfa]">
              {row.seasons.join(", ")}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-4 gap-2">
            <SummaryMini label="Apps" value={row.appearances} />
            <SummaryMini label="Minutes" value={row.minutes} />
            <SummaryMini label="Goals" value={row.goals} />
            <SummaryMini label="Assists" value={row.assists} />
          </div>
        </PanelCard>
      ))}
    </div>
  );
};

export default PlayerClubsTab;
