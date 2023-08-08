import { useState, forwardRef, useImperativeHandle, useContext } from "react";
import { Modal, message } from "antd";
import { MESSAGE } from "../../../../constants/constants";
import styles from "./styles.module.scss";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import SignalRContext from "../../../../context/SignalRContext";
import { deleteMessage } from "../../../../api/message-api";
import { getMessageListAction } from "../../../../redux/action/message-action";

const DeleteMessage = forwardRef((props, ref) => {
  const {projectId} = useParams();
  const dispatch = useDispatch();
  const { chatConnection } = useContext(SignalRContext);
  const [openModal, setOpenModal] = useState(false);
  

  const openModalHandle = () => {
    setOpenModal(true);
  };

  const closeModalHandle = () => {
    setOpenModal(false);
  };

  const handleCancel = () => {
    setOpenModal(false);
  };

  useImperativeHandle(ref, () => {
    return {
      openModalHandle,
      closeModalHandle,
    };
  });

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

  const handleDelete = async () => {
    await deleteMessage(props.messageId)
      .then((res) => {
        message.success(MESSAGE.DELETE_MESSAGE_SUCCESS);
        setOpenModal(false);
        sendMessage(
          `${projectId.toString()}`, "Delete Message"
        );
        dispatch(getMessageListAction(projectId))
      })
      .catch((error) => {
        message.error(MESSAGE.DELETE_FAIL);
      });
  };

  return (
    <Modal
      title="Delete Message"
      open={openModal}
      onOk={handleDelete}
      onCancel={handleCancel}
      centered
      destroyOnClose={true}
      className={styles.footer}
    >
      <p>Are you sure want to delete?</p>
    </Modal>
  );
});

export default DeleteMessage;
