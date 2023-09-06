import { useState, forwardRef, useImperativeHandle } from "react";
import { Modal, message } from "antd";
import { MESSAGE } from "../../../../constants/constants";
import { useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getUserListAction } from "../../../../redux/action/user-action";
import { disableUser } from "../../../../api/user-api";

const DisableUser = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page")) || 1;
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

  const handleDisableUser = async () => {
    await disableUser(props.userId)
      .then((res) => {
        message.success(MESSAGE.DISABLE_SU);
        setOpenModal(false);
        dispatch(
          getUserListAction({
            currentPage: currentPage,
            searchKey: "",
          })
        );
      })
      .catch((error) => {
        message.error(MESSAGE.DISABLE_FAIL);
      });
  };
  return (
    <Modal
      title="Disable User"
      open={openModal}
      onOk={handleDisableUser}
      onCancel={handleCancel}
      centered
      destroyOnClose={true}
    >
      <p>Are you sure want to Disable User?</p>
    </Modal>
  );
});

export default DisableUser;
