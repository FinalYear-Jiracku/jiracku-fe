import { useState, forwardRef, useImperativeHandle } from "react";
import { Modal, message } from "antd";
import { deleteProject } from "../../../../api/project-api";
import { MESSAGE } from "../../../../constants/constants";
import styles from "./styles.module.scss";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteStatus } from "../../../../api/status-api";

const DeleteStatus = forwardRef((props, ref) => {
  const {projectId,sprintId} = useParams();
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

  const handleDelete = async () => {
    await deleteStatus(props.statusId)
      .then((res) => {
        message.success(MESSAGE.DELETE_PROJECT_SUCCESS);
        setOpenModal(false);
        navigate(`/projects/${projectId}/${sprintId}`);
      })
      .catch((error) => {
        message.error(MESSAGE.DELETE_FAIL);
      });
  };
  return (
    <Modal
      title="Delete Status"
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

export default DeleteStatus;
