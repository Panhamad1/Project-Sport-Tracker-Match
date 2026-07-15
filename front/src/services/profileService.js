import { getMyDreamTeam } from "../api/football/DreamTeamApi";
import { getFavoriteTeams, removeFavoriteTeam } from "../api/football/FavoriteTeamApi";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../api/football/NotificationApi";
import { getPinnedMatches, unpinMatch } from "../api/football/PinnedMatchApi";
import { getMyPredictions } from "../api/football/PredictionApi";

export const fetchProfileData = () => {
  return Promise.all([
    getFavoriteTeams(),
    getPinnedMatches(),
    getMyDreamTeam(),
    getMyPredictions(),
    getNotifications(),
  ]);
};

export const removeProfileFavoriteTeam = (teamId) => {
  return removeFavoriteTeam(teamId);
};

export const removeProfilePinnedMatch = ({ apiFixtureId }) => {
  return unpinMatch({ apiFixtureId });
};

export const markProfileNotificationRead = ({ notificationId }) => {
  return markNotificationRead({ notificationId });
};

export const markAllProfileNotificationsRead = () => {
  return markAllNotificationsRead();
};
