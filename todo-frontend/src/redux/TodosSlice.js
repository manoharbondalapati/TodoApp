import { createSlice } from "@reduxjs/toolkit";
import api from "./apiconfig";
import { message } from "antd";

const initialState = {
  todos: [],
  todo: null,
  loading: false,
  error: null,
};

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    fetchTodosStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchTodosSuccess: (state, action) => {
      state.loading = false;
      state.todos = action.payload;
    },
    fetchTodosFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchTodoByIdStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchTodoByIdSuccess: (state, action) => {
      state.loading = false;
      state.todo = action.payload;
    },
    fetchTodoByIdFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    createTodoSuccess: (state, action) => {
      state.todos.push(action.payload);
    },
    updateTodoSuccess: (state, action) => {
      const index = state.todos.findIndex(
        (todo) => todo._id === action.payload._id
      );
      if (index !== -1) {
        state.todos[index] = action.payload;
      }
    },
    deleteTodoSuccess: (state, action) => {
      state.todos = state.todos.filter((todo) => todo._id !== action.payload);
    },
  },
});

export const {
  fetchTodosStart,
  fetchTodosSuccess,
  fetchTodosFailure,
  fetchTodoByIdStart,
  fetchTodoByIdSuccess,
  fetchTodoByIdFailure,
  createTodoSuccess,
  updateTodoSuccess,
  deleteTodoSuccess,
} = todosSlice.actions;

export const fetchTodos = () => async (dispatch) => {
  dispatch(fetchTodosStart());
  try {
    const response = await api.get("/todos");
    dispatch(fetchTodosSuccess(response.data));
  } catch (error) {
    dispatch(fetchTodosFailure(error.message));
  }
};

export const fetchTodoById = (id) => async (dispatch) => {
  dispatch(fetchTodoByIdStart());
  try {
    const response = await api.get(`/todos/${id}`);
    dispatch(fetchTodoByIdSuccess(response.data));
  } catch (error) {
    dispatch(fetchTodoByIdFailure(error.message));
  }
};

export const createTodo = (todoData) => async (dispatch) => {
  const { title, description } = todoData;
  if (!title || !description) {
    message.error("Please enter both title and description");
    return;
  }

  try {
    const response = await api.post("/todos", todoData);
    dispatch(createTodoSuccess(response.data));
    dispatch(fetchTodos());
    message.success("New Todo Created Successfully");
  } catch (error) {
    console.error("Failed to create todo:", error.message);
    message.error("Failed to create todo. Please try again.");
  }
};
export const updateTodo = (id, todoData) => async (dispatch) => {
  try {
    const response = await api.put(`/todos/${id}`, todoData);
    dispatch(updateTodoSuccess(response.data));
    message.success("Todo Updated Successfully");
  } catch (error) {
    console.error("Failed to update todo:", error.message);
  }
};

export const deleteTodo = (id) => async (dispatch) => {
  try {
    await api.delete(`/todos/${id}`);
    dispatch(deleteTodoSuccess(id));
    message.success("Todo Deleted Successfully");
  } catch (error) {
    console.error("Failed to delete todo:", error.message);
  }
};

export default todosSlice.reducer;
