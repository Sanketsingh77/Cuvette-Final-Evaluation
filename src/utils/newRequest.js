import axios from "axios";

const newRequest = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  withCredentials: true,
});

export default newRequest;
