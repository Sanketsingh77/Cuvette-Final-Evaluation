import React, { lazy, Suspense, useEffect } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import "./App.css";
import SuspenseLoader from "./components/loaders/SuspenseLoader";
import MyStories from "./pages/my stories/MyStories";
const AppLayout = lazy(() => import("./layouts/Applayout"));
const Home = lazy(() => import("./pages/home/Home"));
const Bookmarks = lazy(() => import("./pages/bookmarks/Bookmarks"));
const ViewStoryPage = lazy(() => import("./pages/view story/ViewStoryPage"));
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <Suspense fallback={<SuspenseLoader />}>
              <AppLayout />
            </Suspense>
          }
          path="/"
        >
          <Route index element={<Home />} />
          <Route
            path="/my-bookmarks"
            element={
              <Suspense fallback={<SuspenseLoader />}>
                <Bookmarks />
              </Suspense>
            }
          />
          <Route
            path="/my-stories"
            element={
              <Suspense fallback={<SuspenseLoader />}>
                <MyStories />
              </Suspense>
            }
          />
          <Route
            path="/View-Story/:id"
            element={
              <Suspense fallback={<SuspenseLoader />}>
                <ViewStoryPage />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
