import { useState, useContext, useEffect } from "react";
import { Breadcrumb, Layout, Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import HeaderContext from "../../context/HeaderProvider";
import styles from "./styles.module.scss";
import { Link, useNavigate } from "react-router-dom";
import GoogleAuthContext from "../../context/AuthProvider";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants/constants";
import Cookies from "js-cookie";
import SignalRContext from "../../context/SignalRContext";
const { Header } = Layout;

const Navbar = () => {
  const navigate = useNavigate();
  const { header } = useContext(HeaderContext);
  const {connection, chatConnection} = useContext(SignalRContext);
  const { auth, setAuth } = useContext(GoogleAuthContext);
  const [breadCrumb, setBreadCrumb] = useState({ title: "", data: [] });

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
  useEffect(() => {
    setBreadCrumb({
      title: header.title.toUpperCase(),
      data: header.breadCrumb,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [header]);
  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>{breadCrumb.title}</Header>
      <div className={styles.breadcrumb}>
        <Breadcrumb
          className={styles["breadcrumb-item"]}
          items={breadCrumb.data.map((item, index) => ({
            title:item.name,
            key: index,
          }))}
        />
        <div className={styles["image-logout"]}>
          {Object.keys(auth).length === 0 ? (
            <div></div>
          ) : (
            <>
              {auth?.role === "User" ? (
                <Link to={"/user"} className={styles.link}>
                  <Button>Profile</Button>
                </Link>
              ) : (
                <div></div>
              )}
              <Button className={styles["button-logout"]} onClick={logOut}>
                <LogoutOutlined className={styles.logout} />
              </Button>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Navbar;
