import React from "react";
import HashLoader from "react-spinners/HashLoader";

function SuspenseLoader() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "black",
      }}
    >
      <HashLoader color="#FF7373" />
    </div>
  );
}

export default SuspenseLoader;
