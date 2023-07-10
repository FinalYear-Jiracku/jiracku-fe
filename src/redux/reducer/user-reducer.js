import { createSlice } from '@reduxjs/toolkit'

const initialState = {
userDetail:{},
}

const userReducer = createSlice({
  name: "userReducer",
  initialState,
  reducers: {
    getUserDetailReducer: (state,action)=>{
        state.userDetail = action.payload
    }
  }
});

export const {getUserDetailReducer} = userReducer.actions

export default userReducer.reducer