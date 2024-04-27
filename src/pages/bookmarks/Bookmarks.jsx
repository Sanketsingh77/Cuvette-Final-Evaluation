import React, { useEffect, useState } from "react";
import styles from "./bookmarks.module.css";
import { Stories } from "../../components/stories/Stories";
import newRequest from "../../utils/newRequest";

const Bookmarks = () => {
  const [showMore, setShowMore] = useState(false);
  const [currDataLen, setCurrDataLen] = useState(4);
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await newRequest.get(`/user/allbookmarks`);
        setBookmarks(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.stories}>
        <h4 className={styles.heading}>Your Bookmarks</h4>
        <Stories
          story={
            showMore
              ? bookmarks.slice(0, bookmarks.length)
              : bookmarks.slice(0, 4)
          }
        />

        {bookmarks.length >= 5 && currDataLen !== bookmarks.length && (
          <button
            onClick={() => {
              setShowMore(true);
              setCurrDataLen(bookmarks.length);
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

export default Bookmarks;
