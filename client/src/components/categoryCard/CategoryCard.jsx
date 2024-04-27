import React from "react";
import styles from "./categoryCard.module.css";

function CategoryCard({ name, image, active, onClick }) {
  const cardStyle = {
    backgroundImage: `url(${image})`,
  };
  return (
    <div
      className={`${styles.card} ${active ? styles.active : ""}`}
      onClick={onClick}
    >
      {/* <div className={styles.categoryImage} style={cardStyle}></div> */}
      <img src={image} alt="cardImage" className={styles.categoryImage} />
      <div className={styles.categoryName}>{name}</div>
    </div>
  );
}

export default CategoryCard;
