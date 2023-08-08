import { useState, useEffect, useContext, useRef } from "react";
import { Button, Card, Form, Input } from "antd";
import { useParams } from "react-router-dom";
import HeaderContext from "../../../context/HeaderProvider";
import styles from "./styles.module.scss";
import dayjs from "dayjs";
import {
  FormOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
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
  const messageList = useSelector((state) => state.messageReducer.messageList);
  const userDetail = useSelector((state) => state.userReducer.userDetail);

  const handleFormChange = () => {
    const hasErrors = form.getFieldsError().some(({ errors }) => errors.length);
    setDisabledSave(hasErrors);
  };

  const handleOpenEditModal = (messageId) => {
    setMessageId(messageId);
    refUpdateMessage.current.openModalHandle();
  };

  const handleOpenDeleteModal = (messageId) => {
    setMessageId(messageId);
    refDeleteMessage.current.openModalHandle();
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
    <div className={styles.chatPage}>
      <div className={styles.messageContainer}>
        <div className={styles.messageList}>
          {loading ? (
            <Loading />
          ) : (
            <div className={styles.sprints}>
              {messageList?.map((data, index) => (
                <Card key={index} className={styles.card}>
                  <div className={styles.content}>
                    <div>
                      <div>{data.content}</div>
                      <div>{data.user.userName}</div>
                    </div>
                    <div>
                        <Button
                          type="text"
                          icon={<FormOutlined />}
                          onClick={() => handleOpenEditModal(data.id)}
                          disabled={userDetail.email === data.user.userName ? false : true}
                        ></Button>
                        <Button
                          type="text"
                          icon={<DeleteOutlined />}
                          onClick={() => handleOpenDeleteModal(data.id)}
                          disabled={userDetail.email === data.user.userName ? false : true}
                        ></Button>
                        <div>{dayjs(data.createdAt).format("YYYY-MM-DD")}</div>
                      </div>
                    
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
        <Form
          name="basic"
          autoComplete="off"
          form={form}
          onFinish={onFinish}
          onFieldsChange={handleFormChange}
          className={styles["ant-form"]}
        >
          <Form.Item name="content" className={styles.messageInput}>
            <Input
              placeholder="Type here to send Message"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              className={styles.input}
            />
          </Form.Item>
          <Form.Item>
            <Button
              className={styles.sendButton}
              type="primary"
              htmlType="submit"
              disabled={disabledSave}
            >
              Post
            </Button>
          </Form.Item>
        </Form>
        {messageList?.length === 0 && <EmptyData />}
      </div>
      <UpdateMessage ref={refUpdateMessage} messageId={messageId}/>
      <DeleteMessage ref={refDeleteMessage} messageId={messageId}/>
    </div>
  );
};

export default ChatPage;
