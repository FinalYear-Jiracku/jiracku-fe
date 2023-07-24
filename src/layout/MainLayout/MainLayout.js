import { Suspense, useContext, useState } from "react";
import styles from "./styles.module.scss";
import SideBar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import { Spin } from "antd";
import Footers from "../Footer/Footers";
import { ACCESS_TOKEN } from "../../constants/constants";
import GoogleAuthContext from "../../context/AuthProvider";

const MainLayout = ({ children }) => {
  const { auth } = useContext(GoogleAuthContext);
  const [collapsed, setCollapsed] = useState(false);
  const handleOnCollapse = () => {
    setCollapsed(!collapsed);
  };
  return auth?.name && window.localStorage.getItem(ACCESS_TOKEN) ? (
    <div>
      <div className={styles.container}>
        <SideBar collapsed={collapsed} handleOnCollapse={handleOnCollapse} />
        <div className={styles.layout}>
          <Navbar />
          <Suspense fallback={<Spin size="large" />}>{children}</Suspense>
        </div>
      </div>
      <Footers className={styles.footer}/>
    </div>
  ): (
    <div>{children}</div>
  );
};

export default MainLayout;
