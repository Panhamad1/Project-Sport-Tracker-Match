import { FaSave, FaSpinner, FaSyncAlt, FaUsers } from "react-icons/fa";
import PanelCard from "../components/common/PanelCard";
import DreamTeamPitch from "../components/dreamTeam/DreamTeamPitch";
import DreamTeamSettingsPanel from "../components/dreamTeam/DreamTeamSettingsPanel";
import DreamTeamSlotEditor from "../components/dreamTeam/DreamTeamSlotEditor";
import NoDataState from "../components/matches/NoDataState";
import { useDreamTeamPage } from "../hooks/useDreamTeamPage";

const DreamTeamPage = () => {
  const {
    activeFormation,
    activeSlot,
    authLoading,
    clearSlot,
    closeSlotEditor,
    deleting,
    dreamTeamId,
    dreamTeams,
    error,
    filledSlots,
    formation,
    formations,
    handleCreateNewTeam,
    handleDelete,
    handleFormationChange,
    handlePlayerSearchChange,
    handleRoleFilterChange,
    handleSave,
    handleSelectDreamTeam,
    handleSelectSlot,
    isPlayerUsedInOtherSlot,
    loadDreamTeam,
    loading,
    maxDreamTeams,
    message,
    playerResults,
    playerRoleFilter,
    playerSearch,
    playerSearchLoading,
    playerSearchMessage,
    playersBySlot,
    saving,
    selectPlayerForSlot,
    selectedSlotPlayer,
    setTeamName,
    teamName,
    user,
  } = useDreamTeamPage();

  if(authLoading){
    return (
      <div className="flex items-center gap-3 text-white">
        <FaSpinner className="animate-spin text-[#8b5cf6]" />
        Checking account...
      </div>
    );
  }

  if(!user){
    return (
      <div className="text-white">
        <NoDataState
          title="Login Required"
          message="Login to build and save your dream team."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-medium text-[#8b5cf6]">Dream Team</p>
          <h1 className="mt-1 text-2xl font-bold">Dream Team Builder</h1>
          <p className="mt-2 max-w-3xl text-sm text-gray-400">
            Pick a formation, place players into each slot, and save your personal football lineup.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={loadDreamTeam}
            disabled={loading || saving}
            className="inline-flex items-center gap-2 rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#2a2a2a] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <FaSpinner className="animate-spin" /> : <FaSyncAlt />}
            Refresh
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || loading}
            className="inline-flex items-center gap-2 rounded-lg bg-[#8b5cf6] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#7c3aed] disabled:cursor-not-allowed disabled:bg-[#3f315f]"
          >
            {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
            Save Team
          </button>
        </div>
      </div>

      {(message || error) && (
        <div className={`rounded-lg border px-4 py-3 text-sm ${
          error
            ? "border-red-500/30 bg-red-500/10 text-red-200"
            : "border-[#8b5cf6]/30 bg-[#8b5cf6]/10 text-[#d8b4fe]"
        }`}>
          {error || message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_360px]">
        <PanelCard className="overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#2a2a2a] p-5">
            <div className="min-w-0">
              <h2 className="flex items-center gap-2 font-semibold">
                <FaUsers className="text-[#8b5cf6]" />
                {teamName || "My Dream Team"}
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                {formation} - {filledSlots}/{activeFormation.slots.length || 11} slots filled
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {formations.map((item) => (
                <button
                  key={item.formation}
                  type="button"
                  onClick={() => handleFormationChange(item.formation)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                    formation === item.formation
                      ? "border-[#8b5cf6] bg-[#8b5cf6]/20 text-white"
                      : "border-[#2a2a2a] bg-[#111111] text-gray-400 hover:text-white"
                  }`}
                >
                  {item.formation}
                </button>
              ))}
            </div>
          </div>

          <div className="p-5">
            <DreamTeamPitch
              activeFormation={activeFormation}
              activeSlot={activeSlot}
              onSelectSlot={handleSelectSlot}
              playersBySlot={playersBySlot}
            />
          </div>
        </PanelCard>

        <div className="space-y-5">
          <DreamTeamSettingsPanel
            deleting={deleting}
            dreamTeamId={dreamTeamId}
            dreamTeams={dreamTeams}
            formation={formation}
            formations={formations}
            loading={loading}
            maxDreamTeams={maxDreamTeams}
            onCreateNewTeam={handleCreateNewTeam}
            onDelete={handleDelete}
            onFormationChange={handleFormationChange}
            onSelectDreamTeam={handleSelectDreamTeam}
            onTeamNameChange={setTeamName}
            saving={saving}
            teamName={teamName}
          />

          <DreamTeamSlotEditor
            activeSlot={activeSlot}
            clearSlot={clearSlot}
            closeSlotEditor={closeSlotEditor}
            isPlayerUsedInOtherSlot={isPlayerUsedInOtherSlot}
            onPlayerSearchChange={handlePlayerSearchChange}
            onRoleFilterChange={handleRoleFilterChange}
            playerResults={playerResults}
            playerRoleFilter={playerRoleFilter}
            playerSearch={playerSearch}
            playerSearchLoading={playerSearchLoading}
            playerSearchMessage={playerSearchMessage}
            selectPlayerForSlot={selectPlayerForSlot}
            selectedSlotPlayer={selectedSlotPlayer}
          />
        </div>
      </div>
    </div>
  );
};

export default DreamTeamPage;
