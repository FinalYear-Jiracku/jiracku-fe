import { Suspense, useContext, useEffect, useState } from "react";
import styles from "./styles.module.scss";
import SideBar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import { Spin } from "antd";
import Footers from "../Footer/Footers";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants/constants";
import GoogleAuthContext from "../../context/AuthProvider";
import { useLocation } from "react-router-dom";

const MainLayout = ({ children }) => {
  const { auth } = useContext(GoogleAuthContext);
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(window.innerWidth < 768);
  const isValidateOtpPage = location.pathname === "/validateOtp";
  const isLoginPage = location.pathname === "/login";

  const handleOnCollapse = () => {
    setCollapsed(!collapsed);
  };
  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return !isLoginPage && !isValidateOtpPage && auth.name &&
    window.localStorage.getItem(ACCESS_TOKEN) &&
    window.localStorage.getItem(REFRESH_TOKEN) ? (
    <div>
      <div className={styles.container}>
        <SideBar collapsed={collapsed} handleOnCollapse={handleOnCollapse} />
        <div className={styles.layout}>
          <Navbar />
          <Suspense fallback={<Spin size="large" />}>{children}</Suspense>
        </div>
      </div>
      <Footers className={styles.footer} />
    </div>
  ) : (
    <div>{children}</div>
  );
};

export default MainLayout;
