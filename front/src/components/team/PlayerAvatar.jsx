import { FaUsers } from "react-icons/fa";

const PlayerAvatar = ({ player, size = "sm" }) => {
  const sizeClass = size === "md" ? "h-11 w-11" : "h-9 w-9";

  if(player?.photo){
    return <img src={player.photo} alt="" className={`${sizeClass} shrink-0 rounded-full object-cover`} />;
  }

  return (
    <span className={`inline-flex ${sizeClass} shrink-0 items-center justify-center rounded-full bg-[#1a1a1a] text-[#a78bfa]`}>
      <FaUsers />
    </span>
  );
};

export default PlayerAvatar;
