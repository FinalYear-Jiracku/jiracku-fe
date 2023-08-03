import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  ReadOutlined,
  BookOutlined,
  LineChartOutlined,
  CarryOutOutlined,
  BellOutlined,
  ProfileOutlined,
  CommentOutlined
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
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants/constants";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { getMessageListAction } from "../../redux/action/message-action";

const { Sider } = Layout;
const SideBar = ({ collapsed, handleOnCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [notificationCount, setNotificationCount] = useState(0);
  const [chatCount, setChatCount] = useState(0);
  const { connection, setConnection } = useContext(SignalRContext);
  const { chatConnection, setChatConnection } = useContext(SignalRContext);
  const projectId = useSelector((state) => state.projectReducer.projectId);
  const sprintId = useSelector((state) => state.sprintReducer.sprintId);
  const isUsersPage = location.pathname === "/user";
  const isProjectsPage = location.pathname === "/projects";
  const isSprintsPage = location.pathname === `/projects/${projectId}`;
  const isNotificationPage =
    location.pathname === `/notifications/${projectId}`;
  const isIssuesPage =
    location.pathname === `/projects/${projectId}/${sprintId}`;
  const isReportPage =
    location.pathname === `/report/${projectId}`;
  const isChatPage =
    location.pathname === `/chat/${projectId}`;

  const clearNotificationCount = () => {
    setNotificationCount(0);
  };

  const clearChatCount = () => {
    setChatCount(0);
  };

  const bellIconWithBadge = (
    <span onClick={clearNotificationCount}>
      {" "}
      {/* Add onClick event handler */}
      <BellOutlined />
      <span>Notification</span>
      {notificationCount > 0 && (
        <span className={styles.badge}> {notificationCount}</span>
      )}
    </span>
  );

  const chatIconWithBadge = (
    <span onClick={clearChatCount}>
      {" "}
      {/* Add onClick event handler */}
      <CommentOutlined />
      <span>Chat</span>
      {chatCount > 0 && (
        <span className={styles.badge}> {chatCount}</span>
      )}
    </span>
  );
  
  const getMenuItems = () => {
    let menuItems = [];
    if (isUsersPage) {
      menuItems.push({
        key: "/user",
        icon: <ProfileOutlined />,
        label: "Profile",
      });
    }
    if (isProjectsPage) {
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
          key: `/report/${projectId}`,
          icon: <LineChartOutlined />,
          label: "Report",
        },
        {
          key: `/notifications/${projectId}`,
          label: bellIconWithBadge,
        },
        {
          key: `/chat/${projectId}`,
          label: chatIconWithBadge,
        }
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
          key: `/report/${projectId}`,
          icon: <LineChartOutlined />,
          label: "Report",
        },
        {
          key: `/notifications/${projectId}`,
          label: bellIconWithBadge,
        }
      );
    }
    if (isNotificationPage) {
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
          key: `/report/${projectId}`,
          icon: <LineChartOutlined />,
          label: "Report",
        },
        {
          key: `/notifications/${projectId}`,
          label: bellIconWithBadge,
        }
      );
    }
    if (isReportPage) {
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
          key: `/report/${projectId}`,
          icon: <LineChartOutlined />,
          label: "Report",
        },
        {
          key: `/notifications/${projectId}`,
          label: bellIconWithBadge,
        }
      );
    }
    if (isChatPage) {
      menuItems.push(
        {
          key: `/projects/${projectId}`,
          icon: <BookOutlined />,
          label: "Sprint",
        },
        {
          key: `/report/${projectId}`,
          icon: <LineChartOutlined />,
          label: "Report",
        },
        {
          key: `/notifications/${projectId}`,
          label: bellIconWithBadge,
        },
        {
          key: `/chat/${projectId}`,
          label: chatIconWithBadge,
        }
      );
    }
    return menuItems;
  };

  const onClickMenu = ({ key }) => {
    if (key) {
      // If the Notification menu item is clicked, reset the notification count
      if (key === `/notifications/${projectId}`) {
        clearNotificationCount();
      }
      if (key === `/chat/${projectId}`){
        clearChatCount();
      }
      navigate(key);
    }
  };

  useEffect(() => {
    if (
      connection &&
      projectId !== null &&
      window.localStorage.getItem(ACCESS_TOKEN) &&
      window.localStorage.getItem(REFRESH_TOKEN)
    ) {
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

  useEffect(() => {
    if (
      chatConnection &&
      projectId !== null &&
      window.localStorage.getItem(ACCESS_TOKEN) &&
      window.localStorage.getItem(REFRESH_TOKEN)
    ) {
      chatConnection.on("ReceiveMessage", (message) => {
        console.log(`Received message: ${message}`);
        setChatCount((prevCount) => prevCount + 1);
        // Fetch the updated notification list when a message is received
        dispatch(getMessageListAction(projectId))
          .then((response) => response)
          .finally(() => {});
      });

      // Fetch the initial notification list after the SignalR connection is established
      dispatch(getMessageListAction(projectId))
        .then((response) => response)
        .finally(() => {});
    } else {
      const token = window.localStorage.getItem(ACCESS_TOKEN);
      const newConnection = new HubConnectionBuilder()
        .withUrl("http://localhost:4204/chat", {
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
          setChatConnection(newConnection);
        })
        .catch((error) =>
          console.error("Error connecting to SignalR Hub:", error)
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatConnection]);

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
