import { message } from "antd";
import { MESSAGE } from "../../constants/constants";
import { getIssueDetail, getIssueList, getNumberIssueComplete, getNumberIssueNotComplete } from "../../api/issue-api";
import { getCompleteIssueReducer, getIssueDetailReducer, getListIssueReducer, getUnCompleteIssueReducer } from "../reducer/issue-reducer";

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

export const getCompleteIssueAction = (sprintId) => {
  return async (dispatch) => {
    await getNumberIssueComplete(sprintId)
      .then((response) => {
        dispatch(getCompleteIssueReducer(response));
      })
      .catch((err) => {
        message.error(MESSAGE.GET_DATA_FAIL);
      })
      .finally(() => {});
  };
};

export const getUnCompleteIssueAction = (sprintId) => {
  return async (dispatch) => {
    await getNumberIssueNotComplete(sprintId)
      .then((response) => {
        dispatch(getUnCompleteIssueReducer(response));
      })
      .catch((err) => {
        message.error(MESSAGE.GET_DATA_FAIL);
      })
      .finally(() => {});
  };
};
