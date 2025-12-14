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
import CandidateNotificationsPage from "../Pages/CandidatesPages/Notification/Candidatenotification.jsx";
import CreateInterviewForm from "../Pages/EmployerPages/Interview/CreateInterview.jsx";
import InterviewHistory from "../Pages/EmployerPages/Interview/InterviewHistory.jsx";
import EmployeeNotificationsPage from "../Pages/EmployerPages/Notification/EmployeeNotfiication.jsx";
import ResetPassword from "../Pages/CandidatesPages/ResetPassword/Reset.jsx";
import ComingSoon from "../Pages/ComingSoon/ComingSoon.jsx";
import ContactUs from "../Pages/CandidatesPages/ContactUs/Contactus.jsx";
import History from '../Pages/CandidatesPages/InterviewHistory/History.jsx'
import Feedback from "../Pages/CandidatesPages/Feedback/Feedback.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Pages without layout */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/institute-register" element={<LandingPage />} />
      <Route path="/forget-password" element={<ForgotPasswordStageOne />} />

      {/* Candidate routes with layout */}
      <Route path="/api/v1/candidates" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="notifications" element={<CandidateNotificationsPage />} />
        <Route path="notifications/:id" element={<NotificationDetails />} />
        <Route path="profile" element={<Profile />} />
        <Route path="join" element={<JoinInterview />} />
        <Route path="interview-history" element={<History />} />
        <Route path="results" element={<Results />} />
        <Route path="passwordreset" element={<ResetPassword />} />
        <Route path="comingsoon/files" element={<ComingSoon />} />
        <Route path="comingsoon/security" element={<ComingSoon />} />
        <Route path="comingsoon/transcription" element={<ComingSoon />} />
        <Route path="comingsoon/coverage" element={<ComingSoon />} />
        <Route path="contactus" element={<ContactUs />} />
        <Route path="feedback" element={<Feedback />} />

      </Route>

      <Route path="/api/v1/employee" element={<EmployeesLayout />}>
        <Route path="dashboard" element={<EmployeeDashboard />} />
        <Route path="profile" element={<ProfileSettings />} />
        <Route path="create-interview" element={<CreateInterviewForm />} />
        <Route path="history" element={<InterviewHistory />} />
        <Route path="notifications" element={< EmployeeNotificationsPage />} />

      </Route>

      {/* If route is not found */}
      <Route path="*" element={<ErrorPage />} />

    </Routes>
  );
};

export default AppRoutes;
