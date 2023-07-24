import { message } from "antd";
import { MESSAGE } from "../../constants/constants";
import { getUserDetailReducer, getUserProjectListReducer } from "../reducer/user-reducer";
import { getProfile, getUserProject } from "../../api/user-api";

export const getUserDetailAction = () => {
  return async (dispatch) => {
    await getProfile("users/me")
      .then((response) => {
        dispatch(getUserDetailReducer(response));
      })
      .catch((err) => {
        message.error(MESSAGE.GET_DATA_FAIL);
      })
      .finally(() => {});
  };
};

export const getUserProjectListAction = (projectId) => {
  return async (dispatch) => {
    await getUserProject(`users/projects/${projectId}`)
      .then((response) => {
        dispatch(getUserProjectListReducer(response));
      })
      .catch((err) => {
        message.error(MESSAGE.GET_DATA_FAIL);
      })
      .finally(() => {});
  };
};
