import ProfilePredictionHistory from "../components/profile/ProfilePredictionHistory";
import { useAuth } from "../hooks/useAuth";

const PredictionPage = () => {
  const { user, loading } = useAuth();

  return (
    <div className="space-y-6 text-white">
      <div>
        <p className="text-sm font-medium text-[#8b5cf6]">Predictions</p>
        <h1 className="mt-1 text-2xl font-bold">Prediction Center</h1>
        <p className="mt-2 max-w-3xl text-sm text-gray-400">
          Track your active picks, settled results, win rate, and point changes from match predictions.
        </p>
      </div>

      <ProfilePredictionHistory user={user} authLoading={loading} framed />
    </div>
  );
};

export default PredictionPage;
