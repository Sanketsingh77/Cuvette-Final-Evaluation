import React, { useEffect, useState } from "react";
import styles from "./addStory.module.css";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { categories } from "../../../utils/customs";
import storyApi from "../../../api/storiesApi";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";

function AddStory({ action, modalClose, storyId }) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const initialSlides = [
    { _id: uuidv4(), category: "", title: "", description: "", imageURL: "" },
    { _id: uuidv4(), category: "", title: "", description: "", imageURL: "" },
    { _id: uuidv4(), category: "", title: "", description: "", imageURL: "" },
  ];
  const [slidesArray, setSlidesArray] = useState(initialSlides);
  const handleAddSlide = () => {
    if (slidesArray.length > 5) {
      return;
    }
    const newSlide = {
      _id: uuidv4(),
      category: "",
      title: "",
      description: "",
      imageURL: "",
    };
    setSlidesArray([...slidesArray, newSlide]);
  };
  const handleRemoveSlide = (id) => {
    const updatedSlides = slidesArray.filter((slide) => slide._id !== id);
    setSlidesArray(updatedSlides);
  };

  const handlePreviousSlide = () => {
    setCurrentSlideIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prevIndex) =>
      Math.min(prevIndex + 1, slidesArray.length - 1)
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSlidesArray((prevSlides) => {
      return prevSlides.map((slide, index) => {
        if (index === currentSlideIndex) {
          return {
            ...slide,
            [name]: value,
          };
        }
        return slide;
      });
    });
  };
  const fetchStoryData = async () => {
    try {
      const res = await storyApi.getStory(storyId);
      const fetchedSlides = res?.slides || [];
      setSlidesArray(fetchedSlides);
    } catch (error) {
      console.log(error);
    }
  };
  const updateStory = async () => {
    try {
      const slidesWithoutId = {
        slides: slidesArray.map((slide) => ({
          category: slide.category,
          title: slide.title,
          description: slide.description,
          imageURL: slide.imageURL,
        })),
      };
      const res = await storyApi.updateStory(storyId, slidesWithoutId);
      if (res?.message == "success") {
        toast.success("Story updated!");
        modalClose();
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const postNewStory = async () => {
    if (
      slidesArray.length < 3 ||
      slidesArray.some(
        (slide) =>
          !slide.category ||
          !slide.title ||
          !slide.description ||
          !slide.imageURL
      )
    ) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      const slidesWithoutId = {
        slides: slidesArray.map((slide) => ({
          category: slide.category,
          title: slide.title,
          description: slide.description,
          imageURL: slide.imageURL,
        })),
      };
      const res = await storyApi.addStory(slidesWithoutId);
      if (res.message == "success") {
        modalClose();
        toast.success("New story added");
      } else {
        toast.error("Error while posting!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handlePostStory = async () => {
    if (action == "add") {
      postNewStory();
    } else {
      updateStory();
    }
  };
  useEffect(() => {
    if (action == "update") {
      fetchStoryData();
    }
  }, []);

  return (
    <div className={styles.addStoryContainer}>
      <span className={styles.span1}>Add upto 6 slides</span>
      <IoMdCloseCircleOutline
        size={40}
        color="#FF0000"
        className={styles.modalCloseIcon}
        onClick={modalClose}
      />
      <div className={styles.titleText}>Add Story to Feed</div>

      <div className={styles.formContainer}>
        <div className={styles.slidesContainer}>
          {slidesArray.map((slide, index) => (
            <button
              onClick={() => setCurrentSlideIndex(index)}
              className={`${styles.slide} ${
                currentSlideIndex === index ? styles.activeSlide : ""
              }`}
              key={slide._id}
            >
              Slide {index + 1}
              {index > 2 && (
                <IoMdCloseCircleOutline
                  className={styles.slideCloseIcon}
                  size={20}
                  color="#FF0000"
                  onClick={() => handleRemoveSlide(slide._id)}
                />
              )}
            </button>
          ))}
          <button className={styles.addSlideBtn} onClick={handleAddSlide}>
            Add +
          </button>
        </div>
        <div className={styles.storyForm}>
          <div className={styles.inputGroup}>
            <label htmlFor="title">Heading</label>
            <input
              type="text"
              name="title"
              placeholder="Your heading"
              spellCheck={false}
              onChange={handleInputChange}
              value={slidesArray[currentSlideIndex]?.title || ""}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              type="text"
              name="description"
              placeholder="Description"
              spellCheck={false}
              required
              onChange={handleInputChange}
              value={slidesArray[currentSlideIndex]?.description || ""}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="imageURL">Image URL</label>
            <input
              type="text"
              name="imageURL"
              placeholder="Add Image url"
              spellCheck={false}
              onChange={handleInputChange}
              value={slidesArray[currentSlideIndex]?.imageURL || ""}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="category">Category</label>
            <select
              name="category"
              value={slidesArray[currentSlideIndex]?.category || ""}
              onChange={handleInputChange}
            >
              <option value="" disabled selected>
                Select Category
              </option>
              {categories.slice(1).map((item) => (
                <option key={item.name}>{item.name}</option>
              ))}
            </select>
            <span className={styles.span2}>
              This field will be common for all slides
            </span>
          </div>
          <div className={styles.btnsContainer}>
            <div className={styles.btnGroup}>
              <button
                className={styles.previousBtn}
                onClick={handlePreviousSlide}
              >
                Previous
              </button>
              <button className={styles.nextBtn} onClick={handleNextSlide}>
                Next
              </button>
            </div>
            <button className={styles.postBtn} onClick={handlePostStory}>
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddStory;
