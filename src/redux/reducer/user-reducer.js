import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userDetail: {},
  userProjectList: [],
};

const userReducer = createSlice({
  name: "userReducer",
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

export const { getUserDetailReducer, getUserProjectListReducer } = userReducer.actions;

export default userReducer.reducer;
