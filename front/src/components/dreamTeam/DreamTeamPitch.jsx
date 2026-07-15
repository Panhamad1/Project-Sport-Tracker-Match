import SlotPlayer from "./SlotPlayer";

const DreamTeamPitch = ({ activeFormation, activeSlot, onSelectSlot, playersBySlot }) => {
  return (
    <div className="relative min-h-[620px] overflow-hidden rounded-lg border border-emerald-500/20 bg-emerald-900">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,.06)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/20"></div>
      <div className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20"></div>
      <div className="absolute bottom-0 left-1/2 h-24 w-52 -translate-x-1/2 rounded-t-lg border border-b-0 border-white/20"></div>

      {activeFormation.slots.map((slot) => {
        const player = playersBySlot[slot.slot];

        return (
          <button
            key={slot.slot}
            type="button"
            onClick={() => onSelectSlot(slot)}
            className={`absolute w-28 -translate-x-1/2 -translate-y-1/2 rounded-lg border p-2 text-center shadow-lg backdrop-blur transition-all ${
              activeSlot?.slot === slot.slot
                ? "border-white bg-white/20"
                : "border-white/15 bg-black/25 hover:border-white/40 hover:bg-black/35"
            }`}
            style={{
              left: `${slot.x}%`,
              top: `${slot.y}%`,
            }}
          >
            <SlotPlayer player={player} slot={slot} />
            <p className="mt-1 truncate text-xs font-semibold text-white">
              {player?.name || slot.slot}
            </p>
            <p className="text-[10px] text-emerald-100/70">{slot.position}</p>
          </button>
        );
      })}
    </div>
  );
};

export default DreamTeamPitch;
