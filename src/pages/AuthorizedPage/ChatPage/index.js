import { useState, useEffect, useContext, useRef } from "react";
import { Button, Form, Input} from "antd";
import { useParams } from "react-router-dom";
import HeaderContext from "../../../context/HeaderProvider";
import styles from "./styles.module.scss";
import dayjs from "dayjs";
import { FormOutlined, DeleteOutlined } from "@ant-design/icons";
// import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import EmptyData from "../../../components/Atoms/EmptyData/EmptyData";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../../components/Atoms/Loading/Loading";
import { setProjectId } from "../../../redux/reducer/project-reducer";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../../constants/constants";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { getMessageListAction } from "../../../redux/action/message-action";
import SignalRContext from "../../../context/SignalRContext";
import UpdateMessage from "../../../components/Organisms/Message/UpdateMessage/UpdateMessage";
import DeleteMessage from "../../../components/Organisms/Message/DeleteMessage/DeleteMessage";
import { getUserDetailAction } from "../../../redux/action/user-action";
import InfiniteScroll from "react-infinite-scroll-component";

const ChatPage = () => {
  const { projectId } = useParams();
  const [form] = Form.useForm();
  const refUpdateMessage = useRef(null);
  const refDeleteMessage = useRef(null);
  const dispatch = useDispatch();
  const [messageId, setMessageId] = useState();
  const header = useContext(HeaderContext);
  const [disabledSave, setDisabledSave] = useState(true);
  const [commentContent, setCommentContent] = useState("");
  const { chatConnection, setChatConnection } = useContext(SignalRContext);
  const [loading, setLoading] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState(10);
  const messageList = useSelector((state) => state.messageReducer.messageList);
  const userDetail = useSelector((state) => state.userReducer.userDetail);
 
  const handleFormChange = () => {
    const hasErrors = form.getFieldsError().some(({ errors }) => errors.length);
    setDisabledSave(hasErrors);
  };

  const handleOpenDeleteModal = (messageId) => {
    setMessageId(messageId);
    refDeleteMessage.current.openModalHandle();
  };

  const loadMore = () => {
    // Tăng số lượng tin nhắn hiển thị thêm khi người dùng cuộn đến cuối danh sách
    setVisibleMessages(prevVisibleMessages => prevVisibleMessages + 10); // Ví dụ tăng thêm 10 tin nhắn
  };

  const sendMessage = async (projectId, message) => {
    if (!chatConnection) {
      console.error("Connection not established.");
      return;
    }

    if (chatConnection.state !== "Connected") {
      try {
        await chatConnection.start();
        console.log("Reconnected to SignalR Hub");
        chatConnection
          .invoke("OnConnectedAsync", projectId.toString())
          .then((response) => response)
          .catch((error) => console.error("Error sending request:", error));
      } catch (error) {
        console.error("Error connecting to SignalR Hub:", error);
        return;
      }
    }

    try {
      await chatConnection.invoke("SendMessage", projectId, message);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const onFinish = async (item) => {
    await sendMessage(projectId.toString(), item.content)
      .then((res) => {
        setCommentContent("");
        form.resetFields();
      })
      .catch((err) => console.log(err));
  };
  

  useEffect(() => {
    dispatch(setProjectId(projectId));
    header.setHeader({
      title: "CHAT MANAGEMENT",
      breadCrumb: [{ name: "Chat", url: `/chat/${projectId}` }],
    });
    if (
      window.localStorage.getItem(ACCESS_TOKEN) &&
      window.localStorage.getItem(REFRESH_TOKEN)
    ) {
      setLoading(true);
      dispatch(getMessageListAction(projectId))
        .then((response) => response)
        .finally(() => {
          setLoading(false);
        });
      dispatch(getUserDetailAction());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  useEffect(() => {
    if (chatConnection) {
      chatConnection.on("ReceiveMessage", (message) => {
        console.log(`Received message: ${message}`);

        // Fetch the updated notification list when a message is received
        dispatch(getMessageListAction(projectId))
          .then((response) => response)
          .finally(() => {
            setLoading(false);
          });
      });

      // Fetch the initial notification list after the SignalR connection is established
      dispatch(getMessageListAction(projectId))
        .then((response) => response)
        .finally(() => {
          setLoading(false);
        });
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
    <>
      <div className={styles.chatPage}>
        <div className={styles.messageContainer}>
          <div className={styles.messageList} >
            {loading ? (
              <Loading />
            ) : (
              <div
                className={`col-md-6 col-lg-7 col-xl-8`}
                id="scrollableDiv"
                style={{
                  height: "75vh",
                  overflow: "auto",
                  display: "flex",
                  flexDirection: "column-reverse",
                }}
              >
                { messageList.length > 0 ? (
                  <InfiniteScroll
                  dataLength={visibleMessages}
                  next={loadMore}
                  inverse={true}
                  hasMore={visibleMessages < messageList.length}
                  endMessage={<p>No more messages</p>}
                  scrollableTarget="scrollableDiv"
                  style={{ display: "flex", flexDirection: "column-reverse" }}
                >
                  {messageList?.slice(0, visibleMessages).map((data, index) => (
                    <div
                      key={index}
                      className={`${styles.pt3} ${
                        data.user.userName === userDetail.email
                          ? styles.justifyContentEnd
                          : styles.justifyContentStart
                      }`}
                      style={{ display: "flex" }}
                    >
                      <div
                        className={
                          data.user.userName === userDetail.email
                            ? styles.me3
                            : styles.ms3
                        }
                      >
                        <div
                          className={`${styles.small} ${styles.p2} ${
                            styles.mb1
                          } ${styles.rounded3} ${
                            data.user.userName === userDetail.email
                              ? styles.textWhite + " " + styles.bgPrimary
                              : styles.bgLight
                          }`}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            {data.content}
                            {userDetail.email === data.user.userName && (
                              <span>
                                <Button
                                  type="text"
                                  icon={<DeleteOutlined />}
                                  onClick={() =>
                                    handleOpenDeleteModal(data.id)
                                  }
                                />
                              </span>
                            )}
                          </div>
                        </div>
                        <p className={`${styles.mb1} ${styles.fwBold}`}>
                          {data.user.userName}
                        </p>
                        <p
                          className={`${styles.textMuted} ${styles.small} ${
                            styles.mb3
                          } ${styles.rounded3} float-${
                            data.user.userName === userDetail.email
                              ? "end"
                              : "start"
                          }`}
                        >
                          {dayjs(data.createdAt).format("h:mm A | MMM DD")}
                        </p>
                      </div>
                    </div>
                  ))}
                </InfiniteScroll>
                ) : (
                  <EmptyData message="No messages available." />
                )}
              </div>
            )}
          </div>
          <div className={``}>
            <Form
              name="basic"
              autoComplete="off"
              form={form}
              onFinish={onFinish}
              onFieldsChange={handleFormChange}
              className={styles.antForm}
            >
              <Form.Item name="content">
                <Input
                  type="text"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  id="exampleFormControlInput2"
                  style={{width:"100%"}}
                  placeholder="Type message"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={disabledSave}
                >
                  <i className="fas fa-paper-plane"></i>
                </Button>
              </Form.Item>
            </Form>

          </div>
        </div>
      </div>
      <UpdateMessage ref={refUpdateMessage} messageId={messageId} />
      <DeleteMessage ref={refDeleteMessage} messageId={messageId} />
    </>
  );
};

export default ChatPage;