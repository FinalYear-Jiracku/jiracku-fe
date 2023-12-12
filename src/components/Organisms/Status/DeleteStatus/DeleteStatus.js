import { useState, forwardRef, useImperativeHandle, useContext, useEffect } from "react";
import { Modal, message } from "antd";
import { MESSAGE } from "../../../../constants/constants";
import styles from "./styles.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteStatus } from "../../../../api/status-api";
import { useSelector } from "react-redux";
import SignalRContext from "../../../../context/SignalRContext";
import { getUserDetailAction } from "../../../../redux/action/user-action";
import { getSprintDetailAction } from "../../../../redux/action/sprint-action";
import { getStatusDetailAction } from "../../../../redux/action/status-action";

const DeleteStatus = forwardRef((props, ref) => {
  const {projectId,sprintId} = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { connection } = useContext(SignalRContext);
  const [openModal, setOpenModal] = useState(false);
  const userDetail = useSelector((state) => state.userReducer.userDetail);
  const sprintDetail = useSelector((state) => state.sprintReducer.sprintDetail);
  const statusDetail = useSelector((state) => state.statusReducer.statusDetail);

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
    if (!connection) {
      console.error("Connection not established.");
      return;
    }

    if (connection.state !== "Connected") {
      try {
        await connection.start();
        console.log("Reconnected to SignalR Hub");
        connection
          .invoke("OnConnectedAsync", projectId.toString())
          .then((response) => response)
          .catch((error) => console.error("Error sending request:", error));
      } catch (error) {
        console.error("Error connecting to SignalR Hub:", error);
        return;
      }
    }

    try {
      await connection.invoke("SendMessage", projectId, message);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleDelete = async () => {
    await deleteStatus(props.statusId)
      .then((res) => {
        message.success(MESSAGE.DELETE_STATUS_SUCCESS);
        setOpenModal(false);
        navigate(`/projects/${projectId}/${sprintId}`);
        sendMessage(
          `${projectId.toString()}`,
          `${userDetail?.email} deleted status ${statusDetail.name} of Sprint: ${sprintDetail.name}`
        );
      })
      .catch((error) => {
        message.error(MESSAGE.DELETE_FAIL);
      });
  };

  useEffect(() => {
    if(sprintId && props.statusId){
      dispatch(getUserDetailAction());
      dispatch(getSprintDetailAction(`${sprintId}`));
      dispatch(getStatusDetailAction(props.statusId));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[sprintId])

  return (
    <Modal
      title="Delete Status"
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

export default DeleteStatus;
