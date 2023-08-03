import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { Modal, message } from "antd";
import { MESSAGE } from "../../../../constants/constants";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { startSprint, updateSprint } from "../../../../api/sprint-api";
import SprintForm from "../../../Molecules/Sprint/SprintForm";
import { useDispatch, useSelector } from "react-redux";
import {
  getSprintDetailAction,
  getSprintListAction,
} from "../../../../redux/action/sprint-action";
import StartSprintForm from "../../../Molecules/Sprint/StartSprintForm/StartSprintForm";

const StartSprint = forwardRef((props, ref) => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const [openModal, setOpenModal] = useState(false);
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

  const onSubmitForm = async (item) => {
    const updateSprintData = {
      id: props.sprintId === undefined ? "" : props.sprintId,
      projectId: Number(projectId) === undefined ? "" : Number(projectId),
      startDate: item.startDate === undefined ? null : item.startDate,
      endDate: item.endDate === undefined ? null : item.endDate,
      updatedBy: `${
        props.userDetail.email === null ? "" : props.userDetail.email
      }`,
    };
    await startSprint(updateSprintData)
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
      title="Start Sprint"
      open={openModal}
      onCancel={handleCancel}
      centered
      footer={null}
      destroyOnClose={true}
    >
      <StartSprintForm
        editMode={true}
        onCancel={closeModalHandle}
        onSubmit={onSubmitForm}
        sprintDetail={sprintDetail}
      />
    </Modal>
  );
});

export default StartSprint;
