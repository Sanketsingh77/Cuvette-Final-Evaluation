// import axiosClient from "./AxiosClient";

// const authApi = {
//   login: (username, password) =>
//     axiosClient.post("auth/login", {
//       username,
//       password,
//     }),
//   register: (params) => axiosClient.post("auth/register", params),
//   getUserData: () => axiosClient.get("auth/userData"),
// };

// export default authApi;
import axios from "axios";

export async function LoginUser(username, password) {
  const baseURL = import.meta.env.VITE_APP_BASE_URL;
  const payLoad = { username, password };
  try {
    const response = await axios.post(`${baseURL}auth/login`, payLoad, {
      withCredentials: true,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
}

export async function RegisterUser(username, password) {
  const baseURL = import.meta.env.VITE_APP_BASE_URL;
  const payLoad = { username, password };
  try {
    const response = await axios.post(`${baseURL}auth/register`, payLoad, {
      withCredentials: true,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
}
