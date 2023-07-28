import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { Modal, message } from "antd";
import { MESSAGE } from "../../../../constants/constants";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import StatusForm from "../../../Molecules/Status/StatusForm";
import { getStatusDetailAction } from "../../../../redux/action/status-action";
import { updateStatus } from "../../../../api/status-api";

const UpdateStatus = forwardRef((props, ref) => {
  const {projectId,sprintId} = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const statusDetail = useSelector(
    (state) => state.statusReducer.statusDetail
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
    const updateStatusData = {
      id: props.statusId === undefined ? "" : props.statusId,
      name: item.name === undefined ? "" : item.name,
      sprintId: Number(sprintId) === undefined ? "" : Number(sprintId),
      updatedBy: `${props.userDetail.email === null ? "" : props.userDetail.email}`,
    };
    await updateStatus(updateStatusData)
      .then((res) => {
        message.success(MESSAGE.UPDATE_STATUS_SUCCESS);
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

  useEffect(() => {
    if (props.statusId && openModal) {
      dispatch(getStatusDetailAction(props.statusId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openModal, props.statusId]);

  return (
    <Modal
      title="Edit Status"
      open={openModal}
      onCancel={handleCancel}
      centered
      footer={null}
      destroyOnClose={true}
    >
      <StatusForm
        editMode={true}
        onCancel={closeModalHandle}
        onSubmit={onSubmitForm}
        statusDetail={statusDetail}
      />
    </Modal>
  );
});

export default UpdateStatus;
