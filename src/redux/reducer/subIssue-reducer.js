import { createSlice } from '@reduxjs/toolkit'

const initialState = {
subIssueDetail:{}
}

const subIssueReducer = createSlice({
  name: "subIssueReducer",
  initialState,
  reducers: {
    getSubIssueDetailReducer: (state,action)=>{
        state.subIssueDetail = action.payload
    }
  }
});

export const {getSubIssueDetailReducer} = subIssueReducer.actions

export default subIssueReducer.reducer