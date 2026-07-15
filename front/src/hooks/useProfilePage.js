import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import {
  fetchProfileData,
  markAllProfileNotificationsRead,
  markProfileNotificationRead,
  removeProfileFavoriteTeam,
  removeProfilePinnedMatch,
} from "../services/profileService";
import { getMatchId, getSectionFromPath } from "../components/profile/profilePageUtils";

export const useProfilePage = (profileItems) => {
  const { user, loading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const section = getSectionFromPath(location.pathname);
  const [favoriteTeams, setFavoriteTeams] = useState([]);
  const [pinnedMatches, setPinnedMatches] = useState([]);
  const [dreamTeams, setDreamTeams] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [contentLoading, setContentLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [removingFavoriteId, setRemovingFavoriteId] = useState(null);
  const [removingPinnedId, setRemovingPinnedId] = useState(null);

  const loadProfileData = useCallback(async () => {
    if(!user){
      return;
    }

    setContentLoading(true);
    setMessage("");

    const [favoritesResult, pinnedResult, dreamResult, predictionResult, notificationResult] = await fetchProfileData();

    if(favoritesResult.ok){
      setFavoriteTeams(favoritesResult.data?.result || []);
    }

    if(pinnedResult.ok){
      setPinnedMatches(pinnedResult.data?.pinnedMatches || []);
    }

    if(dreamResult.ok){
      setDreamTeams(dreamResult.data?.dreamTeams || (dreamResult.data?.dreamTeam ? [dreamResult.data.dreamTeam] : []));
    }

    if(predictionResult.ok){
      setPredictions(predictionResult.data?.predictions || []);
    }

    if(notificationResult.ok){
      setNotifications(notificationResult.data?.notifications || []);
      setUnreadCount(notificationResult.data?.unread_count || 0);
    }

    setContentLoading(false);
  }, [user]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadProfileData();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadProfileData]);

  const activeItemLabel = useMemo(() => {
    return profileItems.find((item) => item.path === location.pathname)?.label || "Overview";
  }, [location.pathname, profileItems]);

  const handleRemoveFavorite = async (teamId) => {
    if(!teamId){
      return;
    }

    setRemovingFavoriteId(teamId);
    const result = await removeProfileFavoriteTeam(teamId);

    if(result.ok){
      setFavoriteTeams((current) => current.filter((favoriteTeam) => favoriteTeam.team?.id !== teamId));
      setMessage("Favorite team removed");
    }else{
      setMessage(result.data?.message || result.data?.error || "Failed to remove favorite team");
    }

    setRemovingFavoriteId(null);
  };

  const handleRemovePinned = async (apiFixtureId) => {
    if(!apiFixtureId){
      return;
    }

    setRemovingPinnedId(apiFixtureId);
    const result = await removeProfilePinnedMatch({ apiFixtureId });

    if(result.ok){
      setPinnedMatches((current) => current.filter((pinnedMatch) => getMatchId(pinnedMatch.match) !== apiFixtureId));
      window.dispatchEvent(new CustomEvent("pinned-matches-updated", {
        detail: {
          apiFixtureId,
          pinned: false,
        },
      }));
      setMessage("Pinned match removed");
    }else{
      setMessage(result.data?.message || result.data?.error || "Failed to remove pinned match");
    }

    setRemovingPinnedId(null);
  };

  const handleMarkNotificationRead = async (notificationId) => {
    const result = await markProfileNotificationRead({ notificationId });

    if(result.ok){
      setNotifications((current) => current.map((notification) => (
        notification.notification_id === notificationId
          ? { ...notification, is_read: true }
          : notification
      )));
      setUnreadCount((current) => Math.max(current - 1, 0));
      window.dispatchEvent(new Event("notifications-updated"));
    }
  };

  const handleMarkAllRead = async () => {
    const result = await markAllProfileNotificationsRead();

    if(result.ok){
      setNotifications((current) => current.map((notification) => ({
        ...notification,
        is_read: true,
      })));
      setUnreadCount(0);
      window.dispatchEvent(new Event("notifications-updated"));
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return {
    activeItemLabel,
    contentLoading,
    dreamTeams,
    favoriteTeams,
    handleLogout,
    handleMarkAllRead,
    handleMarkNotificationRead,
    handleRemoveFavorite,
    handleRemovePinned,
    loadProfileData,
    loading,
    message,
    notifications,
    pinnedMatches,
    predictions,
    removingFavoriteId,
    removingPinnedId,
    section,
    unreadCount,
    user,
  };
};
