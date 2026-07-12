import { useState } from "react";
import { FaCalendarAlt, FaListUl, FaRedo, FaSpinner, FaSyncAlt } from "react-icons/fa";
import { loadFixturesByDate } from "../../api/admin/AdminSyncApi";
import PanelCard from "../common/PanelCard";

const today = new Date().toISOString().slice(0, 10);

const getTeamName = (team) => {
  return team?.name || "Unknown Team";
};

const getScoreText = (fixture) => {
  if(fixture.home_goals === null || fixture.home_goals === undefined || fixture.away_goals === null || fixture.away_goals === undefined){
    return fixture.match_time_local || "TBD";
  }

  return `${fixture.home_goals} - ${fixture.away_goals}`;
};

const getResponseMessage = (result) => {
  if(typeof result.data === "string"){
    return result.data;
  }

  return result.data?.message || result.data?.error || "Failed to load fixtures";
};

const AdminMatchDetailHelper = ({ onRefreshFixture, onSyncAllDetails, onSyncDetails }) => {
  const [date, setDate] = useState(today);
  const [fixtures, setFixtures] = useState([]);
  const [loadState, setLoadState] = useState({
    loading: false,
    loaded: false,
    message: "",
    count: 0,
  });
  const [syncingFixtureId, setSyncingFixtureId] = useState(null);
  const [syncingAllDetails, setSyncingAllDetails] = useState(false);
  const [refreshingFixtureId, setRefreshingFixtureId] = useState(null);

  const handleLoadFixtures = async (event) => {
    event.preventDefault();
    setLoadState({
      loading: true,
      loaded: false,
      message: "Loading saved fixtures...",
      count: 0,
    });

    const result = await loadFixturesByDate({ date });

    if(result.ok){
      const savedFixtures = result.data?.fixtures || [];
      setFixtures(savedFixtures);
      setLoadState({
        loading: false,
        loaded: true,
        message: result.data?.message || "Fixtures loaded",
        count: result.data?.count || savedFixtures.length,
      });
      return;
    }

    setFixtures([]);
    setLoadState({
      loading: false,
      loaded: true,
      message: getResponseMessage(result),
      count: 0,
    });
  };

  const handleSyncDetails = async (fixture) => {
    setSyncingFixtureId(fixture.id);

    try{
      await onSyncDetails(fixture);
    }finally{
      setSyncingFixtureId(null);
    }
  };

  const handleSyncAllDetails = async () => {
    setSyncingAllDetails(true);

    try{
      await onSyncAllDetails({
        date,
        fixturesCount: fixtures.length,
      });
    }finally{
      setSyncingAllDetails(false);
    }
  };

  const handleRefreshFixture = async (fixture) => {
    setRefreshingFixtureId(fixture.id);

    try{
      const result = await onRefreshFixture(fixture);

      if(result?.ok && result.data?.result){
        setFixtures((currentFixtures) => currentFixtures.map((item) => {
          if(item.id !== fixture.id){
            return item;
          }

          const refreshed = result.data.result;

          return {
            ...item,
            status_short: refreshed.status_short,
            status_long: refreshed.status_long,
            elapsed: refreshed.elapsed,
            home_goals: refreshed.home_goals,
            away_goals: refreshed.away_goals,
            last_updated: refreshed.last_updated,
          };
        }));
      }
    }finally{
      setRefreshingFixtureId(null);
    }
  };

  return (
    <PanelCard className="p-5 h-fit self-start lg:col-span-2">
      <div className="flex items-start gap-3">
        <div className="p-3 bg-[#8b5cf6]/15 text-[#a78bfa] rounded-lg">
          <FaListUl />
        </div>
        <div>
          <h2 className="font-semibold text-lg">Match Detail Helper</h2>
          <p className="text-gray-400 text-sm mt-1">
            Load saved fixtures by date, then sync details without manually typing the local match id.
          </p>
        </div>
      </div>

      <form onSubmit={handleLoadFixtures} className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 mt-5">
        <label className="text-sm text-gray-300">
          Fixture date
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="mt-1 w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#8b5cf6]"
            required
          />
        </label>

        <button
          type="submit"
          disabled={loadState.loading}
          className="sm:self-end inline-flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] disabled:bg-[#111111] disabled:cursor-not-allowed border border-[#2a2a2a] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
        >
          {loadState.loading ? (
            <>
              <FaSpinner className="animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <FaCalendarAlt />
              Load Fixtures
            </>
          )}
        </button>
      </form>

      {loadState.loaded && (
        <div className="mt-4 rounded-lg border border-[#2a2a2a] bg-[#111111] p-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <p className="text-sm text-gray-300">{loadState.message}</p>
            <span className="w-fit rounded-full bg-[#8b5cf6]/15 px-3 py-1 text-xs text-[#a78bfa]">
              {loadState.count} saved fixture{loadState.count === 1 ? "" : "s"}
            </span>
          </div>
        </div>
      )}

      {fixtures.length > 0 && (
        <>
          <div className="mt-4 rounded-lg border border-[#2a2a2a] bg-[#111111] p-3">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold text-white">Bulk match detail sync</p>
                <p className="mt-1 text-xs text-gray-500">
                  Sync details for all {fixtures.length} saved fixture{fixtures.length === 1 ? "" : "s"} on {date}. This can use several API requests.
                </p>
              </div>
              <button
                type="button"
                onClick={handleSyncAllDetails}
                disabled={syncingAllDetails}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#8b5cf6] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#7c3aed] disabled:bg-[#3f315f] disabled:cursor-not-allowed"
              >
                {syncingAllDetails ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Syncing all...
                  </>
                ) : (
                  <>
                    <FaSyncAlt />
                    Sync All Details
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="mt-4 max-h-[520px] overflow-y-auto pr-1 space-y-3">
            {fixtures.map((fixture) => (
              <article key={fixture.id} className="rounded-lg border border-[#2a2a2a] bg-[#111111] p-3">
                <div className="grid grid-cols-1 xl:grid-cols-[1fr_auto] gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                      <span>Local ID: {fixture.id}</span>
                      <span>API ID: {fixture.api_fixture_id}</span>
                      <span>{fixture.league?.name || "Unknown League"}</span>
                      <span>{fixture.match_date_local || date}</span>
                    </div>

                    <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        {fixture.homeTeam?.logo && (
                          <img src={fixture.homeTeam.logo} alt="" className="h-6 w-6 rounded-full object-contain" />
                        )}
                        <p className="truncate text-sm font-medium">{getTeamName(fixture.homeTeam)}</p>
                      </div>

                      <div className="rounded bg-black/30 px-3 py-1 text-sm font-semibold text-white">
                        {getScoreText(fixture)}
                      </div>

                      <div className="flex items-center justify-end gap-2 min-w-0 text-right">
                        <p className="truncate text-sm font-medium">{getTeamName(fixture.awayTeam)}</p>
                        {fixture.awayTeam?.logo && (
                          <img src={fixture.awayTeam.logo} alt="" className="h-6 w-6 rounded-full object-contain" />
                        )}
                      </div>
                    </div>

                    <p className="mt-2 text-xs text-gray-500">
                      {fixture.status_short || "NS"} - {fixture.status_long || "Not started"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <button
                      type="button"
                      onClick={() => handleRefreshFixture(fixture)}
                      disabled={refreshingFixtureId === fixture.id}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#2a2a2a] disabled:bg-[#111111] disabled:cursor-not-allowed"
                    >
                      {refreshingFixtureId === fixture.id ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Refreshing...
                        </>
                      ) : (
                        <>
                          <FaRedo />
                          Refresh Score
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSyncDetails(fixture)}
                      disabled={syncingFixtureId === fixture.id}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#8b5cf6] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#7c3aed] disabled:bg-[#3f315f] disabled:cursor-not-allowed"
                    >
                      {syncingFixtureId === fixture.id ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Syncing...
                        </>
                      ) : (
                        <>
                          <FaSyncAlt />
                          Sync Details
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </article>
            ))}
          </div>
        </>
      )}
    </PanelCard>
  );
};

export default AdminMatchDetailHelper;
