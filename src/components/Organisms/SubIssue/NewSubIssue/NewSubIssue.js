import { useState, forwardRef, useImperativeHandle } from "react";
import { Modal, message } from "antd";
import { MESSAGE } from "../../../../constants/constants";
import NewSubIssueForm from "../../../Molecules/SubIssues/NewSubIssueForm/NewSubIssueForm";
import { postSubIssue } from "../../../../api/subIssue-api";
import { useDispatch } from "react-redux";
import { getIssueDetailAction } from "../../../../redux/action/issue-action";

const NewSubIssue = forwardRef((props, ref) => {
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
  const onSubmitForm = async (item) => {
    const postSubIssueData = {
      name: item.name === undefined ? "" : item.name,
      type: Number(item.type) === 0 ? null : Number(item.type),
      priority: Number(item.priority) === 0 ? null : Number(item.priority),
      storyPoint: item.storyPoint === undefined ? null : item.storyPoint,
      statusId: Number(item.statusId) === 0 ? null : Number(item.statusId),
      issueId: Number(props.issueDetail.id) === 0 ? null : Number(props.issueDetail.id),
      startDate: item.startDate === undefined ? null : item.startDate,
      dueDate: item.dueDate === undefined ? null : item.dueDate,
      createdBy: `${props.userDetail.email === null ? "" : props.userDetail.email}`
    };
    await postSubIssue(postSubIssueData)
      .then((res) => {
        message.success(MESSAGE.CREATE_SUB_ISSUE_SUCCESS);
        setOpenModal(false);
        dispatch(getIssueDetailAction(props.issueDetail.id));
      })
      .catch((error) => {
        if (error.response.status === 500) {
          if (error.response.data === "Internal Server Error") {
            message.error(MESSAGE.CREATE_FAIL);
          }
        }
      });
  };

  return (
    <Modal
      title="Create New Sub Issue"
      open={openModal}
      onCancel={handleCancel}
      centered
      footer={null}
      destroyOnClose={true}
    >
      <NewSubIssueForm
        editMode={false}
        onCancel={closeModalHandle}
        onSubmit={onSubmitForm}
      />
    </Modal>
  );
});

export default NewSubIssue;
