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

  board.legal = gs.legal = await gs.getLegal(mouse.posIndex, pieces);
  gs.pieceGrabbed = mouse.posIndex;
}

document.addEventListener("mouseup", handleMouseUp, false);
function handleMouseUp() {
  gs.fPos = mouse.posIndex;
  if (gs.iPos == gs.fPos) {
    gs.clickmode = !gs.clickmode;
    if (gs.legal.includes(gs.fPos)) {
      const currPiece = gs.pieceGrabbed;
      if (
        gs.posArray[gs.fPos] !== pieces.Null &&
        getPieceColor(gs.fPos) !== gs.getPieceColor(gs.pieceGrabbed)
      ) {
        gs.captured.push(gs.posArray[gs.fPos]);
        // TODO: redoing game log while talking in account captured pieces
      }
      ifKing: if (gs.isK) {
        let delta = gs.fPos-gs.pieceGrabbed;
        if (Math.abs(delta) !== 2) break ifKing

        const r = gs.pieceGrabbed + (delta < 0 ? -4: 3)
        const newPos = gs.fPos - Math.sign(delta)
        
        gs.posArray[newPos] = gs.posArray[r];
        gs.posArray[r] = pieces.Null;
      }
      gs.posArray[gs.fPos] = gs.posArray[currPiece];
      gs.posArray[gs.pieceGrabbed] = pieces.Null;
      gs.legal = board.legal = [];
      gs.checkedLegal = {};

      gs.playing ^= 24;
      board.pieceMoving = true;
      board.movingPiece = [currPiece, gs.fPos];
    }

    return;
  }
}

// gs.decode("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", pieces, board);
gs.decode("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/R3KBNR w KQkq - 0 1", pieces, board);


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
