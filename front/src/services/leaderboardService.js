import { getLeaderboard } from "../api/leaderboard/LeaderboardApi";

export const fetchLeaderboard = ({ limit }) => {
  return getLeaderboard({ limit });
};
