import { Link } from "react-router-dom";
import { FaHeart, FaSpinner } from "react-icons/fa";
import PanelCard from "../common/PanelCard";
import TeamLogo from "./TeamLogo";

const TeamProfileHeader = ({
  authLoading,
  favoriteLoading,
  favoriteMessage,
  isFavorite,
  onFavoriteToggle,
  profileChips,
  team,
  user,
}) => {
  return (
    <PanelCard className="overflow-hidden">
      <div className="p-5">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center">
            <TeamLogo team={team} />
            <div className="min-w-0">
              <p className="text-sm font-medium text-[#8b5cf6]">Team Profile</p>
              <h1 className="mt-1 truncate text-3xl font-bold">{team.name}</h1>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-400">
                {profileChips.map((chip) => (
                  <span key={chip.key} className="rounded-full bg-[#111111] px-3 py-1">{chip.label}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start gap-2 xl:items-end">
            {user ? (
              <button
                type="button"
                onClick={onFavoriteToggle}
                disabled={favoriteLoading}
                className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all disabled:cursor-not-allowed ${
                  isFavorite
                    ? "border border-red-500/25 bg-red-500/10 text-red-200 hover:bg-red-500/20"
                    : "bg-[#8b5cf6] text-white hover:bg-[#7c3aed]"
                }`}
              >
                {favoriteLoading ? <FaSpinner className="animate-spin" /> : <FaHeart />}
                {isFavorite ? "Remove Favorite" : "Add Favorite"}
              </button>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#8b5cf6] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#7c3aed]"
              >
                <FaHeart />
                Login to Favorite
              </Link>
            )}
            <p className="min-h-4 text-xs text-gray-500">
              {authLoading ? "Checking account..." : favoriteMessage}
            </p>
          </div>
        </div>
      </div>
    </PanelCard>
  );
};

export default TeamProfileHeader;
