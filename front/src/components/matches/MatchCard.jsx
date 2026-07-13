import { Link } from "react-router-dom";
import { FaChevronRight, FaMapMarkerAlt } from "react-icons/fa";
import MatchStatusBadge from "./MatchStatusBadge";

const getTeamName = (team) => {
  return team?.name || "Unknown Team";
};

const getScoreText = (fixture) => {
  if(fixture.home_goals === null || fixture.home_goals === undefined || fixture.away_goals === null || fixture.away_goals === undefined){
    return fixture.match_time_local || "TBD";
  }

  return `${fixture.home_goals} - ${fixture.away_goals}`;
};

const TeamBlock = ({ team, align = "left" }) => {
  const isRight = align === "right";

  return (
    <div className={`flex min-w-0 items-center gap-3 ${isRight ? "sm:justify-end sm:text-right" : ""}`}>
      {!isRight && team?.logo && (
        <img src={team.logo} alt="" className="h-8 w-8 rounded-full object-contain" />
      )}
      <p className="truncate text-sm font-semibold text-white sm:text-base">{getTeamName(team)}</p>
      {isRight && team?.logo && (
        <img src={team.logo} alt="" className="h-8 w-8 rounded-full object-contain" />
      )}
    </div>
  );
};

const MatchCard = ({ fixture }) => {
  const publicMatchId = fixture.public_match_id || fixture.api_fixture_id;

  return (
    <Link
      to={`/matches/${publicMatchId}`}
      className="block rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] p-4 transition-all hover:border-[#8b5cf6]/50 hover:bg-[#111111]"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2a2a2a] pb-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">{fixture.league?.name || "Unknown League"}</p>
          <p className="text-xs text-gray-500">
            {fixture.match_date_local || ""} {fixture.match_time_local || ""}
          </p>
        </div>
        <MatchStatusBadge statusShort={fixture.status_short} elapsed={fixture.elapsed} />
      </div>

      <div className="mt-4 grid grid-cols-1 items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
        <TeamBlock team={fixture.homeTeam} />
        <div className="mx-auto rounded-lg bg-black/35 px-4 py-2 text-center text-base font-bold text-white sm:mx-0">
          {getScoreText(fixture)}
        </div>
        <TeamBlock team={fixture.awayTeam} align="right" />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
        <span className="inline-flex items-center gap-2">
          <FaMapMarkerAlt className="text-[#8b5cf6]" />
          {fixture.venue_name || "Venue TBD"}
        </span>
        <span className="inline-flex items-center gap-2 text-[#a78bfa]">
          View Details
          <FaChevronRight />
        </span>
      </div>
    </Link>
  );
};

export default MatchCard;
