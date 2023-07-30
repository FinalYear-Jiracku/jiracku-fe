import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  issueList: [],
  issueDetail: {},
  completeIssue: 0,
  unCompleteIssue: 0,
};

const issueReducer = createSlice({
  name: "issueReducer",
  initialState,
  reducers: {
    getListIssueReducer: (state, action) => {
      state.issueList = action.payload;
    },
    getIssueDetailReducer: (state, action) => {
      state.issueDetail = action.payload;
    },
    getCompleteIssueReducer: (state, action) => {
      state.completeIssue = action.payload;
    },
    getUnCompleteIssueReducer: (state, action) => {
      state.unCompleteIssue = action.payload;
    },
  },
});

export const {
  getListIssueReducer,
  getIssueDetailReducer,
  getCompleteIssueReducer,
  getUnCompleteIssueReducer,
} = issueReducer.actions;

export default issueReducer.reducer;
