import React from "react";

const useLongPress = (onLongPress, { onClick = () => {}, threshold = 500 }) => {
  const [longPressTriggered, setLongPressTriggered] = React.useState(false);

  const handleMouseDown = React.useCallback(
    (event) => {
      const timeoutId = setTimeout(() => {
        onLongPress(event);
        setLongPressTriggered(true);
      }, threshold);

      const handleMouseUp = () => {
        clearTimeout(timeoutId);
        if (!longPressTriggered) {
          onClick();
        }
        setLongPressTriggered(false);
      };

      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mouseup", handleMouseUp);
        clearTimeout(timeoutId);
      };
    },
    [onLongPress, onClick, threshold, longPressTriggered]
  );

  return {
    onMouseDown: handleMouseDown,
    onTouchStart: handleMouseDown,
  };
};

export default useLongPress;
