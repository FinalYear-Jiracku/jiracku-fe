import { message } from "antd";
import { MESSAGE } from "../../constants/constants";
import { getSubIssueDetail } from "../../api/subIssue-api";
import { getSubIssueDetailReducer } from "../reducer/subIssue-reducer";

export const getSubIssueDetailAction = (subIssueId) => {
  return async (dispatch) => {
    await getSubIssueDetail(subIssueId)
      .then((response) => {
        dispatch(getSubIssueDetailReducer(response));
      })
      .catch((err) => {
        message.error(MESSAGE.GET_DATA_FAIL);
      })
      .finally(() => {});
  };
};
