export const tabs = [
  { key: "overview", label: "Overview" },
  { key: "statistics", label: "Statistics" },
  { key: "clubs", label: "Clubs" },
];

export const statisticSeasonFallbackOptions = ["2024", "2023", "2022"];

export const hasValue = (value) => value !== null && value !== undefined && value !== "";

export const formatNumber = (value) => {
  if(value === null || value === undefined){
    return "-";
  }

  return value;
};

export const sumField = (statistics, field) => {
  return statistics.reduce((total, statistic) => total + Number(statistic[field] || 0), 0);
};

export const getPrimaryStatistic = (statistics) => {
  return statistics[0] || null;
};

export const buildCareerSummary = (statistics) => {
  return {
    appearances: sumField(statistics, "appearances"),
    minutes: sumField(statistics, "minutes"),
    goals: sumField(statistics, "goals"),
    assists: sumField(statistics, "assists"),
    yellow_cards: sumField(statistics, "yellow_cards"),
    red_cards: sumField(statistics, "red_cards"),
  };
};

export const buildClubRows = (statistics) => {
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
