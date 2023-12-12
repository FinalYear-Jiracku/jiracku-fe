import { useContext, useEffect, useState } from "react";
import { adminLogin, login } from "../../../api/login-api";
import { Button, Form, Input, message } from "antd";
import {
  ACCESS_TOKEN,
  MESSAGE,
  REFRESH_TOKEN,
} from "../../../constants/constants";
import GoogleAuthContext from "../../../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import Loading from "../../../components/Atoms/Loading/Loading";
import jwtDecode from "jwt-decode";
import styles from "./styles.module.scss";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useContext(GoogleAuthContext);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  
  const setAuthUser = async () => {
    if (
      window.localStorage.getItem(ACCESS_TOKEN) &&
      window.localStorage.getItem(REFRESH_TOKEN)
    ) {
      try {
        let infor = jwtDecode(window.localStorage.getItem(ACCESS_TOKEN));
        setAuth({
          id: infor?.Id,
          name: infor?.Name,
          email: infor.Email,
          image: infor?.Image,
          isOtp: infor?.IsOtp,
          isSms: infor?.IsSms,
          role: infor?.Role,
          exp: infor?.exp,
        });
        if (infor?.IsOtp === "True" || infor?.IsSms === "True") {
          navigate("/validateOtp");
        }
        if (infor?.IsOtp !== "True" && infor?.IsSms !== "True" && infor?.Role === "Admin" ) {
          navigate("/admin/dashboard");
        }
        if (infor?.IsOtp !== "True" && infor?.IsSms !== "True" && infor?.Role === "User" ) {
          navigate("/projects");
        }
      } catch (error) {
        message.error(MESSAGE.AUTHORIZATION_FAIL);
        setLoading(false);
      }
    }
  };

  const onFinish = async (item) => {
    const loginData = {
      email: item.email === null ? "" : item.email,
      password: item.password === null ? "" : item.password,
    };
    await adminLogin(loginData)
      .then(async (response) => {
        window.localStorage.setItem(ACCESS_TOKEN, response.accessToken);
        window.localStorage.setItem(REFRESH_TOKEN, response.refreshToken);
        message.success(MESSAGE.AUTHORIZATION_SUCCESS);
        await setAuthUser();
      })
      .catch((err) => {
        if (err?.response?.status === 400) {
          if (
            err?.response?.data ===
            "User Not Found"
          ) {
            message.error(MESSAGE.AUTHORIZATION_FAIL);
          }
          if (
            err?.response?.data ===
            "Password Incorrect"
          ) {
            message.error(MESSAGE.AUTHORIZATION_FAIL);
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


  const handleCallbackResponse = async (res) => {
    const tokenId = {
      tokenId: res.credential,
    };
    await login(tokenId)
      .then(async (response) => {
        window.localStorage.setItem(ACCESS_TOKEN, response.accessToken);
        window.localStorage.setItem(REFRESH_TOKEN, response.refreshToken);
        message.success(MESSAGE.AUTHORIZATION_SUCCESS);
        await setAuthUser();
      })
      .catch((err) => {
        if (err?.response?.status === 400) {
          if (
            err?.response?.data ===
            "Email must be end @fpt.edu.vn or @fe.edu.vn"
          ) {
            message.error(MESSAGE.FPT_FE);
          }
          if (
            err?.response?.data ===
            "User Already Deleted"
          ) {
            message.error(MESSAGE.USER_DELETED);
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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
      }}
    >
      {loading ? (
        <Loading />
      ) : (
        <div style={{ textAlign: "center", color: "#155E75" }}>
          <h1>Jiracku</h1>
          <h3>For Admin</h3>
          <div>
            <Form
              name="basic"
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              autoComplete="off"
              form={form}
            >
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please enter Email!",
                  },
                ]}
                className={styles["form-item"]}
                validateTrigger="onBlur"
              >
                <Input placeholder="Email"/>
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please enter Password!",
                  },
                ]}
                className={styles["form-item"]}
                validateTrigger="onBlur"
              >
                <Input type="password" placeholder="Password"/>
              </Form.Item>
              <Form.Item >
                <Button type="primary" htmlType="submit">
                  Login
                </Button>
              </Form.Item>
            </Form>
          </div>
          <h3>For Users</h3>
          <div id="signInDiv"></div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
