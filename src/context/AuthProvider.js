import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, MESSAGE } from "../constants/constants";
import { message } from "antd";
import jwtDecode from "jwt-decode";

const GoogleAuthContext = React.createContext();

export const GoogleAuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [auth, setAuth] = useState({});
  
  useEffect(() => {
    if (
      !window.localStorage.getItem(ACCESS_TOKEN) &&
      location.pathname !== "/home"
    ) {
      setAuth({});
      navigate("/home");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, location.pathname]);

  useEffect(() => {
    if (window.localStorage.getItem(ACCESS_TOKEN)) {
      try {
        let infor = jwtDecode(window.localStorage.getItem(ACCESS_TOKEN))
        setAuth({infor});
      } catch (error) {
        message.error(MESSAGE.AUTHORIZATION_FAIL);
      }
    } else {
      if (location.pathname !== "/home") {
        navigate("/home");
      }
      setAuth({});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GoogleAuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </GoogleAuthContext.Provider>
  );
};

export default GoogleAuthContext;
