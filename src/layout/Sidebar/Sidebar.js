import {
    UserOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
  } from "@ant-design/icons";
  import { Layout, Menu, Button, Image } from "antd";
  import icon from "../../assets/logo.png";
  import styles from "./styles.module.scss";
  
  const { Sider } = Layout;
  const SideBar = ( {collapsed, handleOnCollapse, sidebarWidth} ) => {
    const menu = [
      {
        key: "1",
        icon: <UserOutlined />,
        label: "Project 1",
      },
      {
        key: "2",
        icon: <UserOutlined />,
        label: "Project 2",
      },
      {
        key: "3",
        icon: <UserOutlined />,
        label: "Project 3",
      },
    ];
    return (
      <Layout className={styles.sidebar}>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          className={styles.sider}
          style={{ width: sidebarWidth }}
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
            defaultSelectedKeys={["1"]}
            items={menu}
          />
        </Sider>
      </Layout>
    );
  };
  
  export default SideBar;
  