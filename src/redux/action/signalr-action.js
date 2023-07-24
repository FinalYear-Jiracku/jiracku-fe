import { ACCESS_TOKEN } from "../../constants/constants";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { message } from "antd";
import { MESSAGE } from "../../constants/constants";

const joinRoomSuccess = (connection) => ({
  type: "JOIN_ROOM_SUCCESS",
  payload: connection,
});

const joinRoomFailure = () => ({
  type: "JOIN_ROOM_FAILURE",
});

const sendMessageSuccess = (connection) => ({
  type: "SEND_MESSAGE_SUCCESS",
  payload: connection,
});

const sendMessageFailure = () => ({
  type: "SEND_MESSAGE_FAILURE",
});

export const joinRoom = (projectId) => {
  return async (dispatch) => {
    const token = window.localStorage.getItem(ACCESS_TOKEN);
    const connection = new HubConnectionBuilder()
      .withUrl("http://localhost:4204/notification", {
        accessTokenFactory: () => token,
      })
      .build();

    try {
      await connection.start();
      console.log("Connected to SignalR Hub");

      const response = await connection.invoke("OnConnectedAsync", projectId);
      console.log("Received response:", response);

      dispatch(joinRoomSuccess(connection));
    } catch (error) {
      console.error("Error connecting to SignalR Hub:", error);
      dispatch(joinRoomFailure());
      message.error(MESSAGE.GET_DATA_FAIL);
    }
  };
};

export const sendMessage = (projectId, message) => {
  return async (dispatch, getState) => {
    const { connection } = getState().signalR;

    if (!connection) {
      console.error("Connection not established. Call joinRoom() first.");
      return;
    }

    try {
      await connection.invoke("SendMessage", projectId, message);
      dispatch(sendMessageSuccess(connection));
    } catch (error) {
      console.error("Error sending message:", error);
      dispatch(sendMessageFailure());
    }
  };
};