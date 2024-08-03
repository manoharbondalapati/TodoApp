import { createSlice } from "@reduxjs/toolkit";
import api from "./apiconfig";

const initialState = {
  sessions: [],
  loading: false,
  error: null,
};

const sessionsSlice = createSlice({
  name: "sessions",
  initialState,
  reducers: {
    fetchSessionsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSessionsSuccess: (state, action) => {
      state.loading = false;
      state.sessions = action.payload;
    },
    fetchSessionsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchSessionsStart,
  fetchSessionsSuccess,
  fetchSessionsFailure,
} = sessionsSlice.actions;

export const fetchSessions = () => async (dispatch) => {
  dispatch(fetchSessionsStart());
  try {
    const response = await api.get("/sessions");
    dispatch(fetchSessionsSuccess(response.data));
  } catch (error) {
    const errorMessage = error.response
      ? error.response.data.error
      : "Failed to fetch sessions";
    dispatch(fetchSessionsFailure(errorMessage));
  }
};

export default sessionsSlice.reducer;
