import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dataList: {},
  eventDetail: {},
  zoomToken: null,
  eventId: null
};

const eventReducer = createSlice({
  name: "eventReducer",
  initialState,
  reducers: {
    getEventListReducer: (state, action) => {
      state.dataList = action.payload;
    },
    getEventDetailReducer: (state, action) => {
      state.eventDetail = action.payload;
    },
    getZoomTokenReducer: (state, action) => {
      state.zoomToken = action.payload;
    },
    setEventId: (state, action) => {
      state.projectId = action.payload;
    },
  },
});

export const {
  getEventListReducer,
  getEventDetailReducer,
  getZoomTokenReducer,
  setEventId
} = eventReducer.actions;

export default eventReducer.reducer;
