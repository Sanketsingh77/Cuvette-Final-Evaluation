import React, { useContext, useState } from "react";
import styles from "./home.module.css";
import { categories } from "../../utils/customs";
import CategoryCard from "../../components/categoryCard/CategoryCard";
import StoriesContainer from "../../components/storiesContainer/StoriesContainer";
import { Toaster } from "react-hot-toast";
import { LoadingContext } from "../../layouts/Applayout";
function Home() {
  const { setloading, loggedIn } = useContext(LoadingContext);
  const [activeCategory, setActiveCategory] = useState("All");

  const handleCategoryClick = (name) => {
    setloading(true);
    setTimeout(() => {
      setActiveCategory(name);
    }, 2000);
  };

  return (
    <div className={styles.home}>
      <Toaster position="top-center" reverseOrder={false} />
      <div className={styles.categoryContainer}>
        {categories.map((category, index) => (
          <CategoryCard
            key={index}
            image={category.imageSrc}
            name={category.name}
            active={activeCategory === category.name}
            onClick={() => handleCategoryClick(category.name)}
          />
        ))}
      </div>
      <div className={styles.storiesContainerHome} style={{ zIndex: 2 }}>
        {activeCategory === "All" ? (
          <>
            {loggedIn && (
              <div className={styles.myStoriesContainer}>
                <StoriesContainer category={"My Stories"} notCategory={true} />
              </div>
            )}
            {categories.slice(1).map((category, index) => (
              <StoriesContainer key={index} category={category.name} />
            ))}
          </>
        ) : (
          <StoriesContainer category={activeCategory} />
        )}
      </div>
    </div>
  );
}

export default Home;
