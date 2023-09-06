import { message } from "antd";
import { MESSAGE } from "../../constants/constants";
import { getUserDetailReducer, getUserListReducer, getUserProjectListReducer, getUserStatisReducer, getYearListReducer } from "../reducer/user-reducer";
import { getProfile, getUserList, getUserProject } from "../../api/user-api";

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

export const getUserListAction = ({ currentPage, searchKey }) => {
  return async (dispatch) => {
    await getUserList(
      `users/list?pageNumber=${currentPage || 1}&search=${
        searchKey || ""
      }&pageSize=8`
    )
      .then((response) => {
        dispatch(getUserListReducer(response));
      })
      .catch((err) => {
        message.error(MESSAGE.GET_DATA_FAIL);
      })
      .finally(() => {});
  };
};

export const getUserStatisAction = ({ searchKey }) => {
  return async (dispatch) => {
    await getUserList(`users/statis?year=${ searchKey || 0}`)
      .then((response) => {
        dispatch(getUserStatisReducer(response));
      })
      .catch((err) => {
        message.error(MESSAGE.GET_DATA_FAIL);
      })
      .finally(() => {});
  };
};

export const getYearAction = () => {
  return async (dispatch) => {
    await getUserList(`users/years`)
      .then((response) => {
        dispatch(getYearListReducer(response));
      })
      .catch((err) => {
        message.error(MESSAGE.GET_DATA_FAIL);
      })
      .finally(() => {});
  };
};
