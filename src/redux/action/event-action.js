import { message } from "antd";
import { authZoom, getEventDetail, getEventList } from "../../api/event-api";
import { getEventDetailReducer, getEventListReducer, getZoomTokenReducer } from "../reducer/event-reducer";
import { MESSAGE } from "../../constants/constants";

export const getEventListAction = (projectId) => {
    return async (dispatch) => {
      await getEventList(
        `events/projects/${projectId}`)
        .then((response) => {
          dispatch(getEventListReducer(response));
        })
        .catch((err) => {
          message.error(MESSAGE.GET_DATA_FAIL);
          window.location.href = "/login";
        })
        .finally(() => {});
    };
  };


export const getEventDetailAction = (eventId) => {
    return async (dispatch) => {
      await getEventDetail(eventId)
        .then((response) => {
          dispatch(getEventDetailReducer(response));
        })
        .catch((err) => {
          message.error(MESSAGE.GET_DATA_FAIL);
        })
        .finally(() => {});
    };
};

export const getZoomTokenAction = (code) => {
  return async (dispatch) => {
    await authZoom(
      `events/zoom?code=${code || ""}`
    )
      .then((response) => {
        dispatch(getZoomTokenReducer(response));
      })
      .catch((err) => {
        message.error(MESSAGE.GET_DATA_FAIL);
      })
      .finally(() => {});
  };
};