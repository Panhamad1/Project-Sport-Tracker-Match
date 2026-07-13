const fallbackApiBaseUrl = "http://localhost:4000";

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || fallbackApiBaseUrl).replace(/\/+$/, "");

const buildApiUrl = (path) => {
  return `${apiBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;
};

export { apiBaseUrl, buildApiUrl };
