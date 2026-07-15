import {
  FaArrowLeft,
  FaCrown,
  FaFutbol,
  FaSpinner,
  FaStar,
  FaUsers,
} from "react-icons/fa";
import PanelCard from "../components/common/PanelCard";
import MatchesTab from "../components/team/MatchesTab";
import OverviewTab from "../components/team/OverviewTab";
import RecordsTab from "../components/team/RecordsTab";
import SquadTab from "../components/team/SquadTab";
import TeamProfileHeader from "../components/team/TeamProfileHeader";
import TeamSummaryCard from "../components/team/TeamSummaryCard";
import TeamTabs from "../components/team/TeamTabs";
import { tabs } from "../components/team/teamPageUtils";
import NoDataState from "../components/matches/NoDataState";
import { useTeamPage } from "../hooks/useTeamPage";

const TeamPage = () => {
  const {
    activeTab,
    authLoading,
    currentStanding,
    favoriteLoading,
    favoriteMessage,
    formRecord,
    handleBack,
    handleFavoriteToggle,
    isFavorite,
    loading,
    message,
    players,
    profileChips,
    recentMatches,
    selectedSquadSeason,
    setActiveTab,
    setSelectedSquadSeason,
    squadSeasonOptions,
    standings,
    team,
    teamFacts,
    teamFormEntries,
    teamLeaders,
    totalGoals,
    upcomingMatches,
    user,
  } = useTeamPage();

  const activeContentByTab = {
    overview: (
      <OverviewTab
        currentStanding={currentStanding}
        formRecord={formRecord}
        teamFacts={teamFacts}
        teamFormEntries={teamFormEntries}
        teamLeaders={teamLeaders}
      />
    ),
    matches: (
      <MatchesTab
        recentMatches={recentMatches}
        upcomingMatches={upcomingMatches}
      />
    ),
    squad: (
      <SquadTab
        onSeasonChange={setSelectedSquadSeason}
        players={players}
        seasonOptions={squadSeasonOptions}
        selectedSeason={selectedSquadSeason}
      />
    ),
    records: (
      <RecordsTab
        currentStanding={currentStanding}
        formRecord={formRecord}
        standings={standings}
        teamFormEntries={teamFormEntries}
        teamLeaders={teamLeaders}
      />
    ),
  };

  if(loading){
    return (
      <div className="flex items-center gap-3 text-white">
        <FaSpinner className="animate-spin text-[#8b5cf6]" />
        Loading team...
      </div>
    );
  }

  if(!team){
    return (
      <div className="space-y-4 text-white">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-sm text-[#a78bfa] hover:text-white"
        >
          <FaArrowLeft />
          Back
        </button>
        <NoDataState title="Team Not Found" message={message || "This team does not exist in the database yet."} />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-white">
      <button
        type="button"
        onClick={handleBack}
        className="inline-flex items-center gap-2 text-sm text-[#a78bfa] hover:text-white"
      >
        <FaArrowLeft />
        Back
      </button>

      <TeamProfileHeader
        authLoading={authLoading}
        favoriteLoading={favoriteLoading}
        favoriteMessage={favoriteMessage}
        isFavorite={isFavorite}
        onFavoriteToggle={handleFavoriteToggle}
        profileChips={profileChips}
        team={team}
        user={user}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <TeamSummaryCard label={`Players ${selectedSquadSeason}`} value={players.length} icon={<FaUsers />} />
        <TeamSummaryCard label={currentStanding ? `Rank ${currentStanding.season}` : "Standing Rank"} value={currentStanding ? `#${currentStanding.rank}` : "Not ranked"} icon={<FaCrown />} />
        <TeamSummaryCard label="Recent Matches" value={recentMatches.length} icon={<FaFutbol />} />
        <TeamSummaryCard label="Player Goals" value={totalGoals} icon={<FaStar />} />
      </div>

      <PanelCard className="p-4">
        <TeamTabs activeTab={activeTab} onChange={setActiveTab} tabs={tabs} />

        <div className="mt-4">
          {activeContentByTab[activeTab] || activeContentByTab.overview}
        </div>
      </PanelCard>
    </div>
  );
};

export default TeamPage;
