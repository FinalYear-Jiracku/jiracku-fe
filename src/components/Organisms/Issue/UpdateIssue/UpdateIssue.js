import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { Modal, message } from "antd";
import styles from "./styles.module.scss";
import { MESSAGE } from "../../../../constants/constants";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getIssueDetailAction } from "../../../../redux/action/issue-action";
import { updateIssue } from "../../../../api/issue-api";
import UpdateIssueForm from "../../../Molecules/Issue/UpdateIssueForm/UpdateIssueForm";
import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { firebaseConfig } from "../../../../configs/firebaseConfig";

const firebase = initializeApp(firebaseConfig);
const storage = getStorage(firebase);
const getFileFromFirebase = async (fileUrl) => {
  const fileRef = ref(storage, fileUrl);
  try {
    const fileSnapshot = await getDownloadURL(fileRef);
    const response = await fetch(fileSnapshot);
    const blob = await response.blob();

    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error retrieving file from Firebase:", error);
    return null;
  }
};

const UpdateIssue = forwardRef((props, ref) => {
  const { projectId, sprintId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const issueDetail = useSelector((state) => state.issueReducer.issueDetail);

  const openModalHandle = () => {
    setOpenModal(true);
  };

  const closeModalHandle = () => {
    setOpenModal(false);
  };

  const handleCancel = () => {
    setOpenModal(false);
  };

  useImperativeHandle(ref, () => {
    return {
      openModalHandle,
      closeModalHandle,
    };
  });

  const getFileNameFromFirebaseLink = (url) => {
    const urlObject = new URL(url);
    const path = decodeURIComponent(urlObject.pathname); // Giải mã phần path chứa tên tệp
    const fileName = path.split("/").pop(); // Lấy phần tử cuối cùng sau khi tách các phần bằng '/'
    return fileName;
  };

  const convertToFormFile = async (file) => {
    if (
      typeof file === "object" &&
      file.fileName &&
      file?.fileName?.startsWith("https://firebasestorage.googleapis.com")
    ) {
      const response = await getFileFromFirebase(file.fileName);
      const fileName = getFileNameFromFirebaseLink(file.fileName);
      const base64Data = response.split(",")[1];
      const decodedData = window.atob(base64Data);
      const byteCharacters = Array.from(decodedData).map((char) =>
        char.charCodeAt(0)
      );
      const byteArray = new Uint8Array(byteCharacters);
      const blob = new Blob([byteArray], { type: "image/jpeg" });
      const fileLink = new File([blob], fileName);
      return fileLink;
    } else {
      const base64Data = file?.fileName.replace(
        /^data:image\/(png|jpeg|jpg);base64,/,
        ""
      );
      const byteCharacters = atob(base64Data);
      const byteArrays = [];
      for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
        const slice = byteCharacters.slice(offset, offset + 1024);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      const blob = new Blob(byteArrays, { type: "image/jpeg" });
      const formFile = new File([blob], file.name, { type: "image/jpeg" });
      return formFile;
    }
  };

  const onSubmitForm = async (item) => {
    messageApi.open({
      type: "loading",
      content: "Action In Progress",
      duration: 5000,
    });
    const filePromises = item?.files?.map(async (file) => {
      return await convertToFormFile(file);
    });
    const files = await Promise.all(filePromises);
    const formData = new FormData();
    formData.append("id", props.issueId === undefined ? "" : props.issueId);
    formData.append("name", item.name === undefined ? "" : item.name);
    formData.append(
      "description",
      item.description === undefined ? "" : item.description
    );
    formData.append("type", Number(item.type) === 0 ? null : Number(item.type));
    formData.append(
      "priority",
      Number(item.priority) === 0 ? null : Number(item.priority)
    );
    formData.append(
      "storyPoint",
      item.storyPoint === undefined ? null : item.storyPoint
    );
    formData.append(
      "startDate",
      item.startDate === undefined ? "" : item.startDate
    );
    formData.append("dueDate", item.dueDate === undefined ? "" : item.dueDate);
    formData.append(
      "statusId",
      Number(item.statusId) === 0 ? null : Number(item.statusId)
    );
    formData.append(
      "sprintId",
      Number(item.sprintId) === 0 ? null : Number(item.sprintId)
    );
    formData.append(
      "userId",
      item.userId === undefined ? 0 : Number(item.userId)
    );
    formData.append(
      "updatedBy",
      `${props.userDetail.email === null ? "" : props.userDetail.email}`
    );
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i], files[i].name);
    }

    await updateIssue(formData)
      .then((res) => {
        message.success(MESSAGE.UPDATE_ISSUE_SUCCESS);
        setOpenModal(false);
        navigate(`/projects/${projectId}/${sprintId}`);
      })
      .catch((error) => {
        if (error.response.status === 500) {
          if (error.response.data === "Internal Server Error") {
            message.error(MESSAGE.CREATE_FAIL);
          }
        }
      });
  };

  useEffect(() => {
    if (props.issueId && openModal) {
      dispatch(getIssueDetailAction(props.issueId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openModal, props.issueId]);
  return (
    <Modal
      title="Edit Issue"
      open={openModal}
      onCancel={handleCancel}
      centered
      footer={null}
      destroyOnClose={true}
      className={styles.modal}
    >
      {contextHolder}
      <UpdateIssueForm
        editMode={true}
        onCancel={closeModalHandle}
        onSubmit={onSubmitForm}
        issueDetail={issueDetail}
        userDetail={props.userDetail}
      />
    </Modal>
  );
});

export default UpdateIssue;
