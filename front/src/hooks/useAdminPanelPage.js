import { useEffect, useMemo, useState } from "react";
import { useAuth } from "./useAuth";
import {
  runFixtureSync,
  runMatchDetailSync,
  runMatchDetailSyncByDate,
  runNewsSync,
  runPlayerSync,
  runPlayersSync,
  runSingleFixtureSync,
  runStandingsSync,
  runTeamsSync,
} from "../services/adminPanelService";

const today = new Date().toISOString().slice(0, 10);
const historyStorageKey = "football_admin_sync_history";
const historyLimit = 8;

export const seasonOptions = [
  { value: "2024", label: "2024" },
  { value: "2023", label: "2023" },
  { value: "2022", label: "2022" },
];

const initialForms = {
  fixtures: {
    from: today,
    to: today,
  },
  standings: {
    league: "39",
  },
  teams: {
    league: "39",
  },
  players: {
    teamApiId: "541",
    season: "2024",
    allSeasons: false,
  },
  player: {
    playerApiId: "",
    season: "2024",
    allSeasons: false,
  },
  news: {},
};

export const presets = [
  "Premier League: league 39",
  "LaLiga: league 140",
  "Serie A: league 135",
  "Ligue 1: league 61",
  "Saudi Pro League: league 307",
  "MLS: league 253",
  "Real Madrid: team 541",
  "Barcelona: team 529",
  "Al Nassr: team 2939",
  "Inter Miami: team 9568",
];

const htmlEntities = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": "\"",
  "&#39;": "'",
  "&nbsp;": " ",
};

const stripHtml = (value) => {
  return value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (entity) => htmlEntities[entity] || " ")
    .replace(/\s+/g, " ")
    .trim();
};

const compactValue = (value) => {
  if(value === null || value === undefined || value === ""){
    return "";
  }

  if(typeof value === "string"){
    const trimmedValue = value.trim();
    const cleanValue = /<\/?[a-z][\s\S]*>/i.test(trimmedValue) ? stripHtml(trimmedValue) : trimmedValue;

    return cleanValue || "Backend returned an HTML response instead of JSON";
  }

  if(Array.isArray(value)){
    return value.map(compactValue).filter(Boolean).join(", ");
  }

  if(typeof value === "object"){
    return Object.entries(value)
      .map(([key, item]) => {
        const compactItem = compactValue(item);
        return compactItem ? `${key}: ${compactItem}` : "";
      })
      .filter(Boolean)
      .join("; ");
  }

  return String(value);
};

const truncateMessage = (message, maxLength = 260) => {
  if(message.length <= maxLength){
    return message;
  }

  return `${message.slice(0, maxLength - 3)}...`;
};

const getSyncMessage = (result) => {
  if(typeof result.data === "string"){
    return compactValue(result.data);
  }

  const data = result.data || {};
  const failedResults = Array.isArray(data.results)
    ? data.results.filter((item) => item.status === "failed" || item.error_message)
    : [];

  const parts = [
    compactValue(data.message),
    compactValue(data.error),
    compactValue(data.errors),
    compactValue(data.error_message),
    compactValue(failedResults.map((item) => item.error_message || item.message)),
  ].filter(Boolean);

  if(parts.length > 0){
    return parts.join(" - ");
  }

  return result.ok ? "Sync completed" : "Sync failed. No detailed reason returned by backend.";
};

const hasSyncFailure = (result) => {
  if(!result.ok){
    return true;
  }

  const results = result.data?.results;

  return Array.isArray(results) && results.some((item) => item.status === "failed" || item.error_message);
};

const getSyncAttempt = (task, values) => {
  return task.fields
    .map((field) => {
      const value = values[field.name];

      return value === "" || value === null || value === undefined ? "" : `${field.label}: ${value}`;
    })
    .filter(Boolean)
    .join(", ");
};

const getFixtureLabel = (fixture) => {
  const homeTeam = fixture.homeTeam?.name || "Unknown Team";
  const awayTeam = fixture.awayTeam?.name || "Unknown Team";

  return `${homeTeam} vs ${awayTeam}`;
};

const getResultItems = (result) => {
  const results = result.data?.results;

  if(!Array.isArray(results)){
    return [];
  }

  const getLabel = (item) => {
    if(item.date){
      return item.date;
    }

    if(item.match){
      return item.match;
    }

    if(item.matchId){
      return `Match ${item.matchId}`;
    }

    if(item.playerApiId && item.season){
      return `Player ${item.playerApiId} - ${item.season}`;
    }

    if(item.teamApiId && item.season){
      return `Team ${item.teamApiId} - ${item.season}`;
    }

    if(item.league && item.season){
      return `League ${item.league} - ${item.season}`;
    }

    return item.league || item.teamApiId || item.playerApiId || "result";
  };

  const getCountLabel = (item) => {
    if(item.date && Number.isInteger(item.count)){
      return `${item.count} fixture${item.count === 1 ? "" : "s"} saved after filter`;
    }

    if(Number.isInteger(item.players_count)){
      return `${item.players_count} player${item.players_count === 1 ? "" : "s"}, ${item.statistics_count || 0} stat row${item.statistics_count === 1 ? "" : "s"}`;
    }

    if(Number.isInteger(item.count)){
      return `${item.count} row${item.count === 1 ? "" : "s"} saved`;
    }

    return null;
  };

  return results.map((item) => ({
    label: getLabel(item),
    status: item.status || (item.error_message ? "failed" : "success"),
    count: item.count,
    countLabel: getCountLabel(item),
    message: item.error_message || item.message || "",
  }));
};

const loadSavedHistory = () => {
  try{
    const savedHistory = localStorage.getItem(historyStorageKey);
    const parsedHistory = savedHistory ? JSON.parse(savedHistory) : [];

    return Array.isArray(parsedHistory) ? parsedHistory : [];
  }catch{
    return [];
  }
};

const saveHistory = (history) => {
  localStorage.setItem(historyStorageKey, JSON.stringify(history));
};

export const useAdminPanelPage = () => {
  const { user, loading } = useAuth();
  const [forms, setForms] = useState(initialForms);
  const [runningTask, setRunningTask] = useState(null);
  const [toast, setToast] = useState(null);
  const [history, setHistory] = useState(loadSavedHistory);

  const isAdmin = user?.role === "admin";

  const taskCards = useMemo(() => [
    {
      key: "fixtures",
      title: "Sync Fixtures",
      description: "Fetch new fixture score/status data for a date range.",
      fields: [
        { name: "from", label: "From date", type: "date" },
        { name: "to", label: "To date", type: "date" },
      ],
      submitLabel: "Sync Fixtures",
      run: runFixtureSync,
    },
    {
      key: "standings",
      title: "Sync League + Standings",
      description: "Save league headers and standing tables for 2022, 2023, and 2024.",
      fields: [
        { name: "league", label: "League API ID", type: "number" },
      ],
      submitLabel: "Sync Standings",
      run: runStandingsSync,
    },
    {
      key: "teams",
      title: "Sync Teams",
      description: "Fetch teams for this league across 2022, 2023, and 2024.",
      fields: [
        { name: "league", label: "League API ID", type: "number" },
      ],
      submitLabel: "Sync Teams",
      run: runTeamsSync,
    },
    {
      key: "players",
      title: "Sync Players",
      description: "Fetch players by team for the selected season.",
      fields: [
        { name: "teamApiId", label: "Team API ID", type: "number" },
        { name: "season", label: "Season", type: "select", options: seasonOptions },
      ],
      submitLabel: "Sync Players",
      run: runPlayersSync,
    },
    {
      key: "player",
      title: "Sync Specific Player",
      description: "Fetch one important player for the selected season when team pagination misses them.",
      fields: [
        { name: "playerApiId", label: "Player API ID", type: "number" },
        { name: "season", label: "Season", type: "select", options: seasonOptions },
      ],
      submitLabel: "Sync Player",
      run: runPlayerSync,
    },
    {
      key: "news",
      title: "Sync Football News",
      description: "Fetch the latest English football news and save it to the database.",
      fields: [],
      submitLabel: "Sync News",
      run: runNewsSync,
    },
  ], []);

  const updateForm = (taskKey, fieldName, value) => {
    setForms((current) => ({
      ...current,
      [taskKey]: {
        ...current[taskKey],
        [fieldName]: value,
      },
    }));
  };

  useEffect(() => {
    if(!toast || toast.type === "loading"){
      return undefined;
    }

    const timer = setTimeout(() => {
      setToast(null);
    }, toast.type === "success" ? 5000 : 9000);

    return () => clearTimeout(timer);
  }, [toast]);

  const recordSyncResult = ({ idPrefix, title, fields, values, result }) => {
    setToast({
      type: hasSyncFailure(result) ? "error" : "success",
      title: hasSyncFailure(result) ? "Sync failed" : "Sync success",
      message: truncateMessage(getSyncMessage(result), 180),
    });
    setHistory((current) => {
      const failed = hasSyncFailure(result);
      const message = getSyncMessage(result);
      const nextHistory = [
        {
          id: `${idPrefix}-${Date.now()}`,
          task: title,
          status: result.status,
          ok: !failed,
          time: new Date().toLocaleTimeString(),
          attempt: getSyncAttempt({ fields }, values),
          message: truncateMessage(message, 220),
          resultItems: getResultItems(result).map((item) => ({
            ...item,
            message: truncateMessage(item.message, 160),
          })),
        },
        ...current,
      ].slice(0, historyLimit);

      saveHistory(nextHistory);
      return nextHistory;
    });
  };

  const runTask = async (task) => {
    setRunningTask(task.key);
    setToast({
      type: "loading",
      title: "Sync started",
      message: `${task.title} is running...`,
    });

    const values = forms[task.key];
    const result = await task.run(values);

    recordSyncResult({
      idPrefix: task.key,
      title: task.title,
      fields: task.fields,
      values,
      result,
    });
    setRunningTask(null);
  };

  const syncFixtureDetails = async (fixture) => {
    const values = {
      matchId: fixture.id,
      match: getFixtureLabel(fixture),
    };

    setToast({
      type: "loading",
      title: "Sync started",
      message: `Syncing details for ${values.match}...`,
    });

    const result = await runMatchDetailSync({ matchId: fixture.id });

    recordSyncResult({
      idPrefix: "match-details",
      title: "Sync Match Details",
      fields: [
        { name: "matchId", label: "Local match ID" },
        { name: "match", label: "Match" },
      ],
      values,
      result,
    });

    return result;
  };

  const syncFixtureDetailsByDate = async ({ date, fixturesCount }) => {
    const estimatedRequests = fixturesCount * 6;
    const values = {
      date,
      fixturesCount,
      estimatedRequests,
    };

    setToast({
      type: "loading",
      title: "Bulk sync started",
      message: `Syncing match details for ${fixturesCount} fixture${fixturesCount === 1 ? "" : "s"} on ${date}...`,
    });

    const result = await runMatchDetailSyncByDate({ date });

    recordSyncResult({
      idPrefix: "match-details-date",
      title: "Sync Match Details By Date",
      fields: [
        { name: "date", label: "Date" },
        { name: "fixturesCount", label: "Loaded fixtures" },
        { name: "estimatedRequests", label: "Estimated API requests" },
      ],
      values,
      result,
    });

    return result;
  };

  const refreshFixture = async (fixture) => {
    const values = {
      fixtureId: fixture.id,
      match: getFixtureLabel(fixture),
    };

    setToast({
      type: "loading",
      title: "Refresh started",
      message: `Refreshing score for ${values.match}...`,
    });

    const result = await runSingleFixtureSync({ fixtureId: fixture.id });

    recordSyncResult({
      idPrefix: "fixture-refresh",
      title: "Refresh Fixture Score",
      fields: [
        { name: "fixtureId", label: "Local fixture ID" },
        { name: "match", label: "Match" },
      ],
      values,
      result,
    });

    return result;
  };

  return {
    forms,
    history,
    isAdmin,
    loading,
    presets,
    refreshFixture,
    runningTask,
    runTask,
    setToast,
    syncFixtureDetails,
    syncFixtureDetailsByDate,
    taskCards,
    toast,
    updateForm,
    user,
  };
};
