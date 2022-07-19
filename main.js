const pieces = new Pieces();
const board = new Board();
const gameState = new GameState();
const mouse = new Mouse();


window.addEventListener("resize", handleWindowResize, false);
function handleWindowResize() {
  H = canvas.height = innerHeight;
  W = canvas.width = innerWidth;

  unit = Math.min(H*0.7/8, W*0.7/8);

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
    mouse.posInBoard = {x: null, y: null};
    gameState.pieceOn = undefined;
  }
}

document.addEventListener("mousedown", handleMouseDown, false);
function handleMouseDown() {
  if (!mouse.inBoard || gameState.pieceOn == null) return;

  if (((gameState.posArray[gameState.pieceOn]) & gameState.playing) == gameState.playing) {
    gameState.posArray[gameState.pieceOn] *= -1;
    gameState.pieceGrabbed = gameState.pieceOn;
  }
}

document.addEventListener("mouseup", handleMouseUp, false);
function handleMouseUp() {
  if (gameState.pieceGrabbed !== null && !mouse.inBoard) return gameState.posArray[gameState.pieceGrabbed] *= -1;
  if (gameState.pieceOn === undefined) return;
  if (gameState.pieceGrabbed === null) return;
  const isLegal = gameState.checkLegal()
  if (mouse.posIndex != gameState.pieceGrabbed && isLegal) {
    if (isLegal != "casled") {
      gameState.posArray[mouse.posIndex] = -gameState.posArray[gameState.pieceGrabbed];
    }
    // if (isLegal == pieces.King) {
    //   gameState.checkChecks(mouse.posIndex);
    // }
    
    gameState.posArray[gameState.pieceGrabbed] = 0;
    gameState.playing ^= 24;
    if (gameState.epCheck) {
      gameState.epCheck = false;
    } else {
      gameState.enPassant = null;
    }

    gameState.drawchecks.splice(0, gameState.drawchecks.length);
    gameState.kings.forEach(p => {
      gameState.checkChecks(p);
    })
  } else {
    gameState.posArray[gameState.pieceGrabbed] *= -1;
    gameState.pieceGrabbed = null;
  }
}


gameState.decode("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", pieces, board);

function animation() {
  draw();
  requestAnimationFrame(animation);
}

function draw() {
  ctx.clearRect(0, 0, W, H);
  board.draw();
  gameState.drawSquares()
}

animation();