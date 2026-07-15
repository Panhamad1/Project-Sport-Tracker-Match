import { useCallback, useEffect, useState } from "react";
import { fetchNewsArticles } from "../services/newsService";

export const useNewsPage = () => {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("Loading news...");
  const [loading, setLoading] = useState(true);

  const loadNews = useCallback(async (searchValue = "") => {
    setLoading(true);
    const result = await fetchNewsArticles({
      search: searchValue,
      limit: 18,
    });

    if(result.ok){
      setArticles(result.data?.articles || []);
      setMessage(result.data?.message || "News loaded successfully");
    }else{
      setArticles([]);
      setMessage(result.data?.message || result.data?.error || "Failed to load news");
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadNews("");
    }, 0);

    return () => clearTimeout(timer);
  }, [loadNews]);

  const handleSearch = (event) => {
    event.preventDefault();
    loadNews(search);
  };

  return {
    articles,
    handleSearch,
    loadNews,
    loading,
    message,
    search,
    setSearch,
  };
};
