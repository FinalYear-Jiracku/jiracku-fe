import { createSlice } from '@reduxjs/toolkit'

const initialState = {
dropdownStatusList:[],
}

const statusReducer = createSlice({
  name: "statusReducer",
  initialState,
  reducers: {
    getDropdownListStatusReducer: (state,action) =>{
        state.dropdownStatusList = action.payload
    },
  }
});

export const {getDropdownListStatusReducer} = statusReducer.actions

export default statusReducer.reducer