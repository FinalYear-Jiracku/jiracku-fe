import { useState, forwardRef, useImperativeHandle } from "react";
import { Modal, message } from "antd";
import { MESSAGE } from "../../../../constants/constants";
import styles from "./styles.module.scss";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { deleteSprint } from "../../../../api/sprint-api";
import { useDispatch } from "react-redux";
import { getSprintListAction } from "../../../../redux/action/sprint-action";

const DeleteSprint = forwardRef((props, ref) => {
  const { projectId } = useParams();
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
    await deleteSprint(props.sprintId)
      .then((res) => {
        message.success(MESSAGE.DELETE_SPRINT_SUCCESS);
        setOpenModal(false);
        navigate(`/projects/${projectId}?page=${currentPage}`);
        dispatch(
          getSprintListAction({
            projectId: projectId,
            currentPage: currentPage,
            searchKey: "",
          })
        )
      })
      .catch((error) => {
        message.error(MESSAGE.DELETE_FAIL);
      });
  };
  return (
    <Modal
      title="Delete Sprint"
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

export default DeleteSprint;
