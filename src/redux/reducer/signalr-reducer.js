import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userDetail: {},
  userProjectList: [],
};

const signalrReducer = createSlice({
  name: "signalrReducer",
  initialState,
  reducers: {
    getUserDetailReducer: (state, action) => {
      state.userDetail = action.payload;
    },
    getUserProjectListReducer: (state, action) => {
      state.userProjectList = action.payload;
    },
  },
});

export const { getUserDetailReducer, getUserProjectListReducer } = signalrReducer.actions;

export default signalrReducer.reducer;