import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetailAction } from "../../../redux/action/user-action";
import { Button, Form, Input, message } from "antd";
import styles from "./styles.module.scss";
import { generateSms, validateOtp, verifySms } from "../../../api/totp-api";
import {
  ACCESS_TOKEN,
  MESSAGE,
  REFRESH_TOKEN,
} from "../../../constants/constants";
import { useNavigate } from "react-router-dom";
import GoogleAuthContext from "../../../context/AuthProvider";
import SignalRContext from "../../../context/SignalRContext";

const ValidateOtp = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSms, setIsSms] = useState(false);
  const { setAuth } = useContext(GoogleAuthContext);
  const { connection, chatConnection } = useContext(SignalRContext);
  const userDetail = useSelector((state) => state.userReducer.userDetail);

  const logOut = () => {
    window.localStorage.removeItem(ACCESS_TOKEN);
    window.localStorage.removeItem(REFRESH_TOKEN);
    // Cookies.remove(ACCESS_TOKEN);
    // Cookies.remove(REFRESH_TOKEN);
    setAuth({});
    connection.stop();
    chatConnection.stop();
    navigate("/login");
  };

  const tailLayout = {
    wrapperCol: { offset: 4, span: 8 },
  };

  const validateCode = (_, value) => {
    const check = /[^0-9]+/;
    const { code } = form.getFieldsValue(["code"]);
    if (value && code && check.test(value)) {
      return Promise.reject("Invalid Format");
    }
    return Promise.resolve();
  };

  const validateQrCode = async (item) => {
    const otpData = {
      userId: `${userDetail.id === null ? "" : userDetail.id}`,
      email: `${userDetail.email === null ? "" : userDetail.email}`,
      code: item.code === null ? "" : item.code,
    };
    await validateOtp(otpData)
      .then((res) => {
        if (res.status) {
          message.success(MESSAGE.SUCCESS_TOTP);
          navigate("/projects");
        }
        if (!res.status) {
          message.error(MESSAGE.FAIL_TOTP);
          setAuth({});
          navigate("/login");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const verifySmsCode = async (item) => {
    const smsData = {
      userId: `${userDetail.id === null ? "" : userDetail.id}`,
      code: item.code === undefined ? "" : item.code,
    };
    await verifySms(smsData)
      .then((res) => {
        if (res.status) {
          message.success(MESSAGE.SUCCESS_SMS);
          navigate("/projects");
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          if (error.response.data === "Code has expired") {
            message.error(MESSAGE.FAIL_SMS);
          }
        }
      });
  };

  const generateSmsCode = async () => {
    const smsData = {
      userId: `${userDetail.id === null ? "" : userDetail.id}`,
      phone: `${userDetail.phone === null ? "" : userDetail.phone}`,
    };
    await generateSms(smsData)
      .then((res) => {
        setIsSms(true);
      })
      .catch((error) => {
        if (error?.response?.status === 429) {
            message.error(MESSAGE.SMS_429);
        }
      });
  };

  const backToOtp = () => {
    setIsSms(false)
  }

  useEffect(() => {
    dispatch(getUserDetailAction());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.container}>
      <h1>Welcome Back</h1>
      <h2>Verify the Authentication Code</h2>
      {userDetail.isOtp && isSms === false ? (
        <p>
          Open the two-step verification app on your mobile device to get your
          verification code.
        </p>
      ) : (
        <p>Open your mobile device to get your verification code.</p>
      )}

      <div>
        <Form
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={userDetail.isOtp && isSms === false ? validateQrCode : verifySmsCode}
          autoComplete="off"
          form={form}
        >
          {userDetail.isOtp && isSms === false ? (
            <Form.Item
              name="code"
              rules={[
                {
                  required: true,
                  message: "Please input your Code!",
                },
                {
                  validator: validateCode
                }
              ]}
              validateTrigger="onBlur"
            >
              <Input placeholder="One Time Password" className={styles.input} />
            </Form.Item>
          ) : (
            <Form.Item
              name="code"
              rules={[
                {
                  required: true,
                  message: "Please input your Code!",
                },
                {
                  validator: validateCode
                }
              ]}
              validateTrigger="onBlur"
            >
              <Input placeholder="Text SMS" className={styles.input} />
            </Form.Item>
          )}

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit" className={styles.buttons}>
              Authenticate
            </Button>
          </Form.Item>
        </Form>
        {userDetail.isOtp  && isSms === false ? "" : (
          <span className={styles.buttons}>
            <Button type="link" onClick={generateSmsCode}>
              Resend Text SMS
            </Button>
          </span>
        )}
        {userDetail.isOtp && userDetail.isSms && isSms === false ? (
          <span className={styles.buttons}>
            <Button type="link" onClick={generateSmsCode}>
              Send Code Via Text SMS
            </Button>
          </span>
        ) : userDetail.isOtp && userDetail.isSms && isSms === true ? (
          <span className={styles.buttons}>
            <Button type="link" onClick={backToOtp}>
              Send Code Via TOTP 
            </Button>
          </span>
        ) : ""}
        
        <span className={styles.buttons}>
          <Button type="link" onClick={logOut}>
            Back To Login Page
          </Button>
        </span>
      </div>
    </div>
  );
};

export default ValidateOtp;
