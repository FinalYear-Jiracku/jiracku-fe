import { useEffect } from "react";
import { Button, Form, Input, DatePicker, Row, Col, Select } from "antd";
import styles from "./styles.module.scss";
import { INFO_FORM, dataSelectOption } from "./FormField";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getDropdownStatusListAction } from "../../../../redux/action/status-action";

const NewIssueForm = ({ onSubmit, onCancel, editMode, issueDetail }) => {
  const { sprintId } = useParams();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const dropdownStatusList = useSelector(
    (state) => state.statusReducer.dropdownStatusList
  );

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  const renderStatus = dropdownStatusList.map((data) => ({
    value: data.id,
    label: data.name,
  }));

  const onFinish = (values) => {
    const data = {
      ...values,
    };
    onSubmit(data);
  };

  const validateName = (_, value) => {
    const { name } = form.getFieldsValue(["name"]);
    if (value && name && value.trim().length > 30) {
      return Promise.reject("Sprint Name field max length 30 characters");
    }
    return Promise.resolve();
  };

  const validateStoryPoint = (_, value) => {
    const check =/[^0-9]+/;
    const { storyPoint } = form.getFieldsValue(["storyPoint"]);
    if (value && storyPoint && check.test(value)) {
      return Promise.reject("Invalid Format");
    }
    return Promise.resolve();
  };

  const validateEndDate = (_, value) => {
    const { startDate } = form.getFieldsValue(["startDate"]);
    if (value && startDate && value.isBefore(startDate, "day")) {
      return Promise.reject("Due date must be later than the start date");
    }
    return Promise.resolve();
  };

  const ignore = () => {
    return Promise.resolve();
  };

  useEffect(() => {
    if (!editMode) {
      form.setFields([
        {
          name: "name",
          value: "",
        },
        {
          name: "type",
          value: "",
        },
        {
          name: "priority",
          value: "",
        },
        {
          name: "storyPoint",
          value: Number(),
        },
        {
          name: "statusId",
          value: "",
        },
        {
          name: "startDate",
          value: dayjs()
        },
        {
          name: "dueDate",
          value: dayjs(),
        },
      ]);
    }
    if (editMode && issueDetail) {
      form.setFields([
        {
          name: "name",
          value: issueDetail.name,
        },
        {
          name: "type",
          value: issueDetail.type,
        },
        {
          name: "priority",
          value: issueDetail.priority,
        },
        {
          name: "storyPoint",
          value: issueDetail.storyPoint,
        },
        {
          name: "statusId",
          value: issueDetail?.status?.name,
        },
        {
          name: "userIssues",
          value: issueDetail.userIssues,
        },
        {
          name: "startDate",
          value: dayjs(issueDetail.startDate),
        },
        {
          name: "dueDate",
          value: dayjs(issueDetail.dueDate),
        },
      ]);
    }
    dispatch(getDropdownStatusListAction(`${sprintId}`));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editMode, form, issueDetail, sprintId]);

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
      {INFO_FORM.map((form) => {
        return (
          <Row key={form.id}>
            <Col flex="100px">{form.label}</Col>
            <Col flex="auto">
              <Form.Item
                name={form.name}
                rules={[
                  {
                    required: form.require,
                    message: form.error,
                  },
                  {
                    validator:
                      form.name === "name"
                        ? validateName
                        : form.name === "startDate" || form.name === "dueDate"
                        ? validateEndDate
                        : form.name === "storyPoint"
                        ? validateStoryPoint
                        : ignore
                  },
                ]}
                validateTrigger="onBlur"
              >
                {form.type === "input" ? (
                  <Input />
                ) : form.type === "select" ? (
                  <Select
                    options={
                      form.name === "type" || form.name === "priority"
                        ? dataSelectOption(form.name)
                        : renderStatus
                    }
                  />
                ) : (
                  <DatePicker
                    format={"YYYY-MMMM-DD"}
                    style={{ width: "370px" }}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
        );
      })}

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

export default NewIssueForm;
