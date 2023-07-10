import { message } from "antd";
import { MESSAGE } from "../../constants/constants";
import { getUserDetailReducer } from "../reducer/user-reducer";
import { getProfile } from "../../api/user-api";

export const getUserDetailAction = () => {
  return async (dispatch) => {
    await getProfile("users/me")
      .then((response) => {
        dispatch(getUserDetailReducer(response));
      })
      .catch((err) => {
        message.error(MESSAGE.GET_DATA_FAIL);
      })
      .finally(() => {});
  };
};
