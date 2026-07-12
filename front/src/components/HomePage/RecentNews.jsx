import { Link } from 'react-router-dom';
import { FaChevronRight, FaClock, FaNewspaper } from 'react-icons/fa';

const newsItems = [
    { id: 1, title: 'Kylian Mbappe officially presented at the Bernabeu', time: '2 hours ago' },
    { id: 2, title: 'Premier League announces new VAR changes for 2026', time: '5 hours ago' },
    { id: 3, title: 'Messi breaks another record in MLS', time: '1 day ago' },
];

const RecentNews = () => {
    return (
        <div className="rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] p-4 transition-all duration-300 hover:border-[#8b5cf6]/20">
            <div className="mb-3 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                    <FaNewspaper className="text-[#8b5cf6]" />
                    Recent News
                </h3>
                <Link to="/news" className="flex items-center gap-1 text-xs text-[#8b5cf6] transition-colors hover:text-[#a78bfa]">
                    View All
                    <FaChevronRight className="text-[8px]" />
                </Link>
            </div>

            <div className="space-y-3">
                {newsItems.map((news) => (
                    <div key={news.id} className="cursor-pointer rounded-r-lg border-l-2 border-[#2a2a2a] py-1 pl-3 transition-all hover:border-[#8b5cf6] hover:bg-[#2a2a2a]/50">
                        <p className="truncate text-xs text-white">{news.title}</p>
                        <span className="mt-0.5 flex items-center gap-1 text-[10px] text-gray-500">
                            <FaClock className="text-[8px]" />
                            {news.time}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentNews;
