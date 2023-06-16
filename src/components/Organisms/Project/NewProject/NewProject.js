import { useState, forwardRef, useImperativeHandle } from "react";
import { Modal, message } from "antd";
import ProjectForm from "../../../Molecules/Project/ProjectForm";
import { postProject } from "../../../../api/api";
import { MESSAGE } from "../../../../constants/constants";

const NewProject = forwardRef((props, ref) => {
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
    const postProjectData = {
      name: item.name === undefined ? "" : item.name,
      createdBy: "Gia Bao",
    };
     await postProject(postProjectData)
      .then((res) => {
        message.success(MESSAGE.CREATE_PROJECT_SUCCESS);
        setOpenModal(false);
        props?.getProjectData();
      })
      .catch((error) => {
        message.error(MESSAGE.CREATE_PROJECT_FAIL);
        setOpenModal(false);
      });
  };
  return (
    <Modal
      title="Create New Project"
      open={openModal}
      onCancel={handleCancel}
      centered
      footer={null}
      destroyOnClose={true}
    >
      <ProjectForm
        editMode={false}
        onCancel={closeModalHandle}
        onSubmit={onSubmitForm}
        projectList={props.projectList}
      />
    </Modal>
  );
});

export default NewProject;
