import { message } from "antd";
import { MESSAGE } from "../../constants/constants";
import { getDropdownListStatusReducer } from "../reducer/status-reducer";
import { dropdownStatusList } from "../../api/status-api";

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
