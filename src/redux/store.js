import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import projectReducer from "./reducer/project-reducer"
import sprintReducer from "./reducer/sprint-reducer"
import issueReducer from "./reducer/issue-reducer";
import statusReducer from "./reducer/status-reducer";
import userReducer from "./reducer/user-reducer";
import subIssueReducer from "./reducer/subIssue-reducer";
import commentReducer from "./reducer/comment-reducer";
import notificationReducer from "./reducer/notification-reducer";
import messageReducer from "./reducer/message-reducer";
import eventReducer from "./reducer/event-reducer";

export const store = configureStore({
    reducer: {
        projectReducer,
        sprintReducer,
        issueReducer,
        statusReducer,
        userReducer,
        subIssueReducer,
        commentReducer,
        notificationReducer,
        messageReducer,
        eventReducer
    },
    middleware:[thunk]
})