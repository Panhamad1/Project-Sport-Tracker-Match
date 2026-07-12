import { FaNewspaper, FaSyncAlt } from "react-icons/fa";
import PanelCard from "../components/common/PanelCard";
import NoDataState from "../components/matches/NoDataState";

const NewsPage = () => {
  return (
    <div className="space-y-6 text-white">
      <div>
        <p className="text-sm font-medium text-[#8b5cf6]">News</p>
        <h1 className="mt-1 text-2xl font-bold">Football News</h1>
        <p className="mt-2 max-w-3xl text-sm text-gray-400">
          Football articles and match updates from saved news data are shown here.
        </p>
      </div>

      <PanelCard className="p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 font-semibold">
            <FaNewspaper className="text-[#8b5cf6]" />
            Latest Articles
          </h2>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#8b5cf6]/15 px-3 py-1 text-xs text-[#a78bfa]">
            <FaSyncAlt />
            Database only
          </span>
        </div>

        <NoDataState
          title="No Articles Available"
          message="No football news articles have been saved yet."
        />
      </PanelCard>
    </div>
  );
};

export default NewsPage;
