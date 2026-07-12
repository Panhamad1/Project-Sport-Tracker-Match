import { FaNewspaper, FaClock, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const RecentNews = () => {
    const newsItems = [
        { id: 1, title: 'Kylian Mbappé officially presented at the Bernabéu', time: '2 hours ago' },
        { id: 2, title: 'Premier League announces new VAR changes for 2026', time: '5 hours ago' },
        { id: 3, title: 'Messi breaks another record in MLS', time: '1 day ago' }
    ];

    return (
        <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#2a2a2a] hover:border-[#8b5cf6]/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center gap-2 text-sm">
                    <FaNewspaper className="text-[#8b5cf6]" />
                    Recent News
                </h3>
                <Link to="/news" className="text-xs text-[#8b5cf6] hover:text-[#7c3aed] transition-colors flex items-center gap-1">
                    View All
                    <FaChevronRight className="text-[8px]" />
                </Link>
            </div>

            <div className="space-y-3">
                {newsItems.map((news) => (
                    <div key={news.id} className="border-l-2 border-[#2a2a2a] pl-3 hover:border-[#8b5cf6] hover:bg-[#2a2a2a]/50 rounded-r-lg transition-all cursor-pointer py-1">
                        <p className="text-xs text-white truncate">{news.title}</p>
                        <span className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
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