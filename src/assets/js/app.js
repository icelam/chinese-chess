/* global BOARD_WIDTH, BOARD_HEIGHT */

// Import vendor files using raw loader configured in webpack
import bookScript from '@vendors/xiangqi-wizard-light/book';
import positionScript from '@vendors/xiangqi-wizard-light/position';
import searchScript from '@vendors/xiangqi-wizard-light/search';
import boardScript from '@vendors/xiangqi-wizard-light/board';
import cchessScript from '@vendors/xiangqi-wizard-light/cchess';
import initScript from '@vendors/xiangqi-wizard-light/init';

// Normal import
import { injectScript, debounce } from '@js/utils';

[
  bookScript,
  positionScript,
  searchScript,
  searchScript,
  boardScript,
  cchessScript,
  initScript
].forEach((scriptContent) => {
  injectScript(scriptContent);
});

const resizeChessboard = () => {
  const padding = 16;
  const screenWidth = document.documentElement.clientWidth || document.body.clientWidth;
  const scale = (screenWidth - (padding * 2)) / BOARD_WIDTH;

  const responsiveContainer = document.getElementById('responsiveContainer');
  const chessboard = document.getElementById('chessboard');

  if (screenWidth < 570) {
    responsiveContainer.style.height = `${BOARD_HEIGHT * scale}px`;
    responsiveContainer.style.width = `${BOARD_WIDTH * scale}px`;
    chessboard.style.transform = `scale(${scale})`;
  } else {
    responsiveContainer.style.height = `${BOARD_HEIGHT}px`;
    responsiveContainer.style.width = `${BOARD_WIDTH}px`;
    chessboard.style.transform = 'scale(1)';
  }
};

window.addEventListener('resize', debounce(resizeChessboard, 250));
resizeChessboard();
