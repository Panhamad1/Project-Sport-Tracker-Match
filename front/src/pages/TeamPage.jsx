import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaCrown,
  FaFutbol,
  FaHeart,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaSpinner,
  FaStar,
  FaTrophy,
  FaUsers,
} from "react-icons/fa";
import { addFavoriteTeam, getFavoriteTeams, removeFavoriteTeam } from "../api/football/FavoriteTeamApi";
import { getTeamById } from "../api/football/FootballApi";
import PanelCard from "../components/common/PanelCard";
import MatchCard from "../components/matches/MatchCard";
import NoDataState from "../components/matches/NoDataState";
import { useAuth } from "../hooks/useAuth";

const hasValue = (value) => value !== null && value !== undefined && value !== "";
const finishedStatuses = ["FT", "AET", "PEN"];
const formBadgeStyles = {
  W: "bg-emerald-500/15 text-emerald-300",
  D: "bg-yellow-500/15 text-yellow-300",
  L: "bg-red-500/15 text-red-300",
};
const tabs = [
  { key: "overview", label: "Overview" },
  { key: "matches", label: "Matches" },
  { key: "squad", label: "Squad" },
  { key: "records", label: "Records" },
];
const squadSeasonFallbackOptions = ["2024", "2023", "2022"];

const formatNumber = (value) => {
  if(value === null || value === undefined){
    return "-";
  }

  return value;
};

const getFavoriteList = (responseData) => {
  return responseData?.result || responseData?.favorites || [];
};

const getScoreText = (fixture) => {
  if(fixture.home_goals === null || fixture.home_goals === undefined || fixture.away_goals === null || fixture.away_goals === undefined){
    return fixture.match_time_local || "TBD";
  }

  return `${fixture.home_goals} - ${fixture.away_goals}`;
};

const getTeamGoals = (fixture, apiTeamId) => {
  const homeTeamId = Number(fixture.homeTeam?.api_team_id);
  const awayTeamId = Number(fixture.awayTeam?.api_team_id);
  const teamId = Number(apiTeamId);
  const homeGoals = fixture.home_goals;
  const awayGoals = fixture.away_goals;

  if(homeGoals === null || homeGoals === undefined || awayGoals === null || awayGoals === undefined){
    return null;
  }

  if(homeTeamId === teamId){
    return {
      goalsFor: Number(homeGoals),
      goalsAgainst: Number(awayGoals),
      opponent: fixture.awayTeam,
      homeAway: "Home",
    };
  }

  if(awayTeamId === teamId){
    return {
      goalsFor: Number(awayGoals),
      goalsAgainst: Number(homeGoals),
      opponent: fixture.homeTeam,
      homeAway: "Away",
    };
  }

  return null;
};

const getResultLetter = ({ goalsFor, goalsAgainst }) => {
  if(goalsFor > goalsAgainst){
    return "W";
  }

  if(goalsFor === goalsAgainst){
    return "D";
  }

  return "L";
};

const buildTeamForm = (matches, apiTeamId) => {
  return matches
    .filter((fixture) => finishedStatuses.includes(fixture.status_short))
    .map((fixture) => {
      const teamGoals = getTeamGoals(fixture, apiTeamId);

      if(!teamGoals){
        return null;
      }

      return {
        ...teamGoals,
        fixture,
        result: getResultLetter(teamGoals),
      };
    })
    .filter(Boolean)
    .slice(0, 5);
};

const buildMatchRecord = (formEntries) => {
  return formEntries.reduce((record, entry) => {
    if(entry.result === "W"){
      record.wins += 1;
    }else if(entry.result === "D"){
      record.draws += 1;
    }else if(entry.result === "L"){
      record.losses += 1;
    }

    record.goalsFor += entry.goalsFor;
    record.goalsAgainst += entry.goalsAgainst;

    return record;
  }, {
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
  });
};

const getPlayerStatNumber = (player, field) => Number(player?.[field] || 0);

const getCompetitionLabel = (player) => {
  if(Number(player.competitions_count || 0) > 1){
    return `${player.league?.name || "Multiple competitions"} +${Number(player.competitions_count) - 1}`;
  }

  return player.league?.name || `Season ${player.season}`;
};

const getCompetitionTitle = (player) => {
  if(!Array.isArray(player.competitions) || player.competitions.length === 0){
    return "";
  }

  return player.competitions.map((competition) => competition.name).filter(Boolean).join(", ");
};

const getTopPlayerByField = (players, field) => {
  return players.reduce((leader, player) => {
    if(!leader){
      return player;
    }

    return getPlayerStatNumber(player, field) > getPlayerStatNumber(leader, field) ? player : leader;
  }, null);
};

const buildTeamLeaders = (players) => {
  const leaderConfigs = [
    { key: "goals", label: "Top Scorer", statLabel: "Goals", field: "goals" },
    { key: "assists", label: "Creator", statLabel: "Assists", field: "assists" },
    { key: "appearances", label: "Most Used", statLabel: "Apps", field: "appearances" },
    { key: "minutes", label: "Minutes Leader", statLabel: "Minutes", field: "minutes" },
  ];

  return leaderConfigs
    .map((config) => {
      const player = getTopPlayerByField(players, config.field);
      const value = getPlayerStatNumber(player, config.field);

      return value > 0 ? {
        ...config,
        player,
        value,
      } : null;
    })
    .filter(Boolean);
};

const TeamLogo = ({ team }) => {
  if(team?.logo){
    return (
      <img
        src={team.logo}
        alt=""
        className="h-20 w-20 rounded-full object-contain sm:h-24 sm:w-24"
      />
    );
  }

  return (
    <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-[#8b5cf6]/15 text-3xl text-[#a78bfa] sm:h-24 sm:w-24">
      <FaShieldAlt />
    </span>
  );
};

const SummaryCard = ({ label, value, icon }) => {
  return (
    <PanelCard className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-gray-400">{label}</p>
          <p className="mt-2 truncate text-2xl font-bold text-white">{value}</p>
        </div>
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#8b5cf6]/15 text-[#a78bfa]">
          {icon}
        </span>
      </div>
    </PanelCard>
  );
};

const InfoItem = ({ icon, label, value }) => {
  if(!hasValue(value)){
    return null;
  }

  return (
    <div className="rounded-lg border border-[#2a2a2a] bg-[#111111] p-4">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span className="text-[#8b5cf6]">{icon}</span>
        {label}
      </div>
      <p className="mt-2 text-sm font-medium text-white">{value}</p>
    </div>
  );
};

const StandingCard = ({ standing }) => {
  return (
    <div className="rounded-lg border border-[#2a2a2a] bg-[#111111] p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">{standing.league?.name || `Season ${standing.season}`}</p>
          <p className="mt-1 text-xs text-gray-500">Season {standing.season}</p>
        </div>
        <span className="rounded-full bg-[#8b5cf6]/15 px-3 py-1 text-sm font-bold text-[#c4b5fd]">
          #{formatNumber(standing.rank)}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs">
        <div className="rounded bg-black/25 p-2">
          <p className="text-gray-500">PL</p>
          <p className="mt-1 font-semibold text-white">{formatNumber(standing.played)}</p>
        </div>
        <div className="rounded bg-black/25 p-2">
          <p className="text-gray-500">W</p>
          <p className="mt-1 font-semibold text-white">{formatNumber(standing.win)}</p>
        </div>
        <div className="rounded bg-black/25 p-2">
          <p className="text-gray-500">GD</p>
          <p className="mt-1 font-semibold text-white">{formatNumber(standing.goals_diff)}</p>
        </div>
        <div className="rounded bg-black/25 p-2">
          <p className="text-gray-500">PTS</p>
          <p className="mt-1 font-semibold text-white">{formatNumber(standing.points)}</p>
        </div>
      </div>
    </div>
  );
};

const MiniStat = ({ label, value }) => {
  return (
    <div className="rounded-lg bg-black/25 p-3 text-center">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-white">{formatNumber(value)}</p>
    </div>
  );
};

const SeasonRecordPanel = ({ standing }) => {
  if(!standing){
    return (
      <PanelCard className="p-5">
        <h2 className="flex items-center gap-2 font-semibold text-white">
          <FaTrophy className="text-[#8b5cf6]" />
          Season Record
        </h2>
        <div className="mt-4">
          <NoDataState message="No league standing row is saved for this team yet." />
        </div>
      </PanelCard>
    );
  }

  return (
    <PanelCard className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 font-semibold text-white">
            <FaTrophy className="text-[#8b5cf6]" />
            Season {standing.season} Record
          </h2>
          <p className="mt-1 text-xs text-gray-500">{standing.league?.name || "Saved League"}</p>
        </div>
        <span className="rounded-full bg-[#8b5cf6]/15 px-3 py-1 text-sm font-bold text-[#c4b5fd]">
          {standing.season} Rank #{formatNumber(standing.rank)}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2">
        <MiniStat label="PL" value={standing.played} />
        <MiniStat label="W" value={standing.win} />
        <MiniStat label="D" value={standing.draw} />
        <MiniStat label="L" value={standing.lose} />
        <MiniStat label="GF" value={standing.goals_for} />
        <MiniStat label="GA" value={standing.goals_against} />
        <MiniStat label="GD" value={standing.goals_diff} />
        <MiniStat label="PTS" value={standing.points} />
      </div>
    </PanelCard>
  );
};

const FormBadge = ({ result }) => {
  return (
    <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${formBadgeStyles[result] || "bg-[#1a1a1a] text-gray-300"}`}>
      {result}
    </span>
  );
};

const TeamFormPanel = ({ formEntries, record }) => {
  return (
    <PanelCard className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 font-semibold text-white">
            <FaFutbol className="text-[#8b5cf6]" />
            Recent Form
          </h2>
          <p className="mt-1 text-xs text-gray-500">Last finished matches saved in the database.</p>
        </div>
        {formEntries.length > 0 && (
          <div className="flex gap-1">
            {formEntries.map((entry) => (
              <FormBadge key={entry.fixture.api_fixture_id} result={entry.result} />
            ))}
          </div>
        )}
      </div>

      {formEntries.length === 0 ? (
        <div className="mt-4">
          <NoDataState message="No finished fixtures are saved for this team yet." />
        </div>
      ) : (
        <>
          <div className="mt-4 grid grid-cols-5 gap-2">
            <MiniStat label="W" value={record.wins} />
            <MiniStat label="D" value={record.draws} />
            <MiniStat label="L" value={record.losses} />
            <MiniStat label="GF" value={record.goalsFor} />
            <MiniStat label="GA" value={record.goalsAgainst} />
          </div>

          <div className="mt-4 space-y-2">
            {formEntries.map((entry) => (
              <Link
                key={entry.fixture.api_fixture_id}
                to={`/matches/${entry.fixture.public_match_id || entry.fixture.api_fixture_id}`}
                className="flex items-center gap-3 rounded-lg border border-[#2a2a2a] bg-[#111111] p-3 transition-all hover:border-[#8b5cf6]/50"
              >
                <FormBadge result={entry.result} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">
                    {entry.homeAway} vs {entry.opponent?.name || "Opponent"}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">{entry.fixture.match_date_local || ""}</p>
                </div>
                <span className="rounded bg-black/35 px-3 py-1 text-sm font-bold text-white">
                  {entry.goalsFor} - {entry.goalsAgainst}
                </span>
              </Link>
            ))}
          </div>
        </>
      )}
    </PanelCard>
  );
};

const TeamLeadersPanel = ({ leaders }) => {
  return (
    <PanelCard className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 font-semibold text-white">
            <FaStar className="text-[#8b5cf6]" />
            Team Leaders
          </h2>
          <p className="mt-1 text-xs text-gray-500">Top players from synced statistics.</p>
        </div>
        <span className="rounded-full bg-[#8b5cf6]/15 px-3 py-1 text-xs text-[#a78bfa]">
          {leaders.length}
        </span>
      </div>

      {leaders.length === 0 ? (
        <div className="mt-4">
          <NoDataState message="Sync players for this team to show leaders." />
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
          {leaders.map((leader) => (
            <div key={leader.key} className="flex items-center gap-3 rounded-lg border border-[#2a2a2a] bg-[#111111] p-3">
              {leader.player.photo ? (
                <img src={leader.player.photo} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover" />
              ) : (
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1a1a1a] text-[#a78bfa]">
                  <FaUsers />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-[#a78bfa]">{leader.label}</p>
                <p className="truncate text-sm font-semibold text-white">{leader.player.name || "Player"}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-white">{leader.value}</p>
                <p className="text-[11px] text-gray-500">{leader.statLabel}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </PanelCard>
  );
};

const CompactMatchCard = ({ fixture }) => {
  return (
    <Link
      to={`/matches/${fixture.public_match_id || fixture.api_fixture_id}`}
      className="block rounded-lg border border-[#2a2a2a] bg-[#111111] p-4 transition-all hover:border-[#8b5cf6]/50"
    >
      <div className="flex items-center justify-between gap-3 text-xs text-gray-500">
        <span className="truncate">{fixture.league?.name || "Saved match"}</span>
        <span className="shrink-0">{fixture.match_date_local || ""}</span>
      </div>
      <div className="mt-3 grid grid-cols-1 items-center gap-2 text-center sm:grid-cols-[1fr_auto_1fr] sm:text-left">
        <p className="truncate text-sm font-semibold text-white">{fixture.homeTeam?.name || "Home"}</p>
        <p className="mx-auto rounded bg-black/35 px-3 py-1 text-sm font-bold text-white">{getScoreText(fixture)}</p>
        <p className="truncate text-sm font-semibold text-white sm:text-right">{fixture.awayTeam?.name || "Away"}</p>
      </div>
    </Link>
  );
};

const MatchSection = ({ title, matches, emptyMessage, fullCards = false }) => {
  return (
    <PanelCard className="p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-semibold text-white">
          <FaFutbol className="text-[#8b5cf6]" />
          {title}
        </h2>
        <span className="rounded-full bg-[#8b5cf6]/15 px-3 py-1 text-xs text-[#a78bfa]">
          {matches.length}
        </span>
      </div>

      {matches.length === 0 ? (
        <NoDataState message={emptyMessage} />
      ) : (
        <div className={`grid grid-cols-1 gap-4 ${fullCards ? "2xl:grid-cols-2" : ""}`}>
          {matches.map((fixture) => (
            fullCards ? (
              <MatchCard key={fixture.api_fixture_id} fixture={fixture} />
            ) : (
              <CompactMatchCard key={fixture.api_fixture_id} fixture={fixture} />
            )
          ))}
        </div>
      )}
    </PanelCard>
  );
};

const PlayerTable = ({ players }) => {
  if(players.length === 0){
    return (
      <NoDataState
        title="No Players Synced Yet"
        message="Sync players for this team from the admin panel before the squad appears here."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[860px] text-left text-sm">
        <thead className="bg-[#111111] text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3 font-medium">Player</th>
            <th className="px-4 py-3 font-medium">Position</th>
            <th className="px-4 py-3 font-medium">League</th>
            <th className="px-4 py-3 text-right font-medium">Apps</th>
            <th className="px-4 py-3 text-right font-medium">Minutes</th>
            <th className="px-4 py-3 text-right font-medium">Goals</th>
            <th className="px-4 py-3 text-right font-medium">Assists</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={`${player.api_player_id}-${player.league?.api_league_id}-${player.season}`} className="border-t border-[#2a2a2a]">
              <td className="px-4 py-4">
                <div className="flex min-w-0 items-center gap-3">
                  {player.photo ? (
                    <img src={player.photo} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover" />
                  ) : (
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1a1a1a] text-xs text-[#a78bfa]">
                      <FaUsers />
                    </span>
                  )}
                  <div className="min-w-0">
                    {player.api_player_id ? (
                      <Link to={`/players/${player.api_player_id}`} className="truncate font-semibold text-white transition-colors hover:text-[#a78bfa]">
                        {player.name || "Player"}
                      </Link>
                    ) : (
                      <p className="truncate font-semibold text-white">{player.name || "Player"}</p>
                    )}
                    {player.nationality && (
                      <p className="truncate text-xs text-gray-500">{player.nationality}</p>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 text-gray-300">{player.position || "POS"}</td>
              <td className="px-4 py-4 text-gray-300" title={getCompetitionTitle(player)}>
                {getCompetitionLabel(player)}
              </td>
              <td className="px-4 py-4 text-right text-gray-300">{formatNumber(player.appearances)}</td>
              <td className="px-4 py-4 text-right text-gray-300">{formatNumber(player.minutes)}</td>
              <td className="px-4 py-4 text-right text-gray-300">{formatNumber(player.goals)}</td>
              <td className="px-4 py-4 text-right text-gray-300">{formatNumber(player.assists)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const OverviewTab = ({ currentStanding, formRecord, teamFacts, teamFormEntries, teamLeaders }) => {
  return (
    <div className="space-y-5">
      {teamFacts.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {teamFacts.map((fact) => (
            <InfoItem key={fact.key} icon={fact.icon} label={fact.label} value={fact.value} />
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

const MatchesTab = ({ recentMatches, upcomingMatches }) => {
  return (
    <div className="space-y-5">
      <MatchSection
        title="Upcoming Matches"
        matches={upcomingMatches}
        emptyMessage="No upcoming matches are saved for this team yet."
      />

      <MatchSection
        title="Recent Matches"
        matches={recentMatches}
        emptyMessage="No recent matches are saved for this team yet."
        fullCards
      />
    </div>
  );
};

const SquadTab = ({ onSeasonChange, players, seasonOptions, selectedSeason }) => {
  return (
    <PanelCard className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2a2a2a] p-5">
        <div>
          <h2 className="flex items-center gap-2 font-semibold text-white">
            <FaUsers className="text-[#8b5cf6]" />
            Squad
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Player data comes from synced team statistics.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-gray-400">
            Season
            <select
              value={selectedSeason}
              onChange={(event) => onSeasonChange(event.target.value)}
              className="rounded-lg border border-[#2a2a2a] bg-[#111111] px-3 py-2 text-sm text-white outline-none transition-colors focus:border-[#8b5cf6]"
            >
              {seasonOptions.map((season) => (
                <option key={season} value={season}>
                  {season}
                </option>
              ))}
            </select>
          </label>
          <span className="rounded-full bg-[#8b5cf6]/15 px-3 py-1 text-xs text-[#a78bfa]">
            {players.length} players
          </span>
        </div>
      </div>
      <div className="p-5">
        <PlayerTable players={players} />
      </div>
    </PanelCard>
  );
};

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

const TeamPage = () => {
  const { teamApiId } = useParams();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [team, setTeam] = useState(null);
  const [standings, setStandings] = useState([]);
  const [players, setPlayers] = useState([]);
  const [squadSeasons, setSquadSeasons] = useState([]);
  const [selectedSquadSeason, setSelectedSquadSeason] = useState("2024");
  const [recentMatches, setRecentMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteMessage, setFavoriteMessage] = useState("");

  const currentStanding = standings[0];
  const profileChips = [
    { key: "team", label: `Team ${team?.api_team_id}` },
    currentStanding?.league?.api_league_id ? { key: "league", label: `League ${currentStanding.league.api_league_id}` } : null,
    currentStanding?.season ? { key: "season", label: `Season ${currentStanding.season}` } : null,
    team?.country ? { key: "country", label: team.country } : null,
    team?.founded ? { key: "founded", label: `Founded ${team.founded}` } : null,
  ].filter(Boolean);
  const teamFacts = [
    team?.venue_name ? { key: "venue", icon: <FaMapMarkerAlt />, label: "Venue", value: team.venue_name } : null,
    team?.venue_city ? { key: "city", icon: <FaMapMarkerAlt />, label: "City", value: team.venue_city } : null,
    team?.last_updated ? { key: "updated", icon: <FaCalendarAlt />, label: "Last Updated", value: new Date(team.last_updated).toLocaleString() } : null,
    currentStanding?.league?.name ? { key: "league", icon: <FaTrophy />, label: `League ${currentStanding.season}`, value: currentStanding.league.name } : null,
  ].filter(Boolean);
  const totalGoals = useMemo(() => {
    return players.reduce((total, player) => total + Number(player.goals || 0), 0);
  }, [players]);
  const squadSeasonOptions = useMemo(() => {
    const savedSeasons = squadSeasons.length > 0 ? squadSeasons : squadSeasonFallbackOptions;

    return Array.from(new Set([selectedSquadSeason, ...savedSeasons].filter(Boolean).map(String)));
  }, [selectedSquadSeason, squadSeasons]);
  const teamFormEntries = useMemo(() => {
    return buildTeamForm(recentMatches, team?.api_team_id);
  }, [recentMatches, team]);
  const formRecord = useMemo(() => {
    return buildMatchRecord(teamFormEntries);
  }, [teamFormEntries]);
  const teamLeaders = useMemo(() => {
    return buildTeamLeaders(players);
  }, [players]);
  const activeContent = useMemo(() => {
    const renderers = {
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

    return renderers[activeTab] || renderers.overview;
  }, [
    activeTab,
    currentStanding,
    formRecord,
    players,
    recentMatches,
    selectedSquadSeason,
    standings,
    squadSeasonOptions,
    teamFacts,
    teamFormEntries,
    teamLeaders,
    upcomingMatches,
  ]);

  const loadTeam = useCallback(async () => {
    setLoading(true);

    const result = await getTeamById(teamApiId, { season: selectedSquadSeason });

    if(result.ok){
      const nextSquadSeasons = (result.data?.player_seasons || []).map(String);

      setTeam(result.data?.team || null);
      setStandings(result.data?.standings || []);
      setPlayers(result.data?.players || []);
      setSquadSeasons(nextSquadSeasons);
      setRecentMatches(result.data?.recent_matches || []);
      setUpcomingMatches(result.data?.upcoming_matches || []);
      setMessage(result.data?.message || "Team loaded successfully");
    }else{
      setTeam(null);
      setStandings([]);
      setPlayers([]);
      setSquadSeasons([]);
      setRecentMatches([]);
      setUpcomingMatches([]);
      setMessage(result.data?.message || result.data?.error || "Failed to load team");
    }

    setLoading(false);
  }, [selectedSquadSeason, teamApiId]);

  const loadFavoriteStatus = useCallback(async () => {
    if(!user || !team?.id){
      setIsFavorite(false);
      return;
    }

    const result = await getFavoriteTeams();

    if(result.ok){
      const favorites = getFavoriteList(result.data);
      setIsFavorite(favorites.some((item) => item.team_id === team.id || item.team?.id === team.id));
    }
  }, [team, user]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadTeam();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadTeam]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadFavoriteStatus();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadFavoriteStatus]);

  const handleFavoriteToggle = async () => {
    if(!team?.id || !user){
      return;
    }

    setFavoriteLoading(true);
    setFavoriteMessage("");

    const result = isFavorite
      ? await removeFavoriteTeam(team.id)
      : await addFavoriteTeam(team.id);

    if(result.ok){
      setIsFavorite(!isFavorite);
      setFavoriteMessage(result.data?.message || (isFavorite ? "Removed from favorites" : "Added to favorites"));
    }else{
      setFavoriteMessage(result.data?.message || result.data?.error || "Failed to update favorite team");
    }

    setFavoriteLoading(false);
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
        <Link to="/leagues" className="inline-flex items-center gap-2 text-sm text-[#a78bfa] hover:text-white">
          <FaArrowLeft />
          Back to leagues
        </Link>
        <NoDataState title="Team Not Found" message={message || "This team does not exist in the database yet."} />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-white">
      <Link to="/leagues" className="inline-flex items-center gap-2 text-sm text-[#a78bfa] hover:text-white">
        <FaArrowLeft />
        Back to leagues
      </Link>

      <PanelCard className="overflow-hidden">
        <div className="p-5">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center">
              <TeamLogo team={team} />
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#8b5cf6]">Team Profile</p>
                <h1 className="mt-1 truncate text-3xl font-bold">{team.name}</h1>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-400">
                  {profileChips.map((chip) => (
                    <span key={chip.key} className="rounded-full bg-[#111111] px-3 py-1">{chip.label}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start gap-2 xl:items-end">
              {user ? (
                <button
                  type="button"
                  onClick={handleFavoriteToggle}
                  disabled={favoriteLoading}
                  className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all disabled:cursor-not-allowed ${
                    isFavorite
                      ? "border border-red-500/25 bg-red-500/10 text-red-200 hover:bg-red-500/20"
                      : "bg-[#8b5cf6] text-white hover:bg-[#7c3aed]"
                  }`}
                >
                  {favoriteLoading ? <FaSpinner className="animate-spin" /> : <FaHeart />}
                  {isFavorite ? "Remove Favorite" : "Add Favorite"}
                </button>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#8b5cf6] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#7c3aed]"
                >
                  <FaHeart />
                  Login to Favorite
                </Link>
              )}
              <p className="min-h-4 text-xs text-gray-500">
                {authLoading ? "Checking account..." : favoriteMessage}
              </p>
            </div>
          </div>
        </div>

      </PanelCard>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label={`Players ${selectedSquadSeason}`} value={players.length} icon={<FaUsers />} />
        <SummaryCard label={currentStanding ? `Rank ${currentStanding.season}` : "Standing Rank"} value={currentStanding ? `#${currentStanding.rank}` : "Not ranked"} icon={<FaCrown />} />
        <SummaryCard label="Recent Matches" value={recentMatches.length} icon={<FaFutbol />} />
        <SummaryCard label="Player Goals" value={totalGoals} icon={<FaStar />} />
      </div>

      <PanelCard className="p-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
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
          {activeContent}
        </div>
      </PanelCard>
    </div>
  );
};

export default TeamPage;
