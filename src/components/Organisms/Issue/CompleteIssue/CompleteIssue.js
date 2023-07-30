import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { Modal, message } from "antd";
import { MESSAGE } from "../../../../constants/constants";
import { useNavigate, useParams } from "react-router-dom";
import { completeIssue } from "../../../../api/issue-api";
import CompleteIssueForm from "../../../Molecules/Issue/CompleteIssueForm/CompleteIssueForm";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getSprintDetailAction } from "../../../../redux/action/sprint-action";

const CompleteIssue = forwardRef((props, ref) => {
  const { projectId, sprintId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const sprintDetail = useSelector((state) => state.sprintReducer.sprintDetail);
  
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
    // const completeIssueData = {
    //     sprintToUpdate: item.sprintId === undefined ? 0 : Number(item.sprintId),
    // };
    await completeIssue(sprintId,item.sprintId === undefined ? 0 : Number(item.sprintId))
      .then((res) => {
        message.success(MESSAGE.COMPLETE_SPRINT_SUCCESS);
        setOpenModal(false);
        navigate(`/projects/${projectId}`);
      })
      .catch((error) => {
        if (error.response.status === 500) {
          if (error.response.data === "Internal Server Error") {
            message.error(MESSAGE.COMPLETE_SPRINT_FAIL);
          }
        }
      });
  };

  useEffect(() => {
    if (sprintId && openModal) {
      dispatch(getSprintDetailAction(sprintId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openModal, sprintId]);

  return (
    <Modal
      title={`Complete Sprint ${sprintDetail?.name}`}
      open={openModal}
      onCancel={handleCancel}
      centered
      footer={null}
      destroyOnClose={true}
    >
      <CompleteIssueForm
        onCancel={closeModalHandle}
        onSubmit={onSubmitForm}
        sprintId={sprintDetail?.id}
      />
    </Modal>
  );
});

export default CompleteIssue;
