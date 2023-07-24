import { useState, forwardRef, useImperativeHandle } from "react";
import { Modal, message } from "antd";
import { MESSAGE } from "../../../../constants/constants";
import { useNavigate, useParams } from "react-router-dom";
import { postIssue } from "../../../../api/issue-api";
import NewIssueForm from "../../../Molecules/Issue/NewIssueForm/NewIssueForm";

const NewIssue = forwardRef((props, ref) => {
  const { projectId, sprintId } = useParams();
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
    const postIssueData = {
      name: item.name === undefined ? "" : item.name,
      type: Number(item.type) === 0 ? null : Number(item.type),
      priority: Number(item.priority) === 0 ? null : Number(item.priority),
      storyPoint: item.storyPoint === undefined ? null : item.storyPoint,
      statusId: Number(item.statusId) === 0 ? null : Number(item.statusId),
      sprintId: Number(sprintId) === 0 ? null : Number(sprintId),
      startDate: item.startDate === undefined ? null : item.startDate,
      dueDate: item.dueDate === undefined ? null : item.dueDate,
      createdBy: `${props.userDetail.email === null ? "" : props.userDetail.email}`,
    };
    await postIssue(postIssueData)
      .then((res) => {
        message.success(MESSAGE.CREATE_ISSUE_SUCCESS);
        setOpenModal(false);
        navigate(`/projects/${projectId}/${sprintId}`);
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
      title="Create New Issue"
      open={openModal}
      onCancel={handleCancel}
      centered
      footer={null}
      destroyOnClose={true}
    >
      <NewIssueForm
        editMode={false}
        onCancel={closeModalHandle}
        onSubmit={onSubmitForm}
      />
    </Modal>
  );
});

export default NewIssue;
