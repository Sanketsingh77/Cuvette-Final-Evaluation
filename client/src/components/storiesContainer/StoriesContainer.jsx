import React, { useEffect, useState, useContext } from "react";
import styles from "./storiesContainer.module.css";
import StoryCard from "../storyCard/StoryCard";
import storyApi from "../../api/storiesApi";
import { LoadingContext } from "../../layouts/Applayout";
function StoriesContainer({ category, notCategory }) {
  const [page, setpage] = useState(1);
  const { loggedIn, setloading } = useContext(LoadingContext);
  const [showMoreBtn, setshowMoreBtn] = useState(false);
  const [storyData, setstoryData] = useState([]);
  const fetchStories = async () => {
    try {
      let res;
      if (category === "My Stories") {
        res = await storyApi.getMyStories(page);
      } else if (category == "My Bookmarks") {
        res = await storyApi.getMyBookmarks();
      } else {
        res = await storyApi.getStoriesByCategory(category, page);
      }
      setstoryData(res?.stories);

      if (res?.remainingStories > 0) {
        setshowMoreBtn(true);
      } else {
        setshowMoreBtn(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, [category, loggedIn, page]);
  return (
    <div className={styles.storiesContainer}>
      {notCategory ? (
        <div className={styles.title}>{category}</div>
      ) : (
        <div className={styles.title}>Top Stories about {category}</div>
      )}

      {storyData?.length > 0 ? (
        <div className={styles.cardsContainer}>
          {storyData?.map((story) => (
            <StoryCard
              key={story._id}
              title={story.slides[0].title}
              description={story.slides[0].description}
              image={story.slides[0].imageURL}
              editable={story.editable}
              storyId={story._id}
            />
          ))}
        </div>
      ) : (
        <div className={styles.noDataDiv}>No stories Available</div>
      )}

      {showMoreBtn && (
        <button
          className={styles.showMoreBtn}
          onClick={() => setpage(page + 1)}
        >
          Show more
        </button>
      )}
    </div>
  );
}

export default StoriesContainer;
