import { Route, Routes } from "react-router-dom";
import MainLayout from "./layout/MainLayout/MainLayout";
import ProjectsPage from "./pages/AuthorizedPage/ProjectsPage";
import SprintsPage from "./pages/AuthorizedPage/SprintsPage";
import IssuesPage from "./pages/AuthorizedPage/IssuesPage";
import HomePage from "./pages/UnAuthorizedPage/HomePage/HomePage";

function App() {  
  return (
    <div className="App">
        <MainLayout>
          <Routes>
            <Route path="/home" element={<HomePage/>}/>
            <Route path="/projects" element={<ProjectsPage/>}/>
            <Route path="/projects/:projectId" element={<SprintsPage/>}/>
            <Route path="/projects/:projectId/:sprintId" element={<IssuesPage/>}/>
          </Routes>
        </MainLayout>
    </div>
  );
}

export default App;
