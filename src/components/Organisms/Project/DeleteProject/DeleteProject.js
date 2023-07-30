import { useState, forwardRef, useImperativeHandle } from "react";
import { Modal, message } from "antd";
import { deleteProject } from "../../../../api/project-api";
import { MESSAGE } from "../../../../constants/constants";
import styles from "./styles.module.scss";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getProjectListAction } from "../../../../redux/action/project-action";

const DeleteProject = forwardRef((props, ref) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page")) || 1;
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

  const handleDelete = async () => {
    await deleteProject(props.projectId)
      .then((res) => {
        message.success(MESSAGE.DELETE_PROJECT_SUCCESS);
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
        message.error(MESSAGE.DELETE_FAIL);
      });
  };
  return (
    <Modal
      title="Delete Project"
      open={openModal}
      onOk={handleDelete}
      onCancel={handleCancel}
      centered
      destroyOnClose={true}
      className={styles.footer}
    >
      <p>Are you sure want to delete?</p>
    </Modal>
  );
});

export default DeleteProject;
