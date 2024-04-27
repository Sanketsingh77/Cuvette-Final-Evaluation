import axiosClient from "./AxiosClient";
const storyApi = {
  addStory: (params) => axiosClient.post("stories/add", params),
  updateStory: (id, params) =>
    axiosClient.patch(`stories/update/${id}`, params),
  getStory: (id) => axiosClient.get(`stories/get-story/${id}`),
  getMyStories: (page) => axiosClient.get(`stories/my-stories?page=${page}`),
  getStoriesByCategory: (category, page) =>
    axiosClient.get(
      `stories/story-by-category?category=${category}&page=${page}`
    ),
  getMyBookmarks: () => axiosClient.get("stories/my-bookmarks"),
  likeStory: (id) => axiosClient.put(`stories/like/${id}`),
  bookmarkStory: (id) => axiosClient.put(`stories/bookmark/${id}`),
};
export default storyApi;
