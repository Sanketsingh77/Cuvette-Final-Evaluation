import React, { useEffect, useState } from "react";
import styles from "./category.module.css";
import { Stories } from "../stories/Stories";
import getPostsByCat from "../../api/getPostsByCat";

export const Category = ({ name }) => {
  const [data, setData] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [currDataLen, setCurrDataLen] = useState(4);

  useEffect(() => {
    const fetchD = async () => {
      try {
        const d = await getPostsByCat(name);
        setData(d?.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchD();
  }, [name]);

  return (
    <div className={styles.story}>
      <h4 className={styles.storyCat}>Top Stories about {name}</h4>

      <Stories
        story={showMore ? data.slice(0, data.length) : data.slice(0, 4)}
      />

      {data.length >= 5 && currDataLen !== data.length && (
        <button
          onClick={() => {
            setShowMore(true);
            setCurrDataLen(data.length);
          }}
          className={styles.seeMoreBtn}
        >
          See More
        </button>
      )}
    </div>
  );
};
