import { createSlice } from '@reduxjs/toolkit'

const initialState = {
issueList:[],
issueDetail:{}
}

const issueReducer = createSlice({
  name: "issueReducer",
  initialState,
  reducers: {
    getListIssueReducer: (state,action) =>{
        state.issueList = action.payload
    },
    getIssueDetailReducer: (state,action)=>{
        state.issueDetail = action.payload
    }
  }
});

export const {getListIssueReducer,getIssueDetailReducer} = issueReducer.actions

export default issueReducer.reducer