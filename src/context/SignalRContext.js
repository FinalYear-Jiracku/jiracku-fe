import React, { createContext, useState, useEffect } from 'react';
import { HubConnectionBuilder } from "@microsoft/signalr";
import { ACCESS_TOKEN } from "../constants/constants";
import { useDispatch } from 'react-redux';
import { setSignalRConnection } from '../redux/reducer/signalR-reducer';

const SignalRContext = createContext();

export const SignalRProvider = ({ children }) => {
  const [connection, setConnection] = useState(null);
  const token = window.localStorage.getItem(ACCESS_TOKEN);
  const dispatch = useDispatch();

useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("http://localhost:4204/notification", {
        accessTokenFactory: () => token,
      })
      .build();
    setConnection(newConnection);
    dispatch(setSignalRConnection(newConnection));

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