import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { Modal, message } from "antd";
import ProjectForm from "../../../Molecules/Project/ProjectForm";
import { updateProject } from "../../../../api/project-api";
import { MESSAGE } from "../../../../constants/constants";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getProjectDetailAction,
  getProjectListAction,
} from "../../../../redux/action/project-action";

const UpdateProject = forwardRef((props, ref) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const [openModal, setOpenModal] = useState(false);
  const projectDetail = useSelector(
    (state) => state.projectReducer.projectDetail
  );

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
      updatedBy: `${props.userDetail.email === null ? "" : props.userDetail.email}`,
    };
    await updateProject(updateProjectData)
      .then((res) => {
        message.success(MESSAGE.UPDATE_PROJECT_SUCCESS);
        setOpenModal(false);
        navigate(`/projects?page=${currentPage}`);
        dispatch(
          getProjectListAction({
            currentPage: currentPage,
            searchKey: "",
          })
        );
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
      dispatch(getProjectDetailAction(props.projectId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
