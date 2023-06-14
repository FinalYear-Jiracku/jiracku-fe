import { useState } from "react";
import styles from "./styles.module.scss";
import SideBar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState("200px");
  const handleOnCollapse = () => {
    setCollapsed(!collapsed);
    setSidebarWidth(collapsed ? "200px" : "80px");
  };
  return (
    <div className={styles.container}>
      <SideBar
        collapsed={collapsed}
        handleOnCollapse={handleOnCollapse}
        sidebarWidth={sidebarWidth}
      />
      <Navbar sidebarWidth={sidebarWidth} />
    </div>
  );
};

export default MainLayout;
