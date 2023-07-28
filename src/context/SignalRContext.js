import React, { createContext, useState, useEffect } from 'react';
import { HubConnectionBuilder } from "@microsoft/signalr";
import { ACCESS_TOKEN } from "../constants/constants";

const SignalRContext = createContext();

export const SignalRProvider = ({ children }) => {
  const [connection, setConnection] = useState(null);
  const token = window.localStorage.getItem(ACCESS_TOKEN);

useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("http://localhost:4204/notification", {
        accessTokenFactory: () => token,
      })
      .build();
    setConnection(newConnection);

    return () => {
      if (newConnection) {
        newConnection.stop();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <SignalRContext.Provider value={{connection, setConnection}}>
      {children}
    </SignalRContext.Provider>
  );
};

export default SignalRContext;