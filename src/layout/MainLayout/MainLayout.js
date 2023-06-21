import { Suspense, useContext, useState } from "react";
import styles from "./styles.module.scss";
import SideBar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import { Spin } from "antd";
import Context from "../../context/Context";

const MainLayout = ({ children }) => {
  const id = useContext(Context);
  const [collapsed, setCollapsed] = useState(false);
  const handleOnCollapse = () => {
    setCollapsed(!collapsed);
  };
  return (
    <div className={styles.container}>
      <SideBar
        collapsed={collapsed}
        handleOnCollapse={handleOnCollapse}
        id={id}
      />
      <div className={styles.layout}>
        <Navbar/>
        <Suspense fallback={<Spin size="large" />}>{children}</Suspense>
      </div>
    </div>
  );
};

export default MainLayout;
