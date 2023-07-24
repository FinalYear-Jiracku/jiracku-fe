

import { joinRoom, receiveMessage, sendMessage } from "../../signalR/signalRService";
import { setConnected } from "../reducer/signalR-reducer";

// export const connectToProject = (projectId) => {
//   return async (dispatch) => {
//     await joinRoom(projectId)
//       .then((response) => {
//         dispatch(setConnected(response));
//       })
//       .catch((error) => {
//         console.error("Error connecting to SignalR Hub:", error);
//       });
//   };
// };

export const connectToProject = (projectId) => async (dispatch) => {
  try {
    joinRoom(projectId);
    dispatch(setConnected(true));
  } catch (error) {
    console.error("Error connecting to SignalR Hub:", error);
  }
};

// export const sendProjectMessage  = (projectId, user, message) => {
//   return async (dispatch,getState) => {
//     const { connection } = getState().signalRReducer;
//     if (!connection) {
//       console.error("Connection not established. Call joinRoom() first.");
//       return;
//     }
//     try {
//       await sendMessage(projectId, user, message);
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };
// };

export const sendProjectMessage = (projectId, user, message) => async (dispatch) => {
  try {
    await sendMessage(projectId, user, message);
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

export const startListeningForMessages = () => async (dispatch) => {
  
  receiveMessage((message) => {
    // Thực hiện các xử lý cần thiết với tin nhắn nhận được, ví dụ như cập nhật trạng thái trong Redux store hoặc hiển thị thông báo
    console.log("Received message:", message);
    // Gọi một action để cập nhật trạng thái tin nhắn trong Redux store (nếu cần)
    // dispatch(updateMessageState(message));
  });
};
