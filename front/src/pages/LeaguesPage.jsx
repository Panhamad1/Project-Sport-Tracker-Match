import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
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
import { getLeagueStandings } from "../api/football/FootballApi";
import PanelCard from "../components/common/PanelCard";
import NoDataState from "../components/matches/NoDataState";

const featuredLeagues = [
  { name: "Premier League", apiLeagueId: 39, season: "2024", country: "England" },
  { name: "LaLiga", apiLeagueId: 140, season: "2024", country: "Spain" },
  { name: "Serie A", apiLeagueId: 135, season: "2024", country: "Italy" },
  { name: "Ligue 1", apiLeagueId: 61, season: "2024", country: "France" },
  { name: "Saudi Pro League", apiLeagueId: 307, season: "2024", country: "Saudi Arabia" },
  { name: "MLS", apiLeagueId: 253, season: "2024", country: "USA" },
];

const formStyles = {
  W: "bg-emerald-500/15 text-emerald-300",
  D: "bg-yellow-500/15 text-yellow-300",
  L: "bg-red-500/15 text-red-300",
};

const getDefaultLeague = () => featuredLeagues[0];

const normalizeStanding = (standing) => {
  const standingData = typeof standing.toJSON === "function" ? standing.toJSON() : standing;

  return {
    ...standingData,
    team: standingData.team || {},
  };
};

const groupStandings = (standings) => {
  return standings.reduce((groups, standing) => {
    const groupName = standing.group_name || "League Table";
    const existingGroup = groups.find((group) => group.name === groupName);

    if(existingGroup){
      existingGroup.rows.push(standing);
    }else{
      groups.push({
        name: groupName,
        rows: [standing],
      });
    }

    return groups;
  }, []);
};

const getTeamDisplay = (standing) => {
  return standing.team?.name || "Unknown Team";
};

const getTeamPath = (team) => {
  return team?.api_team_id ? `/teams/${team.api_team_id}` : null;
};

const formatNumber = (value) => {
  if(value === null || value === undefined){
    return "-";
  }

  return value;
};

const FormBadge = ({ letter }) => {
  return (
    <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${formStyles[letter] || "bg-[#1a1a1a] text-gray-400"}`}>
      {letter}
    </span>
  );
};

const LeagueLogo = ({ league, className = "h-12 w-12" }) => {
  if(league?.logo){
    return (
      <img
        src={league.logo}
        alt=""
        className={`${className} rounded-full object-contain`}
      />
    );
  }

  return (
    <span className={`${className} inline-flex items-center justify-center rounded-full bg-[#8b5cf6]/15 text-[#a78bfa]`}>
      <FaTrophy />
    </span>
  );
};

const TeamLogo = ({ team }) => {
  if(team?.logo){
    return (
      <img
        src={team.logo}
        alt=""
        className="h-8 w-8 shrink-0 rounded-full object-contain"
      />
    );
  }

  return (
    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1a1a1a] text-xs text-[#a78bfa]">
      <FaShieldAlt />
    </span>
  );
};

const LeagueSelectorCard = ({ league, active, onSelect }) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(league)}
      className={`w-full rounded-lg border p-4 text-left transition-all ${
        active
          ? "border-[#8b5cf6] bg-[#8b5cf6]/15"
          : "border-[#2a2a2a] bg-[#111111] hover:border-[#8b5cf6]/60"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-semibold text-white">{league.name}</p>
          <p className="mt-1 truncate text-xs text-gray-500">{league.country}</p>
        </div>
        <span className="rounded-full bg-black/25 px-2.5 py-1 text-xs text-[#c4b5fd]">
          {league.apiLeagueId}
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 text-xs text-gray-400">
        <span>Season {league.season}</span>
        {active && <span className="text-[#a78bfa]">Selected</span>}
      </div>
    </button>
  );
};

const SummaryCard = ({ label, value, icon }) => {
  return (
    <PanelCard className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-gray-400">{label}</p>
          <p className="mt-2 text-2xl font-bold text-white">{value}</p>
        </div>
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#8b5cf6]/15 text-[#a78bfa]">
          {icon}
        </span>
      </div>
    </PanelCard>
  );
};

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

const LeaguesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultLeague = getDefaultLeague();
  const selectedLeagueId = Number(searchParams.get("league")) || defaultLeague.apiLeagueId;
  const selectedLeagueConfig = featuredLeagues.find((league) => league.apiLeagueId === selectedLeagueId) || defaultLeague;
  const selectedSeason = searchParams.get("season") || selectedLeagueConfig.season;
  const [league, setLeague] = useState(null);
  const [standings, setStandings] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedLeague = useMemo(() => {
    return league || selectedLeagueConfig;
  }, [league, selectedLeagueConfig]);

  const normalizedStandings = useMemo(() => {
    return standings.map(normalizeStanding);
  }, [standings]);

  const groupedStandings = useMemo(() => {
    return groupStandings(normalizedStandings);
  }, [normalizedStandings]);

  const leader = normalizedStandings[0];
  const totalGoals = useMemo(() => {
    return normalizedStandings.reduce((total, standing) => {
      return total + Number(standing.goals_for || 0);
    }, 0);
  }, [normalizedStandings]);
  const totalPlayed = useMemo(() => {
    return normalizedStandings.reduce((total, standing) => {
      return total + Number(standing.played || 0);
    }, 0);
  }, [normalizedStandings]);

  const handleSelectLeague = (nextLeague) => {
    setSearchParams({
      league: String(nextLeague.apiLeagueId),
      season: String(nextLeague.season),
    });
  };

  const handleSeasonChange = (event) => {
    setSearchParams({
      league: String(selectedLeagueConfig.apiLeagueId),
      season: event.target.value,
    });
  };

  const loadStandings = useCallback(async () => {
    setLoading(true);
    setError("");

    const result = await getLeagueStandings({
      league: selectedLeagueConfig.apiLeagueId,
      season: selectedSeason,
    });

    if(result.ok){
      setLeague(result.data?.league || null);
      setStandings(result.data?.standings || []);
      setMessage(result.data?.message || "League standings loaded successfully");
    }else{
      setLeague(null);
      setStandings([]);
      setMessage("");
      setError(result.data?.message || result.data?.error || "No standings synced for this league yet.");
    }

    setLoading(false);
  }, [selectedLeagueConfig.apiLeagueId, selectedSeason]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadStandings();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadStandings]);

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
              <SummaryCard label="Leader" value={leader ? getTeamDisplay(leader) : "No leader yet"} icon={<FaCrown />} />
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
