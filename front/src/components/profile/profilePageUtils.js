export const getSectionFromPath = (pathname) => {
  if(pathname.includes("/favorites")){
    return "favorites";
  }

  if(pathname.includes("/pinned")){
    return "pinned";
  }

  if(pathname.includes("/notifications")){
    return "notifications";
  }

  if(pathname.includes("/settings")){
    return "settings";
  }

  return "overview";
};

export const formatPoints = (value) => {
  const numberValue = Number(value || 0);

  return Number.isInteger(numberValue) ? String(numberValue) : numberValue.toFixed(2);
};

export const getMatchId = (match) => match?.public_match_id || match?.api_fixture_id;

export const getMatchTitle = (match) => {
  return `${match?.homeTeam?.name || "Home Team"} vs ${match?.awayTeam?.name || "Away Team"}`;
};
