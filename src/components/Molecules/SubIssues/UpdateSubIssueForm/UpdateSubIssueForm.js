import { useEffect, useRef, useState } from "react";
import {
  Button,
  Form,
  Input,
  DatePicker,
  Row,
  Col,
  Select,
  Image,
  Card,
  message,
} from "antd";
import styles from "./styles.module.scss";
import { INFO_FORM, dataSelectOption } from "./UpdateFormField";
import dayjs from "dayjs";
import {
  FormOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import icon from "../../../../assets/anh.jpg";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getDropdownStatusListAction } from "../../../../redux/action/status-action";
import NewCommentForm from "../../Comment/NewCommentForm/NewCommentForm";
import UpdateComment from "../../../Organisms/Comment/UpdateComment/UpdateComment";
import DeleteComment from "../../../Organisms/Comment/DeleteComment/DeleteComment";
import { getUserProjectListAction } from "../../../../redux/action/user-action";
import { deleteAttachment } from "../../../../api/attachment-api";
import { MESSAGE } from "../../../../constants/constants";
const { TextArea } = Input;

const UpdateSubIssueForm = ({ onSubmit, setChangedFieldName, onCancel, editMode, subIssueDetail, userDetail }) => {
  const { sprintId, projectId } = useParams();
  const dispatch = useDispatch();
  const refEditModalComment = useRef(null);
  const refDeleteModalComment = useRef(null);
  const [form] = Form.useForm();
  const [commentId, setCommentId] = useState(null);
  const [isFormEdited, setIsFormEdited] = useState(false);
  const [imageSelected, setImageSelected] = useState(false);
  const [start, setStart] = useState(true);
  const [renderAttachment, setRenderAttachment] = useState([]);
  const handleChange = ({ target }) => {
    const files = target.files;
    const updatedRenderAttachment = [...renderAttachment]; // Tạo một bản sao của mảng renderAttachment
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileId = renderAttachment.length + i + 1; // Tạo một ID duy nhất cho từng tệp tin
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result; // Dữ liệu Base64 của tệp tin
        const newAttachment = {
          id: fileId,
          fileName: base64Data,
          name: file.name,
        };
        updatedRenderAttachment.push(newAttachment); // Thêm tệp tin mới vào mảng

        // Tối đa hiển thị 5 tệp tin trên giao diện
        // if (updatedRenderAttachment.length > 5) {
        //   updatedRenderAttachment.shift(); // Xóa tệp tin đầu tiên nếu vượt quá giới hạn
        // }
        setRenderAttachment(updatedRenderAttachment);
        setImageSelected(true);
      };
      reader.readAsDataURL(file); // Đọc tệp tin và chuyển đổi thành Base64
    }
  };

  const handleFormChange = (name) => {
    setChangedFieldName(name);
  };
  
  const handleFormBlur = () => {
    if (start) {
      setIsFormEdited(true);
    }
  };

  const handleFormBlurImage = () => {
    if (imageSelected && start === false) {
      setIsFormEdited(true);
      setImageSelected(false);
      setStart(true);
    }
  }

  const dropdownStatusList = useSelector(
    (state) => state.statusReducer.dropdownStatusList
  );
  const userProjectList = useSelector(
    (state) => state.userReducer.userProjectList
  );
  const renderStatus = dropdownStatusList.map((data) => ({
    value: data.id,
    label: data.name,
  }));
  const renderUserProject = userProjectList.map((data) => ({
    value: data.id,
    label: data.email,
  }));
  
  const onFinish = (values) => {
    const data = {
      ...values,
      statusId: values.statusId,
      sprintId: values.sprintId,
      userId: values.userId,
      files: renderAttachment.map((attachment) => attachment),
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
    const check = /[^0-9]+/;
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

  const handleDelete = (id) => {
    deleteAttachment(id).then((res) => {
      message.success(MESSAGE.DELETE_ATTACHMENT_SUCCESS);
    })
    .catch((error) => {
      if (error.response.status === 400) {
        if (error.response.data === "Attachment Does Not Exist") {
          message.error(MESSAGE.ATTACHMENT_NOT_EXIST);
        }
      }
    });
    const updatedRenderAttachment = renderAttachment.filter(
      (data) => data.id !== id
    );
    setRenderAttachment(updatedRenderAttachment);
  };

  const handleOpenEditModalComment = (commentId) => {
    setCommentId(commentId);
    refEditModalComment.current.openModalHandle();
  };

  const handleOpenDeleteModalComment = (commentId) => {
    setCommentId(commentId);
    refDeleteModalComment.current.openModalHandle();
  };

  useEffect(() => {
    if (isFormEdited) {
      form.submit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFormEdited]);

  useEffect(() => {
    if (editMode && subIssueDetail) {
      form.setFields([
        {
          name: "name",
          value: subIssueDetail.name,
        },
        {
          name: "type",
          value: subIssueDetail.type,
        },
        {
          name: "priority",
          value: subIssueDetail.priority,
        },
        {
          name: "storyPoint",
          value: subIssueDetail.storyPoint,
        },
        {
          name: "statusId",
          value: subIssueDetail?.status?.id,
          label: subIssueDetail?.status?.name,
        },
        {
          name: "userId",
          value: subIssueDetail.user?.id,
          label: subIssueDetail?.user?.name,
        },
        {
          name: "startDate",
          value:
          subIssueDetail.startDate === null ? "" : dayjs(subIssueDetail.startDate),
        },
        {
          name: "dueDate",
          value: subIssueDetail.dueDate === null ? "" : dayjs(subIssueDetail.dueDate),
        },
        {
          name: "description",
          value: subIssueDetail.description === null ? "" : subIssueDetail.description,
        },
        {
          name: "attachments",
          value:
          subIssueDetail.attachments === null ? [] : subIssueDetail.attachments,
        },
      ]);
    }
    const updatedRenderAttachment = subIssueDetail?.attachments?.map((data) => {
      return data;
    });
    setRenderAttachment(updatedRenderAttachment);
    dispatch(getDropdownStatusListAction(`${sprintId}`));
    dispatch(getUserProjectListAction(`${projectId}`));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editMode, form, subIssueDetail, sprintId, projectId]);

  return (
    <div className={styles.layout}>
      <Form
        name="basic"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        autoComplete="off"
        form={form}
        onFieldsChange={handleFormChange}
        onBlur={()=>{
          if (imageSelected) {
            handleFormBlurImage() 
          } else {
            handleFormBlur()
          }
        }}
      >
        {INFO_FORM.map((forms) => {
          return (
            <Row key={forms.id}>
              {forms?.children?.map((form) => {
                return (
                  <Col key={form.id} span={forms.children.length > 1 ? 12 : 24}>
                    <Form.Item
                      name={form.name}
                      label={form.label}
                      labelCol={{
                        span: forms.children.length > 1 ? 8 : 4,
                      }}
                      wrapperCol={{
                        span: forms.children.length > 1 ? 16 : 20,
                      }}
                      rules={[
                        {
                          required: form.require,
                          message: form.error,
                        },
                        {
                          validator:
                            form.name === "name"
                              ? validateName
                              : form.name === "startDate" ||
                                form.name === "dueDate"
                              ? validateEndDate
                              : form.name === "storyPoint"
                              ? validateStoryPoint
                              : ignore,
                        },
                      ]}
                      labelWrap={true}
                      className={styles["form-item"]}
                      validateTrigger="onBlur"
                    >
                      {form.type === "input" ? (
                        <Input />
                      ) : form.type === "textArea" ? (
                        <TextArea />
                      ) : form.type === "select" ? (
                        <Select
                          options={
                            form.name === "type" || form.name === "priority"
                              ? dataSelectOption(form.name)
                              : form.name === "statusId"
                              ? renderStatus
                              : renderUserProject
                          }
                          labelInValue
                          allowClear={form.name === "userId" || form.name === "statusId" ? true : false}
                        />
                      ) : form.type === "files" ? (
                        <div className={styles["file-list-container"]}>
                          <input
                            type="file"
                            accept="image/png, image/jpg, image/jpeg"
                            multiple
                            onChange={handleChange}
                            onClick={()=>{
                              setStart(false)
                            }}
                          />
                          {renderAttachment?.map((data) => (
                            <div key={data.id} className={styles.file}>
                              <Image src={data.fileName} />
                              <button
                                className={styles.deleteButton}
                                onClick={() => handleDelete(data.id)}
                              >
                                Delete
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <DatePicker format={"YYYY-MMMM-DD"} />
                      )}
                    </Form.Item>
                  </Col>
                );
              })}
            </Row>
          );
        })}
      </Form>
      <div className={styles["table-comment"]}>
        <div className={styles.comment}>
          <div className={styles["image-comment"]}>
            <img src={userDetail.image} alt="icon" className={styles.avatar} />
            <NewCommentForm subIssueDetail={subIssueDetail} userDetail={userDetail} isSubIssue={true}/>
          </div>
          <div className={styles.scroll}>
            {subIssueDetail?.comments?.map((data, index) => (
              <Card key={index} className={styles.card}>
                <div className={styles["image-button"]}>
                  <div>
                    <Image src={data?.user?.image} alt="icon" className={styles.avatar} />
                  </div>
                  <div className={styles["name-button"]}>
                    <div>{data?.user?.email}</div>
                    <div>
                      <Button
                        type="text"
                        icon={<FormOutlined />}
                        onClick={() => handleOpenEditModalComment(data.id)}
                        disabled={data?.user?.email === userDetail.email ? false : true }
                      ></Button>
                      <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={() => handleOpenDeleteModalComment(data.id)}
                        disabled={data?.user?.email === userDetail.email ? false : true }
                      ></Button>
                    </div>
                  </div>
                </div>
                <div style={{ marginLeft: "40px" }}>
                  <p className={styles.content}>{data.content}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <UpdateComment
        ref={refEditModalComment}
        commentId={commentId}
        subIssueDetail={subIssueDetail}
        userDetail={userDetail}
        isSubIssue={true}
      />
      <DeleteComment
        ref={refDeleteModalComment}
        commentId={commentId}
        subIssueDetail={subIssueDetail}
        isSubIssue={true}
      />
    </div>
  );
};

export default UpdateSubIssueForm;
