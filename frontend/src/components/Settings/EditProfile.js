import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./EditProfile.module.css";
import { ProfilePicture } from "../Elements";
import { editProfile } from "../../store/session";
import { normalizeErrors } from "../Utils";
import SuccessPopup from "./SuccessPopup";

const EditProfile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const [profilePicture, setProfilePicture] = useState(user?.profile_picture);
  const [username, setUsername] = useState(user?.username);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [disableSubmit, setDisableSubmit] = useState(true);

  const updateProfilePicture = (e) => setProfilePicture(e.target.value);
  const updateUsername = (e) => setUsername(e.target.value);
  const enableSubmit = () => setDisableSubmit(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      profilePicture,
      username,
    };

    const res = await dispatch(editProfile(data));

    if (res) {
      const errors = normalizeErrors(res);
      setErrors(errors);
      setSuccess(false);
    } else {
      setErrors({});
      setSuccess(true);
      setDisableSubmit(true);
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
        className={styles.editProfileForm}
        onSubmit={handleSubmit}
        onChange={enableSubmit}
      >
        <div className={styles.fieldContainer}>
          <div className={styles.labelContainer}>
            <ProfilePicture user={user} size={"medium"} />
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="profilePicture">Change profile photo</label>
            <input
              id="profilePicture"
              type="text"
              value={profilePicture}
              onChange={updateProfilePicture}
            />
          </div>
        </div>
        <div className={styles.fieldContainer}>
          <div className={styles.labelContainer}>
            <label htmlFor="username">Username</label>
          </div>
          <div className={styles.inputContainer}>
            <input
              id="username"
              type="text"
              value={username}
              maxLength={30}
              onChange={updateUsername}
            />
          </div>
        </div>
        <div className={styles.fieldContainer}>
          {/* <div className={styles.labelContainer}></div> */}
          <div className={styles.buttonContainer}>
            <button
              className={`${styles.submitButton} ${
                disableSubmit && styles.disableSubmit
              }`}
              type="submit"
              disabled={disableSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </form>
      {success && <SuccessPopup message={"Profile Saved."} />}
    </>
  );
};

export default EditProfile;
