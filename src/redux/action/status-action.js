import { message } from "antd";
import { MESSAGE } from "../../constants/constants";
import {
  getDataStatusListReducer,
  getDropdownListStatusReducer,
  getStatusDetailReducer,
} from "../reducer/status-reducer";
import {
  dropdownStatusList,
  getDataStatusList,
  getStatusDetail,
} from "../../api/status-api";

export const getDropdownStatusListAction = (sprintId) => {
  return async (dispatch) => {
    await dropdownStatusList(`statuses/sprints/${sprintId}`)
      .then((response) => {
        dispatch(getDropdownListStatusReducer(response));
      })
      .catch((err) => {
        message.error(MESSAGE.GET_DATA_FAIL);
      })
      .finally(() => {});
  };
};

export const getDataStatusListAction = ({
  sprintId,
  searchKey,
  type,
  priority,
  status,
  user,
}) => {
  return async (dispatch) => {
    await getDataStatusList(
      `statuses/data/sprints/${sprintId}?search=${searchKey || ""}&type=${
        type || ""
      }&priority=${priority || ""}&statusId=${status || ""}&userId=${
        user || ""
      }`
    )
      .then((response) => {
        dispatch(getDataStatusListReducer(response));
      })
      .catch((err) => {
        message.error(MESSAGE.GET_DATA_FAIL);
      })
      .finally(() => {});
  };
};

export const getStatusDetailAction = (statusId) => {
  return async (dispatch) => {
    await getStatusDetail(statusId)
      .then((response) => {
        dispatch(getStatusDetailReducer(response));
      })
      .catch((err) => {
        message.error(MESSAGE.GET_DATA_FAIL);
      })
      .finally(() => {});
  };
};
