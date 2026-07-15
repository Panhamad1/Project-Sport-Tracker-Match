import { FaUser } from "react-icons/fa";

const PlayerPhoto = ({ player }) => {
  if(player?.photo){
    return (
      <img
        src={player.photo}
        alt=""
        className="h-24 w-24 rounded-full object-cover sm:h-28 sm:w-28"
      />
    );
  }

  return (
    <span className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-[#8b5cf6]/15 text-4xl text-[#a78bfa] sm:h-28 sm:w-28">
      <FaUser />
    </span>
  );
};

export default PlayerPhoto;
