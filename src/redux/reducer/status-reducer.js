import { createSlice } from '@reduxjs/toolkit'

const initialState = {
dropdownStatusList:[],
dataStatusList:[]
}

const statusReducer = createSlice({
  name: "statusReducer",
  initialState,
  reducers: {
    getDropdownListStatusReducer: (state,action) =>{
        state.dropdownStatusList = action.payload
    },
    getDataStatusListReducer: (state,action) =>{
      state.dataStatusList = action.payload
  },
  }
});

export const {getDropdownListStatusReducer,getDataStatusListReducer} = statusReducer.actions

export default statusReducer.reducer