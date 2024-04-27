import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import Homepage from "./pages/homepage/Homepage";
import { Navbar } from "./components/navbar/Navbar";
import Bookmarks from "./pages/bookmarks/Bookmarks";
import { ViewStory } from "./components/viewStory/ViewStory";
import { useState } from "react";
import { useSelector } from "react-redux";
import YourStories from "./pages/yourStories/YourStories";

function App() {
  const [openViewStoryModal, setOpenViewStoryModal] = useState(false);

  const { currentUser } = useSelector((state) => state.user);

  const HomeLayout = () => {
    return (
      <div className="App">
        <Navbar />
        <Outlet />
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomeLayout />,
      children: [
        {
          path: "/",
          element: <Homepage />,
        },
        {
          path: "/bookmarks",
          element: currentUser ? <Bookmarks /> : <Homepage />,
        },
        {
          path: "/yourStories",
          element: currentUser ? <YourStories /> : <Homepage />,
        },
        {
          path: "/viewStory/:storyId",
          element: (
            <ViewStory
              openViewStoryModal={openViewStoryModal}
              setOpenViewStoryModal={setOpenViewStoryModal}
              storyIdTrue={true}
            />
          ),
        },
      ],
    },

    // error page path
    //  {
    //    path: "/*",
    //    element: <Error404 />,
    //  },
  ]);

  return (
    <div>
      <RouterProvider router={router}></RouterProvider>
    </div>
  );
}

export default App;
