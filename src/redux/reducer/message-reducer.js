import { createSlice } from '@reduxjs/toolkit'

const initialState = {
messageList:[]
}

const messageReducer = createSlice({
  name: "messageReducer",
  initialState,
  reducers: {
    getMessageListReducer: (state,action) =>{
        state.messageList = action.payload
    }
  }
});

export const {getMessageListReducer} = messageReducer.actions

export default messageReducer.reducer