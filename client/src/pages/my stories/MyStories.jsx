import React from "react";
import StoriesContainer from "../../components/storiesContainer/StoriesContainer";

function MyStories() {
  return (
    <div style={{ height: "100vh", overflowY: "auto" }}>
      <StoriesContainer category={"My Stories"} />
    </div>
  );
}

export default MyStories;
