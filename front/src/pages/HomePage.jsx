import { useState } from 'react';
import Leagues from '../components/HomePage/Leagues';
import MatchList from '../components/HomePage/MatchList';
import LeagueStandings from '../components/HomePage/LeagueStandings';
import UserStatsCard from '../components/HomePage/UserStatsCard';
import RecentNews from '../components/HomePage/RecentNews';
import PopularLeagues from '../components/HomePage/PopularLeagues';

const HomePage = () => {
    const [selectedLeague, setSelectedLeague] = useState('All');
    const [matchData, setMatchData] = useState(null);

    const handleLeagueSelect = (league) => {
        setSelectedLeague(league);
        // When user selects a league, clear the auto-match data so standings show the selected league
        setMatchData(null);
    };

    const handleMatchesUpdate = (data) => {
        setMatchData(data);
    };

    return (
        <div className="text-white h-[calc(100vh-120px)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
                <div className="lg:col-span-9 overflow-y-auto pr-2 space-y-6 scrollbar-hide">
                    <div>
                        <h1 className="text-3xl font-bold">Football Score</h1>
                        <p className="text-gray-400 mt-1">Your ultimate football tracking platform</p>
                    </div>

                    <div className="lg:hidden">
                        <UserStatsCard />
                    </div>

                    <Leagues
                        selectedLeague={selectedLeague}
                        onSelectLeague={handleLeagueSelect}
                    />

                    <MatchList
                        selectedLeague={selectedLeague} 
                        onMatchesUpdate={handleMatchesUpdate}
                    />

                    <LeagueStandings 
                        selectedLeague={selectedLeague} 
                        matchData={matchData}
                    />
                </div>

                <div className="hidden lg:block lg:col-span-3 overflow-y-auto space-y-6 scrollbar-hide">
                    <UserStatsCard />
                    <PopularLeagues />
                    <RecentNews />
                </div>
            </div>
        </div>
    );
};

export default HomePage;