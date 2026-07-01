import {BrowserRouter, Routes, Route} from 'react-router-dom';

import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';

function AppRouter() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<SignupPage />} />
        </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;