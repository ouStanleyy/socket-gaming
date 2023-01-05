import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
// import { Redirect } from "react-router-dom";
import { login } from "../../store/session";
import styles from "./LoginForm.module.css";
import { icons } from "../NavBar/icons";

const LoginForm = ({ isLoginForm }) => {
  const [errors, setErrors] = useState([]);
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // const user = useSelector((state) => state.session.user);
  const dispatch = useDispatch();

  const onLogin = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(credential, password));
    if (data) {
      setErrors(data);
    }
  };

  const updateCredential = (e) => {
    setCredential(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  const toggleShowPassword = (e) => {
    setShowPassword((prev) => !prev);
  };

  // if (user) {
  //   return <Redirect to="/" />;
  // }

  const loginForm = (
    <div className={styles.mainContainer}>
      <div className={styles.logoContainer}>{icons["Instagram"]}</div>
      <form onSubmit={onLogin} className={styles.formContainer}>
        <div className={styles.inputContainer}>
          <span className={styles.labels}>
            Phone Number, username, or email
          </span>
          <input
            name="credential"
            type="text"
            value={credential}
            onChange={updateCredential}
          />
        </div>
        <div className={styles.inputContainer}>
          <span className={styles.labels}>Password</span>
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={updatePassword}
          />
          <span className={styles.showPassword} onClick={toggleShowPassword}>
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>
        <button className={styles.loginButton} onClick={onLogin}>
          Log in
        </button>
      </form>
    </div>
  );

  const signupForm = (
    <div className={styles.mainContainer}>
      <div className={styles.logoContainer}>{icons["Instagram"]}</div>
      <form onSubmit={onLogin} className={styles.formContainer}>
        <div className={styles.signupMessage}>
          Sign up to see photos and videos from your friends.
        </div>
        <div className={styles.inputContainer}>
          <span className={styles.labels}>Mobile Number or Email</span>
          <input
            name="credential"
            type="text"
            value={credential}
            onChange={updateCredential}
          />
        </div>
        <div className={styles.inputContainer}>
          <span className={styles.labels}>Full Name</span>
          <input
            name="credential"
            type="text"
            value={credential}
            onChange={updateCredential}
          />
        </div>
        <div className={styles.inputContainer}>
          <span className={styles.labels}>Username</span>
          <input
            name="credential"
            type="text"
            value={credential}
            onChange={updateCredential}
          />
        </div>
        <div className={styles.inputContainer}>
          <span className={styles.labels}>Password</span>
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={updatePassword}
          />
          <span className={styles.showPassword} onClick={toggleShowPassword}>
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>
        <button className={styles.loginButton} onClick={onLogin}>
          Sign up
        </button>
      </form>
    </div>
  );

  return isLoginForm ? loginForm : signupForm;
};

export default LoginForm;
