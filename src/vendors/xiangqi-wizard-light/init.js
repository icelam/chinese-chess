var STARTUP_FEN = [
  "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w",
  "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKAB1R w",
  "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/R1BAKAB1R w",
  "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/9/1C5C1/9/RN2K2NR w",
];

function createOption(text, value, ie8) {
  var opt = document.createElement("option");
  opt.selected = true;
  opt.value = value;
  if (ie8) {
    opt.text = text;
  } else {
    opt.innerHTML = text.replace(/ /g, "&nbsp;");
  }
  return opt;
}

var container = document.getElementById("chessboard");

var board = new Board(container, "vendors/xiangqi-wizard-light/images/", "vendors/xiangqi-wizard-light/sounds/");
board.setSearch(16);
board.millis = 10;
board.computer = 1;
board.onAddMove = function () {
  var counter = (board.pos.mvList.length >> 1);
  var space = (counter > 99 ? "    " : "   ");
  counter = (counter > 9 ? "" : " ") + counter + ".";
  var text = (board.pos.sdPlayer == 0 ? space : counter) + move2Iccs(board.mvLast);
  var value = "" + board.mvLast;
  try {
    moveListSelect.add(createOption(text, value, false));
  } catch (e) {
    moveListSelect.add(createOption(text, value, true));
  }
  moveListSelect.scrollTop = moveListSelect.scrollHeight;
};

function handleLevelChange() {
  board.millis = Math.pow(10, levelSelect.selectedIndex + 1);
}

function handleRestart() {
  moveListSelect.options.length = 1;
  moveListSelect.selectedIndex = 0;
  board.computer = 1 - moveModeSelect.selectedIndex;
  board.restart(STARTUP_FEN[handicapSelect.selectedIndex]);
  board.millis = Math.pow(10, levelSelect.selectedIndex + 1);
  currentLevel.innerHTML = "電腦水平：" + ["入門", "業餘", "專業"][levelSelect.selectedIndex];
}

function handleRetract() {
  for (var i = board.pos.mvList.length; i < moveListSelect.options.length; i++) {
    board.pos.makeMove(parseInt(moveListSelect.options[i].value));
  }
  board.retract();
  moveListSelect.options.length = board.pos.mvList.length;
  moveListSelect.selectedIndex = moveListSelect.options.length - 1;
}

function onMoveListChange() {
  if (board.result == RESULT_UNKNOWN) {
    moveListSelect.selectedIndex = moveListSelect.options.length - 1;
    return;
  }
  var from = board.pos.mvList.length;
  var to = moveListSelect.selectedIndex;
  if (from == to + 1) {
    return;
  }
  if (from > to + 1) {
    for (var i = to + 1; i < from; i++) {
      board.pos.undoMakeMove();
    }
  } else {
    for (var i = from; i <= to; i++) {
      board.pos.makeMove(parseInt(moveListSelect.options[i].value));
    }
  }
  board.flushBoard();
}

function setEnableAnimation(value) {
  board.animated = value;
}

function setEnableSound(value) {
  board.setSound(value);
}

restartButton.addEventListener('click', () => {
  if (confirm("棋局將會被重設。")) {
    handleRestart();
  }
});
retractButton.addEventListener('click', handleRetract);
moveListSelect.addEventListener('change', onMoveListChange);
