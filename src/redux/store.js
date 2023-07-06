import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import projectReducer from "./reducer/project-reducer"
import sprintReducer from "./reducer/sprint-reducer"
import issueReducer from "./reducer/issue-reducer";
import statusReducer from "./reducer/status-reducer";
export const store = configureStore({
    reducer: {
        projectReducer,
        sprintReducer,
        issueReducer,
        statusReducer,
    },
    middleware:[thunk]
})