import { useState, forwardRef, useImperativeHandle } from "react";
import { Modal, message } from "antd";
import { MESSAGE } from "../../../../constants/constants";
import { useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getUserListAction } from "../../../../redux/action/user-action";
import { disableUser, enableUser } from "../../../../api/user-api";

const EnableUser = forwardRef((props, ref) => {
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

  const handleEnableUser = async () => {
    await enableUser(props.userId)
      .then((res) => {
        message.success(MESSAGE.ENABLE_SU);
        setOpenModal(false);
        dispatch(
          getUserListAction({
            currentPage: currentPage,
            searchKey: "",
          })
        );
      })
      .catch((error) => {
        message.error(MESSAGE.ENABLE_FAIL);
      });
  };
  return (
    <Modal
      title="Enable User"
      open={openModal}
      onOk={handleEnableUser}
      onCancel={handleCancel}
      centered
      destroyOnClose={true}
    >
      <p>Are you sure want to Enable User?</p>
    </Modal>
  );
});

export default EnableUser;
