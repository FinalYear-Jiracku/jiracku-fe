import { createSlice } from '@reduxjs/toolkit'

const initialState = {
// messageList:{
//   firstPage: 0,
//   lastPage : 0,
//   nextPage: 0,
//   pageNumber : 0,
//   pageSize: 0,
//   totalPages : 0,
//   data:[]
// },
messageList : [],
messageDetail:{}
}

const messageReducer = createSlice({
  name: "messageReducer",
  initialState,
  reducers: {
    getMessageListReducer: (state,action) =>{
      state.messageList = action.payload
    //   const {
    //     data,
    //     firstPage,
    //     lastPage,
    //     nextPage,
    //     pageNumber,
    //     totalPages
    //  } = action.payload;
    //  state.messageList = {
    //     ...state.messageList,
    //     data: [...state.messageList.data, ...data],
    //     firstPage,
    //     lastPage,
    //     nextPage,
    //     pageNumber,
    //     totalPages
    //  };
    },
    getMessageDetailReducer: (state,action) =>{
      state.messageDetail = action.payload
    },
  }
});

export const {getMessageListReducer,getMessageDetailReducer} = messageReducer.actions

export default messageReducer.reducer