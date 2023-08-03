import { Route, Routes } from "react-router-dom";
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

function App() { 
  return (
    <div className="App">
      <MainLayout>
          <Routes>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/user" element={<UsersPage/>}/>
            <Route path="/projects" element={<ProjectsPage/>}/>
             <Route path="/report/:projectId" element={<ReportPage/>}/>
            <Route path="/projects/:projectId" element={<SprintsPage/>}/>
            <Route path="/chat/:projectId" element={<ChatPage/>}/>
            <Route path="/notifications/:projectId" element={<NotificationPage/>}/>
            <Route path="/projects/:projectId/:sprintId" element={<IssuesPage/>}/>
            <Route path="/accept-invite/:inviteToken" element={<AcceptInvite/>}/>
          </Routes>
        </MainLayout>
    </div>
  );
}

export default App;
