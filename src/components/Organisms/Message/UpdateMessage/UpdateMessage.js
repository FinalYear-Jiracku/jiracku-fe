import { useState, forwardRef, useImperativeHandle, useEffect, useContext } from "react";
import { Modal, message } from "antd";
import { MESSAGE } from "../../../../constants/constants";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SignalRContext from "../../../../context/SignalRContext";
import { updateMessage } from "../../../../api/message-api";
import { getMessageDetailAction, getMessageListAction } from "../../../../redux/action/message-action";
import MessageForm from "../../../Molecules/Message/MessageForm";

const UpdateMessage = forwardRef((props, ref) => {
  const {projectId} = useParams();
  const dispatch = useDispatch();
  const { chatConnection } = useContext(SignalRContext);
  const [openModal, setOpenModal] = useState(false);
  const messageDetail = useSelector(
    (state) => state.messageReducer.messageDetail
  );

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

  const onSubmitForm = async (item) => {
    const updateMessageData = {
      id: props.messageId === undefined ? "" : props.messageId,
      content: item.content === undefined ? "" : item.content,
    };
    await updateMessage(updateMessageData)
      .then((res) => {
        message.success(MESSAGE.UPDATE_MESSAGE_SUCCESS);
        setOpenModal(false);
        sendMessage(
          `${projectId.toString()}`, "Update Message"
        );
        dispatch(getMessageListAction(projectId))
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (props.messageId && openModal) {
      dispatch(getMessageDetailAction(props.messageId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openModal, props.messageId]);

  return (
    <Modal
      title="Edit Message"
      open={openModal}
      onCancel={handleCancel}
      centered
      footer={null}
      destroyOnClose={true}
    >
      <MessageForm
        editMode={true}
        onCancel={closeModalHandle}
        onSubmit={onSubmitForm}
        messageDetail={messageDetail}
      />
    </Modal>
  );
});

export default UpdateMessage;
