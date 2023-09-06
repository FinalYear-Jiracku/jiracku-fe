import { Button, Result } from "antd";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import SignalRContext from "../../../context/SignalRContext";
import GoogleAuthContext from "../../../context/AuthProvider";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../../constants/constants";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const {connection, chatConnection} = useContext(SignalRContext);
  const { setAuth } = useContext(GoogleAuthContext);
  
  const backToLogin = () => {
    window.localStorage.removeItem(ACCESS_TOKEN);
    window.localStorage.removeItem(REFRESH_TOKEN);
    // Cookies.remove(ACCESS_TOKEN);
    // Cookies.remove(REFRESH_TOKEN);
    setAuth({});
    connection.stop();
    chatConnection.stop();
    navigate("/login");
  };

  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      className="w-full h-full"
      extra={
        <Button onClick={backToLogin} type="primary">
          Back To Login
        </Button>
      }
    />
  );
};

export default NotFoundPage;
