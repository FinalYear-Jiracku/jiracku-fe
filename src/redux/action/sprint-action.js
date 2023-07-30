import { message } from "antd";
import {
  dropdownSprintList,
  getSprintDetail,
  getSprintList,
  sprintListForComplete,
} from "../../api/sprint-api";
import { MESSAGE } from "../../constants/constants";
import {
  getDropdownListSprintReducer,
  getSprintDetailReducer,
  getSprintListCompleteReducer,
  getSprintListReducer,
} from "../reducer/sprint-reducer";

export const getSprintListAction = ({ projectId, currentPage, searchKey }) => {
  return async (dispatch) => {
    await getSprintList(
      `sprints/data/projects/${projectId}?pageNumber=${
        currentPage || 1
      }&search=${searchKey || ""}&pageSize=8`
    )
      .then((response) => {
        dispatch(getSprintListReducer(response));
      })
      .catch((err) => {
        message.error(MESSAGE.GET_DATA_FAIL);
        window.location.href = "/login";
      })
      .finally(() => {});
  };
};

export const getSprintDetailAction = (sprintId) => {
  return async (dispatch) => {
    await getSprintDetail(sprintId)
      .then((response) => {
        dispatch(getSprintDetailReducer(response));
      })
      .catch((err) => {
        message.error(MESSAGE.GET_DATA_FAIL);
        window.location.href = "/login";
      })
      .finally(() => {});
  };
};

export const getDropdownSprintListAction = (projectId) => {
  return async (dispatch) => {
    await dropdownSprintList(`sprints/projects/${projectId}`)
      .then((response) => {
        dispatch(getDropdownListSprintReducer(response));
      })
      .catch((err) => {
        message.error(MESSAGE.GET_DATA_FAIL);
      })
      .finally(() => {});
  };
};

export const getSprintListCompleteAction = ({ projectId, sprintId }) => {
  return async (dispatch) => {
    await sprintListForComplete(
      `sprints/complete/projects/${projectId}?sprintId=${sprintId}`
    )
      .then((response) => {
        dispatch(getSprintListCompleteReducer(response));
      })
      .catch((err) => {
        message.error(MESSAGE.GET_DATA_FAIL);
      })
      .finally(() => {});
  };
};
