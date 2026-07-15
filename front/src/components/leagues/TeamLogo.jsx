import { FaShieldAlt } from "react-icons/fa";

const TeamLogo = ({ team }) => {
  if(team?.logo){
    return (
      <img
        src={team.logo}
        alt=""
        className="h-8 w-8 shrink-0 rounded-full object-contain"
      />
    );
  }

  return (
    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1a1a1a] text-xs text-[#a78bfa]">
      <FaShieldAlt />
    </span>
  );
};

export default TeamLogo;
