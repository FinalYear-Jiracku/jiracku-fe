import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userDetail: {},
  userProjectList: [],
  userList: [],
  userStatis: [],
  yearList: [],
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
    getUserListReducer: (state, action) => {
      state.userList = action.payload;
    },
    getUserStatisReducer: (state, action) => {
      state.userStatis = action.payload;
    },
    getYearListReducer: (state, action) => {
      state.yearList = action.payload;
    },
  },
});

export const {
  getUserDetailReducer,
  getUserProjectListReducer,
  getUserListReducer,
  getUserStatisReducer,
  getYearListReducer,
} = userReducer.actions;

export default userReducer.reducer;
