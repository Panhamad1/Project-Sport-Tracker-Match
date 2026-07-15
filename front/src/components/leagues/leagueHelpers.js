export const normalizeStanding = (standing) => {
  const standingData = typeof standing.toJSON === "function" ? standing.toJSON() : standing;

  return {
    ...standingData,
    team: standingData.team || {},
  };
};

export const groupStandings = (standings) => {
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

export const getTeamDisplay = (standing) => {
  return standing.team?.name || "Unknown Team";
};

export const getTeamPath = (team) => {
  return team?.api_team_id ? `/teams/${team.api_team_id}` : null;
};

export const formatNumber = (value) => {
  if(value === null || value === undefined){
    return "-";
  }

  return value;
};
