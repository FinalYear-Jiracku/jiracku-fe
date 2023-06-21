import { useState, forwardRef, useImperativeHandle } from "react";
import { Modal, message } from "antd";
import { postSprint } from "../../../../api/sprint-api";
import { MESSAGE } from "../../../../constants/constants";
import { useNavigate, useParams } from "react-router-dom";
import SprintForm from "../../../Molecules/Sprint/SprintForm";

const NewSprint = forwardRef((props, ref) => {
  const { projectId } = useParams();
  const navigate = useNavigate();
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
  const onSubmitForm = async (item) => {
    const postSprintData = {
      name: item.name === undefined ? "" : item.name,
      projectId: Number(projectId) === undefined ? "" : Number(projectId),
      startDate: item.startDate === undefined ? "" : item.startDate,
      endDate: item.endDate === undefined ? "" : item.endDate,
      createdBy: "Gia Bao",
    };
    await postSprint(postSprintData)
      .then((res) => {
        message.success(MESSAGE.CREATE_SPRINT_SUCCESS);
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
  return (
    <Modal
      title="Create New Sprint"
      open={openModal}
      onCancel={handleCancel}
      centered
      footer={null}
      destroyOnClose={true}
    >
      <SprintForm
        editMode={false}
        onCancel={closeModalHandle}
        onSubmit={onSubmitForm}
      />
    </Modal>
  );
});

export default NewSprint;
