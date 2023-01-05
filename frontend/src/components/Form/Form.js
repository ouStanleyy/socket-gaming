import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import styles from "./Form.module.css";
import { icons } from "../NavBar/icons";
import { useState } from "react";

const Form = () => {
  const [isLoginForm, setIsLoginForm] = useState(true);

  const handleFormToggle = (e) => setIsLoginForm((prev) => !prev);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.topSection}>
        <div className={styles.logoContainer}>{icons["Instagram"]}</div>
        {isLoginForm ? <LoginForm /> : <SignUpForm />}
      </div>
      <div className={styles.bottomSection}>
        {isLoginForm ? "Don't have an account?" : "Have an account?"}
        <span onClick={handleFormToggle}>
          {isLoginForm ? "Sign up" : "Log in"}
        </span>
      </div>
    </div>
  );
};

export default Form;
