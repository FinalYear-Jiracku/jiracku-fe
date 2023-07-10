import { Button, Form, Input, message } from "antd";
import styles from "./styles.module.scss";
import { MESSAGE } from "../../../../constants/constants";
import { postComment } from "../../../../api/comment-api";
import { useDispatch } from "react-redux";
import { getIssueDetailAction } from "../../../../redux/action/issue-action";
import { useState } from "react";

const NewCommentForm = ({ userDetail, issueDetail }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [disabledSave, setDisabledSave] = useState(true);
  const [commentContent, setCommentContent] = useState('');

  const handleFormChange = () => {
    const hasErrors = form.getFieldsError().some(({ errors }) => errors.length);
    setDisabledSave(hasErrors);
  };

  const onFinish = async (item) => {
    const postCommentData = {
      content: item.content === undefined ? "" : item.content,
      issueId: Number(issueDetail.id),
      createdBy: `${userDetail.email === null ? "" : userDetail.email}`,
    };
    await postComment(postCommentData)
      .then((res) => {
        message.success(MESSAGE.CREATE_COMMENT_SUCCESS);
        setCommentContent('');
        form.resetFields();
        dispatch(getIssueDetailAction(issueDetail.id));
      })
      .catch((error) => {
        message.error(MESSAGE.CREATE_FAIL);
      });
  };
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
        <Form.Item>
          <Button
            className={styles["button-submit"]}
            type="primary"
            htmlType="submit"
            disabled={disabledSave}
          >
            Post
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default NewCommentForm;
