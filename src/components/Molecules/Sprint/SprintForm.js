import { useEffect } from "react";
import { Button, Form, Input, DatePicker, Row, Col } from "antd";
import styles from "./styles.module.scss";
import { INFO_FORM } from "./FormField";
import dayjs from "dayjs";

const SprintForm = ({ onSubmit, onCancel, editMode, sprintDetail }) => {
  const [form] = Form.useForm();
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  const onFinish = (values) => {
    const data = {
      ...values,
    };
    onSubmit(data);
  };
  
  const validateName = (_, value) => {
    const { name } = form.getFieldsValue(["name"]);
    if (value && name && value.trim().length > 30 ) {
      return Promise.reject("Sprint Name field max length 30 characters");
    }
    return Promise.resolve();
  };

  const validateEndDate = (_, value) => {
    const { startDate } = form.getFieldsValue(["startDate"]);
    if (value && startDate && value.isBefore(startDate, "day")) {
      return Promise.reject("End date must be later than the start date");
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
        {
          name: "startDate",
          value: "",
        },
        {
          name: "endDate",
          value: "",
        },
      ]);
    }
    if (editMode && sprintDetail) {
      form.setFields([
        {
          name: "name",
          value: sprintDetail.name,
        },
        {
          name: "startDate",
          value: dayjs(sprintDetail.startDate),
        },
        {
          name: "endDate",
          value: dayjs(sprintDetail.endDate),
        },
      ]);
    }
  }, [editMode, form, sprintDetail]);

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
                    validator: form.name === "name" ? validateName : validateEndDate,
                  },
                ]}
                validateTrigger="onBlur"
              >
                {form.type === "input" ? (
                  <Input />
                ) : (
                  <DatePicker format={"YYYY-MMMM-DD"} />
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

export default SprintForm;
