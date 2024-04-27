import styles from "./cards.module.css";
import { Card } from "../card/Card";
import { categoryData } from "../../utils/cardsData";

export const Cards = () => {
  return (
    <div className={styles.container}>
      {categoryData?.map((category) => (
        <Card key={category.id} category={category} />
      ))}
    </div>
  );
};
