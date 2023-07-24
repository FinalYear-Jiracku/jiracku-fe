import { createSlice } from '@reduxjs/toolkit'

const initialState = {
projectList:[],
projectDetail:{},
projectId: null
}

const projectReducer = createSlice({
  name: "projectReducer",
  initialState,
  reducers: {
    getProjectListReducer: (state,action) =>{
        state.projectList = action.payload
    },
    getProjectDetailReducer: (state,action)=>{
        state.projectDetail = action.payload
    },
    setProjectId: (state, action) => {
      state.projectId = action.payload;
    },
  }
});

export const {getProjectListReducer,getProjectDetailReducer,setProjectId} = projectReducer.actions

export default projectReducer.reducer