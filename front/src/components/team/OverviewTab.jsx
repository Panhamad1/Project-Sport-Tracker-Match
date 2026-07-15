import { FaCalendarAlt, FaMapMarkerAlt, FaTrophy } from "react-icons/fa";
import { InfoItem, SeasonRecordPanel, TeamFormPanel, TeamLeadersPanel } from "./TeamPanels";

const factIcons = {
  calendar: <FaCalendarAlt />,
  location: <FaMapMarkerAlt />,
  trophy: <FaTrophy />,
};

const OverviewTab = ({ currentStanding, formRecord, teamFacts, teamFormEntries, teamLeaders }) => {
  return (
    <div className="space-y-5">
      {teamFacts.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {teamFacts.map((fact) => (
            <InfoItem key={fact.key} icon={factIcons[fact.type]} label={fact.label} value={fact.value} />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <SeasonRecordPanel standing={currentStanding} />
        <TeamFormPanel formEntries={teamFormEntries} record={formRecord} />
        <TeamLeadersPanel leaders={teamLeaders} />
      </div>
    </div>
  );
};

export default OverviewTab;
