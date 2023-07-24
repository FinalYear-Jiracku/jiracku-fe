import React, { createContext, useState, useEffect } from 'react';
import { HubConnectionBuilder } from "@microsoft/signalr";
import { ACCESS_TOKEN } from "../constants/constants";
import { useDispatch, useSelector } from 'react-redux';
import { setSignalRConnection } from '../redux/reducer/signalR-reducer';

const SignalRContext = createContext();

export const SignalRProvider = ({ children }) => {
  //const [connection, setConnection] = useState(null);
  const token = window.localStorage.getItem(ACCESS_TOKEN);
  const connection = useSelector((state) => state.signalRReducer.connection);
  const dispatch = useDispatch();

//   useEffect(() => {
//     // Tạo kết nối SignalR khi component được mount
//     const newConnection = new HubConnectionBuilder()
//       .withUrl("http://localhost:4204/notification", {
//         accessTokenFactory: () => token,
//       })
//       .build();

//     setConnection(newConnection);

//     // return () => {
//     //   // Đóng kết nối khi component bị unmount
//     //   if (newConnection) {
//     //     newConnection.stop();
//     //   }
//     // };
//   }, [token]);
useEffect(() => {
    // Tạo kết nối SignalR khi component được mount
    const newConnection = new HubConnectionBuilder()
      .withUrl("http://localhost:4204/notification", {
        accessTokenFactory: () => token,
      })
      .build();

    dispatch(setSignalRConnection(newConnection));

    return () => {
      if (newConnection) {
        newConnection.stop();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <SignalRContext.Provider value={connection}>
      {children}
    </SignalRContext.Provider>
  );
};

export default SignalRContext;