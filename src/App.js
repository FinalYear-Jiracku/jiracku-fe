import { Route, Routes } from "react-router-dom";
import MainLayout from "./layout/MainLayout/MainLayout";
import ProjectsPage from "./pages/AuthorizedPage/ProjectsPage";

function App() {
  return (
    <div className="App">
      <MainLayout>
        <Routes>
          <Route path="/projects" element={<ProjectsPage/>}/>
        </Routes>
      </MainLayout>
    </div>
  );
}

export default App;
