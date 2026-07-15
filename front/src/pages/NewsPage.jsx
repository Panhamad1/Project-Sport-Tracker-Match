import { FaExternalLinkAlt, FaNewspaper, FaSearch, FaSyncAlt } from "react-icons/fa";
import PanelCard from "../components/common/PanelCard";
import NoDataState from "../components/matches/NoDataState";
import { useNewsPage } from "../hooks/useNewsPage";

const formatNewsDate = (value) => {
  if(!value){
    return "No date";
  }

  return new Date(value).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const NewsPage = () => {
  const {
    articles,
    handleSearch,
    loadNews,
    loading,
    message,
    search,
    setSearch,
  } = useNewsPage();

  return (
    <div className="space-y-6 text-white">
      <div>
        <p className="text-sm font-medium text-[#8b5cf6]">News</p>
        <h1 className="mt-1 text-2xl font-bold">Football News</h1>
        <p className="mt-2 max-w-3xl text-sm text-gray-400">
          Football articles saved by admin sync are shown here.
        </p>
      </div>

      <PanelCard className="p-5">
        <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="flex items-center gap-2 font-semibold">
            <FaNewspaper className="text-[#8b5cf6]" />
            Latest Articles
          </h2>
          <form onSubmit={handleSearch} className="flex w-full flex-col gap-2 sm:flex-row lg:max-w-xl">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search saved football news..."
                className="w-full rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] py-2 pl-9 pr-3 text-sm text-white outline-none transition focus:border-[#8b5cf6]"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#8b5cf6] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#7c3aed]"
            >
              <FaSearch />
              Search
            </button>
            <button
              type="button"
              onClick={() => loadNews(search)}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#2a2a2a] px-4 py-2 text-sm text-gray-300 transition hover:border-[#8b5cf6] hover:text-white"
            >
              <FaSyncAlt />
              Refresh
            </button>
          </form>
        </div>

        <p className="mb-4 text-xs text-gray-500">{message}</p>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-72 animate-pulse rounded-lg border border-[#2a2a2a] bg-[#111111]" />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <NoDataState
            title="No Articles Available"
            message="No football news articles have been saved yet."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {articles.map((article) => (
              <article key={article.id} className="overflow-hidden rounded-lg border border-[#2a2a2a] bg-[#111111]">
                {article.image ? (
                  <img
                    src={article.image}
                    alt={article.title}
                    className="h-40 w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-40 items-center justify-center bg-[#1a1a1a] text-[#8b5cf6]">
                    <FaNewspaper className="text-3xl" />
                  </div>
                )}
                <div className="space-y-3 p-4">
                  <div className="flex items-center justify-between gap-3 text-xs text-gray-500">
                    <span className="truncate">{article.source_name || "Football News"}</span>
                    <span className="shrink-0">{formatNewsDate(article.published_at)}</span>
                  </div>
                  <h3 className="line-clamp-2 min-h-[48px] font-semibold leading-6 text-white">{article.title}</h3>
                  <p className="line-clamp-3 min-h-[60px] text-sm text-gray-400">
                    {article.description || article.content || "No article summary available."}
                  </p>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#a78bfa] transition hover:text-white"
                  >
                    Read article
                    <FaExternalLinkAlt className="text-xs" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </PanelCard>
    </div>
  );
};

export default NewsPage;
