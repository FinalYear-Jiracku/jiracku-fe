import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  ReadOutlined,
  BookOutlined,
  LineChartOutlined,
  CarryOutOutlined,
  HomeOutlined,
  ProfileOutlined
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu, Button, Image } from "antd";
import icon from "../../assets/logo.png";
import styles from "./styles.module.scss";
import { useSelector } from "react-redux";

const { Sider } = Layout;
const SideBar = ({ collapsed, handleOnCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const projectId = useSelector((state) => state.projectReducer.projectId);
  const sprintId = useSelector((state) => state.sprintReducer.sprintId);
  const isHomePage = location.pathname === "/home";
  const isUsersPage = location.pathname === "/user";
  const isProjectsPage = location.pathname === "/projects";
  const isSprintsPage = location.pathname === `/projects/${projectId}`;
  const isIssuesPage = location.pathname === `/projects/${projectId}/${sprintId}`;

  const getMenuItems = () => {
    let menuItems = [];
    if(isHomePage) {
      menuItems.push({
        key: "/home",
        icon: <HomeOutlined />,
        label: "Home",
      });
    }
    if(isUsersPage) {
      menuItems.push({
        key: "/user",
        icon: <ProfileOutlined />,
        label: "Profile",
      });
    }
    if(isProjectsPage) {
      menuItems.push({
        key: "/projects",
        icon: <ReadOutlined />,
        label: "Project",
      });
    }
    if (isSprintsPage) {
      menuItems.push(
        {
          key: `/projects/${projectId}`,
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
    if (isIssuesPage) {
      menuItems.push(
        {
          key: "/projects",
          icon: <ReadOutlined />,
          label: "Project",
        },
        {
          key: `/projects/${projectId}`,
          icon: <BookOutlined />,
          label: "Sprint",
        },
        {
          key: `/projects/${projectId}/${sprintId}`,
          icon: <CarryOutOutlined />,
          label: "Issue",
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
