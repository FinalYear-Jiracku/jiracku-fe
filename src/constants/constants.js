import { toast } from "react-toastify";

const CONFIG_NOTIFICATION = {
  position: "bottom-left",
  autoClose: 1000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

export const errorNotification = (message) => {
  return toast.error(message, CONFIG_NOTIFICATION);
};

export const MESSAGE = {
  AUTHORIZATION: "Don't have permission to access this page",
  GET_DATA_FAIL: "Server is currently down, please reload",
  CREATE_PROJECT_SUCCESS: "Project has been created",
  CREATE_PROJECT_FAIL: "Create Project Fail"
}