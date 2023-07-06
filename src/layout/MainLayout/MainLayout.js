import { Suspense, useState } from "react";
import styles from "./styles.module.scss";
import SideBar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import { Spin } from "antd";

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const handleOnCollapse = () => {
    setCollapsed(!collapsed);
  };
  return (
    <div className={styles.container}>
      <SideBar
        collapsed={collapsed}
        handleOnCollapse={handleOnCollapse}
      />
      <div className={styles.layout}>
        <Navbar/>
        <Suspense fallback={<Spin size="large" />}>{children}</Suspense>
      </div>
    </div>
  );
};

export default MainLayout;
