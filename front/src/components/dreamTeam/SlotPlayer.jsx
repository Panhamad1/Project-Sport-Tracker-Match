const SlotPlayer = ({ player, slot }) => {
  if(player?.photo){
    return (
      <img
        src={player.photo}
        alt=""
        className="mx-auto h-10 w-10 rounded-full border border-white/20 object-cover"
      />
    );
  }

  return (
    <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/35 text-xs font-bold text-white">
      {player?.name ? player.name.slice(0, 2).toUpperCase() : slot.slot}
    </span>
  );
};

export default SlotPlayer;
