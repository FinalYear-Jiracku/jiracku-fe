import { useState, forwardRef, useImperativeHandle } from "react";
import { Button, Input, Form, Modal, message, Select } from "antd";
import styles from "./styles.module.scss";
import { MESSAGE } from "../../../constants/constants";
import { useDispatch } from "react-redux";
import { getUserDetailAction } from "../../../redux/action/user-action";
import { CountryCode } from "./CountryCode";
import { generateSms, verifySms } from "../../../api/totp-api";


const Sms = forwardRef((props, ref) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [isGenerate, setIsGenerate] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState("+1");

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

  const validatePhone = (_, value) => {
    const check = /[^0-9]+/;
    const { phone } = form.getFieldsValue(["phone"]);
    if (value && phone && check.test(value)) {
      return Promise.reject("Invalid Format");
    }
    return Promise.resolve();
  };


  const verifySmsCode = async (item) => {
    const smsData = {
      userId: `${props.userDetail.id === null ? "" : props.userDetail.id}`,
      code: item.code === null ? "" : item.code,
    };
    
    await verifySms(smsData)
      .then((res) => {
        if (res.status) {
          message.success(MESSAGE.SUCCESS_SMS);
          dispatch(getUserDetailAction());
          setOpenModal(false);
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          if (error.response.data === "Code has expired") {
            message.error(MESSAGE.FAIL_SMS);
          }
        }
      });
  };

  const generateSmsCode = async (item) => {
    const phoneData = `${selectedCountryCode}${Number(item.phone) === null ? "" : Number(item.phone)}`
    const smsData = {
      userId: `${props.userDetail.id === null ? "" : props.userDetail.id}`,
      phone: phoneData.toString(),
    };
    await generateSms(smsData)
      .then((res) => {
        setIsGenerate(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const back = () => {
    setIsGenerate(false);
  };

  return (
    <Modal
      title="Text Message (SMS)"
      open={openModal}
      onCancel={handleCancel}
      centered
      footer={null}
      destroyOnClose={true}
      className={styles.modal}
    >
      <p>Enter your Phone Number to Recieve Code</p>
      <div className={styles.form}>
        <div>
          <Form
            name="basic"
            initialValues={{
              remember: true,
            }}
            onFinish={isGenerate === false ? generateSmsCode : verifySmsCode}
            autoComplete="off"
            form={form}
          >
            {isGenerate === false ? (
              <Form.Item
                name="countryCode"
                rules={[
                  {
                    required: true,
                    message: "Please select your Country!",
                  },
                ]}
                validateTrigger="onBlur"
              >
                <Select
                    placeholder="Country Code"
                    options={CountryCode}
                    allowClear
                    onChange={(value) => setSelectedCountryCode(value)}
                ></Select>
              </Form.Item>
            ) : (
              ""
            )}
            {isGenerate === false ? (
              <Form.Item
                name="phone"
                rules={[
                  {
                    required: true,
                    message: "Please input your Phone Number!",
                  },
                  {
                    validator: validatePhone
                  },
                ]}
                validateTrigger="onBlur"
              >
                <Input placeholder="Phone Number" className={styles.input} />
              </Form.Item>
            ) : (
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
                <Input placeholder="Type Code" className={styles.input} />
              </Form.Item>
            )}
            {isGenerate === false ? (
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Verify Number
                </Button>
              </Form.Item>
            ) : (
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Verify & Active
                </Button>
              </Form.Item>
            )}
          </Form>
        </div>
        {isGenerate === true && (
          <Button type="primary" onClick={() => back()}>
            Back
          </Button>
        )}
      </div>
    </Modal>
  );
});

export default Sms;
