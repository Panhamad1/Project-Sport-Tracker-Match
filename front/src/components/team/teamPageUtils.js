export const tabs = [
  { key: "overview", label: "Overview" },
  { key: "matches", label: "Matches" },
  { key: "squad", label: "Squad" },
  { key: "records", label: "Records" },
];

export const squadSeasonFallbackOptions = ["2024", "2023", "2022"];

const finishedStatuses = ["FT", "AET", "PEN"];

export const formatNumber = (value) => {
  if(value === null || value === undefined){
    return "-";
  }

  return value;
};

export const hasValue = (value) => value !== null && value !== undefined && value !== "";

export const getFavoriteList = (responseData) => {
  return responseData?.result || responseData?.favorites || [];
};

export const getScoreText = (fixture) => {
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

export const buildTeamForm = (matches, apiTeamId) => {
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

export const buildMatchRecord = (formEntries) => {
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

export const getPlayerStatNumber = (player, field) => Number(player?.[field] || 0);

const getTopPlayerByField = (players, field) => {
  return players.reduce((leader, player) => {
    if(!leader){
      return player;
    }

    return getPlayerStatNumber(player, field) > getPlayerStatNumber(leader, field) ? player : leader;
  }, null);
};

export const buildTeamLeaders = (players) => {
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
