import { FaCrown, FaSearch, FaTrophy } from "react-icons/fa";
import PanelCard from "../components/common/PanelCard";

const leagueGroups = [
  {
    title: "International",
    leagues: [
      { name: "World Cup", apiLeagueId: 1, season: "2026" },
      { name: "Champions League", apiLeagueId: 2, season: "2024" },
    ],
  },
  {
    title: "Domestic",
    leagues: [
      { name: "Premier League", apiLeagueId: 39, season: "2024" },
      { name: "LaLiga", apiLeagueId: 140, season: "2024" },
      { name: "Saudi Pro League", apiLeagueId: 307, season: "2024" },
      { name: "MLS", apiLeagueId: 253, season: "2024" },
    ],
  },
];

const LeaguesPage = () => {
  return (
    <div className="space-y-6 text-white">
      <div>
        <p className="text-sm font-medium text-[#8b5cf6]">Leagues</p>
        <h1 className="mt-1 text-2xl font-bold">League Center</h1>
        <p className="mt-2 max-w-3xl text-sm text-gray-400">
          Browse the main leagues used by the project and use search to open saved teams, players, matches, and league data.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          {leagueGroups.map((group) => (
            <PanelCard key={group.title} className="p-5">
              <h2 className="flex items-center gap-2 font-semibold">
                <FaCrown className="text-[#8b5cf6]" />
                {group.title}
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                {group.leagues.map((league) => (
                  <div key={league.apiLeagueId} className="rounded-lg border border-[#2a2a2a] bg-[#111111] p-4">
                    <p className="font-semibold">{league.name}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-400">
                      <span className="rounded-full bg-black/25 px-2.5 py-1">League {league.apiLeagueId}</span>
                      <span className="rounded-full bg-black/25 px-2.5 py-1">Season {league.season}</span>
                    </div>
                  </div>
                ))}
              </div>
            </PanelCard>
          ))}
        </div>

        <aside className="space-y-5">
          <PanelCard className="p-5">
            <h2 className="flex items-center gap-2 font-semibold">
              <FaSearch className="text-[#8b5cf6]" />
              Find League Data
            </h2>
            <p className="mt-3 text-sm text-gray-400">
              Use the top search bar to find synced leagues and teams from the database.
            </p>
          </PanelCard>

          <PanelCard className="p-5">
            <h2 className="flex items-center gap-2 font-semibold">
              <FaTrophy className="text-[#8b5cf6]" />
              Standings
            </h2>
            <p className="mt-3 text-sm text-gray-400">
              League tables use standings saved from the admin panel.
            </p>
          </PanelCard>
        </aside>
      </div>
    </div>
  );
};

export default LeaguesPage;
