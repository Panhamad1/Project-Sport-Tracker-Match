import {BrowserRouter, Navigate, Routes, Route} from 'react-router-dom';

import MainLayout from '../layouts/MainLayout';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import HomePage from '../pages/HomePage';
import ProfilePage from '../pages/ProfilePage';
import AdminPanelPage from '../pages/AdminPanelPage';
import MatchesPage from '../pages/MatchesPage';
import MatchDetailPage from '../pages/MatchDetailPage';
import LeaderboardPage from '../pages/LeaderboardPage';
import LeaguesPage from '../pages/LeaguesPage';
import NewsPage from '../pages/NewsPage';
import PredictionPage from '../pages/PredictionPage';

function AppRouter() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<SignupPage />} />
            <Route path="/signup" element={<SignupPage />} />

            <Route element={<MainLayout />}>
                <Route path="/home" element={<HomePage />} />
                <Route path="/leagues" element={<LeaguesPage />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/prediction" element={<PredictionPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/profile/favorites" element={<ProfilePage />} />
                <Route path="/profile/pinned" element={<ProfilePage />} />
                <Route path="/profile/predictions" element={<Navigate to="/prediction" replace />} />
                <Route path="/profile/settings" element={<ProfilePage />} />
                <Route path="/matches" element={<MatchesPage />} />
                <Route path="/matches/:matchId" element={<MatchDetailPage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/admin" element={<AdminPanelPage />} />
            </Route>
        </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
