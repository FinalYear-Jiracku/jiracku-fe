import { useState, forwardRef, useImperativeHandle, useEffect, useContext } from "react";
import { Modal, message } from "antd";
import { MESSAGE } from "../../../../constants/constants";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import StatusForm from "../../../Molecules/Status/StatusForm";
import { getStatusDetailAction } from "../../../../redux/action/status-action";
import { updateStatus } from "../../../../api/status-api";
import SignalRContext from "../../../../context/SignalRContext";
import { getUserDetailAction } from "../../../../redux/action/user-action";
import { getSprintDetailAction } from "../../../../redux/action/sprint-action";

const UpdateStatus = forwardRef((props, ref) => {
  const {projectId,sprintId} = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { connection } = useContext(SignalRContext);
  const [openModal, setOpenModal] = useState(false);
  const statusDetail = useSelector(
    (state) => state.statusReducer.statusDetail
  );
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
    const updateStatusData = {
      id: props.statusId === undefined ? "" : props.statusId,
      name: item.name === undefined ? "" : item.name,
      sprintId: Number(sprintId) === undefined ? "" : Number(sprintId),
      updatedBy: `${props.userDetail.email === null ? "" : props.userDetail.email}`,
    };
    await updateStatus(updateStatusData)
      .then((res) => {
        message.success(MESSAGE.UPDATE_STATUS_SUCCESS);
        setOpenModal(false);
        navigate(`/projects/${projectId}/${sprintId}`);
        sendMessage(
          `${projectId.toString()}`,
          `${userDetail?.email} has updated Status name: ${item.name} of Sprint: ${sprintDetail.name}`
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

  useEffect(() => {
    if (props.statusId && openModal) {
      dispatch(getStatusDetailAction(props.statusId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openModal, props.statusId]);

  return (
    <Modal
      title="Edit Status"
      open={openModal}
      onCancel={handleCancel}
      centered
      footer={null}
      destroyOnClose={true}
    >
      <StatusForm
        editMode={true}
        onCancel={closeModalHandle}
        onSubmit={onSubmitForm}
        statusDetail={statusDetail}
      />
    </Modal>
  );
});

export default UpdateStatus;
