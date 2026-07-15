import { FaPlus, FaSpinner, FaTrash } from "react-icons/fa";
import PanelCard from "../common/PanelCard";

const DreamTeamSettingsPanel = ({
  deleting,
  dreamTeamId,
  dreamTeams,
  formation,
  formations,
  loading,
  maxDreamTeams,
  onCreateNewTeam,
  onDelete,
  onFormationChange,
  onSelectDreamTeam,
  onTeamNameChange,
  saving,
  teamName,
}) => {
  return (
    <PanelCard className="p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-semibold">Team Settings</h2>
        <span className="rounded-full bg-[#1a1a1a] px-2 py-1 text-xs text-gray-400">
          {dreamTeams.length}/{maxDreamTeams}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        {dreamTeams.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {dreamTeams.map((dreamTeam) => (
              <button
                key={dreamTeam.dream_team_id}
                type="button"
                onClick={() => onSelectDreamTeam(dreamTeam)}
                className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                  dreamTeamId === dreamTeam.dream_team_id
                    ? "border-[#8b5cf6] bg-[#8b5cf6]/20 text-white"
                    : "border-[#2a2a2a] bg-[#111111] text-gray-400 hover:text-white"
                }`}
              >
                {dreamTeam.name || "Dream Team"}
              </button>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={onCreateNewTeam}
          disabled={dreamTeams.length >= maxDreamTeams || loading || saving}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#2a2a2a] bg-[#111111] px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:bg-[#1a1a1a] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FaPlus />
          New Team
        </button>
      </div>

      <label className="mt-4 block text-sm text-gray-300">
        Team Name
        <input
          type="text"
          value={teamName}
          onChange={(event) => onTeamNameChange(event.target.value)}
          className="mt-1 w-full rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-2 text-sm text-white focus:border-[#8b5cf6] focus:outline-none"
        />
      </label>

      <label className="mt-4 block text-sm text-gray-300">
        Formation
        <select
          value={formation}
          onChange={(event) => onFormationChange(event.target.value)}
          className="mt-1 w-full rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-2 text-sm text-white focus:border-[#8b5cf6] focus:outline-none"
        >
          {formations.map((item) => (
            <option key={item.formation} value={item.formation}>{item.formation}</option>
          ))}
        </select>
      </label>

      <button
        type="button"
        onClick={onDelete}
        disabled={deleting || loading}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-200 transition-all hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {deleting ? <FaSpinner className="animate-spin" /> : <FaTrash />}
        {dreamTeamId ? "Delete Team" : "Clear Draft"}
      </button>
    </PanelCard>
  );
};

export default DreamTeamSettingsPanel;
