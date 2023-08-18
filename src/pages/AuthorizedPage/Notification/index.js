import { useState, useEffect,useContext } from "react";
import { Card, Pagination } from "antd";
import {
  useParams,
} from "react-router-dom";
import HeaderContext from "../../../context/HeaderProvider";
import styles from "./styles.module.scss";
import dayjs from "dayjs";
import EmptyData from "../../../components/Atoms/EmptyData/EmptyData";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../../components/Atoms/Loading/Loading";
import { setProjectId } from "../../../redux/reducer/project-reducer";
import SignalRContext from "../../../context/SignalRContext";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../../constants/constants";
import { getNotificationListAction } from "../../../redux/action/notification-action";
import { HubConnectionBuilder } from "@microsoft/signalr";

const ITEMS_PER_PAGE = 10;

const NotificationPage = () => {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const header = useContext(HeaderContext);
  const { connection, setConnection } = useContext(SignalRContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const notificationList = useSelector(
    (state) => state.notificationReducer.notificationList
  );

  useEffect(() => {
    dispatch(setProjectId(projectId));
    header.setHeader({
      title: "NOTIFICATION MANAGEMENT",
      breadCrumb: [
        { name: "Notification", url: `/notifications/${projectId}`},
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

  const handlePaginationChange = (page) => {
    setCurrentPage(page);
  };

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

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div className={styles.sprints}>
          {notificationList?.slice(startIndex, endIndex).map((data, index) => (
            <Card key={index} className={styles.card}>
              <div className={styles.content}>
                <div>{data.content}</div>
                <div>{dayjs(data.createdAt).format("YYYY-MM-DD")}</div>
              </div>
            </Card>
          ))}
          {notificationList?.length > ITEMS_PER_PAGE && (
            <div className={styles.paginationContainer}>
              <Pagination
                current={currentPage}
                total={notificationList.length}
                pageSize={ITEMS_PER_PAGE}
                onChange={handlePaginationChange}
              />
            </div>
          )}
        </div>
      )}
      {notificationList?.length === 0 && <EmptyData />}
    </div>
  );
};

export default NotificationPage;
