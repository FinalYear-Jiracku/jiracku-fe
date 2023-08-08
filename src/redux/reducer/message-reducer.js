import { createSlice } from '@reduxjs/toolkit'

const initialState = {
messageList:[],
messageDetail:{}
}

const messageReducer = createSlice({
  name: "messageReducer",
  initialState,
  reducers: {
    getMessageListReducer: (state,action) =>{
        state.messageList = action.payload
    },
    getMessageDetailReducer: (state,action) =>{
      state.messageDetail = action.payload
    },
  }
});

export const {getMessageListReducer,getMessageDetailReducer} = messageReducer.actions

export default messageReducer.reducer