import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { Button, Input, Form, Modal, message } from "antd";
import styles from "./styles.module.scss";
import QRCode from "qrcode";
import { verifyOtp } from "../../../api/totp-api";
import { MESSAGE } from "../../../constants/constants";
import { useDispatch } from "react-redux";
import { getUserDetailAction } from "../../../redux/action/user-action";

const Totp = forwardRef((props, ref) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch()
  const [openModal, setOpenModal] = useState(false);
  const [codeUrl, setCodeUrl] = useState("");
  const [qrCodeGenerating, setQrCodeGenerating] = useState(false);

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

  const verifyQrCode = async (item) => {
    const otpData = {
      userId: `${props.userDetail.id === null ? "" : props.userDetail.id}`,
      email: `${props.userDetail.email === null ? "" : props.userDetail.email}`,
      code: item.code === null ? "" : item.code,
    };
    await verifyOtp(otpData)
      .then((res) => {
        if (res.status) {
          message.success(MESSAGE.SUCCESS_TOTP);
          dispatch(getUserDetailAction())
          setOpenModal(false);
        }
      })
      .catch((error) => {
        if (!error.status) {
          message.success(MESSAGE.FAIL_TOTP);
        }
      });
  };

  useEffect(() => {
    if (props.secret.qrCodeUrl && !qrCodeGenerating) {
      setQrCodeGenerating(true);
      QRCode.toDataURL(props.secret.qrCodeUrl)
        .then((res) => {
          setCodeUrl(res);
        })
        .finally(() => {
          setQrCodeGenerating(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.secret.qrCodeUrl, qrCodeGenerating]);

  return (
    <Modal
      title="Two-Factor Authentication (2FA)"
      open={openModal}
      onCancel={handleCancel}
      centered
      footer={null}
      destroyOnClose={true}
      className={styles.modal}
    >
      <p>Please Install Authenticator App to get the One Time Password</p>
      <div className={styles.form}>
        <div>
          <img src={codeUrl} alt="qrcode url" />
        </div>
        <div>
          <Form
            name="basic"
            initialValues={{
              remember: true,
            }}
            onFinish={verifyQrCode}
            autoComplete="off"
            form={form}
          >
            <Form.Item
              name="code"
              rules={[
                {
                  required: true,
                  message: "Please input your Code!",
                },
              ]}
              validateTrigger="onBlur"
            >
              <Input placeholder="One Time Password" className={styles.input} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Verify & Active
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Modal>
  );
});

export default Totp;
