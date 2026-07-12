import MatchList from '../components/HomePage/MatchList';
import TopMatchCard from '../components/HomePage/TopMatchCard';
import UserStatsCard from '../components/HomePage/UserStatsCard';
import RecentNews from '../components/HomePage/RecentNews';
import PopularLeagues from '../components/HomePage/PopularLeagues';

const HomePage = () => {
    return (
        <div className="text-white h-[calc(100vh-120px)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
                <div className="lg:col-span-9 overflow-y-auto pr-2 space-y-6 scrollbar-hide">
                    <div>
                        <h1 className="text-3xl font-bold">Football Score</h1>
                        <p className="text-gray-400 mt-1">Your ultimate football tracking platform</p>
                    </div>

                    <TopMatchCard />

                    <div className="lg:hidden">
                        <UserStatsCard />
                    </div>

                    <MatchList />
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
