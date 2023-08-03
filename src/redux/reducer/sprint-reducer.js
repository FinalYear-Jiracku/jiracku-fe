import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sprintList: [],
  sprintDetail: {},
  sprintId: null,
  dropdownSprintList: [],
  sprintListComplete: [],
  sprintBurndown: [],
  sprintStatis: {}
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
    getSprintListCompleteReducer: (state, action) => {
      state.sprintListComplete = action.payload;
    },
    getSprintBurndownReducer: (state, action) => {
      state.sprintBurndown = action.payload;
    },
    getSprintStaticReducer: (state, action) => {
      state.sprintStatis = action.payload;
    },
  },
});

export const {
  getSprintListReducer,
  getSprintDetailReducer,
  setSprintId,
  getDropdownListSprintReducer,
  getSprintListCompleteReducer,
  getSprintBurndownReducer,
  getSprintStaticReducer
} = sprintReducer.actions;

export default sprintReducer.reducer;
