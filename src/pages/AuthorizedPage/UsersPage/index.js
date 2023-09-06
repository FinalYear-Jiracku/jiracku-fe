import React, { useContext, useEffect, useRef, useState } from "react";
import UserForm from "../../../components/Molecules/User/UserForm";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetailAction } from "../../../redux/action/user-action";
import HeaderContext from "../../../context/HeaderProvider";
import { Button, Card, Switch } from "antd";
import styles from "./styles.module.scss"
import { disableOtp, generateOtp } from "../../../api/totp-api";
import Totp from "../../../components/Organisms/Totp/Totp";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../../constants/constants";
import DisableTotp from "../../../components/Organisms/Totp/DisableTotp";
import Sms from "../../../components/Organisms/Sms/Sms";
import DisableSms from "../../../components/Organisms/Sms/DisableSms";

const UsersPage = () => {
  const dispatch = useDispatch();
  const refOtp = useRef(null);
  const refSms = useRef(null);
  const refDisableOtp = useRef(null);
  const refDisableSms = useRef(null);
  const [secret, setSecret] = useState({
    secret: "",
    qrCodeUrl: "",
  });
  const header = useContext(HeaderContext);
  const userDetail = useSelector((state) => state.userReducer.userDetail);
  
  const generateQrCode = async () => {
    const otpData = {
      userId: `${userDetail.id === null ? "" : userDetail.id}`,
      email: `${userDetail.email === null ? "" : userDetail.email}`,
    };
    await generateOtp(otpData)
      .then((res) => {
        setSecret({
          secret: res.secret,
          qrCodeUrl: res.qrCodeUrl,
        });
        refOtp.current.openModalHandle();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  
  const handleOpenModalOtp = () => {
    refSms.current.openModalHandle();
  };

  const handleOpenDisableModalOtp = () => {
    refDisableOtp.current.openModalHandle();
  };

  const handleOpenDisableModalSms = () => {
    refDisableSms.current.openModalHandle();
  };


  useEffect(() => {
    header.setHeader({
      title: "PROFILE MANAGEMENT",
      breadCrumb: [{ name: "Profile", url: "/user" }],
    });
    if(window.localStorage.getItem(ACCESS_TOKEN) &&
       window.localStorage.getItem(REFRESH_TOKEN)){
      dispatch(getUserDetailAction());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <UserForm userDetail={userDetail} />
      <h2>Two-factor authenticaton (2FA)</h2>
      <div className={styles['card-layout']}>
        <Card className={styles['card-sms']}>
          { !userDetail.isSms ? (
            <Button type="primary" onClick={() => handleOpenModalOtp()}>Enable</Button>
          ) : (
            <Button type="primary" onClick={() => handleOpenDisableModalSms()}>Disable</Button>
          )}
          <p>Text Message (SMS)</p>
          <p>Receive a one-time passcode via SMS each you log in</p>
        </Card>
        <Card className={styles['card-totp']}>
          { !userDetail.isOtp ? (
            <Button type="primary" onClick={() => generateQrCode()}>Enable</Button>
          ) : (
            <Button type="primary" onClick={() => handleOpenDisableModalOtp()}>Disable</Button>
          )}
          <p>Authenticator App (TOTP)</p>
          <p>Use an app to receive a temporary one-time passcode each time you log in</p>
        </Card>
      </div>
      <Totp ref={refOtp} userDetail={userDetail} secret={secret}/>
      <Sms ref={refSms} userDetail={userDetail}/>
      <DisableTotp ref={refDisableOtp} userDetail={userDetail}/>
      <DisableSms ref={refDisableSms} userDetail={userDetail}/>
    </div>
  );
};

export default UsersPage;
