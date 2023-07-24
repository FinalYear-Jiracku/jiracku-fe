import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import projectReducer from "./reducer/project-reducer"
import sprintReducer from "./reducer/sprint-reducer"
import issueReducer from "./reducer/issue-reducer";
import statusReducer from "./reducer/status-reducer";
import userReducer from "./reducer/user-reducer";
import subIssueReducer from "./reducer/subIssue-reducer";
import commentReducer from "./reducer/comment-reducer";
import signalRReducer from "./reducer/signalR-reducer";

export const store = configureStore({
    reducer: {
        projectReducer,
        sprintReducer,
        issueReducer,
        statusReducer,
        userReducer,
        subIssueReducer,
        commentReducer,
        signalRReducer
    },
    middleware:[thunk]
})