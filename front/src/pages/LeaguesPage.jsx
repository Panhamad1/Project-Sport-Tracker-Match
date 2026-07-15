import {
  FaCalendarAlt,
  FaCrown,
  FaFlag,
  FaShieldAlt,
  FaSpinner,
  FaSyncAlt,
  FaTable,
  FaTrophy,
} from "react-icons/fa";
import PanelCard from "../components/common/PanelCard";
import LeagueLogo from "../components/leagues/LeagueLogo";
import LeagueSelectorCard from "../components/leagues/LeagueSelectorCard";
import StandingsTable from "../components/leagues/StandingsTable";
import SummaryCard from "../components/leagues/SummaryCard";
import NoDataState from "../components/matches/NoDataState";
import { useLeaguesPage } from "../hooks/useLeaguesPage";

const LeaguesPage = () => {
  const {
    error,
    featuredLeagues,
    groupedStandings,
    handleSeasonChange,
    handleSelectLeague,
    leaderName,
    loadStandings,
    loading,
    message,
    normalizedStandings,
    selectedLeague,
    selectedLeagueConfig,
    selectedSeason,
    totalGoals,
    totalPlayed,
  } = useLeaguesPage();

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-medium text-[#8b5cf6]">Leagues</p>
          <h1 className="mt-1 text-2xl font-bold">League Standings</h1>
          <p className="mt-2 max-w-3xl text-sm text-gray-400">
            View saved domestic league tables and teams from the database. Admin sync controls when new league data appears here.
          </p>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <label className="min-w-[180px] text-sm text-gray-300">
            Season
            <input
              type="number"
              value={selectedSeason}
              onChange={handleSeasonChange}
              className="mt-1 h-11 w-full rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 text-white outline-none transition-colors focus:border-[#8b5cf6]"
            />
          </label>

          <button
            type="button"
            onClick={loadStandings}
            disabled={loading}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-4 text-sm font-medium text-white transition-all hover:bg-[#2a2a2a] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <FaSpinner className="animate-spin" /> : <FaSyncAlt />}
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 2xl:grid-cols-[330px_1fr]">
        <aside className="space-y-5">
          <PanelCard className="p-5">
            <h2 className="flex items-center gap-2 font-semibold">
              <FaCrown className="text-[#8b5cf6]" />
              Saved Leagues
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-1">
              {featuredLeagues.map((leagueItem) => (
                <LeagueSelectorCard
                  key={leagueItem.apiLeagueId}
                  league={leagueItem}
                  active={selectedLeagueConfig.apiLeagueId === leagueItem.apiLeagueId}
                  onSelect={handleSelectLeague}
                />
              ))}
            </div>
          </PanelCard>
        </aside>

        <main className="min-w-0 space-y-5">
          <PanelCard className="overflow-hidden">
            <div className="bg-[#111111] p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                  <LeagueLogo league={selectedLeague} />
                  <div className="min-w-0">
                    <h2 className="truncate text-xl font-bold">{selectedLeague.name}</h2>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-400">
                      <span className="inline-flex items-center gap-2 rounded-full bg-black/25 px-3 py-1">
                        <FaFlag className="text-[#a78bfa]" />
                        {selectedLeague.country || selectedLeagueConfig.country || "Unknown Country"}
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full bg-black/25 px-3 py-1">
                        <FaCalendarAlt className="text-[#a78bfa]" />
                        Season {selectedSeason}
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full bg-black/25 px-3 py-1">
                        <FaTrophy className="text-[#a78bfa]" />
                        League {selectedLeagueConfig.apiLeagueId}
                      </span>
                    </div>
                  </div>
                </div>

                <span className="rounded-full bg-[#8b5cf6]/15 px-3 py-1 text-xs text-[#a78bfa]">
                  {error || message || "Loading league data"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 border-t border-[#2a2a2a] p-5 md:grid-cols-2 xl:grid-cols-4">
              <SummaryCard label="Teams" value={normalizedStandings.length} icon={<FaShieldAlt />} />
              <SummaryCard label="Matches Played" value={totalPlayed} icon={<FaTable />} />
              <SummaryCard label="Leader" value={leaderName} icon={<FaCrown />} />
              <SummaryCard label="Goals For" value={totalGoals} icon={<FaTrophy />} />
            </div>
          </PanelCard>

          <PanelCard className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="flex items-center gap-2 font-semibold">
                  <FaTable className="text-[#8b5cf6]" />
                  Standings
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  {error || message || "Standings are loaded from saved league data."}
                </p>
              </div>
              <span className="rounded-full bg-[#8b5cf6]/15 px-3 py-1 text-xs text-[#a78bfa]">
                {normalizedStandings.length} teams
              </span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center gap-3 py-16 text-gray-400">
                <FaSpinner className="animate-spin text-[#8b5cf6]" />
                Loading standings...
              </div>
            ) : normalizedStandings.length === 0 ? (
              <div className="mt-5">
                <NoDataState
                  title="No Standings Synced Yet"
                  message="Sync this league and season from the admin panel before the table can appear here."
                />
              </div>
            ) : (
              <div className="mt-5 space-y-5">
                {groupedStandings.map((group) => (
                  <StandingsTable key={group.name} group={group} />
                ))}
              </div>
            )}
          </PanelCard>
        </main>
      </div>
    </div>
  );
};

export default LeaguesPage;
