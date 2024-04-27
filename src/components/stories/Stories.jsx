import React from "react";
import styles from "./stories.module.css";
import { SingleStory } from "../singleStory/SingleStory";

export const Stories = ({ story }) => {
  return story.length === 0 ? (
    <div className={styles.noStory}>
      <p className={styles.storyText}>No stories available</p>
    </div>
  ) : (
    <div className={styles.container}>
      {story?.map((s) => (
        <SingleStory key={s._id} singleStory={s} />
      ))}
    </div>
  );
};
