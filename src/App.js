import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./layout/MainLayout/MainLayout";
import ProjectsPage from "./pages/AuthorizedPage/ProjectsPage";
import SprintsPage from "./pages/AuthorizedPage/SprintsPage";
import IssuesPage from "./pages/AuthorizedPage/IssuesPage";
import UsersPage from "./pages/AuthorizedPage/UsersPage";
import AcceptInvite from "./pages/UnAuthorizedPage/AcceptInvite/Acceptinvite";
import LoginPage from "./pages/UnAuthorizedPage/LoginPage/LoginPage";
import NotificationPage from "./pages/AuthorizedPage/Notification";
import ReportPage from "./pages/AuthorizedPage/ReportPage";
import ChatPage from "./pages/AuthorizedPage/ChatPage";
import UpgradeProject from "./pages/AuthorizedPage/UpgradePage";
import CalenderPage from "./pages/AuthorizedPage/CalendarPage";
import MeetingPage from "./pages/AuthorizedPage/MeetingPage";
import ValidateOtp from "./pages/AuthorizedPage/ValidateOtpPage";
import ListUserPage from "./pages/AdminPage/ListUserPage";
import DashBoardPage from "./pages/AdminPage/DashBoardPage";
import NotFoundPage from "./pages/AuthorizedPage/404Page";
import { useContext } from "react";
import GoogleAuthContext from "./context/AuthProvider";

const RequiredAuthAdminDashboard = ({ allowedRole }) => {
  const { auth } = useContext(GoogleAuthContext);
  return allowedRole?.includes(auth?.role) ? (
    <DashBoardPage />
  ) : (
    <Navigate to="/projects" />
  );
};

const RequiredAuthAdminListUser = ({ allowedRole }) => {
  const { auth } = useContext(GoogleAuthContext);
  return allowedRole?.includes(auth?.role) ? (
    <ListUserPage />
  ) : (
    <Navigate to="/projects" />
  );
};

const RequiredAuthUser = ({ allowedRole }) => {
  const { auth } = useContext(GoogleAuthContext);
  return allowedRole?.includes(auth?.role) ? (
    <ProjectsPage />
  ) : (
    <Navigate to="/admin/dashboard" />
  );
};

function App() {
  return (
    <div className="App">
      <MainLayout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/dashboard" element={<RequiredAuthAdminDashboard allowedRole={["Admin"]}/>}/>
          <Route path="/admin/userList" element={<RequiredAuthAdminListUser allowedRole={["Admin"]}/>} />
          <Route path="/validateOtp" element={<ValidateOtp />} />
          <Route path="/user" element={<UsersPage />} />
          <Route path="/projects" element={<RequiredAuthUser allowedRole={["User"]}/>} />
          <Route path="/projects/:projectId" element={<SprintsPage />} />
          <Route path="/report/:projectId" element={<ReportPage />} />
          <Route path="/calendar/:projectId" element={<CalenderPage />} />
          <Route
            path="/projects/upgraded/:projectId"
            element={<UpgradeProject />}
          />
          <Route path="/chat/:projectId" element={<ChatPage />} />
          <Route path="/meeting" element={<MeetingPage />} />
          <Route
            path="/notifications/:projectId"
            element={<NotificationPage />}
          />
          <Route
            path="/projects/:projectId/:sprintId"
            element={<IssuesPage />}
          />
          <Route
            path="/accept-invite/:inviteToken"
            element={<AcceptInvite />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </MainLayout>
    </div>
  );
}

export default App;
