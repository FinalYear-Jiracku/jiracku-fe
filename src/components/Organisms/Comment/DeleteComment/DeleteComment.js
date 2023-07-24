import { useState, forwardRef, useImperativeHandle } from "react";
import { Modal, message } from "antd";
import { MESSAGE } from "../../../../constants/constants";
import styles from "./styles.module.scss";
import { deleteComment } from "../../../../api/comment-api";
import { useDispatch } from "react-redux";
import { getIssueDetailAction } from "../../../../redux/action/issue-action";

const DeleteComment = forwardRef((props, ref) => {
  const dispatch = useDispatch();
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
    await deleteComment(props.commentId)
      .then((res) => {
        message.success(MESSAGE.DELETE_COMMENT_SUCCESS);
        setOpenModal(false);
        dispatch(getIssueDetailAction(props.issueDetail.id));
      })
      .catch((error) => {
        message.error(MESSAGE.DELETE_FAIL);
      });
  };
  return (
    <Modal
      title="Delete Comment"
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

export default DeleteComment;
