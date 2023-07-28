import { message } from "antd";
import { MESSAGE } from "../../constants/constants";
import { getDataStatusListReducer, getDropdownListStatusReducer } from "../reducer/status-reducer";
import { dropdownStatusList, getDataStatusList } from "../../api/status-api";

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

export const getDataStatusListAction = ({ sprintId, searchKey, Priority, UserId, StatusId, Type }) => {
  return async (dispatch) => {
      await getDataStatusList(
        `statuses/data/sprints/${sprintId}?search=${searchKey || ""}`
      )
        .then((response) => {
          dispatch(getDataStatusListReducer(response));
        })
        .catch((err) => {
          message.error(MESSAGE.GET_DATA_FAIL);
          window.location.href = '/login';
        })
        .finally(() => {});
  };
};
