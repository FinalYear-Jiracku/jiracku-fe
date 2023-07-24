import { useEffect, useState } from "react";
import { Button, Form, Input } from "antd";
import styles from "./styles.module.scss";

const UpdateCommentForm = ({ onSubmit, onCancel, commentDetail }) => {
  const [form] = Form.useForm();
  const [disabledSave, setDisabledSave] = useState(true);
  const [commentContent, setCommentContent] = useState("");

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  const onFinish = (values) => {
    const data = { ...values };
    onSubmit(data);
  };

  const handleFormChange = () => {
    const hasErrors = form.getFieldsError().some(({ errors }) => errors.length);
    setDisabledSave(hasErrors);
  };

  useEffect(() => {
    if (commentDetail) {
      form.setFields([
        {
          name: "content",
          value: commentDetail?.content,
        },
      ]);
    }
  }, [form, commentDetail]);

  return (
    <>
      <Form
        name="basic"
        autoComplete="off"
        form={form}
        onFinish={onFinish}
        className={styles["ant-form"]}
        onFieldsChange={handleFormChange}
      >
        <Form.Item name="content">
          <Input
            placeholder="Type here to comment"
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            className={styles.input}
          />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button
            className={styles["button-submit"]}
            type="primary"
            htmlType="submit"
            disabled={disabledSave}
          >
            Post
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
    </>
  );
};

export default UpdateCommentForm;
