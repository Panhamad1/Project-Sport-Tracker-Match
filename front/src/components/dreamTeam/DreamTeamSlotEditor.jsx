import { FaSearch, FaSpinner, FaTimes, FaUser } from "react-icons/fa";
import PanelCard from "../common/PanelCard";
import PlayerSearchResult from "./PlayerSearchResult";
import { playerRoleFilters } from "./dreamTeamUtils";

const DreamTeamSlotEditor = ({
  activeSlot,
  clearSlot,
  closeSlotEditor,
  isPlayerUsedInOtherSlot,
  onPlayerSearchChange,
  onRoleFilterChange,
  playerResults,
  playerRoleFilter,
  playerSearch,
  playerSearchLoading,
  playerSearchMessage,
  selectPlayerForSlot,
  selectedSlotPlayer,
}) => {
  return (
    <PanelCard className="p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-semibold">Selected Slot</h2>
        {activeSlot && (
          <button
            type="button"
            onClick={closeSlotEditor}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-[#1a1a1a] hover:text-white"
          >
            <FaTimes />
          </button>
        )}
      </div>

      {!activeSlot ? (
        <p className="mt-4 text-sm text-gray-400">Click a position on the pitch to edit that player.</p>
      ) : (
        <div className="mt-4 space-y-4">
          <div className="rounded-lg border border-[#2a2a2a] bg-[#111111] p-3">
            <p className="text-sm font-semibold text-white">{activeSlot.slot}</p>
            <p className="mt-1 text-xs text-gray-500">{activeSlot.position} position</p>
          </div>

          {selectedSlotPlayer.api_player_id && (
            <div className="flex items-center gap-3 rounded-lg border border-[#8b5cf6]/30 bg-[#8b5cf6]/10 p-3">
              {selectedSlotPlayer.photo ? (
                <img src={selectedSlotPlayer.photo} alt="" className="h-11 w-11 rounded-full object-cover" />
              ) : (
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1a1a1a] text-[#a78bfa]">
                  <FaUser />
                </span>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{selectedSlotPlayer.name}</p>
                <p className="text-xs text-gray-400">{selectedSlotPlayer.nationality || "Saved player"}</p>
              </div>
            </div>
          )}

          <label className="block text-sm text-gray-300">
            Search Player
            <div className="relative mt-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500" />
              <input
                type="text"
                value={playerSearch}
                onChange={(event) => onPlayerSearchChange(event.target.value)}
                placeholder="Search player name"
                className="w-full rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-9 py-2 text-sm text-white focus:border-[#8b5cf6] focus:outline-none"
              />
              {playerSearchLoading && (
                <FaSpinner className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-sm text-[#8b5cf6]" />
              )}
            </div>
          </label>

          <div className="flex flex-wrap gap-2">
            {playerRoleFilters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => onRoleFilterChange(filter.value)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                  playerRoleFilter === filter.value
                    ? "border-[#8b5cf6] bg-[#8b5cf6]/20 text-white"
                    : "border-[#2a2a2a] bg-[#111111] text-gray-400 hover:text-white"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {playerSearchMessage && (
            <p className="text-xs text-gray-500">{playerSearchMessage}</p>
          )}

          {playerResults.length > 0 && (
            <div className="max-h-72 space-y-2 overflow-y-auto rounded-lg border border-[#2a2a2a] bg-[#111111] p-2">
              {playerResults.map((player) => {
                const alreadyUsed = isPlayerUsedInOtherSlot(player.api_player_id, activeSlot.slot);

                return (
                  <PlayerSearchResult
                    key={player.api_player_id}
                    alreadyUsed={alreadyUsed}
                    player={player}
                    onSelect={() => selectPlayerForSlot(activeSlot.slot, player)}
                  />
                );
              })}
            </div>
          )}

          <button
            type="button"
            onClick={() => clearSlot(activeSlot.slot)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#2a2a2a] bg-[#111111] px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:bg-[#1a1a1a] hover:text-white"
          >
            <FaTimes />
            Clear Slot
          </button>
        </div>
      )}
    </PanelCard>
  );
};

export default DreamTeamSlotEditor;
