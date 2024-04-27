import React from "react";
import styles from "./homepage.module.css";
import { Cards } from "../../components/cards/Cards";
import { TopStories } from "../../components/topStories/TopStories";

export default function Homepage() {
  return (
    <div className={styles.container}>
      <Cards />
      <TopStories />
    </div>
  );
}
