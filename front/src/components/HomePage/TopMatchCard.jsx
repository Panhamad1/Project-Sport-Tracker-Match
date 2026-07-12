import { FaBolt, FaClock } from 'react-icons/fa';

const topMatch = {
    league: 'World Cup',
    date: '2026-07-11',
    time: '78:32',
    status: 'Live',
    home: { name: 'France', logo: 'FRA', score: 2 },
    away: { name: 'Argentina', logo: 'ARG', score: 1 },
};

const TopMatchCard = () => {
    return (
        <section className="overflow-hidden rounded-lg border border-[#8b5cf6]/25 bg-[#101010]">
            <div className="border-b border-[#2a2a2a] px-5 py-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-2 rounded-full bg-[#8b5cf6]/15 px-3 py-1 text-xs font-semibold text-[#a78bfa]">
                            <FaBolt />
                            Top Match
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-full bg-red-500/15 px-3 py-1 text-xs font-semibold text-red-400">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400"></span>
                            {topMatch.status}
                        </span>
                    </div>
                    <p className="text-xs text-gray-500">{topMatch.league} - {topMatch.date}</p>
                </div>
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 py-5">
                <div className="min-w-0">
                    <div className="mb-2 inline-flex rounded-md bg-black/30 px-2.5 py-1 text-xs font-bold text-[#a78bfa]">
                        {topMatch.home.logo}
                    </div>
                    <h2 className="truncate text-xl font-bold md:text-2xl">{topMatch.home.name}</h2>
                    <p className="mt-1 text-xs text-gray-500">Home</p>
                </div>

                <div className="min-w-[112px] rounded-lg bg-black/40 px-5 py-3 text-center">
                    <p className="text-3xl font-black leading-none text-white">
                        {topMatch.home.score} - {topMatch.away.score}
                    </p>
                    <p className="mt-2 flex items-center justify-center gap-1 text-xs text-gray-400">
                        <FaClock className="text-[10px]" />
                        {topMatch.time}
                    </p>
                </div>

                <div className="min-w-0 text-right">
                    <div className="mb-2 inline-flex rounded-md bg-black/30 px-2.5 py-1 text-xs font-bold text-[#a78bfa]">
                        {topMatch.away.logo}
                    </div>
                    <h2 className="truncate text-xl font-bold md:text-2xl">{topMatch.away.name}</h2>
                    <p className="mt-1 text-xs text-gray-500">Away</p>
                </div>
            </div>
        </section>
    );
};

export default TopMatchCard;
