import { Route, Routes } from "react-router-dom";
import MainLayout from "./layout/MainLayout/MainLayout";
import ProjectsPage from "./pages/AuthorizedPage/ProjectsPage";
import SprintsPage from "./pages/AuthorizedPage/SprintsPage";

function App() {
  return (
    <div className="App">
      <MainLayout>
        <Routes>
          <Route path="/projects" element={<ProjectsPage/>}/>
          <Route path="/projects/:projectId" element={<SprintsPage />} />
        </Routes>
      </MainLayout>
    </div>
  );
}

export default App;
