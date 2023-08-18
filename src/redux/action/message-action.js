import { message } from "antd";
import { MESSAGE } from "../../constants/constants";
import { getListMessage, getMessageDetail } from "../../api/message-api";
import { getMessageDetailReducer, getMessageListReducer } from "../reducer/message-reducer";

export const getMessageListAction = (projectId) => {
    return async (dispatch) => {
      await getListMessage(`messages/${projectId}`)
        .then((response) => {
          dispatch(getMessageListReducer(response));
        })
        .catch((err) => {
          message.error(MESSAGE.GET_DATA_FAIL);
        })
        .finally(() => {});
    };
  };

  export const getMessageDetailAction = (messageId) => {
    return async (dispatch) => {
      await getMessageDetail(messageId)
        .then((response) => {
          dispatch(getMessageDetailReducer(response));
        })
        .catch((err) => {
          message.error(MESSAGE.GET_DATA_FAIL);
        })
        .finally(() => {});
    };
  }