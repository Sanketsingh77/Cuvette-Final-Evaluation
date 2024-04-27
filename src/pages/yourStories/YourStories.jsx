import React, { useEffect, useState } from "react";
import styles from "./yourStories.module.css";
import { Stories } from "../../components/stories/Stories";
import newRequest from "../../utils/newRequest";

const YourStories = () => {
  const [data, setData] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [currDataLen, setCurrDataLen] = useState(4);

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
      <div className={styles.story}>
        <h4 className={styles.storyCat}>Your Stories</h4>

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
    </div>
  );
};

export default YourStories;
