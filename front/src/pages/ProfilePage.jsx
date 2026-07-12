import {
  FaBell,
  FaCog,
  FaHeart,
  FaStar,
  FaThumbtack,
  FaUserCircle,
} from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import PanelCard from "../components/common/PanelCard";
import ProfilePlaceholderGrid from "../components/profile/ProfilePlaceholderGrid";
import ProfilePredictionHistory from "../components/profile/ProfilePredictionHistory";
import ProfileSidebar from "../components/profile/ProfileSidebar";

const profileItems = [
  { path: "/profile", label: "Overview", icon: <FaUserCircle /> },
  { path: "/profile/favorites", label: "Favorite Teams", icon: <FaHeart /> },
  { path: "/profile/pinned", label: "Pinned Matches", icon: <FaThumbtack /> },
  { path: "/profile/predictions", label: "Prediction History", icon: <FaStar /> },
  { path: "/profile/settings", label: "Settings", icon: <FaCog /> },
];

const ProfilePage = () => {
  const location = useLocation();
  const { user, loading } = useAuth();
  const isAdmin = user?.role === "admin";
  const activeSection = location.pathname.split("/").filter(Boolean)[1] || "overview";
  const isPredictionSection = activeSection === "predictions";

  return (
    <div className="text-white space-y-6">
      <div>
        <p className="text-sm text-[#8b5cf6] font-medium">Account</p>
        <h1 className="text-2xl font-bold mt-1">Profile Center</h1>
        <p className="text-gray-400 text-sm mt-2">
          Manage your account, saved teams, pinned matches, predictions, and settings in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5">
        <ProfileSidebar
          user={user}
          loading={loading}
          isAdmin={isAdmin}
          items={profileItems}
        />

        <PanelCard className="p-6 min-h-[420px]">
          {isPredictionSection ? (
            <ProfilePredictionHistory user={user} authLoading={loading} />
          ) : (
            <>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">Account Overview</h2>
                  <p className="text-gray-400 text-sm mt-2 max-w-2xl">
                    Your personal football activity will be shown here as favorites, pinned matches,
                    prediction history, and settings are updated.
                  </p>
                </div>
                <span className="hidden sm:inline-flex items-center gap-2 text-xs text-gray-400 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full px-3 py-1">
                  <FaBell className="text-[#8b5cf6]" />
                  Account hub
                </span>
              </div>

              <ProfilePlaceholderGrid items={profileItems.slice(1)} />
            </>
          )}
        </PanelCard>
      </div>
    </div>
  );
};

export default ProfilePage;
