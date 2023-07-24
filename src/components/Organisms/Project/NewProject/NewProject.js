import { useState, forwardRef, useImperativeHandle } from "react";
import { Modal, message } from "antd";
import ProjectForm from "../../../Molecules/Project/ProjectForm";
import { postProject } from "../../../../api/project-api";
import { useNavigate } from "react-router-dom";
import { MESSAGE } from "../../../../constants/constants";

const NewProject = forwardRef((props, ref) => {
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
    const postProjectData = {
      name: item.name === undefined ? "" : item.name,
      createdBy: `${props.userDetail.email === null ? "" : props.userDetail.email}`,
    };
    await postProject(postProjectData)
      .then((res) => {
        message.success(MESSAGE.CREATE_PROJECT_SUCCESS);
        setOpenModal(false);
        navigate("/projects");
      })
      .catch((error) => {
        if (error.response.status === 400) {
          if (error.response.data === "Project Name already Exist") {
            message.error(MESSAGE.PROJECT_NAME_EXIST);
          }
        }
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
      />
    </Modal>
  );
});

export default NewProject;
