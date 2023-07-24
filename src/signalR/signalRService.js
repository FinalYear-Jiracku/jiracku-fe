
import { HubConnectionBuilder } from "@microsoft/signalr";
import { ACCESS_TOKEN } from "../constants/constants";

let connection = null;

export const joinRoom = (projectId) => {
  const token = window.localStorage.getItem(ACCESS_TOKEN);
  connection = new HubConnectionBuilder()
    .withUrl("http://localhost:4204/notification", {
      accessTokenFactory: () => token,
    })
    .build();
  
  connection
    .start()
    .then(() => {
      console.log("Connected to SignalR Hub");
      connection
        .invoke("OnConnectedAsync", projectId)
        .then((response) => {
          console.log("Received response:", response);
        })
        .catch((error) => console.error("Error sending request:", error));
    })
    .catch((error) =>
      console.error("Error connecting to SignalR Hub:", error)
    );
};

export const sendMessage = async (projectId, user, message) => {
  if (!connection) {
    console.error("Connection not established. Call joinRoom() first.");
    return;
  }
  try {
    await connection.invoke("SendMessage", projectId, user, message);
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

export const receiveMessage = () => {
  if (!connection) {
    console.error("Connection not established. Call joinRoom() first.");
    return;
  }
  connection.on("ReceiveMessage", (message) => {
    console.log("Received message:", message);
  });
};