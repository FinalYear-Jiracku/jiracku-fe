import { useEffect, useRef, useState } from "react";
import { Button, Col, DatePicker, Form, Input, Row, TimePicker } from "antd";
import styles from "./styles.module.scss";
import dayjs from "dayjs";
import { INFO_FORM } from "./FormField";

const CalenderForm = ({
  onSubmit,
  onCancel,
  editMode,
  eventDetail,
  onDelete,
}) => {
  const [form] = Form.useForm();

  const validateTitle = (_, value) => {
    const { name } = form.getFieldsValue(["title"]);
    if (value && name && value.trim().length > 30) {
      return Promise.reject("Project Name field max length 30 characters");
    }
    return Promise.resolve();
  };
  const validateEndDate = (_, value) => {
    const { startTime } = form.getFieldsValue(["startTime"]);
    if (value && startTime && value.isBefore(startTime, "time")) {
      return Promise.reject("End time must be later than the start time");
    }
    return Promise.resolve();
  };

  const ignore = () => {
    return Promise.resolve();
  };

  const onFinish = (values) => {
    const data = { ...values };
    onSubmit(data);
  };

  useEffect(() => {
    if (!editMode) {
      form.setFields([
        {
          name: "title",
          value: "",
        },
        {
          name: "date",
          value: dayjs(),
        },
        {
          name: "startTime",
          value: dayjs(),
        },
        {
          name: "endTime",
          value: dayjs(),
        },
      ]);
    }
    if (editMode && eventDetail) {
      form.setFields([
        {
          name: "title",
          value: eventDetail.title,
        },
        {
          name: "date",
          value:
            eventDetail.startTime === null ? "" : dayjs(eventDetail.startTime),
        },
        {
          name: "startTime",
          value:
            eventDetail.startTime === null ? "" : dayjs(eventDetail.startTime),
        },
        {
          name: "endTime",
          value: eventDetail.endTime === null ? "" : dayjs(eventDetail.endTime),
        },
      ]);
    }
  }, [editMode, form, eventDetail]);

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
                      form.name === "title"
                        ? validateTitle
                        : form.name === "startTime" || form.name === "endTime"
                        ? validateEndDate
                        : ignore,
                  },
                ]}
                validateTrigger="onBlur"
              >
                {form.type === "input" ? (
                   <Button href="https://zoom.us/oauth/authorize?response_type=code&client_id=spqBcTkS4egeysQDEQuBg&redirect_uri=http://localhost:3000/meeting">
                   Connect Zoom
                 </Button>
                ) : form.type === "date" ? (
                  <DatePicker format={"YYYY-MMMM-DD"} className={styles.date} />
                ) : form.type === "time" ? (
                  <TimePicker className={styles.date} />
                ) : (
                  <Button href="https://zoom.us/oauth/authorize?response_type=code&client_id=spqBcTkS4egeysQDEQuBg&redirect_uri=http://localhost:3000/meeting">
                    Connect Zoom
                  </Button>
                )}
              </Form.Item>
            </Col>
          </Row>
        );
      })}
      <Form.Item>
        <div className={styles.layout}>
          <div>
            {editMode && (
              <Button
                type="dashed"
                htmlType="button"
                className={styles["button-delete"]}
                on
                onClick={() => {
                  onDelete();
                }}
              >
                Delete
              </Button>
            )}
          </div>
          <div>
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
          </div>
        </div>
      </Form.Item>
    </Form>
  );
};

export default CalenderForm;
