import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  loading: false,
  error: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
    },
    loginFailure: (state) => {
      state.loading = false;
      state.error = true;
    },
    logout: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = false;
    },
    updateBookmarks: (state, action) => {
      if (!state.currentUser?.bookmarks?.includes(action.payload)) {
        state.currentUser?.bookmarks?.push(action.payload);
      } else {
        state.currentUser?.bookmarks?.splice(
          state.currentUser?.bookmarks.findIndex(
            (postId) => postId === action.payload
          ),
          1
        );
      }
    },
    likeDislikePost: (state, action) => {
      if (!state.currentUser?.liked?.includes(action.payload)) {
        state.currentUser?.liked?.push(action.payload);
      } else {
        state.currentUser?.liked?.splice(
          state.currentUser?.liked.findIndex(
            (postId) => postId === action.payload
          ),
          1
        );
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateBookmarks,
  likeDislikePost,
} = userSlice.actions;

export default userSlice.reducer;
