export function lerp3(start, stop, amt) {
  const x = start[0] + (stop[0] - start[0]) * amt;
  const y = start[1] + (stop[1] - start[1]) * amt;
  const z = start[2] + (stop[2] - start[2]) * amt;
  return [x, y, z];
}

export function lerp2(start, stop, amt) {
  const x = start[0] + (stop[0] - start[0]) * amt;
  const y = start[1] + (stop[1] - start[1]) * amt;
  return [x, y];
}

export function lerp(start, stop, amt) {
  return start + (stop - start) * amt;
}

export function norm(value, start, stop) {
  return (value - start) / (stop - start);
}

export function map(value, start1, stop1, start2, stop2) {
  return lerp(start2, stop2, norm(value, start1, stop1));
}

export function clamp(value, min, max) {
  return Math.max(Math.min(value, max), min);
}

export const interpolateRange = (input, output, value) => {
  let i = 0;
  for (let index = 0; index < input.length; index++) {
    if (input[index] <= value && value <= input[index + 1]) {
      i = index;
    }
  }
  return map(value, input[i], input[i + 1], output[i], output[i + 1]);
};
export function zeroPadding(NUM, LEN) {
  return (Array(LEN).join("0") + NUM).slice(-LEN);
}

export const sleep = (m) => new Promise((_) => setTimeout(_, m));

export const fadeInOut = (v) => 1 - Math.pow(Math.abs(v - 0.5) * 2, 1);

export const getTime = (seconds) => {
  let sec = Math.round(seconds);
  const min = Math.floor(sec / 60);
  sec = sec - min * 60;
  return `${zeroPadding(min, 2)}:${zeroPadding(sec, 2)}`;
};

export const getSegmentedProgress = (array, value) => {
  const ranged = interpolateRange(
    array,
    array.map((_, i) => i),
    value
  );
  const index = Math.trunc(ranged);
  const progress = parseFloat("0." + ("" + ranged).split(".")[1]);
  return { index, progress };
};
