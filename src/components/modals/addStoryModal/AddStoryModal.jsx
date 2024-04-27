import React, { useState } from "react";
import styles from "./addStoryModal.module.css";
import modalCloseIcon from "../../../assets/modalCloseIcon.jpg";
import { Modal } from "@mantine/core";
import newRequest from "../../../utils/newRequest";
import toast from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Slide = ({
  slideCount,
  activeSlideIdx,
  handleSlideClick,
  handleAddSlide,
  handleDeleteSlide,
}) => (
  <div className={styles.slideContainer}>
    <p className={styles.heading}>Add upto 6 slides</p>
    <div className={styles.allSlides}>
      {[...Array(slideCount)].map((_, index) => (
        <div
          key={index}
          onClick={() => handleSlideClick(index + 1)}
          style={{
            border:
              index + 1 === activeSlideIdx
                ? "2px solid #73ABFF"
                : "2px solid transparent",
          }}
          className={styles.slideNumber}
        >
          Slide {index + 1}
          {activeSlideIdx === index + 1 && (
            <img
              onClick={async () => {
                if (index + 1 === slideCount) {
                  await handleSlideClick(index + 1);
                  handleDeleteSlide(index + 1);
                } else {
                  handleDeleteSlide(index + 1);
                }
              }}
              className={styles.modalCloseIcon}
              src={modalCloseIcon}
              alt="closeBtn"
            />
          )}
        </div>
      ))}
      {slideCount < 6 && (
        <div
          onClick={() => {
            handleAddSlide();
          }}
          className={styles.addSlide}
        >
          Add +
        </div>
      )}
    </div>
  </div>
);

const Form = ({
  postData,
  activeSlideIdx,
  handleHeadingChange,
  handleDescriptionChange,
  handleImageChange,
  handleCategoryChange,
}) => {
  if (activeSlideIdx > postData.slides.length) {
    return null;
  }

  return (
    <div className={styles.formContainer}>
      <div>
        <label>Heading:</label>
        <input
          onChange={(e) => {
            handleHeadingChange(activeSlideIdx, e.target.value);
          }}
          value={postData.slides[activeSlideIdx - 1].heading}
          type="text"
          placeholder="Your heading"
        />
      </div>
      <div>
        <label>Description:</label>
        <textarea
          onChange={(e) => {
            handleDescriptionChange(activeSlideIdx, e.target.value);
          }}
          value={postData.slides[activeSlideIdx - 1].description}
          placeholder="Story description"
        ></textarea>
      </div>
      <div>
        <label>Image:</label>
        <input
          onChange={(e) => {
            handleImageChange(activeSlideIdx, e.target.value);
          }}
          value={postData.slides[activeSlideIdx - 1].imgUrl}
          type="text"
          placeholder="Add Image Url"
        />
      </div>
      <div>
        <label>Category:</label>
        <select
          onChange={(e) => {
            handleCategoryChange(activeSlideIdx, e.target.value);
          }}
          value={postData.slides[activeSlideIdx - 1].category}
        >
          <option value="">Select Category</option>
          <option value="food">Food</option>
          <option value="health">Health and Fitness</option>
          <option value="travel">Travel</option>
          <option value="movies">Movies</option>
          <option value="education">Education</option>
        </select>
      </div>
    </div>
  );
};

const AddStory = ({
  openCreateStoryModal,
  setOpenCreateStoryModal,
  singleStory,
}) => {
  const [activeSlideIdx, setActiveSlideIdx] = useState(1);
  const [slideCount, setSlideCount] = useState(3);
  const [postData, setPostData] = useState(
    singleStory
      ? { slides: singleStory?.post }
      : {
          slides: [
            {
              heading: "",
              description: "",
              imgUrl: "",
              category: "",
            },
            {
              heading: "",
              description: "",
              imgUrl: "",
              category: "",
            },
            {
              heading: "",
              description: "",
              imgUrl: "",
              category: "",
            },
          ],
        }
  );
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAddSlide = () => {
    setSlideCount(slideCount + 1);
    setActiveSlideIdx(slideCount + 1);
    const newPostData = { ...postData };
    newPostData.slides.push({
      heading: "",
      description: "",
      imgUrl: "",
      category: "",
    });
    setPostData(newPostData);
    if (slideCount >= 3) {
      setShowError(false);
      setErrorMessage("");
    }
  };

  const handleSlideClick = (index) => {
    setActiveSlideIdx(index);
  };

  const handleHeadingChange = (index, value) => {
    const newPostData = { ...postData };
    newPostData.slides[index - 1].heading = value;
    setPostData(newPostData);
  };

  const handleDescriptionChange = (index, value) => {
    const newPostData = { ...postData };
    newPostData.slides[index - 1].description = value;
    setPostData(newPostData);
  };

  const handleImageChange = (index, value) => {
    const newPostData = { ...postData };
    newPostData.slides[index - 1].imgUrl = value;
    setPostData(newPostData);
  };

  const handleCategoryChange = (index, value) => {
    const newPostData = { ...postData };

    const modifiedPostData = newPostData.slides.reduce((acc, obj) => {
      const modifiedObj = { ...obj, category: value };
      acc.push(modifiedObj);
      return acc;
    }, []);

    setPostData({ slides: modifiedPostData });
  };

  const handleDeleteSlide = (index) => {
    if (slideCount === 3) {
      setShowError(true);
      setErrorMessage("You need to have at least 3 slides");
      return;
    }
    if (index === postData.slides.length) {
      setActiveSlideIdx(index - 1);
    }

    const newPostData = { ...postData };
    newPostData.slides.splice(index - 1, 1);

    if (index === activeSlideIdx) {
      setActiveSlideIdx(Math.max(index - 1, 1));
    } else if (index < activeSlideIdx) {
      setActiveSlideIdx(activeSlideIdx - 1);
    }

    setSlideCount(slideCount - 1);
    setPostData(newPostData);
  };

  const [inProcess, setInProcess] = useState(false);

  const handlePost = async () => {
    const error = postData.slides.some(
      (slide) =>
        slide.heading === "" ||
        slide.description === "" ||
        slide.imgUrl === "" ||
        slide.category === ""
    );

    if (slideCount < 3) {
      setShowError(true);
      setErrorMessage("You need to have atleast 3 slides.");
      return;
    }

    if (error) {
      setShowError(true);
      setErrorMessage("Please fill all the fields.");
      return;
    }

    setShowError(false);
    setErrorMessage("");

    setInProcess(true);
    try {
      const dataToSend = {
        post: postData.slides,
        category: postData.slides[0].category,
      };

      const res = await newRequest.post(`/post/`, dataToSend);

      console.log(res.data);
      toast.success(res?.data?.message);
      setOpenCreateStoryModal(false);
    } catch (error) {
      setShowError(true);
      console.log(error);
      setErrorMessage("Something went wrong!");
    } finally {
      setInProcess(false);
    }
  };

  const handleUpdate = async () => {
    const error = postData.slides.some(
      (slide) =>
        slide.heading === "" ||
        slide.description === "" ||
        slide.imgUrl === "" ||
        slide.category === ""
    );

    if (slideCount < 3) {
      setShowError(true);
      setErrorMessage("You need to have atleast 3 slides.");
      return;
    }

    if (error) {
      setShowError(true);
      setErrorMessage("Please fill all the fields.");
      return;
    }

    setShowError(false);
    setErrorMessage("");

    setInProcess(true);
    try {
      const dataToSend = {
        post: postData.slides,
        category: postData.slides[0].category,
      };

      const res = await newRequest.put(`/post/${singleStory._id}`, dataToSend);

      //  console.log(res.data);
      toast.success(res?.data?.message);
      setOpenCreateStoryModal(false);
    } catch (error) {
      setShowError(true);
      console.log(error);
      setErrorMessage("Something went wrong!");
    } finally {
      setInProcess(false);
    }
  };

  return (
    <Modal
      opened={openCreateStoryModal}
      onClose={() => setOpenCreateStoryModal(false)}
      closeOnClickOutside
      withCloseButton={false}
      centered
      size="lg"
    >
      <img
        src={modalCloseIcon}
        alt=""
        className={styles.modalCloseIcon}
        onClick={() => setOpenCreateStoryModal(false)}
      />
      <div className={styles.slideForm}>
        <Slide
          slideCount={slideCount}
          activeSlideIdx={activeSlideIdx}
          handleSlideClick={handleSlideClick}
          handleAddSlide={handleAddSlide}
          handleDeleteSlide={handleDeleteSlide}
        />
        <Form
          postData={postData}
          activeSlideIdx={activeSlideIdx}
          handleHeadingChange={handleHeadingChange}
          handleDescriptionChange={handleDescriptionChange}
          handleImageChange={handleImageChange}
          handleCategoryChange={handleCategoryChange}
        />
      </div>
      {showError && <div className={styles.error}>{errorMessage}</div>}
      <div className={styles.btnContainer}>
        <div className={styles.leftBtnContainer}>
          <button
            onClick={() => {
              setActiveSlideIdx(activeSlideIdx - 1);
              if (activeSlideIdx === 1) {
                setActiveSlideIdx(1);
              }
            }}
            className={styles.prevBtn}
          >
            Previous
          </button>
          <button
            onClick={() => {
              setActiveSlideIdx(activeSlideIdx + 1);
              if (activeSlideIdx === slideCount) {
                setActiveSlideIdx(slideCount);
              }
            }}
            className={styles.nextBtn}
          >
            Next
          </button>
        </div>
        <div>
          {singleStory ? (
            <button
              disabled={inProcess}
              className={styles.postBtn}
              onClick={handleUpdate}
            >
              {inProcess ? (
                <AiOutlineLoading3Quarters className={styles.loadingIcon} />
              ) : (
                "Update"
              )}
            </button>
          ) : (
            <button
              disabled={inProcess}
              className={styles.postBtn}
              onClick={handlePost}
            >
              {inProcess ? (
                <AiOutlineLoading3Quarters className={styles.loadingIcon} />
              ) : (
                "Post"
              )}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AddStory;
