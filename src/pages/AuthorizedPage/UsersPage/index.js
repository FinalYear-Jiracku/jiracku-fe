import React, { useContext, useEffect } from "react";
import UserForm from "../../../components/Molecules/User/UserForm";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetailAction } from "../../../redux/action/user-action";
import HeaderContext from "../../../context/HeaderProvider";
import { Card, Switch } from "antd";
import styles from "./styles.module.scss"

const UsersPage = () => {
  const dispatch = useDispatch();
  const header = useContext(HeaderContext);
  const userDetail = useSelector((state) => state.userReducer.userDetail);

  useEffect(() => {
    header.setHeader({
      title: "PROFILE MANAGEMENT",
      breadCrumb: [{ name: "Profile", url: "/user" }],
    });
    dispatch(getUserDetailAction());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <UserForm userDetail={userDetail} />
      <h2>Two-factor authenticaton (2FA)</h2>
      <div className={styles['card-layout']}>
        <Card className={styles['card-sms']}>
          <Switch/>
          <p>Text Message (SMS)</p>
          <p>Receive a one-time passcode via SMS each you log in</p>
        </Card>
        <Card className={styles['card-totp']}>
          <Switch/>
          <p>Authenticator App (TOTP)</p>
          <p>Use an app to receive a temporary one-time passcode each time you log in</p>
        </Card>
      </div>
    </div>
  );
};

export default UsersPage;
