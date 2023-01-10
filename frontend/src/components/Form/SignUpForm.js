import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { signUp } from "../../store/session";
import styles from "./SignUpForm.module.css";
import { normalizeErrors } from "../Utils";

const SignUpForm = () => {
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  // const [email, setEmail] = useState("");
  // const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [disableSubmit, setDisableSubmit] = useState(true);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // const updateEmail = (e) => setEmail(e.target.value);
  // const updateFullName = (e) => setFullName(e.target.value);
  const updateUsername = (e) => setUsername(e.target.value);
  const updatePassword = (e) => setPassword(e.target.value);
  const updateRepeatPassword = (e) => setRepeatPassword(e.target.value);

  useEffect(() => {
    username.length &&
    password.length &&
    repeatPassword.length &&
    password === repeatPassword
      ? setDisableSubmit(false)
      : setDisableSubmit(true);
  }, [username, password, repeatPassword, errors]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);
    if (password === repeatPassword) {
      const data = await dispatch(signUp(username, password));

      if (data) {
        const errors = normalizeErrors(data);
        setErrors(errors);
      }
    }
  };

  const handleRandomUsername = (e) => {
    e.preventDefault();
    const rootUsername = "user";
    // const rootUsername = email.split("@")[0];
    // const NUM_OF_PLACEHOLDER = 4;
    const NUM_OF_PLACEHOLDER = Math.floor(Math.random() * 4 + 2);
    const randomNum = Math.floor(
      Math.random() * Math.pow(10, NUM_OF_PLACEHOLDER)
    );

    setUsername(rootUsername + randomNum);
  };

  return (
    <form onSubmit={handleSignup} className={styles.formContainer}>
      <div className={styles.signupMessage}>
        Sign up to play some retro games with others.
      </div>
      {/* <div className={styles.inputContainer}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="text"
          value={email}
          onChange={updateEmail}
          maxLength={64}
          className={hasSubmitted && styles.inputHasSubmitted}
        />
        {errors?.email ? (
          <span
            className={`material-symbols-outlined ${styles.icon} ${
              styles.error
            } ${!hasSubmitted && styles.hasNotSubmitted}`}
          >
            cancel
            <span className={styles.errorMessage}>{errors.email}</span>
          </span>
        ) : (
          <span
            className={`material-symbols-outlined ${styles.icon} ${
              !hasSubmitted && styles.hasNotSubmitted
            }`}
          >
            check_circle
          </span>
        )}
      </div>
      <div className={styles.inputContainer}>
        <label htmlFor="fullname">Full Name</label>
        <input
          id="fullname"
          name="fullname"
          placeholder="(Optional)"
          type="text"
          maxLength={30}
          value={fullName}
          onChange={updateFullName}
          className={hasSubmitted && styles.inputHasSubmitted}
        />
      </div> */}
      <div className={styles.inputContainer}>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          value={username}
          maxLength={30}
          onChange={updateUsername}
        />
        {errors?.username ? (
          <>
            <span
              onClick={handleRandomUsername}
              className={`material-symbols-outlined ${styles.replayIcon}`}
            >
              replay
            </span>
            <span
              className={`material-symbols-outlined ${styles.icon} ${
                styles.error
              } ${!hasSubmitted && styles.hasNotSubmitted}`}
            >
              cancel
              <span className={styles.errorMessage}>{errors.username}</span>
            </span>
          </>
        ) : (
          <span
            className={`material-symbols-outlined ${styles.icon} ${
              !hasSubmitted && styles.hasNotSubmitted
            }`}
          >
            check_circle
          </span>
        )}
      </div>
      <div className={styles.inputContainer}>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={updatePassword}
          maxLength={15}
          className={`${hasSubmitted && styles.inputHasSubmitted}`}
        />
        {errors?.password ? (
          <span
            className={`material-symbols-outlined ${styles.icon} ${
              styles.error
            } ${!hasSubmitted && styles.hasNotSubmitted}`}
          >
            cancel
            <span className={styles.errorMessage}>{errors.password}</span>
          </span>
        ) : (
          <span
            className={`material-symbols-outlined ${styles.icon} ${
              !hasSubmitted && styles.hasNotSubmitted
            }`}
          >
            check_circle
          </span>
        )}
      </div>
      <div className={styles.inputContainer}>
        <label htmlFor="repeatPassword">Repeat Password</label>
        <input
          id="repeatPassword"
          name="repeatPassword"
          type="password"
          value={repeatPassword}
          onChange={updateRepeatPassword}
          maxLength={15}
          className={`${hasSubmitted && styles.inputHasSubmitted}`}
        />
        {errors?.repeatPassword ? (
          <span
            className={`material-symbols-outlined ${styles.icon} ${
              styles.error
            } ${!hasSubmitted && styles.hasNotSubmitted}`}
          >
            cancel
            <span className={styles.errorMessage}>{errors.repeatPassword}</span>
          </span>
        ) : (
          <span
            className={`material-symbols-outlined ${styles.icon} ${
              !hasSubmitted && styles.hasNotSubmitted
            }`}
          >
            check_circle
          </span>
        )}
      </div>
      <button
        className={`${styles.submitButton} ${disableSubmit && styles.disabled}`}
        type="submit"
        disabled={disableSubmit}
      >
        Sign up
      </button>
    </form>
  );
};

export default SignUpForm;
