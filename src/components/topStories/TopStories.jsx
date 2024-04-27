import styles from "./topStories.module.css";
import { Category } from "../category/Category";
import { categoryData } from "../../utils/cardsData";
import { useActiveFilter } from "../../providers/activeFilterProvider";
import YourStories from "../../pages/yourStories/YourStories";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import newRequest from "../../utils/newRequest";

export const TopStories = () => {
  const { activeFilter } = useActiveFilter();

  const { currentUser } = useSelector((state) => state.user);

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchD = async () => {
      try {
        const d = await newRequest.get(`/user/getMyStories`);
        setData(d?.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchD();
  }, []);

  return (
    <div className={styles.container}>
      {currentUser && data.length > 0 && <YourStories />}

      {categoryData.map(
        (card) =>
          card.categoryName !== "All" &&
          activeFilter === "All" && (
            <Category name={card.categoryName} key={card.id} />
          )
      )}

      {categoryData.map(
        (card) =>
          card.categoryName !== "All" &&
          card.categoryName === activeFilter && (
            <Category name={card.categoryName} key={card.id} />
          )
      )}
    </div>
  );
};
