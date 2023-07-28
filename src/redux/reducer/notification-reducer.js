import { createSlice } from '@reduxjs/toolkit'

const initialState = {
notificationList:[]
}

const notificationReducer = createSlice({
  name: "notificationReducer",
  initialState,
  reducers: {
    getNotificationListReducer: (state,action) =>{
        state.notificationList = action.payload
    }
  }
});

export const {getNotificationListReducer} = notificationReducer.actions

export default notificationReducer.reducer