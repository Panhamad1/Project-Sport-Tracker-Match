import { FaCalendarAlt, FaIdBadge, FaRunning, FaShieldAlt, FaTrophy } from "react-icons/fa";
import PanelCard from "../common/PanelCard";
import NoDataState from "../matches/NoDataState";
import InfoItem from "./InfoItem";
import SummaryMini from "./SummaryMini";
import TeamLogo from "./TeamLogo";

const factIcons = {
  calendar: <FaCalendarAlt />,
  id: <FaIdBadge />,
  running: <FaRunning />,
  shield: <FaShieldAlt />,
  trophy: <FaTrophy />,
};

const PlayerOverviewTab = ({ facts, primaryStatistic, selectedSeason, summary }) => {
  return (
    <div className="space-y-5">
      {facts.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {facts.map((fact) => (
            <InfoItem key={fact.key} icon={factIcons[fact.type]} label={fact.label} value={fact.value} />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_360px]">
        <PanelCard className="p-5">
          <h2 className="flex items-center gap-2 font-semibold text-white">
            <FaRunning className="text-[#8b5cf6]" />
            Season {selectedSeason} Summary
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
            <SummaryMini label="Apps" value={summary.appearances} />
            <SummaryMini label="Minutes" value={summary.minutes} />
            <SummaryMini label="Goals" value={summary.goals} />
            <SummaryMini label="Assists" value={summary.assists} />
            <SummaryMini label="Yellow" value={summary.yellow_cards} />
            <SummaryMini label="Red" value={summary.red_cards} />
          </div>
        </PanelCard>

        <PanelCard className="p-5">
          <h2 className="flex items-center gap-2 font-semibold text-white">
            <FaTrophy className="text-[#8b5cf6]" />
            Selected Season
          </h2>
          {!primaryStatistic ? (
            <div className="mt-4">
              <NoDataState message="No season statistics are saved for this player yet." />
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3 rounded-lg border border-[#2a2a2a] bg-[#111111] p-3">
                <TeamLogo team={primaryStatistic.team} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{primaryStatistic.team?.name || "Saved Team"}</p>
                  <p className="text-xs text-gray-500">
                    {primaryStatistic.league?.name || `Season ${primaryStatistic.season}`} - {primaryStatistic.season}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <SummaryMini label="Apps" value={primaryStatistic.appearances} />
                <SummaryMini label="Goals" value={primaryStatistic.goals} />
                <SummaryMini label="Assists" value={primaryStatistic.assists} />
              </div>
            </div>
          )}
        </PanelCard>
      </div>
    </div>
  );
};

export default PlayerOverviewTab;
