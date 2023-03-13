/*
const scaleUp = keyframes({
  '0%': { transform: 'scale(1)' },
  '100%': { transform: 'scale(1.5)' },
});

const Button = styled('button', {
  '&:hover': {
    animation: `${scaleUp} 200ms`,
  },
});
*/

export default function FlyingReaction({ x, y, timestamp, value }) {
  return (
    <div
      /*
      className={`absolute select-none pointer-events-none ${
        styles.disappear
      } text-${(timestamp % 5) + 2}xl ${styles["goUp" + (timestamp % 3)]}`}
      */
      style={{ position: "absolute", left: x, top: y }}
    >
      <div className="transform -translate-x-1/2 -translate-y-1/2">{value}</div>
    </div>
  );
}
