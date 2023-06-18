import { useEffect } from "react";
import { Button, Form, Input } from "antd";
import styles from "./styles.module.scss";

const ProjectForm = ({
  onSubmit,
  onCancel,
  editMode,
  projectDetail,
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
    if (!editMode) {
      form.setFields([
        {
          name: "name",
          value: "",
        },
      ]);
    }
    if (editMode && projectDetail) {
      form.setFields([
        {
          name: "name",
          value: projectDetail.name,
        },
      ]);
    }
  }, [editMode, form, projectDetail]);

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
        label="Project Name"
        name="name"
        rules={[
          {
            required: true,
            message: "Please input your Project Name!",
          },
        ]}
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

export default ProjectForm;
