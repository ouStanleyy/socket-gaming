import { iphone } from "./images";
import { useState, useEffect } from "react";
import {
  screenshot1,
  screenshot2,
  screenshot3,
  screenshot4,
} from "./images/index";
import styles from "./Iphone.module.css";

const Iphone = () => {
  const screenhots = [screenshot1, screenshot2, screenshot3, screenshot4];
  const [imageIdx, setImageIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIdx((prev) => prev + 1);
      if (imageIdx >= screenhots.length - 1) setImageIdx(0);
    }, 2000);

    return () => clearInterval(interval);
  });

  return (
    <div className={styles.iphoneContainer}>
      <div className={styles.screenshotContainer}>
        <img src={screenhots[imageIdx]} alt="text messages" />
      </div>
      <img src={iphone} alt="iphone" />
    </div>
  );
};

export default Iphone;
