// Custom Hook by Dan Abramov
import { useEffect, useRef } from "react";

const useInterval = (callback, delay, gameOver) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!gameOver) {
      const interval = setInterval(() => savedCallback.current(), delay);
      return () => clearInterval(interval);
    }
  }, [gameOver, delay]);
};

export default useInterval;
