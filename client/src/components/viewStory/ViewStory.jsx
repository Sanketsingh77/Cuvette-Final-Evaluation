import React, { useContext, useEffect, useState } from "react";
import styles from "./viewStory.module.css";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { LuSend } from "react-icons/lu";
import storyApi from "../../api/storiesApi";
import { GoHeartFill } from "react-icons/go";
import { IoBookmark } from "react-icons/io5";
import debounce from "lodash/debounce";
import Modal from "react-modal";
import AuthModal from "../modals/authmodal/AuthModal";
import toast from "react-hot-toast";
import ProgressBar from "../progressbar/ProgressBar";
import { customStyles } from "../../utils/customs";
import { LoadingContext } from "../../layouts/Applayout";
function ViewStory({ storyId, modalClose }) {
  const [storyData, setstoryData] = useState(null);
  const [slides, setslides] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [authModal, setauthModal] = useState(false);
  const { loggedIn } = useContext(LoadingContext);
  const debouncedBookmark = debounce(async () => {
    if (storyData) {
      await storyApi.bookmarkStory(storyData._id);
    }
  }, 500);
  const debouncedLike = debounce(async () => {
    if (storyData) {
      await storyApi.likeStory(storyData._id);
    }
  }, 500);
  const fetchStoryData = async () => {
    const res = await storyApi.getStory(storyId);
    setstoryData(res);
    setslides(res?.slides);
  };
  useEffect(() => {
    fetchStoryData();
  }, []);
  if (slides.length === 0) {
    return <div></div>;
  }
  const handlePreviousSlide = () => {
    setCurrentSlideIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prevIndex) =>
      Math.min(prevIndex + 1, slides.length - 1)
    );
  };
  const handleLike = async () => {
    if (!loggedIn) {
      return setauthModal(true);
    }
    const newLikedState = !storyData.liked;
    setstoryData((prevData) => ({
      ...prevData,
      liked: newLikedState,
      likes: newLikedState
        ? [...prevData.likes, "newLike"]
        : prevData.likes.filter(
            (like, index) => index !== prevData.likes.length - 1
          ),
    }));
    debouncedLike();
  };

  const handleBookmark = async () => {
    if (!loggedIn) {
      return setauthModal(true);
    }
    setstoryData((prevData) => ({
      ...prevData,
      bookmarked: !prevData.bookmarked,
    }));
    debouncedBookmark();
  };
  const handleShare = () => {
    const link = `${import.meta.env.VITE_APP_URL}/View-Story/${storyId}`;
    navigator.clipboard.writeText(link).then(() => {
      toast.success("Link Copied to Clipboard!");
    });
  };
  const handleProgressComplete = () => {
    setCurrentSlideIndex((prev) => Math.min(slides.length - 1, prev + 1));
    // setCurrentSlideIndex((prev) => {
    //   const nextIndex = slides.length - 1 ? prev : prev + 1;
    //   return nextIndex;
    // });
  };

  return (
    <>
      <div className={styles.ViewCardContainer}>
        <FaAngleLeft
          size={90}
          className={styles.arrow1}
          onClick={handlePreviousSlide}
        />
        <div
          className={styles.viewStoryCard}
          style={{
            backgroundImage: ` linear-gradient(0deg, rgb(0, 0, 0) 20%, rgba(0, 0, 0, 0) 40%), linear-gradient(rgb(0, 0, 0) 14%, rgba(0, 0, 0, 0) 30%), url(${slides[currentSlideIndex].imageURL})`,
          }}
        >
          <div>
            <div className={styles.progressbarContainer}>
              {slides.map((slide, index) => (
                <ProgressBar
                  key={index}
                  isActive={index === currentSlideIndex}
                  isCompleted={index < currentSlideIndex}
                  onComplete={handleProgressComplete}
                />
              ))}
            </div>
            <div className={styles.iconsGroup}>
              <IoClose
                size={35}
                className={styles.closeIcon}
                onClick={modalClose}
              />
              <LuSend
                size={26}
                className={styles.shareIcon}
                onClick={handleShare}
              />
            </div>
          </div>
          <div style={{ padding: "0.4rem" }}>
            <h3>{slides[currentSlideIndex].title}</h3>
            <p className={styles.description}>
              {slides[currentSlideIndex].description}
            </p>
            <div className={styles.iconsGroup}>
              <div>
                {storyData.bookmarked ? (
                  <IoBookmark color="blue" size={35} onClick={handleBookmark} />
                ) : (
                  <IoBookmark size={35} onClick={handleBookmark} />
                )}
              </div>
              <div className={styles.likeContainer}>
                {storyData?.liked ? (
                  <GoHeartFill color="red" size={35} onClick={handleLike} />
                ) : (
                  <GoHeartFill size={35} onClick={handleLike} />
                )}
                <span>{storyData?.likes?.length}</span>
              </div>
            </div>
          </div>
          <div className={styles.arrowLeft} onClick={handlePreviousSlide}></div>
          <div className={styles.arrowRight} onClick={handleNextSlide}></div>
        </div>
        <FaAngleRight
          size={90}
          className={styles.arrow2}
          onClick={handleNextSlide}
        />
      </div>
      <Modal
        isOpen={authModal}
        style={customStyles}
        ariaHideApp={false}
        onRequestClose={() => setauthModal(false)}
      >
        <AuthModal action={"Login"} modalClose={() => setauthModal(false)} />
      </Modal>
    </>
  );
}

export default ViewStory;
