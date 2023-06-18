import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Layout, Menu, Button, Image } from "antd";
import icon from "../../assets/logo.png";
import styles from "./styles.module.scss";

const { Sider } = Layout;
const SideBar = ({ collapsed, handleOnCollapse }) => {
  const navigate = useNavigate();
  const menu = [
    {
      key: "/projects",
      icon: <ReadOutlined />,
      label: "Project",
    },
  ];
  return (
    <Layout className={styles.sidebar}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className={styles.sider}
      >
        <div className={styles.logo}>
          {collapsed ? null : (
            <Image src={icon} alt="Jiracku" preview={false} />
          )}
          <Button
            type="text"
            className={collapsed ? styles["button-after"] : styles.button}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => handleOnCollapse()}
          />
        </div>
        <Menu
          mode="inline"
          className={styles.menu}
          defaultSelectedKeys={["/projects"]}
          items={menu}
          onClick={({ key }) => {
            if (key) {
              navigate(key);
            }
          }}
        />
      </Sider>
    </Layout>
  );
};

export default SideBar;
