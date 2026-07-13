import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaFutbol,
  FaIdBadge,
  FaRunning,
  FaShieldAlt,
  FaSpinner,
  FaStar,
  FaTrophy,
  FaUser,
} from "react-icons/fa";
import { getPlayerById } from "../api/football/FootballApi";
import PanelCard from "../components/common/PanelCard";
import NoDataState from "../components/matches/NoDataState";

const tabs = [
  { key: "overview", label: "Overview" },
  { key: "statistics", label: "Statistics" },
  { key: "clubs", label: "Clubs" },
];
const statisticSeasonFallbackOptions = ["2024", "2023", "2022"];

const hasValue = (value) => value !== null && value !== undefined && value !== "";

const formatNumber = (value) => {
  if(value === null || value === undefined){
    return "-";
  }

  return value;
};

const sumField = (statistics, field) => {
  return statistics.reduce((total, statistic) => total + Number(statistic[field] || 0), 0);
};

const getPrimaryStatistic = (statistics) => {
  return statistics[0] || null;
};

const buildCareerSummary = (statistics) => {
  return {
    appearances: sumField(statistics, "appearances"),
    minutes: sumField(statistics, "minutes"),
    goals: sumField(statistics, "goals"),
    assists: sumField(statistics, "assists"),
    yellow_cards: sumField(statistics, "yellow_cards"),
    red_cards: sumField(statistics, "red_cards"),
  };
};

const buildClubRows = (statistics) => {
  const rowsByTeam = new Map();

  statistics.forEach((statistic) => {
    const teamKey = statistic.team?.api_team_id || `team-${statistic.team?.name || statistic.season}`;
    const current = rowsByTeam.get(teamKey) || {
      team: statistic.team,
      seasons: new Set(),
      leagues: new Set(),
      appearances: 0,
      goals: 0,
      assists: 0,
      minutes: 0,
    };

    if(statistic.season){
      current.seasons.add(statistic.season);
    }

    if(statistic.league?.name){
      current.leagues.add(statistic.league.name);
    }

    current.appearances += Number(statistic.appearances || 0);
    current.goals += Number(statistic.goals || 0);
    current.assists += Number(statistic.assists || 0);
    current.minutes += Number(statistic.minutes || 0);

    rowsByTeam.set(teamKey, current);
  });

  return Array.from(rowsByTeam.values()).map((row) => ({
    ...row,
    seasons: Array.from(row.seasons).sort((a, b) => b - a),
    leagues: Array.from(row.leagues),
  }));
};

const PlayerPhoto = ({ player }) => {
  if(player?.photo){
    return (
      <img
        src={player.photo}
        alt=""
        className="h-24 w-24 rounded-full object-cover sm:h-28 sm:w-28"
      />
    );
  }

  return (
    <span className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-[#8b5cf6]/15 text-4xl text-[#a78bfa] sm:h-28 sm:w-28">
      <FaUser />
    </span>
  );
};

const TeamLogo = ({ team }) => {
  if(team?.logo){
    return <img src={team.logo} alt="" className="h-9 w-9 shrink-0 rounded-full object-contain" />;
  }

  return (
    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1a1a1a] text-[#a78bfa]">
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

const OverviewTab = ({ facts, primaryStatistic, selectedSeason, summary }) => {
  return (
    <div className="space-y-5">
      {facts.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {facts.map((fact) => (
            <InfoItem key={fact.key} icon={fact.icon} label={fact.label} value={fact.value} />
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

const SummaryMini = ({ label, value }) => {
  return (
    <div className="rounded-lg bg-black/25 p-3 text-center">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-white">{formatNumber(value)}</p>
    </div>
  );
};

const StatisticsTable = ({ statistics }) => {
  if(statistics.length === 0){
    return (
      <NoDataState
        title="No Player Statistics"
        message="Sync this player through team player sync before statistics appear here."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[920px] text-left text-sm">
        <thead className="bg-[#111111] text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3 font-medium">Season</th>
            <th className="px-4 py-3 font-medium">Team</th>
            <th className="px-4 py-3 font-medium">League</th>
            <th className="px-4 py-3 font-medium">Position</th>
            <th className="px-4 py-3 text-right font-medium">Apps</th>
            <th className="px-4 py-3 text-right font-medium">Minutes</th>
            <th className="px-4 py-3 text-right font-medium">Goals</th>
            <th className="px-4 py-3 text-right font-medium">Assists</th>
            <th className="px-4 py-3 text-right font-medium">Cards</th>
          </tr>
        </thead>
        <tbody>
          {statistics.map((statistic) => (
            <tr key={`${statistic.team?.api_team_id}-${statistic.league?.api_league_id}-${statistic.season}`} className="border-t border-[#2a2a2a]">
              <td className="px-4 py-4 text-gray-300">{statistic.season}</td>
              <td className="px-4 py-4">
                {statistic.team?.api_team_id ? (
                  <Link to={`/teams/${statistic.team.api_team_id}`} className="flex min-w-0 items-center gap-3 transition-colors hover:text-[#a78bfa]">
                    <TeamLogo team={statistic.team} />
                    <span className="truncate font-semibold text-white">{statistic.team?.name || "Saved Team"}</span>
                  </Link>
                ) : (
                  <div className="flex min-w-0 items-center gap-3">
                    <TeamLogo team={statistic.team} />
                    <span className="truncate font-semibold text-white">{statistic.team?.name || "Saved Team"}</span>
                  </div>
                )}
              </td>
              <td className="px-4 py-4 text-gray-300">{statistic.league?.name || "Saved League"}</td>
              <td className="px-4 py-4 text-gray-300">{statistic.position || "POS"}</td>
              <td className="px-4 py-4 text-right text-gray-300">{formatNumber(statistic.appearances)}</td>
              <td className="px-4 py-4 text-right text-gray-300">{formatNumber(statistic.minutes)}</td>
              <td className="px-4 py-4 text-right text-gray-300">{formatNumber(statistic.goals)}</td>
              <td className="px-4 py-4 text-right text-gray-300">{formatNumber(statistic.assists)}</td>
              <td className="px-4 py-4 text-right text-gray-300">
                {formatNumber(statistic.yellow_cards)} / {formatNumber(statistic.red_cards)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const StatisticsTab = ({ statistics }) => {
  return (
    <PanelCard className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2a2a2a] p-5">
        <div>
          <h2 className="flex items-center gap-2 font-semibold text-white">
            <FaRunning className="text-[#8b5cf6]" />
            Season Statistics
          </h2>
          <p className="mt-1 text-xs text-gray-500">Stats are loaded from saved player statistics.</p>
        </div>
        <span className="rounded-full bg-[#8b5cf6]/15 px-3 py-1 text-xs text-[#a78bfa]">
          {statistics.length} rows
        </span>
      </div>
      <div className="p-5">
        <StatisticsTable statistics={statistics} />
      </div>
    </PanelCard>
  );
};

const ClubsTab = ({ clubRows }) => {
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

const PlayerPage = () => {
  const { playerApiId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [player, setPlayer] = useState(null);
  const [statistics, setStatistics] = useState([]);
  const [statisticSeasons, setStatisticSeasons] = useState([]);
  const [selectedStatisticSeason, setSelectedStatisticSeason] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const loadPlayer = useCallback(async () => {
    setLoading(true);

    const result = await getPlayerById(playerApiId, { season: selectedStatisticSeason || undefined });

    if(result.ok){
      const nextStatisticSeasons = (result.data?.statistic_seasons || []).map(String);
      const nextSelectedSeason = result.data?.selected_statistic_season ? String(result.data.selected_statistic_season) : "";

      setPlayer(result.data?.player || null);
      setStatistics(result.data?.statistics || []);
      setStatisticSeasons(nextStatisticSeasons);
      if(!selectedStatisticSeason && nextSelectedSeason){
        setSelectedStatisticSeason(nextSelectedSeason);
      }
      setMessage(result.data?.message || "Player loaded successfully");
    }else{
      setPlayer(null);
      setStatistics([]);
      setStatisticSeasons([]);
      setMessage(result.data?.message || result.data?.error || "Failed to load player");
    }

    setLoading(false);
  }, [playerApiId, selectedStatisticSeason]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadPlayer();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadPlayer]);

  const primaryStatistic = useMemo(() => getPrimaryStatistic(statistics), [statistics]);
  const summary = useMemo(() => buildCareerSummary(statistics), [statistics]);
  const clubRows = useMemo(() => buildClubRows(statistics), [statistics]);
  const statisticSeasonOptions = useMemo(() => {
    const savedSeasons = statisticSeasons.length > 0 ? statisticSeasons : statisticSeasonFallbackOptions;

    return Array.from(new Set([selectedStatisticSeason, ...savedSeasons].filter(Boolean).map(String)));
  }, [selectedStatisticSeason, statisticSeasons]);
  const selectedDisplaySeason = selectedStatisticSeason || statisticSeasonOptions[0] || "2024";
  const facts = [
    player?.nationality ? { key: "nationality", icon: <FaIdBadge />, label: "Nationality", value: player.nationality } : null,
    player?.age ? { key: "age", icon: <FaCalendarAlt />, label: "Age", value: player.age } : null,
    player?.height ? { key: "height", icon: <FaRunning />, label: "Height", value: player.height } : null,
    player?.weight ? { key: "weight", icon: <FaRunning />, label: "Weight", value: player.weight } : null,
    primaryStatistic?.team?.name ? { key: "team", icon: <FaShieldAlt />, label: `Team ${primaryStatistic.season}`, value: primaryStatistic.team.name } : null,
    primaryStatistic?.league?.name ? { key: "league", icon: <FaTrophy />, label: `League ${primaryStatistic.season}`, value: primaryStatistic.league.name } : null,
  ].filter(Boolean);
  const profileChips = [
    { key: "player", label: `Player ${player?.api_player_id}` },
    primaryStatistic?.team?.api_team_id ? { key: "team", label: `Team ${primaryStatistic.team.api_team_id}` } : null,
    primaryStatistic?.league?.api_league_id ? { key: "league", label: `League ${primaryStatistic.league.api_league_id}` } : null,
    primaryStatistic?.season ? { key: "season", label: `Season ${primaryStatistic.season}` } : null,
  ].filter(Boolean);
  const activeContent = useMemo(() => {
    const renderers = {
      overview: (
        <OverviewTab
          facts={facts}
          primaryStatistic={primaryStatistic}
          selectedSeason={selectedDisplaySeason}
          summary={summary}
        />
      ),
      statistics: <StatisticsTab statistics={statistics} />,
      clubs: <ClubsTab clubRows={clubRows} />,
    };

    return renderers[activeTab] || renderers.overview;
  }, [activeTab, clubRows, facts, primaryStatistic, selectedDisplaySeason, statistics, summary]);

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

      <PanelCard className="overflow-hidden">
        <div className="p-5">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center">
              <PlayerPhoto player={player} />
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#8b5cf6]">Player Profile</p>
                <h1 className="mt-1 truncate text-3xl font-bold">{player.name}</h1>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-400">
                  {profileChips.map((chip) => (
                    <span key={chip.key} className="rounded-full bg-[#111111] px-3 py-1">{chip.label}</span>
                  ))}
                </div>
              </div>
            </div>
            {player.injured && (
              <span className="rounded-full bg-red-500/15 px-3 py-1 text-xs font-medium text-red-200">
                Injured
              </span>
            )}
            <label className="flex items-center gap-2 text-xs text-gray-400">
              Season
              <select
                value={selectedDisplaySeason}
                onChange={(event) => setSelectedStatisticSeason(event.target.value)}
                className="rounded-lg border border-[#2a2a2a] bg-[#111111] px-3 py-2 text-sm text-white outline-none transition-colors focus:border-[#8b5cf6]"
              >
                {statisticSeasonOptions.map((season) => (
                  <option key={season} value={season}>
                    {season}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </PanelCard>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label={`Apps ${selectedDisplaySeason}`} value={summary.appearances} icon={<FaRunning />} />
        <SummaryCard label={`Goals ${selectedDisplaySeason}`} value={summary.goals} icon={<FaFutbol />} />
        <SummaryCard label={`Assists ${selectedDisplaySeason}`} value={summary.assists} icon={<FaStar />} />
        <SummaryCard label={`Teams ${selectedDisplaySeason}`} value={clubRows.length} icon={<FaShieldAlt />} />
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

export default PlayerPage;
