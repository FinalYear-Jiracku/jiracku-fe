import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  issueList: [],
  issueDetail: {},
  completeIssue: 0,
  unCompleteIssue: 0,
  statisType:{},
  statisPriority:{},
  statisStatus:{},
  statisDeadline:{},
  statisUser: []
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
    getStatisTypeReducer: (state, action) => {
      state.statisType = action.payload;
    },
    getStatisPriorityReducer: (state, action) => {
      state.statisPriority = action.payload;
    },
    getStatisStatusReducer: (state, action) => {
      state.statisStatus = action.payload;
    },
    getStatisDealineReducer: (state, action) => {
      state.statisDeadline = action.payload;
    },
    getStatisUserReducer: (state, action) => {
      state.statisUser = action.payload;
    },
  },
});

export const {
  getListIssueReducer,
  getIssueDetailReducer,
  getCompleteIssueReducer,
  getUnCompleteIssueReducer,
  getStatisTypeReducer,
  getStatisPriorityReducer,
  getStatisStatusReducer,
  getStatisDealineReducer,
  getStatisUserReducer
} = issueReducer.actions;

export default issueReducer.reducer;
