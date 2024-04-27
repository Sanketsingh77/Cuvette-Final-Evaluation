import React from "react";
import { useParams } from "react-router-dom";
import styles from "./viewStoryPage.module.css";
import ViewStory from "../../components/viewStory/ViewStory";
function ViewStoryPage() {
  let { id } = useParams();
  return (
    <div className={styles.ViewStoryPageContainer}>
      <ViewStory storyId={id} />
    </div>
  );
}

export default ViewStoryPage;
