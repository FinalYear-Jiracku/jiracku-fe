import { useState, forwardRef, useImperativeHandle } from "react";
import { Modal, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { MESSAGE } from "../../../../constants/constants";
import StatusForm from "../../../Molecules/Status/StatusForm";
import { postStatus } from "../../../../api/status-api";

const NewStatus = forwardRef((props, ref) => {
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
  const onSubmitForm = async (item) => {
    const postStatusData = {
      name: item.name === undefined ? "" : item.name,
      sprintId : Number(sprintId) === 0 ? null : Number(sprintId),
      createdBy: `${props.userDetail.email === null ? "" : props.userDetail.email}`,
    };
    await postStatus(postStatusData)
      .then((res) => {
        message.success(MESSAGE.CREATE_STATUS_SUCCESS);
        setOpenModal(false);
        navigate(`/projects/${projectId}/${sprintId}`);
      })
      .catch((error) => {
        if (error.response.status === 400) {
          if (error.response.data === "Status Name already Exist") {
            message.error(MESSAGE.STATUS_NAME_EXIST);
          }
        }
      });
  };

  return (
    <Modal
      title="Create New Status"
      open={openModal}
      onCancel={handleCancel}
      centered
      footer={null}
      destroyOnClose={true}
    >
      <StatusForm
        editMode={false}
        onCancel={closeModalHandle}
        onSubmit={onSubmitForm}
      />
    </Modal>
  );
});

export default NewStatus;
