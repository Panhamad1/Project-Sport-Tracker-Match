import { FaTrophy } from "react-icons/fa";
import PanelCard from "../common/PanelCard";
import { SeasonRecordPanel, StandingCard, TeamFormPanel, TeamLeadersPanel } from "./TeamPanels";

const RecordsTab = ({ currentStanding, formRecord, standings, teamFormEntries, teamLeaders }) => {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <SeasonRecordPanel standing={currentStanding} />
        <TeamFormPanel formEntries={teamFormEntries} record={formRecord} />
        <TeamLeadersPanel leaders={teamLeaders} />
      </div>

      {standings.length > 1 && (
        <PanelCard className="p-5">
          <h2 className="flex items-center gap-2 font-semibold text-white">
            <FaTrophy className="text-[#8b5cf6]" />
            Other League Records
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
            {standings.slice(1).map((standing) => (
              <StandingCard key={`${standing.league?.api_league_id}-${standing.season}`} standing={standing} />
            ))}
          </div>
        </PanelCard>
      )}
    </div>
  );
};

export default RecordsTab;
