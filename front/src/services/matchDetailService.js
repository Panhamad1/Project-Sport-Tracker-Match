import { syncPredictionOdds } from "../api/admin/AdminPredictionApi";
import { getMatchById } from "../api/football/FootballApi";
import {
  deletePredictionPick,
  getPredictionOptions,
  savePredictionPick,
} from "../api/football/PredictionApi";

export const fetchMatchDetail = (apiFixtureId) => {
  return getMatchById(apiFixtureId);
};

export const fetchPredictionOptions = ({ apiFixtureId }) => {
  return getPredictionOptions({ apiFixtureId });
};

export const createPredictionPick = ({ apiFixtureId, fixtureOddId }) => {
  return savePredictionPick({ apiFixtureId, fixtureOddId });
};

export const removePredictionPick = ({ predictionPickId }) => {
  return deletePredictionPick({ predictionPickId });
};

export const syncMatchPredictionOdds = ({ apiFixtureId }) => {
  return syncPredictionOdds({ apiFixtureId });
};
