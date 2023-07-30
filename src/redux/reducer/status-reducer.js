import { createSlice } from '@reduxjs/toolkit'

const initialState = {
dropdownStatusList:[],
dataStatusList:[],
statusDetail:{}
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
    getStatusDetailReducer: (state,action) =>{
      state.statusDetail = action.payload
    },
  }
});

export const {getDropdownListStatusReducer,getDataStatusListReducer, getStatusDetailReducer} = statusReducer.actions

export default statusReducer.reducer