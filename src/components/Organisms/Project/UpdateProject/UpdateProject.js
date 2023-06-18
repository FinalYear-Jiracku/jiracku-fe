import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { Modal, message } from "antd";
import ProjectForm from "../../../Molecules/Project/ProjectForm";
import { getProjectDetail, updateProject } from "../../../../api/project-api";
import { MESSAGE } from "../../../../constants/constants";
import { useNavigate } from "react-router-dom";

const UpdateProject = forwardRef((props, ref) => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [projectDetail, setProjectDetail] = useState();

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
    const updateProjectData = {
      id: props.projectId === undefined ? "" : props.projectId,
      name: item.name === undefined ? "" : item.name,
      updatedBy: "Gia Bao",
    };
    await updateProject(updateProjectData)
      .then((res) => {
        message.success(MESSAGE.UPDATE_PROJECT_SUCCESS);
        setOpenModal(false);
        navigate("/projects")
      })
      .catch((error) => {
        if (error.response.status === 400) {
          if (error.response.data === "Project Name already Exist") {
            message.error(MESSAGE.PROJECT_NAME_EXIST);
          }
        }
      });
  };

  useEffect(() => {
    if (props.projectId && openModal) {
      const ProjectDetail = () => {
        getProjectDetail(props.projectId)
          .then((res) => setProjectDetail(res?.data))
          .catch((error) => {
            message.error(MESSAGE.GET_DATA_FAIL);
          });
      };
      ProjectDetail();
    }
  }, [openModal, props.projectId]);
  return (
    <Modal
      title="Edit Project"
      open={openModal}
      onCancel={handleCancel}
      centered
      footer={null}
      destroyOnClose={true}
    >
      <ProjectForm
        editMode={true}
        onCancel={closeModalHandle}
        onSubmit={onSubmitForm}
        projectDetail={projectDetail}
      />
    </Modal>
  );
});

export default UpdateProject;
