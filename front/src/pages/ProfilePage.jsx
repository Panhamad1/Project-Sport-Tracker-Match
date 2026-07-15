import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaBell,
  FaCalendarAlt,
  FaCheckCircle,
  FaCog,
  FaHeart,
  FaSignOutAlt,
  FaSpinner,
  FaStar,
  FaThumbtack,
  FaTrash,
  FaTrophy,
  FaUserCircle,
  FaUsers,
} from "react-icons/fa";
import { getMyDreamTeam } from "../api/football/DreamTeamApi";
import { getFavoriteTeams, removeFavoriteTeam } from "../api/football/FavoriteTeamApi";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../api/football/NotificationApi";
import { getPinnedMatches, unpinMatch } from "../api/football/PinnedMatchApi";
import { getMyPredictions } from "../api/football/PredictionApi";
import { useAuth } from "../hooks/useAuth";
import PanelCard from "../components/common/PanelCard";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import NoDataState from "../components/matches/NoDataState";

const profileItems = [
  { path: "/profile", label: "Overview", icon: <FaUserCircle /> },
  { path: "/profile/favorites", label: "Favorite Teams", icon: <FaHeart /> },
  { path: "/profile/pinned", label: "Pinned Matches", icon: <FaThumbtack /> },
  { path: "/profile/notifications", label: "Notifications", icon: <FaBell /> },
  { path: "/profile/settings", label: "Settings", icon: <FaCog /> },
];

const getSectionFromPath = (pathname) => {
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

const formatPoints = (value) => {
  const numberValue = Number(value || 0);

  return Number.isInteger(numberValue) ? String(numberValue) : numberValue.toFixed(2);
};

const getMatchId = (match) => match?.public_match_id || match?.api_fixture_id;

const getMatchTitle = (match) => {
  return `${match?.homeTeam?.name || "Home Team"} vs ${match?.awayTeam?.name || "Away Team"}`;
};

const TeamLogo = ({ team }) => {
  if(team?.logo){
    return <img src={team.logo} alt="" className="h-10 w-10 rounded-full object-contain" />;
  }

  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1a1a1a] text-sm font-bold text-[#a78bfa]">
      {team?.code || team?.name?.slice(0, 2)?.toUpperCase() || "FC"}
    </span>
  );
};

const SummaryCard = ({ icon, label, value, detail }) => (
  <div className="rounded-lg border border-[#2a2a2a] bg-[#111111] p-4">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="mt-2 text-2xl font-bold text-white">{value}</p>
        {detail && <p className="mt-1 text-xs text-gray-500">{detail}</p>}
      </div>
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#8b5cf6]/15 text-[#a78bfa]">
        {icon}
      </span>
    </div>
  </div>
);

const SectionHeader = ({ title, detail }) => (
  <div className="mb-5">
    <h2 className="text-xl font-semibold text-white">{title}</h2>
    {detail && <p className="mt-2 text-sm text-gray-400">{detail}</p>}
  </div>
);

const OverviewSection = ({ dreamTeams, favoriteTeams, notifications, pinnedMatches, predictions, user }) => {
  const settledPredictions = predictions.filter((prediction) => prediction.points_awarded !== null && prediction.points_awarded !== undefined);
  const won = settledPredictions.filter((prediction) => Number(prediction.points_awarded || 0) > 0).length;
  const winRate = settledPredictions.length === 0 ? 0 : Math.round((won / settledPredictions.length) * 100);
  const unreadCount = notifications.filter((notification) => !notification.is_read).length;

  return (
    <div>
      <SectionHeader
        title="Account Overview"
        detail="Your account stats, saved football activity, and latest alerts."
      />

      <div className="mb-5 rounded-lg border border-[#2a2a2a] bg-[#111111] p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <FaUserCircle className="text-5xl text-[#8b5cf6]" />
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold text-white">{user?.username || "User"}</p>
              <p className="truncate text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
          <span className="w-fit rounded-full border border-[#8b5cf6]/30 bg-[#8b5cf6]/15 px-3 py-1 text-xs font-semibold uppercase text-[#c4b5fd]">
            {user?.role || "user"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard icon={<FaTrophy />} label="Points" value={formatPoints(user?.points)} detail="Prediction leaderboard points" />
        <SummaryCard icon={<FaCheckCircle />} label="Win Rate" value={`${winRate}%`} detail={`${settledPredictions.length} settled picks`} />
        <SummaryCard icon={<FaHeart />} label="Favorite Teams" value={favoriteTeams.length} detail="Teams saved to profile" />
        <SummaryCard icon={<FaBell />} label="Unread Alerts" value={unreadCount} detail="Match and prediction notices" />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        <SummaryCard icon={<FaThumbtack />} label="Pinned Matches" value={pinnedMatches.length} detail="Matches kept close" />
        <SummaryCard icon={<FaUsers />} label="Dream Teams" value={`${dreamTeams.length} / 3`} detail="Saved squads" />
        <SummaryCard icon={<FaStar />} label="Predictions" value={predictions.length} detail="All active and settled picks" />
      </div>
    </div>
  );
};

const FavoriteTeamsSection = ({ favoriteTeams, onRemove, removingId }) => (
  <div>
    <SectionHeader title="Favorite Teams" detail="Teams you saved for quick access." />
    {favoriteTeams.length === 0 ? (
      <NoDataState title="No Favorite Teams" message="Open a team page and add it to favorites." />
    ) : (
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {favoriteTeams.map((favoriteTeam) => {
          const team = favoriteTeam.team;

          return (
            <div key={favoriteTeam.id || team?.id} className="flex items-center justify-between gap-3 rounded-lg border border-[#2a2a2a] bg-[#111111] p-3">
              <Link to={team?.api_team_id ? `/teams/${team.api_team_id}` : "#"} className="flex min-w-0 items-center gap-3">
                <TeamLogo team={team} />
                <div className="min-w-0">
                  <p className="truncate font-semibold text-white">{team?.name || "Unknown Team"}</p>
                  <p className="truncate text-xs text-gray-500">{team?.country || "Saved team"}</p>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => onRemove(team?.id)}
                disabled={removingId === team?.id}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-500/25 bg-red-500/10 text-red-200 hover:bg-red-500/20 disabled:cursor-wait"
              >
                {removingId === team?.id ? <FaSpinner className="animate-spin text-xs" /> : <FaTrash className="text-xs" />}
              </button>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

const PinnedMatchesSection = ({ onRemove, pinnedMatches, removingId }) => (
  <div>
    <SectionHeader title="Pinned Matches" detail="Important matches you pinned from the match feed." />
    {pinnedMatches.length === 0 ? (
      <NoDataState title="No Pinned Matches" message="Pin a match from the homepage feed or match page." />
    ) : (
      <div className="space-y-3">
        {pinnedMatches.map((pinnedMatch) => {
          const match = pinnedMatch.match;
          const matchId = getMatchId(match);

          return (
            <div key={matchId || pinnedMatch.pinned_at} className="rounded-lg border border-[#2a2a2a] bg-[#111111] p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Link to={matchId ? `/matches/${matchId}` : "#"} className="min-w-0">
                  <p className="truncate font-semibold text-white">{getMatchTitle(match)}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {match?.league?.name || "Saved League"} - {match?.match_date_local || "Date TBD"} {match?.match_time_local || ""}
                  </p>
                </Link>
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-black/35 px-3 py-1 text-sm font-bold text-white">
                    {match?.home_goals ?? "-"} - {match?.away_goals ?? "-"}
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemove(matchId)}
                    disabled={removingId === matchId}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-500/25 bg-red-500/10 text-red-200 hover:bg-red-500/20 disabled:cursor-wait"
                  >
                    {removingId === matchId ? <FaSpinner className="animate-spin text-xs" /> : <FaTrash className="text-xs" />}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

const NotificationsSection = ({ loading, notifications, onMarkAllRead, onMarkRead }) => (
  <div>
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <SectionHeader title="Notifications" detail="Pinned match kickoff alerts and settled prediction results." />
      {notifications.some((notification) => !notification.is_read) && (
        <button
          type="button"
          onClick={onMarkAllRead}
          className="rounded-lg border border-[#8b5cf6]/30 bg-[#8b5cf6]/15 px-4 py-2 text-sm font-medium text-[#c4b5fd] hover:bg-[#8b5cf6]/25"
        >
          Mark all read
        </button>
      )}
    </div>

    {loading ? (
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <FaSpinner className="animate-spin text-[#8b5cf6]" />
        Loading notifications...
      </div>
    ) : notifications.length === 0 ? (
      <NoDataState title="No Notifications Yet" message="Kickoff and prediction result alerts will appear here." />
    ) : (
      <div className="space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.notification_id}
            className={`rounded-lg border p-4 ${
              notification.is_read
                ? "border-[#2a2a2a] bg-[#111111]"
                : "border-[#8b5cf6]/35 bg-[#8b5cf6]/10"
            }`}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="font-semibold text-white">{notification.title}</p>
                <p className="mt-1 text-sm text-gray-400">{notification.message}</p>
                <p className="mt-2 text-xs text-gray-500">
                  {notification.created_at ? new Date(notification.created_at).toLocaleString() : "New alert"}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {notification.match?.api_fixture_id && (
                  <Link
                    to={`/matches/${notification.match.api_fixture_id}`}
                    className="rounded-lg border border-[#2a2a2a] px-3 py-2 text-xs font-medium text-[#a78bfa] hover:border-[#8b5cf6]/50 hover:text-white"
                  >
                    Open match
                  </Link>
                )}
                {!notification.is_read && (
                  <button
                    type="button"
                    onClick={() => onMarkRead(notification.notification_id)}
                    className="rounded-lg bg-[#1a1a1a] px-3 py-2 text-xs font-medium text-gray-300 hover:text-white"
                  >
                    Mark read
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const SettingsSection = ({ onLogout, user }) => (
  <div>
    <SectionHeader title="Settings" detail="Basic account information and session controls." />
    <div className="space-y-4">
      <div className="rounded-lg border border-[#2a2a2a] bg-[#111111] p-4">
        <p className="text-sm text-gray-400">Username</p>
        <p className="mt-1 font-semibold text-white">{user?.username || "No username"}</p>
      </div>
      <div className="rounded-lg border border-[#2a2a2a] bg-[#111111] p-4">
        <p className="text-sm text-gray-400">Email</p>
        <p className="mt-1 font-semibold text-white">{user?.email || "No email"}</p>
      </div>
      <button
        type="button"
        onClick={onLogout}
        className="inline-flex items-center gap-2 rounded-lg border border-red-500/25 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-200 hover:bg-red-500/20"
      >
        <FaSignOutAlt />
        Logout
      </button>
    </div>
  </div>
);

const ProfilePage = () => {
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

    const [favoritesResult, pinnedResult, dreamResult, predictionResult, notificationResult] = await Promise.all([
      getFavoriteTeams(),
      getPinnedMatches(),
      getMyDreamTeam(),
      getMyPredictions(),
      getNotifications(),
    ]);

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
  }, [location.pathname]);

  const handleRemoveFavorite = async (teamId) => {
    if(!teamId){
      return;
    }

    setRemovingFavoriteId(teamId);
    const result = await removeFavoriteTeam(teamId);

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
    const result = await unpinMatch({ apiFixtureId });

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
    const result = await markNotificationRead({ notificationId });

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
    const result = await markAllNotificationsRead();

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

  if(loading){
    return (
      <div className="flex items-center justify-center gap-3 py-16 text-gray-400">
        <FaSpinner className="animate-spin text-[#8b5cf6]" />
        Loading profile...
      </div>
    );
  }

  if(!user){
    return (
      <PanelCard className="p-6 text-white">
        <NoDataState title="Login Required" message="Login to view your profile, saved teams, pinned matches, and notifications." />
        <Link to="/login" className="mt-5 inline-flex rounded-lg bg-[#8b5cf6] px-4 py-2 text-sm font-medium text-white hover:bg-[#7c3aed]">
          Login
        </Link>
      </PanelCard>
    );
  }

  return (
    <div className="space-y-6 text-white">
      <div>
        <p className="text-sm font-medium text-[#8b5cf6]">Account</p>
        <h1 className="mt-1 text-2xl font-bold">Profile Center</h1>
        <p className="mt-2 text-sm text-gray-400">
          Manage your account, saved teams, pinned matches, notifications, and settings.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[260px_1fr]">
        <ProfileSidebar
          user={user}
          loading={loading}
          items={profileItems}
        />

        <PanelCard className="min-h-105 p-4 sm:p-6">
          <div className="mb-5 flex flex-col gap-3 border-b border-[#2a2a2a] pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{activeItemLabel}</p>
              <p className="mt-1 text-sm text-gray-400">
                {contentLoading ? "Refreshing account data..." : message || `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`}
              </p>
            </div>
            <button
              type="button"
              onClick={loadProfileData}
              disabled={contentLoading}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#2a2a2a] bg-[#111111] px-3 py-2 text-sm text-gray-300 hover:text-white disabled:cursor-wait"
            >
              {contentLoading ? <FaSpinner className="animate-spin" /> : <FaCalendarAlt />}
              Refresh
            </button>
          </div>

          {section === "overview" && (
            <OverviewSection
              dreamTeams={dreamTeams}
              favoriteTeams={favoriteTeams}
              notifications={notifications}
              pinnedMatches={pinnedMatches}
              predictions={predictions}
              user={user}
            />
          )}

          {section === "favorites" && (
            <FavoriteTeamsSection
              favoriteTeams={favoriteTeams}
              onRemove={handleRemoveFavorite}
              removingId={removingFavoriteId}
            />
          )}

          {section === "pinned" && (
            <PinnedMatchesSection
              onRemove={handleRemovePinned}
              pinnedMatches={pinnedMatches}
              removingId={removingPinnedId}
            />
          )}

          {section === "notifications" && (
            <NotificationsSection
              loading={contentLoading}
              notifications={notifications}
              onMarkAllRead={handleMarkAllRead}
              onMarkRead={handleMarkNotificationRead}
            />
          )}

          {section === "settings" && (
            <SettingsSection
              onLogout={handleLogout}
              user={user}
            />
          )}
        </PanelCard>
      </div>
    </div>
  );
};

export default ProfilePage;
