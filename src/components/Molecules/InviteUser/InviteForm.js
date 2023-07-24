import { useEffect } from "react";
import { Button, Form, Input } from "antd";
import styles from "./styles.module.scss";

const InviteForm = ({ onSubmit, onCancel }) => {
  const [form] = Form.useForm();
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  const onFinish = (values) => {
    const data = { ...values };
    onSubmit(data);
  };

  useEffect(() => {
    form.setFields([
      {
        name: "to",
        value: "",
      },
    ]);
  }, [form]);

  return (
    <Form
      name="basic"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      autoComplete="off"
      form={form}
    >
      <Form.Item
        label="Email"
        name="to"
        rules={[
          {
            required: true,
            message: "Please input Email",
          }
        ]}
        className={styles["form-item"]}
        validateTrigger="onBlur"
      >
        <Input />
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button
          className={styles["button-submit"]}
          type="primary"
          htmlType="submit"
        >
          Send
        </Button>
        <Button
          className={styles["button-cancel"]}
          htmlType="button"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
};

export default InviteForm;
