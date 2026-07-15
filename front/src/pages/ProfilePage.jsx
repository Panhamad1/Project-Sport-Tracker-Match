import { Link } from "react-router-dom";
import { FaBell, FaCog, FaHeart, FaSpinner, FaThumbtack, FaUserCircle } from "react-icons/fa";
import PanelCard from "../components/common/PanelCard";
import NoDataState from "../components/matches/NoDataState";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import {
  FavoriteTeamsSection,
  NotificationsSection,
  OverviewSection,
  PinnedMatchesSection,
  ProfileRefreshButton,
  SettingsSection,
} from "../components/profile/ProfileSections";
import { useProfilePage } from "../hooks/useProfilePage";

const profileItems = [
  { path: "/profile", label: "Overview", icon: <FaUserCircle /> },
  { path: "/profile/favorites", label: "Favorite Teams", icon: <FaHeart /> },
  { path: "/profile/pinned", label: "Pinned Matches", icon: <FaThumbtack /> },
  { path: "/profile/notifications", label: "Notifications", icon: <FaBell /> },
  { path: "/profile/settings", label: "Settings", icon: <FaCog /> },
];

const ProfilePage = () => {
  const {
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
  } = useProfilePage(profileItems);

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

        <PanelCard className="min-h-[420px] p-4 sm:p-6">
          <div className="mb-5 flex flex-col gap-3 border-b border-[#2a2a2a] pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{activeItemLabel}</p>
              <p className="mt-1 text-sm text-gray-400">
                {contentLoading ? "Refreshing account data..." : message || `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`}
              </p>
            </div>
            <ProfileRefreshButton contentLoading={contentLoading} onRefresh={loadProfileData} />
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
