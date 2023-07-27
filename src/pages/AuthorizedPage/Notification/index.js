import { useState, useEffect, useMemo, useRef, useContext } from "react";
import { Button, Card } from "antd";
import {
  Link,
  useNavigate,
  useSearchParams,
  useParams,
} from "react-router-dom";
import {
  FormOutlined,
  DeleteOutlined,
  UserAddOutlined,
  LeftCircleOutlined,
} from "@ant-design/icons";
import HeaderContext from "../../../context/HeaderProvider";
import styles from "./styles.module.scss";
import dayjs from "dayjs";
import Paginate from "../../../components/Atoms/Paginate/Paginate";
import SeachBar from "../../../components/Atoms/SearchBar/SeachBar";
import CreateButton from "../../../components/Atoms/Buttons/CreateButton";
import EmptyData from "../../../components/Atoms/EmptyData/EmptyData";
import NewSprint from "../../../components/Organisms/Sprint/NewSprint/NewSprint";
import UpdateSprint from "../../../components/Organisms/Sprint/UpdateSprint/UpdateSprint";
import DeleteSprint from "../../../components/Organisms/Sprint/DeleteSprint/DeleteSprint";
import { useDispatch, useSelector } from "react-redux";
import { getIssueListAction } from "../../../redux/action/issue-action";
import { getSprintListAction } from "../../../redux/action/sprint-action";
import Loading from "../../../components/Atoms/Loading/Loading";
import { setProjectId } from "../../../redux/reducer/project-reducer";
import { getUserDetailAction } from "../../../redux/action/user-action";
import InviteUser from "../../../components/Organisms/InviteUser/InviteUser";
import SignalRContext from "../../../context/SignalRContext";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../../constants/constants";
import { getNotificationListAction } from "../../../redux/action/notification-action";
import { HubConnectionBuilder } from "@microsoft/signalr";

const NotificationPage = () => {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const header = useContext(HeaderContext);
  const { connection, setConnection } = useContext(SignalRContext);
  const [loading, setLoading] = useState(false);
  const notificationList = useSelector(
    (state) => state.notificationReducer.notificationList
  );
  useEffect(() => {
    dispatch(setProjectId(projectId));
    header.setHeader({
      title: "NOTIFICATION MANAGEMENT",
      breadCrumb: [
        { name: "Notification", url: `/notifications/${projectId}` },
      ],
    });
    if (
      window.localStorage.getItem(ACCESS_TOKEN) &&
      window.localStorage.getItem(REFRESH_TOKEN)
    ) {
      setLoading(true);
      dispatch(getNotificationListAction(projectId))
        .then((response) => response)
        .finally(() => {
          setLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  useEffect(() => {
    if (connection) {
      connection.on("ReceiveMessage", (message) => {
        console.log(`Received message: ${message}`);

        // Fetch the updated notification list when a message is received
        dispatch(getNotificationListAction(projectId))
          .then((response) => response)
          .finally(() => {
            setLoading(false);
          });
      });

      // Fetch the initial notification list after the SignalR connection is established
      dispatch(getNotificationListAction(projectId))
        .then((response) => response)
        .finally(() => {
          setLoading(false);
        });
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
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div className={styles.sprints}>
          {notificationList?.map((data, index) => (
            <Card key={index} className={styles.card}>
              {data.content}
            </Card>
          ))}
        </div>
      )}
      {notificationList?.data?.length === 0 && <EmptyData />}
    </div>
  );
};

export default NotificationPage;
