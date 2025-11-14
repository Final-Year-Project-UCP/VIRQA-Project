import {  Routes, Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout.jsx"
import LandingPage from "../Pages/LandingPages/LandingPage.jsx"
import Login from "../Pages/LoginPages/Login.jsx";
const AppRoutes = () => {
  return (
      <Routes>
        {/* Pages without layout */}
        <Route path="/landing-page" element={<LandingPage />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/institute-register" element={<LandingPage />} />

        {/* Pages with layout */}
        <Route path="/api/v1/" element={<MainLayout />}>
          <Route path="home" element={<h1>Home</h1>} />
        </Route>

      </Routes>
  );
};
export default AppRoutes;
