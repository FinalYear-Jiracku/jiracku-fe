import { message } from "antd";
import { getListNotification } from "../../api/notification-api";
import { MESSAGE } from "../../constants/constants";
import { getNotificationListReducer } from "../reducer/notification-reducer";

export const getNotificationListAction = (projectId) => {
    return async (dispatch) => {
      await getListNotification(`${projectId}`)
        .then((response) => {
          dispatch(getNotificationListReducer(response));
        })
        .catch((err) => {
          message.error(MESSAGE.GET_DATA_FAIL);
        })
        .finally(() => {});
    };
  };