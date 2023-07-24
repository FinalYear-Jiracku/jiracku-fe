import { message } from "antd";
import { MESSAGE } from "../../constants/constants";
import { getIssueDetail, getIssueList } from "../../api/issue-api";
import { getIssueDetailReducer, getListIssueReducer } from "../reducer/issue-reducer";

export const getIssueListAction = ({ sprintId, currentPage, searchKey }) => {
  return async (dispatch) => {
    await getIssueList(
      `issues/sprints/${sprintId}?pageNumber=${currentPage || 1}&search=${
        searchKey || ""
      }&pageSize=8`
    )
      .then((response) => {
        dispatch(getListIssueReducer(response));
      })
      .catch((err) => {
        message.error(MESSAGE.GET_DATA_FAIL);
      })
      .finally(() => {});
  };
};

export const getIssueDetailAction = (issueId) => {
  return async (dispatch) => {
    await getIssueDetail(issueId)
      .then((response) => {
        dispatch(getIssueDetailReducer(response));
      })
      .catch((err) => {
        message.error(MESSAGE.GET_DATA_FAIL);
      })
      .finally(() => {});
  };
};
