import { message } from "antd";
import { MESSAGE } from "../../constants/constants";
import { getCommentDetail } from "../../api/comment-api";
import { getCommentDetailReducer } from "../reducer/comment-reducer";

export const getCommentDetailAction = (commentId) => {
  return async (dispatch) => {
    await getCommentDetail(commentId)
      .then((response) => {
        dispatch(getCommentDetailReducer(response));
      })
      .catch((err) => {
        message.error(MESSAGE.GET_DATA_FAIL);
      })
      .finally(() => {});
  };
};
