import { getNewsArticles } from "../api/football/NewsApi";

export const fetchNewsArticles = ({ search = "", limit = 18 } = {}) => {
  return getNewsArticles({ search, limit });
};
