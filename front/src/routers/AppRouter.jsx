import {BrowserRouter, Routes, Route} from 'react-router-dom';

import MainLayout from '../layouts/MainLayout';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import HomePage from '../pages/HomePage';
import ProfilePage from '../pages/ProfilePage';
import AdminPanelPage from '../pages/AdminPanelPage';
import MatchesPage from '../pages/MatchesPage';
import MatchDetailPage from '../pages/MatchDetailPage';

function AppRouter() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<SignupPage />} />

            <Route element={<MainLayout />}>
                <Route path="/home" element={<HomePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/profile/favorites" element={<ProfilePage />} />
                <Route path="/profile/pinned" element={<ProfilePage />} />
                <Route path="/profile/predictions" element={<ProfilePage />} />
                <Route path="/profile/settings" element={<ProfilePage />} />
                <Route path="/matches" element={<MatchesPage />} />
                <Route path="/matches/:matchId" element={<MatchDetailPage />} />
                <Route path="/admin" element={<AdminPanelPage />} />
            </Route>
        </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
