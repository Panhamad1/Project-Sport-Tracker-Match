import { Link } from 'react-router-dom';
import { FaChevronRight, FaNewspaper } from 'react-icons/fa';

const RecentNews = () => {
    return (
        <div className="rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] p-4 transition-all duration-300 hover:border-[#8b5cf6]/20">
            <div className="mb-3 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                    <FaNewspaper className="text-[#8b5cf6]" />
                    Football News
                </h3>
                <Link to="/news" className="flex items-center gap-1 text-xs text-[#8b5cf6] transition-colors hover:text-[#a78bfa]">
                    Open
                    <FaChevronRight className="text-[8px]" />
                </Link>
            </div>

            <div className="rounded-lg border border-dashed border-[#2a2a2a] p-4 text-center">
                <p className="text-sm font-medium text-white">No News Added Yet</p>
                <p className="mt-2 text-xs text-gray-500">
                    News will appear here after the news service is connected.
                </p>
            </div>
        </div>
    );
};

export default RecentNews;
