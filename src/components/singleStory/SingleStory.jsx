import React, { useState } from "react";
import styles from "./singleStory.module.css";
import { ViewStory } from "../viewStory/ViewStory";
import NoImage from "../../assets/No-Image-Placeholder.svg.png";
import { TbEdit } from "react-icons/tb";
import { useSelector } from "react-redux";
import AddStory from "../modals/addStoryModal/AddStoryModal";

export const SingleStory = ({ singleStory }) => {
  const [openViewStoryModal, setOpenViewStoryModal] = useState(false);

  const [openCreateStoryModal, setOpenCreateStoryModal] = useState(false);

  const { currentUser } = useSelector((state) => state.user);

  return (
    <>
      <div className={styles.singleStory}>
        <img
          onClick={() => setOpenViewStoryModal(true)}
          src={
            singleStory?.post[0]?.imgUrl
              ? singleStory?.post[0]?.imgUrl
              : NoImage
          }
          alt=""
          className={styles.storyImage}
        />
        <div className={styles.dark}></div>
        <div className={styles.storyContent}>
          <h6 className={styles.storyTitle}>{singleStory?.post[0]?.heading}</h6>
          <p className={styles.storyDesc}>
            {singleStory?.post[0]?.description}
          </p>
        </div>

        {currentUser && currentUser?._id === singleStory?.userId && (
          <div
            className={styles.editBtn}
            onClick={() => setOpenCreateStoryModal(true)}
          >
            <TbEdit size={21} />
            Edit
          </div>
        )}

        <AddStory
          openCreateStoryModal={openCreateStoryModal}
          setOpenCreateStoryModal={setOpenCreateStoryModal}
          singleStory={singleStory}
        />
      </div>

      <ViewStory
        openViewStoryModal={openViewStoryModal}
        setOpenViewStoryModal={setOpenViewStoryModal}
        singleStory={singleStory}
        // storyIdTrue={true}
      />
    </>
  );
};
