import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   connection: false,
//   messages: []
// };

// const signalRReducer = createSlice({
//   name: "signalRReducer",
//   initialState,
//   reducers: {
//     setConnected: (state, action) => {
//       state.connection = action.payload;
//     },
//     addMessageReducer(state, action) {
//       state.messages.push(action.payload);
//     },
//   },
// });
const initialState = {
  connection: null,
};

const signalRReducer = createSlice({
  name: "signalRReducer",
  initialState,
  reducers: {
    setSignalRConnection(state, action) {
      state.connection = action.payload;
    },
  },
});

export const { setSignalRConnection } = signalRReducer.actions;

export default signalRReducer.reducer;