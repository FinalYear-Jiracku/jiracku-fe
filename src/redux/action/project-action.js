import { message } from "antd";
import { getProjectDetail, getProjectList } from "../../api/project-api";
import { MESSAGE } from "../../constants/constants";
import {
  getProjectDetailReducer,
  getProjectListReducer,
} from "../reducer/project-reducer";

export const getProjectListAction = ({ currentPage, searchKey }) => {
  return async (dispatch) => {
    await getProjectList(
      `projects?pageNumber=${currentPage || 1}&search=${
        searchKey || ""
      }&pageSize=8`
    )
      .then((response) => {
        dispatch(getProjectListReducer(response));
      })
      .catch((err) => {
        message.error(MESSAGE.GET_DATA_FAIL);
      })
      .finally(() => {});
  };
};

export const getProjectDetailAction = (projectId) => {
  return async (dispatch) => {
    await getProjectDetail(projectId)
      .then((response) => {
        dispatch(getProjectDetailReducer(response));
      })
      .catch((err) => {
        message.error(MESSAGE.GET_DATA_FAIL);
      })
      .finally(() => {});
  };
};
