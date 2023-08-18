import { useState, forwardRef, useImperativeHandle } from "react";
import { Modal, message } from "antd";
import { useParams } from "react-router-dom";
import CalenderForm from "../../../Molecules/Calendar/CalendarForm";
import { postEvent } from "../../../../api/event-api";
import { MESSAGE } from "../../../../constants/constants";
import { useDispatch } from "react-redux";
import { getEventListAction } from "../../../../redux/action/event-action";

const NewCalendar = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const { projectId } = useParams();
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
    const postEventData = {
      title: item.title === undefined ? "" : item.title,
      projectId: Number(projectId) === undefined ? "" : Number(projectId),
      startTime: item.startTime === undefined ? null : item.startTime,
      endTime: item.endTime === undefined ? null : item.endTime,
      createdBy: `${props.userDetail.email === null ? "" : props.userDetail.email}`,
    };
    await postEvent(postEventData)
      .then((res) => {
        message.success(MESSAGE.CREATE_EVENT_SUCCESS);
        setOpenModal(false);
        dispatch(getEventListAction(projectId))
      })
      .catch((error) => {
       console.log(error);
      });
  };

  return (
    <Modal
      title="Create Event"
      open={openModal}
      onCancel={handleCancel}
      centered
      footer={null}
      destroyOnClose={true}
    >
      <CalenderForm
        editMode={false}
        onCancel={closeModalHandle}
        onSubmit={onSubmitForm}
      />
    </Modal>
  );
});

export default NewCalendar;
