import React, { createContext, useState, useEffect } from 'react';
import { HubConnectionBuilder } from "@microsoft/signalr";
import { ACCESS_TOKEN } from "../constants/constants";

const SignalRContext = createContext();

export const SignalRProvider = ({ children }) => {
  const [connection, setConnection] = useState(null);
  const [chatConnection, setChatConnection] = useState(null);
  const token = window.localStorage.getItem(ACCESS_TOKEN);

useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("http://localhost:4204/notification", {
        accessTokenFactory: () => token,
      })
      .build();
    const chatHub = new HubConnectionBuilder()
      .withUrl("http://localhost:4204/chat", {
        accessTokenFactory: () => token,
      })
      .build();
    setConnection(newConnection);
    setChatConnection(chatHub);

    return () => {
      if (newConnection) {
        newConnection.stop();
        chatHub.stop();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <SignalRContext.Provider value={{connection, setConnection, chatConnection, setChatConnection}}>
      {children}
    </SignalRContext.Provider>
  );
};

export default SignalRContext;