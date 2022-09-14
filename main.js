const pieces = new Pieces();
const board = new Board();
const gs = new GameState();
const mouse = new Mouse();
const gameLog = new GameLog();

window.addEventListener("resize", handleWindowResize, false);
function handleWindowResize() {
  H = canvas.height = innerHeight;
  W = canvas.width = innerWidth;

  unit = Math.min((H * 0.7) / 8, (W * 0.7) / 8);

  board.resize();
}

document.addEventListener("mousemove", handleMouseMove, false);
function handleMouseMove(e) {
  mouse.pos.x = e.clientX;
  mouse.pos.y = e.clientY;
  mouse.inBoard = mouse.isInBoard(board);
  if (mouse.inBoard) {
    mouse.posInBoard = mouse.getPosInBoard(board, unit);
    mouse.posIndex = mouse.getPosIndex(board);
  } else {
    mouse.posInBoard = { x: null, y: null };
    gs.pieceOn = undefined;
  }
}

document.addEventListener("mousedown", handleMouseDown, false);
async function handleMouseDown() {
  if (!mouse.inBoard) return;
  gs.iPos = mouse.posIndex;

  if (gs.pieceOn == null) return;
  if (gs.getPieceColor(gs.iPos) !== gs.playing) return;

  gs.legal = board.legal = await gs.getLegal(mouse.posIndex, pieces);
  gs.pieceGrabbed = mouse.posIndex;
  // if (((gs.posArray[gs.pieceOn]) & gs.playing) == gs.playing) {
  //   gs.posArray[gs.pieceOn] *= -1;
  //   gs.pieceGrabbed = gs.pieceOn;
  // }
}

document.addEventListener("mouseup", handleMouseUp, false);
function handleMouseUp() {
  gs.fPos = mouse.posIndex;
  // board.checks = gs.checkChecks(gs.fPos, pieces)
  if (gs.iPos == gs.fPos) {
    gs.clickmode = !gs.clickmode;
    if (gs.legal.includes(gs.fPos)) {
      const currPiece = gs.pieceGrabbed;
      if (gs.posArray[gs.fPos] !== pieces.Null) {
        gs.captured.push(gs.posArray[gs.fPos]);
        // TODO: redoing game log while talking in account captured pieces
      }
      gs.posArray[gs.fPos] = gs.posArray[currPiece];
      gs.posArray[gs.pieceGrabbed] = pieces.Null;
      gs.legal = board.legal = [];
      gs.checkedLegal = {}


      gs.playing ^= 24;
      board.pieceMoving = true;
      board.movingPiece = [currPiece, gs.fPos];
    }
    // if (gs.posArray[gs.fPos] == pieces.Null) {
    //   gs.clickmode == false;
    //   return
    // }
    return;
  }

  // if (gs.pieceGrabbed !== null && !mouse.inBoard) return gs.posArray[gs.pieceGrabbed] *= -1;
  // if (gs.pieceOn === undefined) return;
  // if (gs.pieceGrabbed === null) return;
  // const res = gs.checkLegal(mouse, pieces)
  // let isLegal, info
  // if (res) {
  //   [isLegal, info] = res
  // }

  // if (mouse.posIndex != gs.pieceGrabbed && isLegal) {

  //   if (info != "casled") {
  //     let {p, i, f} = info;
  //     gameLog.addMove(p, i, f, gs);
  //     gs.posArray[mouse.posIndex] = -gs.posArray[gs.pieceGrabbed];
  //   } else {
  //     gameLog.log.push("O-O")
  //   }

  //   if (gs.epCheck) {
  //     gs.epCheck = false;
  //   } else {
  //     gs.enPassant = null;
  //   }

  //   gs.drawchecks.splice(0, gs.drawchecks.length);

  //   gs.posArray[gs.pieceGrabbed] = 0;

  //   gs.kings.forEach(p => {
  //     const res = gs.checkChecks(p, pieces);
  //     if (!res[0]) return;
  //     console.log(res);

  //     if (res[1] == gs.playing) {
  //       gameLog.revertMove(-1, gs);
  //       gs.playing ^= 24;
  //     }
  //   })

  //   gs.playing ^= 24;
  //   console.clear();
  //   console.log(JSON.stringify(gameLog.log));
  // } else {
  //   gs.posArray[gs.pieceGrabbed] *= -1;
  //   gs.pieceGrabbed = null;
  // }
}

gs.decode("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", pieces, board);
// gs.decode("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", pieces, board);

function animation() {
  draw();
  requestAnimationFrame(animation);
}

function draw() {
  ctx.clearRect(0, 0, W, H);
  board.draw();
  // gs.drawSquares(ctx, board, unit);
}

animation();
