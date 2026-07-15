import { Link } from "react-router-dom";
import { FaArrowLeft, FaSpinner } from "react-icons/fa";
import MatchStatusBadge from "../components/matches/MatchStatusBadge";
import NoDataState from "../components/matches/NoDataState";
import {
  MatchDetailTabContent,
  ScoreBlock,
  TeamHeader,
  matchDetailTabs,
} from "../components/matchDetail/MatchDetailSections";
import { useMatchDetailPage } from "../hooks/useMatchDetailPage";

const MatchDetailPage = () => {
  const {
    activeTab,
    apiFixtureId,
    details,
    handleActiveStreamsChange,
    isAdmin,
    loading,
    match,
    message,
    overview,
    setActiveTab,
    user,
  } = useMatchDetailPage();

  if(loading){
    return (
      <div className="flex items-center gap-3 text-white">
        <FaSpinner className="animate-spin text-[#8b5cf6]" />
        Loading match detail...
      </div>
    );
  }

  if(!match || !details){
    return (
      <div className="space-y-4 text-white">
        <Link to="/matches" className="inline-flex items-center gap-2 text-sm text-[#a78bfa] hover:text-white">
          <FaArrowLeft />
          Back to matches
        </Link>
        <NoDataState title="Match Not Found" message={message || "This match does not exist in the database yet."} />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-white">
      <Link to="/matches" className="inline-flex items-center gap-2 text-sm text-[#a78bfa] hover:text-white">
        <FaArrowLeft />
        Back to matches
      </Link>

      <section className="rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2a2a2a] pb-4">
          <div>
            <p className="text-sm font-medium text-[#8b5cf6]">{overview?.league?.name || "Unknown League"}</p>
            <h1 className="mt-1 text-2xl font-bold">Match Detail</h1>
          </div>
          <MatchStatusBadge statusShort={overview?.status_short} elapsed={overview?.elapsed} />
        </div>

        <div className="mt-6 grid grid-cols-1 items-center gap-6 xl:grid-cols-[1fr_auto_1fr]">
          <TeamHeader team={overview?.homeTeam} />
          <ScoreBlock overview={overview} goalScorers={details.goal_scorers} />
          <TeamHeader team={overview?.awayTeam} align="right" />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 text-sm md:grid-cols-3">
          <div className="rounded-lg border border-[#2a2a2a] bg-[#111111] p-3">
            <p className="text-xs text-gray-500">Date</p>
            <p className="mt-1 text-white">{overview?.match_date_local || "No Data Yet"}</p>
          </div>
          <div className="rounded-lg border border-[#2a2a2a] bg-[#111111] p-3">
            <p className="text-xs text-gray-500">Time</p>
            <p className="mt-1 text-white">{overview?.match_time_local || "No Data Yet"}</p>
          </div>
          <div className="rounded-lg border border-[#2a2a2a] bg-[#111111] p-3">
            <p className="text-xs text-gray-500">Last Detail Sync</p>
            <p className="mt-1 text-white">{details.last_synced_at ? new Date(details.last_synced_at).toLocaleString() : "No Data Yet"}</p>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] p-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {matchDetailTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`shrink-0 rounded-lg border px-4 py-2 text-sm transition-all ${
                activeTab === tab.key
                  ? "border-[#8b5cf6] bg-[#8b5cf6]/20 text-white"
                  : "border-[#2a2a2a] bg-[#111111] text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-4">
          <MatchDetailTabContent
            activeTab={activeTab}
            apiFixtureId={apiFixtureId}
            details={details}
            handleActiveStreamsChange={handleActiveStreamsChange}
            isAdmin={isAdmin}
            user={user}
          />
        </div>
      </section>
    </div>
  );
};

export default MatchDetailPage;
