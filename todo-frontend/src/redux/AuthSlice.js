import { createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
import axios from "axios";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    error: null,
    loading: false,
  },
  reducers: {
    registerStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    registerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.error = null;
      state.loading = false;
      localStorage.removeItem("Token");
      localStorage.removeItem("username");
    },
  },
});

export const {
  registerStart,
  registerSuccess,
  registerFailure,
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
} = authSlice.actions;

export const registerUser = (userCredentials, navigate) => async (dispatch) => {
  dispatch(registerStart());
  try {
    const response = await axios.post(
      "https://todoapp-jrvq.onrender.com/api/auth/register",
      userCredentials
    );
    dispatch(registerSuccess(response.data));
    message.success("Registered Successfully");
    navigate("/login");
  } catch (error) {
    const errorMessage =
      error.response && error.response.data
        ? error.response.data.error
        : "Registration Failed";
    dispatch(registerFailure(errorMessage));
    message.error(errorMessage);
  }
};

export const loginUser = (loginCredentials, navigate) => async (dispatch) => {
  dispatch(loginStart());
  try {
    const response = await axios.post(
      "https://todoapp-jrvq.onrender.com/api/auth/login",
      loginCredentials
    );
    const { token, username } = response.data;
    localStorage.setItem("Token", token);
    localStorage.setItem("username", username);
    dispatch(loginSuccess(response.data));
    message.success("Login Successful");
    navigate("/todos");
  } catch (error) {
    const errorMessage =
      error.response && error.response.data
        ? error.response.data.error
        : "Invalid Credentials";
    dispatch(loginFailure(errorMessage));
    message.error(errorMessage);
  }
};

export default authSlice.reducer;
