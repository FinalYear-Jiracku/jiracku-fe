import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  ReadOutlined,
  BookOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu, Button, Image } from "antd";
import icon from "../../assets/logo.png";
import styles from "./styles.module.scss";

const { Sider } = Layout;
const SideBar = ({ collapsed, handleOnCollapse, id }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isProjectsPage = location.pathname === "/projects";

  const getMenuItems = () => {
    let menuItems = [];
    if (isProjectsPage) {
      menuItems.push({
        key: "/projects",
        icon: <ReadOutlined />,
        label: "Project",
      });
    } else {
      menuItems.push(
        {
          key: `/projects/${id}`,
          icon: <BookOutlined />,
          label: "Sprint",
        },
        {
          key: "/report",
          icon: <LineChartOutlined />,
          label: "Report",
        }
      );
    }
    return menuItems;
  };

  const onClickMenu = ({ key }) => {
    if (key) {
      navigate(key);
    }
  };

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
          selectedKeys={[location.pathname]}
          items={getMenuItems()}
          onClick={onClickMenu}
        />
      </Sider>
    </Layout>
  );
};

export default SideBar;
