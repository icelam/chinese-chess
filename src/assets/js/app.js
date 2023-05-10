/* global BOARD_WIDTH, BOARD_HEIGHT, handleRestart, setEnableSound, setEnableAnimation */
import dialogPolyfill from 'dialog-polyfill';

// Import vendor files using raw loader configured in webpack
import bookScript from '@vendors/xiangqi-wizard-light/book';
import positionScript from '@vendors/xiangqi-wizard-light/position';
import searchScript from '@vendors/xiangqi-wizard-light/search';
import boardScript from '@vendors/xiangqi-wizard-light/board';
import cchessScript from '@vendors/xiangqi-wizard-light/cchess';
import initScript from '@vendors/xiangqi-wizard-light/init';

// Normal import
import { injectScript, debounce } from '@js/utils';

// Inject legacy libraries which has functions created under global namespace to body
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

// Force chessboard to be responsive
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

// Chessboard Settings
const chessboardSettingsButton = document.getElementById('chessboardSettingsButton');
const chessboardSettingsModal = document.getElementById('chessboardSettingsModal');
const chessboardSettingsModalOklButton = document.getElementById('chessboardSettingsModalOkButton');
const chessboardSettingsModalCancelButton = document.getElementById('chessboardSettingsModalCancelButton');

const moveModeSelect = document.getElementById('moveModeSelect');
const handicapSelect = document.getElementById('handicapSelect');
const levelSelect = document.getElementById('levelSelect');

let previousMoveModeIndex = 0;
let previousHandicapIndex = 0;
let previousLevelIndex = 0;

dialogPolyfill.registerDialog(chessboardSettingsModal);

chessboardSettingsButton.addEventListener('click', () => {
  chessboardSettingsModal.showModal();
  moveModeSelect.blur();
});

chessboardSettingsModalCancelButton.addEventListener('click', () => {
  moveModeSelect.selectedIndex = previousMoveModeIndex;
  handicapSelect.selectedIndex = previousHandicapIndex;
  levelSelect.selectedIndex = previousLevelIndex;
  chessboardSettingsModal.close();
});

chessboardSettingsModalOklButton.addEventListener('click', () => {
  previousMoveModeIndex = moveModeSelect.selectedIndex;
  previousHandicapIndex = handicapSelect.selectedIndex;
  previousLevelIndex = levelSelect.selectedIndex;
  handleRestart();
  chessboardSettingsModal.close();
});

// Effect Settings
const effectSettingsButton = document.getElementById('effectSettingsButton');
const effectSettingsModal = document.getElementById('effectSettingsModal');
const effectSettingsModalOklButton = document.getElementById('effectSettingsModalOkButton');
const effectSettingsModalCancelButton = document.getElementById('effectSettingsModalCancelButton');

const animatedCheckbox = document.getElementById('animatedCheckbox');
const soundEnabledCheckbox = document.getElementById('soundEnabledCheckbox');

let wasAnimated = true;
let wasSoundEnabled = true;

dialogPolyfill.registerDialog(effectSettingsModal);

effectSettingsButton.addEventListener('click', () => {
  effectSettingsModal.showModal();
});

effectSettingsModalCancelButton.addEventListener('click', () => {
  animatedCheckbox.checked = wasAnimated;
  soundEnabledCheckbox.checked = wasSoundEnabled;
  effectSettingsModal.close();
});

effectSettingsModalOklButton.addEventListener('click', () => {
  wasAnimated = animatedCheckbox.checked;
  wasSoundEnabled = soundEnabledCheckbox.checked;
  setEnableAnimation(animatedCheckbox.checked);
  setEnableSound(soundEnabledCheckbox.checked);
  effectSettingsModal.close();
});
