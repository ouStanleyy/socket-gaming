import { useDispatch, useSelector } from "react-redux";
import { ProfilePicture } from "../Elements";
import styles from "./EditProfile.module.css";
import stylesPassword from "./ChangePassword.module.css";
import { useState, useEffect } from "react";
import SuccessPopup from "./SuccessPopup";
import { updatePassword } from "../../store/session";
import { normalizeErrors } from "../Utils";

const ChangePassword = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [disableButton, setDisableButton] = useState(true);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const updateOldPassword = (e) => setOldPassword(e.target.value);
  const updateNewPassword = (e) => setNewPassword(e.target.value);
  const updateConfirmPassword = (e) => setConfirmPassword(e.target.value);
  const enableButton = (e) => setDisableButton(false);

  useEffect(() => {
    if (oldPassword.length && newPassword.length && confirmPassword.length) {
      setDisableButton(false);
    }
  }, [oldPassword, newPassword, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword === confirmPassword) {
      const res = await dispatch(
        updatePassword({
          oldPassword,
          newPassword,
        })
      );

      if (res) {
        const errors = normalizeErrors(res);
        setErrors(errors);
        setSuccess(false);
      } else {
        setErrors({});
        setSuccess(true);
        setDisableButton(true);
      }
    }
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <>
      <form
        className={stylesPassword.changePasswordForm}
        onChange={enableButton}
        onSubmit={handleSubmit}
      >
        <div
          className={`${styles.fieldContainer} ${stylesPassword.profileContainer}`}
        >
          <div className={`${styles.labelContainer}`}>
            <ProfilePicture user={user} size={"small"} />
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="profilePicture" className={stylesPassword.username}>
              {user?.username}
            </label>
          </div>
        </div>
        <div className={styles.fieldContainer}>
          <div className={styles.labelContainer}>
            <label htmlFor="oldPassword">Old password</label>
          </div>
          <div className={styles.inputContainer}>
            <input
              id="oldPassword"
              type="password"
              value={oldPassword}
              maxLength={15}
              onChange={updateOldPassword}
            />
          </div>
        </div>
        <div className={styles.fieldContainer}>
          <div className={styles.labelContainer}>
            <label htmlFor="newPassword">New password</label>
          </div>
          <div className={styles.inputContainer}>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              maxLength={15}
              onChange={updateNewPassword}
            />
          </div>
        </div>
        <div className={styles.fieldContainer}>
          <div className={styles.labelContainer}>
            <label htmlFor="confirmPassword">Confirm new password</label>
          </div>
          <div className={styles.inputContainer}>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              maxLength={15}
              onChange={updateConfirmPassword}
            />
          </div>
        </div>
        <div className={styles.fieldContainer}>
          <div className={styles.labelContainer}></div>
          <button
            disabled={disableButton}
            className={`${stylesPassword.changePasswordButton} ${
              disableButton && stylesPassword.disabledButton
            }`}
          >
            Change password
          </button>
        </div>
      </form>
      {success && <SuccessPopup message={"Password Updated."} />}
    </>
  );
};

export default ChangePassword;
