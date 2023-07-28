import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, MESSAGE, REFRESH_TOKEN } from "../constants/constants";
import { message } from "antd";
import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";

const GoogleAuthContext = React.createContext();

export const GoogleAuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [auth, setAuth] = useState({});
 
  useEffect(() => {
    if (
      !window.localStorage.getItem(ACCESS_TOKEN) &&
      !window.localStorage.getItem(REFRESH_TOKEN) &&
      // !Cookies.get(ACCESS_TOKEN) &&
      // !Cookies.get(REFRESH_TOKEN) &&
      location.pathname !== "/login"
    ) {
      setAuth({});
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, location.pathname]);

  useEffect(() => {
    if (
      // Cookies.get(ACCESS_TOKEN) &&
      // Cookies.get(REFRESH_TOKEN)
      window.localStorage.getItem(ACCESS_TOKEN) &&
      window.localStorage.getItem(REFRESH_TOKEN)
    ) {
      try {
        let infor = jwtDecode(window.localStorage.getItem(ACCESS_TOKEN));
        //let infor = jwtDecode(Cookies.get(ACCESS_TOKEN));
        setAuth({
          id: infor?.Id,
          name: infor?.Name,
          email: infor.Email,
          image: infor?.Image,
          exp: infor?.exp,
        });
      } catch (error) {
        message.error(MESSAGE.AUTHORIZATION_FAIL);
      }
    } else {
      if (location.pathname !== "/login") {
        setAuth({});
        navigate("/login");
      }
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
