import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { Modal, message } from "antd";
import { MESSAGE } from "../../../../constants/constants";
import { useDispatch, useSelector } from "react-redux";
import { getCommentDetailAction } from "../../../../redux/action/comment-action";
import UpdateCommentForm from "../../../Molecules/Comment/UpdateCommentForm/UpdateCommentForm";
import { updateComment } from "../../../../api/comment-api";
import { getIssueDetailAction } from "../../../../redux/action/issue-action";

const UpdateComment = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const commentDetail = useSelector(
    (state) => state.commentReducer.commentDetail
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
    const updateCommentData = {
        id: props.commentId === undefined ? "" : props.commentId,
        content: item.content === undefined ? "" : item.content,
        updatedBy: `${props.userDetail.email === null ? "" : props.userDetail.email}`,
      };
    await updateComment(updateCommentData)
      .then((res) => {
        message.success(MESSAGE.UPDATE_COMMENT_SUCCESS);
        setOpenModal(false);
        dispatch(getIssueDetailAction(props.issueDetail.id));
      })
      .catch((error) => {
        if (error.response.status === 500) {
            message.error(MESSAGE.UPDATE_FAIL);
        }
      });
  };

  useEffect(() => {
    if (props.commentId && openModal) {
      dispatch(getCommentDetailAction(props.commentId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openModal, props.commentId]);

  return (
    <Modal
      title="Edit Comment"
      open={openModal}
      onCancel={handleCancel}
      centered
      footer={null}
      destroyOnClose={true}
    >
      <UpdateCommentForm
        onCancel={closeModalHandle}
        onSubmit={onSubmitForm}
        commentDetail={commentDetail}
      />
    </Modal>
  );
});

export default UpdateComment;
