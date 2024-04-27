import React, { useEffect, useState } from "react";
import { Modal } from "@mantine/core";
import styles from "./viewStory.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import { FaHeart, FaRegHeart, FaShare } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";
import newRequest from "../../utils/newRequest";
import { useSelector, useDispatch } from "react-redux";
import { updateBookmarks, likeDislikePost } from "../../redux/userSlice";
import { useMediaQuery } from "@mantine/hooks";
import { LoginModal } from "../modals/loginModal/LoginModal";

export const ViewStory = ({
  openViewStoryModal,
  setOpenViewStoryModal,
  storyIdTrue,
  singleStory,
}) => {
  const searchParams = useParams();
  const { storyId } = searchParams;

  const [openLoginModal, setOpenLoginModal] = useState(false);

  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [story, setStory] = useState(singleStory);

  useEffect(() => {
    if (storyId) {
      const fetchStory = async () => {
        try {
          const res = await newRequest.get(`/post/${storyId}`);
          setStory(res?.data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchStory();
    }
  }, [storyId]);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    if (storyIdTrue) {
      setOpenViewStoryModal(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyId]);

  const handleNextSlide = () => {
    if (currentSlideIndex < story?.post.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  useEffect(() => {
    if (openViewStoryModal) {
      setCurrentSlideIndex(0);
    }
  }, [openViewStoryModal]);

  const handlePreviousSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNextSlide();
    }, 3000);

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlideIndex]);

  const navigate = useNavigate();

  const handleCopyStoryLink = () => {
    navigator.clipboard.writeText(
      `https://swiptory-frontend-three.vercel.app/viewStory/${story?._id}`
    );
    toast.success("Link copied successfully!");
  };

  const handleBookmark = async () => {
    if (!currentUser) {
      setOpenLoginModal(true);
    }

    try {
      const res = await newRequest.put(`/user/${story?._id}`);
      dispatch(updateBookmarks(story._id));
      toast.success(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLikeDislike = async () => {
    if (!currentUser) {
      setOpenLoginModal(true);
    }
    try {
      const res = await newRequest.put(`/user/likeUnlike/${story?._id}`);
      dispatch(likeDislikePost(story?._id));
      toast.success(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const isMobile = useMediaQuery("(max-width: 600px)");

  return (
    <>
      <Modal
        opened={openViewStoryModal}
        onClose={() => setOpenViewStoryModal(false)}
        closeOnClickOutside={false}
        withCloseButton={false}
        centered
        padding={0}
        size="sm"
        fullScreen={isMobile}
        overlayProps={{
          backgroundOpacity: 0.7,
          blur: 3,
          children: [
            <FaChevronLeft
              key={101}
              onClick={handlePreviousSlide}
              style={{
                position: "absolute",
                top: "50%",
                left: "22%",
                color: "white",
                cursor: "pointer",
              }}
              size={55}
            />,
            <FaChevronRight
              key={102}
              onClick={handleNextSlide}
              style={{
                position: "absolute",
                top: "50%",
                right: "22%",
                color: "white",
                cursor: "pointer",
              }}
              size={55}
            />,
          ],
        }}
      >
        <div className={styles.story}>
          <div className={styles.progressBarContainer}>
            {story?.post?.map((s, i) => {
              const isCompleted = i <= currentSlideIndex;
              const isActive = i === currentSlideIndex;
              return (
                <div
                  key={i}
                  className={`${styles.progressBar} ${
                    isCompleted ? styles.progressBarCompleted : ""
                  } ${isActive ? styles.progressBarActive : ""}`}
                ></div>
              );
            })}
          </div>

          <div>
            <div
              className={styles.closeIcon}
              onClick={() => {
                setOpenViewStoryModal(false);
                navigate("/");
              }}
            >
              <IoClose size={25} />
            </div>
            <div className={styles.shareIcon} onClick={handleCopyStoryLink}>
              <FaShare size={25} />
            </div>
          </div>

          <img
            src={story?.post[currentSlideIndex]?.imgUrl}
            alt=""
            className={styles.storyImage}
            onClick={(e) => {
              const { offsetX } = e.nativeEvent;
              const { width } = e.target.getBoundingClientRect();
              if (isMobile) {
                if (offsetX < width / 2) {
                  handlePreviousSlide();
                } else {
                  handleNextSlide();
                }
              }
            }}
          />

          <div>
            <h6 className={styles.title}>
              {story?.post[currentSlideIndex]?.heading}
            </h6>
            <p className={styles.desc}>
              {story?.post[currentSlideIndex]?.description}
            </p>
          </div>

          <div className={styles.iconDiv}>
            {currentUser?.bookmarks.includes(story?._id) ? (
              <FaBookmark
                onClick={handleBookmark}
                className={styles.bookmarkActiveIcon}
                size={30}
              />
            ) : (
              <FaBookmark
                onClick={handleBookmark}
                className={styles.bookmarkIcon}
                size={30}
              />
            )}
            <div>
              {currentUser?.liked.includes(story?._id) ? (
                <FaHeart
                  onClick={handleLikeDislike}
                  className={styles.heartActiveIcon}
                  size={30}
                />
              ) : (
                <FaRegHeart
                  onClick={handleLikeDislike}
                  className={styles.heartIcon}
                  size={30}
                />
              )}
              <p className={styles.numberOfLikes}>{story?.likes.length}</p>
            </div>
          </div>
        </div>

        <LoginModal
          openLoginModal={openLoginModal}
          setOpenLoginModal={setOpenLoginModal}
        />
      </Modal>
    </>
  );
};
