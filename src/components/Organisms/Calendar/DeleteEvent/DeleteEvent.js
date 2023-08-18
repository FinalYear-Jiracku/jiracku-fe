import { useState, forwardRef, useImperativeHandle } from "react";
import { Modal, message } from "antd";
import { MESSAGE } from "../../../../constants/constants";
import { useNavigate, useParams } from "react-router-dom";
import { deleteEvent } from "../../../../api/event-api";

const DeleteEvent = forwardRef((props, ref) => {
  const { projectId } = useParams();
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
    await deleteEvent(props.eventId)
      .then((res) => {
        message.success(MESSAGE.DELETE_EVENT_SUCCESS);
        setOpenModal(false);
        navigate(`/calendar/${projectId}`);
      })
      .catch((error) => {
        message.error(MESSAGE.DELETE_FAIL);
      });
  };
  return (
    <Modal
      title="Delete Event"
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

export default DeleteEvent;
