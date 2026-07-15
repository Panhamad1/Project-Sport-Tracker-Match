import { useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "./useAuth";
import { fetchMatchDetail } from "../services/matchDetailService";
import { matchDetailTabs } from "../components/matchDetail/MatchDetailSections";

export const useMatchDetailPage = () => {
  const { matchId: apiFixtureId } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const initialTab = searchParams.get("tab") || "overview";
  const validTab = matchDetailTabs.some((tab) => tab.key === initialTab) ? initialTab : "overview";
  const [activeTab, setActiveTab] = useState(validTab);
  const [match, setMatch] = useState(null);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const loadMatch = async () => {
      setLoading(true);

      const result = await fetchMatchDetail(apiFixtureId);

      if(result.ok){
        setMatch(result.data?.match || null);
        setDetails(result.data?.details || null);
        setMessage(result.data?.message || "Match loaded");
      }else{
        setMatch(null);
        setDetails(null);
        setMessage(result.data?.message || result.data?.error || "Failed to load match");
      }

      setLoading(false);
    };

    loadMatch();
  }, [apiFixtureId]);

  const handleActiveStreamsChange = useCallback((streamLinks) => {
    setDetails((currentDetails) => currentDetails
      ? {
        ...currentDetails,
        streams: streamLinks,
      }
      : currentDetails);
  }, []);

  const overview = details?.overview;
  return {
    activeTab,
    apiFixtureId,
    details,
    handleActiveStreamsChange,
    isAdmin,
    loading,
    match,
    message,
    overview,
    setActiveTab,
    user,
  };
};
