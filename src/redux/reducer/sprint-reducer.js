import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sprintList: [],
  sprintDetail: {},
  sprintId: null,
  dropdownSprintList: [],
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
  },
});

export const {
  getSprintListReducer,
  getSprintDetailReducer,
  setSprintId,
  getDropdownListSprintReducer,
} = sprintReducer.actions;

export default sprintReducer.reducer;