import { useState, useEffect, useRef } from "react";

const useIdle = (delay) => {
  const [isIdle, setIsIdle] = useState(false);

  const timeoutId = useRef();

  const setup = () => {
    window.addEventListener("mousemove", resetTimer, false);
    window.addEventListener("mousedown", resetTimer, false);
  };

  const cleanUp = () => {
    window.removeEventListener("mousemove", resetTimer);
    window.removeEventListener("mousedown", resetTimer);

    clearTimeout(timeoutId.current);
  };

  useEffect(() => {
    setup();
    return () => {
      cleanUp();
    };
  }, []);

  const startTimer = () => {
    timeoutId.current = setTimeout(goInactive, delay);
  };

  const resetTimer = () => {
    clearTimeout(timeoutId.current);
    goActive();
  };

  const goInactive = () => {
    //console.log("true");
    setIsIdle(true);
  };

  const goActive = () => {
    setIsIdle(false);
    startTimer();
  };

  return isIdle;
};

export default useIdle;
