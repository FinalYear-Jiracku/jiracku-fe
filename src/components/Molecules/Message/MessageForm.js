import { useEffect } from "react";
import { Button, Form, Input } from "antd";
import styles from "./styles.module.scss";

const MessageForm = ({
  onSubmit,
  onCancel,
  editMode,
  messageDetail,
}) => {
  const [form] = Form.useForm();
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  const onFinish = (values) => {
    const data = { ...values };
    onSubmit(data);
  };
 
  useEffect(() => {
    if (editMode && messageDetail) {
      form.setFields([
        {
          name: "content",
          value: messageDetail.content,
        },
      ]);
    }
  }, [editMode, form, messageDetail]);

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
        label="Content"
        name="content"
        rules={[
          {
            required: true,
            message: "Please input your Content!",
          },
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
            Save
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

export default MessageForm;
