import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/AuthSlice";
import todosReducer from "./TodosSlice";
import sessionsReducer from "./SessionsSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    todos: todosReducer,
    sessions: sessionsReducer,
  },
});

export default store;
