import { Modal } from "@mantine/core";
import styles from "./loginModal.module.css";
import { useState } from "react";
import { FaEyeSlash } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useDispatch } from "react-redux";
import { loginSuccess, loginFailure } from "../../../redux/userSlice";
import newRequest from "../../../utils/newRequest";
import toast from "react-hot-toast";

export const LoginModal = ({ openLoginModal, setOpenLoginModal }) => {
  const [showPassword, setShowPassword] = useState(false);
  const showUserPassword = () => {
    setShowPassword(!showPassword);
  };
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await newRequest.post(`/auth/login`, {
        username,
        password,
      });
      dispatch(loginSuccess(res.data));
      setOpenLoginModal(false);
      toast.success("Logged in successfully!");
      // console.log(res.data);
    } catch (error) {
      setError(error?.response?.data?.message);
      console.log(error?.response?.data?.message);
      dispatch(loginFailure());
    }
  };

  return (
    <Modal
      opened={openLoginModal}
      onClose={() => setOpenLoginModal(false)}
      closeOnClickOutside
      withCloseButton={false}
      centered
    >
      <p className={styles.title}>Login to SwipTory</p>
      <IoIosCloseCircleOutline
        className={styles.closeBtn}
        onClick={() => setOpenLoginModal(false)}
        size={30}
      />

      <form className={styles.modal} onSubmit={handleSubmit}>
        <div className={styles.modal_input}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder="username"
            // required
            name="username"
            autoComplete="off"
            autoFocus
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className={styles.modal_input}>
          <label htmlFor="password">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="Password"
            name="password"
            autoComplete="off"
            onChange={(e) => setPassword(e.target.value)}
          />
          {showPassword ? (
            <FaEye className={styles.icon} onClick={showUserPassword} />
          ) : (
            <FaEyeSlash className={styles.icon} onClick={showUserPassword} />
          )}
        </div>

        <p className={styles.error}>{error}</p>

        <div className={styles.modal_btn_div}>
          <button type="submit" className={styles.modalBtn}>
            Login
          </button>
        </div>
      </form>
    </Modal>
  );
};
