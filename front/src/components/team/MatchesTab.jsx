import { Link } from "react-router-dom";
import { FaFutbol } from "react-icons/fa";
import PanelCard from "../common/PanelCard";
import MatchCard from "../matches/MatchCard";
import NoDataState from "../matches/NoDataState";
import { getScoreText } from "./teamPageUtils";

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

export default MatchesTab;
