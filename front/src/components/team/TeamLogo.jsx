import { FaShieldAlt } from "react-icons/fa";

const TeamLogo = ({ team }) => {
  if(team?.logo){
    return (
      <img
        src={team.logo}
        alt=""
        className="h-20 w-20 rounded-full object-contain sm:h-24 sm:w-24"
      />
    );
  }

  return (
    <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-[#8b5cf6]/15 text-3xl text-[#a78bfa] sm:h-24 sm:w-24">
      <FaShieldAlt />
    </span>
  );
};

export default TeamLogo;
