import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaCheckCircle,
  FaClock,
  FaSpinner,
  FaSyncAlt,
  FaTimesCircle,
  FaTrophy,
} from "react-icons/fa";
import { getMyPredictions } from "../../api/football/PredictionApi";
import NoDataState from "../matches/NoDataState";

const formatPoints = (points) => {
  const value = Number(points || 0);

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const formatPercent = (value) => {
  const numberValue = Number(value || 0);

  return `${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: Number.isInteger(numberValue) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(numberValue)}%`;
};

const getTeamName = (team) => team?.name || "Unknown Team";

const getMatchTitle = (match) => {
  if(!match){
    return "Match unavailable";
  }

  return `${getTeamName(match.homeTeam)} vs ${getTeamName(match.awayTeam)}`;
};

const getMatchScore = (match) => {
  if(!match){
    return "No score";
  }

  if(match.home_goals === null || match.home_goals === undefined || match.away_goals === null || match.away_goals === undefined){
    return match.match_time_local || "TBD";
  }

  return `${match.home_goals} - ${match.away_goals}`;
};

const getMarketLabel = (prediction) => {
  if(prediction.market_type === "WINNER"){
    return "Match Winner";
  }

  if(prediction.market_type === "OVER_UNDER"){
    return "Goals Over/Under";
  }

  return "Prediction";
};

const getSettledStatus = (prediction) => {
  const points = Number(prediction.points_awarded || 0);

  if(points > 0){
    return {
      label: "Won",
      icon: <FaCheckCircle />,
      className: "bg-green-500/10 text-green-300",
      pointsClassName: "text-green-300",
      prefix: "+",
    };
  }

  if(points < 0){
    return {
      label: "Lost",
      icon: <FaTimesCircle />,
      className: "bg-red-500/10 text-red-300",
      pointsClassName: "text-red-300",
      prefix: "",
    };
  }

  return {
    label: "Settled",
    icon: <FaCheckCircle />,
    className: "bg-gray-500/10 text-gray-300",
    pointsClassName: "text-gray-300",
    prefix: "",
  };
};

const SummaryCard = ({ label, value, detail }) => {
  return (
    <div className="rounded-lg border border-[#2a2a2a] bg-[#111111] p-4">
      <p className="text-sm text-gray-400">{label}</p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
      {detail && <p className="mt-1 text-xs text-gray-500">{detail}</p>}
    </div>
  );
};

const TeamBadge = ({ team, align = "left" }) => {
  const isRight = align === "right";

  return (
    <div className={`flex min-w-0 items-center gap-2 ${isRight ? "justify-end text-right" : ""}`}>
      {!isRight && team?.logo && (
        <img src={team.logo} alt="" className="h-7 w-7 rounded-full object-contain" />
      )}
      <span className="truncate text-sm font-medium text-white">{getTeamName(team)}</span>
      {isRight && team?.logo && (
        <img src={team.logo} alt="" className="h-7 w-7 rounded-full object-contain" />
      )}
    </div>
  );
};

const PredictionCard = ({ prediction, type }) => {
  const match = prediction.match;
  const matchId = match?.public_match_id || match?.api_fixture_id;
  const isSettled = type === "settled";
  const settledStatus = isSettled ? getSettledStatus(prediction) : null;
  const pointsValue = Number(prediction.points_awarded || 0);
  const matchLink = matchId ? `/matches/${matchId}?tab=prediction` : null;

  const cardContent = (
    <article className={`rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] p-4 ${matchLink ? "cursor-pointer transition-all hover:border-[#8b5cf6]/40 hover:bg-[#0d0d0d]/80" : ""}`}>
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#2a2a2a] pb-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">{getMatchTitle(match)}</p>
          <p className="mt-1 text-xs text-gray-500">
            {match?.league?.name || "Unknown League"} - {match?.match_date_local || "Date TBD"} {match?.match_time_local || ""}
          </p>
        </div>

        {isSettled ? (
          <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold ${settledStatus.className}`}>
            {settledStatus.icon}
            {settledStatus.label}
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 rounded-full bg-yellow-500/10 px-2.5 py-1 text-xs font-semibold text-yellow-200">
            <FaClock />
            Pending
          </span>
        )}
      </div>

      <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <TeamBadge team={match?.homeTeam} />
        <div className="rounded-lg bg-black/35 px-3 py-2 text-center text-sm font-bold text-white">
          {getMatchScore(match)}
        </div>
        <TeamBadge team={match?.awayTeam} align="right" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg bg-[#111111] p-3">
          <p className="text-xs text-gray-500">{getMarketLabel(prediction)}</p>
          <p className="mt-1 font-semibold text-white">{prediction.selection_label}</p>
        </div>
        <div className="rounded-lg bg-[#111111] p-3">
          <p className="text-xs text-gray-500">Odd</p>
          <p className="mt-1 font-semibold text-white">{formatPoints(prediction.odd_snapshot)}</p>
        </div>
        <div className="rounded-lg bg-[#111111] p-3">
          <p className="text-xs text-gray-500">{isSettled ? "Point Change" : "Possible Points"}</p>
          <p className={`mt-1 font-semibold ${isSettled ? settledStatus.pointsClassName : "text-white"}`}>
            {isSettled ? `${settledStatus.prefix}${formatPoints(pointsValue)}` : `+${formatPoints(prediction.potential_points)}`}
          </p>
        </div>
      </div>

      {matchLink && (
        <div className="mt-4 flex items-center justify-end gap-1">
          <span className="text-sm font-medium text-[#a78bfa] transition-colors group-hover:text-white">
            View prediction
          </span>
        </div>
      )}
    </article>
  );

  if (matchLink) {
    return (
      <Link to={matchLink} className="group block no-underline">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

const PredictionSection = ({ title, count, children }) => {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold text-white">{title}</h3>
        <span className="rounded-full bg-[#8b5cf6]/15 px-2.5 py-1 text-xs text-[#a78bfa]">{count}</span>
      </div>
      {children}
    </section>
  );
};

const ProfilePredictionHistory = ({ user, authLoading, framed = false }) => {
  const [predictions, setPredictions] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadPredictions = useCallback(async () => {
    if(!user){
      return;
    }

    setLoading(true);
    setError("");

    const result = await getMyPredictions();

    if(result.ok){
      setPredictions(result.data?.predictions || []);
      setMessage(result.data?.message || "Prediction history loaded successfully");
    }else{
      setPredictions([]);
      setMessage("");
      setError(result.data?.message || result.data?.error || "Failed to load prediction history");
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadPredictions();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadPredictions]);

  const activePredictions = useMemo(() => {
    return predictions.filter((prediction) => prediction.points_awarded === null || prediction.points_awarded === undefined);
  }, [predictions]);

  const settledPredictions = useMemo(() => {
    return predictions.filter((prediction) => prediction.points_awarded !== null && prediction.points_awarded !== undefined);
  }, [predictions]);

  const summary = useMemo(() => {
    const won = settledPredictions.filter((prediction) => Number(prediction.points_awarded || 0) > 0).length;
    const lost = settledPredictions.filter((prediction) => Number(prediction.points_awarded || 0) < 0).length;
    const settledCount = settledPredictions.length;
    const totalPointChange = settledPredictions.reduce((total, prediction) => total + Number(prediction.points_awarded || 0), 0);
    const winRate = settledCount === 0 ? 0 : (won / settledCount) * 100;

    return {
      won,
      lost,
      settledCount,
      totalPointChange,
      winRate,
    };
  }, [settledPredictions]);

  if(authLoading){
    return (
      <div className="flex items-center justify-center gap-3 py-16 text-gray-400">
        <FaSpinner className="animate-spin text-[#8b5cf6]" />
        Loading account...
      </div>
    );
  }

  if(!user){
    return (
      <NoDataState
        title="Login Required"
        message="Login to view your prediction history and points."
      />
    );
  }

  return (
    <div className={`space-y-6 ${framed ? "rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] p-6" : ""}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Prediction History</h2>
          <p className="mt-2 max-w-2xl text-sm text-gray-400">
            Review your active picks and settled prediction results with won or lost points.
          </p>
          {(message || error) && (
            <p className={`mt-2 text-xs ${error ? "text-red-300" : "text-gray-500"}`}>
              {error || message}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={loadPredictions}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#2a2a2a] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <FaSpinner className="animate-spin" /> : <FaSyncAlt />}
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Active Picks" value={activePredictions.length} detail="Waiting for final result" />
        <SummaryCard label="Settled Picks" value={summary.settledCount} detail={`${summary.won} won - ${summary.lost} lost`} />
        <SummaryCard label="Win Rate" value={formatPercent(summary.winRate)} detail="Based on settled picks" />
        <SummaryCard
          label="Point Change"
          value={`${summary.totalPointChange > 0 ? "+" : ""}${formatPoints(summary.totalPointChange)}`}
          detail="From settled predictions"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-3 py-16 text-gray-400">
          <FaSpinner className="animate-spin text-[#8b5cf6]" />
          Loading predictions...
        </div>
      ) : error ? (
        <NoDataState title="Prediction History Unavailable" message={error} />
      ) : predictions.length === 0 ? (
        <NoDataState
          title="No Predictions Yet"
          message="Your match predictions will appear here after you make your first pick."
        />
      ) : (
        <div className="space-y-6">
          <PredictionSection title="Active Predictions" count={activePredictions.length}>
            {activePredictions.length === 0 ? (
              <NoDataState
                title="No Active Predictions"
                message="You do not have any pending prediction picks right now."
              />
            ) : (
              <div className="space-y-3">
                {activePredictions.map((prediction) => (
                  <PredictionCard
                    key={prediction.prediction_pick_id}
                    prediction={prediction}
                    type="active"
                  />
                ))}
              </div>
            )}
          </PredictionSection>

          <PredictionSection title="Settled Results" count={settledPredictions.length}>
            {settledPredictions.length === 0 ? (
              <NoDataState
                title="No Settled Results"
                message="Finished prediction results will appear here after points are awarded."
              />
            ) : (
              <div className="space-y-3">
                {settledPredictions.map((prediction) => (
                  <PredictionCard
                    key={prediction.prediction_pick_id}
                    prediction={prediction}
                    type="settled"
                  />
                ))}
              </div>
            )}
          </PredictionSection>
        </div>
      )}

      <div className="rounded-lg border border-[#2a2a2a] bg-[#111111] p-4 text-sm text-gray-400">
        <div className="flex items-center gap-2 font-medium text-white">
          <FaTrophy className="text-[#8b5cf6]" />
          Points rule
        </div>
        <p className="mt-2">
          Correct picks add the saved odd value. Wrong picks lose the same value after the match result is awarded.
        </p>
      </div>
    </div>
  );
};

export default ProfilePredictionHistory;
