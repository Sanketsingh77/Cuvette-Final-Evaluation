import axiosClient from "./AxiosClient";
const userApi = {
  getUserData: () => axiosClient.get("auth/userData"),
};
export default userApi;
