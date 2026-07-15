import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createPredictionPick,
  fetchPredictionOptions,
  removePredictionPick,
  syncMatchPredictionOdds,
} from "../services/matchDetailService";

export const useMatchPrediction = ({ apiFixtureId, user }) => {
  const [options, setOptions] = useState(null);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [message, setMessage] = useState("");
  const [savingOddId, setSavingOddId] = useState(null);
  const [deletingPickId, setDeletingPickId] = useState(null);
  const [syncingOdds, setSyncingOdds] = useState(false);

  const loadOptions = useCallback(async () => {
    setLoadingOptions(true);
    const result = await fetchPredictionOptions({ apiFixtureId });

    if(result.ok){
      setOptions(result.data);
      setMessage(result.data?.message || "Prediction options loaded");
    }else{
      setOptions(null);
      setMessage(result.data?.message || result.data?.error || "Failed to load prediction options");
    }

    setLoadingOptions(false);
  }, [apiFixtureId]);

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      loadOptions();
    }, 0);

    return () => window.clearTimeout(loadTimer);
  }, [loadOptions, user]);

  const currentPick = useMemo(() => {
    return (options?.my_picks || [])[0] || null;
  }, [options]);

  const handlePick = async (odd) => {
    if(!user){
      setMessage("Login first to make a prediction.");
      return;
    }

    if(options?.is_locked){
      setMessage("Prediction is locked because kickoff time has passed.");
      return;
    }

    setSavingOddId(odd.fixture_odd_id);
    const result = await createPredictionPick({
      apiFixtureId,
      fixtureOddId: odd.fixture_odd_id,
    });

    if(result.ok){
      setMessage(result.data?.message || "Prediction pick saved");
      await loadOptions();
    }else{
      setMessage(result.data?.message || result.data?.error || "Failed to save prediction pick");
    }

    setSavingOddId(null);
  };

  const handleDeletePick = async (predictionPickId) => {
    if(!user){
      setMessage("Login first to manage predictions.");
      return;
    }

    setDeletingPickId(predictionPickId);
    const result = await removePredictionPick({ predictionPickId });

    if(result.ok){
      setMessage(result.data?.message || "Prediction pick removed");
      await loadOptions();
    }else{
      setMessage(result.data?.message || result.data?.error || "Failed to remove prediction pick");
    }

    setDeletingPickId(null);
  };

  const handleSyncOdds = async () => {
    setSyncingOdds(true);
    setMessage("Syncing odds from API-FOOTBALL...");

    const result = await syncMatchPredictionOdds({ apiFixtureId });

    if(result.ok){
      setMessage(result.data?.message || "Prediction odds synced");
      await loadOptions();
    }else{
      setMessage(result.data?.message || result.data?.error || "Failed to sync prediction odds");
    }

    setSyncingOdds(false);
  };

  return {
    currentPick,
    deletingPickId,
    handleDeletePick,
    handlePick,
    handleSyncOdds,
    loadingOptions,
    message,
    options,
    savingOddId,
    syncingOdds,
  };
};
