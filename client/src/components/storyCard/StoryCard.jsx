import React, { useState } from "react";
import styles from "./storyCard.module.css";
import Modal from "react-modal";
import { FiEdit } from "react-icons/fi";
import AddStory from "../modals/addStoryModal/AddStory";
import { customStyles2, customStyles3 } from "../../utils/customs";
import ViewStory from "../viewStory/ViewStory";
function StoryCard({ title, description, image, editable, storyId }) {
  const [editModal, seteditModal] = useState(false);
  const [ViewModal, setViewModal] = useState(false);
  return (
    <>
      <div
        className={styles.storyCard}
        onClick={() => setViewModal(true)}
        style={{
          backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.8) 20%, rgba(0, 0, 0, 0) 50%), url(${image})`,
        }}
      >
        <div className={styles.storyData}>
          {/* <img src={image} alt="" /> */}
          <div className={styles.storyTitle}>{title}</div>
          <div className={styles.storyDescription}>{description}</div>
        </div>
        {editable && (
          <button
            className={styles.editBtn}
            onClick={(e) => {
              e.stopPropagation();
              seteditModal(true);
            }}
          >
            <FiEdit /> Edit
          </button>
        )}
      </div>
      <Modal
        isOpen={editModal}
        ariaHideApp={false}
        onRequestClose={() => seteditModal(false)}
        style={customStyles2}
      >
        <AddStory
          action={"update"}
          storyId={storyId}
          modalClose={() => seteditModal(false)}
        />
      </Modal>
      <Modal
        isOpen={ViewModal}
        ariaHideApp={false}
        onRequestClose={() => setViewModal(false)}
        style={customStyles3}
      >
        <ViewStory
          storyId={storyId}
          modalClose={() => {
            setViewModal(false);
          }}
        />
      </Modal>
    </>
  );
}

export default StoryCard;
