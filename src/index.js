import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HeaderProvider } from "./context/HeaderProvider";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { GoogleAuthProvider } from "./context/AuthProvider";
import { SignalRProvider } from "./context/SignalRContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <GoogleAuthProvider>
      <Provider store={store}>
        <SignalRProvider>
            <HeaderProvider>
              <Routes>
                <Route path="/*" element={<App />} />
              </Routes>
            </HeaderProvider>
        </SignalRProvider>
      </Provider>
    </GoogleAuthProvider>
  </BrowserRouter>
);
