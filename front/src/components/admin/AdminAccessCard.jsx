import { Navigate } from "react-router-dom";
import { FaShieldAlt, FaSpinner } from "react-icons/fa";
import PanelCard from "../common/PanelCard";

const AdminAccessCard = ({ loading, user, isAdmin }) => {
  if(loading){
    return (
      <div className="text-white flex items-center gap-3">
        <FaSpinner className="animate-spin text-[#8b5cf6]" />
        Loading admin access...
      </div>
    );
  }

  if(!user){
    return <Navigate to="/login" replace />;
  }

  if(!isAdmin){
    return (
      <div className="text-white max-w-2xl">
        <PanelCard className="p-6">
          <FaShieldAlt className="text-3xl text-red-400 mb-4" />
          <h1 className="text-2xl font-bold">Admin account required</h1>
          <p className="text-gray-400 mt-2">
            Your account is logged in, but it is not an admin account. The sync tools are hidden from normal users.
          </p>
        </PanelCard>
      </div>
    );
  }

  return null;
};

export default AdminAccessCard;
