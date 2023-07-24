import { Route, Routes } from "react-router-dom";
import MainLayout from "./layout/MainLayout/MainLayout";
import ProjectsPage from "./pages/AuthorizedPage/ProjectsPage";
import SprintsPage from "./pages/AuthorizedPage/SprintsPage";
import IssuesPage from "./pages/AuthorizedPage/IssuesPage";
import HomePage from "./pages/UnAuthorizedPage/HomePage/HomePage";
import UsersPage from "./pages/AuthorizedPage/UsersPage";
import AcceptInvite from "./pages/UnAuthorizedPage/AcceptInvite/Acceptinvite";;

function App() { 
  
  return (
    <div className="App">
        <MainLayout>
          <Routes>
            <Route path="/home" element={<HomePage/>}/>
            <Route path="/user" element={<UsersPage/>}/>
            <Route path="/projects" element={<ProjectsPage/>}/>
            <Route path="/projects/:projectId" element={<SprintsPage/>}/>
            <Route path="/projects/:projectId/:sprintId" element={<IssuesPage/>}/>
            <Route path="/accept-invite/:inviteToken" element={<AcceptInvite/>}/>
          </Routes>
        </MainLayout>
    </div>
  );
}

export default App;
