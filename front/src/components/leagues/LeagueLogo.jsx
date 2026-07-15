import { FaTrophy } from "react-icons/fa";

const LeagueLogo = ({ league, className = "h-12 w-12" }) => {
  if(league?.logo){
    return (
      <img
        src={league.logo}
        alt=""
        className={`${className} rounded-full object-contain`}
      />
    );
  }

  return (
    <span className={`${className} inline-flex items-center justify-center rounded-full bg-[#8b5cf6]/15 text-[#a78bfa]`}>
      <FaTrophy />
    </span>
  );
};

export default LeagueLogo;
