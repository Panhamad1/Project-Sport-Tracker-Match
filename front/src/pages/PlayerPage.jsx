import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaFutbol,
  FaRunning,
  FaShieldAlt,
  FaSpinner,
  FaStar,
} from "react-icons/fa";
import PanelCard from "../components/common/PanelCard";
import NoDataState from "../components/matches/NoDataState";
import PlayerClubsTab from "../components/player/PlayerClubsTab";
import PlayerHeader from "../components/player/PlayerHeader";
import PlayerOverviewTab from "../components/player/PlayerOverviewTab";
import PlayerStatisticsTab from "../components/player/PlayerStatisticsTab";
import PlayerSummaryCard from "../components/player/PlayerSummaryCard";
import PlayerTabs from "../components/player/PlayerTabs";
import { tabs } from "../components/player/playerPageUtils";
import { usePlayerPage } from "../hooks/usePlayerPage";

const PlayerPage = () => {
  const {
    activeTab,
    clubRows,
    facts,
    loading,
    message,
    player,
    primaryStatistic,
    profileChips,
    selectedDisplaySeason,
    setActiveTab,
    setSelectedStatisticSeason,
    statisticSeasonOptions,
    statistics,
    summary,
  } = usePlayerPage();
  const activeContentByTab = {
    overview: (
      <PlayerOverviewTab
        facts={facts}
        primaryStatistic={primaryStatistic}
        selectedSeason={selectedDisplaySeason}
        summary={summary}
      />
    ),
    statistics: <PlayerStatisticsTab statistics={statistics} />,
    clubs: <PlayerClubsTab clubRows={clubRows} />,
  };

  if(loading){
    return (
      <div className="flex items-center gap-3 text-white">
        <FaSpinner className="animate-spin text-[#8b5cf6]" />
        Loading player...
      </div>
    );
  }

  if(!player){
    return (
      <div className="space-y-4 text-white">
        <Link to="/leagues" className="inline-flex items-center gap-2 text-sm text-[#a78bfa] hover:text-white">
          <FaArrowLeft />
          Back to leagues
        </Link>
        <NoDataState title="Player Not Found" message={message || "This player does not exist in the database yet."} />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-white">
      <Link to={primaryStatistic?.team?.api_team_id ? `/teams/${primaryStatistic.team.api_team_id}` : "/leagues"} className="inline-flex items-center gap-2 text-sm text-[#a78bfa] hover:text-white">
        <FaArrowLeft />
        {primaryStatistic?.team?.api_team_id ? "Back to team" : "Back to leagues"}
      </Link>

      <PlayerHeader
        onSeasonChange={setSelectedStatisticSeason}
        player={player}
        profileChips={profileChips}
        seasonOptions={statisticSeasonOptions}
        selectedSeason={selectedDisplaySeason}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <PlayerSummaryCard label={`Apps ${selectedDisplaySeason}`} value={summary.appearances} icon={<FaRunning />} />
        <PlayerSummaryCard label={`Goals ${selectedDisplaySeason}`} value={summary.goals} icon={<FaFutbol />} />
        <PlayerSummaryCard label={`Assists ${selectedDisplaySeason}`} value={summary.assists} icon={<FaStar />} />
        <PlayerSummaryCard label={`Teams ${selectedDisplaySeason}`} value={clubRows.length} icon={<FaShieldAlt />} />
      </div>

      <PanelCard className="p-4">
        <PlayerTabs activeTab={activeTab} onChange={setActiveTab} tabs={tabs} />

        <div className="mt-4">
          {activeContentByTab[activeTab] || activeContentByTab.overview}
        </div>
      </PanelCard>
    </div>
  );
};

export default PlayerPage;
