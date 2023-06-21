import { Route, Routes } from "react-router-dom";
import MainLayout from "./layout/MainLayout/MainLayout";
import ProjectsPage from "./pages/AuthorizedPage/ProjectsPage";
import SprintsPage from "./pages/AuthorizedPage/SprintsPage";
import { useState } from "react";
import Context from "./context/Context";

function App() {
  const [id, setId] = useState(null);
  return (
    <div className="App">
      <Context.Provider value={id}>
        <MainLayout>
          <Routes>
            <Route
              path="/projects"
              element={<ProjectsPage/>}
            />
            <Route
              path="/projects/:projectId"
              element={<SprintsPage setId={setId}/>}
            />
          </Routes>
        </MainLayout>
      </Context.Provider>
    </div>
  );
}

export default App;
