import axios from "axios";

const api = axios.create({
  baseURL: "https://blogging-platform-jgw6.onrender.com/api",
  withCredentials: true,
});

export default api;
