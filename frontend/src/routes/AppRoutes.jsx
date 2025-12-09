import { Routes, Route } from "react-router-dom";
import MainLayout from "../layout/CandidatesLayout.jsx";
import LandingPage from "../Pages/LandingPages/LandingPage.jsx";
import Login from "../Pages/LoginPages/Login.jsx";
import ForgotPasswordStageOne from "../Pages/LoginPages/ForgetPassword.jsx";
import Dashboard from "../Pages/CandidatesPages/Dashboard/Dashboard.jsx";
import Notification from '../components/common/Notifications/Notification.jsx';
import Profile from "../Pages/CandidatesPages/My Profile/Profile.jsx";
import JoinInterview from "../Pages/CandidatesPages/JoinInterview/JoinInterview.jsx";
import Results from "../Pages/CandidatesPages/Results/Results.jsx";
import NotificationDetails from "../components/common/Notifications/components/NotificationDetails.jsx";
import EmployeesLayout from "../layout/EmployeeLayout.jsx";
import EmployeeDashboard from "../Pages/EmployerPages/Dashboard/Dashboard.jsx";
import ProfileSettings from "../Pages/EmployerPages/Profile/Profile.jsx";
import ErrorPage from "../Pages/ErrorPages/ErrorPage.jsx";

import CreateInterviewForm from "../Pages/EmployerPages/Interview/CreateInterview.jsx";
import InterviewHistory from "../Pages/EmployerPages/Interview/InterviewHistory.jsx";
const AppRoutes = () => {
  return (
    <Routes>
      {/* Pages without layout */}
      <Route path="/landing-page" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/institute-register" element={<LandingPage />} />
      <Route path="/forget-password" element={<ForgotPasswordStageOne />} />

      {/* Candidate routes with layout */}
      <Route path="/api/v1/candidates" element={<MainLayout />}>
        <Route path="home" element={<Dashboard />} />
        <Route path="notifications" element={<Notification />} />
        <Route path="notifications/:id" element={<NotificationDetails />} />
        <Route path="profile" element={<Profile />} />
        <Route path="join" element={<JoinInterview />} />
        <Route path="results" element={<Results />} />
      </Route>

      <Route path="/api/v1/employee" element={<EmployeesLayout />}>
        <Route path="dashboard" element={<EmployeeDashboard />} />
        <Route path="profile" element={<ProfileSettings />} />
        <Route path="create-interview" element={<CreateInterviewForm />} />
        <Route path="history" element={<InterviewHistory />} />
      </Route>

      {/* If route is not found */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

export default AppRoutes;
