import {BrowserRouter, Routes, Route} from 'react-router-dom';

import MainLayout from '../layouts/MainLayout';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import HomePage from '../pages/HomePage';

function AppRouter() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<SignupPage />} />

            <Route element={<MainLayout />}>
                <Route path="/home" element={<HomePage />} />
            </Route>
        </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;