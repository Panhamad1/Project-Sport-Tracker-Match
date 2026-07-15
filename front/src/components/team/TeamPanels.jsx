import { Link } from "react-router-dom";
import { FaFutbol, FaStar, FaTrophy } from "react-icons/fa";
import PanelCard from "../common/PanelCard";
import NoDataState from "../matches/NoDataState";
import PlayerAvatar from "./PlayerAvatar";
import PlayerProfileLink from "./PlayerProfileLink";
import { formatNumber, hasValue } from "./teamPageUtils";

const formBadgeStyles = {
  W: "bg-emerald-500/15 text-emerald-300",
  D: "bg-yellow-500/15 text-yellow-300",
  L: "bg-red-500/15 text-red-300",
};

export const InfoItem = ({ icon, label, value }) => {
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

export const StandingCard = ({ standing }) => {
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

export const MiniStat = ({ label, value }) => {
  return (
    <div className="rounded-lg bg-black/25 p-3 text-center">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-white">{formatNumber(value)}</p>
    </div>
  );
};

export const SeasonRecordPanel = ({ standing }) => {
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

export const TeamFormPanel = ({ formEntries, record }) => {
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

export const TeamLeadersPanel = ({ leaders }) => {
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
            <PlayerProfileLink
              key={leader.key}
              player={leader.player}
              className="flex items-center gap-3 rounded-lg border border-[#2a2a2a] bg-[#111111] p-3 transition-all hover:border-[#8b5cf6]/50 hover:bg-[#151515]"
            >
              <PlayerAvatar player={leader.player} size="md" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-[#a78bfa]">{leader.label}</p>
                <p className="truncate text-sm font-semibold text-white">{leader.player.name || "Player"}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-white">{leader.value}</p>
                <p className="text-[11px] text-gray-500">{leader.statLabel}</p>
              </div>
            </PlayerProfileLink>
          ))}
        </div>
      )}
    </PanelCard>
  );
};
