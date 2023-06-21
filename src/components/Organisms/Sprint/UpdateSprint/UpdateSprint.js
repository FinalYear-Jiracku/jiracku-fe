import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { Modal, message } from "antd";
import { MESSAGE } from "../../../../constants/constants";
import { useNavigate, useParams } from "react-router-dom";
import { getSprintDetail, updateSprint } from "../../../../api/sprint-api";
import SprintForm from "../../../Molecules/Sprint/SprintForm";

const UpdateSprint = forwardRef((props, ref) => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [sprintDetail, setSprintDetail] = useState();

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
      startDate: item.startDate === undefined ? "" : item.startDate,
      endDate: item.endDate === undefined ? "" : item.endDate,
      updatedBy: "Gia Bao",
    };
    await updateSprint(updateSprintData)
      .then((res) => {
        message.success(MESSAGE.UPDATE_SPRINT_SUCCESS);
        setOpenModal(false);
        navigate(`/projects/${projectId}`);
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
      const SprintDetail = () => {
        getSprintDetail(props.sprintId)
          .then((res) => setSprintDetail(res?.data))
          .catch((error) => {
            message.error(MESSAGE.GET_DATA_FAIL);
          });
      };
      SprintDetail();
    }
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
