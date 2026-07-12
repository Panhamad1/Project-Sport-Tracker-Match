import { Link, NavLink } from "react-router-dom";
import { FaShieldAlt, FaUserCircle } from "react-icons/fa";
import PanelCard from "../common/PanelCard";

const ProfileSidebar = ({ user, loading, isAdmin, items }) => {
  return (
    <PanelCard as="aside" className="p-4 h-fit">
      <div className="flex items-center gap-3 pb-4 border-b border-[#2a2a2a]">
        <FaUserCircle className="text-4xl text-[#8b5cf6]" />
        <div className="min-w-0">
          <p className="font-semibold truncate">
            {loading ? "Loading..." : user?.username || "Guest User"}
          </p>
          <p className="text-xs text-gray-500 truncate">{user?.email || "Login to use account features"}</p>
        </div>
      </div>

      <nav className="mt-4 space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/profile"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                isActive
                  ? "text-white bg-[#8b5cf6]/20 border border-[#8b5cf6]/30"
                  : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
              }`
            }
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}

        {isAdmin && (
          <Link
            to="/admin"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#a78bfa] hover:text-white hover:bg-[#8b5cf6]/20 transition-all"
          >
            <FaShieldAlt />
            <span>Admin Panel</span>
          </Link>
        )}
      </nav>
    </PanelCard>
  );
};

export default ProfileSidebar;
