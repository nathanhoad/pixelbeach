const electron = require('electron');

// const SCALE_FACTOR = 2; // or 'AUTO';
// const WIDTH = 430;
// const HEIGHT = 300;

const SCALE_FACTOR = 'AUTO';
const WIDTH = 640;
const HEIGHT = 480;

const getWindowSize = () => {
  let { width, height } = electron.screen.getPrimaryDisplay().size;

  if (typeof SCALE_FACTOR === 'number') {
    width = WIDTH * SCALE_FACTOR;
    height = HEIGHT * SCALE_FACTOR;
  }

  return { width, height };
};

const getGameSize = () => {
  let { width, height } = getWindowSize();

  let factor = SCALE_FACTOR;

  if (factor === 'AUTO') {
    factor = height / HEIGHT;
    height = HEIGHT;
    // width = Math.round(width / factor);
    // hardcoded ratio for 640x480
    width = WIDTH;
  } else {
    height = height / SCALE_FACTOR;
    width = width / SCALE_FACTOR;
  }

  return {
    width,
    height,
    factor
  };
};

module.exports = { getWindowSize, getGameSize };
