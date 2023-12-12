import { useState, forwardRef, useImperativeHandle } from "react";
import { Modal, message } from "antd";
import styles from "./styles.module.scss";
import { useDispatch } from "react-redux";
import { disableSms } from "../../../api/totp-api";
import { getUserDetailAction } from "../../../redux/action/user-action";
import { MESSAGE } from "../../../constants/constants";

const DisableSms = forwardRef((props, ref) => {
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

  const disableQRCode = async () => {
    await disableSms(`${props.userDetail.id === null ? "" :props.userDetail.id}`)
      .then((res) => {
        message.success(MESSAGE.DISABLE_SUCCESS_SMS);
        dispatch(getUserDetailAction())
        setOpenModal(false);
      })
      .catch((error) => {
        message.success(MESSAGE.FAIL_SMS);
        console.log(error);
      });
  };
  return (
    <Modal
      title="Disable Two-factor authenticaton (2FA)"
      open={openModal}
      onOk={disableQRCode}
      onCancel={handleCancel}
      centered
      destroyOnClose={true}
      className={styles.footer}
    >
      <p>Are you sure want to disable Text Message (SMS)?</p>
    </Modal>
  );
});

export default DisableSms;
