import axios from "axios";

const api = axios.create({
  baseURL: "https://hirehub-backend-ii95.onrender.com/api",
});

export default api;