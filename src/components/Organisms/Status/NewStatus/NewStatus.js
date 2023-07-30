import { useState, forwardRef, useImperativeHandle, useContext, useEffect } from "react";
import { Modal, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { MESSAGE } from "../../../../constants/constants";
import StatusForm from "../../../Molecules/Status/StatusForm";
import { postStatus } from "../../../../api/status-api";
import SignalRContext from "../../../../context/SignalRContext";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getSprintDetailAction } from "../../../../redux/action/sprint-action";
import { getUserDetailAction } from "../../../../redux/action/user-action";

const NewStatus = forwardRef((props, ref) => {
  const {projectId,sprintId} = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { connection } = useContext(SignalRContext);
  const [openModal, setOpenModal] = useState(false);
  const userDetail = useSelector((state) => state.userReducer.userDetail);
  const sprintDetail = useSelector((state) => state.sprintReducer.sprintDetail);
 
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

  const onSubmitForm = async (item) => {
    const postStatusData = {
      name: item.name === undefined ? "" : item.name,
      sprintId : Number(sprintId) === 0 ? null : Number(sprintId),
      createdBy: `${props.userDetail.email === null ? "" : props.userDetail.email}`,
    };
    await postStatus(postStatusData)
      .then((res) => {
        message.success(MESSAGE.CREATE_STATUS_SUCCESS);
        setOpenModal(false);
        navigate(`/projects/${projectId}/${sprintId}`);
        sendMessage(
          `${projectId.toString()}`,
          `${userDetail?.email} has created status ${item.name} of Sprint: ${sprintDetail.name}`
        );
      })
      .catch((error) => {
        if (error.response.status === 400) {
          if (error.response.data === "Status Name already Exist") {
            message.error(MESSAGE.STATUS_NAME_EXIST);
          }
        }
      });
  };

  useEffect(() => {
    if(sprintId){
      dispatch(getUserDetailAction());
      dispatch(getSprintDetailAction(`${sprintId}`));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[sprintId])

  return (
    <Modal
      title="Create New Status"
      open={openModal}
      onCancel={handleCancel}
      centered
      footer={null}
      destroyOnClose={true}
    >
      <StatusForm
        editMode={false}
        onCancel={closeModalHandle}
        onSubmit={onSubmitForm}
      />
    </Modal>
  );
});

export default NewStatus;
