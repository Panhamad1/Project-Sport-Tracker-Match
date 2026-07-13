import MatchList from '../components/HomePage/MatchList';
import TopMatchCard from '../components/HomePage/TopMatchCard';
import UserStatsCard from '../components/HomePage/UserStatsCard';
import RecentNews from '../components/HomePage/RecentNews';
import PopularLeagues from '../components/HomePage/PopularLeagues';
import PinnedMatchesCard from '../components/HomePage/PinnedMatchesCard';

const HomePage = () => {
    return (
        <div className="text-white">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="space-y-6 lg:col-span-9">
                    <div>
                        <h1 className="text-3xl font-bold">Football Score</h1>
                        <p className="mt-1 text-gray-400">Saved fixtures, top match, and prediction activity from the database.</p>
                    </div>

                    <TopMatchCard />

                    <div className="lg:hidden">
                        <UserStatsCard />
                    </div>

                    <MatchList />
                    <PinnedMatchesCard />
                </div>

                <div className="hidden space-y-6 lg:col-span-3 lg:block">
                    <UserStatsCard />
                    <PopularLeagues />
                    <RecentNews />
                </div>
            </div>
        </div>
    );
};

export default HomePage;
