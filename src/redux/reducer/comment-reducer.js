import { createSlice } from '@reduxjs/toolkit'

const initialState = {
commentDetail:{}
}

const commentReducer = createSlice({
  name: "subIssueReducer",
  initialState,
  reducers: {
    getCommentDetailReducer: (state,action)=>{
        state.commentDetail = action.payload
    }
  }
});

export const {getCommentDetailReducer} = commentReducer.actions

export default commentReducer.reducer