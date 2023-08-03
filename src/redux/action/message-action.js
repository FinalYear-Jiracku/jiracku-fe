import { message } from "antd";
import { MESSAGE } from "../../constants/constants";
import { getListMessage } from "../../api/message-api";
import { getMessageListReducer } from "../reducer/message-reducer";

export const getMessageListAction = (projectId) => {
    return async (dispatch) => {
      await getListMessage(`${projectId}`)
        .then((response) => {
          dispatch(getMessageListReducer(response));
        })
        .catch((err) => {
          message.error(MESSAGE.GET_DATA_FAIL);
        })
        .finally(() => {});
    };
  };