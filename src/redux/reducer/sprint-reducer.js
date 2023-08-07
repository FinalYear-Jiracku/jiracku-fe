import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sprintList: [],
  sprintDetail: {},
  sprintId: null,
  dropdownSprintList: [],
  startSprintList: [],
  sprintListComplete: [],
  statisNumOfIssue : []
};

const sprintReducer = createSlice({
  name: "sprintReducer",
  initialState,
  reducers: {
    getSprintListReducer: (state, action) => {
      state.sprintList = action.payload;
    },
    getSprintDetailReducer: (state, action) => {
      state.sprintDetail = action.payload;
    },
    setSprintId: (state, action) => {
      state.sprintId = action.payload;
    },
    getDropdownListSprintReducer: (state, action) => {
      state.dropdownSprintList = action.payload;
    },
    getStartSprintListReducer: (state, action) => {
      state.startSprintList = action.payload;
    },
    getSprintListCompleteReducer: (state, action) => {
      state.sprintListComplete = action.payload;
    },
    getStatisNumOfIssueReducer: (state, action) => {
      state.statisNumOfIssue = action.payload;
    },
  },
});

export const {
  getSprintListReducer,
  getSprintDetailReducer,
  setSprintId,
  getDropdownListSprintReducer,
  getStartSprintListReducer,
  getSprintListCompleteReducer,
  getStatisNumOfIssueReducer
} = sprintReducer.actions;

export default sprintReducer.reducer;
