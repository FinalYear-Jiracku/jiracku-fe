import { useEffect, useState } from "react";
import { Button, Form, Input, Row, Col, message } from "antd";
import styles from "./styles.module.scss";
import { INFO_FORM } from "./FormField";
import { updateUser } from "../../../api/user-api";
import { MESSAGE } from "../../../constants/constants";
import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { firebaseConfig } from "../../../configs/firebaseConfig";
import { useDispatch } from "react-redux";
import { getUserDetailAction } from "../../../redux/action/user-action";

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

const UserForm = ({ userDetail }) => {
  const dispatch = useDispatch();
  const [imageUrl, setImageUrl] = useState();
  const [image, setImage] = useState(null);
  const [disabledSave, setDisabledSave] = useState(true);

  const [form] = Form.useForm();
  const tailLayout = {
    wrapperCol: { offset: 10, span: 16 },
  };

  const handleFormChange = () => {
    const hasErrors = form.getFieldsError().some(({ errors }) => errors.length);
    setDisabledSave(hasErrors);
  };

  const validateName = (_, value) => {
    const { name } = form.getFieldsValue(["name"]);
    if (value && name && value.trim().length > 30) {
      return Promise.reject("Name field max length 30 characters");
    }
    return Promise.resolve();
  };

  const validateImage = (_, file) => {
    if (image) {
      const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (image.size > maxSizeInBytes) {
        return Promise.reject(
          "The image size exceeds the maximum allowed size of 10MB."
        );
      }
      if (!allowedTypes.includes(image.type)) {
        return Promise.reject(
          "Only PNG, JPG, and JPEG image types are allowed."
        );
      }
    }
    return Promise.resolve();
  };

  const ignore = () => {
    return Promise.resolve();
  };

  const getFileNameFromFirebaseLink = (url) => {
    const urlObject = new URL(url);
    const path = decodeURIComponent(urlObject.pathname); // Giải mã phần path chứa tên tệp
    const fileName = path.split("/").pop(); // Lấy phần tử cuối cùng sau khi tách các phần bằng '/'
    return fileName;
  };

  const convertToFormFile = async (file) => {
    if (file?.startsWith("https://firebasestorage.googleapis.com")) {
      const response = await getFileFromFirebase(file);
      const fileName = getFileNameFromFirebaseLink(file);
      const base64Data = response.split(",")[1];
      const decodedData = window.atob(base64Data);
      const byteCharacters = Array.from(decodedData).map((char) =>
        char.charCodeAt(0)
      );
      const byteArray = new Uint8Array(byteCharacters);
      const blob = new Blob([byteArray], { type: ["image/png", "image/jpeg", "image/jpg"] });
      const fileLink = new File([blob], fileName);
      return fileLink;
    }
  };
  const onFinish = async (item) => {
    const file = await convertToFormFile(item.image);
    
    const formData = new FormData();
    formData.append("id", userDetail.id === null ? "" : userDetail.id);
    formData.append("name", item.name === null ? "" : item.name);
    
    if (image === null) {
      formData.append("image", file, file.name);
    } else {
      formData.append("image", image, image.name);
    }
    await updateUser(formData)
      .then((res) => {
        message.success(MESSAGE.UPDATE_USER_SUCCESS);
        dispatch(getUserDetailAction());
      })
      .catch((error) => {
        message.error(MESSAGE.UPDATE_FAIL);
      });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      const imageURL = URL.createObjectURL(file);
      setImageUrl(imageURL);
    }
  };

  useEffect(() => {
    if (userDetail) {
      setImageUrl(userDetail.image);
      form.setFields([
        {
          name: "image",
          value: userDetail?.image,
        },
        {
          name: "email",
          value: userDetail?.email,
        },
        {
          name: "name",
          value: userDetail?.name,
        },
      ]);
    }
  }, [form, userDetail]);

  return (
    <>
      <Form
        name="basic"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        autoComplete="off"
        form={form}
        onFieldsChange={handleFormChange}
      >
        {INFO_FORM.map((form) => {
          return (
            <Form.Item
              key={form.id}
              shouldUpdate
              label={form.label}
              name={form.name}
              rules={[
                {
                  required: form.require,
                  message: form.error,
                },
                {
                  validator: form.name === "name" ? validateName : ignore,
                },
                {
                  validator: form.type === "image" ? validateImage : ignore,
                },
              ]}
              validateTrigger="onBlur"
              
            >
                {form.type === "image" ? (
                  <div>
                    <img
                      src={imageUrl}
                      alt="avatar"
                      className={styles["avatar-image"]}
                    />
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={handleImageChange}
                    />
                  </div>
                ) : (
                  <Input disabled={form.name === "email"} />
                )}
            </Form.Item>
          );
        })}
        <Form.Item {...tailLayout}>
          <Button
            className={styles["button-submit"]}
            type="primary"
            htmlType="submit"
            disabled={disabledSave}
          >
            Save
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default UserForm;
