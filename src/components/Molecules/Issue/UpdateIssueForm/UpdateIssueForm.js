import { useEffect, useRef, useState } from "react";
import {
  Button,
  Form,
  Input,
  DatePicker,
  Row,
  Col,
  Select,
  Table,
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
  FlagOutlined,
  PlusSquareOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import icon from "../../../../assets/anh.jpg";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getDropdownStatusListAction } from "../../../../redux/action/status-action";
import { getDropdownSprintListAction } from "../../../../redux/action/sprint-action";
import CreateButton from "../../../Atoms/Buttons/CreateButton";
import NewSubIssue from "../../../Organisms/SubIssue/NewSubIssue/NewSubIssue";
import UpdateSubIssue from "../../../Organisms/SubIssue/UpdateSubIssue/UpdateSubIssue";
import DeleteSubIssue from "../../../Organisms/SubIssue/DeleteSubIssue/DeleteSubIssue";
import NewCommentForm from "../../Comment/NewCommentForm/NewCommentForm";
import UpdateComment from "../../../Organisms/Comment/UpdateComment/UpdateComment";
import DeleteComment from "../../../Organisms/Comment/DeleteComment/DeleteComment";
import { getUserProjectListAction } from "../../../../redux/action/user-action";
import { deleteAttachment } from "../../../../api/attachment-api";
import { MESSAGE } from "../../../../constants/constants";
const { TextArea } = Input;

const UpdateIssueForm = ({
  onSubmit,
  onCancel,
  editMode,
  issueDetail,
  setChangedFieldName,
  userDetail,
}) => {
  const { sprintId, projectId } = useParams();
  const dispatch = useDispatch();
  const refAddModal = useRef(null);
  const refEditModal = useRef(null);
  const refDeleteModal = useRef(null);
  const refEditModalComment = useRef(null);
  const refDeleteModalComment = useRef(null);
  const [form] = Form.useForm();
  const [subIssueId, setSubIssueId] = useState(null);
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
        if (updatedRenderAttachment.length > 5) {
          updatedRenderAttachment.shift(); // Xóa tệp tin đầu tiên nếu vượt quá giới hạn
        }
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
  const dropdownSprintList = useSelector(
    (state) => state.sprintReducer.dropdownSprintList
  );
  const userProjectList = useSelector(
    (state) => state.userReducer.userProjectList
  );
  const renderStatus = dropdownStatusList.map((data) => ({
    value: data.id,
    label: data.name,
  }));
  const renderSprint = dropdownSprintList.map((data) => ({
    value: data.id,
    label: data.name,
  }));
  const renderUserProject = userProjectList.map((data) => ({
    value: data.id,
    label: data.email,
  }));
  const renderSubIssues = issueDetail?.subIssues?.map((data) => {
    return data;
  });
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

  const handleOpenEditModal = (subIssueId) => {
    setSubIssueId(subIssueId);
    refEditModal.current.openModalHandle();
  };

  const handleOpenDeleteModal = (subIssueId) => {
    setSubIssueId(subIssueId);
    refDeleteModal.current.openModalHandle();
  };

  const handleOpenEditModalComment = (commentId) => {
    setCommentId(commentId);
    refEditModalComment.current.openModalHandle();
  };

  const handleOpenDeleteModalComment = (commentId) => {
    setCommentId(commentId);
    refDeleteModalComment.current.openModalHandle();
  };

  const defaultColumns = [
    {
      title: "Name",
      dataIndex: "name",
      width: "300px",
      align: "center",
      render: (_, record) => {
        return (
          <Button type="text" onClick={() => handleOpenEditModal(record.id)}>
            {record.name}
          </Button>
        );
      },
    },
    {
      title: "Point",
      dataIndex: "storyPoint",
      width: "70px",
      align: "center",
    },
    {
      title: "Type",
      dataIndex: "type",
      width: "70px",
      align: "center",
      render: (_, record) => {
        return (
          <div>
            {record.type === 1 ? (
              <PlusSquareOutlined style={{ color: "green" }} />
            ) : (
              <CloseCircleOutlined style={{ color: "red" }} />
            )}
          </div>
        );
      },
    },
    {
      title: "Priority",
      dataIndex: "priority",
      width: "80px",
      align: "center",
      render: (_, record) => {
        return (
          <div>
            {record.priority === 1 ? (
              <FlagOutlined style={{ color: "red" }} />
            ) : record.priority === 2 ? (
              <FlagOutlined style={{ color: "yellow" }} />
            ) : record.priority === 3 ? (
              <FlagOutlined style={{ color: "blue" }} />
            ) : (
              <FlagOutlined style={{ color: "grey" }} />
            )}
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      width: "105px",
      align: "center",
      render: (_, record) => {
        return (
          <div className={styles.status}>
            {record?.status?.name === null ? "" : record?.status?.name}
          </div>
        );
      },
    },
    {
      title: "Assignee",
      dataIndex: "user",
      width: "100px",
      align: "center",
      render: (_, record) => {
        return record?.user === null ? (
          ""
        ) : (
          <Image
            src={record?.user.image}
            alt="icon"
            className={styles.avatar}
          />
        );
      },
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      width: "105px",
      align: "center",
      render: (_, record) => {
        return (
          <div>
            {record.startDate === null
              ? ""
              : dayjs(record.startDate).format("YYYY-MM-DD")}
          </div>
        );
      },
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      width: "105px",
      align: "center",
      render: (_, record) => {
        return (
          <div>
            {record.dueDate === null
              ? ""
              : dayjs(record.dueDate).format("YYYY-MM-DD")}
          </div>
        );
      },
    },
    {
      title: "AC",
      dataIndex: "",
      align: "center",
      width: "60px",
      render: (_, record) => {
        return (
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => handleOpenDeleteModal(record.id)}
          ></Button>
        );
      },
    },
  ];

  useEffect(() => {
    if (isFormEdited) {
      form.submit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFormEdited]);

  useEffect(() => {
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
          value: issueDetail?.status?.id,
          label: issueDetail?.status?.name,
        },
        {
          name: "userId",
          value: issueDetail.user?.id,
          label: issueDetail?.user?.name,
        },
        {
          name: "sprintId",
          value: issueDetail.sprint?.id,
          label: issueDetail?.sprint?.name,
        },
        {
          name: "startDate",
          value:
            issueDetail.startDate === null ? "" : dayjs(issueDetail.startDate),
        },
        {
          name: "dueDate",
          value: issueDetail.dueDate === null ? "" : dayjs(issueDetail.dueDate),
        },
        {
          name: "description",
          value:
            issueDetail.description === null ? "" : issueDetail.description,
        },
        {
          name: "attachments",
          value:
            issueDetail.attachments === null ? [] : issueDetail.attachments,
        },
      ]);
    }
    const updatedRenderAttachment = issueDetail?.attachments?.map((data) => {
      return data;
    });
    setRenderAttachment(updatedRenderAttachment);
    dispatch(getDropdownStatusListAction(`${sprintId}`));
    dispatch(getDropdownSprintListAction(`${projectId}`));
    dispatch(getUserProjectListAction(`${projectId}`));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editMode, form, issueDetail, sprintId, projectId]);

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
                              : form.name === "sprintId"
                              ? renderSprint
                              : renderUserProject
                          }
                          labelInValue
                          allowClear={form.name === "userId" ? true : false}
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
        <div className={styles.button}>
          <div>Child Issues:</div>
          <CreateButton
            content="Create New Child Issue"
            color="#155E75"
            action={() => refAddModal?.current?.openModalHandle()}
          />
        </div>
        <Table
          columns={defaultColumns}
          dataSource={renderSubIssues}
          pagination={false}
          scroll={{ x: 800, y: 190 }}
          rowKey={(record) => record?.id}
          className={styles.table}
          bordered
        />
        <div className={styles.comment}>
          <div className={styles["image-comment"]}>
            <img src={userDetail.image} alt="icon" className={styles.avatar} />
            <NewCommentForm issueDetail={issueDetail} userDetail={userDetail} />
          </div>
          <div className={styles.scroll}>
            {issueDetail?.comments?.map((data, index) => (
              <Card key={index} className={styles.card}>
                <div className={styles["image-button"]}>
                  <div>
                    <img src={icon} alt="icon" className={styles.avatar} />
                  </div>
                  <div className={styles["name-button"]}>
                    <div>Dinh Gia Bao</div>
                    <div>
                      <Button
                        type="text"
                        icon={<FormOutlined />}
                        onClick={() => handleOpenEditModalComment(data.id)}
                      ></Button>
                      <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={() => handleOpenDeleteModalComment(data.id)}
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
      <NewSubIssue
        ref={refAddModal}
        issueDetail={issueDetail}
        userDetail={userDetail}
      />
      <UpdateSubIssue
        ref={refEditModal}
        subIssueId={subIssueId}
        issueDetail={issueDetail}
        userDetail={userDetail}
      />
      <DeleteSubIssue
        ref={refDeleteModal}
        subIssueId={subIssueId}
        issueDetail={issueDetail}
      />
      <UpdateComment
        ref={refEditModalComment}
        commentId={commentId}
        issueDetail={issueDetail}
        userDetail={userDetail}
      />
      <DeleteComment
        ref={refDeleteModalComment}
        commentId={commentId}
        issueDetail={issueDetail}
      />
    </div>
  );
};

export default UpdateIssueForm;