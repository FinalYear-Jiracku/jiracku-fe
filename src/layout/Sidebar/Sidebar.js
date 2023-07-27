import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  ReadOutlined,
  BookOutlined,
  LineChartOutlined,
  CarryOutOutlined,
  BellOutlined,
  ProfileOutlined
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu, Button, Image } from "antd";
import icon from "../../assets/logo.png";
import styles from "./styles.module.scss";
import { useSelector } from "react-redux";
import { useContext, useEffect, useState } from "react";
import SignalRContext from "../../context/SignalRContext";
import { useDispatch } from "react-redux";
import { getNotificationListAction } from "../../redux/action/notification-action";
import { ACCESS_TOKEN } from "../../constants/constants";
import { HubConnectionBuilder } from "@microsoft/signalr";

const { Sider } = Layout;
const SideBar = ({ collapsed, handleOnCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [notificationCount, setNotificationCount] = useState(0);
  const { connection, setConnection } = useContext(SignalRContext);
  const projectId = useSelector((state) => state.projectReducer.projectId);
  const sprintId = useSelector((state) => state.sprintReducer.sprintId);
  const isUsersPage = location.pathname === "/user";
  const isProjectsPage = location.pathname === "/projects";
  const isSprintsPage = location.pathname === `/projects/${projectId}`;
  const isNotificationPage = location.pathname === `/notifications/${projectId}`;
  const isIssuesPage = location.pathname === `/projects/${projectId}/${sprintId}`;

  const bellIconWithBadge = (
    <span>
      <BellOutlined />
      <span> Notification</span>
      {notificationCount > 0 && <span className={styles.badge}>{notificationCount}</span>}
    </span>
  );

  const getMenuItems = () => {
    let menuItems = [];
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
        },
        {
          key: `/notifications/${projectId}`,
          icon: <BellOutlined />,
          label: "Notification",
          badge: notificationCount
        },
      );
    } 
    if (isIssuesPage) {
      menuItems.push(
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
        },
        {
          key: `/notifications/${projectId}`,
          icon: <BellOutlined />,
          label: "Notification",
          badge: notificationCount
        },
      );
    }if(isNotificationPage){
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
        },
        {
          key: `/notifications/${projectId}`,
          //icon: <BellOutlined />,
          label: bellIconWithBadge,
        },
      );
    }
    return menuItems;
  };

  const onClickMenu = ({ key }) => {
    if (key) {
      navigate(key);
    }
  };

  useEffect(() => {
    if (connection && projectId !== null) {
      connection.on("ReceiveMessage", (message) => {
        console.log(`Received message: ${message}`);
        setNotificationCount((prevCount) => prevCount + 1);
        // Fetch the updated notification list when a message is received
        dispatch(getNotificationListAction(projectId))
          .then((response) => response)
          .finally(() => {});
      });

      // Fetch the initial notification list after the SignalR connection is established
      dispatch(getNotificationListAction(projectId))
        .then((response) => response)
        .finally(() => {});
    } else {
      const token = window.localStorage.getItem(ACCESS_TOKEN);
      const newConnection = new HubConnectionBuilder()
        .withUrl("http://localhost:4204/notification", {
          accessTokenFactory: () => token,
        })
        .build();

      newConnection
        .start()
        .then(() => {
          console.log("Connected to SignalR Hub");
          newConnection
            .invoke("OnConnectedAsync", projectId.toString())
            .then((response) => response)
            .catch((error) => console.error("Error sending request:", error));

          // Cập nhật kết nối SignalR vào Redux
          setConnection(newConnection);
        })
        .catch((error) =>
          console.error("Error connecting to SignalR Hub:", error)
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection]);

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
