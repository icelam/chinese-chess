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
    selMoveList.add(createOption(text, value, false));
  } catch (e) {
    selMoveList.add(createOption(text, value, true));
  }
  selMoveList.scrollTop = selMoveList.scrollHeight;
};

function level_change() {
  board.millis = Math.pow(10, selLevel.selectedIndex + 1);
}

function restart_click() {
  let text = "棋局將會被重設。";
  if (!confirm(text)) {
    return;
  }

  selMoveList.options.length = 1;
  selMoveList.selectedIndex = 0;
  board.computer = 1 - selMoveMode.selectedIndex;
  board.restart(STARTUP_FEN[selHandicap.selectedIndex]);
}

function retract_click() {
  for (var i = board.pos.mvList.length; i < selMoveList.options.length; i++) {
    board.pos.makeMove(parseInt(selMoveList.options[i].value));
  }
  board.retract();
  selMoveList.options.length = board.pos.mvList.length;
  selMoveList.selectedIndex = selMoveList.options.length - 1;
}

function moveList_change() {
  console.log('???', RESULT_UNKNOWN, board.result)

  if (board.result == RESULT_UNKNOWN) {
    selMoveList.selectedIndex = selMoveList.options.length - 1;
    return;
  }
  var from = board.pos.mvList.length;
  var to = selMoveList.selectedIndex;
  if (from == to + 1) {
    console.log(1)
    return;
  }
  if (from > to + 1) {
    for (var i = to + 1; i < from; i++) {
      console.log(2)
      board.pos.undoMakeMove();
    }
  } else {
    for (var i = from; i <= to; i++) {
      console.log(3)
      board.pos.makeMove(parseInt(selMoveList.options[i].value));
    }
  }
  board.flushBoard();
}

restartButton.addEventListener('click', restart_click);
saveSettingButton.addEventListener('click', restart_click);
retractButton.addEventListener('click', retract_click);
selLevel.addEventListener('change', level_change);
chkAnimated.addEventListener('change', function() {
  board.animated = this.checked;
});
chkSound.addEventListener('change', function() {
  board.setSound(this.checked);
});
selMoveList.addEventListener('change', moveList_change);
