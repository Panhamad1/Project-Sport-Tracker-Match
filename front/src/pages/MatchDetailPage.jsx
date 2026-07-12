import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaClock,
  FaCoins,
  FaFutbol,
  FaLock,
  FaMapMarkerAlt,
  FaSpinner,
  FaSyncAlt,
  FaTrash,
  FaTv,
} from "react-icons/fa";
import { syncPredictionOdds } from "../api/admin/AdminPredictionApi";
import { getMatchById } from "../api/football/FootballApi";
import {
  deletePredictionPick,
  getPredictionOptions,
  savePredictionPick,
} from "../api/football/PredictionApi";
import AdminStreamLinkManager from "../components/admin/AdminStreamLinkManager";
import MatchStatusBadge from "../components/matches/MatchStatusBadge";
import NoDataState from "../components/matches/NoDataState";
import { useAuth } from "../hooks/useAuth";

const tabs = [
  { key: "overview", label: "Overview" },
  { key: "h2h", label: "H2H" },
  { key: "prediction", label: "Prediction" },
  { key: "lineups", label: "Lineups" },
  { key: "statistics", label: "Statistics" },
  { key: "streams", label: "Streams" },
];

const getTeamName = (team) => {
  return team?.name || "Unknown Team";
};

const hasData = (value) => {
  if(Array.isArray(value)){
    return value.length > 0;
  }

  if(value && typeof value === "object"){
    return Object.keys(value).length > 0;
  }

  return Boolean(value);
};

const TeamHeader = ({ team, align = "left" }) => {
  const isRight = align === "right";

  return (
    <div className={`flex flex-col items-center gap-3 ${isRight ? "xl:items-end" : "xl:items-start"}`}>
      {team?.logo && (
        <img src={team.logo} alt="" className="h-16 w-16 rounded-full object-contain sm:h-20 sm:w-20" />
      )}
      <div className={isRight ? "xl:text-right" : "xl:text-left"}>
        <p className="text-lg font-bold text-white sm:text-xl">{getTeamName(team)}</p>
        <p className="text-xs text-gray-500">{team?.country || "Club"}</p>
      </div>
    </div>
  );
};

const getGoalBadge = (detail) => {
  if(detail === "Penalty"){
    return "P";
  }

  if(detail === "Own Goal"){
    return "OG";
  }

  return "";
};

const ScorerList = ({ scorers = [], align = "left" }) => {
  const isRight = align === "right";

  if(scorers.length === 0){
    return null;
  }

  return (
    <div className={`space-y-1 ${isRight ? "text-right" : "text-left"}`}>
      {scorers.map((scorer, index) => {
        const badge = getGoalBadge(scorer.detail);

        return (
          <div
            key={`${scorer.player_name}-${scorer.minute}-${index}`}
            className={`flex items-center gap-2 text-xs text-gray-300 ${isRight ? "justify-end" : ""}`}
          >
            {!isRight && <FaFutbol className="text-gray-500" />}
            <span className="truncate">{scorer.player_name}</span>
            {badge && <span className="rounded bg-[#8b5cf6]/20 px-1.5 py-0.5 text-[10px] text-[#c4b5fd]">{badge}</span>}
            <span className="font-semibold text-white">{scorer.minute}</span>
            {isRight && <FaFutbol className="text-gray-500" />}
          </div>
        );
      })}
    </div>
  );
};

const ScoreBlock = ({ overview, goalScorers }) => {
  const hasScore = overview?.home_goals !== null && overview?.home_goals !== undefined && overview?.away_goals !== null && overview?.away_goals !== undefined;
  const homeScorers = goalScorers?.home || [];
  const awayScorers = goalScorers?.away || [];
  const hasScorers = homeScorers.length > 0 || awayScorers.length > 0;

  return (
    <div className="text-center xl:min-w-[320px]">
      <div className="inline-flex items-center justify-center rounded-xl bg-black/35 px-8 py-4 text-3xl font-bold text-white">
        {hasScore ? `${overview.home_goals} - ${overview.away_goals}` : overview?.match_time_local || "TBD"}
      </div>
      <div className="mt-3 flex justify-center">
        <MatchStatusBadge statusShort={overview?.status_short} elapsed={overview?.elapsed} />
      </div>
      {hasScorers && (
        <div className="mt-4 grid grid-cols-2 gap-4 rounded-lg border border-[#2a2a2a] bg-[#111111] p-3">
          <ScorerList scorers={homeScorers} />
          <ScorerList scorers={awayScorers} align="right" />
        </div>
      )}
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => {
  return (
    <div className="rounded-lg border border-[#2a2a2a] bg-[#111111] p-4">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span className="text-[#8b5cf6]">{icon}</span>
        {label}
      </div>
      <p className="mt-2 text-sm font-medium text-white">{value || "No Data Yet"}</p>
    </div>
  );
};

const OverviewTab = ({ overview }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <InfoItem icon={<FaClock />} label="Local Date" value={overview?.match_date_local} />
      <InfoItem icon={<FaClock />} label="Local Time" value={overview?.match_time_local} />
      <InfoItem icon={<FaMapMarkerAlt />} label="Venue" value={overview?.venue_name} />
      <InfoItem icon={<FaMapMarkerAlt />} label="City" value={overview?.venue_city} />
    </div>
  );
};

const H2HTab = ({ h2h }) => {
  if(!hasData(h2h)){
    return <NoDataState message="H2H data has not been synced or API-FOOTBALL did not provide it." />;
  }

  return (
    <div className="space-y-3">
      {h2h.slice(0, 8).map((match) => (
        <div key={match.fixture?.id || `${match.fixture?.date}-${match.teams?.home?.name}`} className="rounded-lg border border-[#2a2a2a] bg-[#111111] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
            <span>{match.league?.name || "Unknown League"}</span>
            <span>{match.fixture?.date ? new Date(match.fixture.date).toLocaleDateString() : "Unknown Date"}</span>
          </div>
          <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <p className="truncate text-sm text-white">{match.teams?.home?.name || "Home"}</p>
            <p className="rounded bg-black/35 px-3 py-1 text-sm font-semibold">
              {match.goals?.home ?? "-"} - {match.goals?.away ?? "-"}
            </p>
            <p className="truncate text-right text-sm text-white">{match.teams?.away?.name || "Away"}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const ApiPredictionInsight = ({ prediction }) => {
  const data = Array.isArray(prediction) ? prediction[0] : prediction;
  const winner = data?.predictions?.winner?.name || data?.winner?.name;
  const advice = data?.predictions?.advice || data?.advice;
  const percent = data?.predictions?.percent || data?.percent;
  const orderedPercent = percent
    ? ["home", "draw", "away"]
      .filter((label) => percent[label] !== undefined && percent[label] !== null)
      .map((label) => [label, percent[label]])
    : [];

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-[#2a2a2a] bg-[#111111] p-5">
        <p className="text-xs text-[#8b5cf6] font-medium">API Match Insight</p>
        <h3 className="mt-2 text-xl font-bold text-white">{winner || "No clear winner"}</h3>
        <p className="mt-2 text-sm text-gray-400">{advice || "No advice provided."}</p>
      </div>

      {orderedPercent.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {orderedPercent.map(([label, value]) => (
            <div key={label} className="rounded-lg border border-[#2a2a2a] bg-[#111111] p-4">
              <p className="text-xs text-gray-500 uppercase">{label}</p>
              <p className="mt-2 text-lg font-bold text-white">{value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const PredictionOddButton = ({ disabled, isSelected, isSaving, odd, onPick }) => {
  return (
    <button
      type="button"
      disabled={disabled || isSaving}
      onClick={() => onPick(odd)}
      className={`rounded-lg border p-3 text-left transition-all disabled:cursor-not-allowed ${
        isSelected
          ? "border-emerald-400/60 bg-emerald-500/15"
          : "border-[#2a2a2a] bg-[#111111] hover:border-[#8b5cf6]/60"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-white">{odd.selection_label}</span>
        {isSaving ? (
          <FaSpinner className="animate-spin text-[#8b5cf6]" />
        ) : isSelected ? (
          <FaCheckCircle className="text-emerald-300" />
        ) : null}
      </div>
      <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
        <FaCoins className="text-[#8b5cf6]" />
        <span>Odd {odd.odd}</span>
        <span className="text-gray-600">=</span>
        <span className="font-semibold text-white">+/- {odd.points} pts</span>
      </div>
    </button>
  );
};

const PredictionTab = ({ apiFixtureId, isAdmin, prediction, user }) => {
  const [options, setOptions] = useState(null);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [message, setMessage] = useState("");
  const [savingOddId, setSavingOddId] = useState(null);
  const [deletingPickId, setDeletingPickId] = useState(null);
  const [syncingOdds, setSyncingOdds] = useState(false);

  const loadOptions = useCallback(async () => {
    if(!user){
      return;
    }

    setLoadingOptions(true);
    const result = await getPredictionOptions({ apiFixtureId });

    if(result.ok){
      setOptions(result.data);
      setMessage(result.data?.message || "Prediction options loaded");
    }else{
      setOptions(null);
      setMessage(result.data?.message || result.data?.error || "Failed to load prediction options");
    }

    setLoadingOptions(false);
  }, [apiFixtureId, user]);

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      loadOptions();
    }, 0);

    return () => window.clearTimeout(loadTimer);
  }, [loadOptions]);

  const pickByPredictionKey = useMemo(() => {
    const map = new Map();

    (options?.my_picks || []).forEach((pick) => {
      map.set(pick.prediction_key, pick);
    });

    return map;
  }, [options]);

  const handlePick = async (odd) => {
    if(options?.is_locked){
      setMessage("Prediction is locked because kickoff time has passed.");
      return;
    }

    setSavingOddId(odd.fixture_odd_id);
    const result = await savePredictionPick({
      apiFixtureId,
      fixtureOddId: odd.fixture_odd_id,
    });

    if(result.ok){
      setMessage(result.data?.message || "Prediction pick saved");
      await loadOptions();
    }else{
      setMessage(result.data?.message || result.data?.error || "Failed to save prediction pick");
    }

    setSavingOddId(null);
  };

  const handleDeletePick = async (predictionPickId) => {
    setDeletingPickId(predictionPickId);
    const result = await deletePredictionPick({ predictionPickId });

    if(result.ok){
      setMessage(result.data?.message || "Prediction pick removed");
      await loadOptions();
    }else{
      setMessage(result.data?.message || result.data?.error || "Failed to remove prediction pick");
    }

    setDeletingPickId(null);
  };

  const handleSyncOdds = async () => {
    setSyncingOdds(true);
    setMessage("Syncing odds from API-FOOTBALL...");

    const result = await syncPredictionOdds({ apiFixtureId });

    if(result.ok){
      setMessage(result.data?.message || "Prediction odds synced");
      await loadOptions();
    }else{
      setMessage(result.data?.message || result.data?.error || "Failed to sync prediction odds");
    }

    setSyncingOdds(false);
  };

  const winnerOdds = options?.odds?.winner || [];
  const overUnderGroups = options?.odds?.over_under || [];
  const hasOdds = winnerOdds.length > 0 || overUnderGroups.length > 0;

  if(!user){
    return (
      <div className="space-y-4">
        {hasData(prediction) && <ApiPredictionInsight prediction={prediction} />}
        <NoDataState title="Login Required" message="Login first to make match predictions and earn leaderboard points." />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {hasData(prediction) && <ApiPredictionInsight prediction={prediction} />}

      <div className="rounded-lg border border-[#2a2a2a] bg-[#111111] p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-medium text-[#8b5cf6]">Prediction Game</p>
            <h3 className="mt-1 text-lg font-bold text-white">Pick from synced odds</h3>
            <p className="mt-1 text-sm text-gray-400">
              Correct picks add the odd value. Wrong picks lose the same value.
            </p>
          </div>

          {isAdmin && (
            <button
              type="button"
              onClick={handleSyncOdds}
              disabled={syncingOdds}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#8b5cf6] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#7c3aed] disabled:bg-[#3f315f] disabled:cursor-not-allowed"
            >
              {syncingOdds ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <FaSyncAlt />
                  Sync Odds
                </>
              )}
            </button>
          )}
        </div>

        {message && (
          <p className="mt-4 rounded-lg border border-[#2a2a2a] bg-black/25 px-3 py-2 text-sm text-gray-300">
            {message}
          </p>
        )}

        {options?.is_locked && (
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-yellow-500/10 px-3 py-1 text-xs text-yellow-200">
            <FaLock />
            Prediction locked because kickoff time has passed.
          </p>
        )}

        {loadingOptions ? (
          <div className="mt-5 flex items-center gap-2 text-sm text-gray-400">
            <FaSpinner className="animate-spin text-[#8b5cf6]" />
            Loading odds...
          </div>
        ) : !hasOdds ? (
          <div className="mt-5">
            <NoDataState message="No odds have been synced for this match yet." />
          </div>
        ) : (
          <div className="mt-5 space-y-5">
            {winnerOdds.length > 0 && (
              <div>
                <h4 className="mb-3 text-sm font-semibold text-white">Winner</h4>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  {winnerOdds.map((odd) => {
                    const selectedPick = pickByPredictionKey.get(odd.prediction_key);

                    return (
                      <PredictionOddButton
                        key={odd.fixture_odd_id}
                        disabled={options?.is_locked}
                        isSaving={savingOddId === odd.fixture_odd_id}
                        isSelected={selectedPick?.fixture_odd_id === odd.fixture_odd_id}
                        odd={odd}
                        onPick={handlePick}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {overUnderGroups.length > 0 && (
              <div>
                <h4 className="mb-3 text-sm font-semibold text-white">Over / Under</h4>
                <div className="space-y-3">
                  {overUnderGroups.map((group) => {
                    const selectedPick = pickByPredictionKey.get(group.prediction_key);

                    return (
                      <div key={group.prediction_key} className="rounded-lg border border-[#2a2a2a] bg-black/20 p-3">
                        <p className="mb-3 text-xs font-medium text-gray-400">Line {group.line}</p>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          {group.options.map((odd) => (
                            <PredictionOddButton
                              key={odd.fixture_odd_id}
                              disabled={options?.is_locked}
                              isSaving={savingOddId === odd.fixture_odd_id}
                              isSelected={selectedPick?.fixture_odd_id === odd.fixture_odd_id}
                              odd={odd}
                              onPick={handlePick}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {(options?.my_picks || []).length > 0 && (
          <div className="mt-5 border-t border-[#2a2a2a] pt-4">
            <h4 className="mb-3 text-sm font-semibold text-white">My Picks</h4>
            <div className="space-y-2">
              {options.my_picks.map((pick) => (
                <div key={pick.prediction_pick_id} className="flex flex-col gap-3 rounded-lg border border-[#2a2a2a] bg-black/20 p-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">{pick.selection_label}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      {pick.market_type.replace("_", " ")} · Odd {pick.odd_snapshot} · Risk/reward {pick.potential_points} pts
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeletePick(pick.prediction_pick_id)}
                    disabled={options?.is_locked || deletingPickId === pick.prediction_pick_id}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-500/25 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-200 transition-all hover:bg-red-500/20 disabled:bg-[#111111] disabled:cursor-not-allowed"
                  >
                    {deletingPickId === pick.prediction_pick_id ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <FaTrash />
                    )}
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const parseGrid = (grid) => {
  const [line, row] = String(grid || "").split(":").map(Number);

  if(!Number.isFinite(line) || !Number.isFinite(row)){
    return null;
  }

  return { line, row };
};

const getShortPlayerName = (name) => {
  if(!name){
    return "Unknown";
  }

  const parts = name.trim().split(/\s+/);
  return parts.length > 2 ? parts.slice(-2).join(" ") : name;
};

const getLineupPositionLabel = (position) => {
  const normalizedPosition = String(position || "").trim().toUpperCase();
  const positionLabels = {
    G: "GK",
    GK: "GK",
    D: "DEF",
    DF: "DEF",
    DEF: "DEF",
    M: "MID",
    MF: "MID",
    MID: "MID",
    F: "FWD",
    FW: "FWD",
    ST: "ST",
    CF: "CF",
    LW: "LW",
    RW: "RW",
    AM: "AM",
    DM: "DM",
    CM: "CM",
    LB: "LB",
    RB: "RB",
    CB: "CB",
  };

  return positionLabels[normalizedPosition] || normalizedPosition || "POS";
};

const distributeY = (row, count) => {
  if(count <= 1){
    return 50;
  }

  return 14 + ((row - 1) * 72) / (count - 1);
};

const buildLineupMeta = (lineup) => {
  const lineRows = new Map();
  let maxLine = 1;

  (lineup?.startXI || []).forEach((item) => {
    const grid = parseGrid(item.player?.grid);

    if(!grid){
      return;
    }

    maxLine = Math.max(maxLine, grid.line);
    lineRows.set(grid.line, Math.max(lineRows.get(grid.line) || 1, grid.row));
  });

  return {
    lineRows,
    maxLine,
  };
};

const getFallbackPosition = ({ player, lineup, side, index }) => {
  const startXI = lineup?.startXI || [];
  const positionOrder = ["G", "D", "M", "F"];
  const position = player?.pos || "M";
  const lineIndex = Math.max(positionOrder.indexOf(position), 0);
  const samePositionPlayers = startXI.filter((item) => (item.player?.pos || "M") === position);
  const row = Math.max(samePositionPlayers.findIndex((item) => item.player?.id === player?.id) + 1, 1);
  const rowCount = Math.max(samePositionPlayers.length, 1);
  const homeXByPosition = [8, 20, 34, 45];
  const homeX = homeXByPosition[lineIndex] || 28 + (index % 3) * 7;

  return {
    left: `${side === "home" ? homeX : 100 - homeX}%`,
    top: `${distributeY(row, rowCount)}%`,
  };
};

const getPlayerMarkerStyle = ({ player, lineup, meta, side, index }) => {
  const grid = parseGrid(player?.grid);

  if(!grid){
    return getFallbackPosition({ player, lineup, side, index });
  }

  const rowCount = meta.lineRows.get(grid.line) || 1;
  const homeX = meta.maxLine <= 1
    ? 25
    : 7 + ((grid.line - 1) * 38) / (meta.maxLine - 1);

  return {
    left: `${side === "home" ? homeX : 100 - homeX}%`,
    top: `${distributeY(grid.row, rowCount)}%`,
  };
};

const LineupTeamHeader = ({ lineup, align = "left" }) => {
  const isRight = align === "right";

  return (
    <div className={`flex items-center gap-3 ${isRight ? "justify-end text-right" : ""}`}>
      {!isRight && lineup?.team?.logo && (
        <img src={lineup.team.logo} alt="" className="h-8 w-8 rounded-full bg-white object-contain" />
      )}
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-white">{lineup?.team?.name || "Team"}</p>
        <p className="text-xs font-medium text-emerald-100">{lineup?.formation || "Formation TBD"}</p>
      </div>
      {isRight && lineup?.team?.logo && (
        <img src={lineup.team.logo} alt="" className="h-8 w-8 rounded-full bg-white object-contain" />
      )}
    </div>
  );
};

const LineupPlayerMarker = ({ item, lineup, meta, side, index }) => {
  const player = item.player || {};
  const style = getPlayerMarkerStyle({ player, lineup, meta, side, index });
  const positionLabel = getLineupPositionLabel(player.pos);

  return (
    <div
      className="absolute w-24 -translate-x-1/2 -translate-y-1/2 text-center"
      style={style}
    >
      <div className="relative mx-auto h-12 w-12">
        {player.photo ? (
          <img
            src={player.photo}
            alt=""
            className="h-12 w-12 rounded-full border-2 border-white bg-[#111111] object-cover shadow-lg"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-[#111111] text-xs font-bold text-white shadow-lg">
            {player.number || "-"}
          </div>
        )}
        {player.photo && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#111111] px-1 text-[10px] font-bold text-white shadow">
            {player.number || "-"}
          </span>
        )}
      </div>
      <p className="mt-1 truncate text-[11px] font-semibold text-white drop-shadow">
        {getShortPlayerName(player.name)}
      </p>
      <span className="mt-0.5 inline-flex rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-bold text-emerald-100 shadow">
        {positionLabel}
      </span>
    </div>
  );
};

const FieldLines = () => {
  return (
    <>
      <div className="absolute inset-y-0 left-1/2 w-px bg-white/20" />
      <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20" />
      <div className="absolute left-0 top-[31%] h-[38%] w-[15%] rounded-r-lg border-y border-r border-white/20" />
      <div className="absolute right-0 top-[31%] h-[38%] w-[15%] rounded-l-lg border-y border-l border-white/20" />
      <div className="absolute left-0 top-[42%] h-[16%] w-[6%] rounded-r-md border-y border-r border-white/20" />
      <div className="absolute right-0 top-[42%] h-[16%] w-[6%] rounded-l-md border-y border-l border-white/20" />
    </>
  );
};

const CoachRow = ({ homeLineup, awayLineup }) => {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-t border-[#2a2a2a] bg-[#111111] px-4 py-4 text-sm">
      <p className="truncate text-white">{homeLineup?.coach?.name || "No coach data"}</p>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Coach</p>
      <p className="truncate text-right text-white">{awayLineup?.coach?.name || "No coach data"}</p>
    </div>
  );
};

const SubstituteItem = ({ item }) => {
  const player = item.player || {};

  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-[#2a2a2a] py-3 last:border-b-0">
      {player.photo ? (
        <img
          src={player.photo}
          alt=""
          className="h-9 w-9 rounded-full bg-[#1a1a1a] object-cover"
        />
      ) : (
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1a1a1a] text-xs font-bold text-gray-300">
          {player.number || "-"}
        </span>
      )}
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-white">{player.name || "Unknown Player"}</p>
        <p className="text-xs text-gray-500">{getLineupPositionLabel(player.pos)}</p>
      </div>
      <span className="text-xs text-gray-500">Sub</span>
    </div>
  );
};

const SubstituteList = ({ title, lineup }) => {
  const substitutes = lineup?.substitutes || [];

  return (
    <div className="rounded-lg border border-[#2a2a2a] bg-[#111111] p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="truncate text-sm font-semibold text-white">{title}</h3>
        <span className="rounded-full bg-[#8b5cf6]/15 px-2 py-1 text-xs text-[#a78bfa]">
          {substitutes.length}
        </span>
      </div>

      {substitutes.length === 0 ? (
        <p className="text-sm text-gray-500">No substitutes data yet.</p>
      ) : (
        substitutes.map((item) => (
          <SubstituteItem key={item.player?.id || item.player?.name} item={item} />
        ))
      )}
    </div>
  );
};

const LineupsTab = ({ lineups, overview }) => {
  if(!hasData(lineups)){
    return <NoDataState message="Lineups are usually available closer to kickoff. No data yet." />;
  }

  const homeApiTeamId = overview?.homeTeam?.api_team_id;
  const awayApiTeamId = overview?.awayTeam?.api_team_id;
  const homeLineup = lineups.find((lineup) => lineup.team?.id === homeApiTeamId) || lineups[0];
  const awayLineup = lineups.find((lineup) => lineup.team?.id === awayApiTeamId) || lineups.find((lineup) => lineup !== homeLineup);
  const homeMeta = buildLineupMeta(homeLineup);
  const awayMeta = buildLineupMeta(awayLineup);

  return (
    <div className="overflow-hidden rounded-lg border border-[#2a2a2a] bg-[#0d0d0d]">
      <div className="grid grid-cols-1 gap-3 bg-emerald-700 px-4 py-4 sm:grid-cols-2">
        <LineupTeamHeader lineup={homeLineup} />
        <LineupTeamHeader lineup={awayLineup} align="right" />
      </div>

      <div className="overflow-x-auto">
        <div className="relative h-[520px] min-w-[720px] bg-emerald-600">
          <FieldLines />

          {(homeLineup?.startXI || []).slice(0, 11).map((item, index) => (
            <LineupPlayerMarker
              key={item.player?.id || item.player?.name}
              item={item}
              lineup={homeLineup}
              meta={homeMeta}
              side="home"
              index={index}
            />
          ))}

          {(awayLineup?.startXI || []).slice(0, 11).map((item, index) => (
            <LineupPlayerMarker
              key={item.player?.id || item.player?.name}
              item={item}
              lineup={awayLineup}
              meta={awayMeta}
              side="away"
              index={index}
            />
          ))}
        </div>
      </div>

      <CoachRow homeLineup={homeLineup} awayLineup={awayLineup} />

      <div className="border-t border-[#2a2a2a] p-4">
        <h2 className="mb-4 text-center text-sm font-semibold text-white">Substitutes</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <SubstituteList title={homeLineup?.team?.name || "Home Team"} lineup={homeLineup} />
          <SubstituteList title={awayLineup?.team?.name || "Away Team"} lineup={awayLineup} />
        </div>
      </div>
    </div>
  );
};

const StatisticsTab = ({ statistics }) => {
  if(!hasData(statistics)){
    return <NoDataState message="Statistics data has not been synced or API-FOOTBALL did not provide it yet." />;
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      {statistics.map((teamStats) => (
        <div key={teamStats.team?.id || teamStats.team?.name} className="rounded-lg border border-[#2a2a2a] bg-[#111111] p-4">
          <div className="flex items-center gap-3">
            {teamStats.team?.logo && <img src={teamStats.team.logo} alt="" className="h-9 w-9 rounded-full object-contain" />}
            <h3 className="font-semibold text-white">{teamStats.team?.name || "Team"}</h3>
          </div>
          <div className="mt-4 space-y-2">
            {(teamStats.statistics || []).map((stat) => (
              <div key={stat.type} className="flex items-center justify-between rounded bg-black/25 px-3 py-2 text-sm">
                <span className="text-gray-400">{stat.type}</span>
                <span className="font-medium text-white">{stat.value ?? "0"}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const StreamsTab = ({ apiFixtureId, isAdmin, onActiveStreamsChange, streams }) => {
  const hasStreamLinks = hasData(streams);

  return (
    <div className="space-y-4">
      {isAdmin && (
        <AdminStreamLinkManager
          apiFixtureId={apiFixtureId}
          defaultOpen={!hasStreamLinks}
          onActiveStreamsChange={onActiveStreamsChange}
        />
      )}

      {!hasStreamLinks ? (
        <NoDataState message="No stream links have been added yet." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {streams.map((stream) => (
            <a
              key={stream.id || stream.stream_link_id || stream.url}
              href={stream.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-[#2a2a2a] bg-[#111111] p-4 transition-all hover:border-[#8b5cf6]/50"
            >
              <FaTv className="text-[#8b5cf6]" />
              <h3 className="mt-3 font-semibold text-white">{stream.title || "Stream Link"}</h3>
              <p className="mt-1 text-sm text-gray-500">{stream.source_name || stream.url}</p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

const MatchDetailPage = () => {
  const { matchId: apiFixtureId } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const initialTab = searchParams.get("tab") || "overview";
  const validTab = tabs.some((t) => t.key === initialTab) ? initialTab : "overview";
  const [activeTab, setActiveTab] = useState(validTab);
  const [match, setMatch] = useState(null);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const loadMatch = async () => {
      setLoading(true);

      const result = await getMatchById(apiFixtureId);

      if(result.ok){
        setMatch(result.data?.match || null);
        setDetails(result.data?.details || null);
        setMessage(result.data?.message || "Match loaded");
      }else{
        setMatch(null);
        setDetails(null);
        setMessage(result.data?.message || result.data?.error || "Failed to load match");
      }

      setLoading(false);
    };

    loadMatch();
  }, [apiFixtureId]);

  const overview = details?.overview;
  const handleActiveStreamsChange = useCallback((streamLinks) => {
    setDetails((currentDetails) => currentDetails
      ? {
        ...currentDetails,
        streams: streamLinks,
      }
      : currentDetails);
  }, []);

  const activeContent = useMemo(() => {
    if(!details){
      return null;
    }

    const renderers = {
      overview: <OverviewTab overview={details.overview} />,
      h2h: <H2HTab h2h={details.h2h} />,
      prediction: (
        <PredictionTab
          apiFixtureId={apiFixtureId}
          isAdmin={isAdmin}
          prediction={details.prediction}
          user={user}
        />
      ),
      lineups: <LineupsTab lineups={details.lineups} overview={details.overview} />,
      statistics: <StatisticsTab statistics={details.statistics} />,
      streams: (
        <StreamsTab
          apiFixtureId={apiFixtureId}
          isAdmin={isAdmin}
          onActiveStreamsChange={handleActiveStreamsChange}
          streams={details.streams}
        />
      ),
    };

    return renderers[activeTab];
  }, [activeTab, apiFixtureId, details, handleActiveStreamsChange, isAdmin, user]);

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
      <div className="text-white space-y-4">
        <Link to="/matches" className="inline-flex items-center gap-2 text-sm text-[#a78bfa] hover:text-white">
          <FaArrowLeft />
          Back to matches
        </Link>
        <NoDataState title="Match Not Found" message={message || "This match does not exist in the database yet."} />
      </div>
    );
  }

  return (
    <div className="text-white space-y-6">
      <Link to="/matches" className="inline-flex items-center gap-2 text-sm text-[#a78bfa] hover:text-white">
        <FaArrowLeft />
        Back to matches
      </Link>

      <section className="rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2a2a2a] pb-4">
          <div>
            <p className="text-sm text-[#8b5cf6] font-medium">{overview?.league?.name || "Unknown League"}</p>
            <h1 className="mt-1 text-2xl font-bold">Match Detail</h1>
          </div>
          <MatchStatusBadge statusShort={overview?.status_short} elapsed={overview?.elapsed} />
        </div>

        <div className="mt-6 grid grid-cols-1 xl:grid-cols-[1fr_auto_1fr] items-center gap-6">
          <TeamHeader team={overview?.homeTeam} />
          <ScoreBlock overview={overview} goalScorers={details.goal_scorers} />
          <TeamHeader team={overview?.awayTeam} align="right" />
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div className="rounded-lg bg-[#111111] border border-[#2a2a2a] p-3">
            <p className="text-xs text-gray-500">Date</p>
            <p className="mt-1 text-white">{overview?.match_date_local || "No Data Yet"}</p>
          </div>
          <div className="rounded-lg bg-[#111111] border border-[#2a2a2a] p-3">
            <p className="text-xs text-gray-500">Time</p>
            <p className="mt-1 text-white">{overview?.match_time_local || "No Data Yet"}</p>
          </div>
          <div className="rounded-lg bg-[#111111] border border-[#2a2a2a] p-3">
            <p className="text-xs text-gray-500">Last Detail Sync</p>
            <p className="mt-1 text-white">{details.last_synced_at ? new Date(details.last_synced_at).toLocaleString() : "No Data Yet"}</p>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] p-4">
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
          {activeContent || <NoDataState />}
        </div>
      </section>
    </div>
  );
};

export default MatchDetailPage;
