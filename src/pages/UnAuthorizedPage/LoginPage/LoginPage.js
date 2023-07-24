import { useContext, useEffect, useState } from "react";
import { login } from "../../../api/login-api";
import { message } from "antd";
import {
  ACCESS_TOKEN,
  MESSAGE,
  REFRESH_TOKEN,
} from "../../../constants/constants";
import GoogleAuthContext from "../../../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import Loading from "../../../components/Atoms/Loading/Loading";
import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useContext(GoogleAuthContext);
  const [loading, setLoading] = useState(false);

  const setAuthUser = async () => {
    if (
      window.localStorage.getItem(ACCESS_TOKEN) &&
      window.localStorage.getItem(REFRESH_TOKEN)
      // Cookies.get(ACCESS_TOKEN) &&
      // Cookies.get(REFRESH_TOKEN)
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
        navigate("/projects");
      } catch (error) {
        message.error(MESSAGE.AUTHORIZATION_FAIL);
        setLoading(false);
      }
    }
  };

  const handleCallbackResponse = async (res) => {
    const tokenId = {
      tokenId: res.credential,
    };
    await login(tokenId)
      .then(async (response) => {
        window.localStorage.setItem(ACCESS_TOKEN, response.accessToken);
        window.localStorage.setItem(REFRESH_TOKEN, response.refreshToken);
        // Cookies.set(ACCESS_TOKEN, response.accessToken);
        // Cookies.set(REFRESH_TOKEN, response.refreshToken);
        await setAuthUser();
      })
      .catch((err) => {
        if (err?.response?.status === 400) {
          if (err?.response?.data) {
            message.error(MESSAGE.FPT_FE);
          }
        }
        if (err.response.status === 500) {
          message.error(MESSAGE.AUTHORIZATION_FAIL);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: `${process.env.REACT_APP_GOOGLE_CLIENT_ID}`,
      callback: handleCallbackResponse,
    });
    google.accounts.id.prompt();
    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "filled_blue",
      size: "large",
      shape: "square",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div>{loading ? <Loading /> : <div id="signInDiv"></div>}</div>;
};

export default LoginPage;
