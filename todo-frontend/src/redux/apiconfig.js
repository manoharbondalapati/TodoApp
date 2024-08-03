import axios from "axios";

const api = axios.create({
  baseURL: "https://todoapp-jrvq.onrender.com/api",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("Token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("Token");

      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
