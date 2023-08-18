import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { Button, Modal, message } from "antd";
import { MESSAGE } from "../../../../constants/constants";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteEvent, updateEvent } from "../../../../api/event-api";
import { getEventDetailAction, getEventListAction } from "../../../../redux/action/event-action";
import CalenderForm from "../../../Molecules/Calendar/CalendarForm";

const UpdateCalendar = forwardRef((props, ref) => {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const eventDetail = useSelector((state) => state.eventReducer.eventDetail);

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
        dispatch(getEventListAction(projectId))
      })
      .catch((error) => {
        message.error(MESSAGE.DELETE_FAIL);
      });
  };

  const onSubmitForm = async (item) => {
    const updateEventData = {
        id: props.eventId === undefined ? "" : props.eventId,
        title: item.title === undefined ? "" : item.title,
        projectId: Number(projectId) === undefined ? "" : Number(projectId),
        startTime: item.startTime === undefined ? null : item.startTime,
        endTime: item.endTime === undefined ? null : item.endTime,
        updatedBy: `${props.userDetail.email === null ? "" : props.userDetail.email}`,
      };
    await updateEvent(updateEventData)
      .then((res) => {
        message.success(MESSAGE.UPDATE_EVENT_SUCCESS);
        setOpenModal(false);
        dispatch(getEventListAction(projectId))
      })
      .catch((error) => {
       console.log(error);
      });
  };

  useEffect(() => {
    if (props.eventId && openModal) {
      dispatch(getEventDetailAction(props.eventId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openModal, props.sprintId]);
  return (
    <Modal
    title="Edit Event"
      open={openModal}
      onCancel={handleCancel}
      centered
      footer={null}
      destroyOnClose={true}
    >
      <CalenderForm
        editMode={true}
        onCancel={closeModalHandle}
        onSubmit={onSubmitForm}
        eventDetail={eventDetail}
        onDelete={handleDelete}
      />
    </Modal>
  );
});

export default UpdateCalendar;
