import { useEffect } from "react";
import { Button, Form, Select } from "antd";
import styles from "./styles.module.scss";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  getCompleteIssueAction,
  getUnCompleteIssueAction,
} from "../../../../redux/action/issue-action";
import { getSprintListCompleteAction } from "../../../../redux/action/sprint-action";
import { useParams } from "react-router-dom";

const CompleteIssueForm = ({ onSubmit, onCancel, sprintId }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { projectId } = useParams();
  const completeIssue = useSelector(
    (state) => state.issueReducer.completeIssue
  );
  const unCompleteIssue = useSelector(
    (state) => state.issueReducer.unCompleteIssue
  );
  const sprintListComplete = useSelector(
    (state) => state.sprintReducer.sprintListComplete
  );

  const renderSprint = sprintListComplete.map((data) => ({
    value: data.id,
    label: data.name,
  }));

  const newSprintOption = { value: 0, label: "New Sprint" };
  renderSprint.unshift(newSprintOption);

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  const onFinish = (values) => {
    const data = { sprintId: values.sprintId};
    onSubmit(data);
  };

  useEffect(() => {
    if(sprintId){
        dispatch(getCompleteIssueAction(sprintId));
        dispatch(getUnCompleteIssueAction(sprintId));
        dispatch(getSprintListCompleteAction({
            projectId:`${projectId}`,
            sprintId:`${sprintId}`
        }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sprintId,projectId]);

  return (
    <div>
      <div>
        <p>This Sprint Contains</p>
        <ul>
          <li>{completeIssue} Completed Issues</li>
          <li>{unCompleteIssue} Open Issues</li>
        </ul>
        <p>Move open Issues to</p>
      </div>
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
          label=""
          name="sprintId"
          rules={[
            {
              required: unCompleteIssue > 0 ? true : false,
              message: "Please choose option First!",
            },
          ]}
          className={styles["form-item"]}
          validateTrigger="onBlur"
        >
          <Select options={renderSprint} disabled={unCompleteIssue > 0 ? false : true}/>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button
            className={styles["button-submit"]}
            type="primary"
            htmlType="submit"
          >
            Complete
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
    </div>
  );
};

export default CompleteIssueForm;
