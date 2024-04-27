import React from "react";
import styles from "./card.module.css";
import { useActiveFilter } from "../../providers/activeFilterProvider";

export const Card = ({ category }) => {
  const { activeFilter, setActiveFilter } = useActiveFilter();

  return (
    <div
      className={styles.card}
      onClick={() => setActiveFilter(category?.categoryName)}
    >
      <img
        src={category.img}
        style={{
          border:
            activeFilter === category.categoryName
              ? "5px solid #20d7fe"
              : "5px solid transparent",
        }}
        alt={category.categoryName}
        className={styles.cardImg}
      />
      <h4 className={styles.catName}>{category.categoryName}</h4>
    </div>
  );
};
