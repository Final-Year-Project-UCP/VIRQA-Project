import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute.jsx";
import MainLayout from "../layout/CandidatesLayout.jsx";
import LandingPage from "../Pages/LandingPages/LandingPage.jsx";
import Login from "../Pages/LoginPages/Login.jsx";
import ForcePasswordChange from "../Pages/LoginPages/ForcePasswordChange.jsx";
import ForgotPasswordStageOne from "../Pages/LoginPages/ForgetPassword.jsx";
import VerifyOTPAndResetPassword from "../Pages/LoginPages/VerifyOTPAndReset.jsx";
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
import AdminDashboard from "../Pages/AdminPages/Dashboard/Dashboard.jsx";
import AdminLayout from "../layout/AdminLayout.jsx";
import ManageEmployee from "../Pages/AdminPages/ManageEmployee/ManageEmployee.jsx";
import { View } from "lucide-react";
import ViewInterview from "../Pages/AdminPages/ViewInterveiw/ViewInterview.jsx";
import ManageProfile from "../Pages/AdminPages/Profile/ManageProfile.jsx";
import AdminNotification from "../Pages/AdminPages/Notification/AdminNotification.jsx";
import EmployeeFeedback from "../Pages/EmployerPages/Feedback/Feedback.jsx";
import EmployerCandidateResult from "../Pages/EmployerPages/Interview/EmployerCandidateResult.jsx";
import InterviewConduct from "../Pages/InterviewConduct.jsx";
import AdminFeedback from "../Pages/AdminPages/Feedback/Feedback.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Pages without layout */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/force-password-change" element={<ForcePasswordChange />} />
      <Route path="/institute-register" element={<LandingPage />} />
      <Route path="/forget-password" element={<ForgotPasswordStageOne />} />
      <Route path="/reset-password/verify-otp" element={<VerifyOTPAndResetPassword />} />
      <Route path="/interview" element={<InterviewConduct />} />
      <Route path="/interview/:id" element={<InterviewConduct />} />

      <Route element={<ProtectedRoute allowedRoles={['candidate']} />}>
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
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['employee']} />}>
        <Route path="/api/v1/employee" element={<EmployeesLayout />}>
          <Route path="dashboard" element={<EmployeeDashboard />} />
          <Route path="profile" element={<ProfileSettings />} />
          <Route path="create-interview" element={<CreateInterviewForm />} />
          <Route path="history" element={<InterviewHistory />} />
          <Route path="evaluation/:sessionId/:candidateId" element={<EmployerCandidateResult />} />
          <Route path="notifications" element={<EmployeeNotificationsPage />} />
          <Route path="feedback" element={<EmployeeFeedback />} />
        </Route>
      </Route>


      <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
        <Route path="/api/v1/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="manage/employee" element={<ManageEmployee />} />
          <Route path="view/interview" element={<ViewInterview />} />
          <Route path="profile" element={<ManageProfile />} />
          <Route path="notifications" element={<AdminNotification />} />
          <Route path="feedback" element={<AdminFeedback />} />
          <Route path="comingsoon/settings" element={<ComingSoon />} />
        </Route>
      </Route>


      {/* If route is not found */}
      <Route path="*" element={<ErrorPage />} />

    </Routes>
  );
};

export default AppRoutes;
