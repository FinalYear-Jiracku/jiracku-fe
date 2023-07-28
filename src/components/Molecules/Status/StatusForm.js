import { useEffect } from "react";
import { Button, Form, Input } from "antd";
import styles from "./styles.module.scss";

const StatusForm = ({
  onSubmit,
  onCancel,
  editMode,
  statusDetail,
}) => {
  const [form] = Form.useForm();
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  const onFinish = (values) => {
    const data = { ...values };
    onSubmit(data);
  };

  const validateName = (_, value) => {
    const { name } = form.getFieldsValue(["name"]);
    if (value && name && value.trim().length > 20 ) {
      return Promise.reject("Project Name field max length 20 characters");
    }
    return Promise.resolve();
  };

  useEffect(() => {
    if (!editMode) {
      form.setFields([
        {
          name: "name",
          value: "",
        },
      ]);
    }
    if (editMode && statusDetail) {
      form.setFields([
        {
          name: "name",
          value: statusDetail.name,
        },
      ]);
    }
  }, [editMode, form, statusDetail]);

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
        label="Status Name"
        name="name"
        rules={[
          {
            required: true,
            message: "Please input your Status Name!",
          },
          {
            validator: validateName
          },
        ]}
        className={styles["form-item"]}
        validateTrigger="onBlur"
      >
        <Input />
      </Form.Item>

      <Form.Item {...tailLayout}>
        {editMode ? (
          <Button
            className={styles["button-submit"]}
            type="primary"
            htmlType="submit"
          >
            Save
          </Button>
        ) : (
          <Button
            className={styles["button-submit"]}
            type="primary"
            htmlType="submit"
          >
            Submit
          </Button>
        )}
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

export default StatusForm;
