import { useState, forwardRef, useImperativeHandle, useEffect, useContext } from "react";
import { Modal, message } from "antd";
import { MESSAGE } from "../../../../constants/constants";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { updateSprint } from "../../../../api/sprint-api";
import SprintForm from "../../../Molecules/Sprint/SprintForm";
import { useDispatch, useSelector } from "react-redux";
import {
  getSprintDetailAction,
  getSprintListAction,
} from "../../../../redux/action/sprint-action";
import SignalRContext from "../../../../context/SignalRContext";

const UpdateSprint = forwardRef((props, ref) => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const connection = useContext(SignalRContext);
  const currentPage = parseInt(searchParams.get("page")) || 1;
  
  const [openModal, setOpenModal] = useState(false);
  const sprintDetail = useSelector((state) => state.sprintReducer.sprintDetail);

  const sendMessage = async (projectId,  message) => {
    if (!connection) {
      console.error("Connection not established.");
      return;
    }

    if (connection.state !== "Connected") {
      // Thực hiện kết nối lại nếu kết nối không ở trạng thái "Connected"
      try {
        await connection.start();
        console.log("Reconnected to SignalR Hub");
      } catch (error) {
        console.error("Error connecting to SignalR Hub:", error);
        return;
      }
    }
  
    try {
      await connection.invoke("SendMessage", projectId,  message);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
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

  const onSubmitForm = async (item) => {
    const updateSprintData = {
      id: props.sprintId === undefined ? "" : props.sprintId,
      name: item.name === undefined ? "" : item.name,
      projectId: Number(projectId) === undefined ? "" : Number(projectId),
      startDate: item.startDate === undefined ? null : item.startDate,
      endDate: item.endDate === undefined ? null : item.endDate,
      updatedBy: `${
        props.userDetail.email === null ? "" : props.userDetail.email
      }`,
    };
    await updateSprint(updateSprintData)
      .then((res) => {
        message.success(MESSAGE.UPDATE_SPRINT_SUCCESS);
        setOpenModal(false);
        navigate(`/projects/${projectId}?page=${currentPage}`);
        dispatch(
          getSprintListAction({
            projectId: projectId,
            currentPage: currentPage,
            searchKey: "",
          })
        );
        sendMessage(projectId.toString(), "hehehehehehehehe")
      })
      .catch((error) => {
        if (error.response.status === 400) {
          if (error.response.data === "Sprint Name already Exist") {
            message.error(MESSAGE.SPRINT_NAME_EXIST);
          }
        }
      });
  };

  useEffect(() => {
    if (props.sprintId && openModal) {
      dispatch(getSprintDetailAction(props.sprintId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openModal, props.sprintId]);
  return (
    <Modal
      title="Edit Sprint"
      open={openModal}
      onCancel={handleCancel}
      centered
      footer={null}
      destroyOnClose={true}
    >
      <SprintForm
        editMode={true}
        onCancel={closeModalHandle}
        onSubmit={onSubmitForm}
        sprintDetail={sprintDetail}
      />
    </Modal>
  );
});

export default UpdateSprint;
