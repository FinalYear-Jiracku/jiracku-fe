import { useState, forwardRef, useImperativeHandle } from "react";
import { Modal, message } from "antd";
import { MESSAGE } from "../../../../constants/constants";
import { useDispatch } from "react-redux";
import { getIssueDetailAction } from "../../../../redux/action/issue-action";
import { deleteSubIssue } from "../../../../api/subIssue-api";

const DeleteSubIssue = forwardRef((props, ref) => {
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
    await deleteSubIssue(props.subIssueId)
      .then((res) => {
        message.success(MESSAGE.DELETE_SUB_ISSUE_SUCCESS);
        setOpenModal(false);
        dispatch(getIssueDetailAction(props.issueDetail.id));
      })
      .catch((error) => {
        message.error(MESSAGE.DELETE_FAIL);
      });
  };
  return (
    <Modal
      title="Delete SubIssue"
      open={openModal}
      onOk={handleDelete}
      onCancel={handleCancel}
      centered
      destroyOnClose={true}
    >
      <p>Are you sure want to delete?</p>
    </Modal>
  );
});

export default DeleteSubIssue;
