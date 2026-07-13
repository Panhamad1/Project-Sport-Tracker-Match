import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChartBar, FaChartLine, FaMedal, FaSpinner, FaTrophy } from 'react-icons/fa';
import { getMyPredictions } from '../../api/football/PredictionApi';
import { getLeaderboard } from '../../api/leaderboard/LeaderboardApi';
import { useAuth } from '../../hooks/useAuth';

const formatPoints = (points) => {
    const value = Number(points || 0);

    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
        maximumFractionDigits: 2,
    }).format(value);
};

const formatPercent = (value) => {
    const numberValue = Number(value || 0);

    return `${new Intl.NumberFormat('en-US', {
        minimumFractionDigits: Number.isInteger(numberValue) ? 0 : 2,
        maximumFractionDigits: 2,
    }).format(numberValue)}%`;
};

const StatBox = ({ label, value, icon, className = 'text-[#8b5cf6]' }) => {
    return (
        <div className="group cursor-default rounded-lg bg-[#2a2a2a] p-3 text-center transition-all duration-300 hover:bg-[#2a2a2a]/80">
            <div className={`flex items-center justify-center gap-1.5 ${className}`}>
                {icon}
                <span className="text-[10px] font-semibold uppercase tracking-wider">{label}</span>
            </div>
            <p className="mt-1 text-lg font-bold text-white">
                {value}
            </p>
        </div>
    );
};

const UserStatsCard = () => {
    const { user, loading: authLoading } = useAuth();
    const [predictions, setPredictions] = useState([]);
    const [leaderboardEntry, setLeaderboardEntry] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadStats = async () => {
            if(!user){
                return;
            }

            setLoading(true);

            const [predictionResult, leaderboardResult] = await Promise.all([
                getMyPredictions(),
                getLeaderboard({ limit: 100 }),
            ]);

            if(predictionResult.ok){
                setPredictions(predictionResult.data?.predictions || []);
            }else{
                setPredictions([]);
            }

            if(leaderboardResult.ok){
                const leaderboard = leaderboardResult.data?.leaderboard || [];
                setLeaderboardEntry(leaderboard.find((entry) => entry.username === user.username) || null);
            }else{
                setLeaderboardEntry(null);
            }

            setLoading(false);
        };

        loadStats();
    }, [user]);

    const summary = useMemo(() => {
        const settledPredictions = predictions.filter((prediction) => prediction.points_awarded !== null && prediction.points_awarded !== undefined);
        const won = settledPredictions.filter((prediction) => Number(prediction.points_awarded || 0) > 0).length;
        const winRate = settledPredictions.length === 0 ? 0 : (won / settledPredictions.length) * 100;
        const points = leaderboardEntry?.points ?? user?.points ?? 0;

        return {
            rank: leaderboardEntry?.rank || '-',
            points,
            predictionCount: predictions.length,
            winRate,
        };
    }, [leaderboardEntry, predictions, user]);

    if(authLoading){
        return (
            <div className="rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] p-4 text-gray-400">
                <div className="flex items-center gap-3">
                    <FaSpinner className="animate-spin text-[#8b5cf6]" />
                    Loading account...
                </div>
            </div>
        );
    }

    if(!user){
        return (
            <div className="rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] p-4 transition-all duration-300 hover:border-[#8b5cf6]/30">
                <div className="mb-3 flex items-center gap-2">
                    <FaChartBar className="text-base text-[#8b5cf6]" />
                    <h4 className="text-lg font-semibold text-white">Prediction Stats</h4>
                </div>
                <p className="text-sm text-gray-400">Login to track your picks, points, rank, and win rate.</p>
                <Link to="/login" className="mt-4 flex w-full items-center justify-center rounded-lg border border-[#8b5cf6]/20 bg-[#8b5cf6]/10 py-2 text-xs font-medium text-[#a78bfa] transition-all hover:border-[#8b5cf6]/40 hover:bg-[#8b5cf6]/20">
                    Login to Continue
                </Link>
            </div>
        );
    }

    return (
        <div className="rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] p-4 transition-all duration-300 hover:border-[#8b5cf6]/30 hover:shadow-lg hover:shadow-[#8b5cf6]/5">
            <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center justify-center gap-2">
                    <FaChartBar className="text-base text-[#8b5cf6]" />
                    <h4 className="text-lg font-semibold text-white">Prediction Stats</h4>
                </div>

                <div className="flex gap-2 rounded-lg border border-[#8b5cf6]/20 bg-[#8b5cf6]/10 p-1">
                    <span className="text-[10px] font-bold tracking-wider text-gray-400">Rank:</span>
                    <p className="text-[14px] font-bold leading-none text-[#8b5cf6]">#{summary.rank}</p>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center gap-3 rounded-lg bg-[#2a2a2a] p-6 text-sm text-gray-400">
                    <FaSpinner className="animate-spin text-[#8b5cf6]" />
                    Loading stats...
                </div>
            ) : (
                <div className="mb-3 grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-2">
                    <StatBox label="Points" value={formatPoints(summary.points)} icon={<FaTrophy className="text-xs" />} />
                    <StatBox label="Picks" value={summary.predictionCount} icon={<FaChartBar className="text-xs" />} className="text-blue-400" />
                    <StatBox label="Win Rate" value={formatPercent(summary.winRate)} icon={<FaChartLine className="text-xs" />} className="text-green-400" />
                    <StatBox label="Rank" value={`#${summary.rank}`} icon={<FaMedal className="text-xs" />} className="text-[#a78bfa]" />
                </div>
            )}

            <div className="mb-3 border-t border-[#2a2a2a]"></div>

            <Link to="/prediction">
                <button className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#8b5cf6]/20 bg-gradient-to-r from-[#8b5cf6]/10 to-[#6d28d9]/10 py-1.5 text-xs font-medium text-[#8b5cf6] transition-all duration-300 hover:border-[#8b5cf6]/40 hover:from-[#8b5cf6]/20 hover:to-[#6d28d9]/20">
                    View Prediction Center
                </button>
            </Link>
        </div>
    );
};

export default UserStatsCard;
