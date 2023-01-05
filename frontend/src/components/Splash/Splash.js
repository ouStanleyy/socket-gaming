import Iphone from "./Iphone";
import styles from "./Splash.module.css";
import Form from "../Form/Form";

const Splash = () => {
  return (
    <div className={styles.splashContainer}>
      <Iphone />
      <Form />
    </div>
  );
};

export default Splash;
