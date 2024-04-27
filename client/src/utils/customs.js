import all from "../assets/all.png";
import food from "../assets/food.png";
import travel from "../assets/trave.png";
import technology from "../assets/technology.png";
import movies from "../assets/movies.png";
import health from "../assets/health-fitness-cartoon_24640-25737.png";
export const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.90)",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    minWidth: "280px",
    maxWidth: "38vw",
    minHeight: "40vh",
    borderRadius: "25px",
  },
};
export const customStyles2 = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.90)",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    minWidth: "300px",
    // maxWidth: "45vw",
    minHeight: "40vh",
    borderRadius: "25px",
  },
};
export const customStyles3 = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.90)",
  },
  content: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "8px",
    border: "none",
    padding: "0",
    backgroundColor: "transparent",
  },
};

export const categories = [
  { name: "All", imageSrc: all },
  { name: "Food", imageSrc: food },
  { name: "Technology", imageSrc: technology },
  { name: "Fitness", imageSrc: health },
  { name: "Travel", imageSrc: travel },
  { name: "Movies", imageSrc: movies },
];
