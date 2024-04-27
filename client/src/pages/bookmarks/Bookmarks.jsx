import React from "react";
import styles from "./bookmarks.module.css";
import storyApi from "../../api/storiesApi";
import StoriesContainer from "../../components/storiesContainer/StoriesContainer";

function Bookmarks() {
  // const [storyData, setstoryData] = useState([]);
  // const fetchMyBookmarks = async () => {
  //   try {
  //     const res = await storyApi.getMyBookmarks();
  //     setstoryData(res?.stories);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  return (
    <div className={styles.bookmarksContainer}>
      <StoriesContainer category={"My Bookmarks"} notCategory={true} />
    </div>
  );
}

export default Bookmarks;
